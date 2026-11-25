"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CONSENT_STORAGE_KEY,
  clearGoogleStorage,
  denyConsent,
  dropOldChoices,
  grantConsent,
  gtag,
  readChoice,
  writeChoice,
  type Choice,
} from "@/lib/consent";
import { onOpenCookieSettings } from "@/lib/consent-open";
import { hasClickId, landingUrl } from "@/lib/landing";
import { SITE } from "@/lib/site";
import { SOURCE_CAREERS, chatLinkWithTag, isWhatsAppBookingLink, readChatLinkTag } from "@/lib/whatsapp";

// Google Consent Mode v2, BASIC implementation (ads-and-web-standard §1.3, 2026-11-25). Until the
// visitor clicks Accept, now or on an earlier visit, nothing is requested from Google: no gtag.js,
// no googletagmanager / google-analytics / doubleclick request, no cookieless ping. Reject leaves
// it that way. Accept is measurement only: ad_storage and ad_user_data granted, ad_personalization
// and analytics_storage denied (lib/consent.ts), then gtag.js loads once with the Google Ads tag
// and GA4. GA4 is for analysis only and is not the source of the Ads conversion (standard §1.5);
// its lead events still fire, after Accept only, because KMKT keeps importing
// whatsapp_booking_click until the Ads tag's own conversion has matched it for 14 days.
//
// Until 2026-11-25 this file ran ADVANCED mode: the tag loaded on every visit and sent cookieless
// pings before consent, and Accept granted everything including ad_personalization. The banner
// wording changed with it, so the stored key moved to ttd-consent:v2 and older answers are deleted.
export const GA_ID = "G-R8SGQ58R5E";
const { tagId: ADS_ID, whatsappConversion, conversionValue, currency } = SITE.googleAds;

let loaded = false; // gtag.js was requested in this page
let accepted = false; // the visitor's current answer in this page

