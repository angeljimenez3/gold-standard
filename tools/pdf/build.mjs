/* Goldy Standard resource PDF builder: branded HTML → headless Chrome → PDF
   Run: node tools/pdf/build.mjs   (from repo root or anywhere) */
import { FAT_LOSS, LEAN_MUSCLE, FIGHTER } from "./prog-data.mjs";
import { SHEETS } from "./sheets-data.mjs";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { tmpdir } from "os";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_HTML = join(tmpdir(), "gs-pdf-html");
const OUT_PDF = join(HERE, "..", "..", "site", "members", "resources");
mkdirSync(OUT_HTML, { recursive: true });
mkdirSync(OUT_PDF, { recursive: true });

const b64 = (f) => readFileSync(join(HERE, "fonts", f)).toString("base64");
const ANTON = b64("anton.woff2");
const BEBAS = b64("bebas.woff2");

const LOGO = `<svg viewBox="0 0 100 100" class="oct"><polygon points="50,2 93,20 98,50 93,80 50,98 7,80 2,50 7,20" fill="none" stroke="#E8C96A" stroke-width="5"/><polygon points="50,12 83,26 87,50 83,74 50,88 17,74 13,50 17,26" fill="none" stroke="#E8C96A" stroke-width="3"/><text x="50" y="63" text-anchor="middle" font-family="Bebas Neue" font-size="40" fill="#E8C96A" letter-spacing="2">GS</text></svg>`;

