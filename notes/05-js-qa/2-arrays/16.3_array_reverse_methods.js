//******************************
// REVERSE AN ARRAY USING REVERSE METHOD - MODIFIES THE ORIGINAL ARRAY
//******************************

//1. REVERSE AN ARRAY USING REVERSE METHOD - MODIFIES THE ORIGINAL ARRAY
let cart11 = ['imac', 'samsung', 'iphone', 'macbook'];
cart11.reverse();
console.log(cart11); // [ 'macbook', 'iphone', 'samsung', 'imac' ]

console.log();



//2. REVERSE AN ARRAY WITHOUT MODIFYING THE ORIGINAL (USING TOREVERSED())
const arr = [10, 20, 30, 40];

const reversed = arr.toReversed();

console.log(reversed); // [40, 30, 20, 10]
console.log(arr);      // [10, 20, 30, 40]

console.log();

//3. REVERSE AN ARRAY WITHOUT MODIFYING THE ORIGINAL (WITHOUT TOREVERSED(), USING SPREAD OPERATOR)

const arr = [10, 20, 30, 40];

const reversed = [...arr].reverse();

console.log(reversed); // [40, 30, 20, 10]
console.log(arr);      // [10, 20, 30, 40]

// [...arr] - Creates a shallow copy of the original array.
// reverse() modifies only the copied array, not the original.

console.log();

