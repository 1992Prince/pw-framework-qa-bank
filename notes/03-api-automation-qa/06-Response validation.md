
# Module 5 - Response Validation

# Concept 5 - Response Validation

---

# 📌 Concept (Revision)

## What is Response Validation?

- Response validation is the process of verifying whether the API has returned the expected response.
- After sending an API request, we validate different parts of the response to ensure the API behaves as expected.
- The response returned by Playwright is of type **`APIResponse`**.
- `APIResponse` provides various methods to access the response body, headers, status code, cookies, etc.

---

## What Can We Validate?

- Status Code
- Status Text
- Response Body
- Response Headers
- Specific Header
- All Headers
- Response Time
- JSON Fields
- Nested JSON
- Arrays
- Cookies
- Content-Type
- API Success (`response.ok()`)

---

# APIResponse Common Methods

| Method                  | Purpose                         |
| ----------------------- | ------------------------------- |
| response.status()       | Returns HTTP Status Code        |
| response.statusText()   | Returns Status Text             |
| response.ok()           | Returns true if status is 2xx   |
| response.json()         | Returns response as JSON object |
| response.text()         | Returns response as String      |
| response.body()         | Returns Buffer                  |
| response.headers()      | Returns object of all headers   |
| response.headersArray() | Returns headers as array        |

---

# Status Code Validation

Example

```ts
expect(response.status()).toBe(200);
```

---

# Status Text Validation

Example

```ts
expect(response.statusText()).toBe("OK");
```

---

# Response Body Validation

```ts
const body = await response.json();

expect(body.firstname).toBe("Prince");
```

---

# Nested JSON Validation

Response

```json
{
    "booking": {
        "firstname": "Prince"
    }
}
```

Validation

```ts
expect(body.booking.firstname).toBe("Prince");
```

---

# Array Validation

```json
[
    {
        "id": 1
    },
    {
        "id": 2
    }
]
```

Validation

```ts
expect(body[0].id).toBe(1);
```

---

# Response Header Validation

All Headers

```ts
const headers = response.headers();

console.log(headers);
```

Specific Header

```ts
expect(response.headers()["content-type"])
    .toContain("application/json");
```

or

```ts
const headers = response.headers();

expect(headers["content-type"])
    .toContain("application/json");
```

---

# Response Time Validation

Playwright doesn't provide a direct API for response time.

Common approaches:

- Capture timestamps before and after the request.

```ts
const start = Date.now();

const response = await request.get("/booking");

const end = Date.now();

expect(end - start).toBeLessThan(3000);
```

---

# Validate Complete Response

```ts
const response = await request.get("/booking/1");

expect(response.status()).toBe(200);

expect(response.ok()).toBeTruthy();

const body = await response.json();

expect(body.firstname).toBe("Prince");

expect(response.headers()["content-type"])
    .toContain("application/json");
```

---

# Common Assertions Used

```ts
toBe()

toEqual()

toContain()

toHaveProperty()

toBeTruthy()

toBeFalsy()

toBeDefined()

toBeUndefined()

toMatchObject()
```

---

# Interview Questions & Answers

---

## Q1. How do you validate the response status code?

### Answer

We use the `status()` method available on `APIResponse`.

Example:

```ts
expect(response.status()).toBe(200);
```

---

## Q2. How do you validate the response body?

### Answer

First, convert the response into a JavaScript object using `response.json()`, then validate the required fields.

Example:

```ts
const body = await response.json();

expect(body.firstname).toBe("Prince");
```

---

## Q3. How do you validate response headers?

### Answer

We use the `headers()` method.

Example:

```ts
expect(response.headers()["content-type"])
    .toContain("application/json");
```

---

## Q4. How do you capture all headers?

### Answer

```ts
const headers = response.headers();

console.log(headers);
```

---

## Q5. How do you capture a specific header?

### Answer

```ts
const headers = response.headers();

const contentType = headers["content-type"];
```

---

## Q6. How do you handle nested JSON?

### Answer

We first parse the response using `response.json()` and then access nested properties using dot notation.

Example:

```ts
expect(body.booking.firstname).toBe("Prince");
```

---

## Q7. How do you validate response time?

### Answer

Playwright doesn't provide a direct API for response time, so we record timestamps before and after the request and calculate the difference.

Example:

```ts
const start = Date.now();

const response = await request.get("/booking");

const end = Date.now();

expect(end - start).toBeLessThan(3000);
```

---

## Q8. What is the return type of `response.json()`?

### Answer

`response.json()` returns:

```ts
Promise<any>
```

It converts the response body into a JavaScript object.

---

## ⭐ Interview Tip

A complete API response validation generally includes:

- Status Code
- Response Body
- Headers
- Response Time
- Content-Type
- Business Data Validation

---
