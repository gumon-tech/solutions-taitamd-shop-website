import { SITE } from "@/lib/site";

function enc(s: string) {
  return encodeURIComponent(s);
}

/**
 * The letter appended to every pre-filled message as `[web-X]`, so the room
 * answering WhatsApp can record where the enquiry came from (Q-KMKT-004).
 *
 * Five letters were fixed by that ticket — M F N H W, and X for "not stated".
 * The rest are proposed here because the catalogue has twelve categories, not
 * five, and folding the other seven into X would throw away exactly the thing
 * the ticket asks us to record. Changing any letter is a one-line edit here.
 */
export const SOURCE_BY_SLUG: Record<string, string> = {
  massage: "M",
  facials: "F",
  nails: "N",
  hair: "H",
  waxing: "W",
  body: "B",
  sauna: "B",
  lashes: "L",
  brows: "L",
  hifu: "A",
  spmu: "A",
  "tattoo-removal": "A",
};

/** Non-catalogue surfaces get their own letters: gift cards, offers, products. */
export const SOURCE_GIFT = "G";
export const SOURCE_OFFER = "C";
export const SOURCE_PRODUCT = "P";
export const SOURCE_SIGNATURE = "S";
export const SOURCE_UNKNOWN = "X";

export function sourceForSlug(slug?: string): string {
  return (slug && SOURCE_BY_SLUG[slug]) || SOURCE_UNKNOWN;
}

/**
 * Build a WhatsApp wa.me deep link.
 * - If `phone` already includes wa.me, it will be used as the base.
 * - Otherwise, it assumes E.164 digits without the plus sign (e.g. 4478...).
 */
export function buildWhatsAppLink(
  message: string,
  source: string = SOURCE_UNKNOWN,
  phone: string = SITE.whatsappNumber,
) {
  const base = phone.includes("wa.me") ? phone : `https://wa.me/${phone}`;
  const text = message?.trim() ? `${message.trim()} [web-${source}]` : "";
  const q = text ? `?text=${enc(text)}` : "";
  return `${base}${q}`;
}

/**
 * Categories whose booking links go through the lead form first (Q-KMKT-004).
 * Massage only, on purpose: every other category is the control group for the
 * same weeks, so we can see what the form costs instead of guessing.
 */
const LEAD_FORM_SOURCES = new Set(["M"]);

/** Spread onto a booking link: marks it for the form, or adds nothing at all. */
export function leadFormAttr(source: string) {
  return LEAD_FORM_SOURCES.has(source) ? { "data-lead-form": source } : {};
}
