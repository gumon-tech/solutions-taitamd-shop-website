import data from "@/data/copy.json";
import slots from "@/scripts/lib/copy-slots.json";
import { HOURS } from "./hours";
import { SITE } from "./site";
import { failAt } from "./content-check";

// Page copy — headings, lead paragraphs, card texts — is a flat map of named slots in
// data/copy.json (rules and slot list: data/COPY.md). The site declares the slots in
// scripts/lib/copy-slots.json, each with a kind and a length cap; whoever edits the data may
// change values only, never add or remove a key. A malformed file throws, which stops
// `next build`. Layout, colours, links and everything with legal weight stay in code.
//
// Tokens a value may use, replaced here: {{walk_minutes}} (lib/site.ts) and {{hours}}
// (data/hours.json).

const FILE = "copy.json";
const TOKENS: Record<string, string> = { walk_minutes: String(SITE.walkMinutes), hours: HOURS.words };

type SlotSpec = { kind: "line" | "paragraph"; max: number };
const SLOTS = slots as Record<string, SlotSpec>;

export type CopyKey = keyof typeof slots;

function validate(raw: unknown): Record<string, string> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) failAt(FILE, "(file)", "must be an object of slot keys to text");
  const o = raw as Record<string, unknown>;
  for (const key of Object.keys(SLOTS)) if (!(key in o)) failAt(FILE, key, "slot is missing (the slot list is scripts/lib/copy-slots.json)");
  for (const key of Object.keys(o)) if (!(key in SLOTS)) failAt(FILE, key, "is not a slot declared in scripts/lib/copy-slots.json (values may change; keys may not)");
  const out: Record<string, string> = {};
  for (const [key, spec] of Object.entries(SLOTS)) {
    const v = o[key];
    if (typeof v !== "string" || v.trim().length === 0) failAt(FILE, key, "must be non-empty text");
    if (v.length > spec.max) failAt(FILE, key, `is ${v.length} characters; the limit for this slot is ${spec.max}`);
    if (/[<>]/.test(v)) failAt(FILE, key, "must not contain < or >");
    if (spec.kind === "line" && /[\r\n]/.test(v)) failAt(FILE, key, "is a line slot and must not contain a line break");
    if (/[`*]|\]\(|^#/.test(v) || /\r|\n\s*\n/.test(v)) failAt(FILE, key, "must be plain text, with no markdown");
    out[key] = v.replace(/\{\{([a-z_]*)\}\}/g, (_, name: string) => {
      if (!(name in TOKENS)) failAt(FILE, key, `unknown token {{${name}}} (allowed: ${Object.keys(TOKENS).map((t) => `{{${t}}}`).join(", ")})`);
      return TOKENS[name];
    });
  }
  return out;
}

const copy = validate(data);

/** The text in a named slot. An unknown key is a type error, so a renamed slot cannot go unnoticed. */
export function copyText(key: CopyKey): string {
  return copy[key];
}
