/**
 * ============================================================================
 * TOPIC 11 — CHECKBOX / RADIO ACTIONS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * METHODS: check() · uncheck() · setChecked(bool)
 * SOURCE: 01-actions.spec.ts, topics_03_click_operations_methods_spec.ts,
 *         spec2-builtin-locators_spec.ts (checked state filter)
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * check()          → forces checkbox/radio into CHECKED state. 
 *                    Idempotent — if already checked, does nothing (no error).
 * 
 * Yeh method ensure karta hai ki aapka checkbox checked state mein ho.
 * Kaise kaam karta hai: Agar checkbox pehle se checked hai, toh Playwright kuch nahi 
 * karega (koi error nahi aayega). Agar unchecked hai, toh usko check kar dega.
 * 
 * Kab use karein: Jab aapka explicit goal hai kisi option ko select karna 
 * (e.g., "I agree to Terms and Conditions").
 * 
 * 
 * 
 * uncheck()         → forces checkbox into UNCHECKED state. Doesn't work on
 *                     radio buttons (they can't be "unchecked" individually).
 * 
 * Yeh method ensure karta hai ki aapka checkbox unchecked state mein ho.
 * Kaise kaam karta hai: Agar checkbox pehle se unchecked hai, toh Playwright usko waise hi chhod dega. 
 * Agar checked hai, toh usko uncheck kar dega.
 *
 * Kab use karein: Jab aapko explicitly kisi selected option ko deselect karna ho 
 * (e.g., "Unsubscribe from newsletter" jahan checkbox default checked hota hai).
 * 
 * 
 * 
 * 
 * setChecked(bool)  → conditional — sets state based on the boolean you pass,
 *                     ignoring current state. Safest when you don't know the
 *                     starting state.
 * 
 * Yeh method upar wale dono methods ka ek dynamic wrapper hai. 
 * Yeh ek boolean value (true ya false) accept karta hai.
 * 
 * Kaise kaam karta hai: * Agar aap setChecked(true) pass karte hain, 
 * toh yeh internally check() ko call karta hai.
 * 
 * Agar aap setChecked(false) pass karte hain, toh yeh internally uncheck() ko call karta hai.
 * 
 * Kab use karein: Iska sabse bada fayda Data-Driven Testing mein hota hai. Jab aapko checkbox ka 
 * state kisi variable, API response, ya test data file se decide karna ho, tab yeh best approach hai. 
 * Isse aapko if-else block nahi likhna padta.
 * 
 * // Dynamic variable ke basis par check ya uncheck karna
const isUserPremium = true; // Yeh data database ya JSON se aa sakta hai

// Agar true hai toh check karega, false hai toh uncheck karega
await page.locator('#premium-features').setChecked(isUserPremium);
 *
 * All three auto-wait for the element to be clickable, and accept the usual
 * click-style options: { force, timeout, position }.
 *
 * 🎯 INTERVIEW POINT: check()/uncheck() vs setChecked()
 *   check() and uncheck() assume you know the target state and just want it
 *   forced. setChecked(true/false) is preferred when the current state is
 *   unpredictable (e.g. dynamic form, previous test left it checked) — one
 *   call handles both directions correctly.
 */

import { test, expect, Locator } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 11.1 — check() / uncheck() / setChecked() — BASIC USAGE
// =============================================================================
test('11.1 — check, uncheck, setChecked on a single checkbox', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const newsletter  = page.getByLabel(' Subscribe to newsletter');

  // check() — force checked
  await newsletter.check();
  await expect(newsletter).toBeChecked();

  // uncheck() — force unchecked
  await newsletter.uncheck();
  await expect(newsletter).not.toBeChecked();

  // setChecked() — conditional, safe when state is unknown
  await newsletter.setChecked(true);   // will check it
  await newsletter.setChecked(false);  // will uncheck it
});


// =============================================================================
// 11.2 — RADIO BUTTONS — setChecked() is the standard approach
// =============================================================================
test('11.2 — radio button selection', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Radios don't have a meaningful "uncheck" — use setChecked(true) to select
  const femaleRadio  = page.getByRole('radio', { name: 'Female' });
  await femaleRadio.setChecked(true);
  await expect(femaleRadio).toBeChecked();
});


// =============================================================================
// 11.3 — BULK CHECKBOX HANDLING — scoped to a container, loop + text match
// =============================================================================
test('11.3 — check/uncheck all checkboxes inside a specific card', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Scope to a specific card so you don't accidentally hit checkboxes elsewhere
  const checkboxCard  = page
    .locator('.card')
    .filter({ hasText: 'Radio Buttons & Checkboxes' });

  const allCheckboxesInCard  = checkboxCard.getByRole('checkbox');
  const count = await allCheckboxesInCard.count();

  // Check all
  for (let i = 0; i < count; i++) {
    await allCheckboxesInCard.nth(i).check();
  }

  // Uncheck all
  for (let i = 0; i < count; i++) {
    await allCheckboxesInCard.nth(i).uncheck();
  }

  // Find and check ONE specific checkbox by its visible text
  for (let i = 0; i < count; i++) {
    const text = await allCheckboxesInCard.nth(i).locator('span').textContent();
    if (text?.trim() === 'I agree to Terms') {
      await allCheckboxesInCard.nth(i).check();
      break; // stop once found — avoid unnecessary loop iterations
    }
  }
});


// =============================================================================
// 11.4 — getByRole() checked STATE FILTER — locate by current state
// =============================================================================
/**
 * checked: true/false on getByRole('checkbox'/'radio', {...}) filters elements
 * by their CURRENT state — useful for asserting counts or grabbing "the one
 * unchecked box" without knowing its label in advance.
 */
test('11.4 — locate checkboxes/radios by checked state', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const checkedBoxes = page.getByRole('checkbox', { checked: true });
  const uncheckedBoxes = page.getByRole('checkbox', { checked: false });

  console.log('Already checked:', await checkedBoxes.count());
  console.log('Unchecked:', await uncheckedBoxes.count());

  // Act on the first unchecked one without knowing its name
  if (await uncheckedBoxes.count() > 0) {
    await uncheckedBoxes.first().click();
    await expect(uncheckedBoxes.first()).toBeChecked();
  }
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 11
// =============================================================================
/**
 * ┌───────────────────┬──────────────────────────────────┬──────────────────────────────┐
 * │ Method              │ Behavior                          │ Note                            │
 * ├───────────────────┼──────────────────────────────────┼──────────────────────────────┤
 * │ check()             │ Forces checked, idempotent        │ No error if already checked     │
 * │ uncheck()           │ Forces unchecked                  │ Doesn't apply to radio buttons  │
 * │ setChecked(bool)    │ Conditional set                   │ Best when current state unknown │
 * │ getByRole({checked})│ Filter by current checked state   │ Great for "find the unchecked   │
 * │                     │                                    │ one" scenarios                  │
 * └───────────────────┴──────────────────────────────────┴──────────────────────────────┘
 */