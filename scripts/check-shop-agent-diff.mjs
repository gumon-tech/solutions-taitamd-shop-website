// Diff rules for shop-agent pull requests: compares data/<concern>.json on main (HEAD^1) with the merge result (HEAD).
// Existing entries keep their wording and their place, nothing is removed, new entries go at the end and pass the
// text and picture rules in scripts/lib/shop-agent-diff.mjs (pictures are looked up under public/images of the
// current directory, the repository root). Run by .github/workflows/auto-merge-shop-agent.yml.
//   node scripts/check-shop-agent-diff.mjs <concern> [beforeFile afterFile]
// With two files it compares them instead of the two commits (for a local try).
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { checkDiff, CONCERNS, imageFileCheck } from "./lib/shop-agent-diff.mjs";

const [, , concern, beforeFile, afterFile] = process.argv;
if (!CONCERNS.includes(concern ?? "")) {
  console.error(`usage: check-shop-agent-diff.mjs <${CONCERNS.join("|")}> [beforeFile afterFile]`);
  process.exit(2);
}
const parse = (text, where) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`${where} is not valid JSON: ${e.message}`);
    process.exit(1);
  }
};
const show = (ref, file) => {
  const r = spawnSync("git", ["show", `${ref}:${file}`], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  if (r.status !== 0) {
    console.error(`cannot read ${file} at ${ref}: ${r.stderr.trim()}`);
    process.exit(1);
  }
  return parse(r.stdout, `${file} at ${ref}`);
};
const file = `data/${concern}.json`;
const before = beforeFile ? parse(readFileSync(beforeFile, "utf8"), beforeFile) : show("HEAD^1", file);
const after = afterFile ? parse(readFileSync(afterFile, "utf8"), afterFile) : show("HEAD", file);
let staffNames = [];
try {
  staffNames = (JSON.parse(readFileSync("data/team.json", "utf8")).members ?? []).map((m) => m?.display_name);
} catch {
  // No team file means no names to look for.
}
const errors = checkDiff(concern, before, after, { staffNames, isImageFile: imageFileCheck(process.cwd()) });
if (errors.length) {
  console.error(`${file}: changes the shop system may not make:\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log(`shop-agent diff OK for ${concern}`);
