import Reveal from "./Reveal";
import { SITE } from "@/lib/site";

export default function LocationBlock() {
  const q = encodeURIComponent(SITE.address);
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <section className="ui-section">
      <Reveal>
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 glass rounded-[28px] p-7 md:p-9">
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Location</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
              King’s Cross — <span className="text-gold">easy</span> to reach.
            </h2>
            <p className="mt-4 text-sm md:text-base text-mist leading-relaxed">
              {SITE.address}
              <br />
              <span className="text-ink/90">{SITE.hours}</span>
            </p>

            <div className="mt-6 grid gap-3 text-sm text-mist">
              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-4">
                <div className="text-xs tracking-[0.22em] uppercase">Phone</div>
                <div className="mt-1 text-ink/90">{SITE.phone}</div>
              </div>
              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-4">
                <div className="text-xs tracking-[0.22em] uppercase">Email</div>
                <div className="mt-1 text-ink/90">{SITE.email}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 glass rounded-[28px] overflow-hidden border border-ink/10">
            <div className="glass rounded-[28px] overflow-hidden border border-ink/10 relative map-tint">
            <iframe
              title="Map"
              src={mapSrc}
              className="w-full h-[380px] md:h-full min-h-[380px] map-tint__frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="pointer-events-none absolute inset-0 map-tint__overlay" />
          </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
