
# Concept 10 - Error Handling, Framework Design & Best Practices

---

# 📌 Concept (Revision)

This section covers common framework-level interview questions that are frequently asked to experienced Automation Engineers (3–8 Years).

These questions are less about writing API calls and more about **how you designed and maintained your framework.**

---

# Error Handling

## What is Error Handling?

Error handling is the process of detecting failures, logging useful information, and failing the test with meaningful error messages instead of generic exceptions.

A good API framework should always provide enough information to debug failures quickly.

---

## Why Do We Need Error Handling?

Without proper error handling:

- Failures become difficult to debug.
- Stack traces become very large.
- Root cause is difficult to identify.
- Teams spend more time investigating failures.

Instead of seeing

```text
Error: Request Failed
```

we should know

- Endpoint
- HTTP Method
- Status Code
- Response Body
- Payload
- Headers

This makes debugging much faster.

---

# What Do We Handle In Our Framework?

Our framework handles:

- Authentication failures
- Request failures
- Invalid Status Codes
- Schema Validation failures
- Timeout failures
- JSON Parsing failures
- Unexpected Exceptions

---

# Framework Folder Structure

A typical API framework follows a layered structure.

```text
src/

│

├── api/
│      APIClient.ts
│
├── fixtures/
│      apiFixture.ts
│
├── resources/
│      payloads/
│      response-schemas/
│
├── tests/
│
├── utils/
│      auth.ts
│      schemaValidator.ts
│      logger.ts
│
└── config/
```

Each layer has a single responsibility.

---

# Role of Fixtures

Instead of creating objects inside every test:

```ts
const apiClient = new APIClient(token);
```

we expose the APIClient through a Playwright fixture.

Example:

```ts
test("API Test", async ({ apiClient }) => {

    await apiClient
            .post("/booking")
            .payload(payload)
            .build();

});
```

Benefits:

- Cleaner tests
- Less setup code
- Better reusability
- Centralized initialization

---

# Best Practices We Follow

- Separate test logic from test data.
- Keep request payloads in JSON files.
- Store response schemas separately.
- Create a reusable APIClient.
- Use fixtures for dependency injection.
- Centralize authentication.
- Centralize logging.
- Validate schema for important APIs.
- Reuse utility methods.
- Avoid hardcoding URLs.
- Avoid duplicate request logic.

---

# Interview Questions & Answers

---

## Q1. Have you implemented error handling in your API framework?

### Answer

Yes.

We have centralized error handling in our framework.

Whenever an API request fails, the framework captures important information such as:

- HTTP Method
- Endpoint
- Status Code
- Request Payload
- Response Body

This makes debugging much easier compared to generic Playwright exceptions.

---

## Q2. Why is Error Handling important?

### Answer

Proper error handling reduces debugging time.

Instead of simply knowing that a request failed, we immediately know:

- Which API failed
- What payload was sent
- What response was received
- Why it failed

This helps developers and testers identify the root cause much faster.

---

## Q3. What information should be logged when an API fails?

### Answer

At a minimum, the framework should log:

- HTTP Method
- Endpoint
- Request Headers
- Request Payload
- Query Parameters (if any)
- Status Code
- Response Headers
- Response Body

These details are generally sufficient to investigate most API failures.

---

## Q4. If the backend returns a generic error message, how do you debug it?

### Answer

Sometimes the backend returns generic responses such as:

```text
500 Internal Server Error
```

or

```text
Something went wrong.
```

In such cases, our centralized request and response logging becomes very useful.

By reviewing:

- Request Payload
- Headers
- Endpoint
- Status Code
- Complete Response

we can usually identify whether the issue is due to invalid input, authentication, environment configuration, or an actual backend defect.

---

## Q5. How is your API framework structured?

### Answer

Our framework follows a layered structure.

- **api** → Contains reusable APIClient.
- **fixtures** → Provides APIClient to tests.
- **resources** → Stores request payloads and response schemas.
- **tests** → Contains test cases.
- **utils** → Contains authentication, schema validation, logging, and reusable utilities.
- **config** → Stores framework configuration.

Each layer has a single responsibility, making the framework easy to maintain and extend.

---

## Q6. Why do you use Playwright Fixtures?

### Answer

Fixtures help us initialize reusable objects once and inject them into test cases.

Instead of creating an APIClient manually in every test, we expose it as a fixture.

This keeps test cases clean and avoids duplicate setup code.

---

## Q7. Why do you keep payloads and schemas in separate folders?

### Answer

Separating payloads and schemas from test scripts improves maintainability.

Benefits include:

- Cleaner test code
- Easy updates
- Better organization
- Reusability across multiple tests
- Separation of test logic from test data

---

## Q8. What API automation best practices do you follow?

### Answer

Some important best practices we follow are:

- Create a reusable APIClient.
- Avoid hardcoded URLs and tokens.
- Store payloads in JSON files.
- Keep response schemas separate.
- Centralize authentication.
- Use fixtures for dependency injection.
- Centralize request and response logging.
- Validate response status and schema.
- Write reusable utility methods.
- Keep test cases focused on business validation instead of framework setup.

---

## ⭐ Interview Tip

If an interviewer asks:

> **"Can you explain your API framework in 2 minutes?"**

A concise answer is:

> *"Our framework is built around a reusable APIClient that internally uses Playwright's `APIRequestContext`. Authentication, common headers, logging, and request execution are centralized inside the client. Request payloads are maintained in JSON files, response schemas are stored separately and validated using AJV, and the APIClient is provided to tests through Playwright fixtures. This keeps the framework modular, reusable, and easy to maintain while allowing test cases to focus only on business validations."*
