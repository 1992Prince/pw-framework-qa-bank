/**
 * ============================================================================
 * TOPIC 4 — LOCATOR FUNDAMENTALS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: declaration patterns, Locator vs raw Selector, lazy evaluation,
 *         multiple elements — nth(), first(), last(), iteration
 * SOURCE: spec1-locator-fundamentals_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * page.locator() is SYNCHRONOUS — no `await` on creation, only on the
 * action/assertion that follows. Creating a locator does NOT touch the DOM
 * yet — it's just a "recipe" describing how to find the element. This is
 * called LAZY EVALUATION: the actual DOM lookup only happens when you call
 * an action (.click(), .fill()) or a query (.count(), .textContent()).
 *
 * 🎯 INTERVIEW POINT: Locator vs ElementHandle
 *   Because a Locator re-resolves the DOM every time it's used, it survives
 *   DOM re-renders (React/Vue re-mounting elements). An ElementHandle
 *   (page.$()) is a one-time snapshot reference — if the DOM changes, it
 *   goes STALE. Always use Locator, never ElementHandle, in modern Playwright.
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.com/practise-api/ui/index.html#/practice';


// =============================================================================
// 4.1 — DECLARATION PATTERNS
// =============================================================================
test('4.1a — inline declaration', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Directly chained with the action — fine for one-off use, not reusable
  await page.locator('#firstName').fill('Inline Declaration');
});

test('4.1b — variable declaration', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // No `await` here — page.locator() is sync, just stores the "recipe"
  // still not locating the element in the DOM yet — lazy evaluation
  const firstName = page.locator('#firstName');
  const lastName = page.locator('#lastName');
  const allCards = page.locator('.card');

  // `await` only on actions/assertions — this is where the DOM lookup happens
  // here elements are actually located in the DOM and filled with values
  await firstName.fill('Gaurav');
  await lastName.fill('Khurana');
  await expect(firstName).toHaveValue('Gaurav');

  // again firstName element is re-located in the DOM, and the value is cleared
  // this is how Locator survives DOM re-renders — it always re-resolves the element
  // and avoid stale element reference errors that ElementHandle would have
  // in selenium this would have been given StateElementReferenceException, 
  // but in playwright it will re-locate the element and clear the value
  await firstName.fill('');

  const count = await allCards.count(); // query method — needs await
  console.log(`Total cards: ${count}`);
});

test('4.1c — POM pattern — class-based locator declaration', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  class PracticePage {
    constructor(page) {
      this.page = page;
      this.firstName = page.locator('#firstName');
      this.allCards = page.locator('.card');
    }
    async fillFirstName(value) {
      await this.firstName.fill(value);
    }
  }

  const practicePage = new PracticePage(page);
  await practicePage.fillFirstName('POM User');
  await expect(practicePage.firstName).toHaveValue('POM User');
});


// =============================================================================
// 4.2 — LOCATOR vs RAW SELECTOR
// =============================================================================
/**
 * Raw selector (page.click(), page.fill()) → works, but limited auto-wait,
 * no retry-ability, no chaining, no filtering. Considered legacy API.
 * Locator (page.locator().click()) → auto-wait + retry + chaining + filtering.
 */
test('4.2 — locator gives chaining + filtering that raw selectors cannot', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Raw selector — works, but no chaining/filtering possible
  await page.fill('#firstName', 'Selector Approach');

  // Locator — chain parent → filter → child
  const textInputCard = page.locator('.card').filter({ hasText: 'Text inputs' });
  const inputsInCard = textInputCard.locator('input');
  const inputCount = await inputsInCard.count();

  for (let i = 0; i < inputCount; i++) {
    await inputsInCard.nth(i).fill(`Value_${i + 1}`);
  }
});


// =============================================================================
// 4.3 — MULTIPLE ELEMENTS — nth(), first(), last(), and iteration
// =============================================================================
/**
 * When a locator matches more than one element, use:
 *   .first()   → the first match (shortcut for .nth(0))
 *   .last()    → the last match
 *   .nth(i)    → a specific match by 0-based index
 *   for + count() → loop through every match
 *
 * All of these return a Locator (sync, no await). Only count()/actions/
 * assertions on them need await.
 */
test('4.3 — nth(), first(), last() — targeting specific matches', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const allCards = page.locator('.card');       // Locator — sync
  const firstCard = allCards.first();            // Locator — sync
  const lastCard = allCards.last();               // Locator — sync
  const secondCard = allCards.nth(1);              // Locator — sync (0-based, so nth(1) = 2nd)

  const count = await allCards.count();             // Promise<number> — needs await
  const isVisible = await firstCard.isVisible();      // Promise<boolean> — needs await

  console.log(`Total cards: ${count}`);
  console.log(`First card visible: ${isVisible}`);
  await expect(secondCard).toBeVisible();
});

test('4.4 — iterating ALL matches with count() + for loop', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const allNavLinks = page.locator('nav a');
  const linkCount = await allNavLinks.count();

  // Standard pattern: count() first, then loop with nth(i)
  for (let i = 0; i < linkCount; i++) {
    const text = await allNavLinks.nth(i).textContent();
    const href = await allNavLinks.nth(i).getAttribute('href');
    console.log(`Link ${i + 1}: "${text?.trim()}" → ${href}`);
  }

  console.log(`Nav links count: ${linkCount}`);
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 4
// =============================================================================
/**
 * ┌───────────────────────┬───────────────────────────────────┬────────────────────────────────────┐
 * │ Concept / Method         │ Return type                          │ Note                                    │
 * ├───────────────────────┼───────────────────────────────────┼────────────────────────────────────┤
 * │ page.locator(sel)         │ Locator (sync — no await)             │ Lazy — doesn't touch DOM until used     │
 * │ locator.first()            │ Locator (sync)                        │ Shortcut for .nth(0)                    │
 * │ locator.last()              │ Locator (sync)                        │ Last matched element                    │
 * │ locator.nth(i)               │ Locator (sync)                        │ 0-based index                           │
 * │ locator.filter({hasText})     │ Locator (sync)                        │ Narrows matches, still lazy             │
 * │ locator.count()                │ Promise<number> (needs await)         │ Snapshot — no auto-retry                │
 * │ locator.click()/.fill()          │ Promise<void> (needs await)           │ Triggers the actual DOM lookup + action │
 * └───────────────────────┴───────────────────────────────────┴────────────────────────────────────┘
 *
 * 🎯 GOLDEN RULE: await on creation = WRONG. await on action/assertion = RIGHT.
 *   const wrong = await page.locator('#id');   ❌
 *   const right = page.locator('#id');          ✅ (await goes on .click() etc.)
 */