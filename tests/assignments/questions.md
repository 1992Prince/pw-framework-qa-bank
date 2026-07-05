
# Playwright Practice Assignments — Interview Coding Round Prep

> Format: each item is a **task** + a **validation checklist** (what your working solution
> must satisfy). No solutions are given — attempt each one, then self-check against the
> checklist. Re-attempt from scratch after a day or two until you can write it without
> looking anything up — that's the actual interview simulation.

---

## Assignment 1 — Plain Playwright Library (No Test Runner), Login + Homepage Validation

**Task:**
Using only the `playwright` library (`chromium.launch()` — NOT `@playwright/test`), write a
standalone Node.js script that:

1. Launches Chromium (headed, so you can see it).
2. Navigates to a login URL, using an explicit `waitUntil` condition with a **5 second**
   timeout — the script must throw/report a clear error if the page doesn't load in time.
3. Enters username and password into the login form.
4. Validates that the **Submit** button is enabled before clicking it.
5. Clicks Submit.
6. Validates the homepage loaded correctly by checking:
   - The URL (exact, glob, or regex match)
   - The page title
   - Presence/visibility of a specific homepage element (e.g., a welcome banner or logo)
7. Closes the browser cleanly (in a `finally` block) even if an assertion fails.

**Validation Checklist:**

