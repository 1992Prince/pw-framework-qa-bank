
# TypeScript Interview Questions & Speakable Answers

*(Simple language, one example each, related to Playwright + TypeScript automation where useful)*

---

## 1. What is TypeScript? Difference between TS and JS?

**Speakable answer:**
"TypeScript is not a separate language that runs on its own — it's a superset of JavaScript. It adds type-checking on top of JS, and at the end it gets compiled down to plain JavaScript, because that's the only thing browsers and Node.js actually understand."

**Key differences (quick table to speak through):**

| Point          | JavaScript                         | TypeScript                             |
| -------------- | ---------------------------------- | -------------------------------------- |
| Typing         | Dynamic — type decided at runtime | Static — you declare the type upfront |
| Errors         | Caught only at runtime             | Caught at compile time                 |
| Object shape   | Flexible, any shape                | Must match an`interface`/`type`    |
| IDE support    | Basic                              | Strong autocomplete & IntelliSense     |
| File extension | `.js`, run with `node file.js` | `.ts`, run with `ts-node file.ts`  |

**Example:**

```ts
let x: number = 5;
x = "hello"; // ❌ Error in TS, allowed in JS
```

**Automation angle:** In a Playwright framework, TS catches mistakes like passing a `Locator` where a `string` is expected — before the test even runs, saving debugging time in CI.

---

## 2. How do you install TypeScript? What are the prerequisites?

**Speakable answer:**
"Before adding TypeScript to a project, you just need Node.js installed and a code editor like VS Code. Then it's a normal npm setup."

**Steps:**

```bash
mkdir my-ts-app && cd my-ts-app
npm init -y                       # creates package.json
npm install typescript --save-dev # install TS locally
npx tsc --init                    # generates tsconfig.json
npm install ts-node --save-dev    # to run .ts files directly
```

**Two ways to run:**

1. `ts-node file1.ts` — direct run
2. `tsc` then `node file1.js` — compile first, then run

---

## 3. Local vs Global Installation — Why is Local Preferred?

**Speakable answer:**
"Global install means the package is available anywhere on the machine. Local install means it lives only inside that project's `node_modules`. We prefer local because it keeps the exact same version locked for every team member — no 'it works on my machine' problem, which is very important in CI/CD pipelines."

- Global: `npm install -g typescript`
- Local: `npm install typescript --save-dev` (or `-D`)

**Role of `npx`:** Since local packages aren't available directly as terminal commands, `npx` finds them inside `node_modules/.bin` and runs them — e.g., `npx tsc -v` works even without a global install.

**Automation angle:** In a Playwright project, we always keep `typescript`, `ts-node`, `@playwright/test` as local dev dependencies, so every machine and every CI runner uses the exact same versions.

---

## 4. How Are `.ts` Files Executed Internally?

**Speakable answer:**
"Node.js runs on the V8 engine, and V8 only understands plain JavaScript — it has no idea what TypeScript is. So a `.ts` file must always be converted to `.js` before it can run. There are two ways to do that."

- **Option 1 – `tsc`:** compiles all `.ts` files into `.js` files (plus `.map` files for debugging), then you run `node file.js`.
- **Option 2 – `ts-node` (recommended for dev):** converts TS → JS in memory and runs it immediately — no `.js` file is saved to disk. Faster for day-to-day development.

Also, if `"strict": true` is set in `tsconfig.json`, `tsc` enforces strict type-checking and throws compile-time errors for wrong types or missing properties.

---

## 5. `npm` vs `npx` — Difference

**Speakable answer:**
"npm is used to *install* a package, either globally or locally. npx is used to *execute* a package's CLI tool, especially ones installed locally, without needing a global install."

**Example:**

```bash
npm install ts-node --save-dev   # npm installs it
npx ts-node file1.ts             # npx runs it from node_modules
```

**Rule of thumb:** npm → install, npx → execute.

---

## 6. What is `--save-dev` / `-D`? Where does it save the package?

