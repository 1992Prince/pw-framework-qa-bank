
## Q-1. What is the difference between synchronous and asynchronous programming? Is JavaScript synchronous or asynchronous?

**Synchronous Programming** 
- Code executes line by line, in order. 
- Each line must finish before the next one starts — this is called "blocking" execution

**Example**

```javascript
console.log("A");
console.log("B");
console.log("C");
```

**Output**

```
A
B
C
```

---

**Asynchronous Programming**

- Some operations (like API calls, file reading, timers) run in the background without blocking the rest of the code. The rest of the code keeps executing, and the async operation's result is handled later (via callback, Promise, or async/await) whenever it's ready.
- Some tasks take time (API calls, timers, file reading).
- JavaScript doesn't wait for them. It continues executing the next lines.
- When the async task finishes, its callback or Promise runs.

```javascript
console.log("A");

setTimeout(() => {
    console.log("B");
}, 2000);

console.log("C");
```

**Output**

```
A
C
B
```

**Is JavaScript synchronous or asynchronous?**

- JavaScript itself is single-threaded and synchronous by nature — it executes one line at a time on a single call stack. 
- But JS can behave asynchronously for time-taking operations (network calls, timers, file I/O) with the help of the browser/Node.js environment (Web APIs / Node APIs) and the Event Loop, which hands off async tasks in the background and brings their results back to the call stack once ready — without blocking the main thread.


- JS is single-threaded and synchronous at its core, but achieves asynchronous behavior using the **event loop, callback queue, and Web/Node APIs** working alongside the call stack.

---

## Q-2. What is asynchronous programming in JavaScript?

Asynchronous programming is a technique that allows time-consuming operations (like API calls, database queries, file reads, timers) to run in the background without blocking the main thread, so the rest of the program can keep executing while waiting for that operation to complete.

Ways to handle async in JS (evolution over time):

Callbacks (oldest way)
Promises (introduced to fix callback problems)
Async/Await (modern, cleanest syntax, built on top of Promises)

This improves application performance because the application doesn't become blocked.

Common asynchronous operations are:

- API calls
- Database calls
- setTimeout()
- setInterval()
- File reading

**Example**

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Task Completed");
}, 3000);

console.log("End");
```

**Output**

```
Start
End
Task Completed
```

---

## Q-3. What is a Callback?

A **callback** is simply a function that is passed as an argument to another function and is executed later.

The function receiving the callback decides **when** to execute it.

We can pass:

- Named functions
- Anonymous functions
- Function expressions
- Arrow functions

**Example**

```javascript
function greet(name) {
    console.log("Hello " + name);
}

function welcome(callback) {
    console.log("Welcome");
    callback("Prince");
}

welcome(greet);
```

**Output**

```
Welcome
Hello Prince
```

Key point: Callbacks are the foundation of async programming in JS — before Promises existed, all async operations (like setTimeout, API calls, file reads) were handled purely through callbacks.
---

## Q-4. Explain how a normal function can be passed as a callback.

A normal function can be passed just like any other variable because functions are first-class objects in JavaScript.

Instead of calling the function, we pass its reference.

```javascript
function welcome(name, callback) {
    console.log("Welcome to India");
    callback(name);
}

function greet(name) {
    console.log(`Namaste ${name}`);
}

welcome("Namo", greet);
```

**Output**

```
Welcome to India
Namaste Namo
```

Notice that we pass **greet**, not **greet()**.

---

## Q-5. What is Callback Hell?

Callback Hell happens when multiple asynchronous operations depend on each other and callbacks become deeply nested.

This makes the code difficult to read, debug, and maintain.

```javascript
login(function () {
    getProfile(function () {
        getOrders(function () {
            makePayment(function () {
                console.log("Done");
            });
        });
    });
});
```

This pyramid-like structure is called **Callback Hell** or the **Pyramid of Doom**.

Promises and async/await were introduced to solve this problem.

---

## Q-6. What is a Promise? Why was it introduced?

A **Promise** is a JavaScript object that represents the eventual success or failure of an asynchronous operation.

Think of it as a placeholder for a value that will be available in the future.

Promises were introduced because callbacks had several problems:

- Callback Hell
- Less readable code
- Difficult error handling

Promises provide cleaner code and better error handling.

---

## Q-7. What are the different states of a Promise?

A Promise has only **three states**.

### 1. Pending

The Promise has been created and the async task is still running.

### 2. Fulfilled

The async operation completed successfully.

`resolve()` is called and `.then()` executes.

### 3. Rejected

The async operation failed.

`reject()` is called and `.catch()` executes.

---

## Q-8. How do you create a Promise?

A Promise is created using the **new Promise()** constructor.

It automatically receives two functions:

- `resolve()` → called when the operation succeeds.
- `reject()` → called when the operation fails.

```javascript
const myPromise = new Promise((resolve, reject) => {

    let success = true;

    if (success) {
        resolve("Success");
    } else {
        reject("Failed");
    }

});

