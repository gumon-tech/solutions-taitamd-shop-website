import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import ServicePriceGrid from "@/components/ServicePriceGrid";
import CTA from "@/components/CTA";
import ShopFaq from "@/components/ShopFaq";
import TreatwellFallback from "@/components/TreatwellFallback";
import { CATALOG } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink, SOURCE_MASSAGE_LANDING } from "@/lib/whatsapp";

// The massage rows come from the catalogue, never from this file. A price typed here
// would be correct on the day it was typed and wrong on the first day someone changed
// the menu, with nothing to say which page had gone stale (Q-MKT-077 item 3).
const massage = CATALOG.find((c) => c.slug === "massage")!;

const TITLE = "Thai Massage in King's Cross, London | Taitam-D";
const DESCRIPTION =
  `Thai, deep tissue, Swedish and aromatherapy massage a ${SITE.walkMinutes}-minute walk from King's Cross station. Open every day. Message us on WhatsApp to check availability.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/massage-kings-cross" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/massage-kings-cross",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function MassageKingsCrossPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-ink">Massage</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Thai Massage in <span className="text-gold whitespace-nowrap">King’s Cross</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-4 text-ink/80">
          <p>
            Our treatment rooms are a {SITE.walkMinutes}-minute walk from King’s Cross station,
            on Caledonian Road. We are open every day, {SITE.hours.replace("Mon – Sun ", "")}.
          </p>
          <p>
            The massage menu runs from Thai and Thai foot massage through deep tissue, Swedish,
            aromatherapy and hot stone. Every treatment below shows its length and its price, and
            tapping one opens WhatsApp with those details already written, so you can ask about a
            time without filling in a form.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like a massage in King’s Cross. Please share availability.",
              SOURCE_MASSAGE_LANDING,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-6 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
            WhatsApp us about a massage
          </a>
          <Link
            href="/services#cat-massage"
            className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-gold/50"
          >
            See the full menu
          </Link>
        </div>

        <TreatwellFallback className="mt-4" />
      </header>

      <section aria-label="Massage treatments and prices">
        <h2 className="text-2xl font-semibold md:text-3xl">Massage treatments and prices</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{massage.blurb}</p>
        <ServicePriceGrid services={massage.services} source={SOURCE_MASSAGE_LANDING} />
        <p className="mt-8 text-xs leading-relaxed text-ink/50">
          Prices reflect our Treatwell listing and may change. Message us to confirm availability
          and the latest offers before your visit.
        </p>
      </section>

      <section aria-label="Deep tissue" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Looking for firmer pressure?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
          Deep tissue has its own page, with what to expect on a first visit and the treatments
          people book alongside it.
        </p>
        <Link
          href="/deep-tissue-massage-kings-cross"
          className="mt-4 inline-block text-sm font-medium text-ink underline decoration-gold/60 underline-offset-4"
        >
          Deep tissue massage in King&rsquo;s Cross
        </Link>
      </section>

      <section aria-label="Where to find us" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Finding us</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mist">Address</h3>
            <p className="mt-2 text-ink/80">{SITE.address}</p>
            <a
              href={SITE.social.googleMaps}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-medium text-ink underline decoration-gold/60 underline-offset-4"
            >
              Open in Google Maps
            </a>
          </div>
          <div className="rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mist">Hours</h3>
            <p className="mt-2 text-ink/80">{SITE.hours}</p>
            <p className="mt-3 text-sm text-ink/60">Phone {SITE.phone}</p>
          </div>
        </div>
      </section>

      <ShopFaq id="massage-faq" />

      <CTA />
    </main>
  );
}