**Speakable answer:**
"In `package.json`, there are two sections: `dependencies` are packages the app needs to actually run in production, and `devDependencies` are tools only needed while developing or testing — like TypeScript, ts-node, or Playwright itself. Using `--save-dev` puts the package under `devDependencies`, and these get stripped out of the final production build."

**Example:**

```json
"dependencies": { "papaparse": "^5.5.3" },
"devDependencies": {
  "@playwright/test": "^1.61.1",
  "typescript": "^6.0.3"
}
```

---

## 7. If We Already Have `package.json`, What Is `package-lock.json` For?

**Speakable answer:**
"The `^` symbol in package.json means the package can auto-update to newer minor/patch versions. That's risky because a teammate running `npm install` later might get a slightly different version that behaves differently or breaks something. `package-lock.json` locks the exact version of every package and sub-dependency that was actually installed, so everyone gets identical, reproducible builds. That's why we always commit it to version control in an automation framework."

---

## 8. What is `tsconfig.json`? Why generate it? What happens without it?

**Speakable answer:**
"`tsconfig.json` is the configuration file that tells the TypeScript compiler how to behave — things like strictness, source/output folders, and which JS version to target. We generate it using `npx tsc --init`. Without it, `tsc` still works using default settings, but we lose control over output structure and strict checks, which makes it harder to manage in a real project."

**Key components (interview-speakable, one line each):**

- `compilerOptions` → the main block holding all settings.
- `rootDir` → where your source `.ts` files live, e.g. `./src`.
- `outDir` → where compiled `.js` files go, e.g. `./dist`.
- `module` → which module system to compile to, e.g. `commonjs` or `nodenext`.
- `strict` → turns on all strict type-checking rules; recommended to keep `true` so bugs are caught early, especially useful in a large Playwright test suite.

---

## 9. What is `tsc`?

**Speakable answer:**
"`tsc` is the TypeScript Compiler — its job is to convert `.ts` files into plain `.js` files, since Node can't run TypeScript directly. You either compile with `tsc` and then run the JS with `node`, or use `ts-node` to do both in one step."

---

## 10. What are Types in TypeScript? List the different types.

**Speakable answer:**
"Types tell TypeScript what kind of value a variable can hold. The basic ones are similar to real-world data — string, number, boolean, array, object, tuple, enum, any, unknown, void, and never. Using the right type helps catch mistakes before the code runs."

**Example:**

```ts
let name: string = "QA";
let age: number = 5;
let isPassed: boolean = true;
let tags: string[] = ["smoke", "regression"];
```

---

## 11. Difference between `any` and `unknown`

**Speakable answer:**
"Both can hold any kind of value, but `any` completely turns off type-checking — you can do anything with it, which is risky. `unknown` is safer: you can store any value in it, but TypeScript forces you to check or narrow its type before you actually use it."

**Example:**

```ts
let a: any = "hello";
a.toUpperCase(); // ✅ allowed even if wrong, no safety

let b: unknown = "hello";
b.toUpperCase(); // ❌ Error, must check type first
if (typeof b === "string") b.toUpperCase(); // ✅ safe
```

**Why use `unknown` instead of `any`:** In an automation framework, if we're reading data from an API response or a JSON file, `unknown` forces us to validate the shape before using it, avoiding runtime crashes in tests.

---

## 12. Difference between `void` and `never`

**Speakable answer:**
"`void` means a function doesn't return anything meaningful — it just completes. `never` means the function never completes normally at all, like when it always throws an error or loops forever."

**Example:**

```ts
function logStep(msg: string): void {
  console.log(msg); // completes, returns nothing
}

function throwError(msg: string): never {
  throw new Error(msg); // never returns
}
```

---

## 13. How is a Tuple Different from an Array?

**Speakable answer:**
"An array is homogeneous and flexible in length — same type of items, any number of them. A tuple is fixed in length and can hold different types at fixed positions. We use arrays when we have a list of similar items, and tuples when we know exactly how many values and what type each position holds."

**Example:**

```ts
let scores: number[] = [10, 20, 30];             // array - homogeneous, flexible length
let user: [string, number] = ["Alice", 25];      // tuple - fixed length, fixed types
```

**Accessing beyond length:**

