
## 6. API & Third-Party Integrations ⭐⭐⭐⭐

**Q1: How do you automate APIs together with UI tests?**

- Playwright provides both a `page` fixture and a `request` fixture in every test, and both share the same browser context/session
- This means you can log in via UI, then use the `request` fixture to hit APIs using the same authenticated session — or seed data via API and verify it in the UI
- Common pattern: use API calls for fast test setup/teardown (e.g., creating a user, adding items to cart) and UI only for the actual flow under test — reduces test time significantly

**Q2: How do you validate Email/SMS/OTP/Downstream integrations?**

- Playwright has no built-in method to read emails, SMS, or OTPs directly
- Third-party libraries/services are used depending on the channel:
  - Email: Mailosaur, Ethereal, Gmail API, or a test mailbox with IMAP access
  - SMS/OTP: Twilio test credentials, or backdoor APIs exposed by the dev team for lower environments (e.g., an endpoint that returns the OTP value in QA)
- In lower environments, it's common to ask the dev team for a bypass — a fixed/static OTP or a backdoor API — instead of automating real message retrieval

**Q3: How do you mock third-party APIs or unavailable services?**

- Third-party services/APIs are generally not automated end-to-end
- Instead, they're mocked to return a fixed/expected response when hit (e.g., payment gateway endpoints)
- Playwright supports this via network interception:
  - `page.route()` — intercept a request and fulfill it with a custom mock response
  - `route.continue()` — let the request pass through, optionally modifying it
  - `route.fulfill()` — respond with mock data without hitting the real service at all
- This keeps tests fast, deterministic, and independent of third-party uptime/rate limits

**Q4: How do you manage third-party dependencies in UI automation?**

- In lower environments, the preferred approach is to ask the dev team to disable third-party integrations rather than automate around them
- Most third-party dependencies are not web-based/interactable anyway (e.g., native SDKs, external redirects), which makes automation unreliable
- Where disabling isn't possible, fall back to mocking (as in Q3)

---

## 7. Flaky Tests & Stability ⭐⭐⭐⭐⭐

**Q1: How do you reduce flaky tests in a large automation suite?**

- Configure a controlled retry count (e.g., `retries: 1` in CI) as a safety net — not a fix, just a buffer against transient issues
- Prefer accessibility/role-based locators over brittle CSS/XPath, since they're less likely to break with markup changes
- Avoid hard waits (`waitForTimeout`) — rely on Playwright's auto-wait and explicit `waitFor` states
- Ensure proper test isolation (fresh browser context per test, no shared state/data between tests)
- Stabilize test data — avoid tests fighting over the same records/users
- Quarantine known-flaky tests into a separate tag (e.g., `@flaky`) so they don't block the pipeline while being fixed
- Monitor flaky tests over time (e.g., via CI dashboards) to catch patterns instead of ignoring one-off failures

**Q2: How do you debug flaky tests?**

- A test that fails and then passes on retry (without any code change) is generally flaky rather than a genuine defect
- Even though it "passes eventually," it still needs to be investigated and handled properly — repeated flakiness erodes trust in the suite
- Debugging approach: check trace/video/screenshot from the failed run, look for timing issues (element not ready, network delay, animation), check if it fails only in parallel (shared data/session issue), and check if it's environment-specific (CI vs local)
- Once the root cause is identified, fix it properly (better wait condition, test isolation, unique test data) rather than just increasing retries

**Q3: How do you implement retries without hiding genuine failures?**

- Keep retry count low (1–2) — high retry counts mask real bugs instead of surfacing them
- Enable retries only in CI, not locally (`retries: process.env.CI ? 2 : 0`) — locally you want to see real failures immediately
- Track retry data in reports — if a test needed a retry to pass, flag/log it separately so it's visible even though the suite is "green"
- Set up a recurring process (e.g., weekly) to review tests that are frequently retried and fix or quarantine them, instead of letting retries silently hide instability
- Capture trace only on retry (`trace: 'on-first-retry'`) so you have debugging evidence exactly when a retry happens

