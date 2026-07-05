import { test, expect } from "../../fixtures/auth.fixture.js";

test("TC001 - Verify logged in user can see practice page", async ({ loggedInUser }) => {
  console.log("▶ TC001 running — user is already logged in via fixture");

  // Fixture has already logged in — just write test steps here
  await expect(loggedInUser).toHaveURL(/practice/);
  console.log("✅ TC001 — practice page URL confirmed");
});
