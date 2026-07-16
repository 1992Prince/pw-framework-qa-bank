# Rules for Coming Up with Test Scenarios

Whenever an interviewer asks **"How will you test Feature X?"**, think in these 6 buckets:

1. Functional (Happy Path + Business Rules)
2. Negative / Edge Cases (Invalid input, Boundary values)
3. Integration (Dependent systems/APIs)
4. Compatibility (Browser / Device / OS)
5. Non-Functional (Performance, Security, Load)
6. Data Related (DB consistency, State persistence)

---

# First Ask Yourself

- What is this feature supposed to do?
- Who uses this feature?
- What is the expected outcome?

---

# Write Test Cases for Login Feature

## Understanding

Login allows customers to authenticate themselves and access the application.

### 1. Functional

- Customer should be able to login with valid credentials.
- After successful login, customer should be navigated to the Home/Dashboard page.
- Customer should be able to logout successfully and should be redirected back to the Login page.

### 2. Negative / Edge Cases

- Customer should not be able to login with invalid credentials and a proper error message should be displayed.
- Empty Username/Password should display validation messages.
- Multiple failed login attempts should lock the account (as per business rule).

### 3. Integration

- If application supports SSO, user should be redirected to the SSO page for authentication.
- Clicking Login should trigger the Authentication API.

### 4. Data Related

- Login session/token should be stored correctly.
- Logout should invalidate the session.

---

# Write Test Cases for Add to Cart Feature

## Understanding

Add to Cart allows customers to select products before checkout.

### 1. Functional

- Customer should be able to add products successfully.
- "Add To Cart" button should update with product count.
- Cart count should update correctly.
- Customer should be able to increase/decrease quantity.
- Customer should be able to remove products from the cart.
- Same product should not appear multiple times (as per business rule).

### 2. Negative / Edge Cases

- Product not added should continue showing "Add To Cart".
- Quantity should never become negative.
- Out-of-stock products should not be added.

### 3. Integration

- Inventory Service should return correct product availability.
- Pricing Service should return correct product price.

---

# Write Test Cases for Search Feature

## Understanding

Search helps customers find products quickly.

### 1. Functional

- Search with valid keyword should display matching products.
- Partial keyword should display matching suggestions.
- Exact keyword should display the exact product.
- Filters and Sorting should work correctly.

### 2. Negative / Edge Cases

- Empty search should display validation or default behavior.
- Search with special characters should be handled properly.
- No matching product should display "No Results Found".

### 3. Integration

- Search Service/API should be triggered after clicking Search.
- Product Catalog service should return matching products.

# Write Test Cases for Checkout Feature

## Understanding

Checkout is the final step where customers review the order, provide shipping details and complete the purchase.

### 1. Functional

- Customer should be able to proceed to Checkout from Cart.
- Customer should be able to enter/select Shipping Address.
- Customer should be able to select Shipping Method.
- Order Summary should display correct products and total amount.
- For Cash on Delivery, clicking Place Order should successfully create the order.

### 2. Negative / Edge Cases

- Mandatory fields should show validation messages.
- Invalid address should not be accepted.
- Checkout should not proceed with an empty cart.
- Product becoming out of stock during checkout should display an appropriate message.

### 3. Integration

- Cart Service should provide the latest Order Summary.
- Payment Gateway should open for Online Payment methods.
- Inventory Service should verify product availability before placing the order.

# Write Test Cases for Profile Feature

## Understanding

Profile allows customers to view and manage their personal information.

### 1. Functional

- Customer should be able to view profile details.
- Customer should be able to update profile information.
- Customer should be able to change password.
- Customer should be able to upload/change profile picture.

### 2. Negative / Edge Cases

- Invalid email/mobile should display validation.
- Unsupported image format should not be uploaded.
- Large image size should display an error.

### 3. Integration

- User Profile Service should update customer details.
- File Storage Service should upload profile images successfully.
- Notification Service should send confirmation after profile update.

# Q1. How will you test the Payment Gateway?

**Understanding the feature**

Payment Gateway allows customers to purchase their order successfully. So the user of this feature is the **Customer**.

To answer this, I'll cover it using 6 testing rules.

---

## 1. Functional (Happy Path + Business Rules)

- Customer should be able to complete payment using all payment methods (Card, UPI, Wallet, Net Banking).
- Correct amount should be deducted.
- Successful payment message with Transaction ID should be displayed.
- Order confirmation (Email/SMS) should be sent.
- Payment should not be processed twice on multiple clicks.

## 2. Negative / Edge Cases

Customer should **NOT** be able to complete payment in the below situations, and a proper user-friendly error message should be displayed.

- Invalid card/UPI details.
- Expired card.
- Wrong CVV/OTP.
- Insufficient balance.
- User cancels payment.
- Network failure during payment.
- Payment timeout.

## 3. Non-Functional

- Payment should complete within acceptable response time.
- Card/UPI details should be encrypted (HTTPS).
- System should support multiple users making payments simultaneously.

## 4. Integration

Now let's verify the integration with dependent systems.

- Verify Payment Gateway communicates correctly with Bank/UPI APIs.
- Verify Order status updates after successful/failed payment.
- Verify Inventory updates after successful payment.
- Verify Refund API works correctly.

## 5. Data Related

Now let's verify the data consistency.

- Payment transaction should be stored correctly in DB.
- Order status and Payment status should remain consistent.
- Failed payment should not create a successful order.
- Duplicate transactions should not be created.

## 6. Compatibility (UI)

- Verify on Chrome, Firefox, Edge, Safari.
- Verify on Desktop, Mobile and Tablet.
- Verify payment page is responsive.

---

## Interview Closing Line

**"These are the major scenarios I would cover for Payment Gateway. If required, each scenario can further be broken down into multiple detailed test cases."**
