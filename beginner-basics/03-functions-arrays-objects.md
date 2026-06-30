# Lesson 3 — Functions, Arrays & Objects

**Time:** 60 min · **Goal:** Comfortably write functions and work with arrays/objects — the building blocks of every Node program.

---

## 1. Functions — reusable blocks of code

### Classic function
```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));   // 5
```

### Arrow function (modern, used everywhere in Node)
```js
const add = (a, b) => a + b;
const square = (n) => n * n;

const greet = (name) => {
  const message = `Hi, ${name}!`;
  return message;
};

console.log(square(4));     // 16
console.log(greet("Sam"));  // Hi, Sam!
```

**When to use which?** Either works. Arrow functions are shorter and dominate modern code — get used to them.

### Default parameter values
```js
const greet = (name = "friend") => `Hi, ${name}!`;
console.log(greet());        // Hi, friend!
console.log(greet("Asha"));  // Hi, Asha!
```

## 2. Arrays — ordered lists

```js
const nums = [10, 20, 30, 40];

console.log(nums[0]);        // 10  (zero-indexed)
console.log(nums.length);    // 4

nums.push(50);               // add to end       → [10,20,30,40,50]
nums.pop();                  // remove from end  → [10,20,30,40]
nums.unshift(5);             // add to start     → [5,10,20,30,40]
nums.shift();                // remove from start→ [10,20,30,40]
```

### The 3 array methods you MUST know (used in every Node app)

```js
const nums = [1, 2, 3, 4, 5];

// map — transform every item
const doubled = nums.map(n => n * 2);
console.log(doubled);        // [2, 4, 6, 8, 10]

// filter — keep items that pass a test
const evens = nums.filter(n => n % 2 === 0);
console.log(evens);          // [2, 4]

// find — get the first matching item
const firstBig = nums.find(n => n > 3);
console.log(firstBig);       // 4
```

These three are 80% of array work in real Node code.

## 3. Objects — key/value collections

```js
const user = {
  name: "Sandya",
  age: 26,
  isAdmin: false,
};

// Read
console.log(user.name);        // Sandya
console.log(user["age"]);      // 26  (alternative syntax)

// Update / add
user.age = 27;
user.email = "s@example.com";

// Delete
delete user.isAdmin;

console.log(user);
```

### Objects can hold functions (methods)
```js
const calculator = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
};

console.log(calculator.add(10, 4));   // 14
```

### Destructuring — pull values out fast
```js
const user = { name: "Asha", age: 30, city: "Pune" };

const { name, city } = user;     // shorthand
console.log(name, city);         // Asha Pune
```

You'll see this **everywhere** in Node:
```js
const express = require("express");
const { Router } = require("express");   // destructuring an import
```

## 4. Arrays of objects (the most common data shape)

```js
const products = [
  { id: 1, name: "Pen",   price: 10 },
  { id: 2, name: "Book",  price: 50 },
  { id: 3, name: "Bag",   price: 200 },
];

// Get all names
const names = products.map(p => p.name);
console.log(names);   // ["Pen", "Book", "Bag"]

// Products under 100
const cheap = products.filter(p => p.price < 100);
console.log(cheap);

// Find a product by id
const book = products.find(p => p.id === 2);
console.log(book);
```

This pattern is exactly what you'll do later with database results in Session 8.

## 5. Mini exercise (15 min)

Create `library.js`:

```js
const books = [
  { id: 1, title: "Atomic Habits",  author: "Clear",    available: true  },
  { id: 2, title: "Deep Work",      author: "Newport",  available: false },
  { id: 3, title: "Clean Code",     author: "Martin",   available: true  },
];

// 1. Print all titles
const titles = books.map(b => b.title);
console.log("Titles:", titles);

// 2. Print only available books
const available = books.filter(b => b.available);
console.log("Available:", available);

// 3. Function that finds a book by id
const findBook = (id) => books.find(b => b.id === id);
console.log(findBook(2));
```

**Extend it:** add a function `addBook(title, author)` that pushes a new book onto the array with the next id.

---

## 5-min recap

1. Difference between a function declaration and an arrow function?
2. What do `map`, `filter`, and `find` each do?
3. What is destructuring? Write a line that pulls `name` and `age` from `{name:"A", age:1, x:2}`.
4. How do you add a new key to an existing object?

When you're done → [04-first-node-script.md](04-first-node-script.md)
