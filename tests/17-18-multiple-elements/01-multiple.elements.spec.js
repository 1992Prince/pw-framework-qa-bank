import { test, expect } from "@playwright/test";

test("TC001 - Locator Lazy Initialization", async ({ page }) => {
  // ─────────────────────────────────────────────────────────────
  // CONCEPT: Lazy Initialization of Locators in Playwright
  // ─────────────────────────────────────────────────────────────
  // In Playwright, when you create a locator using page.locator(),
  // it does NOT immediately search for the element in the DOM.
  // This behavior is called "Lazy Initialization".
  //
  // Lazy Initialization means:
  //   → The locator is just a REFERENCE / POINTER to an element
  //   → No actual DOM lookup happens at the time of creation
  //   → The element is only searched when you PERFORM AN ACTION on it
  //     (e.g., click(), fill(), isVisible(), etc.)
  //
  // This is different from Selenium where findElement() immediately
  // throws NoSuchElementException if element is not found.
  // ─────────────────────────────────────────────────────────────

  // Step 1: Navigate to the signup page
  await page.goto("https://freelance-learn-automation.vercel.app/signup");

  // ─────────────────────────────────────────────────────────────
  // Step 2: Create a locator with an INTENTIONALLY WRONG selector
  // ─────────────────────────────────────────────────────────────
  // NOTE: Even though '#anyincorrectlocator' does NOT exist on the page,
  // Playwright will NOT throw any error here.
  // It simply stores the selector string as a reference.
  // No DOM search happens at this line.
  // ─────────────────────────────────────────────────────────────
  const errorMessage = page.locator("#anyincorrectlocator");

  // ─────────────────────────────────────────────────────────────
  // Step 3: WHY DOES THE TEST PASS TILL HERE?
  // ─────────────────────────────────────────────────────────────
  // Because we have only CREATED the locator reference above.
  // We have NOT performed any action on it yet.
  // Playwright has not gone into the DOM to search for this element.
  // So no error is thrown → test continues → test PASSES up to this point.
  // ─────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────
  // Step 4: WHAT HAPPENS WHEN WE PERFORM AN ACTION?
  // ─────────────────────────────────────────────────────────────
  // The moment you uncomment the line below and perform .click(),
  // Playwright will NOW go into the DOM and search for '#anyincorrectlocator'.
  // Since it doesn't exist → Playwright will keep RETRYING for 30 seconds
  // (default actionTimeout) → and then throw:
  //
  //   TimeoutError: locator.click: Timeout 30000ms exceeded
  //   waiting for locator('#anyincorrectlocator')
  //
  // This is the AUTO-WAIT + AUTO-RETRY behavior of Playwright locators.
  // ─────────────────────────────────────────────────────────────

  // await errorMessage.click(); // ← Uncomment this to see the TimeoutError

  // ─────────────────────────────────────────────────────────────
  // KEY TAKEAWAY SUMMARY:
  // ─────────────────────────────────────────────────────────────
  // page.locator()  → Lazy — just stores selector, no DOM search
  // .click()        → Triggers actual DOM search + auto-wait + auto-retry
  // .fill()         → Same — triggers DOM search
  // .isVisible()    → Same — triggers DOM search
  //
  // Playwright Locator Lifecycle:
  //   1. Create locator  → No DOM lookup (Lazy)
  //   2. Call action     → DOM lookup starts
  //   3. Element found   → Action performed → Test passes
  //   4. Element not found within timeout → TimeoutError → Test fails
  //
  // Compare with Selenium:
  //   driver.findElement(By.id("wrong")) → IMMEDIATELY throws error
  //   Playwright page.locator("wrong")   → NO error until action is called
  // ─────────────────────────────────────────────────────────────
});

