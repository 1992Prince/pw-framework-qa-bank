
# 6. Find the Most Frequently Occurring Character in a String

### Approach

- Store the frequency of each character in a `Map`.
- Traverse the map and keep track of the character with the highest frequency.
- Return the most frequently occurring character.

## My Solution

```javascript
function mostOccuringChar(str){

   let map1 = new Map();

    for(let char of str){
        if(map1.has(char)){
            map1.set(char, map1.get(char) + 1);
        }else{
            map1.set(char,1);
        }
    }

    let maxOccurChar = str[0];

    for(let [key,val] of map1){
        if(val > map1.get(maxOccurChar)){
            maxOccurChar = key;
        }
    }

    return maxOccurChar;
}

console.log(mostOccuringChar("success"));
console.log(mostOccuringChar("successcpcpcpc"));
```

## Improved Version

```javascript
function mostOccurringChar(str){

    const map = new Map();
    let maxChar = "";
    let maxCount = 0;

    for(const char of str){
        const count = (map.get(char) || 0) + 1;
        map.set(char, count);

        if(count > maxCount){
            maxCount = count;
            maxChar = char;
        }
    }

    return maxChar;
}
```

### Output

```
success -> s
successcpcpcpc -> c
```

---

# 7. Find the Longest Word in a Sentence

### Approach

- Split the sentence into words.
- Compare each word with the current longest word.
- Return the longest word.

## My Solution

```javascript
function longestWord(str){

    let words = str.split(" ");

    let longestWord = words[0];

    for(let word of words){
        if(word.length > longestWord.length){
            longestWord = word;
        }
    }

    return longestWord;
}

console.log(longestWord("Find the Longest Word in a Sentence"));
```

## Improved Version

```javascript
function longestWord(str){
    return str.split(" ").reduce((longest, word) =>
        word.length > longest.length ? word : longest
    );
}
```

### Output

```
Sentence
```

---

# 8. Check if a String is a Pangram

### Approach

- Convert the string to lowercase.
- Check whether all 26 alphabets are present.
- Return `true` if all exist, otherwise `false`.

## My Solution

```javascript
function checkPangram(str){

    const alphabets = [
      'a','b','c','d','e','f','g','h','i','j','k','l','m',
      'n','o','p','q','r','s','t','u','v','w','x','y','z'
    ];

    for(let char of alphabets){
        if(!str.includes(char)){
            return false;
        }
    }

    return true;
}

console.log(checkPangram("The quick brown fox jumps over the lazy dog"));
```

## Improved Version

```javascript
function checkPangram(str){

    str = str.toLowerCase();

    for(let i = 97; i <= 122; i++){
        if(!str.includes(String.fromCharCode(i))){
            return false;
        }
    }

    return true;
}
```

### Output

```
true
```

---

# 9. Capitalize the First Letter of Each Word

### Approach

- Split the sentence into words.
- Capitalize the first character of each word.
- Join the words back into a sentence.

## My Solution

```javascript
function captiliazeFirstChar(str){

    let words = str.split(" ");

    for(let i=0;i<words.length;i++){
        words[i] = words[i][0].toUpperCase() + words[i].substr(1,words.length);
    }

    return words.join(" ");
}

console.log(captiliazeFirstChar("welcome to sdet interview prep"));
```

## Improved Version

```javascript
function capitalizeFirstChar(str){

    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
```

### Output

```
Welcome To SDET Interview Prep
```

> **Note:** Your expected output has typos (`Welcom`, `Interv Prep`). The correct output is shown above.

---

# 10. Count Total Number of Words (Without `split()`)

### Approach

- Count the number of spaces in the sentence.
- Number of words = spaces + 1.
- Assumes there are no leading, trailing, or multiple consecutive spaces.

## My Solution

```javascript
function countWords(str){

    let wordsCount = 0;

    for(let i=0;i<str.length;i++){
        if(str.charAt(i) === ' '){
            wordsCount++;
        }
    }

    return wordsCount + 1;
}

console.log(countWords("SDET interview preparation is important"));
```

## Improved Version

```javascript
function countWords(str){

    let count = 0;
    let inWord = false;

    for(const char of str){

        if(char !== " " && !inWord){
            count++;
            inWord = true;
        }else if(char === " "){
            inWord = false;
        }
    }

    return count;
}
```

### Output

```
5
```

> **Note:** The improved version correctly handles multiple spaces, leading spaces, and trailing spaces.