myPromise
    .then(message => console.log(message))
    .catch(error => console.log(error))
    .finally(() => console.log("Completed"));
```

---

## Q-9. What does `new Promise()` return?

`new Promise()` returns a **Promise object**.

That Promise object can be in one of three states:

- Pending
- Fulfilled
- Rejected

It also provides methods like:

- `.then()`
- `.catch()`
- `.finally()`

to handle the result.

---

## Q-10. Explain Promise handlers.

Promise handlers are methods used to consume the result of a Promise.

### `.then()`

Runs when the Promise is fulfilled.

```javascript
promise.then(result => {
    console.log(result);
});
```

---

### `.catch()`

Runs when the Promise is rejected.

```javascript
promise.catch(error => {
    console.log(error);
});
```

---

### `.finally()`

Runs whether the Promise succeeds or fails.

It is mainly used for cleanup work.

```javascript
promise.finally(() => {
    console.log("Finished");
});
```

All three methods accept callback functions and return a **new Promise**, which makes Promise chaining possible.

---

## Q-11. How do you handle errors in a Promise?

Errors are handled using the `.catch()` method.

Whenever `reject()` is called, the value automatically goes to `.catch()`.

```javascript
myPromise
    .then(result => console.log(result))
    .catch(error => console.log(error));
```

---

## Q-12. What is the purpose of `.finally()`? Are `.catch()` and `.finally()` optional?

`.finally()` is used for cleanup code that should run regardless of success or failure.

Examples:

- Hide loading spinner
- Close database connection
- Stop loader

```javascript
fetchData()
    .finally(() => {
        console.log("Hide Loader");
    });
```

Both `.catch()` and `.finally()` are optional syntactically.

However, it is considered **best practice to always use `.catch()`** so that errors don't go unhandled.

---

## Q-13. What is Promise Chaining?

Promise chaining is connecting multiple .then() calls one after another, where each .then() waits for the previous one to complete and passes its return value to the next one. 

This lets us perform a sequence of asynchronous steps in order, without nesting (avoiding callback hell).

Each `.then()` returns a new Promise whose result is passed to the next `.then()`.

```javascript
Promise.resolve(5)
    .then(num => num * 2)
    .then(num => num + 10)
    .then(result => console.log(result));
