import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/site";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";

/**
 * Two things about these cards, both of which used to be wrong (Q-SHOP-033 phase 2).
 *
 * They carry pictures now. This section was 794px of text cards with a bullet glyph, sitting
 * exactly where the home page should be selling treatments, while the eleven images that
 * match this brand's green and gold appeared only as 160px strips on /services/ and nowhere
 * else. Same pictures, cropped to landscape and recompressed for card size — the originals
 * are 900px square at around 100 KB each, which is the wrong shape and twice the weight for
 * a card this size, and this site serves images raw (no next/image optimisation under static
 * export), so nobody resizes them for us.
 *
 * The alt text is empty on purpose. These are generated images, and D-W22 forbids presenting
 * one as a photograph of our rooms — a rule this site has already broken once, when a hero
 * alt read "Serene Taitam-D massage room" over artwork. An empty alt on a decorative image
 * beside its own visible label is not a gap: the link's accessible name is the category, which
 * is the whole of what a screen reader needs here, and it makes the false claim impossible to
 * reintroduce by editing a string.
 */

// The category list and the menu anchors do not use the same slugs — "face" here is "facials"
// in the catalogue. Two names for one thing is exactly where a link quietly rots, so the
// mapping is written down once rather than assumed at each use.
const CARD = {
  massage: { img: "massage", anchor: "massage" },
  hair: { img: "hair", anchor: "hair" },
  face: { img: "facials", anchor: "facials" },
  nails: { img: "nails", anchor: "nails" },
  waxing: { img: "waxing", anchor: "waxing" },
  lashes: { img: "lashes", anchor: "lashes" },
} as const;

export default function ServicesPreview() {
  return (
    <section className="ui-section">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Service menu</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-ink leading-tight">
              Thai massage, facials, nails and <span className="text-gold">waxing</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-mist hover:text-ink transition"
          >
            See all categories <ArrowRight className="h-4 w-4 text-gold" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-9 md:mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {SERVICE_CATEGORIES.slice(0, 6).map((c, idx) => {
          const card = CARD[c.slug as keyof typeof CARD];
          if (!card) return null;
          return (
            <Reveal key={c.slug} delay={idx * 0.05}>
              <Link
                href={`/services#cat-${card.anchor}`}
                className="group block overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.04] transition-colors hover:border-gold/40"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/services/card/${card.img}.jpg`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    width={720}
                    height={480}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs tracking-[0.28em] uppercase text-mist">{c.title}</div>
                  <div className="mt-2 text-lg font-semibold leading-snug">{c.subtitle}</div>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm text-gold">
                    See prices
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
