
# JavaScript String Interview Programs

---

# Q1. Reverse a String

### Example

```text
Input  : "hello"
Output : "olleh"
```

### Solution

```javascript
function reverseStr(str) {
    let revStr = "";

    for (let i = str.length - 1; i >= 0; i--) {
        // Both methods work
        revStr += str.charAt(i);
        // revStr += str[i];
    }

    return revStr;
}

console.log(reverseStr("hello"));
```

**Output**

```text
olleh
```

---

# Q2. Check Whether a String is a Palindrome

> A palindrome is a string that reads the same from both directions.

### Examples

```text
madam  → true
nitin  → true
hello  → false
```

### Solution

```javascript
function isPalindromeStr(str) {
    let revStr = "";

    for (let i = str.length - 1; i >= 0; i--) {
        revStr += str.charAt(i);
    }

    return str === revStr;
}

console.log(isPalindromeStr("hello"));
console.log(isPalindromeStr("madam"));
console.log(isPalindromeStr("nitin"));
```

**Output**

```text
false
true
true
```

---

# Q3. Reverse Each Word While Keeping Word Positions the Same

### Example

```text
Input  : "abc xyz"
Output : "cba zyx"
```

### Solution

```javascript
function reverseWords(str) {
    let strArr = str.split(" ");

    for (let i = 0; i < strArr.length; i++) {
        let revStr = "";

        for (let j = strArr[i].length - 1; j >= 0; j--) {
            revStr += strArr[i].charAt(j);
        }

        strArr[i] = revStr;
    }

    return strArr.join(" ");
}

console.log(reverseWords("abc xyz"));
console.log(reverseWords("hello sir"));
console.log(reverseWords("Let's take LeetCode contest"));
```

**Output**

```text
cba zyx
olleh ris
s'teL ekat edoCteeL tsetnoc
```

---

# Q4. Reverse the Order of Words

### Example

```text
Input  : "abc xyz"
Output : "xyz abc"
```

### Solution

```javascript
function reverseWordsOrder(str) {
    let strArr = str.split(" ");

    strArr.reverse();

    return strArr.join(" ");
}

console.log(reverseWordsOrder("abc xyz"));
console.log(reverseWordsOrder("hello sir"));
console.log(reverseWordsOrder("Let's take LeetCode contest"));
```

**Output**

```text
xyz abc
sir hello
contest LeetCode take Let's
```

---

# Q5. Reverse Alternate Words

### Example

```text
Input  : "I love my country"
Output : "I evol my yrtnuoc"
```

### Solution

```javascript
function reverseAlternateWords(str) {
    let strArr = str.split(" ");

    for (let i = 1; i < strArr.length; i += 2) {
        let revStr = "";

        for (let j = strArr[i].length - 1; j >= 0; j--) {
            revStr += strArr[i].charAt(j);
        }

        strArr[i] = revStr;
    }

    return strArr.join(" ");
}

console.log(reverseAlternateWords("I love my country"));
console.log(reverseAlternateWords("Let's take LeetCode contest"));
```

**Output**

```text
I evol my yrtnuoc
Let's ekat LeetCode tsetnoc
```

---

# Q6. Reverse the Order of Words in a Sentence (Not Letters)

### Example

```text
Input  : "I love Java"
Output : "Java love I"
```

### Solution

```javascript
function reverseWordsOrder(str) {
    let strArr = str.split(" ");
    let revOrder = "";

    for (let i = strArr.length - 1; i >= 0; i--) {
        revOrder += strArr[i];

        if (i > 0) {
            revOrder += " ";
        }
    }

    return revOrder;
}

console.log(reverseWordsOrder("I love Java"));
```

**Output**

```text
Java love I
```

---

# Q7. Count Vowels and Consonants in a Word

### Example

```text
Input  : "education"
Output : Vowels = 5
         Consonants = 4
```

### Solution

```javascript
function countVowelConst(str) {
    const vowels = ['a', 'e', 'i', 'o', 'u'];

    let vowelCount = 0;
    let consonantCount = 0;

    let word = str.toLowerCase();

    for (let ch of word) {
        if (vowels.includes(ch)) {
            vowelCount++;
        } else if (ch >= 'a' && ch <= 'z') {
            consonantCount++;
        }
    }

    console.log(`Vowel Count : ${vowelCount}`);
    console.log(`Consonant Count : ${consonantCount}`);
}

countVowelConst("education");
```

**Output**

```text
Vowel Count : 5
Consonant Count : 4
```
