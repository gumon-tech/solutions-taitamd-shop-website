// The address the visit opened on (the first page this JavaScript ran on), kept in page memory
// only: no cookie, no storage, never sent. Read once, before an in-site page change (next/link)
// drops the query. Used by components/AdSource.tsx ([web-AD]), lib/clickref.ts (the ad click
// code) and components/Analytics.tsx (page_location on an Accept given on a later page).
// Copied from the Sri Siam site (solution-sst-website lib/landing.ts).
let landing: string | null = null;

export function landingUrl(): string {
  if (landing === null) landing = window.location.href;
  return landing;
}

/** Ad click references Google adds to a landing address, in Google's own order of priority. */
export const CLICK_ID_KINDS = ["gclid", "wbraid", "gbraid"] as const;

/** True if the visit opened on an address from a Google ad click. */
export function landedFromAd(): boolean {
  try {
    const p = new URL(landingUrl()).searchParams;
    if (CLICK_ID_KINDS.some((k) => p.has(k))) return true;
    return p.get("utm_source")?.toLowerCase() === "google" && p.get("utm_medium")?.toLowerCase() === "cpc";
  } catch {
    return false;
  }
}

/** True if this address carries one of Google's ad click references. */
export function hasClickId(url: string): boolean {
  try {
    const p = new URL(url).searchParams;
    return CLICK_ID_KINDS.some((k) => p.has(k));
  } catch {
    return false;
  }
}