test("TC002 - Locating Multiple Elements with the Same Selector - and click on all checkboxes", async ({
  page,
}) => {
  // ─────────────────────────────────────────────────────────────
  // CONCEPT: Handling Multiple Elements with the Same Locator
  // ─────────────────────────────────────────────────────────────
  // In Playwright, page.locator() can match MULTIPLE elements
  // at once when multiple elements share the same selector.
  //
  // Unlike strict mode (which throws error for 2+ elements on
  // single-action locators), when you intentionally want to
  // work with multiple elements — you use .count(), .nth(),
  // .all(), etc. to handle them collectively.
  //
  // Key point: Even with multiple matches, page.locator() is
  // still LAZY — no DOM search happens until an action is called.
  // ─────────────────────────────────────────────────────────────

  // Step 1: Navigate to the signup page
  await page.goto("https://freelance-learn-automation.vercel.app/signup");

  // ─────────────────────────────────────────────────────────────
  // Step 2: Create a locator that will match ALL checkboxes
  // ─────────────────────────────────────────────────────────────
  // We are using XPath selector to find all input elements
  // of type 'checkbox' on the page.
  //
  // NOTE: This returns a single Locator OBJECT that internally
  // represents ALL matching elements — not an array.
  // It is still LAZY at this point — no DOM search yet.
  // ─────────────────────────────────────────────────────────────
  const allCheckboxes = page.locator("//input[@type='checkbox']");

  // ─────────────────────────────────────────────────────────────
  // Step 3: Try to count checkboxes BEFORE waiting — Wrong approach
  // ─────────────────────────────────────────────────────────────
  // .count() DOES trigger a DOM search (unlike just creating locator)
  // BUT the page/elements may not be fully loaded yet at this point.
  //
  // Result: count = 0 (even though checkboxes DO exist on the page)
  //
  // WHY? Because the page is loaded (HTML received) but the
  // JavaScript/dynamic content rendering is still in progress.
  // The DOM elements are not yet painted/attached when .count()
  // is called immediately after page.goto().
  //
  // LESSON: Never call .count() immediately after navigation
  // without waiting — you will get 0 or incorrect count.
  // ─────────────────────────────────────────────────────────────
  let count = await allCheckboxes.count();
  console.log(`[WRONG] Count before waiting: ${count}`);
  // Output → There are 0 checkboxes on the page.  ← INCORRECT!

  // ─────────────────────────────────────────────────────────────
  // Step 4: Wait for at least FIRST element to be visible
  // ─────────────────────────────────────────────────────────────
  // RULE: When dealing with multiple elements, ALWAYS wait for
  // at least the FIRST element to be visible before calling .count()
  //
  // Why first()? Because if even the first element is visible,
  // it confirms that the list has rendered in the DOM.
  // After that, .count() will return the correct total.
  //
  // waitFor() vs waitForSelector():
  // ┌─────────────────────┬─────────────────────────────────────┐
  // │ waitFor()           │ Method on LOCATOR object            │
  // │                     │ Waits for element to reach a state: │
  // │                     │ 'visible' | 'hidden' |              │
  // │                     │ 'attached' | 'detached'             │
  // │                     │ USE when you already have a locator │
  // ├─────────────────────┼─────────────────────────────────────┤
  // │ waitForSelector()   │ Method on PAGE object               │
  // │                     │ Waits for a CSS/XPath selector to   │
  // │                     │ appear in the DOM                   │
  // │                     │ USE when you don't have a locator   │
  // │                     │ and want to wait by selector string │
  // └─────────────────────┴─────────────────────────────────────┘
  //
  // Since we already have 'allCheckboxes' locator → use waitFor()
  // ─────────────────────────────────────────────────────────────
  await allCheckboxes.first().waitFor({ state: "visible" });
  // Now we are confident that checkboxes are rendered in the DOM

  // ─────────────────────────────────────────────────────────────
  // Step 5: Get correct count AFTER waiting
  // ─────────────────────────────────────────────────────────────
  // .count() — Returns the total number of elements matching
  // the locator at this point in time.
  // Since we waited for visibility above, DOM is fully loaded now.
  // ─────────────────────────────────────────────────────────────
  count = await allCheckboxes.count();
  console.log(`[CORRECT] Count after waiting: ${count}`);
  // Output → There are 14 checkboxes on the page.  ← CORRECT!

  // ─────────────────────────────────────────────────────────────
  // Step 6: Iterate and click ALL checkboxes using a for loop
  // ─────────────────────────────────────────────────────────────
  // We use a standard for loop with .nth(i) to access each
  // checkbox by its index (0-based).
  //
  // .nth(i) — Returns a locator pointing to the i-th element
  // out of all matched elements (0 = first, count-1 = last)
  //
  // Loop options available in JS for this use case:
  //   → for loop         ✅ Best — index control with .nth(i)
  //   → for...of loop    ✅ Works with await allCheckboxes.all()
  //   → forEach()        ❌ Does NOT work well with async/await
  //   → while / do-while ✅ Works but verbose
  //
  // We use for loop here because .nth(i) needs the index.
  // ─────────────────────────────────────────────────────────────
  for (let i = 0; i < count; i++) {
    // Get the i-th checkbox locator using .nth()
    // nth(0) = first checkbox, nth(1) = second, and so on
    const checkbox = allCheckboxes.nth(i);

    // Click each checkbox — await is required because
    // .click() returns a Promise (async DOM action)
    await checkbox.click();

    console.log(`Clicked checkbox ${i + 1} of ${count}`);
  }

  // ─────────────────────────────────────────────────────────────
  // Step 7: Wait to visually observe the result
  // ─────────────────────────────────────────────────────────────
  // This is only for DEMO/DEBUG purposes — to see all checkboxes
  // checked before the browser closes at end of test.
  // DO NOT use page.waitForTimeout() in real test suites —
  // use proper assertions or waitFor() instead.
  // ─────────────────────────────────────────────────────────────
  await page.waitForTimeout(10000);

  // ─────────────────────────────────────────────────────────────
  // KEY TAKEAWAY SUMMARY:
  // ─────────────────────────────────────────────────────────────
  // 1. page.locator() with multiple matches → still LAZY (no DOM search)
  // 2. .count() immediately after goto() → returns 0 (elements not loaded)
  // 3. ALWAYS wait for first().waitFor({ state: 'visible' }) before .count()
  // 4. .nth(i) → access elements by index (0-based)
  // 5. Use for loop with .nth(i) for iterating multiple elements
  // 6. forEach() does NOT work with async/await — avoid it
  // 7. waitFor() → on Locator | waitForSelector() → on Page object
  // ─────────────────────────────────────────────────────────────
});

