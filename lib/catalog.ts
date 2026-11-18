// Central public service & product catalogue for taitam-d.com.
// Source of truth: the Treatwell Connect menu captured 2026-08-18 (venue 287555),
// mirrored in the private repo solution-taitamd-shop-office
// (docs/reference/treatwell-catalog-2026-08-18.md). These prices are public on Treatwell.
//
// Rules baked in here:
// - `wasGbp` is the pre-discount price (struck through). `gbp` is what is charged now.
// - Never render a variant price as "from £X" (SITE philosophy: prices are fixed).
// - MEDICAL / aesthetic services — Legal ruled on 2026-08-18 (Q-LAW-046). The ruling
//   is binding and lives in the workspace repo; the short form:
//     Group 1  Anti-Wrinkle Injections (botulinum toxin)  = NEVER on the public site.
//              Prescription-only medicine — advertising it to the public is unlawful
//              (Human Medicines Regulations 2012 reg. 280). No price, no booking button,
//              and the word "Botox" must not appear anywhere on the site.
//     Group 2  Fillers · vitamin injections (IV/IM) · PRP  = consultation-only listing.
//              May be mentioned, but with NO price and NO instant-book WhatsApp button.
//     Group 3  HIFU · no-needle mesotherapy · microblading/SPMU · tattoo removal
//              = may carry price + time, but MUST show the mandatory wording (18+,
//              results vary, consultation first) and microblading / tattoo removal
//              book a consultation + patch test, not the treatment.
//   Clause E (registration / prescriber / local licence / insurance): the OWNER
//   confirmed on 2026-08-18 that the licence is held and displayed in the shop, and
//   ruled it need not be published on the site — the site says "verify in store".
//   So: group 3 renders WITH prices + the mandatory notice; group 2 renders as
//   consultation-only (no price, no book button); group 1 is never rendered.
// - Internal "NOT ON TREATWELL / NOT ON WIDGET" rows are excluded on purpose
//   (Bupa massages, internal body waxing, internal eyelash perming, free henna).

import { CATALOG_DATA } from "./services";

export type Price = { gbp: number; wasGbp?: number };

export type Variant = {
  /** The axis that distinguishes this option — a hair length or a person count.
   *  Omit for services whose only axis is duration (the duration then labels it). */
  option?: string;
  /** Treatment length in minutes. Drives the displayed duration and schema.org. */
  minutes: number;
  price: Price;
  /** The Treatwell service id this row maps to, once known. null until then. */
  treatwell_sku?: string | null;
};

export type Service = {
  name: string;
  variants: Variant[];
  /** One-line description, only for services whose name is not self-explanatory. */
  desc?: string;
  note?: string;
  featured?: boolean;
};

export type CatalogCategory = {
  slug: string;
  title: string;
  blurb: string;
  /** Header image path (public/). Literal so the orphan-asset check can see it. */
  image?: string;
  services: Service[];
};

export type Product = { name: string; gbp: number };

/** "45 min" · "1h" · "1h 30m" */
export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** The short label shown on a variant row: the option, or its duration. */
export function variantLabel(v: Variant): string {
  return v.option ? `${v.option} · ${durationLabel(v.minutes)}` : durationLabel(v.minutes);
}

/** The specific line dropped into the WhatsApp enquiry, e.g.
 *  "Deep Tissue Massage — 60 min, £69" or
 *  "Ladies - Keratin Treatment — Long hair, £119". */
export function serviceEnquiryLabel(service: string, v: Variant): string {
  const axis = v.option ? v.option : durationLabel(v.minutes);
  return `${service} — ${axis}, £${v.price.gbp}`;
}

// The priced menu itself lives in data/services.json (lib/services.ts checks it; fields in
// data/SERVICES.md). What stays below in code is everything with a legal ruling attached.
export const CATALOG: CatalogCategory[] = CATALOG_DATA;


// ---------------------------------------------------------------------------
// Group 3 per Q-LAW-046 — rendered WITH prices, under MEDICAL_NOTICE, and the button
// books a CONSULTATION, never the treatment. Owner confirmed clause E 2026-08-18.
// ---------------------------------------------------------------------------
export const MEDICAL_NOTICE =
  "For clients aged 18 and over. Results vary from person to person. Every treatment begins with a consultation to assess suitability; microblading and tattoo removal start with a consultation and patch test. Our practitioner licence is displayed in the shop and can be inspected on your visit.";

