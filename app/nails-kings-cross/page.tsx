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
import { buildWhatsAppLink, SOURCE_NAILS_LANDING } from "@/lib/whatsapp";

const nails = CATALOG.find((c) => c.slug === "nails")!;

// 33 rows in one list is a menu nobody reads to the end, so the page groups them the way a
// visitor decides: hands, feet, both together, extensions, and the removals and add-ons that
// only make sense once you have had one of the others. Every group is a filter over the same
// catalogue entry — no price is written on this page (Q-MKT-079).
//
// The five filters partition the category exactly: 33 rows in, 33 rendered, none twice and
// none dropped. Checked, because a filter that quietly loses a row shows a shorter menu and
// nothing else — no error, no gap, just a treatment the visitor never learns we do.
const has = (s: { name: string }, ...words: string[]) => words.some((w) => s.name.includes(w));
const both = nails.services.filter((s) => has(s, "Manicure & Pedicure"));
const hands = nails.services.filter((s) => has(s, "Manicure") && !has(s, "Manicure & Pedicure") && !has(s, "Extension"));
const feet = nails.services.filter((s) => has(s, "Pedicure", "Foot Care") && !has(s, "Manicure & Pedicure"));
const extensions = nails.services.filter((s) => has(s, "Full Set", "Infill", "Extension"));
const extras = nails.services.filter(
  (s) => has(s, "Removal", "Hand Treatment") && !has(s, "Full Set", "Infill", "Extension"),
);

const TITLE = "Nails and Pedicure in King's Cross, London | Taitam-D";
const DESCRIPTION =
  `Manicures, pedicures, gel and nail extensions in King's Cross, a ${SITE.walkMinutes}-minute walk from the station. Open every day. Message us on WhatsApp to check availability.`;

const FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much is a manicure or pedicure?",
    "A classic manicure with polish is £20 and with gel it is £30. A classic pedicure with polish is £30 and with gel it is £40. Spa versions and manicure-and-pedicure bookings are priced on this page.",
  ],
  [
    "How long does gel last?",
    "Usually 2 to 3 weeks on hands and longer on toes. Extensions are normally infilled at about 3 weeks rather than replaced.",
  ],
  [
    "Do you remove gel or extensions from somewhere else?",
    "Yes. Gel removal is £10 and extension removal is £20, and both can be booked with a new set in the same appointment at a lower combined price.",
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
  alternates: { canonical: "/nails-kings-cross" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/nails-kings-cross",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function NailsKingsCrossPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-ink">Nails</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Nails and Pedicure in <span className="text-gold whitespace-nowrap">King’s Cross</span>
        </h1>

        <div className="mt-5 max-w-2xl space-y-4 text-ink/80">
          <p>
            Our salon is on Caledonian Road, a {SITE.walkMinutes}-minute walk from King’s Cross
            station. We are open every day, {SITE.hours.replace("Mon – Sun ", "")}. Manicures,
            pedicures, gel and extensions, from a 15-minute tidy-up to a spa manicure and pedicure
            together.
          </p>
          <p>
            Every option below shows its length and its price. Tapping one opens WhatsApp with those
            details already written, so you can ask about a time without filling in a form.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like a nail appointment in King’s Cross. Please share availability.",
              SOURCE_NAILS_LANDING,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-6 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
          >
            <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
            WhatsApp us about nails
          </a>
          <Link
            href="/services#cat-nails"
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
          src="/images/landing/nails.jpg"
          alt="A nail technician filing a client's nail at a manicure table"
          width={1200}
          height={805}
          sizes="(max-width: 768px) 100vw, 720px"
          className="mt-8 w-full max-w-3xl rounded-[24px] border border-ink/10 object-cover shadow-[0_18px_44px_rgba(5,32,12,0.28)]"
        />
      </header>

      <section aria-label="Choosing a treatment" className="max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Classic, spa, gel or extensions</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            A classic manicure is shape, cuticles and a tidy finish. A spa manicure adds an exfoliating
            scrub, a mask and a hand massage, and takes about twice as long. The same difference
            applies to the pedicures.
          </p>
          <p>
            Gel is cured under a UV lamp and stays glossy for 2 to 3 weeks, which is why most people
            choose it over polish for hands. Polish is quicker and easier to change at home, and it is
            the better choice if you like a different colour every fortnight.
          </p>
          <p>
            Extensions come as acrylic or fibre gel, both at the same price. After about 3 weeks the
            usual next appointment is an infill rather than a new set, which costs less and is kinder
            to the nail underneath. If you arrive with gel or extensions from elsewhere, we can remove
            them and start fresh in one booking.
          </p>
        </div>
      </section>

      <section aria-label="Manicures" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Hands</h2>
        <ServicePriceGrid services={hands} source={SOURCE_NAILS_LANDING} />
      </section>

      <section aria-label="Pedicures" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Feet</h2>
        <ServicePriceGrid services={feet} source={SOURCE_NAILS_LANDING} />
      </section>

      <section aria-label="Manicure and pedicure together" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Both together</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
          Booked as a pair, in one appointment, for less than the two separately.
        </p>
        <ServicePriceGrid services={both} source={SOURCE_NAILS_LANDING} />
      </section>

      <section aria-label="Nail extensions" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Extensions and infills</h2>
        <ServicePriceGrid services={extensions} source={SOURCE_NAILS_LANDING} />
      </section>

      <section aria-label="Removals and hand treatments" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">Removals and hand care</h2>
        <ServicePriceGrid services={extras} source={SOURCE_NAILS_LANDING} />
        <p className="mt-8 text-xs leading-relaxed text-ink/50">
          Prices reflect our Treatwell listing and may change. Message us to confirm availability and
          the latest offers before your visit.
        </p>
      </section>

      <section aria-label="Looking after your nails" className="mt-14 max-w-2xl">
        <h2 className="text-2xl font-semibold md:text-3xl">Making it last</h2>
        <div className="mt-4 space-y-4 text-ink/80">
          <p>
            Gel is set hard when you leave, so there is no drying time. Polish needs a careful hour,
            and we would rather you sat with a tea than caught a nail on a coat sleeve.
          </p>
          <p>
            Cuticle oil once a day does more for how a manicure ages than anything else. Picking gel
            off takes the top layer of the nail with it, which is what leaves nails thin — book a
            removal instead, it takes 15 minutes.
          </p>
          <p>
            Tell your therapist if a nail is sore, lifting, or has changed colour, and we will look
            before we work. Anything that needs a doctor rather than a salon, we will say so.
          </p>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-mist">{SITE.standardsNotice}</p>
      </section>

      <FaqPanel id="nl-faq" items={FAQ} />

      <section aria-label="Other treatments nearby" className="mt-14">
        <h2 className="text-2xl font-semibold md:text-3xl">More at Taitam-D</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/waxing-kings-cross"
              className="block rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5 transition-colors hover:border-gold/40"
            >
              <span className="font-semibold text-ink">Waxing in King’s Cross</span>
              <span className="mt-1 block text-sm text-ink/70">
                Face and body, for women and men.
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
