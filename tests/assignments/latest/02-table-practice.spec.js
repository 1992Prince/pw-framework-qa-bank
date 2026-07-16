import { test, expect } from "@playwright/test";

test('Table - count rows and columns and print 2row content', async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  let tableEle = page.locator("#product").first();

  await tableEle.waitFor();

  let rowCount = await page.locator("(//table[@id='product'])[1]/tbody/tr").count();

  let colCount = await page.locator("((//table[@id='product'])[1]/tbody/tr)[2]/td").count();

  for(let i=1;i<=colCount;i++){

    let colText = await page.locator(`(((//table[@id='product'])[1]/tbody/tr)[3]/td)[${i}]`).innerText();
    console.log(colText);
  }


  await page.pause();
});