import { test, expect } from "@playwright/test";

// array of test data records/objects
let testData = [
  { id:'TC001',name: "Sarika", email: "sarika@example.com", password: "password123" }, //record 1
  { id:'TC002',name: "John", email: "john@example.com", password: "password456" }, //record 2
  { id:'TC003',name: "Alice", email: "alice@example.com", password: "password789" }, //record 3
];

// now we need to loop/iterate through the test data array and run the test for each record/object
// we wil use for of loop to iterate through the test data array and run the test for each record/object

for (const data of testData) {
  test(`Test ${data.id}`, async ({ page }) => {
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    await page.getByTestId("form-email").fill(data.email);
    await page.getByTestId("form-password").fill(data.password);
    await page.getByTestId("form-confirm-password").fill(data.name);

    if(data.id === 'TC001'){
      // this assertion will fail for TC001 as the expected value is "123" but the actual value is "TC001"
      await expect(data.id).toBe("123"); 
    }
    
    await page.waitForTimeout(3000); // hard wait to see the filled data in the form before the next test runs
  });
}
