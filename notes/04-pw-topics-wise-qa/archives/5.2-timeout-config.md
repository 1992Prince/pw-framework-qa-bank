# Playwright — Timeout Configuration: Complete Notes

---

## Overview

Playwright mein 5 types ke timeouts hain. Har type ko multiple levels pe set kiya ja sakta hai — global framework level se lekar individual action level tak. Sabse important cheez hai priority order — kaunsa level kaunse ko override karta hai.

---

## Default Values — Quick Reference

| Timeout Type | PW Default Value | Scope |
|---|---|---|
| Test timeout | 30,000 ms (30s) | Ek `test()` block poora |
| Action timeout | 0 ms (disabled) | `click`, `fill`, `hover`, `waitFor` etc. |
| Navigation timeout | 0 ms (disabled) | `goto`, `waitForURL`, `waitForLoadState` etc. |
| Expect / Assertion timeout | 5,000 ms (5s) | `expect(locator).toBeVisible()` etc. |
| Suite / Global timeout | None (no limit) | Poora test suite run |

> **Action aur Navigation timeout ka default `0` kya matlab hai?** — Inका koi independent limit nahi hoti. Yeh test timeout ki boundary ke andar chalta rahega. Agar test timeout 30s hai aur action timeout 0 hai — action maximum 30s tak retry kar sakta hai.

---

## 1. Test Timeout

**Kya hai:** Ek single `test('...', async () => { })` block ko complete hone ke liye maximum allowed time. Agar is time mein test finish nahi hua — `Test timeout of Xms exceeded` error aata hai aur test fail hota hai.

**PW Default:** 30,000ms (30 seconds)

### Level 1 — Global (poore framework ke liye)

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // saare tests ke liye default 60s
});
```

### Level 2 — Project level (ek specific project/browser ke liye)

```typescript
// playwright.config.ts
export default defineConfig({
  timeout: 60000, // global default

  projects: [
    {
      name: 'chromium',
      timeout: 45000, // sirf chromium tests ke liye 45s — global ko override karta hai
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      timeout: 90000, // mobile tests slow hote hain — 90s
      use: { ...devices['iPhone 13'] },
    }
  ]
});
```

### Level 3 — describe block level (group of tests ke liye)

```typescript
test.describe('Slow dashboard tests', () => {
  test.setTimeout(90000); // is describe ke andar saare tests ke liye 90s

  test('load analytics', async ({ page }) => { /* ... */ });
  test('load reports', async ({ page }) => { /* ... */ });
  // dono tests 90s timeout se chalenge
});
```

### Level 4 — Individual test level (highest priority)

```typescript
test('heavy PDF generation test', async ({ page }) => {
  test.setTimeout(120000); // sirf is ek test ke liye 2 min — kisi bhi upar ke config ko override karta hai

  await page.goto('/generate-report');
  await page.click('#export-pdf');
  // ...
});
```

### Priority Order

```
Individual test.setTimeout()  >  describe test.setTimeout()  >  Project timeout  >  Global timeout
```

> **Practical rule:** Global mein reasonable default set karo (60s). Sirf genuinely slow tests ke liye test-level override karo. "Har test ke liye alag timeout" — yeh maintenance nightmare hai.

---

## 2. Action Timeout

**Kya hai:** `click()`, `fill()`, `hover()`, `check()`, `locator.waitFor()` jaise locator action methods ke liye timeout. Agar element actionable state mein nahi aaya is time mein — `TimeoutError` throw hoti hai.

**PW Default:** `0ms` — matlab koi independent limit nahi. Test timeout ki value automatically use hoti hai.

### Level 1 — Global (use block mein)

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    actionTimeout: 15000, // saare actions ke liye 15s — poore framework mein
  }
});
```

### Level 2 — Project level

```typescript
export default defineConfig({
  use: {
    actionTimeout: 15000, // global default
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        actionTimeout: 10000, // chromium pe 10s — global use block ko override karta hai
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        actionTimeout: 20000, // mobile pe 20s
      }
    }
  ]
});
```

