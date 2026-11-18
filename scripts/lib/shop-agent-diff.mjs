// What the shop's WhatsApp system may change in a data file through a shop-agent/<concern>-* pull request
// (see the "shop system" section of each data/<CONCERN>.md). `before` and `after` are the parsed JSON of main (HEAD^1)
// and of the merge result (HEAD). checkDiff is pure: what needs the disk is passed in by the caller — `isImageFile`
// (is this picture a real file under public/images?, built by imageFileCheck below), `added` (the picture files a photos
// pull request adds or deletes, read by the CLI), and the slot lists `copySlots` / `photoSlots` (main's scripts/lib/*-slots.json).
// Used by scripts/check-shop-agent-diff.mjs, which the auto-merge workflow runs, and by
// scripts/test-shop-agent-diff.mjs. Plain Node, no dependencies.
import { realpathSync, statSync } from "node:fs";
import { join, sep } from "node:path";

// The file each concern may change, and the top-level fields that file may have.
const TOP = {
  promotions: ["updated_at", "note", "promotions"],
  hours: ["days"],
  closures: ["closures"],
  notice: ["notice"],
  faq: ["shop", "massage_expectation", "pages"],
  services: ["categories", "service_categories"],
  copy: ["updated_at", "slots"],
  photos: ["updated_at", "slots"],
};
export const CONCERNS = Object.keys(TOP);

// Text-rule allowances per concern. `pound`: a price may be written (only where prices live: promotions and the
// service menu). `tokens`: the {{name}} placeholders the site's validator replaces in that file (any other brace is
// refused; undefined = not checked, as for promotions). `content`: the newer content files, where "therapist" is an
// ordinary word and < > are refused as the validators do. `medical`: the service menu, where no medical or aesthetic
// treatment may be added (those are ruled on in lib/catalog.ts, not data).
const TEXT = {
  promotions: { pound: true },
  closures: { pound: false, tokens: [], content: true },
  notice: { pound: false, tokens: [], content: true },
  faq: { pound: false, tokens: ["hours", "walk_minutes", "address"], content: true },
  services: { pound: true, tokens: [], content: true, medical: true },
  copy: { pound: false, tokens: ["walk_minutes", "hours"], content: true },
  photos: { pound: false, tokens: [], content: true },
};

const PROMO_FIELDS = ["code", "title", "eyebrow", "detail", "points", "offer", "message", "image", "illustrative", "starts", "ends", "ends_label", "status"];

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
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (v) => typeof v === "string" && DAY.test(v) && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;

/** `starts` and `ends` are real calendar days and the offer does not end before it starts. */
function dateProblems(at, p) {
  const out = [];
  for (const k of ["starts", "ends"]) if (!isDay(p?.[k])) out.push(`${at}: ${k} must be a date like 2026-11-19`);
  if (!out.length && p.starts > p.ends) out.push(`${at}: starts ${p.starts} is after ends ${p.ends}`);
  return out;
}
export const IMAGE = /^\/images\/[a-z0-9_/-]+\.(jpe?g|png|webp)$/;
const TOUR = "/images/tour/"; // photographs of our own premises
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
const ALLOWED_CHAR = /^(?:[\x20-\x7E]|\p{Script=Latin}|[£€’‘“”·•–—…°×])$/u;
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
const HEALTH_ALL = new RegExp(HEALTH.source, "gi");
// Treatments that are medical or aesthetic procedures (Q-LAW-046): never added through the service menu file.
const MEDICAL =
  /\b(botox|botulinum|anti-?wrinkle|inject\w*|filler\w*|hifu|micro-?needl\w*|tattoo removal|laser|prp|mesotherap\w*|skin ?boosters?|spmu|micropigment\w*|semi-?permanent|permanent make-?up|dermal|chemical peel\w*|lipo\w*|fat dissolv\w*|iv drip\w*|vitamin injections?)\b/i;
