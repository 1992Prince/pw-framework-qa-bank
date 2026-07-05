/**
 * ============================================================================
 * TOPIC 10 — CLICK OPERATIONS
 * Website: BillPay Practice App
 * URL:     https://gauravkhurana.com/practise-api/ui/index.html#/practice
 * ============================================================================
 *
 * METHODS COVERED:
 *   10.1  click()            — basic, right-click, modifiers, trial
 *   10.2  Real-world clicks  — double-click, right-click box, Ctrl/Meta+click
 *   10.3  dblclick()         — dedicated double-click method
 *   10.4  hover() + focus()  — mouse hover vs keyboard focus
 *
 * SOURCE FILES CONSOLIDATED:
 *   - topics_03_click_operations_methods_spec.ts
 *   - 01-actions.spec.ts (Mouse Click Actions Test, Mouse Hover Actions Test)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// ── Shared URLs ───────────────────────────────────────────────────────────────
const PRACTICE_URL = 'https://gauravkhurana.com/practise-api/ui/index.html#/practice';
const BASE_URL     = 'https://gauravkhurana.com/practise-api/ui/index.html';


// =============================================================================
// 10.1 — click() — OPTIONS DEEP DIVE
// =============================================================================
/**
 * click(options?)
 *   - Auto-waits: attached → visible → enabled → stable → not covered
 *   - Default: button = 'left', clickCount = 1
 *
 * Options:
 *   button      → 'left' | 'right' | 'middle'
 *   modifiers   → array of 'Alt' | 'Control' | 'Meta' | 'Shift'
 *   clickCount  → number of clicks (2 = double-click)
 *   position    → { x, y } — click at specific offset within element
 *   force       → skip actionability checks (use sparingly)
 *   trial       → true = dry-run, checks clickability WITHOUT actually clicking
 *   delay       → ms between mousedown and mouseup
 *   timeout     → override default 30s wait
 *
 * 🎯 INTERVIEW POINT — trial: true
 *   Runs only the actionability checks (is it clickable?) without performing
 *   the real click. Useful to assert "this element IS clickable" as a
 *   pre-condition check, separate from actually triggering navigation/side-effects.
 */
test('10.1 — click() — basic, right-click, modifiers, trial', async ({ page }) => {
  await page.goto(BASE_URL);

  // ── Basic left click — navigation link ───────────────────────────────────
  // Default: button='left', clickCount=1
  // Auto-waits for element to be clickable before clicking
  await page.getByRole('link', { name: 'My Bills' }).click();
  await page.pause(); // Inspector: My Bills page opens

  // ── Right click — triggers context menu ───────────────────────────────────
  // button: 'right' fires the contextmenu event
  await page.goto(BASE_URL);
  await page.getByText('Get Started').click({ button: 'right' });
  await page.pause(); // Inspector: right-click context menu (if any)

  // ── Shift+Click — modifier key with click ─────────────────────────────────
  // modifiers array: 'Alt' | 'Control' | 'Meta' | 'Shift'
  // Triggers multi-select behavior where supported
  await page.getByRole('link', { name: 'My Bills' }).click({
    modifiers: ['Shift']
  });
  await page.pause(); // Inspector: Shift+Click executed

  // ── trial: true — dry run, no actual click ─────────────────────────────────
  // Only runs actionability checks — is the element clickable or not
  // Useful to verify clickability WITHOUT triggering side-effects
  await page.getByText('🎯 Scenarios').click({ trial: true });
  await page.pause(); // Inspector: element was clickable — page did NOT navigate
});


 
// =============================================================================
// 10.2 — click() OPTIONS IN DEPTH — force, timeout, delay, position (x, y)
// =============================================================================
/**
 * ── force: true ──────────────────────────────────────────────────────────
 * PURPOSE:
 *   Skips Playwright's actionability checks (attached, visible, enabled,
 *   stable, not covered by another element) and clicks the element anyway,
 *   even if it's technically not "safe" to click.
 *
 * WHEN TO USE:
 *   - An element is functionally clickable but fails a specific actionability
 *     check for a reason you've already verified is harmless (e.g. a custom
 *     overlay with pointer-events that Playwright flags as "covering" the
 *     element, but real users can still click through it)
 *   - Quick, deliberate testing of what happens if you click a "disabled-looking"
 *     element that isn't truly disabled at the DOM level
 *   - Rare, one-off debugging scenarios
 *
 * WHEN TO AVOID:
 *   - As a default fix for flaky tests — force:true masks the REAL problem
 *     (a genuinely hidden, disabled, or covered element) instead of fixing it
 *   - On elements that are legitimately disabled — you'll click something a
 *     real user could never click, producing false-positive test results
 *   - If overused, your suite stops reflecting real user behavior at all
 *
 * 🎯 INTERVIEW POINT:
 *   force:true bypasses Playwright's safety net. If you find yourself reaching
 *   for it often, that's usually a sign the locator or the app's UI state
 *   needs fixing — not the test.
 *
 * ── timeout ───────────────────────────────────────────────────────────────
 * PURPOSE:
 *   Overrides the default 30-second wait for THIS specific click action.
 *   Playwright will keep retrying the actionability checks until either the
 *   click succeeds or this timeout is reached, then throws a TimeoutError.
 *
 * WHEN TO USE:
 *   - Shorten it for fast, predictable UI where a long wait would just delay
 *     failure feedback (e.g. timeout: 5000 for a button you know appears instantly)
 *   - Lengthen it for elements that take longer to become interactive
 *     (e.g. after a slow API call or animation completes)
 *
 * ── delay ─────────────────────────────────────────────────────────────────
 * PURPOSE:
 *   Sets the time (ms) Playwright holds the mouse button down between
 *   mousedown and mouseup during the click — simulating a slower, more
 *   "human" click rather than an instantaneous one.
 *
 * WHEN TO USE:
 *   - Testing UI that specifically listens for press-and-hold duration
 *   - Simulating more realistic user interaction timing in demos/recordings
 *   - Rarely needed for standard functional testing — default (no delay) is fine
 *
 * ── position: { x, y } ───────────────────────────────────────────────────
 * PURPOSE:
 *   Clicks at a specific pixel offset WITHIN the element's bounding box,
 *   instead of Playwright's default (the element's center).
 *
 * WHEN TO USE:
 *   - The element has different clickable behavior in different regions
 *     (e.g. a canvas, a slider track, a color picker, a map)
 *   - You need to click a specific icon/label inside a larger clickable
 *     container where the center might be empty space or a different control
 *   - Testing edge/corner click behavior specifically
 */