### Level 3 — Individual action level (highest priority)

```typescript
// Specific action pe override
await page.locator('#slow-btn').click({ timeout: 30000 });
await page.locator('#input').fill('text', { timeout: 5000 });
await page.locator('.spinner').waitFor({ state: 'hidden', timeout: 20000 });
await page.locator('#modal').waitFor({ state: 'detached', timeout: 10000 });
```

> **Note:** Action timeout ka test-level override nahi hota. Test mein directly `{ timeout }` pass karo individual action pe.

### Priority Order

```
Individual action { timeout }  >  Project use.actionTimeout  >  Global use.actionTimeout  >  PW default (0 = test timeout)
```

### Critical Rule — Action Timeout Must Be < Test Timeout

```typescript
// WRONG — action timeout test timeout se zyada hai
export default defineConfig({
  timeout: 30000,        // test: 30s
  use: {
    actionTimeout: 60000 // action: 60s — USELESS! test 30s mein khatam ho jaayega
  }
});

// CORRECT
export default defineConfig({
  timeout: 60000,        // test: 60s
  use: {
    actionTimeout: 15000 // action: 15s — test se kam, meaningful limit
  }
});
```

---

## 3. Navigation Timeout

**Kya hai:** `page.goto()`, `page.waitForURL()`, `page.waitForLoadState()`, `page.waitForNavigation()` jaise page navigation methods ke liye timeout.

**PW Default:** `0ms` — action timeout ki tarah, test timeout ki boundary use karta hai.

### Level 1 — Global

```typescript
export default defineConfig({
  use: {
    navigationTimeout: 30000, // saari navigations ke liye 30s
  }
});
```

### Level 2 — Project level

```typescript
projects: [
  {
    name: 'slow-network',
    use: {
      navigationTimeout: 60000, // slow network simulation — 60s
    }
  }
]
```

### Level 3 — Individual call level (highest priority)

```typescript
await page.goto('https://slow-app.com', { timeout: 60000 });
await page.waitForURL('**/dashboard', { timeout: 20000 });
await page.waitForLoadState('networkidle', { timeout: 45000 });
```

### Priority Order

```
Individual call { timeout }  >  Project use.navigationTimeout  >  Global use.navigationTimeout  >  PW default (0 = test timeout)
```

---

## 4. Expect / Assertion Timeout

**Kya hai:** `expect(locator).toBeVisible()`, `expect(locator).toContainText()` jaise web-first assertions ke liye retry timeout. Assertion fail ho to immediately error nahi deta — is timeout tak retry karta rehta hai.

**PW Default:** 5,000ms (5 seconds)

### Level 1 — Global

```typescript
export default defineConfig({
  expect: {
    timeout: 10000, // saare assertions ke liye globally 10s
  }
});
```

### Level 2 — Project level

```typescript
projects: [
  {
    name: 'chromium',
    expect: {
      timeout: 8000, // chromium assertions ke liye 8s
    },
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'Mobile Safari',
    expect: {
      timeout: 15000, // mobile assertions slow ho sakti hain
    },
    use: { ...devices['iPhone 13'] },
  }
]
```

### Level 3 — Individual assertion level (highest priority)

```typescript
// Specific slow assertions pe override
await expect(page.locator('#data-table')).toBeVisible({ timeout: 20000 });
await expect(page.locator('.report')).toContainText('Generated', { timeout: 30000 });
await expect(page).toHaveURL('**/dashboard', { timeout: 15000 });
```

### Priority Order

```
Individual expect { timeout }  >  Project expect.timeout  >  Global expect.timeout  >  PW default (5000ms)
```

---

## 5. Suite / Global Timeout

**Kya hai:** Poore test suite run ke liye maximum allowed time. Agar CI/CD mein tests hang kar jaayein ya koi catastrophic failure ho — yeh safety net hai.

