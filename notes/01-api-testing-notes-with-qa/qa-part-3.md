
# API-QA-SHEET-3

---

# Q21. What is API Documentation?

API Documentation is a document that explains how to use an API correctly. It acts as a guide for developers and testers.

It typically contains:

- API Endpoint (URL)
- HTTP Methods (GET, POST, PUT...)
- Request Headers
- Request Body
- Path & Query Parameters
- Response Format
- Status Codes
- Authentication Details
- Error Messages

Common API documentation tools include:

- Swagger / OpenAPI
- Postman Documentation
- Redoc

In my project, we mainly use **Swagger/OpenAPI** to understand endpoints, request/response structure, and test APIs.

---

# Q22. What is the difference between REST and RESTful?

REST stands for **Representational State Transfer** and is an architectural style that defines a set of principles for building web services.

RESTful is an actual API or service that follows those REST principles and built bu following these REST principles/constraints.

For example, if an API follows stateless communication, proper HTTP methods, uniform interface, and REST constraints, then it is called a RESTful API.

### Easy Way to Remember

REST → Rules

RESTful → API following those rules

---

# Q23. What is Idempotency?

Idempotency means that executing the same API request multiple times results in the **same final state** on the server.

It doesn't necessarily mean the response is always identical, but the resource state remains unchanged after repeated requests.

Idempotent methods are:

- GET
- PUT
- DELETE

Generally not idempotent:

- POST
- PATCH

For example, calling **GET /customers** multiple times will always return the same customer list without changing anything on the server.

---

# Q24. Why is PUT idempotent but PATCH is not?

PUT replaces the **entire resource** with the new payload. So whether we call the same PUT request once or ten times, the final resource remains exactly the same.

PATCH updates only specific fields. Depending on how it's implemented, repeating the same PATCH request may keep changing the resource.

For example,

Updating customer's city using PATCH is usually idempotent.

But if PATCH increments wallet balance by ₹100,

Calling it 5 times will add ₹500.

That's why PATCH is **not idempotent by default**. It depends on the implementation.

---

# Q25. Which HTTP methods are Safe, Idempotent and Cacheable?

### Safe Methods

Safe methods don't modify server data.

- GET
- HEAD
- OPTIONS

---

### Idempotent Methods

Calling multiple times gives the same final server state.

- GET
- PUT
- DELETE

---

### Cacheable Methods

Responses can be stored and reused.

- GET
- HEAD

POST and PATCH are generally **not safe**, **not idempotent**, and **not cacheable**.

### Easy Memory

| Property   | Methods            |
| ---------- | ------------------ |
| Safe       | GET, HEAD, OPTIONS |
| Idempotent | GET, PUT, DELETE   |
| Cacheable  | GET, HEAD          |

---

# Q26. What is the difference between Authentication and Authorization?

## Authentication (Who are you?)

- Authentication verifies the identity of the user.
- It confirms whether the user is genuine.
- Usually done using:
  - Username & Password
  - JWT Token
  - OAuth
  - API Key
- If authentication fails, the API returns **401 Unauthorized**.

**Example:**
- Logging into Amazon using your username and password.
- The server verifies your credentials and authenticates you.

## Authorization (What are you allowed to do?)

- Authorization determines what actions or resources the authenticated user can access.
- It is performed **after successful authentication**.
- Access depends on the user's role or permissions.
- If the user doesn't have permission, the API returns **403 Forbidden**.

**Example:**
- A normal user can view products.
- An admin can add or delete products.
- If a normal user tries to delete a product, the server returns **403 Forbidden**.

If Authentication fails,

Server returns

**401 Unauthorized**

If Authentication succeeds but you don't have permission,

Server returns

**403 Forbidden**

Example:

Missing or expired Bearer Token

↓

401 Unauthorized

Valid Token but trying to delete another user's data

↓

403 Forbidden

---

# Q27. What are the different API Authentication methods?

Some common authentication methods are:

### Basic Authentication

Username and Password are sent in Base64 format.

Not recommended for production because Base64 is encoding, not encryption.

---

### Digest Auth

Digest Authentication is an HTTP authentication method where the client sends a hashed (encrypted) version of the username and password instead of sending the password in plain text. It uses a server-generated nonce (random value) to prevent replay attacks, making it more secure than Basic Authentication.

