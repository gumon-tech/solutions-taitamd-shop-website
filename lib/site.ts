import { base } from "framer-motion/client";

export const SITE = {
  baseUrl: "https://taitam-d.com",
  name: "TaiTam‑D Beauty & Spa",
  tagline: "Relax • Refresh • Recharge",
  description:
    "Thai‑inspired beauty & wellness in King’s Cross, London — massage, hair, nails, waxing, facials & more. Established in 2009. Book online via Treatwell.",
  address: "72-74 Caledonian Road, King's Cross, London, N1 9DN",
  hours: "Mon – Sun 10:30 AM – 9:00 PM",
  phone: "020 7278 0906",
  whatsapp: "https://wa.me/447882359499",
  email: "info@taitam-d.com",
  treatwell: "https://www.treatwell.co.uk/place/taitam-d-massage-beauty/",
  academy: "https://taitamd-beautyacademy.com/",
  social: {
    facebook: "https://www.facebook.com/TaitamDBeautyAndWellness",
    instagram: "https://www.instagram.com/taitamd/",
    googleMaps: "https://www.google.com/maps?q=72-74%20Caledonian%20Road%2C%20King%27s%20Cross%2C%20London%2C%20N1%209DN"
  }
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
