# URL Components, Protocols, HTTP & HTTPS


---

# What is a Protocol?

> A **Protocol** is a set of rules that defines how two systems communicate with each other over a network.


---

# Common Protocols

| Protocol | Full Form | Used For | Example |
|----------|-----------|----------|---------|
| HTTP | HyperText Transfer Protocol | Web communication | Websites & APIs |
| HTTPS ⭐ | HyperText Transfer Protocol Secure | Secure web communication | Banking, Airtel, Amazon |
| FTP | File Transfer Protocol | File transfer | Upload/Download files |
| SMTP | Simple Mail Transfer Protocol | Sending Emails | Gmail sending email |
| IMAP | Internet Message Access Protocol | Reading Emails | Outlook, Gmail |
| POP3 | Post Office Protocol | Download Emails | Email clients |
| TCP | Transmission Control Protocol | Reliable communication | Most applications |
| UDP | User Datagram Protocol | Fast communication | Video calls, Gaming |
| DNS | Domain Name System | Converts Domain → IP | google.com → IP Address |

---

# Which Protocol Do We Mostly Use in API Testing?

✅ HTTP

✅ HTTPS ⭐⭐⭐

Almost every REST API we test uses HTTP or HTTPS.

Example:

```http
GET https://api.airtel.com/offers
```

---

# What is HTTP?

> **HTTP (HyperText Transfer Protocol)** is an **application layer (Layer 7)** protocol used for communication between a client and a server.

It defines **how requests and responses are exchanged** using methods like:

- GET
- POST
- PUT
- DELETE
- PATCH

---

## Simple Flow

```text
Browser / Mobile App
        │
 HTTP Request
        │
        ▼
Server
        │
HTTP Response
        │
        ▼
Browser
```

---

## Airtel Example

Customer opens Airtel App

↓

Clicks **View Recharge Plans**

```http
GET /offers
```

Offer Service returns

```json
[
   "₹299",
   "₹399",
   "₹999"
]
```

---

# HTTP Characteristics

| Feature | Description |
|----------|-------------|
| Stateless | Every request is independent |
| Request-Response | Client sends request, server sends response |
| Application Layer | Layer 7 of OSI Model |
| Fast | No encryption overhead |
| Less Secure | Data travels in plain text |

---

# What is HTTPS?

> **HTTPS (HyperText Transfer Protocol Secure)** is the secure version of HTTP that encrypts communication between the client and server using **SSL/TLS**.

### Easy Definition (Interview)

> **HTTP is used to transfer data, whereas HTTPS transfers the same data securely by encrypting it.**

Or even shorter:

> **HTTPS = HTTP + Security (SSL/TLS Encryption)**

---

# Simple Flow

```text
Browser
     │
Encrypted Request 🔒
     │
Server
     │
Encrypted Response 🔒
     │
Browser
```

---

# Airtel Example

Customer enters

- Mobile Number
- OTP
- Card Details

These are sent securely using HTTPS.

No one can easily read this information while it travels over the internet.

---

# Why HTTP is Not Safe?

Suppose you login into Airtel.

Using HTTP

```text
Customer
      │
Login Request
      │
Internet
      │
Server
```

Data travels in **plain text**.

Someone monitoring the network could potentially read:

- Username
- Password
- Mobile Number
- Payment Details

---

# Why HTTPS is Safe?

Now using HTTPS

```text
Customer
      │
🔒 Encrypted Request
      │
Internet
      │
🔒 Encrypted Data
      │
Server
```

Even if someone intercepts the request,

They only see encrypted data like:

```text
x9A#K@8LmP$2Q...
```

Without the encryption key, the data is useless.

---

# Internal Working (Easy Interview Explanation)

### HTTP

```text
Client
   │
Plain Request
   │
Internet
   │
Server
```

Anyone in between can read the data.

---

### HTTPS

```text
Client
   │
SSL/TLS Handshake
   │
Secure Connection Established
   │
Encrypted Request
   │
Server
```

### Interview Answer

> Before sending data, the client and server perform an SSL/TLS handshake to establish a secure encrypted connection. After that, all requests and responses are encrypted, making it difficult for attackers to read or modify the data.

*(No need to explain certificates or public/private keys unless asked.)*

---

# HTTP vs HTTPS

| HTTP | HTTPS |
|------|--------|
| No encryption | Encrypted communication |
| Less secure | Highly secure |
| Uses HTTP | Uses HTTP + SSL/TLS |
| Data in plain text | Data encrypted |
| Port 80 | Port 443 |
| Faster (slightly) | Slight encryption overhead |
| Used for non-sensitive data | Used for login, payment, banking, APIs |

