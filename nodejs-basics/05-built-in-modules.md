# Lesson 5 — Built-in Modules You'll Use Every Day

**Time:** 60 min · **Goal:** Get hands-on with the 4 stdlib modules that appear in nearly every Node project: `fs`, `path`, `os`, `url`.

---

## 1. `path` — build file paths that work everywhere (15 min)

Windows uses `\`. Mac/Linux use `/`. **Never concatenate paths with `+`** — use the `path` module.

```js
const path = require("path");

const p = path.join(__dirname, "data", "users.json");
console.log(p);
// Windows: C:\node-learning\nodejs-basics\05\data\users.json
// macOS:   /home/.../05/data/users.json
```

The methods you'll use:

```js
path.join("a", "b", "c.txt")          // "a/b/c.txt" — joins with the OS separator
path.resolve("a", "b")                // absolute path (uses cwd)
path.basename("/x/y/file.txt")        // "file.txt"
path.basename("/x/y/file.txt", ".txt")// "file"
path.dirname("/x/y/file.txt")         // "/x/y"
path.extname("/x/y/file.txt")         // ".txt"
path.parse("/x/y/file.txt")
// { root:"/", dir:"/x/y", base:"file.txt", ext:".txt", name:"file" }
```

**Rule of thumb:** when reading or writing a file, build the path with `path.join(__dirname, ...)`. That works regardless of where the user runs your script.

## 2. `fs` — the file system (20 min)

`fs` has **three flavors** for almost every operation:
1. **Sync** (`fs.readFileSync`) — blocks. Easy to use, OK for scripts and startup.
2. **Callback async** (`fs.readFile`) — the old way. Avoid in new code.
3. **Promise async** (`fs.promises.readFile`) — modern, use with `async/await`.

We'll show all three, then stick with promises.

### Reading

```js
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "hello.txt");

// 1. Sync
const dataSync = fs.readFileSync(file, "utf-8");
console.log(dataSync);

// 2. Callback
fs.readFile(file, "utf-8", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// 3. Promise — preferred
const fsp = require("fs/promises");

async function read() {
  const data = await fsp.readFile(file, "utf-8");
  console.log(data);
}
read();
```

> Always pass `"utf-8"` when reading text. Otherwise you get a raw `Buffer` (binary).

### Writing, appending, deleting

```js
const fsp = require("fs/promises");
const path = require("path");

const file = path.join(__dirname, "notes.txt");

async function demo() {
  await fsp.writeFile(file, "First line\n");           // overwrites
  await fsp.appendFile(file, "Second line\n");         // adds
  const text = await fsp.readFile(file, "utf-8");
  console.log(text);
  // await fsp.unlink(file);                           // delete
}
demo();
```

### Working with directories

```js
const fsp = require("fs/promises");

async function demo() {
  await fsp.mkdir("output", { recursive: true });      // mkdir -p
  const files = await fsp.readdir(".");                // ["a.js", "b.js", ...]
  console.log("Files here:", files);

  const stat = await fsp.stat("README.md");
  console.log("Size:", stat.size, "bytes");
  console.log("Is file?", stat.isFile());
  console.log("Is dir? ", stat.isDirectory());
}
demo();
```

### Check if a file exists

There's no clean `exists()` — use `stat` or `access`:

```js
const fsp = require("fs/promises");

async function exists(p) {
  try { await fsp.access(p); return true; }
  catch { return false; }
}

(async () => {
  console.log(await exists("./package.json"));   // true
  console.log(await exists("./nope.txt"));       // false
})();
```

### Mini real-world example: tiny JSON store

```js
const fsp = require("fs/promises");
const path = require("path");
const FILE = path.join(__dirname, "todos.json");

async function load() {
  try {
    return JSON.parse(await fsp.readFile(FILE, "utf-8"));
  } catch {
    return [];   // first run, file doesn't exist
  }
}

async function save(todos) {
  await fsp.writeFile(FILE, JSON.stringify(todos, null, 2));
}

(async () => {
  const todos = await load();
  todos.push({ id: Date.now(), text: process.argv[2] || "untitled" });
  await save(todos);
  console.log("Saved. Total:", todos.length);
})();
```

Run several times with different args: `node store.js "buy milk"`. Open `todos.json`.

## 3. `os` — info about the machine (10 min)

```js
const os = require("os");

os.platform()                  // "win32"
os.type()                      // "Windows_NT"
os.arch()                      // "x64"
os.cpus().length               // number of CPU cores
os.totalmem() / 1024**3        // total RAM in GB
os.freemem()  / 1024**3        // free RAM in GB
os.hostname()                  // computer name
os.homedir()                   // your home directory
os.uptime()                    // seconds since boot
os.userInfo()                  // { username, uid, homedir, shell }
os.networkInterfaces()         // network adapters
os.EOL                         // "\n" or "\r\n" — line separator for this OS
```

Useful when you write tools that need to behave differently per OS, or when you log system stats.

## 4. `url` — parsing & building URLs (10 min)

Modern code uses the `URL` class (also built into browsers — same API).

```js
const u = new URL("https://example.com:8080/api/users?id=42&active=true#top");

u.protocol      // "https:"
u.hostname      // "example.com"
u.port          // "8080"
u.pathname      // "/api/users"
u.search        // "?id=42&active=true"
u.hash          // "#top"
u.searchParams.get("id")        // "42"
u.searchParams.get("active")    // "true"
u.searchParams.set("page", 2);
console.log(u.toString());
// "https://example.com:8080/api/users?id=42&active=true&page=2#top"
```

You'll use `URL` heavily in Session 6 when parsing incoming HTTP requests.

## 5. Mini exercise (10 min)

Build `report.js` that:
1. Uses `os` to gather: hostname, platform, CPU count, free memory (in MB).
2. Builds a path with `path.join(__dirname, "reports", "system.json")`.
3. Creates the `reports` folder if it doesn't exist (`fs.promises.mkdir` with `recursive: true`).
4. Writes the data as pretty JSON.
5. Reads it back and `console.log`s it.

Run a few times — confirm the file updates.

---

## 5-min recap

1. Why use `path.join` instead of `"folder/" + name`?
2. What's the difference between `fs.readFileSync` and `fs.promises.readFile`?
3. How do you check if a file exists without throwing?
4. What does `new URL(...).searchParams.get("id")` return?

When you're done → [06-async-basics.md](06-async-basics.md)
