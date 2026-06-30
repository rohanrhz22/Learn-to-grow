# Session 10 — Testing, Debugging & Deployment (2h)

**Goal:** Test your API, debug effectively, and deploy it online.

## Why this matters (80/20)
Code that isn’t tested or deployed doesn’t count. This session turns your project into a real, shippable app.

---

## Plan

### 0–15 min — Warm-up
- Read: [Jest Getting Started](https://jestjs.io/docs/getting-started)
- Skim: [Debugging Node.js](https://nodejs.org/en/learn/getting-started/debugging)

### 15–90 min — Core Hands-on
1. **Install testing tools:**
   ```bash
   npm install --save-dev jest supertest
   ```
   Add to `package.json`: `"test": "jest"`.
2. **Unit test a function:**
   ```js
   // math.test.js
   const { add } = require("./math");
   test("adds", () => expect(add(2, 3)).toBe(5));
   ```
3. **API integration test with supertest:**
   ```js
   const request = require("supertest");
   const app = require("../src/app");
   test("GET /todos", async () => {
     const res = await request(app).get("/api/todos");
     expect(res.status).toBe(200);
   });
   ```
4. **Debugging:**
   - `node --inspect-brk app.js` + Chrome DevTools / VS Code debugger.
   - VS Code: create `.vscode/launch.json` → Node.js launch config.
5. **Logging:** `npm i pino` or `winston` instead of `console.log` in production.
6. **Deployment options (pick ONE and ship):**
   - [Render](https://render.com) — easiest free tier
   - [Railway](https://railway.app)
   - [Fly.io](https://fly.io)
   - Steps: push to GitHub → connect repo → set env vars (`MONGO_URI`, `JWT_SECRET`) → deploy.
7. Add a `Dockerfile` (bonus):
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY . .
   EXPOSE 3000
   CMD ["node", "src/index.js"]
   ```

### 90–105 min — Mini-challenge
Deploy your full Express + Mongo + JWT API live. Share the URL. Hit it with Postman.

### 105–120 min — 15-min Review
- Unit vs integration vs e2e tests.
- 3 debugging tools you’ll actually use.
- **Final checklist:**
  - [ ] Git repo with clean commits
  - [ ] README with setup + API docs
  - [ ] `.env.example` (never commit `.env`)
  - [ ] Tests passing
  - [ ] Deployed URL

---

## What’s Next (after these 20 hours)
- **TypeScript with Node** — type safety
- **WebSockets / Socket.IO** — realtime
- **GraphQL** with Apollo Server
- **NestJS** — opinionated framework
- **Microservices & message queues** (RabbitMQ, Redis, Kafka)
- **Performance & profiling** — clinic.js, 0x

Congratulations — you now know the 20% of Node.js that does 80% of the work.

---

## Resources
- https://jestjs.io
- https://github.com/ladjs/supertest
- https://render.com/docs/deploy-node-express-app
- Book: *Node.js Design Patterns* by Mario Casciaro (next-level reading)
