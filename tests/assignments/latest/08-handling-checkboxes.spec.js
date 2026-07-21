import { test, expect } from "@playwright/test";


test("Fetch all checkboxes - text", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  let checkboxRadioParentEle = page.locator("//*[@class='card']").filter({hasText: "Radio Buttons & Checkboxes"});

  let allcheckboxes = checkboxRadioParentEle.locator(".checkbox-label");

  await allcheckboxes.first().waitFor();

  let count = await allcheckboxes.count();

  for(let i=0;i<count;i++){
    let text = await allcheckboxes.nth(i).innerText();
    console.log("Checkbox text is - ", text);
  }

  console.log();

   let allradiobuttons = checkboxRadioParentEle.locator(".radio-label");

  await allradiobuttons.first().waitFor();

  count = await allradiobuttons.count();

  for(let i=0;i<count;i++){
    let text = await allradiobuttons.nth(i).innerText();
    console.log("Radio text is - ", text);
  }



  await page.waitForTimeout(10000);

});

