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
 * The three buttons that open a chat with nothing but a greeting in it.
 *
 * R is the one mnemonic left: it sits under the Q(R) card on /contact, and it is
 * the letter that finally separates "tapped the button beside the QR picture"
 * from "scanned the printed QR in the shop", which arrived identical until now.
 * D and I are arbitrary. Every letter that spelled its own surface was taken by
 * the time these three were assigned, and a forced mnemonic that only its author
 * can reconstruct is worse than an honest table.
 */
export const SOURCE_BOOK_OPEN_CHAT = "D";
export const SOURCE_CONTACT_OPEN_CHAT = "I";
export const SOURCE_CONTACT_QR_CARD = "R";

/**
 * What the three open-chat buttons put in the box, per Q-MKT-065.
 *
 * Each takes its intent from the words already printed around it rather than a
 * new phrase, because what the visitor read just before tapping is what they
 * expect to be talking about. None of them names a treatment: these buttons are
 * the ones the visitor finishes themselves, so the message is a letterhead and
 * not the whole letter.
 */
export const OPEN_CHAT_MESSAGE = {
  book: "Hi Taitam-D, I’d like to book a treatment.",
  contactHeader: "Hi Taitam-D, I’d like help choosing a treatment and a time.",
  contactQrCard: "Hi Taitam-D, I’d like to ask about availability.",
};

/**
 * Buttons that carry no letter at all, on purpose.
 *
 * Every button that talks to the shop now carries a letter. Six of them did not
 * until 2026-08-27: they linked straight to the QR short link, which opens an
 * empty chat, and a letter has to ride inside a message. WS ruled that all six
 * should carry one anyway (Q-MKT-064, second ruling) — five through a message of
 * their own, and the sixth, the closing band, by becoming an ordinary pre-filled
 * button.
 *
 * Q-KMKT-004’s grep showed none of the six: it reads buildWhatsAppLink call
 * sites, and a button with no letter is exactly a button that never called it.
 *
 * One gap is left, and no letter can close it. The QR short link is the same one
 * printed on the card in the shop, so a tap and a scan still arrive looking
 * alike wherever that link is still used. Splitting those needs a second link
 * from WhatsApp Business, not another letter.
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
  return waLink(phone, message?.trim() ? `${message.trim()} [web-${source}]` : "");
}

function waLink(phone: string, text: string) {
  const base = phone.includes("wa.me") ? phone : `https://wa.me/${phone}`;
  return `${base}${text ? `?text=${enc(text)}` : ""}`;
}

/**
 * A chat that opens with a greeting, a letter, and a blank line under them.
 *
 * These buttons used to open a chat with nothing in it at all, which is why they
 * carried no letter: there was no message for one to ride in. WS ruled that all
 * five should carry one (Q-MKT-064), and MKT pointed out the cost before it
 * shipped — the letter would sit between the visitor’s hello and whatever they
 * came to say, reading as debris in the middle of their own sentence rather than
 * as a tag at the end of ours.
 *
 * The blank line is the whole fix: the message and the letter keep the first
 * line, and the visitor starts typing on a clean one. The seventeen pre-filled
 * buttons are untouched by it — nobody is expected to keep typing after those.
 */
export function buildOpenChatLink(
  message: string,
  source: string,
  phone: string = SITE.whatsappNumber,
) {
  return waLink(phone, `${message.trim()} [web-${source}]\n\n`);
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
