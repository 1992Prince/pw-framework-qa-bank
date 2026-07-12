
# ROI & Estimations

### 1. How do you evaluate ROI of automation using Playwright?

- Compare manual execution time vs automated execution time over multiple release cycles
- Factor in maintenance cost — automation isn't free, ongoing upkeep matters
- Track defects caught by automation vs manual to show quality impact
- ROI = (manual hours saved × hourly cost) − (automation build + maintenance cost)

### 2. How do you measure the effectiveness of automation?

- Defect detection rate — bugs caught pre-release by automation
- Suite stability — flaky test % should trend down over time
- Execution time trend — should reduce or stay flat as coverage grows
- Coverage of critical user journeys, not just raw test count

### 3. How would you convince stakeholders of the ROI of automation?

- Present time saved per release cycle in hours/cost, not just "tests pass"
- Show reduced regression testing time (e.g., 3 days manual → 2 hours automated)
- Highlight faster release cycles enabled by automation confidence
- Use a pilot module with before/after metrics as proof before scaling

### 4. How would you convince a team to migrate from Selenium to Playwright?

- Faster, more reliable auto-waiting — less flaky than Selenium's explicit waits
- Built-in parallelization and tracing/debugging tools out of the box
- Native support for multiple browser contexts without extra grid setup
- Smaller boilerplate, faster test authoring — show a side-by-side comparison
- Run a proof-of-concept on one module to demonstrate before full migration

### 5. What are the most common causes of automation failures?

- Flaky locators (non-stable selectors)
- Timing issues — hard waits or missing waits for async behavior
- Environment/data issues, not actual app bugs
- Test interdependency — one test's leftover state affecting another
- Third-party service instability in the test path

### 6. When would you decide not to automate a test case?

- One-time or rarely executed scenarios
- Highly exploratory/UX-judgment based testing
- Tests where UI is expected to change frequently (short-term feature)
- Cases where automation cost outweighs the time saved over its lifetime
- Tests requiring heavy manual/visual judgment (e.g., subjective design checks)

### 7. How do you estimate automation effort for a feature?

- Classify feature complexity first:
  - **Simple** — single page, no API dependency, few validations
  - **Medium** — UI + API interaction + some dependencies (auth, data setup)
  - **Complex** — multi-step flows, third-party integrations, multiple environments/data states
- Estimate based on number of scenarios × average time per scenario type
- Add buffer for framework/utility work if reusable components don't exist yet
- Communicate estimate as a range, refine after spike/investigation if needed

### 8. How would you attach logs, API requests, or response payloads to a report?

- We don't use Allure currently — using Playwright's built-in HTML reporter instead
- Attach logs/data via `testInfo.attach()` inside the test
- Capture API request/response bodies and attach as JSON when a test fails
- Screenshots/videos/traces already attach automatically on failure via config

### 9. How would you send automation reports automatically through email or Slack?

- CI pipeline runs tests, then triggers a notification step post-execution
- Email: CI job sends HTML report link/summary to dev + QA distribution list
- Slack: use a webhook step in CI to post pass/fail summary with report link
- Keep notification concise — pass/fail count + link to full report, not full logs

### 10. How would you integrate automation reports with Jira/defect trackers?

- On failure, auto-create a Jira ticket via API with test name, error, and screenshot
- Tag tickets with a label (e.g., `auto-detected`) for triage visibility
- Link existing open bugs to known-flaky/known-failing tests to avoid duplicate tickets
- Some teams prefer a manual triage step before auto-filing to avoid ticket noise
