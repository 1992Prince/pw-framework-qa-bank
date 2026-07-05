/**
 * ============================================================================
 * TOPIC 5 — LOCATOR STRATEGIES — CSS, XPath, Text
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: CSS selectors, XPath expressions, text selectors (partial vs exact)
 * SOURCE: spec1-locator-fundamentals_spec.ts (Section 3)
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * page.locator() accepts THREE kinds of selector strings — always wrap them
 * in locator() to get Playwright's auto-wait + retry, rather than passing
 * them to legacy page.click()/page.fill() directly.
 *   1. CSS selectors    — fastest, most common
 *   2. XPath expressions — powerful for text/position-based navigation
 *   3. Text selectors     — locate by visible text, partial or exact
 */



import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.com/practise-api/ui/index.html#/practice';
const BASE_URL = 'https://gauravkhurana.com/practise-api/ui/index.html';

test('Locator Strategies Syntax Demo', async ({ page }) => {

  // 1. Tag Name
  // Syntax: page.locator('tagname')
  // Return Type 
  const inputByTag  = page.locator('input'); 
  // Description: Selects all elements with the <input> tag.


  // 2. ID
  // Syntax: page.locator('#idValue')
  // Return Type 
  const emailById  = page.locator('#inputEmail');
  // Description: Selects the element with id="inputEmail" (uses #).


  // 3. Class
  // Syntax: page.locator('.className')
  // Return Type 
  const shapeByClass  = page.locator('.shape-rectangle');
  // Description: Selects elements with the class "shape-rectangle" (uses .).


  // 4. Attribute
  // Syntax: page.locator('[attribute="value"]')
  // Return Type 
  const emailByAttribute  = page.locator('[placeholder="Email"]');
  // Description: Selects elements where the placeholder attribute equals "Email".


  // 5. Full Class
  // Syntax: page.locator('[class="full class string"]')
  // Return Type 
  const btnByFullClass  = page.locator('[class="btn active primary"]');
  // Description: Matches the exact, full class string (must match every class and order).


  // 6. Combined Selector
  // Syntax: page.locator('tag[attribute].class')
  // Return Type 
  const combinedLocator  = page.locator('input[nbinput].shape');
  // Description: Combines Tag (input), Attribute (nbinput), and Class (.shape).


  // 7. XPath
  // Syntax: page.locator('xpath_expression')
  // Return Type 
  const elementByXPath  = page.locator('//*[@id="id"]');
  // Description: Selects using XML path syntax.


  // 8. Text-Based Locators
  
  // Partial Match
  // Syntax: page.locator(':text("String")')
  const partialText  = page.locator(':text("Using")');
  // Description: Finds elements containing the word "Using".

  // Exact Match
  // Syntax: page.locator(':text-is("String")')
  const exactText  = page.locator(':text-is("Using the Grid")');
  // Description: Matches the string exactly.

});

// =============================================================================
// 5A — CSS SELECTORS
// =============================================================================
test('5A.1 — CSS basic and attribute selectors', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ID and class
  await page.locator('#firstName').fill('CSS ID');
  const allCards = page.locator('.card');
  console.log('Class selector count:', await allCards.count());

  // Attribute — exact match
  const textInputs = page.locator('input[type="text"]');
  console.log('Attribute exact:', await textInputs.count());

  // Attribute — contains (*=)
  const cardElements = page.locator('[class*="card"]');
  console.log('Attribute contains:', await cardElements.count());

  // Attribute — starts with (^=)
  await page.goto(BASE_URL);
  const hashLinks = page.locator('[href^="#/"]');
  console.log('Attribute starts-with:', await hashLinks.count());
});

test('5A.2 — CSS nested, child, and combined selectors', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Descendant — .card input → any input anywhere inside .card
  const inputsInCards = page.locator('.card input');
  console.log('Descendant:', await inputsInCards.count());

  // Direct child only — .card > .card-body
  const cardBodies = page.locator('.card > .card-body');
  console.log('Direct child:', await cardBodies.count());

  // Multiple classes — both required
  const primaryBtns = page.locator('.btn.btn-primary');
  console.log('Combined classes:', await primaryBtns.count());

  // nth-child
  const firstCard = page.locator('.card:first-child');
  console.log('First card visible:', await firstCard.isVisible());
});


