import { test } from '@playwright/test';

test('Print all cell values of table column wise (Basic XPath Way)', async ({ page }) => {

  // Step 1: Navigate to the page containing the table
  await page.goto('http://localhost:4200/pages/tables/smart-table');

 
  const tableRows = page.locator('//table/tbody/tr');
  const totalRows = await tableRows.count();

 
  const firstRowColumns = page.locator('(//table/tbody/tr)[1]/td');
  const totalColumns = await firstRowColumns.count();

  

  /**
   * Step 4: Iterate over each row (outer loop)
   */
  for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {

    let cellEle = page.locator(`(//table/tbody/tr)[${rowIndex}]/td[2]`);
    let cellText = await cellEle.textContent();

    if(cellText === '3'){
        let ageVal = await  page.locator(`(//table/tbody/tr)[${rowIndex}]/td[7]`).textContent();
        console.log(`Age value for ID 3 is: ${ageVal}`);
    }

  }

  // Pause execution for debugging / demo
  await page.pause();
});
