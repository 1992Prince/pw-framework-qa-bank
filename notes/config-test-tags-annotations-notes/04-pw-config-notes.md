## `webServer` Option

**Interview definition:**
"`webServer` is a root-level config option that tells Playwright to automatically start your application's server (frontend/backend) before running any tests, and shut it down after the run completes — so you don't need to manually start the app in a separate terminal every time."

**Purpose in plain words:**
Your tests need the app running at some URL (e.g. `localhost:3000`) to actually test anything. Instead of relying on a human to remember "start the dev server first," `webServer` makes Playwright own that responsibility — it launches the server, **waits until it's actually ready**, then runs tests, then optionally kills it.

---

### Syntax

```
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120000,
},
```

### `command`

```
command: 'npm run start',
```

The actual shell command Playwright runs to spin up your app — could be `npm run dev`, `yarn start`, a custom script, or even starting a backend API server. Playwright runs this as a child process.

### `url`

```
url: 'http://localhost:3000',
```

Playwright **polls this URL** after running `command`, waiting for it to return a successful response (i.e. the server is actually up and serving requests) before starting any tests. This prevents the classic race condition where tests start hitting the app before it's finished booting.

### `reuseExistingServer`

```
reuseExistingServer: !process.env.CI,
```

- **`true`** — if a server is **already running** at that `url` (e.g. you already have `npm run dev` running in another terminal locally), Playwright **won't start a new one** — it just reuses what's there. Saves time locally, avoids port conflicts.
- **`false`** — Playwright **always starts a fresh server**, and if one's already running on that port, it typically errors out or fails to bind.

**Why `!process.env.CI` pattern:**

- **Locally** → `true` — you're likely already running the dev server while writing/debugging tests; reusing it is faster and avoids you needing to kill/restart it constantly
- **CI** → `false` (since `process.env.CI` is truthy there, `!process.env.CI` becomes `false`) — CI runners are fresh/ephemeral environments every time, there's never a "pre-existing" server, and you explicitly want a **clean, predictable, freshly-built** server for every pipeline run — no leftover state from a previous run

### `timeout`

```
timeout: 120000,  // 2 minutes
```

Max time Playwright will wait for the server to become ready (i.e. for `url` to respond successfully) before giving up and failing the whole run. Needs to be generous enough for slower CI machines or apps with heavy build steps (e.g. a fresh `npm run build` + `serve` could take longer than a warm local dev server).

---

### Why It's Useful in CI (interview line)

"In CI, there's no human available to manually start the app before tests run. `webServer` makes the pipeline **self-contained** — a single `npx playwright test` command handles building/starting the app, waiting for readiness, running tests, and tearing the server down afterward. It removes an entire manual step from the pipeline and eliminates flaky 'tests started before app was ready' failures."

> Trap question: *"What happens if `command` fails to start the server at all?"* → The test run fails immediately with a clear error, since Playwright never gets a successful response from `url` within `timeout`.

---

## `reporter` Deep Dive

**Interview definition:**
"`reporter` is a root-level config option that controls the **format and destination** of your test results output — from simple terminal output to rich HTML reports to CI-integration formats like JUnit XML."

---

### Single Reporter Format

```
reporter: 'html',
```

Just a string — one reporter, default options.

### Array Format — Multiple Reporters at Once

```
reporter: [
  ['line'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'test-results.json' }],
  ['junit', { outputFile: 'results.xml' }],
],
```

Each entry is a `[reporterName, optionsObject]` tuple. You can run **multiple reporters simultaneously** — e.g. show live terminal output *and* generate an HTML report *and* export JSON for another tool, all from one test run.

---

### Built-in Reporters — What Each Does & When to Use

| Reporter | What it does | Best used for |
| --- | --- | --- |
| **`list`** (default) | Prints each test as a line in the terminal, with pass/fail status, in real time | Local development — see progress as tests run |
| **`line`** | Similar to `list` but more condensed — overwrites the current line instead of printing every test on a new line | CI logs — cleaner, less noisy output when running many tests |
| **`dot`** | Minimal — just prints a `.` (pass) or `F` (fail) per test, almost no output | Very large suites in CI where verbose logs aren't needed — fastest to scan, least noisy |
| **`html`** | Generates a rich interactive HTML report — screenshots, traces, filterable by status, drill into each test | Local debugging, sharing results with team, post-run investigation |
| **`json`** | Outputs structured JSON with full result data | Feeding results into custom dashboards, scripts, or other tooling programmatically |
| **`junit`** | Outputs JUnit-format XML | Integrating with CI tools that understand JUnit natively — **Jenkins**, **Azure DevOps**, GitLab CI test result tabs |

---

### `open: 'never'` — Critical CI Setting

```
['html', { open: 'never' }],
```

By default, the HTML reporter **automatically opens a browser tab** showing the report when the run finishes. That's fine locally, but in **CI, there's no browser/display** — attempting to auto-open would either hang or error. `open: 'never'` disables that auto-open behavior, so the report is still **generated** (as a file you can download/host as a CI artifact) but never tries to launch a browser window.

Other values: `open: 'always'` (always opens, even in CI — rarely desired), `open: 'on-failure'` (only opens if something failed).

> Interview line: "`open: 'never'` is a must-have for CI pipelines using the HTML reporter — without it, you risk the pipeline hanging or throwing errors trying to open a browser in a headless CI environment."

---

### Custom Reporter

```
reporter: [
  [require.resolve('./custom-report/metrics-reporter')],
],
```

You can write your own reporter as a class implementing Playwright's `Reporter` interface (hooks like `onTestEnd`, `onBegin`, `onEnd`) — used when you need custom behavior, like pushing results to Slack, a custom dashboard, or calculating specific pass/fail metrics not covered by built-in reporters.

---

### Practical CI Combo (commonly asked "what would you configure" question)

```
reporter: [
  ['line'],                                        // live terminal feedback during run
  ['html', { open: 'never' }],                      // rich report, saved as CI artifact
  ['junit', { outputFile: 'results.xml' }],          // for CI tool's native test results tab
],
```

This trio covers: real-time visibility, deep-dive debugging (HTML), and CI-native integration (JUnit) — a very standard real-world setup.

---

