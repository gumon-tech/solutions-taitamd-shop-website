"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { landedFromAd } from "@/lib/landing";
import { SITE } from "@/lib/site";
import { SOURCE_AD, adTagApplies, chatLinkWithTag, readChatLinkTag } from "@/lib/whatsapp";

/**
 * Tag [web-AD], adapted from the Sri Siam site (solution-sst-website components/AdSource.tsx).
 *
 * When the visit started on an address carrying gclid, gbraid or wbraid, or utm_source=google
 * with utm_medium=cpc (a Google Ads click), every WhatsApp chat link for the rest of the visit
 * ends [web-AD] instead of its own letter, on every page and on links that appear later.
 *
 * The answer is decided once, from the address the visit opened on, and lives only in module
 * memory: no cookie, no localStorage or sessionStorage, nothing sent anywhere. That is why it
 * runs whatever the cookie choice is, as on Sri Siam. Without JavaScript the links keep their
 * own letters.
 *
 * Never touched: bare share links (wa.me/?text=, they open the visitor's own contacts), links on
 * [web-CR] links (job applicants are not ad customers). Open-chat links keep the
 * blank lines after the tag (lib/whatsapp.ts chatLinkWithTag).
 *
 * Each link's own letter is kept in data-wa-tag, sent by lib/clickref.ts as "surface".
 * lib/clickref.ts adds the code after Accept; it is loaded only on an ad visit, and only while
 * lib/site.ts googleAds.clickRef.endpoint is set.
 */
let fromAd: boolean | null = null;

function visitFromAd(): boolean {
  if (fromAd === null) fromAd = landedFromAd();
  return fromAd;
}

function retag(a: HTMLAnchorElement) {
  const t = readChatLinkTag(a.href);
  if (!t || !adTagApplies(t, window.location.pathname)) return;
  // Already [web-AD] or [web-AD-<code>] (lib/clickref.ts owns the code): leave it.
  if (t.tag === SOURCE_AD) return;
  a.dataset.waTag = t.tag;
  a.href = chatLinkWithTag(t, SOURCE_AD);
}

function retagAll() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]').forEach(retag);
}

export default function AdSource() {
  const pathname = usePathname();

  // Decide on the first page of the visit, before any in-site page change drops the query.
  useEffect(() => {
    if (!visitFromAd()) return;
    // Links that appear later (menus, dialogs) are caught when they are used.
    const onActivate = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (a instanceof HTMLAnchorElement) retag(a);
    };
    document.addEventListener("click", onActivate, true);
    document.addEventListener("auxclick", onActivate, true);
    document.addEventListener("contextmenu", onActivate, true);
    return () => {
      document.removeEventListener("click", onActivate, true);
      document.removeEventListener("auxclick", onActivate, true);
      document.removeEventListener("contextmenu", onActivate, true);
    };
  }, []);

  // Every page the visit reaches: rewrite the links on it.
  useEffect(() => {
    if (!visitFromAd()) return;
    retagAll();
    const { clickRef, consentVersion } = SITE.googleAds;
    if (!clickRef.endpoint) return;
    // After the [web-AD] rewrite above, so the code is added to it (and only on an ad visit).
    import("@/lib/clickref")
      .then((m) => m.startClickRef({ endpoint: clickRef.endpoint, site: clickRef.site, cv: consentVersion, adTag: SOURCE_AD }))
      .catch(() => {});
  }, [pathname]);

  return null;
}
