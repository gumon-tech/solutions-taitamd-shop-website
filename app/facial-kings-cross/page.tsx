import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import ServicePriceGrid from "@/components/ServicePriceGrid";
import FaqPanel from "@/components/FaqPanel";
import TreatwellFallback from "@/components/TreatwellFallback";
import CTA from "@/components/CTA";
import { CATALOG } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink, SOURCE_FACIAL_LANDING } from "@/lib/whatsapp";

// Whole category, straight from the catalogue (Q-MKT-079 group A). Unlike the deep tissue
// page there is nothing to select here: every facial we offer belongs on a facial page.
const facials = CATALOG.find((c) => c.slug === "facials")!;

const TITLE = "Facials in King's Cross, London | Taitam-D";
const DESCRIPTION =
  `Deep-cleansing, lifting and anti-ageing facials in King's Cross, a ${SITE.walkMinutes}-minute walk from the station. Open every day. Message us on WhatsApp to check availability.`;

// OFFICE's answers, from 51 enquiries between 20 August and 8 September 2026. Card payment
// and gift cards are absent because OFFICE could not confirm them, and an FAQ answer is a
// promise made in advance to somebody who cannot ask a follow-up question.
const FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much is a facial?",
    "Our Luxury Facial is £69 for 60 minutes. The Non-Surgical Face Lift Facial is £89, the Eberlin packages are £89, £99 and £120, and the 90-minute Anti-Ageing Facial is £120. Every option and price is listed on this page.",
  ],
  [
    "How long does a facial take?",
    "Most are 60 to 65 minutes. The Anti-Ageing Facial is 90 minutes and the Eberlin Gold package is 95 minutes.",
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
  alternates: { canonical: "/facial-kings-cross" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/facial-kings-cross",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function FacialKingsCrossPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-ink">Facials</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Facials in <span className="text-gold whitespace-nowrap">King’s Cross</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-4 text-ink/80">
          <p>
            Our treatment rooms are on Caledonian Road, a {SITE.walkMinutes}-minute walk from
            King’s Cross station. We are open every day, {SITE.hours.replace("Mon – Sun ", "")}.
            Facials here run from a straightforward deep cleanse to the Eberlin professional
            packages, and every one of them starts with a look at your skin rather than a script.
          </p>
          <p>
            Every treatment below shows its length and its price. Tapping one opens WhatsApp with
            those details already written, so you can ask about a time without filling in a form.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like a facial in King’s Cross. Please share availability.",
              SOURCE_FACIAL_LANDING,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-6 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
            WhatsApp us about a facial
          </a>
          <Link
            href="/services#cat-facials"
            className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink transition hover:border-gold/50"
          >
            See the full menu
          </Link>
        </div>

        <TreatwellFallback className="mt-4" />

        {/* The picture shows the treatment happening, not the room it happens in. Six landing
            pages carried no image at all until now while the ads pointed straight at them, and
            the six pictures already in the repo were empty rooms — which is the thing the owner
            objected to, not the absence (W-40, standing rule T18).

            The alt text describes what is in the frame and stops there. This image is generated,
            and D-W22 allows that anywhere so long as nothing calls it our room, our therapist or
            a real client of ours. */}
        <Image
          src="/images/landing/facial.jpg"
          alt="Cream being massaged along a client's cheek and jaw during a facial"
          width={1200}
          height={805}
          sizes="(max-width: 768px) 100vw, 720px"
          className="mt-8 w-full max-w-3xl rounded-[24px] border border-ink/10 object-cover shadow-[0_18px_44px_rgba(5,32,12,0.28)]"
        />
      </header>

      <section aria-label="Choosing a facial" className="max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Which facial to choose</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            If you have not had a facial with us before, the Luxury Facial is the usual starting
            point. It is a deep cleanse and deep hydration in an hour, and it suits most skin
            without any preparation beforehand.
          </p>
          <p>
            The Non-Surgical Face Lift Facial uses lifting and firming techniques and is the one
            people book before an event. The Anti-Ageing Facial takes 90 minutes and works on the
            look of fine lines. Neither is a medical procedure and neither involves needles.
          </p>
          <p>
            The four Eberlin packages use a professional skincare range: Equilibrium to calm and
            rebalance, Infinity for hydration and glow, White to even out tone, and Gold, the most
            indulgent of them, for radiance and firmness. Tell us what bothers you about your skin
            and we will say which of them fits, or say so if none of them does.
          </p>
        </div>
      </section>

      <section aria-label="Facial treatments and prices" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Facials and prices</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{facials.blurb}</p>
        <ServicePriceGrid services={facials.services} source={SOURCE_FACIAL_LANDING} />
        <p className="mt-8 text-xs leading-relaxed text-ink/60">
          Prices reflect our Treatwell listing and may change. Message us to confirm availability and
          the latest offers before your visit.
        </p>
      </section>

      <section aria-label="Your first visit" className="mt-14 max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">What happens on your first visit</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Come with clean skin if you can, though it is not a problem if you cannot — we cleanse
            first anyway. Tell your therapist about any allergies, recent skin treatments, or
            products you are using, especially retinol or acids, because they change what we use on
            the day.
          </p>
          <p>
            You lie covered and warm for the whole treatment. Most of the hour is cleansing,
            exfoliating, massage and a mask, and you can ask for less pressure or a quieter room at
            any point.
          </p>
          <p>
            Skin can look a little pink for an hour afterwards, which settles. We will tell you what
            we used, so you can keep to it at home or bring it up next time. If something on your
            skin needs a doctor rather than a therapist, we will say so.
          </p>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-mist">{SITE.standardsNotice}</p>
      </section>

      <FaqPanel id="fa-faq" items={FAQ} />

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
              href="/deep-tissue-massage-kings-cross"
              className="block rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-semibold text-ink">Deep tissue massage</span>
              <span className="mt-1 block text-sm text-ink/70">
                Firmer work for tight shoulders, backs and legs.
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <CTA />
    </main>
  );
}
