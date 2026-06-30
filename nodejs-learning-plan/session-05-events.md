# Session 5 — Events & the EventEmitter Pattern (2h)

**Goal:** Use `EventEmitter` to build decoupled, reactive Node code.

## Why this matters (80/20)
Streams, HTTP servers, sockets — they’re all EventEmitters under the hood. Knowing this pattern unlocks the internals of Node.

---

## Plan

### 0–15 min — Warm-up
- Read: [Events module](https://nodejs.org/api/events.html#events)

### 15–90 min — Core Hands-on
1. **Basic emitter:**
   ```js
   const EventEmitter = require("events");
   const bus = new EventEmitter();
   bus.on("greet", name => console.log(`Hi ${name}`));
   bus.emit("greet", "Sandy");
   ```
2. `once`, `off`, `listenerCount`, `removeAllListeners`.
3. **Custom class extending EventEmitter:**
   ```js
   class Order extends EventEmitter {
     place() { this.emit("placed", { id: 1 }); }
   }
   ```
4. **Error events:** always handle `'error'` or the process crashes.
5. **Async iterators over events:** `for await (const e of on(bus, "data"))`.

### 90–105 min — Mini-challenge
Build a `Logger` class extending `EventEmitter`. It emits `info`, `warn`, `error` events. A separate listener writes them to a file using a writable stream.

### 105–120 min — 15-min Review
- When to use events vs direct function calls?
- What happens if an `'error'` event has no listener?
- Commit.

---

## Resources
- https://nodejs.org/api/events.html
- Article: *Mastering Node.js EventEmitter* — Node.js Design Patterns book, Ch.3
