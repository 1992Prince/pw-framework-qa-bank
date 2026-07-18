
# Playwright - File Upload

## Overview

Playwright handles file uploads using the **`setInputFiles()`** method.

It works only with `<input type="file">` elements.

Unlike Selenium, there is **no need to interact with the native OS file picker**. Playwright directly sets the file on the file input element.

---

# `setInputFiles()`

```javascript
await locator.setInputFiles(filePath);
```

It simulates selecting a file from the file picker.

---

# Why use `path.join()`?

Instead of hardcoding paths like:

```javascript
"D:\\Project\\artifacts\\image.jpg"
```

use Node.js `path.join()`.

It creates OS-independent paths and works on:

- Windows
- macOS
- Linux
- CI/CD environments

---

# What is `process.cwd()`?

`process.cwd()` returns the **Current Working Directory (Project Root)**.

When running:

```bash
npx playwright test
```

it usually returns your Playwright project root.

Example:

```
D:\PW-FUSION-MUKESH
```

---

# Building a File Path

```javascript
const filePath = path.join(
    process.cwd(),
    "artifacts",
    "PW_Cheatsheet.jpg"
);
```

This generates:

```
D:\PW-FUSION-MUKESH\artifacts\PW_Cheatsheet.jpg
```

`path.join()` automatically uses the correct path separator for the operating system.

---

# 1. Upload Single File

```javascript
import { test } from "@playwright/test";
import path from "path";

test("Upload Single File", async ({ page }) => {

    await page.goto(
        "https://gauravkhurana.com/practise-api/ui/index.html#/practice"
    );

    const filePath = path.join(
        process.cwd(),
        "artifacts",
        "PW_Cheatsheet.jpg"
    );

    await page
        .getByTestId("single-file")
        .setInputFiles(filePath);
});
```

---

# 2. Upload Multiple Files

```javascript
test("Upload Multiple Files", async ({ page }) => {

    await page.goto(
        "https://gauravkhurana.com/practise-api/ui/index.html#/practice"
    );

    const file1 = path.join(
        process.cwd(),
        "artifacts",
        "PW_Cheatsheet.jpg"
    );

    const file2 = path.join(
        process.cwd(),
        "artifacts",
        "PW_Cheatsheet1.jpg"
    );

    await page
        .getByTestId("multi-file")
        .setInputFiles([file1, file2]);
});
```

---

# 3. Remove Uploaded Files

```javascript
test("Remove Uploaded Files", async ({ page }) => {

    await page.goto(
        "https://gauravkhurana.com/practise-api/ui/index.html#/practice"
    );

    const file1 = path.join(
        process.cwd(),
        "artifacts",
        "PW_Cheatsheet.jpg"
    );

    const file2 = path.join(
        process.cwd(),
        "artifacts",
        "PW_Cheatsheet1.jpg"
    );

    const upload = page.getByTestId("multi-file");

    await upload.setInputFiles([file1, file2]);

    // Remove all uploaded files
    await upload.setInputFiles([]);
});
```

Passing an empty array removes all selected files.

---

# Interview Questions

## Q1. How do you upload a file in Playwright?

I use the **`setInputFiles()`** method.

```javascript
await page
    .locator("input[type='file']")
    .setInputFiles(filePath);
```

Playwright directly sets the file on the file input element without opening the native file picker.

---

## Q2. How do you upload multiple files?

Pass an array of file paths.

```javascript
await locator.setInputFiles([
    file1,
    file2
]);
```

---

## Q3. How do you remove uploaded files?

Pass an empty array.

```javascript
await locator.setInputFiles([]);
```

This clears all previously selected files.

---

## Q4. Why use `path.join()`?

`path.join()` creates platform-independent file paths.

It automatically handles path separators for Windows, macOS, Linux, and CI environments.

---

## Q5. What does `process.cwd()` return?

It returns the **Current Working Directory**, which is usually the Playwright project root.

Example:

```
D:\PW-FUSION-MUKESH
```

It helps build file paths relative to the project instead of hardcoding absolute paths.

---

# Summary

| Method                            | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `setInputFiles(file)`           | Upload a single file                                 |
| `setInputFiles([file1, file2])` | Upload multiple files                                |
| `setInputFiles([])`             | Remove uploaded files                                |
| `path.join()`                   | Build OS-independent file paths                      |
| `process.cwd()`                 | Returns the project root (current working directory) |
