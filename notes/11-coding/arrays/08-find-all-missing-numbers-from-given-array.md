
# Find All Missing Numbers from a Given Sorted Array
https://www.geeksforgeeks.org/dsa/find-all-missing-numbers-from-a-given-sorted-array/

## Question

Given a **sorted array** `arr[]` of `N` integers, find all the missing numbers between the range **[arr[0], arr[N-1]]**.

### Example

**Input**

```text
arr = [6, 7, 10, 11, 13]
```

**Output**

```text
[8, 9, 12]
```

**Explanation**

The numbers `8`, `9`, and `12` are missing between the first and last elements of the array.

---

# My Approach

- Assume the first array element is the current number to check.
- Store it in a variable `missingNum = arr[0]`.
- Create an empty array `missingNumArr` to store all missing numbers.
- Start a loop from the **first array element (`arr[0]`)** till the **last array element (`arr[arr.length - 1]`)**.
  - **Note:** We are looping over the number range, **not** the array length.
- For every iteration:
  - Check whether `missingNum` exists in the array using `arr.includes(missingNum)`.
  - If it does not exist, add it to `missingNumArr`.
- Increment `missingNum` after every iteration.
- Return `missingNumArr` after the loop completes.

---

# My Solution

```javascript
function missingNumbersInArray(arr) {

    let missingNum = arr[0];
    let missingNumArr = [];

    for (let i = arr[0]; i < arr[arr.length - 1]; i++) {

        if (!arr.includes(missingNum)) {
            missingNumArr.push(missingNum);
        }

        missingNum++;
    }

    return missingNumArr;
}

console.log(missingNumbersInArray([1, 2, 4, 6]));
console.log(missingNumbersInArray([6, 7, 10, 11, 13]));
console.log(missingNumbersInArray([1, 2, 5, 6, 7, 10, 11, 12]));
```

---

# Complexity Analysis

### Time Complexity

- The outer loop runs for every number between the first and last element.
- `arr.includes()` takes **O(N)** time.
- Therefore, the overall time complexity is:

```text
O((arr[last] - arr[0]) × N)
```

or simply

```text
O(R × N)
```

where `R` is the range of numbers (`arr[last] - arr[0]`).

### Space Complexity

```text
O(K)
```

where `K` is the number of missing elements stored in the result array.
