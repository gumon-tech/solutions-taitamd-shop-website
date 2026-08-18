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
  hours: "Mon – Sun 10:30 AM – 9:00 PM",
  phone: "07564292247",
  email: "info@taitam-d.com",
  priceRange: "££",
  foundingDate: "2009",
  logo: "/images/logo.png",
  image: "/images/hero/og-1200x630.jpg",

  // Direct chat / enquiries
  whatsappNumber: "447882359499", // E.164 without "+"
  whatsappDisplay: "07882359499",
  whatsappQr: "/images/whatsapp/whatsapp-qr-only.jpg",
  whatsappLink: "https://wa.me/qr/YIN5KFQPKWI2F1",

  // Academy
  academy: "https://academy.taitam-d.com/",

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
  massageExpectationFaq: {
    q: "What should I expect during a massage?",
    a: [
      "Taitam-D is a professional therapeutic massage and beauty salon. All treatments are non-sexual.",
      "You will be given privacy to undress. Underwear is worn throughout, and you are covered with a towel at all times, with only the area being worked on uncovered. Our therapists do not treat intimate areas.",
      "If you have pain or a medical condition, please tell your therapist before the treatment starts so they can adjust the pressure and the areas they work on.",
    ],
  },

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

export const SERVICE_CATEGORIES: Array<{
  slug: string;
  title: string;
  subtitle: string;
  highlights: string[];
}> = [

  {
    slug: "massage",
    title: "Massage",
    subtitle: "Thai • Deep Tissue • Swedish • Aromatherapy",
    highlights: ["Thai Massage (stretch + energy-line work)", "Deep Tissue for chronic tension", "Aromatherapy with essential oils", "Foot & head-to-toe options"]
  },
  {
    slug: "hair",
    title: "Hair",
    subtitle: "Master cut • Colour • Straightening • Nano Hair Spa",
    highlights: ["Asian stylist master cut", "Japanese straightening & hair straightening", "Colour & gloss", "Nano Hair Spa restoration"]
  },
  {
    slug: "face",
    title: "Face",
    subtitle: "Gua Sha • Deep cleanse • Hydration • Glow",
    highlights: ["Gua Sha facial massage", "Deep cleansing", "Hydration & barrier care", "Lift, tone, and rejuvenate"]
  },
  {
    slug: "nails",
    title: "Nails",
    subtitle: "Mani • Pedi • Gel",
    highlights: ["Gel application", "Clean, precise finishing", "Cuticle care", "Long-lasting shine"]
  },
  {
    slug: "waxing",
    title: "Waxing",
    subtitle: "Smooth, fast, professional",
    highlights: ["Gentle technique", "Hygiene-first", "Aftercare guidance", "All areas"]
  },
  {
    slug: "lashes",
    title: "Eyelash",
    subtitle: "Extensions • Lift • Tint",
    highlights: ["Natural to glam", "Safe, gentle products", "Custom styling", "Mascara-free days"]
  },
  {
    slug: "micro",
    title: "Micropigmentation",
    subtitle: "Brows • Lips • Eyeliner",
    highlights: ["Semi-permanent definition", "Natural-looking results", "Precision pigments", "Low-maintenance routine"]
  },
  {
    slug: "aesthetic",
    title: "Aesthetic Injections",
    subtitle: "Expert-led, premium products",
    highlights: ["Tailored plan", "Safety & consultation", "Natural enhancement", "Rejuvenation"]
  }
];