test('10.2 — click() options — force, timeout, delay, position(x,y)', async ({ page }) => {
  await page.goto(PRACTICE_URL);
 
  // ── force: true — bypass actionability checks ─────────────────────────────
  // Use only when you've confirmed the element IS safely clickable despite
  // failing a specific check (e.g. a decorative overlay Playwright flags as
  // "covering" it). Do NOT use this to paper over a genuinely broken locator.
  const agreeCheckbox = page.getByRole('checkbox', {
    name: 'I agree to Terms & Conditions *',
  });
  await agreeCheckbox.click({ force: true });
  console.log('Clicked with force:true — actionability checks were skipped');
 
  // ── timeout — custom wait window for this click only ─────────────────────
  // Shortened timeout: fail fast if the element isn't ready within 5s
  const getStartedBtn = page.getByRole('button', { name: 'Get Started' });
  await getStartedBtn.click({ timeout: 5000 });
  console.log('Clicked within a custom 5s timeout window');
 
  // ── delay — hold mouse button down for 300ms before releasing ────────────
  // Simulates a slower, more deliberate click rather than an instant tap
  await page.getByText('Hover me 1').click({ delay: 300 });
  console.log('Clicked with a 300ms mousedown-to-mouseup delay');
 
  // ── position: { x, y } — click a specific point inside the element ───────
  // Instead of the default center-click, target the top-left corner region
  // Useful for canvas/slider/map elements where location within the
  // element changes the outcome
  const slider = page.locator('#volume');
  await slider.click({ position: { x: 10, y: 5 } });
  console.log('Clicked at offset (10, 5) within the element, not its center');
 
  await page.pause(); // visual verification of all four option behaviors
});

// =============================================================================
// 10.2 — REAL-WORLD CLICK PATTERNS — Double-Click, Right-Click, Ctrl/Meta+Click
// =============================================================================
/**
 * Practical application of click() variants on a real form page.
 *
 * Ctrl / Meta + Click:
 *   - Windows / Linux → Control
 *   - macOS           → Meta (⌘)
 *   - Commonly used to open links in a new tab, or for multi-selection
 */
test('10.2 — Mouse Click Actions — dblclick, right-click, Ctrl/Meta+click', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ── Double Click Action ────────────────────────────────────────────────────
  // Performs two rapid left mouse clicks
  // Follows Playwright's auto-waiting & actionability checks
  const doubleClickButton = page.getByTestId('double-click-btn');
  await doubleClickButton.dblclick();

  // ── Right Click (Context Menu) ─────────────────────────────────────────────
  // button options supported: 'left' (default) | 'middle' | 'right'
  await page
    .getByText('Right-click inside this box')
    .click({ button: 'right' });

  await page.pause(); // visual verification

  // ── Ctrl / Meta + Click ─────────────────────────────────────────────────────
  // Used to open links in new tab or perform multi-selection
  await page
    .getByText('Open New Window')
    .click({ modifiers: ['ControlOrMeta'] });

  await page.pause();
});