**Q4: If you join a project with 3000 flaky automation tests, what would be your step-by-step approach to stabilize the framework?**

- **Step 1 — Triage:** Run the full suite multiple times to identify which tests are consistently flaky vs which fail only occasionally; categorize by failure type (locator issue, timing issue, data issue, environment issue)
- **Step 2 — Quarantine:** Move the worst offenders into a `@flaky` or `@quarantine` tag so they stop blocking CI/PR pipelines while being fixed — the rest of the suite can still deliver value
- **Step 3 — Root-cause common patterns:** Flaky tests usually cluster around a few root causes (hard waits, shared test data, non-unique locators, missing auto-wait). Fix the underlying pattern once and it resolves many tests at once
- **Step 4 — Fix highest-impact tests first:** Prioritize by how often the test runs (smoke/regression tests first) and how many other tests share the same broken pattern
- **Step 5 — Introduce guardrails:** Add linting/code review rules to prevent new flaky patterns (e.g., ban `waitForTimeout` in PR checks)
- **Step 6 — Re-integrate gradually:** As quarantined tests are fixed, move them back into the main suite one by one, validating stability over several runs before trusting them fully
- **Step 7 — Monitor long-term:** Set up flaky-test tracking/dashboards so new flakiness is caught early instead of accumulating again

---

## 8. Framework Maintenance ⭐⭐⭐⭐

**Q1: How do you maintain automation scripts in a fast-changing Agile environment?**

- Scripts are kept updated, maintained, and optimized every sprint — maintenance effort is explicitly planned for, not treated as leftover work
- Whenever the product has flow changes or new features that need to be part of regression, a walkthrough call is scheduled with the QA team early in the sprint (right after sprint planning), so the team understands what's changing and what's new
- If updating existing scripts requires minimal effort, the team makes the changes quickly within the same sprint
- If a major UI or flow change has happened, or new features need full automation, the team estimates the effort properly and schedules it into upcoming sprints rather than rushing it
- This keeps automation aligned with the product instead of automation lagging behind and becoming stale/broken

---

## 9. Debugging & Troubleshooting ⭐⭐⭐⭐⭐ (Very Common for Leads)

**Q1: A test passes locally but fails in CI. How will you debug it?**

- Development and local testing are done inside the same Docker containers/images used in CI, so the local and CI environments are consistent — this prevents most "works on my machine" issues by design
- Once a script is stable in the Docker container locally, it's considered CI-ready
- If a failure still happens in CI, results (screenshots, videos, traces) are pulled locally via volume mounting from the container, inspected, and the script is fixed — usually with additional conditional waits or environment-specific handling

**Q2: A test fails only in parallel execution. What could be the reasons?**

- Multiple tests using the same user credential/session, where the application doesn't support concurrent sessions for that user — one test logs out or invalidates the other's session
- Shared test data — two tests modifying/reading the same record at the same time causes race conditions
- Resource contention — tests writing to the same file, database row, or global state
- Fix: use unique test data/users per test (or per worker), and avoid shared state between parallel tests

**Q3: A locator suddenly starts failing after a release. How will you debug it?**

- Since automation always targets the lower environment first, the same code that passes there is what eventually gets promoted to prod — so scripts should stay in sync with the deployed code
- If a locator breaks, it usually means the dev team made a UI/markup change that QA wasn't explicitly informed of — common in large teams with multiple products where every team has its own release targets and it's not feasible to track every change manually
- Debugging approach: check the failure screenshot/trace to see what actually changed in the DOM, compare against the previous known-good locator, and update the locator accordingly
- Since testing happens in lower environments before prod, the script fix is validated there first, then the same fix flows through to production monitoring

**Q4: An element is visible but Playwright cannot click it. What will you check?**

