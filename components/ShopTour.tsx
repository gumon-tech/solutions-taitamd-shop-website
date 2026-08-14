import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { TOUR_SHOT_COUNT } from "@/lib/tour";

// Kru Nok asked for the shop itself on the front page (brief of 2026-08-14): people
// walking past cannot see in, and the photographs were doing nothing while they sat in
// a folder. This is the doorway to /tour, not the tour — four rooms that look nothing
// like each other, which is the thing worth noticing about the place.
//
// 🔴 Real photographs only, per D-W22. Do not swap any of these for a generated image.
const PREVIEW = [
  {
    src: "/images/tour/lounge-beach-mural-wide.jpg",
    alt: "The waiting lounge at Taitam-D, painted wall to wall with a tropical beach, with leather armchairs",
    label: "The lounge",
    span: true,
  },
  {
    src: "/images/tour/thai-room-twin-beds.jpg",
    alt: "The couples' Thai massage room with twin beds, purple covers and gold Thai silk runners",
    label: "The couples' room",
  },
  {
    src: "/images/tour/pedicure-spa-chairs.jpg",
    alt: "Pedicure spa chairs with cushions and green towels beside a mirrored styling station",
    label: "The pedicure row",
  },
  {
    src: "/images/tour/treatment-room-wood-warm.jpg",
    alt: "A single treatment room panelled in dark wood, lit by one warm lamp",
    label: "A treatment room",
  },
  {
    src: "/images/tour/salon-lavender-mural.jpg",
    alt: "A salon styling chair in front of a wall-length photographic mural of a lavender field",
    label: "The salon",
  },
];
// Five tiles, not four: the wide one takes two columns, so four leaves a hole in the
// bottom-right of the three-column grid. Five fills both rows exactly.

export default function ShopTour() {
  return (
    <Reveal>
      <section className="ui-section" aria-labelledby="shop-tour">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Inside the shop</p>
            <h2
              id="shop-tour"
              className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl"
            >
              No two rooms <span className="text-gold">look alike.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist md:text-base">
              One faces a painted lagoon, one an autumn forest, one a field of lavender. Have a look before you
              come — you cannot see any of it from the pavement.
            </p>
          </div>
          <Link
            href="/tour"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold transition hover:bg-ink/5"
          >
            All {TOUR_SHOT_COUNT} photographs
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PREVIEW.map((p) => (
            <li key={p.src} className={p.span ? "lg:col-span-2" : undefined}>
              <Link href="/tour" className="group block">
                <div
                  className={`relative overflow-hidden rounded-[22px] border border-ink/10 bg-ink/5 ${
                    p.span ? "aspect-[16/10]" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 text-sm font-semibold text-white">
                    {p.label}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}