### Session Authentication

User logs in once.

Server creates a session and returns a Session Cookie.

Every request sends the same cookie.

Mostly used in Web Applications.

---

### Token Authentication (JWT)

After successful login,

Server returns a JWT Token.

Client sends it in every request.

```text
Authorization: Bearer <token>
```

This is the authentication method used in my project.

---

### OAuth

Used for third-party login.

Examples:

- Login with Google
- Login with Facebook

The application never sees the user's actual password.

---

### API Key

Uses a fixed API Key.

Example

```text
X-API-KEY: abc123xyz
```

Mostly used for Public APIs.

### Project Example

In our Telecom project, we use **Bearer Token (JWT)** authentication. We pass the token in the Authorization header while testing APIs through Postman and Playwright Automation.

---

# Q28. What are Headers? Name some common headers.

Headers are **metadata** sent along with an HTTP request or response.

A complete HTTP request consists of:

- HTTP Method
- URL
- Headers
- Request Body

Some common headers are:

| Header          | Purpose                    |
| --------------- | -------------------------- |
| Content-Type    | Format of request body     |
| Accept          | Expected response format   |
| Authorization   | Authentication credentials |
| User-Agent      | Client information         |
| Accept-Language | Preferred language         |

### Content-Type vs Accept

Content-Type tells the server **what format I'm sending**.

Example

```text
Content-Type: application/json
```

Accept tells the server **what response format I want back**.

Example

```text
Accept: application/json
```

---

# Q29. Explain Path Parameter vs Query Parameter vs Form Parameter.

### Path Parameter

Path parameters identify a specific resource.

They are part of the URL and usually mandatory.

Example

```http
GET /customers/101
```

101 is the Path Parameter.

---

### Query Parameter

Query parameters are used for filtering, searching, sorting, and pagination.

They are optional.

Example

```http
GET /customers?page=2&limit=10
```

---

### Form Parameter

Form parameters are sent inside the request body as key-value pairs.

Mostly used for HTML forms and file uploads.

A **form parameter** is data sent in the **body of an HTTP request** using the **`application/x-www-form-urlencoded`** or **`multipart/form-data`** content type. 
It is commonly used when submitting HTML forms, such as login, registration, or contact forms.

Unlike **JSON** or **XML**, the data is sent as **key-value pairs**.


### How to Send Form Parameters in Postman

1. Select the request method (usually POST or PUT).
2. Go to the **Body** tab.
3. Choose one of the following options:
   - **x-www-form-urlencoded** – Used for sending simple key-value pairs.
   - **form-data** – Used when sending key-value pairs along with files.

Example

```text
username=Prince

password=12345
```

### How to Send Files or Images in Postman

To upload a file or image:

1. Open the **Body** tab.
2. Select **form-data**.
3. Add a key (for example, `profileImage` or `file`).
4. Change the key type from **Text** to **File**.
5. Click **Select Files** and choose the file from your system.
6. Send the request.

Postman automatically sends the request using the **`multipart/form-data`** content type.

### Quick Difference

| Path                | Query                | Form         |
| ------------------- | -------------------- | ------------ |
| Resource Identifier | Filters & Pagination | Form Data    |
| Mandatory           | Optional             | Body         |
| URL                 | URL                  | Request Body |

---

# Q30. How do you test Query Parameters as an SDET?

In real applications, query parameters are mainly used for **pagination, filtering, searching, and sorting**.

For example,

The Customer page shows only 10 customers at a time.

When the user clicks **Next Page**, the frontend sends another request like:

```http
GET /customers?page=2&limit=10
```

As an SDET, I validate:

- Correct page number returns correct records.
- Page size (limit) is respected.
- No duplicate records across pages.
- No records are missing.
- Invalid page numbers return proper error.
- Filtering returns only matching records.
- Sorting works correctly.
- Default values work when parameters are omitted.
- Performance is acceptable even with large page numbers.

### Example

```http
GET /customers?page=1&limit=10
```

↓

Returns Customers 1–10

```http
GET /customers?page=2&limit=10
```

↓

Returns Customers 11–20

I also verify the same behavior from the UI by clicking the pagination controls and confirming that the API request contains the correct query parameters.
