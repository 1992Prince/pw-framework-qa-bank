## 1) What is `playwright.config.ts`?

**Interview definition (crisp, one-liner style):**
"`playwright.config.ts` is the central configuration file for a Playwright test suite — it defines how, where, and under what conditions tests run, without needing to repeat those settings in every test file."

**In plain words:**
It's the **single source of truth** for your entire test project. Instead of hardcoding things like base URL, browser, timeout, or retry count inside every test, you configure them once here — and every test automatically inherits those settings.

**What it actually contains (categories):**

- **Test discovery** — where your test files live (`testDir`), which files to match/ignore
- **Execution behavior** — timeout per test, retries on failure, how many parallel workers, whether tests inside a file also run in parallel
- **Reporting** — what format results are output in (HTML, JSON, JUnit, dot, list) and where reports are saved
- **Browser/context settings** — headless or headed, viewport, base URL, screenshots/video/trace capture
- **Multi-browser / multi-device setup** — via `projects`, run the same suite across Chromium, Firefox, WebKit, or mobile emulation
- **Global hooks** — `globalSetup` / `globalTeardown` for one-time setup like login before the whole suite runs
- **Framework categorization** — using `projects` (or separate config files) to split your suite into logical buckets like **UI tests, API tests, smoke tests, regression tests, test-data-setup** — each pointing to its own folder/pattern and possibly its own settings

**Can we have multiple config files?**
Yes. Common in real projects when different test types need fundamentally different settings (e.g. `playwright.config.smoke.ts`, `playwright.config.regression.ts`, or an API-only config with no browser at all). But equally common (and often preferred) is **one config file with multiple `projects`**, each pointing to a different `testDir`/`testMatch`, which keeps things centralized while still separating concerns. Both approaches are valid — team/project scale usually decides which.

**Why is this important for interviews?**
Because in real/large projects, almost every test-run problem (flaky tests, wrong environment hit, CI failures, slow runs) traces back to config. Interviewers use config questions to check if you've actually worked on a real framework vs just written individual test scripts.

---

## 2) Basic Structure

**Interview definition:**
"The config file exports a single default object, wrapped in the `defineConfig()` helper, which contains all the settings Playwright reads before running any tests."

**The skeleton:**

```
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // all your settings go here
});
```

**Why `import { defineConfig, devices }`?**

- `defineConfig` — a helper function you wrap your config object in
- `devices` — a predefined list of browser/device profiles (e.g. `devices['Desktop Chrome']`, `devices['iPhone 13']`) that you spread into `projects` so you don't manually set viewport, user agent, etc. for every device

**Why `export default`?**
Playwright's test runner looks for a **default export** from this file when it loads config — that's how it knows this object *is* the config. Without `export default`, Playwright wouldn't recognize it.

**What is `defineConfig()` actually doing?**
It's essentially a **type-helper wrapper function** — at runtime it mostly just returns the object you pass in, but it gives you:

- TypeScript **autocomplete** for every config property
- **Inline documentation** on hover for each option
- **Type checking** — if you typo a property name or pass a wrong value type, TypeScript flags it immediately

> Interview line: "Playwright *works* even without `defineConfig` — you could just `export default { ... }` — but you lose type safety and autocomplete, so it's always used as best practice."

**What goes inside the `{}`?**
Two broad categories of keys:

1. **Root-level (suite-level) settings** — apply to the whole test run: `testDir`, `timeout`, `retries`, `workers`, `fullyParallel`, `forbidOnly`, `reporter`, `globalSetup`, `globalTeardown`, `webServer`, `projects`
2. **`use` block** — default settings passed into every browser context (baseURL, headless, viewport, screenshot, video, trace, etc.) — this is nested *inside* the root object as its own key: `use: { ... }`

