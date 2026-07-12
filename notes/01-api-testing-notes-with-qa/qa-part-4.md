
# API-QA-SHEET-4

---

# Q31. What all things do you validate in an API Response?

Whenever I test an API, I don't just verify the status code. I validate the complete response to ensure both technical correctness and business functionality.

I validate:

- Status Code
- Status Text
- Response Time (SLA)
- Response Size
- Response Headers
- Response Body
- Response Schema
- Business Assertions
- Database Validation (POST/PUT/PATCH)
- Authentication & Authorization
- Performance & Security (when required)

### Schema vs Business Assertion

Schema Validation checks whether:

- Required fields exist
- Data types are correct
- Response structure is valid

Business Assertions check whether:

- Correct business logic is implemented.

Example:

Schema:

```json
{
   "phone":"9876543210"
}
```

Business Assertion:

- Phone number should contain exactly 10 digits.
- Premium customer should receive ChatGPT offer.

---

# Q32. Explain HTTP Status Codes.

HTTP Status Codes tell whether the request was successful or failed.

### 1xx - Informational

Request received.

Very rarely used.

---

## 2xx - Success

### 200 OK

Request completed successfully.

Mostly used for GET APIs.

Example:

```http
GET /customer/101
```

Returns customer details.

---

### 201 Created

New resource created successfully.

Mostly used for POST.

Example:

Recharge created successfully.

---

### 204 No Content

Operation successful but nothing is returned.

Mostly used for DELETE.

---

## 3xx - Redirection

Mostly seen when redirecting users to another URL.

Rarely used in enterprise API testing.

### Common

301 Moved Permanently

302 Temporary Redirect

304 Not Modified

---

## 4xx - Client Errors

These errors indicate the problem is on the client side.

### 400 Bad Request

Request payload is invalid.

Example

Missing mandatory fields.

---

### 401 Unauthorized

Authentication failed.

Missing or expired token.

---

### 402 Payment Required

Reserved for payment-related scenarios.

Rarely used.

---

### 403 Forbidden

Authentication is successful but user doesn't have permission.

Example

Read-only user trying DELETE.

---

### 404 Not Found

Requested resource doesn't exist.

Example

Customer already deleted.

---

### 405 Method Not Allowed

Wrong HTTP Method.

Example

POST on GET-only endpoint.

---

### 409 Conflict

Duplicate resource.

Example

Same recharge submitted twice.

---

### 422 Unprocessable Entity

Request syntax is correct.

Business validation failed.

Example

Business expects JSON but request violates business validation rules.

---

### 429 Too Many Requests

Rate limit exceeded.

Example

1000 requests inside loop.

---

## 5xx - Server Errors

These indicate server-side failures.

### 500 Internal Server Error

Unhandled exception.

Developer issue.

---

### 502 Bad Gateway

One downstream service isn't responding.

Example

API Gateway → Recharge Service → Payment Service

Payment Service is down.

---

### 503 Service Unavailable

Server is under maintenance or unavailable.

---

### 504 Gateway Timeout

Gateway waited too long for downstream response.

---

### Easy Memory

Client Error

↓

4xx

Server Error

↓

5xx

---

# Q33. What is Idempotency? How do you test it?

Idempotency means calling the same API multiple times should result in the same final state on the server.

Idempotent Methods

- GET
- PUT
- DELETE

Usually Not Idempotent

- POST
- PATCH

### How do I test it?

#### POST

Execute POST once.

↓

201 Created

Execute same POST again.

↓

Should receive

409 Conflict

(if duplicate handling exists)

---

#### DELETE

Delete resource.

↓

204 No Content

Delete again.

↓

404 Not Found

This confirms the resource was already deleted.

---

# Q34. What do you check when an API is not working?

I follow a structured debugging approach.

Whenever an API is not working, I follow a systematic approach instead of guessing the issue.

## 1. Check the HTTP Status Code

The first thing I look at is the **HTTP status code** because it gives a clear indication of where the problem is.

### 4xx Errors (Client-side Issues)

These indicate that the problem is with my request.

- **400 Bad Request**
  - Usually means there is an issue with the request payload, request parameters, or URL.
  - I verify the request body, path parameters, query parameters, and compare them with the API documentation (Swagger/OpenAPI).