// Anyone who accepted before the host-only switch still carries a .taitam-d.com
// cookie that surfaces on the Academy subdomain. Clear those once, on the
// parent domain, so the leak drains instead of lingering for its two-year life.
// Runs on every load whatever the choice: it only deletes, never requests anything.
function dropWideCookies() {
  const parent = location.hostname.replace(/^www\./, "");
  for (const raw of document.cookie.split(";")) {
    const name = raw.trim().split("=")[0];
    if (!name.startsWith("_ga")) continue;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parent}`;
  }
}

// gtag.js stops sending for an id whose window["ga-disable-<id>"] is true. Set on withdrawal, so
// GA4's automatic page views on in-site page changes stop too, not only our own events.
function setTagsDisabled(off: boolean) {
  const w = window as unknown as Record<string, unknown>;
  w[`ga-disable-${GA_ID}`] = off;
  w[`ga-disable-${ADS_ID}`] = off;
}

/** Accept: consent update first, then (once per page) gtag.js with both tags. */
function loadTags() {
  grantConsent();
  if (loaded) setTagsDisabled(false);
  accepted = true;
  if (loaded) return;
  loaded = true;

  gtag("js", new Date());
  // "none" keeps every Google cookie host-only, for both tags. The default, "auto", writes to
  // .taitam-d.com, so an accept here would put _ga / _gcl_* on academy.taitam-d.com too — a
  // site that sets no cookies of its own and says so in its policy. CLAUDE.md rule 1.
  // page_location: an Accept given after an in-site page change has lost the click id from the
  // address bar, so the Ads tag is told the address the visit landed on (as on Sri Siam).
  const landing = landingUrl();
  gtag("config", ADS_ID, hasClickId(landing) ? { cookie_domain: "none", page_location: landing } : { cookie_domain: "none" });
  // Signals and ad personalisation off at the property too, so "not used to show you ads
  // elsewhere" does not depend on a console setting.
  gtag("config", GA_ID, { cookie_domain: "none", allow_google_signals: false, allow_ad_personalization_signals: false });

  if (document.getElementById("ttd-gtag")) return;
  const s = document.createElement("script");
  s.id = "ttd-gtag";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
  document.head.appendChild(s);
}

/** Reject or withdrawal: consent back to denied, no more events, Google's cookies and _gcl_ storage deleted. */
function stopTags() {
  accepted = false;
  if (loaded) setTagsDisabled(true);
  denyConsent();
}

// A wa.me link means one of two opposite things, and the difference is the whole
// point of the number: a link with a path (/447564292247, /qr/XXXX) opens a chat
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
    if (!u.pathname.replace(/^\/+|\/+$/g, "")) return "social_share_click";
    // Someone opening WhatsApp from the careers page is applying for a job, not booking a
    // treatment. The name is what Ads imports, so leaving them under the same one would have
    // the campaign bidding for job seekers at the price of customers — the same mistake the
    // share button made in August, arriving from a different direction (Q-KWEB-015, KMKT
    // agreed 2026-10-20). Their one condition: nothing may ever turn careers_enquiry_click
    // into a conversion action or key event, or this is undone at the console instead.
    return location.pathname.startsWith("/careers") ? "careers_enquiry_click" : "whatsapp_booking_click";
  }
  if (SHARE_HOSTS.has(u.hostname) && /sharer|intent/.test(u.pathname)) return "social_share_click";
  return null;
}

// Lead events and the Google Ads conversion, only while accepted and the tag is loaded. Bubble
// phase on document, so it runs after the capture-phase rewrites (AdSource, lib/clickref.ts) and
// reads the tag actually sent. It never prevents or delays the navigation.
function onLeadClick(e: MouseEvent) {
  if (!accepted || !loaded) return;
  if (e.type === "auxclick" && e.button !== 1) return;
  const a = (e.target as HTMLElement | null)?.closest?.("a");
  if (!a?.href) return;
  const t = readChatLinkTag(a.href);

  // GA4, as before but after Accept only. This listener is the only thing that fires
  // whatsapp_booking_click, which KMKT still imports into Ads until the Ads tag's own conversion
  // below has matched it for 14 days (standard §5). Delete it before then and the campaign stops
  // seeing enquiries while the site still works perfectly.
  if (e.type === "click") {
    const name = leadEventFor(a.href);
    // The ad click code (lib/clickref.ts) goes to Google Ads as the conversion's reference only,
    // never into GA4 as part of the link.
    const linkUrl = t?.code ? chatLinkWithTag(t, t.tag) : a.href;
    // send_to GA4 only: without it gtag also delivers the event to the Ads tag (seen 2026-11-25).
    if (name) gtag("event", name, { link_url: linkUrl, page_path: location.pathname, send_to: GA_ID });
  }

  // Google Ads "WhatsApp chat start (web)": chat links only (not share links, not tel:), never on
  // a [web-CR] job-application link (same rule as lib/whatsapp.ts adTagApplies). No enhanced
  // conversions, no user data.
  if (!isWhatsAppBookingLink(a.href) || t?.tag === SOURCE_CAREERS) return;
  const params: Record<string, string | number> = {
    send_to: whatsappConversion,
    value: conversionValue,
    currency,
    transport_type: "beacon",
  };
  // Only while lib/site.ts googleAds.clickRef.endpoint is set: the code exists only then.
  if (t?.code) params.transaction_id = t.code;
  try {
    gtag("event", "conversion", params);
  } catch {
    // never let measurement get in the way of the click
  }
}

export default function Analytics() {
  // Closed until storage has been read, so the banner never flashes for someone who already chose.
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Choice | null>(null);
  const [reopened, setReopened] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  const region = useRef<HTMLDivElement | null>(null);

  // First load: a stored Accept loads the tags; anything else loads nothing and deletes Google's
  // storage (left by the advanced-mode banner, or by an Accept since withdrawn elsewhere).
  useEffect(() => {
    // Read the landing address now, before any in-site page change drops its query: an Accept
    // given on a later page still passes it to the Ads tag (AdSource reads it too).
    landingUrl();
    dropWideCookies();
    dropOldChoices();
    const c = readChoice();
    setCurrent(c);
    if (c === "granted") loadTags();
    else {
      clearGoogleStorage();
      if (c === null) setOpen(true);
    }
    document.addEventListener("click", onLeadClick);
    document.addEventListener("auxclick", onLeadClick);
    return () => {
      document.removeEventListener("click", onLeadClick);
      document.removeEventListener("auxclick", onLeadClick);
    };
  }, []);

  // "Cookie settings" (footer, /privacy, /cookies) reopens the banner in place and moves focus to it.
  useEffect(
    () =>
      onOpenCookieSettings((el) => {
        opener.current = el;
        setCurrent(readChoice());
        setReopened(true);
        setOpen(true);
        requestAnimationFrame(() => region.current?.focus());
      }),
    [],
  );

  // A choice made in another tab of this site applies here too (withdrawal stops the tags at once).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== CONSENT_STORAGE_KEY && e.key !== null) return;
      const c = readChoice();
      setCurrent(c);
      if (c === "granted") {
        loadTags();
        setOpen(false);
      } else {
        stopTags();
        if (c === "denied") setOpen(false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setReopened(false);
    const back = opener.current;
    opener.current = null;
    if (back?.isConnected) back.focus();
  }, []);

  const decide = useCallback(
    (c: Choice) => {
      const saved = writeChoice(c);
      // Reject, or an Accept that could not be saved: nothing loads, nothing is sent.
      if (c === "granted" && saved) loadTags();
      else stopTags();
      setCurrent(saved ? c : null);
      close();
    },
    [close],
  );

  // Escape closes the banner only when it was reopened (the earlier choice stands); a first visit must choose.
  useEffect(() => {
    if (!open || !reopened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, reopened, close]);

  if (!open) return null;

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
  // Using the site is never treated as agreement, and the banner stays answerable.
  //
  // 2026-11-25 (basic mode): the wording above is replaced, this room's own ruling (the legal
  // room closed under Q-KWS-118). The text is kept to the old sheet's length so the geometry
  // above still holds; re-measure the sheet height in the visual gate if it grows. Accept and
  // Reject are the same size and the same style: Reject must be as easy as Accept, and a
  // filled Accept beside an outlined Decline was a nudge.
  // "Reject loads no Google Ads or Analytics", not "nothing from Google": the map on the home
  // and contact pages is a Google Maps frame that loads whatever the choice (see /privacy).
  return (
    <div
      ref={region}
      role="dialog"
      aria-label="Cookie consent"
      tabIndex={-1}
      className="fixed inset-x-3 bottom-1 [@media(max-height:700px)]:bottom-20 md:bottom-4 md:left-auto md:right-4 md:max-w-sm z-[70] rounded-2xl border border-gold/30 bg-bg1/95 backdrop-blur p-3 md:p-4 shadow-2xl outline-none"
    >
      <p className="text-xs leading-relaxed text-ink/90 md:text-sm">
        Accept lets Google measure our visits and, with Google Ads cookies, which of our ads
        lead to WhatsApp enquiries. It is not used to show you ads elsewhere. Reject loads no
        Google Ads or Analytics.{" "}
        <Link href="/cookies" className="underline text-gold hover:text-gold2">
          Cookie Policy
        </Link>
      </p>
      {reopened && current && (
        <p className="mt-1.5 text-xs text-mist">
          Your current choice: {current === "granted" ? "Accepted" : "Rejected"}.
        </p>
      )}
      <div className="mt-2.5 flex gap-2 md:mt-3">
        <button
          type="button"
          onClick={() => decide("granted")}
          className="flex-1 rounded-full border border-gold/40 text-ink text-sm font-medium px-4 py-2 hover:border-gold hover:text-gold2 transition"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => decide("denied")}
          className="flex-1 rounded-full border border-gold/40 text-ink text-sm font-medium px-4 py-2 hover:border-gold hover:text-gold2 transition"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
