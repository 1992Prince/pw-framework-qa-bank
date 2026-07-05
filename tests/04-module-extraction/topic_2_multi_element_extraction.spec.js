/**
 * ============================================================================
 * TOPIC 17 — MULTI-ELEMENT EXTRACTION
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: allTextContents(), allInnerTexts(), count(), iterating locators
 * SOURCE: 08-extracting-values-artem_spec.ts, spec1-locator-fundamentals_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * allTextContents() → returns string[] of raw textContent for every matched
 *                      element, in DOM order.
 * allInnerTexts()   → same idea, but each entry is the clean, rendered
 *                      innerText (same distinction as Topic 16, applied to
 *                      a whole collection at once).
 * count()           → returns the number of elements currently matching the
 *                      locator. Cheap, synchronous-feeling, but does NOT
 *                      auto-retry/wait.
 *
 * 🎯 INTERVIEW POINT: allTextContents()/allInnerTexts() DON'T auto-retry
 *   Unlike expect() assertions, these are plain query methods — if the
 *   elements haven't rendered yet, you'll get an empty array, not a wait.
 *   Best practice: force a wait first with
 *     await expect(locator.first()).toBeVisible();
 *   before calling allTextContents()/allInnerTexts() on a collection.
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 17.1 — allTextContents() vs allInnerTexts() — with a pre-wait
// =============================================================================
test('17.1 — extract text from a collection of elements', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const checkboxLocator = page.locator('.checkbox-label');

  // Force a wait so the array isn't empty — these methods don't auto-retry
  await expect(checkboxLocator.first()).toBeVisible();

  const allTextRaw = await checkboxLocator.allTextContents(); // raw, may include \n
  const allTextVisible = await checkboxLocator.allInnerTexts(); // clean, rendered

  expect(allTextVisible).toHaveLength(4);
  expect(allTextVisible).toEqual([
    'I agree to Terms & Conditions *',
    'Subscribe to newsletter',
    'I agree to Terms',
    'Enable notifications',
  ]);
});


// =============================================================================
// 17.2 — count() — total matched elements
// =============================================================================
test('17.2 — count() — how many elements match', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const allCards = page.locator('.card');
  const count = await allCards.count();

  console.log(`Total cards: ${count}`);
  expect(count).toBeGreaterThan(0);
});


// =============================================================================
// 17.3 — ITERATING LOCATORS — for loop + nth()
// =============================================================================
/**
 * The standard pattern: get count() first, then loop with nth(i) to act on
 * or read each element individually.
 */
test('17.3 — iterate over a collection with nth()', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const allCheckboxesInCard = page
    .locator('.card')
    .filter({ hasText: 'Radio Buttons & Checkboxes' })
    .getByRole('checkbox');

  const total = await allCheckboxesInCard.count();

  for (let i = 0; i < total; i++) {
    const label = await allCheckboxesInCard.nth(i).locator('span').textContent();
    console.log(`Checkbox ${i + 1}: "${label?.trim()}"`);
    expect(label?.trim().length).toBeGreaterThan(0); // sanity check — no empty labels
  }
});


// =============================================================================
// 17.4 — ARRAY-STYLE ASSERTIONS on extracted collections
// =============================================================================
test('17.4 — validate presence and subsets within an extracted array', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const checkboxLocator = page.locator('.checkbox-label');
  await expect(checkboxLocator.first()).toBeVisible();

  const labels = await checkboxLocator.allInnerTexts();

  // Order-independent presence check
  expect(labels).toContain('Enable notifications');

  // Subset check
  expect(labels).toEqual(expect.arrayContaining(['I agree to Terms']));
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 17
// =============================================================================
/**
 * ┌────────────────────────┬─────────────────────────────────────┬──────────────────────────────────┐
 * │ Method                    │ Returns                                │ Note                                  │
 * ├────────────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
 * │ allTextContents()          │ string[] — raw text, DOM order         │ No auto-retry — pre-wait first        │
 * │ allInnerTexts()             │ string[] — clean, rendered text        │ No auto-retry — pre-wait first        │
 * │ count()                     │ number — elements currently matched    │ No auto-retry — snapshot in time      │
 * │ locator.nth(i)              │ Locator for a single element by index  │ Combine with count() to loop           │
 * └────────────────────────┴─────────────────────────────────────┴──────────────────────────────────┘
 *
 * 🎯 RULE OF THUMB: if you need Playwright to WAIT for a condition, use an
 *   expect() assertion (Topic 18). If you just need to READ data that's
 *   already confirmed present, these query methods are the right tool.
 */