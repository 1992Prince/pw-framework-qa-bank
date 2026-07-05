# Tabs and Windows Q&A

#### Q1) How do you handle multiple tabs or windows in Playwright?

**Answer (in points):**

- In Playwright, a new tab or window is always represented as a **new `Page` object** - there's no separate Tab or Window class.
- Whenever a new tab/window opens, we need to **explicitly listen** for the `'page'` event on the `BrowserContext` and capture its reference before interacting with it.
- For example, clicking a link that opens a new tab -> use `context.waitForEvent('page')` to wait for that new page event.
- This approach assumes the action creates **only one** new page - if multiple pages can open from a single action, the approach changes (would use `context.pages()` instead).
- `context.waitForEvent('page')` must be set up **before** the click action - otherwise Playwright might miss the event if the new tab opens too quickly.
- Since both operations (start listening + perform click) need to happen together and complete before moving to the next line, wrap them in `Promise.all()`.
- `Promise.all()` returns an array of resolved values -> destructure the first value into `newPage`, giving the reference to the new tab.

```javascript
// Listen for new page (tab/window)
const [newPage] = await Promise.all([
  context.waitForEvent('page'),       // start listening BEFORE the click
  page.click('a[target="_blank"]'),   // action that opens the new tab
]);

// Now work with the new tab
await newPage.waitForLoadState();     // wait for it to finish loading
await newPage.goto('https://example.com');
```

**Key points to mention:**

- Each tab/window is just another `Page` object inside the same `BrowserContext`.
- `context.waitForEvent('page')` captures it reliably, avoiding race conditions.
- Multiple `Page` objects can be held in variables and interacted with independently.
- Used `waitForEvent` at the **context** level since we're waiting for a *new* page to be created, not waiting for an event on an existing page.

---

### Q1) How do you handle multiple tabs or windows in Playwright?

**Answer (in points):**

- In Playwright, a new tab or window is always represented as a **new `Page` object** - there's no separate Tab or Window class.
- Whenever a new tab/window opens, we need to **explicitly listen** for the `'page'` event on the `BrowserContext` and capture its reference before interacting with it.
- For example, clicking a link that opens a new tab -> use `context.waitForEvent('page')` to wait for that new page event.
- This approach assumes the action creates **only one** new page - if multiple pages can open from a single action, the approach changes (would use `context.pages()` instead).
- `context.waitForEvent('page')` must be set up **before** the click action - otherwise Playwright might miss the event if the new tab opens too quickly.
- Since both operations (start listening + perform click) need to happen together and complete before moving to the next line, wrap them in `Promise.all()`.
- `Promise.all()` returns an array of resolved values -> destructure the first value into `newPage`, giving the reference to the new tab.

```
// Listen for new page (tab/window)
const [newPage] = await Promise.all([
  context.waitForEvent('page'),       // start listening BEFORE the click
  page.click('a[target="_blank"]'),   // action that opens the new tab
]);

// Now work with the new tab
await newPage.waitForLoadState();     // wait for it to finish loading
await newPage.goto('https://example.com');
```

**Key points to mention:**

- Each tab/window is just another `Page` object inside the same `BrowserContext`.
- `context.waitForEvent('page')` captures it reliably, avoiding race conditions.
- Multiple `Page` objects can be held in variables and interacted with independently.
- Used `waitForEvent` at the **context** level since we're waiting for a *new* page to be created, not waiting for an event on an existing page.

---

### Q2) What is the purpose of `bringToFront()` method?

**Answer (in points):**

- `bringToFront()` brings a specific `Page` (tab/window) into **visual focus** - activates that tab in the browser UI, like a user manually clicking on a tab.
- **Not required for performing actions** - Playwright can interact with any page directly, even in the background, without ever bringing it to front.
- `page.click()`, `page.fill()`, etc. all work fine on a page that's never been focused.

**Main use cases:**

- **Debugging / headed mode runs** - to visually see which page the script is currently acting on, especially when juggling parent and child tabs.
- **Returning to the parent page** after finishing work on a child tab - not functionally required, but good practice for clarity and mimicking real user behavior (especially before screenshots/visual validation).

```
await newPage.bringToFront(); // just visually focuses this page, doesn't affect ability to interact
```

- In short - it's a **visual/UX convenience method**, not a functional requirement for automation to work.

---

### Q3) Suppose you have multiple pages opened. Move to a particular page by validating its title, perform an action, and close the other pages. Explain the approach with code.

**Answer (in points):**

- Approach has **4 clear steps**, kept separate rather than combined in one loop - keeps logic predictable and avoids closing the needed page before acting on it.
- **Step 1 - Get all open pages**: use `context.pages()`, returns array of all `Page` objects currently open.
- **Step 2 - Identify the target page**: loop through pages, check each one's title via `page.title()`.

