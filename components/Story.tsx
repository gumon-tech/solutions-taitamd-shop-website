import Reveal from "./Reveal";
import { SITE } from "@/lib/site";

export default function Story() {
  return (
    <section className="pt-28 md:pt-32 pb-10">
      <Reveal>
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Our story</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          A modern interior, rooted in <span className="text-gold">Thai tradition</span>.
        </h1>
        <p className="mt-6 text-mist max-w-3xl leading-relaxed">
          {SITE.name} is an oasis of calm against the backdrop of the city — blending progressive design with authentic Thai-inspired touches.
          With a highly trained team and multiple treatment rooms, we focus on one thing: you leave feeling refreshed, revived, and completely renewed.
        </p>
      </Reveal>

      <div className="mt-10 grid lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-7">
          <div className="glass rounded-[28px] p-7 md:p-9 shadow-glow overflow-hidden relative">
            <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-gold/12 blur-3xl" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-rose/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-semibold">The philosophy</h2>
              <p className="mt-4 text-sm md:text-base text-mist leading-relaxed">
                Luxury is not loud. It’s precision, calm, and care. Every service is designed to be a high-signal experience —
                the kind that makes you want to come back.
              </p>

              <div className="mt-7 grid sm:grid-cols-2 gap-3 text-sm text-mist">
                {[
                  ["Tailored sessions", "We adapt pressure, technique and focus areas each time."],
                  ["Thai + modern", "Traditional craft, delivered in a contemporary space."],
                  ["Detail obsession", "Finishing, hygiene, and comfort — no shortcuts."],
                  ["Zero friction booking", "Live availability + payment via Treatwell."]
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                    <div className="font-semibold text-ink/95">{t}</div>
                    <div className="mt-1.5 text-sm text-mist">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.06}>
          <div className="glass rounded-[28px] p-7 md:p-9 h-full">
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Good to know</p>
            <h3 className="mt-3 text-2xl font-semibold">Academy</h3>
            <p className="mt-3 text-sm text-mist leading-relaxed">
              Training is run on a dedicated site to keep the spa experience clean and conversion-focused.
            </p>
            <a
              href={SITE.academy}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-ink/5 border border-ink/12 px-5 py-3 text-sm font-semibold hover:bg-ink/8 transition w-full"
            >
              Visit Beauty Academy
            </a>

            <div className="mt-8 rounded-2xl bg-ink/5 border border-ink/10 p-5">
              <div className="text-xs tracking-[0.22em] uppercase text-mist">Address</div>
              <div className="mt-2 text-sm text-ink/90">{SITE.address}</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
