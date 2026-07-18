# 1. Count Frequency of Each Character

### Approach

- Create a `Map` to store the frequency of each character.
- Traverse the string and update the count for each character.
- Iterate through the map and print every character with its frequency.

## My Solution

```javascript
function countOccurences(str){

    let map = new Map();

    for(let i=0;i<str.length;i++){
        if(map.has(str.charAt(i))){
            map.set(str.charAt(i), map.get(str.charAt(i)) + 1);
        }else{
            map.set(str.charAt(i), 1);
        }
    }

    for(let [key,val] of map){
        console.log(key," --> ",val);
    }
}

countOccurences("aaaabbbbbccccddd");
```

## Improved Version

```javascript
function countOccurrences(str) {

    const map = new Map();

    for (const char of str) {
        map.set(char, (map.get(char) || 0) + 1);
    }

    for (const [key, value] of map) {
        console.log(key, "-->", value);
    }
}

countOccurrences("aaaabbbbbccccddd");
```

### Output

```
a --> 4
b --> 5
c --> 4
d --> 3
```

### Time Complexity

**O(n)**

### Space Complexity

**O(n)**

---

# 2. Count the Number of Duplicate Words in a Given Sentence

### Approach

- Split the sentence into individual words.
- Store each word and its frequency in a `Map`.
- Print only the words whose frequency is greater than 1.

## My Solution

```javascript
function duplicateOccurences(str){

    let words = str.split(" ");

    let map = new Map();

    for(let word of words){
        if(map.has(word)){
            map.set(word, map.get(word) + 1);
        }else{
            map.set(word, 1);
        }
    }

    for(let [key,val] of map){
       if(val > 1){
            console.log(key," --> ",val);
       }
    }
}

duplicateOccurences("Java is great and Java is powerful");
```

## Improved Version

```javascript
function duplicateOccurrences(str){

    const map = new Map();

    for(const word of str.split(" ")){
        map.set(word, (map.get(word) || 0) + 1);
    }

    for(const [word, count] of map){
        if(count > 1){
            console.log(word, "-->", count);
        }
    }
}

duplicateOccurrences("Java is great and Java is powerful");
```

### Output

```
Java --> 2
is --> 2
```

### Time Complexity

**O(n)**

### Space Complexity

**O(n)**

---

# 3. Find the First Non-Repeating Character in a String

### Approach

- Count the frequency of every character using a `Map`.
- Traverse the string again.
- Return the first character whose frequency is 1.

## My Solution

> **Issue:** This solution prints **all** non-repeating characters instead of the **first** one. Also, the `words` variable is unused.

```javascript
function nonRepeatingCharacter(str){

    let words = str.split(" ");

    let map = new Map();

    for(let char of str){
        if(map.has(char)){
            map.set(char, map.get(char) + 1);
        }else{
            map.set(char, 1);
        }
    }

    for(let [key,val] of map){
       if(val === 1){
            console.log(key," --> ",val);
       }
    }
}

nonRepeatingCharacter("aabbccdeff");
```

## Improved Version

```javascript
function firstNonRepeatingCharacter(str){

    const map = new Map();

    for(const char of str){
        map.set(char, (map.get(char) || 0) + 1);
    }

    for(const char of str){
        if(map.get(char) === 1){
            return char;
        }
    }

    return null;
}

console.log(firstNonRepeatingCharacter("aabbccdeff"));
```

### Output

```
d
```

### Time Complexity

**O(n)**

### Space Complexity

**O(n)**

---

# 4. Check if Two Strings are Anagrams

## Approach

- Convert both strings to lowercase.
- Compare the frequency of every character.
- If all frequencies match, both strings are anagrams.

## My Solution (Sorting)

```javascript
function checkAnagram(str1, str2){

    let str1Chars = str1.toLowerCase().split("");
    let str2Chars = str2.toLowerCase().split("");

    str1Chars.sort();
    str2Chars.sort();

    for(let i=0;i<str1Chars.length;i++){
        if(str1Chars[i] !== str2Chars[i]){
            return false;
        }
    }

    return true;
}

console.log(checkAnagram("listen", "silent"));
```

## My Solution (Using Two Maps)

```javascript
function checkAnagram(str1, str2){

    let map1 = new Map();
    let map2 = new Map();

    for(let char of str1){
        if(map1.has(char)){
            map1.set(char, map1.get(char) + 1);
        }else{
            map1.set(char,1);
        }
    }

    for(let char of str2){
        if(map2.has(char)){
            map2.set(char, map2.get(char) + 1);
        }else{
            map2.set(char,1);
        }
    }

    if(map1.size === map2.size){
        for(let [key,val] of map1){
            if(val !== map2.get(key)){
                return false;
            }
        }
    }

    return true;
}

console.log(checkAnagram("listen", "silent"));
```

## Improved Version (Single Map - Recommended)

```javascript
function checkAnagram(str1, str2){

    if(str1.length !== str2.length){
        return false;
    }

    const map = new Map();

    for(const char of str1.toLowerCase()){
        map.set(char, (map.get(char) || 0) + 1);
    }

    for(const char of str2.toLowerCase()){

        if(!map.has(char)){
            return false;
        }

        map.set(char, map.get(char) - 1);

        if(map.get(char) === 0){
            map.delete(char);
        }
    }

    return map.size === 0;
}

console.log(checkAnagram("listen", "silent"));
```

## Shortest Version

```javascript
const checkAnagram = (str1, str2) =>
    str1.toLowerCase().split("").sort().join("") ===
    str2.toLowerCase().split("").sort().join("");

console.log(checkAnagram("listen", "silent"));
```

### Output

```
true
```

### Time Complexity

- Sorting Approach → **O(n log n)**
- Single Map Approach → **O(n)**

### Space Complexity

**O(n)**

---

# 5. Remove Duplicate Characters from a String

### Approach

- Store all characters in a `Set`.
- A `Set` automatically removes duplicate values.
- Convert the `Set` back to a string.

## My Solution

```javascript
function removesDuplicates(str){

    let strChars = str.split("");

    let mySet = new Set(strChars);

    let strWithoutDup = "";

    for(let char of mySet){
        strWithoutDup += char;
    }

    return strWithoutDup;
}

console.log(removesDuplicates("programming"));
```

## Improved Version

```javascript
function removeDuplicates(str){
    return [...new Set(str)].join("");
}

console.log(removeDuplicates("programming"));
```

### Output

```
progamin
```

### Time Complexity

**O(n)**

### Space Complexity

**O(n)**
