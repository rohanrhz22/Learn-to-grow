# Lesson 1 — The Node Runtime, REPL & How Scripts Run

**Time:** 60 min · **Goal:** Know what "Node" actually *is*, use the REPL like a calculator, and understand what happens when you type `node file.js`.

---

## 1. What is a "runtime"? (10 min)

A **runtime** is the environment that takes your code and actually executes it. The browser is a runtime for JavaScript. **Node is also a runtime for JavaScript** — but on your computer, not in a webpage.

Node bundles three things into one program:
1. **V8** — Google's JavaScript engine (same one inside Chrome). It turns JS into machine code.
2. **libuv** — a C library that gives Node async I/O, the event loop, threads, timers.
3. **Node's standard library** — built-in modules (`fs`, `http`, `path`, `os`, etc.).

```
┌──────────────────────────────────────┐
│           Your JS code               │
├──────────────────────────────────────┤
│  Node stdlib (fs, http, path, ...)   │
├──────────────────┬───────────────────┤
│   V8 (JS engine) │  libuv (async I/O)│
├──────────────────┴───────────────────┤
│              Your OS                 │
└──────────────────────────────────────┘
```

When you type `node app.js`, Node loads `app.js`, hands it to V8, and provides the stdlib + libuv to the running code.

## 2. The REPL — Node as a calculator (15 min)

**REPL** = **R**ead → **E**val → **P**rint → **L**oop. Just type `node` in a terminal:

```
PS C:\node-learning> node
Welcome to Node.js v20.x.x.
Type ".help" for more information.
>
```

You can now type any JS expression and see the result instantly. Great for trying things.

Try these one by one:
```js
> 2 + 3
5
> const name = "Sandya"
undefined
> `Hello, ${name}!`
'Hello, Sandya!'
> [1, 2, 3].map(n => n * 10)
[ 10, 20, 30 ]
> Math.random()
0.7423...
> .help
> .exit         // or press Ctrl+C twice
```

REPL features worth knowing:
- **Up arrow** → previous command (history works)
- **Tab** → autocomplete (`Math.` then Tab shows all methods)
- **`_`** → result of the last expression
  ```js
  > 5 * 5
  25
  > _ + 1
  26
  ```
- **`.editor`** → multi-line mode (Ctrl+D to run)
- **`.save myfile.js`** → save your REPL session

**Use the REPL** whenever you wonder "what does this return?" It's faster than writing a file.

## 3. What happens when you run `node file.js` (10 min)

```
node app.js
   │
   ├─→ Node starts up, initializes V8 + libuv
   ├─→ Reads app.js from disk
   ├─→ Wraps your code in a function (so `module`, `require`, `__dirname` are available)
   ├─→ V8 executes the code top to bottom
   ├─→ If there's pending async work (timers, I/O), Node enters the event loop and waits
   └─→ When nothing is left to do, Node exits
```

Demo it. Create `lifecycle.js`:
```js
console.log("1. Script started");

setTimeout(() => console.log("3. Timer fired (1s later)"), 1000);

console.log("2. Script reached end");

// Node does NOT exit here — it stays alive because of the pending timer.
```

Run: `node lifecycle.js`. You'll see 1, 2, then a 1-second pause, then 3, then Node exits. That waiting behavior **is** the event loop.

## 4. `process.argv` & exit codes (10 min)

Every Node program gets a `process` object with info about how it was invoked.

```js
// argv.js
console.log("All args:", process.argv);
console.log("Just my args:", process.argv.slice(2));
```

Run: `node argv.js hello 42 --verbose`

You'll see:
```
All args: [
  'C:\\...\\node.exe',     // [0] the Node binary
  'C:\\...\\argv.js',      // [1] the script path
  'hello',                 // [2] your args start here
  '42',
  '--verbose'
]
Just my args: [ 'hello', '42', '--verbose' ]
```

**Exit codes** — tell the OS / shell whether your script succeeded:
```js
if (!process.argv[2]) {
  console.error("Error: name required");
  process.exit(1);    // non-zero = failure
}
console.log("Hello,", process.argv[2]);
// reaching the end = exit 0 = success
```

This matters for shell scripts, CI/CD, and tools like `npm scripts`.

## 5. Running scripts via `npm` (preview) (5 min)

In a project with a `package.json`, you can define shortcuts:

```json
{
  "scripts": {
    "start": "node app.js",
    "hello": "node argv.js Sandya"
  }
}
```

Then in the terminal:
```
npm start
npm run hello
```

You'll dive deep into this in Lesson 4. For now, just notice: `npm` is *also* a script runner, not only a package installer.

## 6. Mini exercise (10 min)

Create `meta.js` that prints:
- Node version (`process.version`)
- Platform (`process.platform`)
- Current working directory (`process.cwd()`)
- Number of args you passed (`process.argv.length - 2`)
- The args themselves, one per line

Run it with: `node meta.js a b c` and check the output.

**Bonus:** if no args are given, print "no args" and `process.exit(1)`. Then run `echo $LASTEXITCODE` (PowerShell) to see the exit code.

---

## 5-min recap

1. Name the three big pieces inside Node (V8, libuv, stdlib).
2. What is the REPL and when would you use it?
3. Why does `node lifecycle.js` not exit immediately?
4. What is `process.argv[2]`?

When you're done → [02-globals-and-event-loop.md](02-globals-and-event-loop.md)
