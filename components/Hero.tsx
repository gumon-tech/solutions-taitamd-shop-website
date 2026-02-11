"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Clock3, PhoneCall } from "lucide-react";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";
import SocialShareBar from "./SocialShareBar";

export default function Hero() {
  return (
    <section className="pt-28 md:pt-32 pb-10 md:pb-16 relative">
      <div className="absolute inset-x-0 -top-12 h-40 pointer-events-none">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="h-full rounded-[28px] bg-gradient-to-r from-gold/10 via-white/5 to-rose/10 border border-white/10 blur-[0px]" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-xs tracking-[0.32em] uppercase text-mist">
              King’s Cross • London
            </p>
            <h1 className="mt-4 text-5xl md:text-7xl font-semibold leading-[0.98]">
              Luxury Thai‑inspired{" "}
              <span className="text-gold">beauty & wellness</span>.
            </h1>
            <p className="mt-6 text-base md:text-lg text-mist max-w-2xl">
              A calm oasis in King’s Cross — massage, hair, nails, waxing and facials. Thoughtful technique, gentle atmosphere.
              Book online in seconds.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/book"
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/12 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition shadow-glow"
            >
              Special Offer <ArrowUpRight className="h-4 w-4 text-gold" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-transparent border border-white/12 px-5 py-3 text-sm font-semibold hover:bg-white/5 transition"
            >
              View Service Menu
            </Link>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={SITE.academy}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/90 hover:bg-white/10 transition"
            >
              Academy <ArrowUpRight className="h-4 w-4 text-gold" />
            </a>
            <a
              href={buildWhatsAppLink(SITE.whatsappTemplates.giftCard)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/90 hover:bg-white/10 transition"
            >
              Gift Card (WhatsApp) <ArrowUpRight className="h-4 w-4 text-gold" />
            </a>
          </div>


          <div className="mt-6">
            <SocialShareBar
              compact
              className="opacity-90"
/>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              { icon: MapPin, label: "Address", value: SITE.address },
              { icon: Clock3, label: "Hours", value: SITE.hours },
              { icon: PhoneCall, label: "Phone", value: SITE.phone }
            ].map((i, idx) => (
              <motion.div
                key={i.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 + idx * 0.08 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-mist">
                  <i.icon className="h-4 w-4 text-gold" />
                  {i.label}
                </div>
                <div className="mt-2 text-sm text-ink/95 leading-snug">{i.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 18, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative"
          >
            <div className="glass rounded-[28px] p-5 shadow-glow overflow-hidden">
              <div className="relative rounded-[22px] overflow-hidden border border-white/10">
                <Image src="/images/hero/hero-16x9-1600x900.jpg" alt="Luxury spa waiting area" fill priority className="object-cover opacity-[0.33]" />
                <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_20%_10%,rgba(214,179,106,0.35),rgba(0,0,0,0)),radial-gradient(600px_420px_at_85%_25%,rgba(127,163,138,0.18),rgba(0,0,0,0)),linear-gradient(135deg,rgba(0,0,0,0.35),rgba(255,255,255,0.02))]" />
                <div className="relative p-6 md:p-7">
                  <div className="text-xs tracking-[0.32em] uppercase text-mist">Signature experience</div>
                  <div className="mt-3 text-2xl font-semibold leading-tight">
                    Deep relief, soft luxury.
                  </div>
                  <p className="mt-3 text-sm text-mist leading-relaxed">
                    Thai + Deep Tissue + Aromatherapy blends — tailored to your body. Clean, modern interiors inspired by Thai tradition.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { k: "4.7/5", v: "rating on Treatwell" },
                      { k: "6k+", v: "reviews" },
                      { k: "5 min", v: "from King’s Cross" },
                      { k: "Mon–Sun", v: "open daily" }
                    ].map((b) => (
                      <div key={b.k} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                        <div className="text-xl font-semibold text-gold">{b.k}</div>
                        <div className="text-xs text-mist mt-1">{b.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-mist">
                <span>Booking & payments are handled securely via Treatwell.</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 animate-floaty">
                  ✦
                </span>
              </div>
            </div>

            <div className="absolute -z-10 -inset-6 blur-2xl opacity-50 bg-[radial-gradient(closest-side,rgba(214,179,106,0.25),rgba(0,0,0,0))]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
