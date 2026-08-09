import Reveal from "./Reveal";
import { SITE } from "@/lib/site";
import CTA from "./CTA";
import FollowUs from "./FollowUs";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from "lucide-react";

export default function Contact() {
  const q = encodeURIComponent(SITE.address);
  const mapSrc = `https://www.google.com/maps?q=${q}&output=embed`;

  return (
    <section className="pt-8 md:pt-10">
      <Reveal>
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_360px]">
          <div><p className="text-xs uppercase tracking-[0.28em] text-mist">Contact Taitam-D</p><h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] md:text-6xl">Make time for your <span className="text-gold">reset.</span></h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-mist md:text-base">Tell us what you need, and our team will help you choose the right treatment and time. WhatsApp is the quickest way to reach us.</p></div>
          <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold"><MessageCircle className="h-4 w-4" /> Start on WhatsApp <ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div className="mt-6"><FollowUs /></div>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="glass overflow-hidden rounded-[30px] border border-gold/20 shadow-glow">
            <div className="relative aspect-[16/9]"><Image src="/images/contact/contact-ritual-gemini.jpg" alt="Calm spa ritual with towels, frangipani and an emerald bowl" fill className="object-cover" priority /><div className="absolute inset-0 bg-gradient-to-t from-[#082f20]/70 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 right-5 text-white"><p className="text-[10px] uppercase tracking-[0.25em] text-[#e8cf90]">King’s Cross · London</p><p className="mt-2 text-xl font-semibold md:text-2xl">A calm welcome, five minutes from the station.</p></div></div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 md:p-6"><div className="rounded-2xl bg-ink/5 p-4"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mist"><MapPin className="h-4 w-4 text-gold" /> Visit us</div><p className="mt-2 text-sm leading-relaxed">{SITE.address}</p><Link href={SITE.social.googleMaps} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-gold underline underline-offset-4">Get directions <ArrowUpRight className="h-3 w-3" /></Link></div><div className="rounded-2xl bg-ink/5 p-4"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-mist"><Clock3 className="h-4 w-4 text-gold" /> Open daily</div><p className="mt-2 text-sm leading-relaxed">{SITE.hours}</p><Link href={`tel:${SITE.phone}`} className="mt-3 inline-flex items-center gap-1 text-xs text-gold underline underline-offset-4">Call {SITE.phone} <Phone className="h-3 w-3" /></Link></div></div>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.06}>
          <div className="h-full rounded-[30px] border border-[#d7c39a] bg-[#f5efe3] p-6 text-[#183b2b] shadow-[0_20px_48px_rgba(11,48,29,0.22)] md:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#947239]">Scan to connect</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">Your next treatment is one message away.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5a6c61]">Scan the QR code or tap WhatsApp. Ask about the comeback offers, availability or the best treatment for you.</p>
            <div className="mx-auto mt-6 max-w-[220px] rounded-[24px] bg-white p-3 shadow-[0_10px_24px_rgba(24,59,43,0.14)]"><Image src={SITE.whatsappQr} alt="WhatsApp QR code for Taitam-D" width={380} height={380} className="h-auto w-full rounded-xl" /></div>
            <a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Open WhatsApp <ArrowUpRight className="h-4 w-4 text-[#d7b874]" /></a>
            <p className="mt-3 text-center text-xs text-[#6d7b72]">{SITE.whatsappDisplay} · {SITE.email}</p>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-6"><div className="glass overflow-hidden rounded-[30px] border border-ink/10"><iframe title="Taitam-D location map" src={mapSrc} className="map-tint__frame block h-[300px] w-full md:h-[360px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></Reveal>
      <div className="mt-10"><CTA /></div>
    </section>
  );
}
