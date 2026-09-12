import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * A wide band of the actual shop, between the treatment cards and the reviews.
 *
 * Every other picture above it on this page is generated artwork, and that is fine for
 * atmosphere but it cannot do the one job this band exists for: a visitor deciding whether to
 * walk into a basement-level salon in King's Cross wants to see the actual rooms. So these
 * three are photographs from the tour set, and the copy says out loud that they are ours —
 * which is a claim we are allowed to make only about real photographs (D-W22).
 *
 * The owner ruled out a new photo shoot on 2026-09-11: use what we have. These are phone
 * pictures with mixed lighting, which is exactly why they run at band height in a row of
 * three rather than one hero-sized crop — at this size the warmth reads as character, and at
 * full width the lighting would read as a mistake.
 */
// Chosen out of fifteen tour photographs, and the choosing is the work. The shop's rooms are
// painted with bright murals — beaches, mountains — which is genuinely what the place looks
// like but sits badly beside a green and gold page when it is a wall of cyan. These three
// carry the real character without fighting the palette: warm wood, a green mural, and the
// couples room with its Thai runner, which also happens to be a treatment worth showing.
const SHOTS = [
  { src: "/images/tour/band/treatment-room-wood-warm.jpg", alt: "A treatment room at Taitam-D, lit low and lined with warm wood" },
  { src: "/images/tour/band/treatment-room-forest-mural.jpg", alt: "A treatment room at Taitam-D with a lit bamboo mural along the wall" },
  { src: "/images/tour/band/thai-room-twin-beds.jpg", alt: "The couples room at Taitam-D, two beds dressed with Thai runners" },
];

export default function RoomBand() {
  return (
    <section className="ui-section" aria-labelledby="rooms-band">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs tracking-[0.28em] uppercase text-ink">Inside the shop</p>
          <h2 id="rooms-band" className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] leading-tight">
            These are our <span className="text-gold">rooms</span>
          </h2>
          <p className="mt-4 max-w-prose text-ink/80">
            Photographed room by room, in the order you meet them walking in. You cannot see in
            from the pavement, so we would rather you saw it here first.
          </p>
        </div>
        <Link
          href="/tour"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:border-gold/50"
        >
          Take the tour
          <ArrowUpRight className="h-4 w-4 text-gold" />
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {SHOTS.map((s) => (
          <div key={s.src} className="overflow-hidden rounded-2xl border border-ink/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt={s.alt}
              loading="lazy"
              width={720}
              height={540}
              className="h-56 w-full object-cover md:h-72"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
