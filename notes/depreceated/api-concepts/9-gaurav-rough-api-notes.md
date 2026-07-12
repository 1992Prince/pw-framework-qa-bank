# API Concepts - Readable Interview Notes

## 1) Form, Query, and Path Parameters

### Q - What are Form Parameters and how are they different from query or path parameters?

- Path parameters identify a specific resource.
  - Example: `/drivers/123`
- Query parameters are used for filtering, searching, sorting, and pagination.
  - Example: `?status=active&page=2`
- Form parameters are key-value inputs sent to the server, usually from HTML forms.

## 2) API Documentation

### Q - What is API documentation and what are its key components? Give examples where API documentation happens (Swagger, Confluence docs)

API documentation is a technical guide that explains how an API works.

It should describe:
- Available endpoints
- Supported HTTP methods
- Required input parameters
- Expected response structure
- Authentication mechanism
- Error codes and meanings

Examples: Swagger/OpenAPI docs, Confluence API pages.

## 3) Architecture Basics

### Q - What do you understand by monolithic and microservices? What testing do you do and your project is what?

Monolithic architecture keeps most features in one large application.
Microservices architecture breaks functionality into smaller independent services.

In interviews, explain:
- Your project architecture type
- How testing changes with that architecture
- How dependencies are handled across services

========================================================

## 4) Idempotency

### Q - What is Idempotent or Idempotency methods?

Idempotency means calling the same API request multiple times results in the same final server state as calling it once.

Important: idempotency does not always mean the exact same response payload; it means the server state does not keep changing after repeated identical requests.

Example:
Paytm makes a GET call to fetch Airtel customer details and gets 10 records. Even after 10 repeated GET calls, records remain 10. Server state is unchanged.

Method behavior:
- GET is safe and idempotent.
- POST is not idempotent because it usually creates new resources.
- PUT is idempotent because it replaces a full resource representation.
- PATCH is often not idempotent because partial updates can keep changing state (depends on implementation).
- DELETE is idempotent:
  - First DELETE removes the resource.
  - Repeating same DELETE may return 404 Not Found.
  - Even then, server state remains unchanged after first successful delete.

Summary:
- Idempotent: GET, PUT, DELETE
- Non-idempotent (generally): POST, PATCH

### Q - Why Idempotency matters for testers?

- Validates safe retry behavior (same operation should not create unintended side effects).
- Prevents duplicate creation.
- Increases API reliability under network failures/timeouts/retries.

### Q - Why PATCH is not idempotent but PUT is?

- PUT updates/replaces the full resource. Repeating it still keeps the same final state.
- PATCH updates partial fields. If implemented as incremental logic (like deposit amount increases every call), repeated requests change state each time.

Example:
If PATCH increments balance from 1k to 10k, repeating the same PATCH can keep increasing balance.

Note: It depends on endpoint implementation, but interview answer is usually:
- PUT is idempotent
- PATCH is generally treated as non-idempotent

### Q - Which methods are safe, cacheable and idempotent?

Safe means request does not modify server state.
- Safe methods: GET, HEAD, OPTIONS

Idempotent means one call or 100 calls leads to same final server state.
- Idempotent methods: GET, HEAD, OPTIONS, PUT, DELETE

Cacheable means response can be reused (typically controlled by HTTP cache headers).
- Usually cacheable: GET, HEAD

| HTTP Method | Safe | Idempotent | Cacheable |
|-------------|------|------------|-----------|
| GET         | Yes  | Yes        | Yes       |
| HEAD        | Yes  | Yes        | Yes       |
| OPTIONS     | Yes  | Yes        | No        |
| PUT         | No   | Yes        | No        |
| DELETE      | No   | Yes        | No        |
| POST        | No   | No         | No        |
| PATCH       | No   | No         | No        |

### Q - What do you understand by SAFE methods vs IDEMPOTENT methods?

- Safe methods: do not change server state at all.
- Idempotent methods: may change server state once, but repeating same request does not keep changing state.

=====================================================

## 5) Types of APIs

There are mainly four types of APIs:
- Open APIs (Public APIs)
- Internal APIs (Private APIs, enterprise APIs)
- Partner APIs
- Composite APIs

## 6) API vs Web Services

### Q - API vs WebServices?

- A Web Service is an API that works over the internet using web protocols (HTTP/HTTPS).
- All Web Services are APIs.
- Not all APIs are Web Services.

Example:
Apache POI library is an API but not a web service, because it does not require internet/HTTP/HTTPS.

