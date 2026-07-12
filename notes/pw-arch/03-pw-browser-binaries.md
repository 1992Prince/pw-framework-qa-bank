
# Playwright Browser Binaries

## `npx playwright install`

Downloads the Playwright-managed browser binaries:

- Chromium
- Firefox
- WebKit

### Download Locations

**Windows**

```text
C:\Users\<username>\AppData\Local\ms-playwright
```

**macOS**

```text
~/Library/Caches/ms-playwright
```

**Linux**

```text
~/.cache/ms-playwright
```

---

# 1. What is a Browser Binary? 🖥️

A **browser binary** is the actual executable browser file that Playwright launches.

Examples:

- `chrome.exe`
- `chromium.exe`
- `firefox.exe`
- `msedge.exe`

**Simple definition**

> Browser Binary = Executable browser file.

When Playwright launches a browser, it launches this executable.

---

# 2. What is a Patched Browser?

Playwright does **not** use the browser source code directly.

For every Playwright version, Microsoft:

- Takes the open-source browser project.
- Adds Playwright automation patches (debugging hooks, automation APIs, reliability improvements, etc.).
- Compiles it into an executable.
- Ships it as a Playwright browser binary.

That's why they are called **patched browsers**.

**Simple definition**

> Patched Browser = Modified browser binary created for Playwright automation.

---

# 3. What are Browser Engines?

A **browser engine** is the core software inside a browser.

It is responsible for:

- Parsing HTML
- Parsing CSS
- Executing JavaScript
- Rendering the web page

Examples:

- **Blink** → Chromium
- **Gecko** → Firefox
- **WebKit** → Safari

Think of it like this:

```
Browser = Car 🚗
Engine = Car Engine ⚙️
```

The browser engine is the "brain" that renders web pages.

---

# 4. What is Chromium?

Chromium is an **open-source browser project**.

Google takes Chromium and adds:

- Google branding
- Google Sync
- Auto updates
- Proprietary media codecs
- Other Google-specific features

to create **Google Chrome**.

Similarly,

- Microsoft builds **Edge**
- Opera builds **Opera**
- Brave builds **Brave**

All of them are built on Chromium.

---

# 5. Chromium vs Chrome

| Chromium                    | Google Chrome            |
| --------------------------- | ------------------------ |
| Open-source browser project | Google's branded browser |
| Base project                | Built on Chromium        |
| No Google branding          | Google branding          |
| Used by Playwright          | Installed by users       |

Similarly,

- Edge is built on Chromium.
- Brave is built on Chromium.
- Opera is built on Chromium.

---

# Chromium Used by Playwright

Playwright's default Chromium is **Chrome for Testing**.

It is:

- Chromium-based
- Patched by Playwright
- Designed for automation
- Not your installed Google Chrome

If you write:

```javascript
browserType.launch();
```

Playwright launches:

```
Chrome for Testing
```

If you write:

```javascript
channel: "chrome"
```

Playwright launches:

```
Installed Google Chrome
```

Similarly,

```javascript
channel: "msedge"
```

launches the installed Microsoft Edge.

---

# Firefox: Nightly vs Real Firefox

Playwright does **not** use the regular Firefox that users install.

It uses a **patched build based on Firefox Nightly**.

### Firefox Nightly

- Mozilla's daily development build
- Contains the newest features
- Used as the base for Playwright's Firefox

Playwright adds its own automation patches to this build.

So execution happens inside:

```
Patched Firefox Nightly
```

not inside your installed Firefox.

### Can Playwright run the installed Firefox?

❌ No (there is no supported `channel: "firefox"` option like Chrome).

Playwright officially uses only its own patched Firefox build.

---

# WebKit vs Safari

### WebKit

- Open-source browser engine.
- Used by Safari.

### Safari

- Apple's branded browser.
- Built on WebKit.
- Includes Apple-specific features.
- Available only on macOS and iOS.

Playwright downloads its own patched WebKit build.

Execution happens inside:

```
Patched WebKit
```

not inside Safari.

### Can Playwright run Safari directly?

❌ No.

There is no `channel: "safari"` option.

Playwright automates only its patched WebKit build, which closely matches Safari behavior.

---

# Overall Flow

```
npx playwright install
        │
        ▼
Downloads Browser Binaries
        │
        ├── Chromium (Chrome for Testing)
        ├── Firefox (Patched Nightly)
        └── WebKit (Patched WebKit)
        │
        ▼
Stored in ms-playwright folder
        │
        ▼
Playwright Server launches these executables when automation triggers
        │
        ▼
Browser Engine (Blink / Gecko / WebKit)
        │
        ▼
Parses HTML
Parses CSS
Executes JavaScript
Renders the page
```

---

# Which Browser Actually Runs?

| Browser Type                               | Actual Executable Used                |
| ------------------------------------------ | ------------------------------------- |
| `chromium.launch()`                      | Chrome for Testing (patched Chromium) |
| `chromium.launch({ channel: "chrome" })` | Installed Google Chrome               |
| `chromium.launch({ channel: "msedge" })` | Installed Microsoft Edge              |
| Firefox                                    | Patched Firefox Nightly               |
| WebKit                                     | Patched WebKit                        |

---

# Final Summary

- `npx playwright install` downloads **browser binaries** (executables).
- Browser binaries are stored in the **ms-playwright** cache folder.
- These binaries are **patched browsers** because Playwright modifies the open-source browser projects with automation hooks.
- A **browser engine** is the core rendering engine (Blink, Gecko, WebKit) that parses HTML/CSS, executes JavaScript, and renders pages.
- Playwright launches the browser **binary**, which internally uses its browser **engine** to render the page.
- Default Chromium execution happens in **Chrome for Testing**, not Google Chrome.
- Using `channel: "chrome"` or `channel: "msedge"` launches the installed branded browser.
- Firefox execution always happens in Playwright's patched Firefox Nightly build.
- WebKit execution always happens in Playwright's patched WebKit build.
- There is **no supported `channel` option** for real Firefox or Safari like there is for Chrome and Edge.
