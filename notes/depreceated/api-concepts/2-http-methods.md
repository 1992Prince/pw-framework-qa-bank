
# HTTP Methods — Interview Notes

## 1. What are the standard HTTP methods used in REST APIs? Have you performed CRUD operations?

The standard HTTP methods used in REST APIs are: **GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS**.

---

### GET Method

- **Purpose:** Fetches data from the server.
- **Request payload/body:** Not passed. We only pass base URL + endpoint + headers + any token, and select the GET method.
- **Server impact:** No changes are made on the server — it's pure retrieval.
- **Common use:** Mostly used for health check APIs (e.g., checking if app servers are running fine, or if the DB is up).
- **Safe & Idempotent:** Yes — same output every time for the same request.
- **Example:** Paytm fetches your Airtel number's account details.
- **Status code:** Mostly returns `200` or other `2xx` codes.

### POST Method

- **Purpose:** Creates a new resource/record on the server, or triggers an action.
- **How to use:** Select POST method + request body (JSON/XML) + headers.
- **Server impact:** Changes are made — a new resource is created.
- **Safe & Idempotent:** **Not safe, not idempotent** — calling the same request twice might create 2 resources (e.g., calling the same POST twice on mobile could trigger two identical recharges on the same number).
- **Example:** When you enter your number on Paytm and select recharge amount, Paytm sends a POST request to start the recharge transaction.
- **Status code:** Mostly `201 Created`.
- **Duplicate handling:** If you try a POST with the same payload and that data already exists on the server, it may return `409 Conflict`. Developers implement this to avoid creating multiple resources with the same data — the server blocks creating a duplicate copy.

### PUT Method

- **Purpose:** **Full resource update** — updates or replaces an existing resource entirely.
- **Idempotent:** Yes — calling the same request multiple times gives the same result.
- **Server impact:** Replaces the whole resource object on the server.
- **Status code:** Returns `2xx`.
- **Important:** If you send a PUT request without the full resource payload (i.e., only partial data), you'll get a `400` status code — meaning the request payload is incorrect.

### PATCH Method

- **Purpose:** Updates only **part** of an existing resource on the server.
- **Nature:** Partial update — more efficient than PUT.
- **Idempotent:** **Not always** idempotent.
- **Usage note:** Most developers prefer PATCH over PUT for updates.

**PUT vs PATCH — key difference:**

- In a PUT request, we send the **full resource payload** (the updated data + all other existing resource properties).
- In a PATCH request, we send **only the data that needs to be updated**.
- PATCH is more efficient because less data travels to the server compared to sending the complete resource object in PUT.

### DELETE Method

- **Purpose:** Removes an existing resource from the server.
- **Soft delete:** Sometimes instead of a hard delete, we just mark the resource's status as "deleted."
- **Idempotent:** Yes — sending the same DELETE request multiple times gives the same result (resource is already deleted after the first call).
- **Status code:** Mostly `204` — with no response body (sometimes just a message).
- **Request body:** DELETE requests usually don't require a body.
- **Follow-up behavior:** If you do a GET call on the same resource after deleting it, you should get `404 Not Found`.

### OPTIONS Method

- **Purpose:** Returns the allowed methods for an endpoint.
- **Example:** Suppose for a particular endpoint you are not allowed to DELETE. Hitting OPTIONS on that endpoint returns the methods allowed for that user/endpoint (e.g., GET, PATCH, POST — no DELETE).
- **Status code:** Mostly `204 No Content`.

### HEAD Method

- **Purpose:** Same as GET, but the key difference is HEAD does **not** return any body/output — only returns headers.
- **Use case:** For a lightweight health check of your system/API, HEAD can be used instead of GET.

### Additional note

- `2xx` series = success series.
- **HEAD and OPTIONS are the least used methods in automation testing.**

---

## 2. Very Common Interview Questions (with Answers)

### Q1. POST vs PUT vs PATCH

| Method | Purpose                               | Idempotent? | Payload                   |
| ------ | ------------------------------------- | ----------- | ------------------------- |
| POST   | Create a new resource                 | No          | New resource data         |
| PUT    | Fully replace an existing resource    | Yes         | Complete resource object  |
| PATCH  | Partially update an existing resource | Not always  | Only the fields to update |

---

### Q2. Which HTTP method is suitable for partial updates, and why?

**Answer:** **PATCH** is suitable for partial updates.

