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
            {/* The H1 names the treatment and the place because that is the phrase people
                search (Q-MKT-077). The previous line, "Luxury Thai-inspired beauty &
                wellness", read well and said neither. The gold span keeps the visual
                rhythm the design had, moved onto the words that now carry the meaning. */}
            <h1 className="ui-h1">
              Thai massage and beauty in{" "}
              {/* nowrap because the line broke between "King's" and "Cross" at 1440 wide,
                  splitting the one phrase this heading exists to say. CSS, not a
                  non-breaking character — D-W10 was the reverse mistake, a U+2011 baked
                  into the brand string that then travelled into <title> and JSON-LD. */}
              <span className="text-gold whitespace-nowrap">King’s Cross</span>
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
              className="btn-shine btn-epic inline-flex items-center justify-center gap-2 rounded-2xl bg-ink/5 border border-ink/[0.12] px-5 py-3 text-sm font-semibold hover:bg-ink/[0.08] transition shadow-glow"
            >
              <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp to book <ArrowUpRight className="h-4 w-4 text-gold" />
            </Link>
            <Link
              href="#promotions"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-transparent border border-ink/[0.12] px-5 py-3 text-sm font-semibold hover:bg-ink/5 transition"
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
              <div className="rounded-[22px] overflow-hidden border border-[#d6c198]">
                {/* The picture behind this card is generated artwork, not one of our rooms.
                    Its alt text used to read "Serene Taitam-D massage room", which asserted
                    the opposite in the one layer nobody looks at — D-W22 forbids exactly that
                    claim. The image itself stays until a real photograph replaces it
                    (Q-SHOP-020, ruled by WS); the false claim did not have to wait. */}
                {/* The picture was here all along and almost nobody could see it: 0.78 opacity
                    under three gradient layers, the heaviest of them a 62% green wash. What a
                    visitor actually met was a gradient, not a place (Q-SHOP-033 phase 2).
                    Opacity is now full and the wash drops to 34% at its darkest corner — enough
                    to keep the text on top legible, which is the only job it ever had. This
                    raises the page's average brightness rather than lowering it, which is the
                    direction standing rule T11 requires. */}
                {/* The picture is a band at the top of the card now, rather than the ground
                    the whole card stood on. Phase 2 wanted it seen and thinned the wash to
                    0.34 to get there; what that also did was put every line of type on a
                    photograph, and the measurements came back 3.51, 2.99 and 2.86 against a
                    4.5 floor. A band keeps what phase 2 was after — you can see the room —
                    and takes the type off it entirely (Q-SHOP-033 phase 3, ruled by WS
                    2026-09-11: fix the card before the cream sections). */}
                <div className="relative h-44 md:h-52">
                  <Image src="/images/hero/taitamd-gemini-hero.jpg" alt="Softly lit massage room with warm natural light" fill priority className="object-cover" />
                  <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_20%_10%,rgba(200,176,124,0.16),rgba(0,0,0,0)),radial-gradient(600px_420px_at_85%_25%,rgba(127,155,82,0.12),rgba(0,0,0,0)),linear-gradient(135deg,rgba(15,51,20,0.34),rgba(11,42,16,0.16))]" />
                </div>
                <div className="bg-[#f5efe3] p-6 md:p-7">
                  <div className="text-xs tracking-[0.32em] uppercase text-[#6d5223]">Signature experience</div>
                  <div className="mt-3 text-2xl font-semibold leading-tight text-[#183b2d]">
                    Deep relief, soft luxury.
                  </div>
                  <p className="mt-3 text-sm text-[#2c4a3c] leading-relaxed">
                    Thai + Deep Tissue + Aromatherapy blends — tailored to your body. Clean, modern interiors inspired by Thai tradition.
                  </p>

                  {/* This card has said "Signature experience" since long before the
                      treatment had a page. Now that it has one, the label is a way in
                      rather than a dead end — the page was otherwise reachable only from
                      the ad. */}
                  <Link
                    href="/signature"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6d5223] underline decoration-[#cdb887] underline-offset-4 transition hover:decoration-[#6d5223]"
                  >
                    Taitam-D Signature — £69 / 60 min
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>

                  {/* These four sat on the photograph with nothing behind them, and phase 2
                      let the photograph through: the white line on the WhatsApp tile fell from
                      4.59 to 2.52 against a 4.5 floor, measured off the paired screenshots.
                      Two separate reasons, and only one of them was visible.

                      The first is that `bg-black/16` and `border-white/14` never existed.
                      Tailwind generates opacity modifiers from a scale in steps of five, so
                      /16 and /14 produce no rule at all — the tiles had no background, and
                      their border fell through to preflight's gray-200, a colour that is not
                      in this palette. Around sixty more of these are spread across the repo
                      (`bg-ink/8` is in sixteen places), reported to WS separately.

                      The second is the fix WS ruled on: cream panel, dark text — the same
                      `#ebe3d4` tile /book/ has used all along, which is a surface Kru Nok has
                      already accepted, and which raises the page's average brightness rather
                      than lowering it (T11). The wash stays where phase 2 put it.

                      The panel is opaque, not translucent. At 90% the cream still let the
                      photograph through enough to move the numbers: the Since tile sits over
                      the darkest corner and its label measured 4.31 against the same 4.5 floor
                      we are here to clear. Leaving any of the contrast dependent on the picture
                      behind it would be re-creating the defect at a smaller amplitude. */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { k: "Since", v: "2009" },
                      { k: `${SITE.walkMinutes} min`, v: "from King’s Cross" },
                      { k: "Daily", v: "10:30am – 9pm" },
                      { k: "WhatsApp", v: "fast replies" }
                    ].map((b) => (
                      <div key={b.k} className="rounded-2xl bg-[#ebe3d4] border border-[#cdb887] p-4">
                        <div className="text-xl font-semibold text-[#6d5223]">{b.k}</div>
                        <div className="text-xs text-[#183b2d] mt-1">{b.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-ink">
                <span>Reserve by WhatsApp · {SITE.whatsappDisplay}</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/15 border border-white/15 animate-floaty">
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
