
# Remove Duplicates from an Unsorted Array While Maintaining Order

## Problem Statement

Remove duplicates from an **unsorted array**, but maintain the original order of elements.

- If an element appears multiple times, keep only its **first occurrence**.
- Remove all subsequent duplicates.

### Example

```javascript
Input:
[4, 2, 4, 5, 2, 3]

Output:
[4, 2, 5, 3]
```

### Explanation

- `4` first appears at index `0`, so keep it.
- `4` appears again at index `2`, so remove it.
- `2` first appears at index `1`, so keep it.
- `2` appears again later, so remove it.

The final order remains the same as the first occurrence of each element.

---

# Approach 1: Using Set + Single Traversal

### Idea

- Create an empty `Set`.
- Create a new result array.
- Traverse the original array.
- If the element is **not present** in the `Set`:
  - Add it to the `Set`.
  - Push it into the result array.
- If it already exists in the `Set`, simply skip it.

### Why does it work?

- `Set.has()` lookup takes **O(1)** time.
- Array traversal takes **O(n)** time.
- Overall complexity is **O(n)**.

---

## Code

```javascript
function removeDuplicates(arr) {

    let mySet = new Set();
    let result = [];

    for (let i = 0; i < arr.length; i++) {

        // If element is not present in the Set,
        // add it to both Set and result array.
        if (!mySet.has(arr[i])) {
            mySet.add(arr[i]);
            result.push(arr[i]);
        }
    }

    return result;
}

let arr = [4, 2, 4, 5, 2, 3];

console.log(removeDuplicates(arr));
// Output: [4, 2, 5, 3]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |

---

# Approach 2: Using Set Directly

### Idea

JavaScript `Set` automatically removes duplicate values while preserving the insertion order.

So we can:

1. Create a `Set` directly from the array.
2. Convert the `Set` back into an array using the spread operator (`...`).

This automatically removes duplicates while maintaining the order of the first occurrence.

---

## Code

```javascript
function removeDuplicates(arr) {

    let mySet = new Set(arr);

    arr = [...mySet];

    return arr;
}

let arr = [4, 2, 4, 5, 2, 3, 1, 1];

console.log(removeDuplicates(arr));
// Output: [4, 2, 5, 3, 1]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |
