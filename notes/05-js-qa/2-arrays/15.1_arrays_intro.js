//1. creating empty array
let arr1 = [];

//2. creating array with elements
let arr2 = [1, 2, 3, 4, 5];

//3. creating array with Array constructor
let arr3 = new Array(1, 2, 3, 4, 5);

//4. get length of array
let length = arr2.length;

//5. type of array
let type = typeof arr2; // returns 'object'
console.log(type); // 'object'

//6. validating array using Array.isArray()
let isArray = Array.isArray(arr2); // returns true
console.log(isArray); // true

//7. 
console.log(arr1.length); // 0

//8.
let arr4 = [1, 2, 3, 4, 5];
console.log(arr4[arr4.length]); // undefined


/**
 * In JavaScript, an Array is a dynamic, ordered collection of elements that can hold values of different 
 * data types under a single variable
 * 
 * Arrays are dynamic — they can grow or shrink at runtime.
 * They can store mixed data types (numbers, strings, booleans, objects, etc.).
 * They are zero-indexed (first element at index 0).
 * Internally, arrays are objects with numeric keys and a length property.
 * Arrays can be sparse — i.e., some indexes may not exist.
 * Stored in heap memory, as they are reference types.
 * 
 * 
 */

console.log();
console.log();

/**
 * Array Iteration loops and Methods:
 * -> traditional for loop
 * -> for...of loop
 * -> forEach() method
 */

let arr5 = [1, 2, 3, 4, 5];

// traditional for loop
for (let i = 0; i < arr5.length; i++) {
    console.log(arr5[i]);
}

console.log();

// for...of loop
for (let value of arr5) {
    console.log(value);
}

console.log();

// forEach() method
arr5.forEach(value => console.log(value));

console.log();


// Basic Opertation on Arrays

//1. Accessing Elements of an Array
let arr6 = [10, 20, 30, 40, 50];
// arr6.length = 5
console.log(arr6[0]); // Output: 10 // accessing first eleemnt of array
console.log(arr6[arr6.length - 1]); // Output: 50 // accessing last element of array
console.log(arr6[arr6.length]); // undefined // accessing out-of-bounds index


//2.  Modifying the Array Elements
arr6[0] = 100; // modifying first element
arr6[arr6.length - 1] = 500; // modifying last element
console.log(arr6); // Output: [100, 20, 30, 40, 500]


console.log();