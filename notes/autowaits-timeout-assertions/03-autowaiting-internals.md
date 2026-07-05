# Playwright Auto-Waiting — Complete Interview Notes

---

## 1. What is Auto-Waiting? (30-second interview answer)

> **"Auto-waiting means Playwright automatically waits for an element to be actionable — visible, stable, enabled — before performing any action on it, without me writing any explicit wait code. If the element isn't ready, Playwright keeps retrying internally until it is ready or a timeout occurs. This is what makes Playwright tests much less flaky compared to Selenium."**

**Memory trick:** Auto-waiting = "Playwright checks readiness for you, before doing the action — you don't ask, it just waits."

---

## 2. Selenium vs Playwright — Why Playwright is Less Flaky

| | Selenium | Playwright |
|---|---|---|
| Waiting | Manual/explicit — you write a separate wait step | Built into the action method itself |
| Flakiness | High — if you forget to wait, test breaks | Low — wait is automatic every single time |

**Selenium (explicit wait — separate step):**
```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
driver.findElement(By.id("submit")).click();
```

**Playwright (auto-wait — built into the action):**
```typescript
await page.locator('#submit').click();
```

**Interview line:** *"In Selenium, waiting is a separate step I have to code myself. In Playwright, waiting is baked inside the action method — I just call `.click()` and the wait is part of it."*

---

## 3. Actionability Checks — What PW Checks Before Any Action

**Memory trick — mnemonic "AVSER":**
> **A**ttached → **V**isible → **S**table → **E**nabled → **R**eceives Events

For `locator.click()`, Playwright ensures:
1. Locator resolves to **exactly one** element
2. Element is **Visible**
3. Element is **Stable** (not animating)
4. Element **Receives Events** (not obscured/covered by another element)
5. Element is **Enabled**

*(For `fill()`/`clear()`, one more check is added: **Editable**)*

**Interview line:** *"Before clicking, Playwright makes sure the locator matches exactly one element, and that element is visible, stable, enabled, and receiving pointer events — not blocked by an overlay."*

---

## 4. Each Actionability Check — Meaning + Example

### ✅ Visible
Element has a **non-empty bounding box** AND does **not** have `visibility:hidden`.

- ❌ Zero size elements → NOT visible
- ❌ `display:none` → NOT visible
- ✅ `opacity:0` → **still considered visible** (tricky, interviewers love this!)

**Memory trick:** "Opacity 0 is invisible to the eye, but visible to Playwright."

### ✅ Stable
Element has the **same bounding box for 2 consecutive animation frames**.
→ i.e., it's not mid-animation (like a sliding modal or fading toast).

**Interview line:** *"Stable means the element isn't moving — Playwright checks its position twice in a row, and if it hasn't changed, it's considered stable."*

### ✅ Enabled
Element is enabled when it's **not disabled**.

Element is **disabled** when:
- It's a `<button>`, `<select>`, `<input>`, `<textarea>`, `<option>`, `<optgroup>` with a `[disabled]` attribute
- It's inside a `<fieldset disabled>`
- It's a descendant of an element with `[aria-disabled=true]`

### ✅ Editable
Element is editable when it is **Enabled AND not readonly**.

Element is **readonly** when:
- It's a `<select>`, `<input>`, or `<textarea>` with `[readonly]`
- It has `[aria-readonly=true]` with a supporting ARIA role

**Memory trick:** Editable = Enabled + Not Readonly. (only relevant for text-entry elements)

### ✅ Receives Events
Element must be the actual **hit target** at the click coordinates — i.e., no overlay/other element is sitting on top of it intercepting the click.

**Classic interview example:**
> Sign Up button is disabled while checking username uniqueness. Playwright calls `click()`. Since actionability checks keep retrying, once the server responds and the button becomes enabled + clickable, Playwright clicks it correctly — **regardless of when `.click()` was originally called.**

**Interview line:** *"Receives Events means no other element — like a loading spinner or modal overlay — is sitting on top of my target element at that exact point."*

---

## 5. How to Disable Actionability Checks — `force` Option

Some action methods support a `force` option that **skips non-essential checks** (e.g., "Receives Events").

```typescript
await page.locator('#submit').click({ force: true });
```

**Interview line:** *"Passing `force: true` to click() skips the 'receives events' check — Playwright will click even if something else is technically covering the element. Useful for edge cases, but risky — it hides real UI bugs."*

---

## 6. Which Methods Auto-Wait, and Which Don't

