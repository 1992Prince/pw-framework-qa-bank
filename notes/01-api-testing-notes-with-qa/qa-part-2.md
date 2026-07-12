---

# Q11. API vs Web Services?

An **API** is a way for two software applications to communicate with each other.

A **Web Service** is a type of API that communicates over a network using web protocols like **HTTP or HTTPS**.

So we can say:

> **Every Web Service is an API, but not every API is a Web Service.**

For example, **Apache POI** is a Java API used to read/write Excel files. It works locally using JAR files and doesn't require a network, so it is an API but not a Web Service.

### Quick Difference

| API                                | Web Service                   |
| ---------------------------------- | ----------------------------- |
| Communication between applications | Communication over HTTP/HTTPS |
| May or may not require network     | Always requires network       |
| Broader concept                    | Subset of API                 |

---

# Q12. What is REST? What is its full form? What are its principles?

REST stands for **Representational State Transfer**.

It is an **architectural style** used to build Web Services. REST APIs use HTTP methods like GET, POST, PUT, PATCH and DELETE, and mostly exchange data in JSON format.

REST follows these main principles:

- Client-Server
- Stateless
- Cacheable
- Uniform Interface
- Layered System

### Remember

REST = Architectural Style

RESTful API = API that follows REST principles.

---

# Q13. What are different types of Web Services?

The most common Web Services are:

- REST APIs
- SOAP APIs
- GraphQL APIs
- WebSockets
- RPC / gRPC

### One-line Explanation

- **REST** → Uses HTTP and JSON.
- **SOAP** → Uses XML with strict standards.
- **GraphQL** → Client requests only required data.
- **WebSocket** → Real-time two-way communication.
- **RPC/gRPC** → Calls remote functions like local methods.

---

# Q14. REST vs SOAP?

REST stands for **Representational State Transfer** and is an architectural style.

SOAP stands for **Simple Object Access Protocol** and is a protocol.

REST is lightweight, faster, and mostly uses JSON, so it is widely used in modern applications.

SOAP is heavier because it uses XML and additional security standards. It is commonly used in banking, insurance, and legacy enterprise applications.

### Quick Difference

| REST                            | SOAP                          |
| ------------------------------- | ----------------------------- |
| Representational State Transfer | Simple Object Access Protocol |
| Architectural Style             | Protocol                      |
| JSON (mostly)                   | XML Only                      |
| Lightweight                     | Heavy                         |
| Faster                          | Slower                        |
| Modern Applications             | Banking & Legacy Systems      |

---

# Q15. REST vs GraphQL?

REST exposes **multiple endpoints**, and each endpoint returns a fixed response.

GraphQL exposes **a single endpoint**, where the client requests only the required fields.

For example,

REST

```http
GET /customer

GET /offers

GET /billing
```

GraphQL

```graphql
{
 customer{
   name
   offers
   billing
 }
}
```

GraphQL reduces the number of API calls and avoids over-fetching or under-fetching of data.

### Quick Difference

| REST                   | GraphQL                    |
| ---------------------- | -------------------------- |
| Multiple Endpoints     | Single Endpoint            |
| Fixed Response         | Client chooses response    |
| Multiple API Calls     | Usually One Call           |
| Over-fetching possible | Returns only required data |

---

# Q16. List all HTTP Methods and their Purpose.

| Method  | Purpose                              |
| ------- | ------------------------------------ |
| GET     | Fetch data                           |
| POST    | Create new resource                  |
| PUT     | Replace existing resource completely |
| PATCH   | Update specific fields               |
| DELETE  | Delete resource                      |
| HEAD    | Returns only headers                 |
| OPTIONS | Returns supported HTTP methods       |

### Easy Memory

GET → Read

POST → Create

PUT → Replace

PATCH → Update

DELETE → Delete

HEAD → Headers

OPTIONS → Allowed Methods

---

# Q17. POST vs PUT vs PATCH?

POST is used to **create a new resource** on the server.

PUT is used to **replace the entire existing resource**. It requires the complete resource payload and is idempotent.

PATCH is used to **partially update** an existing resource. Only the fields that need to change are sent, making it more efficient.

### Quick Difference

| Method | Purpose         | Idempotent | Payload             |
| ------ | --------------- | ---------- | ------------------- |
| POST   | Create Resource | ❌ No      | New Resource Data   |
| PUT    | Full Update     | ✅ Yes     | Complete Resource   |
| PATCH  | Partial Update  | Usually ❌ | Changed Fields Only |

---

# Q18. Which HTTP method is suitable for Partial Updates? Why?

**PATCH** is the best choice for partial updates.

It sends only the fields that need to be updated instead of the complete object. This reduces network traffic and improves performance.

If we use **PUT** for a partial update, the server expects the complete resource. Sending only a few fields may result in a **400 Bad Request**, because the payload is incomplete.

### Example

Current Resource

```json
{
   "name":"Prince",
   "city":"Delhi",
   "age":28
}
```

Want to update only city.

PATCH

```json
{
   "city":"Mumbai"
}
```

PUT

```json
{
   "name":"Prince",
   "city":"Mumbai",
   "age":28
}
```

---

# Q19. Why is PUT Idempotent but POST is not?

Idempotency means that calling the same request multiple times results in the **same final state** on the server.

PUT is idempotent because every request replaces the resource with the same data. Whether we call it one time or ten times, the resource remains the same.

POST is not idempotent because each request usually creates a new resource. Calling the same POST request multiple times may create duplicate records unless the application prevents duplicates using mechanisms like **409 Conflict** or an **Idempotency Key**.

### Example

PUT

```text
PUT Customer

Run 10 times

↓

Still One Updated Customer
```

POST

```text
POST Customer

Run 10 times

↓

10 New Customers
```

---

# Q20. What are the different types of APIs?

Based on accessibility, APIs are mainly of three types:

### Public (Open) API

Available for everyone.

Example:

Google Maps API

---

### Partner API

Shared only with trusted business partners.

Example:

Amazon communicating with Airtel through secured APIs.

---

### Private (Enterprise) API

Used only inside an organization.

These APIs are used for communication between internal microservices.

In our Telecom project, most of the APIs we test are **Private APIs**.

### Quick Difference

| API Type             | Access                |
| -------------------- | --------------------- |
| Public               | Everyone              |
| Partner              | Business Partners     |
| Private (Enterprise) | Internal Organization |
