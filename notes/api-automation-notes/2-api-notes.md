
# 🌐 PLAYWRIGHT — API TESTING via `APIRequestContext`

---

## 1. How does Playwright support API testing?

Playwright is not limited to UI automation — it also has an **`APIRequestContext`** object that enables pure HTTP-level API testing, without needing a browser at all. It just makes direct HTTP calls.

**There are two ways to use it:**

1. **Built-in `request` fixture** — already available with `@playwright/test`, you just inject it directly into a test.
2. **Standalone `APIRequestContext`** — created manually via `request.newContext()`, independent of any test/browser fixture, so you manage its lifecycle yourself.

---

## 2. Example 1 — Built-in `request` fixture

```typescript
import { test, expect } from '@playwright/test';

test('get list of objects', async ({ request }) => {
  // 'request' fixture is already ready — no setup needed
  const response = await request.get('https://api.restful-api.dev/objects');
  expect(response.ok()).toBeTruthy();
});
```

Just destructure `{ request }` in the test function — the same way we destructure `{ page }` for UI tests.

---

## 3. Example 2 — Standalone `APIRequestContext`

```typescript
import { request, APIRequestContext } from '@playwright/test';

let apiContext: APIRequestContext;

(async () => {
  // Manually create a context — no test/browser fixture involved
  apiContext = await request.newContext({
    baseURL: 'https://api.restful-api.dev',
  });

  const response = await apiContext.get('/objects');
  console.log(await response.json());

  // Manual cleanup is required — since there's no fixture managing it
  await apiContext.dispose();
})();
```

**When to use the standalone version** — when you need a pure API-only utility outside the test framework (setup scripts, data seeding, or a reusable API client class), or when you want a single shared context in a `beforeAll` that multiple tests reuse, instead of recreating it every time.

**Key difference:** the `request` fixture's lifecycle is managed automatically by Playwright Test (auto-disposed after the test). A standalone `APIRequestContext` requires you to call `apiContext.dispose()` manually — similar to how `browser.close()` was manual in the Playwright Library.

---

## 4. HTTP Methods — all return a Promise

The `request` fixture (or `APIRequestContext`) exposes all standard HTTP methods:

```typescript
await request.get(url, options?)
await request.post(url, options?)
await request.put(url, options?)
await request.patch(url, options?)
await request.delete(url, options?)
await request.head(url, options?)
```

- Every method returns a **`Promise<APIResponse>`**.
- **`await` is mandatory on all of them** — these are async operations, and you must wait for the HTTP round-trip to complete.

```typescript
let response: APIResponse = await request.get(url);
```

---

## 5. Second Parameter — the `options` object (common across all methods)

Every HTTP method's second parameter is an options object:

| Option        | Purpose                                                            | Commonly used in         |
| ------------- | ------------------------------------------------------------------ | ------------------------ |
| `data`      | Send JSON body                                                     | POST, PUT, PATCH         |
| `form`      | Send form-urlencoded data                                          | POST                     |
| `multipart` | File upload / multipart form data                                  | POST                     |
| `headers`   | `{ key1: value1, key2: value2 }` — custom headers for this call | All methods              |
| `params`    | `{ page: 1, limit: 100 }` — query params                        | All methods (mostly GET) |
| `timeout`   | in ms — the request must complete within this time                | All methods              |

**Path params** don't have a separate option — they're written directly in the endpoint string:

```typescript
const url = `https://api.example.com/users/${userId}/orders/${orderId}`;
```

---

## 6. GET Request — Variations

### 6.1 GET without any options

```typescript
let url: string = 'https://api.restful-api.dev/objects';
let response: APIResponse = await request.get(url);
```

### 6.2 GET with headers

```typescript
let response: APIResponse = await request.get(url, {
  headers: { "x-api-key": "afaa95a4-0843-4b6d-8385-1e03730abad7" },
});
```

### 6.3 GET with query params, headers, and timeout

```typescript
const response = await request.get(
  'https://api.example.com/bills',
  {
    params: { page: 1, limit: 10 },
    headers: { 'Authorization': 'Bearer token' },
    timeout: 10000
  }
);
```

The `params` object is automatically turned into a query string and appended to the URL:

```
https://api.example.com/bills?page=1&limit=10
```

(Playwright handles placing the `?` and `&` correctly — you don't need to manually concatenate the string.)

---

## 7. POST Request — Variations

### 7.1 POST with JSON data (`data` key)

```typescript
let baseUrl: string = 'https://api.restful-api.dev/collections';
let endpoint: string = '/appleproducts/objects';
let url: string = `${baseUrl}${endpoint}`;

const jsonData = {
  "name": "IPad Pro",
  "data": {
    "year": 2026,
    "price": 3999.99,
    "CPU model": "Mobile Intel Core i9",
    "Hard disk size": "1 MB"
  }
};

let response: APIResponse = await request.post(url, {
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "afaa95a4-0843-4b6d-8385-1e03730abad7"
  },
  data: jsonData,
});
```

**Nuance:** if you pass a plain object in `data`, Playwright automatically JSON-stringifies it and sets `Content-Type: application/json` by itself if you haven't provided one explicitly. Giving the header manually is optional but is good practice for clarity.

---

### 7.2 POST with Form data (`form` key)

When the API expects `application/x-www-form-urlencoded` (like a traditional HTML form submission — not JSON):

```typescript
let url: string = 'https://api.example.com/login';

