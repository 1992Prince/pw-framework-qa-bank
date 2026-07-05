# Playwright Events — Browser, Context & Page Level

---

## 1. What are Events in Playwright?

Think of Events as **notifications** — not actions.

When something happens in the browser (like a new tab opens, a download starts, or an API call completes), the browser **emits a signal**. Playwright lets you either:

- **Wait** for that signal → `waitForEvent()`
- **Listen continuously** for it → `.on()`

> Events are not something you *do*. They are something the browser *tells you happened*.

**How it works internally:**

```
Action  →  Browser does something  →  Event is emitted  →  Listener catches it
```

**Real-world example:**

When you click a "Open New Tab" button:

- The click is the **action**
- The new tab opening is the **event**
- The new tab is **NOT returned** by `click()` — you have to **listen** for it

---

## 2. Events Exist at Multiple Levels

Playwright has a 3-level hierarchy — and each level emits its own set of events:

```
Browser
  └── BrowserContext
        └── Page
```

Each level has **different responsibilities**, so each level fires different events.

---

### Level 1 — Browser Level

> Represents the whole browser instance.

Rarely used in test automation. Useful only for low-level infrastructure checks.

| Event              | When it fires                       | Code                               |
| ------------------ | ----------------------------------- | ---------------------------------- |
| `'disconnected'` | Browser crashes or connection drops | `browser.on('disconnected', fn)` |

---

### Level 2 — BrowserContext Level (Most Important for Multi-Tab)

> Context = your browser session + all its open tabs.
> Think of it as the **"God View"** — it can see everything happening across all tabs in that session.

Most important level when dealing with **multiple tabs or windows**.

| Event          | Meaning                               | How to Use                       |
| -------------- | ------------------------------------- | -------------------------------- |
| `'page'`     | A new tab/window was created          | `context.waitForEvent('page')` |
| `'request'`  | A network request started (any tab)   | API monitoring                   |
| `'response'` | A network response received (any tab) | API validation                   |
| `'close'`    | The context itself closed             | Cleanup                          |

---

### Level 3 — Page Level

> Page = a **single tab**.
> Think of it as the **"Local View"** — it only sees what happens on that one tab.

Used when **one page causes another page to open** (parent → child relationship).

| Event                  | Meaning                                 | How to Use                        |
| ---------------------- | --------------------------------------- | --------------------------------- |
| `'popup'`            | This page spawned a new tab/window      | `page.waitForEvent('popup')`    |
| `'dialog'`           | An`alert()` or `confirm()` appeared | `page.on('dialog', fn)`         |
| `'download'`         | A file download started                 | `page.waitForEvent('download')` |
| `'console'`          | A`console.log` appeared in DevTools   | `page.on('console', fn)`        |
| `'worker'`           | A Web Worker was created                | `page.on('worker', fn)`         |
| `'request'`          | A request from this tab                 | API assertions                    |
| `'response'`         | A response from this tab                | Network checks                    |
| `'load'`             | Page fully loaded                       | Page readiness check              |
| `'domcontentloaded'` | DOM is ready (faster than load)         | Faster waits                      |

---

## 3. How to Listen for Events — `waitForEvent` vs `on`

### `waitForEvent` — Wait for it once

Use when you expect an event to happen **once** and want to grab it.

```js
// Syntax
const result = await object.waitForEvent('eventName');
```

- You **register** the listener first
- You **await** it later when you need the result

### `.on()` — Listen continuously

Use when you want to **capture every time** an event fires throughout the test.

```js
page.on('console', msg => console.log('Browser log:', msg.text()));
page.on('dialog', async dialog => {
  console.log(dialog.message());
  await dialog.accept();
});
```

---

## 4. The Big Confusion: `'page'` vs `'popup'`

This is the **most important distinction** to understand.

Both deal with new tabs opening — but they differ in **who is watching** and **what relationship they assume**.

### Comparison

| Feature                | `context.waitForEvent('page')`           | `page.waitForEvent('popup')`                         |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------ |
| **Who listens**  | The Context (entire session)               | The Page (only the parent tab)                         |
| **Logic**        | "I see a new tab appeared in this session" | "I (the parent tab) just opened a child tab"           |
| **Relationship** | Doesn't care which page opened it          | Strictly ties the new tab to this specific parent page |
| **Use case**     | General — catches any new tab             | Specific — "click button → open tab" flow            |

---

### When to use `context.waitForEvent('page')`

Use this when:

- You don't know (or don't care) which tab opened the new one
- Multiple triggers could open a new tab
- Third-party redirects are involved
- You have complex multi-tab flows

```js
// Test 1 — Context Strategy (Global Listener)
const [newPage] = await Promise.all([
  context.waitForEvent('page'),  // Listen globally across session
  page.click('#open-tab')
]);
await newPage.waitForLoadState();
```

---

### When to use `page.waitForEvent('popup')`

Use this when:

- You **know exactly** which page is opening the new tab
- It's a direct parent → child relationship
- You want cleaner, more predictable code

```js
// Test 2 — Page Strategy (Strict Parent-Child)
const [popup] = await Promise.all([
  page.waitForEvent('popup'),  // Listen only on this specific page
  page.click('#open-tab')
]);
await popup.waitForLoadState();
```

---

## 5. Critical Rule: Set Up the Listener BEFORE the Click

This is a **race condition** trap that catches everyone.

### Wrong — you might miss the event:

```js
await page.click('#open-tab');                     // click fires
const newPage = await context.waitForEvent('page'); // event may already be GONE
```

### Correct — register first, then click:

```js
const pagePromise = context.waitForEvent('page');  // register FIRST
await page.click('#open-tab');                     // now click
const newPage = await pagePromise;                 // now await
```

### Even cleaner with `Promise.all`:

```js
const [newPage] = await Promise.all([
  context.waitForEvent('page'),  // register
  page.click('#open-tab')        // trigger
]);
```

**Why?** Events are **momentary** — if the browser fires the event before Playwright is listening, it's missed forever. `Promise.all` guarantees the listener is registered before the action fires.

> This applies to ALL event levels — context, page, browser.

---

## 6. Quick Reference Summary

```
When a new tab opens from ANYWHERE in the session
  → context.waitForEvent('page')

When THIS specific page opens a child tab
  → page.waitForEvent('popup')

When an alert/confirm/prompt appears
  → page.waitForEvent('dialog')  OR  page.on('dialog', fn)

When a file starts downloading
  → page.waitForEvent('download')

When you want to spy on every console.log in the browser
  → page.on('console', fn)
```

---

## 7. Handling Dialogs (alert / confirm / prompt)

JS dialogs (`alert`, `confirm`, `prompt`) cannot be inspected in DevTools. Handle them with:

```js
page.on('dialog', async dialog => {
  console.log('Dialog message:', dialog.message());
  await dialog.accept();   // click OK
  // await dialog.dismiss();  // click Cancel
  // await dialog.accept('some input'); // for prompt()
});
```

> Set up the `dialog` listener **before** triggering the action that causes the dialog.

