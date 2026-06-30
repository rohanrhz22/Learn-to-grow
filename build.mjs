// build.mjs — Static site generator for the "Learn Node.js" course.
// Converts every .md file in the tracks below into a themed, self-contained
// .html page (inline CSS + inline JS, zero external requests) and writes a
// root index.html hub. Run with:  node build.mjs
//
// 100% static output — works offline and on GitHub Pages with no build step.

import { readFileSync as _readFileSync, writeFileSync as _writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

// OneDrive can throw transient UNKNOWN errors — retry a few times.
function readFileSync(path, enc) {
  let last;
  for (let a = 0; a < 8; a++) {
    try { return _readFileSync(path, enc); }
    catch (e) { last = e; const t = Date.now() + 120; while (Date.now() < t) {} }
  }
  throw last;
}
function writeFileSync(path, data, enc) {
  let last;
  for (let a = 0; a < 8; a++) {
    try { return _writeFileSync(path, data, enc); }
    catch (e) { last = e; const t = Date.now() + 120; while (Date.now() < t) {} }
  }
  throw last;
}
const COURSE = 'Learn Node.js';
const TAGLINE = 'From your first console.log to production deployment';

/* ----------------------------------------------------------------------------
 *  TRACK / LESSON DEFINITIONS  (ascending difficulty)
 * ------------------------------------------------------------------------- */
const ICONS = ['🌱','⚙️','📦','🔧','🧩','⏳','🔌','🌐','🗂️','🧪','🚀','🛡️','📌','📚','💡','🧭'];

const tracks = [
  {
    dir: 'beginner-basics',
    title: 'Beginner Basics',
    desc: 'Zero-to-one on-ramp: the terminal, JavaScript, and your first Node script.',
    level: 'beg',
    icon: '🌱',
    files: [
      'README.md',
      '00-what-is-nodejs.md',
      '01-setup-and-terminal.md',
      '02-javascript-essentials.md',
      '03-functions-arrays-objects.md',
      '04-first-node-script.md',
      '05-errors-and-debugging.md',
      '06-json-and-data.md',
      '07-git-and-github.md',
    ],
  },
  {
    dir: 'nodejs-basics',
    title: 'Node.js Core',
    desc: 'The runtime itself: REPL, globals, the event loop, modules, npm, streams & HTTP.',
    level: 'int',
    icon: '⚙️',
    files: [
      'README.md',
      '01-runtime-and-repl.md',
      '02-globals-and-event-loop.md',
      '03-modules.md',
      '04-npm-deep-dive.md',
      '05-built-in-modules.md',
      '06-async-basics.md',
      '07-events-and-streams.md',
      '08-tiny-http-server.md',
    ],
  },
  {
    dir: 'nodejs-learning-plan',
    title: '20-Hour Learning Plan',
    desc: 'Ten focused sessions from fundamentals all the way to testing & deployment.',
    level: 'adv',
    icon: '🚀',
    files: [
      'README.md',
      'session-01-fundamentals.md',
      'session-02-modules-npm.md',
      'session-03-async.md',
      'session-04-fs-streams.md',
      'session-05-events.md',
      'session-06-http.md',
      'session-07-express.md',
      'session-08-database.md',
      'session-09-auth-security.md',
      'session-10-testing-deploy.md',
    ],
  },
  {
    dir: 'nodejs-cheatsheet',
    title: 'Cheatsheet',
    desc: 'Node.js in five minutes — a quick reference you can skim any time.',
    level: 'beg',
    icon: '📌',
    files: ['nodejs-in-5-minutes.md'],
  },
];

function outName(file) {
  return /readme\.md$/i.test(file) ? 'index.html' : file.replace(/\.md$/i, '.html');
}
function lessonLevel(track, file, idx) {
  if (track.dir === 'nodejs-learning-plan') {
    const m = file.match(/session-(\d+)/);
    if (m) return Number(m[1]) <= 4 ? 'int' : 'adv';
    return 'int';
  }
  return track.level;
}

/* ----------------------------------------------------------------------------
 *  MARKDOWN -> HTML
 * ------------------------------------------------------------------------- */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function rewriteHref(url) {
  if (/^(https?:|mailto:|#)/i.test(url)) return { href: url, ext: /^https?:/i.test(url) };
  let h = url.replace(/\.md(#|$)/i, '.html$1');
  h = h.replace(/README\.html/i, 'index.html');
  return { href: h, ext: false };
}

function inline(text) {
  // 1. protect inline code spans
  const codes = [];
  text = text.replace(/`([^`]+)`/g, (_, c) => {
    codes.push('<code>' + escapeHtml(c) + '</code>');
    return '\u0000C' + (codes.length - 1) + '\u0000';
  });
  // 2. escape everything else
  text = escapeHtml(text);
  // 3. links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const { href, ext } = rewriteHref(url);
    const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a href="' + href + '"' + attrs + '>' + label + '</a>';
  });
  // 4. bold then italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  text = text.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  // 5. restore code spans
  text = text.replace(/\u0000C(\d+)\u0000/g, (_, i) => codes[Number(i)]);
  return text;
}

function guessLang(lang, body) {
  const l = (lang || '').toLowerCase();
  if (['js', 'javascript', 'mjs', 'cjs', 'jsx', 'ts'].includes(l)) return 'js';
  if (['sh', 'bash', 'shell', 'console', 'terminal', 'zsh', 'ps', 'powershell'].includes(l)) return 'bash';
  if (l === 'json') return 'json';
  if (l) return 'text';
  const first = (body.trim().split(/\s+/)[0] || '');
  if (/^(npm|npx|node|cd|ls|mkdir|rm|git|curl|echo|export|cat|touch|pwd|sudo|code|nvm|set|chmod|mv|cp)$/.test(first)) return 'bash';
  if (/^[{[]/.test(body.trim())) return 'json';
  return 'text';
}

// Heuristic tag for a section heading
function tagFor(text) {
  const t = text.toLowerCase();
  if (/recap|summary|review|cheat|takeaway/.test(t)) return 'Summary';
  if (/exercise|challenge|mini|hands-on|hands on|practice|build|project|lab|try/.test(t)) return 'Hands-on';
  if (/why|matter|80\/20/.test(t)) return 'Why it matters';
  if (/resource|reading|watch|link/.test(t)) return 'Resources';
  if (/gotcha|mistake|common|pitfall|trap|debug|error/.test(t)) return 'Gotchas';
  if (/setup|install|tool/.test(t)) return 'Tooling';
  if (/plan|schedule|agenda/.test(t)) return 'Plan';
  return 'Concept';
}

// Tokenize markdown into block objects
function tokenize(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  const isList = (l) => /^(\s*)([-*+]|\d+\.)\s+/.test(l);
  const isHeading = (l) => /^#{1,6}\s+/.test(l);
  const isHr = (l) => /^\s*(---|\*\*\*|___)\s*$/.test(l);
  const isQuote = (l) => /^\s*>\s?/.test(l);
  const isFence = (l) => /^\s*```/.test(l);
  const isTableSep = (l) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes('-');

  while (i < lines.length) {
    let line = lines[i];
    if (line.trim() === '') { i++; continue; }

    if (isFence(line)) {
      const lang = line.replace(/^\s*```/, '').trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // closing fence
      blocks.push({ type: 'code', lang, body: buf.join('\n') });
      continue;
    }
    if (isHeading(line)) {
      const m = line.match(/^(#{1,6})\s+(.*)$/);
      blocks.push({ type: 'heading', level: m[1].length, text: m[2].trim() });
      i++;
      continue;
    }
    if (isHr(line)) { blocks.push({ type: 'hr' }); i++; continue; }
    if (isQuote(line)) {
      const buf = [];
      while (i < lines.length && (isQuote(lines[i]) || (lines[i].trim() !== '' && buf.length && !isHeading(lines[i]) && !isFence(lines[i])))) {
        if (!isQuote(lines[i])) break;
        buf.push(lines[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      blocks.push({ type: 'quote', text: buf.join(' ').trim() });
      continue;
    }
    // table: current line has | and next is a separator row
    if (line.includes('|') && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const buf = [line];
      i += 2; // skip separator
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') { buf.push(lines[i]); i++; }
      blocks.push({ type: 'table', rows: buf });
      continue;
    }
    if (isList(line)) {
      const buf = [];
      while (i < lines.length && isList(lines[i])) { buf.push(lines[i]); i++; }
      blocks.push({ type: 'list', lines: buf });
      continue;
    }
    // paragraph
    const buf = [];
    while (i < lines.length && lines[i].trim() !== '' && !isHeading(lines[i]) && !isFence(lines[i]) && !isHr(lines[i]) && !isQuote(lines[i]) && !isList(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: 'para', text: buf.join(' ').trim() });
  }
  return blocks;
}

function renderList(rawLines) {
  const items = rawLines.map((l) => {
    const m = l.match(/^(\s*)([-*+]|\d+\.)\s+(.*)$/);
    return { indent: m[1].replace(/\t/g, '  ').length, ordered: /\d+\./.test(m[2]), text: m[3] };
  });
  let p = 0;
  function build() {
    const indent = items[p].indent;
    const ordered = items[p].ordered;
    let html = ordered ? '<ol>' : '<ul>';
    while (p < items.length && items[p].indent >= indent) {
      if (items[p].indent > indent) { html += build(); continue; }
      const it = items[p];
      p++;
      let inner = inline(it.text);
      if (p < items.length && items[p].indent > indent) inner += build();
      html += '<li>' + inner + '</li>';
    }
    html += ordered ? '</ol>' : '</ul>';
    return html;
  }
  return build();
}

function renderTable(rows) {
  const cells = (r) => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
  const head = cells(rows[0]);
  let html = '<div class="tablewrap"><table><thead><tr>';
  head.forEach((h) => { html += '<th>' + inline(h) + '</th>'; });
  html += '</tr></thead><tbody>';
  for (let r = 1; r < rows.length; r++) {
    const c = cells(rows[r]);
    html += '<tr>' + c.map((x) => '<td>' + inline(x) + '</td>').join('') + '</tr>';
  }
  html += '</tbody></table></div>';
  return html;
}

function calloutKind(text) {
  const t = text.toLowerCase();
  if (/\b(warn|warning|don'?t|never|careful|avoid|do not|caution)\b/.test(t)) return { cls: 'warn', ico: '⚠️' };
  if (/\b(tip|pro tip|hint|remember|best practice|recommended)\b/.test(t)) return { cls: 'tip', ico: '💡' };
  return { cls: 'note', ico: '📌' };
}

function renderCode(block) {
  const lang = guessLang(block.lang, block.body);
  return '<pre><code data-lang="' + lang + '">' + escapeHtml(block.body) + '</code></pre>';
}

function renderBlock(b) {
  switch (b.type) {
    case 'heading': {
      const lvl = Math.min(b.level + 1, 6); // h2->h3 inside cards
      return '<h' + lvl + '>' + inline(b.text) + '</h' + lvl + '>';
    }
    case 'para': return '<p>' + inline(b.text) + '</p>';
    case 'list': return renderList(b.lines);
    case 'table': return renderTable(b.rows);
    case 'hr': return '<hr>';
    case 'code': return renderCode(b);
    case 'quote': {
      const k = calloutKind(b.text);
      return '<div class="callout ' + k.cls + '"><span class="ico" aria-hidden="true">' + k.ico + '</span><div>' + inline(b.text) + '</div></div>';
    }
    default: return '';
  }
}

/* ----------------------------------------------------------------------------
 *  PARSE A FILE INTO PAGE MODEL
 * ------------------------------------------------------------------------- */
function parsePage(md) {
  const blocks = tokenize(md);
  let title = 'Untitled';
  let leadText = '';
  let startIdx = 0;

  // first H1 -> title
  for (let k = 0; k < blocks.length; k++) {
    if (blocks[k].type === 'heading' && blocks[k].level === 1) {
      title = blocks[k].text;
      startIdx = k + 1;
      break;
    }
  }
  // first paragraph after title -> lead
  let bodyStart = startIdx;
  for (let k = startIdx; k < blocks.length; k++) {
    if (blocks[k].type === 'hr') { bodyStart = k + 1; continue; }
    if (blocks[k].type === 'para') { leadText = blocks[k].text; bodyStart = k + 1; break; }
    if (blocks[k].type === 'heading') { bodyStart = k; break; }
    bodyStart = k; break;
  }

  // chips from a "·"-separated meta lead
  let chips = [];
  let leadHtml = '';
  if (leadText.includes(' · ') || leadText.includes('·')) {
    chips = leadText.split('·').map((s) => s.replace(/\*\*/g, '').trim()).filter(Boolean);
  } else if (leadText) {
    leadHtml = inline(leadText);
  }

  // Build cards: each H2 starts a new card; pre-H2 content -> Overview card
  const rest = blocks.slice(bodyStart);
  const cards = [];
  let cur = null;
  const flush = () => { if (cur && cur.html.trim()) cards.push(cur); cur = null; };

  for (const b of rest) {
    if (b.type === 'heading' && b.level === 2) {
      flush();
      cur = { tag: tagFor(b.text), heading: inline(b.text), html: '' };
      continue;
    }
    if (!cur) cur = { tag: 'Overview', heading: '', html: '' };
    cur.html += renderBlock(b);
  }
  flush();

  // plain-text description for cards on the hub
  let desc = leadText.replace(/[*_`#>]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  if (desc.length > 130) desc = desc.slice(0, 127).trimEnd() + '…';

  return { title, chips, leadHtml, cards, desc };
}

/* ----------------------------------------------------------------------------
 *  TEMPLATE PIECES
 * ------------------------------------------------------------------------- */
const CSS = `
*{box-sizing:border-box}
:root{
  --page-bg:#eaf2fc; --card-bg:#ffffff; --accent:#1657c4; --accent-bright:#1f6fe0;
  --accent-soft:#e3edfb; --ink:#16202e; --ink-soft:#44546a; --code-bg:#0b2a52;
  --code-ink:#d6e4ff; --border:#d6e3f5; --green:#1f9d57; --red:#d6455a; --amber:#c98a12;
  --shadow:0 8px 24px rgba(22,87,196,.08); --shadow-lg:0 16px 44px rgba(22,87,196,.14);
  --t-key:#7cc4ff; --t-str:#9ff0c4; --t-num:#ffd479; --t-com:#6f8cb8; --t-fn:#d6a3ff; --t-out:#cdd9ee;
}
html{scroll-behavior:smooth}
body{
  margin:0; background:var(--page-bg); color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  line-height:1.65; font-size:16px; -webkit-font-smoothing:antialiased;
}
.wrap{max-width:1040px; margin:0 auto; padding:28px 20px 80px}
a{color:var(--accent); text-decoration:none}
a:hover{text-decoration:underline}

/* HERO */
.hero{
  position:relative; overflow:hidden; border-radius:24px; color:#fff;
  background:linear-gradient(135deg,#1f6fe0 0%,#1657c4 55%,#0e3f93 100%);
  padding:38px 36px; box-shadow:var(--shadow-lg);
}
.hero::after{
  content:""; position:absolute; top:-90px; right:-70px; width:280px; height:280px;
  border-radius:50%; background:radial-gradient(circle at center,rgba(255,255,255,.30),rgba(255,255,255,0) 70%);
}
.eyebrow{
  display:inline-block; text-transform:uppercase; letter-spacing:.14em; font-size:12px;
  font-weight:700; background:rgba(255,255,255,.16); padding:6px 12px; border-radius:999px;
  margin-bottom:14px;
}
.hero h1{margin:.1em 0 .25em; font-size:clamp(28px,5vw,46px); font-weight:800; line-height:1.1; letter-spacing:-.01em}
.hero .lead{margin:0; max-width:62ch; font-size:clamp(15px,2.2vw,19px); color:#eaf2ffe6}
.chips{display:flex; flex-wrap:wrap; gap:8px; margin-top:18px}
.chip{
  background:rgba(255,255,255,.16); border:1px solid rgba(255,255,255,.28);
  color:#fff; padding:6px 13px; border-radius:999px; font-size:13.5px; font-weight:600;
}

/* SECTION BANNER */
.banner{
  display:flex; align-items:center; gap:16px; margin:34px 0 18px; padding:16px 18px;
  border-radius:16px; background:linear-gradient(135deg,var(--accent-soft),#f3f8ff);
  border:1px solid var(--border);
}
.num{
  flex:0 0 auto; width:46px; height:46px; border-radius:13px; display:grid; place-items:center;
  font-weight:800; font-size:19px; color:#fff;
  background:linear-gradient(135deg,#1f6fe0,#1657c4); box-shadow:var(--shadow);
}
.banner h2{margin:0; font-size:21px; font-weight:800; letter-spacing:-.01em}
.banner p{margin:2px 0 0; color:var(--ink-soft); font-size:14px}

/* GRID + PCARDS */
.grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px}
.pcard{
  display:block; background:var(--card-bg); border:1px solid var(--border); border-radius:18px;
  padding:20px 20px 18px; box-shadow:var(--shadow); color:inherit;
  transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.pcard:hover{transform:translateY(-3px); box-shadow:var(--shadow-lg); border-color:#b9d0f2; text-decoration:none}
.pn{
  display:inline-grid; place-items:center; width:34px; height:34px; border-radius:10px;
  background:var(--accent-soft); color:var(--accent); font-weight:800; font-size:14px; margin-bottom:12px;
}
.pcard h3{margin:0 0 6px; font-size:17.5px; font-weight:750; display:flex; align-items:center; gap:8px}
.pcard p{margin:0 0 14px; color:var(--ink-soft); font-size:14px; min-height:38px}
.lvl{
  display:inline-block; font-size:11.5px; font-weight:700; padding:4px 10px; border-radius:999px;
  text-transform:uppercase; letter-spacing:.05em;
}
.lvl.beg{background:#e3f6ec; color:var(--green)}
.lvl.int{background:#fef3da; color:var(--amber)}
.lvl.adv{background:#fbe4e8; color:var(--red)}

/* CRUMBS */
.crumbs{margin:22px 0 8px; font-size:13.5px; color:var(--ink-soft)}
.crumbs a{font-weight:600}
.crumbs span{margin:0 8px; opacity:.6}

/* CARD (lesson content) */
.card{
  background:var(--card-bg); border:1px solid var(--border); border-radius:18px;
  padding:24px 26px; box-shadow:var(--shadow); margin:18px 0;
}
.card>h3:first-child,.card>h4:first-child{margin-top:0}
.card h3{font-size:20px; font-weight:780; letter-spacing:-.01em; margin:.2em 0 .5em; display:flex; align-items:center; flex-wrap:wrap; gap:10px}
.card h4{font-size:16.5px; font-weight:750; margin:1.1em 0 .4em}
.card h5{font-size:15px; font-weight:700; margin:1em 0 .3em; color:var(--ink-soft)}
.tag{
  font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em;
  background:var(--accent-soft); color:var(--accent); padding:4px 10px; border-radius:999px;
}
.card p{margin:.6em 0}
.card ul,.card ol{margin:.5em 0; padding-left:1.4em}
.card li{margin:.3em 0}
.card li::marker{color:var(--accent); font-weight:700}
.card code{
  background:#eef4fe; color:#0e3f93; padding:1px 6px; border-radius:6px; font-size:.92em;
  font-family:"SF Mono","Fira Code","Cascadia Code",Consolas,monospace;
}
hr{border:none; border-top:1px solid var(--border); margin:1.4em 0}

/* CALLOUTS */
.callout{
  display:flex; gap:12px; align-items:flex-start; border-radius:14px; padding:14px 16px;
  margin:14px 0; border:1px solid var(--border); font-size:14.5px;
}
.callout .ico{font-size:18px; line-height:1.4}
.callout.note{background:#eef4fe; border-color:#cfe0fa}
.callout.tip{background:#e9f8ef; border-color:#c7ebd6}
.callout.warn{background:#fdeef0; border-color:#f6cdd5}
.callout code{background:rgba(255,255,255,.7)}

/* CODE */
pre{
  position:relative; background:var(--code-bg); color:var(--code-ink); border-radius:14px;
  padding:18px 18px 16px; overflow:auto; margin:14px 0; box-shadow:var(--shadow);
  font-family:"SF Mono","Fira Code","Cascadia Code",Consolas,monospace; font-size:13.5px; line-height:1.6;
}
pre code{font-family:inherit; background:none; color:inherit; padding:0; white-space:pre}
.lang-chip{
  position:absolute; top:10px; right:12px; font-size:10.5px; font-weight:700; letter-spacing:.08em;
  text-transform:uppercase; color:#9fc0ee; background:rgba(255,255,255,.07);
  padding:3px 8px; border-radius:7px; pointer-events:none;
}
.t-key{color:var(--t-key)} .t-str{color:var(--t-str)} .t-num{color:var(--t-num)}
.t-com{color:var(--t-com); font-style:italic} .t-fn{color:var(--t-fn)} .t-out{color:var(--t-out)}

/* TABLE */
.tablewrap{overflow-x:auto; margin:14px 0}
table{border-collapse:collapse; width:100%; font-size:14px}
th,td{border:1px solid var(--border); padding:9px 12px; text-align:left; vertical-align:top}
th{background:var(--accent-soft); font-weight:700; color:var(--accent)}
tbody tr:nth-child(even){background:#f6faff}

/* DIAGRAM */
.diagram{margin:16px 0; text-align:center}
.diagram svg{max-width:100%; height:auto}
.cap{font-size:13px; color:var(--ink-soft); margin-top:6px; text-align:center}

/* SUMMARY checklist */
.learned{list-style:none; padding-left:0}
.learned li{position:relative; padding-left:28px; margin:.4em 0}
.learned li::before{content:"✓"; position:absolute; left:0; top:0; color:var(--green); font-weight:800}

/* PAGER */
.pager{display:flex; justify-content:space-between; gap:14px; margin-top:30px}
.pager a{
  flex:1; background:var(--card-bg); border:1px solid var(--border); border-radius:14px;
  padding:14px 18px; box-shadow:var(--shadow); font-weight:650;
  transition:transform .15s ease, box-shadow .15s ease;
}
.pager a:hover{transform:translateY(-2px); box-shadow:var(--shadow-lg); text-decoration:none}
.pager a.next{text-align:right}
.pager a small{display:block; font-size:11.5px; text-transform:uppercase; letter-spacing:.08em; color:var(--ink-soft); font-weight:700}
.pager a.disabled{opacity:.4; pointer-events:none}

/* FOOTER */
footer{margin-top:40px; padding-top:20px; border-top:1px solid var(--border); color:var(--ink-soft); font-size:13.5px; text-align:center}

@media (max-width:760px){
  .wrap{padding:18px 14px 60px}
  .hero{padding:28px 22px; border-radius:20px}
  .card{padding:20px 18px}
  .grid{grid-template-columns:1fr}
  .pager{flex-direction:column}
  .pager a.next{text-align:left}
}
`;

// Runtime syntax highlighter — vanilla, dependency-free, no template literals/backticks.
const HIGHLIGHTER = `
(function(){
  var BT = String.fromCharCode(96);
  var KW = {
    js: new Set(("const let var function return if else for while do switch case break continue "+
      "new class extends super this typeof instanceof in of try catch finally throw async await "+
      "yield import export default from as void delete null undefined true false NaN Infinity "+
      "static get set require module exports process console global __dirname __filename "+
      "Promise Array Object String Number Boolean Map Set JSON Math Date Symbol Buffer setTimeout "+
      "setInterval setImmediate fetch").split(" ")),
    bash: new Set(("npm npx node nvm cd ls mkdir rm rmdir git curl wget echo export cat touch pwd "+
      "sudo code set chmod mv cp grep find which clear pnpm yarn docker").split(" ")),
    json: new Set("true false null".split(" ")),
    text: new Set([])
  };
  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
  function isIdStart(c){return /[A-Za-z_$]/.test(c);}
  function isId(c){return /[A-Za-z0-9_$]/.test(c);}
  function highlight(code, lang){
    if(lang==="text"){return '<span class="t-out">'+esc(code)+'</span>';}
    var lineComment = (lang==="bash") ? "#" : "//";
    var kw = KW[lang] || KW.text;
    var out=""; var i=0; var n=code.length;
    while(i<n){
      var c=code[i];
      if(lineComment && code.substr(i,lineComment.length)===lineComment){
        var j=code.indexOf("\\n",i); if(j<0)j=n;
        out+='<span class="t-com">'+esc(code.slice(i,j))+'</span>'; i=j; continue;
      }
      if(lang==="js" && c==="/" && code[i+1]==="*"){
        var e=code.indexOf("*/",i+2); e=(e<0)?n:e+2;
        out+='<span class="t-com">'+esc(code.slice(i,e))+'</span>'; i=e; continue;
      }
      if(c==='"' || c==="'" || c===BT){
        var k=i+1; while(k<n && code[k]!==c){ if(code[k]==="\\\\")k++; k++; } k++;
        if(k>n)k=n;
        out+='<span class="t-str">'+esc(code.slice(i,k))+'</span>'; i=k; continue;
      }
      if(/[0-9]/.test(c)){
        var p=i; while(p<n && /[0-9._xXa-fA-F]/.test(code[p]))p++;
        out+='<span class="t-num">'+esc(code.slice(i,p))+'</span>'; i=p; continue;
      }
      if(isIdStart(c)){
        var q=i; while(q<n && isId(code[q]))q++;
        var word=code.slice(i,q);
        var r=q; while(r<n && code[r]===" ")r++;
        if(kw.has(word)){ out+='<span class="t-key">'+esc(word)+'</span>'; }
        else if(code[r]==="("){ out+='<span class="t-fn">'+esc(word)+'</span>'; }
        else { out+=esc(word); }
        i=q; continue;
      }
      out+=esc(c); i++;
    }
    return out;
  }
  var labels={js:"JS",bash:"BASH",json:"JSON",text:"TEXT"};
  var blocks=document.querySelectorAll("pre > code[data-lang]");
  for(var b=0;b<blocks.length;b++){
    var el=blocks[b];
    var lang=el.getAttribute("data-lang")||"text";
    el.innerHTML=highlight(el.textContent, lang);
    var chip=document.createElement("span");
    chip.className="lang-chip";
    chip.textContent=labels[lang]||lang.toUpperCase();
    el.parentNode.appendChild(chip);
  }
})();
`;

function htmlShell({ titleTag, body, withHighlighter }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titleTag}</title>
<style>${CSS}</style>
</head>
<body>
<main class="wrap">
${body}
</main>
${withHighlighter ? '<script>' + HIGHLIGHTER + '</script>' : ''}
</body>
</html>`;
}

function heroBlock({ eyebrow, h1, lead, chips }) {
  let c = '';
  if (chips && chips.length) {
    c = '<div class="chips">' + chips.map((x) => '<span class="chip">' + inline(x) + '</span>').join('') + '</div>';
  }
  return `<header class="hero">
  <span class="eyebrow">${escapeHtml(eyebrow)}</span>
  <h1>${escapeHtml(h1)}</h1>
  ${lead ? '<p class="lead">' + lead + '</p>' : ''}
  ${c}
</header>`;
}

/* ----------------------------------------------------------------------------
 *  BUILD PART PAGES
 * ------------------------------------------------------------------------- */
function buildPartPage(track, file, idx, prev, next, total, partNo) {
  const srcPath = join(ROOT, track.dir, file);
  const md = readFileSync(srcPath, 'utf8');
  const page = parsePage(md);

  const hero = heroBlock({
    eyebrow: track.title,
    h1: page.title,
    lead: page.leadHtml,
    chips: page.chips,
  });

  const trackHasIndex = track.files.some((f) => /readme\.md$/i.test(f));
  const trackHref = trackHasIndex ? 'index.html' : '../index.html';
  const crumbs = `<nav class="crumbs" aria-label="Breadcrumb">
  <a href="../index.html">${COURSE}</a><span>/</span>
  <a href="${trackHref}">${escapeHtml(track.title)}</a><span>/</span>${escapeHtml(page.title)}
</nav>`;

  const cardsHtml = page.cards.map((card) => {
    const head = card.heading
      ? '<h3>' + card.heading + ' <span class="tag">' + card.tag + '</span></h3>'
      : '';
    return '<section class="card">' + head + card.html + '</section>';
  }).join('\n');

  // pager
  const prevLink = prev
    ? `<a class="prev" href="${prev.out}"><small>Previous</small>${escapeHtml(prev.title)}</a>`
    : `<a class="prev disabled" aria-disabled="true"><small>Previous</small>Start of track</a>`;
  const nextLink = next
    ? `<a class="next" href="${next.out}"><small>Next</small>${escapeHtml(next.title)}</a>`
    : `<a class="next disabled" aria-disabled="true"><small>Next</small>End of track</a>`;
  const pager = `<nav class="pager" aria-label="Lesson navigation">${prevLink}${nextLink}</nav>`;

  const partLabel = partNo === 0
    ? 'Overview'
    : 'Part ' + partNo + ' of ' + total;
  const footer = `<footer>${COURSE} · ${escapeHtml(track.title)} · ${partLabel} · Built with a light soft-UI docs theme.</footer>`;

  const body = [hero, crumbs, cardsHtml, pager, footer].join('\n');
  return htmlShell({ titleTag: page.title + ' · ' + COURSE, body, withHighlighter: true });
}

/* ----------------------------------------------------------------------------
 *  BUILD ROOT INDEX (HUB)
 * ------------------------------------------------------------------------- */
function buildIndex(meta) {
  const hero = heroBlock({
    eyebrow: 'Developer Course Hub',
    h1: COURSE,
    lead: escapeHtml(TAGLINE) + ' — a complete, code-first path through Node.js, from absolute beginner to deploying real apps.',
    chips: ['30 lessons', '4 tracks', 'Beginner → Advanced', '100% hands-on'],
  });

  let sections = '';
  meta.forEach((track, ti) => {
    sections += `<section class="banner">
  <div class="num">${ti + 1}</div>
  <div><h2>${escapeHtml(track.title)}</h2><p>${escapeHtml(track.desc)}</p></div>
</section>`;
    sections += '<div class="grid">';
    track.pages.forEach((p, pi) => {
      const lvlText = p.level === 'beg' ? 'Beginner' : p.level === 'int' ? 'Intermediate' : 'Advanced';
      const icon = ICONS[(ti * 3 + pi) % ICONS.length];
      const numLabel = p.partNo === 0 ? '★' : String(p.partNo).padStart(2, '0');
      sections += `<a class="pcard" href="${track.dir}/${p.out}">
  <span class="pn">${numLabel}</span>
  <h3><span aria-hidden="true">${icon}</span>${escapeHtml(p.title)}</h3>
  <p>${escapeHtml(p.desc || '')}</p>
  <span class="lvl ${p.level}">${lvlText}</span>
</a>`;
    });
    sections += '</div>';
  });

  const footer = `<footer>${COURSE} · ${TAGLINE} · Built with a light soft-UI docs theme.</footer>`;
  const body = [hero, sections, footer].join('\n');
  return htmlShell({ titleTag: COURSE + ' · ' + TAGLINE, body, withHighlighter: false });
}

/* ----------------------------------------------------------------------------
 *  RUN
 * ------------------------------------------------------------------------- */
const meta = [];
let totalWritten = 0;

for (const track of tracks) {
  // build the ordered page list (title pulled from each file's H1)
  const pages = track.files.map((file, idx) => {
    const md = readFileSync(join(ROOT, track.dir, file), 'utf8');
    const parsed = parsePage(md);
    const isReadme = /readme\.md$/i.test(file);
    return {
      file,
      out: outName(file),
      title: parsed.title,
      desc: parsed.desc,
      level: lessonLevel(track, file, idx),
      isReadme,
    };
  });
  // assign part numbers (README = 0 / Overview)
  let n = 0;
  pages.forEach((p) => { p.partNo = p.isReadme ? 0 : ++n; });
  const totalParts = n;

  // write each page
  pages.forEach((p, idx) => {
    const prev = idx > 0 ? pages[idx - 1] : null;
    const next = idx < pages.length - 1 ? pages[idx + 1] : null;
    const html = buildPartPage(track, p.file, idx, prev, next, totalParts, p.partNo);
    writeFileSync(join(ROOT, track.dir, p.out), html, 'utf8');
    totalWritten++;
  });

  meta.push({ ...track, pages });
}

// root index
writeFileSync(join(ROOT, 'index.html'), buildIndex(meta), 'utf8');
totalWritten++;

// keep GitHub Pages from running Jekyll on these files
writeFileSync(join(ROOT, '.nojekyll'), '', 'utf8');

console.log('Generated ' + totalWritten + ' HTML files + index.html');
