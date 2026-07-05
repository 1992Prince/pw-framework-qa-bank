
# 📝 Notes: Hooks in Playwright

Hooks are special functions that let you run code **before/after** tests or test files, so you can handle setup and teardown without repeating code in every test.

---

## 1) Why hooks matter

- Avoid repeating common steps (like `page.goto()`, login, opening browser) in every single test
- Centralize setup/cleanup logic — e.g., seeding data before tests, closing DB connections after
- Keep tests focused only on **what they're testing**, not on repetitive setup

---

## 2) Types of Hooks in Playwright

### `beforeAll`

- Runs **once**, before all tests in a file (or `describe` block)
- Good for: one-time setup like starting a server, creating a shared resource

```js
test.beforeAll(async () => {
  console.log("Runs once before all tests in this file");
});
```

⚠️ Runs outside a test's `page` fixture unless you create a new browser context manually — commonly used for non-page setup (API calls, DB seed).

---

### `afterAll`

- Runs **once**, after all tests in a file (or `describe` block) finish
- Good for: cleanup like closing DB connection, deleting test data created in `beforeAll`

```js
test.afterAll(async () => {
  console.log("Runs once after all tests in this file");
});
```

---

### `beforeEach`

- Runs **before every individual test** in the file (or `describe` block)
- Most commonly used hook — e.g., navigating to a page, logging in before each test

```js
test.beforeEach(async ({ page }) => {
  await page.goto("https://example.com/login");
});
```

---

### `afterEach`

- Runs **after every individual test**, regardless of pass/fail
- Good for: taking screenshot on failure, clearing cookies/local storage, logging test result

```js
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `failure-${testInfo.title}.png` });
  }
});
```

---

## 3) Scoping hooks with `describe`

Hooks can be scoped to a specific group of tests using `test.describe()`:

```js
test.describe("Login functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://example.com/login");
  });

  test("valid login", async ({ page }) => { /* ... */ });
  test("invalid login", async ({ page }) => { /* ... */ });
});
```

- `beforeEach` here only runs for tests inside this `describe` block, not for the whole spec file

---

## 4) Execution order (important for interviews)

```
beforeAll
  → beforeEach → Test 1 → afterEach
  → beforeEach → Test 2 → afterEach
afterAll
```

If hooks are nested (outer `describe` + inner `describe`), Playwright runs **outer hooks first**, then inner:

```
outer beforeAll → inner beforeAll
  → outer beforeEach → inner beforeEach → Test → inner afterEach → outer afterEach
inner afterAll → outer afterAll
```

---

## 5) Key interview point — `beforeEach` and fixtures

- `beforeEach` / `afterEach` receive the same fixtures (`page`, `context`, `browser`) as tests, and **each test gets a fresh `page`** by default in Playwright (unlike some other frameworks where you manually manage browser state) — so `beforeEach` is the natural place to do per-test setup like login or navigation.

