// METHODS THAT DO NOT MODIFY THE ORIGINAL ARRAY AND RETURN A NEW ARRAY

// slice - returns copy of section of array
// don't modify existing array
// second param is non inclusive and index param is inclusive
let cart8 = ['imac', 'samsung', 'iphone', 'macbook'];
let newCart = cart8.slice(0, 2);
console.log(newCart); // [ 'imac', 'samsung' ]
console.log(cart8); // [ 'imac', 'samsung', 'iphone', 'macbook' ]

// if u don't give end range then it will go to the end of array
let newCart2 = cart8.slice(0);
console.log(newCart2); // [ 'imac', 'samsung', 'iphone', 'macbook' ]

// slice array from index 2 till last of array
let newCart3 = cart8.slice(2);
console.log(newCart3); // [ 'iphone', 'macbook' ]

// slicing works on negative indexing also
// in array -ve index starts from last with -1
 
//              -4     -3           -2       -1
let cart9 = ['imac', 'samsung', 'iphone', 'macbook'];
// slice last two elements
let cart9_return = cart9.slice(-2);
console.log(cart9_return); // [ 'iphone', 'macbook' ]

// slice last 4 values
let nums = [101, 99, 105, 8, 90, 32, 23, 34]
let nums_arr = nums.slice(-4);
console.log(nums_arr); // [ 90, 32, 23, 34 ]

console.log();

//***********************
// METHODS TO GET INDEX OF ARRAY ELEMENTS
//***********************

// indexOf method - give me the index of specific element in array
// Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
// first occurence of element
let cart12 = ['imac', 'samsung', 'iphone', 'macbook'];
let idx_imac = cart12.indexOf('imac');
let idx_macbook = cart12.indexOf('macbook');
let idx_unknown_ele = cart12.indexOf('naveen');
console.log(idx_imac, idx_macbook, idx_unknown_ele); // 0 3 -1

// get index of second imac element from array
// second occurence of element
let cart13 = ['imac', 'samsung', 'iphone', 'macbook', 'imac', 'nothing', 'imac', 'sodawater'];
// let idx_imac2 = cart13.indexOf('imac', 1); // here we are hardcoding 1
let idx_imac2 = cart13.indexOf('imac', cart13.indexOf('imac')+1); 
console.log(idx_imac2) // 4

// get index of last imac element from array
// third occurence of eleemnt
let idx_imac3 = cart13.indexOf('imac', idx_imac2 + 1); 
console.log(idx_imac3) // 6