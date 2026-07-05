import { test, expect } from "@playwright/test";


test("TC001 — Wait for Loading text to disappear", async ({
  page,
}) => {
  // CONCEPT: Navigate to the application under test
  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // CONCEPT: Trigger the action that initiates asynchronous loading behavior
  await page.getByTestId("load-delayed").click();

  /**
   * CONCEPT: Explicit Wait Pattern
   * When the button is clicked, a "Loading..." text appears for 3 seconds, then disappears.
   * We need to synchronize with this asynchronous behavior by waiting for the element
   * to appear and then disappear, rather than using hard waits or hoping timing works out.
   * This prevents flaky tests by ensuring subsequent steps only execute when the UI 
   * is in the expected state.
   */

  let loadingText = page.locator("(//span[@class='muted'])[2]");

  // CONCEPT: Wait for Element Visibility
  // The toBeVisible() assertion waits until the element is visible or timeout occurs.
  // Default timeout is 5 seconds, but we reduce it to 2 seconds since the text 
  // appears immediately after clicking the button.
  // This demonstrates tuning wait times based on expected behavior.
  await expect(loadingText).toBeVisible({ timeout: 2000 });

  console.log("Loading text is visible on the page");

  // CONCEPT: Wait for Element to Disappear
  // The toBeHidden() assertion waits until the element is no longer visible.
  // We use the default 5-second timeout since the loading operation takes 3 seconds,
  // providing a buffer for network variations or slower executions.
  // This ensures we don't proceed until the loading state is truly complete.
  await expect(loadingText).toBeHidden({ timeout: 5000 });

  console.log("Loading text is hidden on the page");

  /**
   * CONCEPT: Synchronization Strategy Summary
   * This pattern demonstrates the proper way to handle asynchronous UI changes:
   * 1. Trigger the action that causes asynchronous behavior
   * 2. Wait for temporary UI indicators (text/spinner) to appear
   * 3. Wait for those indicators to disappear
   * 4. Only then proceed with validating the final state
   * 
   * This same pattern applies to spinners, progress bars, or any loading indicators
   * that appear and disappear during operations like page loads, API calls, or data processing.
   */

  // CONCEPT: Hard Wait (Anti-pattern - included for comparison)
  // While we've used explicit waits above, this hard-coded wait is a fallback
  // and should be avoided whenever possible. It's included here as a safety net,
  // but explicit waits like toBeHidden() are always preferred.
  await page.waitForTimeout(10000);
});
