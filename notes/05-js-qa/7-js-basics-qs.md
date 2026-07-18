# JavaScript Interview Notes (SDET)

---

# Q. What is Node.js?

### Interview Answer

> Node.js is a JavaScript runtime environment that allows us to run JavaScript outside the browser, such as on a server or our local machine. It is built on Chrome's V8 JavaScript engine and is mainly used for building server-side applications, APIs, automation tools, and CLI applications.

### Simple Example

```javascript
console.log("Hello from Node.js");
```

Run:

```bash
node app.js
```

---

# Q. What is the V8 Engine?

### Interview Answer

> V8 is Google's JavaScript engine used in Chrome and Node.js. It converts JavaScript code into machine code using Just-In-Time (JIT) compilation, allowing JavaScript to execute very fast.

---

# Q. What are the core components involved in Node.js code execution?

### Interview Answer

Node.js execution mainly involves these components:

- **V8 Engine** → Executes synchronous JavaScript code.
- **Libuv** → Handles asynchronous operations like file reading, timers, and networking.
- **Event Loop** → Continuously checks whether asynchronous tasks are completed.
- **Thread Pool** → Performs heavy operations like file system tasks and cryptography.
- **Callback Queue** → Stores completed callback functions.
- **Microtask Queue** → Stores Promise callbacks and `queueMicrotask()` callbacks.

### Mnemonic

**V-L-E-T-C-M**

> **Very Little Effort Takes Coding Mastery**

- V → V8 Engine
- L → Libuv
- E → Event Loop
- T → Thread Pool
- C → Callback Queue
- M → Microtask Queue

---

# Q. How does asynchronous code execute in Node.js?

### Interview Answer

> When asynchronous code like `setTimeout()`, file reading, API calls, or database operations is encountered, Node.js sends these tasks to **Libuv** instead of blocking the main thread. Once the task completes, its callback is placed in the Callback Queue (or Microtask Queue for Promises). The Event Loop then moves the callback back to the Call Stack when it's empty.

### Simple Example

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timer");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("End");
```

Output

```
Start
End
Promise
Timer
```

---

# Q. What are Closures in JavaScript?

### Interview Answer

> A **closure** is a combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives a function access to its outer scope.

### Example

```javascript
function outer() {
    let count = 0;

    return function inner() {
        count++;
        console.log(count);
    };
}

const counter = outer();

counter();
counter();
counter();
```

Output

```
1
2
3
```

### Explanation

> Here, `outer()` runs once and returns. Normally, `count` would be destroyed after the function finishes. But `inner()` still remembers `count` and can update it. This is called a **closure**.

---

# Q. What are different data types in JavaScript?

### Interview Answer

JavaScript has **two categories** of data types:

### Primitive (Immutable)

- String
- Number
- Boolean
- Null
- Undefined
- Symbol
- BigInt

### Non-Primitive (Mutable)

- Object
- Array
- Function

### Example of Primitive Immutability

```javascript
let str = "Hello";

str.toUpperCase();

console.log(str);
```

Output

```
Hello
```

> Strings are immutable. `toUpperCase()` returns a new string without modifying the original.

---

# Q. Difference between null and undefined

### Interview Answer

> `null` means we intentionally assign an empty or unknown value.

> `undefined` means the variable has been declared but no value has been assigned yet.

### Example

```javascript
let a;

let b = null;

console.log(a);
console.log(b);
```

Output

```
undefined
null
```

---

# Q. Difference between var, let and const

### Interview Answer

| var                       | let                      | const                    |
| ------------------------- | ------------------------ | ------------------------ |
| Function scoped           | Block scoped             | Block scoped             |
| Can be redeclared         | Cannot be redeclared     | Cannot be redeclared     |
| Can be reassigned         | Can be reassigned        | Cannot be reassigned     |
| Hoisted with`undefined` | Hoisted but stays in TDZ | Hoisted but stays in TDZ |

### Example

```javascript
var a = 10;
var a = 20;

let b = 10;
// let b = 20 ❌

const c = 10;
// c = 20 ❌
```

### Important

> Accessing `let` or `const` before declaration throws a **ReferenceError** because they are in the **Temporal Dead Zone (TDZ).**

---

# Q. What is Hoisting?

### Interview Answer

> Hoisting means JavaScript moves variable and function declarations to the top of their scope before execution.

- `var` is initialized with `undefined`.
- `let` and `const` remain in the Temporal Dead Zone until initialization.
- Function declarations are fully hoisted.

### Example

```javascript
console.log(a);

var a = 10;
```

Output

```
undefined
```

### Example

```javascript
console.log(a);

let a = 10;
```

Output

```
ReferenceError
```

### Function Example

```javascript
greet();

