# Q- What is Playwright?

**Ans-**

Playwright is an **open-source end-to-end (E2E) test automation framework developed by Microsoft**. It is used to automate modern web applications across multiple browsers like **Chromium, Firefox, and WebKit** using a single API.

It supports multiple programming languages such as **TypeScript, JavaScript, Java, Python, and .NET**. Playwright also provides built-in features like **auto-waits, API testing, parallel execution, screenshots, videos, trace viewer, and debugging tools**, making it a complete automation solution.

---

# Q- Why Playwright when we already have Selenium?

**Ans-**

Selenium is still a very popular automation tool, but Playwright provides several modern features that Selenium either lacks or requires additional libraries for.

Some key advantages of Playwright are:

- It supports **cross-browser testing** using Chromium, Firefox, and WebKit with a single API.
- It has **built-in API testing**, so we can perform UI and API testing in the same framework.
- It communicates using the **WebSocket protocol**, whereas Selenium uses the HTTP protocol.
- It provides **inbuilt auto-waiting and auto-retry mechanisms**, reducing flaky tests.
- It comes with a powerful **test runner** that supports:
  - Parallel execution
  - Web-first assertions
  - Screenshots
  - Video recording
  - Trace recording
- It has excellent debugging tools like:
  - Codegen
  - UI Mode
  - Inspector
  - Trace Viewer
- It also offers integrations with modern AI-powered development tools.

Because of these features, Playwright is generally faster, more reliable, and requires less custom code than Selenium.

---

# Q- WebSocket Protocol vs HTTP Protocol

**Ans-**

HTTP stands for **HyperText Transfer Protocol**, while WebSocket is a protocol designed for **real-time, bidirectional communication**.

The biggest difference is in how they communicate.

With **HTTP**, communication is request-response based. The client sends a request, the server sends a response, and the connection is closed. If another request is needed, a completely new connection is established.

With **WebSocket**, the connection is established only once and remains open throughout the session. After that, both the client and server can send messages to each other at any time.

Because HTTP creates a new connection for every request, it has more overhead due to repeated handshakes and headers. WebSocket has much lower overhead because the handshake happens only once.

This is also one of the architectural differences between Selenium and Playwright.

- Selenium communicates using the **HTTP protocol** through the WebDriver.
- Playwright communicates using the **WebSocket protocol** with the Playwright Server.

Since WebSocket maintains a persistent connection, Playwright executes commands much faster than Selenium.

---

# Q- Explain Playwright Architecture and how it is different from Selenium Architecture.

**Ans-**

Playwright architecture mainly consists of **three components**:

1. Client
2. Playwright Server
3. Browser Binaries

The **client** is our test code written using Playwright APIs like `page.goto()`, `page.click()`, and `page.fill()`.

These APIs do not communicate directly with the browser. Instead, they send commands to the **Playwright Server**, which acts as the middle layer.

The Playwright Server then controls Playwright's own browser binaries such as Chromium, Firefox, and WebKit.

When we execute:

```bash
npx playwright test
```

the execution flow is:

- Playwright Test Runner starts.
- Playwright Server starts.
- Required browser binary is launched.
- A WebSocket connection is established once.
- All commands travel through this single connection.

The flow is:

```
Client
      ↓
WebSocket
      ↓
Playwright Server
      ↓
Browser Binary
```

Because the same WebSocket connection is reused throughout the execution, Playwright avoids repeated connection overhead, making execution very fast.

### Selenium Architecture

Selenium architecture has three components:

- Client
- Browser Driver
- Real Browser

The flow is:

```
Client
     ↓
Browser Driver
     ↓
Real Browser
```

Each browser requires its own driver, such as:

- chromedriver.exe
- geckodriver.exe
- msedgedriver.exe

Whenever Selenium executes a command, it sends an HTTP request to the browser driver.

For every command:

- A new HTTP connection is established.
- Request is sent.
- Response is received.
- Connection is closed.

If a script contains 100 commands, Selenium creates approximately 100 HTTP requests.

In contrast, Playwright establishes only one persistent WebSocket connection and sends all commands through it.

This is one of the major reasons why Playwright is generally faster than Selenium.

---

# Q- How do you create a fresh Playwright project using CLI? What questions are asked during setup? Explain the folder structure.

**Ans-**

To create a new Playwright project, I run:

```bash
npm init playwright@latest
```

During installation, Playwright asks a few questions such as:

