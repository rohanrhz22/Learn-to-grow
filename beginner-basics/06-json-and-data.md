# Lesson 6 — JSON & Working with Data

**Time:** 45 min · **Goal:** Read & write JSON — the universal data format used by every API, config file, and database you'll meet.

---

## 1. What is JSON?

**JSON** = **J**ava**S**cript **O**bject **N**otation. It's a plain-text format for representing data that looks almost exactly like a JavaScript object.

```json
{
  "name": "Sandya",
  "age": 26,
  "skills": ["JS", "Node"],
  "isAdmin": false,
  "address": null
}
```

Rules JSON enforces (stricter than JS):
- Keys **must** be in double quotes: `"name"` ✅ &nbsp; `name` ❌
- Strings **must** use double quotes: `"hi"` ✅ &nbsp; `'hi'` ❌
- No trailing commas
- No comments
- Allowed values: string, number, boolean, `null`, array, object

It's used **everywhere**: APIs return JSON, `package.json` is JSON, MongoDB stores JSON-like docs, config files are JSON.

## 2. The 2 functions you'll use forever

### `JSON.stringify(obj)` — object → JSON string
```js
const user = { name: "Asha", age: 30 };

const text = JSON.stringify(user);
console.log(text);
// → {"name":"Asha","age":30}

// Pretty-printed (2-space indent)
console.log(JSON.stringify(user, null, 2));
/*
{
  "name": "Asha",
  "age": 30
}
*/
```

### `JSON.parse(str)` — JSON string → object
```js
const text = '{"name":"Asha","age":30}';

const user = JSON.parse(text);
console.log(user.name);     // Asha
console.log(user.age + 1);  // 31  (it's a real object now)
```

> **Why both?** Files, network requests, and databases give you **strings**. To work with the data in code, you `parse` it. To send it back out, you `stringify` it.

## 3. Reading & writing a JSON file (real Node code)

This is a small preview of Session 4 — try it now.

Create `data.json`:
```json
{
  "books": [
    { "id": 1, "title": "Atomic Habits", "read": true },
    { "id": 2, "title": "Deep Work",     "read": false }
  ]
}
```

Create `books.js`:
```js
const fs = require("fs");

// READ
const raw = fs.readFileSync("data.json", "utf-8");
const data = JSON.parse(raw);

console.log("Total books:", data.books.length);
data.books.forEach(b => console.log("-", b.title, b.read ? "✓" : "✗"));

// ADD a new book
data.books.push({ id: 3, title: "Clean Code", read: false });

// WRITE back
fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
console.log("Saved!");
```

Run `node books.js` twice. Look at `data.json` after each run — it grows.

> You just built a tiny database. That's the pattern behind every backend app.

## 4. JSON from the internet (preview of HTTP)

Modern Node has `fetch` built-in:

```js
async function main() {
  const res  = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await res.json();   // parses JSON for you
  console.log(user.name, "-", user.email);
}
main();
```

Run it: `node fetch-user.js`. You just talked to a real API. Sessions 6–8 build on this.

> Don't worry about `async/await` yet — Session 3 covers it. Just notice: API → JSON → JS object.

## 5. Common JSON mistakes (and the errors they give)

| Mistake | Error |
|---------|-------|
| Single quotes: `{ 'a': 1 }` | `SyntaxError: Unexpected token '` |
| Trailing comma: `{ "a": 1, }` | `SyntaxError: Unexpected token }` |
| Comments inside JSON | `SyntaxError: Unexpected token /` |
| Forgot to `JSON.parse` — treating string as object | `undefined` everywhere |
| Forgot to `JSON.stringify` before writing — file shows `[object Object]` | Logic bug, not a thrown error |

If `JSON.parse` blows up, wrap it in `try/catch` (from Lesson 5).

## 6. Mini exercise (10 min)

Create `notes.js` that:
1. Reads `notes.json` (create one with `{ "items": [] }`).
2. Adds a new note from the command line: `node notes.js "buy milk"`.
   - Hint: `const text = process.argv[2];`
3. Saves it back with `JSON.stringify(..., null, 2)`.
4. Prints all notes after saving.

Run several times with different notes and watch the file grow.

---

## 5-min recap

1. Name 3 differences between JSON and a JS object literal.
2. What does `JSON.parse` do? `JSON.stringify`?
3. Why does `JSON.stringify(obj, null, 2)` look nicer?
4. What does an API usually return?

When you're done → [07-git-and-github.md](07-git-and-github.md)
