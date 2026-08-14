"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import Lightbox, { type LightboxShot } from "./Lightbox";
import { TOUR } from "@/lib/tour";

// The tour grid, split out of app/tour/page.tsx so the page itself can stay a server
// component and keep exporting `metadata`. Only the part that needs state lives here.
//
// The lightbox walks the whole tour, not one zone: someone who opens the first
// photograph and keeps swiping should end up at the last one, not stop at the end of
// "Where you wait". So every shot gets a flat index across all zones.
const FLAT: LightboxShot[] = TOUR.flatMap((z) =>
  z.shots.map((s) => ({ src: s.src, alt: s.alt, caption: s.caption }))
);

const flatIndex = (zoneIdx: number, shotIdx: number) =>
  TOUR.slice(0, zoneIdx).reduce((n, z) => n + z.shots.length, 0) + shotIdx;

export default function TourGallery() {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <>
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
                  const idx = flatIndex(zi, si);
                  return (
                    <li key={shot.src} className={shot.orientation === "landscape" ? "sm:col-span-2" : undefined}>
                      <figure className="group">
                        <button
                          type="button"
                          onClick={() => setOpenAt(idx)}
                          aria-label={`Open ${shot.caption ?? shot.alt} full screen`}
                          className={`relative block w-full cursor-zoom-in overflow-hidden rounded-[22px] border border-ink/10 bg-ink/5 ${
                            shot.orientation === "landscape" ? "aspect-[16/10]" : "aspect-[3/4]"
                          }`}
                        >
                          <Image
                            src={shot.src}
                            alt={shot.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            priority={first}
                            loading={first ? undefined : "lazy"}
                          />
                        </button>
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

      <Lightbox shots={FLAT} openAt={openAt} onClose={() => setOpenAt(null)} />
    </>
  );
}
