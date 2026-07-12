
# Module 1 - Playwright API Fundamentals

# Concept 1 - APIRequestContext & Request Fixture

## 📌 Concept (Revision)

### What is APIRequestContext?

- `APIRequestContext` is Playwright's built-in object used for API testing.
- It is responsible for sending HTTP requests like:
  - GET
  - POST
  - PUT
  - PATCH
  - DELETE
- It also manages request configuration such as:
  - Base URL
  - Headers
  - Authentication
  - Cookies
  - Query Parameters
  - Request Options

---

### Ways to Obtain APIRequestContext

There are two ways:

#### 1. Using Playwright's Built-in `request` Fixture (Recommended)

- Automatically available in every test.
- No manual setup required.
- Suitable for most API test cases.

#### 2. Creating Your Own APIRequestContext

Using:

```ts
const apiContext = await request.newContext({...});
```

Useful when you need:

- Different Base URL
- Different Authentication
- Different Headers
- Different Cookies
- Isolated API Sessions
- Reusable API Client

---

### What is the Request Fixture?

- `request` is a built-in Playwright fixture.
- It is **already an instance of `APIRequestContext`**.
- Playwright automatically creates it for every test.
- Since it is ready to use, it is the easiest way to perform API testing.

---

### Real Project Usage

For small API usage:

- Using the built-in `request` fixture is sufficient.

For large API automation frameworks:

- Teams generally create a reusable **API Client (Service Layer)**.
- API Client internally uses `APIRequestContext`.
- Tests call reusable methods such as:

```ts
bookingClient.createBooking();
bookingClient.updateBooking();
bookingClient.deleteBooking();
```

instead of writing raw HTTP requests in every test.

This makes the framework:

- Reusable
- Easy to maintain
- Cleaner
- Less duplicate code

---

## 🎯 One-line Interview Definition

> **APIRequestContext is Playwright's core object for sending HTTP requests and managing API communication, whereas the request fixture is a pre-created instance of APIRequestContext automatically provided to every test.**

---

# Example 1 - Using Request Fixture

```ts
import { test, expect } from '@playwright/test';

test('Get Booking', async ({ request }) => {

    const response = await request.get('/booking/1');

    expect(response.status()).toBe(200);

});
```

### Why this works

- `request` is automatically injected by Playwright.
- It is already an `APIRequestContext`.
- No manual creation is required.

---

# Example 2 - Creating APIRequestContext Manually

```ts
import { test, request } from '@playwright/test';

test('Create API Context', async () => {

    const apiContext = await request.newContext({
        baseURL: 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
            Accept: 'application/json'
        }
    });

    const response = await apiContext.get('/booking/1');

    console.log(await response.json());

});
```

Here we manually create our own API context with custom configuration.

---

# Difference Between Request Fixture and APIRequestContext

| Request Fixture             | APIRequestContext                                      |
| --------------------------- | ------------------------------------------------------ |
| Built-in Playwright fixture | Core Playwright object/class                           |
| Automatically created       | Created manually using`request.newContext()`         |
| Available in every test     | Can be created anywhere                                |
| Best for normal API tests   | Best for reusable frameworks and custom configurations |
| No setup required           | Requires configuration                                 |

> **Important:**
> The `request` fixture **is an instance of `APIRequestContext`**.
> It is **not a different type**—it is simply a ready-to-use `APIRequestContext`.

---

# Interview Questions & Answers

## Q1. What is APIRequestContext?

### Answer

- `APIRequestContext` is Playwright's built-in object used to send HTTP requests like GET, POST, PUT, PATCH and DELETE.
- It manages:
  - Base URL
  - Headers
  - Authentication
  - Cookies
  - Request Options
- It is the core object used for API automation in Playwright.

---

## Q2. What is the request fixture?

### Answer

- The `request` fixture is a built-in Playwright fixture.
- It is a **pre-created instance of `APIRequestContext`**.
- It is automatically provided to every test.
- It allows us to send API requests without manually creating an API context.
- It is the simplest and most commonly used approach for API testing.

---

## Q3. What is the difference between request fixture and APIRequestContext?

### Answer

- `APIRequestContext` is the core object used for API communication.
- `request` fixture is an automatically created instance of `APIRequestContext`.
- The request fixture is built-in and already configured by Playwright.

### Which one should we use?

**Use Request Fixture when:**

- Only a few API tests exist.
- API calls are required along with UI tests.
- Capturing browser-triggered API requests/responses.
- No special configuration is required.

**Use APIRequestContext (via API Client) when:**

- There are many API automation tests.
- Common headers need to be reused.
- Base URL is common.
- Authentication is common.
- Multiple services are involved.
- Better maintainability is required.

Instead of repeatedly writing:

```ts
request.post(...)

request.put(...)

request.delete(...)
```

we create an **API Client** which internally uses `APIRequestContext`.

Example:

```ts
bookingClient.createBooking();

bookingClient.updateBooking();

bookingClient.deleteBooking();
```

Benefits:

- Reusable
- Centralized logging
- Centralized headers
- Payload handling
- Environment handling
- Better maintainability

---

## Q4. Which approach do you use in your project?

### Answer

In our framework, we use a reusable **API Client** built on top of `APIRequestContext`.

- We have implemented it using the **Builder Pattern with Fluent Interface**.
- The client internally wraps all HTTP methods (GET, POST, PUT, PATCH, DELETE).
- Common configurations like:
  - Base URL
  - Common Headers
  - Authentication
  - Logging
  - Payload Handling
- are managed centrally.

We have a separate utility for generating authentication tokens. The generated token is passed to the API Client while creating the `APIRequestContext`.

Finally, we expose the API Client as a custom fixture so that all tests can directly use it without worrying about configuration.

---

## Q5. When would you create your own APIRequestContext?

### Answer

I would create my own `APIRequestContext` when:

- There are many API automation tests.
- Common headers need to be shared.
- Authentication is common.
- Base URL is common.
- Different users require different authentication.
- Different environments require different configurations.
- I want to create a reusable API Client.

If there are only a few API calls or API requests are needed alongside UI automation, then using the built-in `request` fixture is sufficient.

---

## Q6. Give the syntax for GET, POST, PUT, PATCH and DELETE. What options can be passed? What is the return type?

*(To be covered in Module 2 - Sending API Requests.)*

---

## Q7. What common configurations can be passed while creating APIRequestContext? Explain with syntax and return type.

*(To be covered in Module 1 - APIRequestContext Configuration.)*
