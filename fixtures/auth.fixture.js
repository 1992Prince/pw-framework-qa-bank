import { test as base } from "@playwright/test";

// ─── Extend base test with custom fixtures ───
export const test = base.extend({

  // ─── loggedInUser fixture ───
  // Automatically logs in before test and logs out after test
  loggedInUser: async ({ page }, use) => {

    // ── SETUP: runs before the test ──
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");
    await page.getByTestId("form-email").fill("gaurav");
    await page.getByTestId("form-password").fill("gaurav");
    await page.getByTestId("form-submit").click();

    console.log("✅ [auth fixture] Logged in successfully");

    // ── HAND OVER: provide the logged-in page to the test ──
    await use(page);

    // ── TEARDOWN: runs after the test ──
    await page.getByTestId("form-reset").click();
    console.log("🔴 [auth fixture] Logged out successfully");
  },

});

// Re-export expect so tests only need to import from this file
export { expect } from "@playwright/test";
