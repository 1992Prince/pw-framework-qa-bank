import {test, expect} from '@playwright/test';

/*
📌 Playwright - getByRole() Notes

getByRole() locates elements based on their Accessibility Role, not just their visible text.

For getByRole() to work, the element must either:
1. Be a native HTML element that has an implicit role.
2. Explicitly define a role using the 'role' attribute.

Common mappings:

getByRole('textbox')
    ✔ <input type="text">
    ✔ <input type="email">
    ✔ <input type="password">
    ✔ <textarea>
    ✔ <div role="textbox">

getByRole('checkbox')
    ✔ <input type="checkbox">
    ✔ <div role="checkbox">

getByRole('radio')
    ✔ <input type="radio">
    ✔ <div role="radio">

getByRole('button')
    ✔ <button>
    ✔ <input type="button">
    ✔ <input type="submit">
    ✔ <input type="reset">
    ✔ <div role="button">

getByRole('combobox')
    ✔ <select>
    ✔ <input with appropriate ARIA combobox role>

getByRole('link')
    ✔ <a href="...">
    ✔ <div role="link">

💡 Note:
- getByRole() works with the Accessibility Tree, not the DOM tree.
- The 'name' option matches the Accessible Name, which can come from:
    • <label>
    • aria-label
    • aria-labelledby
    • Visible text (for elements like buttons and links)
- If an element has neither an implicit role nor an explicit 'role' attribute,
  getByRole() will NOT locate it.
*/
// Filtering children by specific text - covered below [filterd nb-card with child element text]
test('TC00A - locate element with getByRole with visible text', async ({page}) => {

    await page.goto('http://localhost:4200/pages/forms/layouts');

    // select card that has child element with text "Basic form"
    let parentCardBasicForm = page.locator('nb-card').filter({hasText: 'Basic form'});
    // page.locator('nb-card').filter({hasText: 'Basic form'}) 
    // can also be written as
    // page.locator('nb-card:has-text("Basic form")') 
    await expect(parentCardBasicForm).toBeVisible();
    await parentCardBasicForm.getByPlaceholder('Email').fill('pikachu@email.com');
    await parentCardBasicForm.getByRole('button', {name: 'SUBMIT'}).click();

    await page.pause();
});

// notes - missing
// in locator sections missed how to locate tag, css, xpath, text, tag with hastext etc in notes section
// in folder 02-navigation-locators
// do it later

test('TC00B - locate element with `getByRole` with visible text AND a state', async ({page}) => {

    await page.goto('http://localhost:4200/pages/forms/layouts');

    // select card that has child element with text "Basic form"
    let parentCardBasicForm = page.locator('nb-card').filter({hasText: 'Using the Grid'});
    await expect(parentCardBasicForm).toBeVisible();

    // validate that the radio button with name "Disabled Option" is disabled and visible on screen
    let disabledOption = parentCardBasicForm.getByRole('radio', {name: 'Disabled Option', disabled: true});
    await expect(disabledOption).toBeVisible();

    await page.pause();
});


test('TC00D - locator chaining - parent to child scope', async ({page}) => {

    await page.goto('http://localhost:4200/pages/modal-overlays/dialog');

    // locating parent element wch is nb-card
    let parentCardBasicForm = page.locator('nb-card').filter({hasText: 'Open Without Esc Close'});
    await expect(parentCardBasicForm).toBeVisible();

    await parentCardBasicForm.getByText('OPEN DIALOG WITH ESC CLOSE').click();

    await page.getByText('DISMISS DIALOG').click();

    await page.pause();

    // this way we can locate footer element in big pages and then locate its child
    // elements like all links present in at footer of page.
});


