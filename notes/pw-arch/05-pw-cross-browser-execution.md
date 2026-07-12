
# Playwright — Cross Browser Execution Notes

## Sample Spec File

```javascript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
```

---

## 1. Cross Browser Execution (Non-Branded Browsers)

### Config Setup

- In `playwright.config.ts`, keep `workers` as `undefined`.
  - When `workers` is undefined, Playwright automatically uses **half of the available CPU cores** during execution.
- Define the `projects` array to include all three engines:

```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

### Run Command

```bash
npx playwright test
```

**Output:**

```
Running 3 tests using 3 workers
```

- All **3 browsers** (Chromium, Firefox, WebKit) are invoked.
- The **same test** runs across all of them in parallel.

> ⚠️ **Note:** These are **not branded browsers** (not real Chrome/Firefox/Safari installs). They are **Playwright's own browser binaries** bundled with the framework.

---

## 2. Restricting Execution to Branded Chrome / Edge Only

If you want the test to run **only** in a branded browser (real Chrome or Edge installed on the machine) and skip Firefox/WebKit entirely:

- Remove/disable the `firefox` and `webkit` projects.
- Keep only the `chromium` project, and add a `channel` property.

```javascript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    channel: 'chrome',   // use 'msedge' for branded Edge
  },
]
```

### Important Note

- Playwright **does not provide a `channel` option** for WebKit or Firefox.
- This means:
  - WebKit and Firefox execution can **only** happen via Playwright's own bundled binaries.
  - There is **no way** to run tests on the real/branded Safari or Firefox browser installed on the system.

---

## 3. Multi-Browser Setup Without Using Built-in Fixtures

If you're **not** using Playwright's inbuilt `page`/`context`/`browser` fixtures, and instead writing manual setup code, you control the browser type and channel explicitly via `chromium.launch()`, `webkit.launch()`, or `firefox.launch()`.

```javascript
test('multi browser setup without fixture', async () => {
  // Triggers Chrome binary "Chrome for Testing"
  let browser = await chromium.launch(); // returns Promise<Browser>

  // Triggers branded Chrome browser
  // let browser = await chromium.launch({ channel: 'chrome' });

  // Triggers branded Edge browser
  // let browser = await chromium.launch({ channel: 'msedge' });

  // Triggers WebKit browser binary
  // let browser = await webkit.launch();

  // Triggers Firefox Nightly build binary (NOT real/branded Firefox)
  // let browser = await firefox.launch();

  let context = await browser.newContext(); // returns Promise<BrowserContext>
  let page = await context.newPage();       // returns Promise<Page>

  await page.goto('https://playwright.dev/');
  await page.waitForTimeout(3000);
});
```

### Key Takeaways

| Browser Type | Default Launch                                     | Branded Option Available?                               |
| ------------ | -------------------------------------------------- | ------------------------------------------------------- |
| Chromium     | `chromium.launch()` → Chrome for Testing binary | ✅ Yes —`channel: 'chrome'` or `channel: 'msedge'` |
| WebKit       | `webkit.launch()` → Playwright's WebKit binary  | ❌ No branded/real Safari option                        |
| Firefox      | `firefox.launch()` → Firefox Nightly binary     | ❌ No branded/real Firefox option                       |

---

## Summary

- **Default (`workers: undefined`)** → Playwright auto-uses half of CPU cores for parallel execution.
- **All 3 projects in config** → runs the same test across Chromium, Firefox, and WebKit binaries (not branded browsers).
- **Only branded Chrome/Edge** → keep a single `chromium` project with `channel: 'chrome'` or `channel: 'msedge'`; no channel equivalent exists for Firefox/WebKit.
- **Manual (non-fixture) setup** → use `chromium.launch()`, `webkit.launch()`, or `firefox.launch()` directly, with `channel` option only supported for Chromium-based browsers.
