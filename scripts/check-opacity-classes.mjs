// Fail the build when a Tailwind opacity utility in the source produced no CSS rule.
//
// Why this gate exists (Q-SHOP-033, ordered by WS 2026-09-11). Tailwind builds opacity
// modifiers from a scale in steps of five. Write `bg-ink/8` and you get nothing at all: no
// error, no warning, no rule — and CSS simply moves on to the next declaration, so the page
// still renders and still looks plausible. Sixty-seven of these had accumulated here across
// twenty-two distinct classes. Two of them mattered a lot:
//
//   bg-ink/8      17 places   faint light panels that were never painted
//   border-ink/12 19 places   the border fell through to preflight's gray-200, a colour that
//                             is not in this palette and that nobody chose
//
// The second one is the instructive failure. It did not look broken — it looked like a design
// decision, for months, on every page.
//
//   *A class that is misspelt fails loudly and is fixed in the minute it is written.
//    A class that does not exist fails silently and can outlive the person who wrote it.*
//
// Usage — after `npm run build`, so there is a stylesheet to check against:
//   node scripts/check-opacity-classes.mjs
// Exits non-zero and names every class and the files it appears in.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const CSS_DIR = "out/_next/static/css";
const SOURCE_DIRS = ["app", "components"];
// A utility, a slash, then either a plain number or a bracketed fraction.
const CLASS = /\b(bg|text|border|from|to|via|ring|divide|fill|stroke|decoration|placeholder|outline|shadow|accent)-[a-z0-9]+\/(\[[0-9.]+\]|[0-9]{1,3})\b/g;

// Two things this had to learn the hard way on its first run. It read class names out of
// comments — including the comment in Hero.tsx that exists to explain that `bg-black/16` never
// worked — and it missed classes that only ever appear behind a variant, where Tailwind emits
// `.hover\:bg-white\/60:hover` and a search for `.bg-white\/60` finds nothing. Both produced
// confident false positives, which is the one thing a gate must not do: a gate that cries wolf
// gets switched off, and then it is worth less than no gate at all.
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") || p.endsWith(".ts") ? [p] : [];
  });

let css = "";
try {
  for (const f of readdirSync(CSS_DIR)) if (f.endsWith(".css")) css += readFileSync(join(CSS_DIR, f), "utf8");
} catch {
  console.error(`check-opacity-classes: no stylesheet under ${CSS_DIR} — run \`npm run build\` first.`);
  process.exit(2);
}

const seen = new Map(); // class -> Set(files)
for (const dir of SOURCE_DIRS) {
  for (const file of walk(dir)) {
    const src = stripComments(readFileSync(file, "utf8"));
    for (const [cls] of src.matchAll(CLASS)) {
      if (!seen.has(cls)) seen.set(cls, new Set());
      seen.get(cls).add(file);
    }
  }
}

// Tailwind escapes `/`, `[`, `]` and `.` in the selector it emits.
const escaped = (cls) => cls.replace(/[/[\].]/g, (ch) => "\\" + ch);
// `.name` for a bare class, `\:name` for one that only ever appears behind a variant.
const present = (cls) => css.includes("." + escaped(cls)) || css.includes("\\:" + escaped(cls));

const missing = [...seen.keys()].filter((cls) => !present(cls)).sort();

if (!missing.length) {
  console.log(`check-opacity-classes: ${seen.size} opacity utilities, all present in the stylesheet.`);
  process.exit(0);
}

console.error(`check-opacity-classes: ${missing.length} utilities produced no CSS rule.\n`);
for (const cls of missing) {
  const near = cls.includes("[") ? "" : `  (nearest on the scale: ${Math.round(+cls.split("/")[1] / 5) * 5}, or write it as /[0.${cls.split("/")[1].padStart(2, "0")}])`;
  console.error(`  ${cls}${near}`);
  for (const f of [...seen.get(cls)].sort()) console.error(`      ${f}`);
}
console.error("\nTailwind builds opacity modifiers from a scale in steps of five. A value off that");
console.error("scale produces no rule, which is why the page still renders and still looks wrong.");
process.exit(1);
