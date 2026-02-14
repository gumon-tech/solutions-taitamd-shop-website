"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { ArrowUpRight } from "lucide-react";

type Tile = {
  src: string;
  alt: string;
  kicker: string;
  title: string;
  href: string;
  external?: boolean;
  variant: "hero" | "a" | "b" | "c" | "d" | "e";
};

const TILES: Tile[] = [
  // Row 1: 7 | 5
  {
    variant: "hero",
    src: "/images/gallery/massage-1600x900.jpg",
    alt: "Massage treatment",
    kicker: "Massage",
    title: "Deep relief — tailored to your body.",
    href: "/services",
  },
  {
    variant: "a",
    src: "/images/gallery/academy-tools-1200x800.jpg",
    alt: "Professional tools and hygiene standards",
    kicker: "Standards",
    title: "Hygiene-first practice, curated tools.",
    href: "/story",
  },

  // Row 2: 5 | 7
  {
    variant: "b",
    src: "/images/gallery/spa-1200x800.jpg",
    alt: "Spa atmosphere",
    kicker: "Atmosphere",
    title: "Quiet, warm, intentional — a calm oasis.",
    href: "/story",
  },
  {
    variant: "c",
    src: "/images/gallery/brow-1200x800.jpg",
    alt: "Brow & beauty detail",
    kicker: "Beauty",
    title: "Clean technique. Precise finishing.",
    href: "/services",
  },

  // Row 3: 6 | 6  (close story → close action)
  {
    variant: "e",
    src: "/images/gallery/our-story-1200x800.jpg",
    alt: "Inside TaiTam-D — calm, curated space",
    kicker: "Our Story",
    title: "Rooted in Thai tradition — refined in London.",
    href: "/story",
  },
  {
    variant: "d",
    src: "/images/gallery/giftcard-1200x800.jpg",
    alt: "Gift card",
    kicker: "Gift Card",
    title: "Personalised via WhatsApp — ready in minutes.",
    href: buildWhatsAppLink(SITE.whatsappTemplates.giftCard),
    external: true,
  },
];

function TileLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "block h-full rounded-[22px] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg0";
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

function tileClass(v: Tile["variant"]) {
  // Balanced editorial rhythm, NO row-span (no gaps)
  switch (v) {
    case "hero":
      return "md:col-span-7 h-[320px] md:h-[380px]";
    case "a":
      return "md:col-span-5 h-[260px] md:h-[380px]";

    case "b":
      return "md:col-span-5 h-[240px] md:h-[360px]";
    case "c":
      return "md:col-span-7 h-[240px] md:h-[360px]";

    case "e":
      // Our Story (left of last row)
      return "md:col-span-6 h-[240px] md:h-[360px]";
    case "d":
      // Gift Card (right of last row) — CTA close
      return "md:col-span-6 h-[240px] md:h-[360px]";

    default:
      return "md:col-span-6 h-[240px] md:h-[360px]";
  }
}

export default function Gallery() {
  return (
    <section className="ui-section scroll-mt-nav">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Inside TaiTam-D</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-ink leading-tight">
              A calm, curated <span className="text-gold">beauty ritual</span>.
            </h2>
            <p className="mt-4 text-sm md:text-base text-mist max-w-2xl">
              A few real moments — clean technique, soft lighting, and the details that make you feel taken care of.
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-12 grid md:grid-cols-12 gap-3">
          {TILES.map((t, i) => (
            <motion.div
              key={t.src}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className={[
                "relative overflow-hidden rounded-[22px] border border-ink/10 bg-ink/5 group",
                tileClass(t.variant),
              ].join(" ")}
            >
              <TileLink href={t.href} external={t.external}>
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  className={[
                    "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]",
                    // Give Gift Card slightly more presence (CTA close)
                    t.variant === "d" ? "opacity-[0.96]" : "opacity-[0.94]",
                  ].join(" ")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={t.variant === "hero"}
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,22,16,0.00),rgba(15,22,16,0.18)_45%,rgba(15,22,16,0.72))]" />

                <div className="absolute left-4 bottom-4 right-4">
                  <div className="flex items-end justify-between gap-3">
                    <div className="drop-shadow-[0_8px_22px_rgba(0,0,0,0.35)]">
                      <div className="text-[11px] tracking-[0.26em] uppercase text-white/75">
                        {t.kicker}
                      </div>
                      <div className="mt-1 text-sm md:text-base font-semibold leading-snug text-white/90">
                        {t.title}
                      </div>
                    </div>

                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/10 backdrop-blur-sm group-hover:bg-black/20 transition">
                      <ArrowUpRight className="h-5 w-5 text-gold" />
                    </span>
                  </div>
                </div>
              </TileLink>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
