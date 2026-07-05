## `storageState` — Purpose, Manual Approach & Project-Based Setup/Teardown Pattern

**Interview definition:**
"`storageState` is a Playwright mechanism to persist a browser's authenticated session — cookies and localStorage — into a JSON file, so future tests can start already logged in, without repeating login steps in every single test."

---

### Purpose in plain words

Logging in through the UI for **every single test** is slow and repetitive. `storageState` lets you:

1. Log in **once**
2. Save the resulting session (cookies + localStorage) to a JSON file
3. Point future test contexts to that file — the browser context loads pre-authenticated, completely skipping the login flow

---

### Two Ways to Generate It

**Approach 1 — `globalSetup` file (the "official"/traditional way)**
A dedicated function referenced in root config (`globalSetup: require.resolve('./global-setup')`) runs once before the entire suite, logs in via API/UI, and saves storageState — covered earlier in topic 9.

**Approach 2 — Your project's approach: a normal spec file inside an `auth-setup` folder**
Instead of a separate non-test `globalSetup` function, you write the login as an actual Playwright **test**, and wire it into the `projects` array as its own project. This is a very common real-world pattern (often cleaner than `globalSetup` because you get full Playwright test features — retries, tracing, reporting — for the login step itself).

---

### Breaking Down Your Code

```
test('Creating the StorageState', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText(' Sign in ').click();
    await page.getByPlaceholder('Email').fill('primetea@gmail.com');
    await page.getByPlaceholder('Password').fill('primetea');
    await page.locator('//*[@type="submit"]').click();
    
    await page.pause();

    await page.context().storageState({ path: 'auth-storage-state/loginStorageState.json' });
});
```

- This is a **regular Playwright test** — nothing special syntactically, just `test()` with a `page` fixture
- It performs a normal UI login: navigate → click Sign In → fill email/password → submit
- `page.pause()` here is just for **manual debugging** (opens the Playwright Inspector so you can visually confirm login succeeded before the state is saved) — this should be removed in the final automated version, since it would hang CI waiting for a manual step
- **The key line:** `page.context().storageState({ path: '...' })` — this grabs the **current browser context's** cookies + localStorage/session data and **writes it to disk** as a JSON file at the given path

**Where it's saved:** at `auth-storage-state/loginStorageState.json`, relative to your project root — the folder gets created (or must exist) and the file contains a JSON structure with `cookies: [...]` and `origins: [...]` (localStorage per origin).

**Important gotcha:**

> "When running this test, comment out `storageState` in config to avoid errors"

This is because if `use.storageState` in the config **already points to a file that doesn't exist yet** (first run) or if the context is instantiated expecting to *load* a state file while you're simultaneously trying to *create* it, you can get conflicts/errors. So the flow is:

1. First run: no `storageState` set in config → run the login test → file gets created
2. After that: add `storageState: 'auth-storage-state/loginStorageState.json'` to config → now all other tests reuse it

---

### Setting `storageState` Globally vs Per-Project

**Globally (root `use` block):**

```
use: {
  storageState: 'auth-storage-state/loginStorageState.json',
},
```

Every project/test inherits this — simplest, but assumes **all tests use the same single logged-in user/session**.

**Per-project (more flexible):**

```
{
  name: 'bvt',
  use: {
    storageState: 'auth-storage-state/loginStorageState.json',
  },
}
```

This is better when different projects need **different sessions** — e.g. one project logged in as admin, another as a regular user, another with no auth at all (like the auth-setup project itself, which obviously can't already have storageState when it's the one creating it).

---

### The Full Setup → Main → Teardown Chain

```
projects: [
  // Project A: The Setup
  {
    name: 'auth_setup',
    testMatch: 'create.setup.ts',
    teardown: 'cleanup_data',
  },

  // Project B: The Cleanup
  {
    name: 'cleanup_data',
    testMatch: 'delete.teardown.ts',
  },

  // Project C: The Main Test
  {
    name: 'bvt',
    testMatch: '04-crud-project-setup-teardown-demo.spec.ts',
    use: {
      storageState: 'auth-storage-state/loginStorageState.json',
    },
    dependencies: ['auth_setup'],
  },
],
```

**Execution flow, step by step:**

1. **`auth_setup` runs first** — no `dependencies`, so nothing blocks it. It executes `create.setup.ts` (your login test), logs in via UI, and writes `loginStorageState.json` to disk.
2. **`bvt` project waits** — because of `dependencies: ['auth_setup']`, Playwright **will not start** the `bvt` project's tests until `auth_setup` completes successfully. Once it does, `bvt` runs its own spec, which uses `storageState: 'auth-storage-state/loginStorageState.json'` — the exact file `auth_setup` just created — so the browser context launches **already authenticated**. No login steps needed in this file at all:

```
test('Open application - Skip Login steps', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');
    // straight to Settings — no login, because context is pre-authenticated
    await page.getByText(' Settings ').click();
});
```

3. **`cleanup_data` runs last** — because `auth_setup` declared `teardown: 'cleanup_data'`. Teardown is tied to the setup project and is guaranteed to run **after the dependent chain finishes** — typically used to log out, delete test data created during the run, reset app state, and close things out cleanly.

**Why this pattern is powerful (interview line):**
"This creates a clean, deterministic lifecycle: `auth_setup → bvt → cleanup_data`. The main tests are completely decoupled from login logic — they assume an authenticated session exists — while setup and teardown act as bookend projects. It also means login only happens **once per full run**, not once per test, which is a major performance win at scale."

---

### Interview Trap Questions on This Topic

- **"What happens if `bvt`'s dependency `auth_setup` fails?"** → `bvt` will **not run at all** — Playwright skips dependent projects if their dependency fails, since the precondition (valid storageState) was never satisfied.
- **"Does `teardown` run even if `bvt` (the dependent main project) fails?"** → Yes — teardown is designed to run regardless of whether the dependent tests pass or fail, specifically so cleanup always happens and you don't leave orphaned test data.
- **"Why use a spec file for auth-setup instead of `globalSetup`?"** → You get full Playwright test infrastructure for the login itself — retries, trace/video/screenshot capture if login breaks, proper reporting — which a plain `globalSetup` function doesn't give you as naturally.
