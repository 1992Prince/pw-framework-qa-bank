### Q1) How do you upload single file and multiple files? Explain the strategy.

**Answer (in points):**

- Strategy is simple — Playwright provides `locator.setInputFiles()`, which works on an `<input type="file">` element. It directly sets the file(s) on that element programmatically, without needing to interact with the native OS file-picker dialog — this makes file upload automation fast and reliable.
- **For a single file** — I locate the file input element, and pass the file path as a **string** to `setInputFiles()`.
- **For multiple files** — I pass an **array of file paths** instead of a single string (works only if the input element has the `multiple` attribute set in the HTML).
- For the file path itself, I avoid hardcoding absolute machine-specific paths — since `artifacts` is usually right at my project root, I build the path using `path.join(process.cwd(), 'artifacts', 'fileName')`, which resolves correctly regardless of who runs the test or from where, as long as it's run from the project root (which is the default for Playwright).

```javascript
// Single file
const filePath = path.join(process.cwd(), 'artifacts', 'PW_Cheatsheet.jpg');
await page.getByTestId('single-file').setInputFiles(filePath);

// Multiple files
const filePath1 = path.join(process.cwd(), 'artifacts', 'file1.pdf');
const filePath2 = path.join(process.cwd(), 'artifacts', 'file2.docx');
await page.getByTestId('multiple-files').setInputFiles([filePath1, filePath2]);
```

---

### Q2) How do you remove uploaded files? Explain the strategy.

**Answer (in points):**

- If files are already selected on a file input element (either pre-filled by default, or selected earlier in my own test flow), I can clear/remove them by calling `setInputFiles()` again, but this time passing an **empty array `[]`**.
- This tells Playwright "set zero files on this input" — effectively resetting/clearing whatever was selected before.
- Common use case — testing the "no file selected" validation state of a form, or resetting the field before uploading a different file in the same test.

```javascript
// Remove all selected files from the input
await page.getByLabel('Upload file').setInputFiles([]);
```

---

### Q3) How do you download a file and save it at a specific folder? Explain the strategy.

**Answer (in points):**

- The strategy follows the same core pattern as handling new tabs/windows — **register the listener before performing the action** that triggers the event, because the event can fire very quickly and get missed otherwise.
- **Step 1** — Register `page.waitForEvent('download')` before clicking the download trigger element. This sets up a listener waiting for a `'download'` event.
- **Step 2** — Perform the click action that actually starts the download.
- **Step 3** — Await the promise to get a `Download` object. At this point, Playwright has already captured the file internally in a **temporary location**, not in my project folder yet.
- **Step 4** — Decide the save path. I either give a custom file name myself, or use `download.suggestedFilename()` to get the file name the server/app intended to use — so I don't have to hardcode it.
- **Step 5** — Call `download.saveAs(path)`. This doesn't trigger the download again — it simply **copies** the already-captured file from Playwright's temporary location to the exact path I specify. It automatically waits until the download is fully complete before copying — no fixed timeout, it just waits till done or throws an error if it never completes.

```javascript
const downloadPromise = page.waitForEvent('download'); // listener registered BEFORE the click
await page.locator('#downloadButton').click();         // action that triggers the download
const download = await downloadPromise;                // get the Download object once captured

const downloadPath = `./downloads/${download.suggestedFilename()}`; // build save path with server's file name
await download.saveAs(downloadPath); // copy file from temp location to our specified path
```

**One-line summary for interview**: "I register the `'download'` event listener before the trigger action, capture the `Download` object once it fires, then use `saveAs()` to copy that captured file from Playwright's temporary storage to my own specified folder — using `suggestedFilename()` so I don't have to hardcode the file name."
