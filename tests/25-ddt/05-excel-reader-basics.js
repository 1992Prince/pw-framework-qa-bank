import ExcelJS from "exceljs";


// Step 1 — Workbook object banao aur file padho
const workbook = new ExcelJS.Workbook();      
await workbook.xlsx.readFile("testdata/registration.xlsx");  // load Excel file


// Step 2 — Sheet lo naam se
const sheet = workbook.getWorksheet('Sheet1');  // get sheet by name

// Read All Rows — Using eachRow()

sheet.eachRow((row, rowNum) => {
  console.log(`Row ${rowNum}:`, row.values);  // [undefined, value1, value2, ...]
});

/**
 * eachRow() method se har row pe callback function chalta hai
 *    - row — current row object
 *    - rowNum — current row number (1-based index)
 * row.values — array of all cell values in that row
 * Index 0 is always undefined (ExcelJS quirk)
 * Actual cell values start from index 1
 */

/**
 * output:
 * Row 1: [ <1 empty item>, 'id', 'name', 'email', 'password' ]
Row 2: [
  <1 empty item>,
  'TC001',
  'Sarika',
  'sarika@example.com',
  'password123'
]
Row 3: [ <1 empty item>, 'TC002', 'John', 'john@example.com', 'password456' ]
Row 4: [
  <1 empty item>,
  'TC003',
  'Alice',
  'alice@example.com',
  'password789'
]
 */

console.log();



// Read Specific Row — Using getRow()
const row = sheet.getRow(2);  // get row 2
console.log(row.values);  // [<1 empty item>,'TC001','Sarika','sarika@example.com','password123']

console.log();

// OR get cell value by row and column number
const cell = sheet.getCell(1, 1);  // row 1, column 1
console.log(cell.value);  // 'id'

console.log();

// Read Headers (Row 1)
const headers = sheet.getRow(1).values.slice(1);  // skip index 0
console.log("Headers:", headers);  // Headers: [ 'id', 'name', 'email', 'password' ]