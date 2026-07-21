
# Exception (Error) Handling in JavaScript

## Q- What do you understand by Error Handling in JavaScript? Why do we use it?

**Ans-** JavaScript does not have an **`Exception`** class like Java. Instead, everything is treated as an **Error**, so we call it **Error Handling** instead of Exception Handling.

We use Error Handling to:

- Prevent the application from crashing.
- Handle unexpected runtime errors gracefully.
- Execute cleanup or debugging code before the application terminates.
- Display meaningful error messages and logs.

---

## Q- What is the base Error class in JavaScript?

**Ans-** JavaScript provides several built-in Error classes. All of them inherit from the **`Error`** class.

```text
Error (Base Class)
│
├── RangeError
├── ReferenceError
├── SyntaxError
├── TypeError
├── URIError
└── EvalError
```

Some common built-in errors are:

- `ReferenceError`
- `TypeError`
- `RangeError`
- `SyntaxError`
- `URIError`
- `EvalError`

> **Playwright Interview Tip:**
> Most Playwright APIs throw the base **`Error`** class. When a Playwright action fails (locator not found, timeout, assertion failure, etc.), you generally receive an `Error` object.

---

# try...catch...finally

## Q- How do you handle errors in JavaScript?

**Ans-** JavaScript handles errors using the **`try...catch...finally`** statement.

- **try** → Contains the code that may throw an error.
- **catch** → Executes if an error occurs and receives the Error object.
- **finally** → Always executes whether an error occurs or not. It is optional.

```typescript
try {
    // risky code
}
catch (error) {
    // handle error
}
finally {
    // always executes
}
```

---

## Q- Can JavaScript have multiple catch blocks like Java?

**Ans-** No.

JavaScript supports only **one `catch` block** for a `try` block.

```typescript
try {

}
catch(error){

}
```

---

## Q- Is the `finally` block mandatory?

**Ans-** No.

- `finally` is optional.
- It executes whether an error occurs or not.

```typescript
try {
    console.log("Inside try");
}
finally {
    console.log("Always executes");
}
```

Output

```text
Inside try
Always executes
```

---

## Q- Can `try` exist with only `finally`?

**Ans-** Yes.

A `try` block can exist with only a `finally` block.

```typescript
try {
    console.log("Hello");
}
finally {
    console.log("Cleanup");
}
```

---

## Q- Can `catch` exist without `try`?

**Ans-** No.

A `catch` block must always be associated with a `try` block.

---

# ReferenceError Example

If you write:

```typescript
console.log(y);
```

Output

```text
ReferenceError: y is not defined
```

The program stops because `y` does not exist.

---

## Handling the Error

```typescript
try {
    console.log(y);
}
catch (err) {
    console.log(err.name);
    console.log(err.message);
    console.log(err.stack);
}
```

Output

```text
ReferenceError
y is not defined
<complete stack trace>
```

---

## Q- What information does the Error object provide?

**Ans-**

The object received in the `catch` block contains useful properties.

```typescript
try {
    console.log(y);
}
catch (err) {
    console.log(err.name);
    console.log(err.message);
    console.log(err.stack);
}
```

| Property    | Description                                             |
| ----------- | ------------------------------------------------------- |
| `name`    | Type of error (`ReferenceError`, `TypeError`, etc.) |
| `message` | Error description                                       |
| `stack`   | Complete stack trace showing where the error occurred   |

---

# Common JavaScript Errors

## 1. ReferenceError

Occurs when a variable is used before declaration or does not exist.

```typescript
console.log(userName);
```

---

## 2. TypeError

Occurs when an operation is performed on an invalid type.

```typescript
let name = null;
name.toUpperCase();
```

---

## 3. RangeError

Occurs when a value is outside the allowed range.

```typescript
let arr = new Array(-1);
```

---

## 4. SyntaxError

Occurs when JavaScript syntax is invalid.

```typescript
if (true {
    console.log("Hello");
}
```

---

## 5. URIError

Occurs when an invalid URI is used.

```typescript
decodeURI("%");
```

---

## 6. EvalError

Historically thrown for problems related to `eval()`. It is very rare in modern JavaScript.

---

# Error Handling in Playwright

In real Playwright projects, we usually wrap automation code inside a `try` block.

If something fails:

- Execute debugging steps.
- Capture useful logs.
- Take screenshots.
- Print API request and response details.
- Then re-throw the original error.

Example:

```typescript
try {

    // Playwright code

}
catch (err) {

    console.log("Collect debugging details");
    console.log("Capture screenshot");
    console.log("Print API request and response");

    throw err;
}
```

---

## Q- Why should we re-throw (`throw err`) inside the catch block?

**Ans-**

Always re-throw the original error after performing debugging.

If you don't:

- The test may incorrectly pass.
- The original failure is hidden.
- CI/CD pipelines may report a successful execution even though the test actually failed.

```typescript
catch(err){

    console.log("Debug information");

    throw err;
}
```

---

# throw Keyword

## Q- What is the `throw` keyword?

**Ans-**

The `throw` keyword is used to manually generate an error.

```typescript
throw new Error("Something went wrong");
```

Execution immediately stops and the error is propagated to the nearest `catch` block.

---

# Custom Error

## Q- What is a Custom Error?

**Ans-**

A Custom Error is an error that we deliberately throw based on our own business logic.

Example:

```typescript
let age = 16;

if (age < 18) {
    throw new Error("Candidate is not eligible");
}
```

Here JavaScript has no problem with the code, but our business rule says the candidate is not eligible.

---

# Creating a Custom Error Class

## Q- How do you create a Custom Error class?

**Ans-**

Create a class that extends the base `Error` class.

### Step 1

```typescript
class AgeError extends Error {

}
```

---

### Step 2

Pass the message to the parent `Error` class.

```typescript
class AgeError extends Error {

    constructor(message: string) {
        super(message);
    }

}
```

---

### Step 3

Throw the custom error.

```typescript
class AgeError extends Error {

    constructor(message: string) {
        super(message);
    }

}

let age = 16;

if (age < 18) {
    throw new AgeError("Candidate is not eligible");
}
```

---

## Handling the Custom Error

```typescript
class AgeError extends Error {

    constructor(message: string) {
        super(message);
    }

}

try {

    let age = 16;

    if (age < 18) {
        throw new AgeError("Candidate is not eligible");
    }

}
catch(err){

    console.log(err.name);
    console.log(err.message);

}
```

Output

```text
AgeError
Candidate is not eligible
```

---

## Interview Summary

- JavaScript uses **Error Handling**, not Exception Handling.
- All built-in errors inherit from the **`Error`** class.
- Errors are handled using **`try...catch...finally`**.
- `finally` always executes and is optional.
- JavaScript supports only one `catch` block.
- The `catch` block receives an **Error object**.
- Common properties are `name`, `message`, and `stack`.
- Use **`throw`** to manually generate errors.
- Create custom errors by extending the **`Error`** class.
- In Playwright, always log debugging information **and re-throw the original error** so that the test fails correctly.
