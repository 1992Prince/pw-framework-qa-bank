# 🎓 PLAYWRIGHT — LIBRARY vs. TEST, CORE OBJECTS & CREATION-TIME PROPERTIES

Student Notes — Topic-wise, Speakable Format

---

# 📚 TOPIC 1 — `playwright` (Library) vs. `@playwright/test` (Test Runner)

## 1.1 What gets installed when you run `npm init playwright@latest`?

This command performs three main actions:

1.  **Installs `@playwright/test`** as a devDependency in `package.json`. This package internally includes `playwright-core` (the actual browser automation engine), so you don't need to install it separately.
2.  **Downloads browser binaries** — patched versions of Chromium, Firefox, and WebKit. These are stored in a separate cache folder within `node_modules` and are completely independent of your system's installed browsers.
3.  **Creates a boilerplate project structure**:
    *   `playwright.config.ts` — The central configuration file.
    *   `tests/` folder — With an example `.spec.ts` file.
    *   `tests-examples/` — For additional reference examples.
    *   Script entries in `package.json`.
    *   Optionally, `.github/workflows/playwright.yml` for CI (the wizard asks for this).

**Speakable line for an interview:** "Running `npm init playwright@latest` installs the `@playwright/test` package, which includes the entire testing framework. It also downloads patched binaries for three browsers, which are version-locked with the Playwright installation."

---

## 1.2 What is the fundamental difference between the `playwright` and `@playwright/test` packages?

|                        | `playwright` (Library)                         | `@playwright/test` (Test Framework)              |
| ---------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **Purpose**            | Provides only the browser automation API.        | A complete test framework built on top of the automation API. |
| **Test Runner**        | ❌ None.                                         | ✅ Includes the `test()` function and runner.      |
| **Assertions**         | ❌ None. You have to write manual `if` checks. | ✅ Provides `expect()` with web-first, auto-retrying assertions. |
| **Fixtures**           | ❌ None. Everything must be set up manually.   | ✅ Auto-injects `browser`, `context`, and `page`. |
| **Cleanup**            | ❌ Manual. You must call `close()` yourself.   | ✅ Automatic. Resources are torn down after each test. |
| **Parallel Execution** | ❌ Must be implemented manually.                 | ✅ Built-in via the `workers` configuration.     |
| **Reporters**          | ❌ None.                                         | ✅ HTML, JSON, List, etc.                          |
| **Retries**            | ❌ None.                                         | ✅ Built-in via the `retries` configuration.     |
| **Trace/Video/Screenshot** | ❌ Must be implemented manually.               | ✅ Built-in options.                               |

**In one line:** `playwright` is just a **remote control** for the browser. `@playwright/test` is a **complete testing ecosystem** that has that remote control already integrated.

---

## 1.3 Why do SDETs use `@playwright/test` for test automation instead of the `playwright` library?

Here's the reasoning to provide in an interview:

-   **Assertions are essential:** A QA's job isn't just to perform actions but to verify outcomes. Writing assertions with the library means manual `if/throw` statements, which don't auto-retry and can lead to flaky tests.
-   **Parallel execution is necessary:** Running 500 tests sequentially is impractical. The test runner executes tests in parallel using workers; with the library, you'd have to build this capability yourself.
-   **Reporting is required:** Stakeholders need HTML reports, and CI pipelines need a clear pass/fail dashboard. The library has no reporting layer.
-   **Retries are needed for CI:** To handle genuinely flaky infrastructure issues. With the library, you would have to write a manual retry-loop.
-   **Automatic cleanup is crucial:** If a test fails mid-execution (e.g., due to an assertion error), the `browser.close()` line in a library script will never be executed. This leaves the browser process hanging, causing a memory leak. The test runner's fixtures guarantee teardown whether the test passes or fails.
-   **Debugging tools are a must:** The Trace Viewer, UI mode, and `--debug` Inspector are all features that come exclusively with `@playwright/test`.

**One-liner for an interview:** "The library only provides automation capabilities. Everything essential for testing—like assertions, retries, parallel execution, reporting, and guaranteed cleanup—is only available in the test runner. That's why for QA automation, we always use `@playwright/test`."

---

## 1.4 Code — Launching Chromium via `@playwright/test`

