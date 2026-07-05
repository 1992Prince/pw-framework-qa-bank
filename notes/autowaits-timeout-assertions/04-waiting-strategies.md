# Playwright Waiting Strategies — Complete Organized Notes

---

## 0. Why Waits Matter — Selenium vs Playwright

In Selenium, nothing happens automatically — every wait had to be written explicitly:

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
driver.findElement(By.id("submit")).click();
```

Playwright builds retry-based waiting into almost every API. `click()`, `fill()`, `hover()`,
`expect()` — all of them poll the DOM internally until the element/condition is ready, or a
timeout is hit. This is why Playwright tests are far less flaky than Selenium tests by default.

**But auto-wait is not magic for everything.** It only waits for *actionability* of an element
(is it there, visible, stable, enabled, clickable). It does **not** know about:

- Business logic timers (OTP expiry, rate-limit windows)
- Full network idle state after a click (unless you explicitly wait for it)
- Third-party API responses that don't change the DOM in an obvious way
- Custom JS/app state (e.g., `window.appReady`)
- Browser-level events (new tab, download, dialog)

That's why Playwright gives you 5 categories of explicit waiting **on top of** auto-wait,
for exactly these gaps.

---

## 1. The 5 Categories of Waits in Playwright

| # | Category                                        | Examples                                                                                                             |
| - | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1 | **Auto-wait (built-in)**                  | `click()`, `fill()`, `hover()`, `check()`                                                                    |
| 2 | **Hard wait (static)**                    | `page.waitForTimeout()`                                                                                            |
| 3 | **Locator-level waits**                   | `locator.waitFor()`                                                                                                |
| 4 | **Assertion-level (web-first) waits**     | `expect(locator).toBeVisible()` etc.                                                                               |
| 5 | **Page / Navigation / Event-level waits** | `waitForURL`, `waitForLoadState`, `waitForResponse`, `waitForRequest`, `waitForFunction`, `waitForEvent` |

---

## 2. Auto-Wait (Built-in Actionability Engine)

### Purpose

Every action method (`click`, `fill`, `hover`, `check`, etc.) automatically waits for the
target element to become **actionable** before performing the action — no explicit wait
code required.

### How it Works Internally

```
Action called (e.g., click())
   ↓
1. Resolve locator → exactly 1 matching element found in DOM
   ↓
2. Run actionability checks (AVSER)
   ↓
3. Checks pass → execute action → done
   ↓
4. Checks fail → wait ~100ms → retry from step 1
   ↓
5. Timeout exceeded → throw TimeoutError
```

> Locators are **lazy** — they re-resolve against the live DOM every retry. This is why
> Playwright never throws Selenium's `StaleElementReferenceException`.

### AVSER — 5 Actionability Checks

| Check                     | Meaning                                                                                 | Notes                                                                |
| ------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **A**ttached        | Element exists in the DOM tree                                                          | `display:none` elements are still "attached"                       |
| **V**isible         | Non-empty bounding box, not hidden via CSS                                              | `visibility:hidden`, `opacity:0`, `display:none` all fail this |
| **S**table          | Same bounding box across 2 consecutive animation frames                                 | Waits out CSS transitions, slide-ins, carousels                      |
| **E**nabled         | Not disabled (form elements only)                                                       | Applies to`input`, `button`, `select`, `textarea`            |
| **R**eceives Events | Element (not something on top of it) will actually receive the click at that coordinate | The smartest check — catches overlay/spinner-on-top bugs            |

### Which Checks Apply to Which Action

| Action                               | Attached | Visible | Stable | Enabled | Receives Events                   |
| ------------------------------------ | -------- | ------- | ------ | ------- | --------------------------------- |
| `click()`                          | ✅       | ✅      | ✅     | ✅      | ✅                                |
| `fill()`                           | ✅       | ✅      | —     | ✅      | —                                |
| `hover()`                          | ✅       | ✅      | ✅     | —      | ✅                                |
| `check()`                          | ✅       | ✅      | ✅     | ✅      | ✅                                |
| `screenshot()`                     | ✅       | ✅      | ✅     | —      | —                                |
| `isVisible()` / `getAttribute()` | —       | —      | —     | —      | — (instant snapshot, no waiting) |

### Syntax

```typescript
await page.locator('#submit-btn').click();               // fully auto-waited
await page.locator('#email').fill('test@example.com');
await page.locator('#slow-btn').click({ timeout: 10000 }); // per-call override
```

### Default Timeout

`0` → meaning "no independent limit", it inherits the **test timeout** (default 30000ms).
Can be set globally via `use.actionTimeout`.

```typescript
export default defineConfig({
  timeout: 30000,          // test timeout
  use: { actionTimeout: 0 } // 0 = inherit test timeout
});
```

> **Rule:** `actionTimeout` must always be **less than** the test `timeout`, otherwise the
> test will end before the action's own timeout is reached.

---

## 3. Hard Wait — `page.waitForTimeout(ms)`

### Purpose

An unconditional, "dumb" sleep. Playwright pauses execution for exactly the given
milliseconds — no matter whether the element is ready in 1s or 60s.

### Syntax

```typescript
await page.waitForTimeout(30000); // waits exactly 30s, no intelligence
```

### When It's Legitimately OK

```typescript
// 1. Timer-based app state (OTP expiry, grace period)
await page.waitForTimeout(30000);

