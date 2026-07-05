## 5) `projects` Array — Syntax, Categorization, Dependencies & CLI Usage

**Interview definition:**
"`projects` is an array inside `defineConfig()` where each element is a configuration object representing a distinct way to run your test suite — different browser, different device, different test category, or different environment — all from a single config file."

---

### Basic Syntax

```
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
],
```

Each **project is just an object** with:

- `name` — identifier, used in reports and CLI (`--project=chromium`)
- `use` — overrides/extends the root `use` block, scoped only to this project
- Optionally `testDir`, `testMatch`, `testIgnore`, `dependencies`, `teardown`

---

### Categorizing Projects by Test Type

This is the pattern you described — instead of (or in addition to) browser-based projects, you organize projects by **what kind of tests they run**:

```
projects: [
  {
    name: 'smoke',
    testDir: './tests/smoke',
    // or: testMatch: '**/smoke/**/*.spec.ts'
  },
  {
    name: 'bvt',
    testDir: './tests/bvt',
  },
  {
    name: 'regression',
    testDir: './tests/regression',
  },
  {
    name: 'e2e',
    testDir: './tests/e2e',
  },
  {
    name: 'api',
    testDir: './tests/api',
    use: {
      // API tests don't need a real browser context settings like viewport
      baseURL: process.env.API_BASE_URL,
    },
  },
],
```

**Why this is a strong strategy (interview line):**
"Splitting projects by test category — smoke, BVT, regression, e2e, API — gives everyone in the team a clear, self-documenting way to know exactly what subset of tests they're running, without needing separate config files. It also lets CI pipelines trigger only the relevant project at each stage — e.g. run `smoke` on every PR, `regression` nightly."

---

### Per-Project `use` Overrides

Each project can override **any** root-level `use` property — browser, baseURL, storageState, viewport, extra headers, anything:

```
projects: [
  {
    name: 'smoke-staging',
    testDir: './tests/smoke',
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://staging.example.com',
      storageState: 'auth/staging.json',
    },
  },
  {
    name: 'regression-prod',
    testDir: './tests/regression',
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://example.com',
      storageState: 'auth/prod.json',
    },
  },
],
```

This is exactly how one config file supports **multiple environments + multiple browsers + multiple test categories** simultaneously.

---

### Project Dependencies — Setup / Cleanup Pattern

You can make projects **depend on** other projects using `dependencies` and `teardown`. Classic use case: run a login/setup project first, save auth state, run main tests, then clean up.

```
projects: [
  // Step 1 — runs first, logs in, saves storageState
  {
    name: 'auth-setup',
    testMatch: '**/auth.setup.ts',
    teardown: 'cleanup',   // link cleanup project
  },

  // Step 3 — runs last, even if tests fail
  {
    name: 'cleanup',
    testMatch: '**/cleanup.teardown.ts',
  },

  // Step 2 — main tests, wait for auth-setup to finish
  {
    name: 'regression',
    testDir: './tests/regression',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'auth/loginState.json',
    },
    dependencies: ['auth-setup'],
  },
],
```

**Flow:** `auth-setup → regression → cleanup`

- **`dependencies`** — array of project names that must **complete successfully first**, before this project runs
- **`teardown`** — points to a project that should run **after** this one finishes, and importantly **runs even if the dependent tests fail** — ensuring cleanup always happens (e.g. deleting test data created during setup)

> Interview line: "`dependencies` controls what runs *before* a project; `teardown` (attached to the setup project) controls what runs *after* — and teardown is guaranteed to run regardless of test outcome, which is critical for reliable data cleanup."

---

### Running Projects via CLI

**Run a single project:**

```
npx playwright test --project=smoke
```

**Run multiple projects together:**

```
npx playwright test --project=smoke --project=regression
```

Yes — you can pass `--project` **multiple times** in one command, and Playwright runs all specified projects (respecting their own `dependencies`/`teardown` chains).

**Run all projects (default):**

```
npx playwright test
```

Runs every project defined in `projects` array, unless filtered.

**Passing/overriding values from CLI:**
You can't directly override arbitrary `use` properties by name via CLI flags (like "set baseURL from CLI" isn't a built-in flag), but you **can**:

- Use environment variables, since your config already reads from `process.env.*` — so you override by setting env vars at run time:

```
BASE_URL=https://staging.example.com npx playwright test --project=smoke
```

- Use built-in CLI flags that map to config options: `--workers=4`, `--retries=1`, `--headed`, `--grep="login"`, `--repeat-each=2`, `--reporter=dot`

> Interview soundbite: "CLI overrides work through two channels — Playwright's own flags like `--project`, `--workers`, `--headed`; and environment variables, since the config file itself is written to read from `process.env`, which is the real mechanism for passing custom values like baseURL from the command line."

---

