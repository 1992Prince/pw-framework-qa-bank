
# Postman Notes for API Testing

## What is Postman?

**Postman** is an API development and testing tool that enables developers and testers to create, test, debug, and automate API requests.

### Other Popular API Testing Tools

* **Postman**
* **Bruno**
* **Hoppscotch**
* Insomnia
* Swagger UI (for API documentation/testing)

---

# 1. What is a Workspace in Postman?

A **Workspace** is a collaborative area where you and your team can organize and manage API-related resources.

Within a workspace, you can share:

* APIs
* Collections
* Environments
* Mock Servers
* Monitors
* Documentation

## Types of Workspaces

| Workspace Type | Description                                          |
| -------------- | ---------------------------------------------------- |
| Internal       | Accessible only to members of your organization/team |
| Partner        | Shared with invited external partners                |
| Public         | Accessible publicly by anyone                        |

---

## How to Create a Workspace

### Step 1

Open Postman

### Step 2

Navigate to:

```
File
   ↓
New
   ↓
Workspace
```

### Step 3

Provide:

* Workspace Name
* Description (Optional)
* Workspace Type

  * Internal
  * Partner
  * Public

### Step 4

(Optional)

Invite team members.

### Step 5

Click **Create Workspace**.

---

## Real-Time Project Usage

In most organizations, testers **do not create workspaces manually**.

Instead,

* Open Postman (or Hoppscotch)
* Import the collection JSON shared by the Development team

That imported collection usually contains:

* API endpoints
* Folder structure
* Environment variables
* Authentication details
* Test scripts
* Pre-request scripts

Everything gets imported into your **default workspace**.

---

# 2. What is a Collection in Postman?

A **Collection** is simply a **group of API requests**.

It helps organize all APIs belonging to a project in one place.

Think of it like a project folder.

---

## Example Collection Structure

```
E-Commerce Project

│
├── Authentication
│      ├── Login
│      ├── Logout
│      ├── Refresh Token
│
├── Users
│      ├── Get User
│      ├── Create User
│      ├── Update User
│      ├── Delete User
│
├── Products
│      ├── Get Products
│      ├── Add Product
│      ├── Update Product
│
├── Orders
│      ├── Create Order
│      ├── Cancel Order
│      ├── Track Order
```

---

## Why Collections?

Collections help in:

* Organizing APIs
* Sharing APIs
* Running E2E scenarios
* Version management
* Automation
* Documentation

---

## How Collections are Managed in Projects

Usually,

* One collection is maintained per product/project.
* Developers update the collection whenever APIs change.
* Updated collection is shared with QA team.
* Release notes are also updated in Confluence.

---

## Exporting a Collection

After creating a collection,

Click

```
Collection
      ↓
Three Dots (...)
      ↓
Export
      ↓
Collection v2.1 (JSON)
```

This JSON file can be shared with other developers or testers.

---

# 3. What are Environments in Postman?

An **Environment** is a collection of variables used while executing APIs.

Instead of hardcoding values, Postman allows variables.

Example:

```
Base URL

QA
https://qa.company.com

STG
https://stg.company.com

PROD
https://prod.company.com
```

Instead of changing every API URL, use:

```text
{{baseUrl}}
```

---

## Benefits of Environments

* Easy switching between QA/STG/PROD
* No need to modify every request
* Reusable variables
* Better maintainability

---

# Variable Scopes in Postman

Variables exist at different scopes.

| Scope       | Visibility                            |
| ----------- | ------------------------------------- |
| Global      | Available everywhere                  |
| Collection  | Available inside a collection         |
| Environment | Available inside selected environment |
| Local/Data  | Available only during execution       |

---

# 4. How to Create Environment Variables

## Step 1

Click

```
Environments
```

(on the left panel)

---

## Step 2

Click

```
+
```

to create a new environment.

---

## Step 3

Provide Environment Name

Example

```
QA_PROJECT

STG_PROJECT

E2E_PROJECT
```

---

## Step 4

Add variables.

Example

