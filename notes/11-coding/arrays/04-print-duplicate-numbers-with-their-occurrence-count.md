
# Print Duplicate Numbers with Their Occurrence Count

## Problem Statement

Given an array, print all duplicate numbers along with the number of times they occur.

Only elements whose frequency is greater than `1` should be printed.

### Example

```javascript
Input:
[1, 2, 3, 2, 4, 5, 1, 1]
```

### Output

```text
1 --> 3
2 --> 2
```

### Explanation

- `1` appears **3** times.
- `2` appears **2** times.
- All other elements appear only once, so they are not printed.

---

# Approach: Using Map (Frequency Count)

### Idea

We will use a `Map` to store the frequency of each element.

### Algorithm

1. Create an empty `Map`.
2. Traverse the array.
3. For every element:
   - If it already exists in the map, increment its count.
   - Otherwise, insert it into the map with frequency `1`.
4. Traverse the map.
5. Print only those elements whose frequency is greater than `1`.

---

## Dry Run

Input

```javascript
[1, 2, 3, 2, 4, 5, 1, 1]
```

### Step 1: Count Frequency

After traversing the array, the map becomes:

```text
1 → 3
2 → 2
3 → 1
4 → 1
5 → 1
```

### Step 2: Print Duplicates

Traverse the map.

- `1` → Frequency = 3 ✅ Print
- `2` → Frequency = 2 ✅ Print
- `3` → Frequency = 1 ❌ Skip
- `4` → Frequency = 1 ❌ Skip
- `5` → Frequency = 1 ❌ Skip

Output

```text
1 --> 3
2 --> 2
```

---

## Code

```javascript
function findDuplicatesWithOccurences(arr) {

    let map = new Map();

    // Count the frequency of each element
    for (let i = 0; i < arr.length; i++) {

        if (map.has(arr[i])) {
            map.set(arr[i], map.get(arr[i]) + 1);
        } else {
            map.set(arr[i], 1);
        }
    }

    // Print only duplicate elements with their occurrence count
    for (let [key, value] of map) {

        if (value > 1) {
            console.log(key, " --> ", value);
        }
    }
}

let arr = [1, 2, 3, 2, 4, 5, 1, 1];

findDuplicatesWithOccurences(arr);
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |

### Why?

- The first traversal counts the frequency of each element in **O(n)** time.
- The second traversal iterates through the map, which contains at most `n` unique elements, so it also takes **O(n)** in the worst case.
- Therefore, the overall time complexity is **O(n)**.
- The map stores the frequency of each unique element, requiring **O(n)** extra space in the worst case.
