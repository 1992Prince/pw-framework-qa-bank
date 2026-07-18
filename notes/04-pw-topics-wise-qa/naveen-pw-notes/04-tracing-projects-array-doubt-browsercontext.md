
# 01 - Playwright: Tracing, Projects Config & BrowserContext

> SDET Interview Prep Notes — Playwright Framework Internals

---

## 1) Tracing

### What is Tracing?

Playwright's **Trace Viewer** is a debugging tool that captures a complete, timeline-based record of a test run — DOM snapshots (before/after each action), network requests, console logs, screenshots, action durations, and source code location for every step. Instead of guessing why a test failed from a static screenshot or a log line, you get a scrubber timeline you can step through frame-by-frame, almost like a video recording of the test with full DOM inspection at every point.

This is the single biggest reason Playwright is considered strong for **debugging flaky/failing tests in CI**, where you can't attach a debugger.

### How to Enable Tracing

**Option A — CLI flag (ad-hoc, one-off run):**

```bash
npx playwright test --trace=on
```

**Option B — Config file (recommended for real projects):**

In `playwright.config.ts`, inside the `use` block:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'on', // options below
  },
});
```

### `trace` Property Options (Full List)

| Value                               | Behavior                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'off'`                           | No tracing. Default. Zero overhead.                                                                                                                                                                                                                                                                                                             |
| `'on'`                            | Records trace for**every** test (pass or fail), and keeps it regardless of outcome. Heaviest option for CI — use sparingly.                                                                                                                                                                                                              |
| `'retain-on-failure'`             | Records trace for every test, but**deletes** it if the test passes. Keeps only failure traces from the **initial run** — good simple CI default.                                                                                                                                                                                   |
| `'retain-on-first-failure'`       | Records a trace for the**first run only** of each test, and keeps it **only if that first run fails**. If the test is later retried and passes, the original failure trace is still kept once. More surgical than `retain-on-failure` when you also have retries configured, since it avoids re-recording on every retry attempt. |
| `'retain-on-failure-and-retries'` | Records trace on the initial run**and** every retry, but keeps only the traces belonging to failed attempts (both first run and retries). Useful when you want visibility into *why every retry attempt also failed*, not just the first.                                                                                               |
| `'on-first-retry'`                | No trace on the first run. If the test fails and is retried, a trace is recorded**starting on that first retry**. Requires `retries >= 1` in config to ever trigger. Best cost/value tradeoff for CI — a normally-passing test costs nothing.                                                                                          |
| `'on-all-retries'`                | No trace on the first run, but a trace is recorded on**every retry attempt** (2nd, 3rd, ...). Useful for diagnosing flaky tests that fail inconsistently across multiple retries.                                                                                                                                                         |
| `'retry-with-trace'`              | Alias/equivalent behavior to`on-first-retry` in newer Playwright versions — retries automatically get tracing enabled without needing to separately configure it.                                                                                                                                                                            |

**Real-world recommendation:** Use `on-first-retry` (or `retry-with-trace`) in CI, combined with `retries: 1` or `2` in config. This means a normally-passing test costs nothing, and only a genuinely flaky/failing test produces a trace — you're not drowning in trace.zip files for green tests. Use `retain-on-failure-and-retries` if you specifically need to compare *why* each retry attempt failed (e.g. diagnosing environment flakiness vs a genuine bug).

### Where the Trace is Stored

```
test-results/
  └── <test-folder-name>/
        └── trace.zip
```

- The `<test-folder-name>` is auto-generated from the test title/project (e.g. `test-results/example-test-chromium/trace.zip`).
- Each failed/retried test gets its own `trace.zip`.

### Opening the Trace

```bash
npx playwright show-trace test-results/<folder>/trace.zip
```

