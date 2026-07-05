Here's the fixture Q&A rewritten in that format:

---

## 1) What is a fixture in Playwright Test?

- A fixture is reusable setup/teardown logic jo Playwright test runner tumhare test mein **parameter ke roop mein inject** karta hai
- Manually `page`, `browser`, ya custom Page Object banane ki jagah, tum unhe fixture bana ke declare karte ho — test runner khud unhe test se pehle ready karta hai aur test ke baad cleanup karta hai
- Dependency-injection pattern follow karta hai — jo chahiye woh test signature mein maango, Playwright resolve karke de deta hai

```js
test('example', async ({ page }) => {
  // "page" ek fixture hai — already created, use-ready
});
```

---

## 2) If we already have hooks, why do we need fixtures?

- Hooks **ek spec file ke andar hi specific** hote hain — dusri spec files mein reuse nahi ho sakte. Fixtures **kisi bhi number ki spec files/tests mein reuse** ho sakte hain
- Agar sirf hooks use karo, toh setup/teardown code almost **har spec file mein repeat** karna padega
- Built-in fixtures already `Browser`, `BrowserContext`, aur `page` create kar dete hain — tum seedha URL open karke actions perform kar sakte ho. Hooks use karoge toh yeh sab boilerplate khud likhna padega
- Custom fixture bana sakte ho login, API token, ya test data ke liye — jo automatically inject ho jaata hai

---

## 3) Built-in fixtures in `@playwright/test`

| Fixture | Purpose |
|---|---|
| `browser` | Shared `Browser` instance — worker ke liye ek baar launch hota hai |
| `context` | Isolated `BrowserContext` (incognito jaisa) — har test ka apna alag session |
| `page` | Fresh `Page` (tab) — har test ko naya milta hai |
| `request` | `APIRequestContext` — bina browser ke API calls karne ke liye |
| `browserName` | String (`chromium`/`firefox`/`webkit`) — conditional logic ke liye useful |

---

## 4) How fixtures reduce boilerplate and provide isolation

- Agar `page` fixture use karo, toh `Browser` aur `BrowserContext` ka object manually banane ki zaroorat nahi — fixture khud yeh sab kar deta hai aur test ke baad automatically cleanup bhi kar deta hai, explicitly kuch nahi karna padta
- Har test ke liye fixture **independent** hota hai — koi state share nahi hoti, isliye ek test ka data/session dusre test mein leak nahi hota, aur parallel execution safe rehta hai

---

## 5) Creating a custom fixture with `test.extend()` — step by step

### 1) Requirement — Kya chahiye

- Aisa fixture chahiye jo **already logged-in state** provide kare
- Tests ko har baar login ka code nahi likhna chahiye — repetitive setup avoid karna hai
- Fixture ka kaam:
  1. **Login karna** (setup)
  2. Logged-in `page` ko **test ko handover karna**
  3. Test apna kaam kare
  4. Test complete hone ke baad **cleanup/teardown code chalna chahiye**
  5. **Important:** teardown chalna chahiye chahe test **pass ho ya fail** — guaranteed teardown

### 2) Fixture "kis type" ka hoga — concept

- Yahan `loggedInUser` fixture basically ek **`page` fixture hi hai**, bas already logged-in state mein
- Test ke andar `loggedInUser` destructure karke use karte hain — normal `page` ki tarah hi behave karta hai (`.click()`, `.fill()`, `.goto()` sab available)
- **Key point:** test ko ab inbuilt `page` fixture directly maangne ki zaroorat nahi — `loggedInUser` hi kaafi hai

### 3) Custom Fixture banane ke Steps — Code ke saath

**Step 1: Fixtures folder banao**
Framework mein `fixtures/` folder, file ka naam `auth.fixture.js` — naam se hi pata chale ki authentication-related fixture hai.

**Step 2: Playwright ka `test` import karo, naam `base` rakho**
```js
import { test as base } from "@playwright/test";
```
Reason: hum khud ka naya `test` banayenge aur export karenge — same naam rakhte toh conflict ho jata.

**Step 3: `base.extend()` se naya `test` banao**
```js
export const test = base.extend({
  // yahan custom fixtures define honge
});
```
`base.extend({...})` naya `test` return karta hai jisme Playwright ke saare built-in fixtures already honge, **plus** humara custom fixture bhi.