### `devices['Desktop Chrome']` — Syntax & JS Concept Explained

```
{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
{ name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
{ name: 'webkit',   use: { ...devices['Desktop Safari'] } },
```

**What `devices` is:**
Playwright ships a **built-in dictionary/object** of preconfigured device profiles — `devices['Desktop Chrome']`, `devices['iPhone 13']`, `devices['Pixel 5']`, `devices['iPad Pro']`, etc. Each key maps to an object containing **all the correct settings** for that device already filled in — viewport size, user agent string, device scale factor, whether it's mobile/touch-enabled, default browser engine, and more.

Example of what `devices['Desktop Chrome']` actually resolves to internally (simplified):

```
{
  viewport: { width: 1280, height: 720 },
  userAgent: 'Mozilla/5.0 ... Chrome/...',
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  defaultBrowserType: 'chromium',
}
```

**The `...` — JS spread operator:**
`...devices['Desktop Chrome']` **spreads** (unpacks) all key-value pairs from that object directly into your `use` object, as if you'd typed them all out yourself.

```
// This:
use: { ...devices['Desktop Chrome'] }

// Is equivalent to manually writing:
use: {
  viewport: { width: 1280, height: 720 },
  userAgent: 'Mozilla/5.0 ...',
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  defaultBrowserType: 'chromium',
}
```

**Why this matters (interview line):** "The spread operator saves you from manually configuring every low-level browser property yourself. Playwright's team has already correctly configured viewport, user agent, and touch/mobile behavior for each real device — spreading it in gives you a production-accurate emulation profile in one line."

---

### Simple Browser Project — No Extra Properties Needed

If you just want to run in a specific browser without emulating a full device, you don't have to spread `devices` at all — just specify the browser:

```
{
  name: 'chromium',
  use: { browserName: 'chromium' },
},
{
  name: 'edge',
  use: {
    browserName: 'chromium',
    channel: 'msedge',       // real installed Edge, not bundled Chromium
  },
},
{
  name: 'firefox',
  use: { browserName: 'firefox' },
},
```

---

### Mobile Emulation Projects

```
{
  name: 'mobile-chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'mobile-safari',
  use: { ...devices['iPhone 13'] },
},
{
  name: 'tablet',
  use: { ...devices['iPad Pro'] },
},
```

Spreading a mobile device profile automatically sets mobile viewport, touch support (`hasTouch: true`), mobile user agent, and appropriate scale factor — simulating a real mobile browser session.

---

### Overriding/Customizing on Top of a Device Profile

Since spread just merges an object, you can spread the device profile **and then override specific properties** afterward — later keys win:

```
{
  name: 'chromium-custom-viewport',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1920, height: 1080 },  // overrides Desktop Chrome's default viewport
    baseURL: 'https://staging.example.com',
  },
},
```

> Interview trap question: *"If you spread `devices['Desktop Chrome']` and then set `viewport` manually below it in the same object, which wins?"* → The **manually set property wins**, because in JS object literals, later keys overwrite earlier ones — even when the earlier ones came from a spread.

---

## 6) `globalSetup` & `globalTeardown`

**Interview definition:**
"`globalSetup` and `globalTeardown` are root-level config options that let you run a piece of code **exactly once** — before any test in the entire suite starts, and once after every test in the entire suite has finished — regardless of how many test files, projects, or workers are involved."

---

### Purpose in plain words

Some setup/cleanup work doesn't belong to any single test or even any single file — it belongs to the **whole run**. Examples:

