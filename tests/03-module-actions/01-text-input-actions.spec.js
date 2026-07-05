/**
 * ============================================================================
 * TOPIC 9 — TEXT INPUT ACTIONS
 * Website: BillPay Practice App
 * URL:     https://gauravkhurana.com/practise-api/ui/index.html#/practice
 * ============================================================================
 *
 * METHODS COVERED:
 *   9.1  fill() / clear()               — set / empty a field (atomic)
 *   9.2  pressSequentially()            — real character-by-character typing
 *   9.3  getByRole('textbox') patterns  — email, password, date, time, datetime
 *   9.4  inputValue() vs getAttribute() — live DOM value vs static HTML value
 *   9.4  getAttribute()                 — reading static HTML attributes (general)
 *   9.5  press()                        — single key / key combo simulation
 *   9.6  selectText()                   — programmatic text selection
 *   9.7  setInputFiles()                — file upload without OS dialog
 *
 * SOURCE FILES CONSOLIDATED:
 *   - topic_02_text_input_action_methods_spec.ts
 *   - 01-actions.spec.ts (TextBox Actions Test)
 * ============================================================================
 */

import { test, expect } from '@playwright/test';

// ── Shared URL ───────────────────────────────────────────────────────────────
const PRACTICE_URL = 'https://gauravkhurana.com/practise-api/ui/index.html#/practice';


// =============================================================================
// 9.1 — fill() AND clear()
// =============================================================================
/**
 * fill(value)
 *   - Clears the field FIRST, then sets the new value in one atomic step
 *   - Internally triggers `input` and `change` DOM events
 *   - Does NOT fire real keydown/keypress/keyup events — it's a direct value set
 *   - Options: { timeout, force, noWaitAfter }
 *
 * clear()
 *   - Functionally identical to fill('')
 *   - Removes existing content, types nothing new
 *
 * 🎯 INTERVIEW POINT:
 *   fill() is fast and reliable for 99% of form-filling, but if the app has
 *   JS listening to individual keystrokes (autosave, char counters, masks),
 *   fill() will NOT trigger that logic — use pressSequentially() instead.
 */
test('9.1 — fill() and clear() — set and clear a field', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ── Basic fill — value set karo ───────────────────────────────────────────
  await page.getByLabel('First Name').fill('Gaurav');

  // ── fill() with a custom timeout ──────────────────────────────────────────
  // Action must complete within 5s or a TimeoutError is thrown
  // fill() automatically clears the existing value — no manual clearing needed
  await page.getByLabel('First Name').fill('Mittal', { timeout: 5000 });

  // ── fill('') — clear using an empty string ────────────────────────────────
  // fill('') and clear() do the same thing — field becomes empty
  // Both `input` and `change` events fire
  await page.getByLabel('First Name').fill('');

  await page.pause(); // Inspector: field will be empty

  // ── Set a fresh value again ───────────────────────────────────────────────
  await page.getByLabel('First Name').fill('Gaurav Mittal');

  await page.pause(); // Inspector: "Gaurav Mittal" visible

  // ── clear() — dedicated clearing method ───────────────────────────────────
  await page.getByLabel('First Name').clear();

  await page.pause(); // Inspector: field empty again
});


// =============================================================================
// 9.2 — pressSequentially() — REAL TYPING SIMULATION
// =============================================================================
/**
 * pressSequentially(text, options?)
 *   - Types character-by-character, exactly like a real user
 *   - Fires keydown, keypress, keyup for EVERY character
 *   - Does NOT clear existing content first — appends after what's already there
 *   - Options: { delay (ms between keystrokes), timeout }
 *
 * WHEN TO USE:
 *   - Autocomplete fields that react while typing
 *   - Real-time search boxes
 *   - Character-by-character validation
 *   - Simulating human typing speed with `delay`
 */
test('9.2 — pressSequentially() — character by character typing', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // delay: 1000 → 1 second gap between each character
  // Useful for observing autocomplete suggestions appear live
  // NOTE: does NOT clear the field first — types after existing content
  await page.getByLabel('First Name').pressSequentially('Gaurav', { delay: 1000 });

  await page.pause(); // Inspector: "Gaurav" typed out character by character
});


