
# Print the Unique Numbers in an Array

## Problem Statement

Given an array, print all elements that occur **exactly once**.

### Example

```javascript
Input:
[4, 2, 4, 5, 2, 3]

Output:
[5, 3]
```

### Explanation

Frequency of each element:

```text
4 → 2
2 → 2
5 → 1
3 → 1
```

Only the elements with frequency **1** are considered unique.

Therefore, the output is:

```javascript
[5, 3]
```

---

# Approach: Using Map (Frequency Count)

### Idea

We will solve the problem in two steps:

1. Count the frequency of every element using a `Map`.
2. Traverse the map and collect the elements whose frequency is exactly `1`.

---

## Algorithm

### Step 1

Create an empty `Map`.

Traverse the array and store the frequency of every element.

```text
Element → Frequency
```

---

### Step 2

Create an empty array to store the unique elements.

```javascript
let uniqueElesArr = [];
```

---

### Step 3

Traverse the map.

- If the frequency of an element is exactly `1`, add it to the result array.
- Otherwise, skip it.

---

## Dry Run

Input

```javascript
[4, 2, 4, 5, 2, 3]
```

### Step 1: Build Frequency Map

```text
4 → 2
2 → 2
5 → 1
3 → 1
```

### Step 2: Find Unique Elements

Traverse the map.

```
4 → 2
```

Frequency is not `1`.

Skip.

```
2 → 2
```

Frequency is not `1`.

Skip.

```
5 → 1
```

Frequency is `1`.

Add to result.

```
[5]
```

```
3 → 1
```

Frequency is `1`.

Add to result.

```
[5, 3]
```

Final Answer

```javascript
[5, 3]
```

---

## Code

```javascript
function uniqueElementInArr(arr) {

    let map = new Map();

    // Count the frequency of each element
    for (let i = 0; i < arr.length; i++) {

        if (map.has(arr[i])) {
            map.set(arr[i], map.get(arr[i]) + 1);
        } else {
            map.set(arr[i], 1);
        }
    }

    let uniqueElesArr = [];

    // Collect elements that occur exactly once
    for (let [key, value] of map) {

        if (value === 1) {
            uniqueElesArr.push(key);
        }
    }

    return uniqueElesArr;
}

let arr = [4, 2, 4, 5, 2, 3];

console.log(uniqueElementInArr(arr));
// Output: [5, 3]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |

### Why?

- The first traversal counts the frequency of each element in **O(n)** time.
- The second traversal iterates through the map to collect the unique elements, which also takes **O(n)** in the worst case.
- Therefore, the overall time complexity is **O(n)**.
- The map stores the frequency of each unique element, requiring **O(n)** extra space.
