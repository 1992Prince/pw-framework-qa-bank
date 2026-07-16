
# Right Rotate an Array by One Place

## Problem Statement

Given an array, rotate it **one position to the right**.

The last element should become the first element, and every other element should shift one position to the right.

### Example

**Input**

```javascript
[1, 2, 3, 4, 5]
```

**Output**

```javascript
[5, 1, 2, 3, 4]
```

---

## Approach

To perform a right rotation by one place:

1. Store the **last element** of the array because it will be overwritten during shifting.
2. Start traversing the array **from the last index down to index `1`**.
3. For every index, shift the previous element to the current position:

```javascript
arr[i] = arr[i - 1];
```

4. After all elements are shifted, place the stored last element at the first position:

```javascript
arr[0] = lastEle;
```

This performs the rotation **in-place** without using any extra array.

---

## Dry Run

Array:

```javascript
[1, 2, 3, 4, 5]
```

Store the last element:

```
lastEle = 5
```

Shift elements from right to left:

| i | Operation       | Array           |
| - | --------------- | --------------- |
| 4 | arr[4] = arr[3] | [1, 2, 3, 4, 4] |
| 3 | arr[3] = arr[2] | [1, 2, 3, 3, 4] |
| 2 | arr[2] = arr[1] | [1, 2, 2, 3, 4] |
| 1 | arr[1] = arr[0] | [1, 1, 2, 3, 4] |

Place the stored last element at index `0`:

```javascript
[5, 1, 2, 3, 4]
```

---

## Solution

```javascript
function rightRotateByOne(arr) {

    let lastEle = arr[arr.length - 1];

    for (let i = arr.length - 1; i > 0; i--) {
        arr[i] = arr[i - 1];
    }

    arr[0] = lastEle;

    return arr;
}

console.log(rightRotateByOne([1, 2, 3, 4, 5]));
```

### Output

```javascript
[5, 1, 2, 3, 4]
```

---

## Time Complexity

- **O(n)**

The array is traversed once while shifting the elements.

---

## Space Complexity

- **O(1)**

Only one extra variable (`lastEle`) is used, so the rotation is performed in-place.
