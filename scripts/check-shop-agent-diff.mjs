// Diff rules for shop-agent pull requests: compares data/<concern>.json on main (HEAD^1) with the merge result (HEAD)
// under the rules in scripts/lib/shop-agent-diff.mjs (what may change per concern, and the text and picture rules).
// Pictures are looked up under public/images of the current directory (the repository root); the slot lists are the
// ones in scripts/lib/ here, which on a shop-agent pull request are main's (rule 2 lets only data change). For photos,
// the picture files the pull request adds (git diff --diff-filter=A) are read from the checkout and checked too, and
// the ones it deletes are listed.
// Run by .github/workflows/auto-merge-shop-agent.yml.
//   node scripts/check-shop-agent-diff.mjs <concern> [beforeFile afterFile]
// With two files it compares them instead of the two commits (for a local try; no added files then).
import { spawnSync } from "node:child_process";
import { closeSync, lstatSync, openSync, readFileSync, readSync } from "node:fs";
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
const json = (f) => JSON.parse(readFileSync(f, "utf8"));
const listed = (filter) => {
  const r = spawnSync("git", ["diff", "--name-only", "--no-renames", `--diff-filter=${filter}`, "-z", "HEAD^1", "HEAD"], { encoding: "utf8" });
  if (r.status !== 0) {
    console.error(`cannot list changed files: ${r.stderr.trim()}`);
    process.exit(1);
  }
  return r.stdout.split("\0").filter(Boolean);
};
const added = [];
const deleted = beforeFile ? [] : listed("D");
if (!beforeFile) {
  for (const path of listed("A")) {
    const st = lstatSync(path, { throwIfNoEntry: false });
    const head = Buffer.alloc(16);
    let n = 0;
    if (st?.isFile()) {
      const fd = openSync(path, "r");
      n = readSync(fd, head, 0, 16, 0);
      closeSync(fd);
    }
    added.push({ path, size: st?.size ?? 0, regular: Boolean(st?.isFile()), head: head.subarray(0, n) });
  }
}
const errors = checkDiff(concern, before, after, {
  staffNames,
  isImageFile: imageFileCheck(process.cwd()),
  added,
  deleted,
  copySlots: json("scripts/lib/copy-slots.json"),
  photoSlots: json("scripts/lib/photo-slots.json"),
});
if (errors.length) {
  console.error(`${file}: changes the shop system may not make:\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log(`shop-agent diff OK for ${concern}`);
