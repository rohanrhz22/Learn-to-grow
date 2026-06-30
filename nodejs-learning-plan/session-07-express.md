# Session 7 — Express.js: Routing, Middleware, REST APIs (2h)

**Goal:** Build a clean REST API with Express.

## Why this matters (80/20)
Express is the de facto Node web framework. Knowing routing + middleware = you can build 80% of backend APIs.

---

## Plan

### 0–15 min — Warm-up
- Read: [Express Hello World](https://expressjs.com/en/starter/hello-world.html)
- Read: [Using middleware](https://expressjs.com/en/guide/using-middleware.html)

### 15–90 min — Core Hands-on
1. `npm install express`
2. **Hello Express:**
   ```js
   const express = require("express");
   const app = express();
   app.use(express.json());
   app.get("/", (req, res) => res.send("Hello"));
   app.listen(3000);
   ```
3. **Routes:** `GET/POST/PUT/DELETE`, route params `/users/:id`, query `req.query`.
4. **Middleware pipeline:** logging middleware, auth middleware, error-handling middleware (`(err, req, res, next)`).
5. **Router modularization:**
   ```js
   // routes/users.js
   const router = require("express").Router();
   router.get("/", ...); router.post("/", ...);
   module.exports = router;
   ```
   ```js
   app.use("/api/users", require("./routes/users"));
   ```
6. **Project layout:** `controllers/`, `routes/`, `middleware/`, `services/`.
7. **Environment variables:** `npm i dotenv` → `require("dotenv").config()`.

### 90–105 min — Mini-challenge
Rebuild the Session 6 todo API in Express with proper routes, JSON middleware, and a centralized error handler. Test with Thunder Client.

### 105–120 min — 15-min Review
- The middleware contract: `(req, res, next)`. What happens if you forget `next()`?
- REST conventions: which verb for what action?
- Commit.

---

## Resources
- https://expressjs.com
- Video: *Express JS Crash Course* — Traversy Media
- Tutorial: https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs
