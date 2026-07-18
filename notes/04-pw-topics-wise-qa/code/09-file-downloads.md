
# Playwright - File Download

## Overview

When a file is downloaded in Playwright:

- The file is first downloaded to a **temporary location** managed by Playwright.
- Once the **BrowserContext closes**, the temporary file is automatically deleted.
- If you want to keep the file permanently, save it using **`download.saveAs()`**.

---

# Download APIs

| Method                            | Purpose                                      |
| --------------------------------- | -------------------------------------------- |
| `page.waitForEvent("download")` | Wait for the next download (Recommended)     |
| `page.on("download")`           | Listen for every download during the test    |
| `download.saveAs(path)`         | Save the downloaded file to disk             |
| `download.suggestedFilename()`  | Returns the filename suggested by the server |

---

# Which approach should we use?

## ✅ Recommended: `Promise.all()` + `waitForEvent()`

Whenever an action triggers **exactly one download**, use `Promise.all()` with `page.waitForEvent("download")`.

```javascript
const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#downloadButton").click(),
]);
```

### Why use this approach?

- One-time listener
- Automatically removed after handling the download
- Cannot miss the download event
- Cleaner and easier to understand
- Same pattern used for:
  - Dialogs
  - New Tabs
  - Popups
  - File Choosers

---

# Why not use `page.on()`?

```javascript
page.on("download", async download => {
    await download.saveAs("./downloads/file.xlsx");
});
```

`page.on()` registers a **persistent listener**.

It remains active throughout the test and will capture **every future download**.

Use it only when multiple downloads are expected.

For a single download, `waitForEvent()` is cleaner and the recommended approach.

---

# Why use `Promise.all()`?

❌ Incorrect

```javascript
await page.locator("#downloadButton").click();

const download = await page.waitForEvent("download");
```

The download may start immediately after the click.

Since Playwright starts listening **after** the click, the event may already have occurred, resulting in a timeout.

---

✅ Correct

```javascript
const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#downloadButton").click(),
]);
```

Playwright starts listening for the download **before** performing the click, ensuring the event is never missed.

---

# 1. Default Download

```javascript
import { test } from "@playwright/test";

test("Default Download", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/upload-download-test/index.html"
    );

    await page.locator("#downloadButton").click();
});
```

### What happens?

The file is downloaded to a **temporary Playwright folder**.

When the BrowserContext closes, Playwright automatically deletes the downloaded file.

Nothing is saved permanently.

---

# 2. Download and Save to Disk

```javascript
import { test } from "@playwright/test";

test("Download File", async ({ page }) => {

    await page.goto(
        "https://rahulshettyacademy.com/upload-download-test/index.html"
    );

    const [download] = await Promise.all([

        page.waitForEvent("download"),

        page.locator("#downloadButton").click(),

    ]);

    await download.saveAs(
        `./downloads/${download.suggestedFilename()}`
    );
});
```

---

# Save Download to a Specific Location

After capturing the `Download` object, use **`download.saveAs()`** to save the file permanently.

You can either:

- Give your own filename.
- Use the filename suggested by the server.

---

## Option 1. Save with Your Own Filename

```javascript
await download.saveAs(
    "./downloads/MyReport.xlsx"
);
```

The downloaded file will be saved as:

```
downloads/
    MyReport.xlsx
```

---

## Option 2. Save with Server Filename (Recommended)

Use `download.suggestedFilename()` to keep the same filename that the application normally downloads.

```javascript
await download.saveAs(
    `./downloads/${download.suggestedFilename()}`
);
```

Example:

If the server downloads:

```
EmployeeData.xlsx
```

the file is saved as:

```
downloads/
    EmployeeData.xlsx
```

This avoids hardcoding filenames and works even if the filename changes.

---

# Save to a Project Folder (Best Practice)

Instead of using a relative path like `./downloads`, it's better to build the path relative to the project root.

Use:

- `process.cwd()` → Returns the current working directory (project root).
- `path.join()` → Builds an OS-independent file path.

```javascript
import path from "path";

const downloadPath = path.join(
    process.cwd(),
    "artifacts",
    download.suggestedFilename()
);

await download.saveAs(downloadPath);
```

If your project structure is:

```
Project
│
├── artifacts
├── tests
└── playwright.config.ts
```

the downloaded file will be saved as:

```
Project
└── artifacts
      EmployeeData.xlsx
```

This approach works consistently on Windows, macOS, Linux, and CI/CD environments.

---

# Interview Questions

## Q1. How do you download a file in Playwright?

I use **`Promise.all()`** with **`page.waitForEvent("download")`**.

```javascript
const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#downloadButton").click(),
]);
```

This ensures the download event is never missed.

---

## Q2. Where are downloaded files stored by default?

By default, Playwright stores downloaded files in a **temporary folder**.

When the BrowserContext closes, those temporary files are automatically deleted.

---

## Q3. How do you save the downloaded file permanently?

Using:

```javascript
await download.saveAs(path);
```

Example:

```javascript
await download.saveAs(
    `./downloads/${download.suggestedFilename()}`
);
```

---

## Q4. Why use `download.suggestedFilename()`?

It returns the filename suggested by the server.

This helps avoid hardcoding filenames and preserves the original downloaded filename.

---

## Q5. Why use `path.join()` with `process.cwd()`?

- `process.cwd()` returns the project root.
- `path.join()` creates OS-independent file paths.

This is the recommended approach for saving downloaded files into project folders such as `artifacts`.

---

# Summary

| Method                            | Purpose                                              |
| --------------------------------- | ---------------------------------------------------- |
| `page.waitForEvent("download")` | Wait for the next download                           |
| `Promise.all()`                 | Prevent missing the download event                   |
| `download.saveAs(path)`         | Save the downloaded file permanently                 |
| `download.suggestedFilename()`  | Get the filename suggested by the server             |
| `path.join()`                   | Build OS-independent file paths                      |
| `process.cwd()`                 | Returns the project root (current working directory) |
