
# Module 4 - Request Payload Management

# Concept 4 - Request Payload Management

---

# 📌 Concept (Revision)

## What is Request Payload?

- A request payload (or request body) is the data sent from the client to the server while making an API request.
- It is commonly used with:
  - POST
  - PUT
  - PATCH
- Payloads are usually sent in **JSON** format for REST APIs.
- Instead of hardcoding payloads inside test scripts, they should be maintained separately for better readability and maintainability.

---

## Different Ways to Maintain Payloads

There are multiple ways to maintain request payloads:

- Hardcoded inside the test (not recommended)
- JSON files ✅ (most common)
- Builder Pattern
- POJO / Classes
- Dynamic payload generation
- Reading from Excel/CSV (rare)

For most automation frameworks, keeping payloads in **JSON files** is the preferred approach.

---

# Our Project Approach ⭐⭐⭐⭐⭐

In our project, request payloads are maintained in separate JSON files.

Instead of creating one JSON file per test case, we organize payloads using an **object of objects**.

Structure:

```json
{
    "createBooking_TC01": {
        "firstname": "Prince",
        "lastname": "Pandey",
        "totalprice": 500
    },

    "createBooking_TC02": {
        "firstname": "John",
        "lastname": "Smith",
        "totalprice": 700
    }
}
```

If a test case requires multiple payloads (for example, API Chaining or multiple requests), then the value is stored as an **array of payload objects**.

Example:

```json
{
    "bookingFlow_TC01": [
        {
            "firstname": "Prince"
        },
        {
            "firstname": "Updated Prince"
        }
    ]
}
```

So the structure becomes:

```text
{
    testcaseName : { payload }

    testcaseName : [
        payload1,
        payload2,
        payload3
    ]
}
```

---

# How We Use It

We simply import the JSON file into the spec.

```ts
import bookingPayload from '../test-data/bookingPayload.json';
```

When imported, Playwright/TypeScript converts the JSON into a normal JavaScript object.

Then we can access payloads using the test case name.

Example:

```ts
const payload = bookingPayload.createBooking_TC01;
```

or

```ts
const payload = bookingPayload.bookingFlow_TC01[0];
```

---

# Dynamic Payload Modification

One of the biggest advantages of importing JSON is that it becomes a JavaScript object.

So before sending the request, we can modify any field dynamically.

Example

```ts
const payload = bookingPayload.createBooking_TC01;

payload.firstname = 'Rahul';

payload.totalprice = 1500;

await request.post('/booking', {
    data: payload
});
```

No need to modify the JSON file itself.

Only the JavaScript object in memory is updated.

---

# Why This Approach?

Benefits:

- Test data remains separate from test logic.
- Cleaner test scripts.
- Easy to maintain.
- Easy to reuse payloads.
- Supports multiple payloads for API chaining.
- Easy to update fields dynamically.
- New test cases only require adding another key in the JSON.

---

# Serialization vs Deserialization

## Serialization

Converting a JavaScript object into a JSON string.

Example

```ts
const json = JSON.stringify(payload);
```

Object

↓

JSON String

---

## Deserialization

Converting a JSON string into a JavaScript object.

Example

```ts
const obj = JSON.parse(jsonString);
```

JSON String

↓

JavaScript Object

> **Note:** When importing a `.json` file in TypeScript, Playwright automatically gives you a JavaScript object, so you usually don't need to call `JSON.parse()`.

---

# What is POJO?

POJO stands for **Plain Old JavaScript Object** (or Plain Old Java Object in Java).

Example

```ts
const booking = {
    firstname: 'Prince',
    lastname: 'Pandey'
};
```

A POJO is simply an object containing data without any special methods or framework-specific behavior.

---

# Builder Pattern (High-Level)

Instead of manually constructing payloads every time:

```ts
const payload = {
    firstname: "Prince",
    lastname: "Pandey",
    totalprice: 500
};
```

we can create them using a Builder.

Example:

```ts
const payload = BookingBuilder
                    .withFirstName("Prince")
                    .withLastName("Pandey")
                    .withPrice(500)
                    .build();
```

This improves:

- Readability
- Reusability
- Flexibility

(Builder Pattern will be discussed in detail separately.)

---

# Interview Questions & Answers

---

## Q1. How do you maintain request payloads in your project?

### Answer

In our project, request payloads are maintained in separate JSON files.

Each JSON file contains an object where:

- The **key** is the test case name.
- The **value** is either:
  - a single payload object, or
  - an array of payload objects if multiple requests are needed.

This allows us to organize all payloads related to an API in a single file while keeping test scripts clean and maintainable.

---

## Q2. How do you read payloads from a JSON file?

### Answer

We simply import the JSON file into the spec.

Example:

```ts
import bookingPayload from '../test-data/bookingPayload.json';
```

Once imported, it becomes a JavaScript object.

Then we access the required payload using its key.

Example:

```ts
const payload = bookingPayload.createBooking_TC01;
```

---

## Q3. What if you need to modify the payload dynamically?

### Answer

Since the imported JSON becomes a JavaScript object, we can modify any field before sending the request.

Example:

```ts
const payload = bookingPayload.createBooking_TC01;

payload.firstname = "Rahul";

payload.totalprice = 1200;

await request.post('/booking', {
    data: payload
});
```

Only the in-memory JavaScript object is modified; the original JSON file remains unchanged.

---

## Q4. Why do you keep payloads in JSON files instead of hardcoding them?

### Answer

Keeping payloads in JSON files provides several benefits:

- Separation of test data from test logic.
- Easier maintenance.
- Better readability.
- Reusability across multiple tests.
- Supports data-driven testing.
- Simplifies updating payloads without modifying test scripts.

---

## Q5. What is Serialization?

### Answer

Serialization is the process of converting a JavaScript object into a JSON string before it is transmitted or stored.

Example:

```ts
const jsonString = JSON.stringify(payload);
```

---

## Q6. What is Deserialization?

### Answer

Deserialization is the process of converting a JSON string back into a JavaScript object.

Example:

```ts
const payload = JSON.parse(jsonString);
```

When importing JSON files in Playwright, deserialization is handled automatically.

---

## Q7. What is a POJO?

### Answer

A POJO (Plain Old JavaScript Object) is a simple object used to store data.

Example:

```ts
const booking = {
    firstname: "Prince",
    lastname: "Pandey"
};
```

It contains only data and does not depend on any framework or special APIs.

---

## Q8. Have you used the Builder Pattern?

### Answer

Yes. We use the Builder Pattern while creating our reusable API Client. It helps us construct request configurations and payloads in a readable, fluent, and maintainable way. Instead of creating large objects manually, we build them step by step using chained methods.

---

## ⭐ Interview Tip

If the interviewer asks:

> **"How do you manage request payloads in your project?"**

A strong practical answer is:

> *"We maintain request payloads in JSON files. Each file contains an object where the key is the test case name and the value is either a single payload object or an array of payloads when multiple requests are required. We import the JSON into our spec, which gives us a JavaScript object. If any field needs to change for a specific test, we update the JavaScript object in memory and send it as the request payload, keeping the original JSON file unchanged."*

This answer reflects a scalable, real-world framework approach rather than a simple example.
