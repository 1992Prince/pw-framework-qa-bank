
# JavaScript Strings - Basics

## What is a String?

- String is a **primitive data type**.
- Primitive values are **stored by value**, not by reference.
- Strings are **immutable** (cannot be changed after creation).

### Example

```javascript
let str = "hello";

str[0] = "H";

console.log(str);
```

### Output

```text
hello
```

✔ No error is thrown.
❌ Original string is not modified.

---

## String Methods Don't Modify Original String

Most string methods return a **new string**.

```javascript
let str = "hello";

let upper = str.toUpperCase();

console.log(str);
console.log(upper);
```

### Output

```text
hello
HELLO
```

---

## String is Primitive but Behaves Like an Object

Although string is primitive, JavaScript temporarily wraps it inside a **String object** so that properties and methods can be used.

```javascript
let str = "javascript";

console.log(str.length);
console.log(str.toUpperCase());
```

### Output

```text
10
JAVASCRIPT
```

---

## JavaScript Has No Character Data Type

A single character is also a string.

```javascript
let ch = "A";

console.log(typeof ch);
console.log(ch.length);
```

### Output

```text
string
1
```

---

## Ways to Declare Strings

### Double Quotes

```javascript
let a = "JavaScript";
```

### Single Quotes

```javascript
let b = 'JavaScript';
```

### Template Literal

```javascript
let name = "Prince";

console.log(`Hello ${name}`);
```

### Output

```text
Hello Prince
```

---

## typeof String

```javascript
let str = "Hello";

console.log(typeof str);
```

### Output

```text
string
```

---

## String Length

Use **length** property.

```javascript
let str = "Automation";

console.log(str.length);
```

### Output

```text
10
```

---

## Can String Variable Be null or undefined?

Yes.

```javascript
let name = null;
let city;

console.log(name);
console.log(city);
```

### Output

```text
null
undefined
```

### Good Practice

- Use **undefined** when value is not assigned yet.
- Use **null** when you intentionally want to indicate "no value".
