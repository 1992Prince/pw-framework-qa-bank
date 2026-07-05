import { test, expect } from "@playwright/test";
import ExcelJS from "exceljs";



const workbook = new ExcelJS.Workbook();       
await workbook.xlsx.readFile("testdata/registration.xlsx");  



const sheet = workbook.getWorksheet('Sheet1');  // Sheet1 naam ki sheet uthao


const headerRow = sheet.getRow(1);       
const headers = headerRow.values.slice(1); 
console.log(headers); // [ 'id', 'name', 'email', 'password' ]


const testdata = [];  

sheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return;  

  const obj = {}; 

  headers.forEach((header, index) => {
    obj[header] = String(row.values[index + 1] ?? ""); 
  });

  testdata.push(obj);  
});

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