const CSS = `
@font-face { font-family:"Anton"; src:url(data:font/woff2;base64,${ANTON}) format("woff2"); }
@font-face { font-family:"Bebas Neue"; src:url(data:font/woff2;base64,${BEBAS}) format("woff2"); }
:root { --navy:#1C2B3A; --navy2:#16222E; --mid:#2F4259; --gold:#E8C96A; --goldm:#A8872A; --white:#F5F4F0; --ink:#1a2431; }
* { margin:0; padding:0; box-sizing:border-box; }
@page { size: letter; margin: 0; }
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: var(--ink); font-size: 10.5pt; line-height: 1.5; -webkit-print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; padding: 0.55in 0.6in 0.8in; position: relative; page-break-after: always; background: #fbfaf7; overflow: hidden; }
.page:last-child { page-break-after: auto; }
.head { display:flex; align-items:center; gap:14px; background:var(--navy); margin:-0.55in -0.6in 0.32in; padding:0.28in 0.6in; }
.oct { width:44px; height:44px; }
.head .brand { font-family:"Bebas Neue"; letter-spacing:3px; color:var(--gold); font-size:11pt; }
.head h1 { font-family:"Anton"; color:var(--white); font-size:19pt; font-weight:400; letter-spacing:0.5px; line-height:1.1; }
.head .sub { color:rgba(245,244,240,.72); font-size:9pt; margin-top:2px; }
.foot { position:absolute; bottom:0.28in; left:0.6in; right:0.6in; display:flex; justify-content:space-between; font-family:"Bebas Neue"; letter-spacing:2px; font-size:8pt; color:var(--goldm); border-top:1.5px solid var(--gold); padding-top:6px; }
.eyebrow { font-family:"Bebas Neue"; letter-spacing:3px; color:var(--goldm); font-size:11pt; margin:14px 0 6px; }
h2.sec { font-family:"Anton"; font-weight:400; font-size:14pt; color:var(--navy); margin:16px 0 8px; }
p.intro { font-size:10pt; color:#3a4657; max-width:6.6in; margin-bottom:6px; }
.chips { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 4px; }
.chip { background:var(--navy); color:var(--gold); font-family:"Bebas Neue"; letter-spacing:1.5px; font-size:9pt; padding:4px 12px; border-radius:99px; }
ul.plain { list-style:none; }
ul.plain li { padding:3px 0 3px 16px; position:relative; }
ul.plain li::before { content:""; position:absolute; left:0; top:9px; width:7px; height:7px; background:var(--gold); transform:rotate(45deg); }
.phase { background:var(--navy); color:var(--white); border-radius:10px; padding:12px 16px; margin:0 0 10px; display:flex; justify-content:space-between; align-items:baseline; }
.phase .nm { font-family:"Anton"; font-size:13.5pt; }
.phase .wk { font-family:"Bebas Neue"; letter-spacing:2px; color:var(--gold); font-size:10.5pt; }
.phase--cont { background: var(--mid); }
.phase--cont .cont { color: var(--gold); font-family:"Bebas Neue"; font-size: 10.5pt; letter-spacing: 2px; }
.goal { font-size:9.5pt; color:#3a4657; font-style:italic; margin:0 0 12px; }
.day { border:1.5px solid #d8d2c2; border-radius:10px; margin:0 0 14px; overflow:hidden; background:#fff; }
.day-h { background:linear-gradient(90deg,#f0e9d6,#fbfaf7); padding:8px 14px; display:flex; gap:10px; align-items:baseline; border-bottom:1.5px solid #d8d2c2; }
.day-h .d { font-family:"Bebas Neue"; letter-spacing:2px; color:var(--navy); font-size:11.5pt; }
.day-h .l { font-family:"Anton"; font-size:11pt; color:var(--goldm); }
.blocks { padding:8px 14px 12px; }
.blk { margin:7px 0; }
.blk .bh { font-family:"Bebas Neue"; letter-spacing:1.8px; font-size:9.5pt; color:var(--goldm); margin-bottom:2px; }
.blk li { font-size:9.8pt; padding:2px 0 2px 14px; position:relative; list-style:none; }
.blk li::before { content:""; position:absolute; left:0; top:8px; width:5px; height:5px; background:var(--navy); transform:rotate(45deg); }
table { border-collapse:collapse; width:100%; margin:6px 0 10px; background:#fff; }
th { font-family:"Bebas Neue"; letter-spacing:2px; font-size:9.5pt; text-align:left; background:var(--navy); color:var(--gold); padding:7px 12px; }
td { padding:6px 12px; border-bottom:1px solid #e2dccc; font-size:9.8pt; vertical-align:top; }
tr:nth-child(even) td { background:#f6f2e7; }
.rule-card { display:flex; gap:14px; align-items:flex-start; background:#fff; border:1.5px solid #d8d2c2; border-left:4px solid var(--gold); border-radius:8px; padding:10px 14px; margin-bottom:8px; }
.rule-n { font-family:"Anton"; font-size:16pt; color:var(--gold); -webkit-text-stroke:0.6px var(--goldm); min-width:26px; }
.rule-card b { display:block; font-size:10.5pt; color:var(--navy); }
.rule-card span { font-size:9.5pt; color:#3a4657; }
.step { display:flex; gap:12px; margin-bottom:9px; }
.step-n { flex:0 0 26px; height:26px; border-radius:50%; background:var(--navy); color:var(--gold); font-family:"Bebas Neue"; display:grid; place-items:center; font-size:11pt; padding-top:2px; }
.step b { display:block; color:var(--navy); font-size:10.3pt; }
.step span { font-size:9.6pt; color:#3a4657; }
.fill { border:1.5px dashed var(--goldm); background:#fdf9ee; border-radius:8px; padding:8px 14px; margin:6px 0 10px; font-size:10pt; color:var(--navy); }
.fill div { padding:3px 0; }
.cols2 { column-count:2; column-gap:28px; }
.colsec { break-inside:avoid; margin-bottom:12px; }
.wk-row td { height:26px; }
.sig { margin-top:14px; font-size:9pt; color:#3a4657; font-style:italic; }
`;

function pageWrap(title, subtitle, inner, extraPages = "") {
  return `<!DOCTYPE html><html><head><meta charset="utf8"><style>${CSS}</style></head><body>
  <div class="page">
    <div class="head">${LOGO}<div><div class="brand">THE GOLDY STANDARD · BY HANNAH GOLDY</div><h1>${title.toUpperCase()}</h1><div class="sub">${subtitle}</div></div></div>
    ${inner}
    <div class="foot"><span>THE GOLDY STANDARD</span><span>BY HANNAH GOLDY</span></div>
  </div>${extraPages}</body></html>`;
}
function extraPage(inner) {
  return `<div class="page">${inner}<div class="foot"><span>THE GOLDY STANDARD</span><span>BY HANNAH GOLDY</span></div></div>`;
}

