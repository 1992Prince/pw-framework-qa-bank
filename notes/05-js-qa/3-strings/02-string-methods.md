# JavaScript String Methods

## Search Methods

### indexOf()

Returns first occurrence index.

```javascript
let str = "first second third second";

console.log(str.indexOf("second"));
console.log(str.indexOf("hello"));
```

### Output

```text
6
-1
```

---

### lastIndexOf()

Returns last occurrence index.

```javascript
let str = "first second third second";

console.log(str.lastIndexOf("second"));
```

### Output

```text
19
```

---

### search()

Supports Regular Expressions.

```javascript
let str = "JavaScript123";

console.log(str.search(/\d/));
```

### Output

```text
10
```

---

## indexOf() vs search()

| indexOf()                          | search()                      |
| ---------------------------------- | ----------------------------- |
| Doesn't support Regular Expression | Supports Regular Expression   |
| Accepts starting index             | Doesn't accept starting index |

---

# Extract Methods

## slice(start, end)

```javascript
let str = "JavaScript";

console.log(str.slice(4));
console.log(str.slice(4,10));
```

### Output

```text
Script
Script
```

---

## substring(start,end)

```javascript
let str = "JavaScript";

console.log(str.substring(4,10));
```

### Output

```text
Script
```

---

## substr(start,length)

> ⚠️ Deprecated. Avoid using in new code.

```javascript
let str = "JavaScript";

console.log(str.substr(4,6));
```

### Output

```text
Script
```

---

## Case Conversion

### toUpperCase()

```javascript
console.log("hello".toUpperCase());
```

Output

```text
HELLO
```

---

### toLowerCase()

```javascript
console.log("HELLO".toLowerCase());
```

Output

```text
hello
```

---

## replace()

Replaces only first occurrence.

```javascript
let str = "JavaScript is great. I love JavaScript!";

console.log(str.replace("JavaScript","TypeScript"));
```

### Output

```text
TypeScript is great. I love JavaScript!
```

---

## Replace All

```javascript
let str = "JavaScript is great. I love JavaScript!";

console.log(str.replace(/JavaScript/g,"TypeScript"));
```

### Output

```text
TypeScript is great. I love TypeScript!
```

---

## includes()

Returns boolean.

```javascript
let str = "first second third";

console.log(str.includes("second"));
console.log(str.includes("fourth"));
```

### Output

```text
true
false
```

---

## startsWith()

```javascript
let str = "first second";

console.log(str.startsWith("first"));
console.log(str.startsWith("second"));
console.log(str.startsWith("second",6));
```

### Output

```text
true
false
true
```

---

## endsWith()

```javascript
let str = "first second";

console.log(str.endsWith("second"));
```

### Output

```text
true
```

---

## trim()

Removes spaces from both ends.

```javascript
let str = "   hello   ";

console.log(str.trim());
```

### Output

```text
hello
```

---

## split()

Converts string into array.

```javascript
let str = "red,green,blue";

console.log(str.split(","));
```

### Output

```text
['red','green','blue']
```

---

## concat()

```javascript
let a = "Hello";
let b = " World";

console.log(a.concat(b));
```

### Output

```text
Hello World
```

---

## + Operator

```javascript
let first = "Hello";
let second = " World";

console.log(first + second);
```

### Output

```text
Hello World
```
