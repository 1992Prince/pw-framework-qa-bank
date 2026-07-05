import { test, expect } from '@playwright/test';




/**
 * Test Case:
 * Scroll to element using a combination of
 * - scrollIntoViewIfNeeded()
 * - focus / click
 * - mouse.wheel()
 */
test('Scroll to element Test', async ({ page }) => {

  // ------------------------------------------------------------
  // 1. Navigate to the Practice Page
  // ------------------------------------------------------------
  await page.goto(
    'https://gauravkhurana.in/practise-api/ui/index.html#/practice'
  );

  // ------------------------------------------------------------
  // 2. Ensure Scrollable Section Is Visible
  // ------------------------------------------------------------
  // Sometimes directly scrolling to an element does not work
  // because the scroll container itself is not in the viewport.
  // First, scroll to a visible element near the scroll section.
  const scrollSectionHeader = page.getByText('Infinite Scroll');
  await scrollSectionHeader.scrollIntoViewIfNeeded(); // or click so that automatic scrolling should happen

  // Pause to visually confirm scroll section visibility
  await page.pause();

  // ------------------------------------------------------------
  // 3. Bring Focus to the Scrollable Container
  // ------------------------------------------------------------
  // Focusing or clicking a visible element inside the scroll area
  // ensures mouse wheel scrolling affects the correct container.
  const firstVisibleItem = page.getByText('Item #1', { exact: true });
  await firstVisibleItem.focus();
  await firstVisibleItem.click();

  // ------------------------------------------------------------
  // 4. Scroll Down Using Mouse Wheel
  // ------------------------------------------------------------
  // Each mouse.wheel() call scrolls the container down by pixels
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 200);

  // ------------------------------------------------------------
  // 5. Scroll Directly to a Target Element
  // ------------------------------------------------------------
  // This element is initially outside the viewport
  // scrollIntoViewIfNeeded() scrolls just enough to make it visible
  const targetItem = page.getByText('Item #31');
  await targetItem.scrollIntoViewIfNeeded();

  // ------------------------------------------------------------
  // 6. Pause for Debugging / Visual Verification
  // ------------------------------------------------------------
  await page.pause();
});


test('Infinte Scroll Test', async ({ page }) => {

  // ------------------------------------------------------------
  // 1. Navigate to the Practice Page
  // ------------------------------------------------------------
  await page.goto('https://gauravkhurana.in/practise-api/ui/#/practice');

  const scrollEle = page.getByText('Infinite Scroll');
  await scrollEle.scrollIntoViewIfNeeded();

  await page.getByTestId('scroll-item-1').click();

  await page.pause();

  const targetItem = page.getByText('Item #44')


  while (!(await targetItem.isVisible())) {
    await page.mouse.wheel(0, 500);
  }

  await targetItem.scrollIntoViewIfNeeded(); // or use hover()
  await targetItem.click();

  await page.pause();

});

test('Scroll Page Top and bottom Test', async ({ page }) => {

  // ------------------------------------------------------------
  // 1. Navigate to the Practice Page
  // ------------------------------------------------------------
  await page.goto('https://gauravkhurana.in/practise-api/ui/#/practice');

  await page.pause();
  
  // scroll page to bottom
  await page.evaluate(() => {
  window.scrollTo(0, document.body.scrollHeight);
});


  await page.pause();

  // scroll page to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await page.pause();

});