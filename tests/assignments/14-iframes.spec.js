import { test, expect } from '@playwright/test';

test('Interacting with single iFrames Elements', async ({ page }) => {
  
  // 1. Navigation
  await page.goto('https://gauravkhurana.in/practise-api/ui/#/practice');

  const iframeLoc = page.frameLocator('#cardIframe');

  await iframeLoc.getByTestId('iframe-card').fill("5555 5555 5555 4444")

  
  await iframeLoc.getByTestId('iframe-name').fill("Gaurav Khurana");
  // Final wait for observation
  await page.pause();
});



test('Interacting with multiple nested iFrames Elements', async ({ page }) => {
  
  // 1. Navigation
  await page.goto('https://gauravkhurana.in/practise-api/ui/#/practice');

  const outerIframeLoc = page.frameLocator('#nestedIframe');
  const nestedIframeLoc = outerIframeLoc.frameLocator('//iframe[@title="Nested iframe inner"]');

  await nestedIframeLoc.getByTestId('nested-input').fill("5555 5555 5555 4444")

  await page.pause();
});

test('Fetch all frames on Web-Page and print their URLs', async ({ page }) => {
  
  // 1. Navigation
  await page.goto('https://gauravkhurana.in/practise-api/ui/#/practice');

  const allFrames = page.frames();

  console.log("Total Frames on the page: " + allFrames.length);

  // Loop through all frames and print their URLs
  allFrames.forEach((frame, index) => {
    console.log(`Frame ${index + 1}: ${frame.url()}`);
  });

  console.log();

  // or via for loop
  for (let i = 0; i < allFrames.length; i++) {
    console.log(`Frame ${i + 1}: ${allFrames[i].url()}`);
  }

  // page.frames() returns an array of all frames on the page, 
  // including the main frame and any nested iframes. 
  // You can use this method to access and interact with any frame on the page, regardless of its nesting level.
  await page.pause();
});