/* ---- program renderer: 2 framed pages per phase (Mon+Wed / Fri+Sat) ---- */
function renderProgram(p) {
  const first = `
    <p class="intro">${p.intro}</p>
    <p class="eyebrow">WEEKLY TRAINING SPLIT</p>
    <div class="chips">${p.split.map((s) => `<span class="chip">${s}</span>`).join("")}</div>
    <p class="eyebrow">HOW TO READ THE WORKOUTS</p>
    <ul class="plain">${p.howTo.map((h) => `<li>${h}</li>`).join("")}</ul>`;
  const dayCard = (d) => `
      <div class="day">
        <div class="day-h"><span class="d">${d.day.toUpperCase()}</span><span class="l">${d.label}</span></div>
        <div class="blocks">${d.blocks.map((b) => `
          <div class="blk"><div class="bh">${b.h.toUpperCase()}</div><ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`).join("")}
        </div>
      </div>`;
  const phasePages = p.phases.map((ph) => {
    const a = extraPage(`
      <div class="phase"><span class="nm">${ph.name.toUpperCase()}</span><span class="wk">${ph.weeks.toUpperCase()}</span></div>
      <p class="goal">Goal: ${ph.goal}</p>
      ${ph.days.slice(0, 2).map(dayCard).join("")}`);
    const b = extraPage(`
      <div class="phase phase--cont"><span class="nm">${ph.name.toUpperCase()} <span class="cont">· CONTINUED</span></span><span class="wk">${ph.weeks.toUpperCase()}</span></div>
      ${ph.days.slice(2).map(dayCard).join("")}`);
    return a + b;
  }).join("");
  const outro = extraPage(`${p.outro.map((o) => `<p class="eyebrow">${o.h.toUpperCase()}</p><p class="intro">${o.body}</p>`).join("")}
    <p class="sig">Every exercise in this program has a video demonstration in the Exercise Library inside your member area. Check your form any time.</p>`);
  return pageWrap(p.title, p.subtitle, first, phasePages + outro);
}