test("TC003 - Find all hyper links and print all its href attribute values", async ({
  page,
}) => {
  // ─────────────────────────────────────────────────────────────
  // CONCEPT: Reading Attributes from Multiple Elements
  // ─────────────────────────────────────────────────────────────
  // In this test we learn how to:
  //   1. Find ALL anchor tags that have an href attribute
  //   2. Wait for elements to load before counting
  //   3. Loop through each link and READ its attribute value
  //      using .getAttribute()
  //
  // This is a very common real-world scenario:
  //   → Verify all links are present on a page
  //   → Validate no broken links (href should not be null/empty)
  //   → Extract all URLs for further processing
  // ─────────────────────────────────────────────────────────────

  // Step 1: Navigate to Naukri homepage
  // Naukri is a content-heavy page with lots of anchor tags —
  // perfect to practice finding and reading multiple elements
  await page.goto("https://www.naukri.com/");

  // ─────────────────────────────────────────────────────────────
  // Step 2: Create locator for ALL anchor tags that have href
  // ─────────────────────────────────────────────────────────────
  // XPath used: //a[@href]
  //
  // Breaking down the XPath:
  //   //       → Search anywhere in the entire DOM (not just root)
  //   a        → Match <a> anchor tag elements
  //   [@href]  → But ONLY those that have an 'href' attribute
  //              (this filters out <a> tags without href — e.g., anchor links)
  //
  // Why filter by [@href]?
  //   → Some <a> tags are used as buttons or placeholders with no href
  //   → We only want actual navigable links with a real URL
  //   → [@href] ensures we only capture meaningful links
  //
  // NOTE: Still LAZY at this point — no DOM search yet
  // ─────────────────────────────────────────────────────────────
  const allLinks = page.locator("//a[@href]");

  // ─────────────────────────────────────────────────────────────
  // Step 3: Wait for at least the FIRST link to be visible
  // ─────────────────────────────────────────────────────────────
  // Naukri is a dynamic, JavaScript-heavy page.
  // Even after page.goto() resolves, DOM elements may still
  // be rendering (lazy loading, JS injection, etc.)
  //
  // If we call .count() without waiting:
  //   → We may get 0 or incorrect/partial count
  //
  // Solution: Wait for first().waitFor({ state: 'visible' })
  //   → This confirms at least one <a href> is in the DOM
  //   → After this, .count() gives the correct total
  //
  // state options for waitFor():
  //   'visible'  → element is visible on screen        ✅ use this most
  //   'attached' → element exists in DOM (may be hidden)
  //   'hidden'   → element is hidden or removed
  //   'detached' → element is removed from DOM
  // ─────────────────────────────────────────────────────────────
  await allLinks.first().waitFor({ state: "visible" });

  // ─────────────────────────────────────────────────────────────
  // Step 4: Get total count of all links AFTER waiting
  // ─────────────────────────────────────────────────────────────
  // .count() — returns the number of elements currently
  // matching the locator in the DOM.
  // Since we waited above, this will now return the correct count.
  // ─────────────────────────────────────────────────────────────
  const count = await allLinks.count();
  console.log(`Total links on the page: ${count}`);
  // Output → Total links on the page: 150+ (varies by page load)

  // ─────────────────────────────────────────────────────────────
  // Step 5: Loop through ALL links and read their href value
  // ─────────────────────────────────────────────────────────────
  // We use a standard for loop with .nth(i) to access each link.
  //
  // Inside the loop:
  //   → allLinks.nth(i)        → get locator for i-th link (0-based)
  //   → link.getAttribute()    → read the value of a specific attribute
  //
  // .getAttribute("href"):
  //   → Returns the value of the 'href' attribute as a STRING
  //   → Returns null if the attribute doesn't exist
  //   → It returns a Promise → so we need await
  //   → Unlike .textContent() or .innerText(), getAttribute()
  //      reads the RAW HTML attribute value exactly as written
  //      in the DOM (even if it's a relative path like '/jobs')
  //
  // Real-world use:
  //   → You can extend this loop to validate each href:
  //      - Is it null or empty? → broken link
  //      - Does it start with https? → secure link
  //      - Does it contain expected domain? → correct navigation
  // ─────────────────────────────────────────────────────────────
  for (let i = 0; i < count; i++) {
    // Get locator for the i-th anchor element
    // nth(0) = first link, nth(1) = second link, and so on
    const link = allLinks.nth(i);

    // Read the 'href' attribute value from this element
    // await is required — getAttribute() returns a Promise
    const href = await link.getAttribute("href");

    // Print each link with its index number (1-based for readability)
    console.log(`Link ${i + 1}: ${href}`);

    // Example output:
    // Link 1: https://www.naukri.com/
    // Link 2: /jobs-in-india
    // Link 3: https://www.naukri.com/jobseeker/help
    // Link 4: null  ← anchor tag with href but empty value
  }

  // ─────────────────────────────────────────────────────────────
  // Step 6: Wait to visually observe (DEMO only)
  // ─────────────────────────────────────────────────────────────
  // Only for learning/demo — DO NOT use in real test suites.
  // Use proper assertions instead of fixed timeouts.
  // ─────────────────────────────────────────────────────────────
  await page.waitForTimeout(10000);

  // ─────────────────────────────────────────────────────────────
  // KEY TAKEAWAY SUMMARY:
  // ─────────────────────────────────────────────────────────────
  // 1. XPath //a[@href]    → selects ALL anchor tags WITH href attribute
  // 2. [@href]             → attribute filter in XPath — only elements
  //                          that HAVE this attribute are selected
  // 3. Always waitFor()    → before .count() on dynamic pages
  // 4. .getAttribute()     → reads raw HTML attribute value as string
  //                          returns null if attribute is missing
  //                          needs await (returns Promise)
  // 5. .nth(i)             → access i-th element in matched list (0-based)
  // 6. for loop + .nth(i)  → standard pattern for iterating multiple elements
  //
  // getAttribute() vs textContent() vs innerText():
  // ┌─────────────────┬──────────────────────────────────────────┐
  // │ getAttribute()  │ Reads raw HTML attribute value           │
  // │                 │ e.g., href, src, class, id, value        │
  // ├─────────────────┼──────────────────────────────────────────┤
  // │ textContent()   │ Reads ALL text inside element including  │
  // │                 │ hidden text and child elements           │
  // ├─────────────────┼──────────────────────────────────────────┤
  // │ innerText()     │ Reads only VISIBLE text as rendered      │
  // │                 │ on screen (respects CSS display)         │
  // └─────────────────┴──────────────────────────────────────────┘
  // ─────────────────────────────────────────────────────────────
});

