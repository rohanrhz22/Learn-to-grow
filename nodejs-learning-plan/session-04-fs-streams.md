# Session 4 — File System, Streams & Buffers (2h)

**Goal:** Read/write files, process large data with streams, and understand Buffers.

## Why this matters (80/20)
Streams = how Node handles big data efficiently (logs, uploads, video). The `fs` module is in nearly every real app.

---

## Plan

### 0–15 min — Warm-up
- Read: [Working with files](https://nodejs.org/en/learn/manipulating-files/working-with-files)
- Skim: [Streams](https://nodejs.org/api/stream.html#stream)

### 15–90 min — Core Hands-on
1. **Sync vs async fs:**
   ```js
   const fs = require("fs");
   const fsp = require("fs/promises");
   fs.writeFileSync("out.txt", "hi");
   await fsp.writeFile("out2.txt", "hi");
   ```
2. **Paths:** always use `path.join(__dirname, "data", "file.txt")`.
3. **Buffers:** `Buffer.from("hello").toString("hex")`.
4. **Streams — read a large file:**
   ```js
   const fs = require("fs");
   const r = fs.createReadStream("big.txt", { encoding: "utf8" });
   r.on("data", chunk => console.log("chunk:", chunk.length));
   r.on("end", () => console.log("done"));
   ```
5. **Pipe pattern (the killer feature):**
   ```js
   fs.createReadStream("in.txt").pipe(fs.createWriteStream("out.txt"));
   ```
6. **Transform stream:** uppercase every chunk using `stream.Transform`.

### 90–105 min — Mini-challenge
Write a script `wc.js` that counts lines in a file using a stream (don’t load the whole file into memory).

### 105–120 min — 15-min Review
- Why streams over `readFile` for big files? (memory)
- The 4 stream types: Readable, Writable, Duplex, Transform.
- Commit code.

---

## Resources
- https://nodejs.org/api/fs.html
- https://nodejs.org/api/stream.html
- Article: *Node.js Streams: Everything you need to know* — freeCodeCamp
