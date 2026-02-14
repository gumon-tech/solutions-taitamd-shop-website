import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/lib/site";
import Reveal from "./Reveal";
import { ArrowRight } from "lucide-react";

export default function ServicesPreview() {
  return (
    <section className="ui-section">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-mist">Service menu</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-ink leading-tight">
              Choose your <span className="text-gold">ritual</span>.
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-mist hover:text-ink transition"
          >
            See all categories <ArrowRight className="h-4 w-4 text-gold" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-9 md:mt-10 grid lg:grid-cols-2 gap-4">
        {SERVICE_CATEGORIES.slice(0, 6).map((c, idx) => (
          <Reveal key={c.slug} delay={idx * 0.05}>
            <div className="glass rounded-2xl p-6 overflow-hidden relative">              <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-rose/10 blur-2xl" />
              <div className="relative">
                <div className="text-xs tracking-[0.28em] uppercase text-mist">{c.title}</div>
                <div className="mt-2 text-xl font-semibold">{c.subtitle}</div>
                <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-mist">
                  {c.highlights.slice(0, 4).map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-gold">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
