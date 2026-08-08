"use client";

import { getConsent, resetConsent } from "@/components/Analytics";
import { useEffect, useState } from "react";

export default function ManageConsent() {
  const [choice, setChoice] = useState<string | null>(null);

  useEffect(() => {
    setChoice(getConsent());
  }, []);

  return (
    <div className="mt-6 rounded-2xl border border-ink/10 p-5">
      <p className="text-sm text-mist">
        Your current choice:{" "}
        <span className="text-ink">
          {choice === "granted" ? "Accepted" : choice === "denied" ? "Declined" : "Not decided yet"}
        </span>
      </p>
      <button
        onClick={resetConsent}
        className="mt-3 rounded-full border border-gold/40 text-gold text-sm px-5 py-2 hover:border-gold hover:text-gold2 transition"
      >
        Change my cookie choice
      </button>
    </div>
  );
}
