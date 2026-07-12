
# Important HTTP Status Codes — Interview Notes

**Memory shortcut:** *"I Should Remember Client Server"*

| Series | Meaning                               |
| ------ | ------------------------------------- |
| 1xx    | Informational responses (rarely used) |
| 2xx    | Success responses                     |
| 3xx    | Redirection responses                 |
| 4xx    | Client-side errors                    |
| 5xx    | Server-side errors                    |

---

## 2xx — Success Responses

### 200 OK

- **Meaning:** Request was successful.
- **When it occurs:** Most commonly seen with **GET** requests — when you successfully retrieve the response.
- **Example:** Paytm calls Airtel's `getCustomerDetails` endpoint for a valid number → server returns the details with `200 OK`.
- **When it won't occur:** If the resource doesn't exist, you'll get `404` instead, not `200`.

### 201 Created

- **Meaning:** A new resource was created.
- **When it occurs:** Very common for **POST** requests — when a resource is successfully created on the server.
- **Example:** You initiate a recharge on Airtel via Paytm → a new recharge transaction resource is created → server responds `201 Created`.
- **When it won't occur:** If you POST the exact same data that already exists and the server has duplicate-prevention logic, you'll get `409 Conflict` instead of `201`.

### 204 No Content

- **Meaning:** Success, but no response body is returned.
- **When it occurs:** Very common for **DELETE** requests — the delete operation succeeds and there's nothing to send back.
- **Example:** Airtel team deletes an old customer record → server responds `204 No Content`.
- **Also seen with:** OPTIONS requests (listing allowed methods, often with no body).
- **When it won't occur:** If the DELETE target doesn't exist in the first place, you may get `404 Not Found` instead of `204`.

---

## 3xx — Redirection Responses

- 3xx codes are for redirection and are **rarely seen in typical enterprise/internal API testing**.
- **When it occurs:** Mostly when your application embeds a link to another external website. Clicking it takes you to a different page/domain. If you open developer tools, you may see `301` or other `3xx` codes for those specific calls being redirected.
- **When it won't occur:** For normal internal REST API calls (e.g., Paytm's own backend endpoints for recharge, balance check), you generally won't see 3xx — those are typically only relevant for URL/domain-level redirects, not standard CRUD API operations.

---

## 4xx — Client-Side Errors

### 400 Bad Request

- **Meaning:** The client sent an invalid request payload/format, or is missing required fields.
- **When it occurs:** Malformed JSON, or validation failure on submitted data.
- **Example:** You send a PUT request to update a customer record but forget to include a mandatory field (e.g., `customerId`) → server responds `400 Bad Request`.
- **Also occurs when:** Sending a PUT request with only partial data instead of the full resource payload (since PUT expects the complete object).
- **When it won't occur:** If the payload structure and required fields are all correct but the *data itself* is unauthorized or doesn't exist — that's `401`/`403`/`404`, not `400`. 400 is specifically about the request being malformed/invalid, not about permissions or existence.

### 401 Unauthorized

- **Meaning:** Authentication failed.
- **When it occurs:** Token is missing or expired — the user is hitting the endpoint without a token, or with an expired one.
- **Example:** You try to call Airtel's recharge API without passing the auth token (or the token expired) → server responds `401 Unauthorized`.
- **When it won't occur:** If the token is valid but the user simply doesn't have permission for that specific action — that's `403 Forbidden`, not `401`. The distinction: 401 = "who are you?" (identity not established), 403 = "I know who you are, but you can't do this."

### 403 Forbidden

- **Meaning:** The user is authenticated, but not allowed to perform this specific action.
- **When it occurs:** User has valid credentials/token, but lacks permission for that operation.
- **Example:** The Paytm team is allowed to **fetch** Airtel customer details (GET) but **not allowed to delete** any customer. If Paytm tries a DELETE call on a customer record, Airtel's server responds `403 Forbidden`.
- **How to try it in Postman:** Use a valid auth token (so authentication succeeds) but attempt an action outside the token/role's allowed permissions (e.g., a read-only token trying a DELETE call) — you should get `403`.
- **When it won't occur:** If there's no token at all, you'd get `401` instead (since the server can't even authenticate you) — `403` specifically means authentication succeeded but authorization failed.

### 404 Not Found

- **Meaning:** The requested resource doesn't exist on the server.
- **When it occurs:** Trying to access a resource that has been deleted or never existed.
- **Example:** Airtel team deletes a customer's details from the server. Paytm team then tries to fetch the same customer's details by ID via a GET request → Paytm receives `404 Not Found`.
- **When it won't occur:** If the resource still exists and you have the correct ID/permissions, you should get `200 OK`, not `404`. Also, if the endpoint URL itself is wrong/misspelled (not the resource ID), some setups may still return `404`, but conceptually that's a slightly different cause (missing route vs. missing resource).

### 405 Method Not Allowed

- **Meaning:** The HTTP method used is not supported on this endpoint.
- **When it occurs:** Calling an unsupported method on a specific API — e.g., calling POST on an endpoint that only supports GET.
- **Example:** There's a health-check endpoint meant only to check if the system/server is up (GET only), but you call POST on it → server responds `405 Method Not Allowed`, since POST isn't supported on this endpoint.
- **When it won't occur:** If you call a supported method on the endpoint (e.g., GET on the health-check endpoint), you'd get a normal `200 OK`, not `405`.

