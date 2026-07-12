
# JavaScript Objects - Important Interview Questions & Answers

## 1. What are Objects in JavaScript? Explain with an example.

**Answer:**

- Objects are **non-primitive** data types used to store data in **key-value pairs**.
- A single object can store different types of values such as strings, numbers, arrays, functions, and even other objects.
- Objects are stored in **Heap Memory**.

```javascript
let user = {
  name: "Vinay",
  age: 30,
  city: "Pune"
};

console.log(user.name); // Vinay
```

---

## 2. What will be the `typeof` of an Object and an Array?

**Answer:**

```javascript
let obj = {};
let arr = [];

console.log(typeof obj); // object
console.log(typeof arr); // object
```

**Points:**

- `typeof` an object is **"object"**.
- `typeof` an array is also **"object"**.
- To check whether a variable is an array, use:

```javascript
Array.isArray(arr); // true
```

---

## 3. Are Objects Primitive or Non-Primitive? Where are they stored?

**Answer:**

- Objects are **non-primitive** data types.
- Objects are stored in **Heap Memory**.
- Variables store the **reference (address)** of the object, not the actual object.

---

## 4. Create a complex object and access different types of values.

**Answer:**

```javascript
let user = {
  name: "Vinay",
  age: 30,
  isEmployee: true,
  skills: ["JavaScript", "Playwright"],
  address: {
    city: "Pune",
    pin: 411001
  },
  greet() {
    return "Hello";
  }
};

console.log(user.name);
console.log(user.skills[0]);
console.log(user.address.city);
console.log(user.greet());
```

---

## 5. How can you add, update, and delete properties from an object?

**Answer:**

### Add

```javascript
user.country = "India";
```

### Update

```javascript
user.age = 31;
```

### Delete

```javascript
delete user.city;
```

---

## 6. Dot Notation vs Bracket Notation

**Answer:**

### Dot Notation

```javascript
console.log(user.name);
```

### Bracket Notation

```javascript
console.log(user["name"]);
```

Use **Bracket Notation** when:

- Property name is stored in a variable.
- Property contains spaces or special characters.

Example:

```javascript
let key = "name";

console.log(user[key]); // Vinay
```

---

## 7. How do you iterate over an object?

**Answer:**

Using `for...in` loop:

```javascript
for (let key in user) {
  console.log(key);
  console.log(user[key]);
}
```

---

## 8. How do you get all keys, values, and entries of an object?

**Answer:**

```javascript
Object.keys(user);
Object.values(user);
Object.entries(user);
```

Example:

```javascript
console.log(Object.keys(user));
console.log(Object.values(user));
console.log(Object.entries(user));
```

---

## 9. How do you get the length of an object?

**Answer:**

Objects do not have a `.length` property.

Use:

```javascript
Object.keys(user).length
```

Example:

```javascript
console.log(Object.keys(user).length);
```

---

## 10. `JSON.stringify()` vs `JSON.parse()`

**Answer:**

| `JSON.stringify()`                      | `JSON.parse()`                          |
| ----------------------------------------- | ----------------------------------------- |
| Converts JavaScript Object → JSON String | Converts JSON String → JavaScript Object |
| Used before sending data to APIs          | Used after receiving data from APIs       |
| Returns a string                          | Returns an object                         |

Example:

```javascript
let json = JSON.stringify(user);
let obj = JSON.parse(json);
```

---

## 11. What is Serialization and Deserialization?

**Answer:**

**Serialization**

- Converting a JavaScript Object into a JSON string.
- Done using `JSON.stringify()`.

**Deserialization**

- Converting a JSON string back into a JavaScript Object.
- Done using `JSON.parse()`.

---

## 12. How do you create a clone (copy) of an object?

**Answer:**

Using the Spread Operator:

```javascript
let copy = { ...user };
```

This creates a **shallow copy**.

For a **deep copy**:

```javascript
let deepCopy = structuredClone(user);
```

---

## 13. Shallow Clone vs Deep Clone

**Answer:**

| Shallow Clone                           | Deep Clone                          |
| --------------------------------------- | ----------------------------------- |
| Copies only the first level             | Copies all nested levels            |
| Nested objects share the same reference | Every nested object gets a new copy |
| Created using Spread Operator (`...`) | Created using`structuredClone()`  |

---

## 14. What is Object Destructuring?

**Answer:**

Object destructuring extracts properties into variables.

```javascript
let user = {
  name: "Vinay",
  age: 30
};

const { name, age } = user;

console.log(name);
console.log(age);
```

---

## 15. How do you merge two objects?

**Answer:**

Using the Spread Operator:

```javascript
let obj1 = {
  name: "Vinay"
};

let obj2 = {
  age: 30
};

let merged = {
  ...obj1,
  ...obj2
};

console.log(merged);
```

If both objects contain the same key, the **last object's value overwrites the previous one**.

```javascript
let obj1 = { age: 25 };
let obj2 = { age: 30 };

let merged = {
  ...obj1,
  ...obj2
};

console.log(merged.age); // 30
```

---

## 16. What is the difference between a JavaScript Object and JSON?

**Answer:**

| JavaScript Object                      | JSON                                     |
| -------------------------------------- | ---------------------------------------- |
| JavaScript data structure              | Text format for data exchange            |
| Keys may or may not be in quotes       | Keys must always be in double quotes     |
| Can contain functions and`undefined` | Cannot contain functions or`undefined` |
| Used inside JavaScript                 | Used for API communication               |

Example:

```javascript
// JavaScript Object
let user = {
  name: "Vinay"
};
```

```json
{
  "name": "Vinay"
}
```

---

# ⭐ Additional Important Interview Questions

## 17. How do you check whether a property exists in an object?

**Answer:**

Using the `in` operator:

```javascript
console.log("name" in user); // true
console.log("salary" in user); // false
```

Or using `hasOwnProperty()`:

```javascript
console.log(user.hasOwnProperty("name")); // true
```

---

## 18. What is the difference between `==` and `===` when comparing objects?

**Answer:**

Objects are compared by **reference**, not by their values.

```javascript
let p1 = { name: "Vinay" };
let p2 = { name: "Vinay" };

console.log(p1 === p2); // false
```

```javascript
let p3 = p1;

console.log(p1 === p3); // true
```

- `p1` and `p2` are different objects in memory.
- `p1` and `p3` point to the same object.

---

## 19. What is `Object.freeze()`?

**Answer:**

`Object.freeze()` makes an object completely immutable.

- Cannot add new properties.
- Cannot update existing properties.
- Cannot delete properties.

```javascript
let user = {
  name: "Vinay"
};

Object.freeze(user);

user.name = "Rahul";
user.city = "Pune";

console.log(user);
```

---

## 20. What is `Object.seal()`?

**Answer:**

`Object.seal()` allows updating existing properties but prevents adding or deleting properties.

```javascript
let user = {
  name: "Vinay"
};

Object.seal(user);

user.name = "Rahul";     // ✅ Allowed
user.city = "Pune";      // ❌ Not Allowed
delete user.name;        // ❌ Not Allowed
```
