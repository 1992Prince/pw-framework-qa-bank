
//***********************
// INCLUDE METHOD: TO CHECK IF AN ELEMENT IS PRESENT IN AN ARRAY
//***********************

// includes method
// Determines whether an array includes a certain element, returning true or false as appropriate.
// @param searchElement — The element to search for.
let num1 = [1,2,3,4,5];
let bool1 = num1.includes(3);
let bool2 = num1.includes(10);
console.log(bool1, bool2); // true false

let arr0 = ['naveen', 'automation', 'labs'];
console.log(arr0.includes('naveen')); // true
console.log(arr0.includes('naveen2')); // false

console.log();

//***********************
// JOIN METHOD: TO JOIN ALL ELEMENTS OF AN ARRAY INTO A STRING
//***********************


// join - join all elemnts of array into a string with a seperator
// Adds all the elements of an array into a string, separated by the specified separator string.
// returns string
let arr1 = ['naveen', 'automation', 'labs'];
let res1 = arr1.join('-'); 
let res2 = arr1.join(':');
let res3 = arr1.join(' ');
console.log(res1, res2, res3); // naveen-automation-labs naveen:automation:labs naveen automation labs

console.log();

//***********************
// TOSTRING METHOD: TO CONVERT ARRAY TO STRING
//***********************


// toString - convert the array to complete comma seperated string
// Returns a string representation of an array.
let arr2 = ['naveen', 'automation', 'labs'];
let res4 = arr2.toString();
console.log(res4); // naveen,automation,labs 

console.log();

//***********************
// AT METHOD: TO RETURN ELEMENTS AT GIVEN INDEX AND SUPPORTS NEGATIVE INDEX
//***********************


// at method - return elements at given index and supports negative index
// Returns the item located at the specified index.
// for index that are not present in array, returns undefined
let num2 = [1,2,3,4,5];
let num2_ele1 = num2.at(2);
let num2_ele2 = num2.at(-1);
let num2_ele3 = num2.at(-3);
let num2_ele4 = num2.at(5); // index not present in array

console.log(num2_ele1, num2_ele2, num2_ele3, num2_ele4); // 3 5 3 undefined