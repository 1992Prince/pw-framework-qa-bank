
# Concept 7 - API Chaining & API + UI Integration

---

# 📌 Concept (Revision)

## What is API Chaining?

- API Chaining is the process of using the response from one API request as the input for another API request.
- Typically, we extract a value (such as an ID or token) from one response and pass it to the next API.
- This simulates real-world business workflows where one operation depends on the output of another.
- API Chaining is commonly used for:
  - Creating test data
  - Updating created data
  - Deleting test data
  - End-to-End API workflows

---

## Typical API Chaining Flow

```text
Create Booking
      │
      ▼
Extract Booking ID
      │
      ▼
Update Booking
      │
      ▼
Get Booking
      │
      ▼
Delete Booking
      │
      ▼
Verify Booking Deleted
```

---

## Example - API Chaining

```ts
// Create Booking
const createResponse = await bookingClient.createBooking(payload);

const booking = await createResponse.json();

const bookingId = booking.bookingid;

// Update Booking
await bookingClient.updateBooking(bookingId, updatedPayload);

// Get Booking
const getResponse = await bookingClient.getBooking(bookingId);

// Delete Booking
await bookingClient.deleteBooking(bookingId);
```

---

## Why Do We Use API Chaining?

- APIs in real projects are dependent on each other.
- Avoid hardcoding IDs.
- Makes tests dynamic.
- Ensures test independence.
- Enables complete business workflow validation.

---

# Real Project Example

Suppose we are testing Employee Management.

Flow:

```text
Create Employee

↓

Extract Employee ID

↓

Assign Department

↓

Update Salary

↓

Delete Employee
```

Each API depends on the response of the previous API.

---

# API + UI Integration

---

## What is API + UI Testing?

API + UI testing combines API automation with UI automation in the same test.

Instead of creating test data manually through the UI, we first create it using APIs and then verify it through the UI.

This approach is much faster and more reliable.

---

## Why Combine API and UI?

Without APIs:

```text
Open Browser

↓

Login

↓

Navigate

↓

Fill Forms

↓

Submit

↓

Test Starts
```

This consumes a lot of time.

---

With APIs:

```text
Create Test Data using API

↓

Open Browser

↓

Login

↓

Directly Validate UI
```

Result:

- Faster execution
- Less flaky tests
- Less UI dependency
- Better reliability

---

# Example

Instead of creating a booking using UI:

```text
Fill 10 form fields

↓

Click Save
```

We simply:

```ts
const response = await bookingClient.createBooking(payload);

const bookingId = (await response.json()).bookingid;
```

Then open the UI and verify that the booking exists.

---

# Another Example

Suppose an application displays a newly created user.

Flow:

```text
API

↓

Create User

↓

Open UI

↓

Search User

↓

Validate User Details
```

---

# Test Data Cleanup

One major advantage of API + UI testing is easy cleanup.

Instead of deleting records manually through the UI,

simply call:

```ts
await bookingClient.deleteBooking(id);
```

This keeps environments clean.

---

# Benefits of API + UI Testing

- Faster execution
- Stable tests
- Easy test data creation
- Easy cleanup
- Less dependency on UI
- Better End-to-End validation

---

# Interview Questions & Answers

---

## Q1. What is API Chaining?

### Answer

API Chaining is the process of using data returned by one API request as input for another API request.

For example, after creating a booking, we extract the `bookingId` from the response and use it in subsequent Update, Get, or Delete requests.

---

## Q2. Why do we use API Chaining?

### Answer

We use API Chaining because:

- Business APIs are often dependent on each other.
- It eliminates hardcoded IDs.
- Makes tests dynamic.
- Supports end-to-end business workflows.
- Ensures test independence.

---

## Q3. Explain an API Chaining example from your project.

### Answer

A common example is the Booking flow:

1. Create Booking API
2. Extract the `bookingId`
3. Update the booking using the same ID
4. Retrieve the booking and validate the updated data
5. Delete the booking as part of test cleanup

Each API uses data returned by the previous API.

---

## Q4. What is API + UI Testing?

### Answer

API + UI testing combines API automation and UI automation in a single test.

Instead of creating test data through the UI, we use APIs to prepare the required data, then launch the application and validate it through the UI.

This approach significantly reduces execution time and improves test stability.

---

## Q5. Why do you create test data using APIs instead of UI?

### Answer

Creating test data using APIs is much faster and more reliable than using the UI.

Benefits include:

- Faster execution
- Less flaky tests
- Reduced dependency on UI
- Easier maintenance
- Ability to directly start UI validation without navigating multiple screens

---

## Q6. How do you validate UI using APIs?

### Answer

We first create or update the required data through an API.

Once the API call is successful, we launch the UI, navigate to the relevant page, and verify that the UI displays the same data returned by the API.

This ensures both the backend and frontend are working correctly.

---

## Q7. How do you clean up test data?

### Answer

After the test execution, we call the appropriate Delete API using the ID created during API Chaining.

For example:

```ts
await bookingClient.deleteBooking(bookingId);
```

This prevents unnecessary test data from accumulating in the environment and keeps tests independent.

---

## Q8. Can API Chaining be used without UI automation?

### Answer

Yes.

API Chaining is commonly used in pure API automation where multiple dependent APIs need to be executed in sequence.

API + UI is simply one practical use case of API Chaining in end-to-end testing.

---

## ⭐ Interview Tip

If the interviewer asks:

> **"How do you use APIs in your UI automation framework?"**

A strong answer is:

> *"We use APIs primarily for test data setup and cleanup. Before starting the UI flow, we create the required entities through APIs, extract identifiers such as IDs, and then launch the UI to validate the business functionality. After execution, we delete the created data through APIs. This makes our tests faster, more stable, and less dependent on UI operations."*

This is the approach followed in most modern Playwright automation frameworks.
