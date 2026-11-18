import { SHOP_FAQ } from "@/lib/faq";
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
 * The answers now live in data/faq.json (shop, read through lib/faq.ts; fields in data/FAQ.md). What this file is now is the panel for them and nothing else. The panel around them —
 * cream ground, dark text, the FAQPage structured data — moved to FaqPanel, which the five
 * treatment landing pages use as well. This file had been the original that the other five
 * were copied from, and the copies are what made phase 3 dangerous: changing the ground in
 * six places means five chances to miss one.
 */
export default function ShopFaq({ id = "shop-faq" }: { id?: string }) {
  return <FaqPanel id={id} items={SHOP_FAQ} />;
}