- **401 Unauthorized**
  - Indicates authentication has failed.
  - I check whether the Authorization token is missing, invalid, or expired.
  - I generate or use a valid token and retry.

- **403 Forbidden**
  - Authentication is successful, but I don't have permission to perform that action.
  - I verify my user role or required permissions and, if needed, discuss it with the development team.

- **404 Not Found**
  - The requested resource or endpoint does not exist.
  - I verify the endpoint URL, path parameters, query parameters, and API version.

---

### 5xx Errors (Server-side Issues)

These indicate the issue is on the server side.

- **500 Internal Server Error**
  - Usually indicates an application bug or an unhandled exception.
  - I collect request details, response, and logs (if available), then report the issue to the development team.

- **502 Bad Gateway / 503 Service Unavailable / 504 Gateway Timeout**
  - These are generally infrastructure or server availability issues.
  - I verify whether dependent services are running and inform the appropriate team if required.

---

## 2. Verify the Request

If the status code alone doesn't identify the issue, I verify:

- Endpoint URL
- HTTP method (GET, POST, PUT, DELETE)
- Request headers
- Authorization token
- Request payload
- Path parameters
- Query parameters

---

## 3. Compare with API Documentation

I compare my request with the API documentation (Swagger/OpenAPI) to ensure:

- Correct endpoint
- Required headers
- Mandatory fields
- Data types
- Authentication method

---

## 4. Check Logs (If Available)

If I have access to logs, I check:

- Application logs
- Server logs
- API Gateway logs
- Kubernetes pod logs (if deployed on Kubernetes)

These logs usually provide the exact reason for the failure.

---

## 5. Reproduce Using Postman

If the API is failing through automation, I execute the same request in Postman to determine whether the issue is in:

- The API itself, or
- The automation script.

---

# Q35. How will you test a CMS application like Magento or Shopify if APIs aren't exposed?

If the APIs are not publicly exposed, I first try to identify whether the application is still communicating with backend APIs internally.

## Step 1: Check for API Documentation

- I first look for API documentation such as Swagger, OpenAPI, or internal documentation.
- If available, I use those APIs directly for testing.

---

## Step 2: Capture APIs Using Browser Developer Tools

If no documentation is available, I use the browser's **Developer Tools**.

- Open **Developer Tools (F12)**.
- Go to the **Network** tab.
- Perform the required action in the application, such as login, search, add to cart, or checkout.
- Observe the network requests generated by the browser.

---

## Step 3: Capture Request Details

From the Network tab, I capture:

- Endpoint URL
- HTTP method
- Request headers
- Request payload
- Query parameters
- Path parameters
- Cookies
- Authorization token (if present)
- Response body
- Response status code

---

## Step 4: Reproduce the Request

Once I have captured all the required information, I recreate the same request in Postman or my automation framework to validate the API independently.

---

## Step 5: Validate the Response

I verify:

- Status code
- Response body
- Response time
- Business validations
- Error handling
- Authentication and authorization

### Example

Suppose I click **"Add to Cart"** in Shopify.

Using the Network tab, I can identify the backend API being called, capture its endpoint, headers, payload, cookies, and authorization details, then execute the same API in Postman or automate it using Playwright or another API testing tool.

This approach allows me to test backend APIs even when they are not officially documented.

---

# Q36. What happens if you send an extra field in a REST API request?

Most REST APIs ignore unknown fields and process the request normally.

However,

some applications perform strict schema validation.

In that case,

the server may return

400 Bad Request

depending on the implementation.

---

# Q37. Developer hasn't given the endpoint yet. How will you design API tests?

If the backend isn't ready,

I use the available API Contract.

Examples

- Swagger
- OpenAPI
- JSON Schema

If the API already exists in UI,

I capture it from Browser Network tab.

For third-party APIs,

I create Mock APIs using Playwright or other mocking frameworks.

This allows automation development before backend completion.

---

# Q38. What should you NOT test in API Testing?

We generally don't test third-party APIs directly.

Examples

- Payment Gateway
- SMS Provider
- Email Service

These services are owned by external vendors.

Instead,

we mock their responses.

Our testing focuses on

- Request Formation
- Integration
- Response Handling
- Error Handling

rather than validating the third-party implementation itself.