Or drag-and-drop the `trace.zip` file directly onto [trace.playwright.dev](https://trace.playwright.dev) — no local install needed, works entirely in-browser (useful for sharing a trace with a teammate without giving them repo access).

CI tip: upload `test-results/` as a build artifact so traces from a CI failure can be downloaded and opened locally.

### Tracing vs UI Mode — Key Difference

This is a common interview trap — they sound similar but solve **different problems**.

| Aspect                     | Trace Viewer                                                          | UI Mode                                                                                                                               |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**          | Post-mortem analysis of a run that already happened (typically in CI) | Live, interactive test authoring & debugging while writing tests locally                                                              |
| **When used**        | After the fact — inspecting a`trace.zip`                           | During development — running/watching tests execute in real time                                                                     |
| **Command**          | `npx playwright show-trace trace.zip`                               | `npx playwright test --ui`                                                                                                          |
| **Environment**      | Works on any trace file, even from a CI run on a different machine    | Only runs locally, live, against your current code                                                                                    |
| **Interactivity**    | Read-only playback/scrubbing of a recorded run                        | Fully interactive: pick locators, watch actions execute step-by-step, time-travel through a*live* re-run, edit and re-run instantly |
| **Typical use case** | "Why did this test fail on the CI pipeline last night?"               | "Let me write and debug this new test right now."                                                                                     |

**One-line answer for interviews:** *Trace Viewer is for analyzing a recorded run after execution (great for CI failures); UI Mode is a live, interactive development/debugging environment for local test authoring.* Under the hood, UI Mode is actually built on the same tracing technology — but it operates in real time rather than on a saved artifact.

---

## 2) Removing/Emptying the `projects` Array in Config

### Case A: `projects` key completely removed from config

```bash
npx playwright test
```

✅ **Tests will run.** Playwright falls back to a default project configuration and **runs in Chromium by default** when no `projects` array is defined at all.

You can override the browser via CLI:

```bash
npx playwright test --browser=webkit
```

This runs all tests against WebKit instead of the default Chromium. Valid values: `chromium`, `firefox`, `webkit`, or `all` (runs across all three).

### Case B: `projects` array exists but is **empty** (`projects: []`)

```ts
export default defineConfig({
  projects: [], // empty array, but key exists
});
```

```bash
npx playwright test
```

❌ **Error: "No tests found."**

### Why the Difference Matters (Concept)

This is a subtle but important distinction interviewers like to probe:

- **Key absent** → Playwright treats it as "no project configuration was ever set up" → applies its own **implicit default project** (Chromium) so something still runs.
- **Key present but empty array** → Playwright interprets this as **"the user explicitly defined zero projects to run tests against"** → there is nowhere to execute a test, so it reports no tests found, even if `testDir` has valid spec files.

**Practical takeaway:** An empty `projects: []` is a common copy-paste/config mistake (e.g., someone comments out all project entries but leaves the array declaration) that silently breaks the whole suite — worth knowing as a debugging checklist item.

---

## 3) BrowserContext

### What is a BrowserContext?

A **BrowserContext** is an isolated, incognito-like browser session within a single **Browser** instance. Think of the hierarchy:

```
Browser (1 instance, e.g. one Chromium process)
 └── BrowserContext (isolated session — cookies, storage, cache)
       └── Page (an actual tab)
```

- **One Browser** can spawn **many BrowserContexts**.
- **Each BrowserContext** is completely isolated from every other context — separate cookies, local storage, session storage, cache, and permissions.
- **Each BrowserContext** can spawn **multiple Pages** (tabs) — and pages within the *same* context **do** share cookies/storage with each other.
- Creating a new context is **cheap** (much cheaper than launching a whole new browser), which is why Playwright uses one browser + many contexts as its standard parallelization/isolation strategy (this is also how Playwright gives each test its own clean context automatically via the `page` fixture, without spinning up a new browser per test).

### Code Example (Corrected Syntax)

```ts
import { test, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

test('browser context example', async ({ browser }) => {
  const browserContext1: BrowserContext = await browser.newContext();
  const browserContext2: BrowserContext = await browser.newContext();

  // Two isolated contexts, same browser instance (same process)

  const page1: Page = await browserContext1.newPage();
  const page2: Page = await browserContext2.newPage();

  // page1 and page2 live in separate contexts:
  // no shared cookies, local storage, or session data between them

  await page1.goto('https://www.google.com');
  await page2.goto('https://www.google.com');

  await browserContext1.close();
  await browserContext2.close();
});
```

### Why This Matters — Real Use Case: Testing Chat / Multi-User Applications

Since each `BrowserContext` is a fully isolated "user session," this is the standard pattern to simulate **two different logged-in users interacting in real time** — e.g., a chat app, a multiplayer feature, or a collaborative document.

**Steps to test a chat application with two users:**

1. Launch **one Browser** instance (`browser` fixture).
2. Create **BrowserContext 1** → login as **User A** → open a **Page** → navigate to the chat app.
3. Create **BrowserContext 2** → login as **User B** → open a separate **Page** → navigate to the same chat app.
4. Since contexts don't share session/auth state, both users stay independently authenticated (no cookie collision like you'd get with two tabs in the same context).
5. From **User A's page**, send a chat message.
6. Assert on **User B's page** that the message appears (real-time delivery check) — e.g., via `expect(page2.locator('.chat-message').last()).toHaveText(...)`.
7. Optionally reverse the direction (User B replies, assert on User A's page) to test bidirectional flow.
8. Close both contexts at the end (`browserContext1.close()`, `browserContext2.close()`) to clean up.

**Interview one-liner:** *BrowserContext gives you cheap, isolated "separate user" sessions inside a single browser process — it's the standard way to test multi-user, real-time features like chat, collaborative editing, or notifications without launching multiple browsers.*

---

### Mock Interview Q&A (Quick Recall)

**Q: How do you configure Playwright to only keep traces for failing tests, without bloating CI storage on passing runs?**
A: Set `trace: 'on-first-retry'` in config combined with at least 1 retry — traces are only captured when a test needs to be retried, so passing tests cost nothing.

**Q: If I delete the `projects` array entirely, what browser does Playwright default to?**
A: Chromium.

**Q: What's the difference between two Pages in the same BrowserContext vs two Pages in different BrowserContexts?**
A: Same context → pages share cookies/storage (like two tabs of the same logged-in user). Different contexts → fully isolated sessions (like two separate incognito windows / two separate users).

**Q: Trace Viewer vs UI Mode — when would you use each in a real workflow?**
A: UI Mode while actively writing/debugging tests locally in real time; Trace Viewer to investigate a CI failure after the fact using the uploaded `trace.zip` artifact.
