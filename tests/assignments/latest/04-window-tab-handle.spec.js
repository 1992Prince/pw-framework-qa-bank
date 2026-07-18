import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────
// TC007 — Create multiple pages in the SAME BrowserContext
// and fetch title + url of all pages via context.pages()
// ─────────────────────────────────────────────────────────────
test("TC007 — Create multiple pages in same browser context", async ({ browser }) => {
  
    // Create a single BrowserContext (acts like an isolated browser session)
  const context = await browser.newContext();

  // Create two independent Page objects (tabs/windows) inside the SAME context
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");
  await page2.goto("https://www.google.com/");

  // No need to bringToFront() to interact — but doing it here just to
  // visually demonstrate switching focus between pages while debugging
  await page1.bringToFront();
  await page1.getByTestId('form-email').fill('Gaurav');

  await page2.bringToFront();
  await page2.locator("//*[@id='APjFqb']").fill('Playwright');

  // Both pages share the same BrowserContext settings
  // (cookies, session/auth, localStorage, viewport, locale, permissions, etc.)

  // Fetch ALL pages currently open under this context
  const pages = context.pages(); // returns Page array

  for (const p of pages) {
    console.log(await p.title(), " - ", await p.url());
  }

  await context.close(); // good practice: close context when done
});


// ─────────────────────────────────────────────────────────────
// TC008 — Perform action on ONE specific page (by title match)
// and close the rest. Fixed: exact match (===) replaced with
// includes(), and logic restructured to find target FIRST.
// ─────────────────────────────────────────────────────────────
test("TC008 — perform action on particular page under browser context", async ({ browser }) => {
  const context = await browser.newContext();

  const page1 = await context.newPage();
  const page2 = await context.newPage();
  const page3 = await context.newPage();

  await page1.goto("https://www.facebook.com/");
  await page2.goto("https://www.google.com/");
  await page3.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // Get all open pages under this context
  const pages = context.pages();

  // STEP 1: Find the target page by partial title match
  // (Facebook's real title is something like "Facebook – log in or sign up",
  //  so strict equality `=== 'Facebook'` will NEVER match — use includes())
  let targetPage;
  for (const p of pages) {
    const title = await p.title();
    if (title.includes('Facebook')) {
      targetPage = p;
      break; // stop once found, no need to keep checking titles
    }
  }

  if (!targetPage) {
    throw new Error("Target page with title 'Facebook' not found");
  }

  // STEP 2: Close every page EXCEPT the target page
  for (const p of pages) {
    if (p !== targetPage) {
      await p.close();
    }
  }

  // STEP 3: Now safely perform actions only on the target page
  await targetPage.bringToFront();
  await targetPage.locator('//*[text()="Create new account"]').click();

  await context.close();
});


// ─────────────────────────────────────────────────────────────
// TC009 — Handle a SINGLE new TAB opened from a parent page
// using Promise.all() + context.waitForEvent('page')
// ─────────────────────────────────────────────────────────────
test("TC009 — Manage single Tab", async ({ browser }) => {
  const context = await browser.newContext(); // BrowserContext — isolated session
  const page = await context.newPage();        // parent page (Page object)

  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // Start listening for the 'page' event BEFORE the click,
  // so Playwright doesn't miss the new tab being created.
  // Promise.all() runs both async operations together:
  //   1) waitForEvent('page') -> resolves with the new child Page (tab)
  //   2) click() -> the action that triggers the new tab to open
  const [newTab] = await Promise.all([
    context.waitForEvent("page"),   // wait for new tab/page creation in this context
    page.locator('#openTab').click(), // action that opens the new tab
  ]);

  // Wait for the new (child) tab to finish loading before interacting
  await newTab.waitForLoadState();

  // Perform action on the CHILD tab
  await newTab.getByText('Learn more').click();

  // Close the child tab once done with it
  await newTab.close();

  // Switch focus back to the PARENT page to continue further actions
  await page.bringToFront();

  await page.waitForTimeout(3000)

  await context.close();
});


// ─────────────────────────────────────────────────────────────
// TC010 — Handle a SINGLE new WINDOW (popup-style) opened from
// a parent page. Code pattern is IDENTICAL to handling a tab,
// because Playwright treats tab/window/popup as the SAME Page object.
// ─────────────────────────────────────────────────────────────
test("TC010 — Manage single Window", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage(); // parent page

  await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

  // Same wait-pattern as tab handling — since Playwright doesn't
  // differentiate tab vs window internally, 'page' event works for both.
  // (Could also use page.waitForEvent('popup') here since this is
  //  triggered via window.open()-style action with an opener relationship)
  const [newWindow] = await Promise.all([
    context.waitForEvent("page"),            // wait for new page/window creation
    page.getByTestId('open-window').click(), // action that opens the new window
  ]);

  // Wait for the new window to finish loading
  await newWindow.waitForLoadState();

  // Perform action on the new (child) window
  await newWindow.getByText('Learn more').click();

  // Close the child window
  await newWindow.close();

  // Bring parent page back into focus to continue the flow
  await page.bringToFront();

  await context.close();
});