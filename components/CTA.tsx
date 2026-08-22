import Reveal from "./Reveal";
import { buildWhatsAppLink, SOURCE_GIFT } from "@/lib/whatsapp";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

export default function CTA() {
  return (
    <section className="ui-section">
      <Reveal>
        <div className="glass rounded-[28px] p-7 md:p-10 shadow-glow overflow-hidden relative">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(600px_280px_at_20%_0%,rgba(214,179,106,0.22),rgba(0,0,0,0)),radial-gradient(550px_260px_at_85%_20%,rgba(127,163,105,0.16),rgba(0,0,0,0))]" />
          <div className="relative grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <p className="text-xs tracking-[0.28em] uppercase text-mist">
                Ready
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
                Your next <span className="text-gold">exclusive</span> moment.
              </h2>
              <p className="mt-4 text-sm md:text-base text-mist max-w-2xl">
                Message us directly for availability, treatment advice and today’s promotions.
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-3 md:items-end md:justify-center">
              <a
                href={SITE.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="btn-shine btn-epic inline-flex items-center justify-center gap-2 rounded-2xl bg-ink/5 border border-ink/12 px-6 py-3.5 text-sm font-semibold hover:bg-ink/8 transition shadow-glow"
              >
                WhatsApp to book <ArrowUpRight className="h-4 w-4 text-gold" />
              </a>

              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center rounded-2xl bg-ink/8 border border-gold/20 px-6 py-3 text-sm font-semibold text-ink/90 hover:bg-ink/12 transition"
              >
                Call {SITE.phone}
              </a>

              {/* Optional: gift-card CTA (ใช้ template ที่คุณมีอยู่แล้ว) */}
              <a
                href={buildWhatsAppLink(SITE.whatsappTemplates.giftCard, SOURCE_GIFT)}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] tracking-[0.18em] uppercase text-ink/72 hover:text-ink transition md:text-right"
              >
                Gift card via WhatsApp →
              </a>
            </div>

            <p className="md:col-span-12 text-xs leading-relaxed text-mist">
              {SITE.standardsNotice}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