// =============================================================================
// 9.3 — getByRole('textbox') — REAL-WORLD FORM PATTERNS
// =============================================================================
/**
 * getByRole('textbox', { name, exact? })
 *   - Locates inputs via their accessible role + label
 *   - `exact: true` is critical when similar labels exist
 *     (e.g. "Date" vs "DateTime" — without exact:true, "Date" could match both)
 *
 * Format conventions to remember:
 *   Date input     → 'YYYY-MM-DD'           (HTML date input standard)
 *   Time input     → 'HH:mm'                (24-hour format)
 *   DateTime input → 'YYYY-MM-DDTHH:mm'     (ISO-8601 format)
 */
test('9.3 — TextBox Actions — email, password, date, time, datetime, multiline', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ── Email Textbox ──────────────────────────────────────────────────────
  const emailTextbox = page.getByRole('textbox', {
    name: 'Email *',
  });
  await emailTextbox.fill('Gaurav@email.com');

  // ── Password / Confirm Password ────────────────────────────────────────
  const confirmPasswordTextbox = page.getByRole('textbox', {
    name: 'Confirm Password *',
  });
  await confirmPasswordTextbox.fill('Gaurav@email.com');

  // ── Date Input ──────────────────────────────────────────────────────────
  // exact: true ensures Playwright matches the label text exactly
  // Useful when similar labels exist (Date, DateTime, etc.)
  const dateTextbox = page.getByRole('textbox', {
    name: 'Date',
    exact: true,
  });
  await dateTextbox.fill('2020-02-10'); // Format: YYYY-MM-DD

  await page.pause();

  // ── Time Input ──────────────────────────────────────────────────────────
  const timeTextbox = page.getByRole('textbox', {
    name: 'Time',
    exact: true,
  });
  await timeTextbox.fill('22:30'); // Format: HH:mm (24-hour)

  await page.pause();

  // ── DateTime Input ──────────────────────────────────────────────────────
  const dateTimeTextbox = page.getByRole('textbox', {
    name: 'DateTime',
    exact: true,
  });
  await dateTimeTextbox.fill('2020-02-10T05:15'); // Format: ISO-8601


  console.log('Test Completed Successfully');
  await page.pause();
});


// =============================================================================
// 9.4 — inputValue() vs getAttribute('value') — CRITICAL DIFFERENCE
// =============================================================================
/**
 * inputValue()
 *   - Reads the DOM PROPERTY → the current LIVE value the user sees
 *   - Always reflects what's actually in the field, even after fill()
 *
 * getAttribute('value')
 *   - Reads the HTML ATTRIBUTE → the INITIAL value baked into the markup
 *   - Stays STALE after fill() — fill() updates the DOM property, not the attribute
 *
 * 🎯 INTERVIEW POINT (asked constantly):
 *   DOM Property  = what's currently displayed to the user (live state)
 *   HTML Attribute = what was originally written in the HTML (static, frozen)
 *   RULE: To check the CURRENT value, always use inputValue() or toHaveValue()
 */
test('9.4 — inputValue() vs getAttribute("value") — live vs stale', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ── getAttribute('value') — reads the initial HTML attribute ─────────────
  // No default value attribute exists on page load
  // HTML: <input id="firstName" type="text"> — no value attribute
  // So getAttribute('value') returns null
  const initialValue = await page.getByLabel('First Name').getAttribute('value');
  console.log('Initial getAttribute("value"):', initialValue); // null
  await expect(initialValue).toBe(null);

  // ── fill() sets a value ───────────────────────────────────────────────────
  await page.getByLabel('First Name').fill('Gaurav');

  // ── getAttribute('value') — STILL stale after fill() ──────────────────────
  // fill() updates the DOM Property, NOT the HTML Attribute
  // So getAttribute() still returns null / the old value — STALE
  const filledValueViaGetAttribute = await page.getByLabel('First Name').getAttribute('value');
  console.log('After fill — getAttribute("value"):', filledValueViaGetAttribute); // null (stale)
  await expect(filledValueViaGetAttribute).toBe(null);

  // ── inputValue() — the current LIVE value ──────────────────────────────────
  // Reads the DOM Property — what's actually visible in the field
  // Returns "Gaurav" correctly after fill()
  const filledValueViaInputValue = await page.getByLabel('First Name').inputValue();
  console.log('After fill — inputValue():', filledValueViaInputValue); // "Gaurav"
  await expect(filledValueViaInputValue).toBe('Gaurav');

  // ── SUMMARY ─────────────────────────────────────────────────────────────
  // inputValue()          → DOM Property → live   → "Gaurav" ✅
  // getAttribute('value') → HTML Attribute → stale → null    ⚠️

  await page.pause(); // Inspector: field shows "Gaurav"
});

