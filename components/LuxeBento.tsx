import Reveal from "./Reveal";
import { Sparkles, Waves, Flower2, Gem, ShieldCheck, Flame } from "lucide-react";

const items = [
  {
    icon: Waves,
    title: "Massage that actually works",
    desc: "Thai, deep tissue, Swedish & aromatherapy — tailored per session."
  },
  {
    icon: Flower2,
    title: "Thai-inspired modern interior",
    desc: "Progressive design + authentic touches. Calm on purpose."
  },
  {
    icon: ShieldCheck,
    title: "Hygiene-first, always",
    desc: "Cleanliness and detail, from tools to treatment rooms."
  },
  {
    icon: Gem,
    title: "Beauty services, head-to-toe",
    desc: "Nails, waxing, facials, lashes and more — one destination."
  },
  {
    icon: Flame,
    title: "Fast booking. Zero friction.",
    desc: "Availability and payments via Treatwell — book in minutes."
  },
  {
    icon: Sparkles,
    title: "A calm, premium experience",
    desc: "Luxury visuals + motion — premium without clutter."
  }
];

export default function LuxeBento() {
  return (
    <section className="py-8 md:py-12">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Why us</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-ink leading-tight">
              Designed to feel <span className="text-gold">exclusive</span>.
            </h2>
          </div>
          <div className="hidden md:block text-sm text-mist max-w-md">
            High-impact visuals, minimal noise. Every detail earns its place.
          </div>
        </div>
      </Reveal>

      <div className="mt-9 md:mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i, idx) => (
          <Reveal key={i.title} delay={idx * 0.04}>
            <div className="glass rounded-2xl p-5 hover:bg-ink/4 transition shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink/5 border border-ink/10">
                <i.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-mist leading-relaxed">{i.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
