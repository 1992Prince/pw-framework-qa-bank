
# Playwright QA Automation — Interview Revision Notes

---

## 1. Framework Design & Architecture ⭐⭐⭐⭐⭐

### Q1–Q3: Scalable Framework Design / Architecture

**Questions:**

- How would you design a scalable Playwright automation framework from scratch for 5000–10,000+ test cases?
- How would you scale an existing automation framework from 100 tests to 10,000 tests?
- Explain your framework architecture. Why did you choose this design?

**Golden rule:** No single fixed framework works for all cases — but scalable frameworks always follow these principles:

- **Layered architecture** → Test layer → Page Objects → Utils/Core → Config/Data
  - Ex: `LoginPage.ts extends BasePage.ts`
- **POM / Component model** → UI logic lives in page classes, not in specs
- **Fixtures** → reusable setup instead of copy-paste
  - Ex: `loggedInPage` fixture instead of calling `login()` in every test
- **Externalize data/config** → JSON/YAML/`.env`, no hardcoding
  - Ex: `qa.env`, `prod.env` — same code, different creds
- **Utils folder** → logger, csvUtil, dbClient, apiClient, fakerUtil
- **Parallelization from day 1** → workers + sharding, not bolted on later
- **Tag-based suites** → `@smoke`, `@regression`, `@api`
  - Ex: run only `@smoke` on every PR, full suite nightly
- **CI sharding** → split across machines once local workers max out
- **Module ownership** → each team owns its module + shared core lib
- **Centralized locators** → `data-testid`-based → less flakiness
- **Trace/video only on failure** → keeps CI fast
- **SOLID + patterns**, but keep it simple → don't over-engineer

> **One-liner for "why this design?"**
> "Framework becomes a scale problem, not a testing problem — so I focus on flat maintenance cost + sub-linear execution time as tests grow."

---

### Q4–Q5: BasePage & Reusable Element Interaction Wrapper

**Questions:**

- How does your BasePage look? What reusable methods do you keep there and why?
- How would you create a reusable element interaction wrapper? What problems does it solve?

**Pattern used:** Template Method → abstract `BasePage`, all POMs extend it.

- Abstract `isAt()` → every page must self-validate its load state
  - Ex: `isAt() { expect(page).toHaveURL(/login/) }`

**Why a wrapper layer even though Playwright auto-waits?**

- Extra defensive checks (visible + enabled before click)
- Centralized logging → catch block logs which page, which element failed
- Consistency → every `click()`/`fill()` behaves the same everywhere
- Single point of change → update one method, not 1,000 files

**Common wrapper methods:**

| Method                      | Purpose                                |
| --------------------------- | -------------------------------------- |
| `click()`                 | wait visible + enabled → click → log |
| `fill()`                  | clear first → fill → log             |
| `selectDropdown()`        | native`<select>` wrapper             |
| `selectFromAutosuggest()` | type + click matching option           |
| `verifyText()`            | assertion wrapper with log             |

```typescript
// core/BasePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Every child Page Object MUST implement this to validate
   * that the page has actually loaded before interactions begin.
   */
  abstract isAt(): Promise<void>;

  /** Safe click with logging + defensive visibility/enabled check */
  async click(locator: Locator, name = 'element'): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toBeEnabled();
      await locator.click();
      logger.info(`Clicked on ${name}`);
    } catch (err) {
      logger.error(`Failed to click on ${name} at page: ${this.page.url()}`);
      throw err;
    }
  }

  /** Safe fill with clear-before-type and logging */
  async fill(locator: Locator, value: string, name = 'field'): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.fill(''); // clear first — defensive
      await locator.fill(value);
      logger.info(`Filled "${name}" with value: ${value}`);
    } catch (err) {
      logger.error(`Failed to fill "${name}" at page: ${this.page.url()}`);
      throw err;
    }
  }

  /** Wrapper for native <select> dropdowns */
  async selectDropdown(locator: Locator, value: string, name = 'dropdown'): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.selectOption({ label: value });
      logger.info(`Selected "${value}" from ${name}`);
    } catch (err) {
      logger.error(`Failed to select "${value}" from ${name} at page: ${this.page.url()}`);
      throw err;
    }
  }

  /** Wrapper for custom autosuggest/typeahead dropdowns */
  async selectFromAutosuggest(
    inputLocator: Locator,
    optionLocator: (text: string) => Locator,
    value: string,
    name = 'autosuggest field'
  ): Promise<void> {
    try {
      await inputLocator.fill(value);
      const option = optionLocator(value);
      await option.waitFor({ state: 'visible' });
      await option.click();
      logger.info(`Selected "${value}" from ${name} (autosuggest)`);
    } catch (err) {
      logger.error(`Failed to select "${value}" from ${name} (autosuggest) at page: ${this.page.url()}`);
      throw err;
    }
  }

  /** Generic text assertion wrapper */
  async verifyText(locator: Locator, expectedText: string, name = 'element'): Promise<void> {
    try {
      await expect(locator).toHaveText(expectedText);
      logger.info(`Verified text on ${name}: "${expectedText}"`);
    } catch (err) {
      logger.error(`Text mismatch on ${name} at page: ${this.page.url()}`);
      throw err;
    }
  }
}
```