- Most likely cause: another element (e.g., an overlay, modal, sticky header, or tooltip) is visually or spatially covering the target element, so Playwright's "receives events" actionability check fails even though the element looks visible
- Check for: overlapping elements, animations still in progress, z-index/CSS overlay issues, or the element being outside the current viewport
- If it's a known/expected overlap (not a real bug), bypass the check with `locator.click({ force: true })` — but this should be a deliberate, justified choice, not a default fix
- Better long-term fix: wait for the blocking element to disappear first, then click normally

**Q5: A test intermittently times out. How do you identify the root cause?**

- Check the trace file for that run — it shows exactly how long each step, network call, and page load took, which pinpoints where the delay is happening
- Compare timing across multiple runs (passing vs failing) to see if it's consistently one particular step that's slow, or if it's random across different steps
- Check if it correlates with environment load — e.g., failures cluster during high-traffic periods or when running with high worker/parallelism count
- Check network conditions — slow/failed API calls, backend latency spikes, or third-party service delays
- If it's consistently the same element/step, add an explicit wait condition for that specific case rather than blanket-increasing the global timeout

**Q6: How do you debug memory leaks or browser crashes during long executions?**

- Browser crashes are not very common with Playwright in practice — this hasn't been a frequent issue on real projects
- If it does happen, standard steps would be: monitor memory/CPU usage during long runs, check if crashes correlate with specific heavy pages (large DOM, memory-heavy JS), ensure browser contexts/pages are properly closed after each test (not accumulating), and check Playwright/browser version compatibility issues [Assign more CPU CORES to pod or runners . For our app , since it is big telecom app we give 6 core and keeping it 4 or less will make bowser crashes.]
- Restarting the browser context periodically for very long suites can help mitigate resource buildup

**Q7: Your execution suddenly becomes 3x slower. How will you investigate?**

- Likely cause: the application itself has become slow or unstable (backend/API latency, infra issues) rather than the automation code
- If the app takes too long consistently, Playwright will eventually start throwing `TimeoutError`s once the configured timeout is exceeded
- Investigation approach: check the trace file — it shows exact load times per page and per API call, so you can pinpoint whether it's a specific page, a specific API, or a general slowdown
- Also compare against infrastructure changes — new CI runner specs, increased worker/parallelism count causing resource contention, or a recent app deployment

**Q8: How do you debug network-related failures in Playwright?**

- The trace file is the primary tool — it shows every API call triggered at each action, along with request/response payloads, status codes, and timing
- For each step in the trace, you can inspect exactly which network calls fired, what response came back, and correlate that with logs to identify whether the failure is a backend issue, a timing issue, or a genuine test bug

**Q9: How do you use Trace Viewer, screenshots, videos, logs, and HAR files while debugging?**

- **Trace Viewer:** gives a full timeline of the test — DOM snapshots at each step, network calls, console logs, and exact action timing. Example: if a click fails, open the trace, go to that action, and see the DOM state at that exact moment plus what was happening on the network — often reveals the click happened before an API call finished, causing a stale element
- **Screenshots:** captured on failure (`screenshot: 'only-on-failure'`) — first thing checked to visually confirm what the page looked like at the point of failure (e.g., an unexpected popup or error message)
- **Videos:** useful for flaky/intermittent issues where a single screenshot doesn't show the sequence of events leading to failure — helps see animations, page transitions, or race conditions in motion
- **Logs:** custom wrapper logging (e.g., from `BasePage` methods) tells you exactly which page and element the framework was interacting with when it failed, narrowing down the search fast
- **HAR files:** capture the full network activity of the session — useful for deep API-level debugging, like checking request headers/payloads or confirming whether a specific API was even called
- Typical debugging flow: check the screenshot first for a quick visual cue → open the trace for a detailed timeline → cross-check logs for which wrapper method failed → check HAR/network tab if the issue looks API-related

