import { test } from '@playwright/test';

/*
  ============================================================================
  APPROACH – HOW TO READ ALL CELL VALUES FROM A TABLE
  ----------------------------------------------------------------------------
  Task:
  - A table is present on the page
  - We need to print every cell value row by row and column by column

  Steps:
  1) First, identify all the table rows using XPath
     - Count total number of rows
     - This count will be used in the OUTER loop

  2) Then, identify the number of columns
     - Fetch columns from the FIRST row only
     - Column count is assumed to be same for all rows
     - This count will be used in the INNER loop

  3) Use nested loops
     - Outer loop → iterates rows
     - Inner loop → iterates columns of the current row

  4) For each cell, fetch and print its text value
  ============================================================================
  */
test('Print all cell values of table column wise (Basic XPath Way)', async ({ page }) => {

  // Step 1: Navigate to the page containing the table
  await page.goto('http://localhost:4200/pages/tables/smart-table');

  /**
   * Step 2: Locate all rows of the table
   * XPath explanation:
   * //table/tbody/tr → selects all rows inside table body
   */
  const tableRows = page.locator('//table/tbody/tr');
  const totalRows = await tableRows.count();

  /**
   * Step 3: Locate columns from the first row
   * XPath explanation:
   * (//table/tbody/tr)[1]/td → selects all columns of first row
   * Column count is assumed to be same for all rows
   */
  const firstRowColumns = page.locator('(//table/tbody/tr)[1]/td');
  const totalColumns = await firstRowColumns.count();

  console.log(`Total Rows: ${totalRows}, Total Columns: ${totalColumns}`);
  console.log('=========================');

  /**
   * Step 4: Iterate over each row (outer loop)
   */
  for (let rowIndex = 1; rowIndex <= totalRows; rowIndex++) {

    for(let colIndex = 1; colIndex <= totalColumns; colIndex++) {

        let cellEle = page.locator(`(//table/tbody/tr)[${rowIndex}]/td[${colIndex}]`);
        const cellText = await cellEle.textContent();
        console.log(`Row ${rowIndex}, Column ${colIndex} → ${cellText}`);
    }

    // Separator after each row
    console.log('-------------------------');
  }

  // Pause execution for debugging / demo
  await page.pause();
});


 /*
  ============================================================================
  KEY NOTES / IMPORTANT POINTS
  ----------------------------------------------------------------------------
  - XPath indexing starts from 1
  - Playwright nth() indexing starts from 0
  - Column count is fetched only once for performance optimization
  - Nested loops are the most basic and reliable way to read table data
  - This approach works well when:
      * Table structure is static
      * No unique IDs are available for cells
  - For dynamic tables, advanced strategies are needed
    (filtering rows, header-based column detection, etc.)
  ============================================================================
  */




  
/**
 * Strategy (XPath-based row edit without unnecessary column iteration)

1) First, identify the table structure by fetching the total row count 
   (and column count if needed for validation).

2) Start an outer loop from index 1 to rowsCount, because XPath indexing starts from 1.

3) For each iteration, fetch all column (td) elements of the current row and store them in a single 
   Locator variable.

4) We already know the table layout:
  - nth() uses 0-based indexing
  - The ID value is present at index 1 of each row

5) Use nth(1) on the row’s column locator to read and compare the ID value.

6) Once the expected ID is found:
    - The column locator now represents only the matched row
    - There is no need to iterate through all columns

7) Since the element positions are known:
    - Edit button is available at index 0 
    - Age input textbox is available at index 6

8) Perform edit and update actions directly using these fixed indexes and exit the loop immediately.

9) Key Insight:
We do not iterate through every column because the exact column indexes are already known, 
making the approach faster, cleaner, and less error-prone.
 */

test('Find row with ID = 3 and edit its age (Basic XPath Way)', async ({ page }) => {

  // here just fetch value of age cell for id = 3
  /*
  ============================================================================
  APPROACH – EDIT A SPECIFIC ROW IN A TABLE USING XPATH
  ----------------------------------------------------------------------------
  Task:
  - A smart table is displayed on the page
  - Each row represents a record
  - We need to:
      1) Find the row where ID = 3
      2) Click the Edit button of that row
      3) Update the Age column
      4) Save the changes
  */

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
        break;
    }

  }

  // Pause execution for debugging / demo
  await page.pause();

});


// [Ignore below ones for now]
test('Print all cell values of table column wise (Basic PW Way)', async ({ page }) => {

  await page.goto('http://localhost:4200/pages/tables/smart-table');

  // find all rows count of table
  const rows = page.locator('table tbody tr');
  const rowsCount = await rows.count();

  // find all columns count of table
  const colCount = await rows.nth(0).locator('td').count();

  console.log(`Rows count: ${rowsCount}, Columns count: ${colCount}`);

  // iterate each row
  for (let i = 0; i < rowsCount; i++) {
    const cols = rows.nth(i).locator('td');
    for (let j = 0; j < colCount; j++) {
      const cellValue = await cols.nth(j).textContent();
      console.log(`Row ${i + 1}, Col ${j + 1} → ${cellValue}`);
    }

    console.log('-------------------------');

  }
  await page.pause();

});




test('Find row with id 3 and edit its age [PW way]', async ({ page }) => {

  await page.goto('http://localhost:4200/pages/tables/smart-table');

  // ID is in 2nd column (index 2)
  const idToFind = '3';

  // find all rows count of table
  const rows = page.locator('table tbody tr');
  const rowsCount = await rows.count();

  // find all columns count of table
  const colCount = await rows.nth(0).locator('td').count();

  console.log(`Rows count: ${rowsCount}, Columns count: ${colCount}`);

  // iterate each row
  for (let i = 0; i < rowsCount; i++) {
    const cols = await rows.nth(i).locator('td');
    const idValue = await cols.nth(1).textContent(); // ID is in 2nd column (index 1)
    if (idValue === idToFind) {

      await page.pause();
      await cols.nth(0).locator('ng2-st-tbody-edit-delete').locator('a').first().click();
      await cols.nth(6).locator('input').fill('101'); // Age is in 7th column (index 6)
      await cols.nth(6).press('Enter'); // Save changes
      console.log(`Updated age for ID ${idToFind} to 45`);
      break;
    }

    console.log(idValue);

  }
  await page.pause();

});