### Q - What are SOAP, REST and differences between them?

Keep ready:
- SOAP is protocol-based and XML-heavy with strict standards.
- REST is an architectural style and commonly uses JSON over HTTP.

### Q - What is full form of REST?

Representational State Transfer.

### Q - What is full form of SOAP?

Simple Object Access Protocol.

### REST vs RESTful

- REST: architectural style.
- RESTful service: a service that follows REST principles.

### URL and Components

Know components of URL:
- Scheme/protocol (`https`)
- Host/domain
- Port (optional)
- Path
- Query string
- Fragment (optional)

=====================================================

## 7) REST Principles and Constraints

### Q - What is REST? What makes an API RESTful?

REST (Representational State Transfer) is an architectural style with constraints.

Constraints:

1. Client-Server
- Separates UI/client from backend data + business logic.
- Both sides can evolve independently if contract stays stable.
- Same backend can serve web/mobile/desktop clients.

2. Stateless
- Server does not store client session state between requests.
- Each request must contain all required info (for example auth token).
- Improves scalability and simplifies server design.

3. Cacheable
- Server indicates cacheability via headers.
- Examples: `Cache-Control`, `Last-Modified`.
- Caching improves performance and reduces API load.
- Sensitive responses should not be cached.

4. Uniform Interface
- Resources have stable identifiers (URIs).
- Requests/responses include enough info in headers and payload.

5. Layered System
- System may include layers (proxy, load balancer, auth server, gateway).
- Improves scalability and security.
- Client does not need to know internal layer count.

6. Code on Demand (Optional)
- Server can send executable code to client when needed.

====================================================

## 8) Authentication vs Authorization

### Q - What is diff between Authentication vs Authorization?

Authentication = proving who you are.
- Example: showing ID card at company gate.

Authorization = proving what you are allowed to do.
- Example: you are inside company but not allowed in server room.

Practical API meaning:
- Missing/invalid authentication (no token or wrong creds) -> usually 401 Unauthorized.
- Valid user but not allowed action (wrong role/permission) -> 403 Forbidden.

Example:
If Paytm team tries to delete Airtel customer data without permission, response can be 403.

In short:
- Authentication: who are you?
- Authorization: what operations are you allowed to perform?

Follow-up interview questions:
- Q - Why does Authentication always happen before Authorization?
- Q - Can authorization exist without authentication?
- Q - Is login authentication or authorization?
- Q - Which HTTP status code is used for authentication failure?

======================================================================================

## 9) API Authentication Methods

1) Basic Authentication
- User sends username and password.
- In Postman/Hoppscotch, choose Basic Auth and provide credentials.
- Request sends Base64-encoded credentials in `Authorization` header.
- You can verify this in Postman Console.
- Since Base64 is encoding (not encryption), Basic Auth is not preferred for production unless protected strongly (for example over HTTPS and controlled environment).

2) Session Authentication
- User logs in with username/password.
- Server creates session and returns session cookie/session ID.
- Browser stores session and sends cookie in future requests.
- Server validates cookie and keeps session flow.
- You can inspect cookie/session in browser developer tools (Application tab).
- In Playwright, storage/session state can be saved and reused, so repeated auth may not be needed.

3) Token Authentication (often JWT-based)
- User logs in and gets token.
- Token includes expiry information.
- Sent as bearer token in header:
  - `Authorization: Bearer <token>`

4) OAuth-based Authentication
- Common for login with Google/Facebook/Apple.
- Target app (like BookMyShow/MakeMyTrip) does not directly collect your provider password.
- Identity provider validates user and returns authorization/token flow.

5) API Key Authentication
- Identifies client application more than individual user.
- Same API key can be shared by many users/employees in some setups.
- Usually sent in header, for example:
  - `X-API-KEY: <key>`

### Q - OAUTH1 vs OAUTH2

Be ready with high-level difference:
- OAuth 1.0 uses signed requests.
- OAuth 2.0 is token-based and simpler/adopted widely.

### Q - Which authentication is used in your project? How do you get details?

Typical answer from these notes:
- Bearer token is used.
- Added in Postman headers and automation scripts.
- Be ready to explain token generation flow in your project.

### Q - What is difference between Bearer token vs JWT token?

Interview-safe explanation:
- Bearer token is a usage type (any token presented as bearer credential).
- JWT is a token format (structured token with header.payload.signature).

================================================================================

## 10) API Testing Strategies

### 1. Response Validation - What to verify and how?

### Q - What all things to validate in response?

