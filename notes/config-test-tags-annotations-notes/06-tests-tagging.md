## Test Tagging in Playwright

**Purpose:** Tests ko label dena taaki selectively run kar sakein (CI me subset run karna common use case).

**Rule:** Tag hamesha `@` se start hota hai.

### Tag lagane ke 2 tarike:

```
// 1. Title me inline
test('login check @bvt', async ({ page }) => { ... });

// 2. tag option se
test('login check', { tag: '@bvt' }, async ({ page }) => { ... });

// Group level (describe) — sab child tests inherit karte hain
test.describe('Smoke Suite', { tag: '@smoke' }, () => {
  test('homepage loads', async ({ page }) => { ... }); // inherits @smoke
});
```

---

## Commands to Run by Tag

```
# Sirf ek tag
npx playwright test --grep @bvt

# Multiple tags (OR — ya toh bvt ya smoke wale chalenge)
npx playwright test --grep "@bvt|@smoke"

# Multiple tags (AND — dono tag same test pe hone chahiye)
npx playwright test --grep "(?=.*@bvt)(?=.*@regression)"

# Exclude a tag
npx playwright test --grep-invert @regression
```

---

## Project-Level Execution

| Command | Kya chalega |
| --- | --- |
| `npx playwright test --grep @bvt` | Sirf BVT tagged tests (~10 min, fast feedback) |
| `npx playwright test --grep @smoke` | Sirf Smoke tagged tests (~10 min) |
| `npx playwright test --grep "@bvt|@smoke"` | BVT + Smoke dono (still fast, ~10-15 min combined) |
| `npx playwright test --grep @regression` | Poora Regression suite (lambi — full flow coverage) |
| `npx playwright test --project=UI` | Sirf UI project ke saare tests (jo bhi tag ho) |
| `npx playwright test --project=API` | Sirf API project ke saare tests |
| `npx playwright test` | **Poora framework** — config me defined saare projects + src folder ke saare tests |

---

## Multiple Projects Setup (config-level separation)

`playwright.config.ts` me alag projects define kar sakte ho — har project apna `testDir` ya `testMatch` (file/name pattern) le sakta hai:

```
export default defineConfig({
  projects: [
    {
      name: 'BVT',
      testDir: './tests/bvt',
      // ya: testMatch: /.*bvt\.spec\.ts/
    },
    {
      name: 'Smoke',
      testDir: './tests/smoke',
    },
    {
      name: 'Regression',
      testDir: './tests/regression',
    },
    {
      name: 'UI',
      testDir: './tests/ui',
    },
    {
      name: 'API',
      testDir: './tests/api',
    },
  ],
});
```

Run specific project:

```
npx playwright test --project=BVT
npx playwright test --project=BVT --project=Smoke   # multiple projects together
```

---

## Tag vs Project — Interview Differentiator

- **Tag (`--grep`):** Test *characteristics/type* ke basis pe filter karta hai — same file me mixed tags ho sakte hain, cross-cutting concern.
- **Project (`--project`):** *Physical/structural separation* — alag `testDir`, alag config (baseURL, browser, retries) bhi ho sakta hai per project.
- Dono combine bhi ho sakte hain: `npx playwright test --project=UI --grep @smoke` → sirf UI project ke andar smoke tagged tests.

---

## Real Interview Line

> "Hum apne project me BVT, Smoke, aur Regression tags maintain karte hain. BVT aur Smoke fast feedback ke liye hain (~10 min each), CI pipeline me build ke baad turant run hote hain. Regression zyada comprehensive hai isliye time zyada leta hai, usually scheduled ya pre-release run hota hai. Hum `--grep` se specific tag run karte hain CI me, aur agar poori suite chalani ho toh sirf `npx playwright test` se config me defined saare projects/tests chal jaate hain."

---

## `package.json` Scripts — Shortcut Commands

Ye long `npx playwright test --grep @bvt` commands hum `package.json` ke `scripts` section me store karte hain taaki short `npm run` commands se directly run kar sakein — kisi ko bhi full command yaad nahi rakhni padti, aur CI me bhi same short command use hota hai.

```
// package.json
{
  "scripts": {
    "test": "npx playwright test",
    "smoke": "npx playwright test --grep @smoke",
    "bvt": "npx playwright test --grep @bvt",
    "regression": "npx playwright test --grep @regression",
    "smoke:bvt": "npx playwright test --grep \"@smoke|@bvt\"",
    "ui": "npx playwright test --project=UI",
    "api": "npx playwright test --project=API"
  }
}
```

Then simply run:

```
npm run smoke        # runs all @smoke tagged tests
npm run bvt          # runs all @bvt tagged tests
npm run regression   # runs full regression suite
npm run smoke:bvt    # runs both smoke + bvt together
npm run ui           # runs UI project
npm run api          # runs API project
npm test             # runs everything
```

**Why this matters (interview line):**
"Storing these commands in `package.json` scripts standardizes how the team runs tests — developers, QAs, and CI pipelines all use the same `npm run smoke` command, no one needs to remember or type the full `--grep` flag syntax. It also makes CI config cleaner — pipeline just calls `npm run regression` instead of a long inline command."
