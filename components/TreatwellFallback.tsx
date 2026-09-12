import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * The way in for a visitor with no WhatsApp (Q-MKT-078, owner's instruction).
 *
 * It is a text link, not a button, and that is the whole design. The order the
 * owner asked for is WhatsApp first, Treatwell second; two buttons of equal weight
 * would read as two equal choices, and the shop answers on one of them.
 *
 * It opens in a new tab so the visitor who decides against it still has us behind
 * them, and it is a plain link rather than an embedded widget so nothing of
 * Treatwell's runs on our pages.
 */
export default function TreatwellFallback({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm text-ink ${className}`}>
      <a
        href={SITE.treatwellBooking}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 underline decoration-ink/25 underline-offset-4 transition hover:text-ink hover:decoration-gold"
      >
        No WhatsApp? Book on Treatwell
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </p>
  );
}
