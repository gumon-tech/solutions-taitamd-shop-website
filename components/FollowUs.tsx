import { SITE } from "@/lib/site";

export default function FollowUs() {
  const s = SITE.social;

  const items = [
    s.instagram ? { label: "Instagram", href: s.instagram } : null,
    s.facebook ? { label: "Facebook", href: s.facebook } : null
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  if (!items.length) return null;

  return (
    <div className="space-y-2">
      <div className="text-ink font-medium mb-2 text-sm">Follow us on social</div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <a
            key={i.label}
            className="inline-flex items-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-3 py-2 text-xs font-semibold"
            href={i.href}
            target="_blank"
            rel="noreferrer"
          >
            {i.label}
          </a>
        ))}
      </div>
    </div>
  );
}
