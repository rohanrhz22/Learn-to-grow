# Lesson 0 — What is Node.js? (Plain English)

**Time:** 20 min · **Goal:** Understand what Node.js is and why people use it — no code yet.

---

## 1. JavaScript used to live only in browsers

Originally, JavaScript was a language that ran **inside web browsers** (Chrome, Firefox, etc.) to make web pages interactive — clicks, animations, forms.

It could **not** read files on your computer, talk to databases, or run servers. The browser sandbox didn't allow it.

## 2. Node.js takes JavaScript *out* of the browser

In 2009, a developer named Ryan Dahl took the JavaScript engine from Chrome (called **V8**) and wrapped it so it could run **directly on your computer** — like Python or Java.

That wrapper is **Node.js**.

> **Node.js = JavaScript that runs outside the browser, on your machine or a server.**

With Node.js, JavaScript can now:
- Read & write files
- Build web servers
- Connect to databases
- Run command-line tools
- Be installed via `npm` (the world's largest package library)

## 3. Why is Node.js so popular?

- **One language everywhere** — frontend (browser) and backend (server) both use JavaScript.
- **Huge ecosystem** — npm has **~3 million packages** you can install with one command.
- **Fast for I/O work** — great for APIs, chat apps, streaming, real-time data.
- **Easy to start** — install one program and you're coding.

## 4. What is Node.js *not* great at?

- Heavy math / CPU-grinding work (image processing, ML training). Use Python/C++ for those.
- It's single-threaded by default — fine for most web work, not for number-crunching.

## 5. Where will you use Node.js in this plan?

By the end of the 20-hour plan you will build a **real REST API** (a backend that a website or mobile app could talk to), with login, a database, and tests. All in JavaScript, all powered by Node.js.

---

## 5-min recap (do this before moving on)

Answer out loud or in a notebook:

1. In one sentence, what is Node.js?
2. Name two things Node.js can do that browser JavaScript cannot.
3. What is `npm`?
4. Is Node.js good for: (a) a chat server, (b) editing photos? Why?

When you're done → [01-setup-and-terminal.md](01-setup-and-terminal.md)
