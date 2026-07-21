
# JavaScript String Conversions

## String ➜ Array

Using **split()**

```javascript
let str = "apple,banana,mango";

console.log(str.split(","));
```

### Output

```text
['apple','banana','mango']
```

---

## Array ➜ String

### join()

```javascript
let arr = ["apple","banana","mango"];

console.log(arr.join(","));
```

### Output

```text
apple,banana,mango
```

---

### toString()

```javascript
let arr = ["apple","banana","mango"];

console.log(arr.toString());
```

### Output

```text
apple,banana,mango
```

---

## String ➜ Number

Using **Number()**

```javascript
let str = "100";

console.log(Number(str));
console.log(typeof Number(str));
```

### Output

```text
100
number
```

---

## Number ➜ String

Using **String()**

```javascript
let num = 123;

console.log(String(num));
console.log(typeof String(num));
```

### Output

```text
123
string
```

---

## Number ➜ String Using toString()

```javascript
let num = 456;

console.log(num.toString());
console.log(typeof num.toString());
```

### Output

```text
456
string
```

---

# Interview Points

- String is a primitive data type.
- Strings are immutable.
- String methods return new strings.
- `indexOf()` does not support Regular Expressions.
- `search()` supports Regular Expressions.
- `slice()` is preferred over `substr()`.
- `substr()` is deprecated.
- `includes()`, `startsWith()`, and `endsWith()` return boolean values.
- Use `split()` to convert String → Array.
- Use `join()` to convert Array → String.
- Use `Number()` for String → Number conversion.
- Use `String()` or `toString()` for Number → String conversion.
