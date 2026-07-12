
# Regex (Regular Expression)

## What is Regex?

Regex (Regular Expression) is a **pattern** used to search, match, or validate text inside a string.

We write the pattern between slashes:

```js
/pattern/
```

By default, Regex looks for the **first exact match** in the string and stops there.

```js
let str1 = "I am the best apple";
let r1 = /apple/;

console.log(r1.test(str1)); // true
```

---

## Flags

If you want to change how Regex searches, you add **flags** after the pattern.

```js
/pattern/flags
```

### `g` → Global

Searches the **entire string** and returns **all matches**, not just the first one.

```js
let str1 = "I am the best apple, papple is red appleMP";

let matches = str1.match(/apple/g);

console.log(matches);
// ['apple', 'apple', 'apple']
```

It returns all three matches, including:

- `apple`
- `papple`
- `appleMP`

**Reason:** Regex performs **substring matching** by default. It simply looks for the sequence `"apple"` anywhere inside the string. It doesn't care whether it's a complete word or part of another word.

---

### `i` → Case Insensitive

Ignores uppercase/lowercase differences.

```js
let str1 = "MApple is red, apple is sweet PikaappLe";

let matches = str1.match(/apple/gi);

console.log(matches);
// ['Apple', 'apple', 'appLe']
```

---

# Character Sets

Character sets allow us to define which characters are allowed.

| Pattern         | Meaning                                     |
| --------------- | ------------------------------------------- |
| `[0-9]`       | Any digit                                   |
| `[a-z]`       | Lowercase letters                           |
| `[A-Z]`       | Uppercase letters                           |
| `[a-zA-Z0-9]` | Letters and digits                          |
| `[^0-9]`      | NOT a digit (`^` inside `[]` means NOT) |

Examples:

```js
console.log(/^[0-9]+$/.test("12345")); // true

console.log(/^[a-z]+$/.test("hello")); // true

console.log(/^[^0-9]+$/.test("hello")); // true

console.log(/^[^0-9]+$/.test("hell0")); // false
```

---

# Anchors

Anchors define **where** the pattern should match.

- `^` → Start of string
- `$` → End of string

```js
console.log(/^apple/.test("apple pie")); // true

console.log(/^apple/.test("pie apple")); // false

console.log(/pie$/.test("apple pie")); // true

console.log(/pie$/.test("pie apple")); // false

console.log(/^apple$/.test("apple")); // true

console.log(/^apple$/.test("apple pie")); // false
```

`/^apple$/` means the **entire string** must be exactly `"apple"`.

---

# Quantifiers

Quantifiers tell Regex **how many times the preceding character (or group)** can appear.

> **Important:** A quantifier always applies to the character (or group) immediately before it.

| Quantifier | Meaning         |
| ---------- | --------------- |
| `*`      | 0 or more       |
| `+`      | 1 or more       |
| `{3}`    | Exactly 3       |
| `{2,5}`  | Between 2 and 5 |

Examples:

```js
// * → 0 or more
console.log(/ab*c/.test("ac"));      // true
console.log(/ab*c/.test("abbbc"));   // true

// + → 1 or more
console.log(/ab+c/.test("ac"));      // false
console.log(/ab+c/.test("abc"));     // true

// {3} → exactly 3
console.log(/ab{3}c/.test("abbbc")); // true
console.log(/ab{3}c/.test("abbc"));  // false

// {2,5} → between 2 and 5
console.log(/ab{2,5}c/.test("abbc"));      // true
console.log(/ab{2,5}c/.test("abbbbbc"));   // true
console.log(/ab{2,5}c/.test("abbbbbbc"));  // false
```

---

# Interview Question 1: Check if a String Contains Only Numbers

### Requirement

The string should contain **only digits**.

Examples:

```text
12345    ✅
987654   ✅
12a45    ❌
abc      ❌
```

### Step 1

To match a digit, use:

```js
[0-9]
```

This means **one digit between 0 and 9**.

---

### Step 2

If we write:

```js
/[0-9]/
```

It only checks whether **at least one digit exists somewhere** in the string.

Example:

```text
abc1xyz
```

This still matches because there is a digit.

---

### Step 3

We want the **entire string** to contain only digits.

So we use anchors.

```js
^
```

String must start here.

```js
$
```

String must end here.

Now the pattern becomes:

```js
/^[0-9]$/
```

This only allows **exactly one digit**.

Examples:

```text
5   ✅
55  ❌
```

---

### Step 4

We need **one or more digits**, so add the `+` quantifier.

```js
/^[0-9]+$/
```

Here:

- `^` → Start of string
- `[0-9]` → Any digit
- `+` → One or more digits
- `$` → End of string

Final Regex:

```js
const regex = /^[0-9]+$/;

console.log(regex.test("12345")); // true
console.log(regex.test("123a5")); // false
```

---

# Interview Question 2: Validate an Email

```js
const regex = /^[\w.-]+@[\w-]+\.[a-zA-Z]{2,}$/;
```

**Breakdown:**

- `^[\w.-]+` → Username (letters, digits, `_`, `.`, `-`)
- `@` → Mandatory `@` symbol
- `[\w-]+` → Domain name
- `\.` → Literal dot (`.`)
- `[a-zA-Z]{2,}` → Domain extension (minimum 2 letters like `com`, `in`, `org`)
- `$` → End of string

Examples:

```text
john@gmail.com          ✅
prince.pandey@test.in   ✅

gmail.com               ❌
john@                   ❌
john@gmail              ❌
```
