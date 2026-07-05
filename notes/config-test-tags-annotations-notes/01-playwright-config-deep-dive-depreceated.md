# 🟣 PHASE 7 — `playwright.config.ts` DEEP DIVE

Consolidated Notes

---

## 1. PURPOSE & OVERVIEW

**`playwright.config.ts` kya hai?**
Yeh poore test suite ka **single source of truth** hai. Ek jagah se tum control karte ho:

- Kaunse browsers mein tests chalein
- Timeout kitna ho
- Parallel execution kaise ho
- Reports kahan save hon
- Global setup/teardown kya ho
- Environment-specific settings kya hon

**Kyun zaroori hai yeh samajhna?**
Bade projects mein har cheez yahan se configure hoti hai. Agar config clear nahi hogi toh CI failures, flaky tests, aur wrong environments — sab problems config se aati hain. Interview mein bhi config-related sawaal hamesha puchhe jaate hain.

---

## 2. BASIC STRUCTURE

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ─── Root-level (Suite-level) settings ─────────────────────
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 4,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'html',

  // ─── Shared settings for all tests ─────────────────────────
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  // ─── Multi-browser / multi-project setup ───────────────────
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // ─── Global hooks ──────────────────────────────────────────
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

**`defineConfig` wrapper kyun?**

- TypeScript autocomplete aur type checking milti hai
- Hover karo kisi bhi option pe → documentation inline dikhti hai
- Bina `defineConfig` ke bhi kaam karta hai, lekin type safety nahi milti

---

## 3. ROOT-LEVEL OPTIONS — HAR OPTION KA PURPOSE

### `testDir`

```typescript
testDir: './tests',
```

Playwright yahan se test files dhundta hai — recursively. Yeh relative path hai `playwright.config.ts` ke folder se. Default bhi `./tests` hai.

### `timeout`

```typescript
timeout: 30000,  // 30 seconds
```

Ek **poore test** ka maximum time. Agar test 30 seconds mein complete nahi hua — fail ho jaata hai with timeout error.

> ⚠️ `timeout` sirf poore test ka budget hai — individual actions ka nahi.

### `retries`

```typescript
retries: process.env.CI ? 2 : 0,
```

Test fail hone pe automatically retry. Best practice:

- **Local** → `0` (taaaki failures immediately dikhein)
- **CI** → `2` (network flakiness handle karne ke liye)

### `workers`

```typescript
workers: process.env.CI ? 1 : undefined,
```

Ek saath kitne parallel test processes chalein.

- `undefined` → CPU cores ka aadha (Playwright default)
- `1` → sequential, no parallel
- `4` → exactly 4 parallel

> CI mein aksar `1` rakha jaata hai kyunki shared runners pe resources limited hote hain.

### `fullyParallel`

```typescript
fullyParallel: true,
```

| Value               | Behavior                                                               |
| ------------------- | ---------------------------------------------------------------------- |
| `false` (default) | Files parallel chalti hain, lekin ek file ke tests**sequential** |
| `true`            | Files ke andar bhi tests**parallel** chalte hain                 |

### `forbidOnly`

```typescript
forbidOnly: !!process.env.CI,
```

CI mein `test.only()` se poori pipeline block ho sakti hai (sirf ek test chalega). `forbidOnly: true` rakho toh CI build fail ho jaata hai agar koi `test.only()` committed code mein ho.

### `testMatch` / `testIgnore`

```typescript
testMatch: '**/*.spec.ts',       // default glob pattern
testIgnore: '**/skip-this/**',   // yeh folders ignore karo
```

---

## 4. `use` BLOCK — SHARED SETTINGS

Yeh settings **sab tests** pe apply hoti hain jab tak project-level ya test-level override na ho.

### `baseURL`

```typescript
baseURL: 'https://example.com',
```

```typescript
// Config mein baseURL set karo
baseURL: 'https://example.com',

// Ab test mein sirf path likho
await page.goto('/login');          // → https://example.com/login
await page.goto('/dashboard');      // → https://example.com/dashboard
```

