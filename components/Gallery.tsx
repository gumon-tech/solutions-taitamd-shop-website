"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const IMAGES: Array<{ src: string; alt: string }> = [
  { src: "/images/gallery/massage-1600x900.jpg", alt: "Massage treatment" },
  { src: "/images/gallery/brow-1200x800.jpg", alt: "Brow & beauty detail" },
  { src: "/images/gallery/lashes-1200x800.jpg", alt: "Eyelash service detail" },
  { src: "/images/gallery/our-story-1200x800.jpg", alt: "Spa atmosphere" },
  { src: "/images/gallery/giftcard-1200x800.jpg", alt: "Gift card" }
];

export default function Gallery() {
  return (
    <section className="py-10 md:py-14">
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
          {IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className={[
                "relative overflow-hidden rounded-[22px] border border-white/10 bg-white/5",
                i === 0
                  ? "md:col-span-7 md:row-span-2 h-[360px] md:h-[520px]"
                  : i === 1 || i === 2
                    ? "md:col-span-5 h-[250px] md:h-[250px]"
                    : "md:col-span-6 h-[220px] md:h-[360px]"   // ✅ คู่ล่างใหญ่ขึ้น + เต็มแถวล่าง
              ].join(" ")}

            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover opacity-[0.92] transition-transform duration-700 ease-out hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.55))]" />
              <div className="absolute left-4 bottom-4 right-4">
                <div className="text-xs tracking-[0.24em] uppercase text-ink/80">
                  {img.alt}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