// Group 2 per Q-LAW-046 — consultation-only. NO price, NO instant-book. Fillers,
// injectable vitamins and PRP. Listed by name only; the single button asks for a
// consultation. Anti-Wrinkle Injections (group 1) are deliberately ABSENT — do not add.
export const CONSULTATION_ONLY: { title: string; blurb: string; items: string[] } = {
  title: "Advanced Aesthetics — by consultation",
  blurb:
    "These treatments are only offered after a one-to-one consultation with our practitioner. We do not publish prices for them; message us and we will arrange a consultation to discuss suitability, options and cost.",
  items: [
    "Lip enhancement",
    "Cheek and under-eye lifting",
    "Nose enhancement",
    "Smile-line lifting",
    "Chin and jawline strengthening",
    "Lumi eye lifting and wrinkle correction",
    "PRP — Vampire Facial",
    "PRP — hair growth (biotin)",
    "PRP — hand or neck collagen reboot",
    "Vitamin injections and IV drip (biotin, glutathione, vitamin B & C)",
  ],
};

export const CATALOG_MEDICAL: CatalogCategory[] = [
  {
    slug: "hifu",
    title: "HIFU & Skin Treatments",
    blurb: "Non-surgical skin tightening and rejuvenation. Consultation first.",
    services: [
      { name: "HIFU — Full Face", variants: [{ minutes: 45, price: { gbp: 299, wasGbp: 349 } }]},
      { name: "HIFU — Face & Neck", variants: [{ minutes: 60, price: { gbp: 399, wasGbp: 449 } }]},
      { name: "HIFU — Abdomen", variants: [{ minutes: 30, price: { gbp: 249, wasGbp: 299 } }]},
      { name: "HIFU — Inner or Outer Thighs", variants: [{ minutes: 30, price: { gbp: 249, wasGbp: 299 } }]},
      { name: "HIFU — Upper Arms", variants: [{ minutes: 25, price: { gbp: 199, wasGbp: 249 } }]},
      { name: "3D Digital Skin Analysis", variants: [{ minutes: 15, price: { gbp: 40, wasGbp: 75 } }]},
      { name: "No-Needle Mesotherapy — Skin Reboot", variants: [{ minutes: 90, price: { gbp: 120 } }]},
      { name: "No-Needle Mesotherapy — Skin Reboot Package (buy 4, get 1 free)", variants: [{ minutes: 90, price: { gbp: 480 } }]},
    ],
  },
  {
    slug: "spmu",
    title: "Semi-Permanent Make-up",
    blurb: "Microblading and cosmetic tattooing for brows, eyeliner and lips. Consultation and patch test first.",
    services: [
      { name: "Microblading — Eyebrow", variants: [{ minutes: 90, price: { gbp: 199, wasGbp: 250 } }]},
      { name: "Microblading — Eyeliner", variants: [{ minutes: 90, price: { gbp: 199, wasGbp: 250 } }]},
      { name: "Microblading — Lip Liner", variants: [{ minutes: 90, price: { gbp: 249, wasGbp: 300 } }]},
      { name: "Microblading — Full Lip Colour", variants: [{ minutes: 90, price: { gbp: 299, wasGbp: 400 } }]},
      { name: "Microblading — Eyebrow + Eyeliner", variants: [{ minutes: 90, price: { gbp: 369, wasGbp: 500 } }]},
      { name: "Microblading Top-Up (within 3 months)", variants: [{ minutes: 45, price: { gbp: 60 } }]},
      { name: "Semi-Permanent Make-up — Eyebrows", variants: [{ minutes: 90, price: { gbp: 199, wasGbp: 299 } }]},
      { name: "Semi-Permanent Make-up — Eyeliner", variants: [{ minutes: 90, price: { gbp: 199, wasGbp: 299 } }]},
      { name: "Semi-Permanent Make-up — Lip Colour", variants: [{ minutes: 90, price: { gbp: 199, wasGbp: 399 } }]},
    ],
  },
  {
    slug: "tattoo-removal",
    title: "Tattoo Removal",
    blurb: "Laser tattoo removal. Consultation and patch test before any session.",
    services: [
      { name: "Tattoo Removal", variants: [
        { option: "Small", minutes: 60, price: { gbp: 49 } },
        { option: "Medium", minutes: 60, price: { gbp: 99 } },
        { option: "Large", minutes: 60, price: { gbp: 199 } },
      ]},
    ],
  },
];

/** Retail products available in the shop. */
export const PRODUCTS: Product[] = [
  { name: "Aloe Vera Hand Cream", gbp: 4 },
  { name: "Organic Herbal Balm", gbp: 5 },
  { name: "Organic Tea", gbp: 5 },
];
