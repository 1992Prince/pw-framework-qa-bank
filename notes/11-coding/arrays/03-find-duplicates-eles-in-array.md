
# Find Duplicate Elements in an Array

## Problem Statement

Given an array, find all elements that appear more than once.

Each duplicate element should be returned **only once**.

### Example

```javascript
Input:
[1, 2, 3, 2, 4, 5, 1]

Output:
[1, 2]
```

### Explanation

- `1` appears **2** times.
- `2` appears **2** times.
- All other elements appear only once.

Therefore, the duplicate elements are:

```javascript
[1, 2]
```

---

# Approach: Using Map (Frequency Count)

### Idea

We will use a `Map` to store the frequency of each element.

### Algorithm

1. Create an empty `Map`.
2. Traverse the array.
3. For every element:
   - If it already exists in the map, increment its count.
   - Otherwise, insert it with frequency `1`.
4. Traverse the map.
5. If the frequency of an element is greater than `1`, add it to the result array.

---

## Dry Run

Input

```javascript
[1, 2, 3, 2, 4, 5, 1]
```

### Step 1: Count Frequency

After traversing the array, the map becomes:

```text
1 → 2
2 → 2
3 → 1
4 → 1
5 → 1
```

### Step 2: Find Duplicates

Traverse the map.

- `1` → Frequency = 2 ✅ Add to result.
- `2` → Frequency = 2 ✅ Add to result.
- `3` → Frequency = 1 ❌ Skip.
- `4` → Frequency = 1 ❌ Skip.
- `5` → Frequency = 1 ❌ Skip.

Result:

```javascript
[1, 2]
```

---

## Code

```javascript
function findDuplicates(arr) {

    let map = new Map();
    let dupArr = [];

    // Count frequency of each element
    for (let i = 0; i < arr.length; i++) {

        if (map.has(arr[i])) {
            map.set(arr[i], map.get(arr[i]) + 1);
        } else {
            map.set(arr[i], 1);
        }
    }

    // Collect duplicate elements
    for (let [key, value] of map) {

        if (value > 1) {
            dupArr.push(key);
        }
    }

    return dupArr;
}

let arr = [1, 2, 3, 2, 4, 5, 1];

console.log(findDuplicates(arr));
// Output: [1, 2]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |

### Why?

- First traversal of the array takes **O(n)**.
- Traversing the map takes **O(k)**, where `k` is the number of unique elements (at most `n`).
- Therefore, the overall time complexity is **O(n)**.
- The map stores the frequency of each unique element, requiring **O(n)** extra space in the worst case.