**Why a wrapper layer at all** (spoken summary):

- Playwright already has strong auto-waiting built in, but a wrapper layer still solves real problems:
  - Defensive coding on top of auto-wait (extra explicit conditions for flaky elements, dynamic content)
  - Centralized error handling & logging — catch block logs exactly which page/element failed
  - Consistency — every click/fill/select behaves the same, instead of every author writing raw Playwright calls differently
  - Single point of change — if Playwright's API changes or a new retry strategy is needed, update one wrapper method instead of thousands of test files

---

### Q6: Improving an Inherited Framework

**Question:** What improvements would you make if you inherited an automation framework designed by another team?

> **Approach:** Assess first, then improve incrementally — not rewrite from scratch.

**Step 1 — Review & Audit**

- Understand current structure, run the suite, identify flaky tests, check CI integration, map missing best practices

**Step 2 — Prioritize and fix incrementally**

1. Naming conventions — consistent naming for pages, classes, methods, variables (biggest quick win for readability)
2. Remove hardcoding — move data/config out of test files into external config
3. Eliminate hard waits (`page.waitForTimeout()`) — replace with proper auto-wait / explicit conditions
4. Enforce modular structure — introduce/clean up POM layering if missing
5. Test data management — centralize into JSON/CSV/DB-backed fixtures
6. Test segregation via tagging — run smoke vs regression vs full suite selectively
7. Then move to deeper concerns: parallelization, flaky test quarantine, reporting, CI sharding

> **Key interview point:** Improvements are prioritized by ROI and risk — quick, low-risk wins (naming, hard waits) come first; structural changes (re-architecting POM layers) come later once the team trusts the direction.

---

### Q7: Migrating Selenium → Playwright

**Question:** How would you migrate an existing Selenium framework to Playwright?

If the existing Selenium framework already follows good practices (modular, POM-based, wrapper-driven), a full rewrite is **not necessary** — only the underlying engine changes.

**Approach:**

- Keep the framework's architecture intact — Page Objects, test structure, data management, and business logic stay the same
- Only swap the driver/engine layer — replace Selenium's WebDriver calls inside wrapper methods (`click()`, `fill()`, `selectDropdown()`, etc.) with Playwright API calls. Since interactions already go through the wrapper layer (not raw Selenium calls scattered across specs), this becomes a localized, low-risk change instead of a framework-wide rewrite
- Leverage AI/Copilot-assisted migration — for boilerplate conversion (Selenium locators → Playwright locators, `WebDriverWait` → Playwright auto-wait)
- Validate incrementally — migrate module by module, run both suites in parallel during transition to compare stability/flakiness before fully cutting over

---

### Q8: Sample Page Object Model for Login Page

*(To be filled in — sample POM implementation)*

---

## 2. Framework Configuration & Execution ⭐⭐⭐⭐⭐

### Q1: How do you manage configurations for multiple environments (QA, UAT, Stage, Prod)?

> **Speakable line:** "I use a single frozen config object where every value falls back to an environment variable — so switching environments is just changing CI variables, with zero code changes and no risk of accidentally editing hardcoded values."

