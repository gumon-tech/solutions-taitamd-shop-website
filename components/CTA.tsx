import Link from "next/link";
import Reveal from "./Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

export default function CTA() {
  return (
    <section className="ui-section">
      <Reveal>
        <div className="glass rounded-[28px] p-7 md:p-10 shadow-glow overflow-hidden relative">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(600px_280px_at_20%_0%,rgba(214,179,106,0.22),rgba(0,0,0,0)),radial-gradient(550px_260px_at_85%_20%,rgba(255,77,141,0.18),rgba(0,0,0,0))]" />
          <div className="relative grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <p className="text-xs tracking-[0.28em] uppercase text-mist">
                Ready
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
                Your next <span className="text-gold">exclusive</span> moment.
              </h2>
              <p className="mt-4 text-sm md:text-base text-mist max-w-2xl">
                Tap to see live availability and confirm in minutes — bookings & payments handled securely via Treatwell.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end md:justify-center">
              <Link
                href="/book"
                className="btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-ink/5 border border-ink/12 px-6 py-3.5 text-sm font-semibold hover:bg-ink/8 transition shadow-glow"
              >
                Check availability <ArrowUpRight className="h-4 w-4 text-gold" />
              </Link>

              <a
                href={buildWhatsAppLink(
                  "Hi TaiTam-D, I’d like to ask about availability and current offers."
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-white/60 border border-ink/16 px-6 py-3 text-sm font-semibold text-ink/90 hover:bg-white/75 transition"
              >
                WhatsApp
              </a>

              {/* Optional: gift-card CTA (ใช้ template ที่คุณมีอยู่แล้ว) */}
              <a
                href={buildWhatsAppLink(SITE.whatsappTemplates.giftCard)}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] tracking-[0.18em] uppercase text-ink/72 hover:text-ink transition md:text-right"
              >
                Gift card via WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
