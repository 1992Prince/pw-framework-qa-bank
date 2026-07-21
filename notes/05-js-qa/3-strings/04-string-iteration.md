
# JavaScript String Iteration

A string is **iterable**, meaning you can loop through each character one by one.

---

# 1. Traditional for Loop

Uses the string's `length` property and index.

```javascript
let str = "Hello";

for (let i = 0; i < str.length; i++) {
    console.log(str[i]);
}
```

### Output

```text
H
e
l
l
o
```

---

# 2. for...of Loop

The easiest and most readable way to iterate over a string.

```javascript
let str = "Hello";

for (const ch of str) {
    console.log(ch);
}
```

### Output

```text
H
e
l
l
o
```

---

# 3. Access Character Using Index

You can access characters using square brackets.

```javascript
let str = "JavaScript";

console.log(str[0]);
console.log(str[4]);
console.log(str[20]);
```

### Output

```text
J
S
undefined
```

---

# 4. Access Character Using charAt()

`charAt()` returns the character at a given index.

```javascript
let str = "JavaScript";

console.log(str.charAt(0));
console.log(str.charAt(4));
console.log(str.charAt(20));
```

### Output

```text
J
S

```

> **Note:** If the index is out of range, `charAt()` returns an **empty string (`""`)**, whereas bracket notation (`str[index]`) returns **`undefined`**.

---

# 5. Difference Between charAt() and []

| Feature            | `charAt()`          | `[]`        |
| ------------------ | --------------------- | ------------- |
| Returns character  | ✅                    | ✅            |
| Out-of-range index | Empty string (`""`) | `undefined` |
| Modern syntax      | ❌ Older              | ✅ Preferred  |

---

# 6. Reverse a String Using Loop

```javascript
let str = "Hello";
let reversed = "";

for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
}

console.log(reversed);
```

### Output

```text
olleH
```

---

# 7. Count Characters

```javascript
let str = "Java";

for (const ch of str) {
    console.log(ch);
}

console.log("Total Characters:", str.length);
```

### Output

```text
J
a
v
a
Total Characters: 4
```

---

# Interview Notes

- Strings are **iterable**.
- Preferred iteration methods:
  - `for...of`
  - Traditional `for` loop
- `for...in` is **not recommended** for strings because it iterates over indexes (property names), not the characters themselves.

Example:

```javascript
let str = "ABC";

for (const index in str) {
    console.log(index, str[index]);
}
```

### Output

```text
0 A
1 B
2 C
```

Although this works, **`for...of` is preferred** because it directly returns the characters.

---

# Summary

| Method            | Returns               | Recommended            |
| ----------------- | --------------------- | ---------------------- |
| `for` loop      | Character using index | ✅ Yes                 |
| `for...of`      | Character             | ⭐ Best                |
| `for...in`      | Index                 | ⚠️ Avoid for strings |
| `charAt(index)` | Character             | Legacy                 |
| `str[index]`    | Character             | ✅ Modern              |
