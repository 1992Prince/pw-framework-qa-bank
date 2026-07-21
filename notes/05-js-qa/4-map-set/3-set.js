```javascript
/*
===========================================================================================
JAVASCRIPT SET
===========================================================================================

A Set is a built-in JavaScript object that stores only UNIQUE values.

Features
--------
✔ Stores only unique values (duplicates are ignored)
✔ Maintains insertion order
✔ Can store any data type
✔ Iterable using for...of
✔ Fast lookup using has()

Syntax
------
let set = new Set();
*/


/*
===========================================================================================
1. CREATE AN EMPTY SET
===========================================================================================
*/

let numbers = new Set();

console.log(numbers);

/*
Output

Set(0) {}
*/





/*
===========================================================================================
2. CREATE SET WITH INITIAL VALUES
===========================================================================================

The Set constructor accepts an iterable (usually an array).
Duplicate values are automatically removed.
*/

let set1 = new Set([10, 20, 30, 40, 20, 10]);

console.log(set1);

/*
Output

Set(4) {
 10,
 20,
 30,
 40
}
*/





/*
===========================================================================================
3. ADD VALUES
===========================================================================================

Method
------
add(value)

If the value already exists, it is ignored.
*/

let fruits = new Set();

fruits.add("Apple");
fruits.add("Banana");
fruits.add("Mango");

console.log(fruits);

/*
Output

Set(3) {
 'Apple',
 'Banana',
 'Mango'
}
*/


// Duplicate value is ignored

fruits.add("Apple");

console.log(fruits);

/*
Still

Set(3) {
 'Apple',
 'Banana',
 'Mango'
}
*/





/*
===========================================================================================
4. CHECK IF VALUE EXISTS
===========================================================================================

Method
------
has(value)

Returns true or false.
*/

console.log(fruits.has("Apple"));   // true
console.log(fruits.has("Orange"));  // false





/*
===========================================================================================
5. DELETE A VALUE
===========================================================================================

Method
------
delete(value)

Returns true if deleted.
Returns false if value doesn't exist.
*/

fruits.delete("Banana");

console.log(fruits);

/*
Set(2) {
 'Apple',
 'Mango'
}
*/





/*
===========================================================================================
6. SIZE
===========================================================================================

Property
--------
size
*/

console.log(fruits.size); // 2





/*
===========================================================================================
7. REMOVE ALL VALUES
===========================================================================================

Method
------
clear()
*/

fruits.clear();

console.log(fruits);

/*
Set(0) {}
*/





/*
===========================================================================================
8. ITERATION
===========================================================================================

A Set stores only values.

There are NO keys.

Use for...of loop.
*/

let numbers2 = new Set([10, 20, 30, 40]);

for (let value of numbers2) {
    console.log(value);
}

/*
Output

10
20
30
40
*/





/*
===========================================================================================
9. values()
===========================================================================================

Returns an iterator of all values.

Since Set contains only values,
values() returns all values.
*/

for (let value of numbers2.values()) {
    console.log(value);
}

/*
Output

10
20
30
40
*/





/*
===========================================================================================
10. keys()
===========================================================================================

For compatibility with Map,
keys() also returns all values.

In a Set:
key === value
*/

for (let key of numbers2.keys()) {
    console.log(key);
}

/*
Output

10
20
30
40
*/





/*
===========================================================================================
11. entries()
===========================================================================================

entries() returns:

[value, value]

Why?

Because Set has no keys.
To keep the API consistent with Map,
JavaScript returns [value, value].
*/

for (let entry of numbers2.entries()) {
    console.log(entry);
}

/*
Output

[10, 10]
[20, 20]
[30, 30]
[40, 40]
*/


// Using destructuring

for (let [key, value] of numbers2.entries()) {
    console.log(key, value);
}

/*
Output

10 10
20 20
30 30
40 40
*/





/*
===========================================================================================
12. forEach()
===========================================================================================

Syntax
------
set.forEach((value) => {})

Note:
Unlike Map, Set passes the same value twice.

(value, value)
*/

numbers2.forEach(value => {
    console.log(value);
});

/*
Output

10
20
30
40
*/





/*
===========================================================================================
13. ARRAY TO SET
===========================================================================================

Pass an array to the Set constructor.

Duplicate values are removed automatically.
*/

let arr = [1, 2, 3, 2, 1, 4];

let setFromArray = new Set(arr);

console.log(setFromArray);

/*
Output

Set(4) {
 1,
 2,
 3,
 4
}
*/





/*
===========================================================================================
14. SET TO ARRAY
===========================================================================================

Use the spread operator.
*/

let array = [...setFromArray];

console.log(array);

/*
Output

[1, 2, 3, 4]
*/


```
