"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Google Consent Mode v2 (advanced). The tag loads on every visit but every
// storage type starts denied, so nothing is written to the device and no
// identifier is sent until the visitor accepts. While denied, Google receives
// only cookieless pings, which is what lets it model the conversions we would
// otherwise lose entirely. Accepting flips the storage grants; declining leaves
// them denied for the rest of the session.
export const GA_ID = "G-R8SGQ58R5E";
const CONSENT_KEY = "ttd-consent"; // "granted" | "denied"

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // GA requires the Arguments object itself, not a spread copy.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  window.gtag = gtag as unknown as Window["gtag"];
}

// Anyone who accepted before the host-only switch still carries a .taitam-d.com
// cookie that surfaces on the Academy subdomain. Clear those once, on the
// parent domain, so the leak drains instead of lingering for its two-year life.
function dropWideCookies() {
  const parent = location.hostname.replace(/^www\./, "");
  for (const raw of document.cookie.split(";")) {
    const name = raw.trim().split("=")[0];
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parent}`;
  }
}

function bootstrap(stored: string | null) {
  ensureGtag();

  // Defaults must be queued before the library loads, or the first hit escapes
  // ungoverned.
  window.gtag!("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });

  // Without cookies, the ad click id has to survive in the URL instead, and
  // click identifiers are stripped from the cookieless pings.
  window.gtag!("set", "url_passthrough", true);
  window.gtag!("set", "ads_data_redaction", true);

  if (stored === "granted") grantConsent();

  dropWideCookies();

  window.gtag!("js", new Date());
  // "none" keeps the cookie host-only. The default, "auto", writes to
  // .taitam-d.com, so an accept here would put _ga on academy.taitam-d.com
  // too — a site that sets no cookies of its own and says so in its policy.
  window.gtag!("config", GA_ID, { cookie_domain: "none" });

  if (document.getElementById("ttd-gtag")) return;
  const s = document.createElement("script");
  s.id = "ttd-gtag";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function grantConsent() {
  ensureGtag();
  window.gtag!("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
    functionality_storage: "granted",
    personalization_storage: "granted",
  });
}

function denyConsent() {
  ensureGtag();
  window.gtag!("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}

// Fire lead events for the site's two real conversion paths. Safe to attach
// regardless of consent: while denied these travel as cookieless pings.
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
  // "pending" keeps the banner hidden until we have read localStorage, so it
  // never flashes for someone who already chose.
  const [consent, setConsent] = useState<string | null>("pending");

  useEffect(() => {
    const stored = getConsent();
    setConsent(stored);
    bootstrap(stored);
    trackLeadClicks();
  }, []);

  const decide = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setConsent(value);
    if (value === "granted") grantConsent();
    else denyConsent();
  };

  if (consent !== null) return null;

  // Compact on phones on purpose. Legal's wording is unchanged; only the footprint
  // shrank. At the previous size this sheet covered roughly a third of a 375px screen,
  // which on the Signature landing page put the Book on WhatsApp button behind it before
  // the visitor had answered anything.
  // Legal's ruling (2026-08-11): PECR reg 6 forbids setting non-essential cookies before
  // consent — it does not ask us to obscure the page, and a banner covering the only
  // route to contact us pushes the consent itself toward a cookie wall.
  // Consent behaviour is untouched: every storage type still starts denied, clicks travel
  // as cookieless pings until accepted, the banner stays answerable, and using the site is
  // never treated as agreement.
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-20 md:bottom-4 md:left-auto md:right-4 md:max-w-sm z-[70] rounded-2xl border border-gold/30 bg-bg1/95 backdrop-blur p-3 md:p-4 shadow-2xl"
    >
      <p className="text-xs leading-relaxed text-ink/90 md:text-sm">
        We&apos;d like to use optional analytics cookies (Google Analytics &amp; Google
        Ads) to understand visits and improve how we welcome you. If you decline,
        no cookies are stored on your device.{" "}
        <Link href="/cookies" className="underline text-gold hover:text-gold2">
          Cookie policy
        </Link>
      </p>
      <div className="mt-2.5 flex gap-2 md:mt-3">
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