- Use `.includes()` instead of strict equality (`===`) - real titles often have extra text (e.g., Facebook's title is `"Facebook - log in or sign up"`, not just `"Facebook"`).
- `=== 'Facebook'` would never match; `.includes('Facebook')` reliably finds it.
- Break out of loop immediately once found - no need to check remaining pages.
- **Step 3 - Close all other pages**: loop through array again, close every page where `p !== targetPage`.
- **Step 4 - Perform the required action**: only on the target page, after bringing it to front.
- **Safety check**: if `targetPage` is `undefined` (not found), throw an explicit error instead of letting the script fail later with a confusing null-reference error.

```
test("TC008 - perform action on particular page under browser context", async ({ browser }) => {
  const context = await browser.newContext();
  const page1 = await context.newPage();
  const page2 = await context.newPage();
  const page3 = await context.newPage();

  await page1.goto("https://www.facebook.com/");
  await page2.goto("https://www.google.com/");
  await page3.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // STEP 1: Get all open pages under this context
  const pages = context.pages();

  // STEP 2: Find the target page by partial title match
  let targetPage;
  for (const p of pages) {
    const title = await p.title();
    if (title.includes('Facebook')) {
      targetPage = p;
      break;
    }
  }

  if (!targetPage) {
    throw new Error("Target page with title 'Facebook' not found");
  }

  // STEP 3: Close every page EXCEPT the target page
  for (const p of pages) {
    if (p !== targetPage) {
      await p.close();
    }
  }

  // STEP 4: Now safely perform the required action on the target page
  await targetPage.bringToFront();
  await targetPage.locator('//*[text()="Create new account"]').click();

  await context.close();
});
```

**Why this order matters** (worth saying in interview):

- If close + action happen in the same loop iteration and the action throws mid-way -> inconsistent state (some pages closed, target action incomplete).
- Separating "find," "close others," and "act" keeps logic clean, debuggable, with single responsibility per step.

---

### Q4) What kinds of events happen in Playwright, and at what levels?

**Answer (in points):**

- Events in Playwright are of various kinds, and they can happen at **three levels** - `Browser` level, `BrowserContext` level, and `Page` level.
- At the **Browser** level, events are very rarely used in day-to-day automation, so we mostly skip those.
- The ones we actually use most are at the **Context** level and the **Page** level.

**Events at `BrowserContext` level:**

- `'page'` - fires whenever a new page (tab/window/popup) is created inside that context.
- `'request'` - fires whenever any page in that context makes a network request.
- `'response'` - fires whenever any page in that context receives a network response.
- `'close'` - fires when the context itself is closed.

**Events at `Page` level:**

- `'popup'` - fires when that specific page opens a new tab/window.
- `'dialog'` - fires when a browser dialog appears (alert, confirm, prompt).
- `'download'` - fires when a file download is triggered from that page.
- `'console'` - fires when something is logged to the browser console.
- `'worker'` - fires when a web worker is spawned by that page.
- `'request'` - fires for network requests made specifically by that page.
- `'load'` - fires when that page finishes loading.

---

### Q5) `waitForEvent()` vs `.on()`

**Answer (in points):**

- The basic concept first - whenever an event is going to happen in Playwright, we need to **register our listener before the event happens**, so that Playwright can actually capture it when it fires. So both `waitForEvent()` and `.on()` are just two different ways to register that listener - and we register it **before** the action that triggers the event.
- Now, suppose my requirement is: "when I click this link, a new tab will open" - and I'm aware that only **one** new tab is going to open, after which I'll proceed with my next automation steps.
- In this case, I'll use `waitForEvent()`. It registers the listener, captures that **one** page event, and resolves. Done.
- If later in the flow another new event comes - like another new page opening - then for that I'd need to register the listener again and wait for it again. So `waitForEvent()` is a **one-time capture**.
- But suppose my requirement is different: I want to **capture every console log from the start of my automation flow to the end**. Here, registering and re-registering a listener again and again doesn't make sense - so this is where we use `.on()`.
- `.on()` stays **active for the entire flow** and captures **every occurrence** of that event throughout - not just once.
- We generally don't recommend using `.on()` for control-flow logic (like waiting for a tab), but it's genuinely useful for things like capturing console events or download events continuously across the whole test.
- One more thing - there's also an `.off()` method, which is used to **stop** listening to that event. So the flow can be: start with `.on()`, then call `.off()` to stop it, and even start it again later with `.on()` if needed.
- Both `.on()` and `.off()` can be used at the **context level** as well as the **page level**, same as `waitForEvent()`.

---

### Q6) When to use `'page'` event vs `'popup'` event?

**Answer (in points):**

- The `'page'` event is used at the **context level**.
- Use case: suppose there are **multiple tabs** open in the browser, and I want to move to a specific tab by validating its title or URL - for this, I'd use `context.waitForEvent('page')`.
- This `context.waitForEvent('page')` is powerful because it can handle **all kinds of new-page scenarios at the context level** - multiple tabs opening, a single new tab opening, a new window opening, multiple windows opening - basically any new page created anywhere inside that context, no matter what triggered it.
- Now compare this with `'popup'` - suppose I'm aware that **on this specific page**, when I click this particular element, a new page is going to open. So here, the **first page is the parent**, and the **second page that opens is the child** - this is a direct parent-child relationship, and I already know exactly which page (the parent) is responsible for opening it.
- In this case, since I know the exact parent, I use `page.waitForEvent('popup')` - registered directly on that parent page, not on the whole context.

**Simple rule to say in interview:**

- If I don't know which page will open the new tab, or there are multiple tabs/windows to handle -> `context.waitForEvent('page')`.
- If I know the exact parent page and it's a direct parent-child relationship -> `page.waitForEvent('popup')`.
