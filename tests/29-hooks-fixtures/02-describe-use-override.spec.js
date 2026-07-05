import { test, expect } from "@playwright/test";

// ─── Top-Level Hook (applies to ALL tests in this file) ───
test.beforeAll(async () => {
  console.log("🟢 [TOP] beforeAll — spec file starting");
});

test.afterAll(async () => {
  console.log("🔴 [TOP] afterAll — spec file ending");
});

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`🔵 [TOP] beforeEach — starting: "${testInfo.title}"`);
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(
    `🟡 [TOP] afterEach — "${testInfo.title}" | status: ${testInfo.status} | duration: ${testInfo.duration}ms`
  );
});

// ─────────────────────────────────────────────────────────────
// Group 1: Desktop Tests — 1280x720 viewport (default light)
// ─────────────────────────────────────────────────────────────
test.describe("Desktop Tests", () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    console.log("🔵 [Desktop] beforeEach — navigating to homepage");
    await page.goto("https://playwright.dev/");
  });

  test("TC001 - Desktop page title", async ({ page }) => {
    console.log("▶ [Desktop] TC001 running — checking page title");
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("TC002 - Desktop nav bar visible", async ({ page }) => {
    console.log("▶ [Desktop] TC002 running — checking nav visibility");
    await expect(page.locator("nav")).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
// Group 2: Mobile Tests — 375x667 viewport
// ─────────────────────────────────────────────────────────────
test.describe("Mobile Tests", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    console.log("🔵 [Mobile] beforeEach — navigating to homepage");
    await page.goto("https://playwright.dev/");
  });

  test("TC001 - Mobile page title", async ({ page }) => {
    console.log("▶ [Mobile] TC001 running — checking page title");
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("TC002 - Mobile viewport width", async ({ page }) => {
    console.log("▶ [Mobile] TC002 running — verifying viewport is mobile");
    const viewportWidth = page.viewportSize().width;
    console.log(`   viewport width: ${viewportWidth}px`);
    expect(viewportWidth).toBe(375);
  });
});

// ─────────────────────────────────────────────────────────────
// Group 3: Dark Mode Tests — colorScheme override
// ─────────────────────────────────────────────────────────────
test.describe("Dark Mode Tests", () => {
  test.use({
    colorScheme: "dark",
    viewport: { width: 1440, height: 900 },
  });

  test.beforeEach(async ({ page }) => {
    console.log("🔵 [Dark] beforeEach — navigating to homepage");
    await page.goto("https://playwright.dev/");
  });

  test("TC001 - Dark mode page loads", async ({ page }) => {
    console.log("▶ [Dark] TC001 running — page should load in dark mode");
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("TC002 - Dark mode viewport size", async ({ page }) => {
    console.log("▶ [Dark] TC002 running — verifying viewport is 1440px");
    const viewportWidth = page.viewportSize().width;
    console.log(`   viewport width: ${viewportWidth}px`);
    expect(viewportWidth).toBe(1440);
  });
});
