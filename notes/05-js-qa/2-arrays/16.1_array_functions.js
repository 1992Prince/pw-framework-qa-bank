// foreach
// In JS foreach is method not loop but in java it is loop
// foreach, map, filter, reduce accepts callback functions in form of arrow funs
// will not modify the original array

// print each array elements in  - we can use foreach method to iterate the array
let num = [1,2,3,4,5]

num.forEach( ele => console.log(ele));

/**
 * 1
 * 2
 * 3
 * 4
 * 5
 */

// covert each element into Uppercase and print it
let cart = ['samsung', 'imac', 'iphone'];
cart.forEach(ele => console.log(ele.toUpperCase()));
console.log(cart);

// SAMSUNG
// IMAC
// IPHONE
// [ 'samsung', 'imac', 'iphone' ]

// multiple each element by 2 and print in console
let num2 = [1,2,3,4,5]
num2.forEach(num => console.log(num * 2));

/**
 * 2
 * 4
 * 6
 * 8
 * 10
 */

console.log();

//map function - it transform every element of array and returns a new array

// square each element of below array and return new array
let num3 = [1,2,3,4,5];
let newArr1 = num3.map(ele => ele*ele);
console.log(newArr1); // [ 1, 4, 9, 16, 25 ]


// multiply each element by 2 and return new array
let newArr2 = num3.map(ele => ele*2);
console.log(newArr2); // [ 2, 4, 6, 8, 10 ]



//map vs foreach
// foreach don't return new array but map fun will return new array after transaformation
 
// how to find duplicates in array
// how to find frequency of duplicates in array



// filter - accepts callback in arrow fun and return new array with condition
// remove element or modifies them on basis of condition and returns them in new array
let num4 = [1,2,3,4,5,6,7,8,9,10];
let num4_even = num4.filter(ele => ele%2 == 0);
let num4_odd = num4.filter(ele => ele%2 !== 0);
console.log(num4_even, num4_odd); // [ 2, 4, 6, 8, 10 ] [ 1, 3, 5, 7, 9 ]

// filter all numbers greater than 5
let num4_greater_than_5 = num4.filter(ele => ele > 5);
console.log(num4_greater_than_5); // [ 6, 7, 8, 9, 10 ]
console.log(typeof num4_greater_than_5); // object

// practice filter on strings like filter strings that starts with or ends with or contains or
// use map to trnasform each string etc.


// return only names that length are greater than 3
let empNames = ['Uday', 'nitin', 'Tom', 'naveen', 'Poonam', "OM"];
let empNames_result = empNames.filter(ele => ele.length > 3);
console.log(empNames_result); // [ 'Uday', 'nitin', 'naveen', 'Poonam' ]


// can we do multiple filteration and transformation  = YES

// return all products starting from apple
let productnames = ['apple macbook', 'apple iph', 'samsung galaxy', 'canon', 'apple air'];
let eles1= productnames.filter(ele => ele.startsWith('apple'));
console.log(eles1); // [ 'apple macbook', 'apple iph', 'apple air' ]


// return all products starting from apple and have iphone 
// replace that with iphone string and
// then convert it into Uppercase
let eles2= productnames.filter(ele => ele.startsWith('apple'))
                        .filter(ele => ele.includes('iph'))
                        .map(ele => ele.replace('iph', 'iphone'))
                        .map(ele => ele.toUpperCase());
console.log(eles2); // [ 'APPLE IPHONE' ]




// reduce: combine everything into one value and return single value
let numData = [10,20,30,40];
// get sum of all elements in numData
// sum is inital val and n is each element of arry and 0 is initial val of sum
let numData_sum = numData.reduce((sum, n) => sum = sum + n, 0);
console.log(numData_sum); // 100

// get mul of all element
let numData_mul = numData.reduce((mul, n) => mul = mul * n, 1);
console.log(numData_mul); // 240000

// practice reduce with string example that can be asked in interviews

