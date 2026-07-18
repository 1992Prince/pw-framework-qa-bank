
# Playwright - Handling JavaScript Dialogs (Alert, Confirm & Prompt)

## Overview

JavaScript dialogs are browser-native popups displayed by the browser.

Playwright supports handling three types of dialogs:

- **Alert**
- **Confirm**
- **Prompt**

By default, if a dialog appears and your test does not handle it, **Playwright automatically dismisses it**.

---

# Dialog APIs

| Method                          | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `page.waitForEvent("dialog")` | Wait for the next dialog (one-time listener)             |
| `page.on("dialog")`           | Listen for every dialog during the test                  |
| `dialog.message()`            | Returns the dialog message                               |
| `dialog.type()`               | Returns dialog type (`alert`, `confirm`, `prompt`) |
| `dialog.defaultValue()`       | Returns the default value of a prompt                    |
| `dialog.accept()`             | Click OK                                                 |
| `dialog.accept("text")`       | Enter text and click OK (Prompt only)                    |
| `dialog.dismiss()`            | Click Cancel                                             |

---

# Which approach should we use?

## ✅ Recommended: `Promise.all()` + `waitForEvent()`

When your action triggers **exactly one dialog**, this is the recommended Playwright pattern.

```javascript
const [dialog] = await Promise.all([
    page.waitForEvent("dialog"),
    page.getByTestId("show-alert").click(),
]);

await dialog.accept();
```

### Why use this approach?

- One-time listener
- Automatically removed after handling the dialog
- Cannot miss the dialog event
- Cleaner and easier to understand
- Same pattern used for handling:
  - Popups
  - New Tabs
  - Downloads
  - File Choosers

---

# Why not use `page.on()`?

```javascript
page.on("dialog", async dialog => {
    await dialog.accept();
});
```

`page.on()` registers a **persistent listener**.

It remains active throughout the test and will handle **every future dialog** until removed.

Use it only when multiple dialogs are expected during the same test.

For handling a single dialog, `waitForEvent()` is cleaner and the recommended approach.

---

# Why use `Promise.all()`?

❌ Incorrect

```javascript
await page.getByTestId("show-alert").click();

const dialog = await page.waitForEvent("dialog");
```

The click may open the dialog immediately.

Since Playwright starts waiting **after** the click, the dialog event may already have occurred, resulting in a timeout.

---

✅ Correct

```javascript
const [dialog] = await Promise.all([
    page.waitForEvent("dialog"),
    page.getByTestId("show-alert").click(),
]);
```

Playwright starts listening for the dialog **before** performing the click, ensuring the event is never missed.

---

# 1. Handle JavaScript Alert

```javascript
import { test, expect } from "@playwright/test";

test("Handle Alert", async ({ page }) => {

    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    const [dialog] = await Promise.all([
        page.waitForEvent("dialog"),
        page.getByTestId("show-alert").click(),
    ]);

    console.log(dialog.type());      // alert
    console.log(dialog.message());

    await dialog.accept();
});
```

### Explanation

An **Alert** dialog contains only an **OK** button.

```
--------------------------
| This is an alert!      |
|                        |
|          [ OK ]        |
--------------------------
```

Use:

```javascript
await dialog.accept();
```

to close the alert.

---

# 2. Handle JavaScript Confirm

```javascript
test("Handle Confirm", async ({ page }) => {

    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    const [dialog] = await Promise.all([
        page.waitForEvent("dialog"),
        page.getByTestId("show-confirm").click(),
    ]);

    console.log(dialog.type());      // confirm
    console.log(dialog.message());

    // Click OK
    await dialog.accept();

    // OR click Cancel
    // await dialog.dismiss();
});
```

### Explanation

A **Confirm** dialog contains two buttons.

```
------------------------------
| Do you want to continue?   |
|                            |
|   [ OK ]   [ Cancel ]      |
------------------------------
```

Use

```javascript
await dialog.accept();
```

to click **OK**.

Use

```javascript
await dialog.dismiss();
```

to click **Cancel**.

---

# 3. Handle JavaScript Prompt

```javascript
test("Handle Prompt", async ({ page }) => {

    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    const [dialog] = await Promise.all([
        page.waitForEvent("dialog"),
        page.getByTestId("show-prompt").click(),
    ]);

    console.log(dialog.type());      // prompt
    console.log(dialog.message());

    await dialog.accept("John Doe");

    console.log(dialog.defaultValue());
});
```

### Explanation

A **Prompt** dialog allows the user to enter text.

```
--------------------------------
| Enter your name              |
|                              |
| [______________]             |
|                              |
|  [ OK ]   [ Cancel ]         |
--------------------------------
```

To enter text:

```javascript
await dialog.accept("John Doe");
```

Playwright enters the text into the prompt input and then clicks **OK**.

To simulate clicking **Cancel**:

```javascript
await dialog.dismiss();
```

---

# What does `dialog.defaultValue()` return?

Suppose the webpage executes:

```javascript
prompt(
    "Enter your name",
    "Guest"
);
```

The browser displays:

```
Enter your name

[ Guest ]
```

Then

```javascript
dialog.defaultValue()
```

returns

```
Guest
```

It **does not** return the value entered using:

```javascript
await dialog.accept("John Doe");
```

It only returns the browser's original default value.

---

# Alert vs Confirm vs Prompt

| Dialog  | Buttons     | User Input |
| ------- | ----------- | ---------- |
| Alert   | OK          | ❌ No      |
| Confirm | OK / Cancel | ❌ No      |
| Prompt  | OK / Cancel | ✅ Yes     |

---

# Summary

| Method                          | Purpose                                    |
| ------------------------------- | ------------------------------------------ |
| `page.waitForEvent("dialog")` | Wait for a single dialog (recommended)     |
| `page.on("dialog")`           | Listen for all dialogs throughout the test |
| `Promise.all()`               | Prevent missing the dialog event           |
| `dialog.message()`            | Read dialog message                        |
| `dialog.type()`               | Get dialog type                            |
| `dialog.defaultValue()`       | Read prompt's default value                |
| `dialog.accept()`             | Click OK                                   |
| `dialog.accept("text")`       | Enter text into Prompt and click OK        |
| `dialog.dismiss()`            | Click Cancel                               |
