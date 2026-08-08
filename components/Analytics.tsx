"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Consent-first analytics: nothing loads and no cookie is set until the
// visitor explicitly accepts. Choice persists in localStorage (not a cookie).
export const GA_ID = "G-R8SGQ58R5E";
const CONSENT_KEY = "ttd-consent"; // "granted" | "denied"

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadGtag() {
  if (document.getElementById("ttd-gtag")) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // GA requires the Arguments object itself, not a spread copy.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  window.gtag = gtag as unknown as Window["gtag"];
  window.gtag!("js", new Date());
  window.gtag!("config", GA_ID);

  const s = document.createElement("script");
  s.id = "ttd-gtag";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

// Fire lead events for the site's two real conversion paths.
function trackLeadClicks() {
  document.addEventListener("click", (e) => {
    if (!window.gtag) return;
    const a = (e.target as HTMLElement | null)?.closest?.("a");
    if (!a?.href) return;
    if (a.href.includes("wa.me")) {
      window.gtag("event", "whatsapp_click", { link_url: a.href, page_path: location.pathname });
    } else if (a.href.startsWith("tel:")) {
      window.gtag("event", "phone_click", { link_url: a.href, page_path: location.pathname });
    }
  });
}

export function getConsent(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export function resetConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  location.reload();
}

export default function Analytics() {
  // null = undecided (show banner); "granted" | "denied" = decided
  const [consent, setConsent] = useState<string | null>("pending");

  useEffect(() => {
    const stored = getConsent();
    setConsent(stored);
    if (stored === "granted") {
      loadGtag();
      trackLeadClicks();
    }
  }, []);

  const decide = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setConsent(value);
    if (value === "granted") {
      loadGtag();
      trackLeadClicks();
    }
  };

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-20 md:bottom-4 md:left-auto md:right-4 md:max-w-sm z-[70] rounded-2xl border border-gold/30 bg-bg1/95 backdrop-blur p-4 shadow-2xl"
    >
      <p className="text-sm text-ink/90 leading-relaxed">
        We&apos;d like to use optional analytics cookies (Google Analytics &amp; Google
        Ads) to understand visits and improve how we welcome you. None are set
        unless you accept.{" "}
        <Link href="/cookies" className="underline text-gold hover:text-gold2">
          Cookie policy
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => decide("granted")}
          className="flex-1 rounded-full bg-gold text-bg0 text-sm font-medium px-4 py-2 hover:bg-gold2 transition"
        >
          Accept
        </button>
        <button
          onClick={() => decide("denied")}
          className="flex-1 rounded-full border border-ink/20 text-ink/80 text-sm px-4 py-2 hover:border-ink/40 transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
