/**
 * ============================================================================
 * TOPIC 12 — DROPDOWN ACTIONS — selectOption()
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * METHOD: selectOption() — for native <select> elements ONLY
 * SOURCE: 01-actions.spec.ts, topics_03_click_operations_methods_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * selectOption() only works on native HTML <select> elements. Custom
 * dropdowns built with <div>/<ul> need click() on the option elements instead.
 *
 * Four ways to select:
 *   By visible label → selectOption('India')
 *   By value attr    → selectOption({ value: 'us' })
 *   By index (0-based)→ selectOption({ index: 4 })
 *   Multiple (multi-select) → selectOption(['playwright', 'cypress'])
 *
 * Return type: Promise<string[]> — array of the values that ended up selected.
 * Fires the `change` event, so framework validation logic still runs.
 */

import { test, expect, Locator } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 12.1 — selectOption() — by label, value, and index
// =============================================================================
test('12.1 — selectOption() — label, value, index', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const countryDropdown  = page.getByRole('combobox', { name: 'Country' });
  await countryDropdown.focus(); // optional, good practice before selection

  // By visible label text
  await countryDropdown.selectOption('United Kingdom');

  // By value attribute — <option value="au">
  await countryDropdown.selectOption({ value: 'au' });

  // By index — 0-based (0 = first option)
  await countryDropdown.selectOption({ index: 1 });

  // Fetch all available option texts and count — useful for assertions
  const optionTexts = await countryDropdown.locator('option').allTextContents();
  const optionCount = await countryDropdown.locator('option').count();
  console.log('Options:', optionTexts, '| Count:', optionCount);
});


// =============================================================================
// 12.2 — selectOption() — MULTI-SELECT dropdown
// =============================================================================
/**
 * Requires the underlying <select multiple> attribute.
 * Pass an array — every matching value gets selected at once.
 */
test('12.2 — selectOption() — multi-select', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const skillsDropdown  = page.getByTestId('frameworks');
  await skillsDropdown.selectOption(['TestCafe', 'Playwright', 'Selenium']);
});


// =============================================================================
// 12.3 — DYNAMIC VALIDATION — fetch values first, then select conditionally
// =============================================================================
/**
 * Real-world pattern: you don't know the dropdown contents in advance, so
 * fetch → validate → select, instead of hardcoding blindly.
 */
test('12.3 — validate dropdown values before selecting', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const countryDropdown  = page.getByRole('combobox', { name: 'Country' });
  const actualValues = await countryDropdown.locator('option').allTextContents();

  const valueToSelect = 'United Kingdom';
  if (actualValues.includes(valueToSelect)) {
    await countryDropdown.selectOption(valueToSelect);
  } else {
    throw new Error(`Value "${valueToSelect}" not found in dropdown`);
  }
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 12
// =============================================================================
/**
 * ┌────────────────────────────────┬───────────────────────────────────┬─────────────────────────────────┐
 * │ Usage                            │ Behavior                            │ Note                              │
 * ├────────────────────────────────┼───────────────────────────────────┼─────────────────────────────────┤
 * │ selectOption('label')            │ Select by visible text              │ Most readable, most common        │
 * │ selectOption({ value: 'us' })    │ Select by HTML value attribute      │ Stable even if label text changes │
 * │ selectOption({ index: n })       │ Select by position (0-based)        │ 🎯 Fragile if options get reordered│
 * │ selectOption([a, b, c])          │ Select multiple at once             │ Needs <select multiple>           │
 * └────────────────────────────────┴───────────────────────────────────┴─────────────────────────────────┘
 *
 * 🎯 INTERVIEW TRAP — "Select the 2nd-last option, count unknown"
 *   const count = await dropdown.locator('option').count();
 *   ❌ selectOption({ index: count - 1 })  // selects the LAST option, not 2nd-last
 *   ✅ selectOption({ index: count - 2 })  // correct — 2nd-last (0-based math)
 *
 * 🎯 selectOption() only works on native <select>. For custom div/ul-based
 *    dropdowns, click the trigger to open it, then click() the option directly.
 */