// The shop's own name is not a claim.
const SHOP_NAMES = [/Taitam-D Massage & Beauty/gi, /Taitam-D/gi];
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Problems in a list of public strings (one card, the note, a changed ends_label). `at` names where they are.
 * Everything is checked on the NFKC form, so fullwidth or styled letters (ｗｗｗ, 𝐡𝐞𝐚𝐥) cannot slip past a pattern.
 */
export function textProblems(at, strings, staffNames = [], opts = TEXT.promotions) {
  const out = [];
  const raw = strings.filter((x) => typeof x === "string");
  if (raw.some((s) => FORMAT_CHAR.test(s))) out.push(`${at}: an invisible formatting character (zero-width or direction mark)`);
  if (raw.some((s) => CONTROL_CHAR.test(opts.newline ? s.replace(/\n/g, "") : s))) out.push(`${at}: a control character (tab, line break, ...)`);
  let fields = raw.map((s) => s.normalize("NFKC"));
  if (Array.isArray(opts.tokens)) {
    const all = fields.join(" ");
    for (const m of all.matchAll(/\{\{([^{}]*)\}\}/g)) {
      if (!opts.tokens.includes(m[1])) out.push(`${at}: unknown token {{${m[1]}}} (allowed here: ${opts.tokens.map((t) => `{{${t}}}`).join(" ") || "none"})`);
    }
    // Checked below as the word "x", so a token neither counts as a long word nor hides a pattern.
    fields = fields.map((s) => s.replace(/\{\{[a-z_]*\}\}/g, "x"));
    if (fields.some((s) => /[{}]/.test(s))) out.push(`${at}: a stray { or } (only the tokens above are allowed)`);
  }
  const text = fields.join(" \n ").replace(/\s+/g, " ");
  if (opts.content && /[<>]/.test(text)) out.push(`${at}: < or > (the site never renders HTML from data)`);
  if (!opts.pound && /[£€$]/.test(text)) out.push(`${at}: a price or currency sign (prices live in data/services.json)`);
  if (opts.medical && MEDICAL.test(text)) out.push(`${at}: a medical or aesthetic treatment "${MEDICAL.exec(text)[0]}" (those stay in lib/catalog.ts)`);
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
  const claim = [...scrubbed.matchAll(HEALTH_ALL)].map((m) => m[0]).find((w) => !(opts.content && /^therapists?$/i.test(w)));
  if (claim) out.push(`${at}: health-result wording "${claim}" (no health claims in public text)`);
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
  const extra = Object.keys(p ?? {}).filter((k) => !PROMO_FIELDS.includes(k));
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
  // Pictures under /images/tour/ are photographs of the shop itself, so either value is honest there (Lead, 2026-11-19).
  // Anywhere else: as on the cards on main using the same picture, or true for one no card has used yet.
  if (img.startsWith(TOUR)) {
    if (typeof p.illustrative !== "boolean") out.push(`${at}: illustrative must be true or false`);
    return out;
  }
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

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const len = (v) => [...v].length;
const isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);

/** One public string: text, at most `max` characters, and the concern's text rules. */
function textField(at, v, max, ctx, extra = {}) {
  if (typeof v !== "string" || !v.trim()) return [`${at}: must be non-empty text`];
  const out = [];
  if (len(v) > max) out.push(`${at}: is ${len(v)} characters, limit ${max}`);
  out.push(...textProblems(at, [v], ctx.staffNames, { ...ctx.text, ...extra }));
  return out;
}

/**
 * A list of entries keyed by `id`: entries on main stay, in their place; only `mayChange` fields change on them
 * (`changed` checks those); new entries go at the end (`added` checks each).
 */