### 🟢 Auto-waiting methods (run AVSER checks first)
```typescript
locator.click()
locator.dblclick()
locator.tap()
locator.fill()
locator.hover()
locator.check()
locator.uncheck()
locator.selectOption()
locator.screenshot()
```
**Why:** These all "do" something to the element → Playwright must confirm the element is ready first.

### 🔴 Non-auto-waiting methods (instant snapshot, zero checks)
```typescript
locator.isVisible()
locator.isHidden()
locator.isEnabled()
locator.isDisabled()
locator.isChecked()
locator.isEditable()
locator.getAttribute()
locator.textContent()
locator.allTextContents()
locator.count()
```
**Why:** These are **query/read** methods — "what is the state right now?" — no waiting, no retrying. That's *by design*, because they're meant for instant conditional logic, not assertions.

**Memory trick:** "**Do** something → wait first. **Read/ask** something → answer instantly."

**Interview line:** *"Action methods like click/fill wait and retry because they change state. Query methods like isVisible/textContent return the current DOM snapshot instantly — zero retry — because they're meant to answer 'what's true right now', typically inside if/else logic."*

---

## 7. Auto-Wait + Auto-Retry — Internal Flow

**Interview-ready short answer:**
> *"Every time an action method is called, Playwright runs an internal retry loop: resolve the locator to one element, run the actionability checks, and if any check fails, wait about 100ms and try the whole thing again — until it succeeds or the timeout expires, at which point it throws a TimeoutError."*

**Full flow (for your understanding):**
```
Action call hoti hai (e.g. click())
        ↓
Step 1 — Locator Resolve
   Selector se EXACTLY 1 element dhoondo (0 ya multiple mile → retry)
        ↓
Step 2 — Actionability Checks (AVSER)
        ↓
Step 3 — Sab Pass?
   YES → Action execute → DONE ✅
   NO  → Step 4
        ↓
Step 4 — ~100ms wait → Step 1 pe wapas
        ↓
Step 5 — Timeout expire → TimeoutError throw
```

**Memory trick:** "**Resolve → Check → Retry every ~100ms → Timeout → Error.**" Polling interval (~100ms) is fixed internally; only the **timeout (max wait)** is configurable, not the polling frequency.

---

## 8. Timeout & Error Behaviour

- If actionability checks don't pass in time → **`TimeoutError`**
- **Action timeout default = `0`** → this does NOT mean "no wait" — it means "no independent timeout of its own; use the test's overall timeout instead"
- **Test timeout default = 30,000ms (30s)**
- So by default, an action like `click()` can retry for up to **30 seconds** before failing

**Interview line:** *"Action timeout default is 0, but that doesn't mean zero wait — it means it inherits the test timeout, which defaults to 30 seconds. So an action will keep retrying for up to 30s unless configured otherwise."*

---

## 9. Web-First (Auto-Retrying) Assertions

Playwright also has **auto-retrying assertions** using `expect()` — same philosophy as auto-waiting actions: keep checking the condition until it's true or timeout hits.

**Default timeout for `expect()` = 5 seconds** (configurable).

Common web-first assertions:
```typescript
expect(locator).toBeAttached()
expect(locator).toBeChecked()
expect(locator).toBeDisabled()
expect(locator).toBeEditable()
expect(locator).toBeEnabled()
expect(locator).toBeVisible()
expect(locator).toHaveText()
expect(page).toHaveTitle()
expect(page).toHaveURL()
expect(response).toBeOK()
```

**Interview line:** *"Web-first assertions like `expect(locator).toBeVisible()` keep polling and retrying up to 5 seconds by default until the condition becomes true, instead of failing immediately — this removes flakiness from assertions the same way auto-waiting removes it from actions."*

---

## 10. When to Use `expect()` vs `isVisible()`/`isEnabled()` etc.

| Use Case | Use This |
|---|---|
| Test **assertion** — verifying expected UI state | `expect(locator).toBeVisible()` (auto-retry, no flakiness) |
| **Conditional logic** — if/else branching in test code, where you want the *current* state instantly, no waiting | `locator.isVisible()`, `isEnabled()`, etc. |

**Interview line:** *"For assertions, I always use web-first `expect()` because it auto-retries and avoids flaky failures. I only use `isVisible()`/`isEnabled()` when I need the state instantly for an if/else decision — not for verifying correctness."*

**Memory trick:** "**Assert = expect (waits). Decide = isX (instant).**"

---

## 11. `locator.isVisible()` vs `expect(locator).toBeVisible()`

