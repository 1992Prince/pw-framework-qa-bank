
## Q-1. What is a function in JavaScript? Where are functions stored in memory?

A function in JavaScript is a reusable block of code that performs a specific task. Instead of writing the same logic multiple times, we write it once and call it whenever needed.

Functions are **first-class objects** in JavaScript. This means they can be:

- Assigned to variables
- Passed as arguments to other functions
- Returned from other functions

**Memory:**

- Function objects are created in the **Heap Memory**.
- Their reference is stored in the execution context (stack memory).
- During the memory creation phase, **function declarations** are stored completely in memory, so they can be called before their declaration (hoisting).
- **Function expressions** and **arrow functions** behave like variables, so they are available only after the assignment is executed.

### Example

```javascript
function greet(name) {
  return `Hello ${name}`;
}

console.log(greet("Prince"));
```

**Output**

```
Hello Prince
```

---

## Q-2. What are the different ways to create a function in JavaScript? (Types of Functions)


JavaScript provides multiple ways to create functions. The most common ones are:

1. Named Function (Function Declaration)
2. Function Expression
3. Arrow Function
4. Anonymous Function
5. IIFE (Immediately Invoked Function Expression)
6. Callback Function

### Easy Trick to Remember

**N F A A I C**

👉 **"New Friends Always Ask Interesting Questions"**

- **N** → Named Function
- **F** → Function Expression
- **A** → Arrow Function
- **A** → Anonymous Function
- **I** → IIFE
- **C** → Callback Function

---

### 1. Named Function (Function Declaration)

- Declared using the `function` keyword.
- Has its own name.
- Fully hoisted, so it can be called before its declaration.

```javascript
sayHello();

function sayHello() {
    console.log("Hello");
}
```

---

### 2. Function Expression

- A function is assigned to a variable.
- The function usually doesn't have its own name.
- Cannot be called before assignment because only the variable is hoisted, not its value.

```javascript
const sayHello = function () {
    console.log("Hello");
};

sayHello();
```

Example of hoisting:

```javascript
sayHello(); // Error

const sayHello = function () {
    console.log("Hello");
};
```

It is commonly used while assigning functions to variables or object properties.

---

### 3. Arrow Function

- Introduced in ES6.
- Shorter syntax.
- Does not have its own `this`.
- Cannot be called before its declaration.

```javascript
const add = (a, b) => a + b;

console.log(add(10, 20));
```

---

### 4. Anonymous Function

- A function without a name.
- Mostly used as a callback.

```javascript
setTimeout(function () {
    console.log("Executed");
}, 1000);
```

Here, the function passed to `setTimeout()` is an **anonymous function**.

---

### 5. IIFE (Immediately Invoked Function Expression)

- Executes immediately after it is created.
- Used to create a private scope.

```javascript
(function () {
    console.log("Runs immediately");
})();
```

---

### 6. Callback Function

- A function passed as an argument to another function.
- It is executed later when required.

```javascript
function greet(name, callback) {
    console.log("Hello " + name);
    callback();
}

greet("Prince", function () {
    console.log("Welcome!");
});
```

---

## Q-3. What is a Higher-Order Function?


A **Higher-Order Function (HOF)** is a function that either:

- Accepts another function as an argument, or
- Returns another function.

Higher-order functions make code more reusable and readable.

Common examples are:

- `map()`
- `filter()`
- `reduce()`
- `forEach()`
- `sort()`

These are higher-order functions because they accept a callback function.

### Example

```javascript
const numbers = [1, 2, 3];

const doubled = numbers.map(num => num * 2);

console.log(doubled);
```

**Output**

```
[2, 4, 6]
```

Here:

- `map()` is the Higher-Order Function.
- `num => num * 2` is the callback function.

---

## Q-4. Why can normal functions be called before their declaration, but not function expressions or arrow functions?

This happens because of **hoisting**.

A **function declaration** is completely hoisted during the memory creation phase, so JavaScript already knows about the function before executing the code.

- A function declaration (named function using function keyword) is fully hoisted — meaning both the function's name AND its entire body/definition are moved to the top of the scope during compilation. 
- So JS already knows the complete function before execution starts, and it can be called anywhere, even above where it's written.

```javascript
sayHello();

function sayHello() {
    console.log("Hello");
}
```

This works because the complete function is available in memory.

On the other hand, **function expressions** and **arrow functions** are assigned to variables.

Only the variable is hoisted, not its value. Until the assignment is executed, the variable is in the **Temporal Dead Zone (TDZ)** if declared with `let` or `const`.

- A function expression or arrow function is assigned to a variable (const/let/var). 
- Only the variable declaration is hoisted, not the function assigned to it. 
- The variable exists in memory but holds undefined (for var) or is in the "temporal dead zone" (for let/const) until the actual line of code runs and assigns the function to it.

```javascript
sayHello(); // Error

const sayHello = () => {
    console.log("Hello");
};
```

---

## Q-5. What are arrow functions and how are they different from normal functions?

Arrow functions were introduced in **ES6** and provide a shorter syntax for writing functions.

