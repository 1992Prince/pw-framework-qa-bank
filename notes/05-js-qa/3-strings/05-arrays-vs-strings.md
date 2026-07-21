
# JavaScript Arrays vs Strings - Comparison Cheat Sheet

This cheat sheet compares commonly used Array and String operations.

---

# 1. Declaration

| Array             | String            |
| ----------------- | ----------------- |
| `let arr = [];` | `let str = "";` |
| Empty array       | Empty string      |

If the value is not known yet:

```javascript
let arr = undefined;
let str = undefined;
```

or

```javascript
let arr = null;
let str = null;
```

---

# 2. Get Length

Both use the **length** property.

| Array          | String         |
| -------------- | -------------- |
| `arr.length` | `str.length` |

Example

```javascript
let arr = [10,20,30];
let str = "Hello";

console.log(arr.length);
console.log(str.length);
```

Output

```text
3
5
```

---

# 3. Search Methods

| Array             | String                                     |
| ----------------- | ------------------------------------------ |
| `indexOf()`     | `indexOf()`                              |
| `lastIndexOf()` | `lastIndexOf()`                          |
| ❌                | `search()` (supports Regular Expression) |

---

# 4. Find Index of an Element

### Array

```javascript
arr.indexOf(20);
arr.lastIndexOf(20);
```

Returns **-1** if not found.

### String

```javascript
str.indexOf("second");
str.lastIndexOf("second");
str.search("second");
```

Returns **-1** if not found.

---

# 5. Extract a Portion

| Array       | String          |
| ----------- | --------------- |
| `slice()` | `slice()`     |
| ❌          | `substring()` |

Example

```javascript
arr.slice(1,3);

str.slice(1,3);
str.substring(1,3);
```

---

# 6. Check Whether Element Exists

Both use **includes()**.

### Array

```javascript
arr.includes(20);
```

### String

```javascript
str.includes("second");
```

Returns

```text
true
```

or

```text
false
```

---

# 7. Merge / Concatenate

## Array

```javascript
arr1.concat(arr2);

[...arr1, ...arr2];
```

---

## String

```javascript
str1.concat(str2);

str1 + str2;
```

---

# 8. Iteration

| Array              | String             |
| ------------------ | ------------------ |
| Traditional`for` | Traditional`for` |
| `for...of`       | `for...of`       |
| `forEach()`      | ❌ Not Available   |

---

# 9. Get Element at Particular Index

### Array

```javascript
arr.at(2);
```

or

```javascript
arr[2];
```

---

### String

```javascript
str.charAt(2);
```

or

```javascript
str[2];
```

---

# 10. Common String Methods

| Purpose         | Method            |
| --------------- | ----------------- |
| Uppercase       | `toUpperCase()` |
| Lowercase       | `toLowerCase()` |
| String → Array | `split()`       |
| Starts with     | `startsWith()`  |
| Ends with       | `endsWith()`    |
| Replace text    | `replace()`     |
| Remove spaces   | `trim()`        |

---

# 11. Common Array Methods

## Add Elements

```javascript
push()
unshift()
splice()
```

---

## Remove Elements

```javascript
pop()
shift()
splice()
```

---

## Sort

```javascript
sort()
```

---

## Reverse

```javascript
reverse()
```

---

# 12. Conversion

| Conversion      | Method         |
| --------------- | -------------- |
| String → Array | `split()`    |
| Array → String | `join()`     |
| Array → String | `toString()` |

---

# 13. Quick Comparison Table

| Operation         | Array                                   | String                               |
| ----------------- | --------------------------------------- | ------------------------------------ |
| Create            | `[]`                                  | `""`                               |
| Length            | `length`                              | `length`                           |
| Search            | `indexOf()`                           | `indexOf()`                        |
| Last Search       | `lastIndexOf()`                       | `lastIndexOf()`                    |
| Regex Search      | ❌                                      | `search()`                         |
| Extract           | `slice()`                             | `slice()`, `substring()`         |
| Exists            | `includes()`                          | `includes()`                       |
| Merge             | `concat()`, Spread (`...`)          | `concat()`, `+`                  |
| Iterate           | `for`, `for...of`, `forEach()`    | `for`, `for...of`                |
| Get by Index      | `at()`, `[]`                        | `charAt()`, `[]`                 |
| Convert to Array  | ❌                                      | `split()`                          |
| Convert to String | `join()`, `toString()`              | N/A                                  |
| Sort              | `sort()`                              | ❌                                   |
| Reverse           | `reverse()`                           | ❌                                   |
| Add Elements      | `push()`, `unshift()`, `splice()` | ❌                                   |
| Remove Elements   | `pop()`, `shift()`, `splice()`    | ❌                                   |
| Case Conversion   | ❌                                      | `toUpperCase()`, `toLowerCase()` |
| Trim Spaces       | ❌                                      | `trim()`                           |
| Starts With       | ❌                                      | `startsWith()`                     |
| Ends With         | ❌                                      | `endsWith()`                       |
| Replace Text      | ❌                                      | `replace()`                        |

---

# Interview Summary

## Common in Both

- `length`
- `indexOf()`
- `lastIndexOf()`
- `slice()`
- `includes()`
- `concat()`
- Traditional `for`
- `for...of`

---

## String Only

- `search()`
- `substring()`
- `split()`
- `replace()`
- `trim()`
- `startsWith()`
- `endsWith()`
- `toUpperCase()`
- `toLowerCase()`
- `charAt()`

---

## Array Only

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`
- `join()`
- `forEach()`
- `at()`
