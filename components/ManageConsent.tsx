"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGE_EVENT, CONSENT_STORAGE_KEY, readChoice, type Choice } from "@/lib/consent";
import { openCookieSettings } from "@/lib/consent-open";

// The current choice on /cookies, kept up to date when it changes in this tab (the banner fires
// CONSENT_CHANGE_EVENT) or in another one (storage event). The button reopens the banner in place;
// it used to clear the choice and reload the page.
export default function ManageConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);

  useEffect(() => {
    const refresh = () => setChoice(readChoice());
    const onStorage = (e: StorageEvent) => {
      if (e.key === CONSENT_STORAGE_KEY || e.key === null) refresh();
    };
    refresh();
    window.addEventListener(CONSENT_CHANGE_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-ink/10 p-5">
      <p className="text-sm text-mist" aria-live="polite">
        Your current choice:{" "}
        <span className="text-ink">
          {choice === "granted" ? "Accepted" : choice === "denied" ? "Rejected" : "Not decided yet"}
        </span>
      </p>
      <button
        type="button"
        onClick={(e) => openCookieSettings(e.currentTarget)}
        className="mt-3 rounded-full border border-gold/40 text-gold text-sm px-5 py-2 hover:border-gold hover:text-gold2 transition"
      >
        Change my cookie choice
      </button>
    </div>
  );
}
