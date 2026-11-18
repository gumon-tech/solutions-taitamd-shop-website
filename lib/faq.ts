import data from "@/data/faq.json";
import { HOURS } from "./hours";
import { SITE } from "./site";
import { checkKeys, checkList, checkObject, checkText, checkUnique, failAt } from "./content-check";

// Every question-and-answer block on the site lives in data/faq.json (fields: data/FAQ.md): the
// shop's list (home page and massage page), one list per landing page, and the massage
// expectation answer. The FAQPage structured data is built from the same entries, so the text
// a visitor reads and the text Google reads cannot drift apart. A malformed file throws, which
// stops `next build`.
//
// An answer may contain these tokens, replaced here so a fact stated in many answers is
// edited once: {{hours}} (from data/hours.json), {{walk_minutes}} and {{address}} (lib/site.ts).
//
// An entry in `shop` or `pages` may carry `status`: "live" (the same as leaving it out) or
// "hidden". A hidden entry is still checked, keeps its id and its place, and is left out of the
// page and of the FAQPage structured data. It is how the shop system takes an answer down
// without deleting it (deleting goes through a person). The massage expectation answer has no
// status: it carries the standards notice and always shows.

const FILE = "faq.json";
const TOKENS: Record<string, string> = {
  hours: HOURS.words,
  walk_minutes: String(SITE.walkMinutes),
  address: SITE.address,
};

export type FaqItem = { id: string; q: string; a: string[] };

function expand(where: string, s: string) {
  return s.replace(/\{\{([a-z_]*)\}\}/g, (_, name: string) => {
    if (!(name in TOKENS)) failAt(FILE, where, `unknown token {{${name}}} (allowed: ${Object.keys(TOKENS).map((t) => `{{${t}}}`).join(", ")})`);
    return TOKENS[name];
  });
}

function entry(where: string, raw: unknown, seen: Set<string>, withStatus = false): FaqItem & { hidden: boolean } {
  const o = checkObject(FILE, where, raw);
  const id = checkText(FILE, `${where}.id`, o.id, 60);
  if (!/^[a-z0-9-]+$/.test(id)) failAt(FILE, `${where}.id`, "may contain only lowercase letters, digits and hyphens");
  checkUnique(FILE, `${where}`, seen, id);
  checkKeys(FILE, id, o, withStatus ? ["id", "q", "a", "status"] : ["id", "q", "a"]);
  if (o.status !== undefined && o.status !== "live" && o.status !== "hidden") failAt(FILE, `${id}.status`, 'must be "live" or "hidden" (or left out, which means live)');
  const q = checkText(FILE, `${id}.q`, o.q, 160);
  const paragraphs = typeof o.a === "string" ? [o.a] : checkList(FILE, `${id}.a`, o.a, 6, (p, i) => checkText(FILE, `${id}.a[${i}]`, p, 700));
  const a = paragraphs.map((p, i) => expand(`${id}.a${paragraphs.length > 1 ? `[${i}]` : ""}`, checkText(FILE, `${id}.a`, p, 700)));
  return { id, q, a, hidden: o.status === "hidden" };
}

/** The entries a visitor sees: every entry is checked, hidden ones are then left out. */
function list(where: string, raw: unknown): FaqItem[] {
  const seen = new Set<string>();
  const all = checkList(FILE, where, raw, 30, (e, i) => entry(`${where}[${i}]`, e, seen, true));
  const shown = all.filter((e) => !e.hidden).map(({ id, q, a }) => ({ id, q, a }));
  // A page whose every answer is hidden would show an empty panel and an empty FAQPage, which
  // Google reports as an error. Taking the last answer down is a person's edit.
  if (all.length && !shown.length) failAt(FILE, where, 'every entry is hidden; at least one must stay "live"');
  return shown;
}

function validate(raw: unknown) {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["shop", "massage_expectation", "pages"]);
  const shop = list("shop", root.shop);
  const { id, q, a } = entry("massage_expectation", root.massage_expectation, new Set());
  const massage: FaqItem = { id, q, a };
  // The first paragraph is the salon standards notice, which SITE holds verbatim (owner-approved
  // wording that must not be reworded), so the data may not drift from it.
  if (massage.a[0] !== SITE.standardsNotice) failAt(FILE, "massage_expectation.a[0]", "must be exactly the standards notice in lib/site.ts (SITE.standardsNotice)");
  const pagesRaw = checkObject(FILE, "pages", root.pages);
  const pages: Record<string, FaqItem[]> = {};
  for (const slug of Object.keys(pagesRaw)) {
    if (!/^[a-z0-9-]+$/.test(slug)) failAt(FILE, `pages.${slug}`, "page key must be lowercase letters, digits and hyphens");
    pages[slug] = list(`pages.${slug}`, pagesRaw[slug]);
  }
  return { shop, massage, pages };
}

const faq = validate(data);

/** The shop's answers: home page and massage page. */
export const SHOP_FAQ: FaqItem[] = faq.shop;

/** The massage expectation answer (services page). */
export const MASSAGE_EXPECTATION: FaqItem = faq.massage;

/** The list for one landing page, keyed by its route folder, e.g. "nails-kings-cross". */
export function pageFaq(slug: string): FaqItem[] {
  const items = faq.pages[slug];
  if (!items) failAt(FILE, `pages.${slug}`, "this page has no list in data/faq.json");
  return items;
}

/** schema.org FAQPage from the same entries the page renders. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a.join(" ") } })),
  };
}
