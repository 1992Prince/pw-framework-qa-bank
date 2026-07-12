
# API Testing Interview Prep — API Architecture, REST, Idempotency & Authentication

---

### 1) What is API documentation and what are its key components?

- API documentation is a set of technical instructions that explains how an API works.
- It tells us what endpoints are available, what HTTP methods they support, what input parameters are required, what response structure to expect, how authentication works, and what the error codes mean.
- Example: tools like Swagger and Confluence are commonly used in projects to host and maintain this documentation.

---

### 2) What is the difference between Monolithic and Microservices architecture?

- A monolithic architecture is a single, unified application where all modules like UI, business logic, and database access are tightly coupled and deployed together.
- A microservices architecture breaks the application into small, independent services, each responsible for a specific business capability, deployed and scaled independently.
- From a testing perspective, monolithic apps are usually tested end-to-end in one go, whereas microservices require testing each service independently along with contract and integration testing between services.
- Example: an e-commerce app built as microservices might have separate services for orders, payments, and inventory, each with its own API.

---

### 3) What are the different types of APIs?

- There are mainly four types of APIs.
- Open APIs, also called public APIs, are available for any external developer to use.
- Internal APIs, also called private APIs, are used only within an organization.
- Partner APIs are shared with specific business partners under agreements.
- Composite APIs combine multiple API calls into a single call to reduce round trips.
- Example: a payment gateway's public API used by external merchants is an Open API.

---

### 4) What is the difference between an API and a Web Service?

- A Web Service is a type of API that works over the internet using standard web protocols like HTTP or HTTPS.
- So all web services are APIs, but not all APIs are web services.
- Example: Apache POI is an API used to work with Excel files, and it doesn't need the internet or HTTP to function, so it's an API but not a web service.

---

### 5) What is REST, and what are the full forms of REST and SOAP?

- REST stands for Representational State Transfer.
- It's an architectural style with a set of constraints that developers follow while building services, rather than a strict protocol.
- SOAP stands for Simple Object Access Protocol, which is a stricter, XML-based messaging protocol compared to REST.
- Example: most modern APIs like `GET /v1/drivers/123` follow REST principles instead of SOAP.

---

### 15) How SOAP is different from REST? - Missing

### 6) What is the difference between REST and RESTful?

- REST is the architectural style itself, defined by a set of principles and constraints.
- A RESTful service is an actual service or API that implements those REST principles in practice.
- Example: if an API follows statelessness, uniform interface, and proper use of HTTP methods, it can be called a RESTful API.

---

### 7) What are the REST principles or constraints that make an API RESTful?

- Client-Server separates the UI from the data storage and business logic, allowing both sides to evolve independently as long as the API contract stays unchanged.
- Stateless means the server stores no session state between requests; every request must carry all necessary information like auth tokens.
- Cacheable means the server must indicate through HTTP headers, like Cache-Control, whether a response can be cached to improve performance.
- Uniform Interface means each resource has a stable, unique identifier, usually a URI, and requests/responses carry enough information for the receiver to process them.
- Layered System means the architecture can include multiple layers like load balancers, proxies, and auth servers, without the client needing to know about them.
- Code on Demand is an optional constraint where the server can send executable code to the client.
- Example: in browser dev tools, we can see that every API call is independent of the others, which demonstrates the stateless constraint in action.

---

### 8) What is Idempotency in the context of APIs?

- Idempotency means that executing the same API request multiple times results in the same system state as executing it just once.
- It doesn't mean the output has to be identical every time, but the state of the system remains the same.
- GET, PUT, and DELETE are idempotent methods.
- POST and PATCH are generally not idempotent.
- Example: calling a GET API to fetch 10 customer records will still show 10 records no matter how many times we call it.

---

### 9) Why does Idempotency matter for testers?

- It helps validate safe retry behavior, meaning if a user repeats the same operation, it shouldn't cause unintended changes on the server.
- It prevents duplicate data creation.
- It ensures API reliability, especially during failures or retries.
- Example: if a payment API is called twice due to a network glitch, an idempotent design ensures the customer isn't charged twice.

---

### 10) Why is PUT idempotent but PATCH is not?

- PUT updates the entire representation of a resource, so repeating the same PUT request multiple times still leaves the resource in the same final state.
- PATCH does a partial update, and sometimes it's implemented in a way that adds to existing data rather than replacing it, like incrementing a balance instead of setting it.
- Because of this, repeating a PATCH call can change the state differently each time, so it's not idempotent by default; it really depends on how the developer implements it.
- Example: a PUT call replacing a customer's full profile is idempotent, but a PATCH call that increments a wallet balance by ₹100 is not, since repeating it keeps adding money.

---

### 11) Which HTTP methods are safe, idempotent, and cacheable?

- Safe methods don't modify server state and are read-only; GET, HEAD, and OPTIONS fall into this category.
- Idempotent methods give the same final server state whether called once or a hundred times; GET, PUT, and DELETE fall into this category.
- Cacheable methods allow the response to be stored and reused, usually controlled via HTTP cache headers; GET and HEAD are cacheable.
- POST and PATCH are neither safe nor idempotent nor cacheable.
- Example: calling `GET /orders/1` repeatedly is safe, idempotent, and cacheable, while `POST /orders` creates a new order every time it's called.

---

### 12) What is the difference between Authentication and Authorization?

- Authentication is about proving who you are, similar to showing your ID card at the gate of a company.
- Authorization is about what you're allowed to do once you're inside, like not having access to the server room even though you're an authenticated employee.
- If authentication fails, like a missing or invalid token, we get a 401 Unauthorized error.
- If authentication succeeds but authorization fails, like trying an operation you're not permitted to do, we get a 403 Forbidden error.
- Example: if I don't provide a bearer token, I get a 401 error, but if I provide a valid token that isn't allowed to perform a DELETE operation, I get a 403 error.

---

### 13) Can you explain the different API authentication methods you've worked with?

- Basic Authentication sends the username and password encoded in Base64 as part of the Authorization header; since it's not encrypted, it's not recommended for production.
- Session Authentication involves logging in once, after which the server creates a session and returns a session cookie; this cookie is sent with every subsequent request to maintain the session, and in Playwright this session state can be stored and reused across API calls.
- Token Authentication, also called JWT, involves receiving a token after login which includes expiry information; it's called a bearer token and is passed in the Authorization header as "Bearer <token></token>".
- OAuth-based Authentication is commonly seen when we log into a third-party site using Gmail or Facebook; the target site never sees our actual credentials, since the identity provider verifies us instead.
- API Key Authentication uses a fixed key, like an X-API-KEY header, and the server doesn't necessarily know which specific user is calling, only that the key is valid.
- Example: in our project, we use Bearer Token authentication, adding the token in the headers, both in Postman for manual testing and in our automation scripts for Playwright API tests.

---

### 14) What is the difference between a Bearer Token and a JWT Token?

- A Bearer token is a general term for any token that's passed in the Authorization header as "Bearer <token></token>", granting access to whoever "bears" it.
- A JWT, or JSON Web Token, is a specific type of token format that's self-contained and includes encoded information like expiry and claims.
- In practice, a JWT is often used as the bearer token itself.
- Example: when we log in and receive a JWT, we then send it as `Authorization: Bearer <JWT>` in every subsequent API request.


