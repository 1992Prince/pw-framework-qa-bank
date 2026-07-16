
# Find All Pairs with a Given Sum

## Question

Given two **unsorted arrays** `a[]` and `b[]`, and a target sum `x`, find all pairs `(a[i], b[j])` such that:

```text
a[i] + b[j] = x
```

### Note

- Return all valid pairs.
- Pairs should be in **increasing order of the first element** (`a[i]`).

---

## Example

**Input**

```text
target = 9

a = [1, 2, 4, 5, 7]

b = [5, 6, 3, 4, 8]
```

**Output**

```text
(1, 8)
(4, 5)
(5, 4)
```

**Explanation**

The following pairs have a sum equal to `9`:

- `(1, 8)`
- `(4, 5)`
- `(5, 4)`

---

# My Approach (Brute Force)

- Create a `Map` to store the valid pairs.
- Traverse every element of the first array using the outer loop.
- For each element, traverse every element of the second array using the inner loop.
- Check whether the sum of both elements equals the target.
- If the sum matches:
  - Store the pair in the `Map`.
  - Use the element from the first array as the key and the second array element as the value.
- Finally, return all entries from the `Map`.

> Since the first array is traversed from left to right, the pairs are stored in increasing order of the first array element.

---

# My Solution

```javascript
function findSumPairs(arr1, arr2, target) {

    let myMap = new Map();

    for (let i = 0; i < arr1.length; i++) {

        for (let j = 0; j < arr2.length; j++) {

            if (arr1[i] + arr2[j] === target) {
                myMap.set(arr1[i], arr2[j]);
            }

        }
    }

    return myMap.entries();
}

console.log(findSumPairs(
    [1, 2, 4, 5, 7],
    [5, 6, 3, 4, 8],
    9
));
```

---

# Complexity Analysis

### Time Complexity

- Outer loop runs `N` times.
- Inner loop runs `M` times.

**Overall Time Complexity**

```text
O(N × M)
```

where:

- `N` = Size of first array
- `M` = Size of second array

### Space Complexity

- The `Map` stores all valid pairs.

```text
O(K)
```

where `K` is the number of valid pairs.
