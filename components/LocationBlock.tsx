import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { MapPin, TrainFront, Clock3, ArrowUpRight } from "lucide-react";

export default function LocationBlock() {
  const q = encodeURIComponent(SITE.address);
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <section className="ui-section">
      <Reveal>
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: info card */}
          <div className="lg:col-span-5 glass rounded-[28px] p-7 md:p-9">
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Location</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-ink leading-tight">
              King’s Cross — <span className="text-gold">easy</span> to reach.
            </h2>

            <p className="mt-4 text-sm md:text-base text-mist leading-relaxed">
              {SITE.address}
              <br />
              <span className="text-ink/90">{SITE.hours}</span>
            </p>

            {/* Quick facts (fills the “empty” feel without clutter) */}
            <div className="mt-8 md:mt-9 grid gap-3 text-sm">
              <div className="rounded-2xl bg-[radial-gradient(700px_240px_at_20%_0%,rgba(214,179,106,0.14),rgba(0,0,0,0)),radial-gradient(700px_240px_at_90%_60%,rgba(127,153,82,0.14),rgba(0,0,0,0))] border border-ink/12 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-ink/10">
                    <Clock3 className="h-4 w-4 text-ink/80" />
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.22em] uppercase text-mist">Quick access</div>
                    <div className="mt-1 text-ink/90">
                      ~6 min walk from King’s Cross / St Pancras
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-3">
                  <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-ink/10">
                    <TrainFront className="h-4 w-4 text-ink/80" />
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.22em] uppercase text-mist">Nearest stations</div>
                    <div className="mt-1 text-ink/90">
                      King’s Cross · St Pancras · Caledonian Road
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact blocks */}
              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-4">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Phone</div>
                <div className="mt-1 text-ink/90">{SITE.phone}</div>
              </div>

              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-4">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Email</div>
                <div className="mt-1 text-ink/90">{SITE.email}</div>
              </div>

              {/* CTA (balances the right column) */}
              <Link
                href={SITE.social.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-between rounded-2xl border border-ink/20 bg-white/5 px-4 py-3 text-sm text-ink/90 hover:bg-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-ink/10">
                    <MapPin className="h-4 w-4 text-ink/80" />
                  </span>
                  Get directions
                </span>
                <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-90" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Map + Storefront */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {/* Map (same structure as /contact) */}
              <div className="glass rounded-[28px] overflow-hidden border border-ink/10 relative map-tint">
                <iframe
                  title="Map"
                  src={mapSrc}
                  className="w-full h-[380px] md:h-[420px] min-h-[380px] map-tint__frame"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Olive tint (keeps map fully clickable) */}
                <div className="pointer-events-none absolute inset-0 map-tint__overlay" />
                {/* Luxe light sweep (same as /contact) */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_320px_at_20%_0%,rgba(127,153,82,0.10),rgba(0,0,0,0)),radial-gradient(700px_300px_at_90%_70%,rgba(214,179,106,0.10),rgba(0,0,0,0))]" />
              </div>

              {/* Storefront (compact) */}
              <div className="glass rounded-[28px] overflow-hidden border border-ink/10">
                <div className="relative aspect-[21/9] sm:aspect-[3/2] md:aspect-[21/9]">
                  <Image
                    src="/images/contact/storefront-21x9-1680x720.webp"
                    alt="TaiTam-D storefront on Caledonian Road"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 58vw, 680px"
                    priority={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_100%)]" />
                </div>

                <div className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs tracking-[0.22em] uppercase text-mist">Storefront</p>
                    <Link
                      href={SITE.social.googleMaps}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-ink/80 underline decoration-ink/20 underline-offset-4 hover:decoration-ink/50"
                    >
                      Open in Google Maps
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
