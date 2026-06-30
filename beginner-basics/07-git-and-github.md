# Lesson 7 — Git & GitHub Basics

**Time:** 45 min · **Goal:** Track your code with Git, push it to GitHub, and never lose work again. Every session in the main plan ends with "commit your code" — this is how.

---

## 1. What & why

- **Git** = a tool on your computer that records snapshots of your code over time.
- **GitHub** = a website that stores your Git repos online so you can back them up and share them.

Together they give you:
- A full history (undo any change, any time)
- A backup (your laptop dies → your code is safe)
- A portfolio (recruiters look at your GitHub)

## 2. One-time install & setup (10 min)

1. Install Git: https://git-scm.com/downloads → next, next, install.
2. Verify in a new terminal:
   ```
   git --version
   ```
3. Tell Git who you are (once, ever):
   ```
   git config --global user.name  "Your Name"
   git config --global user.email "you@example.com"
   ```
4. Create a GitHub account: https://github.com (free).

## 3. The 6 commands that cover 95% of Git work

Run these inside your `node-learning/` folder.

```powershell
# 1. Start tracking this folder with Git (one time per project)
git init

# 2. See what changed
git status

# 3. Stage files (mark them as "ready to save")
git add .                    # all changes
git add hello.js             # just one file

# 4. Save a snapshot with a message
git commit -m "Add hello script"

# 5. See your history
git log --oneline

# 6. Push to GitHub (after you connect a remote — step 5 below)
git push
```

That's it. `status → add → commit` is the loop you'll run dozens of times.

## 4. The `.gitignore` file (super important)

You do **NOT** want to commit `node_modules/` — it's huge and recreatable.

In your project root, create a file named `.gitignore`:

```
node_modules/
.env
*.log
.DS_Store
```

Now `git status` won't even mention those files. Commit `.gitignore` itself.

> **Rule:** if a file can be regenerated (`node_modules`) or contains secrets (`.env`), it goes in `.gitignore`.

## 5. Push your project to GitHub (15 min)

1. On https://github.com click **+ → New repository**.
2. Name it `node-learning`. Leave it **empty** (no README, no .gitignore).
3. Click **Create**. GitHub shows you commands. Copy the **"…or push an existing repository"** block. It looks like:
   ```
   git remote add origin https://github.com/<your-user>/node-learning.git
   git branch -M main
   git push -u origin main
   ```
4. Run those three commands in your terminal (inside `node-learning/`).
5. Refresh the GitHub page — your code is online.

From now on, after every session:
```
git add .
git commit -m "Session 3: async/await complete"
git push
```

## 6. The mental model — three "areas"

```
   working dir          staging area           repo (commits)
   ────────────         ────────────           ─────────────
   you edit files  →    git add  →  git commit  →   history
                                              git push  →  GitHub
```

- **Edit** files freely.
- `git add` says "include this in the next snapshot."
- `git commit` saves the snapshot locally.
- `git push` uploads commits to GitHub.

## 7. Two lifesaver commands

```powershell
# Undo changes in a file you haven't staged yet (BE SURE first)
git restore hello.js

# See exactly what changed in a file
git diff hello.js
```

## 8. Mini exercise (10 min)

1. In `node-learning/`, run `git init`.
2. Create `.gitignore` with `node_modules/`.
3. Make a tiny file `notes.md` with one line.
4. Run:
   ```
   git status
   git add .
   git commit -m "Initial commit"
   git log --oneline
   ```
5. Create a GitHub repo and push.
6. Edit `notes.md`, add another line, then commit & push again.
7. Refresh GitHub — see both commits in the history.

---

## 5-min recap

1. Difference between Git and GitHub?
2. What's the `status → add → commit` loop?
3. Why does `node_modules/` belong in `.gitignore`?
4. What command uploads your commits to GitHub?

---

## 🎯 You're truly ready now

You can read & write JS, run Node scripts, install packages, debug errors, work with JSON, and version-control your code. That's a complete beginner foundation.

➡️ **Go to [../session-01-fundamentals.md](../session-01-fundamentals.md)** and start the main 20-hour plan with confidence.
