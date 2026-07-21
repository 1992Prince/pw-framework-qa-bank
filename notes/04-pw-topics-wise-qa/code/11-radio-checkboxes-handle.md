# Checkbox / Radio Handling — Interview Revision Notes

## 1. check() — Force CHECKED

- Forces the checkbox/radio into the **CHECKED** state.
- **Idempotent** — if already checked, does nothing, no error thrown.
- Use when: you have an explicit goal to *select* something (e.g., "I agree to Terms").

```ts
await newsletter.check();
```

**Validate:**

```ts
await expect(newsletter).toBeChecked();
```

---

## 2. uncheck() — Force UNCHECKED

- Forces the checkbox into the **UNCHECKED** state.
- Does **NOT** apply to radio buttons — a radio can't be individually unchecked, you can only select a different radio in the group.
- Use when: you explicitly need to *deselect* something that may default to checked (e.g., "Unsubscribe from newsletter").

```ts
await newsletter.uncheck();
```

**Validate:**

```ts
await expect(newsletter).not.toBeChecked();
```

*(Playwright doesn't have a separate `toBeUnchecked()` matcher — use `.not.toBeChecked()`.)*

---

## 3. setChecked(bool) — Conditional Wrapper

- **`setChecked()` is just a wrapper around `check()` and `uncheck()`.** It doesn't have its own separate logic.
- You pass a **boolean**:
  - `setChecked(true)` → internally calls **`check()`**
  - `setChecked(false)` → internally calls **`uncheck()`**
- Use when: the **starting state is unknown/unpredictable** — data-driven testing, previous test left the box in an unknown state, dynamic forms driven by API/DB values.
- Avoids manual `if-else` logic to decide check vs uncheck.

```ts
const isUserPremium = true; // from DB / API / test data
await page.locator('#premium-features').setChecked(isUserPremium);
```

**Radio button example (radios always use setChecked to select):**

```ts
const femaleRadio = page.getByRole('radio', { name: 'Female' });
await femaleRadio.setChecked(true);
await expect(femaleRadio).toBeChecked();
```

**Validate:**

```ts
await expect(newsletter).toBeChecked();     // when setChecked(true)
await expect(newsletter).not.toBeChecked(); // when setChecked(false)
```

---

## 4. Quick Comparison Table

| Method               | Behavior                                                                  | Radio-safe?                   | Best Use Case                                          |
| -------------------- | ------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------ |
| `check()`          | Forces checked; idempotent, no error if already checked                   | Yes (to select)               | You KNOW you want it checked                           |
| `uncheck()`        | Forces unchecked                                                          | ❌ No (can't uncheck a radio) | You KNOW you want it unchecked                         |
| `setChecked(bool)` | Wrapper —`true` → calls `check()`, `false` → calls `uncheck()` | Yes                           | State is**unknown/dynamic** — data-driven tests |

All three **auto-wait** for the element to be clickable and accept standard click options: `{ force, timeout, position }`.

---

## 5. 🎯 Key Interview Talking Point

> "`check()` and `uncheck()` are used when I already know the target state and just want to force it. `setChecked(true/false)` is really just a wrapper on top of those two — internally, `setChecked(true)` calls `check()` and `setChecked(false)` calls `uncheck()`. I use it when the current state is unpredictable — for example, a dynamic form or when a previous test may have left the checkbox in an unknown state. One `setChecked()` call handles both directions correctly, so I don't need if-else branching. To validate state, I use `toBeChecked()` for checked, and `.not.toBeChecked()` for unchecked, since there's no separate `toBeUnchecked()` matcher."

---

## 6. Fetching All Checkbox Text / Selected Checkbox Text — Strategies

### Strategy A: Fetch text of ALL checkboxes in a group

```ts
const allCheckboxes = page.locator('.card').getByRole('checkbox');
const count = await allCheckboxes.count();

const allTexts: string[] = [];
for (let i = 0; i < count; i++) {
  const text = await allCheckboxes.nth(i).locator('span').textContent();
  allTexts.push(text?.trim() ?? '');
}
console.log('All checkbox labels:', allTexts);
```

### Strategy B: Fetch text of only CHECKED (selected) checkboxes

```ts
const checkedCheckboxes = page.getByRole('checkbox', { checked: true });
const checkedCount = await checkedCheckboxes.count();

const selectedTexts: string[] = [];
for (let i = 0; i < checkedCount; i++) {
  const text = await checkedCheckboxes.nth(i).locator('span').textContent();
  selectedTexts.push(text?.trim() ?? '');
}
console.log('Selected checkbox labels:', selectedTexts);
```

### Strategy C: Fetch text of only UNCHECKED checkboxes

```ts
const uncheckedCheckboxes = page.getByRole('checkbox', { checked: false });
const uncheckedCount = await uncheckedCheckboxes.count();

const uncheckedTexts: string[] = [];
for (let i = 0; i < uncheckedCount; i++) {
  const text = await uncheckedCheckboxes.nth(i).locator('span').textContent();
  uncheckedTexts.push(text?.trim() ?? '');
}
console.log('Unchecked checkbox labels:', uncheckedTexts);
```

### Strategy D: Get ALL texts in one shot with `allTextContents()`

```ts
// Faster than looping when you just need raw text, no per-item logic
const allLabels = await page.locator('.card').getByRole('checkbox').locator('span').allTextContents();
console.log('All labels:', allLabels);
```

**Interview point:** Use `checked: true` / `checked: false` filters when you need to fetch **only selected** or **only unselected** items — no need to loop through everything and check state manually. Use `allTextContents()` when you just need a flat array of text and don't need per-element actions.

---

## 7. Fetching Checkbox/Radio Text — Scoped to ONE Section of the Page

- Strategies A–D above assume you want checkboxes/radios from the **whole page**. But real pages often have **multiple cards/sections**, each with their own checkboxes and radios (e.g., a "Radio Buttons & Checkboxes" card, plus other unrelated cards).
- If you locate checkboxes globally with `page.getByRole('checkbox')`, you'll pick up elements from **every section**, not just the one you care about.
- **Fix:** first locate the **parent container** for that specific section, then chain `.locator()` off of it. Playwright's `.locator()` searches **descendants at any nesting depth** within that scope (not just direct children) — so it behaves like a scoped CSS `descendant` selector (`parent *.class`), no matter how deeply the checkbox/radio elements are nested inside.
- This is the key idea: **scope first, then search inside that scope** — rather than filtering a page-wide result set after the fact.

```ts
import { test, expect } from "@playwright/test";

test("Fetch all checkboxes - text", async ({ page }) => {
  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // 1. Scope to the parent card/section first
  let checkboxRadioParentEle = page
    .locator("//*[@class='card']")
    .filter({ hasText: "Radio Buttons & Checkboxes" });

  // 2. Checkboxes nested at any level inside that scope
  let allcheckboxes = checkboxRadioParentEle.locator(".checkbox-label");
  await allcheckboxes.first().waitFor();

  let count = await allcheckboxes.count();
  for (let i = 0; i < count; i++) {
    let text = await allcheckboxes.nth(i).innerText();
    console.log("Checkbox text is - ", text);
  }

  // 3. Radios nested at any level inside the SAME scope
  let allradiobuttons = checkboxRadioParentEle.locator(".radio-label");
  await allradiobuttons.first().waitFor();

  count = await allradiobuttons.count();
  for (let i = 0; i < count; i++) {
    let text = await allradiobuttons.nth(i).innerText();
    console.log("Radio text is - ", text);
  }
});
```

**Why this works / interview notes:**

| Step                                                              | What it does                                                                                                      | Why it matters                                                                                                                                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page.locator("//*[@class='card']").filter({ hasText: "..." })` | Finds the specific card element that contains the target text, out of possibly many`.card` elements on the page | Gives you a**scoped root** instead of searching the entire page                                                                                                         |
| `checkboxRadioParentEle.locator(".checkbox-label")`             | Chains a locator off the scoped root                                                                              | Playwright resolves this as**any descendant** matching `.checkbox-label` inside that root, regardless of how deep it's nested (divs, spans, wrapper components, etc.) |
| `.first().waitFor()`                                            | Waits for at least one match before counting                                                                      | Avoids race conditions where`count()` runs before the section has rendered                                                                                                  |

- Contrast with Strategy A/B/C: those use `page.locator(...)` / `page.getByRole(...)` directly from the page root, so they'll match **every** checkbox/radio on the page. Use the scoped-parent approach whenever the page has **multiple independent groups** of checkboxes/radios and you only want one group's text.
- `innerText()` vs `textContent()`: `innerText()` respects CSS visibility (rendered text only) and is generally preferred for UI-facing label text; `textContent()` returns raw text including hidden elements — pick based on whether hidden/collapsed text should count.

**🎯 Key Interview Talking Point:**

> "If a page has multiple sections that each contain checkboxes or radios, I don't query the whole page directly — I first scope a locator to that section's parent container, usually via `filter({ hasText })` or a stable test id. Then I chain `.locator()` off that scoped element. Playwright resolves chained locators as descendants at any nesting depth, so it doesn't matter how deeply the checkbox or radio elements are nested inside — I still only get matches from within that one section, not the whole DOM."