function listDiff(name, was, now, { id, mayChange, removedHint, changed = () => [], added = () => [] }) {
  if (!Array.isArray(was) || !Array.isArray(now)) return [`${name} must be a list before and after`];
  const errors = [];
  const nowById = new Map(now.map((e) => [e?.[id], e]));
  for (const [i, old] of was.entries()) {
    const key = old?.[id];
    const cur = nowById.get(key);
    if (!cur) {
      errors.push(`${name}: entry ${key} was removed (${removedHint})`);
      continue;
    }
    if (now[i]?.[id] !== key) errors.push(`${name}: entry ${key} moved (new entries go at the end)`);
    for (const k of new Set([...Object.keys(old), ...Object.keys(cur)])) {
      if (mayChange.includes(k)) continue;
      if (!same(old[k], cur[k])) errors.push(`${name}: ${key}.${k} was changed (only ${mayChange.join(", ")} may change on an existing entry)`);
    }
    errors.push(...changed(old, cur, key));
  }
  const oldIds = new Set(was.map((e) => e?.[id]));
  const newIds = new Set();
  let seenNew = false;
  for (const e of now) {
    if (!oldIds.has(e?.[id])) {
      seenNew = true;
      if (newIds.has(e?.[id])) errors.push(`${name}: ${e?.[id]} is used twice`);
      newIds.add(e?.[id]);
      errors.push(...added(e));
    } else if (seenNew) errors.push(`${name}: new entries must be appended at the end (${e?.[id]} comes after a new one)`);
  }
  return errors;
}

function promotionsDiff(before, after, ctx) {
  const errors = [];
  if ("note" in after && !same(before?.note, after.note)) {
    if (typeof after.note !== "string") errors.push("(file): note must be text");
    else {
      if (len(after.note) > NOTE_MAX) errors.push(`(file): note is ${len(after.note)} characters, limit ${NOTE_MAX}`);
      errors.push(...textProblems("(file) note", [after.note], ctx.staffNames));
    }
  }
  const was = before?.promotions;
  errors.push(
    ...listDiff("promotions", was, after.promotions, {
      id: "code",
      mayChange: ["status", "starts", "ends", "ends_label"],
      removedHint: "set its status instead; entries are never deleted",
      changed: (old, cur, id) => {
        const out = [];
        if (!same(old.starts, cur.starts) || !same(old.ends, cur.ends)) out.push(...dateProblems(id, cur));
        if (!same(old.ends_label, cur.ends_label)) {
          if (typeof cur.ends_label !== "string") out.push(`${id}: ends_label must be text`);
          else {
            if (len(cur.ends_label) > LIMITS.ends_label) out.push(`${id}: ends_label is ${len(cur.ends_label)} characters, limit ${LIMITS.ends_label}`);
            out.push(...textProblems(`${id} ends_label`, [cur.ends_label], ctx.staffNames));
          }
        }
        return out;
      },
      added: (e) => [...newCardProblems(e, ctx.staffNames), ...dateProblems(e?.code ?? "(new card)", e), ...imageProblems(e, Array.isArray(was) ? was : [], ctx.isImageFile)],
    }),
  );
  return errors;
}

// Opening hours: the whole file may be replaced. lib/hours.ts holds every rule (seven days, Monday first, 24-hour
// times, closes after opens) and has no free text, so a bad file stops the build at rule 3.
function hoursDiff() {
  return [];
}

