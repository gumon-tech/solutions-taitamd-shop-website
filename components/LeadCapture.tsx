"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sendWhatsAppLead, skipWhatsAppLead } from "./Analytics";

/**
 * The step between a massage booking button and WhatsApp (Q-KMKT-004).
 *
 * Why it exists: a WhatsApp click tells Google that someone tapped, and nothing
 * more — the ad click id dies at the app boundary, so the campaign can only ever
 * optimise for taps. Name and number, hashed in the browser, let Google match the
 * enquiry back to the advert that produced it.
 *
 * Why it is only on massage: it is a real cost, not a free win, and nobody knows
 * how much yet. Massage is 51% of appointments and the category the campaign is
 * pushing, so it gives the fastest read; every other category keeps the plain
 * button and acts as the control group in the same weeks. Marketing chose this
 * over waiting a week for a baseline, because the shop has only just reopened and
 * a "before" measured now would not be a normal week anyway.
 *
 * Why there is a way past it: this form sits on the only route to booking. A
 * visitor who will not type a phone number must still be able to reach WhatsApp,
 * or we have replaced a measurement problem with a lost customer. Skipping is
 * counted too, so the cost of asking is visible rather than invisible.
 *
 * Nothing typed here is stored or sent anywhere except to Google, hashed, and
 * only when the box is ticked.
 */

const SERVICE_LABEL: Record<string, string> = { M: "massage" };

/** UK numbers get typed as 07…, 447…, +44 7… or with spaces. Google wants E.164. */
function toE164(raw: string): string | undefined {
  const digits = raw.replace(/[^\d+]/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  // Not a shape we recognise — send nothing rather than send something wrong,
  // because a mis-typed country code matches a real stranger's account.
  return undefined;
}

function normaliseEmail(raw: string): string | undefined {
  const e = raw.trim().toLowerCase();
  return e.includes("@") && e.includes(".") ? e : undefined;
}

export default function LeadCapture() {
  const [target, setTarget] = useState<{ href: string; service: string } | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Let people open the link their own way — a new tab is not an enquiry we
      // can measure, but taking it away is worse than not measuring it.
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[data-lead-form]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      e.preventDefault();
      setTarget({ href, service: a.getAttribute("data-lead-form") || "M" });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!target) return;
    nameRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setTarget(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [target]);

  if (!target) return null;

  const e164 = toE164(phone);
  const canSubmit = name.trim().length > 1 && !!e164;

  function go(href: string) {
    setTarget(null);
    window.open(href, "_blank", "noreferrer");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!target || !canSubmit) return;
    sendWhatsAppLead({
      phone: e164,
      email: normaliseEmail(email),
      service: target.service,
      href: target.href,
      consented: consent,
    });
    go(target.href);
  }

  function onSkip() {
    if (!target) return;
    skipWhatsAppLead({ service: target.service, href: target.href });
    go(target.href);
  }

  const service = SERVICE_LABEL[target.service] || "treatment";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm md:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setTarget(null);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
        className="w-full max-w-md rounded-2xl border border-gold/30 bg-bg1 p-5 shadow-2xl"
      >
        <h2 id="lead-title" className="text-lg font-medium text-ink">
          Before we open WhatsApp
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-mist">
          Leave your name and number so we can hold your {service} slot even if the
          chat gets interrupted.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="lead-name" className="block text-xs font-medium text-ink/80">
              Your name
            </label>
            <input
              id="lead-name"
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
            />
          </div>

          <div>
            <label htmlFor="lead-phone" className="block text-xs font-medium text-ink/80">
              Phone number
            </label>
            <input
              id="lead-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
              placeholder="07…"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
            />
            {touched && !e164 && (
              <p className="mt-1 text-xs text-ink/60">
                Please check the number — a UK mobile looks like 07700 900123.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lead-email" className="block text-xs font-medium text-ink/80">
              Email <span className="text-ink/45">(optional)</span>
            </label>
            <input
              id="lead-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white/60 px-3 py-2.5 text-sm text-ink outline-none focus:border-gold"
            />
          </div>

          {/*
            Legal's wording, unticked by default (59- §3). Leaving it unticked must
            never block the enquiry: the box is about telling Google, not about
            talking to us.
          */}
          <label className="flex gap-2.5 pt-1 text-xs leading-relaxed text-mist">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
            />
            <span>
              I&apos;m happy for Taitam-D to contact me on WhatsApp about my enquiry,
              and to send a hashed copy of my name and number to Google so you can
              see which advert brought me here. You can withdraw this any time — see
              our{" "}
              <Link href="/privacy" className="underline text-gold hover:text-gold2">
                privacy notice
              </Link>
              .
            </span>
          </label>

          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <button
              type="submit"
              className="flex-1 rounded-full bg-gold px-4 py-2.5 text-sm font-medium text-bg0 transition hover:bg-gold2"
            >
              Open WhatsApp
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="rounded-full border border-ink/20 px-4 py-2.5 text-sm text-ink/70 transition hover:border-ink/40"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
