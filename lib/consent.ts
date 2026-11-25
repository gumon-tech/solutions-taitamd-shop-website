// The visitor's cookie choice and the Google Consent Mode v2 primitives (basic implementation).
// Adapted from the Sri Siam site (solution-sst-website lib/consent.ts). The tag configuration
// itself (ids, cookie_domain "none") stays in components/Analytics.tsx, CLAUDE.md rule 1.
//
// Rules this file enforces:
// - Nothing is pushed for Google until grantConsent() is called (a visitor's Accept, now or
//   stored), and the first command ever pushed to dataLayer is the consent default (all denied).
//   gtag.js itself is requested by Analytics.tsx only after the update to granted.
// - Accept is measurement only: ad_storage and ad_user_data granted; ad_personalization
//   (remarketing) and analytics_storage stay denied.
// - Every access to web storage is wrapped: if storage fails there is no stored choice, and a
//   choice that cannot be saved loads nothing.

import { SITE } from "@/lib/site";

export type Choice = "granted" | "denied";

/**
 * Versioned with the banner wording (lib/site.ts googleAds.consentVersion), so an Accept given to
 * older words does not count. Older keys ("ttd-consent", which held a bare "granted"/"denied"
 * from the advanced-mode banner, and any other "ttd-consent:*") are deleted on load.
 */
const KEY_PREFIX = "ttd-consent";
export const CONSENT_VERSION = SITE.googleAds.consentVersion;
export const CONSENT_STORAGE_KEY = `${KEY_PREFIX}:${CONSENT_VERSION}`;
/** How long a choice is honoured; after this the banner asks again. /cookies states it. */
export const CONSENT_MAX_AGE_DAYS = 182;
/** Fired on window right after a choice is written in this page (other tabs get a storage event). */
export const CONSENT_CHANGE_EVENT = "ttd-consent:change";

const DAY_MS = 86_400_000;
/** Google's cookies on this site: Ads (_gcl_*, _gac_*) and Analytics (_ga, _ga_<id>). */
const GOOGLE_COOKIE = /^(_gcl_|_gac_|_ga)/;
/** Google Ads keeps a copy of the click reference in web storage (_gcl_ls). */
const GOOGLE_STORAGE_KEY = /^_gcl_/;

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;
// Measurement only (the banner, /cookies and /privacy say so). For remarketing, ad_personalization
// would be "granted" here, and all three would have to say that Google uses it for ads.
const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// ---- stored choice ------------------------------------------------------------------

export function readChoice(now: number = Date.now()): Choice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as { choice?: unknown; at?: unknown };
    if (s.choice !== "granted" && s.choice !== "denied") return null;
    if (typeof s.at !== "number" || !Number.isFinite(s.at)) return null;
    if (now - s.at > CONSENT_MAX_AGE_DAYS * DAY_MS || s.at - now > DAY_MS) return null;
    return s.choice;
  } catch {
    return null;
  }
}

/** true only if the choice was saved and reads back the same. Tells this page either way. */
export function writeChoice(choice: Choice): boolean {
  let saved = false;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ choice, at: Date.now() }));
    saved = readChoice() === choice;
  } catch {
    saved = false;
  }
  try {
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  } catch {
    // never let this get in the way of the choice itself
  }
  return saved;
}

/** Deletes choices stored under older keys, so an Accept given to older wording does not count. */
export function dropOldChoices(): void {
  try {
    const store = window.localStorage;
    const old: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k && (k === KEY_PREFIX || k.startsWith(`${KEY_PREFIX}:`)) && k !== CONSENT_STORAGE_KEY) old.push(k);
    }
    old.forEach((k) => store.removeItem(k));
  } catch {
    // storage blocked: nothing to delete
  }
}

// ---- gtag ---------------------------------------------------------------------------------

let started = false; // dataLayer exists and the consent default is in it

// The standard gtag snippet: gtag.js reads `arguments` objects from dataLayer, not arrays.
export function gtag(..._args: unknown[]): void {
  void _args;
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/** Accept: consent default (all denied, once per page), then the update to measurement only. */
export function grantConsent(): void {
  if (!started) {
    started = true;
    gtag("consent", "default", DENIED);
  }
  gtag("consent", "update", GRANTED);
}

/** Reject or withdrawal: back to denied if the tag ever started in this page, and delete Google's storage. */
export function denyConsent(): void {
  if (started) gtag("consent", "update", DENIED);
  clearGoogleStorage();
}

/**
 * Deletes Google's cookies (_gcl_*, _gac_*, _ga*) on this host and every parent domain, and _gcl_*
 * keys in local and session storage. Only deletes, never requests anything.
 */
export function clearGoogleStorage(): void {
  try {
    const names = document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter((n) => GOOGLE_COOKIE.test(n));
    if (names.length) {
      const parts = window.location.hostname.split(".");
      const domains = [""];
      for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join("."));
      for (const n of new Set(names)) {
        for (const d of domains) {
          document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/${d ? `; domain=${d}` : ""}`;
        }
      }
    }
  } catch {
    // cookies blocked: nothing to delete
  }
  for (const area of ["localStorage", "sessionStorage"] as const) {
    try {
      const store = window[area];
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && GOOGLE_STORAGE_KEY.test(k)) keys.push(k);
      }
      keys.forEach((k) => store.removeItem(k));
    } catch {
      // storage blocked: nothing to delete
    }
  }
}
