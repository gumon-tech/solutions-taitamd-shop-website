import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import CTA from "./CTA";
import SocialShareBar from "./SocialShareBar";

export default function Contact() {
  const q = encodeURIComponent(SITE.address);
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <section className="pt-28 md:pt-32">
      <Reveal>
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Contact</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Let’s plan your <span className="text-gold">reset</span>.
        </h1>
        <p className="mt-6 text-mist max-w-2xl">
          For bookings, use Treatwell for live availability. For quick questions, contact us below.
        </p>

        <div className="mt-7">
          <div className="text-xs tracking-[0.28em] uppercase text-mist">Share</div>
          <div className="mt-3">
            <SocialShareBar />
          </div>
        </div>

        <p className="mt-6 text-mist max-w-2xl">
        </p>
      </Reveal>

      <div className="mt-10 grid lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-5">
          <div className="glass rounded-[28px] p-7 md:p-9">
            <div className="space-y-4 text-sm">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Phone</div>
                <div className="mt-2 text-lg font-semibold">{SITE.phone}</div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Email</div>
                <div className="mt-2 text-ink/90">{SITE.email}</div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Hours</div>
                <div className="mt-2 text-ink/90">{SITE.hours}</div>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Address</div>
                <div className="mt-2 text-ink/90">{SITE.address}</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.05}>
          <div className="glass rounded-[28px] overflow-hidden border border-white/10">
            <iframe
              title="Map"
              src={mapSrc}
              className="w-full h-[420px] md:h-full min-h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>

      <div className="mt-10">
        <CTA />
      </div>
    </section>
  );
}
