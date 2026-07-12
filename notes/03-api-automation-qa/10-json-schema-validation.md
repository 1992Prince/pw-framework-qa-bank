# Concept 9 - JSON Schema Validation

---

# 📌 Concept (Revision)

## What is JSON Schema Validation?

- JSON Schema Validation is the process of validating the **structure** of an API response against a predefined JSON schema.
- Instead of validating individual fields one by one, we validate the complete response structure.
- The schema defines:
  - Required fields
  - Data types
  - Object structure
  - Array structure
  - Nested objects
- If the response structure changes unexpectedly, schema validation immediately fails.

---

## Why Do We Need Schema Validation?

Suppose the API response is:

```json
{
    "id": 1,
    "name": "Laptop",
    "price": 50000
}
```

Tomorrow, due to a backend change:

```json
{
    "id": "1",
    "productName": "Laptop"
}
```

Problems:

- `name` changed to `productName`
- `price` is missing
- `id` changed from number to string

Even if the API still returns **200 OK**, the response contract has changed.

Schema Validation catches these issues immediately.

---

# Why Not Validate Every Field Manually?

Instead of writing:

```ts
expect(response.id).toBeDefined();

expect(response.name).toBeDefined();

expect(typeof response.id).toBe("number");

expect(response.price).toBeDefined();

...
```

we simply validate the response against a predefined schema.

This makes validation:

- Cleaner
- Reusable
- Easy to maintain
- More comprehensive

---

# Our Project Approach ⭐⭐⭐⭐⭐

In our framework, every API response schema is maintained separately under a dedicated folder.

Example structure:

```text
resources/

    response-schemas/

        GET_PRODUCTS_RESP_SCHEMA.json

        CREATE_PRODUCT_RESP_SCHEMA.json

        UPDATE_PRODUCT_RESP_SCHEMA.json
```

Instead of writing schema validation logic in every test, we created a reusable utility.

---

# Schema Validator Utility

We use the **AJV (Another JSON Validator)** library.

```ts
import Ajv from 'ajv';

const ajv = new Ajv();

export function validateSchema(schema: object, response: object) {

    const validate = ajv.compile(schema);

    const valid = validate(response);

    if (!valid) {

        throw new Error(
            JSON.stringify(validate.errors, null, 2)
        );

    }

}
```

This utility:

- Compiles the schema.
- Validates the response.
- Throws an error if validation fails.
- Displays all schema validation errors.

This utility is reused across all API tests.

---

# How We Use It In Tests

We import the schema and call the reusable validator.

```ts
import { validateSchema } from '../../utils/schemaValidator';

import userSchema from '../../resources/response-schemas/GET_PRODUCTS_RESP_SCHEMA.json';

const responseBody = await response.json();

validateSchema(userSchema, responseBody);
```

That's all.

The validation utility internally handles the entire schema validation.

---

# Complete Example

```ts
import { test, APIResponse } from '@playwright/test';

import { validateSchema } from '../../utils/schemaValidator';

import userSchema from '../../resources/response-schemas/GET_PRODUCTS_RESP_SCHEMA.json';

test('Validate Schema', async ({ request }) => {

    const response: APIResponse = await request.get(
        'https://api.restful-api.dev/objects'
    );

    const responseBody = await response.json();

    validateSchema(userSchema, responseBody);

});
```

---

# Benefits of Schema Validation

- Validates complete response structure.
- Detects missing fields.
- Detects incorrect data types.
- Detects unexpected response changes.
- Reusable across multiple tests.
- Easier maintenance.
- Better API contract validation.

---

# Interview Questions & Answers

---

## Q1. What is JSON Schema Validation?

### Answer

JSON Schema Validation is the process of validating an API response against a predefined schema.

The schema defines the expected response structure, including required fields, data types, arrays, and nested objects.

If the response does not match the schema, the validation fails.

---

## Q2. Why do we perform Schema Validation?

### Answer

Schema Validation ensures that the API response follows the expected contract.

It helps detect:

- Missing fields
- Incorrect data types
- Unexpected response changes
- Backend contract violations

Even if an API returns **200 OK**, schema validation ensures the response structure is still correct.

---

## Q3. Why not validate each field manually?

### Answer

Manual validation requires writing multiple assertions for every field.

Schema Validation is more efficient because a single validation verifies the complete response structure.

It is also reusable and much easier to maintain when the response contains many fields.

---

## Q4. Which library do you use for Schema Validation?

### Answer

In our project, we use **AJV (Another JSON Validator)**.

AJV compiles the JSON schema and validates the API response against it.

If the validation fails, it provides detailed information about the fields that do not match the schema.

---

## Q5. How do you perform Schema Validation in your project?

### Answer

In our project, response schemas are stored in a separate folder under:

```text
resources/response-schemas/
```

We created a reusable utility called `validateSchema()` using the AJV library.

Whenever we receive an API response, we:

1. Parse the response body.
2. Import the corresponding schema.
3. Call the reusable validator.

Example:

```ts
const responseBody = await response.json();

validateSchema(userSchema, responseBody);
```

This approach keeps schema validation centralized and reusable across all API tests.

---

## Q6. What happens if schema validation fails?

### Answer

If the response does not match the schema, AJV returns validation errors.

Our reusable utility throws an exception containing all schema validation errors.

Example:

```ts
throw new Error(
    JSON.stringify(validate.errors, null, 2)
);
```

This immediately fails the test and clearly identifies which part of the response violated the schema.

---

## ⭐ Interview Tip

If the interviewer asks:

> **"How do you perform Schema Validation in your framework?"**

A strong answer is:

> *"We maintain all response schemas in a dedicated `response-schemas` folder. We use the AJV library and have built a reusable `validateSchema()` utility that compiles the schema and validates the response. Every API test simply imports the required schema and calls `validateSchema(schema, responseBody)`, making the validation centralized, reusable, and easy to maintain."*
