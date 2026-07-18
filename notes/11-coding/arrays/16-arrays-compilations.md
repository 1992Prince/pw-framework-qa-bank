
# Q - Find the Largest Element in an Array

## Approach 1 - Using a Loop

```javascript
function largestNum(arr) {

    let max = arr[0];

    for (let num of arr) {
        if (num > max) {
            max = num;
        }
    }

    return max;
}

console.log(largestNum([3, 7, 2, 9, 4]));
```

### Output

```text
9
```

### Explanation

- Assume the first element is the largest.
- Traverse the array.
- If the current element is greater than `max`, update `max`.
- Return the largest element.

**Time Complexity:** `O(n)`
**Space Complexity:** `O(1)`

---

## Approach 2 - Using `Math.max()`

```javascript
function largestNum(arr) {

    return Math.max(...arr);

}

console.log(largestNum([3, 7, 2, 9, 4]));
```

### Explanation

- Spread (`...`) converts the array into individual arguments.
- `Math.max()` returns the largest value.

**Time Complexity:** `O(n)`
**Space Complexity:** `O(n)` (due to spread operator)

---

# Q - Find the Second Largest Element in an Array

## Approach 1 - Using a Loop

```javascript
function secondLargestNum(arr) {

    let max = Math.max(...arr);

    let secondMax = arr[0];

    for (let num of arr) {

        if (num > secondMax && num !== max) {
            secondMax = num;
        }

    }

    return secondMax;
}

console.log(secondLargestNum([3, 7, 2, 9, 4]));
```

### Output

```text
7
```

### Explanation

- Find the largest element.
- Traverse the array again.
- Keep updating `secondMax` only if:
  - the current number is greater than `secondMax`
  - it is not equal to the maximum element.

**Time Complexity:** `O(n)`
**Space Complexity:** `O(1)`

---

## Approach 2 - Sort the Array

```javascript
function secondLargestNum(arr) {

    arr.sort((a, b) => a - b);

    return arr[arr.length - 2];

}

console.log(secondLargestNum([3, 7, 2, 9, 4]));
```

### Explanation

- Sort the array in ascending order.
- The second last element will be the second largest.

**Time Complexity:** `O(n log n)`**Space Complexity:** `O(1)` (sorting is in-place)

> **Note:** This approach modifies the original array.

---

# Q - Check if an Array is Sorted

```javascript
function isArrSorted(arr) {

    for (let i = 0; i < arr.length - 1; i++) {

        if (arr[i] <= arr[i + 1]) {
            continue;
        } else {
            return false;
        }

    }

    return true;
}

console.log(isArrSorted([3, 7, 2, 9, 4]));
console.log(isArrSorted([1, 2, 3, 4, 5]));
console.log(isArrSorted([1, 3, 2]));
```

### Output

```text
false
true
false
```

### Explanation

- Compare every element with its next element.
- If any element is greater than the next one, the array is not sorted.
- Otherwise return `true`.

**Time Complexity:** `O(n)`
**Space Complexity:** `O(1)`

---

# Q - Swap Two Variables Without Using a Temporary Variable

```javascript
let a = 5;
let b = 100;

a = a + b;
b = a - b;
a = a - b;

console.log("a -->", a);
console.log("b -->", b);
```

### Output

```text
a --> 100
b --> 5
```

### Explanation

- Add both numbers.
- Recover the first number using subtraction.
- Recover the second number using subtraction again.

**Time Complexity:** `O(1)`**Space Complexity:** `O(1)`

> **Modern JavaScript Alternative**

```javascript
[a, b] = [b, a];
```

This is the cleanest and most preferred approach in modern JavaScript.

---

# Q - Print a Solid Square Pattern of Stars

### Pattern

```text
* * * *
* * * *
* * * *
* * * *
```

### Rule

- Outer loop → Number of rows.
- Inner loop → Number of columns.
- Inner loop is responsible for printing the stars.

### Code

```javascript
for (let i = 0; i < 4; i++) {

    let pattern = "";

    for (let j = 0; j < 4; j++) {
        pattern += "* ";
    }

    console.log(pattern);
}
```

### Explanation

- Outer loop runs 4 times (rows).
- Inner loop prints 4 stars in each row.

---

# Q - Print a Right-Angled Triangle Star Pattern

### Pattern

```text
*
* *
* * *
* * * *
```

### Code

```javascript
for (let i = 0; i < 4; i++) {

    let pattern = "";

    for (let j = 0; j <= i; j++) {
        pattern += "* ";
    }

    console.log(pattern);
}
```

### Explanation

- Outer loop controls the rows.
- Inner loop runs from `0` to `i`.
- Each row prints one more star than the previous row.

---

# Q - Print an Inverted Right-Angled Triangle Star Pattern

### Pattern

```text
* * * *
* * *
* *
*
```

### Code

```javascript
for (let i = 0; i < 4; i++) {

    let pattern = "";

    for (let j = i; j < 4; j++) {
        pattern += "* ";
    }

    console.log(pattern);
}
```

### Explanation

- Outer loop controls the rows.
- Inner loop starts from the current row index.
- The number of stars decreases by one in every row.

---

## Pattern Programming Tip

For most star pattern questions:

- **Outer loop** → Controls the number of **rows**.
- **Inner loop** → Controls the number of **columns** (or stars/spaces printed in each row).
- Build the pattern in a string, then print it using `console.log(pattern)`.
