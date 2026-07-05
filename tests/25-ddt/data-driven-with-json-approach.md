Bhai, let's make this crystal clear — four clean notes, interview-ready, no confusion.

---

## 📝 Note 1: How to organize test data in JSON file

**Approach:** One spec file = one functionality = one JSON file. Inside JSON, structure as **object of arrays**, where key = test name, value = array of data objects.

```
{
  "validRegistration": [
    { "id": "TC001", "email": "sarika@example.com", "password": "password123" }
  ],
  "invalidEmailFormat": [
    { "id": "TC020", "email": "not-an-email", "expectedError": "Invalid email format" }
  ]
}
```

**Interview answer:** "I map JSON keys to test names so the data structure mirrors my spec file. I always keep the value as an array — even for a single record — so the shape stays consistent across all keys. This means my code that reads this JSON doesn't need to check 'is this an array or a single object,' and if I need more data-driven cases for the same test later, I just add another object to the array without touching code."

---

## 📝 Note 2: What you get when you `import` a JSON file

```
import testdata from "../../testdata/registration.json" with { type: 'json' };
```

**What happens:** Node/TS parses the JSON file automatically at import time — you get a real JS value, not a string. No manual `JSON.parse()` needed.

- JSON root `[...]` → you get a **JS array**
- JSON root `{...}` → you get a **JS object**

**Interview answer:** "When I import a `.json` file, the module loader parses it for me and gives me a native JS object or array depending on the JSON root. In native ESM I need `with { type: 'json' }` to tell Node explicitly it's JSON; in TypeScript with `resolveJsonModule: true` in `tsconfig.json`, plain import works without that attribute."

---

## 📝 Note 3: Should you import JSON directly into the spec file? What's the strategy?

**Answer: No, not directly — use a data provider/factory layer in between.**

**Interview answer:** "I don't import JSON directly into spec files, even though it technically works. Instead I create a data provider file — a `.ts` file that imports the JSON once, caches it in memory, and exposes functions like `getValidRegistrationData()` to my specs. Three reasons:

1. **Decoupling** — if data source changes tomorrow (API, DB, Excel instead of JSON), only the provider changes, not every spec file.
2. **Transformation** — sometimes raw data needs runtime changes, like generating a unique email per test run to avoid 'user already exists' failures — a provider lets me do that; direct import gives only static raw data.
3. **Performance/control** — the provider loads the JSON once and caches it, so I control exactly when and how data is read, rather than each spec re-importing independently."

---

# 📝 Note 4: How this framework is Data-Driven (Direct JSON Import approach)

We keep our test data in JSON files, and each JSON file corresponds to one spec file — this keeps data organized per functionality of the app.

---

## 1) JSON Structure

Each JSON file is structured as an **object where keys represent test scenario names**, and values are **arrays of data objects** for that scenario:

```
{
  "validRegistration": [
    { "id": "TC001", "email": "sarika@example.com", "password": "password123" }
  ],
  "invalidEmailFormat": [
    { "id": "TC020", "email": "not-an-email", "password": "Invalid email format" }
  ]
}
```

- `validRegistration` and `invalidEmailFormat` are separate keys, each mapping to a different test scenario
- Value of each key is always an array — even with one record — so structure stays consistent and can hold multiple data-driven records in future without any change

---

## 2) Import Mechanism

```
import { test, expect } from "@playwright/test";
import testdata from "../../testdata/loginfunctionality.json" with { type: 'json' };
```

- The JSON file is imported directly into the spec file using ES Module import syntax
- `with { type: 'json' }` tells Node this is a JSON file being imported (required in native ESM)
- At import time, Node auto-parses the file and gives us a native JS object — no manual `JSON.parse()` needed
- `testdata` now holds the entire JSON content as a JS object with keys `validRegistration` and `invalidEmailFormat`

---

## 3) How Do We Access Data

```
test(`TC001 - login with valid credentials`, async ({ page }) => {
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    await page.getByTestId("form-email").fill(testdata.validRegistration[0].email);
    await page.getByTestId("form-password").fill(testdata.validRegistration[0].password);
  
    await page.waitForTimeout(3000);
  });

  test(`TC002 - login with invalid email format`, async ({ page }) => {
    await page.goto("https://gauravkhurana.com/practise-api/ui/index.html#/practice");

    await page.getByTestId("form-email").fill(testdata.invalidEmailFormat[0].email);
    await page.getByTestId("form-password").fill(testdata.invalidEmailFormat[0].password);
  
    await page.waitForTimeout(5000);
  });
```

- Values of keys are accessed using dot notation (`testdata.validRegistration`) or bracket notation (`testdata["validRegistration"]`)
- Since the value is an array, a specific record is accessed by index — `testdata.validRegistration[0]`
- Individual fields of that record are accessed with further dot notation — `testdata.validRegistration[0].email`
- `TC001` test pulls its data from the `validRegistration` key, and `TC002` pulls from the `invalidEmailFormat` key — each test knows exactly which key in JSON belongs to it

---

## 4) How Is This Framework Data-Driven

- Test **logic** (navigating to page, filling fields) is written once inside each `test()` block
- Actual **values** (email, password) are not hardcoded — they come from the external JSON file
- To change test data (e.g., use a different email), we only edit the JSON file — no change needed in spec file code
- Each test scenario in JSON (`validRegistration`, `invalidEmailFormat`) maps directly to a corresponding test in the spec file, keeping test data and test logic clearly linked but separately maintained
- This separation means **data and logic evolve independently** — QA/non-technical team members can update JSON data without touching test code

