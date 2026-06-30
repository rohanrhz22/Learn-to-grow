# Lesson 4 — npm Deep Dive: `package.json`, Scripts & Semver

**Time:** 60 min · **Goal:** Understand `package.json` line-by-line, install packages confidently, write npm scripts, and read version numbers.

---

## 1. What npm actually is (5 min)

`npm` is **three things in one**:
1. A **registry** — a giant website (https://npmjs.com) hosting open-source packages.
2. A **CLI tool** — the `npm` command on your machine.
3. A **standard** — the `package.json` file format every Node project uses.

There are alternatives (`yarn`, `pnpm`) but they all read the same `package.json`. Learn npm; the rest are similar.

## 2. Create a project from scratch (10 min)

```powershell
mkdir my-app
cd my-app
npm init -y         # -y = accept all defaults
```

You now have a `package.json`. Open it:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Field-by-field:
| Field | Meaning |
|---|---|
| `name` | package name (lowercase, no spaces) |
| `version` | your project's version (semver) |
| `main` | the entry file when someone `require`s your package |
| `scripts` | shortcuts you can run via `npm run <name>` |
| `dependencies` | packages your app **needs at runtime** |
| `devDependencies` | packages only needed during development (testing, linting) |

## 3. Installing packages (10 min)

```powershell
# Runtime dependency (saved under "dependencies")
npm install express
# alias:  npm i express

# Dev dependency
npm install --save-dev nodemon
# alias:  npm i -D nodemon

# Global install (rarely needed — try to avoid)
npm install -g http-server

# Install a specific version
npm install lodash@4.17.21

# Install from package.json (e.g., after cloning a repo)
npm install
```

After `npm install express`, look at `package.json`:
```json
"dependencies": {
  "express": "^4.19.2"
}
```

And on disk you now have:
- `node_modules/` — all installed code (huge, never commit)
- `package-lock.json` — exact versions of everything (commit this!)

### `package-lock.json` — why it matters

`package.json` says "I want express ^4.19.2". The **lockfile** records exactly which version (4.19.2 vs 4.19.3) and the exact versions of express's own dependencies. This makes installs **reproducible** across machines and time.

> Rule: **commit `package-lock.json`** to git. Never edit it by hand.

## 4. Semver — read version numbers like a pro (10 min)

A version like `4.19.2` is **MAJOR.MINOR.PATCH**:

- **MAJOR** (4 → 5): breaking changes. Your code might break.
- **MINOR** (19 → 20): new features, backward-compatible.
- **PATCH** (2 → 3): bug fixes, backward-compatible.

The symbol in front controls what npm allows when you run `npm install`:

| Symbol | Example | Allows | Doesn't allow |
|---|---|---|---|
| `^` (caret) | `^4.19.2` | any 4.x.x ≥ 4.19.2 | 5.0.0 |
| `~` (tilde) | `~4.19.2` | any 4.19.x ≥ 4.19.2 | 4.20.0 |
| (none) | `4.19.2` | only 4.19.2 | anything else |
| `*` | `*` | latest | (don't use) |

**For beginners:** the default `^` is fine in 95% of cases. Just trust it.

## 5. npm scripts — your project's command center (15 min)

Edit `package.json`:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest",
    "lint": "eslint .",
    "hello": "echo Hello from npm"
  }
}
```

Run them:
```
npm start           # special — no "run" needed
npm test            # also special
npm run dev         # everything else needs "run"
npm run hello
```

Why use scripts instead of typing commands?
- **Discoverable** — `npm run` lists all scripts.
- **Consistent** — everyone on the team uses the same command.
- **Cross-tool** — combine multiple steps: `"build": "rimraf dist && tsc"`.

### `nodemon` — auto-restart on save (super useful)

```powershell
npm install -D nodemon
```
```json
"scripts": { "dev": "nodemon app.js" }
```
```
npm run dev
```
Edit `app.js`, save → nodemon restarts the app. You'll use this constantly in Sessions 6–10.

## 6. Useful npm commands (5 min)

```powershell
npm list                # what's installed (top level)
npm list --depth=0      # cleaner

npm outdated            # which packages have updates
npm update              # update within the ^/~ range

npm uninstall chalk     # remove a package
npm i chalk             # add it back

npm info express        # see info about a package on the registry
npm info express versions   # all published versions

npm audit               # check for known vulnerabilities
npm audit fix           # auto-fix where safe
```

## 7. Mini project (10 min)

Build a tiny CLI greeting tool:

1. `mkdir greet-cli && cd greet-cli`
2. `npm init -y`
3. `npm install chalk`
4. Create `index.js`:
   ```js
   const chalk = require("chalk");
   const name = process.argv[2] || "friend";
   console.log(chalk.cyan(`Hello, ${name}!`));
   ```
5. Add scripts to `package.json`:
   ```json
   "scripts": {
     "start": "node index.js",
     "greet": "node index.js Sandya"
   }
   ```
6. Run: `npm start World`  and  `npm run greet`

**Bonus:** install `nodemon` as a dev dependency, add a `"dev": "nodemon index.js"` script, run it, edit the file, watch it restart.

---

## 5-min recap

1. Difference between `dependencies` and `devDependencies`?
2. What does `^4.19.2` mean exactly?
3. Should you commit `node_modules/`? `package-lock.json`?
4. What does `npm run dev` do that `npm dev` doesn't?

When you're done → [05-built-in-modules.md](05-built-in-modules.md)
