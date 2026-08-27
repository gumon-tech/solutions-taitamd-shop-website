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

/**
 * Page-level buttons that carry no category, added for Q-MKT-060.
 *
 * Before this, the home hero, the /book page button and the navbar’s "quick
 * question" all fell through to X while sending the same words, so the room
 * answering WhatsApp could not tell a booking from a question, or the home page
 * from /book — not from the letter and not from the message either.
 *
 * The letters follow one rule so the next surface does not need a debate: take
 * the first letter of the surface’s own name that no other letter has claimed.
 * hOme, booK, Quick question. KMKT owns the register (Q-KMKT-004) and may swap
 * any of them in one line here; it was offline when the owner asked this room to
 * take the ticket on 2026-08-27.
 */
export const SOURCE_HOME = "O";
export const SOURCE_BOOK_PAGE = "K";
export const SOURCE_QUESTION = "Q";
/** The closing "WhatsApp to book" band, which runs on home, services, story, tour and contact. */
export const SOURCE_CTA = "T";
/** "Ask about offers", under the promotions band on the home page: ask abo(U)t offers. */
export const SOURCE_OFFER_ENQUIRY = "U";
/** "Ask a question first" on the signature page: ask a qu(E)stion first. */
export const SOURCE_SIGNATURE_QUESTION = "E";

/**
 * Buttons that carry no letter at all, on purpose.
 *
 * Three buttons link straight to the QR short link instead of going through
 * buildWhatsAppLink: /book "Open WhatsApp", and contact’s "Start on WhatsApp"
 * and "Open WhatsApp". They open an empty chat, and the letter rides inside the
 * pre-filled message, so an empty chat has nowhere to put one.
 *
 * Each sits beside a pre-filled button and exists so the customer can write
 * their own words: the words on the button promise an empty chat, and a message
 * appearing in it would break that promise. That is a copy decision rather than
 * a wiring one, so WS ruled on it (Q-MKT-064) and settled on these three staying
 * empty while "Ask about offers" and "Ask a question first", whose own words
 * already name a subject, took the letters U and E (Q-MKT-065).
 *
 * They were six before that ruling, and Q-KMKT-004’s grep showed none of them:
 * it reads buildWhatsAppLink call sites, and a button with no letter is exactly
 * a button that never calls it.
 *
 * One thing the far end should know: wa.me/qr/… is the same short link as the
 * printed QR code, so a click here and a scan in the shop arrive looking alike.
 * Separating those needs a second link, not a letter.
 */

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
 * The category letter for a link, read back out of the message it carries.
 *
 * Every pre-filled message already ends in `[web-M]`, `[web-G]` and so on, so the
 * form can label an enquiry without every button also carrying a marker attribute
 * that someone has to remember to add. A booking link written on a new page next
 * month is categorised correctly by having done nothing.
 */
export function sourceFromLink(href: string): string {
  const m = decodeURIComponent(href).match(/\[web-([A-Z])\]/);
  return m ? m[1] : SOURCE_UNKNOWN;
}

export function isWhatsAppBookingLink(href: string): boolean {
  try {
    const u = new URL(href, "https://taitam-d.com");
    return u.hostname === "wa.me" && !!u.pathname.replace(/^\/+|\/+$/g, "");
  } catch {
    return false;
  }
}