- [ ] Script does **not** import from `@playwright/test` — only `require('playwright')` / `import { chromium } from 'playwright'`.
- [ ] `page.goto(url, { waitUntil: ..., timeout: 5000 })` is used — not a hard `waitForTimeout`.
- [ ] A clear try/catch (or `.catch()`) reports a meaningful error if the 5s timeout is breached.
- [ ] Enabled-check on Submit button is done via a proper API (not just visually assuming it).
- [ ] Homepage validation uses **3 separate checks**: URL, title, and an element — using `expect()` from `playwright` (or manual assertions if `expect` isn't available outside the test runner — research how to import `expect` standalone from `@playwright/test` even without using `test()`).
- [ ] Browser + context + page are all closed properly at the end.
- [ ] Script runs standalone via `node script.js` (no test runner CLI needed).

---

## Assignment 2 — Repeat Assignment 1 Across Chrome Channel, Edge Channel, and WebKit

**Task:**
Take your Assignment 1 script and generalize/parametrize it so the **same logic** runs
against:

1. Chromium launched with `channel: 'chrome'`
2. Chromium launched with `channel: 'msedge'`
3. WebKit engine (`webkit.launch()`)

**Validation Checklist:**

- [ ] A single reusable function accepts a "browser type + channel" configuration and runs the full login+validation flow.
- [ ] Chrome run explicitly passes `{ channel: 'chrome' }` to `chromium.launch()`.
- [ ] Edge run explicitly passes `{ channel: 'msedge' }` to `chromium.launch()`.
- [ ] WebKit run imports `webkit` from `playwright` and launches it directly (no `channel` option — WebKit doesn't use channels).
- [ ] All three runs produce a pass/fail summary at the end (e.g., a small results table logged to console).
- [ ] You can explain **why** `channel` only applies to Chromium-based browsers and not WebKit/Firefox.

---

## Assignment 3 — Manually Creating Browser / Context / Page Instances (All 3 Engines)

**Task:**
Without the test runner, write code that explicitly creates, in sequence, for **each** of
Chromium, Firefox, and WebKit:

- A `Browser` instance
- A `BrowserContext` instance from that browser
- A `Page` instance from that context

Navigate each page to a simple URL (e.g., `https://playwright.dev`) and print the page
title, then close everything in the correct order (page → context → browser).

**Validation Checklist:**

- [ ] All three engines (`chromium`, `firefox`, `webkit`) are imported and used.
- [ ] For each engine you can name: what a `Browser` represents, what a `BrowserContext`
  represents (isolated session — cookies/storage), and what a `Page` represents (a tab).
- [ ] Explicit `browser.newContext()` is used rather than `browser.newPage()` shortcut, since
  the assignment requires visibility of the context step.
- [ ] Closing order is correct: `page.close()` (optional, context close cascades) →
  `context.close()` → `browser.close()`.
- [ ] You can explain what happens to cookies/localStorage if you create 2 pages from the
  **same** context vs. 2 pages from 2 **different** contexts of the same browser.

---

## Assignment 4 — Same as Assignment 3, But Using Playwright Test Runner

**Task:**
Rewrite Assignment 3 using `@playwright/test`, leveraging built-in fixtures (`browser`,
`context`, `page`) as well as manually creating additional contexts/pages inside a single
test where needed, for all 3 projects (chromium/firefox/webkit) configured via
`playwright.config.ts`.

**Validation Checklist:**

- [ ] `playwright.config.ts` defines 3 `projects`, one per engine, using `devices[...]` presets.
- [ ] Test file uses the `test()` function and the built-in `page` fixture directly (no manual `browser.close()` needed — the runner manages lifecycle).
- [ ] At least one test additionally demonstrates manually creating a **second** context/page via `browser.newContext()` inside the test, to show you understand both the automatic fixture and the manual approach.
- [ ] Run with `npx playwright test --project=chromium`, `--project=firefox`, `--project=webkit` and confirm all pass.
- [ ] You can explain the difference between the `browser` fixture and the `page` fixture in `@playwright/test`.

---

## Assignment 5 — Two Contexts, Two Pages, Two Different URLs

**Task:**
Using the `browser` fixture (test runner) or a manually created `Browser` instance:

1. Create **two separate `BrowserContext`** instances from the same browser.
2. From **each** context, create one `Page`.
3. Navigate the two pages to two **different** URLs simultaneously.
4. Prove isolation: e.g., log in / set a cookie in context 1 and confirm context 2 does
   **not** have that cookie/session.

**Validation Checklist:**

- [ ] Two independent `context1` and `context2` variables exist, both from `browser.newContext()`.
- [ ] `page1 = context1.newPage()`, `page2 = context2.newPage()`.
- [ ] Both pages navigate concurrently (e.g., via `Promise.all([page1.goto(url1), page2.goto(url2)])`) — not sequentially, to prove they're independent.
- [ ] A cookie/localStorage/session isolation check is included and actually demonstrates that context 1's state does not leak into context 2.
- [ ] Both contexts are closed at the end.
- [ ] You can explain a real use case for this pattern (e.g., testing two different user roles simultaneously in the same test).

---

## Assignment 6 — Repeat Assignment 1, Using Playwright Test Runner

**Task:**
Convert your Assignment 1 script into a proper `@playwright/test` spec file:

- Use the `page` fixture instead of manually launching a browser.
- Use `test.setTimeout()` or a per-navigation `{ timeout: 5000 }` for the load-time
  requirement.
- Use `expect(page)...` / `expect(locator)...` web-first assertions for all validations
  (enabled button, URL, title, homepage element).

**Validation Checklist:**

- [ ] File is named `*.spec.ts` (or `.js`) and uses `test('...', async ({ page }) => {...})`.
- [ ] Navigation still enforces the 5-second condition explicitly (not relying on default 30s test timeout to "accidentally" catch a slow load).
- [ ] `await expect(locator).toBeEnabled()` used for the Submit button check.
- [ ] `await expect(page).toHaveURL(...)`, `await expect(page).toHaveTitle(...)`, and `await expect(locator).toBeVisible()` used for homepage validation — 3 separate assertions.
- [ ] No manual `browser.close()` / `context.close()` anywhere — the test runner handles teardown.
- [ ] Test passes with `npx playwright test`.

---

## Assignment 7 — Locator Strategies & Chaining

Each part below is a **separate mini-exercise**. Pick any public site with the relevant
elements (or build a tiny local HTML fixture) to practice against.

**7a. `getByRole` with visible text**

- Task: Locate a button/link purely by its ARIA role and its visible accessible name.
- Validation: Your locator must use `page.getByRole('button', { name: 'Submit' })` (or
  similar) — no CSS/XPath fallback. Confirm it resolves to exactly 1 element via
  `expect(locator).toHaveCount(1)`.

**7b. `getByRole` with visible text AND a state**

- Task: Locate a checkbox/button that is, e.g., **checked** or **disabled**, combined with
  its accessible name.
- Validation: Locator includes both a `name` option and a state-related follow-up assertion
  (e.g., `getByRole('checkbox', { name: 'Accept Terms' })` + `expect(locator).toBeChecked()`,
  or `getByRole('button', { name: 'Next', disabled: true })` where supported).

**7c. Filtering children by specific text**

- Task: Given a list of repeated items (e.g., product cards), locate the **one** matching a
  specific text among its children using `.filter({ hasText: ... })`.
- Validation: Demonstrate `page.locator('.product-card').filter({ hasText: 'Wireless Mouse' })`
  resolves to exactly one card, then interact with a child element inside it (e.g., its
  "Add to Cart" button) — proving you scoped correctly instead of matching the first card
  on the page.

**7d. Locator chaining**

- Task: Show a locator built by chaining parent → child (`.locator()` calls), e.g., finding
  a specific row in a table, then a specific cell/button within that row.
- Validation: At least 2 levels of chaining, e.g.
  `page.locator('table#users tbody tr').filter({ hasText: 'John' }).locator('button.delete')`.
  Confirm the chained locator is scoped (i.e., clicking it doesn't accidentally hit a
  same-named button in a different row).

---

## Assignment 8 — Multi-Element Handling, Tables, Toasts, Calendars, Dialogs, Frames, and More

This is a large set — treat each bullet as its own mini-assignment with its own
validation. Use any demo/practice site (e.g., the-internet.herokuapp.com,
demoqa.com, playwright.dev) or a local HTML fixture where a real one isn't handy.

### 8.1 `nth()`, `first()`, `last()`

- Task: Given a repeated locator (e.g., a list of items), select and interact with the
  first, last, and an arbitrary nth element.
- Validation: Use `.first()`, `.last()`, and `.nth(2)` (or similar index) on the **same**
  base locator; assert each targets a different element (e.g., compare their `textContent`).

### 8.2 Locating multiple elements with the same selector + click all checkboxes

- Task: Select all checkboxes on a page and check every one of them.
- Validation: Use `page.locator('input[type=checkbox]').all()` (or `count()` + loop via
  `.nth(i)`) to iterate; after the loop, assert with
  `expect(page.locator('input[type=checkbox]')).toBeChecked()` (multi-element assertion) or
  loop-assert each one individually. Confirm the checked count equals total count.

### 8.3 Print all `href` values from every hyperlink

- Task: Collect every `<a>` tag's `href` attribute on the page and print them.
- Validation: Use `locator('a').evaluateAll(...)` or `.all()` + `getAttribute('href')` per
  element; output should be a clean array/list with no `null`/`undefined` entries left
  unhandled (filter or flag links missing `href`).

### 8.4 Print all `src` values from every image

- Task: Same pattern as 8.3 but for `<img src>`.
- Validation: Same approach (`evaluateAll` or loop + `getAttribute('src')`); verify count
  of collected srcs matches `locator('img').count()`.

### 8.5 Handling auto-suggestion dropdowns

- Task: Type into a search/autocomplete input, wait for the suggestion list to appear, and
  select a specific suggestion by text (not by fixed index, since order can vary).
- Validation: Must **wait** for the suggestion list container to become visible before
  querying it (no hard wait); selection uses `filter({ hasText: ... })` or `getByText`
  scoped to the suggestion list, not the whole page.

### 8.6 Date picker selection (auto-suggestion style widget)

- Task: Open a date-picker widget and select a specific date (e.g., "15" of the currently
  displayed month, or navigate to a different month/year first if the widget requires it).
- Validation: Solution waits for the calendar popup to be visible before interacting;
  clicking the date is scoped within the calendar container (not a random "15" text
  elsewhere on the page); after selection, assert the input field now shows the expected
  date value.

### 8.7 Validate all links on a webpage are valid (not broken)

- Task: Collect every link's `href`, then verify each one returns a non-error HTTP status
  (not a 404/500) without necessarily navigating the browser to each one.
- Validation: Uses `page.request` (Playwright's `APIRequestContext`) to `HEAD`/`GET` each
  href and check `response.status() < 400`; produces a final report listing which links (if
  any) are broken, with their status codes. Handles relative vs. absolute URLs correctly.

### 8.8 Editable smart table — edit a specific row / fetch details of ID 4 / delete row of ID 9

- Task: Given a data table with an ID column, write reusable helper functions to:
  1. Locate the row where the ID column equals a given value.
  2. Read all cell values of that row into an object.
  3. Click an "Edit" action in that row, update a field, save.
  4. Click a "Delete" action on a different row by ID and confirm it's removed.
- Validation: All three functions take the ID as a parameter (not hardcoded row index) and
  internally use `.filter({ hasText: id })` or a cell-based locator to find the row
  regardless of its position in the table. After delete, assert the row for that ID no
  longer exists (`expect(row).toHaveCount(0)`). After edit, assert the specific cell shows
  the new value.

### 8.9 Handling toasts

- Task: Trigger an action that shows a temporary toast/snackbar message, assert its text,
  then assert it disappears on its own.
- Validation: Uses `expect(toastLocator).toBeVisible()` then
  `expect(toastLocator).toBeHidden()` (or `.toHaveCount(0)` if it's removed from DOM) — no
  hard wait for the toast's auto-dismiss duration; explain why `toBeHidden`/web-first
  assertions handle the timing automatically.

### 8.10 Handling calendars

- Task: Similar to 8.6 but explain/demo navigating across months/years (e.g., clicking
  "next month" N times) before selecting a date far from the current month.
- Validation: Solution is parametrized by target month/year rather than a fixed number of
  "next" clicks baked in; loop condition checks the currently displayed month/year label
  and stops once it matches the target.

### 8.11 Handling dialogs (alert, confirm, prompt)

- Task: Trigger each of the 3 native dialog types and handle them programmatically —
  accept an alert, accept/dismiss a confirm, and fill+accept a prompt.
- Validation: Dialog listener (`page.once('dialog', ...)` or `page.on('dialog', ...)`) is
  registered **before** the action that triggers the dialog (same race-condition concern as
  `waitForEvent`). Explain why Playwright auto-dismisses dialogs if no handler is attached,
  and why you must handle it *before* triggering, not after.

### 8.12 Handling frames (iframes)

- Task: Interact with an element that lives inside an `<iframe>`, and (if nested) inside a
  frame-within-a-frame.
- Validation: Uses `page.frameLocator('iframe selector')` (not the older `page.frame()` +
  `ElementHandle` approach) to scope all interactions; demonstrates chaining
  `frameLocator().frameLocator()` for nested frames if applicable.

### 8.13 Handling dropdowns

- Task: Handle both a native HTML `<select>` and a custom (div-based, non-native) dropdown
  widget.
- Validation: Native select uses `selectOption()` (by value, label, or index — show at
  least 2 variants); custom dropdown uses click-to-open + click-the-option pattern with
  proper waits (no native `selectOption` since it won't work on non-`<select>` elements).

### 8.14 Handling downloads and uploads (single and multiple files)

- Task:
  1. Trigger a file download and save/verify it.
  2. Upload a single file via a file input.
  3. Upload multiple files via a file input.
  4. (Bonus) Handle an upload triggered via a custom "choose file" button that opens the OS
     file picker (`page.waitForEvent('filechooser')`).
- Validation: Download uses `Promise.all([page.waitForEvent('download'), <trigger>])`, then
  asserts `download.suggestedFilename()` and/or saves via `download.saveAs()`. Single upload
  uses `locator.setInputFiles('path/to/file')`. Multiple upload uses
  `locator.setInputFiles(['path1', 'path2'])` — an **array**. Filechooser variant registers
  the `filechooser` listener before clicking the custom button, then calls
  `fileChooser.setFiles(...)`.

### 8.15 Locating Shadow DOM elements

- Task: Interact with an element nested inside a **shadow root**.
- Validation: Demonstrate that Playwright's normal `page.locator()` with CSS selectors
  pierces **open** shadow roots automatically (no special syntax needed for open shadow
  DOM) — show a working example and explain what would differ for a **closed** shadow root
  (generally inaccessible without app-level test hooks).

### 8.16 Scroll to end / top of page

- Task: Scroll the page fully to the bottom, then fully back to the top, programmatically.
- Validation: Uses `page.mouse.wheel()` or `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))`
  and the equivalent for scrolling to top; assert scroll position via
  `page.evaluate(() => window.scrollY)` before/after.

### 8.17 Scroll until an element becomes visible / enters viewport

- Task: Given an element far down the page, scroll incrementally (or directly) until it's
  in the viewport, then interact with it.
- Validation: Explain/demonstrate that `locator.scrollIntoViewIfNeeded()` (or simply calling
  `.click()`, which auto-scrolls as part of actionability) handles this without manual pixel
  math; show the manual `evaluate`-based scroll loop as an alternative for cases where
  auto-scroll isn't sufficient (e.g., custom virtualized/lazy-loaded lists).

### 8.18 SVG elements

- Task: Locate and interact with (e.g., click, read text from) an element inside an
  `<svg>` block.
- Validation: Confirm standard CSS/role-based locators work on SVG the same way as HTML
  (e.g., `page.locator('svg text')`, or `getByRole` if the SVG has proper ARIA roles); note
  any quirks (e.g., `innerText` not working the same way on SVG — use `textContent`).

### 8.19 AJAX / dynamically loaded components

- Task: Interact with content that loads asynchronously after an XHR/fetch call completes
  (e.g., a table that populates after an API call finishes), without a hard wait.
- Validation: Solution either (a) waits on the specific element's appearance
  (`locator.waitFor()` / `expect().toBeVisible()`), or (b) explicitly waits on the network
  call itself via `page.waitForResponse()` before asserting on the resulting DOM — and you
  can explain which approach is more robust for a given scenario (element-wait is generally
  preferred since it doesn't couple the test to internal API endpoint names).

---

## How to Use This File

1. Attempt each assignment cold, without referring to the notes doc first.
2. Only after attempting, cross-check against `Playwright_Waiting_Strategies_Notes.md` for
   the waiting-related pieces (5, 6, 8.5, 8.6, 8.9, 8.19 especially lean on wait strategies).
3. Time yourself — most of these should be doable in 10–15 minutes each in a live interview
   setting once practiced.
4. Re-do the ones you struggle with a second time from scratch, not by re-reading your first
   attempt.
