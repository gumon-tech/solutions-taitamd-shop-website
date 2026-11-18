// What the shop's WhatsApp system may change in a data file through a shop-agent/<concern>-* pull request
// (see data/PROMOTIONS.md, "Changes from the shop system"). `before` and `after` are the parsed JSON of main (HEAD^1)
// and of the merge result (HEAD). checkDiff is pure: the one question that needs the disk (is this picture a real file
// under public/images?) is asked through the `isImageFile` callback, which imageFileCheck below builds for the CLI.
// Used by scripts/check-shop-agent-diff.mjs, which the auto-merge workflow runs, and by
// scripts/test-shop-agent-diff.mjs. Plain Node, no dependencies.
import { realpathSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const LISTS = {
  promotions: {
    list: "promotions",
    id: "code",
    mayChange: ["status", "ends", "ends_label"],
    top: ["updated_at", "note", "promotions"],
    fields: ["code", "title", "eyebrow", "detail", "points", "offer", "message", "image", "illustrative", "starts", "ends", "ends_label", "status"],
  },
};
export const CONCERNS = Object.keys(LISTS);

// The rules every new card's text must pass (and the file's `note`, and a changed `ends_label`). They match the checks
// the shop system runs before it opens a pull request, so a card it accepted is not refused here; the site holds its
// own copy so the rule does not depend on the other side alone.
const LIMITS = { title: 80, eyebrow: 60, detail: 400, offer: 160, message: 200, ends_label: 40 };
export const NOTE_MAX = 200;
const POINTS_MAX = 4;
const POINT_LEN = 60;
// The longest single word (no spaces) a card may carry: a longer one runs off a phone-width card.
const WORD_MAX = 24;
const CODE = /^P-[A-Z0-9]{2,20}$/;
const UPDATED_AT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?Z$/;
export const IMAGE = /^\/images\/[a-z0-9_/-]+\.(jpe?g|png|webp)$/;
const LINK = /https?:\/\/|www\.|:\/\//i;
// A domain without a scheme: example.co.uk, bit.ly/x, taitam-d.com. Two forms: a host followed by a path, or a host
// that ends in a common top-level domain. "dot com" written out counts too.
const TLDS =
  "com|net|org|co|uk|io|ly|me|info|biz|app|dev|xyz|shop|link|site|online|store|ai|gg|tv|gl|li|eu|de|fr|th|cc|ws|ru|cn|page|club|top|vip|click|tech|website|email|ac|gov|nhs|london";
const DOMAIN = new RegExp(`(?<![\\w-])[a-z0-9-]+(?:\\.[a-z0-9-]+)*\\.(?:${TLDS})(?![\\w-])|(?<![\\w-])[a-z0-9-]+\\.[a-z]{2,}\\/`, "i");
const DOT_COM = /\bdot\s*(?:com|co\b|net|org|uk|ly|io)\b/i;
const THAI = /[฀-๿]/;
const EMOJI = /\p{Extended_Pictographic}/u;
const FORMAT_CHAR = /\p{Cf}/u; // zero-width and bidi controls, invisible on the page
const CONTROL_CHAR = /[\p{Cc}]/u;
// Every character must be plain ASCII, a Latin letter (café, naïve), or one of these marks.
const ALLOWED_CHAR = /^(?:[\x20-\x7E]|\p{Script=Latin}|[£€’‘“”·–—…°×])$/u;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
// A run of digits held together only by spaces and phone punctuation (no letters, no £, no colon), so "0 7 7 0 0 ..."
// and "077-009.001/23" are one run while "90-minute", "£35" and "10:00" are not.
const DIGIT_RUN = /\+?\d(?:[ \-.()/,_·•–—]{0,3}\d)+/g;
const PHONE_DIGITS = 9;
const NI_NUMBER = /\b[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/i;
const STAFF_ID = /\btw[-_ ]?\d+\b/i;
const WEB_TAG = /\[web-/i;
// Health and medical claims (the UK ASA / CAP list for massage). The site makes none in an offer.
const HEALTH =
  /\b(detox\w*|toxins?|circulation|pain\w*|ache\w*|headache\w*|stress\w*|swell\w*|immun\w*|inflammation|cure\w*|heal\w*|relie\w*|tension|sleep\w*|therap\w*|recover\w*|muscle\w*|well-?being|anxiety|depression|insomnia|arthritis|sciatica|migraines?|fatigue|injur\w*|rehab\w*|alleviat\w*|remed\w*|rheumat\w*|fibromyalgia|eczema|asthma|diabet\w*|cancer|covid|stiff\w*|sore\w*|cramp\w*|spasm\w*|chronic|symptom\w*|diagnos\w*|illness|disease|medical|clinical|physio\w*|chiropract\w*|osteo\w*|blood pressure|joints|posture|knot\w*|back problem\w*|lymph\w*|drainage|weight|slim\w*|digest\w*|energ\w*|hormon\w*|breath\w*|nerve\w*|tight\w*)\b/i;
// The shop's own name is not a claim.
const SHOP_NAMES = [/Taitam-D Massage & Beauty/gi, /Taitam-D/gi];
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Problems in a list of public strings (one card, the note, a changed ends_label). `at` names where they are.
 * Everything is checked on the NFKC form, so fullwidth or styled letters (ｗｗｗ, 𝐡𝐞𝐚𝐥) cannot slip past a pattern.
 */
export function textProblems(at, strings, staffNames = []) {
  const out = [];
  const raw = strings.filter((x) => typeof x === "string");
  if (raw.some((s) => FORMAT_CHAR.test(s))) out.push(`${at}: an invisible formatting character (zero-width or direction mark)`);
  if (raw.some((s) => CONTROL_CHAR.test(s))) out.push(`${at}: a control character (tab, line break, ...)`);
  const fields = raw.map((s) => s.normalize("NFKC"));
  const text = fields.join(" \n ").replace(/\s+/g, " ");
  if (THAI.test(text)) out.push(`${at}: Thai script (the public text is English)`);
  if (EMOJI.test(text)) out.push(`${at}: an emoji`);
  const odd = [...text.replace(/\s/g, "")].filter((c) => !ALLOWED_CHAR.test(c) && !THAI.test(c) && !EMOJI.test(c));
  if (odd.length) out.push(`${at}: characters outside English text (${[...new Set(odd)].map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(" ")})`);
  const long = fields.flatMap((s) => s.split(/\s+/)).find((w) => [...w].length > WORD_MAX);
  if (long) out.push(`${at}: the word "${long.slice(0, 30)}..." is longer than ${WORD_MAX} characters (it breaks the card on a phone)`);
  if (LINK.test(text) || DOMAIN.test(text) || DOT_COM.test(text)) out.push(`${at}: a link or web address (the only link on a card is the shop's own WhatsApp button)`);
  if (EMAIL.test(text)) out.push(`${at}: an email address`);
  for (const m of text.matchAll(DIGIT_RUN)) {
    const groups = m[0].match(/\d+/g) ?? [];
    const digits = groups.join("").length;
    if (digits >= PHONE_DIGITS && !groups.every((g) => g.length === 4 && /^(19|20)/.test(g))) {
      out.push(`${at}: a phone-like number`);
      break;
    }
  }
  if (NI_NUMBER.test(text)) out.push(`${at}: a National Insurance number`);
  if (STAFF_ID.test(text)) out.push(`${at}: a staff id`);
  if (WEB_TAG.test(text)) out.push(`${at}: the [web-X] tag is added by the site, not written in the text`);
  let scrubbed = text;
  for (const n of SHOP_NAMES) scrubbed = scrubbed.replace(n, " ");
  if (HEALTH.test(scrubbed)) out.push(`${at}: health-result wording "${HEALTH.exec(scrubbed)[0]}" (offers make no health claims)`);
  for (const name of staffNames) {
    if (typeof name === "string" && name.trim().length >= 2 && new RegExp(`(?<!\\w)${escape(name.trim().normalize("NFKC"))}(?!\\w)`, "i").test(text)) {
      out.push(`${at}: a team member's name (offers never name staff)`);
      break;
    }
  }
  return out;
}

/** Problems in the text of one new card. `staffNames`: display names from data/team.json (never on an offer). */
export function newCardProblems(p, staffNames = []) {
  const out = [];
  const at = typeof p?.code === "string" ? p.code : "(new card)";
  if (typeof p?.code !== "string" || !CODE.test(p.code)) out.push(`${at}: code must look like P-AB12`);
  const extra = Object.keys(p ?? {}).filter((k) => !LISTS.promotions.fields.includes(k));
  if (extra.length) out.push(`${at}: unknown fields ${extra.join(", ")}`);
  for (const [k, max] of Object.entries(LIMITS)) {
    if (typeof p?.[k] === "string" && [...p[k]].length > max) out.push(`${at}: ${k} is ${[...p[k]].length} characters, limit ${max}`);
  }
  const points = Array.isArray(p?.points) ? p.points : [];
  if (points.length > POINTS_MAX || points.some((x) => typeof x !== "string" || [...x].length > POINT_LEN)) out.push(`${at}: at most ${POINTS_MAX} points of ${POINT_LEN} characters`);
  out.push(...textProblems(at, [p?.title, p?.eyebrow, p?.detail, p?.offer, p?.message, p?.ends_label, ...points], staffNames));
  return out;
}

/** Problems with a new card's picture. `before`: the list on main, which settles `illustrative` for a known picture. */
function imageProblems(p, beforeList, isImageFile) {
  const at = typeof p?.code === "string" ? p.code : "(new card)";
  if (p?.image === null) return [];
  const img = p?.image;
  if (typeof img !== "string" || !IMAGE.test(img) || img.includes("..") || img.includes("//")) {
    return [`${at}: image must be null or a path like /images/tour/name.jpg (lower case, .jpg .png or .webp)`];
  }
  const out = [];
  if (typeof isImageFile !== "function" || !isImageFile(img)) out.push(`${at}: image ${img} is not a file under public/images`);
  const known = new Set(beforeList.filter((e) => e?.image === img).map((e) => e?.illustrative));
  if (known.size ? !known.has(p.illustrative) : p.illustrative !== true) {
    out.push(
      known.size
        ? `${at}: illustrative must be ${[...known].join(" or ")}, as on the cards already using ${img}`
        : `${at}: illustrative must be true for a picture no card has used yet (a person decides when it is our own room)`,
    );
  }
  return out;
}

/** A callback for checkDiff: true when `/images/...` is a regular file whose real path stays inside public/images. */
export function imageFileCheck(repoRoot) {
  let root;
  try {
    root = realpathSync(join(repoRoot, "public", "images"));
  } catch {
    return () => false;
  }
  return (img) => {
    try {
      const real = realpathSync(join(repoRoot, "public", img));
      return real.startsWith(root + sep) && statSync(real).isFile();
    } catch {
      return false;
    }
  };
}

export function checkDiff(concern, before, after, { staffNames = [], isImageFile } = {}) {
  const spec = LISTS[concern];
  if (!spec) return [`unknown concern "${concern}"`];
  if (!after || typeof after !== "object" || Array.isArray(after)) return ["the file must be a JSON object"];
  const was = before?.[spec.list];
  const now = after?.[spec.list];
  if (!Array.isArray(was) || !Array.isArray(now)) return [`${spec.list} must be a list before and after`];
  const errors = [];
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // The file's own fields: no new ones, and the note (shown on the home page) passes the text rules when it changes.
  for (const k of Object.keys(after)) {
    if (!spec.top.includes(k) && !same(before?.[k], after[k])) errors.push(`(file): unknown field ${k}`);
  }
  if ("updated_at" in after && !same(before?.updated_at, after.updated_at)) {
    if (typeof after.updated_at !== "string" || !UPDATED_AT.test(after.updated_at)) errors.push("(file): updated_at must be a UTC time like 2026-10-19T13:41:36Z");
  }
  if ("note" in after && !same(before?.note, after.note)) {
    if (typeof after.note !== "string") errors.push("(file): note must be text");
    else {
      if ([...after.note].length > NOTE_MAX) errors.push(`(file): note is ${[...after.note].length} characters, limit ${NOTE_MAX}`);
      errors.push(...textProblems("(file) note", [after.note], staffNames));
    }
  }

  const nowById = new Map(now.map((e) => [e?.[spec.id], e]));
  for (const [i, old] of was.entries()) {
    const id = old?.[spec.id];
    const cur = nowById.get(id);
    if (!cur) {
      errors.push(`${spec.list}: entry ${id} was removed (set its status instead; entries are never deleted)`);
      continue;
    }
    if (now[i]?.[spec.id] !== id) errors.push(`${spec.list}: entry ${id} moved (new entries go at the end)`);
    for (const k of new Set([...Object.keys(old), ...Object.keys(cur)])) {
      if (spec.mayChange.includes(k)) continue;
      if (!same(old[k], cur[k])) errors.push(`${spec.list}: ${id}.${k} was changed (only ${spec.mayChange.join(", ")} may change on an existing entry)`);
    }
    if (concern === "promotions" && !same(old.ends_label, cur.ends_label)) {
      if (typeof cur.ends_label !== "string") errors.push(`${id}: ends_label must be text`);
      else {
        if ([...cur.ends_label].length > LIMITS.ends_label) errors.push(`${id}: ends_label is ${[...cur.ends_label].length} characters, limit ${LIMITS.ends_label}`);
        errors.push(...textProblems(`${id} ends_label`, [cur.ends_label], staffNames));
      }
    }
  }
  const oldIds = new Set(was.map((e) => e?.[spec.id]));
  let seenNew = false;
  for (const e of now) {
    if (!oldIds.has(e?.[spec.id])) {
      seenNew = true;
      if (concern === "promotions") errors.push(...newCardProblems(e, staffNames), ...imageProblems(e, was, isImageFile));
    } else if (seenNew) errors.push(`${spec.list}: new entries must be appended at the end (${e?.[spec.id]} comes after a new one)`);
  }
  return errors;
}
