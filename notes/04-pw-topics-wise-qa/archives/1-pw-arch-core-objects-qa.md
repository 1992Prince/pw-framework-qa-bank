## 1. Architecture & Installation Questions

### Q5: What is `playwright.config.ts`, and what are its most important fields?

* **Definition:** "It’s the central configuration file for your entire Playwright test suite. It dictates how tests are discovered, executed, and reported."
* **Most Important Fields:**
* **`testDir`**: Specifies the folder where Playwright should look for test files.
* **`fullyParallel`**: A boolean that enables or disables running tests within a single file in parallel.
* **`use`**: Globally configures options for the browser context, like `baseURL`, `trace: 'on-first-retry'`, and `screenshot`.
* **`projects`**: An array that lets you split execution across different browsers, viewports, or environments.
* **`reporter`**: Defines output formats like HTML, JSON, or Dot matrix.

---

### Q6: What is the `@playwright/test` package, and how is it different from using Playwright as a standalone library?

* **`@playwright/test` (The Test Runner):** "This is the full-featured test framework. It includes an assertion library with auto-awaiting matchers (`expect`), handles configuration files, manages parallel execution, fixtures, and generates rich HTML test reports."
* **Standalone Library (`playwright`):** "This is just the core automation library without any testing features. You would use it if you are writing standard web scraping scripts or if you want to integrate Playwright into an entirely different testing framework like Mocha or Jest."

```typescript
// Standalone usage (Scraping/Automation)
import { chromium } from 'playwright';
const browser = await chromium.launch();
// ...
```

---

## 2. Core Objects — Browser, Context, Page

### Q7: Explain the Browser → BrowserContext → Page hierarchy — what does each level represent?

* **Browser:** "This represents a physical instance of a web browser (e.g., an active Chromium process). It's expensive to spin up, so you usually launch it once per test run."
* **BrowserContext:** "This is an isolated session inside the Browser, acting exactly like an incognito window. It has its own cookies, local storage, and cache, making context creation incredibly cheap and fast."
* **Page:** "This represents a single tab or a window within that BrowserContext. You use it to interact with the DOM and navigate to URLs."

---

### Q8: How do you handle multiple browser contexts in Playwright, and why is BrowserContext often compared to an incognito window?

* **Handling Contexts:** "You use the `browser.newContext()` method to instantiate a new session. You can create as many as you need within a single browser instance."
* **The Incognito Comparison:** "It's compared to an incognito window because every context is completely blind to the other. One context can be logged into an app as an 'Admin', and a second context can be logged in as a 'User' simultaneously without any session bleeding."

```typescript
const adminContext = await browser.newContext();
const userContext = await browser.newContext();

const adminPage = await adminContext.newPage();
const userPage = await userContext.newPage();
```

---

### Q9: What's the difference between `browser.newPage()` and `context.newPage()`?

* **`browser.newPage()`:** "This is a shortcut method. Under the hood, it creates a brand new `BrowserContext` first, and then opens a new `Page` inside it. It's fine for simple scripts, but gives you less control over context configuration."
* **`context.newPage()`:** "This creates a tab within a pre-existing, specific context. It ensures that the new page inherits the specific cookies, storage state, permissions, or geolocation settings already defined for that context."

---

### Q10: How do browser contexts improve test isolation and enable safe parallel execution?

* **Fresh Session per Test:** "By default, the Playwright test runner spins up a completely fresh BrowserContext for every single test. This means each test gets its own isolated, incognito-like environment from the very start."
* **No State Leakage:** "Because of this isolation, things like cookies, local storage, session tokens, or session histories never leak from one test to another. Even if a test fails or explicitly logs out, it has zero impact on any other test."
* **Safe Parallelism:** "Whether your tests are running sequentially or concurrently across multiple parallel worker processes, they remain entirely independent. They can share the same underlying browser binary safely without colliding, unless we explicitly change the default configuration."

```typescript
// Each test block automatically receives a fresh, isolated page instance
test('Test One - Independent Session', async ({ page }) => {
  await page.goto('/login');
  // Operations here cannot leak to Test Two
});

test('Test Two - Independent Session', async ({ page }) => {
  await page.goto('/dashboard'); 
});

```

