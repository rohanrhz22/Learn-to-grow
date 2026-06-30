# Lesson 5 — Errors, Debugging & Reading Stack Traces

**Time:** 45 min · **Goal:** Stop panicking when red text appears. Read errors, fix them, and use VS Code's debugger.

---

## 1. Errors are messages, not punishment

When Node prints a red error, it's **telling you exactly what's wrong and where**. Learning to read errors is the single biggest beginner upgrade.

A typical error looks like this:

```
ReferenceError: usrname is not defined
    at Object.<anonymous> (C:\node-learning\playground\bug.js:3:13)
    at Module._compile (node:internal/modules/cjs/loader:1256:14)
    ...
```

Read it in this order:

1. **Error type** → `ReferenceError` (you used a name that doesn't exist).
2. **Message** → `usrname is not defined` (typo of `username`).
3. **File and line** → `bug.js:3:13` means file `bug.js`, **line 3**, column 13.

That's 90% of debugging. Type → Message → File:Line.

## 2. The 4 error types you'll meet most

| Error | What it means | Common cause |
|-------|---------------|--------------|
| `SyntaxError` | The code isn't valid JavaScript | Missing `)`, `}`, `;`, or a typo in a keyword |
| `ReferenceError` | A name doesn't exist | Typo in variable name; used before declared |
| `TypeError` | You did something a value can't do | Called `.push()` on a string; `.length` of `undefined` |
| `RangeError` | A number is out of allowed range | Infinite recursion, bad array size |

Try producing each one on purpose — it cements the lesson.

```js
// SyntaxError
const x = ;

// ReferenceError
console.log(notDeclared);

// TypeError
const n = null;
n.toUpperCase();

// RangeError
function loop() { loop(); }
loop();
```

## 3. The classic killer: `Cannot read properties of undefined`

```js
const user = { name: "Asha" };
console.log(user.address.city);
//                       ^ TypeError: Cannot read properties of undefined (reading 'city')
```

`user.address` is `undefined`, and you can't read `.city` on undefined.

**Fixes:**
```js
// Option 1: check first
if (user.address) console.log(user.address.city);

// Option 2: optional chaining (?.) — modern, preferred
console.log(user.address?.city);   // undefined, no crash
```

You'll see `?.` everywhere in Node code.

## 4. `console.log` — your first debugger

Sprinkle `console.log` to see what values actually are:

```js
function total(items) {
  console.log("items =", items);          // what came in?
  const sum = items.reduce((a, b) => a + b, 0);
  console.log("sum =", sum);              // what did we compute?
  return sum;
}
```

Tip: label your logs (`"items =", items`). When 5 logs print at once, you'll thank yourself.

For objects, use:
```js
console.dir(user, { depth: null });   // shows nested objects fully
console.table(arrayOfObjects);        // pretty table — great for arrays
```

## 5. The VS Code debugger (the grown-up way)

`console.log` is fine, but the debugger is faster once you know it.

1. Open any `.js` file in VS Code.
2. Click in the **gutter** (the empty space left of a line number). A red dot appears — that's a **breakpoint**.
3. Press `F5`. If asked, choose **"Node.js"**.
4. Execution stops at the red dot. On the left you'll see every variable's current value.
5. Use the toolbar:
   - **Continue (F5)** → run until next breakpoint
   - **Step Over (F10)** → run the current line, move to the next
   - **Step Into (F11)** → enter the function being called
   - **Stop** → end the session

Try it on this file (`bug.js`):
```js
function double(n) {
  const result = n * 2;
  return result;
}

const x = 5;
const y = double(x);
console.log(y);
```
Put a breakpoint on `const result = n * 2;`. Run with F5. Hover over `n` and `result` to inspect values.

## 6. `try / catch` — handle errors instead of crashing

```js
try {
  const data = JSON.parse("not valid json");
} catch (err) {
  console.log("Could not parse:", err.message);
}
console.log("Program keeps running.");
```

Without `try/catch`, the program would crash. With it, you decide what to do. You'll use this a lot in Sessions 6–9.

## 7. Mini exercise (10 min)

Create `debug-me.js` — it's broken on purpose. **Fix all three bugs**:

```js
const users = [
  { name: "Asha",  age: 30 }
  { name: "Ravi",  age: 25 },
  { name: "Meena", age: 28 },
];

for (const u of usrs) {
  console.log(`${u.name} is ${u.Age} years old`);
}
```

Hints: one `SyntaxError`, one `ReferenceError`, one wrong property name.

---

## 5-min recap

1. What three pieces of info does every error line give you?
2. What does `?.` do?
3. How do you set a breakpoint in VS Code?
4. When would you use `try/catch`?

When you're done → [06-json-and-data.md](06-json-and-data.md)
