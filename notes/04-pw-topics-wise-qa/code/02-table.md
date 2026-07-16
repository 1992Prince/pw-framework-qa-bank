
# Strategy to Automate Web Tables in Playwright

## Overview

Web tables are built using HTML table elements. Understanding the HTML structure makes automation much easier.

## Common HTML Tags Used in Tables

| Tag         | Purpose                               |
| ----------- | ------------------------------------- |
| `<table>` | Represents the complete table         |
| `<thead>` | Contains the table header section     |
| `<tbody>` | Contains the table body (actual data) |
| `<tr>`    | Represents a table row                |
| `<th>`    | Represents a header cell              |
| `<td>`    | Represents a data cell (column)       |

Example:

```html
<table>

    <thead>
        <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Age</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>John</td>
            <td>USA</td>
            <td>25</td>
        </tr>

        <tr>
            <td>David</td>
            <td>UK</td>
            <td>30</td>
        </tr>

    </tbody>

</table>
```

---

# General Automation Strategy

### Step 1: Locate the Table

Always locate the table first and ensure it is visible before interacting with it.

```javascript
const tableEle = page.locator("#product").first();

await tableEle.waitFor();
```

---

### Step 2: Count the Rows

Rows are represented by the `<tr>` tag.

```javascript
const rowCount =
await page.locator("//table/tbody/tr").count();
```

> **Important:**
> `//table/tbody/tr` **always returns the total number of rows** inside the table body.

---

### Step 3: Count the Columns

Columns are represented by the `<td>` tag.

To count columns, first locate **one row**, then count its `<td>` elements.

```javascript
const colCount =
await page.locator("(//table/tbody/tr)[2]/td").count();
```

> **Important:**
> Columns cannot be counted directly from the table.
> You must first identify a row and then count the `<td>` elements inside that row.

---

# XPath Patterns You Should Remember

## Get All Rows

```xpath
//table/tbody/tr
```

Returns all rows.

---

## Get a Particular Row

```xpath
(//table/tbody/tr)[3]
```

Returns the **3rd row**.

> XPath indexing starts from **1**.

Examples:

```xpath
(//table/tbody/tr)[1]
```

First row

```xpath
(//table/tbody/tr)[2]
```

Second row

```xpath
(//table/tbody/tr)[3]
```

Third row

---

## Get All Columns of a Particular Row

```xpath
(//table/tbody/tr)[3]/td
```

Returns every `<td>` present in the 3rd row.

---

## Get a Particular Cell

```xpath
((//table/tbody/tr)[3]/td)[2]
```

Returns:

- 3rd row
- 2nd column

Similarly,

```xpath
((//table/tbody/tr)[4]/td)[1]
```

Returns:

- 4th row
- 1st column

---

# Example

```javascript
test('Table - count rows and columns and print 3rd row content', async ({ page }) => {

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  // Step 1: Locate the table
  const tableEle = page.locator("#product").first();

  await tableEle.waitFor();

  // Step 2: Count rows
  const rowCount = await page
    .locator("(//table[@id='product'])[1]/tbody/tr")
    .count();

  // Step 3: Count columns by locating one row
  const colCount = await page
    .locator("((//table[@id='product'])[1]/tbody/tr)[2]/td")
    .count();

  console.log("Rows :", rowCount);
  console.log("Columns :", colCount);

  // Step 4: Print all cells of the 3rd row
  for (let i = 1; i <= colCount; i++) {

    const colText = await page
      .locator(`(((//table[@id='product'])[1]/tbody/tr)[3]/td)[${i}]`)
      .innerText();

    console.log(colText);
  }

  await page.pause();
});
```

---

# Generic Approach to Read Any Table

```text
Locate Table
      ↓
Locate All <tr> Elements
      ↓
Count Rows
      ↓
Locate One Row
      ↓
Count <td> Elements
      ↓
Loop Through Required Row
      ↓
Read Each Cell
```

---

# Best Practices

- ✅ Always wait for the table to load before interacting with it.
- ✅ Count rows using the `<tr>` tag.
- ✅ Count columns using the `<td>` tag of any single row.
- ✅ XPath indexing starts from **1**, not 0.
- ✅ Loop through columns to read all values of a specific row.
- ✅ Use dynamic XPath when reading multiple cells.

---

# Summary

| Requirement            | XPath                                           |
| ---------------------- | ----------------------------------------------- |
| Entire Table           | `//table`                                     |
| Table Body             | `//table/tbody`                               |
| All Rows               | `//table/tbody/tr`                            |
| Particular Row         | `(//table/tbody/tr)[3]`                       |
| All Columns of 3rd Row | `(//table/tbody/tr)[3]/td`                    |
| Particular Cell        | `((//table/tbody/tr)[3]/td)[2]`               |
| Count Rows             | `locator("//table/tbody/tr").count()`         |
| Count Columns          | `locator("(//table/tbody/tr)[2]/td").count()` |