**Why:** PATCH only requires sending the specific fields that need to change, not the entire resource object. This makes it more efficient — less data travels to the server compared to PUT, where you must send the complete resource payload even if you're only updating one field. If you try to do a partial update using PUT (by sending only the changed field instead of the full object), the server will typically reject it with a `400 Bad Request` because the payload is considered incomplete/incorrect for a PUT operation.

---

### Q3. Give a real-world example showing when you will use POST, PUT, or PATCH (Paytm → Airtel example)

**Answer (using the Paytm-to-Airtel recharge flow):**

1. **GET** — Paytm fetches your customer details and Airtel account details for the entered number.
   *(Retrieval only, no server change.)*
2. **POST** — You do a recharge of a certain amount on your Airtel number. Paytm sends a POST request because a completely **new recharge/transaction resource** is being created on the server.
3. **PUT** — Suppose the recharge failed and the amount was deducted anyway. You call customer care, and they update the transaction record with the **full record** including transaction details (status, amount, timestamp, resolution notes, etc.) — this is a PUT, because the **entire resource** is being replaced/updated.
4. **PATCH** — Suppose you need to update just your **middle name** in the Paytm app. You update that field and submit. Paytm sends **only the middle name field** to the server (not your complete user profile) — this is a PATCH, since it's a **partial update**.

---

### Q4. Why is PUT idempotent but POST is not?

**Answer:** Idempotency means that no matter how many times you call the same request, the **final state of the resource on the server stays the same**.

- **PUT:** Calling the same PUT request multiple times will always result in the same resource details on the server (you're replacing the resource with the same full payload every time) — so it's idempotent.
- **POST:** Calling the same POST request multiple times with the same details **might create multiple duplicate resources** on the server if the `409 Conflict` handling isn't implemented by the dev team. Since each call can create a *new* resource, the server state changes with every call — so it's **not idempotent**.

*(Applying this to Paytm → Airtel: if the recharge POST request is retried due to a network glitch and duplicate-prevention isn't implemented, you could end up with two recharges/charges for the same transaction — whereas retrying a PUT to fix the same transaction record repeatedly won't create additional records, it'll just keep resulting in the same final record state.)*

---

### Q5. For updating a part [of a resource], which HTTP method will be used — PUT, PATCH, or POST?

**Answer:** **PATCH** — because it's designed specifically for partial updates, sending only the changed fields rather than requiring the entire resource (PUT) or implying creation of a new resource (POST).

*(Example: Updating only your middle name in the Paytm profile → PATCH, not PUT or POST.)*

---

### Q6. In a recharge flow like Paytm → Airtel, which operations are used — POST vs PUT vs PATCH?

**Answer:**

- **POST** is used to **initiate/create the recharge transaction** (a new resource — the recharge record — is created).
- **PUT** is used when the **entire transaction record needs to be replaced/updated** — e.g., customer care updating the full transaction with failure/resolution details after a failed recharge.
- **PATCH** is used for **partial updates unrelated to the recharge transaction itself** — e.g., updating just the middle name in the user's profile within the Paytm app.

---

## 3. Summary

- **Idempotent methods:** GET, PUT, PATCH*, DELETE are idempotent.
  *(Note: PATCH is called "not always idempotent" earlier — it depends on implementation, but is grouped here as generally idempotent per the summary.)*
- **Status codes:**
  - GET → `200`
  - POST → `201`
  - DELETE → `204`
- **Health check:** GET or HEAD can be used; **HEAD is recommended** (lighter, headers only).
- **Duplicate resource creation** on the server can return a `409 Conflict` error code.
- **No request body needed (most of the time):** GET and DELETE.
- **HEAD** is same as GET but does not return a response body — only provides headers.
- **PATCH is more efficient than PUT** because less data travels to the server.

## Quick Revision Table

| Method  | Purpose                            | Idempotent | Safe | Request Body              | Typical Status Code     |
| ------- | ---------------------------------- | ---------- | ---- | ------------------------- | ----------------------- |
| GET     | Fetch data                         | Yes        | Yes  | No                        | 200                     |
| POST    | Create resource / trigger action   | No         | No   | Yes                       | 201 (409 if duplicate)  |
| PUT     | Full update/replace                | Yes        | No   | Yes (full object)         | 2xx (400 if incomplete) |
| PATCH   | Partial update                     | Not always | No   | Yes (only changed fields) | 2xx                     |
| DELETE  | Remove resource                    | Yes        | No   | Usually no                | 204 (404 on re-GET)     |
| OPTIONS | List allowed methods for endpoint  | Yes        | Yes  | No                        | 204                     |
| HEAD    | Same as GET, headers only, no body | Yes        | Yes  | No                        | 200                     |
