
# Highest Occurring Element in an Array

## Problem Statement

Given an array, find the element that occurs the maximum number of times along with its occurrence count.

### Example

```javascript
Input:
[4, 4, 4, 1, 2, 2, 3, 3, 3, 4, 2, 2, 2, 2, 4, 4, 44, 4, 4, 4, 4]
```

### Output

```javascript
[4, 10]
```

### Explanation

Frequency of each element:

```text
1  → 1
2  → 6
3  → 3
4  → 10
44 → 1
```

Since `4` has the highest frequency (`10`), the output is:

```javascript
[4, 10]
```

---

# Approach: Using Map (Frequency Count)

### Idea

We will solve the problem in two steps:

1. Count the frequency of every element using a `Map`.
2. Traverse the map to find the element with the maximum frequency.

---

## Algorithm

### Step 1

Create an empty `Map`.

Traverse the array and store the frequency of each element.

```text
Element → Frequency
```

---

### Step 2

Assume the first element is the highest occurring element.

```javascript
let maxOccuringElement = arr[0];
```

---

### Step 3

Traverse the map.

For every element:

- Compare its frequency with the frequency of the current `maxOccuringElement`.
- If the current frequency is greater, update `maxOccuringElement`.

---

### Step 4

Return:

- Highest occurring element
- Its occurrence count

---

## Dry Run

Input

```javascript
[1, 2, 2, 3, 3, 3, 1, 1, 1]
```

### Step 1: Frequency Map

```text
1 → 4
2 → 2
3 → 3
```

Initially

```javascript
maxOccuringElement = 1
```

Traverse the map:

```
1 → 4
```

Current maximum = 4

```
2 → 2
```

2 < 4

No change.

```
3 → 3
```

3 < 4

No change.

Final Answer

```javascript
[1, 4]
```

---

## Code

```javascript
function highestOccuringElement(arr) {

    let map = new Map();

    // Count the frequency of each element
    for (let i = 0; i < arr.length; i++) {

        if (map.has(arr[i])) {
            map.set(arr[i], map.get(arr[i]) + 1);
        } else {
            map.set(arr[i], 1);
        }
    }

    let maxOccuringElement = arr[0];

    // Find the element with the highest frequency
    for (let [key, value] of map) {

        if (map.get(maxOccuringElement) < value) {
            maxOccuringElement = key;
        }
    }

    return [maxOccuringElement, map.get(maxOccuringElement)];
}

let arr = [4,4,4,1,2,2,3,3,3,4,2,2,2,2,4,4,44,4,4,4,4];

console.log(highestOccuringElement(arr));
// Output: [4, 10]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |

### Why?

- First traversal of the array builds the frequency map in **O(n)** time.
- Second traversal of the map finds the highest occurring element in **O(n)** time in the worst case (when all elements are unique).
- Therefore, the overall time complexity is **O(n)**.
- The map stores the frequency of each unique element, requiring **O(n)** extra space.
