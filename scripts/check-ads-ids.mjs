// Fails if the built site (out/) contains a Google tag id or a bot host that is not this shop's own
// (ads-and-web-standard §4.6, full-loop-web-design §4.6). Taitam-D and the other shops are separate
// clients, some of them competitors: a value copied from another client's site must never ship.
// Run after `next build`. The allowed values are read from lib/site.ts and components/Analytics.tsx,
// so a deliberate change there is a one-place edit.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "out";
const site = readFileSync("lib/site.ts", "utf8");
const analytics = readFileSync("components/Analytics.tsx", "utf8");

const ADS_ID = /tagId:\s*"(AW-\d+)"/.exec(site)?.[1];
const GA_ID = /GA_ID\s*=\s*"(G-[A-Z0-9]+)"/.exec(analytics)?.[1];
const ENDPOINT = /endpoint:\s*"([^"]*)"/.exec(site)?.[1] ?? "";
if (!ADS_ID || !GA_ID) {
  console.error("check-ads-ids: could not read the Ads id from lib/site.ts or the GA4 id from components/Analytics.tsx");
  process.exit(1);
}
const OWN_HOST = ENDPOINT ? new URL(ENDPOINT).hostname : "shop-agent.taitam-d.com";

const TEXT = /\.(html|js|mjs|json|txt|css|xml|webmanifest)$/;
function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (TEXT.test(name)) yield p;
  }
}

const problems = new Map();
function report(what, file) {
  if (!problems.has(what)) problems.set(what, new Set());
  problems.get(what).add(relative(OUT, file));
}

let scanned = 0;
for (const f of files(OUT)) {
  scanned++;
  const s = readFileSync(f, "utf8");
  for (const [m] of s.matchAll(/\bAW-\d{6,}\b/g)) if (m !== ADS_ID) report(`Google Ads id ${m}`, f);
  for (const [m] of s.matchAll(/\bG-[A-Z0-9]{8,12}\b/g)) if (m !== GA_ID) report(`GA4 id ${m}`, f);
  for (const [m] of s.matchAll(/\b[a-z0-9.-]*\.gumon\.io\b/gi)) report(`host ${m}`, f);
  for (const [m] of s.matchAll(/\b[a-z0-9.-]*(?:shop-agent|-bot)\.[a-z0-9.-]+\b/gi)) {
    if (m.toLowerCase() !== OWN_HOST) report(`bot host ${m}`, f);
  }
}

if (scanned === 0) {
  console.error("check-ads-ids: nothing to scan in out/ (run `next build` first)");
  process.exit(1);
}
if (problems.size) {
  console.error("check-ads-ids: values that are not this shop's own were found in the build:");
  for (const [what, where] of problems) console.error(`  ${what}: ${[...where].slice(0, 5).join(", ")}${where.size > 5 ? ` and ${where.size - 5} more` : ""}`);
  process.exit(1);
}
console.log(`check-ads-ids: ${scanned} files, only ${ADS_ID}, ${GA_ID} and ${OWN_HOST}`);
