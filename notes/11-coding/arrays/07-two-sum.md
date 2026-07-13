
# Two Sum

## Problem Statement

Given an array of integers and a target value, find **two numbers whose sum is equal to the target**.

Depending on the question, you may be asked to return:

- The **two elements**, or
- The **indexes** of those two elements.

You may assume that there is exactly **one valid solution**, and the same element cannot be used twice.

---

## Example

```javascript
Input:

arr = [2, 7, 11, 15]
target = 9
```

### Output (Indexes)

```javascript
[0, 1]
```

or

```javascript
[1, 0]
```

(Both represent the same pair.)

### Output (Elements)

```javascript
[2, 7]
```

or

```javascript
[7, 2]
```

### Explanation

```
2 + 7 = 9
```

Therefore, the required pair is:

```
2 and 7
```

whose indexes are:

```
0 and 1
```

---

# Approach: Hashing with Complement

### Idea

For every element, calculate the value required to reach the target.

```
complement = target - currentElement
```

Then check whether this complement has already been seen.

- If yes, we have found our pair.
- Otherwise, store the current element and its index in a `Map`.

Since lookup in a `Map` takes **O(1)** time, the overall solution is **O(n)**.

---

## Algorithm

### Step 1

Create an empty `Map`.

The map will store:

```text
Element → Index
```

---

### Step 2

Traverse the array.

For every element:

```javascript
complement = target - arr[i]
```

---

### Step 3

Check whether the complement already exists in the map.

If it exists:

- Pair found.
- Store the required elements or indexes.

Otherwise:

Store the current element and its index in the map.

---

## Dry Run

Input

```javascript
arr = [2, 7, 11, 15]
target = 9
```

Initially

```
Map = {}
```

### Iteration 1

```
Current element = 2
Complement = 9 - 2 = 7
```

Is `7` present?

```
No
```

Store

```
2 → 0
```

Map

```
{
    2 → 0
}
```

---

### Iteration 2

```
Current element = 7
Complement = 9 - 7 = 2
```

Is `2` present?

```
Yes
```

Pair found.

Elements

```
7 and 2
```

Indexes

```
1 and 0
```

---

## Code

```javascript
function twoSum(arr, target) {

    let map = new Map();
    let arr1 = [];     // Stores the two elements
    let indexes = [];  // Stores the indexes

    for (let i = 0; i < arr.length; i++) {

        let complement = target - arr[i];

        if (!map.has(complement)) {

            map.set(arr[i], i);

        } else {

            arr1.push(arr[i]);
            arr1.push(complement);

            indexes.push(i);
            indexes.push(map.get(complement));
        }
    }

    // If asked to return the elements
    // return arr1;

    // If asked to return the indexes
    return indexes;
}

let arr = [2, 7, 11, 15];

console.log(twoSum(arr, 9));
// Output: [1, 0]
```

---

## Complexity Analysis

| Complexity | Value    |
| ---------- | -------- |
| Time       | `O(n)` |
| Space      | `O(n)` |

### Why?

- We traverse the array only once, so the time complexity is **O(n)**.
- Each lookup and insertion in the `Map` takes **O(1)** average time.
- The map stores at most one entry for each element, requiring **O(n)** extra space.
