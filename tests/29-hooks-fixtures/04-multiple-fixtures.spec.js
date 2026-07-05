import { test, expect } from "../../fixtures/combined.fixture.js";

// ─── Test 1: Sirf loggedInUser fixture use karo ───
test("TC001 - Logged in user sees practice page", async ({ loggedInUser }) => {
  console.log("▶ TC001 — using loggedInUser fixture only");
  await expect(loggedInUser).toHaveURL(/practice/);
});

// ─── Test 2: Sirf apiToken fixture use karo ───
test("TC002 - API token is fetched and valid", async ({ apiToken }) => {
  console.log("▶ TC002 — using apiToken fixture only");
  console.log("   Token received:", apiToken);
  expect(typeof apiToken).toBe("string");
  expect(apiToken.length).toBeGreaterThan(0);
});

// ─── Test 3: Dono fixtures ek saath use karo ───
test("TC003 - Logged in user + API token both available", async ({
  loggedInUser,
  apiToken,
}) => {
  console.log("▶ TC003 — using both fixtures together");
  console.log("   Token:", apiToken);
  await expect(loggedInUser).toHaveURL(/practice/);
  expect(typeof apiToken).toBe("string");
});
