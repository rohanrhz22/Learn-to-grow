# Lesson 3 — Modules: `require`, `module.exports`, and ESM

**Time:** 60 min · **Goal:** Split code into multiple files. Understand both module systems (CommonJS vs ES Modules) and when to use which.

---

## 1. Why modules? (5 min)

A "module" is just **a file that exports something other files can use**. Modules let you:
- Split a big program into small files
- Reuse code
- Use libraries written by others

Node has **two module systems**:
1. **CommonJS (CJS)** — the original, uses `require` / `module.exports`. Default in most Node code today.
2. **ES Modules (ESM)** — the modern web standard, uses `import` / `export`. Becoming the default going forward.

You need to read both. We'll start with CommonJS because beginner tutorials use it.

## 2. CommonJS — `require` and `module.exports` (20 min)

### Exporting one thing

Create `math.js`:
```js
function add(a, b) {
  return a + b;
}

module.exports = add;
```

Use it in `app.js`:
```js
const add = require("./math");   // ./ means "in this folder"

console.log(add(2, 3));          // 5
```

Run: `node app.js`.

> Note `./math` — no `.js` extension needed for CommonJS local files.

### Exporting many things

Create `math.js`:
```js
function add(a, b) { return a + b; }
function sub(a, b) { return a - b; }
const PI = 3.14159;

module.exports = { add, sub, PI };
```

```js
// app.js
const math = require("./math");
console.log(math.add(2, 3));
console.log(math.PI);

// or destructure:
const { add, PI } = require("./math");
console.log(add(10, 4), PI);
```

### Three flavors of `require`

```js
const fs   = require("fs");          // built-in module
const lib  = require("chalk");       // installed via npm (looks in node_modules)
const mine = require("./math");      // local file (relative path required)
```

Folder version: `require("./utils")` will also find `./utils/index.js`. Useful for organizing.

### Modules are cached

`require` loads each file **only once**. Subsequent `require` calls return the same exported value.

```js
// counter.js
let count = 0;
module.exports = {
  inc: () => ++count,
  get: () => count,
};
```

```js
// a.js
const c1 = require("./counter");
const c2 = require("./counter");
c1.inc(); c1.inc(); c2.inc();
console.log(c2.get());   // 3 — same module, shared state
```

## 3. ES Modules — `import` and `export` (15 min)

To use ESM in Node, do **one** of:
- Name your file `.mjs`, **or**
- Add `"type": "module"` to `package.json`.

Then:

```js
// math.mjs
export function add(a, b) { return a + b; }
export function sub(a, b) { return a - b; }
export const PI = 3.14159;

// default export (just one)
export default function multiply(a, b) { return a * b; }
```

```js
// app.mjs
import multiply, { add, PI } from "./math.mjs";   // extension IS required in ESM

console.log(add(2, 3));
console.log(multiply(4, 5));
console.log(PI);
```

Run: `node app.mjs`.

### CJS vs ESM at a glance

| | CommonJS | ES Modules |
|---|---|---|
| Import | `const x = require("./x")` | `import x from "./x.js"` |
| Export | `module.exports = x` | `export default x` / `export { x }` |
| File extension on import | optional | **required** |
| `__dirname` available | yes | **no** (use `import.meta.url`) |
| Top-level `await` | no | **yes** |
| When loaded | at runtime, synchronously | parsed first, then evaluated |

**Practical advice for beginners:**
- Most tutorials & older packages use **CommonJS**. Be fluent in it.
- New projects increasingly use **ESM**. Learn both — they look 90% similar.

## 4. The "module wrapper" — what Node does behind your back (5 min)

Before running your CJS file, Node wraps it like this:

```js
(function (exports, require, module, __filename, __dirname) {
  // ...your file's code...
});
```

That's why `module`, `require`, `__dirname` are magically available in every file — they're function parameters injected by Node.

You don't need to do anything with this; just know it's why these "globals" exist.

## 5. A real mini project — split it up (10 min)

Create this structure:
```
03-modules/
├── app.js
└── utils/
    ├── greet.js
    └── time.js
```

`utils/greet.js`:
```js
function greet(name) {
  return `Hello, ${name}!`;
}
module.exports = greet;
```

`utils/time.js`:
```js
function nowString() {
  return new Date().toLocaleTimeString();
}
module.exports = { nowString };
```

`app.js`:
```js
const greet = require("./utils/greet");
const { nowString } = require("./utils/time");

const name = process.argv[2] || "world";

console.log(`[${nowString()}] ${greet(name)}`);
```

Run: `node app.js Sandya`.

> This pattern — small `utils/` files exporting helpers — is the everyday shape of Node code.

## 6. Mini exercise (10 min)

Build a calculator module:

1. Create `calc.js` exporting `add`, `sub`, `mul`, `div`.
2. Create `main.js` that:
   - Imports `calc`.
   - Reads operator and two numbers from `process.argv`:
     `node main.js add 5 7`
   - Calls the right function and prints the result.
3. Handle the case where the operator isn't supported (print an error, exit code 1).

**Bonus:** convert the whole thing to ESM. Rename to `.mjs`, swap `require`/`module.exports` for `import`/`export`. See what breaks.

---

## 5-min recap

1. What's the difference between `module.exports = x` and `module.exports = { x }`?
2. Why does `require("./math")` and `require("./math.js")` both work?
3. Why do you need `"type": "module"` in `package.json`?
4. If you `require` the same file twice, do you get two copies or one?

When you're done → [04-npm-deep-dive.md](04-npm-deep-dive.md)
