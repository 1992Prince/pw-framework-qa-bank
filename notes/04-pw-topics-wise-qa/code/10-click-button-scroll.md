
# 📘 Playwright Revision Notes — Locator, Mouse & Keyboard Methods

---

# Locator Level Methods

## `fill()`

**Purpose:** Clears existing text first, then enters new text.

```ts
await page.getByLabel('First Name').fill('Gaurav');
```

✅ Existing text is removed automatically.

### Use when

- Entering text into input fields
- Replacing existing value

---

## `clear()`

**Purpose:** Removes all text from an input field.

```ts
await page.getByLabel('First Name').clear();
```

### Difference — `fill()` vs `clear()`

| `fill()`                              | `clear()`                         |
| --------------------------------------- | ----------------------------------- |
| Clears existing text and types new text | Only removes existing text          |
| Accepts a value                         | No value required                   |
| Most commonly used                      | Used when field should become empty |

```ts
await locator.fill("John");   // Input = John

await locator.clear();        // Input becomes empty
```

---

## `pressSequentially()`

**Purpose:** Types characters one by one like a real user.

```ts
await locator.pressSequentially("Playwright");
```

With delay:

```ts
await locator.pressSequentially("Playwright", {
  delay: 100
});
```

### Use cases

- Search suggestions
- Auto-complete
- Live validation
- Debounced search
- Testing key events

### Difference from `fill()`

| `fill()`                        | `pressSequentially()`             |
| --------------------------------- | ----------------------------------- |
| Sets value instantly              | Types one character at a time       |
| Faster                            | Slower (human-like)                 |
| Doesn't simulate typing naturally | Fires keyboard events for every key |

---

## `inputValue()` vs `getAttribute("value")`

### `inputValue()`

Returns the **current value** inside an input element.

```ts
await locator.inputValue();
```

---

### `getAttribute("value")`

Returns the value of the HTML `value` attribute.

```ts
await locator.getAttribute("value");
```

### Difference

| `inputValue()`      | `getAttribute("value")`         |
| --------------------- | --------------------------------- |
| Reads current value   | Reads HTML attribute              |
| Reflects user edits   | May return original/default value |
| Recommended for forms | Used to inspect HTML attributes   |

Example

```html
<input value="John">
```

After typing:

```ts
await locator.fill("Gaurav");
```

Results:

```ts
await locator.inputValue();
// Gaurav

await locator.getAttribute("value");
// John (if DOM attribute wasn't updated)
```

---

## `getAttribute()`

Returns any HTML attribute.

```ts
await locator.getAttribute("placeholder");

await locator.getAttribute("type");

await locator.getAttribute("href");

await locator.getAttribute("disabled");
```

Returns `null` if the attribute doesn't exist.

### Common attributes

- `id`
- `class`
- `type`
- `placeholder`
- `href`
- `src`
- `name`
- `disabled`
- `checked`
- `value`

---

## `press()`

Simulates keyboard shortcuts or individual key presses.

```ts
await locator.press("Enter");

await locator.press("Tab");

await locator.press("Escape");

await locator.press("ArrowDown");
```

Keyboard shortcuts

```ts
await locator.press("Control+A");

await locator.press("Control+C");

await locator.press("Control+V");

await locator.press("Shift+Tab");
```

### Common use cases

- Submit forms
- Navigate using keyboard
- Copy/Paste
- Keyboard shortcut testing

---

## `selectText()`

Selects all text inside an editable element.

```ts
await locator.selectText();
```

Equivalent to pressing **Ctrl + A**, but works across operating systems.

### Why use it?

Instead of

```ts
await locator.press("Control+A");
```

Use

```ts
await locator.selectText();
```

✅ Cleaner

✅ Cross-platform

✅ More readable

---

## `setInputFiles()`

Uploads one or multiple files.

Single file

```ts
await page.locator('input[type=file]').setInputFiles('files/sample.pdf');
```

Multiple files

```ts
await locator.setInputFiles([
  'files/a.pdf',
  'files/b.pdf'
]);
```

Clear uploaded files

```ts
await locator.setInputFiles([]);
```

### Use cases

- File upload
- Multiple uploads
- Drag-and-drop upload inputs

---

# Click Actions

## Normal Click

```ts
await locator.click();
```

Performs all Playwright auto-wait checks before clicking.

---

## Force Click

Bypasses Playwright actionability checks.

```ts
await locator.click({
  force: true
});
```