Full URL repeat karne ki zaroorat nahi. Environment change karna ho toh sirf `baseURL` update karo.

### `actionTimeout`

```typescript
actionTimeout: 15000,  // 15 seconds
```

Har ek **individual action** ka max wait:

- `page.click()`
- `page.fill()`
- `page.textContent()`
- `expect(locator).toBeVisible()` — assertions bhi yahi use karte hain

### `navigationTimeout`

```typescript
navigationTimeout: 30000,  // 30 seconds
```

Sirf **page navigation** actions ke liye:

- `page.goto()`
- `page.waitForURL()`
- `page.reload()`

### ⭐ timeout vs actionTimeout vs navigationTimeout — Summary

```
timeout (root level)
│
├── Test start hota hai
│
├── action 1 → actionTimeout = 15s budget
├── action 2 → actionTimeout = 15s budget
├── goto()   → navigationTimeout = 30s budget
├── action 3 → actionTimeout = 15s budget
│
└── Test end — total budget = timeout = 30s
```

Sab actions mil ke `timeout` ke andar complete hone chahiye.

### `headless`

```typescript
headless: true,   // browser UI nahi dikhega — CI ke liye
headless: false,  // browser visible hoga — local debugging ke liye
```

### `screenshot`

```typescript
screenshot: 'only-on-failure',  // ✅ recommended
screenshot: 'on',               // har test pe screenshot
screenshot: 'off',              // kabhi nahi
```

Screenshots automatically `test-results/` folder mein save hoti hain.

### `video`

```typescript
video: 'retain-on-failure',  // ✅ recommended — fail pe video save
video: 'on',                 // hamesha record — heavy disk usage
video: 'off',                // kabhi nahi
video: 'on-first-retry',     // sirf pehli retry pe
```

### `trace`

```typescript
trace: 'on-first-retry',     // ✅ CI standard
trace: 'retain-on-failure',  // fail pe trace — retry ke bina bhi
trace: 'on',                 // hamesha — local debugging
trace: 'off',                // kabhi nahi — fastest
```

Trace ek ZIP file hoti hai jisme test ka **step-by-step recording** hota hai — screenshots, DOM snapshots, network logs.

### `storageState`

```typescript
storageState: 'auth-storage-state/loginStorageState.json',
```

Saved authentication state load karo — taaki har test mein login karne ki zaroorat na ho. Login ek baar karo → state save karo → sab tests us state se start karein.

### `httpCredentials`

```typescript
httpCredentials: {
  username: 'admin',
  password: 'secret',
},
```

HTTP Basic Auth ke liye — browser ka authentication dialog automatically fill ho jaata hai.

### `locale` / `timezoneId` / `geolocation`

```typescript
locale: 'en-IN',
timezoneId: 'Asia/Kolkata',
geolocation: { longitude: 77.2090, latitude: 28.6139 },
```

Browser ka language, timezone, aur location simulate karo — internationalization testing ke liye.

### `viewport`

```typescript
viewport: { width: 1280, height: 720 },
```

Browser window size set karo. `devices['Desktop Chrome']` automatically yeh set karta hai.

### `ignoreHTTPSErrors`

```typescript
ignoreHTTPSErrors: true,
```

Self-signed certificates wale staging/dev environments ke liye — SSL errors ignore kar do.

### `extraHTTPHeaders`

```typescript
extraHTTPHeaders: {
  'Authorization': `Bearer ${process.env.API_TOKEN}`,
  'x-custom-header': 'value',
},
```

Har request ke saath yeh headers automatically bhejo.

---

## 5. `projects` — MULTI-BROWSER & MULTI-CONFIG SETUP

`projects` array se tum ek hi test suite ko multiple configurations mein run kar sakte ho.

### Basic Multi-Browser

```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
],
```

`...devices['Desktop Chrome']` spread karta hai — viewport, userAgent, sab pre-set ho jaata hai.

### Mobile Testing

