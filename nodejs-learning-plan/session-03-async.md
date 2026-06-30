# Session 3 — Asynchronous JavaScript (2h)

**Goal:** Become fluent in callbacks, Promises, and `async/await` — the #1 skill in Node.

## Why this matters (80/20)
Node IS async. ~80% of bugs in Node code come from misunderstanding async flow. Master this and you’re ahead of most beginners.

---

## Plan

### 0–15 min — Warm-up
- Read: [Asynchronous flow control](https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control)
- Watch: *JavaScript Promises in 10 minutes* — Web Dev Simplified

### 15–90 min — Core Hands-on
1. **Callback style:**
   ```js
   const fs = require("fs");
   fs.readFile("a.txt", "utf8", (err, data) => {
     if (err) return console.error(err);
     console.log(data);
   });
   ```
2. **Callback hell** — write 3 nested `setTimeout`s, then refactor.
3. **Promises:**
   ```js
   const fs = require("fs/promises");
   fs.readFile("a.txt", "utf8")
     .then(console.log)
     .catch(console.error);
   ```
4. **async/await:**
   ```js
   async function run() {
     try {
       const data = await fs.readFile("a.txt", "utf8");
       console.log(data);
     } catch (e) { console.error(e); }
   }
   run();
   ```
5. **Parallel vs sequential:** `Promise.all`, `Promise.allSettled`, `Promise.race`.
6. **Convert callbacks → promises:** `util.promisify`.

### 90–105 min — Mini-challenge
Fetch 3 URLs in parallel using the built-in `fetch` (Node 18+) and print their status codes. Then re-do it sequentially and compare timing with `console.time`.

### 105–120 min — 15-min Review
- Draw the order of execution: sync → microtasks → macrotasks.
- When do you use `Promise.all` vs `for…await…of`?
- Common mistake list (forgetting `await`, missing `try/catch`, mixing styles).

---

## Resources
- https://javascript.info/async
- https://nodejs.org/en/learn/asynchronous-work/discover-promises-and-asyncawait
- Video: *Async/Await in Node.js* — freeCodeCamp
