# Lesson 1 — Install Node, VS Code & Use the Terminal

**Time:** 45 min · **Goal:** Have a working dev environment and be comfortable typing 10 terminal commands.

---

## 1. Install Node.js (10 min)

1. Go to https://nodejs.org
2. Download the **LTS** version (the green button — LTS = "Long-Term Support" = stable).
3. Run the installer. Click *Next → Next → Install*. Defaults are fine.
4. **Verify it worked** — open a new terminal (see step 3) and type:
   ```
   node -v
   npm -v
   ```
   You should see two version numbers like `v20.11.0` and `10.2.4`. If yes — Node is installed.

## 2. Install VS Code (5 min)

1. Go to https://code.visualstudio.com
2. Download and install.
3. Open it. That's your code editor for the rest of the plan.

Optional but helpful: install the **"JavaScript (ES6) code snippets"** extension from the Extensions panel (left sidebar, square icon).

## 3. Open a terminal (5 min)

A **terminal** is a window where you type commands instead of clicking buttons.

- **In VS Code:** menu `Terminal → New Terminal`. A panel opens at the bottom. That's your terminal.
- **On Windows alone:** press `Win` key → type `PowerShell` → open it.

You'll see a prompt like:
```
PS C:\Users\you>
```
The `PS C:\Users\you>` part shows **where you are** (the current folder). You type commands after the `>`.

## 4. The 10 commands you actually need (15 min)

Type each one, press Enter, and watch what happens. The `#` lines are explanations — don't type them.

```powershell
# Where am I?
pwd

# List files in the current folder
ls

# Make a new folder called "test"
mkdir test

# Go into that folder
cd test

# Go back up one folder
cd ..

# Create an empty file
ni hello.txt        # PowerShell — "New-Item"

# Show the contents of a file
cat hello.txt

# Clear the screen
cls

# Remove a file (careful!)
rm hello.txt

# Remove an empty folder
rmdir test
```

### Try this small exercise

1. Create a folder called `node-learning`.
2. Go into it.
3. Create a folder inside called `playground`.
4. Go into `playground`.
5. Run `pwd` to confirm where you are.

You'll use `node-learning/` for every session in the main plan.

## 5. Open a folder in VS Code (5 min)

In VS Code: `File → Open Folder…` → pick your `node-learning` folder.
Now the left sidebar shows your files, and the terminal at the bottom is already pointing at that folder. **This is the setup you'll use for every session.**

---

## 5-min recap

1. What does `cd` do? What about `ls`?
2. How do you check that Node is installed?
3. What's the difference between a "terminal" and an "editor"?
4. Where is your `node-learning/` folder on your machine?

When you're done → [02-javascript-essentials.md](02-javascript-essentials.md)
