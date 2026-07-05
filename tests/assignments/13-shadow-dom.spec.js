import { test, expect } from '@playwright/test';

test('Interacting with Shadow DOM Elements', async ({ page }) => {
  
  // 1. Navigation
  await page.goto('https://gauravkhurana.in/practise-api/ui/#/practice');

  // 2. Identifying an element inside #shadow-root (open)
  // Even though this input is encapsulated inside a Shadow DOM, 
  // Playwright's getByTestId "pierces" the shadow boundary automatically.
  // It searches the Accessibility Tree, where the shadow DOM is flattened.
  await page.getByTestId('shadow-input').fill('Test Shadow DOM');

  // Note: Avoid using hardcoded timeouts like page.waitForTimeout() in real tests.
  // They are used here only to see the action clearly during demonstration.
  await page.waitForTimeout(3000);

  // 3. Locating by Text inside Shadow DOM
  // Standard CSS or XPath selectors would fail to find this button from the global document.
  // Playwright successfully locates it because it treats Open Shadow Roots as transparent.
  await page.getByText('Shadow Button').click();
  
  // 4. Verification (Optional Best Practice)
  // Instead of a 5-second sleep, we can assert that the action worked.
  // For example: Verify the "Clicked" message appears inside the shadow DOM.
  const successMessage = page.locator('#shadowOut'); 
  await expect(successMessage).toContainText('Clicked');

  // Final wait for observation
  await page.waitForTimeout(5000);
});