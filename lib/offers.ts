// The home page promotions end on Friday 16 October 2026 (owner's terms, relayed by OFFICE —
// see the comment above `campaigns` in components/Campaigns.tsx). The cutoff is midnight at the
// shop, London time; in October that is BST, UTC+1, so the offers stop at 2026-10-16T23:00Z.
// Kept out of the "use client" gate so the server-rendered Campaigns can call it at build time.
export const OFFERS_END_LABEL = "Friday 16 October 2026";
const OFFERS_END_AT = Date.parse("2026-10-16T23:00:00Z");

export function offersLive(now = Date.now()) {
  return now < OFFERS_END_AT;
}
