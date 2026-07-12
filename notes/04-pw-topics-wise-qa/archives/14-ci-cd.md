
# CI/CD Integration

### 70. How do you integrate Playwright into GitHub Actions, Jenkins, or Azure DevOps?

- Add a pipeline step to install dependencies and browsers (`npm ci`, `npx playwright install --with-deps`)
- Run tests via `npx playwright test` with appropriate flags (shard, project, reporter)
- Publish HTML report and trace files as build artifacts
- Trigger on PR (smoke suite) and on merge/nightly (full regression)

### 71. Why is `npx playwright install --with-deps` important in CI environments?

- CI runners are usually minimal Linux images without browser system dependencies
- `--with-deps` installs OS-level libraries (fonts, codecs, etc.) browsers need to run
- Without it, browsers may fail to launch even though the binaries are installed
- Saves debugging "browser closed unexpectedly" errors specific to CI images

### 72. What are common reasons a test passes locally but fails in CI, and how do you diagnose them?

- Common causes:
  - Timing differences — CI machines are often slower/more resource-constrained
  - Missing environment variables or different base URLs
  - Headless vs headed rendering differences
  - Parallelism/worker count causing race conditions not seen locally
- Diagnose using trace viewer, screenshots/videos from CI artifacts
- Reproduce locally with `--workers=1` and headless mode to match CI conditions

### 73. How do you configure retries specifically for CI?

- Set `retries` conditionally in config: `retries: process.env.CI ? 2 : 0`
- Keep retries at 0 locally to catch real flakiness during development
- Retries in CI mask transient issues (network blips) without hiding real bugs long-term
- Track retry counts in reports — high retry rate signals flaky tests needing fixes

### 74. How do you upload HTML reports and trace files as CI artifacts?

- Configure `reporter: [['html', { open: 'never' }]]` in `playwright.config.ts`
- In CI YAML, add an "upload artifact" step pointing to `playwright-report/` and `test-results/`
- Traces enabled via `trace: 'on-first-retry'` or `'retain-on-failure'` to avoid huge storage costs
- Store artifacts with a retention policy (e.g., 7-14 days) to manage storage

### 75. What is `globalSetup` / `globalTeardown`, and how is it used in CI pipelines?

- `globalSetup` runs once before all tests — good for seeding test data, logging in and saving `storageState`, or starting a mock server
- `globalTeardown` runs once after all tests — cleanup like clearing test data or stopping services
- Configured via `globalSetup`/`globalTeardown` paths in `playwright.config.ts`
- In CI, useful for spinning up dependencies (DB seed, auth token) once instead of per-test
