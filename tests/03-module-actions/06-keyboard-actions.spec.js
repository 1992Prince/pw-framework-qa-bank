/**
 * ============================================================================
 * TOPIC 14 — KEYBOARD ACTIONS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: page.keyboard vs locator.press(), key combos, down()/up() hold patterns
 * SOURCE: topics_03_click_operations_methods_spec.ts, 01-actions.spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * locator.press(key) → Element ko pehle khud FOCUS karta hai, phir key press 
 * karta hai. Yeh scoped hai aur zyada predictable hai 
 * (Safe default choice).
 *
 * page.keyboard      → GLOBAL keyboard actions ke liye. Page par jo bhi element 
 * CURRENTLY focused hoga, action usi par hoga. Toh aapko 
 * dhyaan rakhna padega ki focus sahi jagah ho (usually 
 * pehle .focus() call karke).
 * .press(key)       → Ek hi call mein keydown + keyup kar deta hai (shortcuts ke liye)
 * .type(text)        → Mostly deprecated; locator pe pressSequentially() use karna better hai
 * .down(key)         → Key ko press karke HOLD karta hai (jaise Shift daba ke rakhna)
 * .up(key)           → Hold ki hui key ko release karta hai
 * .insertText(text)  → Seedha text insert karta hai, bina kisi key event trigger kiye
 *
 * 🎯 INTERVIEW POINT: locator.press() vs page.keyboard.press() 
 * locator.press() hamesha apne target element tak hi simit (scoped) rehta hai 
 * — yeh apna focus khud set karta hai, isliye koi doubt nahi hota ki key press 
 * kahan jayega. 
 *
 * page.keyboard global hota hai — agar galti se kisi aur element par focus shift 
 * ho gaya, toh aapka key press GALAT jagah chala jayega, jiski wajah se tests 
 * flaky (unstable) ho jate hain. 
 *
 * 💡 RECOMMENDATION: 
 * Hamesha locator.press() ko prefer karein kyunki yeh safe hai. 
 * page.keyboard sirf tab use karein jab aapko key daba ke rakhni ho 
 * (down/up pattern) ya phir pure page ke level pe koi global shortcut test 
 * karna ho.
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 14.1 — locator.press() — scoped, auto-focusing key press
// =============================================================================
test('14.1 — locator.press() — Tab to move focus', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  await page.getByLabel('First Name').fill('Gaurav');
  await page.getByLabel('First Name').press('Tab'); // auto-focuses, then presses Tab
});


// =============================================================================
// 14.2 — page.keyboard — global actions on the currently focused element
// =============================================================================
test('14.2 — page.keyboard — select all and copy', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Must explicitly focus first — page.keyboard has no idea which element
  // you "mean" otherwise
  await page.getByLabel('First Name').fill('Gaurav');
  await page.getByLabel('First Name').focus();

  await page.keyboard.press('Control+A'); // select all text in focused element
  await page.keyboard.press('Control+C'); // copy selection
});


// =============================================================================
// 14.3 — down() / up() — HOLD PATTERN for modifier-driven selection
// =============================================================================
/**
 * Use down()/up() when you need the key HELD across multiple subsequent
 * actions — e.g. holding Shift while pressing ArrowLeft several times to
 * extend a text selection character by character.
 */
test('14.3 — down()/up() — hold Shift while selecting text', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  await page.getByLabel('First Name').fill('Hello World');
  await page.getByLabel('First Name').focus();

  await page.keyboard.down('Shift');       // press and HOLD Shift
  await page.keyboard.press('ArrowLeft');  // Shift+ArrowLeft — select 1 char
  await page.keyboard.press('ArrowLeft');  // select another char
  await page.keyboard.press('ArrowLeft');  // select another char
  await page.keyboard.up('Shift');         // release Shift

  // Result: last 3 characters of "Hello World" are now selected
});


// =============================================================================
// 14.4 — REAL-WORLD FLOW — select, copy, paste across two fields
// =============================================================================
test('14.4 — copy text from one field and paste into another', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const sourceTextbox = page.getByRole('textbox', { name: 'Session Cookie Value' });

  // Select all + copy — locator.press() auto-focuses sourceTextbox each time
  await sourceTextbox.press('Control+A');
  await sourceTextbox.press('Control+C');

  // Paste into a different field
  const destinationTextbox = page.getByRole('textbox', { name: 'Email *' });
  await destinationTextbox.press('Control+V');
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 14
// =============================================================================
/**
 * ┌───────────────────────────┬─────────────────────────────────────┬──────────────────────────────────┐
 * │ Method                       │ Behavior                              │ When to use                          │
 * ├───────────────────────────┼─────────────────────────────────────┼──────────────────────────────────┤
 * │ locator.press(key)           │ Auto-focuses target, then presses key │ Default — scoped, predictable        │
 * │ page.keyboard.press(key)     │ Global — acts on currently focused el │ Only after explicit .focus()         │
 * │ page.keyboard.down(key)      │ Presses and HOLDS a key               │ Modifier-driven multi-step selection │
 * │ page.keyboard.up(key)        │ Releases a held key                   │ Always pair with a matching down()   │
 * │ page.keyboard.insertText()   │ Inserts text, no key events fired     │ Bypass keystroke listeners entirely  │
 * └───────────────────────────┴─────────────────────────────────────┴──────────────────────────────────┘
 */