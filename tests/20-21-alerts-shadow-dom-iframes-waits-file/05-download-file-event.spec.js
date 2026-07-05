import { test, expect } from "@playwright/test";


test("TC001 — Default Download File", async ({
  page,
}) => {


  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

  await page.locator("#downloadButton").click();

  // with above code file will be downloaded to temporary memory and once 
  // test finishes, browser context will be closed and file will be deleted from memory.
  // to save file to disk, we need to listen for "download" event and then save file to disk.

  await page.waitForTimeout(10000);

});

test("TC002 — Download File Event and Save to Disk", async ({
  page,
}) => {

  /**
   * For every attachement downloaded by the page , page.on("download") event will be emitted
   * All these downloads are downloaded in temporary folder.
   * https://playwright.dev/docs/downloads
   */

  await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");

  // STEP 1: Register the listener BEFORE the action that triggers download —
  // same rule as tabs/windows — listener must be ready before the trigger fires,
  // otherwise the event can be missed
  const downloadPromise = page.waitForEvent('download'); 

  // STEP 2: Perform the action that actually starts the download
  await page.locator("#downloadButton").click();

  // STEP 3: Now await the promise — this gives us a "Download" object,
  // which represents the file Playwright captured (still sitting in temp folder at this point)
  const download = await downloadPromise; // Wait for the download event to be emitted

  // STEP 4: Decide where and with what name we want to SAVE this downloaded file
  // permanently in our own project folder (since right now it's only in a temp location)

  // Option A — give your own custom file name/path manually:
  // const downloadPath = "./downloads/tabulardata.xlsx";

  // Option B (used here) — download.suggestedFilename() gives us the file name
  // that the SERVER suggested / the same name the app would normally save it as
  // (e.g., "report.xlsx", "invoice.pdf") — so we don't have to hardcode the name ourselves
  

  // Wait for the download process to complete and save the downloaded file somewhere.
  // saveAs() method will wait for the download to complete and then save the file to the specified path.
  // saveAs() can wait for how much time maximum? - it will wait until the download is complete, 
  // there is no fixed timeout. If the download takes too long, it may throw an error.

  // const downloadPath = "./downloads/tabulardata.xlsx" // u can give your file name here or

  // this will save the file with the name suggested by the server or same file name as in app
  const downloadPath = `./downloads/${download.suggestedFilename()}`; 
  await download.saveAs(downloadPath);

  await page.waitForTimeout(10000);

});