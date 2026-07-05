### Notes — Uploading Files in Playwright

#### Concept

- File uploads are handled using the **`locator.setInputFiles()`** method.
- It targets an `<input>` element with `type="file"` — that's the only kind of element this method works on.
- `setInputFiles()` essentially simulates a user selecting one or more files in the native OS file-picker dialog, without actually opening that dialog — it directly sets the files programmatically.

---

#### Syntax — Uploading a single file

```javascript
// Upload a single file
await page.getByLabel('Upload file').setInputFiles('path/to/file.pdf');
```

- Just pass the file path as a **string**.

---

#### Syntax — Uploading multiple files

```javascript
// Upload multiple files at once
await page.getByLabel('Upload file').setInputFiles([
  'path/to/file1.pdf',
  'path/to/file2.jpg',
  'path/to/file3.docx',
]);
```

- Pass an **array of file paths** — only works if the input element has the `multiple` attribute set on it in the HTML (otherwise the browser itself won't accept more than one file).

---

#### Syntax — Clearing/removing selected files

```javascript
// Remove all the selected files
await page.getByLabel('Upload file').setInputFiles([]);
```

- Passing an **empty array** clears whatever files were already selected on that input element — useful when files are pre-selected by default and you want to reset the field before selecting new ones, or simply to test the "no file selected" state.

---

#### Quick interview summary

- Single file -> pass file path as a **string**.
- Multiple files -> pass an **array** of file paths (input must support `multiple`).
- Clear selection -> pass an **empty array `[]`**.
- Always targets an `<input type="file">` element — locate it first (via `getByLabel`, `getByTestId`, CSS, etc.), then chain `.setInputFiles()` on it.
- No need to interact with the native OS file-picker dialog — Playwright bypasses it entirely and sets the files directly, which makes file upload automation reliable and fast.