**Q10: If an automation suite suddenly starts failing after a framework upgrade, how will you investigate?**

- First, isolate the scope — run a small subset (e.g., one smoke suite) before running the full regression, to confirm whether the failure is widespread or limited to specific tests
- Check the changelog/release notes of the upgraded package (Playwright or any other dependency) for breaking changes — API renames, default behavior changes (e.g., changed default timeouts, changed auto-wait behavior), or deprecated methods
- Compare the failure pattern — if failures are concentrated around a specific feature (e.g., all locator-related, all fixture-related, all trace-related), that points directly to what the upgrade changed
- Check the diff between the old and new lock file (`package-lock.json`/`yarn.lock`) to see if any transitive dependency also got bumped unexpectedly
- Roll back the upgrade in a branch to confirm the failures are indeed caused by the upgrade and not a coincidental app-side change
- Fix incrementally — update the affected wrapper/utility methods centrally (since the framework uses a wrapper layer), rather than patching every individual test file
- Once stable, document the breaking changes and the fix in a changelog/notes file so the team has a reference for future upgrades


## 10. Scenario-Based Lead Questions ⭐⭐⭐⭐⭐ (Most Frequently Asked)

**Q1: Design a Playwright framework for a banking/e-commerce application with 5000+ test cases. / How would you design a framework that supports both UI and API automation?**

- There's no single "one size fits all" framework — but scalable frameworks follow the same core patterns, built module-wise
- Major modules:
  - `tests/` — actual test specs, organized by feature/module
  - `pages/` — Page Object classes, all extending a common `BasePage`
  - `testdata/` — JSON/CSV/DB-backed data, separated by spec/module
  - `config/` — environment configs, URLs, credentials (via env variables)
  - `utils/` — logger, apiClient, dbClient, fakerUtil, csvUtil, etc.
  - `fixtures/` — reusable setup like `loggedInPage`, API request context, test data seeding
- Both UI and API tests use the framework's fixtures — `page` fixture for UI, `request` fixture for API — both under the same browser/session context, so they can be combined in the same test or kept as separate API-only specs for speed
- Reporting, retries, parallel execution, and test data management are built in from day one, not added later
- For banking/e-commerce specifically: prioritize high-value, high-risk flows (payments, checkout, fund transfer, login/auth) for automation; mock third-party/payment gateways instead of hitting real ones; keep sensitive test data isolated and never hardcoded

**Q2: How would you improve an existing automation framework?**

- Same approach as reviewing an inherited framework: audit first, then improve incrementally by ROI/risk — not a rewrite
- Enforce coding standards and best practices as part of the improvement: consistent naming conventions, no hardcoding, remove hard waits, optimize slow/duplicate logic
- Introduce code review practices — e.g., first pass with Copilot/AI-assisted review, then peer review via PR before merging to master
- Add proper comments/docstrings on wrapper and utility methods so intent is clear to anyone reading the code later
- Maintain a proper README/markdown file documenting the framework — folder structure, conventions, how to run suites, how to add a new test — so it's self-serve for the team

**Q3: How would you reduce regression execution time from 8 hours to 1 hour?**

- The goal isn't to run the exact same 8-hour scope in 1 hour — the strategy itself needs to change
- Instead of executing all ~1000 scripts every time, execute only what's actually required with proper test coverage — re-scope the regression suite with architects/leads to remove redundant/low-value tests
- Enable parallel execution across workers and CI shards
- Use multiple service credentials that support multi-session login, so tests aren't serialized waiting on a single shared account
- Ensure no race conditions from shared test data or global files — each parallel test/worker should use isolated data
- Follow the test pyramid — prioritize API tests over UI tests wherever possible, since API tests execute in minutes and cover business logic faster than full UI flows
- Move stable, low-risk, low-change flows to a lower-frequency run (e.g., nightly) and keep only high-priority flows in the fast regression run
- sharding?

**Q4: Your team has 2000 failing tests after a major release. What will you do first?**

