/*
==========================================
Spread Operator (...) - Arrays
==========================================

Definition:
- The spread operator (...) expands (spreads) the elements of an array into
individual elements. 
- It is commonly used to create a copy of an array, merge arrays, or pass array elements as function arguments.

Example:
const arr = [10, 20, 30];
const copy = [...arr];

Important:
- Creates a NEW array.
- Performs a SHALLOW COPY (only one level deep).
- Primitive values (number, string, boolean, etc.) are copied by value.
- Nested objects and nested arrays are NOT copied. Their references are copied,
  so both arrays share the same nested objects/arrays.


Common Uses:
1. Copy an array
   const copy = [...arr];

2. Merge arrays
   const merged = [...arr1, ...arr2];

3. Add elements
   const newArr = [...arr, 40, 50];

4. Pass array elements as function arguments
   Math.max(...arr);
*/



//1. SPREAD OPERATOR - SYNTAX
const arr = [10, 20, 30];
console.log(...arr); // 10 20 30
// ... is called the spread operator.
// It expands (spreads) the array into individual elements
// console.log(...arr) is equivalent to: console.log(10, 20, 30);
// If you wrap the spread elements inside square brackets ([]), JavaScript creates a new array.



//2. CREATING A COPY USING SPREAD OPERATOR
const copy = [...arr];

console.log(copy); // [10, 20, 30]
console.log(arr === copy); // false
// [...] creates a new array containing all elements of arr.
// The spread operator performs a shallow copy (one level deep).
// Arrays are objects (reference types) in JavaScript.
// arr and copy are two different array objects stored at different locations in heap memory.
// Therefore, arr === copy returns false because both variables point to different objects, 
// even though their contents are identical.
// Primitive elements (numbers, strings, booleans) are copied by value, while nested objects/arrays are 
// copied by reference (shallow copy).




//3. MERGE TWO ARRAYS
const frontend = ["HTML", "CSS"];
const backend = ["Node.js", "Express"];

const fullStack = [...frontend, ...backend];

console.log(fullStack);
// ["HTML", "CSS", "Node.js", "Express"]


//4. ADD ELEMENTS TO AN ARRAY (WITHOUT MODIFYING ORIGINAL)

const numbers = [10, 20, 30];

// Add element at the end
const newNumbers = [...numbers, 40];

console.log(newNumbers);
// [10, 20, 30, 40]

// Original array remains unchanged
console.log(numbers);
// [10, 20, 30]



//5. ADD ELEMENTS AT THE BEGINNING
const numbers = [20, 30, 40];

const newNumbers = [10, ...numbers];

console.log(newNumbers);
// [10, 20, 30, 40]