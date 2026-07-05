import {test, expect} from '@playwright/test';

/**
 * Test Case:
 * Select a specific option from an AJAX-powered autosuggestive dropdown
 */
test('Wikipedia autosuggestive dropdown - select specific option', async ({ page }) => {

  // Navigate to Wikipedia homepage
  await page.goto('https://www.wikipedia.org/');

  // Type text gradually to trigger AJAX autosuggestions
  await page.locator('#searchInput').pressSequentially('India', {
    delay: 300, // delay helps mimic real user typing
  });

  // Select the desired suggestion using visible text
  await page.getByText('Country in South Asia', { exact: true }).click();

  // Pause for debugging / demo purposes
  await page.pause();
});


/**
 * Test Case:
 * Fetch and print all autosuggestion options from the dropdown
 */
test('Wikipedia autosuggestive dropdown - fetch all options', async ({ page }) => {

  // Navigate to Wikipedia homepage
  await page.goto('https://www.wikipedia.org/');

  // Trigger autosuggestions by typing
  await page.locator('#searchInput').pressSequentially('India', {
    delay: 300,
  });

  /**
   * ❌ BAD APPROACH
   * ----------------
   * Waiting for a specific suggestion text makes the test brittle.
   * - That suggestion may not always appear
   * - Network latency can cause flakiness
   */
  await page.getByText('Country in South Asia', { exact: true }).waitFor();

  /**
   * Fetch all suggestion texts at once
   * This works, but does not allow element-level interaction
   */

  // allTextContents() returns an array of strings for all matching elements
  const suggestionTexts =
    await page.locator('.suggestion-link').allTextContents();

  console.log('Suggestions (text only):', suggestionTexts);

  console.log();
  console.log();

  /**
   * ✅ GOOD APPROACH
   * ----------------
   * - Wait for the dropdown container
   * - Work with live elements
   * - Allows clicking, counting, and validation
   */
  const suggestions = page.locator('.suggestion-link');

  const suggestionCount = await suggestions.count();
  console.log(`Total suggestions: ${suggestionCount}`);

  for (let i = 0; i < suggestionCount; i++) {
    const text = await suggestions.nth(i).textContent();
    console.log(`Suggestion ${i + 1}: ${text}`);
  }

  await page.pause();
});