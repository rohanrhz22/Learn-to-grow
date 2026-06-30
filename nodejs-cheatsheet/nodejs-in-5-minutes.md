# Node.js in 5 Minutes — One-Page Cheatsheet

> A condensed, review-friendly summary of the most important Node.js concepts.

---

## 1. What is Node.js?

- **JavaScript runtime** built on Chrome's **V8 engine** — runs JS outside the browser (servers, CLIs, tools).
- **Single-threaded**, **event-driven**, **non-blocking I/O** → great for network/IO-heavy apps.
- Ships with **npm** (package manager) and a rich **standard library** (`fs`, `http`, `path`, `os`, ...).

```
 ┌─────────────────────────────┐
 │      Your JS Code           │
 ├─────────────────────────────┤
 │  Node APIs (fs, http, ...)  │
 ├──────────────┬──────────────┤
 │   V8 Engine  │   libuv      │  ← event loop + thread pool
 └──────────────┴──────────────┘
```

---

## 2. The Event Loop (heart of Node)

- Node processes one task at a time, but **offloads I/O** to libuv so it never waits idle.
- Order of execution per tick:

```
 ┌───► timers (setTimeout/Interval)
 │     pending callbacks
 │     poll        ← I/O callbacks
 │     check       ← setImmediate
 │     close callbacks
 └─── microtasks (Promises, process.nextTick) run BETWEEN phases
```

**Example:**
```js
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
```

---

## 3. Modules

| System | Syntax | File |
|--------|--------|------|
| CommonJS | `const x = require('x')` / `module.exports` | `.js` (default) |
| ES Modules | `import x from 'x'` / `export` | `.mjs` or `"type":"module"` |

```js
// math.js
module.exports.add = (a, b) => a + b;

// app.js
const { add } = require('./math');
console.log(add(2, 3)); // 5
```

---

## 4. npm Essentials

```bash
npm init -y              # create package.json
npm install express      # add dependency
npm install -D jest      # dev-only
npm run <script>         # run package.json script
npx <pkg>                # run without installing
```

- `package.json` = project manifest. `package-lock.json` = exact dep tree.
- Use **`^1.2.3`** (minor updates) vs **`~1.2.3`** (patch only) vs **`1.2.3`** (exact).

---

## 5. Asynchronous Patterns

```js
// Callbacks (old)
fs.readFile('a.txt', (err, data) => { ... });

// Promises
fs.promises.readFile('a.txt').then(data => ...);

// async/await (preferred)
const data = await fs.promises.readFile('a.txt', 'utf8');
```

- Run in parallel: `await Promise.all([p1, p2])`
- Always **handle errors** with `try/catch` around `await`.

---

## 6. Built-in Modules (most used)

| Module | Purpose | Quick example |
|--------|---------|---------------|
| `fs`   | files | `await fs.promises.writeFile('x.txt', 'hi')` |
| `path` | cross-OS paths | `path.join(__dirname, 'data')` |
| `http` | servers/clients | see §8 |
| `os`   | system info | `os.cpus().length` |
| `events` | EventEmitter | `emitter.on('msg', fn)` |
| `stream` | chunked I/O | `readable.pipe(writable)` |

---

## 7. Streams & Events

- **Streams** process data in chunks → low memory for large files.
- 4 types: **Readable, Writable, Duplex, Transform**.

```js
const fs = require('fs');
fs.createReadStream('big.log').pipe(fs.createWriteStream('copy.log'));
```

- **EventEmitter** is the pub/sub backbone of Node:
```js
const { EventEmitter } = require('events');
const bus = new EventEmitter();
bus.on('hello', name => console.log(`Hi ${name}`));
bus.emit('hello', 'Ada');
```

---

## 8. Tiny HTTP Server

```js
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ url: req.url, method: req.method }));
}).listen(3000, () => console.log('http://localhost:3000'));
```

Run: `node server.js`

---

## 9. Globals & Process

- `__dirname`, `__filename` — current file/dir (CommonJS only).
- `process.env.NODE_ENV` — environment variables.
- `process.argv` — CLI arguments.
- `process.exit(code)` — terminate.

---

## 10. Error Handling Rules

- Sync → `try/catch`.
- Promises → `.catch()` or `try/catch` with `await`.
- Listen for crashes:
```js
process.on('uncaughtException', err => { ... });
process.on('unhandledRejection', err => { ... });
```

---

## 11. Mental Model — Request Lifecycle

```
 client ──► [HTTP] ──► Node event loop ──► libuv (I/O)
                              ▲                 │
                              └── callback ◄────┘
                                   │
                                   ▼
                              send response
```

---

## TL;DR (30 seconds)

- Node = **V8 + libuv + APIs** → async, non-blocking JS runtime.
- **Event loop** handles concurrency without threads.
- Use **`async/await`**, **Streams** for big data, **EventEmitter** for pub/sub.
- **npm** manages packages; **`require`/`import`** loads them.
- Built-ins (`fs`, `http`, `path`) cover most needs out of the box.
