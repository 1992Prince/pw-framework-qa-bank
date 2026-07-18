
## Playwright Reports

- "A report is the output generated after a test run that tells you what passed, failed, skipped, or was flaky — along with supporting evidence like screenshots, videos, and traces."
- "Playwright lets you generate multiple report formats simultaneously, controlled either via config file or CLI flags."

---

#### Different kinds of reporters in Playwright and their purpose:

- 1. **List** *(default reporter)*

   - Purpose: "Prints each test as a line in the console with its pass/fail status in real time. This is what runs by default if you don't specify anything."
   - Enable: `npx playwright test --reporter=list`
- 2. **Dot**

   - Purpose: "Minimal console output — one character per test. Used in CI when you just want a compact pass/fail density view, not full detail."
   - Enable: `npx playwright test --reporter=dot`
- 3. **Line**

   - Purpose: "Like list, but overwrites the current terminal line instead of printing a new line per test — more compact for large suites."
   - Enable: `npx playwright test --reporter=line`
- 4. **HTML** *(most used)*

   - Purpose: "Rich interactive report — filter by status, view trace viewer, screenshots, and step-by-step actions. Standard for local debugging and CI artifact review."
   - Enable: `npx playwright test --reporter=html`
   - View later: `npx playwright show-report`
- 5. **JSON**

   - Purpose: "Machine-readable format, used to feed results into custom dashboards, Slack/Teams notifications, or any downstream tooling — future/programmatic use case."
   - Enable: `npx playwright test --reporter=json`
- 6. **JUnit**

   - Purpose: "XML format understood natively by CI systems — Jenkins, Azure DevOps, GitLab CI — for test trend graphs and native CI test result tabs."
   - Enable: `npx playwright test --reporter=junit`
- 7. **Blob**

   - Purpose: "Playwright's internal binary format — not human-readable. Used specifically for merging reports from sharded/parallel CI runs. Each shard produces a blob file, then you merge them: `npx playwright merge-reports` to produce one combined HTML report."
   - Enable: `npx playwright test --reporter=blob`

---

#### How to enable — Config file, single reporter:

```ts
export default defineConfig({
  reporter: 'html',
});
```

How to enable — Config file, multiple reporters (array of arrays):

```ts
export default defineConfig({
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'my-report' }],
    ['junit', { outputFile: 'results/junit.xml' }],
  ],
});
```

- "Each entry is a `[reporterName, options]` tuple — you can combine as many as needed."

#### How to enable — CLI (overrides config):

```bash
npx playwright test --reporter=html
npx playwright test --reporter=list,html
npx playwright test --reporter=dot
npx playwright test --reporter=json
npx playwright test --reporter=junit
npx playwright show-report
npx playwright test --output=test-results/
```

- "Whatever you pass via CLI takes precedence over what's in the config file — good for a quick one-off run."

---

**Common options:**

- `open: 'never'` — "Prevents the HTML report from auto-opening in the browser, needed in CI where there's no display."
- `outputFolder: 'my-report'` — "Changes where the HTML report is written, instead of the default folder."

---

#### Default output folders — two separate folders, easy to confuse:

1. **`playwright-report/`**

   - "This is where the **HTML report** itself lives — the interactive report you view with `npx playwright show-report`. It contains the latest run's summary, index.html, and bundled trace/screenshot references."
   - "This folder gets overwritten on every run by default — it only reflects the most recent execution."
2. **`test-results/`** *(correct name — not 'playwright-results')*

   - "This is where **raw per-test artifacts** are stored — a separate subfolder is created for each executed test case, named after the test title and project."
   - "Inside each test's folder you'll find its trace.zip, screenshots on failure, videos (if enabled), and error context — this is the raw data the HTML report actually references and displays."
   - "You can change this location using `--output=test-results/` or the `outputDir` config option."

- "So to summarize the distinction clearly: `playwright-report` = the rendered HTML viewer, `test-results` = the raw evidence folder per test that feeds into that viewer and also what CI uploads as build artifacts."

---

#### Senior-level talking point:

- "In CI with sharding, I'd use `blob` per shard, merge them into one report, keep `test-results/` as an uploaded artifact for debugging failures, and separately generate `junit` for the CI dashboard's native test summary — while `dot` or `line` handles fast console feedback during the run itself."