// 2. Rate-limit testing — deliberately wait out a throttle window
await page.click('#submit');
await page.waitForTimeout(60000);
await page.click('#submit');

// 3. Local/manual debugging — visually watch what's happening
await page.waitForTimeout(3000);
```

### Why to Avoid in CI/Production

- Wastes time on fast machines, still fails on slow ones.
- Almost always replaceable by a dynamic wait:

```typescript
// BAD
await page.waitForTimeout(3000);
await page.locator('#result').click();

// GOOD
await page.locator('#result').click(); // auto-waits itself
```

> **Rule of thumb:** if you see `waitForTimeout` in test code, treat it as a **code smell**.

---

## 4. Locator-Level Waits

### 4a. Action methods (auto-wait) — covered in Section 2.

### 4b. `locator.waitFor()` — Explicit State Wait

#### Purpose

Wait for a specific state of an element **without** performing an action on it. Useful when
the wait and the action are two logically separate steps (e.g., wait for spinner to
disappear, then click something else).

#### Syntax

```typescript
await locator.waitFor({
  state: 'visible' | 'hidden' | 'attached' | 'detached', // default: 'visible'
  timeout: number // optional, default: 0 → inherits test timeout
});
```

#### The 4 States

| State                 | Meaning                                | Typical Use Case                                                 |
| --------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `visible` (default) | Element is on-screen                   | Wait for success toast/message to appear                         |
| `hidden`            | Element in DOM but not visible         | **Most common** — wait for a loading spinner to disappear |
| `attached`          | Element exists in DOM (visible or not) | Wait for async React/Angular component to mount                  |
| `detached`          | Element fully removed from DOM         | Wait for a modal/dialog to fully close                           |

```typescript
await page.locator('.loading-spinner').waitFor({ state: 'hidden' });
await page.locator('#data-table').click(); // now safe to interact

await page.locator('#confirmation-modal').waitFor({ state: 'detached' });
await page.locator('#main-content').click();
```

#### When NOT to Use It

```typescript
// BAD — unnecessary extra step, click() already waits for visible
await page.locator('#submit').waitFor({ state: 'visible' });
await page.locator('#submit').click();

// GOOD
await page.locator('#submit').click();
```

> `locator.waitFor()` is the modern replacement for the older, page-level
> `page.waitForSelector()` (still exists but locator-based waiting is preferred today).

---

## 5. Assertion-Level Waits — `expect()` (Web-First Assertions)

### Purpose

Unlike a one-shot Selenium-style assertion, Playwright's `expect()` on a locator **retries**
the condition automatically until it becomes true or the timeout is hit — it does not fail
on the first check.

### Syntax

```typescript
await expect(page.locator('h1')).toBeVisible();
await expect(page.locator('#result')).toContainText('Success');
await expect(page.locator('#submit')).toBeDisabled();
await expect(page.locator('.error')).toHaveText('Invalid email');
await expect(page).toHaveURL('**/dashboard');
await expect(page).toHaveTitle('Dashboard');
```

> **`await` rule:** Locator-based `expect(locator)...` calls need `await` since they retry
> asynchronously. Page-level checks like `expect(page).toHaveTitle()` are commonly awaited
> too — always `await` any Playwright assertion to be safe.

### Default Timeout

`5000ms` (5 seconds) — much shorter than the action/test timeout, since assertions are
usually checking something that should already be near-ready.

### Timeout Override — 3 Levels (highest → lowest priority)

```typescript
// 1. Per-assertion (highest priority)
await expect(page.locator('#slow-element')).toBeVisible({ timeout: 15000 });

// 2. Project-level
export default defineConfig({
  projects: [{ name: 'chromium', expect: { timeout: 10000 }, use: {...} }]
});

