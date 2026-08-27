"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Clock3, PhoneCall, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import Reveal from "./Reveal";
import { buildWhatsAppLink, SOURCE_HOME } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section className="ui-section-hero">
      <div className="absolute inset-x-0 -top-12 h-40 pointer-events-none">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="h-full rounded-[28px] bg-gradient-to-r from-gold/10 via-white/5 to-rose/10 border border-ink/10 blur-[0px]" />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="ui-kicker">King’s Cross • London</p>
            <h1 className="ui-h1">
              Luxury Thai‑inspired{" "}
              <span className="text-gold">beauty & wellness</span>.
            </h1>
            <p className="ui-lead">
              A calm oasis in King’s Cross — massage, hair, nails, waxing and facials. Thoughtful technique, gentle atmosphere.
              Message us on WhatsApp and we’ll help you find the right treatment.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={buildWhatsAppLink(
                "Hi Taitam-D, I’d like to book a treatment. Please share availability and current offers.",
                SOURCE_HOME,
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-shine btn-epic inline-flex items-center justify-center gap-2 rounded-2xl bg-ink/5 border border-ink/12 px-5 py-3 text-sm font-semibold hover:bg-ink/8 transition shadow-glow"
            >
              <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp to book <ArrowUpRight className="h-4 w-4 text-gold" />
            </Link>
            <Link
              href="#promotions"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-transparent border border-ink/12 px-5 py-3 text-sm font-semibold hover:bg-ink/5 transition"
            >
              See promotions
            </Link>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-mist">{SITE.standardsNotice}</p>

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
              <div className="relative rounded-[22px] overflow-hidden border border-ink/10">
                {/* The picture behind this card is generated artwork, not one of our rooms.
                    Its alt text used to read "Serene Taitam-D massage room", which asserted
                    the opposite in the one layer nobody looks at — D-W22 forbids exactly that
                    claim. The image itself stays until a real photograph replaces it
                    (Q-SHOP-020, ruled by WS); the false claim did not have to wait. */}
                <Image src="/images/hero/taitamd-gemini-hero.jpg" alt="Softly lit massage room with warm natural light" fill priority className="object-cover opacity-[0.78]" />
                <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_20%_10%,rgba(200,176,124,0.2),rgba(0,0,0,0)),radial-gradient(600px_420px_at_85%_25%,rgba(127,155,82,0.16),rgba(0,0,0,0)),linear-gradient(135deg,rgba(15,51,20,0.62),rgba(11,42,16,0.38))]" />
                <div className="relative p-6 md:p-7">
                  <div className="text-xs tracking-[0.32em] uppercase text-ink/72">Signature experience</div>
                  <div className="mt-3 text-2xl font-semibold leading-tight text-ink/95">
                    Deep relief, soft luxury.
                  </div>
                  <p className="mt-3 text-sm text-ink/82 leading-relaxed">
                    Thai + Deep Tissue + Aromatherapy blends — tailored to your body. Clean, modern interiors inspired by Thai tradition.
                  </p>

                  {/* This card has said "Signature experience" since long before the
                      treatment had a page. Now that it has one, the label is a way in
                      rather than a dead end — the page was otherwise reachable only from
                      the ad. */}
                  <Link
                    href="/signature"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-ink"
                  >
                    Taitam-D Signature — £69 / 60 min
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { k: "Since", v: "2009" },
                      { k: "5 min", v: "from King’s Cross" },
                      { k: "Daily", v: "10:30am – 9pm" },
                      { k: "WhatsApp", v: "fast replies" }
                    ].map((b) => (
                      <div key={b.k} className="rounded-2xl bg-black/16 border border-white/14 p-4">
                        <div className="text-xl font-semibold text-gold">{b.k}</div>
                        <div className="text-xs text-ink/76 mt-1">{b.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-ink/72">
                <span>Reserve by WhatsApp · {SITE.whatsappDisplay}</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/16 border border-white/14 animate-floaty">
                  ✦
                </span>
              </div>
            </div>

            <div className="absolute -z-10 -inset-6 blur-2xl opacity-55 bg-[radial-gradient(closest-side,rgba(201,176,122,0.24),rgba(0,0,0,0))]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