const CLOSURE_CODE = /^[A-Za-z0-9-]{2,40}$/;
function closureDates(at, c) {
  const out = [];
  for (const k of ["from", "to"]) if (!isDay(c?.[k])) out.push(`${at}: ${k} must be a date like 2026-12-25`);
  if (!out.length && c.from > c.to) out.push(`${at}: from ${c.from} is after to ${c.to}`);
  return out;
}
function closuresDiff(before, after, ctx) {
  return listDiff("closures", before?.closures, after.closures, {
    id: "code",
    mayChange: ["status", "from", "to", "label"],
    removedHint: "set its status to ended instead; entries are never deleted",
    changed: (old, cur, id) => {
      const out = [];
      if (!same(old.from, cur.from) || !same(old.to, cur.to)) out.push(...closureDates(id, cur));
      if (!same(old.label, cur.label)) out.push(...textField(`${id}.label`, cur.label, 80, ctx));
      if (cur.status !== "live" && cur.status !== "ended") out.push(`${id}: status must be live or ended`);
      return out;
    },
    added: (c) => {
      const at = typeof c?.code === "string" ? c.code : "(new closure)";
      const out = [];
      if (!isObj(c)) return [`${at}: must be an object`];
      if (typeof c.code !== "string" || !CLOSURE_CODE.test(c.code)) out.push(`${at}: code must be letters, digits and - (2 to 40), like C-XMAS26`);
      const extra = Object.keys(c).filter((k) => !["code", "from", "to", "label", "status"].includes(k));
      if (extra.length) out.push(`${at}: unknown fields ${extra.join(", ")}`);
      out.push(...closureDates(at, c), ...textField(`${at}.label`, c.label, 80, ctx));
      if (c.status !== "live" && c.status !== "ended") out.push(`${at}: status must be live or ended`);
      return out;
    },
  });
}

