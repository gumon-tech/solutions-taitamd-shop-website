// What the shop's WhatsApp system may change in a data file through a shop-agent/<concern>-* pull request
// (see data/PROMOTIONS.md, "Changes from the shop system"). Pure functions: `before` and `after` are the parsed JSON
// of main (HEAD^1) and of the merge result (HEAD). Used by scripts/check-shop-agent-diff.mjs, which the auto-merge
// workflow runs. Plain Node, no dependencies.

const LISTS = {
  promotions: { list: "promotions", id: "code", mayChange: ["status", "ends", "ends_label"] },
};
export const CONCERNS = Object.keys(LISTS);

// The rules every new card's text must pass. They match the checks the shop system runs before it opens a pull
// request, so a card it accepted is not refused here; the site holds its own copy so the rule does not depend on
// the other side alone.
const LIMITS = { title: 80, eyebrow: 60, detail: 400, offer: 160, message: 200, ends_label: 40 };
const POINTS_MAX = 4;
const POINT_LEN = 60;
const CODE = /^P-[A-Z0-9]{2,20}$/;
const LINK = /https?:\/\/|www\./i;
const THAI = /[฀-๿]/;
const EMOJI = /\p{Extended_Pictographic}/u;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE = /(?<![\w])\+?\d[\d\s().-]{7,}\d/g;
const NI_NUMBER = /\b[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/i;
const STAFF_ID = /\btw[-_ ]?\d+\b/i;
const WEB_TAG = /\[web-/i;
// Health and medical claims (the UK ASA / CAP list for massage). The site makes none in an offer.
const HEALTH =
  /\b(detox\w*|toxins?|circulation|pain\w*|ache\w*|headache\w*|stress\w*|swell\w*|immun\w*|inflammation|cure\w*|heal\w*|relie\w*|tension|sleep\w*|therap\w*|recover\w*|muscle\w*|well-?being|anxiety|depression|insomnia|arthritis|sciatica|migraines?|fatigue|injur\w*|rehab\w*|alleviat\w*|remed\w*|rheumat\w*|fibromyalgia|eczema|asthma|diabet\w*|cancer|covid|stiff\w*|sore\w*|cramp\w*|spasm\w*|chronic|symptom\w*|diagnos\w*|illness|disease|medical|clinical|physio\w*|chiropract\w*|osteo\w*|blood pressure|joints|posture|knot\w*|back problem\w*|lymph\w*|drainage|weight|slim\w*|digest\w*|energ\w*|hormon\w*|breath\w*|nerve\w*|tight\w*)\b/i;
// The shop's own name is not a claim.
const SHOP_NAMES = [/Taitam-D Massage & Beauty/gi, /Taitam-D/gi];
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Problems in the text of one new card. `staffNames`: display names from data/team.json (never on an offer). */
export function newCardProblems(p, staffNames = []) {
  const out = [];
  const at = p?.code ?? "(new card)";
  if (typeof p?.code !== "string" || !CODE.test(p.code)) out.push(`${at}: code must look like P-AB12`);
  for (const [k, max] of Object.entries(LIMITS)) {
    if (typeof p?.[k] === "string" && p[k].length > max) out.push(`${at}: ${k} is ${p[k].length} characters, limit ${max}`);
  }
  const points = Array.isArray(p?.points) ? p.points : [];
  if (points.length > POINTS_MAX || points.some((x) => String(x).length > POINT_LEN)) out.push(`${at}: at most ${POINTS_MAX} points of ${POINT_LEN} characters`);
  const text = [p?.title, p?.eyebrow, p?.detail, p?.offer, p?.message, ...points].filter((x) => typeof x === "string").join(" \n ");
  if (LINK.test(text)) out.push(`${at}: a link (the only link on a card is the shop's own WhatsApp button)`);
  if (THAI.test(text)) out.push(`${at}: Thai script (the public text is English)`);
  if (EMOJI.test(text)) out.push(`${at}: an emoji`);
  if (EMAIL.test(text)) out.push(`${at}: an email address`);
  for (const m of text.matchAll(PHONE)) {
    const groups = m[0].match(/\d+/g) ?? [];
    const digits = groups.join("").length;
    if (digits >= 9 && !groups.every((g) => g.length === 4 && /^(19|20)/.test(g))) {
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
    if (typeof name === "string" && name.trim().length >= 2 && new RegExp(`(?<!\\w)${escape(name.trim())}(?!\\w)`).test(text)) {
      out.push(`${at}: a team member's name (offers never name staff)`);
      break;
    }
  }
  return out;
}

export function checkDiff(concern, before, after, { staffNames = [] } = {}) {
  const spec = LISTS[concern];
  if (!spec) return [`unknown concern "${concern}"`];
  const was = before?.[spec.list];
  const now = after?.[spec.list];
  if (!Array.isArray(was) || !Array.isArray(now)) return [`${spec.list} must be a list before and after`];
  const errors = [];
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
      if (JSON.stringify(old[k]) !== JSON.stringify(cur[k])) errors.push(`${spec.list}: ${id}.${k} was changed (only ${spec.mayChange.join(", ")} may change on an existing entry)`);
    }
  }
  const oldIds = new Set(was.map((e) => e?.[spec.id]));
  let seenNew = false;
  for (const e of now) {
    if (!oldIds.has(e?.[spec.id])) {
      seenNew = true;
      if (concern === "promotions") errors.push(...newCardProblems(e, staffNames));
    } else if (seenNew) errors.push(`${spec.list}: new entries must be appended at the end (${e?.[spec.id]} comes after a new one)`);
  }
  return errors;
}