---

# What is a URL?

> **URL (Uniform Resource Locator)** is the complete address of a resource on the internet.

It tells:

- **Where** the resource is.
- **How** to access it.

---

# URL Structure

Example

```text
https://api.airtel.com/offers/premium?customerId=101&page=1
```

---

# URL Components

| Component | Example | Purpose |
|-----------|---------|---------|
| Protocol | https:// | Communication rules |
| Domain / Host | api.airtel.com | Server name |
| Path | /offers/premium | Specific resource |
| Query Parameters | ?customerId=101&page=1 | Extra information sent to server |

---

# Visual Breakdown

```text
https://api.airtel.com/offers/premium?customerId=101&page=1

│       │              │                 │
│       │              │                 └── Query Parameters
│       │              └──────────────────── Path
│       └────────────────────────────────── Domain
└────────────────────────────────────────── Protocol
```

---

# Airtel API Example

```http
GET https://api.airtel.com/offers?mobile=9876543210
```

| Part | Value |
|------|------|
| Protocol | HTTPS |
| Domain | api.airtel.com |
| Path | /offers |
| Query Parameter | mobile=9876543210 |

---

# URL Flow

```text
Customer
      │
Types URL
      │
Browser
      │
DNS Finds IP
      │
Request Sent
      │
Server
      │
Response Returned
```

---

# What is REST?

> **REST (Representational State Transfer)** is an architectural style used to build web services.

REST APIs use:

- HTTP Protocol
- URLs
- HTTP Methods
- JSON
- Stateless Communication

---

# REST Request Flow

```text
Client
    │
HTTP Request
(GET /offers)
    │
REST API
    │
Business Logic
    │
Database
    │
JSON Response
    │
Client
```

---

# Telecom Example

Customer opens Airtel App

↓

Clicks **Available Offers**

↓

```http
GET /offers
```

↓

Offer Service

↓

Database

↓

JSON Response

```json
[
   "₹299",
   "₹399",
   "₹999"
]
```

---

# URL vs URI vs Endpoint

| Term | Meaning | Example |
|------|---------|---------|
| URL | Complete address of a resource | https://api.airtel.com/offers |
| URI | Identifier of a resource (URL is one type of URI) | /offers |
| Endpoint | Specific API URL exposed by a service | GET /offers |

---

# Easy Way to Remember

```text
URL
│
├── Protocol
├── Domain
├── Path
└── Query Parameters
```

Example

```text
https://api.airtel.com/offers?mobile=9876543210
```

---

# Real Project Examples

### Login API

```http
POST https://api.airtel.com/login
```

---

### Recharge API

```http
POST https://api.airtel.com/recharge
```

---

### Offer API

```http
GET https://api.airtel.com/offers?mobile=9876543210
```

---

### Customer Profile API

```http
GET https://api.airtel.com/customer/101
```

---

# Interview Answer (45-60 Seconds)

> HTTP is an application layer protocol used for communication between a client and a server. It follows a request-response model and is stateless. HTTPS is the secure version of HTTP that uses SSL/TLS encryption to protect data during transmission. In our telecom project, all APIs use HTTPS because they handle sensitive information like login, customer details, and payments.
>
> A URL is the complete address of a resource and consists of the protocol, domain, path, and optional query parameters. REST APIs use HTTP/HTTPS protocols along with URLs and standard HTTP methods like GET, POST, PUT, and DELETE to exchange JSON data between the client and server.

---

# 🚀 Quick Revision (30 Seconds)

## Protocol

➡️ Rules for communication between systems.

---

## Common Protocols

| Protocol | Remember |
|----------|----------|
| HTTP | Web Communication |
| HTTPS ⭐ | Secure Web Communication |
| FTP | File Transfer |
| SMTP | Send Email |
| IMAP | Read Email |
| TCP | Reliable Communication |
| UDP | Fast Communication |
| DNS | Domain → IP |

---

## HTTP

- Application Layer (L7)
- Stateless
- Request-Response
- Plain Text
- Port 80

---

## HTTPS

- HTTP + SSL/TLS
- Encrypted
- Secure
- Port 443

---

## URL

```text
Protocol + Domain + Path + Query Parameters
```

Example

```text
https://api.airtel.com/offers?mobile=9876543210
```

---

## URL vs URI vs Endpoint

| URL | URI | Endpoint |
|-----|-----|----------|
| Complete Address | Resource Identifier | API URL |

---

## REST

- Uses HTTP/HTTPS
- Stateless
- JSON
- URLs
- GET, POST, PUT, DELETE