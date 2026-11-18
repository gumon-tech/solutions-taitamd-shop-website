import data from "@/data/photos.json";
import slots from "@/scripts/lib/photo-slots.json";
import { checkObject, checkKeys, checkText, failAt, registerImage } from "./content-check";

// Photo slots on the home page, under `slots` in data/photos.json next to `updated_at` (rules
// and slot list: data/PHOTOS.md). The site declares the slots in scripts/lib/photo-slots.json; whoever edits the data may change a
// slot's `src` and `alt`, never add or remove a slot. A malformed file throws, which stops
// `next build`. That the file exists in public/ and weighs at most 600 KB (images are served
// raw, so nobody resizes them for us) is checked on the server in lib/content-assets.ts.

const FILE = "photos.json";
const UPDATED_AT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?Z$/;
const SRC = /^\/images\/[a-z0-9_/-]+\.(jpe?g|png|webp)$/;
const SPECS = slots as Record<string, { alt_max: number }>;

export type PhotoKey = keyof typeof slots;
export type Photo = { src: string; alt: string };

function validate(raw: unknown): Record<string, Photo> {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["updated_at", "slots"]);
  if (typeof root.updated_at !== "string" || !UPDATED_AT.test(root.updated_at)) failAt(FILE, "updated_at", "must be a UTC time like 2026-11-19T10:00:00Z");
  const given = checkObject(FILE, "slots", root.slots);
  for (const key of Object.keys(SPECS)) if (!(key in given)) failAt(FILE, key, "slot is missing (the slot list is scripts/lib/photo-slots.json)");
  const out: Record<string, Photo> = {};
  for (const key of Object.keys(given)) {
    if (!(key in SPECS)) failAt(FILE, key, "is not a slot declared in scripts/lib/photo-slots.json (values may change; keys may not)");
  }
  for (const [key, spec] of Object.entries(SPECS)) {
    const o = checkObject(FILE, key, given[key]);
    checkKeys(FILE, key, o, ["src", "alt"]);
    const src = o.src;
    if (typeof src !== "string" || !SRC.test(src) || src.includes("..")) failAt(FILE, `${key}.src`, "must be a path like /images/folder/name.jpg (lowercase letters, digits, - _ /; jpg, png or webp; no ..)");
    const alt = checkText(FILE, `${key}.alt`, o.alt, spec.alt_max);
    registerImage(FILE, `${key}.src`, src, 600 * 1024);
    out[key] = { src, alt };
  }
  return out;
}

const photos = validate(data);

export function photo(key: PhotoKey): Photo {
  return photos[key];
}
