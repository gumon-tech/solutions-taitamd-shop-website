"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import {
  buildOpenChatLink,
  buildWhatsAppLink,
  chatLinkWithOptOut,
  OPEN_CHAT_MESSAGE,
  SOURCE_BOOK_OPEN_CHAT,
  SOURCE_BOOK_PAGE,
} from "@/lib/whatsapp";

/*
 * The two /book/ buttons, the marketing notice under them and the opt-out box (Q-KMKT-010).
 *
 * Soft opt-in (PECR reg. 22): the notice is given where the customer books, and the box gives
 * them a simple way to refuse there and then. The box starts EMPTY and ticking it means "no"
 * (ICO: a pre-ticked box is not a valid choice). Doing nothing = the owner's default (news and
 * offers may be sent), which the notice says in plain words.
 *
 * There is no form, so the choice travels inside the WhatsApp message (lib/whatsapp.ts
 * MARKETING_OPT_OUT_SENTENCE), where the customer can see it before pressing send. The hrefs are
 * changed on the element, not through React props: AdSource and lib/clickref.ts rewrite the tag
 * of these same links on an ad visit, and a re-render would quietly undo that. The checkbox is
 * uncontrolled for the same reason (no state, no re-render).
 *
 * Wording: KMKT's ticket, verbatim, with Taitam-D Beauty & Spa for {Shop name}. Normal size, the
 * card's ink colour, not hidden. Legal wording is this room's to set (Q-KWS-118): change it here
 * and in app/terms/page.tsx in the same commit.
 */
export default function BookChatButtons() {
  const boxId = useId();
  const noteId = useId();
  const box = useRef<HTMLInputElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  function apply(on: boolean) {
    for (const a of links.current) if (a) a.href = chatLinkWithOptOut(a.href, on);
  }

  // A tick made before hydration, or put back by the browser on Back/reload, fires no change
  // event: read the box once on mount so the links never disagree with what the visitor sees
  // (independent review, 2026-11-25).
  useEffect(() => {
    if (box.current?.checked) apply(true);
  }, []);

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
          ref={(el) => {
            links.current[0] = el;
          }}
          href={buildOpenChatLink(OPEN_CHAT_MESSAGE.book, SOURCE_BOOK_OPEN_CHAT)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3.5 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
        >
          <MessageCircle className="h-4 w-4 text-[#d7b874]" /> Open WhatsApp <ArrowUpRight className="h-4 w-4 text-[#d7b874]" />
        </a>
        <a
          ref={(el) => {
            links.current[1] = el;
          }}
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
      <div className="mt-5 max-w-xl text-sm leading-relaxed text-[#183b2d]">
        <p>
          By booking, you agree that {SITE.name} may send you occasional news and offers about our
          treatments by email and WhatsApp. You can stop at any time.{" "}
          <Link href="/terms#marketing" className="underline decoration-[#183b2d]/40 underline-offset-4 hover:text-[#25563e]">
            Terms
          </Link>
        </p>
        <div className="mt-3 flex items-start gap-2.5">
          {/*
            Drawn by hand: the site runs color-scheme dark, so the browser's own box rendered as a
            filled dark square that read as already ticked (visual gate, 2026-11-25). An empty box
            must look empty.
          */}
          <span className="relative mt-0.5 inline-flex h-[18px] w-[18px] shrink-0">
            <input
              ref={box}
              id={boxId}
              type="checkbox"
              autoComplete="off"
              aria-describedby={noteId}
              defaultChecked={false}
              onChange={(e) => apply(e.currentTarget.checked)}
              className="peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-[4px] border-[1.5px] border-[#183d2d] bg-white checked:bg-[#183d2d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#183d2d]"
            />
            <Check
              aria-hidden="true"
              strokeWidth={3}
              className="pointer-events-none absolute left-[3px] top-[3px] hidden h-3 w-3 text-[#f7f3e9] peer-checked:block"
            />
          </span>
          <label htmlFor={boxId} className="cursor-pointer">
            Please don&rsquo;t send me news and offers
          </label>
        </div>
        {/* The box rides in the WhatsApp message, so it cannot reach a Treatwell booking: say so. */}
        <p id={noteId} className="mt-2 text-[#5b6d62]">
          The box applies to the WhatsApp buttons above. Booked on Treatwell? Reply STOP to any of
          our WhatsApp messages, or use the unsubscribe link in any of our emails.
        </p>
      </div>
    </>
  );
}
