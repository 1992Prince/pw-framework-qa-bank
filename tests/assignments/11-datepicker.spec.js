import { test, expect } from '@playwright/test';

test('DatePicker Actions Test', async ({ page }) => {

    // ------------------------------------------------------------
    // ALGORITHM – DATE PICKER SELECTION (CURRENT / PREVIOUS / NEXT)
    // ------------------------------------------------------------
    // 1. Open the date picker UI
    // 2. Wait for calendar to render (Angular loads asynchronously)
    // 3. Read currently visible month & year from calendar header
    // 4. Compare target month/year with current month/year
    //
    //    IF target month == current month
    //       → Do not navigate
    //
    //    IF target month < current month
    //       → Click "Previous Month" arrow until target month is visible
    //
    //    IF target month > current month
    //       → Click "Next Month" arrow until target month is visible
    //
    // 5. Once correct month is visible:
    //    → Filter only CURRENT MONTH days
    //    → Ignore previous/next month days (usually different color / class)
    //
    // 6. From current month days:
    //    → Select the required day using exact text match
    //
    // 7. Stop once date is selected
    // ------------------------------------------------------------


    // Navigate to DatePicker page
    await page.goto('http://localhost:4200/pages/forms/datepicker');

    // Open the date picker
    await page.getByPlaceholder('Form Picker').click();

    // Wait until at least one calendar day cell appears
    await page.waitForSelector('//*[@class="day-cell ng-star-inserted"]');

    // Get only CURRENT MONTH day cells
    // Previous and next month days are ignored based on class/style
    const currentCalendarElements = page.locator(
        '//*[@class="day-cell ng-star-inserted"]'
    );

    // Count total days available in current month view
    const size = await currentCalendarElements.count();
    console.log(size);

    // Select a specific day from current month
    // exact:true is required to avoid matching 10,11,12 when selecting 1
    await currentCalendarElements.getByText('30', { exact: true }).click();

    const val = await page.getByPlaceholder('Form Picker').inputValue();
    expect(val).toContain('30');



    // Pause for debugging / visual confirmation
    await page.pause();
});

// const date = new Date();
// const currentDay = date.getDate(); // returns current day date like 1 or 2 and type is number
// const targetMonth = date.getMonth();
// const targetYear = date.getFullYear();
// for today date there is diff class name i.e. // today selected day-cell ng-star-inserted
// and not // day-cell ng-star-inserted



test('DatePicker Actions Test2', async ({ page }) => {


    // Navigate to DatePicker page
    await page.goto('https://gauravkhurana.in/practise-api/ui/index.html#/payments');

    // <input id="dateFrom" class="input" type="date"> - here input and type and date inputformat is imp
    // on ui in input box it is coming - dd-mm-yyyy 
    // but while giving input we need to give yyyy-mm-dd format


    await page.locator('#dateFrom').fill('2026-01-31');



    // Pause for debugging / visual confirmation
    await page.pause();
});
