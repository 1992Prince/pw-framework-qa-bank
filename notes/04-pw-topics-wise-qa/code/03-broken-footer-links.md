
# Playwright - Fetch Links, Images, Footer Links & Broken Links

## 1. Fetch all HREF Attribute values from all Links

```javascript
import { test, expect } from "@playwright/test";

test("Fetch all HREF Attribute values from all links", async ({ page }) => {
  await page.goto("https://www.naukri.com/");

  // Locate all anchor (<a>) elements having href attribute
  const allLinks = page.locator("//a[@href]");

  await allLinks.first().waitFor();

  const linksCount = await allLinks.count();

  for (let i = 0; i < linksCount; i++) {
    const hrefAttributeVal = await allLinks.nth(i).getAttribute("href");
    console.log(hrefAttributeVal);
  }

  await page.pause();
});
```

### Explanation

- `//a[@href]` locates every `<a>` element that has an `href` attribute.
- `count()` returns the total number of matching elements.
- `nth(i)` accesses each individual link.
- `getAttribute("href")` fetches the URL stored in the `href` attribute.

---

# 2. Fetch all SRC Attribute values from Images

```javascript
test("Fetch all SRC Attribute values from all images", async ({ page }) => {
  await page.goto("https://www.naukri.com/");

  // Locate all images having src attribute
  const allImages = page.locator("//img[@src]");

  await allImages.first().waitFor();

  const imagesCount = await allImages.count();

  for (let i = 0; i < imagesCount; i++) {
    const srcAttributeVal = await allImages.nth(i).getAttribute("src");
    console.log(srcAttributeVal);
  }

  await page.pause();
});
```

### Explanation

- `//img` locates every image.
- `//img[@src]` locates only images having a `src` attribute.
- `getAttribute("src")` returns the image URL.

---

# 3. Fetch Footer Links (Href + Text)

```javascript
test("Fetch FOOTER Links href and text", async ({ page }) => {
  await page.goto("https://www.google.com");

  // Locate footer container
  const footerEle = page.locator("//div[@jscontroller='NzU6V']");

  // Locate all anchor tags inside footer
  const footerLinks = footerEle.locator("a[href]");

  const footerLinksCount = await footerLinks.count();

  for (let i = 0; i < footerLinksCount; i++) {
    const hrefAttributeVal = await footerLinks.nth(i).getAttribute("href");
    const textContent = await footerLinks.nth(i).innerText();

    console.log(hrefAttributeVal, " -------- ", textContent);
  }

  await page.pause();
});
```

---

# Why use `footerEle.locator("a[href]")`?

Suppose the HTML is:

```html
<div jscontroller="NzU6V">
    <a href="/about">About</a>

    <div>
        <a href="/privacy">Privacy</a>

        <div>
            <a href="/terms">Terms</a>
        </div>
    </div>
</div>
```

Using

```javascript
const footerLinks = footerEle.locator("a[href]");
```

Playwright searches **inside `footerEle`** and returns every descendant anchor tag.

It finds:

```
About
Privacy
Terms
```

This includes:

- Direct child links
- Nested child links
- Links at any depth inside the footer

---

# Why NOT use `footerEle.locator(".//a[@href]")`?

Many people think this should work because `.//` is the relative XPath syntax.

Example:

```javascript
footerEle.locator(".//a[@href]");
```

This throws:

```
Unsupported token while parsing selector
```

### Reason

Playwright determines the selector engine automatically.

It recognizes XPath only when:

- selector starts with `//`
- selector starts with `..`
- selector is prefixed with `xpath=`

Since `.//a[@href]` does **not** start with `//`, Playwright assumes it is a **CSS selector**.

It therefore tries to parse:

```css
.//a[@href]
```

which is invalid CSS, resulting in the parsing error.

---

# Correct ways to write it

### ✅ Recommended (CSS)

```javascript
const footerLinks = footerEle.locator("a[href]");
```

Advantages:

- Cleaner
- Easier to read
- Faster than XPath in most browsers
- Officially recommended by Playwright

---

### ✅ If you specifically want XPath

```javascript
const footerLinks = footerEle.locator("xpath=.//a[@href]");
```

By prefixing with `xpath=`, Playwright correctly interprets `.//` as a relative XPath.

---

# What about this?

```javascript
footerEle.locator("//a[@href]");
```

Many developers assume this searches the entire page because `//` is an absolute XPath.

However, in Playwright **locator chaining scopes the child locator to the parent locator**.

Since the search starts from `footerEle`, Playwright evaluates the XPath within that context, so it usually returns only links inside the footer.

Although this often works, it is less explicit than:

```javascript
footerEle.locator("a[href]");
```

or

```javascript
footerEle.locator("xpath=.//a[@href]");
```

Therefore, prefer these two approaches for better readability and maintainability.

---

# 4. Find Broken Links

```javascript
test("Find all BROKEN LINKS from webpage", async ({ page, request }) => {
  await page.goto("https://www.naukri.com/");

  const allLinks = page.locator("//a[@href]");

  await allLinks.first().waitFor();

  const linksCount = await allLinks.count();

  const brokenLinks = [];

  for (let i = 0; i < linksCount; i++) {
    const hrefAttribute = await allLinks.nth(i).getAttribute("href");

    if (hrefAttribute !== null && hrefAttribute.startsWith("http")) {
      try {
        const response = await request.get(hrefAttribute, {
          timeout: 10000,
        });

        if (!response.ok()) {
          brokenLinks.push(hrefAttribute);
        }
      } catch (error) {
        brokenLinks.push(hrefAttribute);
      }
    }
  }

  console.log(brokenLinks);

  await page.pause();
});
```

---

# Logic Behind Broken Link Validation

1. Locate all links using `//a[@href]`.
2. Read each `href` attribute.
3. Ignore null, relative or JavaScript links.
4. Send an HTTP GET request using Playwright's APIRequestContext.
5. If response status is **not** in the 2xx range (`response.ok()` returns false), treat it as a broken link.
6. If the request throws an exception (timeout, DNS failure, SSL error, etc.), also consider the link broken.
7. Store all broken links in an array and print them at the end.

---

# Summary

| Task                       | Locator                                    |
| -------------------------- | ------------------------------------------ |
| All links                  | `//a[@href]`                             |
| All images                 | `//img[@src]`                            |
| Footer links (Recommended) | `footerEle.locator("a[href]")`           |
| Footer links using XPath   | `footerEle.locator("xpath=.//a[@href]")` |
| Broken link validation     | `request.get(href)` + `response.ok()`  |
