# Framework Architecture & Design Decisions

### 1. How would you scale an automation framework from 100 tests to 10,000 tests?

- Move from flat test files to a layered structure — Page Objects / Component Objects + reusable fixtures
- Enforce parallelization from day one (workers, sharding) so suite time doesn't grow linearly
- Split suites by tag/type (smoke, regression, API) so you don't always run everything. In each release , focus more on products specific suite instead of all products suite or narrow down. Merge multipls scenarios in 1 scenario in automation.
- Externalize test data and config (env files, JSON/YAML) instead of hardcoding
- Add CI sharding across multiple machines once local parallelism maxes out
- Introduce ownership — each team maintains its own module, with a shared "core" library for utils

### 2. If you were building a Playwright framework for 5000+ tests, how would you design it?

- Modular structure: `pages/`, `fixtures/`, `utils/`, `tests/`, `config/`
- Custom fixtures for auth, API clients, test data setup/teardown
- Use `projects` in config for browser/env matrix instead of duplicating tests
- Centralized locator strategy (data-testid based) to reduce flakiness at scale
- Reporting + tracing enabled only on failure to keep CI fast
- Test tagging (`@smoke`, `@regression`) for selective execution

### 3. How would you design a scalable Playwright framework from scratch?

- Start with folder structure and naming conventions before writing a single test
- Decide POM vs Screenplay pattern early — POM is usually enough for most teams
- Build fixtures for common setup (login, API seeding) so tests stay DRY
- Add config layering: base config + per-env overrides
- Bake in CI from day 1, not as an afterthought — catches environment issues early

### 4. Why did you choose your current framework architecture?

- Picked based on team skillset, app type (SPA vs API-heavy), and CI constraints
- POM chosen for readability and easy onboarding of new QA members
- Fixtures over `beforeEach` hooks for better composability and reuse
- Config-driven environment switching to support QA/staging/prod without code changes

### 5. What would you do if developers refuse to add stable locators (data-testid)?

- Explain the cost: brittle CSS/XPath selectors = flaky tests = wasted dev+QA time
- Show a before/after example where a single class rename broke 20 tests
- Propose it as part of "Definition of Done" for new UI components
- If still blocked, fall back to `getByRole`/`getByText` with accessible attributes — better than CSS/XPath anyway
- Escalate as a quality risk to engineering leadership if it's a recurring blocker

### 6. How would you create a reusable element interaction wrapper?

- Wrap common actions (click, fill, waitFor) in a helper class/module
- Add built-in retry/logging inside the wrapper so every call gets it for free
- Accept a `Locator` object, not raw selectors, to stay Playwright-idiomatic
- Example: `async function safeClick(locator) { await locator.waitFor(); await locator.click(); }`
- Keeps tests clean and centralizes any future changes (e.g., adding screenshots on failure)

### 7. How would you create a reusable login utility using Playwright?

- Create a `LoginPage` class encapsulating locators + login steps
- Expose a `login(username, password)` method
- Wrap it in a custom fixture so any test can just declare `{ loggedInPage }` as a dependency
- Fixture handles setup (login) and teardown (logout/clear storage) automatically
- Bonus: cache auth state via `storageState` to skip UI login for most tests

### 8. How do you write a custom fixture for authentication?

- Define fixture in `fixtures.ts` extending Playwright's base `test`
- Inside, perform login via UI or API call, save `storageState`
- Return an authenticated `page`/`context` to the test
- Use `test.use({ storageState: 'auth.json' })` for tests that don't need fresh login every time
- Keeps auth logic in one place instead of repeated in every test file

### 9. How do you manage automation across multiple browsers and environments?

- Use the `projects` array in `playwright.config.ts` — one project per browser (chromium/firefox/webkit)
- Each project can have its own `use` block (baseURL, viewport, storageState)
- Environment switching handled via env variables read into config, not hardcoded
- CI matrix can trigger specific projects independently for faster feedback

### 10. How do you manage dependencies between test cases?

- Prefer independent tests — dependencies are a smell, but sometimes unavoidable
- Use `test.describe.serial()` when tests must run in order within a file
- Use `projects` with `dependencies` in config for cross-file/setup dependencies (e.g., a "setup" project that runs before main tests)
- Avoid shared mutable state between tests; pass data via fixtures instead

### 11. How do you handle frequently changing locators?

- Push for stable attributes (`data-testid`) as the primary contract with dev team
- Centralize locators in Page Object classes so a change means editing one file, not many
- Avoid deep CSS/XPath chains tied to DOM structure
- Add a locator review step when UI changes are planned

### 12. How do you handle loading spinners or progress indicators?

- Never use hard waits (`waitForTimeout`) for spinners
- Wait for the spinner to disappear: `await expect(spinner).toBeHidden()`
- Better yet, wait for the actual result element/state that follows the spinner
- If spinner tied to network call, use `page.waitForResponse()` instead

### 13. How do you handle dynamically loaded elements?

- Use Playwright's auto-waiting — actions already wait for actionability
- For lists/infinite scroll, wait for element count or specific text: `await expect(locator).toHaveCount(n)`
- Avoid `waitForTimeout`; use `waitForSelector`/`toBeVisible` assertions instead
- For lazy-loaded content, trigger the scroll/action that causes load, then assert

### 14. How do you interact with hidden or disabled elements?

- Determine if hidden is intentional (e.g., behind a modal) — fix test flow instead of forcing interaction
- Use `{ force: true }` only as a last resort, since it bypasses actionability checks
- For disabled elements, assert `toBeDisabled()` rather than trying to interact
- If element is visually hidden but needed, check if it's a CSS issue worth flagging to devs

### 15. How do you handle third-party dependencies in UI automation?

- Mock/stub third-party calls where possible using `page.route()`
- Avoid hard dependency on external services in critical path tests — flaky and slow
- For payment gateways/OAuth, use sandbox/test environments provided by the vendor
- Keep a small set of true E2E tests hitting real third parties; mock the rest

### 16. How do you maintain automation scripts in Agile environments?

- Keep a fast smoke suite that runs on every PR, full regression nightly
- Regularly review and delete obsolete/duplicate tests
- Pair with devs on locator strategy to provide us stable locators like testdataid etc.
- In each sprint we have progression features, we select regression scenarios from them and let our arch knows and in next sprint we automate it. If only small change is req then we update our existing suite in same sprint.
- Our script mainatinace and optimization are part of daily resp with code reviews with team and copilot.

### 17. How do you validate email/SMS/downstream flows in end-to-end automation?

- Use test tools/APIs like Mailosaur, Mailtrap, or a test inbox API instead of real email
- For SMS, use provider sandbox/test numbers (e.g., Twilio test credentials)
- Validate via API response/webhook rather than UI where possible
- Keep these tests isolated since they depend on external services — mark them separately in CI
