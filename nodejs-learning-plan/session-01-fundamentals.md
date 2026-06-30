# Session 1 — Node.js Fundamentals & Runtime (2h)

**Goal:** Understand what Node.js is, how the event loop works, and run your first scripts.

## Why this matters (80/20)
Everything in Node — async I/O, performance, server design — flows from the **single-threaded event loop + non-blocking I/O** model. Get this right once and the rest clicks.

---

## Plan

### 0–15 min — Warm-up
- Read: [Introduction to Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- Watch: *“What is Node.js?”* — Fireship (5 min) — https://www.youtube.com/watch?v=ENrzD9HAZK4

### 15–90 min — Core Hands-on
1. Install Node LTS → run `node -v`, `npm -v`.
2. Open the Node REPL: `node`. Try expressions, `.help`, `.exit`.
3. Create `hello.js`:
   ```js
   console.log("Hello Node");
   console.log("Args:", process.argv);
   console.log("Cwd:", process.cwd());
   ```
   Run: `node hello.js one two`.
4. Learn the **global objects**: `global`, `process`, `__dirname`, `__filename`, `setTimeout`, `setImmediate`, `process.nextTick`.
5. Read: [The Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
6. Run this and predict the output **before** running:
   ```js
   console.log("1");
   setTimeout(() => console.log("2"), 0);
   setImmediate(() => console.log("3"));
   process.nextTick(() => console.log("4"));
   Promise.resolve().then(() => console.log("5"));
   console.log("6");
   ```

### 90–105 min — Mini-challenge
Write `info.js` that prints: Node version, platform, free memory (`os.freemem()`), and uptime.

### 105–120 min — 15-min Review
- Write 5 bullet notes: *event loop, non-blocking I/O, single thread, `process`, REPL*.
- Self-quiz: Why is Node.js good for I/O-heavy apps but bad for CPU-heavy ones?
- Commit code to a git repo `node-learning`.

---

## Resources
- https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
- https://nodejs.dev/en/learn
- Video: *Node.js Event Loop Explained* — https://www.youtube.com/watch?v=8aGhZQkoFbQ
