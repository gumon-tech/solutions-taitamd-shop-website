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
import { buildWhatsAppLink, SOURCE_WAXING_LANDING } from "@/lib/whatsapp";

const waxing = CATALOG.find((c) => c.slug === "waxing")!;

// Split by who the row is for, because that is how people read a waxing menu, and because
// the men's rows were otherwise buried under ten ladies' rows on a page men also land on.
// Both halves come from the same catalogue entry — no price is written here (Q-MKT-079).
const ladies = waxing.services.filter((s) => s.name.startsWith("Ladies"));
const mens = waxing.services.filter((s) => s.name.startsWith("Men"));

const TITLE = "Waxing in King's Cross, London | Taitam-D";
const DESCRIPTION =
  `Waxing for women and men in King's Cross, a ${SITE.walkMinutes}-minute walk from the station. Hollywood, Brazilian, legs, arms and face. Message us on WhatsApp to check availability.`;

const FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much is a Hollywood or Brazilian wax?",
    "A Hollywood is £40 for 40 minutes and a Brazilian is £35 for 30 minutes. Booked with a full leg wax, the Hollywood is £70 and the Brazilian is £65. Every area and price is listed on this page.",
  ],
  [
    "How long should the hair be?",
    "About the length of a grain of rice, which is usually 2 to 3 weeks of growth. Shorter than that and the wax has nothing to hold; much longer is fine, and we can trim it first.",
  ],
  [
    "Do you wax men as well?",
    "Yes. Back, shoulder and chest waxing are on this page, and intimate waxing for men is by arrangement — please call before booking that one.",
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
  alternates: { canonical: "/waxing-kings-cross" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/waxing-kings-cross",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function WaxingKingsCrossPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-ink">Waxing</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Waxing in <span className="text-gold whitespace-nowrap">King’s Cross</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-4 text-ink/80">
          <p>
            Our treatment rooms are on Caledonian Road, a {SITE.walkMinutes}-minute walk from
            King’s Cross station. We are open every day, {SITE.hours.replace("Mon – Sun ", "")}.
            We wax face and body for women and men, from an upper lip to a Hollywood, in a private
            room with the door closed.
          </p>
          <p>
            Every area below shows its length and its price. Tapping one opens WhatsApp with those
            details already written, so you can ask about a time without filling in a form.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like a waxing appointment in King’s Cross. Please share availability.",
              SOURCE_WAXING_LANDING,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-6 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
            WhatsApp us about waxing
          </a>
          <Link
            href="/services#cat-waxing"
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
          src="/images/landing/waxing.jpg"
          alt="A gloved hand smoothing a wax strip along a client's lower leg"
          width={1200}
          height={805}
          sizes="(max-width: 768px) 100vw, 720px"
          className="mt-8 w-full max-w-3xl rounded-[24px] border border-ink/10 object-cover shadow-[0_18px_44px_rgba(5,32,12,0.28)]"
        />
      </header>

      <section aria-label="Before your appointment" className="max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Before you come in</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Let the hair grow to about the length of a grain of rice, which is usually 2 to 3 weeks.
            Wax needs something to hold on to, and a very short regrowth is the most common reason a
            wax does not last. If it has grown longer than that, come anyway and we will trim first.
          </p>
          <p>
            Avoid scrubs, retinol and strong acids on the area for a couple of days beforehand, and
            skip the sunbed. Tell your therapist if you are using anything prescribed for your skin,
            or if you are pregnant, because both change what we recommend on the day.
          </p>
          <p>
            Waxing is more comfortable when you are not rushing. Give yourself a few minutes either
            side, and say if you would like us to work more slowly or take a break — every therapist
            here would rather stop for a moment than have you grit your teeth through it.
          </p>
        </div>
      </section>

      <section aria-label="Waxing for women" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Waxing for women</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
          Face, arms, legs and bikini, with the combined bookings priced below the two separate ones.
        </p>
        <ServicePriceGrid services={ladies} source={SOURCE_WAXING_LANDING} />
      </section>

      <section aria-label="Waxing for men" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Waxing for men</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
          Back, shoulders and chest, with intimate waxing by arrangement.
        </p>
        <ServicePriceGrid services={mens} source={SOURCE_WAXING_LANDING} />
        <p className="mt-8 text-xs leading-relaxed text-ink/60">
          Prices reflect our Treatwell listing and may change. Message us to confirm availability and
          the latest offers before your visit.
        </p>
      </section>

      <section aria-label="Aftercare" className="mt-14 max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Afterwards</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            The skin often stays pink for a few hours, and sometimes a day. For the first 24 hours,
            leave hot baths, saunas, swimming pools and the gym alone, and keep perfumed products off
            the area.
          </p>
          <p>
            From about the third day, exfoliating gently two or three times a week is what keeps hairs
            from growing back into the skin. Waxing every 3 to 4 weeks keeps you on the same growth
            cycle, which is what makes each appointment quicker than the last.
          </p>
          <p>
            If anything looks inflamed rather than pink, or does not settle in a day or two, speak to
            a pharmacist or your doctor. We are a salon and we will tell you when something is outside
            what we can help with.
          </p>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-mist">{SITE.standardsNotice}</p>
      </section>

      <FaqPanel id="wx-faq" items={FAQ} />

      <section aria-label="Other treatments nearby" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">More at Taitam-D</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
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
        </ul>
      </section>

      <CTA />
    </main>
  );
}
