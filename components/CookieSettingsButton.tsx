"use client";

import type { ReactNode } from "react";
import { openCookieSettings } from "@/lib/consent-open";

/**
 * Reopens the cookie banner in place, without a reload, so a visitor can change their mind
 * (ads-and-web-standard §1.3: a change-your-mind control in the footer and on the privacy page).
 * A button, not a link: it goes nowhere. Focus moves to the banner and comes back here when it closes.
 */
export default function CookieSettingsButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" data-cookie-settings="" className={className} onClick={(e) => openCookieSettings(e.currentTarget)}>
      {children}
    </button>
  );
}
