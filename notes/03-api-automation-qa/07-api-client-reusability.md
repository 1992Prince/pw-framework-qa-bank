
# Concept 6 - API Client & Reusability

---

# 📌 Concept (Revision)

## Why Do We Need an API Client?

Suppose we have around **200 API test cases**.

Without an API Client, every test would repeatedly configure:

- Base URL
- Authorization Token
- Common Headers
- GET/POST/PUT/PATCH/DELETE calls
- Logging
- Request Options

This results in:

- Duplicate code
- Difficult maintenance
- Inconsistent logging
- Repeated authentication logic

To solve this, we create a **reusable API Client** that centralizes all common API-related functionality.

---

# What is an API Client?

An API Client is a reusable wrapper built on top of Playwright's `APIRequestContext`.

It is responsible for:

- Creating `APIRequestContext`
- Configuring Base URL
- Setting Authentication
- Setting Common Headers
- Executing HTTP Requests
- Logging Requests
- Logging Responses
- Handling Common Request Options

Instead of directly using `request.get()` or `request.post()`, test scripts simply use the API Client.

---

# Our Project Approach ⭐⭐⭐⭐⭐

Our framework follows the **Builder Pattern with Fluent Interface**.

The API Client internally creates a configured `APIRequestContext` and exposes builder methods for creating requests.

Flow:

```text
Generate Bearer Token

↓

Create APIClient(token)

↓

APIClient internally creates APIRequestContext

↓

Configure BaseURL + Common Headers

↓

Tests simply build requests

↓

Execute Request

↓

Log Request & Response
```

---

# What do we configure inside APIClient?

When the APIClient is initialized, it configures all common settings once.

These include:

- Base URL
- Bearer Token
- Authorization Header
- Content-Type → `application/json`
- Accept → `application/json`
- APIRequestContext
- Default Timeout (if required)

Example

```ts
const apiClient = new APIClient(token);
```

Internally, it creates an `APIRequestContext` like:

```ts
request.newContext({

    baseURL: process.env.BASE_URL,

    extraHTTPHeaders: {

        Authorization: `Bearer ${token}`,

        Accept: "application/json",

        "Content-Type": "application/json"
    }

});
```

Because these configurations are centralized, every API request automatically uses them.

---

# Builder Pattern with Fluent Interface

Instead of writing:

```ts
await request.post('/booking', {

    headers: {...},

    data: payload

});
```

Our tests simply write:

```ts
await apiClient
        .post('/booking')
        .payload(payload)
        .build();
```

Additional headers can also be passed.

```ts
await apiClient
        .post('/booking')
        .headers({
            traceId: "12345"
        })
        .payload(payload)
        .build();
```

For GET requests:

```ts
await apiClient
        .get('/booking')
        .queryParams({
            firstname: "Prince"
        })
        .build();
```

The API Client internally prepares the request and executes it.

---

# Common Responsibilities of APIClient

- Create `APIRequestContext`
- Configure Base URL
- Configure Authentication
- Configure Common Headers
- Execute GET/POST/PUT/PATCH/DELETE
- Handle Query Parameters
- Handle Payload
- Handle Additional Headers
- Log Requests
- Log Responses

---

# Logging

Instead of logging inside every test, logging is handled centrally inside the APIClient.

Every HTTP method eventually calls a common `execute()` method.

The method logs:

### Request

- HTTP Method
- URL
- Headers
- Query Parameters
- Payload

### Response

- Status Code
- Status Text
- Response Headers
- Response Body
- Response Time

This guarantees consistent logging for every API request.

---

# Sample APIClient Structure

```ts
class APIClient {

    constructor(token) {

        this.apiContext = request.newContext({

            baseURL: process.env.BASE_URL,

            extraHTTPHeaders: {

                Authorization: `Bearer ${token}`,

                Accept: "application/json",

                "Content-Type": "application/json"

            }

        });

    }

    get(endpoint) {

        return new RequestBuilder("get", endpoint, this);

    }

    post(endpoint) {

        return new RequestBuilder("post", endpoint, this);

    }

    async execute(method, endpoint, options) {

        console.log("===== REQUEST =====");

        console.log(method);

        console.log(endpoint);

        console.log(options);

        const response = await this.apiContext[method](endpoint, options);

        console.log("===== RESPONSE =====");

        console.log(response.status());

        console.log(await response.text());

        return response;

    }

}
```

---

# Benefits

- Reusable
- Less Duplicate Code
- Cleaner Tests
- Centralized Authentication
- Centralized Headers
- Centralized Logging
- Easy Maintenance
- Easy to Extend

