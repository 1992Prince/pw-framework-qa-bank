/**
find() vs some() vs every()

"These three methods are used to check conditions on array elements, but they return different things.

- find(): is used when I need the first element that satisfies a condition. 
          It returns the element itself, and if nothing matches, it returns undefined.
- some(): is used when I only want to know whether at least one element satisfies the condition. 
          It returns true or false.
- every(): is used when I want to verify that all elements satisfy a condition. 
           It also returns true or false, but it returns true only if every element matches."

           🔥 One-liner to remember

          find() returns the first matching element, 
          some() checks if any element matches, and 
          every() checks if all elements match.
 */


/**
flat() vs flatMap()

"Both methods deal with nested arrays, but they solve different problems.

- flat(): is used when I already have a nested array and simply want to remove the nesting. 
         It doesn't transform the elements; it only flattens the array.

- flatMap(): is used when I first want to transform each element using map() and then automatically 
             flatten one level of nesting. It's equivalent to writing map().flat()

- flat and flatMap both return new arrays and do not modify the original array.
 */

/*
==========================================
Array.find()
==========================================

Definition:
- Returns the FIRST element that satisfies the given condition.
- Stops searching as soon as a match is found.
- Returns undefined if no element matches.

Example:
*/

const numbers = [5, 10, 15, 20];

const result = numbers.find(num => num > 10);

console.log(result); // 15

/*
Key Points:
- Returns the element, NOT a boolean.
- Returns only the first matching element.
- Stops iterating after finding the first match.
*/


/*
==========================================
Array.some()
==========================================

Definition:
- Checks whether AT LEAST ONE element satisfies the condition.
- Returns true or false.
- Stops as soon as it finds the first matching element.

Example:
*/

const numbers = [5, 10, 15, 20];

const result = numbers.some(num => num > 18);

console.log(result); // true

/*
Key Points:
- Returns a boolean.
- Returns true if any one element matches.
- Returns false if none match.
- Stops iterating after first successful match.
*/


/*
==========================================
Array.every()
==========================================

Definition:
- Checks whether ALL elements satisfy the condition.
- Returns true only if every element matches.
- Stops immediately when it finds the first element that fails.

Example:
*/

const numbers = [5, 10, 15, 20];

const result = numbers.every(num => num > 0);

console.log(result); // true

/*
Key Points:
- Returns a boolean.
- Returns true only if every element passes.
- Returns false if even one element fails.
- Stops iterating after the first failure.
*/



/*
==========================================
Array.flat()
==========================================

Definition:
- Suppose you have a nested array (an array containing other arrays).
- The flat() method converts the nested array into a single flat array by removing the nesting.
- By default, flat() removes only ONE level of nesting.
- You can pass a number as an argument to specify how many levels of nesting should be flattened.
- If you don't know the nesting depth, pass Infinity to flatten all nested levels.
- flat() returns a new array and does NOT modify the original array.

Example 1: Default (Flatten One Level)
*/

const arr = [1, 2, [3, 4], [5, 6]];

const result = arr.flat();

console.log(result);
// [1, 2, 3, 4, 5, 6]

console.log(arr);
// [1, 2, [3, 4], [5, 6]]

/*
Example 2: Flatten All Levels
*/

const nested = [1, [2, [3, [4, [5]]]]];

const result2 = nested.flat(Infinity);

console.log(result2);
// [1, 2, 3, 4, 5]

console.log(nested);
// [1, [2, [3, [4, [5]]]]]




/*
==========================================
Array.flatMap()
==========================================

Definition:
- The flatMap() method first performs a map() operation on each element.
- After mapping, it automatically performs flat(1), i.e., it flattens one level of nesting.
- It is equivalent to:
      array.map(...).flat()
- It is useful when each element needs to be transformed into an array and then merged into a single array.
- flatMap() returns a new array and does NOT modify the original array.
- flatMap() always flattens only ONE level. If you need deeper flattening, use map() followed by flat(depth).

Example 1: Duplicate Each Element
*/