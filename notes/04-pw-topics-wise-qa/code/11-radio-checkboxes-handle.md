
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