### 409 Conflict

- **Meaning:** Duplicate resources are not allowed on the server.
- **When it occurs:** Trying to do a POST with the same data/details that already exist on the server.
- **Example:** You try to create the same recharge transaction twice with identical details in a short span (before the first completes) → server responds `409 Conflict` to prevent a duplicate resource.
- **When it won't occur:** If the payload is genuinely new/unique data, POST will succeed normally with `201 Created`, not `409`.

### 422 Unprocessable Entity

- **Meaning:** The syntax is valid, but the data itself is invalid per business rules.
- **When it occurs:** The request is technically well-formed, but violates a business-level contract or validation rule.
- **Example:** The server expects the request payload in **JSON** format, but you send it in **XML**. The format is technically "valid" data (well-formed XML), but as per the business contract (server expects JSON), it is unprocessable → `422`.
- **When it won't occur:** If the JSON itself is malformed/broken syntax, that's a `400 Bad Request` (syntax error), not `422`. The key difference: `400` = broken syntax, `422` = correct syntax but semantically/business-wise invalid.

### 429 Too Many Requests

- **Meaning:** Rate limit exceeded.
- **When it occurs:** Hitting the same endpoint with multiple requests at the same time/too frequently.
- **Example:** In a `for` loop, you try to hit an endpoint 1,000 times rapidly → the system blocks further requests and responds `429 Too Many Requests`. This is done to prevent abuse/attacks (e.g., DoS-style hammering).
- **When it won't occur:** If requests are made within the allowed rate limit (normal usage pattern, spaced out), you won't see `429` — you'd get normal success/error codes based on the actual request content.

---

## 5xx — Server-Side Errors

### 500 Internal Server Error

- **Meaning:** Generic server failure due to an unhandled exception.
- **When it occurs:** Some edge case or unexpected input that the dev team hasn't handled crashes the server logic.
- **Example:** You try to do a recharge of ₹1,00,000 (unusually high amount), or you "try to act smart" by passing a value like `0` where the system wasn't expecting it, and the dev team hasn't handled this case → server throws `500 Internal Server Error`.
- **When it won't occur:** If the input is valid and handled properly by the application code, you shouldn't see `500` — you'd get either a success code or a proper handled error (`400`/`422`, etc.) instead of a crash.

### 502 Bad Gateway

- **Meaning:** One system in a chain of connected systems is failing to get a valid response from another.
- **When it occurs:** In enterprise setups, different systems/services are connected to each other. If any **upstream or downstream** service is down or misbehaving, the gateway/proxy in between returns `502 Bad Gateway`.
- **Example:** Paytm calls its own gateway service, which in turn calls Airtel's system. If Airtel's system (the downstream service) is unreachable or returns garbage, Paytm's gateway responds to the client with `502`.
- **When it won't occur:** If all upstream/downstream systems are healthy and responding correctly, the gateway will just pass through the actual response (200, 201, 404, etc.) instead of `502`.

### 503 Service Unavailable

- **Meaning:** The server itself is down/unavailable.
- **When it occurs:** When the server (or a critical downstream server) is down — e.g., during maintenance, overload, or outage.
- **Example:** Airtel's recharge server is down for maintenance → any request to it responds `503 Service Unavailable`.
- **What can be done:** As a tester, there's nothing to fix on your end here — you simply report to the dev/ops team that the downstream server appears to be down.
- **When it won't occur:** If the server is healthy and just slow, you might instead see a timeout rather than a clean `503` — `503` implies the server (or load balancer) is explicitly signaling unavailability.

---

## Quick Revision Table

| Code | Meaning               | Typical trigger (real example)                                  |
| ---- | --------------------- | --------------------------------------------------------------- |
| 200  | OK                    | GET customer details successfully                               |
| 201  | Created               | POST — new recharge transaction created                        |
| 204  | No Content            | DELETE — customer record removed successfully                  |
| 3xx  | Redirection           | Clicking an embedded external link/domain redirect              |
| 400  | Bad Request           | Malformed JSON / missing required field in payload              |
| 401  | Unauthorized          | Missing or expired auth token                                   |
| 403  | Forbidden             | Valid token, but not permitted to DELETE a customer             |
| 404  | Not Found             | GET on a customer record that was already deleted               |
| 405  | Method Not Allowed    | POST on a GET-only health-check endpoint                        |
| 409  | Conflict              | POST creating a duplicate resource that already exists          |
| 422  | Unprocessable Entity  | Sending XML when server's contract expects JSON                 |
| 429  | Too Many Requests     | Hammering an endpoint 1,000 times in a loop                     |
| 500  | Internal Server Error | Unhandled exception (e.g., recharge of ₹1,00,000 not handled)  |
| 502  | Bad Gateway           | Downstream/upstream service (e.g., Airtel's system) unreachable |
| 503  | Service Unavailable   | Server down for maintenance/overload                            |
