
# Parallel Execution & Flaky Tests

### 76. How does Playwright run tests in parallel by default, and what is the role of workers?

- Playwright runs test **files** in parallel by default, each in a separate worker process
- Number of workers defaults to half the CPU cores (configurable via `workers` in config)
- Each worker gets its own browser instance/context — no shared state between them
- Tests within the same file run sequentially unless split further

### 77. What is test sharding, and how do you split a suite across machines using `--shard`?

- Sharding splits the total test suite across multiple machines/CI jobs
- Run with `npx playwright test --shard=1/4` (this machine runs shard 1 of 4)
- Each CI job gets a subset of tests, running them in parallel across jobs, not just workers
- Combine with matrix strategy in CI YAML to spin up N parallel jobs automatically
- Speeds up large suites significantly beyond what local worker parallelism can do

### 78. How does BrowserContext isolation prevent parallel tests from interfering with each other?

- Each test gets a fresh `BrowserContext` — separate cookies, storage, cache by default
- No shared session/state between tests, even when running in the same worker
- Prevents one test's login/data from leaking into another test
- Much lighter than spinning up a new browser instance per test — contexts are cheap

### 79. What are the common causes of flaky tests, and how do you reduce them?

- Common causes:
  - Unstable locators (CSS/XPath tied to DOM structure)
  - Hard waits (`waitForTimeout`) instead of proper waiting
  - Test interdependency / shared state
  - Unmocked third-party/network calls
  - Race conditions in parallel execution
- Reduction strategies:
  - Use stable locators — `getByTestId`, `getByRole`
  - Avoid `waitForTimeout`; rely on auto-waiting and explicit assertions
  - Ensure tests are isolated and independent
  - Mock external APIs where behavior isn't the focus of the test
  - Configure retries as a safety net, not a fix for root cause

### 80. Explain Playwright's retry mechanism.

- Configured via `retries` in `playwright.config.ts` (e.g., `retries: 2`)
- On failure, Playwright reruns the test up to the configured number of times
- Each retry gets a fresh browser context — no leftover state from the failed attempt
- Report marks the test as "flaky" if it passes on retry, not simply "passed"
- Retries should supplement, not replace, fixing the underlying flakiness

### 81. How would you optimize Playwright execution time in a large test suite?

- Increase parallel workers (bounded by CI machine resources)
- Use sharding across multiple CI machines for very large suites
- Split suites by priority — fast smoke suite on PR, full regression nightly
- Disable heavy tracing/video by default; enable only `on-first-retry` or on failure
- Remove redundant/overlapping tests; consolidate where coverage overlaps
- Use API calls for test setup (e.g., login, data seeding) instead of UI steps
