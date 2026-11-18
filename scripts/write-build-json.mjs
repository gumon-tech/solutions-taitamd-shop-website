// Writes out/build.json after `next build`: which commit this site was built from and a sha256 of every data/*.json
// (the files the shop system writes, data/promotions.json among them). The shop system confirms a change is "live"
// when build.json's sha is the merge commit (or the data hash matches). No secrets. Same fields as the Sri Siam site's
// scripts/write-build-json.mjs, so the shop system reads both sites with one piece of code:
//   { "sha": "<commit>", "built_at": "<UTC ISO time>", "data": { "<name>": "<sha256 hex of data/<name>.json>" } }
//   https://taitam-d.com/build.json
// Run by .github/workflows/nextjs.yml right after the build, and by `npm run build:json`.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
if (!existsSync(path.join(root, "out"))) {
  console.error("out/ does not exist: run next build first");
  process.exit(1);
}
const sha = process.env.GITHUB_SHA || spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).stdout?.trim() || "unknown";
const data = {};
for (const f of readdirSync(path.join(root, "data")).filter((n) => n.endsWith(".json")).sort()) {
  data[f.slice(0, -".json".length)] = createHash("sha256").update(readFileSync(path.join(root, "data", f))).digest("hex");
}
writeFileSync(path.join(root, "out/build.json"), JSON.stringify({ sha, built_at: new Date().toISOString(), data }, null, 2) + "\n");
console.log(`out/build.json written (sha ${sha.slice(0, 7)}, ${Object.keys(data).join(", ")})`);
