
# Advanced Postman Notes

---

# 1. How to Set Up Proxy, SSL Certificates, and Client Certificates in Postman

Sometimes an API server requires requests to pass through a **proxy** or requires a **client SSL certificate** for authentication.

These settings can be configured from **Postman Settings**.

## Where to Configure

Open Postman and navigate to:

```text
Settings
   ├── Proxy
   └── Certificates
```

---

## Proxy Setup

A proxy acts as an intermediary between the client (Postman) and the API server.

Some organizations route all API traffic through a corporate proxy.

### Steps

1. Open **Settings**
2. Go to **Proxy**
3. Enable proxy if required.
4. Enter:
   - Proxy Host
   - Proxy Port
   - Username (if required)
   - Password (if required)

Save the configuration.

---

## Client Certificate (SSL Certificate) Setup

Some APIs require **Mutual TLS (mTLS)** where the client must also present a certificate to the server.

In such cases, the development team usually shares:

- `.crt`
- `.key`
- `.pfx`
- `.pem`

files.

### Steps

1. Open **Settings**
2. Click **Certificates**
3. Click **Add Certificate**
4. Enter the Host name (or localhost if instructed)
5. Import the certificate files
6. Save

Example:

```text
Host : api.company.com

CRT File : client.crt

KEY File : client.key
```

or

```text
Host : api.company.com

PFX File : client.pfx
```

---

## Where Do You Get These Certificate Files?

Usually, the Development or DevOps team provides them.

The details are generally available in:

- Confluence
- Project Documentation
- API Setup Guide

If no certificate file is provided, you may simply need to enter the **Host** (for example, `localhost`) as instructed by the project documentation.

---

## Interview Answer

**Q. How do you configure SSL certificates in Postman?**

- Open **Settings → Certificates**.
- Add the server host.
- Import the client certificate (`.crt`, `.key`, `.pfx`, or `.pem`) provided by the development team.
- Save the configuration.
- Postman will automatically attach the certificate whenever requests are sent to that host.

---

# 2. How to Send Cookies in Postman

Cookies are used to maintain user sessions and authentication.

There are two ways to send cookies.

---

## Method 1 (Recommended)

Click

```text
Cookies
```

below the **Send** button.

Select the domain and add cookies.

Example

| Cookie Name | Value  |
| ----------- | ------ |
| sessionId   | abc123 |
| userId      | 1001   |

Postman automatically sends them with every request to that domain.

---

## Method 2

Manually add the Cookie header.

Example:

```text
Cookie: sessionId=abc123; userId=1001
```

---

## Interview Answer

Cookies can be sent either:

- Using the **Cookies** manager in Postman.
- By adding a **Cookie** header manually.

---

# 3. What is a cURL Command?

**cURL (Client URL)** is a command-line tool used to send HTTP requests to APIs.

Almost every Postman request can be converted into a cURL command.

It is useful for:

- API Testing
- Debugging
- Automation
- Sharing requests with developers

---

## Example

Suppose the API is

```http
GET https://api.company.com/books/101
```

with a Bearer Token.

Equivalent cURL command:

```bash
curl --location 'https://api.company.com/books/101' \
--header 'Authorization: Bearer eyJhbGciOi...' \
--header 'Content-Type: application/json'
```

---

## How to Generate cURL from Postman

Click

```text
Code (</>)
      ↓
Select cURL
      ↓
Copy
```

---

## Interview Answer

A **cURL command** is the command-line representation of an HTTP request. It can perform all HTTP operations such as GET, POST, PUT, PATCH, and DELETE. Postman can automatically generate the equivalent cURL command for any request.

---

# 4. Tabs Available in Postman Request

Whenever you open any API request in Postman, you'll see the following tabs.

---

## 1. Params

Used for passing:

- Query Parameters
- Path Parameters

Example

```
GET /users?id=101&status=active
```

| Key    | Value  |
| ------ | ------ |
| id     | 101    |
| status | active |

---

## 2. Authorization

Used for API authentication.

Supported authentication types include:

- No Auth
- API Key
- Bearer Token
- Basic Auth
- Digest Auth
- JWT Bearer
- OAuth 1.0
- OAuth 2.0
- AWS Signature
- NTLM

Example:

```text
Authorization

Type : Bearer Token

Token : eyJhbGciOi...
```

---

## 3. Headers

Headers are sent as key-value pairs along with every request.

Example

| Key           | Value            |
| ------------- | ---------------- |
| Content-Type  | application/json |
| Authorization | Bearer {{token}} |
| Accept        | application/json |

---

## 4. Body

Used to send request payload.

Postman supports multiple body types.

### Raw (JSON)

Select:

```text
Body
    ↓
Raw
    ↓
JSON
```

Example

```json
{
    "name": "John",
    "age": 30
}
```

---

### Form Data

Used for:

- File Upload
- Multipart Requests

Example

| Key  | Value       |
| ---- | ----------- |
| name | John        |
| file | profile.png |

---

### x-www-form-urlencoded

Used for HTML form submissions.

Example

| Key      | Value    |
| -------- | -------- |
| username | admin    |
| password | admin123 |

---

### GraphQL

Used when testing GraphQL APIs.

Postman provides dedicated sections for:

- Query
- Variables

---

### Binary

Used for sending raw files directly.

Example:

- PDF
- ZIP
- Images

---

## 5. Scripts

Contains JavaScript code executed during request execution.

### Pre-request Script

Runs **before** the API request is sent.

Used for:

- Generate tokens
- Generate timestamps
- Set variables
- Create signatures

---

### Tests (Post-response Script)

Runs **after** the response is received.

Used for:

- Assertions
- Save variables
- Validate responses
- Chain API requests

---

## 6. Settings

Request-specific settings.

Examples:

- Follow redirects
- Disable SSL verification
- Automatically encode URL
- Request timeout
- Enable/Disable cookies

---

# Interview Answer

### What are the main tabs available in Postman?

The main tabs are:

- **Params** – Used for query and path parameters.
- **Authorization** – Used to configure authentication such as Bearer Token, Basic Auth, OAuth, API Key, etc.
- **Headers** – Used to send request headers as key-value pairs.
- **Body** – Used to send request payload in JSON, form-data, x-www-form-urlencoded, GraphQL, or Binary format.
- **Scripts** – Contains Pre-request and Tests scripts written in JavaScript.
- **Settings** – Contains request-level configuration such as SSL verification, redirects, timeout, and URL encoding.