// A link in the notice stays on this site: a path such as /contact or /services#cat-massage, no query, no dots.
const INTERNAL_LINK = /^\/[a-z0-9\-/]*(#[a-z0-9-]+)?$/;
function noticeDiff(before, after, ctx) {
  const n = after.notice;
  if (same(before?.notice, n) || n === null) return [];
  if (!isObj(n)) return ["notice: must be null or an object"];
  const at = "notice";
  const out = [];
  const extra = Object.keys(n).filter((k) => !["code", "text", "starts", "ends", "link"].includes(k));
  if (extra.length) out.push(`${at}: unknown fields ${extra.join(", ")}`);
  if (typeof n.code !== "string" || !CLOSURE_CODE.test(n.code)) out.push(`${at}: code must be letters, digits and - (2 to 40), like N-XMAS26`);
  out.push(...textField(`${at}.text`, n.text, 200, ctx), ...dateProblems(at, n));
  if (n.link !== undefined && (typeof n.link !== "string" || !INTERNAL_LINK.test(n.link) || n.link.startsWith("//") || n.link.length > 80)) {
    out.push(`${at}: link must be a path on this site such as /contact (no domain, no query)`);
  }
  return out;
}

const FAQ_ID = /^[a-z0-9-]{1,60}$/;
// `status` on a shop or page answer: "live" (the same as no status) or "hidden" (kept in the file, left off the page).
const FAQ_STATUS = ["live", "hidden"];
function faqAnswer(at, a, ctx) {
  const paras = typeof a === "string" ? [a] : a;
  if (!Array.isArray(paras) || !paras.length || paras.length > 6) return [`${at}: must be text or a list of 1 to 6 paragraphs`];
  return paras.flatMap((p, i) => textField(paras.length > 1 ? `${at}[${i}]` : at, p, 700, ctx));
}
function faqStatus(at, e) {
  return !("status" in e) || FAQ_STATUS.includes(e.status) ? [] : [`${at}.status: must be live or hidden (or left out, which means live)`];
}
function faqList(name, was, now, ctx) {
  const out = listDiff(name, was, now, {
    id: "id",
    mayChange: ["q", "a", "status"],
    removedHint: "set its status to hidden instead; answers are never removed by the shop system",
    changed: (old, cur, id) => [
      ...(same(old.q, cur.q) ? [] : textField(`${name}.${id}.q`, cur.q, 160, ctx)),
      ...(same(old.a, cur.a) ? [] : faqAnswer(`${name}.${id}.a`, cur.a, ctx)),
      ...(same(old.status, cur.status) ? [] : faqStatus(`${name}.${id}`, cur)),
    ],
    added: (e) => {
      const at = `${name}.${typeof e?.id === "string" ? e.id : "(new answer)"}`;
      if (!isObj(e)) return [`${at}: must be an object`];
      const out = [];
      if (typeof e.id !== "string" || !FAQ_ID.test(e.id)) out.push(`${at}: id must be lowercase letters, digits and - (1 to 60)`);
      const extra = Object.keys(e).filter((k) => !["id", "q", "a", "status"].includes(k));
      if (extra.length) out.push(`${at}: unknown fields ${extra.join(", ")}`);
      out.push(...textField(`${at}.q`, e.q, 160, ctx), ...faqAnswer(`${at}.a`, e.a, ctx), ...faqStatus(at, e));
      return out;
    },
  });
  // lib/faq.ts refuses a list with every answer hidden (an empty panel and an empty FAQPage): taking the last one down is a person's edit.
  if (Array.isArray(now) && now.length && now.every((e) => e?.status === "hidden")) out.push(`${name}: every answer is hidden; at least one must stay live`);
  return out;
}
function faqDiff(before, after, ctx) {
  const out = [];
  // The massage expectation answer opens with the salon standards notice (owner-approved, legal weight): a person edits it.
  if (!same(before?.massage_expectation, after.massage_expectation)) out.push("massage_expectation: may not be changed by the shop system");
  out.push(...faqList("shop", before?.shop, after.shop, ctx));
  const was = isObj(before?.pages) ? before.pages : {};
  const now = isObj(after.pages) ? after.pages : {};
  if (!isObj(after.pages)) out.push("pages: must be an object");
  for (const k of new Set([...Object.keys(was), ...Object.keys(now)])) {
    if (!(k in now)) out.push(`pages.${k}: was removed (a page's list stays; the page itself is code)`);
    else if (!(k in was)) out.push(`pages.${k}: is a new page key (pages are code; only their lists change)`);
    else out.push(...faqList(`pages.${k}`, was[k], now[k], ctx));
  }
  return out;
}

const SERVICE_FIELDS = ["name", "desc", "note", "featured", "variants"];
const VARIANT_FIELDS = ["option", "minutes", "price", "treatwell_sku"];
function servicesDiff(before, after, ctx) {
  const out = [];
  if (!same(before?.service_categories, after.service_categories)) out.push("service_categories: may not be changed by the shop system (the home page cards are a person's edit)");
  const was = before?.categories;
  const now = after.categories;
  if (!Array.isArray(was) || !Array.isArray(now)) return [...out, "categories must be a list before and after"];
  if (was.length !== now.length) out.push("categories: no category is added or removed by the shop system");
  for (const [ci, oldCat] of was.entries()) {
    const cat = now[ci];
    if (!isObj(cat)) continue;
    const at = `categories.${oldCat?.slug}`;
    for (const k of new Set([...Object.keys(oldCat ?? {}), ...Object.keys(cat)])) {
      if (k !== "services" && !same(oldCat?.[k], cat[k])) out.push(`${at}.${k} was changed (only the services of a category change)`);
    }
    const oldList = Array.isArray(oldCat?.services) ? oldCat.services : [];
    if (!Array.isArray(cat.services)) {
      out.push(`${at}.services must be a list`);
      continue;
    }
    const byName = new Map(oldList.map((x) => [x?.name, x]));
    const names = new Set(cat.services.map((x) => x?.name));
    for (const [si, svc] of cat.services.entries()) {
      // The service this one was: the same name, or (a rename) the one in the same place whose name is gone.
      const atIndex = oldList[si] && !names.has(oldList[si].name) ? oldList[si] : undefined;
      const match = byName.get(svc?.name) ?? atIndex;
      const where = `${at}.${typeof svc?.name === "string" ? svc.name : `services[${si}]`}`;
      if (!isObj(svc)) {
        out.push(`${where}: must be an object`);
        continue;
      }
      const extra = Object.keys(svc).filter((k) => !SERVICE_FIELDS.includes(k));
      if (extra.length) out.push(`${where}: unknown fields ${extra.join(", ")}`);
      if (!same(svc.name, match?.name)) out.push(...textField(`${where}.name`, svc.name, 100, ctx));
      if (svc.desc !== undefined && !same(svc.desc, match?.desc)) out.push(...textField(`${where}.desc`, svc.desc, 200, ctx));
      if (!same(svc.note, match?.note)) out.push(`${where}.note: may not be added or changed by the shop system (notes carry booking conditions)`);
      if (svc.featured !== undefined && !(match && match.name === svc.name && match.featured === svc.featured)) {
        out.push(`${where}.featured: may not be added by the shop system`);
      }
      if (!Array.isArray(svc.variants)) {
        out.push(`${where}.variants must be a list`);
        continue;
      }
      for (const [vi, v] of svc.variants.entries()) {
        const vat = `${where}.variants[${vi}]`;
        if (!isObj(v)) {
          out.push(`${vat}: must be an object`);
          continue;
        }
        const vextra = Object.keys(v).filter((k) => !VARIANT_FIELDS.includes(k));
        if (vextra.length) out.push(`${vat}: unknown fields ${vextra.join(", ")}`);
        const oldOptions = Array.isArray(match?.variants) ? match.variants.map((x) => x?.option) : [];
        if (v.option !== undefined && !oldOptions.includes(v.option)) out.push(...textField(`${vat}.option`, v.option, 60, ctx));
      }
    }
  }
  return out;
}

function slotKeys(name, was, now, declared) {
  const out = [];
  const keys = declared ? Object.keys(declared) : Object.keys(was ?? {});
  for (const k of keys) if (!(k in now)) out.push(`${name}.${k}: slot is missing (slots are declared by the site)`);
  for (const k of Object.keys(now)) if (!keys.includes(k)) out.push(`${name}.${k}: is not a declared slot (values may change; keys may not)`);
  return out;
}

function copyDiff(before, after, ctx) {
  const was = isObj(before?.slots) ? before.slots : {};
  const now = after.slots;
  if (!isObj(now)) return ["slots: must be an object of slot keys to text"];
  const out = slotKeys("slots", was, now, ctx.copySlots);
  for (const [k, v] of Object.entries(now)) {
    if (same(was[k], v)) continue;
    const spec = ctx.copySlots?.[k] ?? { kind: "line", max: 300 };
    out.push(...textField(`slots.${k}`, v, spec.max, ctx, { newline: spec.kind === "paragraph" }));
  }
  return out;
}

// A picture a photos pull request adds: public/images/sp-<slug>.jpg or .webp, a regular file of at most 600 KB whose
// first bytes say it is that kind of picture, and named by a slot.
export const ADDED_PHOTO = /^public\/images\/sp-[a-z0-9]+(-[a-z0-9]+)*\.(jpg|webp)$/;
export const PHOTO_MAX_BYTES = 600 * 1024;
function pictureKind(head) {
  const b = head ?? new Uint8Array();
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  const ascii = (from, to) => String.fromCharCode(...b.slice(from, to));
  if (b.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  return null;
}
function photosDiff(before, after, ctx) {
  const was = isObj(before?.slots) ? before.slots : {};
  const now = after.slots;
  if (!isObj(now)) return ["slots: must be an object of slot keys to { src, alt }"];
  const out = slotKeys("slots", was, now, ctx.photoSlots);
  const added = ctx.added ?? [];
  const addedSrc = new Set(added.map((f) => `/${String(f.path).replace(/^public\//, "")}`));
  for (const [k, v] of Object.entries(now)) {
    if (same(was[k], v)) continue;
    const at = `slots.${k}`;
    if (!isObj(v)) {
      out.push(`${at}: must be { src, alt }`);
      continue;
    }
    const extra = Object.keys(v).filter((x) => !["src", "alt"].includes(x));
    if (extra.length) out.push(`${at}: unknown fields ${extra.join(", ")}`);
    if (!same(v.src, was[k]?.src)) {
      if (typeof v.src !== "string" || !IMAGE.test(v.src) || v.src.includes("..") || v.src.includes("//")) {
        out.push(`${at}.src: must be a path like /images/folder/name.jpg (lower case, .jpg .png or .webp)`);
      } else if (!addedSrc.has(v.src) && !(typeof ctx.isImageFile === "function" && ctx.isImageFile(v.src))) {
        out.push(`${at}.src: ${v.src} is not a file under public/images and is not added by this pull request`);
      }
    }
    if (!same(v.alt, was[k]?.alt)) out.push(...textField(`${at}.alt`, v.alt, ctx.photoSlots?.[k]?.alt_max ?? 160, ctx));
  }
  const used = new Set(Object.values(now).map((v) => v?.src));
  for (const f of added) {
    const at = `added file ${f.path}`;
    if (typeof f.path !== "string" || !ADDED_PHOTO.test(f.path) || f.path.length > 100) {
      out.push(`${at}: only public/images/sp-<name>.jpg or .webp may be added (lower case letters, digits, -)`);
      continue;
    }
    if (!f.regular) out.push(`${at}: must be a regular file (not a link)`);
    if (!(f.size > 0 && f.size <= PHOTO_MAX_BYTES)) out.push(`${at}: is ${Math.round((f.size ?? 0) / 1024)} KB; the limit is ${PHOTO_MAX_BYTES / 1024} KB`);
    const ext = f.path.endsWith(".webp") ? "webp" : "jpg";
    if (pictureKind(f.head) !== ext) out.push(`${at}: is not a ${ext === "jpg" ? "JPEG" : "WebP"} picture`);
    if (!used.has(`/${f.path.replace(/^public\//, "")}`)) out.push(`${at}: no slot in data/photos.json uses it`);
  }
  // Deleting is for the shop system's own earlier uploads only, once no slot points at them any more.
  for (const path of ctx.deleted ?? []) {
    const at = `deleted file ${path}`;
    if (typeof path !== "string" || !ADDED_PHOTO.test(path)) out.push(`${at}: only earlier public/images/sp-<name>.jpg or .webp uploads may be deleted`);
    else if (used.has(`/${path.replace(/^public\//, "")}`)) out.push(`${at}: a slot in data/photos.json still uses it`);
  }
  return out;
}

const DIFFS = {
  promotions: promotionsDiff,
  hours: hoursDiff,
  closures: closuresDiff,
  notice: noticeDiff,
  faq: faqDiff,
  services: servicesDiff,
  copy: copyDiff,
  photos: photosDiff,
};

/**
 * Everything the shop system changed in data/<concern>.json that it may not change. Options: `staffNames` (display
 * names from data/team.json), `isImageFile`, `added` (photos only: [{ path, size, regular, head }]), `deleted`
 * (photos only: paths), `copySlots`, `photoSlots`.
 */
export function checkDiff(concern, before, after, { staffNames = [], isImageFile, added = [], deleted = [], copySlots, photoSlots } = {}) {
  if (!TOP[concern]) return [`unknown concern "${concern}"`];
  if (!isObj(after)) return ["the file must be a JSON object"];
  const errors = [];
  if ((added.length || deleted.length) && concern !== "photos") errors.push("only a photos pull request may add or delete files");
  // The file's own fields: no new ones; updated_at, where the file has it, is a UTC time.
  for (const k of Object.keys(after)) {
    if (!TOP[concern].includes(k) && !same(before?.[k], after[k])) errors.push(`(file): unknown field ${k}`);
  }
  if (TOP[concern].includes("updated_at") && "updated_at" in after && !same(before?.updated_at, after.updated_at)) {
    if (typeof after.updated_at !== "string" || !UPDATED_AT.test(after.updated_at)) errors.push("(file): updated_at must be a UTC time like 2026-10-19T13:41:36Z");
  }
  const ctx = { staffNames, isImageFile, added, deleted, copySlots, photoSlots, text: TEXT[concern] };
  errors.push(...DIFFS[concern](before, after, ctx));
  return errors;
}
