"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Home, Sparkles, GraduationCap, CalendarDays } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
};

export default function MobileDock() {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/services", label: "Services", icon: Sparkles },
    { href: SITE.academy, label: "Academy", icon: GraduationCap, external: true },
    { href: "/book", label: "Book", icon: CalendarDays },
  ];

  return (
    <div className="md:hidden fixed inset-x-0 bottom-3 z-40">
      <div className="mx-auto max-w-7xl px-5">
        <div className="glass rounded-2xl border border-ink/12 shadow-glow">
          <div className="grid grid-cols-4">
            {items.map((it) => {
              const active = !it.external && pathname === it.href;
              const Icon = it.icon;

              const common =
                "flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold tracking-[0.14em] uppercase";

              const cls = cn(
                common,
                active ? "text-ink" : "text-mist hover:text-ink",
                "transition"
              );

              if (it.external) {
                return (
                  <a
                    key={it.label}
                    href={it.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cls}
                    title={it.label}
                  >
                    <Icon className="h-5 w-5 text-gold" />
                    <span>{it.label}</span>
                  </a>
                );
              }

              return (
                <Link key={it.label} href={it.href} className={cls} title={it.label}>
                  <Icon className="h-5 w-5 text-gold" />
                  <span>{it.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Small “Gift Card” nudge (optional, subtle) */}
        <div className="mt-2 flex justify-center">
          <a
            href={buildWhatsAppLink(SITE.whatsappTemplates.giftCard)}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] tracking-[0.18em] uppercase text-mist hover:text-ink transition"
          >
            Gift Card via WhatsApp →
          </a>
        </div>
      </div>
    </div>
  );
}
