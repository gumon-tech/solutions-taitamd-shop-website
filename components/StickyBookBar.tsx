"use client";

import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppLink, SOURCE_STICKY_BAR } from "@/lib/whatsapp";

/**
 * The one-tap booking bar, mobile only (Q-SHOP-033 phase 4).
 *
 * Booking here is WhatsApp-first, but on a phone the WhatsApp button lived in the hero and
 * scrolled away after the first screen: from anywhere below it, reaching the shop meant
 * scrolling back up or opening the menu. This keeps it one tap from every point of every page.
 *
 * Cream, not green. T11 says a page may not lose lit area, and a dark bar pinned across the
 * bottom of every mobile screen would take some away on every page at once. The cream is
 * #f5efe3, already in the palette and already the surface of the booking and signature pages.
 *
 * One action and one link, because the second tap on a phone is where people leave. There used
 * to be a MobileDock component that looked like a head start on this — a four-item nav bar,
 * never imported by anything, deleted in the same round.
 */
export default function StickyBookBar() {
  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#d6c198] bg-[#f5efe3] shadow-[0_-8px_24px_rgba(12,51,30,0.18)]"
      // Keeps the buttons clear of the home indicator on phones that have one.
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2 px-4 pt-2">
        <a
          href={buildWhatsAppLink(
            "Hi Taitam-D, I’d like to book a treatment. Please share availability and current offers.",
            SOURCE_STICKY_BAR,
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#183d2d] px-4 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
        >
          <MessageCircle className="h-4 w-4 text-[#d7b874]" /> WhatsApp to book
        </a>

        <Link
          href="/services"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#d6c198] px-4 py-3 text-sm font-semibold text-[#123a2b] transition hover:bg-[#ebe3d4]"
        >
          <Sparkles className="h-4 w-4 text-[#6d5223]" /> Services
        </Link>
      </div>
    </div>
  );
}
