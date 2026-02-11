"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

export default function BookPage() {
  useEffect(() => {
    window.location.href = SITE.treatwell;
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pt-28 md:pt-32 pb-28 md:pb-16">
      <div className="glass rounded-[28px] p-7 md:p-10 shadow-glow">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Booking</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
          Redirecting to <span className="text-gold">Treatwell</span>…
        </h1>
        <p className="mt-4 text-sm md:text-base text-mist">
          If it doesn’t open automatically, use the button below.
        </p>

        <a
          href={SITE.treatwell}
          className="mt-6 btn-shine inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/12 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
        >
          Open Treatwell
        </a>
      </div>
    </main>
  );
}
