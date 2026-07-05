/**
 * ============================================================================
 * TOPIC 18 — ASSERTIONS — expect() WEB-FIRST vs MANUAL CHECKS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: toHaveValue, toHaveText, toBeChecked, toHaveCount, toBeVisible, etc.
 *         vs manual isVisible()/isChecked()/textContent() checks
 * SOURCE: 08-extracting-values-artem_spec.ts, spec1-locator-fundamentals_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * WEB-FIRST ASSERTIONS — expect(locator).toXxx()
 *   AUTO-RETRY until the condition is true or the timeout is hit, then throw.
 *   This is Playwright's core stability mechanism — no manual polling needed.
 *
 * MANUAL CHECKS — isVisible(), isChecked(), textContent(), etc.
 *   Return an instant snapshot boolean/value — NO waiting, NO retrying.
 *   If the condition isn't true yet, you get a false negative, not a wait.
 *
 * 🎯 INTERVIEW POINT (asked constantly):
 *   isVisible() = instant check, no wait, returns boolean, can flake.
 *   toBeVisible() = assertion, auto-waits + retries, throws with a clear
 *   error on real failure. ALWAYS prefer expect().toXxx() for verification;
 *   reserve manual checks for conditional LOGIC (e.g. "if this button
 *   exists, click it"), not for PROVING correctness.
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 18.1 — VALUE / TEXT ASSERTIONS — toHaveValue(), toHaveText()
// =============================================================================
test('18.1 — toHaveValue() and toHaveText() — auto-retrying checks', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const emailLoc = page.getByTestId('form-email');
  await emailLoc.fill('Gaurav@email.com');

  // Retries until the value matches, or times out
  await expect(emailLoc).toHaveValue('Gaurav@email.com');

  const titleLocator = page.locator('.brand__title');
  await expect(titleLocator).toHaveText('BillPay');

  // Works on a whole collection too — matches every item in order
  const checkboxLocator = page.locator('.checkbox-label');
  await expect(checkboxLocator).toHaveText([
    'I agree to Terms & Conditions *',
    'Subscribe to newsletter',
    'I agree to Terms',
    'Enable notifications',
  ]);
});


// =============================================================================
// 18.2 — STATE ASSERTIONS — toBeChecked(), toBeVisible(), toBeEnabled(), toBeFocused()
// =============================================================================
test('18.2 — state assertions', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const newsletter = page.getByLabel(' Subscribe to newsletter');
  await newsletter.check();
  await expect(newsletter).toBeChecked();

  const firstName = page.locator('#firstName');
  await expect(firstName).toBeVisible();
  await expect(firstName).toBeEnabled();

  await firstName.focus();
  await expect(firstName).toBeFocused();
});


// =============================================================================
// 18.3 — toHaveCount() — asserting collection size (auto-retrying)
// =============================================================================
test('18.3 — toHaveCount() vs manual count()', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const allCards = page.locator('.card');

  // Manual — instant snapshot, no wait
  const snapshotCount = await allCards.count();

  // Assertion — retries until the count matches (useful right after an
  // action that adds/removes elements, e.g. after a filter or search)
  await expect(allCards).toHaveCount(snapshotCount);

  const allCheckboxesInCard = page
    .locator('.card')
    .filter({ hasText: 'Text inputs' })
    .locator('input');
  await expect(allCheckboxesInCard).toHaveCount(await allCheckboxesInCard.count());
});


// =============================================================================
// 18.4 — MANUAL CHECK vs ASSERTION — side by side, same condition
// =============================================================================
/**
 * Same underlying question ("is this visible?") answered two different ways —
 * shows exactly why one flakes and the other doesn't.
 */
test('18.4 — manual isVisible() vs expect().toBeVisible()', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const firstName = page.locator('#firstName');

  // MANUAL — snapshot right now, true or false, no retry
  const visibleNow = await firstName.isVisible();
  console.log('isVisible() snapshot:', visibleNow);

  // ASSERTION — retries up to the timeout, only fails if STILL not visible
  await expect(firstName).toBeVisible();

  // Manual checks are appropriate for branching logic, not verification:
  const darkModeBtn = page.getByRole('button', { name: '🌙' });
  if (await darkModeBtn.isVisible()) {
    await darkModeBtn.click(); // conditional action, not a correctness proof
  }
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 18
// =============================================================================
/**
 * ┌───────────────────────┬────────────────────────┬──────────────────────────────────────┐
 * │ Assertion                │ Verifies                 │ Manual equivalent (no auto-retry)       │
 * ├───────────────────────┼────────────────────────┼──────────────────────────────────────┤
 * │ toHaveValue(v)            │ Input's current value    │ (await locator.inputValue()) === v      │
 * │ toHaveText(t)              │ Element's rendered text  │ (await locator.textContent()) === t     │
 * │ toBeChecked()               │ Checkbox/radio checked   │ await locator.isChecked()               │
 * │ toBeVisible()                │ Element is visible       │ await locator.isVisible()                │
 * │ toBeEnabled()                 │ Element is interactive   │ await locator.isEnabled()                │
 * │ toBeFocused()                  │ Element has focus        │ (no direct manual equivalent)            │
 * │ toHaveCount(n)                   │ Collection size          │ (await locator.count()) === n            │
 * └───────────────────────┴────────────────────────┴──────────────────────────────────────┘
 *
 * 🎯 RULE OF THUMB: expect(locator).toXxx() for PROVING something is true.
 *   Manual .isXxx()/.count() for making an in-test DECISION about what to do
 *   next. Mixing these up is the #1 source of flaky Playwright suites.
 */