- Normal functions have their own this binding and their own arguments object, 
- while arrow functions don't have their own this — they inherit this from the surrounding (lexical) scope, and they don't have an arguments object either.

The biggest difference is that **arrow functions do not have their own `this`**, whereas normal functions do.

| Normal Function            | Arrow Function                     |
| -------------------------- | ---------------------------------- |
| Uses`function` keyword   | Uses`=>` syntax                  |
| Has its own`this`        | Inherits`this` from parent scope |
| Can be used as constructor | Cannot be used as constructor      |
| Has`arguments` object    | Does not have`arguments` object  |

### Example

```javascript
function add(a, b) {
    return a + b;
}

const addArrow = (a, b) => a + b;

and

const obj = {
  name: "Prince",
  normalFn: function() {
    console.log(this.name); // "Prince" — this refers to obj
  },
  arrowFn: () => {
    console.log(this.name); // undefined — this refers to outer/global scope
  }
};

obj.normalFn(); // Prince
obj.arrowFn();  // undefined
```

---

## Q-6. How is `this` binding different in arrow functions and normal functions?


A **normal function** gets its own `this` depending on how it is called.

An **arrow function** does not create its own `this`. It inherits `this` from its surrounding (lexical) scope.

### Normal Function

```javascript
const user = {
    name: "Prince",
    greet: function () {
        console.log(this.name);
    }
};

user.greet();
```

Output

```
Prince
```

---

### Arrow Function

```javascript
const user = {
    name: "Prince",
    greet: () => {
        console.log(this.name);
    }
};

user.greet();
```

Output

```
undefined
```

This happens because the arrow function takes `this` from the outer scope instead of the object.

---

## Q-7. What are default parameters and rest parameters?


### Default Parameters

Default parameters allow us to assign a default value if no argument is passed.

```javascript
function greet(name = "Guest") {
    console.log("Hello " + name);
}

greet();
```

Output

```
Hello Guest
```

---

### Rest Parameters

Rest parameters allow us to collect multiple arguments into a single array.
Allows a function to accept an indefinite number of arguments as an array, using ...
Useful when we don't know in advance how many arguments will be passed.
Key point to mention in interview: Rest parameter must always be the last parameter in the function signature, since it collects "the rest" of the arguments.

```javascript
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b);
}

console.log(sum(10, 20, 30));
```

Output

```
60
```
```javascript
function example(first, ...rest) {
  console.log(first); // first argument
  console.log(rest);  // array of remaining arguments
}
example(1, 2, 3, 4); // first = 1, rest = [2, 3, 4]
```
---

## Q-8. What is an Async Function?


An async function is a function declared with the async keyword that always returns a Promise, and allows us to use the await keyword inside it to pause execution until a Promise resolves — making asynchronous code look and behave like synchronous code (easier to read than .then() chains).

```javascript
async function fetchData() {
    const data = await fetch("https://api.example.com/users");
    console.log(await data.json());
}
```

Async/await makes asynchronous code easier to read and write compared to Promise chaining.

---

## Q-9. What is a Generator Function?


A **generator function** is a special function that can pause and resume its execution.

It is declared using `function*` and uses the `yield` keyword.

```javascript
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = numbers();

console.log(gen.next());
console.log(gen.next());
```

Output

```
{ value: 1, done: false }
{ value: 2, done: false }
```

Generators are useful when we want to generate values one at a time instead of all at once.

---

## Q-10. What is Closure? Give a real-time example.

A **closure** is created when an inner function remembers and can access the variables of its outer function, even after the outer function has finished executing.

Closures are commonly used for:

- Data privacy
- Counters
- Caching
- Event handlers

### Example

```javascript
function counter() {
    let count = 0;

    return function () {
        count++;
        console.log(count);
    };
}

const increment = counter();

increment();
increment();
increment();
```

**Output**

```
1
2
3
```

Even though `counter()` has finished executing, the inner function still remembers the value of `count`. This is called a **closure**.

## Q-11. What is the `this` keyword in JavaScript?

The `this` keyword refers to an object, but **its value depends on where and how it is used.**

### 1. `this` in JavaScript Classes

Here, `this` refers to the **current object (instance)** of the class.

```javascript
class Employee {

    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(this.name);
    }

}

const emp = new Employee("Prince");

emp.greet();
```

**Output**

```
Prince
```

---

### 2. `this` in Normal Functions

A normal function gets **its own `this`**, and its value depends on **how the function is called**.

```javascript
const user = {
    name: "Prince",

    greet() {
        console.log(this.name);
    }
};

user.greet();
```

**Output**

```
Prince
```

Here, `this` refers to the `user` object because `user` is calling the function.

---

### 3. `this` in Arrow Functions

An arrow function **does not have its own `this`**. It inherits `this` from its **lexical (parent) scope**.

```javascript
const user = {
    name: "Prince",

    greet: () => {
        console.log(this.name);
    }
};

user.greet();
```

**Output**

```
undefined
```

Here, `this` comes from the outer scope, not from the `user` object.