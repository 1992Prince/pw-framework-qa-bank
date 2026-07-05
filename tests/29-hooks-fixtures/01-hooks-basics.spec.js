import { test, expect } from "@playwright/test";

test.beforeAll(async () => {
  console.log("🟢 beforeAll — Test suite starting");
});

test.beforeEach(async ({ page }) => {
  console.log("🔵 beforeEach — Running before each test");
});

test("TC001 - First test", async ({ page }) => {
  console.log("▶ TC001 running");
});

test("TC002 - Second test", async ({ page }) => {
  console.log("▶ TC002 running");
});

test("TC003 - Third test", async ({ page }) => {
  console.log("▶ TC003 running");
});

test.afterEach(async ({ page }, testInfo) => {
  console.log(`🟡 afterEach — "${testInfo.title}" status: ${testInfo.status}`);
});

test.afterAll(async () => {
  console.log("🔴 afterAll — Test suite ended");
});