**PW Default:** None — koi built-in limit nahi, suite indefinitely run ho sakta hai.

### Setting — Only at Global Level (config mein)

Test suite timeout sirf global config mein set hoti hai — project ya test level pe set nahi kar sakte.

```typescript
export default defineConfig({
  globalTimeout: 600000, // poora suite — 10 minutes max
});
```

> **Kab use karo:** CI pipelines mein useful hai — agar koi test hang kar jaaye aur infinite wait mein chala jaye, global timeout pipeline ko rescue karti hai. Local development mein generally set nahi karte.

---

## All 5 Timeouts — Complete Config Example

```typescript
// playwright.config.ts — enterprise framework recommended setup

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // ── Suite level ──────────────────────────────────────
  globalTimeout: 600000,       // poora suite: 10 min (default: none)

  // ── Test level — global default ───────────────────────
  timeout: 60000,              // per test: 60s (PW default: 30s)

  // ── Assertion level — global default ─────────────────
  expect: {
    timeout: 10000,            // assertions: 10s (PW default: 5s)
  },

  // ── Action + Navigation level — global default ────────
  use: {
    actionTimeout: 15000,      // click/fill/hover: 15s (PW default: 0)
    navigationTimeout: 30000,  // goto/waitForURL: 30s (PW default: 0)
  },

  projects: [
    {
      name: 'chromium',
      // Project level overrides — sirf is project ke tests ke liye
      timeout: 45000,          // test: 45s (global 60s ko override)
      expect: { timeout: 8000 },
      use: {
        ...devices['Desktop Chrome'],
        actionTimeout: 10000,
        navigationTimeout: 25000,
      },
    },
    {
      name: 'Mobile Safari',
      timeout: 90000,          // mobile slow hai — 90s
      expect: { timeout: 15000 },
      use: {
        ...devices['iPhone 13'],
        actionTimeout: 20000,
        navigationTimeout: 45000,
      },
    },
  ],
});
```

```typescript
// my-test.spec.ts — test aur action level overrides

test.describe('Report generation suite', () => {
  test.setTimeout(120000); // describe level — group of tests ke liye 2 min

  test('generate PDF report', async ({ page }) => {
    // test level override — sirf is ek test ke liye
    test.setTimeout(180000); // 3 min — is test ke liye describe ka 2 min bhi override ho gaya

    await page.goto('/reports', { timeout: 60000 });              // navigation action level override
    await page.locator('#generate').click({ timeout: 30000 });    // action level override
    await expect(page.locator('#pdf-ready')).toBeVisible({ timeout: 60000 }); // assertion level override
  });

  test('view analytics', async ({ page }) => {
    // koi override nahi — describe ka 120000ms use hoga
    await page.goto('/analytics');
  });
});
```

---

## Priority Order — Complete Summary

```
HIGHEST ──────────────────────────────────────────────── LOWEST

Test Timeout:
  test.setTimeout() in test  >  test.setTimeout() in describe  >  project timeout  >  global timeout

Action Timeout:
  action { timeout: ms }  >  project use.actionTimeout  >  global use.actionTimeout  >  PW default (0)

Navigation Timeout:
  call { timeout: ms }  >  project use.navigationTimeout  >  global use.navigationTimeout  >  PW default (0)

Expect Timeout:
  expect(...) { timeout: ms }  >  project expect.timeout  >  global expect.timeout  >  PW default (5000)

Suite Timeout:
  globalTimeout in config  ← sirf ek jagah set hoti hai
```

### Golden Rules

> `actionTimeout` aur `navigationTimeout` — hamesha test timeout se chhote rakhna chahiye. Agar action/nav timeout test timeout se bada hai — woh value kabhi reach nahi hogi, test pehle khatam ho jaayega, setting useless ho jaayegi.

```
actionTimeout (15s)  <  navigationTimeout (30s)  <  testTimeout (60s)  <  globalTimeout (10min)
```
