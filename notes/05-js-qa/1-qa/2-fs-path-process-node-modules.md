## Interview Q: What are `fs`, `path`, and `process` in Node.js? Where have you used them?

### 1. `fs` (File System)

**Interview Answer:**

`fs` [file system] is a built-in Node.js module used to interact with the file system. It allows us to read, write, update, delete, and check files or folders.

**Where I have used it:**

In my Playwright framework, I've used `fs` to:

- Read test data from JSON or text files.
- Read configuration files.
- Verify whether a screenshot or report file exists.

**Example:**

```js
import fs from 'fs';

const data = fs.readFileSync('./testdata/dummy.txt', 'utf-8');
```

---

### 2. `path`

**Interview Answer:**

`path` is a built-in Node.js module used to create and resolve file paths safely. Different operating systems use different path separators (`\` on Windows and `/` on Linux/Mac). The `path` module handles these differences automatically, making the code cross-platform.

**Where I have used it:**

In my Playwright framework, I use it to:

- Build absolute paths for test data files.
- Locate downloaded files.
- Access configuration files.
- Combine it with `__dirname` so file paths work regardless of where the test is executed.

**Example:**

```js
import path from 'path';

const filePath = path.join(__dirname, 'testdata', 'dummy.txt');
```

---

Suppose your project structure is:

```text
PlaywrightProject/
│
├── testdata/
│   └── dummy.txt
│
├── tests/
│   └── login.spec.ts
│
└── package.json
```

And inside `login.spec.ts` you write:

```js
const filePath = path.join(__dirname, 'testdata', 'dummy.txt');
```

Here's what each argument means:

- **`__dirname`**
  - Gives the absolute path of the folder where the current file (`login.spec.ts`) is present.
  - Example (Windows):
    ```text
    C:\Users\Prince\PlaywrightProject\tests
    ```

- **`'testdata'`**
  - This is the folder name you want to navigate to.
  - So after getting the current folder, Node will look for the `testdata` folder.

- **`'dummy.txt'`**
  - This is the file inside the `testdata` folder that you want to access.

So `path.join()` combines all these parts and creates a complete file path:

```text
C:\Users\Prince\PlaywrightProject\testdata\dummy.txt
```

> **Note:** `path.join()` automatically uses the correct path separator (`\` on Windows and `/` on Linux/macOS), so the same code works on all operating systems.

### Follow-up Interview Question: Does `__dirname` work everywhere?

**Answer:**

No.

It depends on the module system being used.

- **CommonJS (`require`)** → `__dirname` is available by default.
- **ES Modules (`import/export`)** → `__dirname` is **not available**, and Node throws:

```
__dirname is not defined
```

In ES Modules, we recreate it manually.

```js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

---

### 3. `process`

**Interview Answer:**

`process` is a global object in Node.js, so we don't need to import it.

It provides information about the currently running Node.js process, such as:

- Environment variables
- Command-line arguments
- Current working directory
- Exit codes

**Where I have used it:**

The most common place I've used it is in my `playwright.config.ts` file to change configuration based on whether tests are running locally or in a CI/CD pipeline.

**Example:**

```js
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    headless: process.env.CI ? true : false,
  },
});
```

Here, `process.env.CI` checks whether the tests are running inside a CI pipeline like GitHub Actions or Jenkins.

Based on that, I can configure:

- Retries
- Number of workers
- Headless mode
- Base URL
- Other environment-specific settings

---

### Other common uses of `process`

```js
process.env.BASE_URL   // Read environment variables
process.argv           // Read command-line arguments
process.exit(1)        // Exit the program with an error code
```

---

## Quick Revision

| Module      | Purpose                                              | My Playwright Use Case                                              |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| `fs`      | Read/write files                                     | Reading test data, JSON files, checking reports/screenshots         |
| `path`    | Build OS-independent file paths                      | Locating test data and download files using`__dirname`            |
| `process` | Access runtime information and environment variables | Using`process.env.CI` to switch Playwright config for CI vs Local |

---

## One-line Interview Answers

- **`fs`** → Used to read, write, update, or delete files and folders.
- **`path`** → Used to build file paths safely so the code works across different operating systems.
- **`process`** → A global Node.js object used to access environment variables, command-line arguments, and runtime information. I mainly use `process.env.CI` in Playwright to configure tests differently for local and CI execution.

## Interview Q: What is `fs`, `path`, `process` in Node.js — and where do you use them?

### `fs` (File System module)

**What it is:** Built-in Node.js module used to interact with the file system — read, write, delete, check existence of files/folders.

**Where I use it:** In my Playwright framework, I use `fs` to read text/JSON test data files, read config files, or check if a report/screenshot file exists before asserting on it.

```js
import fs from 'fs';
const data = fs.readFileSync('./testdata/dummy.txt', 'utf-8');
```

### `path` (Path module)

**What it is:** Built-in Node.js module used to safely build and resolve file paths across different operating systems (Windows uses `\`, Mac/Linux use `/` — `path` handles this automatically so code doesn't break cross-platform).

**Where I use it:** To build reliable, absolute paths to test data files or downloaded files, especially combined with `__dirname` so the path doesn't depend on where the test is run from.

```js
import path from 'path';
const filePath = path.join(__dirname, 'testdata', 'dummy.txt');
```

**Important catch — `path` + `__dirname` in ES Modules:**

In a normal CommonJS project (default, `require` based), `__dirname` is automatically available and gives the current file's folder location.

But if `package.json` has `"type": "module"` (i.e., project uses `import`/`export` syntax = ES Modules), then `__dirname` is **not available by default** — Node throws an error like `__dirname is not defined`.

**Fix for ES Modules:**

```js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'testdata', 'dummy.txt');
```

So in an interview, if asked "does `__dirname` work everywhere?" — the honest answer is: **No, it depends on whether the project is CommonJS or ES Module.** In CommonJS it just works; in ESM you have to manually recreate it using `import.meta.url`.

### `process` (Process object)

**What it is:** A **global object** in Node.js (no import needed) that gives information about, and control over, the current running Node process — things like environment variables, command-line arguments, current working directory, exit codes.

**Where I use it:** In my Playwright config file, to conditionally change settings based on environment — most commonly:

```js
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    headless: process.env.CI ? true : false,
  },
});
```

- `process.env.CI` → checks if the test is running inside a CI/CD pipeline (like GitHub Actions, Jenkins) vs locally on my machine. CI tools automatically set this environment variable to `true`.
- Based on that, I control retries, headless mode, workers, base URL (like switching between local/staging/prod URLs), etc.

Other common `process` uses:

```js
process.env.BASE_URL       // read custom env variable, e.g. for different environments
process.argv                // read command-line arguments passed to script
process.exit(1)             // force exit script with error code
```

---

### Quick summary table (good for revision)

| Module      | Import needed? | Purpose                              | My use case                                                             |
| ----------- | -------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `fs`      | Yes, built-in  | Read/write files                     | Reading test data, JSON config                                          |
| `path`    | Yes, built-in  | Build safe file paths cross-platform | Locating test data via`__dirname`                                     |
| `process` | No, global     | Access env vars, runtime info        | `process.env.CI` in `playwright.config.ts` for CI vs local behavior |

**One-line answers if interviewer wants it super short:**

- `fs` → file read/write karne ke liye.
- `path` → file paths ko safely, OS-independent tareeke se build karne ke liye.
- `process` → current Node process ki info (env variables, args) access karne ke liye — sabse common use environment-based config switch karna.
