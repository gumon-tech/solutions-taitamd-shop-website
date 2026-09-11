import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import ServicePriceGrid from "@/components/ServicePriceGrid";
import FaqPanel from "@/components/FaqPanel";
import TreatwellFallback from "@/components/TreatwellFallback";
import CTA from "@/components/CTA";
import { CATALOG } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink, SOURCE_LASH_LANDING } from "@/lib/whatsapp";

const lashes = CATALOG.find((c) => c.slug === "lashes")!;
const brows = CATALOG.find((c) => c.slug === "brows")!;

// Extensions sit in one category and lash tinting, perming and brow work in another, so a
// visitor searching for lashes would meet half of what we do. Both come from the catalogue;
// the eyes-related rows of the brows category are selected by the name they already carry.
const lashExtras = brows.services.filter((s) => /Eyelash|Eyebrow Tint|Eyebrow Threading|Eyebrow Waxing/.test(s.name));

const TITLE = "Lash Extensions in King's Cross, London | Taitam-D";
const DESCRIPTION =
  `Classic, hybrid and Russian volume lash extensions in King's Cross, a ${SITE.walkMinutes}-minute walk from the station. Open every day. Message us on WhatsApp to check availability.`;

const FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much are lash extensions?",
    "A classic set is £70, hybrid is £80 and Russian volume is £85, each about an hour. Infills are £35, £45 and £55, and removal is £15.",
  ],
  [
    "How often do they need infilling?",
    "Every 2 to 3 weeks for most people. Your own lashes shed on their own cycle, and an infill replaces what has gone rather than starting again.",
  ],
  [
    "What is the difference between classic, hybrid and Russian volume?",
    "Classic puts one extension on one natural lash, for a defined but natural look. Russian volume uses several very fine extensions per lash, for a fuller line. Hybrid mixes the two.",
  ],
  [
    "Can I walk in without booking?",
    "Yes, and people do. We still suggest messaging first, because lash sets take an hour and the room may be busy.",
  ],
  [
    "Do you come to my home or hotel?",
    "No. Every treatment is done at the shop, with no exceptions.",
  ],
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/lash-extensions-kings-cross" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/lash-extensions-kings-cross",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function LashExtensionsKingsCrossPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Lash extensions</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Lash Extensions in <span className="text-gold whitespace-nowrap">King’s Cross</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-4 text-ink/80">
          <p>
            Our salon is on Caledonian Road, a {SITE.walkMinutes}-minute walk from King’s Cross
            station. We are open every day, {SITE.hours.replace("Mon – Sun ", "")}. Classic, hybrid
            and Russian volume sets take about an hour, and infills are quicker.
          </p>
          <p>
            Every option below shows its length and its price. Tapping one opens WhatsApp with those
            details already written, so you can ask about a time without filling in a form.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like lash extensions in King’s Cross. Please share availability.",
              SOURCE_LASH_LANDING,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-6 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
            WhatsApp us about lashes
          </a>
          <Link
            href="/services#cat-lashes"
            className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-gold/50"
          >
            See the full menu
          </Link>
        </div>

        <TreatwellFallback className="mt-4" />
      </header>

      <section aria-label="Choosing a lash set" className="max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Classic, hybrid or Russian volume</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Classic puts one extension on one of your own lashes. It reads as your own lashes on a
            good day, and it is where most people start.
          </p>
          <p>
            Russian volume uses several very fine extensions fanned onto each natural lash, which
            fills the gaps along the lash line and looks fuller from a distance. Hybrid mixes classic
            and volume across the eye, which gives texture rather than a uniform line.
          </p>
          <p>
            Weight matters more than length. A set that is too heavy for your own lashes will not last
            and is not kind to them, so your therapist will say what your lashes can carry and suggest
            the closest thing to the look you want.
          </p>
        </div>
      </section>

      <section aria-label="Lash extension sets and prices" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Sets, infills and removal</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{lashes.blurb}</p>
        <ServicePriceGrid services={lashes.services} source={SOURCE_LASH_LANDING} />
      </section>

      <section aria-label="Lash and brow treatments" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Tinting, perming and brows</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
          If extensions are more than you want, a lash perm and tint lifts and darkens what you have.
        </p>
        <ServicePriceGrid services={lashExtras} source={SOURCE_LASH_LANDING} />
        <p className="mt-8 text-xs leading-relaxed text-ink/50">
          Prices reflect our Treatwell listing and may change. Message us to confirm availability and
          the latest offers before your visit.
        </p>
      </section>

      <section aria-label="Your appointment and aftercare" className="mt-14 max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">On the day, and afterwards</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Come with clean lashes and no eye make-up if you can, because the adhesive needs a bare
            lash to hold. You lie with your eyes closed for the hour, and most people find it restful
            enough to doze.
          </p>
          <p>
            Keep them dry for the first 24 hours. After that, wash them gently with a lash cleanser,
            brush them through in the morning, and avoid oily eye make-up and remover, which loosens
            the adhesive. Rubbing your eyes and sleeping face-down are what cost most people a set
            early.
          </p>
          <p>
            Book an infill at 2 to 3 weeks rather than waiting until the set is sparse — infills are
            quicker and cost less than a new set. If your eyes feel sore or the skin along the lid
            reacts, come back and we will remove them, and see a doctor if it does not settle.
          </p>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-mist">{SITE.standardsNotice}</p>
      </section>

      <FaqPanel id="ls-faq" items={FAQ} />

      <section aria-label="Other treatments nearby" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">More at Taitam-D</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/nails-kings-cross"
              className="block rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-semibold text-ink">Nails in King’s Cross</span>
              <span className="mt-1 block text-sm text-ink/70">
                Manicures, pedicures, gel and extensions.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/facial-kings-cross"
              className="block rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-semibold text-ink">Facials in King’s Cross</span>
              <span className="mt-1 block text-sm text-ink/70">
                Deep cleansing, lifting and the Eberlin packages.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <CTA />
    </main>
  );
}