test("TC004 - Find all images and print all its src attribute values", async ({
  page,
}) => {
  await page.goto("https://www.naukri.com/");

  // xpath for all images having src tag - //img[@src]
  const allImages = page.locator("//img[@src]");
  await allImages.first().waitFor({ state: "visible" });
  const count = await allImages.count();
  console.log(`Total images on the page: ${count}`);

  for (let i = 0; i < count; i++) {
    const image = allImages.nth(i);
    const src = await image.getAttribute("src");
    console.log(`Image ${i + 1}: ${src}`);
  }

  await page.waitForTimeout(10000);
});

test("TC005 - Finding elements from auto-suggestions", async ({ page }) => {
  // ─────────────────────────────────────────────────────────────
  // APPROACH: How to Automate Auto-Suggestions
  // ─────────────────────────────────────────────────────────────
  // 1. Type SLOWLY using pressSequentially() — not fill()
  //    → fill() sets value instantly, dropdown may not trigger
  //    → pressSequentially() mimics real keyboard input
  //       which fires keydown/keyup events → triggers suggestions
  //
  // 2. Write a COMMON locator that captures ALL dropdown options
  //    → role='option' is the standard ARIA role for dropdown items
  //
  // 3. Wait for first option → count → iterate → read text
  //
  // 4. Match text using includes() → click desired option
  // ─────────────────────────────────────────────────────────────

  await page.goto("https://www.google.com/");

  // Step 1: Type slowly into search box to trigger auto-suggestions
  // pressSequentially() fires real keyboard events → dropdown appears
  await page.locator("#APjFqb").pressSequentially("Mukesh Otwani");

  // Step 2: Locate ALL suggestion options using common locator
  // role='option' is standard ARIA role assigned to dropdown items
  const allOptions = page.locator("//div[@role='option']");

  // Step 3: Wait for suggestions to appear + get count
  await allOptions.first().waitFor({ state: "visible" });
  const count = await allOptions.count();
  console.log(`Total auto-suggestions: ${count}`);

  // Step 4: Print all available suggestion texts
  for (let i = 0; i < count; i++) {
    const text = await allOptions.nth(i).textContent();
    console.log(`Option ${i + 1}: ${text.trim()}`);
  }

  // Step 5: Click the option that contains "github" in its text
  // .trim()     → removes leading/trailing whitespace from text
  // .includes() → checks if text contains our target keyword
  for (let i = 0; i < count; i++) {
    const option = allOptions.nth(i);
    const text = await option.textContent();
    if (text.trim().includes("github")) {
      await option.click();
      break; // ← stop loop once desired option is clicked
    }
  }

  await page.waitForTimeout(10000);
});