```ts
console.log(scores[5]);  // returns undefined, no error
console.log(user[5]);    // ❌ compile-time error, index out of range
```

**When to use which:** Use array for a list of test case names; use tuple for something like `[testName, status]` where the structure is always fixed.

---

## 14. Type Inference in TypeScript

**Speakable answer:**
"Type inference means TypeScript automatically figures out the type of a variable based on the value assigned, even if you didn't explicitly declare it. Once inferred, the type is locked in — you can't reassign a different type to it later."

**Example:**

```ts
let count = 5;       // TS infers "number"
count = "five";      // ❌ Error - can't reassign a string type
```

---

## 15. What are Enums? Have you used them in your projects?

**Speakable answer:**
"An enum is a way to give friendly names to a fixed set of related values. In my automation framework, I've used enums for things like HTTP status codes or browser names, so instead of hardcoding numbers or strings everywhere, I use a readable name. Enums can also be passed as function arguments to keep the code type-safe."

**Example:**

```ts
enum StatusCode {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}

enum Browser {
  Chrome = "chromium",
  Firefox = "firefox",
  Safari = "webkit",
}

function launchBrowser(browser: Browser) {
  console.log(`Launching ${browser}`);
}

launchBrowser(Browser.Chrome); // type-safe, no typos allowed
```

---

## 16. What is a Union Type? When to Use it Over `any`?

**Speakable answer:**
"A union type lets a variable hold one of several specific types, using the `|` symbol. We prefer a union type over `any` because it still gives us type safety — TypeScript knows exactly which types are allowed, unlike `any` which allows literally anything."

**Example:**

```ts
let testStatus: "pass" | "fail" | "skipped";
testStatus = "pass";   // ✅
testStatus = "blocked"; // ❌ Error, not in the allowed list
```

**Automation angle:** Great for something like environment config — `let env: "dev" | "qa" | "prod"` — prevents someone from typing the wrong environment name by mistake.

---

## 17. What is an Object Type in TypeScript?

**Speakable answer:**
"An object type describes the shape of an object — what properties it has and what type each property should be."

**Example:**

```ts
let testCase: { name: string; passed: boolean } = {
  name: "Login Test",
  passed: true,
};
```

---

## 18. Difference Between `type` and `interface`

**Speakable answer:**
"Both are used to describe the shape of an object, and in most everyday cases they work the same way. The main difference is that `interface` can be re-opened and extended later (declaration merging), while `type` cannot be redeclared. Also, `type` can describe unions, tuples, and primitives directly, while `interface` is mainly for object shapes. In practice, most teams use `interface` for object/class shapes and `type` for unions or utility compositions."

**Example:**

```ts
interface User { name: string; }
type Status = "pass" | "fail"; // union - only possible with type
```

---

## 19. What are Optional Properties? How Do You Define Them?

**Speakable answer:**
"Optional properties are properties that may or may not be present on an object. We mark them with a `?` after the property name."

**Example:**

```ts
interface TestConfig {
  browser: string;
  headless?: boolean; // optional
}

const config: TestConfig = { browser: "chromium" }; // ✅ valid, headless not required
```

---

## 20. Difference Between `Partial<T>`, `Required<T>`, and `Record<K, V>`

**Speakable answer:**
"`Partial<T>` takes an existing type and makes all its properties optional — useful when updating only some fields. `Required<T>` does the opposite, it makes all properties mandatory even if they were optional originally. `Record<K, V>` is used to build a new object type where you define the key type and the value type, useful for maps or dictionaries."

**Example:**

```ts
interface TestConfig { browser: string; headless?: boolean; }

type PartialConfig = Partial<TestConfig>;   // both fields optional
type RequiredConfig = Required<TestConfig>; // both fields mandatory

type EnvUrls = Record<"dev" | "qa" | "prod", string>;
const urls: EnvUrls = {
  dev: "https://dev.app.com",
  qa: "https://qa.app.com",
  prod: "https://app.com",
};
```

---

## 21. Excess Property Check — What Happens With Extra Properties?

