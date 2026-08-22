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

// A wa.me link means one of two opposite things, and the difference is the whole
// point of the number: a link with a path (/447882359499, /qr/XXXX) opens a chat
// WITH US and is a lead; a bare wa.me/?text= opens the visitor's own contact list
// so they can forward the page to a friend, and is not.
// Matching on the hostname alone counted both as whatsapp_click (measured on
// production 2026-08-23: clicking the footer share button emitted the same event
// as the hero booking button, separable only by ep.link_url). Ads imports the
// event NAME, so a shared name would have had the campaign bidding for sharers at
// the price of bookers — Q-KMKT-001.
const SHARE_HOSTS = new Set(["www.facebook.com", "facebook.com", "twitter.com", "x.com"]);

function leadEventFor(href: string): string | null {
  if (href.startsWith("tel:")) return "phone_click";
  let u: URL;
  try {
    u = new URL(href, location.href);
  } catch {
    return null;
  }
  if (u.hostname === "wa.me") {
    // Trailing slashes only, never a real path, on the share variant.
    return u.pathname.replace(/^\/+|\/+$/g, "") ? "whatsapp_booking_click" : "social_share_click";
  }
  if (SHARE_HOSTS.has(u.hostname) && /sharer|intent/.test(u.pathname)) return "social_share_click";
  return null;
}

// Fire lead events for the site's real conversion paths. Safe to attach regardless
// of consent: while denied these travel as cookieless pings.
function trackLeadClicks() {
  document.addEventListener("click", (e) => {
    if (!window.gtag) return;
    const a = (e.target as HTMLElement | null)?.closest?.("a");
    if (!a?.href) return;
    // Links that open the lead form report themselves when the visitor actually
    // leaves for WhatsApp. Counting the first click here too would inflate exactly
    // the number the form is being measured against — the form's whole purpose is
    // to find out how many people it costs us.
    if (a.hasAttribute("data-lead-form")) return;
    const name = leadEventFor(a.href);
    if (!name) return;
    window.gtag("event", name, { link_url: a.href, page_path: location.pathname });
  });
}

type LeadSubmission = {
  phone?: string;
  email?: string;
  service: string;
  href: string;
  consented: boolean;
};

/**
 * Hand a lead to Google at the moment the visitor leaves for WhatsApp.
 *
 * Only `ad_user_data` is granted from the tick box, never `ad_storage`. The two
 * are different permissions: one governs sending user-provided data, the other
 * governs writing to the device. Legal's ruling is that cookies are the banner's
 * business and nothing else's, so a tick box about sending a hashed number must
 * not quietly start writing advertising cookies as a side effect.
 *
 * Nothing here is stored. The values live in component state until this call and
 * are gone with the navigation; they never reach a GA4 event parameter, the URL,
 * or local storage. gtag hashes with SHA-256 before anything leaves the browser.
 */
export function sendWhatsAppLead({ phone, email, service, href, consented }: LeadSubmission) {
  ensureGtag();
  if (consented) {
    window.gtag!("consent", "update", { ad_user_data: "granted" });
    const userData: Record<string, string> = {};
    if (phone) userData.phone_number = phone;
    if (email) userData.email = email;
    if (Object.keys(userData).length) window.gtag!("set", "user_data", userData);
  }
  window.gtag!("event", "whatsapp_lead_submit", { service, consented });
  // Keep the control metric comparable: the split test reads whatsapp_booking_click
  // for both the categories with a form and the ones without.
  window.gtag!("event", "whatsapp_booking_click", { link_url: href, page_path: location.pathname });
}

/** The visitor chose to skip the form. Measured so the cost of the form is visible. */
export function skipWhatsAppLead({ service, href }: { service: string; href: string }) {
  ensureGtag();
  window.gtag!("event", "whatsapp_lead_skip", { service });
  window.gtag!("event", "whatsapp_booking_click", { link_url: href, page_path: location.pathname });
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
  // The mobile offset is bottom-1, not bottom-20, for the same reason one page further on.
  // Measured on production 2026-08-23: the home hero's "WhatsApp to book" sits at 577-623px
  // from the top on every phone width, and the sheet is 152px tall, so a bottom-20 (80px)
  // offset put the sheet over that button on every viewport shorter than 855px — which is
  // every iPhone from the SE through the 15 (667/780/812/821/844/852). A hit test at the
  // button's centre returned this dialog, not the link. At bottom-1 the sheet clears the
  // button from 780px upwards. Below ~700px nothing bottom-anchored clears it, so keep the
  // old 80px there: it at least leaves the button's centre tappable on an SE.
  // Nothing about consent changed — this is geometry, not policy.
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
      className="fixed inset-x-3 bottom-1 [@media(max-height:700px)]:bottom-20 md:bottom-4 md:left-auto md:right-4 md:max-w-sm z-[70] rounded-2xl border border-gold/30 bg-bg1/95 backdrop-blur p-3 md:p-4 shadow-2xl"
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
