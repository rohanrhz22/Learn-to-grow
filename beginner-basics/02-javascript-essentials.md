# Lesson 2 — JavaScript Essentials

**Time:** 60 min · **Goal:** Understand variables, data types, operators, conditions, and loops. Enough JS to read any Node tutorial.

> Open VS Code, create a file `basics.js` inside `node-learning/playground/`, and type the examples as you read. Run with: `node basics.js`.

---

## 1. Variables (`let` and `const`)

A variable is a labeled box that holds a value.

```js
let age = 25;              // can change later
const name = "Sandya";     // cannot change (constant)

age = 26;                  // OK
// name = "Other";        // ERROR — const can't be reassigned

console.log(name, age);    // → Sandya 26
```

**Rule of thumb:** use `const` by default. Use `let` only when you know the value will change.

> Avoid `var` — it's the old way and behaves weirdly.

## 2. Data types you'll use 95% of the time

```js
const text     = "hello";        // String
const num      = 42;             // Number
const isReady  = true;           // Boolean (true / false)
const nothing  = null;           // intentional "no value"
const missing  = undefined;      // variable declared but no value
const list     = [1, 2, 3];      // Array
const person   = { name: "S", age: 26 };  // Object
```

Check a type with `typeof`:
```js
console.log(typeof text);    // → "string"
console.log(typeof num);     // → "number"
console.log(typeof list);    // → "object" (arrays are objects in JS)
```

## 3. Strings — joining and templating

```js
const first = "Sandya";
const greet = "Hello, " + first + "!";          // old way
const greet2 = `Hello, ${first}!`;              // template literal — preferred
console.log(greet2);
```

Backticks `` ` `` let you embed `${variables}` directly. Very common in Node code.

## 4. Numbers and math

```js
console.log(2 + 3);     // 5
console.log(10 / 4);    // 2.5
console.log(10 % 3);    // 1   (remainder)
console.log(2 ** 8);    // 256 (power)
```

## 5. Comparisons (always use `===`)

```js
console.log(5 === 5);      // true
console.log(5 === "5");    // false — different types
console.log(5 !== 6);      // true
console.log(5 > 3);        // true
```

> **Always use `===` and `!==`**, never `==`. The double-equals does weird type juggling and causes bugs.

## 6. Conditions: `if / else`

```js
const score = 72;

if (score >= 90) {
  console.log("A");
} else if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}
```

Combine with `&&` (AND) and `||` (OR):
```js
const age = 20;
const hasId = true;

if (age >= 18 && hasId) {
  console.log("Can enter");
}
```

## 7. Loops

The two you'll use most:

```js
// Run N times
for (let i = 0; i < 5; i++) {
  console.log("count", i);
}

// Loop over an array
const fruits = ["apple", "banana", "mango"];
for (const fruit of fruits) {
  console.log(fruit);
}
```

## 8. Putting it together — mini exercise (15 min)

Create `grades.js`:

```js
const students = [
  { name: "Asha",  score: 88 },
  { name: "Ravi",  score: 54 },
  { name: "Meena", score: 71 },
];

for (const s of students) {
  let grade;
  if (s.score >= 80) grade = "A";
  else if (s.score >= 60) grade = "B";
  else grade = "F";

  console.log(`${s.name}: ${s.score} → ${grade}`);
}
```

Run it: `node grades.js`. Expected output:
```
Asha: 88 → A
Ravi: 54 → F
Meena: 71 → B
```

Now **change it**: add a student, change the thresholds, print only those who passed.

---

## 5-min recap

1. Difference between `let` and `const`?
2. Why use `===` instead of `==`?
3. What does `typeof []` return? (Trick question.)
4. Write a `for...of` loop that prints each item of `["a","b","c"]`.

When you're done → [03-functions-arrays-objects.md](03-functions-arrays-objects.md)
