
# Playwright - Handling iFrames

## What is an iFrame?

An **iframe** (`<iframe>`) is an HTML element used to embed another webpage inside the current webpage.

- **Parent Page** → Main webpage
- **Child Page** → Webpage loaded inside the iframe

A single page can contain one or multiple iframes.

---

# Frame vs iFrame

- **iFrame** → HTML element (`<iframe>`)
- **Frame** → Playwright object representing the document loaded inside that iframe

Since iframe content belongs to a separate document, `page.locator()` **cannot access elements inside it directly**.

---

# Ways to Handle iFrames

## 1. `page.frameLocator()` ✅ (Recommended)

`frameLocator()` first identifies the iframe, then lets you locate elements inside it.

It returns a **FrameLocator** object.

```javascript
const frame = page.frameLocator("#cardIframe");

await frame.getByTestId("iframe-card").fill("2323232322");
```

### Advantages

- Auto-waits for iframe to load
- Auto-waits for elements inside iframe
- Less flaky
- Official Playwright recommended approach

---

## 2. `page.frame()`

Returns a **Frame** object.

You can locate a frame by:

- Frame **name**
- Frame **URL**

```javascript
const frame = page.frame("payment-frame");

// OR

const frame = page.frame({
    url: /payment/
});
```

Then interact with it.

```javascript
await frame.fill("#card", "123456789");
```

### Limitation

`page.frame()` resolves the frame **immediately**.

If the iframe has not loaded yet, it may return `null`, making tests flaky.

---

# `frameLocator()` vs `frame()`

| Feature      | `frameLocator()` | `frame()` |
| ------------ | ------------------ | ----------- |
| Return Type  | `FrameLocator`   | `Frame`   |
| Auto Waiting | ✅ Yes             | ❌ No       |
| Recommended  | ✅ Yes             | ❌ No       |
| Reliability  | High               | Lower       |

**Recommendation:** Prefer **`frameLocator()`** for all new Playwright scripts.

---

# Example

```javascript
import { test } from "@playwright/test";

test("Handle iFrame", async ({ page }) => {

    await page.goto(
        "https://gauravkhurana.com/practise-api/ui/index.html#/practice"
    );

    // Locate iframe
    const frame = page.frameLocator("#cardIframe");

    // Read value
    const value = await frame
        .getByTestId("iframe-card")
        .getAttribute("value");

    console.log(value);

    // Perform actions inside iframe
    await frame.getByTestId("iframe-card").fill("2323232322");
    await frame.getByTestId("iframe-name").fill("Gaurav Khurana");
});
```

---

# Interview Questions

## Q1. How do you handle iFrames in Playwright?

I use **`page.frameLocator()`**.

It first locates the iframe and then allows interaction with elements inside it.

Since it supports Playwright's auto-waiting, it is more reliable than `page.frame()`.

---

## Q2. Why use `frameLocator()` instead of `frame()`?

Because:

- `frameLocator()` auto-waits for the iframe and elements.
- `frame()` fetches the frame immediately.
- If the iframe hasn't loaded, `frame()` may return `null`.

Therefore, `frameLocator()` is the recommended approach.

---

## Q3. How can `page.frame()` locate a frame?

Using:

- Frame **name**

```javascript
page.frame("payment-frame");
```

- Frame **URL**

```javascript
page.frame({
    url: /payment/
});
```

---

## Q4. Do we need to switch back to the main page like Selenium?

**No.**

Unlike Selenium, Playwright does **not** require:

```java
driver.switchTo().defaultContent();
```

Once you're done interacting with the iframe, simply continue using the `page` object.

---

## Q5. How do you handle nested iFrames?

Chain `frameLocator()` calls.

```javascript
await page
    .frameLocator("#outer-frame")
    .frameLocator("#inner-frame")
    .getByRole("button", { name: "Submit" })
    .click();
```

---

## Summary

| Method                   | Purpose                                                       |
| ------------------------ | ------------------------------------------------------------- |
| `page.frameLocator()`  | Locate iframe and interact with elements inside (Recommended) |
| `page.frame()`         | Get Frame object by name or URL                               |
| `FrameLocator`         | Auto-waiting, reliable                                        |
| `Frame`                | Immediate lookup, no auto-wait                                |
| Nested iFrames           | Chain multiple`frameLocator()` calls                        |
| Switch back to main page | ❌ Not required                                               |
