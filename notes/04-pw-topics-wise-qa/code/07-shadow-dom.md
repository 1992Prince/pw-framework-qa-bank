
# Playwright - Handling Shadow DOM

## What is Shadow DOM?

Shadow DOM is a **hidden DOM tree** attached to a normal HTML element (called the **Shadow Host**).

It is mainly used to encapsulate a component's HTML, CSS, and JavaScript so they don't interfere with the rest of the page.

```
Normal DOM
│
├── div
├── input
└── custom-element (Shadow Host)
        │
        └── Shadow DOM
              ├── input
              ├── button
              └── span
```

---

# Types of Shadow DOM

## 1. Open Shadow DOM ✅

- Accessible from outside
- Playwright can locate elements inside it
- Most commonly used in web applications

## 2. Closed Shadow DOM ❌

- Hidden from external access
- Playwright, Selenium, and JavaScript cannot access it directly
- Rarely used in real-world applications

---

# Does Playwright support Shadow DOM?

**Yes.**

One of Playwright's biggest advantages is that **locators automatically pierce through Open Shadow DOM**.

In most cases, you don't need any special API.

Simply use normal Playwright locators.

---

# Example

```javascript
import { test } from "@playwright/test";

test("Handle Shadow DOM", async ({ page }) => {

    await page.goto(
        "https://gauravkhurana.com/practise-api/ui/index.html#/practice"
    );

    await page.getByTestId("shadow-input").fill("Hello World");

    await page.getByTestId("shadow-btn").click();

    const text = await page.locator("#shadowOut").textContent();

    console.log(text);
});
```

No extra handling is required because Playwright automatically searches inside **Open Shadow DOM**.

---

# Which locators support Shadow DOM?

## ✅ Supported

- `locator()`
- `getByRole()`
- `getByText()`
- `getByLabel()`
- `getByPlaceholder()`
- `getByTestId()`
- `getByAltText()`
- `getByTitle()`

All of these automatically pierce **Open Shadow DOM**.

---

## ❌ XPath does NOT support Shadow DOM

```javascript
page.locator("//button")
```

XPath **cannot cross Shadow DOM boundaries**.

This is a limitation of XPath itself, not Playwright.

For Shadow DOM elements, always prefer:

- User-facing locators
- CSS selectors

instead of XPath.

---

# Interview Questions

## Q1. What are Shadow DOM elements?

Shadow DOM is a hidden DOM tree attached to an HTML element (Shadow Host).

There are two types:

- **Open** – accessible by Playwright.
- **Closed** – inaccessible from external tools.

Most real-world applications use **Open Shadow DOM**.

---

## Q2. Can Playwright locate Shadow DOM elements?

**Yes.**

Playwright automatically pierces **Open Shadow DOM**, so no special handling is required.

I simply use normal Playwright locators like `getByRole()`, `getByTestId()`, or `locator()`.

Closed Shadow DOM cannot be accessed.

---

## Q3. Does XPath work inside Shadow DOM?

**No.**

XPath cannot cross Shadow DOM boundaries.

For Shadow DOM, I always prefer:

- User-facing locators
- CSS selectors

instead of XPath.

---

## Q4. Why is Playwright better than Selenium for Shadow DOM?

Playwright automatically searches inside **Open Shadow DOM**.

In Selenium, accessing Shadow DOM usually requires additional JavaScript execution or Shadow Root handling.

This makes Playwright code simpler, cleaner, and less error-prone.

---

# Summary

| Feature              | Playwright Support            |
| -------------------- | ----------------------------- |
| Open Shadow DOM      | ✅ Supported                  |
| Closed Shadow DOM    | ❌ Not Supported              |
| CSS Selectors        | ✅ Auto-pierce Shadow DOM     |
| User-facing Locators | ✅ Auto-pierce Shadow DOM     |
| XPath                | ❌ Does not pierce Shadow DOM |
| Special API Required | ❌ No                         |
