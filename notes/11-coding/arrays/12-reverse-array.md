
# Reverse an Array (Two Pointer Approach)

## Problem Statement

Given an array, reverse its elements **in-place** without using any built-in methods like `reverse()`.

### Example

**Input**

```javascript
[1, 2, 3, 4, 5]
```

**Output**

```javascript
[5, 4, 3, 2, 1]
```

---

## Approach (Two Pointer)

The idea is to use **two pointers**:

- One pointer (`i`) starts from the **beginning** of the array.
- Another pointer (`j`) starts from the **end** of the array.
- Swap the elements at both pointers.
- Move `i` one step forward (`i++`) and `j` one step backward (`j--`).
- Continue until both pointers meet or cross each other.

This approach reverses the array **in-place**, meaning no extra array is required.

### Dry Run

Array:

```javascript
[1, 2, 3, 4, 5]
```

| i | j | Swap   | Array           |
| - | - | ------ | --------------- |
| 0 | 4 | 1 ↔ 5 | [5, 2, 3, 4, 1] |
| 1 | 3 | 2 ↔ 4 | [5, 4, 3, 2, 1] |
| 2 | 2 | Stop   | [5, 4, 3, 2, 1] |

---

## Solution

```javascript
function arrayReversal(arr) {

    for (let i = 0, j = arr.length - 1; i < j; i++, j--) {

        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

    }

    return arr;
}

console.log(arrayReversal([1, 2, 3, 4, 5]));
```

### Output

```javascript
[5, 4, 3, 2, 1]
```

---

## Time Complexity

- **O(n)**

Although there are two pointers, each element is swapped at most once. The loop runs approximately **n/2** times, which simplifies to **O(n)**.

---

## Space Complexity

- **O(1)**

The algorithm performs the reversal in-place and only uses one temporary variable for swapping, so no additional space proportional to the input size is required.