**Step 4: Fixture define karo — setup, handover, teardown**
```js
loggedInUser: async ({ page }, use) => {
  // ── SETUP: test se PEHLE chalega ──
  await page.goto("https://example.com/login");
  await page.getByTestId("form-email").fill("gaurav");
  await page.getByTestId("form-password").fill("gaurav");
  await page.getByTestId("form-submit").click();
  console.log("✅ [auth fixture] Logged in successfully");

  // ── HANDOVER: page ko test ko de rahe hain ──
  await use(page);

  // ── TEARDOWN: test ke BAAD chalega — pass ho ya fail, dono case mein ──
  await page.getByTestId("form-reset").click();
  console.log("🔴 [auth fixture] Logged out successfully");
},
```

**Kahan kya likhna hai:**
- `use()` se **pehle** ka code = **SETUP**
- `await use(page)` = **HANDOVER point** — control test ko milta hai
- `use()` ke **baad** ka code = **TEARDOWN** — guaranteed chalta hai, Playwright internally `try/finally` jaisa mechanism use karta hai

**Step 5: `expect` ko bhi re-export karo**
```js
export { expect } from "@playwright/test";
```

**Step 6: Spec file mein fixture file se import karo**
```js
import { test, expect } from "../../fixtures/auth.fixture.js";
```

**Step 7: Test mein fixture destructure karke use karo**
```js
test("TC001 - Verify logged in user can see practice page", async ({ loggedInUser }) => {
  await expect(loggedInUser).toHaveURL(/practice/);
});
```
Test ke andar login ka ek bhi line nahi — seedha assertion/actions. Teardown (logout) automatically chal jaayega.

### 4) Multiple fixtures same file mein — possible hai, lekin avoid karo

```js
export const test = base.extend({
  loggedInUser: async ({ page }, use) => { /* ... */ },
  adminUser: async ({ page }, use) => { /* ... */ },
  apiClient: async ({ request }, use) => { /* ... */ },
});
```

Technically ek hi file mein multiple fixtures define ho sakte hain, **lekin avoid karo** — unrelated fixtures ek file mein daalne se purpose unclear ho jaata hai. **Better practice:** har concern ke liye alag fixture file (`auth.fixture.js`, `api.fixture.js`, `data.fixture.js`) — zaroorat pe merge karo ek common file mein.

### 5) API Client Login Fixture — `request` type ka fixture

```js
export const test = base.extend({
  apiLoggedInContext: async ({ request }, use) => {
    const response = await request.post("/api/login", {
      data: { username: "gaurav", password: "gaurav" },
    });
    const { token } = await response.json();
    console.log("✅ [api fixture] Logged in via API, token received");

    await use(token);

    console.log("🔴 [api fixture] Cleanup done");
  },
});
```

`page` ki jagah `request` fixture — browser UI ki zaroorat nahi, seedha API call se token chahiye. UI login se kaafi fast; real frameworks isko `storageState` ke saath combine karte hain.

### 6) Page Objects ko fixture ke through inject karna

```js
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
```

Spec file mein:
```js
test("login with valid credentials", async ({ loginPage }) => {
  await loginPage.fillCredentials("sarika@example.com", "password123");
  await loginPage.submit();
});
```

Test ko `new LoginPage(page)` likhne ki zaroorat nahi — fixture ne already handover kar diya. Yeh pattern scale hota hai — jitne Page Objects utne fixtures.

### 7) `expect` ko bhi same fixture file se export karna — kyun zaroori

Agar sirf `test` export karo, `expect` nahi, toh spec file ko do jagah se import karna padta:
```js
import { test } from "../../fixtures/auth.fixture.js";
import { expect } from "@playwright/test"; // extra import, confusing
```

`expect` ko re-export karne se sab ek hi jagah se milta hai:
```js
import { test, expect } from "../../fixtures/auth.fixture.js";
```
Cleaner hai, aur kal `expect` mein custom matchers add karne ho toh ek hi jagah change karna padega.

---

## 6) Have you created any custom fixture?

- Ek **`pageManager`** fixture jo `PageManager` class ka object har test ko provide karta hai — sab Page Objects ko centrally access karne ke liye, har test mein individually instantiate karne ki zaroorat nahi
- Ek **`APIUtility`** class fixture jo API-related methods fluent, chainable style mein team members ko call karne deta hai
- API-based login/token setup aur test data provisioning ke liye bhi fixture bana sakte hain — taaki tests ko pre-authenticated session ya ready-made data mile bina logic repeat kiye

