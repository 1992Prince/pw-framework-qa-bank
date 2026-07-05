
# Playwright Interview Prep — Auto-Waiting & Actionability (Q&A)

---

**1. What is auto-waiting in Playwright, and how does it work internally?**

- Playwright automatically waits for an element to be **actionable** before performing any action — no manual waits needed
- Internally, before every action it runs a series of **actionability checks** in a loop, retrying until they all pass or a timeout is hit
- If any check fails, Playwright keeps polling instead of failing immediately
- Example: `await page.locator('#submit').click()` automatically waits for the button to be visible and enabled before clicking, even if it appears after an API call finishes.

---

**2. What actionability checks does Playwright run before an action?**

- **Attached** — element exists in the DOM
- **Visible** — element has a bounding box and isn't `display: none`/`visibility: hidden`
- **Stable** — element isn't still animating/moving (position is stable across two frames)
- **Enabled** — element isn't disabled
- **Receives Events** — element isn't obscured by another element on top of it (e.g., a modal overlay)
- Example: A "Submit" button fading in via CSS animation will only be clicked once it's stopped moving (stable) and is on top (receives events).

---

**3. Explain Attached, Visible, Stable, Enabled, and Receives Events — any shortcut to remember them?**

- **Attached** — present in the DOM tree
- **Visible** — actually rendered and has non-zero size
- **Stable** — not mid-animation/transition
- **Enabled** — not disabled (for form controls)
- **Receives Events** — not blocked by an overlapping element
- Shortcut: **A-V-S-E-R** — "**A** **V**ery **S**table **E**lement **R**esponds" (checked roughly in this order before an action)

---

**4. How is Playwright's auto-waiting different from Selenium's implicit/explicit waits?**

- Selenium's **implicit wait** only waits for element **presence** in the DOM — not visibility, stability, or interactability
- Selenium's **explicit wait** requires manually writing `WebDriverWait` + `ExpectedConditions` for each specific condition
- Playwright's auto-wait is **built into every action**, checks multiple actionability conditions automatically, and needs zero extra code
- Example: In Selenium you'd write an explicit wait for "element clickable" before clicking; in Playwright, `locator.click()` does this by default.

---

**5. What is the difference between `locator.waitFor()` and `expect(locator).toBeVisible()`?**

- `locator.waitFor({ state })` — a general-purpose wait for a specific state (`attached`, `visible`, `hidden`, `detached`); doesn't fail the test, just resolves/rejects the promise
- `expect(locator).toBeVisible()` — a **test assertion** that also auto-retries, but is meant to validate a condition and will fail the test with a clear error if it doesn't become true
- Use `waitFor()` for flow control (e.g., "wait until this loader disappears before continuing"); use `expect()` when you want to actually verify behavior
- Example: `await page.locator('.loader').waitFor({ state: 'hidden' });` then `await expect(page.locator('h1')).toBeVisible();`

---

**6. Hard wait vs smart wait — why should you avoid `page.waitForTimeout()`?**

- **Hard wait** (`page.waitForTimeout(5000)`) pauses execution for a fixed time regardless of actual page state — wastes time or still isn't enough
- **Smart wait** (auto-waiting / `waitFor` / `expect`) waits only as long as needed based on the real condition of the element
- Hard waits make tests **slow and flaky** — too short causes failures, too long wastes CI time
- Example: Instead of `await page.waitForTimeout(3000)` after clicking "Load More," use `await expect(page.locator('.new-item')).toBeVisible();`

---

**7. What is the default auto-waiting timeout, and what error does it throw on timeout?**

- Default timeout is **30 seconds** for most actions/assertions (configurable via `test.setTimeout()`, `expect.timeout`, or per-action `timeout` option)
- On timeout, Playwright throws a **`TimeoutError`**, along with a detailed log of which actionability check kept failing (e.g., "element is not visible")
- This makes debugging easier since the error explains exactly what condition wasn't met
- Example: `await page.locator('#missing-btn').click({ timeout: 5000 });` throws `TimeoutError: locator.click: Timeout 5000ms exceeded` if the button never appears.
