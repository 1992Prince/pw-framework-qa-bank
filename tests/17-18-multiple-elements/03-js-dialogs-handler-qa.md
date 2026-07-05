### Notes — Handling JS Dialogs (alert, confirm, prompt)

#### Types of JS dialogs

- `alert()` — shows a message with only an **OK** button.
- `confirm()` — shows a message with **OK** and **Cancel** buttons, returns true/false.
- `prompt()` — shows a message with an **input field** + OK/Cancel, lets the user type a value.

#### Key behavior points

- By default, Playwright **auto-dismisses** all dialogs — so if you don't register a handler, the test won't hang, but you also won't get to interact with the dialog's content.
- To actually handle a dialog (read its message, accept/dismiss it, enter a value), register a **dialog handler before** the action that triggers it.
- The event to listen for is `'dialog'`, and it's a **page-level event** — because the dialog appears in the context of a specific page, not the whole browser context.

#### Methods available on the `dialog` object

MethodPurpose`dialog.message()`Reads the dialog's message text (synchronous — no `await` needed)`dialog.accept()`Clicks OK (async — `await` required)`dialog.accept('value')`Clicks OK and types a value (only meaningful for `prompt()`)`dialog.dismiss()`Clicks Cancel (async — `await` required)`dialog.defaultValue()`Returns the pre-filled default text already present in a `prompt()` box (not what you typed via `accept()`)`dialog.type()`Returns the type of dialog — `'alert'`, `'confirm'`, `'prompt'`, or `'beforeunload'`

#### `page.on('dialog')` pattern — when same handling is needed throughout the flow

If the requirement is "accept every JS alert that appears throughout this test flow," use `.on()` instead of `waitForEvent()`, since `.on()` stays active continuously:

javascript

```
page.on('dialog', dialog => dialog.accept());
await page.getByRole('button').click();
```

The listener must always be registered **before** the action that triggers the dialog.

---

### Interview Q&A (speakable format)

**Q1) What is the difference between `alert()`, `confirm()`, and `prompt()`?**

- `alert()` — only shows a message with an OK button, used just to notify the user.
- `confirm()` — shows a message with OK and Cancel, used to get a yes/no decision from the user.
- `prompt()` — shows a message with an input field plus OK/Cancel, used to collect a text value from the user.

**Q2) Explain your approach to accept different kinds of JS prompts via Playwright.**

- I register a `'dialog'` event listener on the page **before** performing the action that's going to trigger the dialog — this is mandatory, otherwise Playwright auto-dismisses it before I get a chance to handle it.
- Inside the listener, I read the message via `dialog.message()`, and depending on the dialog type, I either call `dialog.accept()` to click OK, or `dialog.dismiss()` to click Cancel.
- If it's a `prompt()`, I pass a value into `accept('some value')` so it types that value into the input box before clicking OK.

**Q3) How do you get the text message of a prompt, get its default value, enter a value into it, and fetch the latest value?**

- Message: `dialog.message()` — gives the question text being asked.
- Default value: `dialog.defaultValue()` — gives whatever was pre-filled in the prompt box by the page itself.
- Entering a value: pass it as an argument to `dialog.accept('my value')` — this both fills the value and clicks OK in one step.
- There isn't a separate method to "fetch the latest value after entering it" — since `accept()` immediately submits the dialog, the value I pass into `accept()` is essentially the final value used. If I need to verify it was used correctly, I'd validate it from the resulting page state afterward (e.g., an input field on the page now shows that value).

**Q4) Why do we handle the dialog event at page level, not context level?**

- A JS dialog (alert/confirm/prompt) is triggered by JavaScript running on a specific page — it's tied to that page's window, not shared across the whole browser context.
- So Playwright exposes `'dialog'` as a page-level event, since it's scoped to wherever the dialog actually appears.

**Q5) Why do we use `page.on()` for the dialog event and not `page.waitForEvent()`?**

- Playwright auto-dismisses dialogs by default almost immediately when they appear — there's very little time window to react.
- `page.on()` registers a persistent, always-active listener, so the moment the dialog appears, it's caught instantly — no risk of missing it.
- `waitForEvent()` could technically work in simple one-time cases, but `.on()` is the safer and more standard choice because dialogs can sometimes fire unpredictably or get auto-dismissed before a one-time `await` even gets scheduled — `.on()` removes that risk entirely and is the officially recommended pattern for dialogs in Playwright docs.

**Q6) Suppose we use `page.on('dialog')` to accept JS dialogs in our flow, but later we want to turn this off and then restart the listener — how do we do it?**

- Since `.on()` registers a **persistent listener** that stays active for the entire flow, if I want to stop it at some point, I use `page.off('dialog', handlerFunction)` — this removes that specific listener.
- One important thing — to properly remove it with `.off()`, the handler should ideally be a **named function reference** (not an inline anonymous function), because `.off()` needs to match the exact same function reference that was passed to `.on()` in order to unregister it correctly.
- Once `.off()` is called, the listener stops catching dialog events — so if a dialog appears after this point and no other listener is active, it'll go back to Playwright's **default auto-dismiss** behavior.
- If later in the flow I need dialog handling again, I simply call `page.on('dialog', ...)` again — **before** the action that's going to trigger that next dialog, same as the first time.
- So the pattern is: `on()` → `off()` → `on()` again whenever needed — register, remove, re-register, each time making sure the listener is set up **before** the triggering action.

```
test("TC004 — turn dialog listener on, off, then on again", async ({ page }) => {
	await page.goto('https://gauravkhurana.com/practise-api/ui/index.html#/practice');

	// Define handler as a named function so it can be referenced later in off()
	const dialogHandler = async (dialog) => {
		console.log(dialog.message());
		await dialog.accept();
	};

	// STEP 1: Register listener BEFORE the action that triggers the dialog
	page.on('dialog', dialogHandler);
	await page.getByTestId('show-alert').click(); // handled by dialogHandler

	// STEP 2: Turn off the listener — must pass the SAME function reference
	page.off('dialog', dialogHandler);

	// At this point, if a dialog appears, Playwright will auto-dismiss it
	// by default since no listener is active

	// STEP 3: Restart the listener again BEFORE the next action that triggers a dialog
	page.on('dialog', dialogHandler);
	await page.getByTestId('show-confirm').click(); // handled by dialogHandler again
});
```

**Key point to emphasize in interview:**

- `.off()` always needs the exact same function reference used in `.on()` — passing an inline anonymous function in `.on()` makes it impossible to remove later, since there's no reference to match against. That's why I always extract the handler into a named variable/function when I know I might need to turn it off later.
