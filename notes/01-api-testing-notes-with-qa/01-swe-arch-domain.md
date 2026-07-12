
# Software Architecture (SWE Architecture)

> ## What is Software Architecture?
>
> Software Architecture is the **high-level design of an application**. It defines how different components (UI, APIs, Services, Database, External Systems) communicate with each other.
>
> **As an SDET, we don't design the architecture, but we should understand it because our APIs, databases, message queues, and integrations are all part of it.**

---

# SWE Architecture Types

| Architecture                                  | Meaning                                                                                                        | Best For                    | Example                 |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------- |
| **Monolithic**                          | Everything is inside one codebase and deployed together.                                                       | Small applications          | Old ERP systems         |
| **Microservices ⭐**                    | Application is split into multiple independent services. Each service has its own responsibility and database. | Large scalable applications | Airtel, Amazon, Netflix |
| **Event Driven**                        | Services communicate by publishing events instead of directly calling each other.                              | Async processing            | Notification, Analytics |
| **SOA (Service Oriented Architecture)** | Large services communicate through a central ESB (Enterprise Service Bus).                                     | Legacy Enterprise Apps      | Banking, Government     |

---

# Monolithic vs Microservices

| Monolithic                        | Microservices                      |
| --------------------------------- | ---------------------------------- |
| Single application                | Multiple independent services      |
| One codebase                      | Separate codebase for each service |
| Shared database                   | Separate database for each service |
| One deployment                    | Independent deployment             |
| Difficult to scale                | Easy to scale individual services  |
| One failure may impact entire app | Failure is isolated to one service |
| Easier initially                  | Better for large applications      |

---

# Which Architecture Does Our Project Use?

> **Our Telecom application follows a Microservices Architecture.**

Instead of one large application, our system is divided into multiple independent services.

✔ Each service handles one business capability.

✔ Each service owns its own database.

✔ Services communicate mainly through **REST APIs**.

✔ Some background activities (like notifications) may happen asynchronously using events/message queues (if implemented).

---

# Telecom Application Architecture

```text
Customer/Agent
        │
        ▼
 React Web / Mobile App
        │
 REST API Calls
        │
        ▼
---------------------------------------------------------
| Customer | Offer | Recharge | Payment | Billing | Notification |
---------------------------------------------------------
        │
        ▼
 Individual Databases
        │
        ▼
External Systems
(Payment Gateway, SMS Provider, CRM, Marketing)
```

---

# Layers

| Layer                      | Components                                                         |
| -------------------------- | ------------------------------------------------------------------ |
| **Frontend**         | React Web Application, Mobile App                                  |
| **Backend**          | Customer, Offer, Recharge, Payment, Billing, Notification Services |
| **Communication**    | REST APIs                                                          |
| **Database**         | Separate DB for every microservice                                 |
| **External Systems** | Payment Gateway, SMS Provider, CRM, Marketing                      |

---

# Major Services & Responsibilities

| Service                                         | Responsibility                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------- |
| **Customer Service**                      | Stores customer profile, mobile number, KYC status, account details             |
| **Offer Service**                         | Provides recharge plans, customer-specific offers, campaign offers, eligibility |
| **Recharge Service**                      | Recharge processing, plan activation, recharge history                          |
| **Payment Service**                       | Payment processing, refunds, payment verification                               |
| **Billing Service**                       | Monthly bills, invoices, outstanding balance                                    |
| **Notification Service**                  | Sends SMS, Email, Push Notifications                                            |
| **Authentication Service (if available)** | Login, OTP validation, JWT token generation                                     |

---

# Example API Flow

### Recharge Flow

```text
Customer
   │
   ▼
React Web / Mobile
   │
POST /recharge
   │
Recharge Service
   │
Payment Service
   │
Recharge Success
   │
Notification Service
   │
SMS / Email Sent
```

---

### Offer Flow

```text
Customer
   │
   ▼
GET /offers
   │
Offer Service
   │
Checks Customer Type
   │
Returns Eligible Offers
```

---

# External Integrations

