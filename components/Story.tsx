import Image from "next/image";
import Reveal from "./Reveal";
import { SITE } from "@/lib/site";

export default function Story() {
  return (
    <section className="pt-8 md:pt-10 pb-10">
      <Reveal>
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Our story</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Precision, by <span className="text-gold">design</span>.
        </h1>
        <p className="mt-6 text-ink/82 max-w-3xl leading-relaxed">
          Founded in 2009, {SITE.name} is a Thai beauty and wellness house in King’s Cross —
          refined through experience and led by a single standard: measured excellence.
        </p>
      </Reveal>

      {/* Cinematic interior anchor */}
      <Reveal className="mt-8 md:mt-10">
        <div className="glass rounded-[28px] overflow-hidden shadow-glow border border-ink/10">
          <div className="relative aspect-[16/7]">
            <Image
              src="/images/story/interior-1600x900.jpg"
              alt="TaiTam-D interior atmosphere"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/34 via-white/10 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(196,170,98,.14),transparent_58%)]" />
          </div>
        </div>
      </Reveal>

      {/* Philosophy + Academy */}
      <div className="mt-8 md:mt-10 grid lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-7">
          <div className="glass rounded-[28px] p-7 md:p-9 shadow-glow overflow-hidden relative h-full">
            <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-gold/12 blur-3xl" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-rose/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-semibold">A house built on standards</h2>
              <p className="mt-4 text-sm md:text-base text-ink/80 leading-relaxed">
                Luxury is not loud. It lives in technique, hygiene, and finishing detail — consistent, intentional, and calm.
              </p>

              <div className="mt-7 grid sm:grid-cols-2 gap-3 text-sm text-ink/78">
                {[
                  ["Technique first", "Pressure, pacing, and precision — tailored every time."],
                  ["Thai + modern", "Traditional craft, delivered with London-level discipline."],
                  ["Detail obsession", "Finishing, hygiene, and comfort — no shortcuts."],
                  ["Zero-friction booking", "Live availability + payment via Treatwell."]
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                    <div className="font-semibold text-ink/95">{t}</div>
                    <div className="mt-1.5 text-sm text-ink/76">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.06}>
          <div className="glass rounded-[28px] p-7 md:p-9 h-full">
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Good to know</p>
            <h3 className="mt-3 text-2xl font-semibold">Beauty Academy</h3>
            <p className="mt-3 text-sm text-ink/80 leading-relaxed">
              Our professional training lives on a dedicated site, keeping this space focused and refined — while holding education to the same standard.
            </p>

            <div className="mt-5 rounded-2xl bg-ink/5 border border-ink/10 p-5">
              <div className="text-xs tracking-[0.22em] uppercase text-mist">Credentials</div>
              <div className="mt-2 text-sm text-ink/90">
                VTCT-accredited wellness &amp; spa courses across key beauty disciplines.
              </div>
            </div>

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
              <div className="mt-2 text-sm text-ink/90">Just minutes from King’s Cross Station.</div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Founder-led section */}
      <div className="mt-6 md:mt-8 grid lg:grid-cols-12 gap-6 items-stretch">
        <Reveal className="lg:col-span-5">
          <div className="glass rounded-[28px] overflow-hidden h-full border border-ink/10 shadow-glow">
            <div className="relative aspect-[4/5]">
              <Image
                src="/images/story/founder-860x1075.jpg"
                alt="Thanyarat Phomnongsan (Kru Nok), Founder of TaiTam-D"
                fill
                className="object-cover object-[50%_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/4 to-transparent" />
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.06}>
          <div className="glass rounded-[28px] p-7 md:p-9 h-full relative overflow-hidden">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs tracking-[0.28em] uppercase text-mist">Founder-led</p>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold">The standard begins with her</h2>
              <div className="mt-3 space-y-1">
                <div className="text-lg md:text-xl font-semibold text-ink/95">Thanyarat Phomnongsan <span className="text-mist font-medium">(Kru Nok)</span></div>
                <div className="text-sm text-ink/78">CEO &amp; Founder, TaiTam-D Group • TaiTam-D Beauty Academy</div>
                <div className="text-sm text-ink/78">Beauty Mentor • Certified NLP Master</div>
              </div>
              <p className="mt-4 text-sm md:text-base text-ink/80 leading-relaxed max-w-2xl">
                TaiTam-D was created to elevate Thai craftsmanship through modern structure. From treatment protocols to curriculum design,
                every detail follows one principle: technique first, detail always — no shortcuts.
              </p>

              <div className="mt-6 rounded-2xl bg-ink/5 border border-ink/10 p-5">
                <div className="text-sm font-semibold text-ink/95">“Luxury is not decoration. It is discipline.”</div>
                <div className="mt-1.5 text-sm text-ink/78">— Thanyarat Phomnongsan (Kru Nok), Founder</div>
              </div>

              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm text-ink/78">
                {[
                  ["Established", "2009"],
                  ["Location", "King’s Cross"],
                  ["Bookings", "Treatwell"]
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                    <div className="text-xs tracking-[0.22em] uppercase text-mist">{k}</div>
                    <div className="mt-2 text-lg font-semibold text-ink/95">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Cultural depth */}
      <div className="mt-6 md:mt-8 grid lg:grid-cols-12 gap-6 items-stretch">
        <Reveal className="lg:col-span-7">
          <div className="glass rounded-[28px] p-7 md:p-9 h-full flex flex-col justify-center">
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Rooted</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">Rooted in Thai craft</h2>
            <p className="mt-4 text-sm md:text-base text-ink/80 leading-relaxed max-w-2xl">
              From pressure mapping to finishing detail, every element traces back to traditional Thai practice — refined for a modern audience.
              Calm is built through consistency, not volume.
            </p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.06}>
          <div className="glass rounded-[28px] overflow-hidden border border-ink/10 h-full">
            <div className="relative h-full min-h-[260px]">
              <Image
                src="/images/gallery/spa-1200x800.jpg"
                alt="Thai-inspired detail at TaiTam-D"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-black/0 to-transparent" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