---

# Interview Questions & Answers

---

## Q1. Why did you create an APIClient?

### Answer

We created an APIClient to avoid duplicate code across API tests.

Instead of repeatedly configuring authentication, headers, base URL, logging, and request execution in every test, we centralized all common functionality into a reusable APIClient.

This keeps test scripts clean, reusable, and easy to maintain.

---

## Q2. How have you implemented your APIClient?

### Answer

Our APIClient is built on top of Playwright's `APIRequestContext`.

When an APIClient object is created, it internally creates a configured `APIRequestContext` using the common configuration.

The client exposes fluent methods like:

```ts
apiClient
    .post('/endpoint')
    .payload(payload)
    .build();
```

or

```ts
apiClient
    .get('/endpoint')
    .queryParams({
        id: 100
    })
    .build();
```

Internally, these builder methods prepare the request and execute it using the configured `APIRequestContext`.

---

## Q3. Which design pattern have you used?

### Answer

We use the **Builder Pattern with Fluent Interface**.

Each HTTP method returns a builder object, allowing the test to configure request-specific details such as payload, query parameters, or additional headers through method chaining before calling `build()` to execute the request.

---

## Q4. What common configurations are passed while creating the APIClient?

### Answer

The APIClient is initialized with all common configurations that remain the same across requests.

These include:

- Base URL
- Bearer Token
- Authorization Header
- Accept → `application/json`
- Content-Type → `application/json`
- APIRequestContext
- Default Timeout (if required)

Example:

```ts
const apiClient = new APIClient(token);
```

Internally, it creates:

```ts
request.newContext({

    baseURL: process.env.BASE_URL,

    extraHTTPHeaders: {

        Authorization: `Bearer ${token}`,

        Accept: "application/json",

        "Content-Type": "application/json"

    }

});
```

As a result, every request automatically uses these common configurations.

---

## Q5. How do you pass common headers to all requests?

### Answer

Common headers are configured while creating the `APIRequestContext` using the `extraHTTPHeaders` property.

This ensures that headers like `Authorization`, `Accept`, and `Content-Type` are automatically included in every request without repeating them in each test.

If a particular request requires additional headers, they can be supplied using the builder.

Example:

```ts
await apiClient
        .post('/endpoint')
        .headers({
            traceId: "12345"
        })
        .build();
```

---

## Q6. How do you manage authentication?

### Answer

We have a separate authentication utility that generates a Bearer Token.

The generated token is passed to the APIClient constructor.

The APIClient then configures the `Authorization` header while creating the `APIRequestContext`, so every API request automatically carries the Bearer Token.

---

## Q7. How do you handle request and response logging?

### Answer

Logging is centralized inside the APIClient.

Instead of writing logging statements in every test, every HTTP method internally delegates to a common `execute()` method.

The `execute()` method logs:

**Request**

- HTTP Method
- Endpoint
- Headers
- Query Parameters
- Payload

**Response**

- Status Code
- Status Text
- Response Headers
- Response Body
- Response Time

Example:

```ts
async execute(method, endpoint, options) {

    console.log("===== REQUEST =====");

    console.log(method);

    console.log(endpoint);

    console.log(options);

    const response = await this.apiContext[method](endpoint, options);

    console.log("===== RESPONSE =====");

    console.log(response.status());

    console.log(await response.text());

    return response;

}
```

This provides consistent logging for every API request and keeps test scripts clean.

---

## Q8. How do you use the APIClient in your tests?

### Answer

Tests first create an APIClient object by passing the authentication token.

```ts
const apiClient = new APIClient(token);
```

Then, using the fluent interface, they build only the request-specific information.

Example:

```ts
await apiClient
        .post('/booking')
        .payload(payload)
        .build();
```

```ts
await apiClient
        .get('/booking')
        .queryParams({
            firstname: "Prince"
        })
        .build();
```

```ts
await apiClient
        .put('/booking/1')
        .headers({
            traceId: "12345"
        })
        .payload(updatedPayload)
        .build();
```

The APIClient automatically manages base URL, authentication, common headers, request execution, and logging.

---

## ⭐ Interview Tip

If the interviewer asks:

> **"Why not directly use request.post() everywhere?"**

A strong answer is:

> *"Directly using `request.post()` is fine for small projects. However, in large automation frameworks it leads to repeated authentication, headers, logging, and request configuration. We built a reusable APIClient on top of `APIRequestContext` that centralizes these concerns and exposes a fluent interface, allowing test cases to focus only on endpoint-specific details while the client handles the common configuration internally."*