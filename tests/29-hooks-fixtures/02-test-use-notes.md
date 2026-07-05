
# 📝 Notes: `test.use()` in Playwright

`test.use()` lets you **override or set fixture values** (like `page`, `browser`, custom fixtures) for a specific test file or `describe` block — without changing the global `playwright.config.ts`.

---

## 1) What it does

- Overrides built-in fixture options (`viewport`, `locale`, `baseURL`, `storageState`, `browserName`, etc.) or custom fixtures
- Scope is limited to the file or `describe` block where it's declared — doesn't affect other spec files
- Must be called at the **top level** of a file or inside a `describe` block, not inside a `test()` itself

---

## 2) Basic syntax

```js
import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 720 } });

test("homepage layout", async ({ page }) => {
  await page.goto("https://example.com");
  // this test runs with the viewport set above
});
```

---

## 3) Common use cases

### a) Different browser context options per file

```js
test.use({ locale: "fr-FR", timezoneId: "Europe/Paris" });
```

Useful when a spec file specifically tests localization/timezone-dependent behavior.

### b) Logged-in state via `storageState`

```js
test.use({ storageState: "auth/admin.json" });
```

Reuses a saved authenticated session so tests don't need to log in via UI every time — very common in real frameworks for speeding up test runs.

### c) Scoped to a `describe` block — different config for different test groups in same file

```js
test.describe("Mobile view tests", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("mobile menu opens", async ({ page }) => { /* ... */ });
});

test.describe("Desktop view tests", () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test("desktop menu opens", async ({ page }) => { /* ... */ });
});
```

Each `describe` block gets its own viewport, without needing separate spec files or config changes.

### d) Overriding a custom fixture value

If your framework defines a custom fixture (e.g., `apiToken`), `test.use()` can override its value per file:

```js
test.use({ apiToken: "special-test-token" });
```

---

## 4) Key interview point

- `test.use()` is essentially a **local override of fixture options**, scoped to file/describe level — it doesn't run code like a hook does, it just configures the *environment/fixtures* that tests will run with.
- Difference from hooks: hooks (`beforeEach`, etc.) run **imperative code** before/after tests; `test.use()` **declares fixture configuration**, evaluated when fixtures are set up for each test.