// 3. Global level
export default defineConfig({
  expect: { timeout: 10000 }
});
```

---

## 6. Page-Level / Navigation-Level / Event-Level Waits

### 6a. `page.waitForURL()` — URL Match Wait

**Purpose:** Verify navigation landed on the expected URL (login redirects, SPA routing).

```typescript
await page.waitForURL('https://app.example.com/dashboard'); // exact string
await page.waitForURL('**/dashboard');                        // glob (most common)
await page.waitForURL(/.*\/dashboard.*/);                     // regex
await page.waitForURL(url => url.searchParams.get('status') === 'success'); // predicate
await page.waitForURL('**/home', { timeout: 15000 });
```

- **Default timeout:** `navigationTimeout` (default `0` → inherits test timeout).
- **Config:** `use.navigationTimeout`.

---

### 6b. `page.waitForLoadState()` — Page Load Condition Wait

**Purpose:** Wait for a specific load condition after navigation or reload.

```typescript
await page.waitForLoadState('domcontentloaded' | 'load' | 'networkidle');
```

| State                | Meaning                                                  | When to Use                                          |
| -------------------- | -------------------------------------------------------- | ---------------------------------------------------- |
| `domcontentloaded` | HTML parsed, DOM elements ready; resources still loading | Fastest option, when you don't need images/CSS ready |
| `load` (default)   | Everything loaded — images, CSS, JS                     | Standard, default behavior of`page.goto()`         |
| `networkidle`      | No network requests for 500ms                            | SPAs waiting for AJAX calls to settle                |

```typescript
await page.goto('https://example.com');          // 'load' happens automatically
await page.click('#go-dashboard');
await page.waitForLoadState('domcontentloaded');  // fast, explicit
```

⚠️ **Avoid `networkidle` in enterprise apps** with background polling (analytics pings,
websocket heartbeats, health checks) — it may never fire and the test will time out.

```typescript
// BETTER alternative to networkidle:
await page.click('#navigate-btn');
await page.locator('h1.dashboard-title').waitFor({ state: 'visible' });
```

- **Default timeout:** `navigationTimeout` (default `0` → inherits test timeout).

---

### 6c. `page.waitForResponse()` / `page.waitForRequest()` — Network Interception

**Purpose:** Capture/verify a specific API response or outgoing request (API contract
testing, payload verification).

#### Critical Pattern: `Promise.all()` is mandatory

```typescript
// WRONG — race condition: response may already have arrived before you start waiting
await page.click('#fetch-data');
const res = await page.waitForResponse('/api/users');

// CORRECT — register the listener BEFORE triggering the action
const [response] = await Promise.all([
  page.waitForResponse('/api/users'),
  page.click('#fetch-data')
]);
```

```typescript
// waitForResponse — URL string, predicate, or glob
const [res] = await Promise.all([
  page.waitForResponse(r => r.url().includes('/api/login') && r.status() === 200),
  page.click('#login-btn')
]);
const data = await res.json();

// waitForRequest — inspect outgoing payload
const [request] = await Promise.all([
  page.waitForRequest(req => req.url().includes('/api/submit')),
  page.click('#submit-form')
]);
console.log(request.method(), request.postData());
```

- **Default timeout:** `30000ms` — **hardcoded**, NOT tied to `navigationTimeout`.
- Override: `{ timeout: ms }` per call.

---

### 6d. `page.waitForFunction()` — Custom JS Condition

**Purpose:** When built-in waits aren't enough — poll a custom JS condition in the browser
context until it returns truthy. Good for window/global variables, custom app state,
third-party library readiness.

```typescript
await page.waitForFunction(
  pageFunction,   // runs inside the browser
  arg?,           // optional value passed from Node → browser
  { polling?: number | 'raf', timeout?: number }
);
```

```typescript
// Wait for a counter to reach a value
await page.waitForFunction(() => document.querySelector('#counter')?.textContent === '100');

// Wait for a global app-ready flag
await page.waitForFunction(() => window.appReady === true);

// Pass a Node value into the browser check
const expectedCount = 5;
await page.waitForFunction(
  (count) => document.querySelectorAll('.item').length >= count,
  expectedCount
);

// Custom polling interval
await page.waitForFunction(() => window.dataLoaded === true, undefined, { polling: 500, timeout: 20000 });
```

- **Default timeout:** test timeout (no independent default).
- **Default polling:** `'raf'` (requestAnimationFrame, ~16ms).

---

### 6e. `page.waitForEvent()` — Browser-Level Event Wait

**Purpose:** Wait for browser-context events — new tab/popup, file download, dialogs
(alert/confirm/prompt), frame navigation. These are **not** DOM events.

```typescript
await page.waitForEvent('eventName', { timeout?: number });
await context.waitForEvent('page'); // e.g. for a new tab, at context level
```

```typescript
// New tab / popup
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('#open-new-tab-btn')
]);
await newPage.waitForLoadState();

