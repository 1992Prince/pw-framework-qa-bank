import { test, expect } from "@playwright/test";


test("TC001 — Handle shadow DOM elements", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  await page.getByTestId('shadow-input').fill("Hello World");
  await page.getByTestId('shadow-btn').click();
  let text = await page.locator("#shadowOut").textContent();
  console.log("Text in shadow DOM is: ", text);

  await page.waitForTimeout(10000);

});

