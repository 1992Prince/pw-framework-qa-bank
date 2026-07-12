# Query Parameters vs Path Parameters — Interview Notes

There are **2 types of parameters** used in REST APIs: **Path Parameters** and **Query Parameters**.

---

## 1. Path Parameters

- **Definition:** Mandatory identifiers that are present **in the URL itself** (as part of the URL path).
- **Purpose:** A path parameter defines exactly **which resource** on the server you want — e.g., "user with this ID," "customer with this ID," or "transaction details with this `transaction_id`."
- **When they are mandatory:**
  - Fetching a **specific** user/resource's details (GET by ID)
  - **PUT** requests
  - **PATCH** requests
  - **DELETE** operations
  - All of these need a resource identifier so the server knows *exactly which* record to update/delete/fetch.
- **When they are NOT needed:**
  - **POST** requests don't need a path parameter for the resource ID, because POST **creates** a new resource on the server — the server generates a new resource identifier itself, and you can see that new ID in the **response payload** after creation.

**Example:**
```
GET /users/1024        → path parameter = 1024 (fetch user with ID 1024)
PUT /users/1024        → update the full resource for user 1024
PATCH /users/1024      → partially update user 1024
DELETE /users/1024     → delete user 1024
POST /users            → no ID needed here; server creates a new user and returns its new ID in the response
```

---

## 2. Query Parameters

- **Purpose:** Used for **filters, sorting, and pagination**.
- **Most commonly used with:** **GET** requests.
- **Why they're needed — real example:**
  - Suppose you hit a `GET /users` endpoint, and there are **lakhs of customers** in the server/database.
  - Fetching **all** records at once takes a long time — even in Postman, hitting the endpoint without any query params will take noticeably longer to return the full list in the response body.
  - Using query parameters, we can **limit and control** exactly how much/which data comes back from the server.

**Example progression:**

```
https://billpay-api.gaurav-practice-api.dev/users
```
→ Fetches **all** customer records (slow, heavy response).

```
https://billpay-api.gaurav-practice-api.dev/users?page=2&limit=10
```
→ With `page=2` and `limit=10` added, you now get only **10 records from page 2**.

```
https://billpay-api.gaurav-practice-api.dev/users?page=4&limit=20
```
→ Changing to `page=4` and `limit=20` gives you **20 records from page 4**.

- **Syntax rule:** Query parameters are added to the URL **after a `?`**, and multiple query parameters are separated using the **`&`** operator.
  - Format: `baseURL?param1=value1&param2=value2`

---

## 3. Quick Comparison Table

| Aspect | Path Parameter | Query Parameter |
|---|---|---|
| Location in URL | Part of the URL path itself (e.g., `/users/1024`) | Added after `?` at the end of the URL (e.g., `?page=2&limit=10`) |
| Mandatory? | Yes, for GET-by-ID, PUT, PATCH, DELETE | No, generally optional |
| Purpose | Identifies **which specific resource** | Filters, sorts, or paginates a **collection** of resources |
| Used mostly with | GET (by ID), PUT, PATCH, DELETE | GET (list/collection endpoints) |
| Needed for POST? | No — server generates its own resource ID and returns it in the response | Rarely used with POST |
| Multiple values | Usually just one identifier per resource | Multiple params combined using `&` |
| Real example | `/users/1024` → fetch/update/delete user 1024 | `/users?page=2&limit=10` → paginate through the user list |

---

## 4. Key Interview Takeaway

- **Path parameter → "WHICH resource"** (identity of a single, specific resource).
- **Query parameter → "HOW MUCH / HOW to shape the response"** (filtering, sorting, limiting, pagination on a collection).
- Path parameters are typically **mandatory** for single-resource operations (GET by ID, PUT, PATCH, DELETE), while query parameters are typically **optional add-ons** that control the shape/size of the returned data — mostly relevant on **GET** collection endpoints.

---

## 5. How Do We Test Query Parameters as an SDET?

This connects directly to the UI: the pagination you see on screen (e.g., "10 customers per page, click the next arrow to load the next 10") is powered by exactly these `page` and `limit` query parameters behind the scenes.

**On the UI side:**
- In most real applications, **not all customer records are loaded at once** — it would be too slow and heavy.
- The UI typically loads only the **first page** (e.g., 10 records) by default.
- When the user clicks the **next arrow icon**, the frontend fires a **new API call** with an updated `page` value (and the same `limit`) to fetch the **next set of 10 records**.
- So visually, each "page" of the table/list on the UI directly maps to one `GET .../users?page=X&limit=10` call happening behind the scenes.

**As an SDET, here's how we validate query parameters — with concrete test scenarios:**

### a) Functional / positive testing
- Hit the endpoint **without** any query params → confirm the API returns a default/full response (or a documented default page size).
- Hit with `?page=1&limit=10` → validate exactly 10 records are returned, and they correspond to the "first page."
- Change to `?page=2&limit=10` → validate a **different** set of 10 records is returned (i.e., no duplication with page 1, and it's the correct next chunk).
- Change `limit` to a different value, e.g. `?page=1&limit=20` → validate exactly 20 records are returned.
- Cross-check UI vs API: click "next" on the UI, capture the network call in dev tools, and confirm the `page`/`limit` values match what's expected, and that the UI table updates with the same records the API returned.

### b) Boundary / edge case testing
- `limit=0` → what does the server do? (Should ideally return an empty list or a validation error — not all records.)
- Very large `limit` (e.g., `limit=100000`) → does the server cap it, or does it try to return everything (performance risk)?
- `page` beyond the last available page (e.g., `page=9999`) → should return an empty array, not an error or a repeat of the last page.
- Negative or invalid values (e.g., `page=-1`, `limit=-5`, `page=abc`) → server should ideally respond with `400 Bad Request`, not crash or silently ignore the param.

### c) Sorting/filtering-specific query params (if supported)
- If the API supports something like `?sortBy=name&order=asc`, validate the returned records are actually sorted correctly.
- Combine multiple query params together, e.g. `?page=2&limit=10&sortBy=name&order=desc`, and validate all conditions hold simultaneously (correct page, correct count, correct sort order).

### d) Consistency and data integrity checks
- Fetch all pages sequentially (page 1, 2, 3...) and confirm **no record is skipped and no record is duplicated** across pages — this is a very common real bug in pagination logic.
- Confirm the **total count** of records (if the API exposes a `totalRecords`/`totalPages` field) matches the actual number of records you get by paging through everything.

### e) Automation approach (API test example)
- In an automated test (e.g., using REST-assured, Playwright API testing, or Postman/Newman), typically:
  1. Hit the endpoint with a known `page` and `limit`.
  2. Assert the response array size equals `limit` (except possibly on the last page).
  3. Assert the specific fields/values match expected data for that page.
  4. Loop through multiple pages and assert no duplicate IDs appear across the full dataset.
- This is far faster than doing the same validation via UI (which would require clicking "next" repeatedly and scraping the table each time), which ties back to why **API testing is preferred over UI testing** for this kind of data validation — same reasoning covered in the API vs UI testing notes.
