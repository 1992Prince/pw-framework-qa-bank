// SORTING ARRAYS WITH PRIMITIVES ELEMENTS

// The sort() method sorts the elements of an array in place (i.e., it modifies the original array).
// By default, it sorts elements as strings in ascending (lexicographical) order.
// Sorts the original array.
// Returns the same array after sorting.
// fruits and sortedFruits point to the same array object


console.log('----------------------------------------');

const fruits = ["banana", "apple", "cherry", "mango"];
const sortedFruits = fruits.sort();
console.log(sortedFruits); // [ 'apple', 'banana', 'cherry', 'mango' ]
console.log(fruits);       // [ 'apple', 'banana', 'cherry', 'mango' ] (original modified)
console.log(sortedFruits === fruits); // true (both point to the same array object)

// but if you want to sort numbers, you need to provide a compare function to the sort() method.
// bcoz by default, sort() method converts numbers to strings and then compares.

// Ascending Order:
const nums = [10, 1, 20, 2, 5];
nums.sort((a, b) => a - b);
console.log(nums); // [ 1, 2, 5, 10, 20 ]


// Descending Order:
const numsDesc = [10, 1, 20, 2, 5];
numsDesc.sort((a, b) => b - a);
console.log(numsDesc); // [ 20, 10, 5, 2, 1 ]

console.log();


// SORTING ARRAYS WITHOUT MODIFYING THE ORIGINAL ARRAY
// TOSORTED:
// Creates a new sorted array.
// Original array remains unchanged.

const arr = [30, 10, 20];

const sorted = arr.toSorted((a, b) => a - b);

console.log(sorted); // [10, 20, 30]
console.log(arr);    // [30, 10, 20] (original unchanged)
console.log(sorted === arr); // false (different array objects)


