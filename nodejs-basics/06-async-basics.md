# Lesson 6 — Async Basics: Callbacks → Promises → `async/await`

**Time:** 60 min · **Goal:** Understand why async exists, walk through all three async styles, and write your own using `async/await`.

---

## 1. Why async exists (5 min)

Some things take time: reading a file, querying a database, calling an API. If Node stops and waits for them, it can't do anything else (remember the chef from Lesson 2).

**Async** = "start this work, keep going, run my code later when it's done."

JavaScript evolved three ways to express that "run later":
1. **Callbacks** (oldest) — pass a function that gets called when done.
2. **Promises** — an object that represents "a value coming later."
3. **`async/await`** (modern) — syntax sugar over promises that *looks* synchronous.

You need to read all three; you'll mostly *write* the third.

## 2. Callbacks (10 min)

The original Node style: pass a function in, Node calls it when ready.

```js
const fs = require("fs");

fs.readFile("data.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Failed:", err.message);
    return;
  }
  console.log("Got:", data);
});

console.log("This prints first.");
```

**Node convention:** the callback's first parameter is always `err`. If something went wrong, `err` is an Error; otherwise it's `null`.

### Callback hell

Nesting callbacks gets ugly fast:

```js
fs.readFile("a.txt", "utf-8", (err, a) => {
  if (err) return console.error(err);
  fs.readFile("b.txt", "utf-8", (err, b) => {
    if (err) return console.error(err);
    fs.writeFile("c.txt", a + b, (err) => {
      if (err) return console.error(err);
      console.log("Done");
    });
  });
});
```

This shape — the "pyramid of doom" — is why promises were invented.

## 3. Promises (15 min)

A **Promise** is an object representing a future value. It has three states:
- **pending** — work in progress
- **fulfilled** — succeeded with a value
- **rejected** — failed with an error

```js
const fsp = require("fs/promises");

fsp.readFile("data.txt", "utf-8")
  .then((data) => console.log("Got:", data))
  .catch((err) => console.error("Failed:", err.message))
  .finally(() => console.log("Always runs"));
```

Promises **chain** instead of nest:

```js
fsp.readFile("a.txt", "utf-8")
  .then((a) => fsp.readFile("b.txt", "utf-8").then((b) => a + b))
  .then((combined) => fsp.writeFile("c.txt", combined))
  .then(() => console.log("Done"))
  .catch((err) => console.error(err));
```

Cleaner — but still a bit noisy. Enter `async/await`.

### Making your own promise

99% of the time you'll consume promises. Occasionally you'll create one (e.g., wrapping an old callback-based API):

```js
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

wait(1000).then(() => console.log("1 second later"));
```

## 4. `async/await` — read async code top-to-bottom (15 min)

`async/await` is syntax that lets you write promise code as if it were synchronous.

```js
const fsp = require("fs/promises");

async function combine() {
  try {
    const a = await fsp.readFile("a.txt", "utf-8");
    const b = await fsp.readFile("b.txt", "utf-8");
    await fsp.writeFile("c.txt", a + b);
    console.log("Done");
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

combine();
```

Compare with the promise chain above — same behavior, much easier to read and debug.

**Rules:**
- `await` only works inside an `async` function (or at top level in ESM files).
- An `async` function **always returns a promise** — even if you return a plain value.
- Use `try/catch` for errors (in place of `.catch`).

### Calling an async function

```js
async function main() { /* ... */ }

main();                              // fire-and-forget — errors lost!
main().catch(console.error);         // better — log unexpected errors
```

In an ESM file (`.mjs` or `"type":"module"`), you can even use `await` at the top level:
```js
import { readFile } from "fs/promises";
const data = await readFile("data.txt", "utf-8");
console.log(data);
```

## 5. Running things in parallel — `Promise.all` (10 min)

`await`-ing things one by one is **sequential**. If they're independent, run them in parallel.

```js
const fsp = require("fs/promises");

// Sequential — total time = sum of all
async function slow() {
  const a = await fsp.readFile("a.txt", "utf-8");
  const b = await fsp.readFile("b.txt", "utf-8");
  const c = await fsp.readFile("c.txt", "utf-8");
  return a + b + c;
}

// Parallel — total time = the slowest one
async function fast() {
  const [a, b, c] = await Promise.all([
    fsp.readFile("a.txt", "utf-8"),
    fsp.readFile("b.txt", "utf-8"),
    fsp.readFile("c.txt", "utf-8"),
  ]);
  return a + b + c;
}
```

Use `Promise.all` whenever the operations don't depend on each other.

Related:
- `Promise.allSettled([...])` — wait for all, never fails; gives you results + errors per item.
- `Promise.race([...])` — first to finish (or fail) wins.

## 6. Common mistakes (5 min)

1. **Forgetting `await`** — you end up logging a `Promise { <pending> }` instead of the value.
   ```js
   const data = fsp.readFile("x.txt", "utf-8");   // missing await
   console.log(data);   // Promise { <pending> }
   ```

2. **Mixing styles in the same function** — pick one. `async/await` is almost always best.

3. **No error handling** — an unhandled rejection crashes newer Node versions.
   ```js
   async function bad() { throw new Error("oops"); }
   bad();   // UnhandledPromiseRejection
   bad().catch(console.error);   // ✓
   ```

4. **Sequential when parallel is fine** — costs you real seconds in real apps. Use `Promise.all`.

## 7. Mini exercise (10 min)

Build `weather.js`. It uses the free https://open-meteo.com API.

1. Define an `async` function `getTemp(city, lat, lon)` that uses `fetch`:
   ```js
   const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
   const res = await fetch(url);
   const data = await res.json();
   return { city, temp: data.current.temperature_2m };
   ```
2. In an `async function main()`, call it for **three cities at once** with `Promise.all`:
   - Bengaluru: 12.97, 77.59
   - London: 51.50, -0.12
   - Tokyo: 35.68, 139.69
3. Print a small table of results.
4. Wrap `main()` with `.catch(console.error)`.

Time it with `console.time("all")` / `console.timeEnd("all")`. Then switch to sequential `await`s and time it again — feel the difference.

---

## 5-min recap

1. In Node, what's the convention for the first parameter of a callback?
2. What are the three states of a promise?
3. What does `await` actually do?
4. When would you use `Promise.all` vs sequential `await`?

When you're done → [07-events-and-streams.md](07-events-and-streams.md)