```typescript
import { test, expect } from '@playwright/test';

test('launch chromium and verify title', async ({ page }) => {
  // The 'page' fixture is already prepared with a fresh browser, context, and page.
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
// When the test finishes, the page, context, and browser are all cleaned up automatically.
```

Notice there's no `chromium.launch()`, `newContext()`, or `close()`. Which browser to use (Chromium/Firefox/WebKit) is decided by the `projects` array in `playwright.config.ts`—nothing needs to be specified in the test file.

---

## 1.5 Code — Launching Chromium via the `playwright` Library

```typescript
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });   // Manually launch
  const context = await browser.newContext();                    // Manually create context
  const page = await context.newPage();                          // Manually create page

  await page.goto('https://example.com');
  const title = await page.title();

  if (title !== 'Example Domain') {                               // Manual assertion, no retry
    throw new Error('Title mismatch');
  }

  await page.close();       // Manual cleanup
  await context.close();    // Manual cleanup
  await browser.close();    // Manual cleanup
})();
```

Here, **every step is explicit**—launch, context, page, assertion, and all three cleanup calls.

---

## 1.6 How does the test runner remove boilerplate and why is manual cleanup unnecessary?

`@playwright/test` uses a **fixture-based architecture**. When you destructure `{ page }` in a test function, this is what happens internally:

