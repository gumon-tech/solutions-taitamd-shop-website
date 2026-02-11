"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { ArrowUpRight } from "lucide-react";

const TILES: Array<{
  src: string;
  alt: string;
  kicker: string;
  title: string;
  href: string;
  external?: boolean;
}> = [
  {
    src: "/images/gallery/massage-1600x900.jpg",
    alt: "Massage treatment",
    kicker: "Massage",
    title: "Deep relief — tailored to your body.",
    href: "/services",
  },
  {
    src: "/images/gallery/brow-1200x800.jpg",
    alt: "Brow & beauty detail",
    kicker: "Beauty",
    title: "Clean technique. Precise finishing.",
    href: "/services",
  },
  {
    src: "/images/gallery/lashes-1200x800.jpg",
    alt: "Eyelash service detail",
    kicker: "Details",
    title: "Small details — a big difference.",
    href: "/services",
  },
  {
    src: "/images/gallery/spa-1200x800.jpg",
    alt: "Spa atmosphere",
    kicker: "Atmosphere",
    title: "Quiet, warm, intentional — a calm oasis.",
    href: "/story",
  },
  {
    src: "/images/gallery/academy-tools-1200x800.jpg",
    alt: "Professional tools and hygiene standards",
    kicker: "Standards",
    title: "Hygiene-first practice, curated tools.",
    href: "/story",
  },
  {
    src: "/images/gallery/giftcard-1200x800.jpg",
    alt: "Gift card",
    kicker: "Gift Card",
    title: "Personalised via WhatsApp",
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
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block h-full">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="block h-full">
      {children}
    </Link>
  );
}

export default function Gallery() {
  return (
    <section className="ui-section scroll-mt-nav">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Inside TaiTam‑D</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
              A calm, curated <span className="text-gold">beauty ritual</span>.
            </h2>
            <p className="mt-4 text-sm md:text-base text-mist max-w-2xl">
              A few real moments — clean technique, soft lighting, and the details that make you feel taken care of.
            </p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-3">
          {TILES.map((t, i) => (
            <motion.div
              key={t.src}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className={[
                "relative overflow-hidden rounded-[22px] border border-ink/10 bg-ink/5 group",
                i === 0
                  ? "md:col-span-7 md:row-span-2 h-[360px] md:h-[520px]"
                  : i === 1 || i === 2
                    ? "md:col-span-5 h-[250px] md:h-[250px]"
                    : "md:col-span-6 h-[220px] md:h-[360px]",
              ].join(" ")}
            >
              <TileLink href={t.href} external={t.external}>
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  className="object-cover opacity-[0.92] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.62))]" />

                <div className="absolute left-4 bottom-4 right-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] tracking-[0.26em] uppercase text-ink/80">{t.kicker}</div>
                      <div className="mt-1 text-sm md:text-base font-semibold leading-snug">
                        {t.title}
                      </div>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/12 bg-ink/5 group-hover:bg-ink/8 transition">
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
