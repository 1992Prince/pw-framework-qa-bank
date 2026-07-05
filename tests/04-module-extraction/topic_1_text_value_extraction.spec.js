/**
 * ============================================================================
 * TOPIC 16 — TEXT / VALUE EXTRACTION
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: textContent() vs innerText(), inputValue() vs getAttribute('value')
 * SOURCE: 08-extracting-values-artem_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * textContent() → reads ALL text inside an element, including text hidden by
 *                 CSS (display:none) and raw whitespace/newlines exactly as
 *                 they exist in the DOM. Faster (no rendering/layout needed).
 *
 * innerText()   → reads only the VISIBLE, rendered text — respects CSS
 *                 (hidden elements excluded), collapses whitespace like a
 *                 real user would see it. Slower (triggers layout).
 *
 * 🎯 INTERVIEW POINT: textContent() vs innerText()
 *   If an element has hidden child text or CSS-driven formatting, textContent()
 *   and innerText() can return DIFFERENT results. Use innerText() when you
 *   care about what the USER actually sees; use textContent() for raw DOM
 *   content or when performance matters more than visual accuracy.
 *
 * inputValue() vs getAttribute('value') — already covered in depth in
 * Topic 9 (9.4 / 9.5). Quick recap:
 *   inputValue()           → live DOM property, always current after fill()
 *   getAttribute('value')  → static HTML attribute, stays STALE after fill()
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 16.1 — textContent() vs innerText()
// =============================================================================
test('16.1 — textContent() vs innerText() on a single element', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const titleLocator = page.locator('.brand__title');

  const raw = await titleLocator.textContent();   // may include stray whitespace
  const visible = await titleLocator.innerText();  // clean, rendered text

  expect(raw?.trim()).toBe('BillPay'); // trim() because textContent can carry whitespace
  expect(visible).toEqual('BillPay');
});


// =============================================================================
// 16.2 — inputValue() vs getAttribute('value') — recap example
// =============================================================================
test('16.2 — inputValue() reflects live value, getAttribute stays stale', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const emailLoc = page.getByTestId('form-email');
  await emailLoc.fill('Gaurav@email.com');

  const liveValue = await emailLoc.inputValue();               // "Gaurav@email.com"
  const staticAttr = await emailLoc.getAttribute('placeholder'); // unrelated static attr, unaffected by fill()

  expect(liveValue).toBe('Gaurav@email.com');
  expect(staticAttr).toBe('your@email.com');
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 16
// =============================================================================
/**
 * ┌───────────────────────┬──────────────────────────────────────┬──────────────────────────────────┐
 * │ Method                  │ Reads                                   │ Note                                  │
 * ├───────────────────────┼──────────────────────────────────────┼──────────────────────────────────┤
 * │ textContent()           │ ALL text incl. hidden, raw whitespace   │ Faster — no layout calculation        │
 * │ innerText()              │ Only VISIBLE, rendered text             │ Slower — mirrors what user actually   │
 * │                          │                                          │ sees                                   │
 * │ inputValue()             │ Live DOM value property                 │ Always correct after fill()           │
 * │ getAttribute('value')    │ Static HTML attribute                   │ 🎯 STALE after fill() — see Topic 9   │
 * └───────────────────────┴──────────────────────────────────────┴──────────────────────────────────┘
 */