- Realistically, this doesn't happen overnight — it usually means the team either doesn't have a solid framework/best practices in place, or there's a communication gap with the dev team, or past failures weren't being monitored release over release
- First step: check past execution/failure summary/reports if available, to see if this was building up gradually or is a sudden spike
- Break the 2000 failures down module-wise instead of treating it as one giant problem — group by page/feature/module to spot patterns
- Identify common root causes first (e.g., one locator/component change breaking many tests) — fixing shared root causes resolves large chunks of failures at once
- Prioritize fixing high-value/smoke/critical-path modules first, then move to lower-priority modules
- Set up better monitoring going forward so failures are caught and addressed release by release instead of accumulating

**Q5: A team of 10 automation engineers is working on the same framework. How would you organize the codebase?**

- Use a proper branching strategy (e.g., feature branches off a `develop`/`main` branch, PR-based merges, no direct commits to master)
- Enforce module ownership — each engineer/sub-team owns specific modules/page objects, reducing merge conflicts and keeping accountability clear
- Shared core (BasePage, utils, fixtures, config) is treated as a common library — changes to it go through stricter review since it impacts everyone
- Consistent naming conventions and folder structure across the team so anyone can navigate any module
- Mandatory code review (Copilot-assisted first pass + peer review) before merging, to keep quality consistent across 10 different contributors

**Q6: How would you review automation code written by junior engineers?**

- First pass is done with Copilot/AI-assisted review — the team maintains a shared "skill"/checklist of common review comments (naming, hardcoding, missing waits, wrapper usage, etc.) that Copilot applies consistently
- The engineer fixes those AI-flagged issues first
- Then a peer/lead does a manual code review via PR — checking framework alignment (using wrapper methods instead of raw Playwright calls, following POM structure, no hardcoded data, proper locator strategy)
- Only after both review passes does the code get merged into master
- This two-layer review (AI + human) keeps review effort manageable while still catching both mechanical issues and deeper design/logic issues

**Q7: What coding standards and best practices would you enforce in your framework?**

- Consistent naming conventions for pages, classes, methods, and variables
- No hardcoding — data/config externalized (JSON/YAML/`.env`)
- No hard waits (`waitForTimeout`) — rely on Playwright auto-wait and explicit `waitFor` states
- Centralized, stable locators — role/accessibility-based preferred, `data-testid` where possible
- Code optimization — no duplicate logic, reusable wrapper methods and fixtures instead of copy-paste
- Code review enforced via Copilot-assisted review + peer PR review before merge
- Proper comments/docstrings on methods, especially in shared wrapper/utility classes, so intent is clear
- Proper documentation — a maintained README/markdown file describing framework structure, conventions, and how to run/add tests

**Q8: How would you onboard a new automation engineer into your framework?**

- Point them to the framework's markdown documentation first — structure, conventions, how to run suites, how to add new tests
- Have them use AI agents/skills set up for the framework to understand the codebase and execution flow faster, instead of manually reading every file
- Get them to look at execution logs and past reports (HTML/trace) to understand how failures show up and how debugging works in this framework
- Start them on small, low-risk tasks first (e.g., fixing a flaky test, adding a simple test to an existing module) before handing over ownership of a full module
- Pair them with a peer/lead for their first few PRs so review feedback reinforces the framework's standards early

**Q9: How would you convince management that automation ROI is improving?**

- Share the manual regression effort saved every release with management — e.g., hours/days of manual testing avoided per cycle
- Share test data/coverage created by the automation scripts that's being reused across multiple product teams — shows automation isn't siloed, it's driving value org-wide
- Share early feedback from smoke and BVT (Build Verification Testing) runs — showing automation catches issues early in the pipeline, before they reach later, more expensive stages
- Where possible, tie these numbers to concrete business impact — faster release cycles, fewer production defects, reduced manual QA headcount/time needed per release