// =============================================================================
// 9.4 — getAttribute() — READING STATIC HTML ATTRIBUTES (GENERAL PURPOSE)
// =============================================================================
/**
 * getAttribute(attributeName)
 *   - Reads any static HTML attribute written directly in the markup
 *   - Return type: Promise<string | null> — null if the attribute doesn't exist
 *   - NOT limited to 'value' — works for placeholder, type, id, class, href,
 *     disabled, maxlength, name, data-* attributes, aria-* attributes, etc.
 *   - Does NOT reflect JS-driven runtime changes to DOM properties
 *     (e.g. it won't tell you the current typed value — see 9.5 for that trap)
 *
 * WHEN TO USE getAttribute():
 *   - Verifying static configuration baked into the HTML (placeholder text,
 *     input type, disabled state defined at load time, href on a link,
 *     aria-label for accessibility checks, maxlength restrictions)
 *   - Confirming an element's initial/default state before any interaction
 *
 * WHEN NOT TO USE IT:
 *   - Reading the CURRENT value of an input after typing/filling
 *     (use inputValue() or expect().toHaveValue() instead — see 9.5)
 */
test('9.4 — getAttribute() — reading static HTML attributes', async ({ page }) => {
  await page.goto(PRACTICE_URL);
 
  const emailInput = page.getByTestId('form-email');
 
  // ── Read the placeholder attribute ────────────────────────────────────────
  // Confirms the static hint text configured in the HTML markup
  const placeholder = await emailInput.getAttribute('placeholder');
  console.log('Placeholder attribute:', placeholder); // "your@email.com"
  expect(placeholder).toBe('your@email.com');
 
  // ── Read the type attribute ───────────────────────────────────────────────
  // Confirms the input was declared as type="email" (or "text", etc.)
  const inputType = await emailInput.getAttribute('type');
  console.log('Type attribute:', inputType);
 
 
  // 🎯 INTERVIEW POINT:
  // getAttribute() is the right tool for STATIC, load-time HTML attributes.
  // For anything that changes at runtime (like a typed value), the DOM
  // property (via inputValue(), textContent() for live state, etc.) is
  // the correct source of truth — not getAttribute().
});



// =============================================================================
// 9.5 — press() — SINGLE KEY / KEY COMBO SIMULATION
// =============================================================================
/**
 * press(key, options?)
 *   - Simulates a single keyboard key or combination
 *   - Fires real keydown, keypress, keyup events
 *   - Automatically focuses the element first
 *
 * Common keys:
 *   Tab         → move focus to next field
 *   Shift+Tab   → move focus to previous field
 *   Enter       → submit a form
 *   Escape      → close a modal/dropdown
 *   Control+A   → select all text
 *   Backspace   → delete one character
 *   ArrowDown   → move to next option in a dropdown
 */
test('9.5 — press() — keyboard key simulation', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ── Fill, then press Tab to move to the next field ────────────────────────
  // Tab automatically moves browser focus to the next input in tab order
  // Useful for verifying tab-order navigation
  await page.getByLabel('First Name').fill('Gaurav');
  await page.getByLabel('First Name').press('Tab'); // focus moves to Last Name field

  await page.pause(); // Inspector: Last Name field is now focused
});