// =============================================================================
// 10.3 — dblclick() — DEDICATED DOUBLE-CLICK METHOD
// =============================================================================
/**
 * dblclick(options?)
 *   - Internally: mousedown → mouseup → click → mousedown → mouseup → click → dblclick
 *   - dblclick() and click({ clickCount: 2 }) produce the SAME result
 *   - Options: same as click() minus clickCount (it's fixed at 2)
 *
 * Use cases: activating edit mode, selecting a word of text, rich text editors
 */
test('10.3 — dblclick() — double click on an element', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Internally fires two click events plus a native dblclick event
  await page.getByText('Double-Click Required').dblclick();

  await page.pause(); // Inspector: double-click triggered, message should change
});


// =============================================================================
// 10.4 — hover() + focus() — MOUSE HOVER vs KEYBOARD FOCUS
// =============================================================================
/**
 * hover(options?)
 *   - Moves the mouse pointer onto the element — does NOT click
 *   - Fires mousemove + mouseover events
 *   - Use for: revealing tooltips, opening hover-dropdowns, verifying hover states
 *   - Options: position, modifiers, force, trial, timeout
 *
 * focus(options?)
 *   - Sets keyboard focus directly — no click, no mouse event at all
 *   - Fires only the `focus` event
 *   - Use for: tab-order tests, accessibility testing, keyboard navigation
 *   - Options: timeout
 *   - Verify with: await expect(locator).toBeFocused()
 *
 * 🎯 INTERVIEW POINT:
 *   hover() = mouse simulation (no keyboard).
 *   focus() = keyboard/programmatic simulation (no mouse).
 *   They are NOT interchangeable — an element can be hovered without being
 *   focused, and vice versa. Pick based on what real user behavior you're testing.
 */
test('10.4a — hover() and focus() — mouse hover and keyboard focus', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Complete the double-click example first (page state setup)
  await page.getByText('Double-Click Required').dblclick();

  // ── hover() — move mouse pointer onto the element ─────────────────────────
  // Hovering should reveal a tooltip or trigger a style change
  await page.getByText('Hover me 1').hover();
  await page.pause(); // Inspector: hover state visible

  // ── focus() — set keyboard focus without clicking ─────────────────────────
  // No click happens — only focus is set
  await page.getByPlaceholder('9876543210').focus();
  await expect(page.getByPlaceholder('9876543210')).toBeFocused(); // verify focused
  await page.pause(); // Inspector: phone field focused (cursor blinking)
});



// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 10: CLICK OPERATIONS
// =============================================================================
/**
 * ┌───────────────┬─────────────────────────────────────┬───────────────────────────────────────┬────────────────────────────────────────┐
 * │ Method         │ Behavior                             │ Key Options                             │ Interview Trap / Note                   │
 * ├───────────────┼─────────────────────────────────────┼───────────────────────────────────────┼────────────────────────────────────────┤
 * │ click()        │ Auto-waits then performs a click     │ button, modifiers, clickCount, position,│ trial:true = dry-run, no real click     │
 * │                │                                       │ force, trial, delay, timeout            │                                          │
 * │ dblclick()     │ Two clicks + native dblclick event   │ Same as click() minus clickCount         │ Same as click({ clickCount: 2 })        │
 * │ hover()        │ Moves pointer, no click               │ position, modifiers, force, trial,       │ Fires mousemove/mouseover only          │
 * │                │                                       │ timeout                                  │                                          │
 * │ focus()        │ Sets keyboard focus, no click         │ timeout                                  │ Only fires `focus` event — verify with  │
 * │                │                                       │                                           │ toBeFocused()                           │
 * └───────────────┴─────────────────────────────────────┴───────────────────────────────────────┴────────────────────────────────────────┘
 *
 * 🎯 TOP INTERVIEW QUESTIONS FOR THIS TOPIC:
 *   Q: "What's the difference between hover() and focus()?"
 *   A: hover() simulates the mouse moving over an element (mousemove/mouseover
 *      events only). focus() simulates keyboard/programmatic focus (focus event
 *      only, no mouse). Neither one clicks the element.
 *
 *   Q: "How do you test if an element is clickable without actually clicking it?"
 *   A: Use click({ trial: true }) — it runs the actionability checks
 *      (attached, visible, enabled, stable, not covered) but stops before
 *      the actual click event fires.
 *
 *   Q: "How is dblclick() different from click({ clickCount: 2 })?"
 *   A: They are functionally identical — both fire two click events followed
 *      by a native dblclick event.
 */