// File download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#export-csv-btn')
]);
const filePath = await download.path();

// Dialog (alert/confirm/prompt)
page.once('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept(); // or dialog.dismiss(), or dialog.fill('text') for prompts
});
await page.click('#delete-account-btn');

// Frame navigation
const [frame] = await Promise.all([
  page.waitForEvent('framenavigated'),
  page.click('#load-iframe-content')
]);
```

- **Default timeout:** `30000ms` — **hardcoded**, not tied to `navigationTimeout`.

---

## 7. Quick Reference — Default Timeouts at a Glance

| Method / Type                              | Default Timeout         | Config Setting                      | Override at Call        |
| ------------------------------------------ | ----------------------- | ----------------------------------- | ----------------------- |
| Action methods (`click`, `fill`, etc.) | `0` (= test timeout)  | `use.actionTimeout`               | `{ timeout: ms }`     |
| `locator.waitFor()`                      | `0` (= test timeout)  | `use.actionTimeout`               | `{ timeout: ms }`     |
| `expect()` assertions                    | `5000ms`              | `expect.timeout` (global/project) | `{ timeout: ms }`     |
| `page.waitForURL()`                      | `0` (= test timeout)  | `use.navigationTimeout`           | `{ timeout: ms }`     |
| `page.waitForLoadState()`                | `0` (= test timeout)  | `use.navigationTimeout`           | `{ timeout: ms }`     |
| `page.waitForResponse()`                 | `30000ms` (hardcoded) | —                                  | `{ timeout: ms }`     |
| `page.waitForRequest()`                  | `30000ms` (hardcoded) | —                                  | `{ timeout: ms }`     |
| `page.waitForFunction()`                 | test timeout            | —                                  | `{ timeout: ms }`     |
| `page.waitForEvent()`                    | `30000ms` (hardcoded) | —                                  | `{ timeout: ms }`     |
| Test timeout                               | `30000ms`             | `timeout` (root config)           | `test.setTimeout(ms)` |

### Timeout Priority Order (highest → lowest)

**ATUG rule:** Action-level `{ timeout }` → `test.setTimeout()` → `use{}` config → Global default

### Recommended Config — Enterprise Apps

```typescript
export default defineConfig({
  timeout: 60000,              // per test: 60s
  expect: { timeout: 10000 },  // assertions: 10s
  use: {
    actionTimeout: 15000,      // actions: 15s (must be < test timeout)
    navigationTimeout: 30000,  // navigation: 30s
  }
});
```

---

## 8. Interview Questions & Scenario-Based Questions

### Conceptual

**Q1. What is auto-wait in Playwright, and how is it different from Selenium's implicit wait?**

> Auto-wait runs a retry loop (~100ms interval) before every action, checking actionability
> (AVSER) until the element is ready or the timeout expires. Selenium's implicit wait only
> checks element *presence* in the DOM, not visibility/stability/enabled/hit-testing, and it
> applies globally and unpredictably across all `findElement` calls, unlike Playwright's
> per-action scoped retry.

**Q2. What are the 5 actionability checks (AVSER) Playwright performs before a click?**

> Attached, Visible, Stable, Enabled, Receives Events — see Section 2.

**Q3. Why doesn't Playwright throw `StaleElementReferenceException` like Selenium does?**

> Locators are lazy and re-resolve against the live DOM on every retry attempt instead of
> holding a reference to a specific DOM node snapshot.

**Q4. What's the difference between `locator.waitFor({state:'attached'})` and
`{state:'visible'}`?**

> `attached` only requires DOM presence — the element could still be hidden via CSS.
> `visible` additionally requires a non-zero bounding box and no hiding CSS properties.

**Q5. Why is `expect()` in Playwright called a "web-first assertion"?**

> Because it doesn't fail immediately on a false condition — it retries the check
> automatically (default every ~poll interval) up to its timeout (default 5s), which
> matches how dynamic web UIs actually update.

**Q6. When would you use `page.waitForFunction()` instead of `locator.waitFor()`?**

> When the condition isn't about a single element's actionable state but about arbitrary
> JS/browser state — e.g., a global variable, a computed value, a third-party SDK's
> readiness flag, or a condition spanning multiple elements.

**Q7. Why must you wrap `waitForResponse`/`waitForEvent` in `Promise.all()` with the
triggering action?**

> Because `waitForResponse`/`waitForEvent` are listeners — if you `await` the click first,
> the response/event may fire and complete *before* the listener is registered, causing the
> wait to hang or miss the event (a race condition).

**Q8. Why is `networkidle` risky in real enterprise applications?**

> Apps with background polling (analytics beacons, websocket heartbeats, health-check pings)
> never reach a true "500ms with zero requests" state, so `networkidle` can hang until
> timeout. A targeted element-visibility wait is safer.

**Q9. What's the default timeout hierarchy if you set both `actionTimeout: 60000` and
test `timeout: 30000`?**

> The test itself will fail/stop at 30s regardless — the test-level timeout is a hard
> ceiling, so the action never gets to use its full 60s. `actionTimeout` should always be
> set lower than the overall test `timeout`.

**Q10. What's the difference between `page.waitForSelector()` and `locator.waitFor()`?**

> `waitForSelector` is the older, page-level API (still supported) returning an
> `ElementHandle`. `locator.waitFor()` is the modern, locator-based equivalent and is the
> recommended approach today since it integrates with Playwright's auto-retrying locator
> model instead of a static handle.

---

### Scenario-Based

**S1. You click a button and a spinner appears, then disappears, then a success message
shows. How do you handle this without a hard wait?**

```typescript
await page.locator('#submit').click();
await page.locator('.loading-spinner').waitFor({ state: 'visible' }); // optional confirm it started
await page.locator('.loading-spinner').waitFor({ state: 'hidden' });  // wait for it to finish
await expect(page.locator('.success-message')).toBeVisible();
```

> Key idea: wait for **state transitions**, not fixed time. Tune timeouts per expected
> duration (e.g., short timeout if spinner should vanish quickly, longer if it's a heavy
> operation).

**S2. An element is visible on screen but `click()` keeps timing out. What's likely wrong,
and how do you debug it?**

> Most likely the **Receives Events** check is failing — something (an overlay, a spinner,
> a transparent modal backdrop) is sitting on top of the element at that coordinate.
> Debug with `document.elementFromPoint(x, y)` in DevTools to see what's actually
> intercepting the click, or use Playwright's trace viewer to see the actionability log.

**S3. A test needs to verify that clicking "Export" triggers a CSV download. Write the
wait pattern.**

```typescript
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.click('#export-csv-btn')
]);
const path = await download.path();
```

**S4. You need to verify an API call fires with the correct payload when a form is
submitted, and that the response status is 200.**

```typescript
const [request, response] = await Promise.all([
  page.waitForRequest(req => req.url().includes('/api/submit')),
  page.waitForResponse(res => res.url().includes('/api/submit') && res.status() === 200),
  page.click('#submit-form')
]);
console.log(request.postData());
```

**S5. Your test suite runs fine locally but is flaky in CI, especially around a
multi-step form where the "Next" button is disabled until a field is filled. How do you
make it robust?**

```typescript
await page.locator('#email').fill('test@test.com');
await page.locator('#next-btn').click(); // Enabled check is part of auto-wait — no extra code needed
```

> No hard wait needed — the `Enabled` actionability check already waits for the button to
> become clickable once auto-wait detects the state change caused by filling the field.

**S6. A React SPA takes a few seconds to mount a component after a route change. How do you
wait for it reliably?**

```typescript
await page.click('#go-to-profile');
await page.locator('#user-profile').waitFor({ state: 'attached' }); // component mounted
await expect(page.locator('#user-profile')).toBeVisible();          // then confirm rendered
```

**S7. You need to test app behavior right at an OTP's 30-second expiry boundary. Is a hard
wait acceptable here?**

> Yes — this is one of the few legitimate uses of `page.waitForTimeout(30000)`, since the
> wait is driven by a fixed business-timer, not a UI/DOM state Playwright can observe or
> retry against.

**S8. A test clicking a link opens a new browser tab. How do you switch context to the new
tab and assert on it?**

```typescript
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('#open-new-tab-link')
]);
await newPage.waitForLoadState();
await expect(newPage.locator('h1')).toHaveText('Welcome');
```

**S9. Test timeout is hit even though the element you're waiting on appears within 45
seconds, and your config has `timeout: 30000`. What are your options?**

- Increase the global test timeout in `playwright.config.ts` (`timeout: 60000`), or
- Increase it for just this test: `test.setTimeout(70000)`, or
- If only the action's own wait needs to be longer (and test timeout already allows it),
  override at the call: `await locator.click({ timeout: 45000 })`.

**S10. How do you make actions timeout faster than the test timeout, globally, without
touching every single action call?**

```typescript
page.setDefaultTimeout(30000); // caps all action/locator waits at 30s
// test.setTimeout(70000) still allows the overall test up to 70s
```

> Individual calls can still override this via `{ timeout: ms }` per action.
