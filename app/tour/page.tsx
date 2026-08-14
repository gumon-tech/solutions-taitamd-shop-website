import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import { TOUR, TOUR_SHOT_COUNT } from "@/lib/tour";

const TITLE = "Inside the Shop — Taitam-D Beauty & Spa, King's Cross";
const DESCRIPTION =
  "A room-by-room look inside Taitam-D Beauty & Spa on Caledonian Road: the painted lounge, the massage rooms, the pedicure row, the sauna and the way through.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tour" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tour",
    images: ["/images/tour/lounge-beach-mural-wide.jpg"],
  },
};

export default function TourPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-12">
      <header className="pt-8 pb-10 md:pt-10">
        <p className="text-xs uppercase tracking-[0.28em] text-mist">Inside the shop</p>
        <h1 className="mt-3 text-4xl font-semibold leading-[1.05] md:text-6xl">
          You cannot see in <span className="text-gold">from the pavement.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-ink/80">
          So here is the whole place, room by room — {TOUR_SHOT_COUNT} photographs, in the order you meet them
          walking in. Every one is a photograph of these rooms as they are.
        </p>
      </header>

      <div className="space-y-16 md:space-y-24">
        {TOUR.map((zone, zi) => (
          <Reveal key={zone.id}>
            <section aria-labelledby={`zone-${zone.id}`}>
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">{zone.kicker}</p>
                <h2
                  id={`zone-${zone.id}`}
                  className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] md:text-3xl"
                >
                  {zone.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/75 md:text-base">{zone.intro}</p>
              </div>

              <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {zone.shots.map((shot, si) => {
                  const first = zi === 0 && si === 0;
                  return (
                    <li
                      key={shot.src}
                      className={
                        shot.orientation === "landscape"
                          ? "sm:col-span-2"
                          : undefined
                      }
                    >
                      <figure className="group">
                        <div
                          className={`relative overflow-hidden rounded-[22px] border border-ink/10 bg-ink/5 ${
                            shot.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]"
                          }`}
                        >
                          <Image
                            src={shot.src}
                            alt={shot.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            /* Only the very first image is eager: the rest of the page is
                               below the fold and the site serves images unoptimised. */
                            priority={first}
                            loading={first ? undefined : "lazy"}
                          />
                        </div>
                        <figcaption className="mt-2 text-[13px] leading-relaxed text-mist">
                          {shot.caption}
                        </figcaption>
                      </figure>
                    </li>
                  );
                })}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="mt-16 rounded-[28px] border border-ink/10 bg-ink/5 p-7 md:mt-24 md:p-9">
          <p className="text-xs uppercase tracking-[0.28em] text-mist">Come and see it</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            72-74 Caledonian Road, King&apos;s Cross
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75">
            Open daily, 10:30am to 9:00pm. Availability changes through the day, so message us before you set
            off and we will tell you what is free.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:opacity-90"
            >
              Book a treatment
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold transition hover:bg-ink/5"
            >
              See the menu
            </Link>
          </div>
        </section>
      </Reveal>

      <CTA />
    </main>
  );
}
