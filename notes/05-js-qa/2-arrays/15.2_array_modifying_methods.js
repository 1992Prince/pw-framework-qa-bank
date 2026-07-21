// array methods that modify the original array




//1. push(): adding eleements to the end of an array
//   we can add one or more elements to the end of array
//   this modifies the original array and returns the new length of the array
let fruits = ['apple', 'banana', 'orange'];
fruits.push('grape');
console.log(fruits); // ['apple', 'banana', 'orange', 'grape']
let fruitsCount = fruits.push('kiwi', 'mango');
console.log(fruits); // ['apple', 'banana', 'orange', 'grape', 'kiwi', 'mango']
console.log(fruitsCount); // 6

console.log('-----------------------------------');
console.log();

//2. unshift(): adding elements to the beginning of an array
//   we can add one or more elements to the beginning of an array
//   this modifies the original array and returns the new length of the array
let fruits2 = ['apple', 'banana', 'orange'];
let newFruitsCount = fruits2.unshift('strawberry', 'blueberry');
console.log(newFruitsCount); // 5
console.log(fruits2); // ['strawberry', 'blueberry', 'apple', 'banana', 'orange']
fruits2.unshift('kiwi');
console.log(fruits2); // ['kiwi', 'strawberry', 'blueberry', 'apple', 'banana', 'orange']

console.log();

//******************************
// DELETING ELEMENTS FROM AN ARRAY  
//******************************

//3. pop(): removing element from the end of an array
//          pop() can only remove one element at a time from the end of an array
//   this modifies the original array and returns the removed element
let fruits3 = ['apple', 'banana', 'orange'];
let removedFruit = fruits3.pop();
console.log(removedFruit); // 'orange'
console.log(fruits3); // ['apple', 'banana']

console.log();

//4. shift(): removing element from the beginning of an array
//            shift() can only remove one element at a time from the beginning of an array
//   this modifies the original array and returns the removed element
let fruits4 = ['apple', 'banana', 'orange'];
let removedFruit2 = fruits4.shift();
console.log(removedFruit2); // 'apple'
console.log(fruits4); // ['banana', 'orange']


console.log();


//******************************
// MODIFY ARRAY USING SPLICE METHOD
//******************************


//5. Splice method: performs add element from anywhere, remove element from anywhere or
// replace the value from anywhere from array
// syntax: splice(start: number, deleteCount: number)
// 3 parameters of splice: 
// from where to start and then how many elements u want to delete, and then what elements u want to add
// remember we give count of items that need to be deleted and not name of items that we need to delete

let cart = ['imac', 'samsung', 'iphone', 'macbook'];
// below start from 0th index and delete 0 elements(i.e. no elements) and tehn add nothingphone at 0th index
cart.splice(0, 0, 'nothingphone');
// nothingphone will be added at 0th index of array
console.log(cart); // [ 'nothingphone', 'imac', 'samsung', 'iphone', 'macbook' ]

// now add two more products at beg of array

cart.splice(0, 0, 'sofa', 'sofabanket');
console.log(cart); // ['sofa','sofabanket','nothingphone','imac','samsung','iphone','macbook']


// now delete one element from 0th index and add canon element there
let cart2 = ['imac', 'samsung', 'iphone', 'macbook'];
cart2.splice(0, 1, 'canon');
console.log(cart2); // [ 'canon', 'samsung', 'iphone', 'macbook' ]

// now delete 2 elements from 1st index and add 2 element 

let cart3 = ['imac', 'samsung', 'iphone', 'macbook'];
cart3.splice(1, 2, 'canon', 'camera');
console.log(cart3);  // [ 'imac', 'canon', 'camera', 'macbook' ]

// what will be output of cart.splice(0,0) 
// second 0 means don't delete anytging and we don't have any element to add , so array will not 
// be modified and remains same

let cart4 = ['imac', 'samsung', 'iphone', 'macbook'];
cart4.splice(0, 0);
console.log(cart4);  // [ 'imac', 'samsung', 'iphone', 'macbook' ]


// replace all elements of array with single new element 'canon'

let cart5 = ['imac', 'samsung', 'iphone', 'macbook'];
cart5.splice(0, cart5.length, 'canon');
console.log(cart5);  // [ 'canon' ]


// add canon element at last of array and don't delete any element from array

let cart6 = ['imac', 'samsung', 'iphone', 'macbook'];
// cart6.length will return 4 and in 4th index we don't have any elemnet , and canon will be added there
cart6.splice(cart6.length,0, 'canon');
console.log(cart6);  // [ 'imac', 'samsung', 'iphone', 'macbook', 'canon' ]

// replace last element of array with canon
let cart7 = ['imac', 'samsung', 'iphone', 'macbook'];
// arr index starts from 0
// cart6.length will return 4 and in 4th index-1 will have last ele of arry
// , and canon will be added there
cart7.splice(cart7.length-1,1, 'canon');
console.log(cart7);  // [ 'imac', 'samsung', 'iphone', 'canon' ]


console.log();
console.log('-----------------------------------');
console.log();


//******************************
// REVERSE AN ARRAY USING REVERSE METHOD - MODIFIES THE ORIGINAL ARRAY
//******************************

// reverse fun - reverse the mutates the existing array and reverse it
let cart11 = ['imac', 'samsung', 'iphone', 'macbook'];
cart11.reverse();
console.log(cart11); // [ 'macbook', 'iphone', 'samsung', 'imac' ]

console.log();
