// Array.isArray() method is used to check whether the given value is an array or not. 
// It returns true if the value is an array, otherwise false.


let arr = [1, 2, 3, 4, 5];
console.log(Array.isArray(arr)); // Output: true

let notArr = { name: "John", age: 30 };
console.log(Array.isArray(notArr)); // Output: false