- Which language do you want to use? (TypeScript or JavaScript)
- Where should the tests be stored?
- Do you want to add a GitHub Actions workflow?
- Do you want to install Playwright browsers now?

After answering these questions, Playwright automatically creates the project structure.

Important folders and files are:

- **tests/** → Contains all test files.
- **playwright.config.ts** → Main configuration file for browsers, reporters, retries, workers, etc.
- **package.json** → Project metadata and dependencies.
- **package-lock.json** → Exact dependency versions.
- **node_modules/** → Installed packages.
- **playwright-report/** → HTML execution reports.
- **test-results/** → Screenshots, videos, traces, and failure artifacts.

This default structure helps us start automation quickly without manual setup.

---

# Q- Explain the purpose of package.json and how it is different from package-lock.json.

**Ans-**

The `package.json` file is the main configuration file of a Node.js project.

It contains information such as:

- Project name
- Version
- Description
- Scripts
- Dependencies
- Dev dependencies
- License
- Author

It tells npm which packages are required for the project.

The `package-lock.json` file is automatically generated by npm.

It stores the exact versions of every installed package, including transitive dependencies.

Its main purpose is to ensure that every developer and CI/CD pipeline installs the exact same dependency versions, resulting in consistent builds.

In simple words:

- `package.json` tells **what packages are required**.
- `package-lock.json` records **the exact versions that were installed**.

---

# Q- Why are Playwright tests generally faster than Selenium tests?

**Ans-**

Playwright tests are generally faster because of their architecture.

Playwright communicates with the browser using a **persistent WebSocket connection**.

The connection is established only once when the test starts and remains open throughout execution.

So if a test has 100 commands, all 100 commands travel through the same connection.

There is no repeated connection setup or teardown.

Selenium, on the other hand, communicates using the **HTTP protocol**.

For every WebDriver command, Selenium creates a new HTTP request, sends it to the browser driver, receives the response, and closes the connection.

If a script has 100 commands, Selenium creates around 100 HTTP requests.

This repeated connection setup adds extra overhead and increases execution time.

In addition, Playwright has built-in features like auto-waiting and optimized browser communication, which further improve execution speed and reduce flaky tests.

Because of these architectural differences, Playwright is generally faster and more efficient than Selenium.


# Q- How can you invoke Playwright browser binaries or branded browsers without using Playwright fixtures? Write the code.

**Ans-**

If we are **not using Playwright's built-in fixtures** like `page`, `context`, or `browser`, then we have to manually launch the browser, create a browser context, and create a page.

Playwright allows us to launch either its own browser binaries or installed branded browsers.

```ts
import { test, chromium, firefox, webkit } from '@playwright/test';

test('multi browser setup without fixture', async () => {

  // Launches Playwright Chromium binary (Chrome for Testing)
  let browser = await chromium.launch();

  // Launches installed Google Chrome
  // let browser = await chromium.launch({ channel: 'chrome' });

  // Launches installed Microsoft Edge
  // let browser = await chromium.launch({ channel: 'msedge' });

  // Launches Playwright WebKit browser binary
  // let browser = await webkit.launch();

  // Launches Playwright Firefox Nightly binary (not installed Firefox)
  // let browser = await firefox.launch();

  let context = await browser.newContext();

  let page = await context.newPage();

  await page.goto('https://playwright.dev/');

  await page.waitForTimeout(3000);

  await browser.close();
});
```

### Interview Explanation

- `chromium.launch()` launches the **Playwright Chromium binary** (Chrome for Testing).
- `chromium.launch({ channel: 'chrome' })` launches the **installed Google Chrome**.
- `chromium.launch({ channel: 'msedge' })` launches the **installed Microsoft Edge**.
- `firefox.launch()` launches the **Playwright Firefox Nightly binary**, not the installed Firefox browser.
- `webkit.launch()` launches the **Playwright WebKit browser binary**.

After launching the browser, we manually create a **BrowserContext** and then a **Page** before performing any browser actions.

---

# Q- If the `projects` array is empty, will you be able to run any Playwright test?

**Ans-**

No.

To execute any Playwright test using the Playwright Test Runner, there must be **at least one browser project** defined in the `projects` array.

The `projects` array tells Playwright **which browser(s) to execute the tests on**. If it is empty, Playwright has no browser target for execution, so the tests will not run.

Example of an empty configuration:

```ts
projects: []
```

This configuration will not execute any tests.

A minimum valid configuration is:

```ts
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
];
```

With at least one project defined, Playwright knows which browser to launch and can execute the test suite successfully.
