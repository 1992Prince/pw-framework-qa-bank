import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────
// TC001 — Handle JS alert() dialog
// ─────────────────────────────────────────────────────────────
test("TC001 — handle alert", async ({ page }) => {
  await page.goto('https://gauravkhurana.com/practise-api/ui/index.html#/practice');

  // Register the dialog listener BEFORE the action that triggers it.
  // We use page.on() here (not waitForEvent) because Playwright auto-dismisses
  // dialogs by default — we need a persistent listener ready to catch it
  // the instant it appears, otherwise the dialog gets auto-dismissed.
  page.on('dialog', async (dialog) => {
    // dialog.message() is synchronous — it just reads a property, no await needed
    console.log(dialog.message()); // e.g. "This is an alert message!"

    // dialog.accept() is asynchronous — it performs a real browser action, so await is required
    await dialog.accept();

    // Note: alert() only has an "OK" button, no Cancel —
    // so dialog.dismiss() is not really applicable here (accept() is enough)
  });

  await page.getByTestId('show-alert').click();
});


// ─────────────────────────────────────────────────────────────
// TC002 — Handle JS confirm() dialog
// ─────────────────────────────────────────────────────────────
test("TC002 — handle confirm", async ({ page }) => {
  await page.goto('https://gauravkhurana.com/practise-api/ui/index.html#/practice');

  page.on('dialog', async (dialog) => {
    console.log(dialog.message()); // e.g. "Do you want to proceed?"

    await dialog.accept();
    // confirm() has both OK and Cancel —
    // use dialog.dismiss() instead of accept() if you want to simulate clicking "Cancel"
  });

  await page.getByTestId('show-confirm').click();
});


// ─────────────────────────────────────────────────────────────
// TC003 — Handle JS prompt() dialog
// ─────────────────────────────────────────────────────────────
test("TC003 — handle prompt", async ({ page }) => {
  await page.goto('https://gauravkhurana.com/practise-api/ui/index.html#/practice');

  page.on('dialog', async (dialog) => {
    console.log(dialog.message()); // e.g. "Please enter your name:"

    // For prompt(), accept() takes an optional value — this is what gets
    // typed into the input field of the prompt before clicking OK
    await dialog.accept('John Doe');

    // dialog.defaultValue() returns the value that was PRE-FILLED in the prompt
    // box (i.e., the default text the browser shows), NOT what we just entered.
    console.log('Prompt default value was: ', dialog.defaultValue());

    // dialog.dismiss() can be used instead if we want to simulate clicking "Cancel"
  });

  await page.getByTestId('show-prompt').click();
});