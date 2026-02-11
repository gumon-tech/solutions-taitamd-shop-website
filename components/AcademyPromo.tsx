import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import SocialShareBar from "./SocialShareBar";
import { SITE } from "@/lib/site";

export default function AcademyPromo() {
  return (
    <section className="py-10 md:py-14">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Academy</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
              Train with <span className="text-gold">real technique</span> — not just theory.
            </h2>
            <p className="mt-4 text-sm md:text-base text-mist max-w-2xl">
              VTCT-accredited Wellness & Spa courses across disciplines — taught by experienced professionals, built for real-world results.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm text-mist">
              <BadgeCheck className="h-4 w-4 text-gold" /> Recognized qualifications
            </div>
            <Link
              href={SITE.academy}
              target="_blank"
              rel="noreferrer"
              className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/12 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              Explore Academy <ArrowUpRight className="h-4 w-4 text-gold" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5">
            <div className="glass rounded-[28px] p-5 md:p-6 overflow-hidden">
              <div className="relative rounded-[22px] overflow-hidden border border-white/10 aspect-[4/3]">
                <Image
                  src="/images/academy/academy-1-1600x900.jpg"
                  alt="Professional eyebrow design training"
                  fill
                  className="object-cover opacity-[0.95]"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.65))]" />
                <div className="absolute left-5 right-5 bottom-5">
                  <div className="text-xs tracking-[0.24em] uppercase text-ink/80">Professional Eyebrow Design Training</div>
                  <div className="mt-2 text-sm text-mist leading-relaxed">
                    Advanced Nano‑Technology Cosmetic Tattoo techniques — learn from experienced beauty experts.
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-mist">
                <div>• Hands‑on practice with real techniques</div>
                <div>• Create natural, perfectly shaped brows</div>
                <div>• Upgrade your skills & boost your beauty career</div>
              </div>

              <Link
                href={SITE.academy}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/12 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                View courses <ArrowUpRight className="h-4 w-4 text-gold" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="glass rounded-[28px] p-6 md:p-7">
              <p className="text-xs tracking-[0.28em] uppercase text-mist">What you’ll learn</p>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold leading-tight">
                Professional massage training — <span className="text-gold">high‑quality, comprehensive learning</span>.
              </h3>
              <p className="mt-3 text-sm md:text-base text-mist leading-relaxed">
                We offer a wide range of professional massage training courses, covering various techniques and styles to ensure high‑quality, comprehensive learning.
              </p>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {[
                  { t: "Hands‑on practice", d: "Train with real techniques — not just theory." },
                  { t: "Experienced instructors", d: "Learn from professionals who do the work daily." },
                  { t: "Recognized qualifications", d: "VTCT‑accredited learning designed to advance your career." },
                  { t: "Across disciplines", d: "Wellness & spa courses across multiple specialties." }
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="font-semibold">{x.t}</div>
                    <div className="mt-1 text-sm text-mist">{x.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 md:hidden">
                <Link
                  href={SITE.academy}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/12 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Explore Academy <ArrowUpRight className="h-4 w-4 text-gold" />
                </Link>
              </div>

              <div className="mt-4 md:hidden">
                <div className="text-[11px] tracking-[0.26em] uppercase text-mist">Follow Academy</div>
                <SocialShareBar
                  compact
                  className="mt-2"
title="TaiTam‑D Academy"
                  text="VTCT-accredited Wellness & Spa courses — train with experienced professionals."
                />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