```
export default defineConfig({
  // root-level settings
  testDir: './tests',
  timeout: 30000,
  retries: 2,

  // nested object — shared browser/context settings
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },

  // nested array — multi-browser/device configs
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

**Mental model for interviews:**
Think of the config object as having **three tiers**:

- Top-level = suite-wide rules (how tests run overall)
- `use` = default context/browser settings (can be overridden)
- `projects` = variations of `use` for different browsers/devices/environments, each can override the shared `use`

That structural separation (root → use → projects) is exactly what lets Playwright support the **override priority** system you'll cover later (test-level > project-level > root `use` > defaults).

---

## 3) Root-Level Options

**Interview definition:**
"Root-level options sit directly inside `defineConfig({})`, outside the `use` block — they control suite-wide behavior like where tests live, how many run in parallel, retries, and reporting, rather than browser/context-specific settings."

---

### `testDir`

```
testDir: './tests',
```

Tells Playwright where to look for test files (recursively). Relative to the config file's location. Default is already `./tests`, but explicitly setting it is good practice for clarity, especially with multiple projects pointing to subfolders.

---

### `fullyParallel`

```
fullyParallel: true,
```

Value | Behavior
--- | ---
`false` (default) | Test **files** run in parallel across workers, but tests *within* the same file run sequentially
`true` | Even tests **inside the same file** run in parallel

**Local vs CI:** Usually `true` everywhere to maximize speed — but if tests within a file share state (e.g. one test depends on data created by a previous one in the same file), keep it `false` for that project.

---

### `forbidOnly`

```
forbidOnly: !!process.env.CI,
```

If someone commits `test.only()` locally and forgets to remove it, only that one test would run — silently skipping everything else. `forbidOnly: true` makes the **CI build fail** if `.only()` is detected, catching this mistake before it ships.

**Why the `process.env.CI` fallback pattern:** Locally you *want* to use `.only()` freely while debugging, so it should be `false`/allowed locally, but strictly forbidden in CI. `!!process.env.CI` converts the env var (string or undefined) into a clean boolean.

---

### `retries`

```
retries: process.env.CI ? 2 : 0,
```

Number of automatic re-attempts for a failed test.

- **Local → `0`**: you want failures to show up immediately, not be silently retried and masked
- **CI → `2`**: CI runners often hit transient network/infra flakiness; retries reduce false-negative failures in the pipeline

> Interview line: "Retries mask flakiness, they don't fix it — CI retries are a pragmatic trade-off, not a substitute for fixing genuinely flaky tests."

---

### `workers`

```
workers: process.env.CI ? 1 : undefined,
```

How many test files run in parallel (parallelism at the process level).

- **`undefined` (local default)** → Playwright automatically uses **half of the available CPU cores** on your machine
- **CI → often `1`** (or a low fixed number like `2`) → **why**: CI runners (e.g. GitHub Actions, Jenkins agents) typically have **limited, shared, and fixed CPU/memory resources**. Running too many parallel workers on a constrained runner causes resource contention, slower/flakier tests, or OOM crashes — so it's safer to run fewer workers even though it's slower, trading speed for stability.

---

### `reporter`

```
reporter: 'html',
```

Defines the output format for test results — covered in depth in topic 8, but at root level it's simply a single value or an array of `[name, options]` pairs.

---

### `use`

```
use: { baseURL: '...', headless: true, ... },
```

Nested object holding **default browser/context settings** applied to every test unless overridden at project or test level. Full breakdown is topic 4.

---

### `projects`

```
projects: [ { name: 'chromium', use: {...} }, ... ],
```

Array letting you run the **same test suite** across multiple browsers, devices, or environments (e.g. smoke vs regression, staging vs prod) — each project can override the shared `use` block. Full breakdown in topics 5 & 6.

---

### `webServer`

```
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120000,
},
```

Auto-starts your app's dev/test server before tests begin, and shuts it down after.

- **`reuseExistingServer: !process.env.CI`** → locally, if you already have the dev server running (e.g. from `npm start` in another terminal), reuse it instead of starting a duplicate — saves time. In CI, always start fresh (`false`) since there's no pre-existing server and you want a clean, predictable state.

---

### Other commonly paired root options (worth mentioning)

- **`timeout`** (root-level, not inside `use`) — max time budget for **one entire test** (default 30s). Distinct from `actionTimeout`/`navigationTimeout` which live in `use` — covered in topic 4.
- **`testMatch` / `testIgnore`** — glob patterns to include/exclude specific files, often used per-project to separate smoke/regression/API suites.

---

### Quick interview-style summary table

| Option | Local | CI | Why |
| --- | --- | --- | --- |
| `retries` | `0` | `2` | See failures immediately locally; absorb CI flakiness |
| `workers` | `undefined` (½ CPU cores) | `1` or `2` | CI runners have limited shared resources |
| `forbidOnly` | `false` (implicit) | `true` | Prevent accidental `.only()` in CI |
| `headless` (in `use`) | `false` (debugging) | `true` | Faster + no display needed on CI |
| `reuseExistingServer` (`webServer`) | `true` | `false` | Reuse local dev server; CI always starts fresh |

---

## 4) `use` Block — Purpose & Full Property Breakdown

**Interview definition:**
"The `use` block defines the **default browser context settings** applied to every test in the suite — things like base URL, headless mode, viewport, and artifact capture (screenshots/video/trace). These can be overridden at the project level or test level."

**Purpose in plain words:**
Instead of setting `baseURL`, `headless`, `viewport` etc. inside every single test file, you set them **once** in `use`, and every test/browser context automatically inherits them. It's the "default context config" for the whole suite.

```
use: {
  baseURL: 'https://example.com',
  headless: true,
  viewport: { width: 1280, height: 720 },
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
}
```

---

### Basic Options

**`baseURL`**

```
baseURL: 'https://example.com',
```

Lets you use relative paths in tests instead of full URLs:

```
await page.goto('/login');  // → resolves to https://example.com/login
```

Big win for switching environments — change `baseURL` once (or per project for staging/prod) instead of editing every test.

**`storageState`**

```
storageState: 'auth/loginState.json',
```

Loads a previously saved authentication state (cookies, localStorage) so tests start **already logged in**. Usually generated once via `globalSetup` or an auth-setup project, then reused — avoids repeating login steps in every test (huge speed win).

---

### Emulation Options

**`colorScheme`** — `'light'` / `'dark'` / `'no-preference'`. Simulates OS-level theme preference for testing dark-mode UI.

**`geolocation`** — `{ latitude, longitude }`. Mocks device location — needs `permissions: ['geolocation']` granted alongside it, otherwise the browser blocks the location prompt.

**`locale`** — e.g. `'en-IN'`, `'fr-FR'`. Sets browser language — affects `Accept-Language` header and any locale-aware rendering. Used for i18n/l10n testing.

**`permissions`** — array like `['geolocation', 'camera', 'notifications']`. Pre-grants browser permissions so tests don't get stuck on permission popup dialogs.

**`viewport`** — `{ width, height }`. Sets the browser window/viewport size — critical for responsive design testing. `devices['Desktop Chrome']` etc. already set this for you.

---

### Network Options

**`acceptDownloads`** — `true`/`false` (default `true`). Whether the browser context allows file downloads to proceed — set `false` if you deliberately want to test download-blocking behavior.

**`extraHTTPHeaders`** — object of headers sent with **every** request:

```
extraHTTPHeaders: { 'Authorization': `Bearer ${process.env.API_TOKEN}` }
```

Common for API auth tokens or custom localization headers.

**`httpCredentials`** — `{ username, password }`. Auto-fills the browser's native HTTP Basic Auth dialog — without this, Basic Auth popups can't be handled by normal locators.

**`ignoreHTTPSErrors`** — `true`/`false`. Ignores SSL certificate errors — essential for **self-signed certs** on staging/dev environments; you'd never want this `true` in production testing.

**`proxy`** — `{ server, username, password }`. Routes all browser traffic through a proxy — used for network interception, corporate proxy environments, or traffic monitoring tools.

---

### Recording Options — *(high interview weight — cover values + diffs carefully)*

**`screenshot`**

| Value | Behavior |
| --- | --- |
| `'off'` (default) | Never captured |
| `'on'` | Captured after **every** test, pass or fail |
| `'only-on-failure'` ✅ | Captured **only when a test fails** — recommended default |

Screenshots are single point-in-time images, saved to `test-results/`. Lightweight — cheapest of the three recording options.

**`video`**

| Value | Behavior |
| --- | --- |
| `'off'` (default) | Never recorded |
| `'on'` | Records **every** test — heavy disk usage, rarely used except deep debugging |
| `'retain-on-failure'` ✅ | Records every test, but **deletes the video if the test passes** — keeps only failures |
| `'on-first-retry'` | Only records starting from the **first retry** attempt, not the original run |

**Interview distinction to nail:** `retain-on-failure` records *from the start* and discards on pass; `on-first-retry` doesn't even record the first attempt — it only kicks in once a retry happens. So `on-first-retry` is lighter on resources but you lose video of the very first failure itself (only see the retry's video).

**`trace`**

| Value | Behavior |
| --- | --- |
| `'off'` (default) | No trace |
| `'on'` | Captured for every test — heaviest option, used for deep local debugging |
| `'retain-on-failure'` | Captured for every test, kept only if it fails |
| `'on-first-retry'` ✅ | Captured only from the first retry onward — **CI standard** |

A trace is a **ZIP file** containing a step-by-step recording: DOM snapshots at each action, screenshots, network requests/responses, console logs, and source code — viewable in Playwright's **Trace Viewer** (`npx playwright show-trace trace.zip`). It's the richest debugging artifact — effectively lets you "time travel" through the test run.

**Why `on-first-retry` is the CI standard:** capturing trace on every single passing test is expensive (storage + CI time) and unnecessary. You only need deep debugging info when something *actually fails and retries* — so this option gives you rich data exactly when needed, at minimal cost.

> **Interview soundbite:** "Screenshot = one frame, cheapest. Video = full recording, heavier. Trace = full recording + DOM snapshots + network + console, i.e. everything needed to debug without rerunning — most expensive, most useful."

---

### Other Options

**`browserName`** — `'chromium'` / `'firefox'` / `'webkit'`. Usually set per-project rather than globally, since projects typically differ by browser.

**`bypassCSP`** — `true`/`false`. Bypasses the page's Content-Security-Policy — useful when injecting scripts/testing extensions that CSP would normally block.

**`channel`** — e.g. `'chrome'`, `'msedge'`, `'chrome-beta'`. Runs against the **actual installed browser build** (real Chrome/Edge) instead of Playwright's bundled Chromium — important when a bug is specific to the real branded browser or client explicitly needs "real Chrome" testing.

**`headless`** — `true`/`false`. `true` = no visible UI (CI, speed); `false` = visible browser window (local debugging, watching test execution live).

**`testIdAttribute`** — default is `data-testid`. Lets you change which HTML attribute `page.getByTestId()` looks for, e.g. if your app uses `data-qa` instead:

```
testIdAttribute: 'data-qa',
```

---

### Additional notes

- **Override behavior**: every property in `use` can be overridden at the **project level** (`projects[].use`) or **test level** (`test.use({...})`) — this is what makes `use` a "default," not a hard rule.
- **Interview trap question**: *"If `screenshot: 'on'` is set at root `use`, but a project sets `screenshot: 'off'`, what happens for that project's tests?"* → Project-level wins; that project takes no screenshots at all, regardless of root setting.
- **Cost/performance framing** interviewers like: rank screenshot < video < trace in terms of disk & CI time cost — and the recommended production setup is almost always `screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`, `trace: 'on-first-retry'` — this trio is asked very often as a "what would you set in a real CI pipeline" question.
- **`actionTimeout` / `navigationTimeout`** also technically belong inside `use` — `actionTimeout` governs individual actions (click, fill, assertions); `navigationTimeout` governs `page.goto()`/`waitForURL()`/`reload()` specifically — different budget than the overall test `timeout`.
