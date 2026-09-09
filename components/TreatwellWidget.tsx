"use client";

import { useState } from "react";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import { SITE } from "@/lib/site";

/**
 * Treatwell's booking system, embedded on /book/ and loaded only when the visitor asks.
 *
 * TWO THINGS ARE RECORDED HERE ON PURPOSE. Neither is a suggestion to remove the widget;
 * both are facts that the next person to touch this file needs, and that nobody will
 * reconstruct from the markup.
 *
 * 1. Cookies. Loading widget.treatwell.co.uk sets fe20-flipper-id and growthbook_id, both
 *    expiring 2028, measured 2026-09-09. Our consent banner tells visitors that declining
 *    means nothing is stored on their device. So the frame waits for a click and the line
 *    above the button says what the click does — the banner's promise stays true for the
 *    visitor who never presses it, and the one who does was told first. The owner chose
 *    this shape over an always-on frame on 2026-09-09.
 *
 * 2. What the widget lists. It shows the shop's whole Treatwell menu and has no filter
 *    parameter — checked on 2026-09-09, there is none. That menu includes botulinum toxin
 *    treatments: the fetched widget page carried "Botox" 10 times, "botulinum" 6 and
 *    "Anti-Wrinkle" 5. Q-LAW-046 (Legal, 2026-08-18) rules that those must never appear on
 *    this site, because advertising a prescription-only medicine to the public is unlawful
 *    under the Human Medicines Regulations 2012 reg. 280.
 *
 *    The owner was shown that finding twice, in those terms, and instructed on 2026-09-09
 *    that the widget goes back regardless. That is his call to make and the risk is his;
 *    this comment exists so the decision is legible rather than buried, and so nobody
 *    later reads the widget as evidence that Q-LAW-046 was withdrawn. It was not. It is
 *    overridden here, on this one surface, by the owner, on that date.
 *
 *    The way to hold both is still open and costs the shop nothing on our side: hide the
 *    botulinum rows in Treatwell Connect, and the widget stops carrying them.
 */
export default function TreatwellWidget() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="mt-8 rounded-2xl border border-[#cdb887] bg-white/50 p-5">
        <h2 className="text-sm font-semibold text-[#183b2d]">Prefer to book online?</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#5b6d62]">
          Our live availability on Treatwell can open right here. It is their booking system,
          so opening it stores Treatwell&rsquo;s own cookies on your device.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cdb887] px-5 py-2.5 text-sm font-semibold text-[#345a45] transition hover:bg-white/70"
          >
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            Load the Treatwell booking widget
          </button>
          <a
            href={SITE.treatwellBooking}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-[#5b6d62] underline decoration-[#5b6d62]/40 underline-offset-4 transition hover:text-[#183d2d]"
          >
            Or open Treatwell in a new tab
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-2xl border border-[#cdb887] bg-white">
        <iframe
          title="Treatwell booking"
          src={SITE.treatwellWidget}
          className="block h-[70vh] min-h-[560px] w-full sm:min-h-[620px]"
        />
      </div>
      <p className="mt-3 text-xs text-[#5b6d62]">
        Booking and payment from here run on Treatwell, under their terms.{" "}
        <a
          href={SITE.treatwellBooking}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-[#5b6d62]/40 underline-offset-4 transition hover:text-[#183d2d]"
        >
          Open it in a new tab instead
        </a>{" "}
        if it does not load.
      </p>
    </div>
  );
}
