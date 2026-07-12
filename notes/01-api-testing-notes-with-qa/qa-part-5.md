
# API-QA-SHEET-5

---

# Q39. How would you use AI in API Testing?

AI can improve API testing by reducing manual effort and increasing productivity.

Some practical use cases are:

- Generate test data
- Generate positive and negative test cases
- Suggest edge cases
- Generate API automation code
- Summarize application logs
- Analyze failed test executions
- Detect anomalies in API responses
- Help generate API documentation
- Explain complex API errors

### Project Example

In my project, I mainly use AI for:

- Test data generation
- API test case suggestions
- Log summarization
- Root cause analysis
- Explaining failed API responses

---

# Q40. What is Shift-Left Testing? Have you practiced it?

Shift-Left Testing means moving testing activities as early as possible in the Software Development Life Cycle instead of waiting until development is completed.

Instead of waiting for the frontend, we start testing as soon as APIs or contracts are available.

This helps detect bugs early, reduces fixing costs, and speeds up releases.

In our project, once the API contract (Swagger/OpenAPI) is ready, we start writing API test cases and automation even before the frontend is completed.

This allows developers to fix issues early and avoids duplicate testing later.

### Benefits

- Early bug detection
- Faster releases
- Better quality
- Less rework
- Reduced testing effort

---

# Q41. What is Caching in API Testing?

- Caching means **temporarily storing API responses** so that repeated requests can be served quickly without querying the database every time.
- Instead of hitting the database for every request, the application first checks whether the requested data is available in the cache.
- Not every API response is cached. The server decides what can be cached by sending cache-related headers such as **Cache-Control**, **Expires**, or **ETag**, which define whether the response can be cached and for how long.
- If the data is available in the cache, it is returned immediately. Otherwise, the application fetches it from the database, returns the response, and stores it in the cache for future requests.

### Example

Suppose during an Amazon sale, thousands of users search for the same mobile phone.

- The first request fetches the product details from the database.
- The response is then stored in a cache (for example, a CDN or Redis).
- When the next users search for the same mobile, the application serves the response directly from the cache instead of querying the database again.
- This significantly reduces database load and improves response time.

### Common Types of Cache

- **CDN Cache** – Stores static content closer to users.
- **API Gateway Cache** – Caches complete API responses.
- **Redis Cache** – Application-level in-memory key-value cache with TTL (Time To Live).

### Benefits

- Faster API response time
- Reduced database load
- Better application performance
- Improved scalability
- Better user experience
---

# Q42. What do you test in Caching?

In my current project, we don't have caching implemented, or services wch I am testing haven't so I haven't performed cache testing in lower envs. However, if caching is available, this is the approach I would follow.

As an SDET, I mainly validate **Cache Miss** and **Cache Hit** scenarios.

## 1. Cache Miss

This happens when the requested data is **not available in the cache**.

Flow:
- Client sends the request.
- Cache is checked.
- Data is not found in the cache.
- Application fetches the data from the database.
- Response is returned to the client.
- The response is stored in the cache for future requests.

**Expected Result:**
- Response is correct.
- Database is accessed.
- Response time is relatively slower than a cache hit.

---

## 2. Cache Hit

This happens when the same request is sent again and the data is already available in the cache.

Flow:
- Client sends the same request.
- Cache is checked.
- Data is found in the cache.
- Response is returned directly from the cache.
- Database is not accessed.

**Expected Result:**
- Response matches the original response.
- Database is not queried.
- Response time is significantly faster.

---

## Other Cache Validations (Good to Mention)

- Verify cache expires correctly after the configured **TTL (Time To Live)**.
- Verify updated data is reflected after cache invalidation.
- Verify sensitive or user-specific data is not cached incorrectly.
- Verify cache headers such as **Cache-Control**, **Expires**, and **ETag** are returned correctly.
- Compare response times between Cache Miss and Cache Hit scenarios.

---

# Q43. What is HTTP 429? How do you simulate it?

HTTP **429 Too Many Requests** means the client has exceeded the allowed request rate.

It is a rate-limiting mechanism used to prevent abuse and protect the server.

### How to Simulate

Send the same API request repeatedly in a loop.

Example

```text
for (1000 times)

↓

GET /offers
```

After exceeding the configured rate limit,

↓

Server returns

```text
429 Too Many Requests
```

### What I Validate

- Correct status code (429)
- Retry-After header (if available)
- API blocks excessive requests
- Requests succeed again after waiting

---

# Q44. What's the first thing you check before running Backend Automation?

The first thing I check is whether the backend service is healthy and available.

There's no point running the automation suite if the service itself is down.

Usually I call a Health API using a simple **GET** or **HEAD** request.

Example

```http
GET /health
```

or

```http
HEAD /health
```

If the service returns

```text
200 OK
```

then I start executing the automation suite.

If the service is unavailable,

I first inform the DevOps or development team before running the tests.

---

# Q45. What is GraphQL?

GraphQL is a **query language for APIs** that allows the client to request exactly the data it needs.

Unlike REST, where multiple endpoints may be required, GraphQL usually exposes a single endpoint and returns only the requested fields.

This reduces unnecessary data transfer and minimizes multiple API calls.

### Main Components

- Schema
- Types
- Queries (Read Data)
- Mutations (Create/Update/Delete)
- Resolvers

### REST vs GraphQL

REST

```http
GET /customer

GET /offers

GET /billing
```

Multiple API calls.

---

GraphQL

```graphql
{
 customer{
   name
   offers
   billing
 }
}
```

Single API call.

### Project Usage

Our Telecom project currently uses **REST APIs**.

GraphQL is generally used in applications where the UI needs data from multiple services in a single request, such as dashboards or mobile applications.