```typescript
projects: [
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  { name: 'tablet',        use: { ...devices['iPad Pro'] } },
],
```

### Project-Level `use` Override

```typescript
projects: [
  {
    name: 'chromium-staging',
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://staging.example.com',    // root baseURL override
      storageState: 'auth/staging-admin.json',   // alag auth state
    },
  },
  {
    name: 'chromium-production',
    use: {
      ...devices['Desktop Chrome'],
      baseURL: 'https://example.com',
      storageState: 'auth/prod-admin.json',
    },
  },
],
```

**Override priority:** test-level > project-level > root `use` block

### ⭐ Project Dependencies — Setup/Teardown Pattern

```typescript
projects: [
  // Step 1: Setup project — data create karo
  {
    name: 'setup_data',
    testMatch: 'create.setup.ts',
    teardown: 'cleanup_data',          // cleanup project link karo
  },

  // Step 2: Cleanup project — data delete karo
  {
    name: 'cleanup_data',
    testMatch: 'delete.teardown.ts',
  },

  // Step 3: Main tests — setup ke baad chalenge
  {
    name: 'run_tests',
    testMatch: '**/*.spec.ts',
    dependencies: ['setup_data'],      // setup complete hone tak wait karo
  },
],
```

**Flow:**

```
setup_data → run_tests → cleanup_data
```

`teardown` property ensure karti hai cleanup tab bhi chale jab tests fail hoon.

### Authentication Setup Project Pattern

```typescript
projects: [
  // Auth setup — ek baar login karo, state save karo
  {
    name: 'auth-setup',
    testMatch: '**/auth.setup.ts',
  },

  // Main tests — saved auth state use karo
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'auth-storage-state/loginStorageState.json',
    },
    dependencies: ['auth-setup'],
  },
],
```

### `testMatch` vs `testDir` in Projects

```typescript
// Root testDir — sab projects ke liye
testDir: './tests',

// Project-specific — sirf yeh files is project mein
{
  name: 'api-tests',
  testMatch: '**/api/**/*.spec.ts',
}
```

---

## 6. `reporter` — REPORTING OPTIONS

### Single Reporter

```typescript
reporter: 'html',     // HTML report — browser mein open hota hai
reporter: 'list',     // terminal mein line-by-line output (default)
reporter: 'dot',      // minimal — sirf dots — CI ke liye
reporter: 'json',     // JSON file — external tools ke liye
reporter: 'junit',    // JUnit XML — Jenkins/Azure DevOps ke liye
```

### Multiple Reporters (Array format)

```typescript
reporter: [
  ['line'],                                           // terminal mein
  ['html', { open: 'never' }],                       // HTML — auto open mat karo
  ['json', { outputFile: 'test-results.json' }],     // JSON file
  ['junit', { outputFile: 'results.xml' }],          // JUnit XML
],
```

`open: 'never'` → CI mein zaroor lagao — browser auto-open nahi hoga.

### Custom Reporter

```typescript
reporter: [
  [require.resolve('./custom-report/metrics-reporter')],
],
```

---

## 7. `globalSetup` & `globalTeardown`

### Kya Hain?

```typescript
globalSetup: require.resolve('./global-setup'),
globalTeardown: require.resolve('./global-teardown'),
```

- **`globalSetup`** → **sab tests se pehle** ek baar chalta hai
- **`globalTeardown`** → **sab tests ke baad** ek baar chalta hai

### Kab Use Karein

| Use Case                          | Global vs beforeAll |
| --------------------------------- | ------------------- |
| DB seed karna                     | `globalSetup`     |
| Test server start karna           | `globalSetup`     |
| Login karke auth state save karna | `globalSetup`     |
| DB cleanup                        | `globalTeardown`  |
| Environment variable set karna    | `globalSetup`     |
| Per-test setup                    | `test.beforeEach` |
| Per-describe setup                | `test.beforeAll`  |

### `global-setup.ts` Example

