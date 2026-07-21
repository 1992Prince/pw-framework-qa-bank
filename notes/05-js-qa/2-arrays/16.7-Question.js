// Interview Question: If an array is declared with const, how can we still use push() or pop()? 
// Doesn't const mean it cannot be modified?

// const protects the VARIABLE (reference), not the OBJECT/ARRAY.

const arr = [1, 2, 3];

// ✅ Allowed: modifying the existing array
arr.push(4);
arr.pop();

console.log(arr); // [1, 2, 3]

// ❌ Not Allowed: assigning a new array
arr = [10, 20, 30]; // TypeError: Assignment to constant variable.

// Remember 💡
// const → Reference cannot change.
// Array contents → Can change.
// Reassigning the array → Not allowed.