```

**Output**

```
20
```

This avoids deeply nested callbacks.

---

## Q-14. Explain Promise utility methods.

All four take an array of Promises and handle them together, but behave differently:

### Promise.all()

- Waits for all Promises to succeed.
- If one fails, the entire Promise fails.

```javascript
Promise.all([promise1, promise2]);
```

Use when all results are required.

---

### Promise.allSettled()

- Waits for every Promise.
- Returns both successful and failed results.

```javascript
Promise.allSettled([promise1, promise2]);
```

---

### Promise.race()

Returns the result of the Promise that finishes first, whether it succeeds or fails.

```javascript
Promise.race([promise1, promise2]);
```

---

### Promise.any()

Returns the first successfully fulfilled Promise.

It ignores rejected Promises unless all fail.

```javascript
Promise.any([promise1, promise2]);
```

---

## Q-15. What is async/await?

- async/await is modern syntax (ES2017) built on top of Promises that lets us write asynchronous code that looks and reads like synchronous code, making it much easier to understand than .then() chains.

- async keyword before a function makes it always return a Promise.
- await keyword (usable only inside an async function) pauses execution at that line until the Promise resolves, then returns its resolved value.

`async/await` is a cleaner way to work with Promises.

- `async` makes a function return a Promise.
- `await` pauses that function until the Promise is resolved.

```javascript
async function getData() {

    const response = await fetch("https://api.example.com");

    console.log(response);
}
```

It makes asynchronous code look like normal synchronous code.

---

## Q-16. What is the difference between Promises and async/await?

- Both are used to handle asynchronous operations in JavaScript.
- **Promise** uses `.then()`, `.catch()`, and `.finally()` to handle results.
- **async/await** provides a cleaner syntax by using `await` inside an `async` function.

- Promise-based code often involves chaining multiple `.then()` calls.
- async/await makes asynchronous code look like synchronous code, making it easier to read and maintain.

- Promises are useful when chaining multiple asynchronous operations.
- async/await is generally preferred for sequential asynchronous operations because the code is simpler and more readable.

- Internally, **async/await is built on top of Promises**; it is just syntactic sugar over Promises.

| Promise                          | async/await                          |
| -------------------------------- | ------------------------------------ |
| Uses`.then()` and `.catch()` | Uses`await` inside async functions |
| More chaining                    | Looks like synchronous code          |
| Slightly harder to read          | Easier to read and maintain          |
| Good for chaining                | Best for sequential async operations |

Both work with the same Promise objects.

Async/await is simply a cleaner syntax built on top of Promises.

---

## Q-17. How do you handle errors in async code?

Errors are handled using **try...catch** around await statements. 

```javascript
async function getData() {

    try {

        const response = await fetch("https://api.example.com");

        console.log(response);

    } catch (error) {

        console.log(error);

    }
}
```

If any awaited Promise fails, execution immediately moves to the `catch` block.

## Q-18. What is the return type of `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`?

All four Promise utility methods **accept multiple Promises in an array and return a single Promise object**.

### `Promise.all()`

- Takes multiple Promises in an array.
- Returns a Promise.
- Resolves only when **all Promises** are fulfilled.
- The resolved values are returned as an array.

```javascript
const [user, orders] = await Promise.all([
    getUser(),
    getOrders()
]);
```

Here, `Promise.all()` returns an array of results, and we use **array destructuring** to store each Promise's result in separate variables.

---

### `Promise.allSettled()`

- Takes multiple Promises in an array.
- Returns a Promise.
- Waits for all Promises to finish, whether they succeed or fail.
- Returns an array of result objects.

```javascript
const [userResult, orderResult] = await Promise.allSettled([
    getUser(),
    getOrders()
]);
```

Again, the returned array is destructured into separate variables.

---

### `Promise.race()`

- Takes multiple Promises in an array.
- Returns a Promise.
- Resolves or rejects with the result of the **first Promise** that finishes.

```javascript
const result = await Promise.race([
    promise1,
    promise2
]);
```

---

### `Promise.any()`

- Takes multiple Promises in an array.
- Returns a Promise.
- Resolves with the **first successfully fulfilled Promise**.
- Rejects only if all Promises fail.

```javascript
const result = await Promise.any([
    promise1,
    promise2
]);
```

---

## Q-19. Write a function that returns a Promise. Do we need to use `async`?

If you are **manually creating and returning a Promise using `new Promise()`**, then **you do not need to use the `async` keyword**.

```javascript
function checkAge(age) {

    return new Promise((resolve, reject) => {

        if (age >= 18) {
            resolve("Eligible");
        } else {
            reject("Not Eligible");
        }

    });

}
```

You can consume it using Promise handlers:

```javascript
checkAge(20)
    .then(result => console.log(result))
    .catch(error => console.log(error));
```

If you want to consume the Promise using **`await`**, then the calling function must be marked as `async`.

```javascript
async function verifyAge() {

    try {

        const result = await checkAge(20);

        console.log(result);

    } catch (error) {

        console.log(error);

    }

}
```

**Remember:**
- Returning `new Promise()` **does not require** the `async` keyword.
- A function needs `async` **only when it uses the `await` keyword**.

---

## Q-20. Where have you used Promise utility methods in your automation framework?

In Playwright, I have mainly used **`Promise.all()`** to avoid race conditions by starting multiple asynchronous operations at the same time.

Some common scenarios are:

- Waiting for a new browser tab or window while clicking a link.
- Waiting for a file download while clicking the Download button.
- Waiting for a dialog or popup while performing an action.
- Waiting for navigation and a click together.

**Example – Waiting for a new page**

```javascript
const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.click("#openWindow")
]);
```

Here:
- `Promise.all()` returns a Promise.
- When it resolves, it returns an **array of results**.
- We use **array destructuring** (`[newPage]`) to directly store the result of `context.waitForEvent("page")` into the `newPage` variable.
- `page.click()` only triggers the event, so we don't need to store its result.
- This ensures Playwright starts waiting for the new page **before** performing the click, avoiding race conditions.