---

## 7) Fixture scope — `test` vs `worker`

- **`test` scope (default):** Har single test ke liye naya instance banta hai. Use karo jab fixture test-specific state hold karta ho jo tests ke beech leak nahi hona chahiye — e.g. `page`, `context`, ek test ke flow se tied login session
- **`worker` scope:** Fixture **ek baar per worker process** banta hai aur us worker ke saare tests mein reuse hota hai. Use karo expensive-to-create, safely-shareable resources ke liye — e.g. `browser` launch karna, large static test-data file read karna, DB connection pool setup

```js
export const test = base.extend<{}, { sharedConfig: Config }>({
  sharedConfig: [async ({}, use) => {
    const config = await loadHeavyConfig(); // expensive, worker mein ek baar
    await use(config);
  }, { scope: 'worker' }],
});
```

Rule of thumb: banana expensive hai aur share karna safe hai (read-only/stateless) → `worker`-scoped. Fresh aur isolated per test chahiye → `test`-scoped (default).

---

## 8) Playwright's test hooks — `beforeAll`, `beforeEach`, `afterEach`, `afterAll`

- **`beforeAll`** — file/describe block ke saare tests se pehle ek baar chalta hai. **Worker** ke context mein chalta hai, test ke nahi — isliye `page` jaisa fixture directly available nahi hota (browser/context manually manage karna padega, ya better, worker-scoped fixture use karo)
- **`beforeEach`** — har individual test se pehle chalta hai. Navigation, login, ya state reset ke liye commonly use hota hai
- **`afterEach`** — har test ke baad chalta hai, pass ho ya fail — cleanup, extra debug screenshots, logging ke liye achha
- **`afterAll`** — us scope ke saare tests khatam hone ke baad ek baar chalta hai — final cleanup ke liye (shared resource close karna, bulk test data delete karna)

**Best practices:**
- `page`/`browser`-dependent setup ke liye `beforeAll` ki jagah fixtures prefer karo, kyunki `beforeAll` ko test-scoped fixtures nahi milte
- `beforeEach` lightweight rakho — har test ke liye heavy setup repeat hone se poori suite slow ho jaati hai; expensive one-time setup ko `beforeAll` ya worker fixture mein move karo
- Hooks ke andar assertions mat daalo jo actually test ke andar honi chahiye — hook failures alag tarah se report hoti hain aur debug karna mushkil ho sakta hai
- Cleanup jo test fail hone pe bhi chalna chahiye uske liye `afterEach` use karo (fixtures ka post-`use()` code often isse cleaner hota hai)

---

## 9) Code — custom fixture for login and test data

```js
// fixtures/customFixtures.ts
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type TestData = {
  username: string;
  password: string;
  products: string[];
};

type MyFixtures = {
  loginPage: LoginPage;
  authenticatedPage: LoginPage;
  testData: TestData;
};

export const test = base.extend<MyFixtures>({
  // Fixture 1: plain LoginPage, not logged in yet
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  // Fixture 2: test data (JSON/DB/API se load ho sakta hai)
  testData: async ({}, use) => {
    const data: TestData = {
      username: 'standard_user',
      password: 'secret_sauce',
      products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
    };
    await use(data);
  },

  // Fixture 3: loginPage + testData pe depend karta hai, already logged-in page deta hai
  authenticatedPage: async ({ page, loginPage, testData }, use) => {
    await page.goto('/login');
    await loginPage.login(testData.username, testData.password);
    await use(loginPage);
    // teardown yahan, agar zaroorat ho (jaise logout)
  },
});

export { expect };
```

```js
// tests/checkout.spec.ts
import { test, expect } from '../fixtures/customFixtures';

test('user can add products to cart after login', async ({ authenticatedPage, testData, page }) => {
  for (const product of testData.products) {
    await page.getByText(product).locator('..').getByRole('button', { name: 'Add to cart' }).click();
  }
  await expect(page.locator('.shopping_cart_badge')).toHaveText(String(testData.products.length));
});
```

Yeh **fixture chaining** dikhata hai: `authenticatedPage`, `loginPage` aur `testData` dono pe depend karta hai — jo test sirf `authenticatedPage` maangta hai, usko login ke saath ready session mil jaata hai, test body mein zero setup code.