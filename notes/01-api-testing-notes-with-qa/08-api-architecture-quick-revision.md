# API + Architecture Quick Revision Notes 🚀

> Quick 10-15 minute revision before an interview. Concise, scenario-based, interview-ready.

---

## 1️⃣ SWE Architecture Types + Project Context

### Architecture Types

| Type | Remember |
|---|---|
| **Monolithic** | Everything in one codebase |
| **Microservices ⭐** | Independent services + separate DB |
| **Event Driven** | Communication through events (Kafka/RabbitMQ) |
| **SOA** | Older architecture, uses ESB |

### Monolithic vs Microservices

| Monolithic | Microservices |
|---|---|
| One application | Many services |
| Shared DB | Separate DB |
| One deployment | Independent deployment |
| Hard to scale | Easy to scale |
| Entire app impacted by one bug | Service isolation |

### 🎯 My Project (Ready spoken answer)

- **Domain:** Telecom
- **Architecture:** Microservices
- **Frontend:** React Web + Mobile
- **Communication:** REST APIs
- **DB:** One DB per service
- **External Systems:** Payment Gateway, SMS Provider, CRM

**Major Services:**

| Service | Purpose |
|---|---|
| Customer | Customer Profile & KYC |
| Offer | Recharge Offers |
| Recharge | Plan Activation |
| Payment | Payment & Refund |
| Billing | Bills & Invoices |
| Notification | SMS & Email |

**📢 Spoken answer:**
> Our Telecom application follows a Microservices Architecture. Instead of one large application, it is divided into multiple independent services — Customer, Offer, Recharge, Payment, Billing, and Notification Service. Each service has its own responsibility and database, which makes the application easier to maintain and scale. Most communication happens through REST APIs, and asynchronous operations like notifications may use event-based communication where applicable. The frontend is built using React Web and Mobile applications, which consume the backend APIs. As an SDET, I mainly test backend APIs for customer management, recharge, offers, payments, and notifications — my responsibilities include functional testing, API automation using Playwright, database validation, integration testing, and regression testing.

---

## 2️⃣ API, Contract, Test Pyramid

- **API** = Application Programming Interface — lets two systems talk to each other, even if they're on completely different tech stacks (e.g., Java ↔ Python).
- **Contract** = the "rulebook" both client and server must follow so they can understand each other reliably. Examples: OpenAPI/Swagger spec, API documentation, schema files (JSON Schema, Protobuf, GraphQL SDL).

### Why API Testing?
- Fast execution
- Less flaky than UI tests
- Lower maintenance effort
- Catches bugs earlier in the release cycle
- Per the Test Pyramid, we need more API tests than UI tests

### Test Pyramid (top → bottom)
```
        UI Tests (fewest)
   Integration/API Tests (more)
        Unit Tests (most)
```

### API Types
- **Public** — open to any external developer
- **Partner** — shared only with specific business partners
- **Private (Enterprise)** — used only internally within the organization

---

## 3️⃣ URL, Protocols, HTTP vs HTTPS

**Protocol** = a set of rules that defines how two systems communicate over a network.
Common protocols: HTTP, HTTPS, SMTP, TCP, UDP

### HTTP
- Application layer (Layer 7) protocol used for client-server communication
- Defines methods like GET, POST, PUT, etc.
- **Stateless** — every request is independent
- **Not secure** — sends data in plain text, no encryption

### HTTPS
- HTTP + SSL/TLS encryption
- Client and server first perform an SSL/TLS handshake to establish a secure connection; after that, all requests/responses are encrypted

### HTTP vs HTTPS

| HTTP | HTTPS |
|---|---|
| No encryption | Encrypted communication |
| Less secure | Highly secure |
| Uses HTTP | Uses HTTP + SSL/TLS |
| Data in plain text | Data encrypted |
| Port 80 | Port 443 |

### URL Components
```
https://www.google.com/imageid1?page=10
   |          |             |        |
protocol    domain      path param  query param
```
**Definition:** URL (Uniform Resource Locator) is the complete address of a resource on the internet, made up of Protocol + Domain/Host + Path Parameter + Query Parameter.

---

## 4️⃣ API vs Web Services

