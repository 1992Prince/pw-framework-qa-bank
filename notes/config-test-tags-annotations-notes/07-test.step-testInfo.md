## What to say if asked "What is `test.step()`?"

**Definition (say this first, short):**

> "`test.step()` is used to break a single test into smaller, named steps — so when I look at the test report, I can clearly see which part of the test passed or failed, instead of just seeing one long flat list of actions."

**Then give the example (simple):**

> "For example, if I have a test that does login, adds a product to cart, and then checks out — instead of writing all that logic flat inside one test, I wrap each part in `test.step()` and give it a name, like `'Login'`, `'Add to cart'`, `'Checkout'`. The test still runs as one single test — I'm not splitting it into multiple tests — I'm just organizing the actions inside it."

```
test('user can complete checkout', async ({ page }) => {
  await test.step('Login', async () => {
    // login actions
  });

  await test.step('Add product to cart', async () => {
    // add to cart actions
  });

  await test.step('Checkout', async () => {
    // checkout actions
  });
});
```

**Then explain the report impact (this is the important part interviewers want):**

> "In the HTML report, instead of seeing one long list of raw actions, I now see three clean sections — Login, Add to cart, Checkout — each with its own pass or fail tick mark. So if checkout fails, I immediately know the problem is in the checkout step, without scrolling through everything else. It makes debugging faster, especially in long end-to-end tests."

**One line to close it (optional, shows maturity):**

> "It doesn't change whether the test passes or fails — it's purely for readability and faster debugging in reports and trace viewer."

---

## Realistic Example with Actual Playwright Actions

```
test('user can complete checkout', async ({ page }) => {

  await test.step('Login', async () => {
    await page.goto('https://example.com/login');
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'Test@123');
    await page.click('#login-btn');
    await expect(page).toHaveURL('https://example.com/dashboard');
  });

  await test.step('Add product to cart', async () => {
    await page.click('#product-1');
    await page.click('#add-to-cart-btn');
    await expect(page.locator('#cart-count')).toHaveText('1');
  });

  await test.step('Checkout', async () => {
    await page.click('#checkout-btn');
    await page.fill('#address', '123 Main St');
    await page.click('#place-order-btn');
    await expect(page.locator('#order-confirmation')).toBeVisible();
  });

});
```

**What to say in interview alongside this:**

> "Here, the test does three real things — logs in via `page.goto` and form fills, adds a product to cart, then checks out. Each of these is wrapped in `test.step()` with a clear name. It's still one single test — I haven't split it into three tests — I've just grouped the actions."

## Report Behavior

In the HTML report, this shows up as three collapsible sections:

- ✓ **Login**
- ✓ **Add product to cart**
- ✗ **Checkout** *(if this fails, only this section shows red)*

> "If checkout fails, I open the report and immediately see Login and Add to cart passed, only Checkout failed — I don't need to scroll through every single action to figure out where the break happened."

---

## What to say if asked "What is `testInfo`?"

**Definition:**

> "`testInfo` is an object Playwright automatically gives us inside tests, hooks, and fixtures. It carries information *about* the current test — like its title, status, retry count — and it also lets us attach extra data like screenshots, logs, or API responses directly into the report."

## Where we get `testInfo`

It's available as the **second parameter** wherever Playwright injects it:

```
// In a test
test('login test', async ({ page }, testInfo) => { ... });

// In a hook
test.beforeEach(async ({ page }, testInfo) => { ... });
test.afterEach(async ({ page }, testInfo) => { ... });

// In a fixture
const test = base.extend({
  myFixture: async ({}, use, testInfo) => { ... },
});
```

## What `testInfo` Can Do (in points)

**1. Give metadata about the current test**

```
console.log(testInfo.title);   // 'login test'
console.log(testInfo.retry);   // 0, 1, 2 — which attempt this is
console.log(testInfo.status);  // 'passed' / 'failed' / 'timedOut'
```

Use case: know if this run is a retry, or check final status in `afterEach`.

**2. Attach files/data to the report**

```
await testInfo.attach('api-response', {
  body: JSON.stringify(responseData),
  contentType: 'application/json',
});
```

Use case: you hit an API during the test, got JSON back — attach it so it's visible in the HTML report for debugging, without needing console logs.

**3. Attach screenshots on failure**

```
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot();
    await testInfo.attach('failure-screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });
  }
});
```

Use case: automatically capture and attach a screenshot only when a test fails — very common in real frameworks.

**4. Add custom/runtime annotations**

```
testInfo.annotations.push({ type: 'issue', description: 'JIRA-4521' });
```

Use case: link a failing test to a bug ticket dynamically, visible in report's annotation section.

**5. Access output/project info**

```
console.log(testInfo.project.name);   // e.g. 'chromium', 'BVT'
console.log(testInfo.outputDir);      // path to save custom files
```

Use case: save custom files (like a downloaded PDF) into the test's own output folder.

## Report Behavior

Everything attached via `testInfo.attach()` — screenshots, JSON responses, logs — shows up as a **downloadable/viewable item under that specific test** in the HTML report. Annotations pushed via `testInfo.annotations` show up in the report's annotation list next to the test name.

## One-liner to close in interview

> "`testInfo` gives me visibility and control over the current test at runtime — I mainly use it to attach failure screenshots and API response data to the report, and sometimes to check retry count for conditional debugging."