function greet() {
    console.log("Hello");
}
```

Output

```
Hello
```

---

# Q. What is Scope?

### Interview Answer

> Scope defines where a variable can be accessed. JavaScript has three types of scope.

### 1. Global Scope

Variables can be accessed anywhere.

```javascript
let name = "Prince";

function show() {
    console.log(name);
}
```

---

### 2. Function Scope

Variables are accessible only inside the function.

```javascript
function greet() {
    let message = "Hello";
    console.log(message);
}

console.log(message);
```

Output

```
ReferenceError
```

---

### 3. Block Scope

Variables declared with `let` and `const` are accessible only inside the block.

```javascript
{
    let num = 100;
    console.log(num);
}

console.log(num);
```

Output

```
100
ReferenceError
```

---

# Q. What is Temporal Dead Zone (TDZ)?

### Interview Answer

> Temporal Dead Zone is
> the phase where let and const variables are declared but not initialized. During this period, accessing the variable throws a **ReferenceError**.

### Example

```javascript
console.log(a);

let a = 10;
```

Output

```
ReferenceError
```

---

# Q. What is ECMAScript? What features were introduced in ES6?

### Interview Answer

> ECMAScript is the official specification or standard that defines how JavaScript should work. JavaScript implements the ECMAScript standard.

### Popular ES6 Features

- let
- const
- Arrow Functions
- Template Literals
- Classes
- Destructuring
- Spread Operator
- Rest Operator
- Promises
- Modules (import/export)
- Default Parameters

---

# Q. What is Type Coercion?

### Interview Answer

> Type coercion is the automatic conversion of one data type into another by JavaScript.

### Example

```javascript
"5" + 2
```

Output

```
"52"
```

Number becomes String.

---

```javascript
"5" - 2
```

Output

```
3
```

String becomes Number.

---

# Q. Difference between == and ===

### Interview Answer

> `==` compares only values after performing type conversion.

> `===` compares both value and data type without type conversion.

### Example

```javascript
"5" == 5
```

Output

```
true
```

---

```javascript
"5" === 5
```

Output

```
false
```

### Another Example

```javascript
0 == false
```

Output

```
true
```

---

```javascript
0 === false
```

Output

```
false
```

# JavaScript Interview Notes

## Q. What is destructuring in objects and arrays?

Destructuring is an ES6 feature that allows you to extract values from objects or arrays and assign them to variables in a concise way.

### Object Destructuring

With object destructuring, you can fetch particular key-value pairs from an object.

```javascript
const user = {
  name: "John",
  age: 25,
  city: "Delhi"
};

const { name, age } = user;

console.log(name); // John
console.log(age);  // 25
```

You can also rename variables:

```javascript
const { name: userName } = user;

console.log(userName); // John
```

---

### Array Destructuring

With array destructuring, values are extracted based on their position (index).

```javascript
const arr = [10, 20, 30];

const [first, second] = arr;

console.log(first);  // 10
console.log(second); // 20
```

You can skip elements:

```javascript
const [first, , third] = arr;

console.log(third); // 30
```

---

## Q. What is the spread operator (`...`)?

The spread operator (`...`) expands (spreads) the elements of an array into individual elements.

It is commonly used to:

- Create a copy of an array
- Merge arrays
- Add new elements
- Pass array elements as function arguments

### Example

```javascript
const arr = [10, 20, 30];

const copy = [...arr];
```

### Important Points

- Creates a **NEW** array/object.
- Performs a **SHALLOW COPY** (only one level deep).
- Primitive values (number, string, boolean, etc.) are copied by value.
- Nested objects and nested arrays are **NOT** deeply copied. Their references are copied, so both arrays share the same nested objects/arrays.

### Common Uses

#### 1. Copy an array

```javascript
const copy = [...arr];
```

#### 2. Merge arrays

```javascript
const merged = [...arr1, ...arr2];
```

#### 3. Add elements

```javascript
const newArr = [...arr, 40, 50];
```

#### 4. Pass array elements as function arguments

```javascript
Math.max(...arr);
```

#### 5. Print array elements individually

```javascript
console.log(...arr);

// Output:
// 10 20 30
```

### Spread with Objects

The spread operator also works with objects.

```javascript
const user = {
  name: "John",
  age: 25
};

const copy = { ...user };

const updated = {
  ...user,
  city: "Delhi"
};
```

---

## Q. Difference between `map()`, `filter()`, `reduce()`, and `forEach()`

All are **Higher-Order Functions** because they accept another function (usually an arrow function) as an argument.

| Method        | Returns       | Purpose                                         |
| ------------- | ------------- | ----------------------------------------------- |
| `map()`     | New array     | Transform every element                         |
| `filter()`  | New array     | Keep elements that satisfy a condition          |
| `reduce()`  | Single value  | Reduce an array to one value                    |
| `forEach()` | `undefined` | Execute code for each element (no return value) |

### map()

Returns a new array with transformed values.

```javascript
const nums = [1, 2, 3];

