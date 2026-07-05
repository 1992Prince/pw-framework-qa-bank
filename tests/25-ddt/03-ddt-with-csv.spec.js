import { test, expect } from "@playwright/test";
import Papa from "papaparse"; // import papaparse library to parse CSV files
import fs from "fs"; // import fs module to read files


function readCSV(filePath){
  const csvData = fs.readFileSync(filePath, "utf-8"); // read the CSV file
  const parsedData = Papa.parse(csvData, {
    header: true, // treat the first row as header
    skipEmptyLines: true, // skip empty lines in the CSV file
  });
  return parsedData.data; // return the parsed data as an array of objects
}

const testdata = readCSV("testdata/registration.csv"); // read the test data from the CSV file

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
