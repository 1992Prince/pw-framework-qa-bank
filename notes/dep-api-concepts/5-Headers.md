
# HTTP Headers — Interview Notes

## What are Headers?

- **Headers are metadata** that travels along with your API request (URL + payload) to define things like content type, authentication, and other request/response context.
- A complete HTTP request generally consists of **4 parts**:
  1. **HTTP method** (GET, POST, PUT, PATCH, DELETE, etc.)
  2. **URL endpoint**
  3. **Headers**
  4. **Request payload** (body)

---

## Common Headers

### 1. Content-Type

- **Purpose:** Tells the server **what format** the data being sent in the request body is in.
- **Example:** `Content-Type: application/json` or `Content-Type: application/xml`
- **When required:** Required for **PUT** and **POST** requests (since these send a request body, the server needs to know how to parse it).

### 2. Accept

- **Purpose:** Tells the server **what format the client wants the response in**.
- **Example:** `Accept: application/json` or `Accept: application/xml`
- **How it's different from Content-Type:** A system/app might **send** data as JSON (`Content-Type: application/json`) but ask the server to **send the response back in XML** by setting `Accept: application/xml`. So `Content-Type` describes what you're sending, and `Accept` describes what you want back.

### 3. Authorization

- **Purpose:** Provides authentication credentials, such as a bearer token.
- **Example:** `Authorization: Bearer <token>`
- **Use case:** Used to prove the identity of the client making the request — e.g., without this header (or with an expired/invalid token), you'd typically get a `401 Unauthorized`.

### 4. User-Agent

- **Purpose:** Identifies **client information** — i.e., which application/tool/browser is making the request.
- **Example:** If you hit any endpoint from **Postman**, the `User-Agent` header will automatically carry a value identifying it as Postman.
- **Use case:** Useful for the server to identify/log what kind of client is calling it (browser, mobile app, testing tool, etc.).

### 5. Accept-Language

- **Purpose:** Specifies the client's **language preference** for the response.
- **Example:** `Accept-Language: en-IN`

---

## Categories of Headers

Headers broadly serve these purposes:

- **Content negotiation** — e.g., `Content-Type`, `Accept`, `Accept-Language` (deciding the format/language of data exchanged).
- **Authorization** — e.g., `Authorization` (proving identity/credentials).
- **Tracing** — headers used to track/identify a request across systems (e.g., correlation IDs, request IDs — useful in distributed/microservice systems for debugging).
- **Cache** — headers that control caching behavior of responses (e.g., how long a response can be cached, whether it should be revalidated).

---

## Quick Revision Table

| Header          | Purpose                                | Example Value                              | Typically Required For                    |
| --------------- | -------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Content-Type    | Format of the data being**sent** | `application/json`                       | POST, PUT                                 |
| Accept          | Format the client wants**back**  | `application/json` / `application/xml` | Any request where response format matters |
| Authorization   | Auth credentials                       | `Bearer <token>`                         | Any protected/authenticated endpoint      |
| User-Agent      | Identifies the calling client/tool     | `PostmanRuntime/7.x`                     | All requests (auto-added by client tools) |
| Accept-Language | Preferred response language            | `en-IN`                                  | Localized responses                       |

**Header categories to remember:** Content negotiation, Authorization, Tracing, Cache.
