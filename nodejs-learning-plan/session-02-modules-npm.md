# Session 2 — Modules, npm & Project Structure (2h)

**Goal:** Master CommonJS + ES Modules, npm/package.json, and how real Node projects are organized.

## Why this matters (80/20)
Every Node project lives or dies by clean module boundaries and well-managed dependencies. This is the foundation for everything in sessions 3–10.

---

## Plan

### 0–15 min — Warm-up
- Read: [Introduction to modules](https://nodejs.org/api/modules.html#modules-commonjs-modules)
- Skim: [package.json guide](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

### 15–90 min — Core Hands-on
1. **CommonJS:**
   ```js
   // math.js
   function add(a, b) { return a + b; }
   module.exports = { add };
   ```
   ```js
   // app.js
   const { add } = require("./math");
   console.log(add(2, 3));
   ```
2. **ES Modules:** Add `"type": "module"` to `package.json`, then use `import/export`.
3. **npm basics:**
   - `npm init -y`
   - `npm install lodash`
   - `npm install --save-dev nodemon`
   - Inspect `package.json`, `package-lock.json`, `node_modules/`.
4. **Scripts:** add `"start": "node app.js"`, `"dev": "nodemon app.js"`. Run with `npm run dev`.
5. **Semantic versioning:** understand `^1.2.3`, `~1.2.3`, `1.2.3`.
6. Recommended project structure:
   ```
   my-app/
     src/
       index.js
       routes/
       controllers/
       services/
       models/
     tests/
     package.json
     .gitignore   (node_modules, .env)
     .env
   ```

### 90–105 min — Mini-challenge
Build a tiny CLI: `node greet.js Sandy` → prints `Hello, Sandy!`. Use a separate module `greet.js` exporting the function.

### 105–120 min — 15-min Review
- Differences: CommonJS vs ESM (3 points each).
- Why never commit `node_modules/`? What does `package-lock.json` do?
- Commit and push.

---

## Resources
- https://nodejs.org/api/modules.html
- https://docs.npmjs.com
- Video: *npm Crash Course* — Traversy Media
- Cheatsheet: https://devhints.io/npm
