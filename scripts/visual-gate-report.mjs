// The visual gate, as a number a reviewer can read before they merge.
//
// WS ruled on 2026-09-12 that this repo may not have a gate that waits for one room's hands:
// it belongs to the owner, he uses Codex on it, and merging straight to main is the way he
// chose to work. The answer is not to slow the merge down, it is to put the measurement in
// front of whoever is about to press the button. So this runs on every pull request, whoever
// opened it, prints what changed against the base branch, and is deliberately NOT a required
// check — red here informs a decision, it does not block one.
//
// Both sides are built and measured in the same run rather than compared against numbers
// committed to the repo. A stored baseline would be one more number that is true on the day it
// is written and quietly false afterwards, which is the failure this project keeps paying for.
//
// Usage:  node scripts/visual-gate-report.mjs <baseUrl> <prUrl>
import { execFile } from "node:child_process";

const [, , baseUrl, prUrl] = process.argv;
const WIDTHS = [[1440, 900], [375, 812]];

// Nine pages, not one. Every measurement before 2026-09-12 was taken on the home page, and the
// six landing pages turned out to be carrying 26 to 28 pieces of text below AA — including every
// price on them — which nothing had ever looked at. Those six are where the ads point, so they
// were the pages least measured and most visited. Same shape as the _gcl_aw finding this repo
// already paid for: a check that walks the team's route never sees what the customer's route
// shows. Set by WS on Q-SHOP-035.
const ALL_PAGES = [
  "", "book/", "signature/",
  "massage-kings-cross/", "deep-tissue-massage-kings-cross/", "facial-kings-cross/",
  "nails-kings-cross/", "lash-extensions-kings-cross/", "waxing-kings-cross/",
];

// GATE_PAGES trims the list for a local run. CI always measures all nine; this exists so the
// machinery can be exercised in a minute instead of ten, and a gate whose own plumbing is
// never tested is a gate nobody has checked.
const PAGES = process.env.GATE_PAGES ? process.env.GATE_PAGES.split(",") : ALL_PAGES;

// Four at a time. Nine pages at two widths, on two branches, with two probes each is 72 browser
// launches; in series that is half an hour, which is long enough that people stop waiting for the
// check and merge anyway — a gate nobody reads is the same as no gate. Each probe owns its own
// Chrome and its own port, so they do not interfere; four is what a standard runner's memory
// takes comfortably.
const CONCURRENCY = 4;

const run = (script, url, w, h, json) =>
  new Promise((resolve, reject) => {
    execFile("node", [script, url, String(w), String(h)], {
      encoding: "utf8",
      env: { ...process.env, ...(json ? { JSON: "1" } : {}) },
      maxBuffer: 64 * 1024 * 1024,
    }, (err, stdout) => {
      if (err && !stdout) return reject(new Error(`${script} ${url} ${w}: ${err.message}`));
      try {
        resolve(JSON.parse(stdout.trim().split("\n").pop()));
      } catch (e) {
        reject(new Error(`${script} ${url} ${w} returned nothing parseable: ${stdout.slice(0, 200)}`));
      }
    });
  });

const pool = async (jobs) => {
  const results = new Array(jobs.length);
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (true) {
      const i = next++;
      if (i >= jobs.length) return;
      results[i] = await jobs[i]();
    }
  }));
  return results;
};

// Every measurement is queued first and then run through the pool, so the work is one flat list
// rather than nested loops that can only go as fast as their slowest step.
const jobs = [];
const slots = [];
for (const side of ["base", "pr"]) {
  const root = side === "base" ? baseUrl : prUrl;
  for (const page of PAGES) {
    for (const [w, h] of WIDTHS) {
      const url = root.replace(/\/$/, "") + "/" + page;
      slots.push({ side, page, w, kind: "bright" });
      jobs.push(() => run("scripts/brightness-run.mjs", url, w, h, false));
      slots.push({ side, page, w, kind: "contrast" });
      jobs.push(() => run("scripts/contrast-probe.mjs", url, w, h, true));
    }
  }
}

const answers = await pool(jobs);

const base = {};
const pr = {};
for (const page of PAGES) { base[page] = {}; pr[page] = {}; for (const [w] of WIDTHS) { base[page][w] = {}; pr[page][w] = {}; } }
slots.forEach((slot, i) => {
  const target = slot.side === "base" ? base : pr;
  target[slot.page][slot.w][slot.kind] = answers[i];
});

const sign = (n) => (n > 0 ? `+${n}` : String(n));
const lines = [];
lines.push("## Visual gate — T11 and text contrast");
lines.push("");
lines.push(`${PAGES.length} page${PAGES.length === 1 ? "" : "s"}, measured on this PR's build and on the base branch's build in the same run.`);
lines.push("Not a required check: this is here so the numbers are in front of you before you merge.");
lines.push("");

// The controls first, because nothing below them means anything if one is off. Both values are
// worked out by hand. Two of them, not one, because the first control only ever exercised the
// flat-background path the probe already got right — the bug that reached a ruling happened on a
// gradient, and a control proves the path it walks and nothing else.
const ctl = pr[PAGES[0]][WIDTHS[0][0]].contrast.controls;
const ctlOk = ctl.every((c) => c.got != null);
lines.push(`**Controls** — ${ctl.map((c) => `${c.what}: expected ${c.expected}, got ${c.got ?? "not measured"}`).join("; ")}`);
if (!ctlOk) lines.push("");
if (!ctlOk) lines.push("A control did not measure. Ignore every number below it.");
lines.push("");

lines.push("| page | width | lit cells (must not fall) | average | height | below AA |");
lines.push("|---|---|---|---|---|---|");
let regressions = 0;
for (const page of PAGES) {
  for (const [w] of WIDTHS) {
    const b = base[page][w];
    const p2 = pr[page][w];
    const dLit = p2.bright.lightCells - b.bright.lightCells;
    const dAvg = Math.round((p2.bright.brightness - b.bright.brightness) * 100) / 100;
    const dAA = p2.contrast.fails.length - b.contrast.fails.length;
    if (dLit < 0) regressions++;
    const flag = dLit < 0 ? " FELL" : "";
    lines.push(`| /${page} | ${w} | ${b.bright.lightCells} → ${p2.bright.lightCells} (${sign(dLit)})${flag} | ${b.bright.brightness} → ${p2.bright.brightness} (${sign(dAvg)}) | ${b.bright.height} → ${p2.bright.height} | ${b.contrast.fails.length} → ${p2.contrast.fails.length} (${sign(dAA)}) |`);
  }
}
lines.push("");
if (regressions) {
  lines.push(`**${regressions} page/width combinations lost lit area.** T11 treats that as a stop, not a note — check before merging.`);
  lines.push("");
}

// Only text this PR pushed below AA, not the backlog. A gate that reprints every pre-existing
// failure on every pull request teaches people to scroll past it.
for (const page of PAGES) {
  for (const [w] of WIDTHS) {
    const was = new Set(base[page][w].contrast.fails.map((f) => f.text));
    const now = pr[page][w].contrast.fails.filter((f) => !was.has(f.text));
    if (!now.length) continue;
    lines.push(`**New below AA on /${page} at ${w}px**`);
    lines.push("");
    lines.push("| ratio | needs | colours | text |");
    lines.push("|---|---|---|---|");
    for (const f of now) lines.push(`| ${f.ratio} | ${f.need} | ${f.fg} on ${f.bg} | ${f.text} |`);
    lines.push("");
  }
}

console.log(lines.join("\n"));