/* ---- sheet renderers ---- */
function renderSections(sections) {
  return sections.map((s) => {
    let body = "";
    if (s.type === "list") body = `<ul class="plain">${s.items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
    if (s.type === "steps") body = s.items.map((st, i) => `<div class="step"><div class="step-n">${i + 1}</div><div><b>${st[0]}</b><span>${st[1]}</span></div></div>`).join("");
    if (s.type === "table") body = `<table><tr>${s.cols.map((c) => `<th>${c}</th>`).join("")}</tr>${s.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</table>`;
    const fill = s.fill ? `<div class="fill">${s.fill.map((f) => `<div>${f}</div>`).join("")}</div>` : "";
    return `<p class="eyebrow">${s.h}</p>${body}${fill}`;
  }).join("");
}

function renderPoster(sh) {
  const rules = sh.rules.map((r, i) => `<div class="rule-card"><div class="rule-n">${String(i + 1).padStart(2, "0")}</div><div><b>${r[0]}</b><span>${r[1]}</span></div></div>`).join("");
  return pageWrap(sh.title, sh.subtitle, `<div style="margin-top:6px">${rules}</div>`);
}

function renderTracker(sh) {
  const statRow = (label) => `<tr class="wk-row"><td><b>${label}</b></td><td></td><td></td><td></td><td></td></tr>`;
  const first = `
    <p class="intro">Fat loss and muscle growth are not always visible on the scale — muscle weighs more than fat. Track multiple indicators for the real picture: weight, measurements, photos, and strength.</p>
    <p class="eyebrow">STARTING POINT — WEEK 0</p>
    <table><tr><th>Measurement</th><th>Week 0</th><th>Week 4</th><th>Week 8</th><th>Week 12</th></tr>
    ${["Body weight", "Chest", "Waist", "Hips", "Right arm", "Left arm", "Right thigh", "Left thigh"].map(statRow).join("")}</table>
    <p class="eyebrow">PROGRESS PHOTOS</p>
    <table><tr><th>Photos (front / side / back)</th><th>Done</th></tr>
    ${["Week 0", "Week 4", "Week 8", "Week 12"].map((w) => `<tr class="wk-row"><td>${w}</td><td>☐</td></tr>`).join("")}</table>`;
  const p2 = extraPage(`
    <p class="eyebrow">STRENGTH PRs</p>
    <table><tr><th>Lift</th><th>Week 1</th><th>Week 4</th><th>Week 8</th><th>Week 12</th></tr>
    ${["Squat", "Deadlift", "Bench Press", "Pull Ups (reps)", "", ""].map(statRow).join("")}</table>
    <p class="eyebrow">WEEKLY CHECK-IN</p>
    <table><tr><th>Week</th><th>Workouts done</th><th>Weight</th><th>Energy (1–5)</th><th>Notes</th></tr>
    ${Array.from({ length: 12 }, (_, i) => `<tr class="wk-row"><td><b>Week ${i + 1}</b></td><td></td><td></td><td></td><td></td></tr>`).join("")}</table>`);
  return pageWrap(sh.title, sh.subtitle, first, p2);
}

function renderLog(sh) {
  const day = (label) => `
    <p class="eyebrow">${label}</p>
    <table><tr><th style="width:38%">Exercise</th><th>Set 1</th><th>Set 2</th><th>Set 3</th><th>Set 4</th><th>Set 5</th></tr>
    ${Array.from({ length: 6 }, () => `<tr class="wk-row"><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}</table>`;
  const first = `
    <p class="intro">Log weight x reps for every working set (example: 135 x 8). Aim to beat something small every week: a rep, a little weight, or a shorter rest.</p>
    <div class="fill"><div>Week #: ________&nbsp;&nbsp;&nbsp;Phase: ☐ 1&nbsp;&nbsp;☐ 2&nbsp;&nbsp;☐ 3&nbsp;&nbsp;&nbsp;Track: ☐ Fat Loss&nbsp;&nbsp;☐ Build Muscle&nbsp;&nbsp;☐ Fighter</div></div>
    ${day("MONDAY")}${day("WEDNESDAY")}`;
  const p2 = extraPage(`${day("FRIDAY")}${day("SATURDAY (OPTIONAL)")}
    <p class="eyebrow">CONDITIONING NOTES</p>
    <table>${Array.from({ length: 3 }, () => `<tr class="wk-row"><td></td></tr>`).join("")}</table>`);
  return pageWrap(sh.title, sh.subtitle, first, p2);
}

function renderIndex(sh) {
  const raw = readFileSync(join(HERE, "..", "..", "site", "members", "js", "content.js"), "utf8");
  const m = raw.match(/const EXERCISE_LIBRARY = \[([\s\S]*?)\n\];/);
  const lib = Function(`return [${m[1]}]`)();
  const catBlock = (c) => `
    <div class="colsec"><p class="eyebrow">${c.toUpperCase()} (${lib.filter((e) => e.cat === c).length})</p>
    <ul class="plain">${lib.filter((e) => e.cat === c).map((e) => `<li>${e.name}</li>`).join("")}</ul></div>`;
  const page1 = `<p class="intro">Every movement has a video demo in the Exercise Library in your member area, with slow reps, cues, and common mistakes.</p>
    <div class="cols2">${["Legs", "Push"].map(catBlock).join("")}</div>`;
  const page2 = extraPage(`<div class="cols2">${["Pull", "Shoulders", "Power", "Core", "Conditioning"].map(catBlock).join("")}</div>`);
  return pageWrap(sh.title, sh.subtitle, page1, page2);
}

/* ---- build ---- */
const jobs = [];
for (const p of [FAT_LOSS, LEAN_MUSCLE, FIGHTER]) jobs.push([p.slug, renderProgram(p)]);
for (const sh of SHEETS) {
  if (sh.poster) jobs.push([sh.slug, renderPoster(sh)]);
  else if (sh.tracker) jobs.push([sh.slug, renderTracker(sh)]);
  else if (sh.log) jobs.push([sh.slug, renderLog(sh)]);
  else if (sh.index) jobs.push([sh.slug, renderIndex(sh)]);
  else if (sh.slug === "calorie-macro-worksheet") jobs.push([sh.slug, pageWrap(sh.title, sh.subtitle, renderSections(sh.sections.slice(0, 2)), extraPage(renderSections(sh.sections.slice(2))))]);
  else jobs.push([sh.slug, pageWrap(sh.title, sh.subtitle, renderSections(sh.sections))]);
}

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
for (const [slug, html] of jobs) {
  const hp = join(OUT_HTML, `${slug}.html`);
  writeFileSync(hp, html);
  execSync(`"${CHROME}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${join(OUT_PDF, slug)}.pdf" "file://${hp}" 2>/dev/null`);
  console.log("✓", slug + ".pdf");
}
console.log("DONE", jobs.length, "PDFs →", OUT_PDF);
