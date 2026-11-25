import { HOURS } from "./hours";

export const SITE = {
  baseUrl: "https://taitam-d.com",
  name: "Taitam-D Beauty & Spa",
  // The registered company, not the brand. These are two different things and the
  // field name is the only thing that says which is which — `legalName` held the
  // trading name until 2026-08-11, so JSON-LD was declaring a company that does not
  // exist under that name. Verified by Legal against Companies House: 11141046,
  // active, England and Wales.
  // Never translate or transliterate this, the jurisdiction, or the registered
  // address — a registered name is a legal identifier, not a piece of copy.
  legalName: "TAITAM-D MANAGEMENT LTD",
  companyNumber: "11141046",
  jurisdiction: "England and Wales",
  // Deliberately different from `address` above: the shop occupies 72-74, the
  // registered office is 72. Both are correct and they must stay separately
  // labelled — merging them would leave a reader unable to tell where statutory
  // post has to go, which is the one question a registered office answers.
  registeredOffice: "72 Caledonian Road, London, England, N1 9DN",
  tagline: "Relax • Refresh • Recharge",
  description:
    "Thai‑inspired beauty & wellness in King’s Cross, London — massage, hair, nails, waxing, facials & more. Established in 2009. Message us on WhatsApp to reserve your treatment.",
  address: "72-74 Caledonian Road, King's Cross, London, N1 9DN",
  // Walking time from King's Cross St Pancras, in minutes, as a number the copy
  // formats itself — the hero says "5 min", the location block "5 min walk", the
  // massage landing page "a 5-minute walk".
  //
  // It lives here because it did not, and the two places that held it disagreed:
  // the hero said 5 and the location block ~6, both live, for a month. MKT settled
  // it on 2026-09-09 by measuring the route in Google Maps — 4 minutes over 0.2
  // miles on both suggested paths — and rounding up, so the number we publish is
  // the one a visitor is least likely to find optimistic. Provenance in the
  // marketing repo, docs/marketing/37, under the walking-distance heading, at
  // commit 4f28e39 — the sha is here because a pointer to a heading in a file that
  // keeps growing is a pointer that stops resolving.
  walkMinutes: 5,
  // Computed from data/hours.json (lib/hours.ts), so the shop's hours are edited in one place.
  hours: HOURS.display,
  phone: "07564292247",
  email: "info@taitam-d.com",
  priceRange: "££",
  foundingDate: "2009",
  logo: "/images/logo.png",
  image: "/images/hero/og-1200x630.jpg",

  // Direct chat / enquiries
  // The shop's own number since 2026-10-14 (owner's instruction relayed by KBOT): the same line as
  // `phone`, now on the WhatsApp Cloud API where the shop's assistant answers every chat. Kru Nok's
  // personal number, used here until that day, must not appear on any public page again.
  whatsappNumber: "447564292247", // E.164 without "+"
  whatsappDisplay: "07564292247",
  // The QR encodes the number link, never a wa.me/qr/… short link: those can be revoked, and
  // the old one (YIN5KFQPKWI2F1) was, so every scan landed on "no longer valid" (OFFICE, 2026-09-17).
  // Encoded text: "Hi Taitam-D, I would like to book. [web-QS]" plus a blank line (kept short: a longer message made the code too dense to read at 183px on /contact).
  // Regenerate with: qrencode -l M -m 2 -s 12 -o <file>.png "<link from buildOpenChatLink(…, SOURCE_WEB_QR_SCAN)>"
  whatsappQr: "/images/whatsapp/whatsapp-qr-447564292247.png",

  // The shop's public Treatwell listing — the fallback for a visitor with no
  // WhatsApp (Q-MKT-078, owner's instruction). Never the primary path: WhatsApp is
  // where the shop actually answers.
  //
  // OFFICE read this address out of the shop's own Treatwell Connect back office,
  // from the "Preview on Treatwell" button Treatwell generates itself, and could
  // not open it — CloudFront returns 403 to this country. SHOP fetched it and got
  // 200: the page is titled for the shop, names Caledonian Road and N1 9DN, and
  // carries venue id 287555 seventy-seven times, with this exact URL as its own
  // canonical. Measured 2026-09-09, both halves recorded because a link nobody
  // could open is the one thing this button must never be.
  treatwellBooking: "https://www.treatwell.co.uk/place/taitam-d-massage-beauty/",
  // The embeddable form of the same listing, used by TreatwellWidget on /book/.
  //
  // Loading it sets two of Treatwell's own cookies — fe20-flipper-id and growthbook_id,
  // both expiring 2028 — which is why the frame waits for a click rather than opening
  // with the page: our banner promises that declining stores nothing, and an always-on
  // frame would have made that sentence false for everyone who declined.
  treatwellWidget:
    "https://widget.treatwell.co.uk/place/taitam-d-massage-beauty/?utm_source=partner&utm_medium=salon-site-embedded-book-now-widget",

  // Academy
  academy: "https://academy.taitam-d.com/",

  // Google Ads measurement and the ad click reference (standard: gumon-marketing-hub
  // playbooks/ads-and-web-standard.md §1; design: full-loop-web-design.md Appendix A/B).
  // Every value here ships in public JavaScript and none of them is a secret.
  // scripts/check-ads-ids.mjs fails the build if any other AW- or G- id, or another shop's
  // bot host, appears in out/, so a value copied from another client's site cannot ship.
  googleAds: {
    // This shop's own Google Ads tag. Loaded only after Accept (components/Analytics.tsx).
    tagId: "AW-18372517071",
    // Ads conversion action "WhatsApp chat start (web)": fixed £1, no business value. Fired on
    // every press of a WhatsApp chat link while accepted; never for share links, never for
    // a [web-CR] job-application link (job applicants are not ad customers), never for tel:.
    whatsappConversion: "AW-18372517071/XVeLCLK1uL8dEM-52bhE",
    conversionValue: 1,
    currency: "GBP",
    // Version of the cookie banner wording. Part of the stored key (lib/consent.ts), so an
    // Accept counts only for the words it was given to: change the banner's meaning, bump this.
    consentVersion: "v2",
    clickRef: {
      // Equals the bot's SHOP_ID: mixed into the 8-character code and sent as "site".
      site: "taitamd-kx",
      // The bot's /m/click route. Empty = off: no [web-AD-XXXXXXXX] code, no POST, no
      // transaction_id, and the privacy notice leaves out the paragraphs that describe them.
      // Switched on 2026-11-25 after KBOT turned it on for Taitam-D (rel7) and KWEB's own
      // probe from Origin https://taitam-d.com returned 204. Never another shop's address.
      endpoint: "https://shop-agent.taitam-d.com/m/click",
      // For the privacy notice; these are the bot's numbers (KBOT), not the website's.
      unclaimedDays: 8, // a code nobody messages with is deleted after this
      maxDays: 90, // a click reference is deleted once reported, and at most this long after the landing
      serverLogMonths: 12, // the bot's security logs (IP address, browser details)
    },
  },

  social: {
    // Instagram is deliberately absent from `sameAs` — there is no business account
    // linked to the page yet, so it is not an official channel we can vouch for (Q-MKT-002).
    instagram: "https://www.instagram.com/taitamd/",
    // The shop's own page. Verified by fetching it: og:title "Taitam-D Beauty&Spa Centre | London".
    // It used to hold the Academy URL below, which put the Academy's page in the shop's
    // `sameAs` — the schema was telling Google the two brands were one channel.
    facebook: "https://www.facebook.com/TaitamDBeautyAndWellness",
    // Customer confirmed: Academy page — og:title "Taitam-D Beauty Academy | London".
    // Keep it out of the shop's `sameAs` until the page is renamed to Taitam-D Academy London.
    academyFacebook: "https://www.facebook.com/TaitamdBeautyAcademy",
    googleMaps:
      "https://www.google.com/maps?q=72-74%20Caledonian%20Road%2C%20King%27s%20Cross%2C%20London%2C%20N1%209DN",
  },

  // The price is fixed, not a starting point (owner ruling via Marketing, 2026-08-11).
  // It is written as one string bound to the product name because Google compares the
  // price in an ad against the landing page, and because £69 also appears on the home
  // page as the medium-hair Hair Spa tier — a bare "£69" here would sit next to an
  // unrelated £69 with nothing saying which treatment it belongs to.
  // Never render this as "from £69".
  signaturePrice: "Taitam-D Signature — £69 / 60 minutes",

  // Salon standards notice (Q-OFFICE-002, owner-approved 2026-08-18). Verbatim — do not
  // reword, and never add sexual-service keywords anywhere on the site, even as a denial:
  // search engines would index the term and route those searches here (the opposite of intent).
  // Only neutral words are allowed: professional · therapeutic · non-sexual.
  standardsNotice:
    "Taitam-D is a professional therapeutic massage and beauty salon. All treatments are non-sexual.",
  // Prefilled WhatsApp messages (lead capture)
  whatsappTemplates: {
    signature:
      "Hi Taitam-D, I’d like to book the Taitam-D Signature (£69 / 60 minutes). Please share availability.",
    giftCard:
      "Hi Taitam-D, I’d like to order a Gift Card.\n\nRecipient name: ___\nAmount: ___\nMessage on card: ___\nPreferred date: ___\n\nThank you!",
    academyGeneral:
      "Hi Taitam-D Academy, I’m interested in training courses.\n\nCourse: ___\nPreferred dates: ___\nExperience level: ___\n\nPlease share details & availability. Thank you!",
  },
};

// The category cards live in data/services.json (service_categories), read through lib/services.ts.
export { SERVICE_CATEGORIES } from "./services";