test("TC006 - Date Picker Selection [Auto-suggestion approach]", async ({ page }) => {
  // ============ STEP 1: Navigate to Date Picker Page ============
  // Purpose: Open the date picker form page
  await page.goto("http://localhost:4200/pages/forms/datepicker");
  console.log("✅ Navigated to date picker page");

  // ============ STEP 2: Validate Page Title and URL ============
  // Purpose: Verify we are on the correct page
  await expect(page).toHaveTitle(/playwright-test-admin Demo Application/);
  console.log("✅ Page title verified");

  await expect(page).toHaveURL(/.*datepicker/);
  console.log("✅ Page URL verified");

  // ============ STEP 4: Locate and Wait for Date Input Field ============
  // Purpose: Find the date input field and ensure it's visible before interacting
  const dateInput = page.locator("//input[@placeholder='Form Picker']");
  await dateInput.waitFor({ state: "visible" });
  console.log("✅ Date input field is visible");

  // ============ STEP 5: Click on Date Input to Open Calendar ============
  // Purpose: Trigger the date picker calendar popup
  // Result: Calendar will open and display dates
  await dateInput.click();
  console.log("✅ Date picker calendar opened");

  // ============ STEP 6: Understand Calendar Structure ============
  // IMPORTANT INFORMATION:
  // - When the calendar opens, it shows dates from 3 months:
  //   1. Previous month dates (at the beginning)
  //   2. Current month dates (main dates we need to select)
  //   3. Next month dates (at the end)
  //
  // - CSS Classes identify which month dates belong to:
  //   • Previous & Next month dates: class="bounding-month day-cell ng-star-inserted"
  //   • Current month dates: class="day-cell ng-star-inserted" (WITHOUT "bounding-month")
  //
  // - Why we can't just search by text (e.g., "30")?
  //   • Same date numbers appear in multiple months (prev, current, next)
  //   • Direct text search could select wrong month's date
  //   • Example: "30" exists in previous month, current month, and possibly next month
  //
  // - Solution: Use CSS selectors to filter ONLY current month dates
  console.log("🔍 Calendar structure understood - filtering current month dates only");

  // ============ STEP 7: Create Locator to Find Current Month Dates Only ============
  // Purpose: Filter out previous and next month dates, keep only current month dates
  // Locator Logic:
  // - ".day-cell.ng-star-inserted" = selects all date cells
  // - ":not(.bounding-month)" = excludes dates that belong to previous/next month
  // - Result: Only current month dates are selected
  const currentMonthDates = page.locator(
    ".day-cell.ng-star-inserted:not(.bounding-month)"
  );
  console.log("✅ Locator created for current month dates");

  // ============ STEP 8: Wait for Current Month Dates to be Visible ============
  // Purpose: Ensure at least the first date is visible before we proceed
  await currentMonthDates.first().waitFor({ state: "visible" });
  console.log("✅ Current month dates are visible");

  // ============ STEP 9: Get Total Count of Current Month Dates ============
  // Purpose: Know how many dates are available in the current month
  // This helps validate if the calendar is working correctly
  const count = await currentMonthDates.count();
  console.log(`📊 Total dates in current month: ${count}`);
  console.log(`📊 Current month date count: ${count}`);

  // ============ STEP 10: Print All Available Current Month Dates (Debug Info) ============
  // Purpose: Log all available dates for debugging and verification
  // Optional: Remove in production, useful for debugging
  const allDates = await currentMonthDates.allTextContents();
  console.log(`📋 All available current month dates: ${allDates.join(", ")}`);

  // ============ STEP 11: Select Specific Date (30th) ============
  // Purpose: Select date "30" from the current month
  // Locator Chaining: 
  // - First filter to current month dates (done above)
  // - Then find the one with text " 30 "
  // Note: Using " 30 " (with spaces) to match exact text
  await currentMonthDates.getByText(" 30 ").click();
  console.log("✅ Date 30 selected from current month");

  // ============ STEP 12: Verify Date Selection (Optional) ============
  // Purpose: Confirm the date was successfully selected
  // This would check if the input field now shows the selected date
  const selectedDateValue = await dateInput.inputValue();
  console.log(`✅ Selected date value: ${selectedDateValue}`);

  // ============ STEP 13: Pause for Manual Inspection (Debug) ============
  // Purpose: Allow manual inspection of the selected date in the UI
  // Remove in production tests
  await page.pause();
  console.log("✅ Test paused for manual inspection");

  // ============ TEST COMPLETE ============
  console.log("✅ TC006 - Date Picker Selection test completed successfully");
});


test("TC007 — setInputFiles() — single aur multiple file upload", async ({
  page,
}) => {
  await page.goto(
    "https://gauravkhurana.com/practise-api/ui/index.html#/practice",
  );

  // ── Single file upload ─────────────────────────────────────────────────────
  // setInputFiles() directly file path set karta hai input element pe
  // Forward slash use karo — Windows pe bhi kaam karta hai
  await page
    .locator("#singleFileInput")
    .setInputFiles("D:/git/pw-fusion/artifacts/PW_Cheatsheet.jpg");

  await page.pause(); // Inspector: single file selected dikhega

  // ── Multiple files upload ─────────────────────────────────────────────────
  // Array of paths pass karo — <input type="file" multiple> ke liye
  await page
    .locator("#multiFileInput")
    .setInputFiles([
      "D:/git/pw-fusion/artifacts/PW_Cheatsheet.jpg",
      "D:/git/pw-fusion/artifacts/PW_Cheatsheet1.jpg",
    ]);

  await page.pause(); // Inspector: dono files selected dikhengi
});