| Variable   | Value                                           |
| ---------- | ----------------------------------------------- |
| baseUrl    | [https://qa.company.com](https://qa.company.com) |
| token      | (set dynamically)                               |
| order_id   | (set dynamically)                               |
| customerId | (set dynamically)                               |

---

## Step 5

Save Environment.

---

## Step 6

From the top-right environment dropdown,

Select

* QA
* STG
* PROD
* E2E

depending on where you want to execute APIs.

---

# Using Environment Variables

Example endpoint

Instead of

```text
https://qa.company.com/api/orders
```

Use

```text
{{baseUrl}}/api/orders
```

Example Header

```text
Authorization

Bearer {{token}}
```

Example Body

```json
{
    "orderId":"{{order_id}}"
}
```

---

# Collection Variables

Collection variables are only available inside a specific collection.

## How to Create

```
Collection
      ↓
Variables Tab
      ↓
Add Variable
      ↓
Save
```

Example

| Variable   | Value |
| ---------- | ----- |
| productId  | 10    |
| customerId | 100   |

These variables cannot be accessed outside that collection.

---

# Setting Variables Using Scripts

Variables can be created or updated dynamically using JavaScript.

## Set Environment Variable

```javascript
pm.environment.set("token", response.token);
```

---

## Get Environment Variable

```javascript
const token = pm.environment.get("token");
```

---

## Set Collection Variable

```javascript
pm.collectionVariables.set("order_id", "12345");
```

---

## Get Collection Variable

```javascript
const orderId = pm.collectionVariables.get("order_id");
```

---

## Set Global Variable

```javascript
pm.globals.set("baseUrl", "https://qa.company.com");
```

---

## Get Global Variable

```javascript
pm.globals.get("baseUrl");
```

---

# Other Variable Types

| Variable Type | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| Global        | Accessible everywhere                                              |
| Collection    | Collection specific                                                |
| Environment   | Environment specific (QA/STG/PROD)                                 |
| Local         | Only inside current request execution                              |
| Data          | Used while running Collection Runner/Newman with CSV or JSON files |

---

# Execution Order of a Request in Postman

Every request follows this sequence:

```text
Pre-request Script
        ↓
API Request Sent
        ↓
Response Received
        ↓
Test/Post-response Script
```

Or visually:

```
┌─────────────────────┐
│ Pre-request Script  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Send API Request    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Receive Response    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Tests Script        │
└─────────────────────┘
```

---

# What is the `pm` Object?

The **`pm` object** (Postman Object) is the primary JavaScript API provided by Postman to interact with requests, responses, variables, and test execution.

It allows you to:

* Read request information
* Read response data
* Set/get variables
* Write assertions
* Chain requests
* Store dynamic values
* Access headers, cookies, and body

---

## Commonly Used `pm` Objects

| Object                     | Purpose                        |
| -------------------------- | ------------------------------ |
| `pm.request`             | Current request information    |
| `pm.response`            | Response details               |
| `pm.environment`         | Environment variables          |
| `pm.collectionVariables` | Collection variables           |
| `pm.globals`             | Global variables               |
| `pm.variables`           | Access variables across scopes |
| `pm.test()`              | Write test cases               |
| `pm.expect()`            | Assertions (Chai library)      |
| `pm.sendRequest()`       | Trigger another API request    |
| `pm.cookies`             | Read cookies                   |

---

## Example

### Save Token

```javascript
let json = pm.response.json();

pm.environment.set("token", json.token);
```

---

### Validate Status Code

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});
```

---

### Validate Response Time

```javascript
pm.test("Response time is less than 2 seconds", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});
```

---

## 📝 Important Interview Notes

* A **Workspace** is used for collaboration.
* A **Collection** is a group of related API requests.
* An **Environment** stores reusable variables like `baseUrl` and `token`.
* Variables can be created at **Global**, **Collection**, **Environment**, **Local**, or **Data** scope.
* Use `{{variableName}}` to reference variables in URLs, headers, or request bodies.
* The **execution order** is: **Pre-request Script → API Request → Response → Tests Script**.
* The **`pm` object** is Postman's JavaScript API used to read/write variables, inspect requests and responses, and perform assertions.
* In most organizations, QA teams typically **import collections and environments** shared by developers rather than creating them from scratch.
