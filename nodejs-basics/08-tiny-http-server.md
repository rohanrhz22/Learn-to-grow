# Lesson 8 — Tiny HTTP Server From Scratch (No Express Yet)

**Time:** 60 min · **Goal:** Build a real HTTP server using only Node's built-in `http` module — so you understand what Express is doing for you later.

---

## 1. What is an HTTP server, really? (5 min)

An HTTP server is a program that:
1. Listens on a **port** (e.g., 3000).
2. Waits for incoming **requests** from clients (browsers, `curl`, mobile apps).
3. Reads the request: method (`GET`/`POST`/...), URL, headers, body.
4. Sends back a **response**: status code (200, 404, 500...), headers, body.

That's it. Express, Fastify, Koa — all of them sit on top of this same idea.

## 2. The 6-line server (5 min)

Create `server.js`:
```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Hello from Node!");
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
```

Run: `node server.js`. Open http://localhost:3000 in your browser. Or in a new terminal:
```
curl http://localhost:3000
```

Press `Ctrl+C` to stop.

> Notice: `createServer` takes a handler that receives `(req, res)` for *every* request. `req` is a Readable stream (the request); `res` is a Writable stream (the response). Lesson 7 wasn't just theory.

## 3. Reading method and URL (10 min)

```js
const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Home</h1>");
    return;
  }

  if (req.method === "GET" && req.url === "/about") {
    res.end("About page");
    return;
  }

  res.statusCode = 404;
  res.end("Not Found");
});

server.listen(3000, () => console.log("http://localhost:3000"));
```

Visit `/`, `/about`, `/nope` and watch the terminal log each request.

**That's "routing"** — matching the request method + URL to a handler. Express makes this prettier; nothing more.

## 4. Sending JSON (10 min)

Most modern servers speak JSON, not HTML.

```js
const http = require("http");

const users = [
  { id: 1, name: "Asha" },
  { id: 2, name: "Ravi" },
];

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/users") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users));
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3000, () => console.log("http://localhost:3000"));
```

Test:
```
curl http://localhost:3000/api/users
```

You should see the JSON array.

## 5. Reading a request body (POST) (15 min)

`req` is a **stream** — the body arrives in chunks. You collect them, then parse.

```js
const http = require("http");

const users = [];

const server = http.createServer((req, res) => {
  // GET /api/users — list
  if (req.method === "GET" && req.url === "/api/users") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users));
    return;
  }

  // POST /api/users — create
  if (req.method === "POST" && req.url === "/api/users") {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try {
        const body = JSON.parse(raw);
        const user = { id: users.length + 1, name: body.name };
        users.push(user);
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(user));
      } catch {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3000, () => console.log("http://localhost:3000"));
```

Test:
```powershell
# Add a user
curl -X POST http://localhost:3000/api/users `
  -H "Content-Type: application/json" `
  -d '{"name":"Sandya"}'

# List them
curl http://localhost:3000/api/users
```

**This is what Express's `app.use(express.json())` does for you in one line.** Worth doing once by hand.

## 6. Status codes you should know (5 min)

| Code | Meaning | Use when |
|---|---|---|
| 200 | OK | Success on GET / generic success |
| 201 | Created | Success on POST that creates something |
| 204 | No Content | Success but no body (e.g., DELETE) |
| 400 | Bad Request | Client sent invalid data |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | Logged in, but not allowed |
| 404 | Not Found | URL or resource doesn't exist |
| 409 | Conflict | E.g., email already registered |
| 500 | Server Error | Your code crashed |

Memorize these. You'll use them every day.

## 7. Auto-restart while you develop (5 min)

Tired of pressing Ctrl+C and `node server.js` after every edit?

```
npm init -y
npm install -D nodemon
```
Add to `package.json`:
```json
"scripts": { "dev": "nodemon server.js" }
```
Run:
```
npm run dev
```
Save the file → server restarts itself. You'll use this for every server you write from here on.

## 8. Mini project — books API (10 min)

Extend section 5 into a tiny CRUD:

- `GET    /api/books`     → list all
- `GET    /api/books/:id` → get one (hint: parse the id from `req.url`)
- `POST   /api/books`     → create
- `DELETE /api/books/:id` → remove

Start with an in-memory array. Use JSON throughout.

When you finish — note how much code you wrote vs how much Express will replace later. **That contrast is why Express exists.**

---

## 5-min recap

1. What two things does `http.createServer((req, res) => {...})` give you?
2. Why must you collect `req` in chunks for POST bodies?
3. What status code do you return after a successful create?
4. What does `nodemon` do?

---

## 🎓 You finished the Node.js Basics deep dive!

You now understand: runtime, event loop, globals, modules, npm, built-in modules, async, events, streams, and HTTP — the entire **mental model** of Node.js.

➡️ **Go to [../session-01-fundamentals.md](../session-01-fundamentals.md)** and start the main 20-hour plan. The first sessions will feel familiar — that's the whole point. You'll move faster and absorb more.

Good luck, and have fun building.