1.  Before the test starts, Playwright launches a `Browser` (or reuses one if it's already running).
2.  It creates a fresh `BrowserContext` within that Browser.
3.  It creates a `Page` within that Context.
4.  This `page` object is injected into your test function.
5.  **After the test completes—whether it passes, fails, or throws an error**—the fixture teardown is automatically triggered, and the `page` and `context` are closed.

**Why is this guarantee important?** In a library-based script, if an assertion fails mid-test, the code after the `throw new Error()` line will never run, meaning `browser.close()` is skipped. If this happens in a few tests, you'll have numerous orphan browser processes left running on the system, leading to memory leaks and a slow CI machine.

The test runner's fixture teardown runs with a `try...finally`-like guarantee, ensuring that cleanup always happens, regardless of the test outcome.

**Speakable summary:** "In Playwright Test, we only need to write our test logic—`page.goto()`, `page.click()`, `expect()`. Launching the browser, creating the context and page, and most importantly, closing them, is all handled automatically through fixtures. This keeps our code clean and eliminates the risk of resource leaks."

---

# 🗂️ TOPIC 2 — PW Core Objects: `Browser`, `BrowserContext`, `Page`

## 2.1 What are these three objects? In one line:

-   **`Browser`**: A running browser process (an instance of Chromium, Firefox, or WebKit). This is the top-most layer.
-   **`BrowserContext`**: An **isolated session** within a browser. It has its own cookies, storage, cache, and authentication state. Think of it like an incognito profile.
-   **`Page`**: A **tab** within a context. This is where the actual web page is loaded and interactions happen.

```
Browser (1 process)
  ├── BrowserContext A (isolated session #1)
  │     ├── Page 1
  │     └── Page 2   ← Pages in the same context share the same cookies.
  └── BrowserContext B (isolated session #2)
        └── Page 3   ← Zero sharing with Context A.
```

---

## 2.2 BrowserContext = Incognito Profile — no need to manually open one.

When you open an incognito window in a normal browser, that window has a fresh state—no old cookies, no saved logins.

**Playwright's `BrowserContext` provides this exact behavior by default**, without any extra flags. The context you get from calling `browser.newContext()` is already a **fresh, isolated, incognito-like session**. We don't need to explicitly pass an `--incognito` flag or anything similar—this is Playwright's default.

This is why in Playwright Test, **every test automatically gets a fresh context**. The login state from Test 1 is never inherited by Test 2, without any configuration.

> **Exception:** If you use `launchPersistentContext()`, it maintains a persistent user-data-dir on disk, just like a normal (non-incognito) Chrome profile. However, this is rarely used in QA automation; the default is always an isolated context.

---

## 2.3 Pages within the same context share settings.

All `Page`s (tabs) created within a single `BrowserContext` **automatically share all of that context's settings**:

-   Cookies
-   localStorage / sessionStorage
-   Cache
-   Authentication state (if one page logs in, the other will also appear logged-in)
-   Viewport, locale, timezone, geolocation—whatever was set at context creation time
-   Permissions

**A page in a different context shares absolutely nothing.** It's like a tab in a completely separate incognito window.

---

## 2.4 Code — Multiple Contexts from the Same Browser, Multiple Pages from the Same Context

```typescript
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();

  // ── Context A — Admin session (isolated) ──────────────────────
  const adminContext = await browser.newContext();
  const adminPage1 = await adminContext.newPage();   // tab 1
  await adminPage1.goto('https://myapp.com/login');
  // ... login as admin ...

  const adminPage2 = await adminContext.newPage();   // tab 2 — SAME context
  await adminPage2.goto('https://myapp.com/reports');
  // adminPage2 is automatically logged-in because cookies are coming from the same context.

  // ── Context B — Regular user session (completely isolated) ────
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  await userPage.goto('https://myapp.com/login');
  // No admin login will be visible here — it's a fresh, isolated session.

  // Manual cleanup is necessary with the library
  await adminContext.close();
  await userContext.close();
  await browser.close();
})();
```

**Practical automation use case:** For multi-role testing, if you need to simulate an Admin and a Regular User **in the same test run and from the same Browser process**, you can create two contexts. Their sessions are guaranteed to be isolated and will not affect each other.

---

## 2.5 Is creating a page directly with `browser.newPage()` a good approach?

Playwright offers a shortcut:

```typescript
const page = await browser.newPage();
// Internally, this performs both browser.newContext() and context.newPage() in one call.
```

This **works**, but it's **not a best practice** in QA automation. Here's why:

-   You don't have a **direct reference** to the implicit context. If you later need another tab (page) in the same session, you have to get it via `page.context()`, which is an extra step.
-   It becomes difficult to explicitly control context-level settings (like viewport, storageState, permissions, geolocation) when the context creation is hidden.
-   Writing multi-context scenarios (e.g., admin vs. user, multiple isolated sessions) is less clean.

**Recommended approach**—always be explicit:

```typescript
const context = await browser.newContext({ /* settings */ });
const page = await context.newPage();
```

**Speakable line:** "`browser.newPage()` is a convenience shortcut that also creates a context internally. It works, but I prefer to create the context explicitly to maintain control over its reference, especially when I need multiple pages or multiple isolated sessions."

> In Playwright Test, we don't have to make this decision. The `page` fixture automatically provides a new context and page. If you need more pages in the same context, the `context` fixture is also available (`test('...', async ({ page, context }) => {...})`).

---

# ⚙️ TOPIC 3 — Creation-Time Properties: Browser, BrowserContext, Page

**It's important to clarify this concept:** All these properties can be set in two places:

1.  In the `use` block of `playwright.config.ts`—this applies them globally across the entire suite (the Test runner's way).
2.  Directly in the code when you call `chromium.launch({...})`, `browser.newContext({...})`, or `test.use({...})`—for per-script or per-test overrides.

**Line to say in an interview:** "Setting properties globally in the config file is convenient for the whole suite. However, if a specific test or script needs different settings—like a mobile viewport for one test—we can also pass them directly into `newContext()` or `test.use()`, which overrides the config value."

---

## 3.1 `Browser`-level properties — `chromium.launch({...})`

| Property           | What it does                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `headless`         | `true`/`false` — whether the browser UI is visible or runs in the background.                     |
| `channel`          | Use a system-installed browser: `'chrome'`, `'msedge'`, `'chrome-canary'`, `'firefox'`.            |
| `slowMo`           | Adds an artificial delay (in ms) between actions, useful for debugging and watching execution slowly. |
| `args`             | Pass extra command-line flags to the browser, e.g., `['--start-maximized']`.                      |
| `executablePath`   | Path to a custom browser binary, skipping Playwright's bundled one.                               |
| `devtools`         | Automatically opens the DevTools panel when the browser launches.                                  |
| `timeout`          | Maximum wait time for the browser to launch.                                                       |
| `proxy`            | `{ server, username, password }` — to route traffic through a proxy.                              |
| `downloadsPath`    | Where downloaded files will be saved.                                                              |
| `env`              | Provide custom environment variables to the browser process.                                       |

```typescript
const browser = await chromium.launch({
  headless: false,
  channel: 'chrome',
  slowMo: 500,
  args: ['--start-maximized'],
});
```

---

## 3.2 `BrowserContext`-level properties — `browser.newContext({...})`

| Property              | What it does                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| `viewport`            | `{ width, height }` — the screen size.                                                              |
| `locale`              | The browser's language, e.g., `'en-US'`.                                                             |
| `timezoneId`          | e.g., `'America/New_York'`.                                                                        |
| `geolocation`         | `{ latitude, longitude }` — to simulate GPS coordinates.                                          |
| `permissions`         | e.g., `['geolocation', 'notifications']` — to auto-grant permissions.                               |
| `storageState`        | Restore a saved login state (cookies + localStorage) from a JSON file to skip login steps.          |
| `httpCredentials`     | `{ username, password }` — for basic HTTP authentication.                                         |
| `isMobile`            | Emulate a mobile device.                                                                             |
| `hasTouch`            | Enable support for touch events.                                                                     |
| `colorScheme`         | `'dark'` / `'light'` / `'no-preference'`.                                                          |
| `ignoreHTTPSErrors`   | Ignore SSL certificate errors (common for staging environments).                                     |
| `userAgent`           | A custom User-Agent string.                                                                          |
| `extraHTTPHeaders`    | Send extra headers with every request.                                                               |
| `offline`             | Simulate an offline network.                                                                         |
| `baseURL`             | A context-level base URL (same as `use.baseURL` in config, but for per-context override).          |
| `recordVideo`         | `{ dir: 'videos/' }` — to record a video of the session.                                           |
| `recordHar`           | Record network activity into a HAR file.                                                             |
| `deviceScaleFactor`   | Simulate Retina/high-DPI screens.                                                                    |

```typescript
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  locale: 'en-US',
  timezoneId: 'America/New_York',
  storageState: 'auth/admin.json',
  ignoreHTTPSErrors: true,
  colorScheme: 'dark',
});
```

**Most common in real projects:** `storageState` — log in once, save the state, and then start every test from that state to avoid repeating the login step.

---

## 3.3 `Page`-level — Does `newPage({...})` also have options?

**An important nuance to mention in an interview:** `context.newPage()` **does not accept any options**. This is because a Page inherits all its settings (viewport, locale, storage, permissions) from its parent `BrowserContext`.

```typescript
const page = await context.newPage();   // No options parameter here.
```

Page-specific settings are only set or overridden **after the page is created, using its own methods**:

| Method                                         | What it does                               |
| ---------------------------------------------- | ------------------------------------------- |
| `page.setViewportSize({ width, height })`    | Change the viewport of that specific page.  |
| `page.setExtraHTTPHeaders({...})`            | Add extra headers only to that page's requests. |
| `page.setDefaultTimeout(ms)`                 | The default timeout for that page's actions. |
| `page.setDefaultNavigationTimeout(ms)`       | The default timeout for that page's navigations. |
| `page.emulateMedia({ colorScheme: 'dark' })` | Override media features.                    |
| `page.goto(url, { waitUntil, timeout })`     | Navigation-specific options on a per-call basis. |

**Speakable summary:** "Both Browser and Context accept properties at creation time via `launch({...})` and `newContext({...})`. However, a Page doesn't take its own `newPage({...})` options object. A Page inherits its settings from its context, and if you need to override something specific, you use the page's own setter methods, like `setViewportSize()` or `setDefaultTimeout()`."

---

## 3.4 Per-test overrides in Playwright Test — `test.use()`

To override globally set values from the config file for a specific test file or `describe` block:

```typescript
import { test, expect, devices } from '@playwright/test';

test.use({
  viewport: { width: 375, height: 812 },
  ...devices['iPhone 13'],
});

test('mobile view check', async ({ page }) => {
  await page.goto('/');
  // This test will use iPhone 13 emulation, differing from the global suite config.
});
```

These are the same `BrowserContext` properties (viewport, locale, storageState, etc.). The syntax is just `test.use()` instead of `newContext({...})` because Playwright is managing the underlying context for you.

---

## 📌 Quick Recap Table — Where to Set What

| Layer   | Where to set (Library)        | Where to set (Test Runner)                                                 |
| ------- | ----------------------------- | -------------------------------------------------------------------------- |
| Browser | `chromium.launch({...})`      | `playwright.config.ts` → top-level / `use.channel`, `use.headless`    |
| Context | `browser.newContext({...})`   | `playwright.config.ts` → `use` block, or `test.use({...})` per-file   |
| Page    | Page's own setter methods     | Page's own setter methods (same)                                           |
