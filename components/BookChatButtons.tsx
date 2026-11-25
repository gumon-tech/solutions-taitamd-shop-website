import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import {
  buildOpenChatLink,
  buildWhatsAppLink,
  OPEN_CHAT_MESSAGE,
  SOURCE_BOOK_OPEN_CHAT,
  SOURCE_BOOK_PAGE,
} from "@/lib/whatsapp";

/*
 * The two /book/ buttons and the marketing notice under them.
 *
 * Soft opt-in (PECR reg. 22). Q-KMKT-010 added an opt-out box here on 2026-11-25; the owner had
 * it removed the next day (Q-KMKT-012: "the chat already tells them; anyone who doesn't want it
 * says so when the booking is done"). The way to refuse at the time of booking is now the shop
 * assistant's booking confirmation in WhatsApp, which carries "reply STOP" (KBOT), and STOP or
 * unsubscribe in every later message. Do not bring the box back without the owner.
 *
 * Wording: Q-KMKT-012 verbatim. Normal size, the card's ink colour, not hidden. Keep the facts in
 * step with app/terms (#marketing) and app/privacy (#marketing).
 */
export default function BookChatButtons() {
  return (
    <>
      {/*
        Both buttons carry a letter now (Q-MKT-064, second ruling). They still
        differ in what they promise: the right one sends a finished request, the
        left one opens a chat with an opening line and D on it, a blank line, and
        the rest left to the visitor.
      */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={buildOpenChatLink(OPEN_CHAT_MESSAGE.book, SOURCE_BOOK_OPEN_CHAT)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3.5 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
        >
          <MessageCircle className="h-4 w-4 text-[#d7b874]" /> Open WhatsApp <ArrowUpRight className="h-4 w-4 text-[#d7b874]" />
        </a>
        <a
          href={buildWhatsAppLink(
            "Hi Taitam-D, I’d like to book a treatment. Please share availability and current offers.",
            SOURCE_BOOK_PAGE,
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cdb887] px-5 py-3.5 text-sm font-semibold text-[#345a45] transition hover:bg-white/60"
        >
          Send a pre-filled message <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#183b2d]">
        By booking, you agree that {SITE.name} may send you occasional news and offers about our
        treatments by email and WhatsApp.{" "}
        <Link href="/terms#marketing" className="underline decoration-[#183b2d]/40 underline-offset-4 hover:text-[#25563e]">
          Terms
        </Link>
      </p>
    </>
  );
}