| | `locator.isVisible()` | `expect(locator).toBeVisible()` |
|---|---|---|
| Waits/Retries? | ❌ No — instant check | ✅ Yes — retries till timeout (default 5s) |
| Use case | Conditional logic (if/else) | Test assertions |
| Fails test on false? | No — just returns boolean | Yes — throws assertion error if never true |
| Flaky-prone? | Yes, if used as an assertion | No |

**Interview one-liner:** *"`isVisible()` gives you a snapshot answer right now with no retry — good for branching logic. `toBeVisible()` keeps retrying until it's true or times out — good for assertions. Using `isVisible()` as an assertion is a common flaky-test mistake."*

---

## 12. How Auto-Retry Works Internally in Web-First Assertions (short answer)

> *"`expect(locator).toBeVisible()` doesn't just check once — it polls the DOM repeatedly (similar ~ every few hundred ms) re-evaluating the condition, until either the condition becomes true (assertion passes) or the timeout (default 5s) expires (assertion fails with a detailed error showing the last known state)."*

**Memory trick:** Same retry philosophy as actions — **"poll → check → retry → timeout → fail"** — just applied to assertions instead of actions.

---

## 13. Why "Editable" Check Is Only Required for `fill()` / `clear()`

**Interview line:** *"Editable check only applies to `fill()` and `clear()` because those methods directly set or erase a text field's value. Before writing into an input, Playwright must confirm the field isn't readonly — otherwise the fill would silently fail or be meaningless. Other actions like `click()` don't modify text content, so an editable check isn't relevant for them."*

**Memory trick:** "Editable check = only for methods that **type/erase text** (fill, clear). Click/hover/check don't touch text, so they don't need it."

---

## 🎯 Quick Revision Cheat-Sheet (Day-Before-Interview Recap)

1. **Auto-waiting** = Playwright waits + retries automatically before actions, built into the method.
2. **Selenium** = manual explicit wait. **Playwright** = built-in.
3. **AVSER** = Attached, Visible, Stable, Enabled, Receives events (checks before click).
4. **Visible**: non-empty box + not `visibility:hidden`. Opacity:0 is still "visible"!
5. **Stable**: same bounding box across 2 animation frames.
6. **Enabled**: not disabled (`[disabled]`, fieldset disabled, or `aria-disabled=true`).
7. **Editable**: enabled + not readonly. Only needed for `fill()`/`clear()`.
8. **Receives Events**: nothing else is covering the element at click point.
9. **force: true** → skips non-essential checks like "receives events."
10. **Action methods** (click, fill, hover, check, uncheck, selectOption, screenshot, tap, dblclick) → auto-wait.
11. **Query methods** (isVisible, isEnabled, getAttribute, textContent, count, etc.) → instant, no wait.
12. **Retry loop**: resolve locator → run AVSER → pass? act : wait ~100ms → retry → timeout → TimeoutError.
13. **Action timeout default = 0** (inherits test timeout, default 30s).
14. **expect() web-first assertions**: default timeout = 5s, auto-retry until true or fail.
15. **expect() = for assertions. isVisible() etc = for instant if/else logic.**

---

## 🗣️ Mock Interview Q&A (rapid-fire practice)

**Q: What is auto-waiting in Playwright?**
A: Playwright automatically waits for an element to become actionable before performing an action, without needing explicit wait code.

**Q: Name the actionability checks.**
A: Attached, Visible, Stable, Enabled, Receives Events (AVSER) — plus Editable for fill/clear.

**Q: Is an element with opacity:0 visible to Playwright?**
A: Yes — Playwright's definition of visible only checks bounding box size and `visibility:hidden`, not opacity.

**Q: How do you bypass actionability checks?**
A: Pass `force: true` to the action method — it skips non-essential checks like "receives events."

**Q: Does `locator.isVisible()` wait for the element?**
A: No — it's an instant, non-retrying snapshot check. Use `expect(locator).toBeVisible()` for assertions that need retry.

**Q: What's the default action timeout, and what does 0 mean?**
A: Default is 0, meaning it has no independent timeout of its own — it inherits the test timeout, which defaults to 30 seconds.

**Q: What's the default timeout for `expect()` web-first assertions?**
A: 5 seconds, and it's configurable.

**Q: Why does `fill()` need an Editable check but `click()` doesn't?**
A: Because `fill()` writes text into the element — it must confirm the field isn't readonly first. `click()` doesn't modify text, so editability is irrelevant.