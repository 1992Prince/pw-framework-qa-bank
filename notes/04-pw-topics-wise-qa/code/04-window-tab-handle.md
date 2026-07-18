
# Playwright - Window & Tab Handling

## Overview

In Playwright:

- **Browser** → Launches the browser instance.
- **BrowserContext** → An isolated browser session (similar to an incognito window).
- **Page** → A browser tab or window.

```
Browser
│
├── BrowserContext
│      ├── Page (Tab 1)
│      ├── Page (Tab 2)
│      └── Page (Tab 3)
│
└── BrowserContext
       ├── Page
       └── Page
```

A single BrowserContext can contain multiple Page objects (tabs/windows).

---

# 1. Create Multiple Pages in the Same BrowserContext

```javascript
import { test, expect } from "@playwright/test";

test("Create multiple pages in same browser context", async ({ browser }) => {

  // Create an isolated browser session
  const context = await browser.newContext();

  // Create multiple pages (tabs) inside the same context
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");
  await page2.goto("https://www.google.com/");

  // Optional: Bring page to front for visual debugging
  await page1.bringToFront();
  await page1.getByTestId("form-email").fill("Gaurav");

  await page2.bringToFront();
  await page2.locator("//*[@id='APjFqb']").fill("Playwright");

  // Fetch all pages under the current BrowserContext
  const pages = context.pages();

  for (const p of pages) {
    console.log(await p.title(), " - ", await p.url());
  }

  await context.close();
});
```

### Explanation

- `browser.newContext()` creates an isolated browser session.
- `context.newPage()` creates a new tab/window inside that context.
- `context.pages()` returns all currently open pages.
- Each Page object can be interacted with independently.
- All pages share the same BrowserContext settings such as:
  - Cookies
  - Local Storage
  - Session Storage
  - Authentication
  - Viewport
  - Permissions
  - Locale

---

# 2. Perform Action on One Particular Page

```javascript
test("Perform action on particular page", async ({ browser }) => {

  const context = await browser.newContext();

  const page1 = await context.newPage();
  const page2 = await context.newPage();
  const page3 = await context.newPage();

  await page1.goto("https://www.facebook.com/");
  await page2.goto("https://www.google.com/");
  await page3.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  const pages = context.pages();

  let targetPage;

  // Find the required page
  for (const p of pages) {
    const title = await p.title();

    if (title.includes("Facebook")) {
      targetPage = p;
      break;
    }
  }

  if (!targetPage) {
    throw new Error("Facebook page not found");
  }

  // Close all other pages
  for (const p of pages) {
    if (p !== targetPage) {
      await p.close();
    }
  }

  // Continue working only on Facebook page
  await targetPage.bringToFront();
  await targetPage.locator('//*[text()="Create new account"]').click();

  await context.close();
});
```

---

## Why use `includes()` instead of `===`?

Many websites don't have a fixed title.

Example:

Expected:

```
Facebook
```

Actual:

```
Facebook – log in or sign up
```

Using

```javascript
title === "Facebook"
```

returns

```
false
```

Using

```javascript
title.includes("Facebook")
```

returns

```
true
```

Therefore, `includes()` is safer for title matching.

---

# 3. Handle a Newly Opened Tab

```javascript
test("Handle single new tab", async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  const [newTab] = await Promise.all([

    // Wait for a new page/tab to be created
    context.waitForEvent("page"),

    // Action that opens the new tab
    page.locator("#openTab").click(),
  ]);

  await newTab.waitForLoadState();

  await newTab.getByText("Learn more").click();

  await newTab.close();

  // Switch back to parent page
  await page.bringToFront();

  await context.close();
});
```

---

# Why use `Promise.all()`?

Never write:

```javascript
await page.locator("#openTab").click();

const newTab = await context.waitForEvent("page");
```

### Why?

The click happens first.

If the browser opens the new tab immediately, Playwright starts waiting **after** the event has already occurred.

Result:

- Timeout
- Missed event

---

## Correct Approach

```javascript
const [newTab] = await Promise.all([
    context.waitForEvent("page"),
    page.locator("#openTab").click(),
]);
```

Both operations start simultaneously.

1. Playwright starts listening for the `"page"` event.
2. Click opens the new tab.
3. The event is captured successfully.

This is the recommended Playwright pattern whenever an action triggers:

- New Tab
- New Window
- Popup

---

# Why `waitForLoadState()`?

Immediately after opening the tab:

```javascript
const [newTab] = await Promise.all([...]);
```

the page may still be loading.

Using

```javascript
await newTab.waitForLoadState();
```

ensures the page has loaded before interacting with it.

Without waiting, Playwright may throw:

```
Element not found
```

or

```
Timeout exceeded
```

because the page hasn't finished rendering.

---

# Parent Page vs Child Page

```
Parent Page
     │
     │ Click
     ▼
Child Tab Opens
     │
     ▼
Perform Actions
     │
     ▼
Close Child Tab
     │
     ▼
Return to Parent Page
```

```javascript
await newTab.close();

await page.bringToFront();
```

---

# Summary

| Method                           | Purpose                                                              |
| -------------------------------- | -------------------------------------------------------------------- |
| `browser.newContext()`         | Create isolated browser session                                      |
| `context.newPage()`            | Open new tab/window                                                  |
| `context.pages()`              | Get all pages in current context                                     |
| `page.bringToFront()`          | Bring a page to the foreground (useful for debugging or headed mode) |
| `context.waitForEvent("page")` | Wait for a new tab/window                                            |
| `Promise.all()`                | Prevent missing the page creation event                              |
| `waitForLoadState()`           | Wait until new page finishes loading                                 |
| `page.close()`                 | Close current page                                                   |
| `context.close()`              | Close entire browser context                                         |
