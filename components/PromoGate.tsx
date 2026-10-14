"use client";

import { useEffect, useState } from "react";
import { windowActive, type PromotionWindow } from "@/lib/promotions";

// The site is a static export: nothing rebuilds it when a promotion starts or ends
// (data/promotions.json), and a page built before the end date would keep advertising an
// expired offer to every visitor, including the ones Google Ads pays for. So the visitor's own
// clock decides. Children show while any of the windows is open.
//
// `initiallyActive` is the answer at build time, worked out by the server component that renders
// this. Starting from it keeps the first client render identical to the HTML (no hydration
// mismatch); the effect then re-checks against the visitor's clock right after hydration.
export default function PromoGate({
  windows,
  initiallyActive,
  children,
}: {
  windows: PromotionWindow[];
  initiallyActive: boolean;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(initiallyActive);
  useEffect(() => {
    setActive(windows.some((w) => windowActive(w)));
  }, [windows]);
  return active ? <>{children}</> : null;
}
