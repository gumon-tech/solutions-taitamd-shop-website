import Reveal from "./Reveal";

const stats = [
  { k: "4.7", v: "Treatwell rating" },
  { k: "6,484", v: "verified reviews" },
  { k: "2009", v: "established" },
  { k: "7 days", v: "open weekly" }
];

export default function Awards() {
  return (
    <section className="ui-section">
      <Reveal>
        <div className="glass rounded-[28px] p-7 md:p-10 shadow-glow overflow-hidden relative">
          <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-gold/12 blur-3xl" />
          <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-rose/12 blur-3xl" />
          <div className="relative">
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Social proof</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
              Loved by thousands — <span className="text-gold">earned</span>, not claimed.
            </h2>
            <p className="mt-4 text-sm md:text-base text-mist max-w-2xl">
              Our booking and reviews live on Treatwell — so the numbers are real and up to date.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.v} className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                  <div className="text-3xl font-semibold text-gold">{s.k}</div>
                  <div className="mt-1 text-xs text-mist tracking-[0.18em] uppercase">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