const formData = {
  username: "prince",
  password: "Test@1234"
};

let response: APIResponse = await request.post(url, {
  form: formData,
});
```

**`data` vs `form` — the difference:**

- `data` → sends the body as a JSON string, with `Content-Type: application/json`
- `form` → sends the body as `key1=value1&key2=value2`, with `Content-Type: application/x-www-form-urlencoded`

**File uploads use `multipart`:**

```typescript
let response: APIResponse = await request.post(url, {
  multipart: {
    file: {
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: fs.readFileSync('resume.pdf'),
    },
    description: 'My resume file',   // regular form fields can go alongside the file
  },
});
```

---

## 8. Response Validation Methods — the `APIResponse` object

The `APIResponse` returned by `request.get()`/`post()` (and every other method) exposes these methods:

```typescript
const response = await request.get(url);

// ── Status & validation ──────────────────────────────
response.status()              // HTTP status code (200, 404, etc.)
response.ok()                  // Boolean — true if status 200-299
response.statusText()          // Status text ("OK", "Not Found", etc.)

// ── Body & data ───────────────────────────────────────
response.text()                // Response as plain text
response.json()                // Response parsed as JSON object
response.body()                // Response as Buffer (raw bytes)

// ── Headers ───────────────────────────────────────────
response.headerValue(name)     // A specific header's value
response.allHeaders()          // All response headers as one object
response.headers()             // Headers object

// ── Timing ────────────────────────────────────────────
response.timing()              // Request/response timing breakdown
```

**Practical assertion example:**

```typescript
const response = await request.get(url);

expect(response.status()).toBe(200);
expect(response.ok()).toBeTruthy();

const body = await response.json();
expect(body.name).toBe('IPad Pro');
```

**Important:** `text()`, `json()`, and `body()` are also **async — `await` is required**, since reading the response stream is itself an async operation. `status()`, `ok()`, and `statusText()` are synchronous — no `await` needed since that's already-received metadata, not something that needs to be read from a stream.

---

## 9. `request.newContext()` — Common Settings Shared Across All Calls

So far every example has repeated `headers` (like the API key) in **every single call**. That's not scalable — if you're making 30 API calls in a test suite and the API key changes, you'd have to update 30 places.

This is exactly the problem `request.newContext({...})` solves. Just like `browser.newContext({...})` lets you set context-wide settings (viewport, locale, storageState) that every page inside that context inherits, `request.newContext({...})` lets you set **request-wide settings that every HTTP call made through that context automatically inherits** — you don't repeat them per call.

### Options you can pass into `request.newContext({...})`

| Option                | Purpose                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `baseURL`           | A common base URL — every call's endpoint gets automatically prefixed with it, so you only pass the relative path afterward       |
| `extraHTTPHeaders`  | Headers sent with**every** request made from this context — e.g. an API key, an `Authorization` token, a `Content-Type` |
| `httpCredentials`   | `{ username, password }` — for endpoints protected by HTTP Basic Auth                                                           |
| `ignoreHTTPSErrors` | Ignore SSL certificate errors — common when testing staging/self-signed environments                                              |
| `timeout`           | A default timeout applied to every request from this context, unless overridden per call                                           |
| `storageState`      | Restore saved cookies/session state — useful if the API session was established via a prior login                                 |
| `proxy`             | Route all requests from this context through a given proxy server                                                                  |

### Example — setting common headers and baseURL once

```typescript
import { request, APIRequestContext } from '@playwright/test';

let apiContext: APIRequestContext;

apiContext = await request.newContext({
  baseURL: 'https://api.restful-api.dev',
  extraHTTPHeaders: {
    'x-api-key': 'afaa95a4-0843-4b6d-8385-1e03730abad7',
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Notice — no headers repeated here, no full URL needed either
const getResponse = await apiContext.get('/objects');

const postResponse = await apiContext.post('/collections/appleproducts/objects', {
  data: { name: "IPad Pro", data: { year: 2026, price: 3999.99 } },
});

await apiContext.dispose();
```

Both `getResponse` and `postResponse` here automatically carry the `x-api-key` and `Content-Type` headers, are sent to `https://api.restful-api.dev/...`, and will time out at 15 seconds if the API doesn't respond — none of that had to be repeated per call.

**Why this matters in practice:** in a real automation framework, you typically create this `APIRequestContext` **once** — often in a fixture, a `beforeAll` hook, or a shared API client class — with the API key, base URL, and any auth token already baked in. Every test or utility method then just calls `apiContext.get('/endpoint')` or `apiContext.post('/endpoint', { data })` without worrying about repeating credentials. If the token or base URL changes, you update it in exactly one place.

**Per-call override still works:** if a specific call needs to override something — say, a different timeout, or an extra one-off header — you can still pass `headers`/`timeout` in that individual call's options object, and it merges with (or overrides, for headers with the same key) what was set at the context level.
