# Node.js Basics — Beginner Deep Dive

This folder is a **gentle, beginner-focused tour of Node.js itself**. While [beginner-basics/](../beginner-basics/README.md) prepares you to *start* (JavaScript, terminal, Git), this folder slows down on **Node-specific concepts** so they actually stick before you hit the fast-paced 20-hour main plan.

Total time: **~8 hours** (8 lessons × ~60 min). Take one per day.

---

## Who is this for?

- You've finished [beginner-basics/](../beginner-basics/README.md) (or already know JavaScript + terminal + Git).
- You want **Node concepts explained slowly** with extra examples before doing the main plan.
- You want to *understand* Node, not just copy-paste code.

If you already know what the event loop is, what `require` vs `import` means, what a stream is, and how `npm` works — **skip this folder** and go to [../session-01-fundamentals.md](../session-01-fundamentals.md).

---

## The 8 Node.js Basics Lessons

| # | Lesson | Time | File |
|---|--------|------|------|
| 1 | The Node runtime, REPL & how scripts run | 60 min | [01-runtime-and-repl.md](01-runtime-and-repl.md) |
| 2 | `global`, `process` & the event loop (gently) | 60 min | [02-globals-and-event-loop.md](02-globals-and-event-loop.md) |
| 3 | Modules — `require`, `module.exports`, ESM | 60 min | [03-modules.md](03-modules.md) |
| 4 | npm deep dive — `package.json`, scripts, semver | 60 min | [04-npm-deep-dive.md](04-npm-deep-dive.md) |
| 5 | Built-in modules you'll use every day (`fs`, `path`, `os`, `url`) | 60 min | [05-built-in-modules.md](05-built-in-modules.md) |
| 6 | Async basics — callbacks, promises, `async/await` | 60 min | [06-async-basics.md](06-async-basics.md) |
| 7 | EventEmitter & streams (the Node "feel") | 60 min | [07-events-and-streams.md](07-events-and-streams.md) |
| 8 | Tiny HTTP server from scratch (no Express yet) | 60 min | [08-tiny-http-server.md](08-tiny-http-server.md) |

After this folder → start the main plan at [../session-01-fundamentals.md](../session-01-fundamentals.md). It will feel like review at first — that's the goal.

---

## How each lesson is structured

Same format as `beginner-basics/`:

- 5–10 min **concept** (plain English)
- 30–40 min **hands-on** (you type the code)
- 10 min **mini exercise** (extend it yourself)
- 5 min **recap** (4 questions to answer out loud)

**Type every example.** Don't copy-paste. Muscle memory matters.

---

## Setup reminder

Inside `node-learning/`, create a sibling folder to `playground/`:
```
node-learning/
├── playground/          ← from beginner-basics
└── node-basics/         ← use this for these 8 lessons
    ├── 01-runtime/
    ├── 02-event-loop/
    └── ...
```

A fresh folder per lesson keeps things tidy and lets you `git commit` each lesson cleanly.

---

## Top references (used throughout)

- **Official Node.js Learn:** https://nodejs.org/en/learn
- **Node.js API docs:** https://nodejs.org/api/
- **Node.js Design Patterns** (free chapters 1–3) — Mario Casciaro
- **Video — "Node.js Tutorial for Beginners" (Net Ninja, free playlist):** https://www.youtube.com/playlist?list=PL4cUxeGkcC9gcy9lrvMJ75z9maRw4byYp
- **Video — "Node.js Crash Course" (Traversy Media):** https://www.youtube.com/watch?v=fBNz5xF-Kx4
- **MDN — async JavaScript:** https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous
