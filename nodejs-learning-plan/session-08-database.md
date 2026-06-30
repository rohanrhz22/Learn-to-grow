# Session 8 — Databases with MongoDB + Mongoose (2h)

**Goal:** Persist data from your Express API using MongoDB.

## Why this matters (80/20)
Most Node tutorials, jobs, and side projects pair Node + Mongo. Mongoose gives you schemas, validation, and queries in a few lines.

> Prefer SQL? Swap Mongoose for **Prisma + PostgreSQL** — same session shape applies.

---

## Plan

### 0–15 min — Warm-up
- Sign up: [MongoDB Atlas free tier](https://www.mongodb.com/cloud/atlas) (or install MongoDB locally).
- Read: [Mongoose Quickstart](https://mongoosejs.com/docs/index.html)

### 15–90 min — Core Hands-on
1. `npm install mongoose`
2. **Connect:**
   ```js
   const mongoose = require("mongoose");
   await mongoose.connect(process.env.MONGO_URI);
   ```
3. **Define a schema & model:**
   ```js
   const TodoSchema = new mongoose.Schema({
     title: { type: String, required: true },
     done:  { type: Boolean, default: false },
   }, { timestamps: true });
   module.exports = mongoose.model("Todo", TodoSchema);
   ```
4. **CRUD operations:** `Todo.create`, `Todo.find`, `Todo.findById`, `findByIdAndUpdate`, `findByIdAndDelete`.
5. Wire CRUD into your Express routes from Session 7 — replace the in-memory array.
6. **Validation & error handling** at the model level.

### 90–105 min — Mini-challenge
Add a `User` model with `name`, `email` (unique). Add `GET /api/users` and `POST /api/users` routes. Reject duplicate emails with a 400.

### 105–120 min — 15-min Review
- Schema vs Model vs Document.
- Why use indexes? When to use `lean()`?
- Commit.

---

## Resources
- https://mongoosejs.com/docs/guide.html
- https://www.mongodb.com/docs/manual/tutorial/getting-started
- Video: *MongoDB + Mongoose Crash Course* — Web Dev Simplified