// =============================================================================
// 5B — XPATH
// =============================================================================
test('5B.1 — XPath basic expressions', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Any element with a given id
  await page.locator("//*[@id='firstName']").fill('XPath User');

  // Specific tag + id
  await page.locator("//input[@id='firstName']").fill('XPath Specific');

  // contains(@class, ...)
  const cards = page.locator("//*[contains(@class,'card')]");
  console.log('XPath contains class:', await cards.count());
});

test('5B.2 — XPath text-based expressions', async ({ page }) => {
  await page.goto(BASE_URL);

  // Exact text match — //a[text()='...']
  const myBillsLink = page.locator("//a[text()='My Bills']");
  console.log('Exact text:', await myBillsLink.isVisible());

  // Contains text — //a[contains(text(),'...')]
  const billsLink = page.locator("//a[contains(text(),'Bills')]");
  console.log('Contains text:', await billsLink.isVisible());

  // normalize-space() — ignores extra whitespace
  const dashLink = page.locator("//a[normalize-space()='Dashboard']");
  console.log('Normalize-space:', await dashLink.isVisible());

  // Deep descendant navigation
  const navLinks = page.locator('//nav//a');
  console.log('nav//a count:', await navLinks.count());
});

test('5B.3 — XPath AND/OR conditions and position-based selection', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // AND condition
  await page.locator("//input[@type='text' and @id='firstName']").fill('XPath AND');

  // OR condition
  const textOrEmail = page.locator("//input[@type='text' or @type='email']");
  console.log('OR condition count:', await textOrEmail.count());

  // Position-based — (//input)[1] = first input on the page
  await page.locator('(//input)[1]').fill('First Input via XPath');
});


// =============================================================================
// 5C — TEXT SELECTORS — Partial vs Exact
// =============================================================================
/**
 * text= (or getByText without exact) → PARTIAL, case-sensitive by default.
 * text="..." (or getByText with exact:true) → EXACT match only.
 */
test('5C.1 — text= partial match (default)', async ({ page }) => {
  await page.goto(BASE_URL);

  // "Bills" matches "My Bills", "Bill Payment", etc.
  const billsPartial = page.locator('text=Bills');
  console.log('Partial "Bills":', await billsPartial.count());

  await expect(page.locator('text=Dashboard').first()).toBeVisible();
});

test('5C.2 — text="..." exact match', async ({ page }) => {
  await page.goto(BASE_URL);

  // Exact — quotes inside quotes
  const myBillsExact = page.locator('text="My Bills"');
  console.log('Exact match visible:', await myBillsExact.first().isVisible());

  // Preferred modern equivalent
  const myBillsExact2 = page.getByText('My Bills', { exact: true });
  await expect(myBillsExact2).toBeVisible();
});

test('5C.3 — CSS + text combined selectors', async ({ page }) => {
  await page.goto(BASE_URL);

  // :has-text() → partial match, works on descendants too
  const dashLink = page.locator('a:has-text("Dashboard")');
  await expect(dashLink).toBeVisible();

  // :text() → exact match
  const exactText = page.locator('a:text("Dashboard")');
  console.log('a:text() exact:', await exactText.isVisible());
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 5
// =============================================================================
/**
 * ┌───────────────────────────┬────────────────────────────────────┬──────────────────────────────────┐
 * │ Strategy                     │ Example                               │ Note                                  │
 * ├───────────────────────────┼────────────────────────────────────┼──────────────────────────────────┤
 * │ CSS ID                        │ page.locator('#id')                   │ Fastest, most specific                │
 * │ CSS attribute contains         │ page.locator('[class*="x"]')          │ Substring match on attribute value     │
 * │ CSS attribute starts-with       │ page.locator('[href^="#/"]')          │ Prefix match                           │
 * │ XPath contains text              │ //a[contains(text(),'x')]             │ Partial text via XPath                 │
 * │ XPath position                    │ (//input)[1]                          │ 1-based index in XPath, unlike nth()   │
 * │ text=x (partial)                    │ page.locator('text=Bills')            │ Case-sensitive, default behavior       │
 * │ text="x" (exact)                      │ page.locator('text="My Bills"')       │ Or getByText(x, { exact: true })       │
 * │ a:has-text("x")                        │ CSS + text combo, partial             │ Matches descendants too                │
 * └───────────────────────────┴────────────────────────────────────┴──────────────────────────────────┘
 *
 * 🎯 INTERVIEW POINT: XPath position is 1-based ((//input)[1] = FIRST input),
 *   while Playwright's own .nth() is 0-based (.nth(0) = FIRST match). Mixing
 *   these up is a very common off-by-one bug.
 */