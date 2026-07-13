# Move All Zeros to the End While Maintaining Order

## Problem Statement

Move all `0`s to the end of the array while maintaining the relative order of the non-zero elements.

### Example

```javascript
Input:
[0, 3, 0, 5, 0, 1, 9, 0, 7]

Output:
[3, 5, 1, 9, 7, 0, 0, 0, 0]
```

---

## Requirements

- Single traversal to collect non-zero elements: `O(n)`
- In-place: `O(1)` extra space
- Preserve the order of non-zero elements

---

# Two Pointer Logic

We will use two pointers:

- `i` → Traverses the array from start to end.
- `insertPos` → Points to the index where the next non-zero element should be placed.

### Algorithm

1. Iterate from index `0` to the end of the array.
2. Initialize `insertPos = 0`.
3. Our goal is to move all zeros to the end, so `insertPos` always tells us where the next non-zero element should be placed.

Example:

```javascript
[0, 1, 0, 3, 12]
```

Initially,

```javascript
insertPos = 0;
```

Run a `for` loop from `i = 0` to the end of the array.

For every iteration:

- If `nums[i]` is `0`, simply skip it.
- If `nums[i]` is non-zero:
  - Copy it to `nums[insertPos]`.
  - Increment `insertPos`.

### Understanding the Logic

- `i` automatically increments in every iteration and visits every element.
- `insertPos` increments **only when a non-zero element is found**.
- This means all non-zero elements are copied to the front of the array while maintaining their original order.
- After the traversal is complete, `insertPos` points to the first position where zeros should start.

Finally, fill all remaining positions from `insertPos` to the end of the array with `0`.

---

## Code

```javascript
function moveZeroes(nums) {
  let insertPos = 0; // Position to place the next non-zero element

  // Move all non-zero elements to the front
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[insertPos] = nums[i];
      insertPos++;
    }
  }

  // Fill the remaining positions with zeros
  for (let i = insertPos; i < nums.length; i++) {
    nums[i] = 0;
  }

  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));
// Output: [1, 3, 12, 0, 0]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(1)` |
