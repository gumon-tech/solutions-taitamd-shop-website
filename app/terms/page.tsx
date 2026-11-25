import { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms that apply when you book or visit Taitam-D Beauty & Spa in King's Cross, London, including news and offers by email and WhatsApp and how to opt out.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

/*
 * Created 2026-11-25 for Q-KMKT-010 (owner's instruction, 2026-11-26 Bangkok time: the terms must
 * be on the website and say that using the service means agreeing to news and offers, with a way
 * to stop). Legal wording is this room's to set since Q-KWS-118. "Marketing messages" is KMKT's
 * text verbatim, {Shop name} = SITE.name.
 *
 * Only what has been decided is written here. Prices, deposits, cancellation and other booking
 * rules are business terms the owner sets (CLAUDE.md: not this room's call), so this page does
 * not invent them. Add them as their own sections when the owner gives them.
 *
 * Keep the facts in step with the notice on /book/ (components/BookChatButtons.tsx) and the
 * privacy notice (#marketing).
 */
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 md:px-8 pb-24 pt-10 md:pt-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Terms</h1>
      <p className="mt-2 text-sm text-mist">Effective 25 November 2026 · taitam-d.com</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/90">
        <section>
          <h2 className="text-lg font-medium text-ink">About these terms</h2>
          <p className="mt-2 text-mist">
            These terms apply when you book or visit {SITE.name}, run by {SITE.legalName} (company
            number {SITE.companyNumber}), {SITE.registeredOffice}. How we handle your personal data
            is explained in our{" "}
            <Link href="/privacy" className="underline text-gold hover:text-gold2">
              Privacy Notice
            </Link>
            . If you book on Treatwell, Treatwell&rsquo;s own terms also apply to that booking.
            Questions: {SITE.email}.
          </p>
        </section>

        <section id="marketing" className="scroll-mt-28">
          <h2 className="text-lg font-medium text-ink">Marketing messages</h2>
          <p className="mt-2 text-mist">
            When you book or visit {SITE.name}, we may send you news and offers about similar
            treatments from {SITE.name} by email and WhatsApp. You can opt out at any time: tick
            &ldquo;Please don&rsquo;t send me news and offers&rdquo; when booking, reply STOP to
            any WhatsApp message, or use the unsubscribe link in any email.{" "}
            <span className="text-ink">
              Opting out stops all marketing messages on every channel.
            </span>{" "}
            We still send messages about your bookings.
          </p>
        </section>

        <section>
          <p className="text-mist">
            We will show a new date here whenever these terms change.
          </p>
        </section>
      </div>
    </main>
  );
}
