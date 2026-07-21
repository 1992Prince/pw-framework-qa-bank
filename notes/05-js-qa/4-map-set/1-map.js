/*****************************************************************************************
 *                               JAVASCRIPT MAP - COMPLETE NOTES
 *****************************************************************************************/

/*
===========================================================================================
1. WHAT IS A MAP?
===========================================================================================

A Map is a built-in JavaScript object that stores data as Key -> Value pairs.

Features
--------
✔ Keys can be of ANY datatype
✔ Maintains insertion order
✔ No duplicate keys
✔ Fast lookup
✔ Iterable
✔ Has built-in methods

Syntax
------
let map = new Map();

*/


/*
===========================================================================================
2. CREATE AN EMPTY MAP
===========================================================================================
*/

let myMap = new Map();

console.log(myMap);     // Map(0) {}
console.log(myMap.size); // 0



/*
===========================================================================================
3. ADD VALUES (set())
===========================================================================================

Syntax
------
map.set(key, value);

If key already exists, value gets updated.
*/

myMap.set("name", "John");
myMap.set("age", 30);
myMap.set("city", "New York");
myMap.set(100, "Hundred");

console.log(myMap);

/*
Output

Map(4) {
 'name' => 'John',
 'age' => 30,
 'city' => 'New York',
 100 => 'Hundred'
}
*/


/*
===========================================================================================
4. GET VALUE (get())
===========================================================================================

Syntax
------
map.get(key)

Returns undefined if key doesn't exist.
*/

console.log(myMap.get("name")); // John
console.log(myMap.get("age")); // 30
console.log(myMap.get(100)); // Hundred
console.log(myMap.get("country")); // undefined



/*
===========================================================================================
5. CHECK IF KEY EXISTS (has())
===========================================================================================
*/

console.log(myMap.has("city"));      // true
console.log(myMap.has("country"));   // false



/*
===========================================================================================
6. UPDATE VALUE
===========================================================================================

Simply call set() again with same key.
*/

myMap.set("age", 35);

console.log(myMap.get("age")); // 35



/*
===========================================================================================
7. DELETE KEY
===========================================================================================

Syntax
------
map.delete(key)

Returns true if deleted.
Returns false if key not found.
*/

myMap.delete("city");

console.log(myMap);

/*
Map(3) {
 'name' => 'John',
 'age' => 35,
 100 => 'Hundred'
}
*/

console.log(myMap.has("city")); // false



/*
===========================================================================================
8. SIZE OF MAP
===========================================================================================
*/

console.log(myMap.size); // 3



/*
===========================================================================================
9. REMOVE EVERYTHING
===========================================================================================

clear()
*/

myMap.clear();

console.log(myMap); // Map(0) {}



/*
===========================================================================================
10. CREATE MAP WITH INITIAL VALUES
===========================================================================================
*/

let employee = new Map([
    ["id", 101],
    ["name", "Alice"],
    ["salary", 90000],
    ["city", "Delhi"]
]);

console.log(employee);

/*
Map(4){
'id' => 101,
'name' => 'Alice',
'salary' => 90000,
'city' => 'Delhi'
}
*/



/*
===========================================================================================
11. MAP CAN HAVE DIFFERENT TYPES OF KEYS
===========================================================================================
*/

let map = new Map();

map.set("name", "John");      // String key
map.set(1, "One");            // Number key
map.set(true, "Yes");         // Boolean key

let obj = {id:101};
map.set(obj, "Employee");

let arr = [1,2,3];
map.set(arr, "Numbers");

console.log(map);

console.log(map.get(obj)); // Employee
console.log(map.get(arr)); // Numbers



/*
===========================================================================================
12. OBJECT AS KEY
===========================================================================================
*/

let user1 = {
    id:1,
    name:"John"
};

let user2 = {
    id:2,
    name:"David"
};

let attendance = new Map();

attendance.set(user1,"Present");
attendance.set(user2,"Absent");

console.log(attendance.get(user1)); // Present
console.log(attendance.get(user2)); // Absent



