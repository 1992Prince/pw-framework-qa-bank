## Locators & Selector Strategies

### Q1: What is the difference between a locator and a selector?

* **Selector:** "A selector is just a string that describes *how* to find an element on the page. It can be a CSS path, an XPath, or text (e.g., `'.submit-btn'`, `'//button'`)."
* **Locator:** "A locator is an actual object in Playwright created using a selector (e.g., `page.locator('.submit-btn')`). It acts as a strict pointer to the element and has built-in methods to interact with it, wait for it, or extract data from it."

---

### Q2: What is `page.locator()` and its return type? Does it support element chaining?

* **What it is:** "It is a method used to create a Locator object. It tells Playwright where to find the element but doesn't fetch it immediately—it evaluates lazily just before an action."
* **Return Type:** "It returns a `Locator` object synchronously (no `await` needed to create it)."
* **Chaining:** "Yes, it fully supports chaining. You can chain locators to narrow down your search."

```typescript
// Chaining example
const row = page.locator('table tr');
const button = row.locator('button.delete');
```

---

### Q3: What locator strategies does Playwright support, and what are the user-facing `getBy` locators?

* **The `getBy` Locators:** "Playwright strongly recommends 8 built-in user-facing locators based on accessibility:"

1. `getByRole` (locates by ARIA role, e.g., button, checkbox)
2. `getByText` (locates by visible text)
3. `getByLabel` (locates form controls by associated label)
4. `getByPlaceholder` (locates inputs by placeholder text)
5. `getByAltText` (locates images by alt attribute)
6. `getByTitle` (locates by title attribute)
7. `getByTestId` (locates by `data-testid` attribute)

* **Legacy Support:** "Playwright also fully supports CSS and XPath selectors via the `page.locator()` method."


Since there are  **7 Playwright locators** , a memorable mnemonic can make them much easier to recall during interviews.

### Mnemonic 1 (Recommended)

#### **"Real Testers Love Playing Around The Browser"**

| Word              | Locator                |
| ----------------- | ---------------------- |
| **Real**    | `getByRole()`        |
| **Testers** | `getByText()`        |
| **Love**    | `getByLabel()`       |
| **Playing** | `getByPlaceholder()` |
| **Around**  | `getByAltText()`     |
| **The**     | `getByTitle()`       |
| **Browser** | `getByTestId()`      |

So remember:

> **Real Testers Love Playing Around The Browser** 🚀
>

---

### Q4: Why is `getByRole` highly recommended, and why are `getBy` locators less fragile than CSS/XPath?

* **The Two DOM Trees:** "When a webpage loads, the browser creates two trees: the standard DOM tree (which CSS/XPath rely on) and the Accessibility tree (which screen readers use)."
* **Why it's less fragile:** "Standard DOM elements (like classes or divs) change constantly as developers update styling, causing CSS locators to break. The Accessibility tree rarely changes because a 'Submit Button' is fundamentally always a button. `getByRole` queries this accessibility tree directly, making your tests highly resilient to UI refactoring."
* **Simulating Real Users:** "It forces you to write tests the way users interact with the app. A user doesn't look for `div.btn-primary-2`; they look for a button with the name 'Submit'."

---

### Q5: What element states can you validate using `getByRole()`?

* **States & Properties:** "Because `getByRole` interacts with the accessibility tree, you can filter by element states directly in the locator creation. This saves you from having to write complex assertions later."

```typescript
// Locating a button that is explicitly disabled
await page.getByRole('button', { name: 'Submit', disabled: true }).click();

// Locating a checkbox that is currently checked
await page.getByRole('checkbox', { name: 'Subscribe', checked: true }).click();

```

---

### Q6: What is `getByTestId` and can we add a custom test id attribute in the framework?

* **What it is:** "It's a locator strategy used to find elements by a dedicated testing attribute, defaulting to `data-testid`. It's great when elements lack clear roles or text."
* **Customizing it:** "Yes, if your application uses a different attribute (like `data-cy` or `data-test`), you can override the default globally in `playwright.config.ts`."

```typescript
// In playwright.config.ts
use: { testIdAttribute: 'data-cy' }

```

---

### Q7: How do you pass a partial text match versus an exact text match in `page.locator()`?

* **By default:** "Text matching is partial and case-insensitive."
* **Exact match:** "You can enforce an exact, case-sensitive match by using the `has-text` pseudo-class with quotes, or by passing the `exact: true` option in `getByText`."

```typescript
// Partial match (matches "Welcome Back User")
const partial = page.locator('text=Welcome'); 

// Exact match (only matches exactly "Welcome")
const exact = page.locator('text="Welcome"');

// Using getByText
const exactGetBy = page.getByText('Welcome', { exact: true });

```

---

### Q8: How do you get the title, current URL, and textContent of a page and element? Are they synchronous or asynchronous?

* **URL (Synchronous):** "`page.url()` returns the current URL string immediately."
* **Title (Asynchronous):** "`await page.title()` returns a promise that resolves to the page title."
* **Text Content (Asynchronous):** "`await locator.textContent()` or `await locator.innerText()` returns a promise resolving to the visible text."

```typescript
const url = page.url(); // Sync
const title = await page.title(); // Async
const text = await page.locator('#header').textContent(); // Async

```

---

