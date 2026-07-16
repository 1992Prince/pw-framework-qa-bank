import { test, expect } from "@playwright/test";

test('Select Dropdown — selectOption() — label, value, index', async ({ page }) => {
  await page.goto("https://gauravkhurana.in/practise-api/ui/index.html#/practice");

  const countryDropdown  = page.getByRole('combobox', { name: 'Country' });
  await countryDropdown.focus(); // optional, good practice before selection

  // By visible label text
  await countryDropdown.selectOption('United Kingdom');

  //await page.pause();

  // By value attribute — <option value="au">
  await countryDropdown.selectOption({ value: 'au' });

  //await page.pause();

  // By index — 0-based (0 = first option)
  await countryDropdown.selectOption({ index: 1 });
  //await page.pause();

  // Fetch all available option texts and count — useful for assertions
  //const optionTexts = await countryDropdown.locator('option').allTextContents();
  const drpDwnEls = await countryDropdown.locator('option');
  const optionCount = await countryDropdown.locator('option').count();
  console.log("DropDown elements count is- ", optionCount);
  console.log();

  for(let i=0;i<optionCount;i++){
    let eleTxt = await drpDwnEls.nth(i).innerText();
    console.log(`Dropdown ${i}th index text is - ${eleTxt}`);
  }
  await page.pause();
});


test('Select Dropdown — selectOption() — multi-select', async ({ page }) => {
  await page.goto("https://gauravkhurana.in/practise-api/ui/index.html#/practice");

  const skillsDropdown  = page.getByTestId('frameworks');
  await skillsDropdown.selectOption(['TestCafe', 'Playwright', 'Selenium']);

  await page.pause();
});


test("AutoSuggestive Dropdown", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  await page.locator("#autocomplete").pressSequentially("uni", {delay:100});

  let dropDownEleTxt = page.getByText("United States (USA)");
  await dropDownEleTxt.waitFor();

  await dropDownEleTxt.click();

  let dropdownEles = await page.locator(".ui-menu-item");
  let dropdownElesCount = await page.locator(".ui-menu-item").count();

  console.log("DropDwn Eles - ",dropdownElesCount);

  for(let i=0;i<dropdownElesCount;i++){
    let eleTxt = await dropdownEles.nth(i).innerText();
    console.log(`Dropdown ${i}th index text is - ${eleTxt}`);
  }



  await page.pause();
});


// later once u r free => open google.com => enter playwright and from suggestive suggestions 
// fetch all text and then compare and select only the text which you want and click on it.
