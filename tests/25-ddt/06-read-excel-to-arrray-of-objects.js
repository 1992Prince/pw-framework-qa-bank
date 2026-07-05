import ExcelJS from "exceljs";


// Step 1 — Workbook object banao aur file padho
const workbook = new ExcelJS.Workbook();       // ExcelJS ka object banaya
await workbook.xlsx.readFile("testdata/registration.xlsx");  // file padhi disk se


// Step 2 — Sheet lo naam se
const sheet = workbook.getWorksheet('Sheet1');  // Sheet1 naam ki sheet uthao

// Step 3 — Pehle headers nikalo

const headerRow = sheet.getRow(1);         // row 1 uthao — yahi header row hai
const headers = headerRow.values.slice(1); // index 0 empty hota hai exceljs mein, isliye slice(1)
console.log(headers); // [ 'id', 'name', 'email', 'password' ]
// headers kya return karega? - Ek simple array of strings:



// Step 4 — Baaki rows iterate karo aur array banao

const testdata = [];  // empty array jisme saare records jayenge

sheet.eachRow((row, rowNumber) => {
  if (rowNumber === 1) return;  // row 1 = headers hai, skip karo

  const obj = {};  // ek record ke liye empty object

  headers.forEach((header, index) => {
    obj[header] = String(row.values[index + 1] ?? "");  // header ko key banaya, cell value ko value
  });

  testdata.push(obj);  // object ko array mein daalo
});

console.log(testdata);  // final array print karo

/**
 * [
  {
    id: 'TC001',
    name: 'Sarika',
    email: 'sarika@example.com',
    password: 'password123'
  },
  {
    id: 'TC002',
    name: 'John',
    email: 'john@example.com',
    password: 'password456'
  },
  {
    id: 'TC003',
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password789'
  }
]
 */