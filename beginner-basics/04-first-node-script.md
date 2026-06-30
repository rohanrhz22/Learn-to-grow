# Lesson 4 — Your First Node Script

**Time:** 45 min · **Goal:** Run JavaScript files with Node, accept input, use a built-in module, and install your first npm package.

---

## 1. The "hello world" of Node (5 min)

In your `node-learning/playground/` folder, create `hello.js`:

```js
console.log("Hello from Node!");
console.log("Today is", new Date().toDateString());
```

In the terminal (make sure you're in the same folder — use `cd`):
```
node hello.js
```

You should see two lines printed. Congrats — you just ran a Node program.

## 2. Read command-line arguments (10 min)

Node gives you `process.argv` — an array of everything typed after `node`.

Create `greet.js`:
```js
const args = process.argv;      // ["node", "...path/greet.js", ...your args]
const name = args[2] || "stranger";
console.log(`Hello, ${name}!`);
```

Run:
```
node greet.js Sandya
node greet.js
```

Output:
```
Hello, Sandya!
Hello, stranger!
```

> `process` is a **global** in Node — always available, no import needed. You'll meet it again in Session 1.

## 3. Use a built-in module (10 min)

Node ships with dozens of **built-in modules** — code you can use without installing anything. Let's use `os` to print system info.

Create `system.js`:
```js
const os = require("os");

console.log("Platform:    ", os.platform());
console.log("CPU cores:   ", os.cpus().length);
console.log("Free memory: ", (os.freemem() / 1024 / 1024).toFixed(0), "MB");
console.log("Home dir:    ", os.homedir());
```

Run: `node system.js`.

`require("os")` is how Node loads a module. You'll learn the full module system in **Session 2**.

## 4. Install your first npm package (15 min)

`npm` (Node Package Manager) lets you install libraries written by others. Let's install **chalk** to print colored text.

Step by step, in your `playground/` folder:

```
# 1. Create a package.json (just press Enter for every question)
npm init -y

# 2. Install chalk
npm install chalk
```

You'll see a new folder `node_modules/` and a file `package.json` updated. **Don't edit `node_modules` by hand** — it's managed by npm.

Now create `colors.js`:
```js
const chalk = require("chalk");

console.log(chalk.green("Success!"));
console.log(chalk.red("Error!"));
console.log(chalk.blue.bold("Important note"));
```

Run: `node colors.js`. You should see colored output in your terminal.

> **You just used the same workflow that real Node projects use** — `npm init`, `npm install <package>`, `require()` it, run it.

### What is `package.json`?
Open it. It's a small file that records:
- Your project's name & version
- Which packages it depends on (`dependencies`)
- Scripts you can run

When you share your project, you share `package.json` (NOT `node_modules/`). Anyone can run `npm install` to recreate the same setup.

## 5. Mini exercise (10 min)

Build `cli-greet.js` that:
1. Reads a name from `process.argv`.
2. Uses `chalk` to print `Hello, <name>!` in green.
3. If no name is given, prints `Please give me a name` in red.

Run it with: `node cli-greet.js Sandya`.

---

## 5-min recap

1. How do you run a `.js` file with Node?
2. What is `process.argv`?
3. What does `require("os")` do?
4. What does `npm install chalk` create on your disk?
5. Why should you NOT commit `node_modules/` to git?

When you're done → [05-errors-and-debugging.md](05-errors-and-debugging.md)
