export const SITE = {
  baseUrl: "https://taitam-d.com",
  name: "TaiTam‑D Beauty & Spa",
  tagline: "Relax • Refresh • Recharge",
  description:
    "Thai‑inspired beauty & wellness in King’s Cross, London — massage, hair, nails, waxing, facials & more. Established in 2009. Book online via Treatwell.",
  address: "72-74 Caledonian Road, King's Cross, London, N1 9DN",
  hours: "Mon – Sun 10:30 AM – 9:00 PM",
  phone: "020 7278 0906",
  email: "info@taitam-d.com",

  // Booking
  treatwell: "https://www.treatwell.co.uk/place/taitam-d-massage-beauty/",
  treatwellWidget:
    "https://widget.treatwell.co.uk/place/taitam-d-massage-beauty/?utm_source=partner&utm_medium=salon-site-embedded-book-now-widget",

  // Direct chat / enquiries
  whatsappNumber: "447882359499", // E.164 without "+"
  whatsappDisplay: "+44 7882 359499",

  // Academy
  academy: "https://taitamd-beautyacademy.com/",

  social: {
    instagram: "https://www.instagram.com/taitamd/",
    facebook: "https://www.facebook.com/TaitamdBeautyAcademy",
    // Customer confirmed: Academy page
    academyFacebook: "https://www.facebook.com/TaitamdBeautyAcademy",
    googleMaps:
      "https://www.google.com/maps?q=72-74%20Caledonian%20Road%2C%20King%27s%20Cross%2C%20London%2C%20N1%209DN",
  },

  // Prefilled WhatsApp messages (lead capture)
  whatsappTemplates: {
    giftCard:
      "Hi TaiTam‑D, I’d like to order a Gift Card.\n\nRecipient name: ___\nAmount: ___\nMessage on card: ___\nPreferred date: ___\n\nThank you!",
    academyGeneral:
      "Hi TaiTam‑D Academy, I’m interested in training courses.\n\nCourse: ___\nPreferred dates: ___\nExperience level: ___\n\nPlease share details & availability. Thank you!",
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