**Speakable answer:**
"When you directly assign an object literal to a typed variable, TypeScript checks it strictly and throws an error if there are extra properties not defined in the type. This is called excess property checking. It doesn't happen if you assign through a variable instead of a literal directly."

**Example:**

```ts
interface User { name: string; }

const u1: User = { name: "A", age: 25 }; // ❌ Error - excess property "age"

const temp = { name: "A", age: 25 };
const u2: User = temp; // ✅ Allowed, no direct literal check
```

---

## 22. Functions with Types — Return Type, Args, Optional Args, Default Values

**Speakable answer:**
"We can type function parameters and return values. Parameters can be required, optional using `?`, or given a default value. If a function doesn't return anything meaningful, we type its return as `void`."

**Example:**

```ts
function logResult(testName: string, status: string): void {
  console.log(`${testName}: ${status}`);
}

function runTest(testName: string, retries?: number): void { }        // optional arg
function runTest2(testName: string, retries: number = 1): void { }    // default value
```

**Do objects have default values too?**
"Yes, but only at the level of function parameters — you can give a default object if the parameter isn't passed. `interface` and `type` themselves don't hold default values; they only describe shape."

```ts
interface Config { headless: boolean; }
function launch(config: Config = { headless: true }) { }
```

---

## 23. Interface Extending Another Interface

**Speakable answer:**
"An interface can extend another interface using the `extends` keyword, which means it inherits all the properties of the parent and can add its own."

**Example:**

```ts
interface BaseTest {
  name: string;
}

interface UITest extends BaseTest {
  browser: string;
}

const test: UITest = { name: "Login", browser: "chromium" };
```

---

## 24. Type Extending Another Type

**Speakable answer:**
"For `type`, we don't use `extends`, we use an intersection with `&` to combine two types together."

**Example:**

```ts
type BaseTest = { name: string; };
type UITest = BaseTest & { browser: string; };

const test: UITest = { name: "Login", browser: "chromium" };
```

---

## 25. Can We Create Two Interfaces with the Same Name?

**Speakable answer:**
"Yes — TypeScript automatically merges them into one interface with all the combined properties. This is called declaration merging. This is different from `type`, where duplicate names are not allowed."

**Example:**

```ts
interface User { name: string; }
interface User { age: number; }
// merged: { name: string; age: number; }
```

---

## 26. Can We Create Two Types with the Same Name?

**Speakable answer:**
"No — unlike interfaces, `type` cannot be declared twice with the same name in the same scope. TypeScript will throw a duplicate identifier error."

---

## 27. What Kinds of Properties Can an Object Have?

**Speakable answer:**
"An object's properties can be mandatory, optional, readonly, or have a default value passed in through a function parameter."

| Kind                   | Syntax                      | Meaning                            |
| ---------------------- | --------------------------- | ---------------------------------- |
| Mandatory              | `name: string`            | Must always be provided            |
| Optional               | `name?: string`           | May or may not be present          |
| Readonly               | `readonly id: number`     | Can be set once, not changed later |
| Default (via function) | `function(x: number = 5)` | Used if no value passed            |

---

## 28. What is a `readonly` Property? When Would You Use It?

**Speakable answer:**
"A `readonly` property can be assigned a value only once — usually when the object is created — and can't be changed afterward. It's useful for values that should never change during execution, like a test's unique ID or a fixed config value."

**Example:**

```ts
interface TestCase {
  readonly id: number;
  name: string;
}

const tc: TestCase = { id: 101, name: "Login Test" };
tc.id = 102; // ❌ Error, cannot reassign readonly property
```

---

## 29. What is `Record<K, V>` and How Do You Use It?

**Speakable answer:**
"`Record<K, V>` is a utility type used to build an object type where all keys are of type `K` and all values are of type `V`. It's handy for things like config maps or lookup tables."

**Example:**

```ts
type EnvConfig = Record<"dev" | "qa" | "prod", { url: string }>;

const config: EnvConfig = {
  dev: { url: "https://dev.app.com" },
  qa: { url: "https://qa.app.com" },
  prod: { url: "https://app.com" },
};
```

---
