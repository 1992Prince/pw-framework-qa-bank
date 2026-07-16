
# Sort an Array of 0's, 1's and 2's (Counting Approach)

## Problem Statement

Given an array containing only `0`, `1`, and `2`, sort the array in ascending order **without using any built-in sorting methods**.

### Example

**Input**

```javascript
[0, 1, 2, 0, 1, 2, 1, 0]
```

**Output**

```javascript
[0, 0, 0, 1, 1, 1, 2, 2]
```

---

## Approach (Counting/Frequency Counting)

Since the array contains only three distinct values (`0`, `1`, and `2`), we can:

1. Traverse the array once and count the number of:
   - `0`s
   - `1`s
   - `2`s
2. Traverse the array again and overwrite:
   - First `zeroCount` elements with `0`
   - Next `oneCount` elements with `1`
   - Remaining elements with `2`

This avoids comparison-based sorting and makes the solution very efficient.

---

## Dry Run

Array:

```javascript
[0, 1, 2, 0, 1, 2, 1, 0]
```

### Step 1: Count the occurrences

```
zeroCount = 3
oneCount = 3
twoCount = 2
```

### Step 2: Overwrite the array

Fill first 3 positions with `0`:

```javascript
[0, 0, 0, _, _, _, _, _]
```

Fill next 3 positions with `1`:

```javascript
[0, 0, 0, 1, 1, 1, _, _]
```

Fill remaining positions with `2`:

```javascript
[0, 0, 0, 1, 1, 1, 2, 2]
```

---

## Solution

```javascript
function sortArr(arr) {

    let zeroCount = 0;
    let oneCount = 0;
    let twoCount = 0;

    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 0) {
            zeroCount++;
        } else if (arr[i] === 1) {
            oneCount++;
        } else {
            twoCount++;
        }
    }

    // Fill 0's
    for (let i = 0; i < zeroCount; i++) {
        arr[i] = 0;
    }

    // Fill 1's
    for (let i = zeroCount; i < zeroCount + oneCount; i++) {
        arr[i] = 1;
    }

    // Fill 2's
    for (let i = zeroCount + oneCount; i < zeroCount + oneCount + twoCount; i++) {
        arr[i] = 2;
    }

    return arr;
}

console.log(sortArr([0, 1, 2, 0, 1, 2, 1, 0]));
```

### Output

```javascript
[0, 0, 0, 1, 1, 1, 2, 2]
```

---

## Time Complexity

- **O(n)**

The algorithm traverses the array twice:

- First traversal to count the occurrences.
- Second traversal to overwrite the array.

Overall:

```
O(n) + O(n) = O(n)
```

---

## Space Complexity

- **O(1)**

Only three integer variables (`zeroCount`, `oneCount`, and `twoCount`) are used regardless of the input size.

---

## Interview Note

This is the **Counting Approach**, which is simple and efficient.

Another popular interview solution is the **Dutch National Flag Algorithm**, which sorts the array in **a single traversal** using three pointers (`low`, `mid`, and `high`) while maintaining **O(n)** time and **O(1)** space. Many product-based companies prefer that approach because it requires only one pass through the array.
