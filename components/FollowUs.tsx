import { SITE } from "@/lib/site";
import { Instagram, Facebook } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FollowItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function FollowUs() {
  const s = SITE.social;

  const items: FollowItem[] = [
    s.instagram ? { label: "Instagram", href: s.instagram, icon: Instagram } : null,
    s.facebook ? { label: "Facebook", href: s.facebook, icon: Facebook } : null,
  ].filter((v): v is FollowItem => Boolean(v));

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <div className="text-xs tracking-[0.28em] uppercase text-mist">
        Follow us
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {items.map((i) => {
          const Icon = i.icon;
          return (
            <a
              key={i.label}
              href={i.href}
              target="_blank"
              rel="noreferrer"
              className="
                group inline-flex items-center gap-2
                rounded-2xl
                border border-ink/15
                bg-ink/6
                hover:bg-ink/10
                px-4 py-2.5
                text-sm font-medium
                transition-all duration-300
              "
            >
              <Icon className="h-4 w-4 text-gold/80 group-hover:text-gold transition" />
              <span className="text-ink/90 group-hover:text-ink">
                {i.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