```typescript
export const config = Object.freeze({
  // Target environment — override with ENV in CI
  env:           process.env.ENV           ?? 'staging',

  // Application URL — override with APP_URL in CI
  appUrl:        process.env.APP_URL        ?? 'https://eventhub.rahulshettyacademy.com/login',
  appSTGUrl:     process.env.APP_URL        ?? 'https://eventhub.rahulshettyacademy.com/login',
  appE2E2Url:    process.env.APP_URL        ?? 'https://eventhub.rahulshettyacademy.com/login',

  // API / service base URL — override with API_URL in CI
  apiUrl:        process.env.API_URL        ?? 'https://api.staging.myapp.com',

  // Service credentials — override with SERVICE_USER / SERVICE_PASSWORD in CI
  serviceUser:   process.env.SERVICE_USER   ?? 'eventhubtestuser1@gmail.com',
  servicePassword: process.env.SERVICE_PASSWORD ?? 'Eventhub@2026',

  // Build number injected by CI pipeline — override with BUILD_NO in CI
  buildNo:       process.env.BUILD_NO       ?? 'local',
});
```

- CI overrides values via environment variables; passwords are kept in CI secrets
- `.env` file approach is also a valid alternative

---

### Q2: How do you run the same suite across multiple browsers, devices, and environments?

> **Speakable line:** "I define separate Playwright projects per browser in the config file, so the exact same test suite runs against Chromium, Edge, and Firefox without duplicating a single line of test code."

- Cross-browser execution uses **separate projects** in `playwright.config.ts` — one each for Chromium/Edge, Chrome, and Firefox — where the same suite runs against each
- Environment is configured the same way as above (via env variables/config object)

---

### Q3: How do you design authentication so login happens only once? (Fixtures / Storage State)

> **Speakable line:** "I do a one-time global login, save the storage state to a JSON file, and every subsequent test reuses that session — this cuts redundant logins and speeds up the whole suite, though it only works for session-based auth, not SSO, OTP, or auth popups."

- A global setup function performs login once and saves session details to a JSON file
- Subsequent tests start directly from the logged-in state — no need to log in again
- Storage state can be provided at the `use` block, project `use` block, or `test.use()` level
- **Limitation:** this only works for session-based auth. It does **not** work for SSO, OTP, or auth popups

---

### Q4: How do you make your framework execution-ready for CI/CD pipelines?

> **Speakable line:** "My framework is CI-first — headless by default, retries only turned on in CI, workers tuned to CI resources, and I only capture trace, video, and screenshots on failure so the pipeline stays fast and artifacts stay lightweight."

- **Headless mode** enabled by default in CI (`headless: true`)
- **Retries** configured for flaky tests, CI-only: `retries: process.env.CI ? 2 : 0`
- **Parallel workers** tuned for CI resources: `workers: process.env.CI ? 4 : undefined`
- **Reporters:** `html`, `junit` (for CI dashboards like Jenkins/Azure), and `github` reporter for GitHub Actions annotations
- **Trace/video/screenshot** on failure only, to save CI storage: `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`
- **Docker:** use the official Playwright Docker image to avoid browser install issues in CI runners
- **Artifacts:** upload `playwright-report/` and `test-results/` as CI build artifacts for debugging failures

---

### Q5: How do you handle parallel execution safely?

> **Speakable line:** "Playwright gives every test its own browser context by default, so tests are fully isolated with no shared cookies or storage — I only force serial execution for the rare cases where tests genuinely depend on each other."

- **Test isolation:** each test gets its own `BrowserContext` (Playwright does this by default) — no shared cookies/storage between tests
- Fixtures are scoped at the **test level**, not the worker level
- **Serial mode when needed:** for tests that must run in sequence (e.g., dependent steps), use `test.describe.serial()`

---

## 3. Test Design & Test Data ⭐⭐⭐⭐

### Q1: How do you manage test data in a large automation framework?

> **Speakable line:** "I keep test data in JSON files, one per spec, structured as an object keyed by test case name — that keeps data external, version-controlled, and easy to update without ever touching test logic."

- Test data lives in JSON files — one JSON file per spec
- JSON is structured as an object of objects, keyed by test case name
- The JSON file is imported into the spec file as a JS object

---

### Q3: How do you handle dependencies between test cases?

> **Speakable line:** "I keep tests independent by default since that's the best practice, but when a real dependency exists — like a multi-step checkout flow — I group those tests in a serial describe block instead of hacking around it with shared state."

- Tests are kept independent by default
- If dependency is required, group tests inside a `describe` block and run them in **serial** mode
- At a higher level, `projects` in the config file can also be set up with dependencies

---

### Q4: How do you organize Smoke, Sanity, Regression, and End-to-End suites?

> **Speakable line:** "I tag every test with @smoke, @sanity, or @regression and filter with grep to run the right subset — those commands live as npm scripts in package.json so anyone on the team can trigger the right suite without memorizing CLI flags."

