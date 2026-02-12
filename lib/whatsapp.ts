import { SITE } from "@/lib/site";

function enc(s: string) {
  return encodeURIComponent(s);
}

/**
 * Build a WhatsApp wa.me deep link.
 * - If `phone` already includes wa.me, it will be used as the base.
 * - Otherwise, it assumes E.164 digits without the plus sign (e.g. 4478...).
 */
export function buildWhatsAppLink(message: string, phone: string = SITE.whatsappNumber) {
  const base = phone.includes("wa.me") ? phone : `https://wa.me/${phone}`;
  const q = message?.trim() ? `?text=${enc(message)}` : "";
  return `${base}${q}`;
}
