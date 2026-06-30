# Lesson 2 — Globals, `process` & the Event Loop (Gently)

**Time:** 60 min · **Goal:** Know what's available without `require`, what `process` does, and get an intuitive feel for the event loop using small experiments.

---

## 1. Globals — things you can use anywhere (10 min)

Some names are always available in Node — no `require` needed.

```js
console.log("string");        // console — printing
setTimeout(fn, 1000);         // schedule async work
setInterval(fn, 500);
clearTimeout(id);
setImmediate(fn);             // Node-specific
process.cwd();                // current working directory
__dirname                     // folder this file is in
__filename                    // full path of this file
global                        // the global object itself (like `window` in browsers)
Buffer                        // for binary data
```

Try it. Create `globals.js`:
```js
console.log("__dirname  :", __dirname);
console.log("__filename :", __filename);
console.log("cwd        :", process.cwd());
```

`__dirname` vs `process.cwd()` confuses everyone:
- `__dirname` → where **this file** lives.
- `process.cwd()` → where you **ran node from**.

Run the file from a different folder to see them differ:
```
cd ..
node node-basics/02-event-loop/globals.js
```

## 2. `process` — your bridge to the OS (10 min)

`process` is one of Node's most useful globals.

```js
process.version            // "v20.11.0"
process.platform           // "win32" | "darwin" | "linux"
process.arch               // "x64"
process.pid                // process ID
process.env                // all environment variables (object)
process.argv               // command-line args (from Lesson 1)
process.cwd()              // current working directory
process.uptime()           // seconds since the process started
process.memoryUsage()      // RAM usage
process.exit(code)         // stop the process
```

### `process.env` — environment variables

`process.env` is an object of strings the OS passes in. The `PATH` variable, secrets, config flags — all live here.

```js
console.log("PATH starts with:", process.env.PATH.slice(0, 60));
console.log("HOME:", process.env.HOME || process.env.USERPROFILE);
console.log("My var:", process.env.MY_VAR);
```

Run with a variable set (PowerShell):
```powershell
$env:MY_VAR="hello"; node env.js
```

You'll use `process.env` for **secrets** (API keys, DB passwords) in Session 9.

### Process events

```js
process.on("exit", (code) => {
  console.log(`Goodbye, exit code ${code}`);
});

process.on("uncaughtException", (err) => {
  console.error("Crashed because:", err.message);
});

console.log("Doing work...");
```

## 3. The event loop — a story before the code (15 min)

Here's the analogy. Imagine a chef (Node) with **one pair of hands** but a phone (libuv) that can call helpers.

- An order comes in: "boil rice (10 min) + make salad (now)."
- A blocking chef would stand and watch the rice for 10 min. Slow.
- A Node chef:
  1. Puts rice on the stove → asks libuv "tell me when it's done."
  2. Makes the salad now.
  3. Takes the next order, makes coffee, plates dishes.
  4. When libuv calls back: "rice done!" — Node serves it.

So Node's secret isn't "do many things at once" — it's "never wait." That's **non-blocking I/O**, and the **event loop** is the chef listening for callbacks.

### See it yourself

Create `eventloop.js`:
```js
console.log("1 — sync top");

setTimeout(() => console.log("2 — setTimeout 0ms"), 0);

setImmediate(() => console.log("3 — setImmediate"));

Promise.resolve().then(() => console.log("4 — promise microtask"));

process.nextTick(() => console.log("5 — process.nextTick"));

console.log("6 — sync bottom");
```

**Predict the order before running.** Then run `node eventloop.js`.

The output is:
```
1 — sync top
6 — sync bottom
5 — process.nextTick
4 — promise microtask
2 — setTimeout 0ms      (or 3 — setImmediate; order varies)
3 — setImmediate
```

Why?
- **Sync code runs first** (1, 6).
- Then **microtasks** drain: `process.nextTick` first, then promises (5, 4).
- Then the loop **moves to the next phase**: timers (2) and check (3).

You don't need to memorize the phases now. **Just remember:**
> Sync code → microtasks (nextTick, promises) → timers/I/O.

## 4. Blocking vs non-blocking — feel the difference (10 min)

Blocking code makes Node sit still. Bad.

```js
// blocking.js — DO NOT USE in real apps
console.log("Start");

const end = Date.now() + 3000;
while (Date.now() < end) { /* spin for 3 seconds */ }

console.log("End (3s later)");
```

While that loop spins, **Node can't do anything else** — no HTTP requests served, no files read. One slow user blocks all users.

Compare:
```js
// non-blocking.js
console.log("Start");

setTimeout(() => console.log("End (3s later)"), 3000);

console.log("Did NOT block — see this immediately.");
```

Same total wait, but the chef kept cooking other dishes. This is why Node is great for I/O-heavy work and bad for CPU-heavy work.

## 5. Mini exercise (10 min)

Create `predict.js`. **Write down your predicted output first**, then run:

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve()
  .then(() => console.log("C"))
  .then(() => console.log("D"));

process.nextTick(() => console.log("E"));

setImmediate(() => console.log("F"));

console.log("G");
```

Then explain to yourself **why** each one printed when it did.

**Bonus:** wrap a slow file read with `fs.readFileSync` vs `fs.readFile` and observe how the rest of the program behaves.

---

## 5-min recap

1. Difference between `__dirname` and `process.cwd()`?
2. What is `process.env` and what would you store there?
3. In one sentence, what does "non-blocking" mean?
4. Why do `process.nextTick` callbacks run before `setTimeout(fn, 0)` callbacks?

When you're done → [03-modules.md](03-modules.md)
