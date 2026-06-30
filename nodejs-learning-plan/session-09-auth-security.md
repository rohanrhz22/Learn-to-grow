# Session 9 — Authentication, Security & Error Handling (2h)

**Goal:** Add JWT auth, password hashing, and core security middleware.

## Why this matters (80/20)
Auth + basic hardening is required for every real API. JWT + bcrypt covers 80% of cases.

---

## Plan

### 0–15 min — Warm-up
- Read: [OWASP Top 10 for Node.js (cheat sheet)](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- Watch: *What is JWT?* — Fireship (5 min)

### 15–90 min — Core Hands-on
1. `npm install bcryptjs jsonwebtoken helmet cors express-rate-limit`
2. **Hash passwords:**
   ```js
   const bcrypt = require("bcryptjs");
   const hash = await bcrypt.hash(password, 10);
   const ok = await bcrypt.compare(password, hash);
   ```
3. **Issue JWT:**
   ```js
   const jwt = require("jsonwebtoken");
   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
   ```
4. **Auth middleware:** read `Authorization: Bearer <token>`, verify, attach `req.user`.
5. **Protect routes:** `app.get("/me", auth, handler)`.
6. **Security middleware:**
   ```js
   app.use(helmet());
   app.use(cors());
   app.use(rateLimit({ windowMs: 60_000, max: 100 }));
   ```
7. **Centralized error handler** — never leak stack traces in production.
8. Validate input with [`zod`](https://zod.dev) or `express-validator`.

### 90–105 min — Mini-challenge
Add `/auth/register` and `/auth/login` to your API. Protect `/api/todos` so only logged-in users see their own todos.

### 105–120 min — 15-min Review
- Why hash + salt? Why never store plain passwords?
- JWT pros/cons vs sessions.
- Top 5 Node security mistakes (no input validation, leaking errors, outdated deps, hardcoded secrets, no rate limit).

---

## Resources
- https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
- https://jwt.io/introduction
- https://expressjs.com/en/advanced/best-practice-security.html
