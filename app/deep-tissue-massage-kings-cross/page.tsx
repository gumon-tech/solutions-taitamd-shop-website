import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import ServicePriceGrid from "@/components/ServicePriceGrid";
import FaqPanel from "@/components/FaqPanel";
import TreatwellFallback from "@/components/TreatwellFallback";
import CTA from "@/components/CTA";
import { CATALOG } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink, SOURCE_DEEP_TISSUE_LANDING } from "@/lib/whatsapp";

// The firm-pressure half of the massage menu, selected by name from the catalogue so the
// prices on this page cannot drift from /services/ (Q-MKT-079 group A). Hot Stone is here
// because people book it for the same reason — heat instead of pressure, same tight back.
const FIRM_PRESSURE = ["Deep Tissue Massage", "Thai Combination Massage", "Swedish Massage", "Hot Stone Massage"];
const massage = CATALOG.find((c) => c.slug === "massage")!;
const services = FIRM_PRESSURE.map((n) => massage.services.find((s) => s.name === n)!).filter(Boolean);

const TITLE = "Deep Tissue Massage in King's Cross, London | Taitam-D";
const DESCRIPTION =
  `Deep tissue and sports massage in King's Cross, a ${SITE.walkMinutes}-minute walk from the station. Open every day. Message us on WhatsApp to check availability.`;

// Answers come from the shop, not from this page. OFFICE counted the questions across 51
// enquiries between 20 August and 8 September 2026 and marked which answers it could stand
// behind; the two it could not — card payment and gift cards — are not here (Q-MKT-079).
const FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much is an hour of deep tissue massage?",
    "A 60-minute deep tissue massage is £69. Thai Combination and Aromatherapy are also £69, Swedish is £59 and Hot Stone is £74. Every length and price is listed on this page.",
  ],
  [
    "Which massage do most people book?",
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
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/deep-tissue-massage-kings-cross" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/deep-tissue-massage-kings-cross",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function DeepTissueKingsCrossPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Deep tissue massage</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Deep Tissue Massage in <span className="text-gold whitespace-nowrap">King’s Cross</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-4 text-ink/80">
          <p>
            Our treatment rooms are on Caledonian Road, a {SITE.walkMinutes}-minute walk from
            King’s Cross station. We are open every day, {SITE.hours.replace("Mon – Sun ", "")}.
            Deep tissue is the firmest work on our menu, and it is what most people ask for after
            a week at a desk or a long run.
          </p>
          <p>
            Every treatment below shows its length and its price. Tapping one opens WhatsApp with
            those details already written, so you can ask about a time without filling in a form.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like a deep tissue massage in King’s Cross. Please share availability.",
              SOURCE_DEEP_TISSUE_LANDING,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-6 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
            WhatsApp us about deep tissue
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

      <section aria-label="What deep tissue massage is for" className="max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">What deep tissue work is for</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Deep tissue massage uses slower strokes and firmer pressure than a relaxing massage. The
            therapist works along the muscle rather than across it, and stays on one area longer.
            People book it to ease tight shoulders, a stiff lower back, or legs that feel heavy after
            training.
          </p>
          <p>
            Firm does not mean painful. Tell your therapist how the pressure feels and they will
            adjust it, and say so before you start if you have an injury, a recent operation, or a
            condition that affects your skin or circulation. We are a massage and beauty salon, not a
            clinic, so we will suggest you see a doctor when that is the right answer.
          </p>
          <p>
            If you are not sure whether deep tissue is the right choice, message us and describe what
            is bothering you. Thai Combination adds stretching, Swedish is gentler throughout, and Hot
            Stone uses heat to reach the same tension with less pressure.
          </p>
        </div>
      </section>

      <section aria-label="Deep tissue and firm pressure treatments" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Treatments and prices</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
          Deep tissue and the treatments people choose alongside it. The full massage menu, including
          Aromatherapy and Thai Foot, is on the services page.
        </p>
        <ServicePriceGrid services={services} source={SOURCE_DEEP_TISSUE_LANDING} />
        <p className="mt-8 text-xs leading-relaxed text-ink/50">
          Prices reflect our Treatwell listing and may change. Message us to confirm availability and
          the latest offers before your visit.
        </p>
      </section>

      <section aria-label="Your first visit" className="mt-14 max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">What happens on your first visit</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Come a few minutes early if you can. We will ask what you want worked on, whether anything
            hurts, and how firm you like the pressure. That conversation takes a minute and it is the
            part that makes the hour work.
          </p>
          <p>
            You are given privacy to undress. Underwear is worn throughout, and you are covered with a
            towel at all times, with only the area being worked on uncovered. Our therapists do not
            treat intimate areas.
          </p>
          <p>
            Afterwards, drink some water and give the muscles a day before anything strenuous. Some
            people feel a little tender the next day, in the way you do after exercise. If you would
            like the same therapist next time, tell us and we will note it.
          </p>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-mist">{SITE.standardsNotice}</p>
      </section>

      <FaqPanel id="dt-faq" items={FAQ} />

      <section aria-label="Other treatments nearby" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">More at Taitam-D</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/massage-kings-cross"
              className="block rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-semibold text-ink">Thai massage in King’s Cross</span>
              <span className="mt-1 block text-sm text-ink/70">
                The whole massage menu, including Thai, Aromatherapy and Thai Foot.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/signature"
              className="block rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-semibold text-ink">Taitam-D Signature</span>
              <span className="mt-1 block text-sm text-ink/70">
                Thai, deep tissue and aromatherapy blended into one treatment.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <CTA />
    </main>
  );
}