const doubled = nums.map(num => num * 2);

// [2, 4, 6]
```

### filter()

Returns a new array containing only elements that satisfy the condition.

```javascript
const nums = [1, 2, 3, 4];

const even = nums.filter(num => num % 2 === 0);

// [2, 4]
```

### reduce()

Reduces the array into a single value.

```javascript
const nums = [1, 2, 3, 4];

const sum = nums.reduce((total, num) => total + num, 0);

// 10
```

### forEach()

Executes a function for every element.

Does **not** return a new array.

```javascript
const nums = [1, 2, 3];

nums.forEach(num => {
    console.log(num);
});
```

---

## Q. How do you remove duplicates from an array?

The easiest way is using a **Set**.

A `Set` stores only unique values.

```javascript
const arr = [1, 2, 2, 3, 4, 4];

const unique = [...new Set(arr)];

console.log(unique);

// [1, 2, 3, 4]
```

### Steps

1. Convert the array into a `Set`.
2. Convert the `Set` back into an array using the spread operator.

---

## Q. What are common JavaScript errors?

### ReferenceError

Occurs when trying to use a variable that has not been declared.

```javascript
console.log(name);

// ReferenceError
```

---

### TypeError

Occurs when an operation is performed on an incompatible type.

```javascript
const num = 10;

num();

// TypeError
```

---

### SyntaxError

Occurs when JavaScript code has invalid syntax.

```javascript
if (true {

}

// SyntaxError
```

---

### RangeError

Occurs when a value is outside the allowed range.

```javascript
const arr = new Array(-1);

// RangeError
```

---

## Q. What is the module system in JavaScript (import/export)?

The JavaScript Module System is a way to split code into multiple files (modules) so that code is easier to organize, reuse, and maintain.

A module can:

- Export variables, functions, classes, or objects.
- Import exports from other modules.

This helps avoid global variables and makes code modular.

### Export

Use `export` to make variables or functions available outside the file.

```javascript
// math.js

export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;
```

### Import

Use `import` to use exported members from another file.

```javascript
// app.js

import { add, subtract } from "./math.js";

console.log(add(2, 3));       // 5
console.log(subtract(5, 2));  // 3
```

### Default Export

A module can have one default export.

```javascript
// greet.js

export default function greet() {
    console.log("Hello");
}
```

Import it without curly braces.

```javascript
import greet from "./greet.js";

greet();
```

### Benefits of Modules

- Better code organization.
- Reusable code.
- Avoids polluting the global scope.
- Easier to maintain and test.
- Supports code splitting and lazy loading.

---

## Q. What are Named Exports, Named Imports, and Default Exports?

### Named Export

A file can have **multiple named exports**.

```javascript
// math.js

export const add = (a, b) => a + b;

export const sub = (a, b) => a - b;
```

Import them using curly braces [via destructuring]].

```javascript
import { add, sub } from "./math.js";
```

You can also rename while importing.

```javascript
import { add as addition } from "./math.js";
```

---

### Default Export

A file can have **only one default export**.

```javascript
// greet.js

export default function greet() {
    console.log("Hello");
}
```

Import without curly braces.

```javascript
import greet from "./greet.js";
```

You can give it **any name**.

```javascript
import sayHello from "./greet.js";
```

---

### Difference between Named and Default Export

| Named Export                     | Default Export                  |
| -------------------------------- | ------------------------------- |
| Multiple per file                | Only one per file               |
| Imported using`{}`             | Imported without`{}`          |
| Name must match (unless aliased) | Can be imported with any name   |
| `export const add = ...`       | `export default function(){}` |

### Can both be used together?

Yes.

```javascript
// math.js

export const add = (a, b) => a + b;

export default function multiply(a, b) {
    return a * b;
}
```

Import:

```javascript
import multiply, { add } from "./math.js";

```
## Q. How do you convert a string to a number and vice versa in JavaScript?

### Interview Differences

| Method | Use Case |
|---------|----------|
| `Number()` | Converts the entire string. Returns `NaN` if the string isn't a valid number. |
| `+str` | Shorthand for `Number()`. |
| `parseInt()` | Extracts an integer from the beginning of a string. |
| `parseFloat()` | Extracts a decimal number from the beginning of a string. |
| `String()` | Safest way to convert any value to a string. |
| `.toString()` | Converts a number to a string but cannot be used on `null` or `undefined`. |

### Examples

```javascript
Number("123");        // 123
Number("123abc");     // NaN



String(123);          // "123"
(123).toString();     // "123"
```