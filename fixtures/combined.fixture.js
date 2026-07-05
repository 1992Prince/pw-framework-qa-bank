import { test as base } from "@playwright/test";

// ─────────────────────────────────────────────────────────────
// Step 1: base.extend() mein MULTIPLE fixtures define karo
//         har fixture = ek key-value pair in the object
// ─────────────────────────────────────────────────────────────
export const test = base.extend({

  // ─── Fixture 1: loggedInUser ───
  // Login karo before test, logout karo after test
  loggedInUser: async ({ page }, use) => {

    // SETUP
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");
    await page.getByTestId("form-email").fill("gaurav");
    await page.getByTestId("form-password").fill("gaurav");
    await page.getByTestId("form-submit").click();
    console.log("✅ [loggedInUser] Logged in");

    // HAND OVER
    await use(page);

    // TEARDOWN
    await page.getByTestId("form-reset").click();
    console.log("🔴 [loggedInUser] Logged out");
  },

  // ─── Fixture 2: apiToken ───
  // API se auth token fetch karo before test
  // request built-in fixture inject kiya — browser ki zaroorat nahi
  apiToken: async ({ request }, use) => {

    // SETUP — token fetch karo
    const response = await request.post("https://api.example.com/auth/login", {
      data: {
        username: "testuser",
        password: "testpass123",
      },
    });
    const body = await response.json();
    const token = body.token;
    console.log("✅ [apiToken] Token fetched");

    // HAND OVER — token string pass karo test ko
    await use(token);

    // TEARDOWN — agar token revoke karna ho
    // await request.post("https://api.example.com/auth/logout", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    console.log("🔴 [apiToken] Token teardown done");
  },

});

// Step 2: expect re-export karo — spec files ko alag se import nahi karna padega
export { expect } from "@playwright/test";
