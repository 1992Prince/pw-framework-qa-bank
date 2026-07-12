
# HTTP Protocol vs WebSocket Protocol

**Full Forms**

- HTTP = HyperText Transfer Protocol
- WebSocket = WebSocket Protocol

**Usage**

- HTTP → mostly used in REST APIs for request-response communication
- WebSocket → used for real-time, two-way communication (e.g. chatbots, live web apps)

**Communication Style**

- HTTP → one-way (single) communication; new connection created for every request, closed after response
- For next request, a fresh connection setup happens again
- WebSocket → bidirectional (two-way); both client and server can send messages anytime
- Connection established **once** and stays open for all requests/responses

**Overhead**

- HTTP → higher overhead (headers sent with every request)
- WebSocket → lower overhead (headers sent only once, during handshake)

**Selenium vs Playwright**

- Selenium → uses HTTP protocol (WebDriver W3C compliant) between client (code) and server (browser executable)
- Playwright → uses WebSocket protocol

**State**

- HTTP → stateless, so a new connection is required for every request
- WebSocket → stateful, so connection establishes only once

---

# Playwright Architecture

**3 Components**

1. Client
2. Playwright Server
3. Browser Binaries

**1. Client**

- Test code written in TypeScript/JavaScript (or other supported languages) using `@playwright/test`
- Client APIs = Playwright methods written in test scripts
  - Examples: `page.goto()`, `page.click()`, `page.fill()`, `expect()`
- These APIs do **not** directly control the browser — they send commands to the Playwright Server

**2. Playwright Server**

- Middle layer that receives commands from client and controls the browser binary

**3. Browser Binaries**

- Playwright's own **patched binaries**, downloaded via `npx playwright install`

**Execution Flow**

1. `npx playwright test` → Playwright Test Runner starts
2. Playwright Server starts
3. Playwright Server launches required browser binary (Chromium/Firefox/WebKit)
4. WebSocket connection created (established **once**, stays open for entire execution)
5. Client APIs create this WebSocket connection with the Playwright Server
6. Test commands travel: **Client → WebSocket → Playwright Server → Browser Binary**

**Why Playwright is Fast**

- Persistent WebSocket connection stays open for the whole test
- If script has 100 commands → all 100 travel over **1 persistent connection**
- No repeated TCP handshakes, no per-command HTTP overhead
- This makes Playwright significantly faster than Selenium

---

# Selenium Architecture — Internal Working

**3 Components**

```
Client (Test Code) → Browser Driver (.exe) → Real Browser
```

**1. Client**

- Test code written in any supported language (Java, Python, JavaScript, etc.)

**2. Browser Driver (.exe)**

- Separate executable acting as middleman between test code and real browser
- Each browser has its own driver:
  - `chromedriver.exe` → Chrome
  - `geckodriver.exe` → Firefox
  - `msedgedriver.exe` → Edge

**3. Real Browser**

- Actual branded browser installed on the machine (not a patched binary)

**Execution Flow**

- For **each command**, client creates a new connection with the driver/server
- Sends request over **HTTP protocol** → gets response → connection closed
- For next command, a fresh connection is created again

**Why Selenium is Slower**

- If script has 100 commands → **100 separate HTTP connections** created
- Every command = new connection setup + headers + teardown → higher overhead