```typescript
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page    = await browser.newPage();

  await page.goto('https://example.com/login');
  await page.fill('#username', process.env.USERNAME!);
  await page.fill('#password', process.env.PASSWORD!);
  await page.click('[type=submit]');

  // Auth state save karo — sab tests yahan se start karenge
  await page.context().storageState({
    path: 'auth-storage-state/loginStorageState.json'
  });

  await browser.close();
}

export default globalSetup;
```

### `global-teardown.ts` Example

```typescript
import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Cleanup logic — DB reset, temp files delete, server stop
  console.log('All tests done — cleaning up...');
}

export default globalTeardown;
```

---

## 8. ENVIRONMENT VARIABLES & `.env` FILE

### `dotenv` Integration

```typescript
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
```

`.env` file se variables load karo — credentials ko code mein hardcode mat karo.

### `.env` File Example

```
BASE_URL=https://example.com
USERNAME=admin@test.com
PASSWORD=SecurePass123
API_TOKEN=eyJhbGciOiJSUzI1...
CI=true
```

### Config mein Use Karna

```typescript
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
},
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

> ⚠️ `.env` ko **`.gitignore`** mein daalo — credentials commit mat karo.

---

## 9. CUSTOM TEST OPTIONS (Advanced)

Custom options define karo jo config se tests mein inject ho sakein.

### Step 1 — Type Define Karo

```typescript
// tests/test-options.ts
import { test as base } from '@playwright/test';

export type TestOptions = {
  globalsQaURL: string;
  username: string;
};
```

### Step 2 — Config mein Type Import Karo

```typescript
import { defineConfig } from '@playwright/test';
import type { TestOptions } from './tests/test-options';

export default defineConfig<TestOptions>({
  use: {
    globalsQaURL: 'https://example.com',
    username: process.env.USERNAME || 'default_user',
  },
});
```

### Step 3 — Test mein Use Karo

```typescript
import { test } from './test-options';

test('custom option test', async ({ page, globalsQaURL }) => {
  await page.goto(globalsQaURL);
});
```

---

## 10. COMPLETE CONFIG — REAL-WORLD EXAMPLE

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },

  projects: [
    // Auth setup — login karo, state save karo
    {
      name: 'auth-setup',
      testMatch: '**/auth.setup.ts',
    },

    // Main tests — auth state use karein
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth-storage-state/loginStorageState.json',
      },
      dependencies: ['auth-setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'auth-storage-state/loginStorageState.json',
      },
      dependencies: ['auth-setup'],
    },

    // Mobile
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['auth-setup'],
    },
  ],

  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

---

## 11. OVERRIDE PRIORITY — KAUNSI SETTING JEETEGI?

```
Test-level (test.use() / test.step())
    ↑  jeetega
Project-level (projects[].use)
    ↑  jeetega
Root use block (use: { ... })
    ↑  jeetega
Playwright default values
```

**Example:**

```typescript
// Root level
use: { headless: true }

// Project level override
projects: [
  { name: 'debug', use: { headless: false } }  // ← yeh jeeta
]

// Test level override
test.use({ headless: true });  // ← yeh sabse zyada priority
```

---

## 12. PRACTICE CHECKLIST

- [ ] `playwright.config.ts` mein `timeout` vs `actionTimeout` vs `navigationTimeout` — teeno alag-alag set karo aur test karo
- [ ] `fullyParallel: true` vs `false` — speed difference observe karo
- [ ] Multi-browser projects add karo — chromium, firefox, webkit
- [ ] `auth-setup` project banao — login once, reuse everywhere
- [ ] `globalSetup` mein `.env` se credentials load karo
- [ ] `reporter` array format mein multiple reporters add karo
- [ ] `storageState` use karo — ek test mein login karo, baaki skip
- [ ] `forbidOnly: !!process.env.CI` — `test.only()` commit karo, CI fail hote dekho
- [ ] Project dependencies (`dependencies`, `teardown`) — setup/teardown pattern banao
- [ ] Override priority test karo — root vs project vs test `use()`