---

### Q11: What Playwright core objects are you aware of?

* **Browser:** "This is the actual instance of the browser process—like Chromium, Firefox, or WebKit—launched by the Playwright driver."
* **BrowserContext:** "An isolated session inside the Browser instance. It manages its own cookies, storage, and permissions without overlapping with other contexts."
* **Page:** "This represents a single tab or window within a BrowserContext, used to navigate URLs and interact with the page contents."
* **Frame / FrameLocator:** "This represents the main page frame or an embedded iframe inside the webpage, allowing you to interact with elements inside nested contexts."
* **Locator:** "The core element pointer in Playwright. It encapsulates the strategy to find elements on the page and comes built-in with automatic waiting capabilities."
* **Request & Response:** "Objects that model network events, allowing you to monitor, intercept, and modify HTTP traffic happening during execution."

```typescript
// Visualizing the relationship between the core objects
import { chromium } from '@playwright/test';

const browser = await chromium.launch();          // 1. Browser
const context = await browser.newContext();       // 2. BrowserContext
const page = await context.newPage();             // 3. Page
const locator = page.locator('#submit-btn');     // 4. Locator

```

### Q12: What browser-level properties can we pass at `chromium.launch({...})`?

* **Purpose:** "These options configure the physical browser process being launched by the Playwright driver. They control how the binary behaves on your machine."
* **Key Properties:**
* **`headless`**: A boolean determining whether to run the browser with a visible UI (`false`) or in the background (`true`).
* **`channel`**: Specifies a production-grade browser distribution installed on your system, such as `'chrome'`, `'chrome-beta'`, or `'msedge'`.
* **`slowMo`**: Slows down Playwright operations by a specified number of milliseconds. This is incredibly useful for visually debugging what is happening on screen.
* **`timeout`**: The maximum time in milliseconds to wait for the browser instance to start up before throwing an error.
* **`proxy`**: Configures a global network proxy for all traffic routed through this browser instance.
* **`args`**: An array of additional command-line arguments passed directly to the browser binary instance (e.g., configuring flags).

```typescript
const browser = await chromium.launch({
  headless: false,
  channel: 'chrome',
  slowMo: 500,
  args: ['--start-maximized'],
});

```

---

### Q13: What browserContext-level properties can we pass at `browser.newContext({...})`?

* **Purpose:** "This configures the specific session environment. You can pass almost any configuration property here that you would normally define inside the global `use` block of a `playwright.config.ts` file."
* **Key Properties:**
* **`viewport`**: Sets the default window dimensions for pages created within this specific context.
* **`storageState`**: Populates the session with saved cookies and local storage tokens, bypassing manual login flows.
* **`locale` and `timezoneId**`: Emulates user localization settings, which is essential for testing time-sensitive or region-locked applications.
* **`isMobile` and `hasTouch**`: Emulates a mobile device environment, altering how the browser scales content and handles touch interactions.
* **`extraHTTPHeaders`**: Injects an object of standard HTTP headers into every network request initiated by pages in this context.
* **`ignoreHTTPSErrors`**: Prevents tests from failing when hitting environments with self-signed or invalid SSL certificates.

```typescript
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  locale: 'en-US',
  timezoneId: 'America/New_York',
  storageState: 'auth/admin.json',
  ignoreHTTPSErrors: true,
  colorScheme: 'dark',
});

```

---

### Q14: Does `newPage({...})` also have options at the page level?

* **No Options for New Page:** "No, the `context.newPage()` method does not accept any configuration options parameter."
* **The Reason:** "This is by design because a `Page` is just a single tab or window. It strictly inherits all of its environmental settings—like viewports, permissions, cookies, geolocation, and storage state—directly from its parent `BrowserContext`."
* **How to Override:** "If you need a page with completely different behavior or permissions, you don't configure it at the page level. Instead, you create a brand-new `BrowserContext` with those specific settings, and then spin up the page inside it."

```typescript
// The method signature accepts zero parameters for configuration
const page = await context.newPage(); 

```
