# Strategy to Automate Select Dropdown in Playwright

### Overview

Playwright provides the `selectOption()` method to interact with HTML `<select>` dropdowns. You can select an option using:

1. Visible Text (Label)
2. Value Attribute
3. Index
4. Fetch all dropdown options and validate count

**Important:**
Before selecting any option, **first locate the `<select>` element**. The `selectOption()` method is called **only on the `<select>` element**, not on the individual `<option>` elements.

---

### Example

```javascript
test('Select Dropdown — selectOption() — label, value, index', async ({ page }) => {
  await page.goto("https://gauravkhurana.in/practise-api/ui/index.html#/practice");

  // Locate the select tag element
  const countryDropdown = page.getByRole('combobox', { name: 'Country' });

  // Optional - bring focus to dropdown
  await countryDropdown.focus();

  // ================================
  // 1. Select by Visible Text (Label)
  // ================================
  await countryDropdown.selectOption('United Kingdom');

  // ================================
  // 2. Select by Value Attribute
  // <option value="au">Australia</option>
  // ================================
  await countryDropdown.selectOption({ value: 'au' });

  // ================================
  // 3. Select by Index (0-based)
  // ================================
  await countryDropdown.selectOption({ index: 1 });

  // ================================
  // 4. Fetch All Dropdown Options
  // ================================
  const drpDwnEls = countryDropdown.locator('option');

  const optionCount = await drpDwnEls.count();

  console.log("Dropdown elements count:", optionCount);
  console.log();

  for (let i = 0; i < optionCount; i++) {
    const eleTxt = await drpDwnEls.nth(i).innerText();
    console.log(`Dropdown ${i}th index text is - ${eleTxt}`);
  }

  await page.pause();
});
```

---

### Selection Strategies

### 1. Select by Visible Text

Use the text displayed to the user.

```javascript
await countryDropdown.selectOption('United Kingdom');
```

---

### 2. Select by Value Attribute

Uses the HTML `value` attribute.

Example HTML:

```html
<option value="au">Australia</option>
```

Playwright:

```javascript
await countryDropdown.selectOption({ value: 'au' });
```

**When to use**

- When labels may change but values remain constant.

---

### 3. Select by Index

Playwright uses **0-based indexing**.

```javascript
await countryDropdown.selectOption({ index: 1 });
```

Meaning:

| Index | Selected Option |
| ----: | --------------- |
|     0 | First option    |
|     1 | Second option   |
|     2 | Third option    |

**When to use**

- Only when dropdown order is fixed.
- Less recommended because index can change if options are reordered.

---

### Fetch All Dropdown Options

Locate all `<option>` elements.

```javascript
const drpDwnEls = countryDropdown.locator('option');
```

Get the total number of options.

```javascript
const optionCount = await drpDwnEls.count();
```

Print the count.

```javascript
console.log(optionCount);
```

Loop through every option and print its text.

```javascript
for (let i = 0; i < optionCount; i++) {
    const eleTxt = await drpDwnEls.nth(i).innerText();
    console.log(eleTxt);
}
```

---

### Alternative (Shorter Approach)

If you only need the text of all options:

```javascript
const optionTexts = await countryDropdown.locator('option').allTextContents();

console.log(optionTexts);
```

Example Output

```text
[
  'Select Country',
  'Australia',
  'India',
  'United Kingdom',
  'United States'
]
```

# Strategy to Automate Multi-Select Dropdown in Playwright

### Overview

A **multi-select dropdown** is an HTML `<select>` element that allows selecting **multiple options**. In Playwright, you automate it using the same `selectOption()` method.

> **Important:**
> Before selecting any option, **first locate the `<select>` element**. The `selectOption()` method is called **only on the `<select>` element**, not on the individual `<option>` elements.

---

### HTML Example

```html
<select multiple>
    <option>Playwright</option>
    <option>Selenium</option>
    <option>Cypress</option>
    <option>TestCafe</option>
</select>
```

---

### Example

```javascript
test('Select Dropdown — selectOption() — multi-select', async ({ page }) => {
  await page.goto("https://gauravkhurana.in/practise-api/ui/index.html#/practice");

  // Step 1: Locate the <select> element
  const skillsDropdown = page.getByTestId('frameworks');

  // Step 2: Select multiple options
  await skillsDropdown.selectOption([
    'TestCafe',
    'Playwright',
    'Selenium'
  ]);

  await page.pause();
});
```

---

Automation Strategy

Step 1: Locate the `<select>` Element

Always locate the dropdown itself.

```javascript
const skillsDropdown = page.getByTestId('frameworks');
```

> Do **not** locate individual `<option>` elements for selection.

---

Step 2: Use `selectOption()`

Pass an array containing all options to be selected.

```javascript
await skillsDropdown.selectOption([
    'TestCafe',
    'Playwright',
    'Selenium'
]);
```

Playwright will automatically select all specified values.

---

### Selecting Multiple Options by Different Strategies

### By Visible Text (Label)

```javascript
await skillsDropdown.selectOption([
    'Playwright',
    'Selenium'
]);
```

---

### By Value Attribute

Example HTML

```html
<option value="pw">Playwright</option>
<option value="sel">Selenium</option>
```

```javascript
await skillsDropdown.selectOption([
    { value: 'pw' },
    { value: 'sel' }
]);
```

---

### By Index

```javascript
await skillsDropdown.selectOption([
    { index: 1 },
    { index: 3 }
]);
```

---

# Strategy to Automate Auto-Suggestive Dropdown in Playwright

### Overview

An **auto-suggestive dropdown** is **not** a standard HTML `<select>` dropdown.

Instead, it typically consists of:

- An `<input>` textbox where the user types.
- A dynamically generated list of suggestions (`<li>`, `<div>`, etc.).
- Suggestions appear only after typing.

Since there is **no `<select>` element**, the `selectOption()` method **cannot** be used.

---

### Automation Strategy

The general approach is:

1. Locate the input textbox.
2. Type the desired text (or partial text).
3. Wait for the suggestion list to appear.
4. Locate the desired suggestion.
5. Click the required suggestion.
6. (Optional) Fetch all suggestions for validation.

---

### Example

```javascript
test("AutoSuggestive Dropdown", async ({ page }) => {

  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  // Step 1: Locate the input textbox and type partial text
  await page.locator("#autocomplete").pressSequentially("uni", {
    delay: 100
  });

  // Step 2: Wait for the required suggestion
  const dropDownEleTxt = page.getByText("United States (USA)");
  await dropDownEleTxt.waitFor();

  // Step 3: Select the suggestion
  await dropDownEleTxt.click();

  // Step 4: Fetch all available suggestions
  const dropdownEles = page.locator(".ui-menu-item");

  const dropdownElesCount = await dropdownEles.count();

  console.log("Dropdown Elements:", dropdownElesCount);

  for (let i = 0; i < dropdownElesCount; i++) {

    const eleTxt = await dropdownEles.nth(i).innerText();

    console.log(`Dropdown ${i}th index text is - ${eleTxt}`);
  }

  await page.pause();
});
```

---


---