# Q. What are PW Anti-Patterns?

**Definition (speaking line):**
- "Playwright anti-patterns are practices where you bypass the built-in Playwright Test runner and fixtures, and instead manually manage browser lifecycle using the raw Playwright library (`playwright` core APIs) — leading to reinventing things Playwright already gives you for free."

---

# Q. Write a function to accept browser as param, return browser instance, and explain why it's an anti-pattern

### Example Code
```ts
type BrowserName = 'chrome' | 'edge' | 'firefox' | 'webkit';

async function launchBrowser(browserName: BrowserName) {
  console.log('browser name: ', browserName);
  switch (browserName.trim().toLowerCase()) {
    case 'chrome':
      return await chromium.launch({
        headless: false,
        channel: 'chrome',
      });
    case 'edge':
      return await chromium.launch({
        headless: false,
        channel: 'msedge',
      });
    case 'firefox':
      return await firefox.launch({
        headless: false,
      });
    case 'webkit':
      return await webkit.launch({
        headless: false,
      });
    default:
      console.log('invalid browser...', browserName);
      throw new Error(`invalid browser: ${browserName}`);
  }
}

// Calling this
let browser: Browser = await launchBrowser('chrome');
let page: Page = await browser.newPage();
await page.goto(
  'https://naveenautomationlabs.com/opencart/index.php?route=account/login'
);
let title = await page.title();
console.log('page title:', title);
console.log(page.url());
browser.close();
```

### Why this is an ANTI-PATTERN — points to speak

1. **Manual browser factory reinvents what Playwright already provides**
   - "We're writing our own switch-case factory just to launch a browser based on a string — Playwright Test already handles cross-browser launching declaratively via `projects` in config."

2. **Type restriction gives false sense of safety**
   - "Yes, we're using `BrowserName` type so no invalid string can be passed, but this is just compile-time safety we built ourselves — Playwright's `projects` config already restricts and manages this at the framework level, no custom type needed."

3. **No reporting out of the box**
   - "Since we're not using the test runner, we get **no HTML/JSON/JUnit reports** — we'd have to build our own logging/reporting mechanism from scratch."

4. **No test runner benefits at all**
   - "Because this isn't run via `npx playwright test`, we lose: parallelization, retries, sharding, fixtures, hooks (`beforeEach`/`afterEach`), and built-in assertions with auto-waiting/polling."

5. **Not written in a `.spec.ts` file**
   - "This is just a plain `.ts` file executed directly (like via `ts-node` or `node`) — it's not discovered or run by the Playwright Test runner, so none of the CLI features (`--grep`, `--project`, `--repeat-each`, etc.) apply."

6. **Manual lifecycle management = heavy boilerplate**
   - "We're manually calling `browser.newPage()`, manually closing the browser, manually handling failures — all of this is boilerplate that Playwright fixtures (`page`, `browser`, `context`) already inject into every test automatically."

7. **No automatic retry / trace / video / screenshot on failure**
   - "If this script throws mid-way, there's no automatic trace capture, no screenshot-on-failure, no retry logic — all of which come free with the test runner."

---

### The Correct Approach (contrast point)

- "If we just write this as a `.spec.ts` file using Playwright Test runner:"

```ts
import { test, expect } from '@playwright/test';

test('login page title check', async ({ page }) => {
  await page.goto(
    'https://naveenautomationlabs.com/opencart/index.php?route=account/login'
  );
  await expect(page).toHaveTitle(/Account Login/);
});
```

- "All of the following comes for free — no boilerplate needed:"
  - Browser/context/page lifecycle management (via fixtures)
  - Cross-browser execution via `projects` in `playwright.config.ts`
  - Reporting (HTML, JSON, JUnit, etc.)
  - Retries (`retries` config)
  - Parallelization & sharding
  - Auto-waiting assertions (`expect(...).toHaveTitle()`)
  - Trace/video/screenshot capture on failure

---

### Closing / senior-level framing

- "So the core anti-pattern here is **not using the test runner and fixtures Playwright is built around** — writing your own browser factory duplicates framework-level functionality, adds maintenance burden, and strips away reporting, retries, and debugging tools that come free the moment you adopt `test()` from `@playwright/test` inside a `.spec.ts` file."