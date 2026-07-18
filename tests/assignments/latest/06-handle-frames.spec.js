import { test, expect } from "@playwright/test";


test("TC001 — Handle frames", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  const iframeLoc = await page.frameLocator("#cardIframe");
  const frameTextBoxText = await iframeLoc.getByTestId("iframe-card").getAttribute("value");
  console.log("Text in frame is: ", frameTextBoxText);

  await iframeLoc.getByTestId("iframe-card").fill("2323232322");

  await iframeLoc.getByTestId("iframe-name").fill("Gaurav Khurana");

  await page.waitForTimeout(10000);

});

