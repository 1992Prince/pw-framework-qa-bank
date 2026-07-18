// Q1. Find the sum of all numbers.
const nums = [10, 20, 30, 40, 50];

const sum = nums.reduce((sum, num) => sum + num, 0);
console.log(sum);


// Q2. Add 'grape' to the end and 'orange' to the beginning. Print the final array.
const fruits = ['apple', 'banana', 'mango'];

fruits.push('grape');
fruits.unshift('orange');

console.log(fruits);


// Q3. Create a new array with each number squared.
const nums = [1, 2, 3, 4, 5];

const squaredNums = nums.map(num => num * num);
// or: nums.map(num => num ** 2)

console.log(squaredNums);


// Q4. Convert all names to uppercase.
const names = ['naveen', 'sonu', 'priya'];

const uppercaseNames = names.map(name => name.toUpperCase());

console.log(uppercaseNames);


// Q5. Find the largest and minimum number using Math.max/Math.min.
const nums = [5, 10, 15, 20, 25];

const max = Math.max(...nums);
const min = Math.min(...nums);

console.log(max, min);


// Q6. Filter only the even numbers.
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evenNums = nums.filter(num => num % 2 === 0);

console.log(evenNums);


// Q7. Find how many students passed (passing marks >= 40).
const marks = [45, 78, 32, 89, 56, 90, 22];

const passedCount = marks.filter(mark => mark >= 40).length;

console.log(passedCount);


// Q8. Calculate the average of the array.
const nums = [10, 20, 30, 40, 50];

const sum = nums.reduce((sum, num) => sum + num, 0);
const average = sum / nums.length;

console.log(average);


// Q9. Reverse the array WITHOUT mutating the original.
const arr = [1, 2, 3, 4, 5];

const reversedArr = arr.toReversed();
// Alternative: [...arr].reverse();

console.log(reversedArr);
console.log(arr); // Original array remains unchanged


// Q10. Get only words with length greater than 3.
const words = ['cat', 'elephant', 'dog', 'tiger', 'rat'];

const longWords = words.filter(word => word.length > 3);

console.log(longWords);


// Q11. Remove duplicates from the array.
const nums = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];

const uniqueNums = [...new Set(nums)];

console.log(uniqueNums);


// Q12. Count how many words are in the sentence.
const sentence = 'I love automation testing';

// split method returns an array of words, and we can get the length of that array to count the words.
const wordCount = sentence.split(' ').length;

console.log(wordCount);


// Q13. Find the product of all numbers.
const nums = [1, 2, 3, 4, 5];

const product = nums.reduce((product, num) => product * num, 1);

console.log(product);


// Q14. Find the sum of only odd numbers.
const nums = [10, 25, 30, 45, 50, 65];

const oddSum = nums
    .filter(num => num % 2 !== 0)
    .reduce((sum, num) => sum + num, 0);

console.log(oddSum);


// Q15. Find the second largest number.
// (Recommended approach: sort or two-pointer)

const nums = [12, 45, 78, 23, 89, 6, 34];

const secondLargest = [...nums]
    .sort((a, b) => b - a)[1];

console.log(secondLargest);


// Q16. Reverse the string using array methods.
const str = 'naveen';

const reversedStr = str
    .split('')
    .reverse()
    .join('');

console.log(reversedStr);


// Q17. Flatten this array completely.
const arr = [1, [2, 3], [4, [5, 6]]];

const flatArr = arr.flat(Infinity);

console.log(flatArr);


// Q18. Get only the numbers divisible by both 5 and 2.
const nums = [5, 10, 15, 20, 25, 30];

const divisibleNums = nums.filter(num => num % 10 === 0);

console.log(divisibleNums);


// Q19. Find the sum of squares of even numbers using chaining.
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const sum = arr
    .filter(num => num % 2 === 0)
    .map(num => num * num)
    .reduce((sum, num) => sum + num, 0);

console.log(sum);


// Q20. Count how many times 'apple' appears.
const fruits = ['apple', 'banana', 'mango', 'apple', 'banana', 'apple'];

const appleCount = fruits.filter(fruit => fruit === 'apple').length;

console.log(appleCount);


// Q21. In a single chain - filter numbers greater than 3, double them, and return their sum.
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const sum = nums
    .filter(num => num > 3)
    .map(num => num * 2)
    .reduce((sum, num) => sum + num, 0);

console.log(sum);