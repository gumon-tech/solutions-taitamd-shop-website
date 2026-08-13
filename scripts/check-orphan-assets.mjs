#!/usr/bin/env node
// Fails the build when a file lands in public/ that no page points at.
//
// Why this exists: static export ships every file under public/ whether or not
// anything links to it, so an unreferenced file is still a public URL. Thirty-three
// of them accumulated without anyone deciding to leave them there, and three carried
// a cancelled phone number, a retired domain and a price list — reachable, and
// invisible to every review precisely because no page showed them (see
// docs/plans/ORPHANED-ASSETS.md).
//
// Scope note, and it is the whole trick: documentation is NOT searched. A doc that
// *describes* a file makes that file look *used*. README's "Image credits" section
// lists five stock images to credit Unsplash, and while README was in scope the
// scanner reported them as referenced — the page that exists to say where the images
// came from was being read as proof that they were in use.
//
// Usage:  node scripts/check-orphan-assets.mjs [--list]
//   exit 0 = no orphans   exit 1 = orphans found, or the self-test failed

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const BASELINE = "scripts/orphan-assets-baseline.txt";
const CODE_DIRS = ["app", "components", "lib"];
const CODE_FILES = ["next.config.mjs", "package.json"];
const CODE_EXT = new Set([".tsx", ".ts", ".mjs", ".js", ".json", ".css"]);

// Files fetched by URL by convention, with no markup pointing at them. Keep this list
// short and justified: every entry is a hole in the check.
const ALLOWLIST = new Set([
  "llms.txt", // convention endpoint for LLM crawlers, fetched directly like robots.txt
]);

// Known-referenced files the scanner must find. If it cannot see these, its answer
// about everything else is worthless — a scanner that looks in the wrong place reports
// a clean result just as confidently as one that works.
const SELF_TEST = [
  "public/images/logo.png",
  "public/images/shop/treatment-room-couples.jpg",
  "public/images/story/founder-860x1075.jpg",
  "public/favicon.ico",
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const haystack = [
  ...CODE_DIRS.flatMap((d) => walk(d)).filter((f) => CODE_EXT.has(extname(f))),
  ...CODE_FILES,
]
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

const isReferenced = (file) => {
  const base = file.split("/").pop();
  const webPath = "/" + relative("public", file);
  return haystack.includes(base) || haystack.includes(webPath);
};

const missed = SELF_TEST.filter((f) => !isReferenced(f));
if (missed.length) {
  console.error("✗ self-test failed — the scanner cannot see files that are definitely used:");
  for (const f of missed) console.error(`    ${f}`);
  console.error("  Its verdict on the rest of public/ cannot be trusted. Fix the scanner, not the assets.");
  process.exit(1);
}

const assets = walk("public").filter((f) => !f.split("/").pop().startsWith("."));
const orphans = assets.filter((f) => !ALLOWLIST.has(f.split("/").pop()) && !isReferenced(f));

if (process.argv.includes("--list")) {
  for (const f of orphans) console.log(f);
  process.exit(0);
}

// Thirty orphans already existed when this check was written. Failing on all of them
// would have meant either blocking every deploy or not adding the check at all, so the
// known set is recorded and only new ones fail. The baseline is the debt, written down
// and countable, and W-18 is the work of shrinking it.
const baseline = new Set(
  readFileSync(BASELINE, "utf8").split("\n").map((l) => l.trim()).filter(Boolean),
);

const fresh = orphans.filter((f) => !baseline.has(f));
// A baseline entry that is no longer an orphan has been fixed or deleted. Requiring it
// to be removed is what stops the list turning into a permanent amnesty that nobody
// ever trims.
const stale = [...baseline].filter((f) => !orphans.includes(f));

if (fresh.length) {
  console.error(`✗ ${fresh.length} new file(s) in public/ that no page references:`);
  for (const f of fresh) console.error(`    ${f}`);
  console.error("");
  console.error("  Static export publishes these anyway, so each one is a live URL nobody");
  console.error("  can see from the site. Reference it from a page, delete it, or — only if");
  console.error("  it is genuinely fetched by URL like robots.txt — add it to ALLOWLIST in");
  console.error("  this script with a reason. Do not add it to the baseline: that file is a");
  console.error("  record of debt already incurred, not a place to put new debt.");
}

if (stale.length) {
  console.error(`✗ ${stale.length} baseline entr(y/ies) no longer orphaned — remove them:`);
  for (const f of stale) console.error(`    ${f}`);
  console.error(`  (edit ${BASELINE})`);
}

if (fresh.length || stale.length) process.exit(1);

console.log(
  `✓ ${assets.length} files in public/ — ${orphans.length} known orphans, 0 new (self-test passed)`,
);
if (orphans.length) console.log(`  ${orphans.length} still to clear: see docs/plans/ORPHANED-ASSETS.md (W-18)`);
