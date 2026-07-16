
# Find the Missing Number

## Question

Given an array `arr[]` of size `n - 1` containing **distinct integers** in the range **[1, n]**, the array represents a permutation of numbers from `1` to `n` with **one number missing**. Find the missing number.

### Example 1

**Input**

```text
arr = [8, 2, 4, 5, 3, 7, 1]
```

**Output**

```text
6
```

**Explanation**

All numbers from `1` to `8` are present except `6`.

### Example 2

**Input**

```text
arr = [1, 2, 3, 5]
```

**Output**

```text
4
```

**Explanation**

The array size is `4`, so the expected range is `1` to `5`. The missing number is `4`.

---

# My Approach (Formula Based)

- Calculate the sum of all elements present in the array.
- Since one number is missing, the actual range of numbers is from **1 to n**, where:
  - `n = arr.length + 1`
- Calculate the expected sum of numbers from `1` to `n` using the mathematical formula:
  ```text
  n × (n + 1) / 2
  ```
- Subtract the actual array sum from the expected sum.
- The remaining value is the missing number.

---

# My Solution

```javascript
function missingNumberInArray(arr) {

    // Calculate the sum of array elements
    let arr_sum = arr.reduce((sum, n) => sum + n, 0);

    // Actual range is from 1 to n
    let n = arr.length + 1;

    // Expected sum of numbers from 1 to n
    let expected_sum = (n * (n + 1)) / 2;

    return expected_sum - arr_sum;
}

console.log(missingNumberInArray([1, 2, 4, 5]));
console.log(missingNumberInArray([8, 2, 4, 5, 3, 7, 1]));
```

---

# Complexity Analysis

### Time Complexity

- Calculating the array sum takes **O(N)** time.
- Calculating the expected sum takes **O(1)** time.

**Overall Time Complexity**

```text
O(N)
```

### Space Complexity

No extra data structure is used.

```text
O(1)
```
