
# Module 2 - Sending API Requests

# Concept 2 - Sending API Requests (GET, POST, PUT, PATCH, DELETE)

---

# 📌 Concept (Revision)

## What is API Request?

- An API request is an HTTP request sent from the client to the server to perform an operation.
- Playwright provides built-in methods to send all common HTTP requests using `APIRequestContext`.
- Every HTTP method returns an **`APIResponse`** object.
- The response can then be validated for:
  - Status Code
  - Response Body
  - Headers
  - Response Time
  - Cookies

---

## Common HTTP Methods

| Method | Purpose                 | Idempotent      |
| ------ | ----------------------- | --------------- |
| GET    | Fetch data              | ✅ Yes          |
| POST   | Create new resource     | ❌ No           |
| PUT    | Replace entire resource | ✅ Yes          |
| PATCH  | Update partial resource | ❌ Generally No |
| DELETE | Delete resource         | ✅ Yes          |

---

## Syntax

### GET

```ts
const response = await request.get(url, options);
```

Returns

```ts
Promise<APIResponse>
```

---

### POST

```ts
const response = await request.post(url, options);
```

Returns

```ts
Promise<APIResponse>
```

---

### PUT

```ts
const response = await request.put(url, options);
```

Returns

```ts
Promise<APIResponse>
```

---

### PATCH

```ts
const response = await request.patch(url, options);
```

Returns

```ts
Promise<APIResponse>
```

---

### DELETE

```ts
const response = await request.delete(url, options);
```

Returns

```ts
Promise<APIResponse>
```

---

# Common Request Options

Almost every HTTP method accepts an optional **options** object.

```ts
request.post(url, {
    headers,
    data,
    params,
    form,
    multipart,
    timeout,
    failOnStatusCode,
    ignoreHTTPSErrors
});
```

---

# Most Commonly Used Options

## 1. headers

Used to pass request headers.

Example

```ts
const response = await request.get('/booking', {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    }
});
```

Common Interview Question

> How do you pass authorization token?

Answer

Using the `headers` option.

---

## 2. data

Used to send JSON payload.

Example

```ts
const payload = {
    firstname: 'Prince',
    lastname: 'Pandey'
};

const response = await request.post('/booking', {
    data: payload
});
```

Playwright automatically:

- Converts object to JSON
- Sets Content-Type as application/json (when appropriate)

---

## 3. params

Used to send query parameters.

Example URL

```
/booking?firstname=Jim&lastname=Brown
```

Playwright

```ts
await request.get('/booking', {
    params: {
        firstname: 'Jim',
        lastname: 'Brown'
    }
});
```

---

## 4. form

Used when API expects

```
application/x-www-form-urlencoded
```

Example

```ts
await request.post('/login', {
    form: {
        username: 'admin',
        password: 'password123'
    }
});
```

---

## 5. multipart

Used for file upload.

Example

```ts
await request.post('/upload', {
    multipart: {
        file: fs.createReadStream('./sample.pdf')
    }
});
```

---

## 6. timeout

Maximum wait time.

Example

```ts
await request.get('/booking', {
    timeout: 30000
});
```

---

## 7. failOnStatusCode

Default

```ts
false
```

If

```ts
true
```

Playwright throws exception for

```
4xx

5xx
```

Example

```ts
await request.get('/booking', {
    failOnStatusCode: true
});
```

---

## 8. ignoreHTTPSErrors

Useful for

- QA
- Lower environments
- Self-signed SSL certificates

Example

```ts
await request.get('/booking', {
    ignoreHTTPSErrors: true
});
```

---

# Complete POST Example

```ts
const response = await request.post('/booking', {

    headers: {
        Authorization: `Bearer ${token}`
    },

    params: {
        env: 'qa'
    },

    data: {
        firstname: 'Prince',
        lastname: 'Pandey'
    },

    timeout: 30000

});
```

---

# GET Example

