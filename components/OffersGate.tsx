"use client";

import { useEffect, useState } from "react";
import { offersLive } from "@/lib/offers";

// The site is a static export, so nothing rebuilds it when the promotions end (lib/offers.ts):
// the page built before the end date would keep advertising expired offers to every visitor,
// including the ones Google Ads pays for. So the visitor's own clock decides.
//
// The first client render shows the children, matching HTML built before the end date (no
// hydration mismatch); after the end date the effect removes them right after hydration.
// This is the safety net, not the plan: once the offers have ended, delete or replace the cards
// in Campaigns.tsx and this gate with them.
export default function OffersGate({ children }: { children: React.ReactNode }) {
  const [live, setLive] = useState(true);
  useEffect(() => {
    setLive(offersLive());
  }, []);
  return live ? <>{children}</> : null;
}
