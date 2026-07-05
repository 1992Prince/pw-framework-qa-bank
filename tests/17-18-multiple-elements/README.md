# Section 17-18: Multiple Elements & Multiple Pages/Tabs

## Topics Covered

### 1. Lazy Initialization of Locator
- Locators in Playwright are lazily initialized — they don't query the DOM until an action is performed on them.
- This makes them safe to declare upfront without worrying about the element not yet existing.

---

### 2. Locating Multiple Elements with the Same Selector
- Use `page.locator('selector')` to get all matching elements.
- Iterate and click on **all checkboxes** using `.nth()` or a loop with `count()`.

```js
const checkboxes = page.locator('input[type="checkbox"]');
const count = await checkboxes.count();
for (let i = 0; i < count; i++) {
  await checkboxes.nth(i).check();
}
```

---

### 3. Find All Hyperlinks and Print Their href Values
- Locate all `<a>` tags and extract their `href` attributes.

```js
const links = page.locator('a');
const count = await links.count();
for (let i = 0; i < count; i++) {
  const href = await links.nth(i).getAttribute('href');
  console.log(href);
}
```

---

### 4. Find All Images and Print Their src Values
- Locate all `<img>` tags and extract their `src` attributes.

```js
const images = page.locator('img');
const count = await images.count();
for (let i = 0; i < count; i++) {
  const src = await images.nth(i).getAttribute('src');
  console.log(src);
}
```

---

### 5. Finding Elements from Auto-Suggestions
- Type into an input field and wait for a suggestion dropdown to appear.
- Locate the suggestion items and click the desired one.

```js
await page.locator('#search').fill('New Y');
await page.locator('.suggestion-item').filter({ hasText: 'New York' }).click();
```

---

### 6. Date Picker Selection — Auto-Suggestion Approach
- Type a date directly into the date input and select from the auto-suggestion/calendar popup.
- Useful when native date pickers don't support direct `fill()`.

```js
await page.locator('#date').fill('04/29/2026');
await page.locator('.calendar-day').filter({ hasText: '29' }).click();
```

---

### 7. `setInputFiles()` — Single and Multiple File Upload
- Used when `<input type="file">` is present.
- Single file upload:

```js
await page.locator('input[type="file"]').setInputFiles('path/to/file.pdf');
```

- Multiple file upload:

```js
await page.locator('input[type="file"]').setInputFiles([
  'path/to/file1.pdf',
  'path/to/file2.png'
]);
```

---

### 8. Assignment — Calendar: Fetch Texts & Select a Date
- Open a calendar widget.
- Fetch all visible date texts in the current month.
- Select a specific date OR navigate to the next month and select a date there.

---

### 9. `$` vs `$$` — *(To Be Covered in a Future Section)*
- `$` → selects the first matching element (Playwright internal / CDP).
- `$$` → selects all matching elements.
- Will be explored in detail in an upcoming section.

---

### 10. End-to-End Assignment
Write a full E2E script that covers:

1. **Login** → validate title and URL.
2. **Enter credentials** → ensure submit button is enabled.
3. **Homepage** → validate URL and title.
4. **Validate** that a specific event is visible on screen.
5. **Add the event** via calendar (use auto-suggestion date picker approach) → validate success message.
6. **Go to Cart** → validate title and URL, validate event is added.
7. **Validate added events in tabular format** → traverse table rows and find the target event.
8. **Delete the event** using row-level delete button (same-row traversal pattern).
9. **Validate** the deleted event is **no longer visible** on screen.
   - Present → `expect(locator).toBeVisible()`
   - Deleted → `expect(locator).not.toBeVisible()`
10. **Logout** → validate URL contains `login` and page title is correct.
11. **Parameterize** the test using external test data for event names.
    - Generate unique names using `Date.now()`:
      ```js
      const eventName = 'CourseName' + Date.now();
      ```

> Practice site suggestion: Artem's Table UI

---

### 11. Browser, BrowserContext, and Page — Theory

| Concept         | Description |
|-----------------|-------------|
| `Browser`       | The top-level browser instance (Chromium, Firefox, WebKit). |
| `BrowserContext`| An isolated profile — has its own cookies, storage, extensions. Like a separate browser profile. Not shared between tests. |
| `Page`          | A single tab/window within a BrowserContext. |

**Hierarchy:**
```
Browser
  └── BrowserContext
        └── Page(s)
```

- Multiple `BrowserContext`s can be created per `Browser`.
- Multiple `Page`s can be created per `BrowserContext`.
- Pages **within the same context** share cookies and session storage.
- Pages **across different contexts** are fully isolated.

---

### 12. Handling Multiple Tabs / Windows

> Playwright works on the **primary tab** by default. For new tabs/windows, you must explicitly tell Playwright to switch to them.

#### Create a new page manually:
```js
const newPage = await context.newPage();
await newPage.goto('https://example.com');
```

#### Get all open pages in a context:
```js
const allPages = context.pages();
console.log(allPages.length);
```

#### Handle a new tab opened by a click (via `waitForEvent`):
```js
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.locator('#open-tab-btn').click()
]);
await newPage.waitForLoadState();
```

#### Handle a popup window:
```js
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.locator('#open-popup-btn').click()
]);
await popup.waitForLoadState();
```

#### Navigate to a specific tab by title:
```js
const allPages = context.pages();
const targetPage = allPages.find(p => p.title() === 'Target Page Title');
await targetPage.bringToFront();
```

#### Bring a page to the front (focus it):
```js
await targetPage.bringToFront();
```

#### Close a tab and return to parent:
```js
await newPage.close();
await page.bringToFront(); // bring parent page back to focus
```

#### Get total page count and iterate:
```js
const allPages = context.pages();
console.log('Total tabs:', allPages.length);
for (const p of allPages) {
  console.log(await p.title());
}
```

#### Multiple tabs opened on click — move to specific tab:
```js
// Capture all new pages after a multi-tab-opening action
const pagePromise = context.waitForEvent('page');
await page.locator('#multi-open-btn').click();
const specificPage = await pagePromise;
await specificPage.bringToFront();
// perform actions...
await specificPage.close();
await page.bringToFront();
```

> **Note:** JavaScript `alert`, `confirm`, and `prompt` dialogs cannot be inspected via DevTools. Handle them using `page.on('dialog', ...)`.

```js
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept(); // or dialog.dismiss()
});
```

---

### 13. Write Code: Multiple Contexts and Multiple Pages

#### Multiple BrowserContexts:
```js
const context1 = await browser.newContext();
const context2 = await browser.newContext();

const page1 = await context1.newPage();
const page2 = await context2.newPage();

await page1.goto('https://site-a.com'); // context1 session
await page2.goto('https://site-b.com'); // context2 session — fully isolated
```

#### Multiple Pages within One Context:
```js
const context = await browser.newContext();
const page1 = await context.newPage();
const page2 = await context.newPage();

// page1 and page2 share cookies and session storage
await page1.goto('https://example.com/login');
await page2.goto('https://example.com/dashboard'); // may already be logged in
```

---

### 14. Handling JS Dialogs (alert, confirm, prompt)

- Q&A notes: [03-js-dialogs-handler-qa.md](03-js-dialogs-handler-qa.md)
- Related spec: [03-handling-js-dialog.spec.js](03-handling-js-dialog.spec.js)