Validate:
- Status code and status text
- Response time
- Response size
- Response headers
- Response body
- Response schema
- Business assertions on response fields

Schema validation vs assertions:
- Schema validation checks structure, required fields, and data types.
- Assertions validate business rules.

Example:
- `phoneNumber` mandatory and numeric type -> schema check.
- Must be exactly 10 digits (not less/not more) -> assertion check.

### 2. Extracting values from JSON response

### Q - How do you extract values from JSON?

- If response is JSON string, parse it to JS object using `JSON.parse()` and access by dot/bracket notation.
- In Postman, you can directly parse/access JSON response with built-in helpers.
- In Playwright, `await response.json()` gives parsed JSON object.

Cover both tools in interviews:
- Postman
- Playwright

### Q - What is Serialization and Deserialization? (in terms of Playwright API testing)

### 3. How do you do JSON Schema Validation and what it is?

Schema validation means checking whether request/response follows the predefined contract:
- Which fields must exist
- Type of each field (string/number/array/object)
- Mandatory vs optional fields
- Expected formats/patterns

Interview line to remember:
- "I validate both schema and business-critical fields via assertions."

=======================================================================================

## 11) Advanced API Concepts

### 1. API Pagination - Offset, Cursor, and Page-based strategies

Page-based:
`GET /v1/billers?page=2&limit=10`
- Provide page number + limit.
- Verify expected item count per page.

Offset-based:
`GET /v1/billers?offset=20&limit=10`
- Start from offset and return limit count.
- Example: 30 total records, offset 20 + limit 10 returns next 10.

Cursor-based:
`GET /v1/billers?cursor=eyJXASASFERER&limit=10`
- Cursor token points to next set.
- Mentioned as less commonly seen in this context.

Important:
Not all APIs support all pagination styles. Confirm support in API docs/dev discussions before testing.

### 2. What is API Mocking and when would you use it?

API mocking means simulating backend behavior with predefined responses instead of calling real services.

When useful:
- API not ready / under development
- Dependency service unstable or unavailable
- Need edge-case and error-path testing
- Faster automation development cycle
- Third-party integration simulation

### 3. Serialization and Deserialization

Serialization:
- Converting object/data into transferable format (JSON/XML).
- Needed because systems exchange data in neutral formats.

Playwright context:
- Test data may exist as JSON file.
- Imported data becomes JS object in script.
- To send as raw JSON string manually: `JSON.stringify(jsObject)`.
- In `request.post({ data: ... })`, Playwright handles serialization internally.

Java context:
- POJO objects are serialized/deserialized with libraries like Jackson.

Deserialization:
- Converting JSON/XML back into usable language object.

Playwright example:
```js
let response = await request.post(url, {});
let body = await response.json();
```

Notes:
- JSON = JavaScript Object Notation
- POJO = Plain Old Java Object
- Accessing JS object fields (dot or `[]`) is easier than handling raw serialized text.

================================================================================

## 12) What all things to test in an API?

### Q - What all things to test in API or how will you test an API?

Applies to any endpoint type (POST, GET, etc.).

1) Functional - Functionality, parameters, allowed methods
- Validate business logic with valid payload per API doc.
- Validate mandatory and optional parameters.
- Verify allowed methods (if only POST is allowed, GET/PUT/DELETE should return 405).
- Field-level positive/negative coverage:
  - Email format and domain cases
  - Phone number valid/invalid lengths and country code scenarios
- Edge cases relevant to each field (do not test random negatives unrelated to field behavior).
- Example checks:
  - Recreate with existing orderId
  - Additional unexpected payload field
  - Missing mandatory fields

2) Non-Functional - Performance, response time, reliability
- Measure response time against SLA (example <= 500ms).
- Repeated requests should remain reliable/consistent.
- Validate retry/failure behavior (for example temporary server outage scenarios and expected error code/message handling).

3) Security - Authentication, authorization, rate limiting
- No token -> expect 401.
- Invalid token -> expect 401.
- Valid token but wrong role -> expect 403.
- Rate limiting: burst many requests (for example 100) and verify 429 Too Many Requests appears.

4) Contract - Headers, schema, versioning
- Validate required request and response headers.
- Validate schema (data types and mandatory fields).
- Validate unsupported API version behavior.

5) Behavior - Idempotency, error handling, state
- Retry same payload and verify no duplicates where idempotency is expected.
- Validate state transitions after operation.
- Error handling with invalid/extreme values (example high recharge amount) should return expected error status and message.
- Goal: confirm API fails safely and predictably under invalid inputs.