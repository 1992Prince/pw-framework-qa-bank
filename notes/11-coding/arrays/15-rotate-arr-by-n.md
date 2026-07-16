
# Right Rotate an Array by N Places (Repeated One-Place Rotation)

## Problem Statement

Given an array and an integer `N`, rotate the array **to the right by N places**.

If `N` is greater than the length of the array, rotate only the required number of times using:

```javascript
N % arrayLength
```

### Example

**Input**

```javascript
arr = [1, 2, 3, 4, 5]
N = 8
```

**Output**

```javascript
[3, 4, 5, 1, 2]
```

---

## Approach

Rotating an array by `N` places is equivalent to rotating it by:

```javascript
N % arr.length
```

because after every complete rotation equal to the array length, the array becomes the same again.

### Steps

1. Find the actual number of rotations:

```javascript
actualRotateCount = N % arr.length
```

2. Repeat the following steps `actualRotateCount` times:
   - Store the last element.
   - Traverse the array from the last index to index `1`.
   - Shift every element one position to the right.

```javascript
arr[i] = arr[i - 1];
```

3. Place the stored last element at index `0`.

This performs one right rotation. Repeating it `N` times gives the final answer.

---

## Dry Run

Array

```javascript
[1, 2, 3, 4, 5]
```

```
N = 8
```

Actual rotations:

```
8 % 5 = 3
```

### Rotation 1

```
[5,1,2,3,4]
```

### Rotation 2

```
[4,5,1,2,3]
```

### Rotation 3

```
[3,4,5,1,2]
```

Final Answer

```javascript
[3,4,5,1,2]
```

---

## Solution

```javascript
function rightRotateByN(arr, n) {

    let actualRotateCount;

    if (n > arr.length) {
        actualRotateCount = n % arr.length;
    } else {
        actualRotateCount = n;
    }

    for (let j = 1; j <= actualRotateCount; j++) {

        let lastEle = arr[arr.length - 1];

        for (let i = arr.length - 1; i > 0; i--) {
            arr[i] = arr[i - 1];
        }

        arr[0] = lastEle;
    }

    return arr;
}

console.log(rightRotateByN([1, 2, 3, 4, 5], 8));
```

### Output

```javascript
[3, 4, 5, 1, 2]
```

---

## Time Complexity

Let:

- `n` = size of the array
- `k` = actual number of rotations (`N % n`)

The array is traversed once for every rotation.

```
Time Complexity = O(n × k)
```

In the worst case:

```
k = n - 1
```

Therefore,

```
Worst Case = O(n²)
```

---

## Space Complexity

```
O(1)
```

Only one temporary variable is used for storing the last element.

---

## Interview Note

This is a straightforward and easy-to-understand solution.

However, it is **not the optimal approach** because the array is shifted one position at a time for every rotation.

The optimal solution uses the **Reversal Algorithm**, which performs the rotation in:

- **Time Complexity:** `O(n)`
- **Space Complexity:** `O(1)`

The reversal algorithm is the approach most interviewers expect for this problem.
