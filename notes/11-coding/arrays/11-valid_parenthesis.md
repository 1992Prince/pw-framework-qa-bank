
# Valid Parentheses

## Question

Given a string `s` containing only the characters:

```text
'(', ')', '{', '}', '[' and ']'
```

Determine whether the input string is **valid**.

A string is considered valid if:

- Every opening bracket has a corresponding closing bracket.
- Brackets are closed in the correct order.
- Every closing bracket matches the most recent unmatched opening bracket.

---

## Example 1

**Input**

```text
s = "()"
```

**Output**

```text
true
```

---

## Example 2

**Input**

```text
s = "()[]{}"
```

**Output**

```text
true
```

---

## Example 3

**Input**

```text
s = "(]"
```

**Output**

```text
false
```

---

## Example 4

**Input**

```text
s = "([)]"
```

**Output**

```text
false
```

---

## Example 5

**Input**

```text
s = "{[]}"
```

**Output**

```text
true
```

---

# My Approach (Using Stack)

- Create an array containing all opening brackets.
- Create an empty **Stack**.
- Create a `Map` that stores each opening bracket and its corresponding closing bracket.
- Traverse the string one character at a time.
- If the current character is an **opening bracket**, push it onto the stack.
- Otherwise, it is a **closing bracket**:
  - Pop the top element from the stack.
  - Use the `Map` to get the expected closing bracket for the popped opening bracket.
  - Compare it with the current closing bracket.
  - If they do not match, return `false`.
- After traversing the entire string:
  - If the stack is empty, return `true`.
  - Otherwise, return `false` because some opening brackets are unmatched.

---

# My Solution

```javascript
function isValid(s) {

    let arr = ['(', '{', '['];
    let stack = [];

    let myMap = new Map([
        ['(', ')'],
        ['{', '}'],
        ['[', ']']
    ]);

    for (let ch of s) {

        if (arr.includes(ch)) {

            stack.push(ch);

        } else {

            let top = stack.pop();

            if (myMap.get(top) !== ch) {
                return false;
            }

        }
    }

    return stack.length === 0;
}

console.log(isValid("()"));
console.log(isValid("()[]{}"));
console.log(isValid("(]"));
console.log(isValid("([)]"));
console.log(isValid("{[]}"));
```

---

# Complexity Analysis

### Time Complexity

- The string is traversed only once.

```text
O(N)
```

where `N` is the length of the string.

### Space Complexity

- In the worst case, all opening brackets are stored in the stack.

```text
O(N)
```

---

# Interview Trick 🎯

Whenever you hear:

- Valid Parentheses
- Balanced Brackets
- Matching Brackets
- Nested Brackets

👉 **Think: Stack + Map**

- **Stack** → Keeps track of opening brackets.
- **Map** → Tells which closing bracket should match each opening bracket.

**Memory Trick**

```text
Opening Bracket  → Push
Closing Bracket  → Pop & Compare
Stack Empty at End → Valid
```
