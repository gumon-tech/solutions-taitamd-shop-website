// Shared shape checks for the content files under data/. Each file has its own validator in
// lib/ (hours.ts, closures.ts, notice.ts, faq.ts, services.ts, home.ts) in the style of
// lib/promotions.ts: every check throws, so a malformed file stops `next build` instead of
// reaching the live site.
//
// This module must stay free of node:fs. Some of the validators run inside client bundles
// (Hero and Gallery import lib/site.ts, which imports the service categories). Whether an
// image exists in public/ is therefore checked separately, on the server, in
// lib/content-assets.ts.

export type Obj = Record<string, unknown>;

export function failAt(file: string, where: string, why: string): never {
  throw new Error(`data/${file}: ${where}: ${why}`);
}

export function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Non-empty text, at most `max` characters, with no angle brackets (the site never renders HTML from data). */
export function checkText(file: string, where: string, v: unknown, max: number): string {
  if (typeof v !== "string" || v.trim().length === 0) failAt(file, where, "must be non-empty text");
  if (v.length > max) failAt(file, where, `is ${v.length} characters; the limit is ${max}`);
  if (/[<>]/.test(v)) failAt(file, where, "must not contain < or >");
  return v;
}

/** Same as checkText but may also be absent (undefined). */
export function checkOptionalText(file: string, where: string, v: unknown, max: number): string | undefined {
  return v === undefined ? undefined : checkText(file, where, v, max);
}

export function checkList<T>(file: string, where: string, v: unknown, max: number, each: (item: unknown, i: number) => T): T[] {
  if (!Array.isArray(v)) failAt(file, where, "must be a list");
  if (v.length > max) failAt(file, where, `has ${v.length} entries; the limit is ${max}`);
  return v.map(each);
}

export function checkObject(file: string, where: string, v: unknown): Obj {
  if (!isObj(v)) failAt(file, where, "must be an object");
  return v;
}

/** Only these keys may appear. A typo such as `titel` fails instead of silently doing nothing. */
export function checkKeys(file: string, where: string, o: Obj, allowed: string[]) {
  for (const k of Object.keys(o)) if (!allowed.includes(k)) failAt(file, where, `unknown field \`${k}\` (allowed: ${allowed.join(", ")})`);
}

/** A picture served from public/images/. Existence is checked in lib/content-assets.ts. */
export function checkImagePath(file: string, where: string, v: unknown): string {
  if (typeof v !== "string" || !v.startsWith("/images/")) failAt(file, where, "must be a path under /images/");
  if (v.length > 200 || /[<>"'\s]/.test(v) || v.includes("..")) failAt(file, where, "is not a plain path under /images/");
  return v;
}

/** A link that stays on the site: "/services", "/services#cat-massage". Never a full URL. */
export function checkInternalPath(file: string, where: string, v: unknown): string {
  if (typeof v !== "string" || !/^\/[A-Za-z0-9\-_/#?=.]*$/.test(v) || v.startsWith("//")) {
    failAt(file, where, "must be a path on this site such as /services (no domain)");
  }
  return v;
}

export function checkUnique(file: string, where: string, seen: Set<string>, id: string) {
  if (seen.has(id)) failAt(file, where, `\`${id}\` is used twice`);
  seen.add(id);
}

/** Every image path a validated file names, for the server-side existence check. */
export const contentImages: Array<{ file: string; where: string; path: string; maxBytes?: number }> = [];
export function registerImage(file: string, where: string, path: string, maxBytes?: number) {
  contentImages.push({ file, where, path, maxBytes });
}
