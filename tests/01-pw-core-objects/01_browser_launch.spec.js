/**
 * ============================================================================
 * TOPIC 1 — BROWSER LAUNCH
 * ============================================================================
 * COVERS: chromium/firefox/webkit, launch options — headless, args, slowMo,
 *         timeout, channel
 * SOURCE: 01-browsers_launch_spec.ts, 03-pw-objects_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * Playwright ships THREE browser engines, each imported separately:
 *   chromium → powers Chrome, Edge, and Chromium itself
 *   firefox  → Mozilla's engine
 *   webkit   → Safari's engine
 *
 * Each engine has a .launch(options) method that starts a browser PROCESS.
 * By default this launches Playwright's own bundled/patched browser binary —
 * NOT the browser installed on your OS — unless you specify `channel`.
 *
 * 🎯 INTERVIEW POINT — Playwright's bundled browser vs installed browser
 *   chromium.launch() (no channel) → Playwright's patched Chromium build,
 *   optimized for automation stability. From Playwright v1.57 onward this
 *   defaults to "Chrome-to-Test," a Google-maintained binary built
 *   specifically for automated testing — no channel needed anymore for that.
 *   chromium.launch({ channel: 'chrome' }) → launches the REAL, system-
 *   installed Google Chrome. Use this when you need to test against the
 *   exact browser your users actually run.
 */

import { chromium, firefox, webkit, test } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 1.1 — launch() OPTIONS — headless, args, slowMo, timeout
// =============================================================================
/**
 * headless  → false shows the actual browser UI (useful for debugging);
 *             true (default) runs invisibly, faster, required for CI.
 * args      → array of Chromium/browser command-line flags
 *             (e.g. '--start-maximized', custom window size).
 * slowMo    → ms delay inserted before every Playwright operation —
 *             slows execution down so you can visually follow along.
 * timeout   → max ms to wait for the browser process itself to start.
 */
test('1.1 — launch chromium with custom options', async () => {
  const browser = await chromium.launch({
    headless: false,           // run in headful mode — visible browser
    args: ['--start-maximized'], // start maximized
    slowMo: 100,                // slow down every action by 100ms
    timeout: 60000,              // allow up to 60s for the browser to launch
  });

  await browser.close();
});

test('1.2 — launch firefox and webkit with window-size args', async () => {
  const firefoxBrowser = await firefox.launch({
    headless: false,
    args: ['--width=1280', '--height=800'], // Firefox uses its own flag names
  });

  const webkitBrowser = await webkit.launch({
    headless: false,
    args: ['--window-size=1280,800'], // WebKit's flag format differs again
  });

  await firefoxBrowser.close();
  await webkitBrowser.close();
});


// =============================================================================
// 1.2 — channel — LAUNCHING REAL, SYSTEM-INSTALLED BROWSERS
// =============================================================================
/**
 * channel values:
 *   'chrome'  → real installed Google Chrome     (via chromium engine)
 *   'msedge'  → real installed Microsoft Edge     (via chromium engine, since Edge is Chromium-based)
 *   'firefox' → real installed Firefox            (via firefox engine)
 *   (no channel option exists for webkit — it always uses Playwright's own build)
 */
test('1.3 — real installed Chrome and Firefox via channel', async () => {
  const chromeBrowser = await chromium.launch({
    headless: false,
    slowMo: 100,
    channel: 'chrome', // real installed Chrome, not Playwright's bundled Chromium
  });

  const firefoxBrowser = await firefox.launch({
    headless: false,
    channel: 'firefox', // real installed Firefox
  });

  // webkit has no channel — always Playwright's own WebKit build
  const webkitBrowser = await webkit.launch({ headless: false });

  await chromeBrowser.close();
  await firefoxBrowser.close();
  await webkitBrowser.close();
});

test('1.4 — launch Microsoft Edge', async () => {
  // Edge is Chromium-based, so we use the chromium engine with channel:'msedge'
  const edgeBrowser = await chromium.launch({
    headless: false,
    channel: 'msedge',
  });

  const page = await (await edgeBrowser.newContext()).newPage();
  await page.goto(PRACTICE_URL);

  await edgeBrowser.close();
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 1
// =============================================================================
/**
 * ┌───────────────┬────────────────────────────────────────┬────────────────────────────────────┐
 * │ Option           │ Purpose                                    │ Note                                    │
 * ├───────────────┼────────────────────────────────────────┼────────────────────────────────────┤
 * │ headless           │ Show (false) or hide (true) the browser UI  │ true required for CI/headless servers   │
 * │ args                 │ Browser-specific command-line flags          │ Flag format differs per engine           │
 * │ slowMo                │ ms delay before every operation               │ Debugging/demo aid, not for CI runs       │
 * │ timeout                 │ Max ms to wait for browser process to start   │ Separate from action/navigation timeouts   │
 * │ channel                   │ Use a REAL installed browser instead of      │ 'chrome' / 'msedge' / 'firefox' — no        │
 * │                              │ Playwright's bundled build                     │ channel option for webkit                    │
 * └───────────────┴────────────────────────────────────────┴────────────────────────────────────┘
 *
 * 🎯 INTERVIEW POINT: why use channel at all if the bundled browser works?
 *   The bundled browser is great for speed and consistency across machines/CI.
 *   Use `channel` when a bug is browser-version-specific and you need to
 *   reproduce it against the EXACT Chrome/Edge/Firefox build your real users
 *   have installed — the bundled binary may differ in version or patches.
 */