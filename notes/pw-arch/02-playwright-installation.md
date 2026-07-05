**# Playwright Project Setup — Simple Notes

---

## 📑 Table of Contents

1. [Prerequisite — Node.js (Must Install First)](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#1-prerequisite--nodejs-must-install-first)
2. [What is npm?](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#2-what-is-npm)
3. [What is npx?](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#3-what-is-npx)
4. [npm vs npx — Clear Difference with Example](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#4-npm-vs-npx--clear-difference-with-example)
5. [Step-by-Step: Create Fresh Playwright Project](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#5-step-by-step-create-fresh-playwright-project)
6. [Folder Structure Generated](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#6-folder-structure-generated)
7. [package.json — What It Contains](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#7-packagejson--what-it-contains)
8. [package.json vs package-lock.json](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#8-packagejson-vs-package-lockjson)
9. [Installation Commands Explained](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#9-installation-commands-explained)
10. [Browser Installation Commands](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#10-browser-installation-commands)
11. [Interview Questions &amp; Answers](https://docs.google.com/document/d/1OUbmWm4ALt3L2nnQTFcXlUk9Par8UyQOUGT-DdC6Bvg/edit#11-interview-questions--answers)

---

## 1. Prerequisite — Node.js (Must Install First)

⚠️ Playwright is built on top of Node.js. Before doing anything — no npm, no npx, no Playwright — you must install Node.js first.

### Why Node.js?

* Playwright's JavaScript/TypeScript version runs on the Node.js runtime. Without Node.js, nothing works — no npm, no npx, no @playwright/test.
* Node.js is the engine that executes your Playwright test scripts.

### Version Requirement

* Node.js v18 or above is mandatory. Anything below v18 will not work — Playwright will throw errors or refuse to install.
* Always go for the LTS (Long Term Support) version from [https://nodejs.org](https://nodejs.org).

### How to Install

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the LTS version (e.g., Node 20.x or 22.x).
3. Run the installer — it will install both Node.js and npm together automatically.
4. Verify installation:

node -v    # should show v18.x.x or above

npm -v     # should show npm version (comes bundled with Node)

### What Happens If Node.js Is NOT Installed?

* npm command will not be recognized → "command not found".
* npx command will not be recognized.
* You cannot install Playwright or any Node.js-based library.
* Your test scripts won't execute at all.

🔑 Rule of thumb: Node.js is the very first thing you install. Everything else (npm, npx, Playwright) depends on it.

---

## 2. What is npm?

* npm = Node Package Manager
* It is a tool that helps you install, manage, and update packages (libraries) in your Node.js project.
* When you install Node.js, npm comes bundled with it — you don't need to install it separately.
* Think of npm like Play Store for Node.js projects — it fetches libraries from the npm registry (a huge online store of packages).

Check versions:

node -v    # shows Node.js version

npm -v     # shows npm version

---

## 3. What is npx?

* npx = Node Package Executor
* It is used to run/execute a package command — either from locally installed packages or by temporarily downloading and running one.
* npx also comes bundled with Node.js (from Node 8.2+).
* It first checks if the package is already installed locally in node_modules, if yes it runs from there. If not, it temporarily downloads, runs, and discards it.

Example:

npx playwright install   # runs the "playwright install" command from locally installed playwright

npx playwright test      # runs your tests

### Can We Check npx Version?

Yes:

npx -v     # shows npx version

npx comes bundled with npm, so if npm is installed, npx is already there. You don't install npx separately.

---

## 4. npm vs npx — Clear Difference with Example

| Feature                                                    | npm                                  | npx                                  |
| ---------------------------------------------------------- | ------------------------------------ | ------------------------------------ |
| ---------------------------------------------------------- |                                      |                                      |
| Full form                                                  | Node Package Manager                 | Node Package Executor                |
| -                                                          | -                                    | -                                    |
| Purpose                                                    | Installpackages into your project    | Execute/Runcommands from packages    |
| Think of it as                                             | Shopping — buy the tool and keep it | Using — pick up the tool and use it |
| Check version                                              | npm -v                               | npx -v                               |

### Real-World Example: Understanding with Playwright Library

Let's trace the entire flow using Playwright as the example:

Step 1 — You install Playwright using npm (the installer):

npm install -D @playwright/test

* npm goes to the npm registry (online store).
* Downloads the @playwright/test library.
* Saves it inside your project's node_modules/ folder.
* Adds it to devDependencies in package.json.
* Job done — npm's work is finished. It installed the library. It doesn't run anything.

Step 2 — Now you want to run Playwright commands using npx (the executor):

npx playwright install        # runs playwright's browser download command

npx playwright test           # runs your tests

npx playwright codegen        # opens the code generator tool

npx playwright show-report    # opens the HTML report

* npx looks inside node_modules/.bin/ for a playwright executable.
* Finds it (because npm already installed it in Step 1).
* Runs the command you asked for.

### Summary: One Installs, Other Runs

npm install -D @playwright/test    ← npm INSTALLS the library (saves to node_modules)

    ↓

    Library is now sitting in your project

    ↓

npx playwright test                ← npx RUNS a command from that installed library

npx playwright install             ← npx RUNS another command from same library

npx playwright codegen             ← npx RUNS yet another command

🎯 Simple rule: Use npm when you want to download/install something. Use npx when you want to run/execute something that's already installed (or run it temporarily without installing).

### Can We Interchange npm and npx?

No. They do completely different jobs:

* npm playwright test → ❌ will not work — npm doesn't know how to "run" tests, it only installs packages.
* npx install -D @playwright/test → ❌ will not work — npx doesn't install packages as project dependencies.

They are partners, not substitutes.

⚠️ Why do we run Playwright commands with npx and not npm? Because Playwright provides CLI commands (like playwright install, playwright test, playwright codegen). These commands need to be executed, not installed again. Since they are already installed in node_modules, we just run them with npx.

---

## 5. Step-by-Step: Create Fresh Playwright Project

### Step 1 — Create Project Folder and Initialize

mkdir my-playwright-project

cd my-playwright-project

npm init

### What is npm init and Why Do We Need It?

npm initinitializes (sets up) a new Node.js project in the current folder. Its main job is to create the package.json file — which is the identity card of your project.

Why do we need it? Without package.json, your folder is just a random folder. Node.js and npm don't recognize it as a "project." You can't install libraries, you can't define scripts, you can't share your project properly with teammates. npm init converts a regular folder into a proper Node.js project.

### What Questions Does npm init Ask?

When you run npm init, it asks these questions interactively:

| Question                                             | Default Value | What It Means                               |
| ---------------------------------------------------- | ------------- | ------------------------------------------- |
| ---------------------------------------------------- |               |                                             |
| package name?                                        | folder name   | Name of your project                        |
| -                                                    | -             | -                                           |
| version?                                             | 1.0.0         | Starting version number                     |
| description?                                         | (empty)       | Short description of the project            |
| entry point?                                         | index.js      | Main file that runs first                   |
| test command?                                        | (empty)       | Command to run tests (e.g.,playwright test) |
| git repository?                                      | (empty)       | Link to your Git repo                       |
| keywords?                                            | (empty)       | Tags for searching on npm                   |
| author?                                              | (empty)       | Your name                                   |
| license?                                             | ISC           | Legal license type                          |

After you answer (or press Enter to accept defaults), it creates package.json.

💡 Shortcut:npm init -y skips all questions and creates package.json with default values instantly.

### What Does package.json Look Like After npm init?

Right after running npm init -y (before installing anything), it looks like this:

{

  "name": "my-playwright-project",

  "version": "1.0.0",

  "description": "",

  "main": "index.js",

  "scripts": {

    "test": "echo\"Error: no test specified\" && exit 1"

  },

  "keywords": [],

  "author": "",

  "license": "ISC"

}

Notice: No dependencies or devDependencies yet — because we haven't installed anything. These sections appear only after you install packages.

### When / Why Do We Use npm init? — Scenarios

Scenario 1 — Starting a brand new automation project: You create a fresh folder. Before you can install Playwright or any library, you need a package.json. So you run npm init first.

Scenario 2 — Setting up any Node.js-based project (not just Playwright): Building a React app, Express backend, or an API testing framework? Every Node.js project starts with npm init to create package.json.

Scenario 3 — Teammate gives you a folder with code but no package.json: Without package.json, you can't run npm install to get dependencies. You'd run npm init first to create it, then add the required packages.

🔑 Bottom line:npm init = create the project's package.json. Without it, npm doesn't know your project exists.

What init means: Short for initialize — setting up something for the first time.

---

### Step 2 — Install Playwright in the Same Project

npm init playwright@latest

What this command does internally:

1. Goes to the npm registry (online store).
2. Fetches the latest version of @playwright/test.
3. Installs it in your project.
4. Runs an interactive setup wizard asking:
   * TypeScript or JavaScript? — Pick your language
   * Folder name for tests? — Where to keep test files (default: tests/)
   * Add GitHub Actions workflow? — For CI/CD setup
   * Install Playwright browsers? — Download Chromium, Firefox, WebKit
5. If you say Yes to browsers, it automatically runs npx playwright install which downloads all 3 patched browser binaries to:

* Windows:C:\Users\<user>\AppData\Local\ms-playwright\
* Mac:~/Library/Caches/ms-playwright/
* Linux:~/.cache/ms-playwright/

What @latest means: Download the newest available version of Playwright from the npm registry.

### Want a Specific Version?

npm init playwright@1.40.0       # specific version

npm install -D @playwright/test@1.40.0

Note: Node.js v18 or above is recommended for Playwright.

---

## 6. Folder Structure Generated

After setup, your project will look like this:

project-root/

├── node_modules/              ← All installed libraries (Playwright core + test lib + dependencies)

├── tests/

│   └── example.spec.ts        ← Sample test file

├── tests-examples/

│   └── demo-todo-app.spec.ts  ← Detailed demo tests

├── package.json               ← Project manifest (name, version, dependencies)

├── package-lock.json          ← Exact version lock of all dependencies

└── playwright.config.ts       ← Main Playwright configuration file

### If you opted for GitHub Actions:

.github/

  └── workflows/

    └── playwright.yml       ← CI workflow with browser caching

### Purpose of Each File/Folder (Simple Terms)

| File / Folder                                                                                                                                                                                | Purpose                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |                                                                                                                                                                           |
| node_modules/                                                                                                                                                                                | Stores all downloaded libraries. This is where Playwright and its dependencies physically live.Never edit this manually.Can be regenerated anytime by runningnpm install. |
| -                                                                                                                                                                                            | -                                                                                                                                                                         |
| tests/example.spec.ts                                                                                                                                                                        | A ready-made sample test to show you how Playwright tests look.                                                                                                           |
| tests-examples/                                                                                                                                                                              | More detailed demo tests for learning (todo app example).                                                                                                                 |
| package.json                                                                                                                                                                                 | The project'sID card— contains project name, version, dependencies, scripts.                                                                                             |
| package-lock.json                                                                                                                                                                            | Records theexact versionof every package installed, so teammates get the same versions.                                                                                   |
| playwright.config.ts                                                                                                                                                                         | Main config file — set browsers, timeouts, retries, reporters, base URL, etc.                                                                                            |
| .github/workflows/playwright.yml                                                                                                                                                             | GitHub Actions pipeline file — runs your tests automatically on every push/PR.                                                                                           |

---

## 7. package.json — What It Contains

After a fresh Playwright install, package.json looks something like this:

{

  "name": "my-playwright-project",

  "version": "1.0.0",

  "description": "",

  "main": "index.js",

  "scripts": {

    "test": "playwright test"

  },

  "keywords": [],

  "author": "",

  "license": "ISC",

  "devDependencies": {

    "@playwright/test": "^1.48.0",

    "@types/node": "^22.7.5"

  }

}

### Key Components Explained

| Component                   | Meaning                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| --------------------------- |                                                                  |
| name                        | Your project name                                                |
| -                           | -                                                                |
| version                     | Project version (follows semantic versioning: major.minor.patch) |
| description                 | What your project is about                                       |
| main                        | Entry point file of the project                                  |
| scripts                     | Shortcuts you can run vianpm run`<name>`(e.g.,npm run test)    |
| keywords                    | Tags for npm registry search                                     |
| author                      | Project creator                                                  |
| license                     | Legal license                                                    |
| dependencies                | Libraries needed torunthe app in production                      |
| devDependencies             | Libraries needed only duringdevelopment/testing(like Playwright) |

### Where Can I See the Playwright Runner Version?

Two places:

1. In package.json → under devDependencies → "@playwright/test": "^1.48.0"
2. Run command → npx playwright --version

---

## 8. package.json vs package-lock.json

| Feature                                                                                             | package.json                           | package-lock.json                              |
| --------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------- |
| --------------------------------------------------------------------------------------------------- |                                        |                                                |
| Purpose                                                                                             | Lists what libraries your projectneeds | Locks theexact versionsof everything installed |
| -                                                                                                   | -                                      | -                                              |
| Written by                                                                                          | You (ornpm init)                       | npm automatically                              |
| Version format                                                                                      | Flexible (e.g.,^1.48.0means 1.48.x)    | Fixed (e.g.,1.48.3)                            |
| Contains sub-dependencies?                                                                          | No                                     | Yes — every nested library too                |
| Should you edit it?                                                                                 | Yes, you can                           | No, never edit manually                        |
| Push to Git?                                                                                        | Yes                                    | Yes                                            |

### Simple Scenario (Why package-lock.json Matters)

Imagine you install Playwright ^1.48.0 today → it installs 1.48.3. Your teammate installs it next month → ^1.48.0 might now give 1.48.9 (a newer patch).

This can cause "works on my machine but fails on yours" bugs.

package-lock.json solves this by locking the exact version 1.48.3 — so every teammate gets the exact same version, making builds consistent and reliable.

---

## 9. Installation Commands Explained

### Option 1 — Fresh New Project

npm init playwright@latest

Use when starting a brand new project from scratch. Sets up everything — test folders, config file, sample tests, browser binaries.

### Option 2 — Add Playwright to an Existing Project

npm install -D @playwright/test

Use when:

* You already have a Node.js project.
* Playwright is missing / not working.
* You want to update Playwright.
* You only want the Playwright test library, not the full setup wizard.

### What is -D?

* -D is short for --save-dev.
* It installs the package as a devDependency (meaning it's needed only for development/testing, not in production).
* It gets added under the devDependencies section in package.json.

Why Playwright uses -D? Because Playwright is a testing tool — you don't need it in the final production build of the app.

### Difference: npm init playwright@latest vs npm install -D @playwright/test

| Feature                                                                  | npm init playwright@latest                       | npm install -D @playwright/test                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------- |
| ------------------------------------------------------------------------ |                                                  |                                                                 |
| Use case                                                                 | Fresh new project setup                          | Adding to an existing project                                   |
| -                                                                        | -                                                | -                                                               |
| Interactive wizard?                                                      | Yes (asks TS/JS, folder, CI, browsers)           | No                                                              |
| Creates folders & config?                                                | Yes (tests/, playwright.config.ts, sample tests) | No — only installs the library                                 |
| Installs browsers?                                                       | Yes (if you say yes)                             | No — you must runnpx playwright installseparately              |
| Scenario                                                                 | "I'm starting an automation project."            | "I already have a project; I just need the Playwright library." |

---

## 10. Browser Installation Commands

npx playwright install                      # installs all 3 browsers (Chromium, Firefox, WebKit)

npx playwright install chromium             # installs only Chromium

npx playwright install firefox              # installs only Firefox

npx playwright install webkit               # installs only WebKit

npx playwright install chromium firefox     # installs specific multiple browsers

npx playwright install --with-deps          # installs all browsers + OS-level system libraries

npx playwright install chromium --with-deps # Chromium + OS dependencies

### What is --with-deps?

* --with-deps installs extra OS-level system libraries that the browsers need to run.
* Especially required on Linux servers (like CI/CD pipelines — GitHub Actions, Jenkins on Linux).
* Linux environments often don't have fonts, audio/video libs, or graphics libraries needed by browsers → so --with-deps installs them.

### When to Use --with-deps?

* Running tests on a Linux CI server (mandatory).
* When browsers fail to launch and throw "missing library" errors.
* Not needed on Windows or Mac for local development.

### npx playwright install vs npx playwright install chromium

* npx playwright install → downloads all 3 browsers (Chromium + Firefox + WebKit). Takes more time and disk space. Use when doing cross-browser testing.
* npx playwright install chromium → downloads only Chromium. Fast and lightweight. Use when you only test on Chrome.

### Does npm init playwright@latest Automatically Run npx playwright install?

Yes — but only if you say "Yes" to the wizard question: "Install Playwright browsers?" If you skip it, you'll need to run npx playwright install manually later.

### When Do We Run npx playwright install Manually?

* You skipped browser install during setup.
* You updated Playwright to a new version (new version may need new browser binaries).
* A teammate cloned your repo — node_modules gets installed by npm install, but browser binaries don't (they live outside the project folder). So after cloning, every teammate must run npx playwright install.
* Browser binaries got deleted/corrupted.

---

## 11. Interview Questions & Answers

### Q1. How do you initialize a fresh Playwright project? What steps do you follow?

Answer:

1. Install Node.js (v18+) — npm comes along with it.
2. Create a new folder and navigate into it:

mkdir my-project && cd my-project

3. Initialize a Node project:

npm init -y

4. Install Playwright using the interactive setup:

npm init playwright@latest

5. Answer wizard questions (TS/JS, tests folder, GitHub Actions, browsers).
6. Run sample test to verify:

npx playwright test

---

### Q2. Explain the folder structure generated and purpose of each file.

Answer:

* node_modules/ — stores all installed libraries (Playwright and its dependencies).
* tests/example.spec.ts — sample test file.
* tests-examples/ — detailed demo tests.
* package.json — project info (name, version, scripts, dependencies).
* package-lock.json — locks exact versions of all installed packages.
* playwright.config.ts — Playwright configuration (browsers, timeouts, retries, reporters).
* .github/workflows/playwright.yml — (optional) CI pipeline for GitHub Actions.

---

### Q3. What is the purpose of npm init command?

Answer:npm initinitializes a new Node.js project by creating the package.json file — the project's identity card. Without package.json, npm doesn't recognize your folder as a project and you can't install any libraries.

What it does: Asks interactive questions (name, version, description, author, license, entry point) and generates package.json with your answers.

Why we need it — practical scenarios:

* Starting a new project: Before installing Playwright or any library, you need package.json. So npm init comes first.
* Any Node.js project: Whether it's Playwright, React, Express, or anything else — every project starts with npm init.
* Missing package.json: If a teammate gives you code without package.json, you run npm init to create it before adding dependencies.

Use npm init -y to skip questions and create it with defaults instantly.

---

### Q4. What is the difference between npm and npx? When to use what?

Answer:

* npm = Node Package Manager → used to install/download packages and save them in your project.
* npx = Node Package Executor → used to run/execute commands from already installed packages.

Example with Playwright:

# npm INSTALLS the library (downloads and saves it)

npm install -D @playwright/test

# npx RUNS commands from that installed library

npx playwright test          # execute tests

npx playwright install       # download browsers

npx playwright codegen       # open code generator

Can they be interchanged? No.

* npm playwright test → ❌ won't work — npm installs, doesn't run.
* npx install -D @playwright/test → ❌ won't work — npx runs, doesn't install.

Check versions:

npm -v     # npm version

npx -v     # npx version

Analogy:npm is like buying a tool from a store. npx is like using that tool to do the job. You need both — buy first (npm), then use (npx).

---

### Q5. Why do we run Playwright commands with npx and not npm?

Answer: Because Playwright provides CLI commands (like playwright test, playwright install, playwright codegen) that need to be executed, not installed. Since Playwright is already installed inside node_modules, we use npx to run these commands directly from there. Running them with npm would try to install them again, which is not what we want.

---

### Q6. Where are Playwright libraries installed? Explain the node_modules folder.

Answer: All installed libraries live inside the node_modules/ folder at the project root. This includes:

* @playwright/test (main Playwright library)
* Sub-dependencies that Playwright itself needs (like playwright-core)

Important:

* This folder can be huge (thousands of files).
* Never pushnode_modules/ to Git — add it to .gitignore.
* Can be regenerated anytime by running npm install (which reads package.json and re-downloads everything).

Browser binaries (Chromium, Firefox, WebKit) are NOT stored in node_modules. They go to a global cache:

* Windows: C:\Users\<user>\AppData\Local\ms-playwright\
* Mac: ~/Library/Caches/ms-playwright/
* Linux: ~/.cache/ms-playwright/

---

### Q7. npm init playwright@latest vs npm install -D @playwright/test — Purpose of each with scenario.

Answer:

npm init playwright@latest

* Purpose: Complete fresh setup of a Playwright project.
* Does: Runs interactive wizard, creates folders (tests/), creates playwright.config.ts, adds sample tests, installs browsers.
* Scenario: "I'm starting a brand new automation project from scratch."

npm install -D @playwright/test

* Purpose: Just install/update the Playwright test library.
* Does: Only downloads @playwright/test package into node_modules and adds it to devDependencies.
* Scenario: "My project already exists but Playwright library is missing / broken / needs update."

---

### Q8. Explain -D.

Answer:

* -D is shorthand for --save-dev.
* It installs a package as a devDependency — meaning the package is needed only during development/testing, not in the final production build.
* It gets listed under "devDependencies" in package.json.
* Playwright is always installed with -D because it's a testing tool, not part of the app.

npm install -D @playwright/test     # saves under devDependencies

npm install @playwright/test        # saves under dependencies (wrong for testing tools)

---

### Q9. Where can we see the Playwright runner version in the framework?

Answer: Three ways:

1. In package.json under devDependencies:

"@playwright/test": "^1.48.0"

2. Run command:

npx playwright --version

3. In package-lock.json — shows the exact installed version (e.g., 1.48.3).

---

### Q10. package.json vs package-lock.json — Purpose of each with scenario.

Answer:

package.json

* Project's ID card / manifest.
* Lists project metadata (name, version, author) and dependencies with version ranges (e.g., ^1.48.0).
* You can edit it manually.

package-lock.json

* Auto-generated by npm.
* Locks the exact version of every package and sub-package installed (e.g., 1.48.3).
* Do not edit it manually.

Scenario: You install "@playwright/test": "^1.48.0". Today npm installs 1.48.3. Your teammate clones the repo next month — ^1.48.0 could now resolve to 1.48.9 (newer patch). But because of package-lock.json, your teammate will get exactly 1.48.3 — same as yours. This prevents the classic "works on my machine" problem.

---

### Q11. npx playwright install vs npx playwright install --with-deps — What is --with-deps and when to use it?

Answer:

* npx playwright install — downloads all browser binaries (Chromium, Firefox, WebKit).
* npx playwright install --with-deps — downloads browsers plus OS-level system libraries (fonts, audio/video libs, graphics libs) needed for browsers to run.

When to use --with-deps:

* On Linux CI servers (GitHub Actions, Jenkins on Linux) — always use it because Linux servers often lack required system libraries.
* When you get "missing library" errors on browser launch.
* Not needed on Windows or Mac for local development.

---

### Q12. Does npm init playwright@latest automatically run npx playwright install?

Answer:Yes, but conditionally. During the interactive setup, it asks: "Install Playwright browsers?"

* If you say Yes → it automatically runs npx playwright install and downloads all 3 browsers.
* If you say No → you'll need to run npx playwright install manually later.

---

### Q13. Can we run npx playwright install manually? When?

Answer:Yes. Run it manually when:

* You skipped browser installation during initial setup.
* You updated Playwright to a new version (new version may require new browser binaries).
* A teammate cloned the repo — npm install brings node_modules but not browser binaries (they live outside the project).
* Browser binaries got corrupted/deleted.

---

### Q14. npx playwright install vs npx playwright install chromium

Answer:

* npx playwright install — installs all 3 browsers (Chromium + Firefox + WebKit). Larger download, more disk space. Needed for cross-browser testing.
* npx playwright install chromium — installs only Chromium. Faster, lightweight. Use when you test only on Chrome-based browsers.

---

### Q15. When do we go with npm install -D @playwright/test?

Answer: Use this command when:

* You already have an existing Node.js project.
* The Playwright library is not working or needs to be reinstalled.
* You want to update Playwright to a newer version.
* You only need the library — not the full setup wizard (folders, config, sample tests).
* You're adding Playwright to a larger project that already has its own structure and you don't want a wizard overwriting things.

---

## ✅ Quick Revision Checklist

* ![checked]()Node.js v18+ is mandatory — install it first, everything depends on it
* ![checked]()Installing Node.js automatically gives you npm + npx
* ![checked]()npm = install packages | npx = run packages | Cannot be interchanged
* ![checked]()Check versions: node -v, npm -v, npx -v
* ![checked]()npm init → creates package.json
* ![checked]()npm init playwright@latest → fresh Playwright setup with wizard
* ![checked]()npm install -D @playwright/test → install library only (for existing project)
* ![checked]()-D = devDependency (only for development/testing)
* ![checked]()node_modules/ = where libraries are stored (don't push to Git)
* ![checked]()Browser binaries live outsidenode_modules in global cache
* ![checked]()package.json = flexible version ranges | package-lock.json = exact versions
* ![checked]()--with-deps = for Linux CI servers (installs OS libraries)
* ![checked]()Playwright commands run with npx because they are CLI executables
* ![checked]()Teammates must run npx playwright install after cloning (browsers aren't in node_modules)

---

End of Notes

**