### Q9: What's the difference between `page.click()` and `locator.click()` — why is `locator.click()` preferred?

* **`page.click('selector')` (Legacy):** "This combines finding the element and clicking it into one step. It's an older API style."
* **`locator.click()` (Preferred):** "This separates the creation of the pointer (Locator) from the action (`click()`). This is preferred because you can pass Locators around as variables, reuse them, chain them, and pass them into helper functions or Page Object Models."

---

### Q10: How do you locate multiple elements and iterate over them?

* **Accessing by Index:** "If a locator matches multiple elements, you can use `.first()`, `.last()`, or `.nth(index)` to interact with a specific one."
* **Iterating / Counting:** "You use `await locator.count()` to get the total number, and then loop through them using a standard `for` loop."

```typescript
const rows = page.getByRole('listitem');
const count = await rows.count();

for (let i = 0; i < count; ++i) {
  console.log(await rows.nth(i).textContent());
}

```

---

### Q11: What does `page.locator().all()` return and what is the difference between `locator()` and `locator().all()`?

* **`locator()`:** "Returns a single `Locator` object that points to *all* matching elements in the DOM. However, if you try to call `.click()` on it and it resolves to multiple elements, Playwright will throw a 'strict mode' violation error."
* **`locator().all()`:** "Returns an array of individual `Locator` objects (`Promise<Locator[]>`). It resolves immediately. It's highly useful when you want to use modern `for...of` loops to iterate through elements cleanly."

```typescript
for (const row of await page.getByRole('listitem').all()) {
  await row.click();
}

```

---

### Q12: How can you filter a parent element based on child properties?

* **The `.filter()` method:** "Playwright allows you to narrow down locators by checking what is inside them using `.filter()`."
* **The 4 Options:**
* `has`: Filters elements that contain a specific inner locator.
* `hasNot`: Filters elements that do NOT contain a specific inner locator.
* `hasText`: Filters elements that contain specific inner text.
* `hasNotText`: Filters elements that do NOT contain specific inner text.

```typescript
// Find the specific row that contains a 'Delete' button
const row = page.getByRole('row').filter({ has: page.getByRole('button', { name: 'Delete' }) });

```

---

### Q13: How do you deal with dynamic/unstable selectors (auto-generated class names, data-driven IDs)?

* **Avoid Classes/IDs:** "Never use dynamic classes (like `class="css-1xhj18k"`) or dynamic IDs."
* **Use Accessibility Locators:** "Rely on `getByRole` or `getByText` as the visible UI rarely changes."
* **Use Structural Relationships:** "If text is dynamic, locate a stable parent (like a specific section) and use chaining or filtering to drill down."
* **Test IDs:** "If all else fails, ask developers to add static `data-testid` attributes."

---

### Q14: How does `page.locator()` differ from `page.$()` / `page.querySelector()`?

* **`page.$()` (ElementHandle):** "This resolves immediately and returns a snapshot of the actual DOM node. If the DOM updates or React re-renders the page, that ElementHandle becomes 'stale' and throws an error if you try to use it. It also does NOT auto-wait."
* **`page.locator()`:** "This is a blueprint. It does not resolve until an action (like `click`) is called. Right before clicking, it checks the DOM, auto-waits for the element to be visible and stable, and then clicks. If the page re-renders, the locator automatically finds the fresh element."

---

### Q15: How can you run Javascript code inside Playwright tests? Explain `page.evaluate()`.

* **`page.evaluate()`:** "This method allows you to execute arbitrary JavaScript directly inside the browser context, rather than in your Node.js test environment. You use it when Playwright's native API can't reach something, like reading the `window` object or extracting complex local storage data."

```typescript
// Grabbing a value directly from the browser's window object
const theme = await page.evaluate(() => window.localStorage.getItem('theme'));

```

---

### Q16: How do you locate elements inside an iframe using `frameLocator()`?

* **The Challenge:** "You cannot directly query elements inside an iframe using standard page locators because the iframe is a separate document."
* **The Solution:** "You use `page.frameLocator('selector')` to point to the iframe, and then chain your standard locators onto it."

```typescript
// Locate the iframe first, then the button inside it
const iframeLocator = page.frameLocator('#payment-frame');
await iframeLocator.getByRole('button', { name: 'Pay Now' }).click();

```

---

### Q17: What is the difference between `frame()` vs `frameLocator()` and what does each return?

* **`page.frame()`:** "Returns a `Frame` object. It finds the frame by its `name` or `url`. It's an older API. A Frame object behaves similarly to a Page object, but it does not auto-wait for the iframe to exist in the DOM."
* **`page.frameLocator()`:** "Returns a `FrameLocator` object. It finds the frame using standard CSS/XPath selectors. Because it creates a locator, it inherits Playwright's strictness and auto-waiting capabilities, making it much more reliable and the recommended approach."

---

### Q18: How do you handle Shadow DOM elements in Playwright?

* **It's Automatic:** "Unlike Selenium, where you have to execute JavaScript to pierce the shadow root, Playwright pierces the open Shadow DOM by default automatically."
* **How to use it:** "You simply write your CSS or text locators exactly as if the Shadow DOM didn't exist. Playwright will find the element."
* *(Note: Closed Shadow DOMs cannot be pierced by default, but these are exceptionally rare in modern web development).*
