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
import { execFileSync } from "node:child_process";

const [, , baseUrl, prUrl] = process.argv;
const WIDTHS = [[1440, 900], [375, 812]];

const run = (script, url, w, h, json) => {
  const out = execFileSync("node", [script, url, String(w), String(h)], {
    encoding: "utf8",
    env: { ...process.env, ...(json ? { JSON: "1" } : {}) },
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(out.trim().split("\n").pop());
};

const measure = (url) => {
  const per = {};
  for (const [w, h] of WIDTHS) {
    per[w] = {
      bright: run("scripts/brightness-run.mjs", url, w, h, false),
      contrast: run("scripts/contrast-probe.mjs", url, w, h, true),
    };
  }
  return per;
};

const base = measure(baseUrl);
const pr = measure(prUrl);

const sign = (n) => (n > 0 ? `+${n}` : String(n));
const lines = [];
lines.push("## Visual gate — T11 and text contrast");
lines.push("");
lines.push("Measured on this PR's build and on the base branch's build, in the same run.");
lines.push("Not a required check: this is here so the numbers are in front of you before you merge.");
lines.push("");

// The controls first, because nothing below them means anything if one is off. Both values are
// worked out by hand. Two of them, not one, because the first control only ever exercised the
// flat-background path the probe already got right — the bug that reached a ruling happened on
// a gradient, and a control proves the path it walks and nothing else.
lines.push("**Controls** — both computed by hand; if either is off, ignore everything below it.");
lines.push("");
lines.push("| control | expected | measured |");
lines.push("|---|---|---|");
for (const [w] of WIDTHS) {
  for (const c of pr[w].contrast.controls) {
    lines.push(`| ${c.what} (${w}px) | ${c.expected} | ${c.got ?? "not measured"} |`);
  }
}
lines.push("");

lines.push("| | width | base | this PR | change |");
lines.push("|---|---|---|---|---|");
for (const [w] of WIDTHS) {
  const b = base[w].bright;
  const p = pr[w].bright;
  const rows = [
    ["Lit cells (T11 primary — must not fall)", b.lightCells, p.lightCells],
    ["Average brightness", b.brightness, p.brightness],
    ["Page height (px)", b.height, p.height],
    ["Text below AA", base[w].contrast.fails.length, pr[w].contrast.fails.length],
  ];
  for (const [label, bv, pv] of rows) {
    const d = Math.round((pv - bv) * 100) / 100;
    // The word, not a glyph: a reader whose client drops the character would be left with a
    // row that reads as though nothing happened, which is the opposite of what it means.
    const flag = label.startsWith("Lit cells") && d < 0 ? " — FELL, check before merging" : "";
    lines.push(`| ${label}${flag} | ${w} | ${bv} | ${pv} | ${sign(d)} |`);
  }
}
lines.push("");

// Only text that this PR pushed below AA, not the backlog — a gate that reprints every
// pre-existing failure on every PR teaches people to scroll past it.
for (const [w] of WIDTHS) {
  const was = new Set(base[w].contrast.fails.map((f) => f.text));
  const now = pr[w].contrast.fails.filter((f) => !was.has(f.text));
  if (now.length) {
    lines.push(`**New below AA at ${w}px**`);
    lines.push("");
    lines.push("| ratio | needs | colours | text |");
    lines.push("|---|---|---|---|");
    for (const f of now) lines.push(`| ${f.ratio} | ${f.need} | ${f.fg} on ${f.bg} | ${f.text} |`);
    lines.push("");
  }
}

const existing = pr[1440].contrast.fails.length;
if (existing) {
  lines.push(`<sub>${existing} text elements were already below AA at 1440 before this PR. They are tracked in Q-SHOP-033, not repeated here.</sub>`);
}

console.log(lines.join("\n"));
