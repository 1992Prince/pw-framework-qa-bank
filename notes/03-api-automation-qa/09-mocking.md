# Concept 8 - Mocking in Playwright

---

# 📌 Concept (Revision)

## What is Mocking?

Mocking is the process of **returning a fake response instead of calling the real server**.

Instead of sending the request to the actual backend service, Playwright intercepts the request and returns a response created by us.

This allows us to test our application's behavior without depending on external services.

---

## Why Do We Need Mocking?

In real-world applications, not every dependency belongs to our application.

For example, consider the following E2E flow:

```text
Login

↓

Add Product

↓

Checkout

↓

Payment

↓

Order Confirmation
```

The **Payment Gateway** (Visa, Mastercard, Razorpay, Stripe, etc.) is usually a **third-party service**.

Problems:

- Lower environments may not have access to third-party services.
- Third-party APIs may be unstable or unavailable.
- They may charge money.
- They may return inconsistent data.
- Their functionality is outside our testing scope.

Our responsibility is **not** to test the payment provider.

Our responsibility is to validate that **our application correctly handles the payment response**.

For example:

- User clicks **Pay**
- `/payment` endpoint is called
- Transaction ID is returned
- Transaction ID is displayed on UI
- Same Transaction ID is sent in confirmation email

Instead of calling the real payment gateway, we simply mock the `/payment` API and return a predefined transaction ID.

---

# Types of Mocking

There are mainly two types:

## 1. API Mocking

Intercept an API request and return a fake or modified response.

Used when:

- Backend API is unavailable
- Third-party API is unavailable
- Want predictable test data
- Want to isolate frontend testing

---

## 2. UI Mocking

Sometimes the frontend UI is ready before the backend changes are deployed.

Example:

- Home Page has a new label.
- Backend is not yet deployed to QA.
- We mock the API response by adding the new label.
- UI automation can be completed before deployment.

Once the backend is available, simply remove the mocking code.

No other test changes are required.

---

# How Does Playwright Support Mocking?

Playwright provides three important methods.

| Method              | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `page.route()`    | Intercepts a matching network request             |
| `route.fulfill()` | Returns a completely mocked response              |
| `route.fetch()`   | Fetches the original response before modifying it |

---

# Example 1 - Completely Mock an API Response

```ts
const mockedResponse = [

    { id: 101, name: "Mock User 1" },

    { id: 102, name: "Mock User 2" }

];

await page.route("**/api/v1/users", async route => {

    await route.fulfill({

        status: 200,

        contentType: "application/json",

        body: JSON.stringify(mockedResponse)

    });

});
```

### What happens here?

- Browser requests `/api/v1/users`
- Playwright intercepts the request
- Real backend is never called
- Mocked response is returned
- UI displays mocked users

---

# Example 2 - Modify Existing Response

Sometimes we don't want to replace the complete response.

Instead, we want to modify only a small part.

Playwright allows us to fetch the original response first.

```ts
await page.route("**/api/v1/fruits", async route => {

    const response = await route.fetch();

    const json = await response.json();

    json.push({

        id: 100,

        name: "Loquat"

    });

    await route.fulfill({

        response,

        json

    });

});
```

### What happens here?

- Original API is called.
- Original response is received.
- New object is added.
- Modified response is returned.
- UI automatically displays the additional item.

---

# Real Project Scenario 1 - Payment API Mocking ⭐⭐⭐⭐⭐

Suppose we are testing:

```text
Select Product

↓

Checkout

↓

Click Pay

↓

Payment API

↓

Transaction Successful

↓

Confirmation Email
```

The `/payment` API belongs to a third-party provider.

Instead of calling the real payment gateway, we mock it.

Example mocked response:

```json
{
    "status": "SUCCESS",
    "transactionId": "TXN123456"
}
```

Then we validate:

- Payment Successful message
- Transaction ID shown on UI
- Same Transaction ID present in confirmation email

Our objective is **not to validate the payment gateway**.

Our objective is to validate **how our application processes the payment response**.

---

# Real Project Scenario 2 - Upcoming UI Feature ⭐⭐⭐⭐⭐

Suppose a new label needs to appear on the Home Page.

Backend deployment is still pending.

Approach:

1. Intercept the API.
2. Fetch the original response.
3. Add the new label.
4. Return the modified response.
5. Validate that the label appears on the UI.

Once the backend is deployed, simply remove the mocking logic.

The remaining test remains unchanged.

---

# Benefits of Mocking

- Faster execution
- Stable tests
- No dependency on external services
- Supports testing before backend deployment
- Predictable responses
- Easier negative testing
- Ideal for third-party integrations

---

# Interview Questions & Answers

---

## Q1. What is Mocking?

### Answer

Mocking is the process of intercepting an API request and returning a fake or modified response instead of calling the real server.

It allows us to test application behavior without depending on actual backend services.

---

## Q2. Why do we use Mocking?

### Answer

We use mocking to remove dependencies on external systems.

Typical use cases include:

- Third-party APIs
- Unavailable lower environments
- Upcoming backend features
- Stable and predictable test data
- Faster execution

Mocking allows us to validate our application's behavior without relying on external services.

---

## Q3. How do you perform API Mocking in Playwright?

### Answer

Playwright provides the `page.route()` API to intercept requests.

We then use `route.fulfill()` to return a custom response.

Example:

```ts
await page.route("**/payment", async route => {

    await route.fulfill({

        status: 200,

        body: JSON.stringify({

            transactionId: "TXN123",

            status: "SUCCESS"

        })

    });

});
```

---

## Q4. What is the difference between `route.fulfill()` and `route.fetch()`?

### Answer

| route.fulfill()                           | route.fetch()                                   |
| ----------------------------------------- | ----------------------------------------------- |
| Returns a completely mocked response      | Fetches the real backend response               |
| Backend is never called                   | Backend is called                               |
| Used when replacing the complete response | Used when modifying only a part of the response |

---

## Q5. Explain a real project scenario where you used Mocking.

### Answer

In our project, we mocked the third-party payment API.

The payment gateway was not available in lower environments, so instead of calling the real `/payment` endpoint, we intercepted the request and returned a predefined transaction ID.

Then we validated that:

- Payment Success message was displayed.
- Transaction ID was shown on the confirmation page.
- The same Transaction ID was sent in the confirmation email.

Since the payment gateway itself is a third-party system, our responsibility was not to test its functionality but to verify that our application handled the response correctly.

---

## Q6. Have you used UI Mocking?

### Answer

Yes.

We used UI mocking when frontend changes were pending backend deployment.

For example, a new label had to appear on the Home Page.

We intercepted the API response, added the new label using `route.fetch()` and `route.fulfill()`, and verified that the UI rendered the new label correctly.

Once the backend deployment was completed, we simply removed the mocking logic without changing the rest of the test.

---

## Q7. How would you test third-party integrations?

### Answer

For third-party integrations such as payment gateways, I generally use API mocking.

Instead of depending on the actual third-party service, I mock the expected success or failure response and validate how my application processes that response—for example, displaying the transaction ID, updating the order status, or sending a confirmation email.

---

## ⭐ Interview Tip

If the interviewer asks:

> **"Why do you mock third-party APIs instead of testing the real API?"**

A strong answer is:

> *"Third-party services are outside our testing scope and may not be available in lower environments. Our objective is not to validate the third-party system itself but to verify that our application correctly handles the response it receives. Mocking makes tests faster, more stable, and independent of external systems."*
