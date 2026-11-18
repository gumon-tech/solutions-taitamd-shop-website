import Reveal from "./Reveal";
import { copyText } from "@/lib/copy";
import { Sparkles, Waves, Flower2, Gem, ShieldCheck, Flame } from "lucide-react";

const items = [
  {
    icon: Waves,
    title: copyText("home.bento.1.title"),
    desc: copyText("home.bento.1.desc")
  },
  {
    icon: Flower2,
    title: copyText("home.bento.2.title"),
    desc: copyText("home.bento.2.desc")
  },
  {
    icon: ShieldCheck,
    title: copyText("home.bento.3.title"),
    desc: copyText("home.bento.3.desc")
  },
  {
    icon: Gem,
    title: copyText("home.bento.4.title"),
    desc: copyText("home.bento.4.desc")
  },
  {
    icon: Flame,
    title: copyText("home.bento.5.title"),
    desc: copyText("home.bento.5.desc")
  },
  {
    icon: Sparkles,
    title: copyText("home.bento.6.title"),
    desc: copyText("home.bento.6.desc")
  }
];

export default function LuxeBento() {
  return (
    <section className="py-8 md:py-12">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-ink">{copyText("home.bento.eyebrow")}</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-ink leading-tight">
              {`${copyText("home.bento.h2")} `}<span className="text-gold">{copyText("home.bento.h2_accent")}</span>
            </h2>
          </div>
          <div className="hidden md:block text-sm text-mist max-w-md">
            {copyText("home.bento.lead")}
          </div>
        </div>
      </Reveal>

      <div className="mt-9 md:mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i, idx) => (
          <Reveal key={i.title} delay={idx * 0.04}>
            <div className="glass rounded-2xl p-5 hover:bg-ink/[0.06] transition shadow-[0_0_0_1px_rgba(212,188,138,0.14)]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ink/5 border border-ink/10">
                <i.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-mist leading-relaxed">{i.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
