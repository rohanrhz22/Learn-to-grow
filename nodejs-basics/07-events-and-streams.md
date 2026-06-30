# Lesson 7 — EventEmitter & Streams (the Node "feel")

**Time:** 60 min · **Goal:** Understand events (the pattern half of Node is built on) and streams (how Node moves large data without blowing up memory).

---

## 1. Events — Node's nervous system (15 min)

Tons of Node objects "emit" events: an HTTP server emits `"request"`, a file stream emits `"data"`, a process emits `"exit"`. You **listen** with `.on(eventName, handler)`.

This is the **publish/subscribe** pattern, and Node ships it as the `events` module.

### Build your own emitter

```js
const EventEmitter = require("events");

const bus = new EventEmitter();

// Subscribe
bus.on("greet", (name) => {
  console.log("Hello,", name);
});

bus.on("greet", (name) => {
  console.log("Welcome,", name);
});

// Publish
bus.emit("greet", "Sandya");
// Hello, Sandya
// Welcome, Sandya
```

Other useful methods:

```js
bus.once("login", (user) => console.log("First login by", user));  // fires once only
bus.off("greet", handler);                                          // unsubscribe
bus.listenerCount("greet");                                         // 2
```

### Why this matters

You'll meet emitters constantly in Node:
- `server.on("request", handler)` — HTTP requests
- `socket.on("data", handler)` — TCP / WebSocket data
- `process.on("exit", handler)` — cleanup before shutdown
- `readStream.on("data", chunk => ...)` — file reading

Knowing the pattern means you instantly know how to use any of them.

### Tiny realistic example

```js
const EventEmitter = require("events");

class OrderQueue extends EventEmitter {
  add(order) {
    console.log("Queued:", order.id);
    this.emit("new-order", order);
  }
}

const q = new OrderQueue();

q.on("new-order", (o) => console.log(" → notify kitchen for", o.id));
q.on("new-order", (o) => console.log(" → notify customer for", o.id));

q.add({ id: 101 });
q.add({ id: 102 });
```

The publisher (`OrderQueue`) doesn't know or care who's listening. **Loose coupling** — the heart of clean Node design.

## 2. Streams — work on data piece by piece (15 min)

**Problem:** you need to copy a 5 GB video file. If you `fs.readFile` it, Node tries to load 5 GB into RAM. Boom.

**Solution:** streams. Read a small **chunk**, do something with it, throw it away, read the next chunk. Constant low memory regardless of file size.

Node has 4 stream types:

| Type | Example |
|---|---|
| **Readable** | `fs.createReadStream(file)`, HTTP request body |
| **Writable** | `fs.createWriteStream(file)`, HTTP response, `process.stdout` |
| **Duplex** | TCP socket (read + write) |
| **Transform** | gzip compression (read in, transform, write out) |

### Read a file with a stream

```js
const fs = require("fs");

const stream = fs.createReadStream("big.txt", { encoding: "utf-8" });

let total = 0;

stream.on("data", (chunk) => {
  total += chunk.length;
  console.log("Got chunk of", chunk.length, "chars");
});

stream.on("end", () => {
  console.log("Done. Total:", total);
});

stream.on("error", (err) => {
  console.error("Failed:", err.message);
});
```

> Streams are **EventEmitters under the hood** — `data`, `end`, `error` are events. See how it ties back to section 1?

### Pipe — connect a readable to a writable

The killer feature. Copy a file with constant memory:

```js
const fs = require("fs");

fs.createReadStream("input.txt")
  .pipe(fs.createWriteStream("output.txt"))
  .on("finish", () => console.log("Copied!"));
```

Add a transform in the middle (gzip):

```js
const fs   = require("fs");
const zlib = require("zlib");

fs.createReadStream("input.txt")
  .pipe(zlib.createGzip())              // transform
  .pipe(fs.createWriteStream("input.txt.gz"))
  .on("finish", () => console.log("Compressed!"));
```

Three lines. Works on any file size — KB, GB, doesn't matter.

### The modern way: `stream/promises.pipeline`

Pipes don't propagate errors well across multiple stages. Use `pipeline`:

```js
const { pipeline } = require("stream/promises");
const fs   = require("fs");
const zlib = require("zlib");

async function gzipFile() {
  await pipeline(
    fs.createReadStream("input.txt"),
    zlib.createGzip(),
    fs.createWriteStream("input.txt.gz"),
  );
  console.log("Done");
}

gzipFile().catch(console.error);
```

Cleaner errors, plays well with `async/await`. Prefer this in new code.

## 3. Why this is "the Node feel" (5 min)

Almost every Node API is built from **events + streams**:
- An HTTP server **emits** a `request`, whose body **is a readable stream**, and whose response **is a writable stream**.
- A WebSocket **emits** `message`.
- A TCP server **emits** `connection` with duplex streams.

Once events and streams click, you can read any Node library's docs and know how to plug it in.

## 4. Mini exercise (15 min)

### Part A — Event-based logger

Create `logger.js`:
```js
const EventEmitter = require("events");

class Logger extends EventEmitter {
  log(level, message) {
    this.emit("log", { level, message, time: new Date().toISOString() });
  }
}

module.exports = Logger;
```

```js
// app.js
const Logger = require("./logger");
const log = new Logger();

log.on("log", (e) => console.log(`[${e.time}] ${e.level.toUpperCase()} - ${e.message}`));
log.on("log", (e) => {
  if (e.level === "error") console.log("  ⚠️  Pretend we paged on-call");
});

log.log("info",  "App started");
log.log("warn",  "Cache miss");
log.log("error", "DB connection lost");
```

Run and observe both listeners firing.

### Part B — Stream copy + uppercase transform

1. Create `input.txt` with a few lines.
2. Write `upper.js`:
   ```js
   const { pipeline } = require("stream/promises");
   const fs = require("fs");
   const { Transform } = require("stream");

   const upper = new Transform({
     transform(chunk, _enc, cb) {
       cb(null, chunk.toString().toUpperCase());
     },
   });

   pipeline(
     fs.createReadStream("input.txt"),
     upper,
     fs.createWriteStream("output.txt"),
   ).then(() => console.log("done"));
   ```
3. Run, then `cat output.txt` (or open it). All caps.

---

## 5-min recap

1. What does `.on()` do? What about `.emit()`?
2. Why are streams better than `fs.readFile` for large files?
3. Name the 4 stream types.
4. What does `pipeline` give you over chained `.pipe()`?

When you're done → [08-tiny-http-server.md](08-tiny-http-server.md)
