/**
 * ============================================================================
 * TOPIC 2 — PLAYWRIGHT OBJECT MODEL
 * ============================================================================
 * COVERS: Browser → BrowserContext → Page → Locator hierarchy, why each layer exists
 * SOURCE: 03-pw-objects_spec.ts
 * ============================================================================
 *
 * CONCEPT — THE HIERARCHY
 * ────────────────────────
 *   Browser         → one running browser PROCESS (chromium/firefox/webkit)
 *     └─ BrowserContext → an ISOLATED session inside that browser — like a
 *                          fresh incognito window. Own cookies, storage,
 *                          cache — completely separate from other contexts.
 *         └─ Page        → one TAB inside that context
 *             └─ Locator → a lazy "recipe" for finding an element on that Page
 *
 * WHY EACH LAYER MATTERS
 * ────────────────────────
 * Browser        → EXPENSIVE to start (real process). Ideally launched once
 *                   and reused across many tests rather than per-test.
 *
 * BrowserContext → CHEAP to create/destroy, and fully ISOLATED. This is
 *                   Playwright's main tool for test isolation WITHOUT paying
 *                   the cost of relaunching the browser each time. Perfect for:
 *                     - Simulating multiple logged-in users simultaneously
 *                     - Guaranteeing no cookie/localStorage leakage between tests
 *                     - Parallel test execution on one Browser instance
 *
 * Page           → the actual tab you interact with (goto, click, etc).
 *                   A context can hold multiple Pages — useful for testing
 *                   flows that open new tabs/popups.
 *
 * Locator        → doesn't touch the DOM until used (lazy evaluation —
 *                   see Topic 4 for full details). Always typed as Locator,
 *                   never a raw ElementHandle.
 *
 * 🎯 INTERVIEW POINT:
 *   "Why not just launch a new Browser for every test?" — Because launching
 *   a Browser process is slow and resource-heavy. The standard pattern is:
 *   ONE Browser, MANY BrowserContexts (one per test) — you get full
 *   isolation at a fraction of the cost.
 */

import { test, expect, chromium, firefox, webkit } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 2.1 — THE FULL CHAIN — Browser → BrowserContext → Page → Locator
// =============================================================================
test('2.1 — build the full object chain manually', async () => {
  // 1. Browser — the process
  const browser = await chromium.launch({ headless: false });

  // 2. BrowserContext — an isolated session (like a fresh incognito window)
  const context = await browser.newContext();

  // 3. Page — a tab within that context
  const page = await context.newPage();
  await page.goto(PRACTICE_URL);

  // 4. Locator — lazy element reference within that page
  const emailInput = page.getByPlaceholder('your@email.com').first();
  await emailInput.fill('Gaurav@email.com');

  const title = await page.title();
  console.log('Title:', title);

  // BEST PRACTICE: browser.close() cascades — it automatically closes
  // every Page and every BrowserContext that belongs to it
  await browser.close();
});


// =============================================================================
// 2.2 — MULTIPLE ISOLATED CONTEXTS on ONE Browser — the key efficiency pattern
// =============================================================================
/**
 * One Browser process, two completely separate sessions — e.g. simulating
 * two different logged-in users at the same time, with zero cookie/storage
 * bleed between them.
 */
test('2.2 — multiple BrowserContexts share one Browser but stay isolated', async () => {
  const browser = await chromium.launch({ headless: false });

  const userAContext = await browser.newContext();
  const userBContext = await browser.newContext();

  const userAPage = await userAContext.newPage();
  const userBPage = await userBContext.newPage();

  await userAPage.goto(PRACTICE_URL);
  await userBPage.goto(PRACTICE_URL);

  // Anything userAPage does (login, fill forms, set cookies) has ZERO effect
  // on userBContext — they are fully isolated sessions

  await browser.close(); // closes both contexts and both pages in one call
});


// =============================================================================
// 2.3 — SAME PATTERN ACROSS ENGINES — chromium, firefox, webkit
// =============================================================================
test('2.3 — the same Browser→Context→Page→Locator pattern works for every engine', async () => {
  const chromiumBrowser = await chromium.launch({ headless: false });
  const firefoxBrowser = await firefox.launch({ headless: false });
  const webkitBrowser = await webkit.launch({ headless: false });

  for (const browser of [chromiumBrowser, firefoxBrowser, webkitBrowser]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(PRACTICE_URL);
    const emailInput = page.getByPlaceholder('your@email.com').first();
    await emailInput.fill('Gaurav@email.com');
    await browser.close();
  }
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 2
// =============================================================================
/**
 * ┌───────────────────┬────────────────────────────────────┬──────────────────────────────────────┐
 * │ Object               │ Represents                              │ Cost / Lifecycle                          │
 * ├───────────────────┼────────────────────────────────────┼──────────────────────────────────────┤
 * │ Browser                │ One running browser process               │ Expensive — reuse across many tests        │
 * │ BrowserContext            │ One isolated session (like incognito)     │ Cheap — create one per test for isolation   │
 * │ Page                        │ One tab inside a context                  │ Cheap — a context can hold multiple Pages    │
 * │ Locator                       │ A lazy reference to an element on a Page  │ Free until used — see Topic 4                 │
 * └───────────────────┴────────────────────────────────────┴──────────────────────────────────────┘
 *
 * 🎯 INTERVIEW POINT — how Playwright Test (the test runner) uses this:
 *   When you write `test('...', async ({ page }) => {...})`, Playwright Test
 *   has ALREADY done all of this setup for you behind the scenes — it
 *   launches one shared Browser, then creates a fresh BrowserContext + Page
 *   for every single test automatically, giving you isolation for free
 *   without writing the boilerplate shown in 2.1 yourself.
 */