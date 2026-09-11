import { SITE } from "@/lib/site";
import FaqPanel from "./FaqPanel";

/**
 * The questions people actually ask, and the answers the shop stands behind.
 *
 * OFFICE counted the topics across 51 enquiries between 20 August and 8 September 2026 and
 * marked which answers it could confirm (Q-MKT-079 group C). Two of the ten — card payment
 * and gift vouchers — went up empty because it could not confirm them, and stayed empty for
 * two days until the owner answered on 2026-09-11. That gap was the point: an FAQ answer is
 * a promise made in advance to a reader who cannot ask a follow-up question, so a guess here
 * is worse than a silence.
 *
 * The voucher answer names no price, because the owner confirmed vouchers exist and did not
 * confirm what they cost.
 *
 * It lives in a component because the same block belongs on several pages, and because the
 * next correction should land in one file rather than in however many copies exist by then.
 * Pages with their own subject — the treatment landing pages — write their own list instead,
 * since half of these answers would be beside the point there.
 *
 * What this file is now is the shop's ten answers and nothing else. The panel around them —
 * cream ground, dark text, the FAQPage structured data — moved to FaqPanel, which the five
 * treatment landing pages use as well. This file had been the original that the other five
 * were copied from, and the copies are what made phase 3 dangerous: changing the ground in
 * six places means five chances to miss one.
 */
export const SHOP_FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much is an hour of massage?",
    "Deep tissue, Thai Combination and Aromatherapy are £69 for 60 minutes. Swedish is £59 and Hot Stone is £74. Thirty-minute treatments start at £35.",
  ],
  [
    "Which treatments do most people book?",
    "Deep tissue and Thai Combination, both at 60 minutes. Of the 22 appointments booked between 20 August and 8 September 2026, 16 were 60-minute treatments.",
  ],
  [
    "Can I book for today?",
    "Message us any time and we will check the diary and reply. We cannot promise a slot in advance, because availability changes through the day.",
  ],
  [
    "Can I walk in without booking?",
    "Yes, and people do. We still suggest messaging first, because you may have to wait when the rooms are full.",
  ],
  [
    "Do you come to my home or hotel?",
    "No. Every treatment is done at the shop, with no exceptions.",
  ],
  [
    "Can I see the rooms before I book?",
    "Yes. There are photographs of every room on our tour page, taken in the order you meet them walking in.",
  ],
  [
    "How can I pay?",
    "Credit and debit cards, contactless including Apple Pay and Google Pay, and cash.",
  ],
  [
    "Do you sell gift vouchers?",
    "Yes, gift vouchers are available. Message us on WhatsApp to arrange one.",
  ],
];

export default function ShopFaq({ id = "shop-faq" }: { id?: string }) {
  return <FaqPanel id={id} items={SHOP_FAQ} />;
}