// =============================================================================
// 9.6 — selectText() — PROGRAMMATIC TEXT SELECTION
// =============================================================================
/**
 * selectText()
 *   - Selects all existing text in an input/textarea — like Ctrl+A
 *   - No keyboard interaction required — purely programmatic
 *
 * Typical flow:
 *   Select text → Copy/Cut → Paste somewhere else
 *   Select text → Backspace → field cleared
 *   Select text → pressSequentially() → replace with new text
 */
test('9.6 — selectText() — select and manipulate existing text', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // ── Fill, then select all text ────────────────────────────────────────────
  await page.getByLabel('First Name').fill('Gaurav Mittal');

  // selectText() selects everything — equivalent to Ctrl+A
  await page.getByLabel('First Name').selectText();

  await page.pause(); // Inspector: "Gaurav Mittal" shown as selected

  // ── Copy the selected text ────────────────────────────────────────────────
  await page.getByLabel('First Name').press('Control+C');

  await page.pause();

  // ── Delete the selected text ──────────────────────────────────────────────
  await page.getByLabel('First Name').press('Backspace');

  await page.pause();

  // ── Tab to the Email field ────────────────────────────────────────────────
  await page.getByLabel('First Name').press('Tab');

  await page.pause();

  // ── Paste the copied text into the Email field ────────────────────────────
  await page.locator("//*[@id='email']").press('Control+V');

  await page.pause(); // Inspector: Email field now shows "Gaurav Mittal"
});


// =============================================================================
// 9.7 — setInputFiles() — FILE UPLOAD WITHOUT OS DIALOG
// =============================================================================
/**
 * setInputFiles(files, options?)
 *   - Sets files directly onto a file input element
 *   - Does NOT open the native OS file picker — works headlessly and in CI/CD
 *
 * Accepted formats:
 *   string       → single file path
 *   string[]     → multiple file paths
 *   []           → empty array → clears the file input
 *   FilePayload  → in-memory file (no actual file needed on disk)
 *
 * Path note:
 *   Windows: use forward slashes 'D:/folder/file.jpg'
 *   or escaped backslashes 'D:\\folder\\file.jpg'
 *   Best practice: use path.join() for OS-independent paths
 *
 * already covered seperately
 * /


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 9: TEXT INPUT ACTIONS
// =============================================================================
/**
 * ┌─────────────────────────┬────────────────────────────────────┬───────────────────────────┬──────────────────────────────────────┐
 * │ Method                  │ Behavior                            │ Key Options                │ Interview Trap / Note                 │
 * ├─────────────────────────┼────────────────────────────────────┼───────────────────────────┼──────────────────────────────────────┤
 * │ fill(value)              │ Clears then sets value (atomic)     │ timeout, force, noWaitAfter│ No real keystroke events fired        │
 * │ clear()                  │ Same as fill('')                    │ timeout                    │ -                                      │
 * │ pressSequentially(text)  │ Real char-by-char typing             │ delay, timeout             │ Does NOT clear field first             │
 * │ getByRole('textbox')     │ Locate by accessible role + label   │ name, exact                │ Use exact:true for similar labels      │
 * │ inputValue()             │ Live DOM property                    │ timeout                    │ Always correct after fill()            │
 * │ getAttribute('value')    │ Static HTML attribute                │ timeout                    │ 🎯 STALE after fill() — classic trap   │
 * │ press(key)               │ Single key / combo simulation       │ delay, timeout, noWaitAfter│ Auto-focuses element first             │
 * │ selectText()             │ Selects all existing text            │ timeout                    │ Ctrl+A equivalent, programmatic        │
 * │ setInputFiles(paths)     │ Uploads file(s), no OS dialog        │ timeout, noWaitAfter       │ [] clears the file input               │
 * └─────────────────────────┴────────────────────────────────────┴───────────────────────────┴──────────────────────────────────────┘
 *
 * 🎯 TOP INTERVIEW QUESTION FOR THIS TOPIC:
 *   Q: "You called fill() on a field, but getAttribute('value') still shows null.
 *       Is that a bug?"
 *   A: No — getAttribute() reads the static HTML attribute (never updated by fill()).
 *      Use inputValue() or expect(locator).toHaveValue() to read the live value.
 */