| External System    | Purpose                        |
| ------------------ | ------------------------------ |
| Payment Gateway    | Process payments & refunds     |
| SMS Provider       | OTP & Recharge Confirmation    |
| CRM                | Customer support information   |
| Marketing Platform | Promotional offers & campaigns |

---

# My Role (SDET)

> I work as an SDET in the Telecom domain.

My daily responsibilities include:

| Area                  | Work                                      |
| --------------------- | ----------------------------------------- |
| API Testing           | Validate request & response               |
| Functional Testing    | Verify business logic                     |
| Playwright Automation | Automate API & UI scenarios               |
| Database Validation   | Verify data is stored correctly           |
| Integration Testing   | Validate communication between services   |
| Regression Testing    | Ensure existing features continue working |

---

# Features I Usually Test

- New Recharge Plans
- Customer Specific Offers
- Premium Customer Offers
- Recharge APIs
- Customer APIs
- Payment APIs
- Billing APIs
- Notification APIs
- Customer Profile Updates

---

# Real Telecom Example

### Requirement

Business launches a new recharge offer:

> Recharge **₹399** → Get **3GB/day** instead of **2GB/day**.

### APIs Involved

```text
Offer Service
      │
      ▼
Returns New Offer

Recharge Service
      │
      ▼
Activates Plan

Payment Service
      │
      ▼
Payment Success

Notification Service
      │
      ▼
SMS Confirmation
```

### My Testing

✔ Verify Offer API

✔ Validate eligible & non-eligible customers

✔ Verify Recharge API

✔ Verify Payment API

✔ Validate Database

✔ Verify Notification API

✔ Automate Regression Tests

---

# Interview Answer (1-2 Minutes)

> Our Telecom application follows a **Microservices Architecture**. Instead of one large application, it is divided into multiple independent services like **Customer Service, Offer Service, Recharge Service, Payment Service, Billing Service, and Notification Service**.
>
> Each service has its own responsibility and database, making the application easier to maintain and scale. Most communication between services happens through **REST APIs**, and asynchronous operations like notifications may use event-based communication where applicable.
>
> The frontend is built using **React Web and Mobile applications**, which consume backend APIs.
>
> As an SDET, I mainly test backend APIs for customer management, recharge, offers, payments, and notifications. My responsibilities include **functional testing, API automation using Playwright, database validation, integration testing, and regression testing.**

---

# Quick Revision (30 Seconds)

## SWE Architecture Types

| Type                       | Remember                                      |
| -------------------------- | --------------------------------------------- |
| **Monolithic**       | Everything in one codebase                    |
| **Microservices ⭐** | Independent services + Separate DB            |
| **Event Driven**     | Communication through Events (Kafka/RabbitMQ) |
| **SOA**              | Older architecture using ESB                  |

---

## Monolithic vs Microservices

| Monolithic        | Microservices          |
| ----------------- | ---------------------- |
| One Application   | Many Services          |
| Shared DB         | Separate DB            |
| One Deployment    | Independent Deployment |
| Hard to Scale     | Easy to Scale          |
| Entire App Impact | Service Isolation      |

---

## Our Project

| Item             | Value                              |
| ---------------- | ---------------------------------- |
| Domain           | Telecom                            |
| Architecture     | Microservices                      |
| Frontend         | React Web + Mobile                 |
| Communication    | REST APIs                          |
| Database         | One DB per Service                 |
| External Systems | Payment Gateway, SMS Provider, CRM |

---

## Major Services

| Service      | Purpose                |
| ------------ | ---------------------- |
| Customer     | Customer Profile & KYC |
| Offer        | Recharge Offers        |
| Recharge     | Plan Activation        |
| Payment      | Payment & Refund       |
| Billing      | Bills & Invoices       |
| Notification | SMS & Email            |

---

## My Responsibilities

- API Testing
- Playwright Automation
- Database Validation
- Integration Testing
- Regression Testing

---

# ⭐ One-Line Interview Summary

**"Our Telecom application follows a Microservices architecture where independent services like Customer, Offer, Recharge, Payment, Billing, and Notification communicate mainly through REST APIs. As an SDET, I test these APIs, validate databases, automate regression using Playwright, and ensure seamless integration between services."**
