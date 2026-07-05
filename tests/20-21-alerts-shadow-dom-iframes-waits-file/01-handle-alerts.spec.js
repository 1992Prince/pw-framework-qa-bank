import { test, expect } from "@playwright/test";


test("TC001 [ALERT] — PW default behaviour to dismiss alerts", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  await page.getByTestId("show-alert").click();

  // by default pw will dismiss the alert and it will not throw any error if alert is present
  // in alert we have only one option mostly ok button
  // clicking on it is same as dismissing the alert

  // once alert is dismissed then we can verify the text which comes after dismissing the alert


  await expect(page.locator("#dialogResult")).toHaveText("Dialog result: Alert dismissed");
  await page.waitForTimeout(10000);

  // But now we want to capture the text of on alert wch is covered in next test case
});


test("TC002 [ALERT] — Capture alert text", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // if u have alert or confirm or prompt, they all fall under dialog event
  // and dialog event comes under page event
  // we will use page.on() method and it have 2 parmeters first is event name and 
  // second is listener i.e. callback function which will be executed when the event is triggered

  page.on("dialog", async (dialog) => {
    // dialog is an object which contains the details of the alert or confirm or prompt
    // dialog have methods like accept(), dismiss(), message() etc.
    console.log("Alert text is: " + dialog.message()); // this will print the text of the alert in the console
    await dialog.accept(); // this will accept the alert
  });

  // event we have to listen before the action which will trigger the alert because 
  // if we listen after the action then we will miss the event and it will not be captured
  await page.getByTestId("show-alert").click();


  await expect(page.locator("#dialogResult")).toHaveText("Dialog result: Alert dismissed");
  await page.waitForTimeout(10000);

  // once u register dialog event with page.on() method then it will be triggerd for all the 
  // alerts or confirms or prompts which will be triggered on that page
  // after registering the dialog event if event 10 actions are triggering 10 alerts then
  // dialog event will be triggered 10 times and we can capture the text of all the alerts in the console
  // to remove the dialog event listener we can use page.off() 
  // e.g. page.off("dialog", dialogListener); // this will remove the dialog event listener
});

test("TC003 [ALERT] — Capture alert text and dismiss the alert", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");



  page.on("dialog", async (dialog) => {
    console.log("Alert text is: " + dialog.message()); 
    await dialog.dismiss(); 
  });

  /**
   * In alert we have only one option so we don't have option to dismiss it.
   * We can use dismiss() method to dismiss the alert but it will work same as accept() method 
   * because in alert we have only one option which is ok button and clicking on it is same as 
   * accepting the alert or dismissing the alert.
   * 
   * So for alert we can use dialog accept() method or message() method.
   */

  await page.getByTestId("show-alert").click();
  await expect(page.locator("#dialogResult")).toHaveText("Dialog result: Alert dismissed");


  await page.waitForTimeout(10000);

});


test("TC004 [CONFIRM] — PW default behavior with confirm alert", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");



  // page.on("dialog", async (dialog) => {
  //   console.log("Alert text is: " + dialog.message()); 
  //   await dialog.dismiss(); 
  // });

  /**
   * In confirm we have two options, ok and cancel, so we can use accept() method to click 
   * on ok button and dismiss() method to click on cancel button.
   * 
   * So for confirm we can use dialog accept() method or dismiss() method.
   * 
   * Here PW automaically dismiss the confirm alert wch is equivalent to clicking on cancel 
   * button 
   */
   

  await page.getByTestId("show-confirm").click();
  await expect(page.locator("#dialogResult")).toHaveText("Dialog result: Confirm cancelled");


  await page.waitForTimeout(10000);

});


test("TC005 [CONFIRM] — Capture confirm alert text and accept the alert", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");



   page.on("dialog", async (dialog) => {
     console.log("Confirm Alert text is: " + dialog.message()); 
     await dialog.accept(); 
   });

   

  await page.getByTestId("show-confirm").click();
  await expect(page.locator("#dialogResult")).toHaveText("Dialog result: Confirm accepted");


  await page.waitForTimeout(10000);

});

test("TC006 [CONFIRM] — Capture confirm alert text and dismiss the alert", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");



   page.on("dialog", async (dialog) => {
     console.log("Confirm Alert text is: " + dialog.message()); 
     await dialog.dismiss(); 
   });

   

  await page.getByTestId("show-confirm").click();
  await expect(page.locator("#dialogResult")).toHaveText("Dialog result: Confirm cancelled");


  await page.waitForTimeout(10000);

});


test("TC007 [PROMPT] — Capture prompt alert text and accept the prompt with text", async ({
  page,
}) => {


  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");



   page.on("dialog", async (dialog) => {
     console.log("Prompt Alert text is: " + dialog.message()); 

     // this will enter the text in the prompt alert and click on ok button
    await dialog.accept("Prince Kumar"); 
    
   });

   

  await page.getByTestId("show-prompt").click();
  await expect(page.locator("#dialogResult")).toContainText("Prince Kumar");


  await page.waitForTimeout(10000);

});

test("TC008 [PROMPT] — Capture prompt alert text and dismiss the prompt", async ({
  page,
}) => {

  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");


   page.on("dialog", async (dialog) => {
     console.log("Prompt Alert text is: " + dialog.message()); 

    await dialog.dismiss(); 
    
   });


  await page.getByTestId("show-prompt").click();
  await expect(page.locator("#dialogResult")).toContainText("null");

  await page.waitForTimeout(10000);

});