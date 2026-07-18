
# Q - Check if a string contains only digits (Validate Numeric String)

### Examples

```text
"123456"  -> true
"123a56"  -> false
```

---

## Approach 1 - Using Array

```javascript
function validateDigits(str) {

    let arr = [0,1,2,3,4,5,6,7,8,9];

    for (let char of str) {
        if (!arr.includes(Number(char))) {
            return false;
        }
    }

    return true;
}

console.log(validateDigits("123456"));
console.log(validateDigits("1234a56"));
console.log(validateDigits("123456b"));
console.log(validateDigits("a123456"));
```

### Output

```text
true
false
false
false
```

### Explanation

- Convert each character into a number using `Number(char)`.
- Check whether the converted number exists in the digits array.
- If any character is not a digit, return `false`.
- If all characters are digits, return `true`.

---

## Approach 2 - Using Regular Expression (Recommended)

### Regex Pattern

```javascript
/^[0-9]+$/
```

### Explanation

- Patterns are enclosed within `/ /`.
- Do **not** wrap the pattern in double quotes, otherwise it becomes a string.
- `^` → Start of the string.
- `$` → End of the string.
- `[0-9]` → Matches any digit from 0 to 9.
- `+` → One or more digits.

So,

```javascript
/^[0-9]+$/
```

means:

> The string should contain **only digits (0-9)** from start to end.

### Code

```javascript
function validateDigits(str) {

    let regexPattern = /^[0-9]+$/;

    return regexPattern.test(str);
}

console.log(validateDigits("123456"));
console.log(validateDigits("1234a56"));
console.log(validateDigits("123456b"));
console.log(validateDigits("a123456"));
```

### Output

```text
true
false
false
false
```

---

## Note about `typeof`

Always compare the result of `typeof` with a string.

```javascript
typeof num === "number";
typeof str === "string";
typeof isActive === "boolean";
typeof value === "undefined";
typeof obj === "object";
```

### Important

```javascript
typeof null === "object"; // true
```

Although `null` is a primitive value, `typeof null` returns `"object"` due to a legacy behavior in JavaScript.

---

# Q - Check whether each character in a word is a vowel or a consonant

## Code

```javascript
function validateVowelConsonant(str) {

    let vowels = ['a', 'e', 'i', 'o', 'u'];

    for (let char of str) {

        if (vowels.includes(char.toLowerCase())) {
            console.log(char, "--> vowel");
        } else {
            console.log(char, "--> consonant");
        }

    }
}

validateVowelConsonant("hello");
```

### Output

```text
h --> consonant
e --> vowel
l --> consonant
l --> consonant
o --> vowel
```

### Explanation

- Store all vowels in an array.
- Convert each character to lowercase.
- Use `includes()` to check whether the character exists in the vowels array.
- If it exists, print **vowel**; otherwise, print **consonant**.

> **Note:** Don't use `console.log(validateVowelConsonant("hello"))` because the function doesn't return anything. Calling it with `console.log()` prints `undefined`.
