import { test, expect } from "@playwright/test";
// import test data from JSON file
import testdata from "../../testdata/loginfunctionality.json" with { type: 'json' }; 

/**
 * In JSON file we have objects[Object with object ] with different keys like "validRegistration" and 
 * "invalidEmailFormat".
 * after importing the JSON file, we will get JSON object with keys and values.
 * we can access the values of the keys using dot notation or bracket notation.
 * for example, to access the value of "validRegistration" key, we can use
 * testdata.validRegistration or testdata["validRegistration"].
 * the value of "validRegistration" key is an array of objects, so we can loop through the array and run the test for each object.
 * we can use for of loop to iterate through the array and run the test for each object.
 */


test(`TC001 - login with valid credentials`, async ({ page }) => {
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    await page.getByTestId("form-email").fill(testdata.validRegistration[0].email);
    await page.getByTestId("form-password").fill(testdata.validRegistration[0].password);
    
    await page.waitForTimeout(3000); // hard wait to see the filled data in the form before the next test runs
  });


  test(`TC002 - login with invalid email format`, async ({ page }) => {
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    await page.getByTestId("form-email").fill(testdata.invalidEmailFormat[0].email);
    await page.getByTestId("form-password").fill(testdata.invalidEmailFormat[0].password);
    
    await page.waitForTimeout(5000); // hard wait to see the filled data in the form before the next test runs
  });