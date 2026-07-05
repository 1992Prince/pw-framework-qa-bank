## 1. `test.only()`

Jab spec file me multiple tests hon aur sirf ek run karna ho (debugging). **Never push to remote** — agar CI config me `forbidOnly: true` set hai (usually `process.env.CI` check ke through), toh CI run **error de dega / fail ho jayega** (sirf skip nahi hoga, poora run reject hota hai) taaki koi galti se `.only()` push na kar de.

```
// playwright.config.ts
forbidOnly: !!process.env.CI
```

## 2. `test.skip()`

Test execute hi nahi hoga — chahe local ho ya CI, chahe `--project` se run karo ya `--grep` tag command se, skip marked test **hamesha skip hi rahega**, report me "skipped" section me dikhega. Use case: script maintenance chal rahi hai but regression bhi run karni hai — baaki sab chale, broken wale skip kar do. Fix hone ke baad annotation hata do.

## 3. `test.fixme()`

Same effect as skip (test run nahi hota) — **local ya CI, `--project` command se bhi ye bypass nahi hota**, kyunki ye Playwright-level annotation hai, command-line project selection sirf ye decide karta hai *kaunsa* project/browser config use ho, annotation ko override nahi karta. Difference from `skip`: `fixme` semantically bolta hai "yeh humari taraf se broken hai / maintenance chahiye" (script issue), jabki `skip` generic hai (kisi bhi reason se skip). Real use: flow change ho gaya, locator/script break ho gaya — mark `fixme`, baad me fix karke hatao.

## 4. `test.slow()`

Test ka **timeout 3x** kar deta hai (default 30s → 90s). Ye **app ko slow nahi karta** — app apni speed pe chalta rehta hai. Ye sirf Playwright ko zyada **patience** deta hai us particular test ke liye, matlab Playwright apna internal "test timeout exceeded" error jaldi nahi degi. Use case: jab locally execution fast dikh raha ho lekin CI/slow machine pe zyada time lag sakta ho, ya genuinely heavy operation ho (upload, report generation).

```
test('heavy report gen', async ({ page }) => {
  test.slow(); // ya test.slow(condition, reason) bhi ho sakta hai
});
```

(Manually bhi time de sakte ho: `test.setTimeout(90000)` — same tarah kaam karta hai per-test.)

### Timeout levels — quick recap

Test execution timeout alag-alag levels pe set ho sakta hai (most specific jeetega):

```
// 1. Global (config root)
timeout: 30000

// 2. Project level
projects: [{ name: 'slow-env', timeout: 60000 }]

// 3. describe block level
test.describe('heavy flows', () => {
  test.setTimeout(90000);
});

// 4. Individual test level
test('one heavy test', async ({ page }) => {
  test.setTimeout(90000);
});
```

Ab suppose tumne config ya project ya describe level pe already **custom timeout 90s** set ki hai. Phir bhi ek test aur zyada time le raha hai — toh `test.slow()` use karo:

- Default 30s + `test.slow()` → **90s** (3x)
- Custom 90s + `test.slow()` → **270s** (3x of whatever is current)

**`test.slow()` kisi bhi level ka current timeout 3x kar deta hai** — woh 30s ho ya 90s ya kuch aur.

**Ye app ko slow nahi karta** — app apni hi speed pe chalta hai. Sirf Playwright ka "test timeout exceeded" error zyada late aata hai, taaki genuinely slow test bhi complete ho sake without false failure.

**Mostly CI ke liye used hota hai** — local machine pe tests fast run hote hain (good hardware, fast network), but CI runners pe kabhi kabhi infra/network latency ki wajah se same test zyada time leta hai. `test.slow()` aise specific tests ke liye CI pe false timeout failures rokta hai bina globally sab tests ka timeout badhaye.

## 5. `test.step()`

Ye pass/fail/skip control nahi karta — sirf **reporting/trace granularity** ke liye hai. Test ke andar logical steps ko wrap karta hai taaki trace viewer/HTML report me clearly dikhe kaunsa step chala.

```
await test.step('Login', async () => {
  await page.fill('#user', 'abc');
  await page.click('#submit');
});
```

## 6. `test.use()`

Fixture/context options ko **override** karta hai for a test file ya describe block — jaise specific browser settings (viewport, locale, storageState, geolocation).

```
test.use({ viewport: { width: 375, height: 667 } });
```

## 7. `test.fail()`

Test run hoga, expected outcome = FAIL. Pass ho gaya toh report me ❌ (unexpected pass), fail hua toh ✅ (expected fail) — bug tracking ke liye.

## 8. `test.describe()`

Related tests group karta hai + scoped hooks.

## 9. `test.describe.skip()` / `test.describe.only()`

Group-level version of skip/only — poora describe block skip ya sirf wahi group run.

## 10. Hooks (annotation nahi, but related lifecycle methods)

`beforeAll()`, `afterAll()`, `beforeEach()`, `afterEach()` — ye annotations nahi hain, ye **test lifecycle hooks** hain jo setup/teardown control karte hain (global ya describe-scoped). Interview me differentiate karna: annotations test ka *execution behavior* control karte hain (run/skip/fail/timeout), hooks *setup/cleanup* control karte hain.

---

## `slowMo` vs `test.slow()` — Common Interview Confusion

**`test.slowMo()` doesn't actually exist** as a test annotation. What's often confused is **`slowMo`**, which is a **browser launch option**, not a `test.*` API.

### `slowMo` (launch option)

**What it is:** A configuration option passed when launching the browser, not a test annotation.
**Purpose:** Slows down Playwright's *actual actions* (clicks, typing, navigation) by a specified number of milliseconds between each operation.
**Why:** So you can *visually watch* what's happening during execution — useful when debugging locally in headed mode, because Playwright normally runs so fast you can't see what's going on.

```
// playwright.config.ts
use: {
  launchOptions: {
    slowMo: 500, // waits 500ms between each Playwright action
  },
}

// or when launching manually
const browser = await chromium.launch({ headless: false, slowMo: 500 });
```

**Effect:** This literally makes the automation *itself* slower — every click, fill, navigation gets an artificial delay. It's a debugging/visual aid, has nothing to do with pass/fail or timeouts.

### `test.slow()` (test annotation)

**What it is:** A real Playwright test annotation.
**Purpose:** Doesn't slow anything down — it just **triples the test's timeout** (30s → 90s), giving Playwright more patience before marking the test as timed out.
**Effect:** The app and the automation run at normal speed. Only the *allowed time budget* increases.

### Key Difference

| | `slowMo` | `test.slow()` |
| --- | --- | --- |
| **Type** | Browser launch option | Test annotation |
| **What it slows** | The actual execution (visually) | Nothing — just extends timeout |
| **Purpose** | Debugging/watching test run | Giving genuinely slow operations more time to finish |
| **Where used** | Config or `browser.launch()` | Inside a test |

### Interview one-liner

> "`slowMo` is a launch option that adds a delay between each Playwright action so you can visually debug — it actually slows down execution. `test.slow()` is a test annotation that doesn't slow anything down at all, it just triples the timeout so a genuinely slow operation doesn't get marked as failed prematurely."
