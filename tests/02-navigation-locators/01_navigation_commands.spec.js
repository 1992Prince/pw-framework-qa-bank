/**
 * ============================================================================
 * TOPIC 3 — NAVIGATION COMMANDS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: goto() + waitUntil options, goBack(), goForward(), reload(),
 *         url(), title(), content()
 * SOURCE: 01-browsers_launch_spec.ts, 02-frames-dialogs-actions_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * goto(url, options?) → navigates the page and returns a Promise. Options:
 *   timeout    → max ms to wait for navigation before throwing
 *   waitUntil  → WHEN navigation is considered "done" (see below)
 *
 * waitUntil values (fastest → slowest):
 *   'commit'            → done as soon as the first byte is received
 *   'domcontentloaded'  → HTML is parsed, DOM is ready (images may still load)
 *   'load' (default)    → entire page finished — images, scripts, everything
 *   'networkidle'        → waits until 0 network requests for 500ms
 *                          (recommended for SPAs with async data fetching)
 *
 * goBack() / goForward() / reload() → browser history navigation, same
 *   { waitUntil, timeout } options apply.
 *
 * url() / title() / content() → read the CURRENT page state (all sync except
 *   title() and content(), which are async since they may require a round-trip).
 */

import { test, expect, chromium } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 3.1 — goto() with timeout and waitUntil, then reading page state
// =============================================================================
test('3.1 — goto() options, url(), title(), content()', async ({ page }) => {
  await page.goto(PRACTICE_URL, {
    timeout: 40000,          // fail if navigation takes longer than 40s
    waitUntil: 'networkidle', // wait until no network calls for 500ms — good for SPAs
  });

  // url() — synchronous, returns the current URL string
  const currentURL = page.url();
  console.log('Current URL:', currentURL);

  // title() — async, reads the <title> tag
  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  // content() — async, returns the full rendered HTML as a string
  const pageContent = await page.content();
  console.log('Page Content Length:', pageContent.length);
});


// =============================================================================
// 3.2 — waitUntil: 'domcontentloaded' — faster than the 'load' default
// =============================================================================
test('3.2 — goto() with domcontentloaded for faster test execution', async ({ page }) => {
  await page.goto(PRACTICE_URL, {
    timeout: 10000,
    waitUntil: 'domcontentloaded', // don't wait for images/ads — just the DOM
  });

  const pageTitle = await page.title();
  console.log(`Navigated to: ${pageTitle}`);
});


// =============================================================================
// 3.3 — goBack(), goForward(), reload()
// =============================================================================
test('3.3 — browser history navigation and reload', async ({ page }) => {
  await page.goto(PRACTICE_URL, { timeout: 10000, waitUntil: 'domcontentloaded' });

  // goBack() — previous page in session history
  // waitUntil:'load' here waits for all assets to finish loading
  await page.goBack({ waitUntil: 'load', timeout: 5000 });

  // goForward() — only works if a goBack() happened first
  await page.goForward({ waitUntil: 'load', timeout: 5000 });

  // reload() — refresh the current page
  // Use case: verify data updates, test "Session Expired" logic, etc.
  await page.reload({ waitUntil: 'load', timeout: 5000 });
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 3
// =============================================================================
/**
 * ┌───────────────────────┬───────────────────────────────────────┬──────────────────────────────────┐
 * │ Method / Option          │ Behavior                                  │ Note                                    │
 * ├───────────────────────┼───────────────────────────────────────┼──────────────────────────────────┤
 * │ goto(url, options)         │ Navigates and waits per waitUntil          │ Default waitUntil is 'load'             │
 * │ waitUntil: 'commit'          │ Done at first byte received                 │ Fastest, least reliable for content      │
 * │ waitUntil: 'domcontentloaded'│ DOM parsed, assets may still be loading     │ Good speed/reliability balance           │
 * │ waitUntil: 'load'              │ Everything finished loading                 │ Default — safest but slowest              │
 * │ waitUntil: 'networkidle'         │ No network activity for 500ms               │ 🎯 Best for SPAs with async data fetches   │
 * │ goBack() / goForward()             │ Session history navigation                  │ goForward() needs a prior goBack()         │
 * │ reload()                             │ Refreshes current page                      │ Use for "session expired" / data-refresh   │
 * │                                        │                                              │ scenarios                                   │
 * │ page.url()                              │ Sync — current URL string                    │ No await needed                             │
 * │ page.title() / page.content()             │ Async — <title> text / full HTML              │ Both need await                             │
 * └───────────────────────┴───────────────────────────────────────┴──────────────────────────────────┘
 *
 * 🎯 INTERVIEW POINT: which waitUntil to pick?
 *   Most teams default to 'domcontentloaded' for speed, but switch to
 *   'networkidle' specifically for pages that fetch data via AJAX/fetch
 *   AFTER the initial HTML loads — otherwise your test may interact with
 *   the page before dynamic content has actually appeared.
 */