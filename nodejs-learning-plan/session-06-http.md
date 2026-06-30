# Session 6 — HTTP Module & Building a Web Server (2h)

**Goal:** Build a raw HTTP server with the built-in `http` module — no frameworks yet.

## Why this matters (80/20)
Express hides a lot. Doing it raw once means you understand what frameworks actually do.

---

## Plan

### 0–15 min — Warm-up
- Read: [Anatomy of an HTTP transaction](https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction)

### 15–90 min — Core Hands-on
1. **Hello server:**
   ```js
   const http = require("http");
   const server = http.createServer((req, res) => {
     res.writeHead(200, { "Content-Type": "text/plain" });
     res.end("Hello from Node");
   });
   server.listen(3000, () => console.log("http://localhost:3000"));
   ```
2. **Routing by `req.url` + `req.method`** — implement `/`, `/about`, `/api/users`.
3. **Return JSON:**
   ```js
   res.writeHead(200, { "Content-Type": "application/json" });
   res.end(JSON.stringify({ ok: true }));
   ```
4. **Parse POST body** (collect `data` events, `JSON.parse` on `end`).
5. **Status codes & headers** — 200, 201, 400, 404, 500.
6. Test with [Postman](https://www.postman.com), [Thunder Client](https://www.thunderclient.com), or `curl`.

### 90–105 min — Mini-challenge
Build a small in-memory todo API: `GET /todos`, `POST /todos`, `DELETE /todos/:id`. No Express.

### 105–120 min — 15-min Review
- What does `res.end()` actually do?
- Why is raw routing painful? (Motivates Express in next session.)
- Commit.

---

## Resources
- https://nodejs.org/api/http.html
- Video: *Build a Node.js server from scratch* — Hussein Nasser
