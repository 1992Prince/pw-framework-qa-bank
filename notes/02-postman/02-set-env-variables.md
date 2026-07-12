# Setting Variables in Postman (Post-response Script)

Suppose the response of an API is:

```json
{
    "ID": "asap"
}
```

Now you want to save the value of `ID` so that it can be reused in subsequent API requests.

---

## 1. Set an Environment Variable

Use the following script in the **Tests (Post-response Script)** tab.

```javascript
// Convert response body into JavaScript object
const response = pm.response.json();

// Store response ID into an Environment variable
pm.environment.set("id", response.ID);
```

You can use this variable anywhere in Postman as:

```text
{{id}}
```

Example:

```
GET {{baseUrl}}/books/{{id}}
```

---

## 2. Set a Collection Variable

```javascript
// Convert response body into JavaScript object
const response = pm.response.json();

// Store response ID into a Collection variable
pm.collectionVariables.set("id", response.ID);
```

Use it as:

```text
{{id}}
```

---

## 3. Set a Global Variable

```javascript
// Convert response body into JavaScript object
const response = pm.response.json();

// Store response ID into a Global variable
pm.globals.set("id", response.ID);
```

Use it as:

```text
{{id}}
```

---

# Where Can Variables Be Used?

Variables can be used in:

- Endpoint URL

```text
{{baseUrl}}/books/{{id}}
```

- Headers

```text
Authorization: Bearer {{token}}
```

- Query Parameters

```text
?userId={{id}}
```

- Request Body

```json
{
    "bookId": "{{id}}"
}
```

- Pre-request Scripts
- Post-response (Tests) Scripts

---

# Difference Between Global, Environment, and Collection Variables

| Variable Type                  | Scope                                  | Best Used For                                                                          | Visibility                                                 |
| ------------------------------ | -------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Global Variable**      | Entire Workspace                       | Common values shared across all collections                                            | Available to every collection and request in the workspace |
| **Environment Variable** | Selected Environment (QA/STG/UAT/PROD) | Environment-specific values like`baseUrl`, `token`, database name, client ID, etc. | Available only when that environment is selected           |
| **Collection Variable**  | Specific Collection                    | Values used only within a particular project or collection                             | Accessible only inside that collection                     |

---

# Interview Answer

### What is the difference between Global, Environment, and Collection Variables?

**Global Variables**

- Available throughout the entire workspace.
- Can be accessed by all collections and requests.
- Used for values that are common across multiple projects.
- Example: Company name, common API version, common authentication value.

**Environment Variables**

- Available only for the currently selected environment.
- Used to switch easily between QA, UAT, STG, and PROD.
- Typical examples are:
  - `baseUrl`
  - `token`
  - `clientId`
  - `username`

**Collection Variables**

- Available only within a specific collection.
- Cannot be accessed by other collections.
- Used to store project-specific or E2E flow data.
- Example:
  - `orderId`
  - `customerId`
  - `bookId`

---

## 💡 Best Practice

- Use **Global Variables** only for values shared across multiple collections.
- Use **Environment Variables** for environment-specific configuration (QA/STG/PROD).
- Use **Collection Variables** for project-specific or E2E test data that should remain within a single collection.
