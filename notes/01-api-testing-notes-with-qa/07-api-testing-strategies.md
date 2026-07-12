
# API Testing Interview Prep — Testing Strategies & Advanced Concepts

---

### 1) What all things do you validate in an API response?

- Response status code and status text.
- Response time against the expected SLA.
- Response size.
- Response headers.
- Response body content.
- Response schema, to check structure and data types.
- Business logic assertions on specific response body fields.
- Schema validation checks whether mandatory fields are present and whether field types are correct, while assertions validate the actual business logic on top of that.
- Example: for a phoneNumber field, schema validation confirms it's a number and present in the response, but a business assertion confirms it's exactly 10 digits, not less or more.

---

### 2) How do you extract values from a JSON response?

- The server returns data as a JSON string, and we parse it using JSON.parse to convert it into a JavaScript object.
- Once it's a JS object, we can access values using dot notation or bracket notation.
- In Postman, we can directly access response fields using dot notation in scripts.
- In Playwright, we call `response.json()` on the API response to get the parsed JS object directly.
- Example: `let response = await request.post(url, {}); let body = await response.json(); console.log(body.orderId);`.

---

### 3) What is JSON Schema Validation and how do you do it?

- Schema validation means checking whether an API's request or response follows a predefined structure.
- It verifies what fields should exist, what type each field should be, like string, number, or array, which fields are mandatory, and what format the values should follow.
- It's different from business logic assertions, which check the actual values against business rules.
- Example: I usually validate both schema, to confirm structure and types, and business-critical fields, to confirm correctness, through separate assertions.

---

### 4) What is Serialization and Deserialization in the context of API testing?

- Serialization is the process of converting an object or data structure into a format that can be stored, transmitted, or sent over a network, such as JSON or XML.
- Deserialization is the reverse process, converting that serialized format back into an object or data structure that the application can understand and work with.
- In a Playwright or JavaScript context, if we keep test data in a JSON file and import it, it becomes a JS object automatically; to send it to the server, we convert it to a JSON string using JSON.stringify, which is serialization.
- When we receive a response from the server, it comes back as a JSON string, and we use JSON.parse, or Playwright's `response.json()` method, to convert it back into a usable JS object, which is deserialization.
- In Java, the equivalent is a POJO object, with libraries like Jackson handling the serialization and deserialization.
- Example: `request.post(url, { data: jsObject })` internally serializes the JS object to JSON before sending it over the network.

---

### 5) What are the different API pagination strategies?

- Page-based pagination uses a page number and a limit, like `GET /v1/billers?page=2&limit=10`, where each page returns a fixed number of records.
- Offset-based pagination uses an offset and a limit, like `GET /v1/billers?offset=20&limit=10`, meaning it starts from record 20 and returns the next 10 records.
- Cursor-based pagination uses an opaque cursor value, like `GET /v1/billers?cursor=eyJXASASFERER&limit=10`, pointing to where the next set of records should start.
- Before testing any of these, it's important to confirm with the API documentation or the dev team which strategy the API actually supports.
- Example: testing page-based pagination means verifying that page=2 with limit=10 returns exactly the next 10 records after page 1.

---

### 6) What is API Mocking and when would you use it?

- API mocking is the practice of simulating an API's behavior by returning predefined responses instead of calling the real backend service.
- It enables testing when the actual APIs are still under development or not ready yet.
- It removes dependency on unstable or unavailable third-party services.
- It allows testing of edge cases and error scenarios that are hard to reproduce with a real backend.
- It speeds up automation development and testing cycles.
- Example: in our automation scripts, we mock third-party service responses to test how our application handles specific error scenarios without depending on that external service.

---

### 7) What all things do you test when testing an API, or how would you approach testing any given API?

- Functional testing checks the core business logic, validating that the response matches the API documentation for a valid payload, verifying mandatory and optional parameters, and confirming that only allowed HTTP methods work while others return a 405 error; this also includes field-level positive and negative checks like valid/invalid emails or phone number formats.
- Non-functional testing measures response time against the SLA, tests reliability by calling the same GET API repeatedly and expecting consistent responses, and observes behavior under retry or failure scenarios, like when the server is intentionally brought down.
- Security testing checks authentication and authorization, expecting a 401 for missing or invalid tokens, a 403 for a valid token with the wrong role, and includes rate limiting checks, expecting a 429 status code when the same API is hit repeatedly to prevent abuse.
- Contract testing validates required request and response headers, verifies the response schema for correct types and mandatory fields, and checks behavior for an unsupported API version.
- Behavioral testing covers idempotency, retrying a request with the same payload to confirm no duplicate records are created and the server state stays consistent, along with error handling for invalid inputs, like exceeding an allowed limit and expecting a proper error status code.
- Example: for a `POST /orders` API, I'd check successful order creation with a valid payload, missing/invalid token scenarios, retrying the same request to confirm no duplicate order, and response time against the SLA.
