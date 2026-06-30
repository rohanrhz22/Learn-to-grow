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
    codes.push('<code class="inline">' + escapeHtml(c) + '</code>');
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

const LANG_LABEL = { js: 'javascript', bash: 'bash', json: 'json', text: 'text' };
function renderCode(block) {
  const g = guessLang(block.lang, block.body);
  const lang = LANG_LABEL[g] || g;
  return '<pre><code data-lang="' + lang + '">' + escapeHtml(block.body) + '</code></pre>';
}

function slugify(s) {
  return (s || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 42) || 'section';
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
      cur = { tag: tagFor(b.text), heading: inline(b.text), headingText: b.text, html: '' };
      continue;
    }
    if (!cur) cur = { tag: 'Overview', heading: '', headingText: 'Overview', html: '' };
    cur.html += renderBlock(b);
  }
  flush();

  // plain-text description for cards on the hub
  let desc = leadText.replace(/[*_`#>]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  if (desc.length > 130) desc = desc.slice(0, 127).trimEnd() + '…';

  return { title, chips, leadHtml, cards, desc };
}

/* ----------------------------------------------------------------------------
 *  TEMPLATE PIECES  (matches the "Developer Course Hub" soft-UI docs theme)
 * ------------------------------------------------------------------------- */
const CSS = `
:root{
  --page-bg:#eaf2fc;--card-bg:#ffffff;--accent:#1657c4;--accent-bright:#1f6fe0;
  --accent-soft:#e3edfb;--ink:#16202e;--ink-soft:#44546a;--code-bg:#0b2a52;
  --code-ink:#d6e4ff;--border:#d6e3f5;--green:#1f9d57;--red:#d6455a;--amber:#c98a12;
  --shadow:0 8px 24px rgba(22,87,196,.08);--shadow-lg:0 16px 44px rgba(22,87,196,.14);
}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  background:var(--page-bg);color:var(--ink);line-height:1.65;font-size:16px}
.shell{display:grid;grid-template-columns:270px 1fr;max-width:1280px;margin:0 auto}
.hub{max-width:1100px;margin:0 auto;padding:0 clamp(20px,4vw,48px) 80px}
.sidebar{position:sticky;top:0;align-self:start;height:100vh;overflow-y:auto;padding:24px 16px 40px;border-right:1px solid var(--border)}
.sidebar .brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.02rem;color:var(--accent);margin-bottom:8px;padding-left:6px}
.sidebar .brand .logo{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--accent-bright),var(--accent));display:grid;place-items:center;color:#fff;font-weight:800;font-size:.9rem;box-shadow:var(--shadow)}
.sidebar .partlabel{font-size:.72rem;color:var(--ink-soft);padding-left:6px;margin-bottom:18px;font-weight:600}
.nav-group-title{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);margin:16px 0 6px 6px;font-weight:700}
.sidebar a{display:block;text-decoration:none;color:var(--ink-soft);padding:7px 12px;border-radius:8px;font-size:.9rem;transition:all .15s}
.sidebar a:hover{background:var(--accent-soft);color:var(--accent)}
.sidebar a.home{color:var(--accent);font-weight:700}
.content{padding:0 clamp(20px,4vw,56px) 80px;min-width:0}
.hero{margin:28px 0 30px;padding:44px 42px;border-radius:22px;background:linear-gradient(135deg,#1f6fe0 0%,#1657c4 55%,#0e3f93 100%);color:#fff;box-shadow:var(--shadow-lg);position:relative;overflow:hidden}
.hero::after{content:"";position:absolute;right:-60px;top:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 70%);border-radius:50%}
.hero .eyebrow{text-transform:uppercase;letter-spacing:.14em;font-size:.74rem;font-weight:700;opacity:.9}
.hero h1{margin:12px 0 14px;font-size:clamp(1.7rem,3.6vw,2.5rem);line-height:1.15;font-weight:800}
.hero p{margin:0;max-width:660px;font-size:1.04rem;opacity:.95}
.hero .chips{margin-top:20px;display:flex;flex-wrap:wrap;gap:10px}
.hero .chips span{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.25);padding:6px 14px;border-radius:999px;font-size:.82rem;font-weight:600}
.crumbs{display:flex;gap:8px;align-items:center;font-size:.85rem;margin:24px 0 0;color:var(--ink-soft);flex-wrap:wrap}
.crumbs a{color:var(--accent);text-decoration:none}
.section-banner{margin:42px 0 22px;padding:22px 26px;border-radius:16px;background:linear-gradient(120deg,var(--accent-soft),#f3f8ff);border:1px solid var(--border);border-left:5px solid var(--accent-bright);display:flex;align-items:center;gap:16px}
.section-banner .num{flex:0 0 auto;width:46px;height:46px;border-radius:12px;background:linear-gradient(135deg,var(--accent-bright),var(--accent));color:#fff;display:grid;place-items:center;font-weight:800;font-size:1.2rem;box-shadow:var(--shadow)}
.section-banner h2{margin:0;font-size:1.45rem;color:var(--accent);font-weight:800}
.section-banner p{margin:4px 0 0;color:var(--ink-soft);font-size:.92rem}
.card{background:var(--card-bg);border:1px solid var(--border);border-radius:16px;padding:24px 28px;margin:18px 0;box-shadow:var(--shadow);scroll-margin-top:20px}
.card h3{margin:0 0 12px;font-size:1.16rem;color:var(--ink);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.card h3 .tag{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;background:var(--accent-soft);color:var(--accent);padding:3px 9px;border-radius:6px}
.card h4{margin:20px 0 8px;font-size:1.0rem;color:var(--accent)}
.card h5{margin:16px 0 6px;font-size:.94rem;color:var(--ink-soft)}
.card p{margin:8px 0}.card ul,.card ol{margin:8px 0;padding-left:22px}.card li{margin:5px 0}
.card li::marker{color:var(--accent)}
.lead{color:var(--ink-soft)}
pre{background:var(--code-bg);color:var(--code-ink);border-radius:12px;padding:18px 20px;overflow-x:auto;font-size:.88rem;line-height:1.6;margin:14px 0;border:1px solid #123a6b;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 6px 18px rgba(11,42,82,.25);position:relative}
pre code{font-family:"SF Mono","Fira Code","Cascadia Code",Consolas,monospace;white-space:pre;background:none;color:inherit;padding:0}
pre .lang{position:absolute;top:0;right:0;background:#123a6b;color:#8fb6f0;font-size:.66rem;font-weight:700;letter-spacing:.06em;padding:3px 10px;border-radius:0 12px 0 10px;text-transform:uppercase;pointer-events:none}
.t-key{color:#6db3ff}.t-str{color:#7fe0a8}.t-num{color:#f3b05a}.t-com{color:#6b86ad;font-style:italic}.t-fn{color:#c79bff}.t-out{color:#9fd0ff}
code.inline{background:var(--accent-soft);color:var(--accent);padding:2px 7px;border-radius:6px;font-family:"SF Mono",Consolas,monospace;font-size:.86em;font-weight:600}
.callout{border-radius:12px;padding:14px 18px;margin:16px 0;display:flex;gap:12px;align-items:flex-start;font-size:.94rem}
.callout .ico{flex:0 0 auto;font-size:1.15rem;line-height:1.5}
.callout.note{background:#eef5ff;border:1px solid #cfe0fb;color:#214a87}
.callout.tip{background:#ecfaf1;border:1px solid #c2ebd2;color:#166c3c}
.callout.warn{background:#fff6e8;border:1px solid #f3dcae;color:#8a5a08}
.callout code.inline{background:rgba(255,255,255,.6)}
.tablewrap{overflow-x:auto;margin:14px 0}
table{width:100%;border-collapse:collapse;margin:0;font-size:.92rem;border-radius:10px;overflow:hidden;box-shadow:var(--shadow)}
th{background:var(--accent);color:#fff;text-align:left;padding:11px 16px;font-weight:700}
td{padding:10px 16px;border-bottom:1px solid var(--border);background:#fff}
tr:last-child td{border-bottom:none}tr:nth-child(even) td{background:#f6faff}
.diagram{margin:18px 0;padding:22px;background:linear-gradient(180deg,#f7fbff,#fff);border:1px dashed #c4d8f5;border-radius:14px;text-align:center}
.diagram .cap{font-size:.82rem;color:var(--ink-soft);margin-top:10px;font-style:italic}
svg{max-width:100%;height:auto}
.learned{list-style:none;padding:0;margin:10px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}
.learned li{background:#ecfaf1;border:1px solid #c2ebd2;color:#166c3c;padding:9px 14px;border-radius:9px;font-size:.88rem;font-weight:600}
.learned li::before{content:"✔  ";color:var(--green);font-weight:800}
.pager{display:flex;justify-content:space-between;gap:14px;margin-top:40px}
.pager a{flex:1;text-decoration:none;border:1px solid var(--border);border-radius:14px;padding:16px 20px;background:#fff;box-shadow:var(--shadow);transition:all .15s}
.pager a:hover{border-color:var(--accent-bright);transform:translateY(-2px)}
.pager .dir{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-soft);font-weight:700}
.pager .ttl{display:block;margin-top:4px;color:var(--accent);font-weight:700;font-size:.95rem}
.pager a.next{text-align:right}.pager a.disabled{opacity:.4;pointer-events:none}
footer{margin-top:50px;padding:28px;text-align:center;color:var(--ink-soft);border-top:1px solid var(--border);font-size:.88rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:8px}
.pcard{display:block;text-decoration:none;background:#fff;border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--shadow);transition:all .18s;position:relative;overflow:hidden}
.pcard:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--accent-bright)}
.pcard .pn{width:42px;height:42px;border-radius:11px;background:linear-gradient(135deg,var(--accent-bright),var(--accent));color:#fff;display:grid;place-items:center;font-weight:800;font-size:1.05rem;box-shadow:var(--shadow);margin-bottom:12px}
.pcard h3{margin:0 0 6px;color:var(--ink);font-size:1.05rem}
.pcard p{margin:0;color:var(--ink-soft);font-size:.88rem}
.pcard .lvl{display:inline-block;margin-top:12px;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:3px 9px;border-radius:6px}
.lvl.beg{background:#ecfaf1;color:#166c3c}.lvl.int{background:#eef5ff;color:#214a87}.lvl.adv{background:#fdeef0;color:#a62f43}
@media(max-width:920px){.shell{grid-template-columns:1fr}.sidebar{display:none}}
@media(max-width:560px){.hero{padding:34px 26px}.card{padding:20px 18px}.pager{flex-direction:column}.pager a.next{text-align:left}}
`;

// Runtime syntax highlighter — vanilla, dependency-free.
const HIGHLIGHTER = `
(function(){
  var BT = String.fromCharCode(96);
  var KW = {
    js: new Set(("const let var function return if else for while do switch case break continue "+
      "new class extends super this typeof instanceof in of try catch finally throw async await "+
      "yield import export default from as void delete null undefined true false NaN Infinity "+
      "static get set public private require module exports process console global __dirname __filename "+
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
  function norm(l){
    if(l==="javascript"||l==="js"||l==="ts"||l==="typescript"||l==="jsx"||l==="mjs"||l==="cjs")return "js";
    if(l==="sh"||l==="shell"||l==="bash"||l==="console"||l==="terminal"||l==="zsh"||l==="yaml"||l==="env")return "bash";
    if(l==="json")return "json";
    return "text";
  }
  function highlight(code, lang){
    var L = norm(lang);
    if(L==="text"){return '<span class="t-out">'+esc(code)+'</span>';}
    var lineComment = (L==="bash") ? "#" : "//";
    var kw = KW[L] || KW.text;
    var out=""; var i=0; var n=code.length;
    while(i<n){
      var c=code[i];
      if(lineComment && code.substr(i,lineComment.length)===lineComment){
        var j=code.indexOf("\\n",i); if(j<0)j=n;
        out+='<span class="t-com">'+esc(code.slice(i,j))+'</span>'; i=j; continue;
      }
      if(L==="js" && c==="/" && code[i+1]==="*"){
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
  var blocks=document.querySelectorAll("pre > code[data-lang]");
  for(var b=0;b<blocks.length;b++){
    var el=blocks[b];
    var lang=(el.getAttribute("data-lang")||"").toLowerCase();
    el.innerHTML=highlight(el.textContent, lang);
    if(lang){ var chip=document.createElement("span"); chip.className="lang"; chip.textContent=lang; el.parentNode.appendChild(chip); }
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
${body}
${withHighlighter ? '<script>' + HIGHLIGHTER + '</script>' : ''}
</body>
</html>`;
}

function heroBlock({ eyebrow, h1, lead, chips }) {
  let c = '';
  if (chips && chips.length) {
    c = '<div class="chips">' + chips.map((x) => '<span>' + inline(x) + '</span>').join('') + '</div>';
  }
  return `<header class="hero"><div class="eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(h1)}</h1>${lead ? '<p>' + lead + '</p>' : ''}${c}</header>`;
}

/* ----------------------------------------------------------------------------
 *  BUILD PART (LESSON) PAGES — sidebar + content
 * ------------------------------------------------------------------------- */
function buildPartPage(track, file, idx, prev, next, total, partNo) {
  const md = readFileSync(join(ROOT, track.dir, file), 'utf8');
  const page = parsePage(md);
  const partLabel = partNo === 0 ? 'Overview' : 'Part ' + partNo + ' of ' + total;

  // unique slugs for each section card
  const used = {};
  page.cards.forEach((card) => {
    let s = slugify(card.headingText);
    if (used[s]) { used[s] += 1; s = s + '-' + used[s]; } else { used[s] = 1; }
    card.slug = s;
  });
  const navLinks = page.cards
    .filter((c) => c.heading)
    .map((c) => `<a href="#${c.slug}">${escapeHtml(c.headingText)}</a>`)
    .join('');

  const trackHasIndex = track.files.some((f) => /readme\.md$/i.test(f));
  const homeHref = '../index.html';
  const trackHref = trackHasIndex ? 'index.html' : homeHref;

  const sidebar = `<aside class="sidebar">
<div class="brand"><span class="logo">${track.icon}</span> ${escapeHtml(COURSE)}</div>
<div class="partlabel">${escapeHtml(track.title)} · ${partLabel}</div>
<a class="home" href="${homeHref}">← All lessons</a>
${navLinks ? '<div class="nav-group-title">On this page</div>' + navLinks : ''}
</aside>`;

  const crumbs = `<div class="crumbs"><a href="${homeHref}">${escapeHtml(COURSE)}</a> › <a href="${trackHref}">${escapeHtml(track.title)}</a> › <span>${escapeHtml(page.title)}</span></div>`;

  const hero = heroBlock({
    eyebrow: partLabel + ' · ' + track.title,
    h1: page.title,
    lead: page.leadHtml,
    chips: page.chips,
  });

  const cardsHtml = page.cards.map((card) => {
    const head = card.heading
      ? `<h3><span class="tag">${card.tag}</span> ${card.heading}</h3>`
      : '';
    return `<div class="card" id="${card.slug}">${head}${card.html}</div>`;
  }).join('\n');

  const prevLink = prev
    ? `<a class="prev" href="${prev.out}"><span class="dir">← Previous</span><span class="ttl">${escapeHtml(prev.title)}</span></a>`
    : `<a class="prev disabled" aria-disabled="true"><span class="dir">← Previous</span><span class="ttl">Start of track</span></a>`;
  const nextLink = next
    ? `<a class="next" href="${next.out}"><span class="dir">Next →</span><span class="ttl">${escapeHtml(next.title)}</span></a>`
    : `<a class="next disabled" aria-disabled="true"><span class="dir">Next →</span><span class="ttl">End of track</span></a>`;
  const pager = `<div class="pager">${prevLink}${nextLink}</div>`;

  const footer = `<footer>${escapeHtml(COURSE)} · ${escapeHtml(track.title)} · ${partLabel} · Built with a light soft-UI docs theme.</footer>`;

  const content = `<main class="content">${crumbs}${hero}${cardsHtml}${pager}${footer}</main>`;
  const body = `<div class="shell">${sidebar}${content}</div>`;
  return htmlShell({ titleTag: page.title + ' · ' + COURSE, body, withHighlighter: true });
}

/* ----------------------------------------------------------------------------
 *  BUILD ROOT INDEX (HUB)
 * ------------------------------------------------------------------------- */
function buildIndex(meta) {
  const hero = heroBlock({
    eyebrow: 'Developer Course Hub',
    h1: COURSE,
    lead: escapeHtml(TAGLINE) + ' — a complete, code-first path through Node.js, from absolute beginner to deploying production-ready backends.',
    chips: ['4 tracks', '30 lessons', '🌱 Beginner → 🚀 Advanced'],
  });

  let sections = '';
  meta.forEach((track, ti) => {
    sections += `<div class="section-banner"><div class="num">${ti + 1}</div><div><h2>${escapeHtml(track.title)}</h2><p>${escapeHtml(track.desc)}</p></div></div>`;
    sections += '<div class="grid">';
    track.pages.forEach((p, pi) => {
      const lvlText = p.level === 'beg' ? 'Beginner' : p.level === 'int' ? 'Intermediate' : 'Advanced';
      const icon = ICONS[(ti * 3 + pi) % ICONS.length];
      const numLabel = p.partNo === 0 ? '★' : String(p.partNo);
      sections += `<a class="pcard" href="${track.dir}/${p.out}"><div class="pn">${numLabel}</div><h3>${icon} ${escapeHtml(p.title)}</h3><p>${escapeHtml(p.desc || '')}</p><span class="lvl ${p.level}">${lvlText}</span></a>`;
    });
    sections += '</div>';
  });

  const footer = `<footer>${escapeHtml(COURSE)} · ${escapeHtml(TAGLINE)} · Built with a light soft-UI docs theme.</footer>`;
  const body = `<main class="hub">${hero}${sections}${footer}</main>`;
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