- Connecting to a database once, and closing that connection once at the end
- Generating a **unique run ID / job ID** for the entire execution (used to tag logs, reports, or test data so this run's artifacts don't clash with another run's)
- Initializing a custom reporting system or dashboard (e.g. hitting an API to say "test run started" and later "test run finished")
- Starting an external service/mock server needed by all tests
- Seeding baseline data required across the whole suite

`globalSetup` handles the "before everything" side, `globalTeardown` handles the "after everything" side.

---

### How It's Different from `beforeAll` / `beforeEach` Hooks

This is a heavily asked interview distinction — the core difference is **scope**:

| | `globalSetup` / `globalTeardown` | `test.beforeAll` | `test.beforeEach` |
| --- | --- | --- | --- |
| **Scope** | Entire test **run** (all files, all projects, all workers) | One **test file** (or one `describe` block) | Every **individual test** |
| **Runs how many times** | Exactly **once**, total | Once per file/describe block | Once before every single test |
| **Where defined** | Root of `playwright.config.ts`, as a **separate file/module** | Inside a spec file, using Playwright's `test` object | Inside a spec file |
| **Has access to `page`/browser fixtures?** | No — runs outside the test/fixture system entirely; you manually launch a browser if needed | Yes — fixtures like `page` are available | Yes |
| **Typical use** | DB connection, run-ID generation, external service startup, custom reporter init | Setup shared across tests in one file (e.g. navigate to a page once) | Per-test isolation setup (fresh state before each test) |

**Interview soundbite:**
"`beforeAll`/`beforeEach` operate **inside** the Playwright test/fixture system, scoped to a file or test — they run per worker, potentially multiple times if tests are distributed across parallel workers. `globalSetup` runs completely outside that system, exactly once for the whole run, no matter how many workers or files exist — that's the fundamental difference."

> Trap question: *"If you have 4 workers running tests in parallel, does `beforeAll` run once or 4 times?"* → It can run **once per file** it's defined in (and files may be distributed across workers), so it's not truly "once for the whole suite" the way `globalSetup` is. `globalSetup`/`globalTeardown` are the only options that guarantee true "run exactly once, full stop" behavior.

---

### Syntax — Where It's Specified in Config

```
export default defineConfig({
  testDir: './tests',

  // Logic that runs BEFORE all tests
  globalSetup: './global-setup',

  // Logic that runs AFTER all tests
  globalTeardown: './global-teardown',

  // ...rest of config
});
```

Both point to **separate module files** (not inline functions) — usually referenced via `require.resolve()` for reliable path resolution regardless of where the test runner is invoked from:

```
globalSetup: require.resolve('./global-setup'),
globalTeardown: require.resolve('./global-teardown'),
```

---

### `global-setup.ts` — Example

```
import { FullConfig } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

async function globalSetup(config: FullConfig) {
  // 1. Generate a unique run ID for this entire execution
  const runId = uuidv4();
  process.env.RUN_ID = runId;
  console.log(`Starting test run: ${runId}`);

  // 2. Initialize DB connection / seed baseline data
  // const db = await connectToDatabase();
  // await db.seedBaselineData();

  // 3. Notify a custom reporting dashboard that the run has started
  // await fetch('https://my-dashboard.com/api/run-start', {
  //   method: 'POST',
  //   body: JSON.stringify({ runId, startedAt: new Date() }),
  // });
}

export default globalSetup;
```

- The function receives Playwright's **`FullConfig`** object as a parameter — gives you read access to the resolved config (projects, root dir, etc.) if your setup logic needs it
- It's just a plain **async function** — no `test`/`expect` involved, because this runs **outside** the test runner's execution context entirely
- Anything you want later test files to access (like `RUN_ID`) typically gets passed via `process.env`, since that's the simplest way to bridge data from `globalSetup` into individual test files

---

### `global-teardown.ts` — Example

```
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  const runId = process.env.RUN_ID;

  // 1. Close DB connection
  // await db.disconnect();

  // 2. Clean up any run-scoped temp data
  // await cleanupTestData(runId);

  // 3. Notify dashboard the run has finished
  // await fetch('https://my-dashboard.com/api/run-end', {
  //   method: 'POST',
  //   body: JSON.stringify({ runId, finishedAt: new Date() }),
  // });

  console.log(`Test run ${runId} completed — cleanup done.`);
}

export default globalTeardown;
```

- Also a plain async function, exported as default
- **Guaranteed to run after all tests finish** — including if tests failed (not if `globalSetup` itself threw an error and crashed the whole run before tests even started, in which case teardown won't have anything meaningful to clean up)

---

### Module Type / Export Requirement

- Must be a **default export** — same convention as the config file itself
- Written as a standalone `.ts`/`.js` file, **not** inside your `tests/` directory (keeping it outside avoids Playwright's test runner accidentally treating it as a spec file)
- Common convention: place at project root or in a `/setup` folder — e.g. `./global-setup.ts`, `./global-teardown.ts`

---

### Why This Matters for CI / Real Projects

- **Unique run ID** is especially valuable in CI — lets you correlate this run's screenshots/videos/traces/logs with a single dashboard entry, especially when multiple pipeline runs happen concurrently (e.g. multiple PRs triggering CI at once)
- **DB setup/teardown at global level** avoids repeatedly opening/closing connections per test or per file — a real performance and resource-management concern at scale
- **Custom reporter initialization** — some external reporting tools (like sending results to Slack, a custom dashboard, or Allure) need a "run started" / "run ended" signal exactly once, which naturally maps to `globalSetup`/`globalTeardown` rather than any per-test hook

---

### Quick Comparison Recap (for rapid-fire interview answers)

> "`globalSetup`/`globalTeardown` = whole-run, once, outside the fixture system, config-level.
> `beforeAll` = once per file/describe block, inside fixture system.
> `beforeEach` = once per test, inside fixture system.
> Use global hooks for run-wide infrastructure concerns (DB, run IDs, external reporting); use `beforeAll`/`beforeEach` for test-data and page-state setup that's scoped to specific tests."
