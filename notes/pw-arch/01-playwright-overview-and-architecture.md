# Playwright — Complete Notes

---

## 📑 Table of Contents

1. [What is Playwright?](#1-what-is-playwright)
2. [Key Characteristics of Playwright](#2-key-characteristics-of-playwright)
3. [Key Features of Playwright](#3-key-features-of-playwright)
4. [Playwright vs Selenium — Why Playwright is Faster](#4-playwright-vs-selenium--why-playwright-is-faster)
5. [Selenium Architecture — Internal Working](#5-selenium-architecture--internal-working)
6. [Playwright Architecture — Internal Working](#6-playwright-architecture--internal-working)
7. [HTTP vs WebSocket — Speed Difference in Detail](#7-http-vs-websocket--speed-difference-in-detail)
8. [Selenium vs Playwright — Key Differences Summary](#8-selenium-vs-playwright--key-differences-summary)
9. [Interview Questions &amp; Answers](#9-interview-questions--answers)

---

## 1. What is Playwright?

Playwright is an **open-source test automation framework developed by Microsoft**. It enables reliable **end-to-end (E2E) testing** for modern web applications.

It is used to automate end-to-end web application interactions — meaning it can simulate real user actions like:

- Clicking
- Typing
- Navigating
- Form submission
- Scrolling, hovering, drag-and-drop, etc.

---

## 2. Key Characteristics of Playwright

- Open source and **free to use**
- **Developed and maintained by Microsoft**
- Works across all major browsers
- Supports **multiple programming languages**
- Uses **WebSocket protocol** internally for fast, persistent communication

---

## 3. Key Features of Playwright

- **Cross-Browser Support** — Playwright supports all major browsers: **Firefox, Edge, Chromium (Chrome), and Safari (WebKit)**. You write one test and it runs on all of them.
- **API Testing** — Playwright supports not just UI testing but also **API testing** — you can make HTTP requests and assert responses directly within Playwright tests.
- **Mobile Emulation (Not Native Mobile)** — Playwright does **not** support native mobile app automation (like Appium does). However, if your app runs in a mobile browser, you can set **device emulation** in config (e.g., iPhone 13, Pixel 5) and Playwright will simulate that device's:

  - Screen size
  - User agent
  - Viewport
- **WebSocket Protocol** — Playwright uses WebSocket protocol internally to communicate with the browser. This means:

  - Connection is created **once** at the start
  - Same connection is kept alive for the **entire test execution**
  - Connection is **persistent and bidirectional** (browser can also send messages back)
  - Much faster than HTTP which opens a new connection for every request
- **Multi-Language Support** — Playwright supports:

  - JavaScript
  - TypeScript
  - Java
  - Python
  - C# / .NET
- **Inbuilt Auto-Waits and Auto-Retry Mechanisms** — No need to write manual waits for most actions.
- **Rich Test Runner Features** — Playwright test runner (`@playwright/test`) provides:

  - Web-first assertions
  - Screenshots
  - Videos
  - Trace recording
  - Parallel execution
- **Developer Tooling** — Playwright provides:

  - **Codegen** — record user actions and auto-generate test code
  - **UI Mode** — interactive test runner UI
  - **Inspector** — debug tests step by step
  - **Trace Viewer** — analyze test runs with full timeline

---

## 4. Playwright vs Selenium — Why Playwright is Faster

### Selenium uses HTTP protocol (WebDriver protocol)

- Every command (click, type, find element) sends a **new HTTP request** to the browser
- Browser processes it and sends back an HTTP response
- This creates **overhead** — new TCP connection setup every time
- Slower, especially for complex test flows
- For **10 Selenium client commands → 10 separate HTTP requests** go to the server

### Playwright uses WebSocket protocol

- Creates **one persistent connection** at the start of the test
- All commands flow through this **single open channel**
- No overhead of creating new connections
- Much faster execution
- For **10 Playwright commands → only 1 connection** is made

> ⚠️ **Important Note:** Playwright makes **test execution** faster compared to Selenium. But Playwright does **not** improve application performance. If the application itself is slow, Playwright tests will also take time.

### Additional Playwright Advantages

- **Auto-wait built in** — automatically waits for elements to be ready before acting on them (no need to add explicit waits everywhere)
- **Isolated browser contexts** — each test gets a fresh browser context
- **Parallel execution** is built in by default
- Faster than Selenium as there is **no new connection overhead per command**

---

## 5. Selenium Architecture — Internal Working

### Components — 3 Components

```
Client (Test Code)  →  Browser Driver (.exe)  →  Real Browser
```

- **Client** — test code written in any supported language like Java, Python, or JavaScript.
- **Browser Driver (.exe)** — a separate executable that acts as a middleman between test code and the real browser. Each browser has its own driver:

  - `chromedriver.exe` → Chrome
  - `geckodriver.exe` → Firefox
  - `msedgedriver.exe` → Edge

  In older Selenium versions these had to be downloaded manually, but latest Selenium versions handle this automatically.
- **Real Browser** — the actual browser installed on your OS that gets driven by the driver.

### Communication — HTTP (W3C WebDriver Protocol / JSON Wire Protocol)

- Selenium converts every automation command into an **HTTP request** (W3C compliant) and sends it to the browser driver `.exe`, which then forwards it to the real browser and returns the response back.
- For **every single command** — `click()`, `get()`, `sendKeys()`, etc. — a **new HTTP connection is created**, used, and then closed.
- So if your script has **100 commands**, Selenium will create **100 separate HTTP connections** — each with its own TCP handshake and HTTP overhead.
- This repeated open/close cycle for every command is what makes **Selenium execution slow** compared to modern frameworks.

---

## 6. Playwright Architecture — Internal Working

### Components — 2 Components Only

```
[Test Code / Client]  →  [Browser Binaries (Playwright managed)]
```

- **Client** — test code written in TypeScript/JavaScript (or other supported languages) using `@playwright/test`.
- **Browser Binaries** — Playwright's own **patched browser binaries** downloaded via `npx playwright install`. **No separate driver `.exe` needed — no middleman.**

### Communication — WebSocket + CDP

```
Test Code
    ↓
WebSocket Connection (established once — open throughout execution)
    ↓
CDP — Chrome DevTools Protocol (injected into patched browser binaries)
    ↓
Browser Binaries
```

- Playwright first establishes a **persistent WebSocket connection** with the Playwright server — this connection stays open for the **entire test execution**.
- Test client code then sends commands over this WebSocket connection directly to the **CDP (Chrome DevTools Protocol)** of the browser binaries.
- This CDP is **not native** to all browsers — it is **injected by Playwright during the patching process** when it builds its own custom browser binaries.
- Unlike Selenium, the connection is established **once** and all commands — `click()`, `goto()`, `fill()`, etc. — are sent over the **same single connection**.
- So if your script has **100 commands**, all 100 travel over **1 persistent connection** — no repeated TCP handshakes, no HTTP overhead per command. This is what makes Playwright **significantly faster than Selenium**.

### WebSocket Benefit — Single Connection for All Commands

```
Connection is established once
    ↓
Command 1 → same open connection
Command 2 → same open connection
Command 3 → same open connection
...
50 commands = 1 connection = all 50 commands travel through the same channel
```

### Bidirectional Communication Advantage

WebSocket works **two-way** — Playwright sends commands to the browser, and the browser also **pushes events back** to Playwright without being asked:

- Network response received → browser notifies Playwright
- Console error occurred → real-time notification
- Dialog appeared → immediate event

In contrast, **Selenium required polling** — the client had to repeatedly ask "did anything happen?" for every event. In Playwright, the browser notifies on its own.

---

## 7. HTTP vs WebSocket — Speed Difference in Detail

| Aspect                    | HTTP                                     | WebSocket                           |
| ------------------------- | ---------------------------------------- | ----------------------------------- |
| **Connection Type** | Request-response, closes after each call | Persistent, stays open              |
| **Direction**       | Unidirectional (client initiates)        | Bidirectional (both sides can send) |
| **State**           | Stateless                                | Stateful                            |
| **Overhead**        | New TCP handshake per request            | Handshake happens once              |
| **Used By**         | Selenium (W3C WebDriver Protocol)        | Playwright                          |
| **100 Commands**    | 100 connections = slow                   | 1 connection = fast                 |

### Key Points

- **HTTP** is a **request-response protocol** — client sends a request, server responds, and connection closes. For the next command, a new connection has to be made again. It is **unidirectional** and **stateless**.
- **WebSocket** is a **persistent, bidirectional protocol** — connection is established once via an HTTP handshake and then upgrades to WebSocket. After that both client and server can send messages to each other freely over the same open connection without re-connecting.
- **Key difference** — in HTTP the client **always has to initiate** every communication. In WebSocket, **both sides can send data anytime** without waiting for the other to ask.
- **Selenium uses HTTP** (W3C WebDriver Protocol) — every command creates a new connection, sends request, gets response, and closes. **100 commands = 100 connections = slow.**
- **Playwright uses WebSocket Protocol** — connection is established once and stays persistent throughout execution. **100 commands = 1 connection = fast.**
- Selenium is **stateless** — no memory of previous connection, every command starts fresh.
- Playwright is **bidirectional** — browser can push real-time events back to the client automatically. In Selenium this was not possible; polling was required.

---

## 8. Selenium vs Playwright — Key Differences Summary

| Aspect                             | Selenium                                                                                                                    | Playwright                                                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Protocol**                 | HTTP (W3C WebDriver) — new connection per command                                                                          | WebSocket — one persistent connection                                                                                                         |
| **Browser Executables**      | Requires separate browser driver`.exe` files (latest versions handle auto-download)                                       | No`.exe` needed — downloads its own patched browser engines via `npx playwright install`                                                  |
| **Safari on Windows**        | Cannot run Safari tests on Windows                                                                                          | Cross-platform Safari testing via patched WebKit engine (runs on Windows and Linux too)                                                        |
| **Browser Version Mismatch** | Common issue between browser and driver versions                                                                            | Never happens — browser binaries are always bundled and matched with the Playwright version                                                   |
| **Test Runner**              | No built-in test runner — needs TestNG / JUnit etc.                                                                        | Built-in test runner`@playwright/test` with parallel execution, retries, reporters out of the box                                            |
| **Cross Browser Execution**  | Requires custom logic                                                                                                       | Simply configured in`playwright.config.ts` under the `projects` block                                                                      |
| **StaleElementException**    | `driver.findElement()` locates element immediately and holds reference → throws `StaleElementException` on DOM changes | `page.locator()` uses **lazy initialization** — element is located fresh at the time of each action. Stale element issue never occurs |
| **Rerunning Failed Tests**   | Requires complex TestNG listeners and custom logic                                                                          | Simply configured in`playwright.config.ts` with the `retries` property                                                                     |
| **Video and Trace**          | Recording video requires third-party setup; trace not available                                                             | Both built-in and configurable directly in`playwright.config.ts`                                                                             |
| **Waiting Strategy**         | Explicit or implicit waits had to be written manually for every interaction                                                 | Built-in**auto-waiting and auto-retry** on most action methods and web-first assertions                                                  |

---

## 9. Interview Questions & Answers

### Q1. What is Playwright and what are its features?

**Answer:**
Playwright is an **open-source end-to-end test automation framework developed by Microsoft** that is used to automate modern web applications across all major browsers. It simulates real user interactions like clicking, typing, form submission, and navigation.

**Key features:**

- **Cross-browser support** — Chromium (Chrome), Firefox, Edge, and Safari (WebKit)
- **Multi-language support** — JavaScript, TypeScript, Java, Python, C# / .NET
- **API testing** support along with UI testing
- **Mobile emulation** (not native mobile automation) — supports device profiles like iPhone 13, Pixel 5
- **WebSocket + CDP** based communication — persistent and bidirectional
- **Built-in auto-wait and auto-retry** mechanisms
- **Built-in test runner** (`@playwright/test`) with parallel execution, web-first assertions, retries, and reporters
- **Screenshots, videos, and trace recording** built-in
- **Developer tooling** — Codegen, UI Mode, Inspector, and Trace Viewer

---

### Q2. Why do we need Playwright when we already have Selenium?

**Answer:**
Although Selenium has been the industry standard for years, Playwright was designed to solve many of Selenium's long-standing limitations:

1. **Faster execution** — Playwright uses a single persistent WebSocket connection instead of Selenium's per-command HTTP connections.
2. **No driver executables** — Playwright ships with its own patched browser binaries, eliminating driver/browser version mismatches that are common in Selenium.
3. **No StaleElementException** — Playwright's `page.locator()` uses lazy initialization, so DOM changes never cause stale element issues.
4. **Built-in auto-wait** — No need to write explicit/implicit waits for every interaction.
5. **Built-in test runner** — Parallel execution, retries, reporters, video, and trace recording work out of the box; Selenium needs external tools (TestNG, JUnit, third-party video libraries).
6. **Cross-platform Safari testing** — Playwright's patched WebKit runs on Windows and Linux too, while Selenium's Safari driver works only on macOS.
7. **Bidirectional communication** — Playwright receives browser events (network, console, dialog) in real time without polling.
8. **Isolated browser contexts** — Each test runs in a fresh context by default, improving test reliability.

So Playwright is not a replacement for Selenium in every scenario, but it solves modern testing pain points that Selenium was not originally designed for.

---

### Q3. What is WebSocket Protocol and how is it different from HTTP protocol?

**Answer:**

**WebSocket** is a **persistent, bidirectional communication protocol** that allows both client and server to send messages to each other over a single open connection after an initial HTTP handshake that upgrades the connection to WebSocket.

**Differences between HTTP and WebSocket:**

| Feature                               | HTTP                                       | WebSocket                                                     |
| ------------------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| **Connection**                  | Opens, serves one request, closes          | Opens once, stays persistent                                  |
| **Direction**                   | Unidirectional — only client can initiate | Bidirectional — both client and server can send data anytime |
| **State**                       | Stateless                                  | Stateful                                                      |
| **Overhead**                    | New TCP handshake per request              | Handshake only once                                           |
| **Real-time events**            | Requires polling                           | Server can push events instantly                              |
| **Speed for multiple requests** | Slow (100 commands = 100 connections)      | Fast (100 commands = 1 connection)                            |

**In the context of Playwright vs Selenium:**

- Selenium uses HTTP → each command opens and closes a connection → slower.
- Playwright uses WebSocket → one connection for all commands + real-time event push → faster.

---

### Q4. Explain Selenium vs Playwright architectural differences.

**Answer:**

**Selenium Architecture — 3 components:**

```
Client (Test Code)  →  Browser Driver (.exe)  →  Real Browser
```

- Client sends commands as **HTTP requests** (W3C WebDriver protocol).
- Browser driver `.exe` (chromedriver, geckodriver, msedgedriver) acts as a **middleman**.
- Driver forwards the request to the **real browser** installed on the OS.
- **Every command creates a new HTTP connection** → high overhead.

**Playwright Architecture — 2 components:**

```
Client (Test Code)  →  Browser Binaries (Playwright managed)
```

- Client uses `@playwright/test` (or other language bindings).
- Playwright uses its **own patched browser binaries** downloaded via `npx playwright install` — **no external driver `.exe` required**.
- Client communicates with the browser using a **persistent WebSocket connection** + **CDP (Chrome DevTools Protocol)** that Playwright injects into the patched binaries.
- **One connection for the entire test execution** → low overhead, faster execution.
- Communication is **bidirectional** — browser can push events (network, console, dialog) back to the client in real time.

**Key architectural differences:**

- Selenium = **3 layers** with a driver middleman; Playwright = **2 layers**, no middleman.
- Selenium = **HTTP per command**; Playwright = **single persistent WebSocket**.
- Selenium = **external browser installation required**; Playwright = **bundled patched binaries**.
- Selenium = **polling-based**; Playwright = **event-push based**.

---

### Q5. Why are Playwright tests faster than Selenium?

**Answer:**

Playwright tests execute faster than Selenium because of several architectural reasons:

1. **WebSocket vs HTTP** — Playwright uses a **single persistent WebSocket connection** for the entire test run, whereas Selenium creates a **new HTTP connection for every command**. For 100 commands, Selenium makes 100 TCP handshakes, Playwright makes only 1.
2. **No middleman driver** — Playwright communicates directly with its patched browser binaries via CDP. Selenium has to go through a separate driver `.exe` which adds extra hops.
3. **Bidirectional communication** — The browser pushes events to Playwright in real time. Selenium has to keep polling the browser, which wastes time.
4. **Built-in auto-wait** — Playwright automatically waits for elements to be ready, preventing unnecessary wait time or retries. In Selenium, explicit/implicit waits add delay when not tuned correctly.
5. **Parallel execution by default** — Playwright runs tests in parallel in isolated browser contexts out of the box, while Selenium needs extra configuration (Grid, TestNG XML, etc.).

> ⚠️ **Important:** Playwright only makes **test execution** faster. It does **not** make the application under test faster. If the app itself is slow, Playwright tests will also be slow.

---

### Q6. What prerequisites do we need for Playwright installation?

**Answer:**

To install and run Playwright (JavaScript/TypeScript version), the following prerequisites are required:

1. **Node.js** — Playwright requires Node.js (latest LTS version recommended, e.g., Node.js 18+ or 20+). Download from [https://nodejs.org](https://nodejs.org).
2. **npm** (comes bundled with Node.js) — used to install Playwright packages.
3. **Code Editor / IDE** — Visual Studio Code is recommended. It also has an official **Playwright Test for VS Code** extension that provides UI for running, debugging, and recording tests.
4. **Operating System** — Windows, macOS, or Linux (all supported).
5. **Internet connection** — required during first install to download browser binaries (`npx playwright install`).
6. **Optional (but recommended):**

   - **Git** — for version control
   - **TypeScript knowledge** — since Playwright tests are commonly written in TypeScript

**Installation commands:**

```bash
# Initialize a new project
npm init -y

# Install Playwright with test runner
npm init playwright@latest

# Or install manually
npm install -D @playwright/test

# Install browser binaries (Chromium, Firefox, WebKit)
npx playwright install
```

For other languages:

- **Python** — requires Python 3.8+ and install via `pip install playwright` followed by `playwright install`.
- **Java** — requires Java 8+ and Maven/Gradle, with the Playwright Java dependency added.
- **.NET** — requires .NET 6+ and install via `dotnet add package Microsoft.Playwright`.

---

### Q7. What do you understand by Head Mode and Headless Mode? What is Playwright's default mode?

**Answer:**

**Head Mode (Headed Mode / Headful Mode):**

- The browser UI **is visible** on the screen while the test is executing.
- You can actually see the browser open, pages navigate, clicks happen, form filling, etc.
- Useful for **debugging**, **demonstration**, or **visual verification** of test behavior.
- Slightly **slower** because the browser has to render UI pixels on the screen.

**Headless Mode:**

- The browser runs **in the background without a visible UI**.
- No browser window is shown on the screen; everything happens internally.
- **Faster** because the browser skips UI rendering.
- Ideal for **CI/CD pipelines**, **server environments**, and **large-scale test execution** where visual feedback is not needed.

**Playwright's Default Mode:**

By default, **Playwright runs in Headless Mode** — the browser is not visible during test execution. This is chosen because headless mode is faster and better suited for automated CI/CD runs.

**How to switch modes:**

Via `playwright.config.ts`:

```typescript
use: {
  headless: false,  // runs in head mode (UI visible)
  // headless: true, // default — runs in headless mode
}
```

Via command line:

```bash
npx playwright test --headed       # run in head mode
npx playwright test                 # default → headless mode
```

Programmatically:

```typescript
const browser = await chromium.launch({ headless: false });
```

---

## ✅ Quick Revision Checklist

- [X] Playwright = Microsoft's open-source E2E test automation framework
- [X] Supports Chromium, Firefox, Edge, Safari (WebKit)
- [X] Supports JS, TS, Java, Python, C# / .NET
- [X] Uses **WebSocket + CDP** (not HTTP)
- [X] **One connection** for all commands → faster than Selenium
- [X] **2 components** (Client + Browser Binaries); Selenium has **3 components** (Client + Driver + Browser)
- [X] Built-in auto-wait, parallel execution, retries, screenshots, videos, trace viewer
- [X] No StaleElementException due to lazy locator initialization
- [X] Default mode = **Headless**
- [X] Install via `npm init playwright@latest` + `npx playwright install`

---

*End of Notes*
