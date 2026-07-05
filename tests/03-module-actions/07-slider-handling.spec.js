/**
 * ============================================================================
 * TOPIC 15 — SLIDER HANDLING — range input manipulation
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: setting <input type="range"> values reliably
 * SOURCE: 05-slider.spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * A slider (<input type="range">) isn't a normal text field, so fill() and
 * click() alone don't reliably set an exact value — click() only lands you
 * at whatever position on the track you clicked, not a precise number.
 *
 * ALGORITHM:
 *   1. Navigate to the page containing the slider
 *   2. Locate the slider element (input[type="range"])
 *   3. Decide the target value
 *   4. Set the value programmatically (evaluate) OR via keyboard arrows
 *   5. Verify the resulting value if required
 *
 * Two reliable approaches:
 *   A) evaluate() — directly set the DOM value/attribute via JS
 *   B) Keyboard — focus the slider, then ArrowRight/ArrowLeft to nudge it
 *      (works because range inputs are natively keyboard-accessible)
 *
 * 🎯 INTERVIEW POINT:
 *   Just like getAttribute('value') vs inputValue() (Topic 9), setting the
 *   HTML *attribute* on a range input doesn't always guarantee the app's own
 *   JS state updates — many apps listen for the 'input' or 'change' EVENT,
 *   not just the value change. Best practice: set the value AND dispatch the
 *   event so any React/Vue/Angular listeners actually fire.
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 15.1 — evaluate() — set slider value directly via DOM
// =============================================================================
test('15.1 — set slider value using evaluate()', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const slider = page.locator('#volume');

  // Quick approach — sets the attribute directly
  await slider.evaluate(node => {
    node.setAttribute('value', '86');
  });

  await page.pause(); // confirm the thumb visually moved
});


// =============================================================================
// 15.2 — evaluate() — value + dispatch 'input' event (more reliable)
// =============================================================================
/**
 * Preferred version: sets the live DOM property (not just the attribute) and
 * fires the 'input'/'change' events so any app-level JS listeners react —
 * closing the same live-vs-static gap covered in Topic 9.
 */
test('15.2 — set slider value and dispatch input/change events', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const slider = page.locator('#volume');

  await slider.evaluate((node, value) => {
    node.value = value;                                       // set live DOM property
    node.dispatchEvent(new Event('input', { bubbles: true }));  // notify listeners
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, '75');

  await expect(slider).toHaveValue('75');
});


// =============================================================================
// 15.3 — KEYBOARD APPROACH — focus + arrow keys
// =============================================================================
/**
 * Native range inputs respond to arrow keys once focused — a good option
 * when you want to simulate genuine user interaction rather than a DOM hack.
 */
test('15.3 — nudge slider using keyboard arrows', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const slider = page.locator('#volume');

  await slider.focus();
  for (let i = 0; i < 5; i++) {
    await slider.press('ArrowRight'); // each press typically increments by 1 step
  }
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 15
// =============================================================================
/**
 * ┌───────────────────────────────────┬──────────────────────────────────┬──────────────────────────────────┐
 * │ Approach                             │ Behavior                            │ Note                                 │
 * ├───────────────────────────────────┼──────────────────────────────────┼──────────────────────────────────┤
 * │ evaluate(setAttribute('value'))      │ Fast, direct DOM hack               │ May not trigger app's own listeners  │
 * │ evaluate(node.value = x + dispatch)  │ Sets live property + fires events   │ 🎯 More reliable — mirrors real input│
 * │ focus() + press('ArrowRight')        │ Genuine keyboard interaction        │ Best for realistic user-behavior tests│
 * └───────────────────────────────────┴──────────────────────────────────┴──────────────────────────────────┘
 */