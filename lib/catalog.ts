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

export type Price = { gbp: number; wasGbp?: number };

export type Variant = {
  /** The axis that distinguishes this option — a hair length or a person count.
   *  Omit for services whose only axis is duration (the duration then labels it). */
  option?: string;
  /** Treatment length in minutes. Drives the displayed duration and schema.org. */
  minutes: number;
  price: Price;
};

export type Service = {
  name: string;
  variants: Variant[];
  note?: string;
  featured?: boolean;
};

export type CatalogCategory = {
  slug: string;
  title: string;
  blurb: string;
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

export const CATALOG: CatalogCategory[] = [
  {
    slug: "massage",
    title: "Massage",
    blurb: "Thai, deep tissue, Swedish, aromatherapy, hot stone and targeted therapeutic work.",
    services: [
      { name: "Deep Tissue Massage", variants: [
        { minutes: 30, price: { gbp: 39, wasGbp: 45 } },
        { minutes: 60, price: { gbp: 69, wasGbp: 79 } },
        { minutes: 90, price: { gbp: 99, wasGbp: 109 } },
        { minutes: 120, price: { gbp: 129, wasGbp: 139 } },
      ]},
      { name: "Aromatherapy Massage", variants: [
        { minutes: 30, price: { gbp: 39, wasGbp: 45 } },
        { minutes: 60, price: { gbp: 69, wasGbp: 79 } },
        { minutes: 90, price: { gbp: 99, wasGbp: 109 } },
        { minutes: 120, price: { gbp: 129, wasGbp: 139 } },
      ]},
      { name: "Hot Stone Massage", variants: [
        { minutes: 60, price: { gbp: 74, wasGbp: 89 } },
        { minutes: 90, price: { gbp: 109, wasGbp: 119 } },
        { minutes: 120, price: { gbp: 139, wasGbp: 149 } },
      ]},
      { name: "Swedish Massage", variants: [
        { minutes: 30, price: { gbp: 35 } },
        { minutes: 60, price: { gbp: 59, wasGbp: 64 } },
        { minutes: 90, price: { gbp: 89, wasGbp: 99 } },
        { minutes: 120, price: { gbp: 109, wasGbp: 119 } },
      ]},
      { name: "Thai Combination Massage", variants: [
        { minutes: 30, price: { gbp: 39, wasGbp: 45 } },
        { minutes: 60, price: { gbp: 69, wasGbp: 79 } },
        { minutes: 90, price: { gbp: 99, wasGbp: 109 } },
        { minutes: 120, price: { gbp: 129, wasGbp: 139 } },
      ]},
      { name: "Thai Foot Massage", variants: [
        { minutes: 30, price: { gbp: 35, wasGbp: 45 } },
        { minutes: 60, price: { gbp: 59, wasGbp: 75 } },
      ]},
      { name: "Pain Relief Massage", variants: [
        { minutes: 30, price: { gbp: 44, wasGbp: 55 } },
        { minutes: 60, price: { gbp: 79, wasGbp: 89 } },
      ]},
      { name: "Therapeutic Massage", variants: [
        { minutes: 30, price: { gbp: 44, wasGbp: 60 } },
        { minutes: 60, price: { gbp: 79, wasGbp: 99 } },
      ]},
      { name: "Sports Massage", variants: [
        { minutes: 30, price: { gbp: 44, wasGbp: 55 } },
        { minutes: 60, price: { gbp: 79, wasGbp: 89 } },
      ]},
      { name: "Back, Neck & Shoulder Massage", variants: [
        { minutes: 15, price: { gbp: 20, wasGbp: 25 } },
        { minutes: 30, price: { gbp: 39, wasGbp: 45 } },
        { minutes: 45, price: { gbp: 54, wasGbp: 59 } },
        { minutes: 60, price: { gbp: 64, wasGbp: 69 } },
      ]},
      { name: "Head Massage", variants: [
        { minutes: 30, price: { gbp: 35, wasGbp: 45 } },
        { minutes: 60, price: { gbp: 59, wasGbp: 69 } },
      ]},
      { name: "Foot Massage", variants: [
        { minutes: 30, price: { gbp: 35, wasGbp: 45 } },
        { minutes: 60, price: { gbp: 59, wasGbp: 69 } },
      ]},
      { name: "Foot Massage Express", variants: [
        { minutes: 20, price: { gbp: 20, wasGbp: 25 } },
      ]},
      { name: "Thai Remedy", variants: [
        { minutes: 60, price: { gbp: 74, wasGbp: 89 } },
        { minutes: 90, price: { gbp: 104, wasGbp: 119 } },
        { minutes: 120, price: { gbp: 129, wasGbp: 139 } },
      ]},
      { name: "Pregnancy Massage", variants: [
        { minutes: 30, price: { gbp: 44, wasGbp: 50 } },
        { minutes: 60, price: { gbp: 79, wasGbp: 89 } },
      ], note: "Please tell us how many weeks along you are when you book." },
    ],
  },

  {
    slug: "hair",
    title: "Hair",
    blurb: "Cut, colour, highlights, balayage, keratin and Japanese straightening — priced by hair length.",
    services: [
      { name: "Balayage & Ombré with Haircut & Blow Dry", variants: [
        { option: "Medium hair", minutes: 150, price: { gbp: 129 } },
        { option: "Long hair", minutes: 180, price: { gbp: 149 } },
      ]},
      { name: "Half Head Highlights with Blow Dry", variants: [
        { option: "Short hair", minutes: 80, price: { gbp: 69 } },
        { option: "Medium hair", minutes: 90, price: { gbp: 79 } },
        { option: "Long hair", minutes: 105, price: { gbp: 89 } },
      ]},
      { name: "Full Head Highlights with Blow Dry", variants: [
        { option: "Short hair", minutes: 105, price: { gbp: 89 } },
        { option: "Medium hair", minutes: 120, price: { gbp: 99 } },
        { option: "Long hair", minutes: 135, price: { gbp: 109 } },
      ]},
      { name: "T-Section Highlights with Blow Dry", variants: [
        { option: "Short hair", minutes: 80, price: { gbp: 69 } },
        { option: "Medium hair", minutes: 90, price: { gbp: 79 } },
        { option: "Long hair", minutes: 105, price: { gbp: 89 } },
      ]},
      { name: "Half Head Highlights with Haircut & Blow Dry", variants: [
        { option: "Short hair", minutes: 120, price: { gbp: 99 } },
        { option: "Medium hair", minutes: 135, price: { gbp: 114 } },
        { option: "Long hair", minutes: 150, price: { gbp: 129 } },
      ]},
      { name: "Full Head Colour with Haircut & Blow Dry", variants: [
        { option: "Short hair", minutes: 90, price: { gbp: 69 } },
        { option: "Medium hair", minutes: 105, price: { gbp: 79 } },
        { option: "Long hair", minutes: 135, price: { gbp: 99 } },
      ]},
      { name: "Full Head Colour with Blow Dry", variants: [
        { option: "Short hair", minutes: 75, price: { gbp: 59 } },
        { option: "Medium hair", minutes: 90, price: { gbp: 69 } },
        { option: "Long hair", minutes: 120, price: { gbp: 89 } },
      ]},
      { name: "Creative Colour", variants: [
        { minutes: 90, price: { gbp: 79 } },
      ]},
      { name: "Wash, Haircut & Blow Dry", variants: [
        { option: "Short hair", minutes: 50, price: { gbp: 49 } },
        { option: "Medium hair", minutes: 70, price: { gbp: 59 } },
        { option: "Long hair", minutes: 90, price: { gbp: 69 } },
      ]},
      { name: "Keratin Treatment", variants: [
        { option: "Short hair", minutes: 90, price: { gbp: 79 } },
        { option: "Medium hair", minutes: 105, price: { gbp: 99 } },
        { option: "Long hair", minutes: 120, price: { gbp: 119 } },
      ]},
      { name: "Japanese Straightening", variants: [
        { option: "Short hair", minutes: 240, price: { gbp: 249 } },
        { option: "Medium hair", minutes: 300, price: { gbp: 299 } },
        { option: "Long hair", minutes: 330, price: { gbp: 349 } },
        { option: "Extra long / thick hair", minutes: 360, price: { gbp: 399 } },
      ]},
      { name: "Wash & Blow Dry", variants: [
        { option: "Short hair", minutes: 40, price: { gbp: 30 } },
        { option: "Medium hair", minutes: 45, price: { gbp: 35 } },
        { option: "Long hair", minutes: 50, price: { gbp: 40 } },
      ]},
      { name: "Blow Dry", variants: [
        { option: "Short hair", minutes: 30, price: { gbp: 20 } },
        { option: "Medium hair", minutes: 35, price: { gbp: 25 } },
        { option: "Long hair", minutes: 40, price: { gbp: 30 } },
      ]},
      { name: "Nano Hair Spa", variants: [
        { option: "Short hair", minutes: 60, price: { gbp: 79 } },
        { option: "Medium hair", minutes: 60, price: { gbp: 84 } },
        { option: "Long hair", minutes: 60, price: { gbp: 89 } },
      ]},
      { name: "Hair Spa — treatment, head massage & blow dry", variants: [
        { minutes: 60, price: { gbp: 99 } },
      ]},
      { name: "Hair Spa — treatment, head massage, blow dry & deep face massage", variants: [
        { minutes: 90, price: { gbp: 129 } },
      ]},
    ],
  },

  {
    slug: "nails",
    title: "Nails",
    blurb: "Classic and spa manicures & pedicures, gel, and acrylic or fibre-gel extensions.",
    services: [
      { name: "Classic Manicure (no colour)", variants: [{ minutes: 15, price: { gbp: 10 } }]},
      { name: "Classic Manicure (no colour, incl. gel removal)", variants: [{ minutes: 25, price: { gbp: 20 } }]},
      { name: "Classic Manicure with Polish", variants: [{ minutes: 25, price: { gbp: 20, wasGbp: 25 } }]},
      { name: "Classic Manicure with Gel (UV)", variants: [{ minutes: 30, price: { gbp: 30, wasGbp: 35 } }]},
      { name: "Spa Manicure (no colour)", variants: [{ minutes: 25, price: { gbp: 25, wasGbp: 28 } }]},
      { name: "Spa Manicure with Polish", variants: [{ minutes: 45, price: { gbp: 30, wasGbp: 35 } }]},
      { name: "Spa Manicure with Gel (UV)", variants: [{ minutes: 45, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Classic Pedicure (no colour)", variants: [{ minutes: 20, price: { gbp: 25, wasGbp: 28 } }]},
      { name: "Classic Pedicure with Polish", variants: [{ minutes: 30, price: { gbp: 30, wasGbp: 35 } }]},
      { name: "Classic Pedicure with Gel (UV)", variants: [{ minutes: 30, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Spa Pedicure (no colour)", variants: [{ minutes: 30, price: { gbp: 30, wasGbp: 35 } }]},
      { name: "Spa Pedicure with Polish", variants: [{ minutes: 50, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Spa Pedicure with Gel (UV)", variants: [{ minutes: 60, price: { gbp: 45, wasGbp: 50 } }], featured: true },
      { name: "Classic Manicure & Pedicure with Polish", variants: [{ minutes: 55, price: { gbp: 45 } }]},
      { name: "Classic Manicure & Pedicure with Gel (UV)", variants: [{ minutes: 60, price: { gbp: 65 } }]},
      { name: "Spa Manicure & Pedicure with Polish", variants: [{ minutes: 95, price: { gbp: 65 } }]},
      { name: "Spa Manicure & Pedicure with Gel (UV)", variants: [{ minutes: 105, price: { gbp: 80 } }]},
      { name: "Gel (Shellac) Removal", variants: [{ minutes: 15, price: { gbp: 10 } }]},
      { name: "Hand Treatment with Thermomist / Paraffin", variants: [{ minutes: 15, price: { gbp: 15 } }]},
      { name: "Hand Treatment with Hot Oil & Nail Refresh", variants: [{ minutes: 15, price: { gbp: 15 } }]},
      { name: "Foot Care", variants: [{ minutes: 60, price: { gbp: 60 } }]},
      { name: "Acrylic Full Set with Polish", variants: [{ minutes: 60, price: { gbp: 45, wasGbp: 50 } }]},
      { name: "Acrylic Full Set with UV Colour", variants: [{ minutes: 60, price: { gbp: 45, wasGbp: 50 } }]},
      { name: "Gel Fibre Powder Full Set with Polish", variants: [{ minutes: 60, price: { gbp: 45, wasGbp: 50 } }]},
      { name: "Gel Fibre Powder Full Set with UV Colour", variants: [{ minutes: 60, price: { gbp: 45, wasGbp: 50 } }]},
      { name: "Infill — Acrylic with Polish", variants: [{ minutes: 60, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Infill — Acrylic with UV Colour", variants: [{ minutes: 60, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Infill — Fibre Gel Powder with Polish", variants: [{ minutes: 60, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Infill — Fibre Gel Powder with UV Colour", variants: [{ minutes: 60, price: { gbp: 40, wasGbp: 45 } }]},
      { name: "Extension Removal", variants: [{ minutes: 15, price: { gbp: 20 } }]},
      { name: "Extension Removal & Express Manicure (no colour)", variants: [{ minutes: 35, price: { gbp: 25 } }]},
      { name: "Extension Removal & New Set (Polish)", variants: [{ minutes: 75, price: { gbp: 55, wasGbp: 60 } }]},
      { name: "Extension Removal & New Set (UV)", variants: [{ minutes: 75, price: { gbp: 60, wasGbp: 65 } }]},
    ],
  },

  {
    slug: "facials",
    title: "Facials",
    blurb: "Deep-cleansing, lifting and anti-ageing facials, including the Eberlin package range.",
    services: [
      { name: "Luxury Facial", variants: [{ minutes: 60, price: { gbp: 69, wasGbp: 79 } }]},
      { name: "Non-Surgical Face Lift Facial", variants: [{ minutes: 60, price: { gbp: 89, wasGbp: 99 } }]},
      { name: "Anti-Ageing Facial", variants: [{ minutes: 90, price: { gbp: 120, wasGbp: 129 } }]},
      { name: "Eberlin Facial — Equilibrium Package", variants: [{ minutes: 65, price: { gbp: 89, wasGbp: 99 } }]},
      { name: "Eberlin Facial — Infinity Package", variants: [{ minutes: 65, price: { gbp: 99, wasGbp: 119 } }]},
      { name: "Eberlin Facial — White Package", variants: [{ minutes: 65, price: { gbp: 99, wasGbp: 119 } }]},
      { name: "Eberlin Facial — Gold Package", variants: [{ minutes: 95, price: { gbp: 120, wasGbp: 139 } }]},
    ],
  },

  {
    slug: "body",
    title: "Body & Spa",
    blurb: "Detox, rebalancing and exfoliation programmes for the whole body.",
    services: [
      { name: "Body Detox / Weight-Loss Program", variants: [{ minutes: 60, price: { gbp: 69, wasGbp: 89 } }]},
      { name: "Facial & Body Treatment", variants: [{ minutes: 60, price: { gbp: 79, wasGbp: 99 } }]},
      { name: "Body Rebalance", variants: [{ minutes: 60, price: { gbp: 69, wasGbp: 89 } }]},
      { name: "Mind & Body", variants: [{ minutes: 60, price: { gbp: 69, wasGbp: 84 } }]},
      { name: "Body Exfoliation Treatment", variants: [{ minutes: 25, price: { gbp: 35 } }]},
    ],
  },

  {
    slug: "waxing",
    title: "Waxing",
    blurb: "Gentle, hygienic waxing for face and body — for women and men.",
    services: [
      { name: "Ladies' Waxing — Hollywood", variants: [{ minutes: 40, price: { gbp: 40, wasGbp: 50 } }]},
      { name: "Ladies' Waxing — Brazilian", variants: [{ minutes: 30, price: { gbp: 35, wasGbp: 45 } }]},
      { name: "Ladies' Waxing — Legs", variants: [
        { option: "Lower legs", minutes: 25, price: { gbp: 25 } },
        { option: "Upper legs", minutes: 15, price: { gbp: 25 } },
        { option: "Full legs", minutes: 30, price: { gbp: 40 } },
      ]},
      { name: "Ladies' Waxing — Arms", variants: [
        { option: "Underarms", minutes: 10, price: { gbp: 15 } },
        { option: "Half arms", minutes: 15, price: { gbp: 25 } },
        { option: "Full arms", minutes: 25, price: { gbp: 30 } },
      ]},
      { name: "Ladies' Waxing — Face", variants: [
        { option: "Chin", minutes: 10, price: { gbp: 5 } },
        { option: "Upper lip", minutes: 10, price: { gbp: 5 } },
      ]},
      { name: "Ladies' Waxing — Bikini", variants: [{ minutes: 20, price: { gbp: 25, wasGbp: 35 } }]},
      { name: "Ladies' Waxing — Hollywood & Full Leg", variants: [{ minutes: 60, price: { gbp: 70, wasGbp: 80 } }]},
      { name: "Ladies' Waxing — Brazilian & Full Leg", variants: [{ minutes: 60, price: { gbp: 65, wasGbp: 75 } }]},
      { name: "Ladies' Waxing — Buttocks", variants: [{ minutes: 20, price: { gbp: 25 } }]},
      { name: "Ladies' Waxing — Back", variants: [{ minutes: 30, price: { gbp: 35 } }]},
      { name: "Men's Waxing — Shoulder & Chest", variants: [{ minutes: 30, price: { gbp: 30 } }]},
      { name: "Men's Waxing — Back", variants: [{ minutes: 30, price: { gbp: 30 } }]},
      { name: "Men's Waxing — Intimate", variants: [{ minutes: 30, price: { gbp: 65 } }], note: "Please call to confirm before booking." },
      { name: "Men's Waxing — Hollywood & Buttocks", variants: [{ minutes: 30, price: { gbp: 65 } }]},
    ],
  },

  {
    slug: "lashes",
    title: "Eyelash Extensions",
    blurb: "Classic, hybrid and Russian volume lash extensions, plus infills and removal.",
    services: [
      { name: "Eyelash Extensions — Classic", variants: [{ minutes: 60, price: { gbp: 70, wasGbp: 75 } }]},
      { name: "Eyelash Extensions — Hybrid", variants: [{ minutes: 60, price: { gbp: 80, wasGbp: 90 } }]},
      { name: "Eyelash Extensions — Russian Volume", variants: [{ minutes: 60, price: { gbp: 85, wasGbp: 90 } }]},
      { name: "Eyelash Extensions — Classic Infill", variants: [{ minutes: 30, price: { gbp: 35, wasGbp: 45 } }]},
      { name: "Eyelash Extensions — Hybrid Infill", variants: [{ minutes: 45, price: { gbp: 45, wasGbp: 55 } }]},
      { name: "Eyelash Extensions — Russian Volume Infill", variants: [{ minutes: 45, price: { gbp: 55, wasGbp: 65 } }]},
      { name: "Eyelash Extensions — Removal", variants: [{ minutes: 20, price: { gbp: 15 } }]},
    ],
  },

  {
    slug: "brows",
    title: "Brows, Lashes & Threading",
    blurb: "Threading, tinting, brow shaping and lash lifts.",
    services: [
      { name: "Eyebrow Tint", variants: [{ minutes: 10, price: { gbp: 10 } }]},
      { name: "Eyelash Tint", variants: [{ minutes: 15, price: { gbp: 15 } }]},
      { name: "Eyebrow Threading", variants: [{ minutes: 10, price: { gbp: 10 } }]},
      { name: "Eyebrow Waxing", variants: [{ minutes: 10, price: { gbp: 10 } }]},
      { name: "Eyebrow Waxing & Tint", variants: [{ minutes: 10, price: { gbp: 18 } }]},
      { name: "Eyebrow Threading & Tint", variants: [{ minutes: 20, price: { gbp: 20 } }]},
      { name: "Eyelash Perm & Tint", variants: [{ minutes: 50, price: { gbp: 45 } }]},
      { name: "Facial Threading", variants: [
        { option: "Chin", minutes: 10, price: { gbp: 5 } },
        { option: "Lower lip", minutes: 10, price: { gbp: 5 } },
        { option: "Upper lip", minutes: 10, price: { gbp: 5 } },
        { option: "Forehead", minutes: 10, price: { gbp: 8 } },
        { option: "Eyebrows", minutes: 10, price: { gbp: 10 } },
        { option: "Lip & chin", minutes: 15, price: { gbp: 10 } },
        { option: "Eyebrow & upper lip", minutes: 20, price: { gbp: 13, wasGbp: 15 } },
        { option: "Sides", minutes: 20, price: { gbp: 15 } },
        { option: "Full face", minutes: 30, price: { gbp: 25 } },
      ]},
    ],
  },

  {
    slug: "sauna",
    title: "Infrared Sauna",
    blurb: "Far-infrared sauna sessions — please book at least 45 minutes before arrival.",
    services: [
      { name: "Infrared Sauna", variants: [
        { option: "30 min · 1 person", minutes: 30, price: { gbp: 30, wasGbp: 40 } },
        { option: "30 min · 2 people", minutes: 30, price: { gbp: 40, wasGbp: 50 } },
        { option: "1 hour · 1 person", minutes: 60, price: { gbp: 50, wasGbp: 60 } },
        { option: "1 hour · 2 people", minutes: 60, price: { gbp: 60, wasGbp: 70 } },
      ]},
    ],
  },
];


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