### Use only when

- Element is covered
- Overlay blocks interaction
- Custom UI prevents Playwright checks

Avoid unless absolutely necessary.

---

## Click with Timeout

```ts
await locator.click({
  timeout: 5000
});
```

Waits up to 5 seconds before throwing an error.

---

## Right Click

```ts
await locator.click({
  button: "right"
});
```

Used for context menus.

---

## Double Click

```ts
await locator.dblclick();
```

Used when UI requires double-click interaction.

---

## Hover

```ts
await locator.hover();
```

Moves mouse over an element.

Common use cases

- Tooltips
- Dropdown menus
- Hidden buttons
- Hover effects

---

## `hover()` vs `focus()`

| `hover()`                | `focus()`                            |
| -------------------------- | -------------------------------------- |
| Mouse action               | Keyboard focus                         |
| Fires mouseover/mouseenter | Fires focus event                      |
| Used for menus/tooltips    | Used for typing or keyboard navigation |

---

## Click at Specific Position

Useful for sliders, canvas, charts, maps.

```ts
await slider.click({
  position: {
    x: 10,
    y: 5
  }
});
```

Coordinates are relative to the element.

---

# Mouse Actions

## `dragTo()`

High-level API for drag and drop.

```ts
await source.dragTo(target);
```

Internally performs

- Mouse move
- Mouse down
- Mouse move
- Mouse up

Also auto-scrolls when needed.

✅ Preferred approach.

---

## Manual Drag using `page.mouse`

```ts
await source.hover();

await page.mouse.down();

await target.hover();

await page.mouse.up();
```

### Use when

- Canvas
- Custom drag libraries
- Need intermediate mouse movement
- `dragTo()` doesn't work

---

## `page.mouse.wheel()`

Simulates the physical mouse wheel.

```ts
await page.mouse.wheel(0, 500);
```

### Use when

- Infinite scroll
- Lazy loading
- Custom scroll containers
- Virtualized lists

---

## `scrollIntoViewIfNeeded()`

Scrolls just enough to bring an element into the viewport.

```ts
await locator.scrollIntoViewIfNeeded();
```

Most Playwright actions already perform this automatically.

Call it manually only when scrolling itself is part of the test.

---

## Infinite Scroll Pattern

Keep scrolling until target becomes visible.

```ts
while (!(await target.isVisible())) {
    await page.mouse.wheel(0, 500);
}

await target.click();
```

Useful for

- Lazy loading
- Infinite scroll pages

---

## Scroll Entire Page

Bottom

```ts
await page.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight)
);
```

Top

```ts
await page.evaluate(() =>
    window.scrollTo(0, 0)
);
```

Best approach for page-level scrolling.

---

# Keyboard Actions

Playwright provides two ways to simulate keyboard input.

## 1. Locator Keyboard Actions (Preferred)

```ts
await locator.press("Enter");

await locator.press("Control+A");

await locator.press("Tab");
```

### Why prefer this?

- Targets a specific element
- Automatically focuses the element
- Cleaner and more reliable
- Auto-waits before interaction

Recommended for most form interactions.

---

## 2. `page.keyboard`

Works at the page/browser level.

```ts
await page.keyboard.press("Enter");

await page.keyboard.type("Playwright");

await page.keyboard.down("Shift");

await page.keyboard.up("Shift");
```

Useful when

- No locator is involved
- Global shortcuts
- Canvas applications
- Games
- Keyboard-only workflows

---

## `locator.press()` vs `page.keyboard`

| `locator.press()`  | `page.keyboard`                     |
| -------------------- | ------------------------------------- |
| Preferred            | Less common                           |
| Element-specific     | Browser/page-level                    |
| Auto-focuses element | Requires focused element              |
| Auto-waits           | No locator auto-wait                  |
| Used for forms       | Used for global keyboard interactions |

### Interview Question

**Should we use `page.keyboard` if `locator.press()` already exists?**

**Answer:** Not usually.

Use **`locator.press()`** whenever interacting with a specific element because it's safer, auto-focuses the element, and leverages Playwright's auto-waiting.

Use **`page.keyboard`** only when testing browser-level or application-level keyboard behavior that isn't tied to a particular locator, such as global shortcuts, canvas interactions, games, or keyboard navigation across the page.

**Rule of thumb:**

- ✅ Element interaction → `locator.press()`
- ✅ Global keyboard interaction → `page.keyboard`