- **Web Service** = an API that communicates over the internet using web protocols like HTTP or HTTPS. It enables communication between two applications over a network.
- Every Web Service is an API, but not every API is a Web Service (e.g., Apache POI is a Java API but doesn't need the internet to work).

### Web Service Types

| Type | Definition |
|---|---|
| **REST** | Architectural style using HTTP methods and JSON for communication |
| **SOAP** | Protocol for exchanging structured XML messages |
| **GraphQL** | Lets clients request only the data they need |
| **Websockets** | Two-way real-time communication between client and server |
| **RPC** | Allows one application to execute a function on another server as if it were a local method |

### REST vs SOAP

| REST | SOAP |
|---|---|
| Architectural style itself, defined by principles/constraints | A protocol |
| Lightweight | Heavy, lots of security tags — complex |
| Common, comparatively less secure | Very secure, used mostly in banking apps |
| Can communicate in JSON or XML | Only XML |

### REST vs GraphQL

- **REST:** exposes multiple endpoints, each returns a fixed set of data. If the UI needs data from multiple resources, it usually needs multiple calls.
  ```http
  GET /customer
  GET /offers
  GET /billing
  ```
- **GraphQL:** exposes a single endpoint; the client specifies exactly what data it needs, and the server returns only that in one response — reduces API calls and avoids over-/under-fetching.

### REST Principles
Client-Server, Stateless, Cacheable, Uniform Resource Locator, Layered System

### REST vs RESTful
- **REST** = the architectural style itself, defined by a set of principles and constraints
- **RESTful service** = an actual service/API that implements those REST principles in practice

---

## 5️⃣ HTTP Methods

| Method | Purpose | Idempotent? | Payload |
|---|---|---|---|
| **GET** | Fetches data from the server | ✅ Yes | No payload |
| **POST** | Creates a new record/resource on the server | ❌ No | JSON payload required |
| **PUT** | Full resource update — replaces the whole resource | ✅ Yes | Full payload required |
| **PATCH** | Updates only part of an existing resource | ❌ Not always | Only the fields to update |
| **DELETE** | Removes an existing resource | ✅ Yes | Body not required |
| **OPTIONS** | Returns the allowed methods for an endpoint | — | — |
| **HEAD** | Same as GET but returns no body — only headers. Used for lightweight health checks | — | — |

### PUT vs PATCH
- PUT → send the **full resource payload** (updated data + all other existing properties)
- PATCH → send **only the data that needs to be updated** — more efficient, less data travels to the server
- **Why is PUT idempotent but PATCH isn't?** PUT replaces the complete resource every time, so no matter how many times you hit it, the server state stays the same. PATCH updates only part of the resource, so repeated calls can behave differently depending on what's sent.

### Key status codes per method
- GET → 200 OK (404 if resource doesn't exist)
- POST → 201 Created (409 Conflict if duplicate data isn't allowed)
- PUT (partial payload sent by mistake) → 4xx client error
- DELETE → 204 No Content

---

## 6️⃣ Status Codes (Shortcut: remember "Client-Server")

```
1xx - Informational
2xx - Successful
3xx - Redirected
4xx - Client errors
5xx - Server errors
```

### 2xx
| Code | Meaning |
|---|---|
| 200 OK | Request was successful (GET) |
| 201 Created | A new resource was created (POST) |
| 204 No Content | Success, but no response body — common for DELETE, also seen with OPTIONS |

### 3xx
- Rarely seen in typical enterprise/internal API testing — used for redirection
- **301** — Permanent redirect, e.g., a link on a page navigates the user to a different web app
- **304** — Not Modified

### 4xx (Client errors)
| Code | Meaning |
|---|---|
| 400 | Bad Request |
| 401 | Unauthorised |
| 403 | Forbidden |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 409 | Conflict |
| 422 | Unprocessable Entity — syntax is valid, but the data itself violates business rules |
| 429 | Too Many Requests — rate limit exceeded, e.g., hitting the same endpoint too frequently |

### 5xx (Server errors)
| Code | Meaning |
|---|---|
| 500 | Internal Server Error — generic server failure due to an unhandled exception |
| 502 | Bad Gateway — one system in a chain is failing to get a valid response from another |
| 503 | Service Unavailable — the server itself is down |

---

## 7️⃣ Headers

**Definition:** Headers are metadata that travels along with your API request (URL + payload) to define things like content type, authentication, and other request/response context.

**A complete HTTP request has 4 parts:**
1. HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
2. URL endpoint
3. Headers
4. Request payload (body)

| Header | Purpose |
|---|---|
| Content-Type | Tells the server what format the request body data is in |
| Accept | Tells the server what format the client wants the response in |
| Authorization | Provides auth credentials, e.g., a bearer token |
| User-Agent | Identifies client info — which app/tool/browser is making the request |
| Accept-Language | Specifies the client's language preference for the response |

---

## 8️⃣ Path Param vs Query Param vs Form Param

| Type | Definition | Mandatory? |
|---|---|---|
| **Path Parameter** | Defines exactly which resource on the server you want; it's embedded directly in the URL path (e.g., `/customer/123`) | ✅ Mandatory |
| **Query Parameter** | Appended after `?` in the URL; used mostly in GET requests for filters, sorting, and pagination (e.g., `?page=10&sort=asc`) | ❌ Not mandatory |
| **Form Parameter** | Data sent in the body of a request as key-value pairs, typically with `Content-Type: application/x-www-form-urlencoded` or `multipart/form-data` — commonly used for HTML form submissions or file uploads | Depends on the form field |

---

## 9️⃣ Idempotency

**Definition:** Idempotency means that executing the same API request multiple times results in the same system state as executing it just once. It doesn't mean the output has to be identical every time — just that the system's state stays the same.

- **Idempotent:** GET, PUT, DELETE
- **Not idempotent:** POST, PATCH
- **Example:** Calling a GET API to fetch 10 customer records will still show 10 records no matter how many times you call it.

---

## 🔟 Cookies

**Definition:** A cookie is a small piece of data that the server sends to the client's browser, which the browser then stores and sends back with every subsequent request to that server.

**Purpose:**
- Maintain session state (e.g., keeping a user logged in)
- Track user preferences
- Enable personalization and analytics tracking

In API testing, cookies are often used in **Session Authentication** — after login, the server issues a session cookie, which must be sent with every following request to stay authenticated.

---

## 1️⃣1️⃣ Curl Command

**Definition:** `curl` (Client URL) is a command-line tool used to send HTTP requests directly from the terminal, without a GUI tool like Postman — useful for quick API testing, debugging, and scripting/CI pipelines.

**Basic syntax:**
```bash
curl -X GET "https://api.example.com/customer/123" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```
```bash
curl -X POST "https://api.example.com/customer" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "phone": "9876543210"}'
```
- `-X` → HTTP method
- `-H` → header
- `-d` → request body/payload

---

## 1️⃣2️⃣ API Versioning

**Definition:** Versioning is the practice of managing changes to an API over time so that existing clients don't break when new features or changes are introduced.

**Common strategies:**
| Type | Example |
|---|---|
| URI Versioning | `/api/v1/customer`, `/api/v2/customer` |
| Query Param Versioning | `/api/customer?version=1` |
| Header Versioning | `Accept: application/vnd.company.v1+json` |

---

## 1️⃣3️⃣ Pagination & Filtering

**Pagination — Definition:** Splitting a large set of results into smaller, manageable "pages" so the server doesn't return all records at once.
```
GET /customers?page=2&limit=10
```
Common params: `page`, `limit`/`size`, `offset`, or cursor-based tokens for large datasets.

**Filtering — Definition:** Narrowing down the result set based on specific field values passed as query parameters.
```
GET /customers?status=active&city=Delhi
```

---

## 1️⃣4️⃣ Authentication & Authorization

**Authentication vs Authorization:**
- **Authentication** = verifying *who you are* (login, credentials)
- **Authorization** = verifying *what you're allowed to do* (permissions/roles) once authenticated

### Auth Methods

| Method | How it works |
|---|---|
| **Basic Auth** | Username:password encoded in Base64, sent in the Authorization header — not encrypted, so not recommended for production |
| **Digest Auth** | An improvement over Basic Auth — instead of sending the password directly (even encoded), it sends a hashed value of the credentials combined with a server-provided "nonce," making it harder to intercept and reuse credentials |
| **Session Auth** | Login once → server creates a session and returns a session cookie → this cookie is sent with every subsequent request to maintain the session; in Playwright this session state can be stored and reused across API calls |
| **Token Auth (JWT)** | After login, you receive a token containing expiry info — called a bearer token, passed in the Authorization header as `Bearer <token>` |
| **OAuth** | Common when logging into a third-party site using Gmail/Facebook — the target site never sees your actual credentials, since the identity provider verifies you |
| **API Key Auth** | Uses a fixed key, e.g., an `X-API-KEY` header — the server doesn't necessarily know which specific user is calling, only that the key is valid |

**📢 Project example:** In our project, we use Bearer Token authentication — adding the token in the headers, both in Postman for manual testing and in our automation scripts for Playwright API tests.

---

## 1️⃣5️⃣ What to Validate in an API Response

1. Response status code and status text
2. Response time against the expected SLA
3. Response size
4. Response headers
5. Response body content
6. Response schema — structure and data types
7. Business logic assertions on specific response body fields

**Schema validation vs. Business assertion:**
- Schema validation checks whether mandatory fields are present and whether field types are correct
- Assertions validate the actual business logic on top of that
- **Example:** for a `phoneNumber` field, schema validation confirms it's a number and present in the response; a business assertion confirms it's exactly 10 digits — not less, not more.

---

## 1️⃣6️⃣ Postman Overview

```
Postman
 ├── Workspace
 ├── Collection
 ├── Variables → Global + Environment + Collection level
 ├── Pre/Post-request scripts → commands/syntax to set & access variables
 ├── SSL + Proxy setup + curl commands (import as curl)
 ├── Sending cookies in Postman
 └── Postman UI interface tabs
```
