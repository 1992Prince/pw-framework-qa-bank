
# Module 3 - Authentication

# Concept 3 - Authentication in Playwright API Testing

---

# 📌 Concept (Revision)

## What is Authentication?

- Authentication is the process of verifying the identity of a user or system before allowing access to an API.
- Most APIs are secured, meaning requests without valid authentication will fail with **401 Unauthorized** or **403 Forbidden**.
- In Playwright, authentication information is typically passed as part of the request headers while sending API requests.
- Depending on the application, different authentication mechanisms can be used.

---

## Common Types of Authentication

### 1. Bearer Token Authentication ⭐⭐⭐⭐⭐ (Most Common)

- The client first calls an authentication/login endpoint.
- The server validates the credentials.
- The server returns an **Access Token (Bearer Token)**.
- This token is then sent in the `Authorization` header for all subsequent API requests.

Header format:

```http
Authorization: Bearer <access_token>
```

---

### 2. Basic Authentication

- Uses a username and password.
- Credentials are Base64 encoded before being sent.
- Sent in the Authorization header.

Header format:

```http
Authorization: Basic Base64(username:password)
```

Mostly used by:

- Internal APIs
- Legacy applications

---

### 3. Digest Authentication

- More secure than Basic Authentication.
- Password is never sent directly.
- Uses a challenge-response mechanism.

Rarely used in modern applications.

---

### 4. Preemptive Authentication

- The client sends credentials in the very first request.
- No authentication challenge from the server is required.
- Mainly associated with Basic Authentication.

---

### 5. OAuth 2.0

- Industry-standard authentication framework.
- Used by applications like:
  - Google
  - Microsoft
  - GitHub
  - LinkedIn
- After successful authentication, an Access Token is returned.
- The Access Token is then passed as a Bearer Token in subsequent requests.

---

### 6. API Key Authentication

- The client sends an API Key with every request.
- The key may be passed:
  - As a header
  - As a query parameter

Example:

```http
x-api-key: abc123xyz
```

---

### 7. Cookie-Based Authentication

- After login, the server returns session cookies.
- These cookies are automatically sent with subsequent requests.
- Common in web applications using server-side sessions.

---

# Most Common Authentication in API Automation

In modern REST APIs, the most commonly used authentication mechanisms are:

- ✅ Bearer Token
- OAuth 2.0 (which ultimately also uses Bearer Tokens)
- API Key

Among these, **Bearer Token Authentication** is the most common in automation projects.

---

# Example - Bearer Token Authentication

```ts
const response = await request.get('/booking', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

---

# Example - API Key Authentication

```ts
const response = await request.get('/booking', {
    headers: {
        'x-api-key': apiKey
    }
});
```

---

# Example - Basic Authentication

```ts
const credentials = Buffer
    .from('admin:password123')
    .toString('base64');

const response = await request.get('/booking', {
    headers: {
        Authorization: `Basic ${credentials}`
    }
});
```

---

# Authentication Flow in Real Projects

Typical flow:

```text
Login Endpoint
        │
        ▼
Receive Access Token
        │
        ▼
Extract Token from Response
        │
        ▼
Store Token
        │
        ▼
Pass Token in Authorization Header
        │
        ▼
Call Business APIs
```

---

# Interview Questions & Answers

---

## Q1. What is Authentication?

### Answer

Authentication is the process of verifying the identity of a user or system before allowing access to protected APIs. Once authenticated, the client receives credentials (such as an access token) which are included in subsequent API requests.

---

## Q2. What are the different types of Authentication?

### Answer

The common authentication mechanisms are:

- Bearer Token Authentication
- Basic Authentication
- Digest Authentication
- Preemptive Authentication
- OAuth 2.0
- API Key Authentication
- Cookie-Based Authentication

In modern REST APIs, Bearer Token and OAuth 2.0 are the most commonly used.

---

## Q3. How do you pass a Bearer Token in Playwright?

### Answer

Bearer Token is passed using the `Authorization` header.

Example:

```ts
await request.get('/booking', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

---

## Q4. What Authentication mechanism does your project use?

### Answer

Our project uses **Bearer Token Authentication**.

The flow is:

- We first call a dedicated authentication endpoint.
- The endpoint validates the credentials and returns a Bearer Token.
- We parse the token from the response JSON.
- The token is then stored and added to the `Authorization` header for all subsequent API requests.

For better reusability, we have a separate utility responsible for generating the token. The generated token is passed to our reusable API Client, which automatically includes it in the headers of every request. This avoids repeating authentication logic across tests.

Example:

```ts
const tokenResponse = await request.post('/auth', {
    data: {
        username: 'admin',
        password: 'password123'
    }
});

const { token } = await tokenResponse.json();

await request.get('/booking', {
    headers: {
        Authorization: `Bearer ${token}`
    }
});
```

---

## Q5. What is OAuth 2.0?

### Answer

OAuth 2.0 is an industry-standard authorization framework that allows users to grant limited access to applications without sharing their passwords. After successful authentication, it returns an Access Token, which is typically sent as a Bearer Token in subsequent API requests.

---

## Q6. What is the difference between Basic Authentication and Bearer Token Authentication?

### Answer

| Basic Authentication                    | Bearer Token Authentication               |
| --------------------------------------- | ----------------------------------------- |
| Uses username and password              | Uses an Access Token                      |
| Credentials are Base64 encoded          | Token is generated after authentication   |
| Credentials are sent with every request | Only the token is sent with every request |
| Less secure                             | More secure and widely used               |
| Common in legacy systems                | Standard approach for modern REST APIs    |

---

## Q7. How do you handle authentication in your API framework?

### Answer

In our framework:

- We have a separate authentication utility.
- It calls the login/authentication endpoint.
- It extracts the Bearer Token from the response.
- The token is passed while creating the API Client.
- The API Client automatically adds the `Authorization` header to every request, so test classes do not need to manage authentication manually.

This keeps the framework reusable, centralized, and easy to maintain.

---

## ⭐ Interview Tip

When an interviewer asks:

> **"How do you handle authentication in your project?"**

Don't just answer **"We use Bearer Token."**

Instead, explain the complete flow:

> *"Our framework follows Bearer Token Authentication. We first call an authentication endpoint to generate the token, parse it from the response, and pass it to our reusable API Client. The client automatically attaches the token in the `Authorization: Bearer <token>` header for every request, so authentication is managed centrally and test scripts remain clean."*

This answer demonstrates practical framework design, not just theoretical knowledge.
