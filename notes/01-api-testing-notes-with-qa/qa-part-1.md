
## Software Architecture, API Basics & HTTP

---

# Q1. What is Software Architecture? What different software architectures are you aware of?

Software Architecture is the **high-level design of an application**. It defines how different components like the UI, APIs, Services, Database, and External Systems communicate with each other.

As an SDET, I don't design the architecture, but I should understand it because I test APIs, integrations, databases, and communication between different services.

The main software architectures I'm aware of are:

- **Monolithic**
- **Microservices**
- **Event Driven**
- **SOA (Service Oriented Architecture)**

### Remember

- High Level Design
- Communication between components
- UI → API → Services → DB
- Monolithic, Microservices, Event Driven, SOA

---

# Q2. Monolithic vs Microservices?

In a **Monolithic architecture**, the entire application is built as a single codebase and deployed together. All modules usually share the same database, so even a small change requires redeploying the whole application.

In a **Microservices architecture**, the application is divided into multiple independent services. Each service has its own responsibility, database, and deployment, making the application easier to maintain, scale, and develop independently.

### Quick Difference

| Monolithic                        | Microservices                 |
| --------------------------------- | ----------------------------- |
| One application                   | Multiple independent services |
| Shared database                   | Separate database             |
| Single deployment                 | Independent deployment        |
| Hard to scale                     | Easy to scale                 |
| One failure may affect entire app | Failure is isolated           |

---

# Q3. Which Architecture does your Project use? What do you test?


Our Telecom application follows a **Microservices Architecture**.

Instead of one large application, it is divided into multiple services such as Customer Service, Offer Service, Recharge Service, Payment Service, Billing Service, and Notification Service.

Each service has its own responsibility and database. Most communication happens through REST APIs, while some asynchronous operations like notifications may use event-driven communication.

### Project Layers

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Frontend         | React Web Application                     |
| Backend          | Java-based Microservices                  |
| Communication    | REST APIs + Event Driven                  |
| Database         | PostgreSQL / MongoDB (One DB per Service) |
| External Systems | Payment Gateway, SMS Provider             |

### My Role

I mainly work on:

- Functional API Testing
- API Automation using Playwright
- Integration Testing
- Database Validation
- Regression Testing

---

# Q4. What is an API?

API stands for **Application Programming Interface**.

It is an interface that allows two software systems to communicate with each other by exchanging requests and responses.

I usually explain it as a **contract** between two applications. It tells the client what request to send and what response it should expect in return.

For example, when the Airtel app requests available recharge offers, it calls an API, and the backend returns the offer details in JSON format.

### Remember

API = Communication

Client ⇄ Server

Request ⇄ Response

---

# Q5. What is Contract Testing?


Contract Testing verifies that both the client and server follow the agreed API contract.

The contract acts like a rulebook that defines how both systems should communicate.

It includes:

- Endpoint URL
- HTTP Method
- Request Headers
- Request Body
- Query & Path Parameters
- Response Format
- Data Types
- Status Codes
- Error Messages
- Authentication

Examples of contracts include:

- Swagger/OpenAPI
- JSON Schema
- GraphQL Schema
- Protobuf

### Simple Interview Line

I think of a contract as an agreement between the frontend and backend teams. Both sides must follow the same request and response structure; otherwise, communication will fail.

---

# Q6. What is a Protocol? Name different types.


A **Protocol** is a set of rules that defines how two systems communicate over a network.

Just like traffic rules help vehicles communicate safely on roads, protocols help computers communicate correctly.

Some common protocols are:

- HTTP
- HTTPS
- TCP
- UDP
- SMTP
- FTP
- DNS

In API testing, the protocols we use most are **HTTP and HTTPS**.

---

# Q7. HTTP vs HTTPS?


HTTP stands for **HyperText Transfer Protocol** and is used for communication between clients and servers.

HTTPS stands for **HyperText Transfer Protocol Secure**. It is the secure version of HTTP because it uses SSL/TLS encryption.

The main difference is that HTTP sends data in plain text, whereas HTTPS encrypts the data before sending it, making it secure.

### Quick Difference

| HTTP          | HTTPS              |
| ------------- | ------------------ |
| No encryption | Encrypted          |
| Less secure   | Secure             |
| Port 80       | Port 443           |
| Plain Text    | SSL/TLS Encryption |

### Easy Line

**HTTPS is simply HTTP with security.**

---

# Q8. Why is HTTP not safe but HTTPS is?


HTTP is not secure because it sends data in plain text over the network.

If someone intercepts the request, they can read sensitive information like usernames, passwords, or payment details.

HTTPS first establishes a secure SSL/TLS connection between the client and server. After that, all requests and responses are encrypted.

Even if someone captures the traffic, they cannot easily read the encrypted data.

### Easy Flow

```text
HTTP

Client
   │
Plain Text
   │
Internet
   │
Server
```

```text
HTTPS

Client
   │
SSL/TLS Handshake
   │
Encrypted Request
   │
Internet
   │
Encrypted Response
   │
Server
```

---

# Q9. What is a URL? Explain its Components.


URL stands for **Uniform Resource Locator**.

It is the complete address of a resource available on the internet.

A URL consists of four main parts:

- Protocol
- Domain (Host)
- Path
- Query Parameters

### Example

```text
https://api.airtel.com/offers?mobile=9876543210
```

| Component       | Example           |
| --------------- | ----------------- |
| Protocol        | https             |
| Domain          | api.airtel.com    |
| Path            | /offers           |
| Query Parameter | mobile=9876543210 |

### Easy Way to Remember

```text
Protocol + Domain + Path + Query Parameters
```

---

# Q10. What are Web Services?


A **Web Service** is a type of API that allows two systems to communicate over a network using web protocols like **HTTP or HTTPS**.

In simple words, every Web Service is an API, but not every API is a Web Service.

For example, Apache POI is a Java API used to work with Excel files locally. It doesn't require a network, so it is an API but not a Web Service.

Our telecom project's backend services communicate over HTTP/HTTPS, so they are Web Services.

### Remember

API → Communication

Web Service → Communication over HTTP/HTTPS