```ts
const response = await request.get('/booking/1', {

    headers: {
        Accept: 'application/json'
    }

});
```

---

# PUT Example

```ts
const response = await request.put('/booking/1', {

    headers: {
        Authorization: `Bearer ${token}`
    },

    data: updatedBooking

});
```

---

# PATCH Example

```ts
const response = await request.patch('/booking/1', {

    headers: {
        Authorization: `Bearer ${token}`
    },

    data: {
        firstname: 'Prince'
    }

});
```

---

# DELETE Example

```ts
const response = await request.delete('/booking/1', {

    headers: {
        Authorization: `Bearer ${token}`
    }

});
```

---

# Interview Questions & Answers

---

## Q1. How do you send a GET request in Playwright?

### Answer

We use the `get()` method available on `APIRequestContext` or the built-in `request` fixture.

Example

```ts
const response = await request.get('/booking/1');
```

It returns a `Promise<APIResponse>`.

---

## Q2. How do you send a POST request?

### Answer

We use the `post()` method and pass the request body using the `data` option.

Example

```ts
const response = await request.post('/booking', {
    data: payload
});
```

---

## Q3. How do you send a PUT request?

### Answer

We use the `put()` method with the updated resource in the `data` option.

Example

```ts
await request.put('/booking/1', {
    data: updatedBooking
});
```

---

## Q4. How do you send a PATCH request?

### Answer

PATCH is used for partial updates. We use the `patch()` method and send only the fields that need to be updated.

Example

```ts
await request.patch('/booking/1', {
    data: {
        firstname: 'Prince'
    }
});
```

---

## Q5. How do you send a DELETE request?

### Answer

DELETE is performed using the `delete()` method.

Example

```ts
await request.delete('/booking/1');
```

---

## Q6. How do you pass headers?

### Answer

Headers are passed using the `headers` property inside the options object.

Example

```ts
headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
}
```

---

## Q7. How do you send a request body?

### Answer

JSON payloads are sent using the `data` property.

Example

```ts
data: payload
```

Playwright automatically serializes the object into JSON before sending the request.

---

## Q8. How do you pass query parameters?

### Answer

Query parameters are passed using the `params` option.

Example

```ts
await request.get('/booking', {
    params: {
        firstname: 'Jim',
        lastname: 'Brown'
    }
});
```

---

## Q9. How do you pass path parameters?

### Answer

Path parameters are not passed separately in Playwright. They are included directly in the URL.

Example

```ts
const bookingId = 101;

await request.get(`/booking/${bookingId}`);
```

---

## Q10. What is the return type of all Playwright API methods?

### Answer

All HTTP methods (`get()`, `post()`, `put()`, `patch()`, `delete()`) return:

```ts
Promise<APIResponse>
```

The `APIResponse` object provides methods such as:

```ts
response.status();

response.statusText();

response.ok();

response.headers();

response.headersArray();

response.body();

response.text();

response.json();
```

---

## Q11. What are the commonly used request options in Playwright?

### Answer

The most commonly used request options are:

- `headers` → Pass request headers.
- `data` → Send JSON request body.
- `params` → Pass query parameters.
- `form` → Send `application/x-www-form-urlencoded` data.
- `multipart` → Upload files.
- `timeout` → Configure request timeout.
- `failOnStatusCode` → Throw an exception for HTTP 4xx/5xx responses.
- `ignoreHTTPSErrors` → Ignore SSL certificate errors, typically in lower environments.

---

## ⭐ Interview Tip

Remember this order when explaining any API call:

1. Create or obtain the `APIRequestContext` (or use the built-in `request` fixture).
2. Call the appropriate HTTP method (`get`, `post`, `put`, `patch`, or `delete`).
3. Pass request options (`headers`, `data`, `params`, etc.) as needed.
4. Receive an `APIResponse`.
5. Validate the response (status, body, headers, response time, etc.).

This structured explanation demonstrates both conceptual understanding and practical experience.
