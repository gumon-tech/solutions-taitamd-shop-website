import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import CTA from "./CTA";
import SocialShareBar from "./SocialShareBar";
import FollowUs from "./FollowUs";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  const q = encodeURIComponent(SITE.address);
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <section className="pt-8 md:pt-10">
      <Reveal>
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Contact</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Let’s plan your <span className="text-gold">reset</span>.
        </h1>
        <p className="mt-6 text-mist max-w-2xl">
          For bookings, use{" "}
          <Link href={SITE.treatwell} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink/60">
            Treatwell
          </Link>{" "}
          for live availability and secure payments (rated 4.7 with 6,480+ reviews). For quick questions, call or email us below.
        </p>

        <div className="mt-7">
          <div className="text-xs tracking-[0.28em] uppercase text-mist">Share</div>
          <div className="mt-3">
            <SocialShareBar />
          </div>
        </div>

        <div className="mt-6">
          <FollowUs />
        </div>
      </Reveal>

      <div className="mt-10 grid lg:grid-cols-12 gap-6">
        <Reveal className="lg:col-span-5">
          <div className="glass rounded-[28px] p-7 md:p-9">
            <div className="space-y-4 text-sm">
              <div className="rounded-2xl bg-[radial-gradient(700px_240px_at_20%_0%,rgba(214,179,106,0.18),rgba(0,0,0,0)),radial-gradient(700px_240px_at_90%_60%,rgba(127,153,82,0.18),rgba(0,0,0,0))] border border-ink/12 p-5 shadow-glow">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Phone</div>
                <Link
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="mt-2 inline-flex text-lg font-semibold hover:opacity-90"
                >
                  {SITE.phone}
                </Link>
                <div className="mt-2 text-xs text-mist">
                  Open daily {SITE.hours.replace("Mon – Sun ", "")} · Near King’s Cross
                </div>
              </div>

              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Email</div>
                <Link href={`mailto:${SITE.email}`} className="mt-2 inline-flex text-ink/90 hover:opacity-90">
                  {SITE.email}
                </Link>
              </div>

              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Hours</div>
                <div className="mt-2 text-ink/90">{SITE.hours}</div>
              </div>

              <div className="rounded-2xl bg-ink/5 border border-ink/10 p-5">
                <div className="text-xs tracking-[0.22em] uppercase text-mist">Address</div>
                <div className="mt-2 text-ink/90">{SITE.address}</div>
                <div className="mt-3">
                  <Link
                    href={SITE.social.googleMaps}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-ink/8 px-3 py-1.5 text-xs text-ink/90 hover:bg-ink/12"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Directions
                    <span aria-hidden>↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={0.05}>
          <div className="space-y-4">
            <div className="glass rounded-[28px] overflow-hidden border border-ink/10 relative map-tint">
              <iframe
                title="Map"
                src={mapSrc}
                className="w-full h-[420px] md:h-full min-h-[420px] map-tint__frame"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Olive tint (keeps map fully clickable) */}
              <div className="pointer-events-none absolute inset-0 map-tint__overlay" />
              {/* Luxe light sweep */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_320px_at_20%_0%,rgba(127,153,82,0.10),rgba(0,0,0,0)),radial-gradient(700px_300px_at_90%_70%,rgba(214,179,106,0.10),rgba(0,0,0,0))]" />
            </div>

            <div className="glass rounded-[28px] overflow-hidden border border-ink/10">
              <div className="relative aspect-[21/9] sm:aspect-[3/2] md:aspect-[21/9]">
                <Image
                  src="/images/contact/storefront-21x9-1680x720.webp"
                  alt="TaiTam‑D storefront on Caledonian Road"
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
        </Reveal>
      </div>

      <div className="mt-10">
        <CTA />
      </div>
    </section>
  );
}
