/*
===========================================================================================
1. CREATE MAP WITH INITIAL VALUES
===========================================================================================

The Map constructor accepts an array of key-value pairs.

Syntax
------
new Map([
    [key1, value1],
    [key2, value2],
    [key3, value3]
]);

Each element inside the outer array is itself an array containing:
    [key, value]
*/

let students = new Map([
    ["A", 90],
    ["B", 80],
    ["C", 70]
]);

console.log(students);

/*
Output

Map(3) {
  'A' => 90,
  'B' => 80,
  'C' => 70
}
*/



/*
===========================================================================================
2. ITERATE MAP USING for...of
===========================================================================================

A Map is iterable by default.

When we iterate directly over a Map, each iteration returns one key-value pair
as an array.

Syntax
------
for(let item of map){
    console.log(item);
}
*/

for(let item of students){
    console.log(item);
}

/*
Output

['A', 90]
['B', 80]
['C', 70]

Each item is an array:
[key, value]
*/



/*
===========================================================================================
3. ITERATE USING DESTRUCTURING
===========================================================================================

Since each item is an array [key, value], we can directly destructure it.

Syntax
------
for(let [key, value] of map){
    console.log(key, value);
}
*/

for(let [key, value] of students){
    console.log(key, value);
}

/*
Output

A 90
B 80
C 70
*/



/*
===========================================================================================
4. keys()
===========================================================================================

keys() returns an iterator containing all keys of the Map.

Since the returned iterator is iterable, we can use for...of on it.

Syntax
------
map.keys()
*/

console.log(students.keys());

for(let key of students.keys()){
    console.log(key);
}

/*
Output

A
B
C
*/



/*
===========================================================================================
5. values()
===========================================================================================

values() returns an iterator containing all values of the Map.

Since the returned iterator is iterable, we can use for...of on it.

Syntax
------
map.values()
*/

console.log(students.values());

for(let value of students.values()){
    console.log(value);
}

/*
Output

90
80
70
*/



/*
===========================================================================================
6. entries()
===========================================================================================

entries() returns an iterator containing all key-value pairs.

Each entry is returned as an array:
[key, value]

Note:
Iterating directly over a Map is equivalent to using map.entries().

Both produce the same output.
*/

console.log(students.entries());

for(let entry of students.entries()){
    console.log(entry);
}

/*
Output

['A', 90]
['B', 80]
['C', 70]
*/


// Using destructuring with entries()

for(let [key, value] of students.entries()){
    console.log(key, value);
}

/*
Output

A 90
B 80
C 70
*/



/*
===========================================================================================
7. ARRAY TO MAP
===========================================================================================

The array must contain key-value pairs.

Each element of the array should itself be another array
having exactly two elements:

    [key, value]

The Map constructor converts each inner array into one entry
inside the Map.

Syntax
------
let map = new Map(array);
*/

let arr = [
    ["name", "John"],
    ["age", 30],
    ["city", "Delhi"]
];

let personMap = new Map(arr);

console.log(personMap);

/*
Output

Map(3) {
  'name' => 'John',
  'age' => 30,
  'city' => 'Delhi'
}
*/