- All tests are tagged with `@smoke`, `@sanity`, `@regression`, etc.
- Suites are executed using `--grep` against the relevant tag
- These commands are saved as scripts in `package.json` under a scripts section

---

### Q5: How do you decide what should and should not be automated?

> **Speakable line:** "Automation decisions come down to ROI — I automate stable, high-value, defect-prone flows, and I deliberately skip unstable UI, third-party integrations, and legacy non-web flows because they cost more to maintain than they save."

**Automate:**

- Stable flows / user journeys
- Flows that produce a lot of defects
- High-criticality business flows
- Regression suites (core automation purpose)
- Regression scope should be defined per release, and regularly maintained, updated, and optimized

**Do NOT automate:**

- Third-party integrations
- Desktop integration flows or legacy, non-web scenarios
- Unstable apps / UI that changes very frequently — keep automation at the API level only in such cases

---

## 4. Locator & Synchronization ⭐⭐⭐⭐⭐

### Q1: How do you manage frequently changing locators?

> **Speakable line:** "I prioritize role and accessibility-based locators over CSS or XPath because they're tied to user-facing semantics, not implementation details, so a markup refactor doesn't break my tests — and where locators still churn, I push the dev team to add stable data-testid attributes during grooming."

- Preferred locator strategy: **Role-based or Accessibility-based** first; CSS/XPath is the fallback and is avoided where possible
- During grooming/planning, ask the dev team to add `data-testid` or other stable locators
- For elements that change, use partial-content-based or `starts-with` / `ends-with` XPath patterns

---

### Q2: What locator strategy do you follow for long-term maintainability?

> **Speakable line:** "Long-term maintainability comes down to locator resilience — role and accessibility locators survive DOM changes that would break brittle CSS or XPath selectors, so that's always my first choice."

- Same as above: **Role-based / Accessibility-based** locators preferred; CSS/XPath avoided as a first choice

---

### Q3: How do you handle dynamic elements and dynamically loaded content?

> **Speakable line:** "Playwright's auto-wait handles most dynamic content out of the box, but for edge cases — like elements that get replaced or content that streams in — I add explicit waitFor states as a defensive layer on top of auto-wait."

- Role-based / Accessibility-based locators preferred over CSS/XPath
- Playwright's auto-wait ensures elements are actionable, but explicit locator conditions are still used when needed:
  ```typescript
  await locator.waitFor({ state: 'visible' | 'hidden' | 'attached' | 'detached' });
  ```

---

### Q4: How do you ensure loading spinners/skeleton loaders have completely disappeared before interacting?

> **Speakable line:** "I explicitly wait for the spinner to appear and then wait for it to disappear before interacting — that way I never race a loading state, which is a common source of flakiness."

```typescript
await locator.waitFor({ state: 'visible' });
await locator.waitFor({ state: 'hidden' });
```

---

### Q5: How do you synchronize tests without using hard waits?

> **Speakable line:** "I rely entirely on Playwright's built-in actionability checks and explicit waitFor states — I never use waitForTimeout because it's either too short and flaky or too long and slows the whole suite down."

- Use built-in waiting strategies: page-level waits and locator-level waits (auto-wait + explicit `waitFor` states) instead of `page.waitForTimeout()`

---

### Q6: How do you interact with hidden, disabled, or off-screen elements?

> **Speakable line:** "Playwright auto-waits and runs actionability checks — attached, visible, stable, enabled, and receiving events — before any action, so most of this is handled for me. But for elements that are intentionally hidden, disabled, or off-screen, I use targeted overrides instead of fighting the auto-wait."

* **Playwright's built-in actionability checks** before every action: `Attached` → `Visible` → `Stable` → `Enabled` → `Receives Events`
* **Hidden elements** (not meant to be visible yet):
  * Explicitly wait: `await locator.waitFor({ state: 'visible' })`
  * If you genuinely need to interact with something hidden (e.g., a hidden file input), bypass the visibility check: `await locator.click({ force: true })` — used sparingly, since it skips actionability
* **Disabled elements** :
* Wait until enabled: `await expect(locator).toBeEnabled()` or `await locator.waitFor({ state: 'attached' })` combined with an enabled check
* If the goal is just to assert it's disabled (not interact), use `await expect(locator).toBeDisabled()`
* **Off-screen elements** :
* Playwright auto-scrolls into view before acting, but you can do it explicitly: `await locator.scrollIntoViewIfNeeded()`
* Then proceed with the normal `click()`/`fill()`
