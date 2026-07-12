
# API Testing — Interview Notes

## 1. What is an API? or What does API stands for and what it is used for? or What is purpose of API? or Explain API in simple terms. or How would you explain API to non-technical person?

**API = Application Programming Interface**

- An API is a way for two systems to talk to each other, even if they are built on completely different tech stacks (e.g., one system in Java, another in Python).
- It is an **interface** that defines how two software systems can interact by exposing functions, data, or services through well-defined rules and protocols.
- Think of it as a **contract** between two different systems — it tells software how to request something (inputs) and what to expect in return (outputs).

**How it works:**

1. System A (client) needs data/service from System B (server) → sends a **request**, specifying what it wants.
2. System B processes it and sends back a **response** with the requested data.
3. Both request and response happen in a **common format** both systems understand — typically **JSON** or **XML**.
4. The exact format of request/response is defined in the "contract" (the API specification/documentation).
5. This communication generally happens over **HTTP/HTTPS** protocols.
6. Both systems must follow the contract exactly — request in the agreed format, response in the agreed format.


---

## 2. What is a Contract?


A contract, in the API context, is the formal agreement/specification that defines:

- The endpoint URL and HTTP method (GET/POST/PUT/DELETE etc.)
- The expected request format (headers, body structure, required/optional fields, data types)
- The expected response format (status codes, response body structure, error formats)
- Authentication requirements

Essentially, it's the "rulebook" both client and server must follow so they can understand each other reliably. Examples of contract definitions: **OpenAPI/Swagger spec**, **API documentation**, **schema files (JSON Schema, Protobuf, GraphQL SDL)**.

---

## 3. Why is API Testing Prioritized Over UI Testing?

### Core definitions

|                       | Definition                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| **API Testing** | Testing backend services directly via requests (hitting endpoints, validating responses)                     |
| **UI Testing**  | Testing the application through the user interface (checks user experience + integration through the screen) |

### Key comparison points

**1. What each checks**

- API testing checks **business logic and data directly** — you hit endpoints, get a response, and validate it.
- UI testing checks **user experience and integration through the screen** — you must launch a browser, let it make the underlying API calls, and then interact with the rendered application.

**2. Speed**

- API tests are **fast, stable, and less flaky** — can often complete in under a minute in CI.
- UI tests are **slower and more flaky** due to UI dependencies (rendering, waits, browser behavior).

**3. Early testing (shift-left)**

- In most development workflows, **APIs are built before the UI**.
- So API testing can start early, even while the UI is still under development.

**4. Maintenance effort**

- API automation requires **less maintenance effort**.
- UI automation requires **more maintenance effort** (UI changes break locators/selectors frequently).

**5. Bug detection stage**

- API testing finds most **business logic bugs early** (shift-left approach).
- UI testing finds bugs **late**, once the full UI is built — and fixing bugs at that stage is costlier.

**6. Test pyramid position**

- API tests sit at the **base of the test pyramid** → maximum coverage, most tests here.
- UI tests sit at the **top of the pyramid** → minimal, only critical end-to-end (E2E) flows.

**7. Parallel execution**

- API testing: you can generate multiple auth tokens in parallel and run tests in parallel (or even sequentially — still finishes in minutes, max ~10–15 min).
- UI testing: harder to scale — simulating many concurrent user logins/sessions in the browser is resource-heavy and doesn't scale as well.

### Practical example (from notes)

**Scenario:** Verify that customer details on the "Bills Payment" screen are sorted correctly by name.

- **Via UI testing:**

  1. Launch browser
  2. Navigate to the screen
  3. Extract the full tabular data (scrape from DOM)
  4. Store in an array
  5. If data spans multiple pages → click "Next", fetch that page's data too, append to array
  6. Validate whether the array is sorted correctly

  - Slow, brittle, many steps.
- **Via API testing:**

  1. Hit the **auth endpoint** → get an access token
  2. Hit the `getBillsPaymentCustomerDetails` endpoint directly (e.g., in Postman)
  3. If pagination limits the response (e.g., only 10 records shown), simply **increase the `limit` parameter** (e.g., to 14) to get all customers in one response
  4. Parse the JSON response and validate whether the data is sorted

  - Much faster, more reliable, fewer moving parts.

---

## Quick Revision Table

| Aspect             | API Testing           | UI Testing                         |
| ------------------ | --------------------- | ---------------------------------- |
| Tests              | Backend logic & data  | End-to-end user experience         |
| Speed              | Fast (seconds–1 min) | Slow, flaky                        |
| Timing in SDLC     | Early (shift-left)    | Late                               |
| Maintenance        | Low                   | High                               |
| Bug found stage    | Early, cheaper to fix | Late, costlier to fix              |
| Pyramid position   | Base (high coverage)  | Top (minimal, critical flows only) |
| Parallel execution | Easy to scale         | Harder to scale                    |


---

## Test Pyramid

```
         /\
        /  \
       / UI \
      / Tests\
     / Slow,  \
    / Flaky,   \
   /    Few     \
  /--------------\
 / Integration    \
/     Tests        \
/ Moderate Speed    \
/  & Moderate Count  \
/---------------------\
/      API Tests        \
/  Fast, Stable,         \
/   Maximum Coverage      \
/__________________________\
```

| Layer            | Tests            | Characteristics                        |
| ---------------- | ---------------- | -------------------------------------- |
| **Base**         | API Tests        | Fast, stable, maximum coverage         |
| **Middle**       | Integration Tests | Moderate speed and count              |
| **Top**          | UI Tests         | Slow, flaky, few                       |

**Key principle:** More tests at the base (API), fewer at the top (UI). This keeps the suite fast, stable, and easy to maintain.

