import { test, expect } from "@playwright/test";
import testdata from "../../testdata/registration.json" with { type: 'json' }; // import test data from JSON file

console.log("Type of testdata:", typeof testdata); // Type of testdata: object
console.log("Is testdata an array?", Array.isArray(testdata)); // Is testdata an array? true
console.log(testdata); // log the test data to the console to see the structure of the data


// now we need to loop/iterate through the test data array and run the test for each record/object
// we wil use for of loop to iterate through the test data array and run the test for each record/object

for (const data of testdata) {
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
