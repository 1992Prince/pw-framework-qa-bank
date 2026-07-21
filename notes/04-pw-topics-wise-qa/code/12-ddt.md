
# Data Driven Testing in Playwright (TypeScript)

## 30-second interview answer (say this first)

> "In my framework I support Data Driven Testing in 4 ways depending on where the data lives — hardcoded JS arrays for quick/small datasets, external JSON files as the standard/scalable approach, CSV files when data comes from non-technical stakeholders or Excel exports, and direct DB reads when test data needs to be validated against or sourced from a live database. In all cases the core pattern is the same: get the data as an **array of objects**, then loop over it with a `for...of` loop and generate a dynamic test per record using `test(`Test ${data.id}`, ...)`."

Common thread across all 4 approaches: **loop over an array of objects → one `test()` block per iteration → each iteration is an independent test case (failure in one doesn't stop the others)**.

---

## Approach 1: Hardcoded JS Array of Objects

**When to use:** Small, static datasets that don't change often; quick POCs; no external file management needed.

**Steps to explain:**

1. Define `testData` as an array of objects, each object = one test record (with a unique `id`/`name`).
2. Loop through it using `for (const data of testData)`.
3. Inside the loop, call `test()` and use template literals to make the test title dynamic (`Test ${data.id}`).
4. Each iteration becomes a **separate, independent test** in the Playwright report — if TC001 fails, TC002 and TC003 still run.

**Code (paper-ready):**

```ts
import { test, expect } from "@playwright/test";

let testData = [
  { id: 'TC001', name: "Sarika", email: "sarika@example.com", password: "password123" },
  { id: 'TC002', name: "John", email: "john@example.com", password: "password456" },
  { id: 'TC003', name: "Alice", email: "alice@example.com", password: "password789" },
];

for (const data of testData) {
  test(`Test ${data.id}`, async ({ page }) => {
    await page.goto("https://example.com/practice");

    await page.getByTestId("form-email").fill(data.email);
    await page.getByTestId("form-password").fill(data.password);
    await page.getByTestId("form-confirm-password").fill(data.name);

    if (data.id === 'TC001') {
      await expect(data.id).toBe("123"); // intentionally fails for demo
    }
  });
}
```

**Talking point:** "Each loop iteration registers a new test at collection time, so Playwright treats them as independent tests — not sub-steps — which is why one failure doesn't block the rest."

---

## Approach 2: JSON File (Standard / Recommended Approach)

**When to use:** This is the **industry-standard** approach — separates test data from test logic, scales well, easy to maintain, works for both UI and API tests.

**Steps to explain:**

1. Store test data in a `.json` file, structured as an **object of objects** — outer key = test case name (matches the spec), inner value = the payload/data object (or array, if the same test needs multiple records).
2. Import the JSON directly into the spec file — TypeScript reads it as a plain JS object.
3. Best practice: assign it to a local variable/reference before use, so if the data needs to be modified at runtime, you're mutating a copy — **not** the original JSON file.
4. Access values via dot notation (`laptopPayload.year`) or bracket notation for keys with spaces (`laptopPayload['Hard disk size']`).

**JSON file (`product-payload.json`):**

```json
{
  "TC001_CreateLaptop": {
    "year": 2026,
    "price": 3999.99,
    "CPU model": "Mobile Intel Core i9",
    "Hard disk size": "1 MB"
  },
  "TC002_CreateDesktop": {
    "year": 2025,
    "price": 2999.99,
    "CPU model": "Intel Core i7",
    "Hard disk size": "512 GB"
  }
}
```

**Spec file (paper-ready):**

```ts
import { test, expect, APIResponse } from '@playwright/test';
import productPayload from '../../resources/test-data/product-payload.json';

let orderId: string;

test('TC001 - CREATE ORDER REQUEST', async ({ request }) => {
  const baseUrl = 'https://api.restful-api.dev/collections';
  const endpoint = '/appleproducts/objects';
  const url = `${baseUrl}${endpoint}`;

  // reference, not the raw JSON — avoids mutating the source file
  const laptopPayload = productPayload.TC001_CreateLaptop;

  const response: APIResponse = await request.post(url, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "afaa95a4-0843-4b6d-8385-1e03730abad7"
    },
    data: laptopPayload,
  });

  const statusCode = response.status();
  const responseBody = await response.json();
  orderId = responseBody.id;

  expect(statusCode).toBe(200);
});
```

**Talking point:** "I key the JSON by test case name so the mapping between test and data is explicit and self-documenting — anyone reading the JSON immediately knows which block belongs to which test, without opening the spec file."

### Two ways to consume the JSON data — direct payload vs. field-by-field

Once you've pulled the object out (`const laptopPayload = productPayload.TC001_CreateLaptop;`), there are **two patterns** to actually use it, and interviewers like to hear you distinguish between them:

**1. Direct payload — pass the whole object as-is (typical for API tests)**

If the object's shape already matches what the API/request body expects, just hand the whole thing over — no need to extract individual fields.

```ts
const laptopPayload = productPayload.TC001_CreateLaptop;

const response = await request.post(url, {
  headers: { "Content-Type": "application/json" },
  data: laptopPayload, // sent as-is, whole object is the request body
});
```

- **Best for:** API tests where the JSON object's structure already mirrors the request/response schema.
- **Why:** Less code, and if the API adds a new field tomorrow, you only update the JSON — not the spec.

**2. Field-by-field — pull out individual values (typical for UI tests, or when only a subset is needed)**

Here you access each property individually via dot notation (`laptopPayload.price`) or bracket notation for keys with spaces (`laptopPayload['Hard disk size']`), and use each value where it's needed — e.g. filling separate form fields, building assertions, or constructing a *different* payload shape than the JSON's own structure.

```ts
const laptopPayload = productPayload.TC001_CreateLaptop;

const year = laptopPayload.year;                       // dot notation
const price = laptopPayload['price'];                  // bracket notation - also valid
const cpu = laptopPayload['CPU model'];                 // bracket REQUIRED - key has a space
const diskSize = laptopPayload['Hard disk size'];       // bracket REQUIRED - key has a space

// example: UI test filling separate fields with individual values
await page.getByTestId('year-input').fill(String(year));
await page.getByTestId('price-input').fill(String(price));
await page.getByTestId('cpu-input').fill(cpu);
await page.getByTestId('disk-size-input').fill(diskSize);
```

- **Best for:** UI tests, where each JSON value maps to a *separate* input field rather than one JSON blob.
- **Also used for:** API tests where you need to reshape the data (e.g. rename keys, combine fields, or send only some of them) rather than forward the object unchanged.

**Rule of thumb to say out loud in the interview:**

> "If the JSON shape already matches what I'm sending, I pass it directly. If I need to place individual values into separate UI fields, or the request/response shape differs from how I've stored the data, I pull values out field-by-field using dot or bracket notation — bracket notation being mandatory whenever the key has a space or isn't a valid JS identifier, like `'CPU model'` or `'Hard disk size'`."

---

## Approach 3: CSV File (via PapaParse)

**When to use:** Data comes from QA/business teams in Excel/CSV form, bulk regression data sets, or data exported from another system.

**Steps to explain:**

1. Install `papaparse` (`Papa.parse`) for CSV parsing and use Node's built-in `fs` module to read the file.
2. Read the raw file content synchronously with `fs.readFileSync(filePath, "utf-8")`.
3. Pass that content into `Papa.parse()` with `header: true` (first row becomes object keys) and `skipEmptyLines: true`.
4. `Papa.parse()` returns `{ data, errors, meta }` — take `.data`, which is again an **array of objects**, one object per CSV row.
5. Loop over it exactly like Approach 1, using `for...of`.

**Code (paper-ready):**

```ts
import { test, expect } from "@playwright/test";
import Papa from "papaparse";
import fs from "fs";

function readCSV(filePath: string) {
  const csvData = fs.readFileSync(filePath, "utf-8");
  const parsedData = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });
  return parsedData.data; // array of objects
}

const testdata = readCSV("testdata/registration.csv");

for (const data of testdata as any[]) {
  test(`Test ${data.id}`, async ({ page }) => {
    await page.goto("https://example.com/practice");
    await page.getByTestId("form-email").fill(data.email);
    await page.getByTestId("form-password").fill(data.password);
    await page.getByTestId("form-confirm-password").fill(data.name);
  });
}
```

**Talking point:** "The key detail interviewers probe here is the `header: true` option — that's what converts each CSV row into a keyed object instead of a plain array of values, so I can reference fields by name (`data.email`) instead of by index."

---

## Approach 4: Reading Data from a Database

**When to use:** Test data itself isn't stored in the framework — it needs to be fetched from (or validated against) a live DB, e.g. verifying a UI action actually persisted correctly, or seeding tests from real records.

**Steps to explain:**

1. Create a reusable **DB utility/client function** (kept outside the spec file, in something like `db/dbClient.ts`) so DB logic isn't duplicated across tests.
2. Inside the function: open a connection with connection details (host, port, user, password, database).
3. Execute the query — can be static or parametrized.
4. **Always close the connection** after the query to avoid leaking DB connections during a test run.
5. Return the rows to the caller.
6. In the spec file, import and call this function, then assert on the returned rows.

**DB utility (paper-ready):**

```ts
import * as mysql from 'mysql2/promise';

export async function fetchUsers() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root123',
    database: 'testdb'
  });

  const [rows] = await connection.execute(
    'SELECT user_id, status FROM user_account'
  );

  await connection.end(); // always close the connection
  return rows;
}
```

**Spec file (paper-ready):**

```ts
import { test, expect } from '@playwright/test';
import { fetchUsers } from '../../db/dbSmokeTest';

test('Playwright can connect to MySQL Docker DB', async () => {
  const rows = await fetchUsers();
  expect(Array.isArray(rows)).toBeTruthy();
});
```

**Talking point:** "This is the one approach where the responsibility isn't just data-driving a test — it's also connection lifecycle management. I always close the connection in the same function that opens it, so a failed assertion later in the test doesn't leave a dangling DB connection."

---

## Quick Comparison Table (for rapid-fire interview questions)

| Approach     | Data Source          | Parsing Needed             | Best For                                         | Key Risk / Watch-out                             |
| ------------ | -------------------- | -------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| 1. JS Array  | Hardcoded in spec    | None                       | Small/static datasets, quick demos               | Data mixed with logic; hard to scale             |
| 2. JSON File | External`.json`    | Native`import`           | **Standard/production approach**, UI + API | Must copy to a variable before mutating          |
| 3. CSV File  | External`.csv`     | PapaParse +`fs`          | Bulk/business-provided data                      | Must set`header: true`; all values are strings |
| 4. Database  | Live DB (e.g. MySQL) | DB driver (e.g.`mysql2`) | Data validation against real DB state            | Must always close the connection                 |

## One unifying line to close the answer

> "Regardless of the source — array, JSON, CSV, or DB — the pattern I follow is the same: normalize the data into an array of objects, then generate one `test()` per record inside a `for...of` loop. That keeps my test *logic* completely decoupled from where the *data* actually comes from."
