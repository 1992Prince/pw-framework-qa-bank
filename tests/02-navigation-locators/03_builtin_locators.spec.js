/**
 * ============================================================================
 * TOPIC 6 — BUILT-IN LOCATORS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: getByRole, getByLabel, getByPlaceholder, getByText, getByTestId,
 *         getByAltText, getByTitle — plus multi-match iteration on each
 * SOURCE: spec2-builtin-locators_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * All getBy*() locators are built on top of the Locator API, so they get the
 * same auto-waiting + retry-ability as page.locator() — they're just more
 * READABLE and closer to how a real user/screen-reader identifies elements.
 * Prefer them over raw CSS/XPath whenever the element has an accessible
 * role, label, placeholder, or visible text.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gauravkhurana.com/practise-api/ui/index.html';
const PRACTICE_URL = `${BASE_URL}#/practice`;


// =============================================================================
// 6.1 — getByRole() — links and buttons, exact vs partial, iteration
// =============================================================================
test('6.1 — getByRole() for links and buttons', async ({ page }) => {
  await page.goto(BASE_URL);

  // Exact link name
  const myBillsLink = page.getByRole('link', { name: 'My Bills', exact: true });
  await expect(myBillsLink).toBeVisible();

  // Partial (default) — "Bills" matches "My Bills", "Pay Bills", etc.
  const billsPartial = page.getByRole('link', { name: 'Bills' });
  console.log('Partial matches:', await billsPartial.count());

  // Regex — case-insensitive
  const paymentLink = page.getByRole('link', { name: /payment/i });
  console.log('Regex matches:', await paymentLink.count());

  // ── Multi-match iteration — all links on the page ──────────────────────
  const allLinks = page.getByRole('link');
  const count = await allLinks.count();
  for (let i = 0; i < count; i++) {
    const text = await allLinks.nth(i).textContent();
    console.log(`Link ${i + 1}: "${text?.trim()}"`);
  }

  // Buttons work the same way
  const getStartedBtn = page.getByRole('button', { name: 'Get Started' });
  await expect(getStartedBtn).toBeVisible();
});


// =============================================================================
// 6.2 — getByLabel() — form controls via their label text
// =============================================================================
test('6.2 — getByLabel() — exact vs partial vs regex', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // exact: true is the DEFAULT-RECOMMENDED usage — full label match
  await page.getByLabel('First Name', { exact: true }).fill('Exact Label');

  // exact: false — partial label match
  await page.getByLabel('First', { exact: false }).fill('Partial Label');

  // Regex — case-insensitive
  await page.getByLabel(/first name/i).fill('Regex Label');
});


// =============================================================================
// 6.3 — getByPlaceholder() — input placeholder text
// =============================================================================
test('6.3 — getByPlaceholder() — exact vs partial', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  await page.getByPlaceholder('Enter first name').fill('Placeholder Test');

  // Partial (default) — "Enter" matches all "Enter ___" fields
  const enterInputs = page.getByPlaceholder('Enter', { exact: false });
  console.log('Partial placeholder matches:', await enterInputs.count());

  // Exact match
  await page.getByPlaceholder('Enter first name', { exact: true }).fill('Exact Placeholder');
});


// =============================================================================
// 6.4 — getByText() — visible text content
// =============================================================================
/**
 * Default: partial match, case-sensitive. Use exact:true or a RegExp for
 * stricter control.
 */
test('6.4 — getByText() — partial, exact, regex', async ({ page }) => {
  await page.goto(BASE_URL);

  // Partial (default)
  await expect(page.getByText('Dashboard')).toBeVisible();

  // Exact
  await expect(page.getByText('My Bills', { exact: true })).toBeVisible();

  // Regex — case-insensitive, and "starts with" pattern
  await expect(page.getByText(/billpay/i)).toBeVisible();
  await expect(page.getByText(/^My Bills/)).toBeVisible();
});


// =============================================================================
// 6.5 — getByTestId() — data-testid attribute (most resilient to UI changes)
// =============================================================================
/**
 * Default attribute: data-testid. Configurable in playwright.config.ts via
 * `use: { testIdAttribute: 'data-qa' }` if your team uses a different name.
 */
test('6.5 — getByTestId() — resilient automation hooks', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const el = page.getByTestId('firstName');
  console.log('Exists:', await el.isVisible().catch(() => false));

  // Regex — any testid containing "name"
  const nameInputs = page.getByTestId(/name/i);
  console.log('Matches containing "name":', await nameInputs.count());
});


// =============================================================================
// 6.6 — getByAltText() and getByTitle()
// =============================================================================
test('6.6 — getByAltText() — images, and iteration over all alt attributes', async ({ page }) => {
  await page.goto(BASE_URL);

  const allImages = page.locator('img');
  const imgCount = await allImages.count();

  for (let i = 0; i < imgCount; i++) {
    const alt = await allImages.nth(i).getAttribute('alt');
    console.log(`Image ${i + 1} alt: "${alt}"`);
  }

  const logo = page.getByAltText('BillPay');
  if (await logo.isVisible()) {
    await expect(logo).toBeVisible();
  }

  // Partial alt text match
  const partialAlt = page.getByAltText('Bill', { exact: false });
  console.log('Partial alt matches:', await partialAlt.count());
});

test('6.7 — getByTitle() — tooltip/title attribute', async ({ page }) => {
  await page.goto(BASE_URL);

  const swaggerByTitle = page.getByTitle('API Docs');
  await expect(swaggerByTitle).toBeVisible();

  // Exact vs partial
  await expect(page.getByTitle('API Docs', { exact: true })).toBeVisible();
  const partialTitle = page.getByTitle('API', { exact: false });
  console.log('Partial title matches:', await partialTitle.count());
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 6
// =============================================================================
/**
 * ┌────────────────────┬────────────────────────────────┬──────────────┬────────────────────────────────────┐
 * │ Locator               │ Targets                            │ Default exact│ Best for                                │
 * ├────────────────────┼────────────────────────────────┼──────────────┼────────────────────────────────────┤
 * │ getByRole()             │ Accessible role (link/button/etc.) │ false          │ Nav links, buttons, form controls       │
 * │ getByLabel()             │ Form control via its <label>        │ true            │ Inputs with visible labels               │
 * │ getByPlaceholder()        │ Input's placeholder attribute        │ false            │ Inputs without a label element            │
 * │ getByText()                 │ Visible text anywhere                │ false             │ Headings, messages, static content         │
 * │ getByTestId()                 │ data-testid attribute                │ n/a (exact string)│ Most resilient — survives UI/CSS changes   │
 * │ getByAltText()                  │ Image alt attribute                  │ false              │ Images                                      │
 * │ getByTitle()                      │ title (tooltip) attribute            │ false               │ Elements with a tooltip                     │
 * └────────────────────┴────────────────────────────────┴──────────────┴────────────────────────────────────┘
 *
 * 🎯 INTERVIEW POINT: getByLabel() defaults to exact:true, but most others
 *   (getByRole, getByText, getByPlaceholder, getByAltText, getByTitle)
 *   default to PARTIAL match. Always double-check which default applies —
 *   assuming the wrong one is a common source of "locator matched too many
 *   / too few elements" bugs.
 */