import { test, expect } from "@playwright/test";

// [EXTRA]
test("TC00 - Select all checkboxes using accessbility locators and fetch their labels", async ({
  page,
}) => {
  await page.goto("https://freelance-learn-automation.vercel.app/signup");

  // here we are locating all checkboxes elements
  let allCheckboxes = page.getByRole("checkbox");

  // waiting for first checkbox to be visible on the page
  await allCheckboxes.first().waitFor();

  // count() don't have auto-waiting so we are using waitFor()
  // to make sure that at least one checkbox is visible on the page
  // before counting all checkboxes
  let count = await allCheckboxes.count();

  console.log("Total checkboxes: " + count);

  /*
📌 Fetching Associated Label Text for a Checkbox (Playwright)

1. getByRole('checkbox') locates the actual <input type="checkbox"> element,
   NOT the associated <label> element.

2. Since an <input> is a void element (it cannot contain text),
   calling textContent() or innerText() on it returns null/empty.

3. In most HTML structures, the checkbox label is a sibling of the checkbox
   (or is associated using the 'for' attribute), so its text is not inside
   the <input> element.

4. One common approach is:
   - Start from the checkbox (<input>).
   - Go up to its parent using '..'.
   - Go up another level using '../..' (if required by the DOM structure).
   - From there, locate the sibling <label> element.
   - Fetch its text using textContent() or innerText().

   Example:
   const labelText = await checkbox
       .locator('../..')      // Move to common parent
       .locator('label')      // Locate sibling label
       .textContent();

5. Prefer using the label's 'for' attribute (mapped to the input's 'id')
   whenever available, as it is more stable than relying on DOM traversal.
*/
  for (let i = 0; i < count; i++) {
    const text = await allCheckboxes
      .nth(i)
      .locator("../..") // Go to interest-div
      .locator("label") // Find sibling label
      .textContent();
    console.log("Text of checkbox - ", text);

    await allCheckboxes.nth(i).check();
  }

  await page.pause();
});

// Locating Multiple Elements with the Same Selector - and click on all checkboxes and fetch their labels
test("TC008.2 - Locating Multiple Elements with the Same Selector - and click on all checkboxes and fetch their labels", async ({
  page,
}) => {
  await page.goto("https://freelance-learn-automation.vercel.app/signup");

  let parentDivEle = page.locator(".interests-div");

  // this parent have all child checkbboxes

  // fetch all text from chekboxes
  let allCheckboxesLabel = parentDivEle.locator(".interest-div");

  await allCheckboxesLabel.first().waitFor();

  let count = await allCheckboxesLabel.count();
  console.log("Total checkboxes: " + count);

  for (let i = 0; i < (await allCheckboxesLabel.count()); i++) {
    // fetching text of checkbox
    const text = await allCheckboxesLabel.nth(i).textContent();
    console.log("Text of checkbox - ", text);

    // performing click
    await allCheckboxesLabel.nth(i).click();
  }

  await page.waitForTimeout(5000);
});

test("TC008.3 -  Print all `href` values from every hyperlink", async ({
  page,
}) => {
  await page.goto("https://www.naukri.com/");

  // //a[@href] will locate all hyperlinks on the page that have an href attribute
  // //a is the tag name for hyperlinks in HTML and if we locate all links

  // //a            -> All <a> elements (with or without href)
  // //a[@href]     -> Only <a> elements that have an href attribute
  let allHyperlinks = page.locator("//a[@href]");

  await allHyperlinks.first().waitFor();

  let count = await allHyperlinks.count();
  console.log("Total hyperlinks: " + count);

  for (let i = 0; i < count; i++) {
    const href = await allHyperlinks.nth(i).getAttribute("href");

    let text = await allHyperlinks.nth(i).textContent();

    console.log(
      "Href of hyperlink - ",
      href,
      " and text of hyperlink - ",
      text,
    );
  }

  await page.waitForTimeout(5000);
});

test("TC008.4 - Find all images and print all its src attribute values", async ({
  page,
}) => {
  await page.goto("https://www.naukri.com/");

  // img tag and src attribute
  // //img[@src] will locate all images on the page that have a src attribute
  let allImages = page.locator("//img[@src]");

  await allImages.first().waitFor();

  let count = await allImages.count();
  console.log("Total images: " + count);

  for (let i = 0; i < count; i++) {
    const src = await allImages.nth(i).getAttribute("src");
    let altText = await allImages.nth(i).getAttribute("alt");
    console.log("Src of image - ", src, " and alt text of image - ", altText);
  }

  await page.waitForTimeout(5000);
});

test("TC008.5 - Finding elements from auto-suggestions", async ({ page }) => {
  // ─────────────────────────────────────────────────────────────
  // APPROACH: How to Automate Auto-Suggestions
  // ─────────────────────────────────────────────────────────────
  // 1. Type SLOWLY using pressSequentially() — not fill()
  //    → fill() set s value instantly, dropdown may not trigger
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


/*
📌 Logic to Find Broken Links

1. Locate all hyperlinks that have an 'href' attribute.
   XPath: //a[@href]

2. Iterate through each hyperlink.

3. Fetch the value of its 'href' attribute.

4. Ignore links whose href is:
   - null
   - empty ("")
   - starts with "javascript:"
   - starts with "mailto:"
   - starts with "tel:"

5. Send an HTTP request (HEAD or GET) to each valid URL.

6. Check the HTTP response status code.

7. If the response status code is:
   - 200–399 → Link is valid.
   - 400 or above → Link is broken.

Examples:
200 -> OK
301 -> Redirect
302 -> Redirect
404 -> Not Found (Broken)
500 -> Internal Server Error (Broken)
503 -> Service Unavailable (Broken)
*/
test("TC008.6 -  Print all `href` values from every hyperlink and broken links", async ({
  page,
}) => {
  await page.goto("https://www.naukri.com/");

  let allHyperlinks = page.locator("//a[@href]");

  await allHyperlinks.first().waitFor();

  let count = await allHyperlinks.count();
  console.log("Total hyperlinks: " + count);

  for (let i = 0; i < count; i++) {
    const href = await allHyperlinks.nth(i).getAttribute("href");

    if (
        !href ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
    ) {
        continue;
    }

    const response = await page.request.get(href.trim());

    if (response.status() >= 400) {
      console.log("❌ Broken Link");
     } // else {
    //   console.log("✅ Valid Link");
    // }
  }

  await page.waitForTimeout(5000);
});
