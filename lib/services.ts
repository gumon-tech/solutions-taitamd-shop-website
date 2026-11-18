import data from "@/data/services.json";
import type { CatalogCategory, Service, Variant } from "./catalog";
import {
  checkImagePath, checkKeys, checkList, checkObject, checkOptionalText, checkText, checkUnique, failAt, registerImage,
} from "./content-check";

// The service menu — categories, treatments, durations and prices — lives in data/services.json
// (fields: data/SERVICES.md). lib/catalog.ts reads it and keeps what must stay in code: the
// medical notice and consultation-only listing, the group 3 medical catalogue, the retail
// products and the Signature price (the legal wording and rulings around them are in that
// file). A malformed file throws, which stops `next build`. Pictures named here are checked
// against public/ on the server (lib/content-assets.ts); this file stays free of node:fs
// because lib/site.ts, which Gallery and ServicesGrid (client components) import, reads it.

const FILE = "services.json";
const SLUG = /^[a-z0-9-]+$/;

function money(where: string, v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 5000) failAt(FILE, where, "must be a price in pounds between 0 and 5000");
  return v;
}

function variant(where: string, raw: unknown): Variant {
  const o = checkObject(FILE, where, raw);
  checkKeys(FILE, where, o, ["option", "minutes", "price", "treatwell_sku"]);
  const option = checkOptionalText(FILE, `${where}.option`, o.option, 60);
  if (typeof o.minutes !== "number" || !Number.isInteger(o.minutes) || o.minutes < 1 || o.minutes > 600) failAt(FILE, `${where}.minutes`, "must be a whole number of minutes (1 to 600)");
  const p = checkObject(FILE, `${where}.price`, o.price);
  checkKeys(FILE, `${where}.price`, p, ["gbp", "wasGbp"]);
  const gbp = money(`${where}.price.gbp`, p.gbp);
  const wasGbp = p.wasGbp === undefined ? undefined : money(`${where}.price.wasGbp`, p.wasGbp);
  if (wasGbp !== undefined && wasGbp < gbp) failAt(FILE, `${where}.price`, "`wasGbp` (the struck-through price) must not be below `gbp`");
  let sku: string | null = null;
  if (o.treatwell_sku !== null && o.treatwell_sku !== undefined) {
    if (typeof o.treatwell_sku !== "string" || !/^[A-Za-z0-9_-]{1,40}$/.test(o.treatwell_sku)) failAt(FILE, `${where}.treatwell_sku`, "must be null or a Treatwell id (letters, digits, - and _)");
    sku = o.treatwell_sku;
  }
  return { ...(option ? { option } : {}), minutes: o.minutes, price: { gbp, ...(wasGbp !== undefined ? { wasGbp } : {}) }, treatwell_sku: sku };
}

function service(where: string, raw: unknown): Service {
  const o = checkObject(FILE, where, raw);
  checkKeys(FILE, where, o, ["name", "desc", "note", "featured", "variants"]);
  const name = checkText(FILE, `${where}.name`, o.name, 100);
  const desc = checkOptionalText(FILE, `${name}.desc`, o.desc, 200);
  const note = checkOptionalText(FILE, `${name}.note`, o.note, 200);
  if (o.featured !== undefined && o.featured !== true) failAt(FILE, `${name}.featured`, "must be true, or left out");
  const variants = checkList(FILE, `${name}.variants`, o.variants, 20, (v, i) => variant(`${name}.variants[${i}]`, v));
  if (!variants.length) failAt(FILE, name, "needs at least one variant");
  return { name, ...(desc ? { desc } : {}), ...(note ? { note } : {}), ...(o.featured ? { featured: true } : {}), variants };
}

function category(where: string, raw: unknown, slugs: Set<string>): CatalogCategory {
  const o = checkObject(FILE, where, raw);
  checkKeys(FILE, where, o, ["slug", "title", "blurb", "image", "services"]);
  const slug = checkText(FILE, `${where}.slug`, o.slug, 40);
  if (!SLUG.test(slug)) failAt(FILE, `${where}.slug`, "may contain only lowercase letters, digits and hyphens");
  checkUnique(FILE, where, slugs, slug);
  const title = checkText(FILE, `${slug}.title`, o.title, 60);
  const blurb = checkText(FILE, `${slug}.blurb`, o.blurb, 240);
  let image: string | undefined;
  if (o.image !== undefined) {
    image = checkImagePath(FILE, `${slug}.image`, o.image);
    registerImage(FILE, `${slug}.image`, image);
  }
  const names = new Set<string>();
  const services = checkList(FILE, `${slug}.services`, o.services, 80, (s, i) => {
    const svc = service(`${slug}.services[${i}]`, s);
    checkUnique(FILE, `${slug}.services[${i}]`, names, svc.name);
    return svc;
  });
  return { slug, title, blurb, ...(image ? { image } : {}), services };
}

export type ServiceCategory = { slug: string; title: string; subtitle: string; highlights: string[] };

function summary(where: string, raw: unknown, slugs: Set<string>): ServiceCategory {
  const o = checkObject(FILE, where, raw);
  checkKeys(FILE, where, o, ["slug", "title", "subtitle", "highlights"]);
  const slug = checkText(FILE, `${where}.slug`, o.slug, 40);
  checkUnique(FILE, where, slugs, slug);
  const title = checkText(FILE, `${slug}.title`, o.title, 60);
  const subtitle = checkText(FILE, `${slug}.subtitle`, o.subtitle, 100);
  const highlights = checkList(FILE, `${slug}.highlights`, o.highlights, 8, (h, i) => checkText(FILE, `${slug}.highlights[${i}]`, h, 100));
  return { slug, title, subtitle, highlights };
}

function validate(raw: unknown) {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["categories", "service_categories"]);
  const slugs = new Set<string>();
  const categories = checkList(FILE, "categories", root.categories, 30, (c, i) => category(`categories[${i}]`, c, slugs));
  const cslugs = new Set<string>();
  const service_categories = checkList(FILE, "service_categories", root.service_categories, 20, (c, i) => summary(`service_categories[${i}]`, c, cslugs));
  return { categories, service_categories };
}

const services = validate(data);

/** The priced menu shown on /services and the landing pages. */
export const CATALOG_DATA: CatalogCategory[] = services.categories;

/** The category cards on the home page (the first six) and the Services grid. */
export const SERVICE_CATEGORIES: ServiceCategory[] = services.service_categories;
