# Playwright — Pages, Tabs, Windows & Popups (Revision Notes)

## 1. What is a Page in Playwright?

* A **Page** is the most important object in Playwright — almost all browser interactions happen through it.
* A **Page** can represent:
  * A browser **tab**
  * A browser **window**
  * A **popup** window

> ⚠️ **Key Note:** Playwright does NOT have separate objects for tab, window, or popup. All of them are represented by the  **same `Page` object** .

### Hierarchy

```
Browser → BrowserContext → Page(s)
```

* One `Browser` can have multiple `BrowserContext`s.
* One `BrowserContext` can have multiple `Page`s.

### What can you do with a Page object?

* Navigate to a URL
* Click elements
* Fill input fields
* Select dropdown values
* Read page info (title, URL, text, etc.)
* Take screenshots
* Execute JavaScript

➡️ **In short:** all user interactions happen via the `Page` object.

---

## 2. Creating a Page

* A new page is created from a `BrowserContext` using:
  ```ts
  const page = await context.newPage();
  ```
* Navigate it using:
  ```ts
  await page.goto('https://example.com');
  ```

### Quick Recap — Section 1 & 2

* `Page` = tab / window / popup (all same object type).
* No separate `Tab` or `Window` class exists.
* Created via `context.newPage()`.
* Opened via `page.goto()`.

---

## 3. Multiple Pages in a Single BrowserContext

* One `BrowserContext` can host **multiple Pages** simultaneously.
* These multiple pages can represent:
  * Multiple tabs
  * Multiple windows
  * Multiple popups
* All belong to the  **same BrowserContext** .

### Key Points

* Each page is its own independent `Page` object.
* Actions on one page (click, fill, navigate) do **not** affect other pages.
* All pages from the same context  **share** :
  * Cookies & session/auth
  * Viewport size
  * Locale (language/region)
  * Permissions
  * Custom HTTP headers
  * Network routes/interceptors

> 💡 **Simple way to remember:** Whatever config you set on the `BrowserContext` is automatically inherited by every `Page` created from it.

---

## 4. Working with Multiple Pages — Core Methods

| Method                  | Purpose                                                                         |
| ----------------------- | ------------------------------------------------------------------------------- |
| `context.pages()`     | Returns an array of**all currently open pages**in that context            |
| `page.bringToFront()` | Visually brings a specific page to the front (mainly for debugging/visual runs) |
| `page.close()`        | Closes a specific page                                                          |
| `page.title()`        | Gets the title of a page (useful to identify a tab among many)                  |
| `page.url()`          | Gets the URL of a page (another way to identify a tab)                          |

### Important Note on `bringToFront()`

* You do **NOT need** to bring a page to front before performing actions on it.
* Playwright can interact with any page directly — even if it's in the background.
* `bringToFront()` is mainly useful for  **debugging / watching execution visually** .

### `context.pages()`

* Returns an **array** of all open `Page` references in that `BrowserContext`.
* Useful when multiple tabs/windows are open and you need to loop through or find a specific one.

```ts
const allPages = context.pages();
console.log(allPages.length);
```

---

## 5. Handling New Pages (New Tab / Window / Popup)

When a user action (click on link/button) opens a  **new tab, window, or popup** , Playwright captures it via the **`page` event** on the `BrowserContext`.

> Commonly triggered by links with `target="_blank"` or any action that opens a new page.

### `waitForEvent()` — What is it?

* An **event listener** method in Playwright.
* Waits for a specified event to occur and returns a  **Promise** .
* Resolves with the object associated with that event (e.g., the new `Page`).

### Why is it needed?

* A new tab/window doesn't exist instantly when a click happens — there's a small delay.
* Without waiting for the event, checking `context.pages()` immediately after a click can miss the new page ( **race condition** ).
* `waitForEvent()` solves this by waiting until the new page is actually created.

### Which event to use?

| Event       | Where fired          | When to use                                                                                                                                    |
| ----------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `'page'`  | On`BrowserContext` | Generic — fires for**any**new page (tab/window/popup) created in that context. Safe default.                                            |
| `'popup'` | On`Page`           | Fires specifically when a new page opens**from that page**via`window.open()`or`target="_blank"`(parent-child / opener relationship). |
| `'close'` | On`Page`           | Fires when a page is closed — useful to track when tab/window closes.                                                                         |

### Approach 1 — `context.waitForEvent('page')`

* Start listening **before** performing the click (otherwise the event may be missed).
* Best suited when  **one action opens a single new page** .

```ts
const pagePromise = context.waitForEvent('page');
await page.click('text=Open in new tab');
const newPage = await pagePromise;
```

### Approach 2 — `Promise.all()` (Preferred)

**Why preferred?**

* `context.waitForEvent('page')` and `page.click()` are both  **asynchronous** .
* `Promise.all()` starts both together and waits for both to finish.
* Ensures the new page is captured reliably, even if it opens very fast.
* More concise — listener is guaranteed active before the click fires.

```ts
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('text=Open in new tab'),
]);
```

**JS concept used:** `Promise.all()` returns an **array of resolved values** → **array destructuring** is used to pick out the new `Page` (first value), ignoring the second (click's return value).

---

## 6. Quick Revision Summary (Cheat Sheet)

* ✅ Tab, Window, Popup → all = **`Page` object** in Playwright. No separate classes.
* ✅ Hierarchy: **Browser → BrowserContext → Page**
* ✅ New page created with: `context.newPage()`
* ✅ Get all open pages: `context.pages()`
* ✅ No need to focus a page before acting on it — Playwright works on background pages too.
* ✅ `bringToFront()` → only for visual/debug purposes.
* ✅ To catch a newly opened tab/window/popup → use `'page'` event (generic) or `'popup'` event (opener-specific).
* ✅ Always **start listening before the triggering click** — use `Promise.all()` pattern to avoid race conditions/missed events.
* ✅ All pages in same context share: cookies, session, viewport, locale, permissions, headers, network routes.
