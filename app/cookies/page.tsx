import { Metadata } from "next";
import Link from "next/link";
import ManageConsent from "@/components/ManageConsent";
import { CONSENT_MAX_AGE_DAYS, CONSENT_STORAGE_KEY } from "@/lib/consent";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Taitam-D Beauty & Spa uses cookies on taitam-d.com — no Google Ads or Analytics unless you accept, what is set if you do, and how to change your choice.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 md:px-8 pb-24 pt-10 md:pt-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Cookie Policy</h1>
      {/*
        25 November 2026: basic Consent Mode (nothing from Google before Accept), Accept and
        Reject, the choice key ttd-consent:v2. This room's own ruling (the legal room closed,
        Q-KWS-118). Set the date to the London day it actually goes live if that is not 25 November.
      */}
      <p className="mt-2 text-sm text-mist">Effective 25 November 2026 · taitam-d.com</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/90">
        <section>
          <h2 className="text-lg font-medium text-ink">The short version</h2>
          <p className="mt-2">
            We set <span className="text-gold">no cookies on your device</span> and load no
            Google Ads or Google Analytics unless you accept. If you reject, or do not choose,
            neither of them loads: no tag, no cookie, no signal that you visited. (The map on
            our home and contact pages comes from Google Maps whatever you choose, and Google may read or set its own cookies there; our Privacy
            Notice explains what that means.)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Accept and Reject</h2>
          {/*
            Basic Consent Mode since 2026-11-25 (components/Analytics.tsx). Until then the tag
            loaded on every visit and sent cookieless pings before any answer, and these two
            paragraphs said so. Now nothing is requested from Google before Accept, so the
            "to be complete about it" paragraph about pings reaching Google's servers came out:
            it described something that no longer happens.
          */}
          <p className="mt-2 text-mist">
            If you reject, or have not chosen yet, this website does not load Google&apos;s tag
            at all. Nothing is requested from Google Ads or Google Analytics, nothing is stored
            on your device apart from your choice, and the website works exactly the same.
          </p>
          <p className="mt-3 text-mist">
            If you accept, the website loads Google&apos;s tag for Google Ads and Google
            Analytics. It is set up for measurement only: Google Ads may store the cookies
            below to link a visit to an ad click, so that we can see which of our ads lead to
            WhatsApp enquiries, and{" "}
            <span className="text-ink">
              Google does not use it to personalise the adverts you see
            </span>
            . Our{" "}
            <Link href="/privacy" className="underline text-gold hover:text-gold2">
              Privacy Notice
            </Link>{" "}
            explains what Google receives when you accept.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">What we store and when</h2>
          <p className="mt-2 text-mist">
            This is the complete list, checked against what the site actually
            writes — not a typical example.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="border-b border-ink/15 text-ink">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Set when</th>
                  <th className="py-2 pr-4 font-medium">Purpose</th>
                  <th className="py-2 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody className="text-mist align-top">
                {/*
                  Key and lifetime read from lib/consent.ts, so this row cannot drift from the
                  code. The entry stays in local storage until replaced or cleared, but a choice
                  older than the limit is ignored and the banner asks again, so the limit is the
                  honest lifetime. The older key, ttd-consent, is deleted on the next visit.
                */}
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>{CONSENT_STORAGE_KEY}</code></td>
                  <td className="py-2 pr-4">Accept or Reject</td>
                  <td className="py-2 pr-4">
                    Remembers your choice and when you made it, so we stop asking. Stored in
                    local storage, not a cookie, and never sent to us or anyone else.
                  </td>
                  <td className="py-2">
                    {CONSENT_MAX_AGE_DAYS} days, then we ask again
                  </td>
                </tr>
                {/*
                  Re-measured 2026-11-25 for the basic-mode tag (Accept grants ad_storage and
                  ad_user_data only; analytics_storage stays denied). Both routes, CLAUDE.md rule 2:
                  plain visit → Accept: _gcl_au (cookie, 90 days) + _gcl_ls (local storage);
                  ?gclid=TEST → Accept: _gcl_au + _gcl_aw (cookie, 90 days) + _gcl_ls.
                  Reject, or no answer, with or without gclid: nothing at all.
                  _ga and _ga_R8SGQ58R5E no longer appear (analytics_storage denied), so their rows
                  were removed. _gcl_au now reproduces on every accepted visit, which is the trigger
                  Q-KWS-013 set for adding it; its reserve wording ended "Does not identify you",
                  changed here (KWEB legal call, 2026-11-25) because an ad-click reference is an
                  online identifier under UK GDPR: we say what it does not contain instead.
                */}
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>_gcl_au</code></td>
                  <td className="py-2 pr-4">Only if you accept</td>
                  <td className="py-2 pr-4">
                    Google Ads — a random number for this browser, used to measure which of our
                    ads lead to WhatsApp enquiries. It does not contain your name or contact
                    details.
                  </td>
                  <td className="py-2">90 days</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>_gcl_aw</code></td>
                  <td className="py-2 pr-4">
                    Only if you accept — and only when you arrived from a Google ad
                  </td>
                  <td className="py-2 pr-4">
                    Google Ads — records which ad click brought you here, so that an enquiry
                    can be counted against that ad. It does not contain your name or contact
                    details.
                  </td>
                  <td className="py-2">90 days</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4"><code>_gcl_ls</code></td>
                  <td className="py-2 pr-4">Only if you accept</td>
                  <td className="py-2 pr-4">
                    Google Ads — a copy of the same Google Ads information as the cookies
                    above, kept in local storage (not a cookie) so it survives if a cookie is
                    cleared. It does not contain your name or contact details.
                  </td>
                  <td className="py-2">90 days</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/*
            This paragraph deliberately says nothing about which cookies the
            Academy sets. An earlier version claimed it set none, which was
            false; the version after that listed what it did set, which was
            true for about half a day. The Academy is a system we do not
            control, so any inventory we write here goes stale without anyone
            telling us — and it goes stale inside a legal page.

            So it links to their policy instead. Adding "the Academy sets no
            analytics cookies" back, however true it looks on the day, puts the
            time bomb back. If someone asks for that detail, it belongs on
            their page, not ours.
          */}
          {/*
            "Both analytics cookies" became "The Google cookies above" on 2026-11-25: the Ads tag
            is now configured directly, and with cookie_domain "none" too (components/Analytics.tsx),
            so every Google cookie in the table is host-only, not just the two analytics ones.
          */}
          <p className="mt-3 text-mist">
            The Google cookies above are set for <span className="text-ink">this
            website only</span>. They are <span className="text-ink">not shared
            with our Academy site</span> at academy.taitam-d.com — that is a
            separate site, and whatever it stores on your device is covered by{" "}
            {/* Built from SITE.academy rather than typed out, because this was the
                one Academy link on the site that a domain change would leave behind.
                The other nine all read the central value; this one did not, and the
                handoff had been claiming for days that changing one value covered
                every link. Rendered output is byte-identical, so the wording Legal
                signed off on is untouched. */}
            <a
              href={`${SITE.academy}en/policies/cookie-policy`}
              target="_blank"
              rel="noreferrer"
              className="underline text-gold hover:text-gold2"
            >
              its own cookie policy
            </a>
            . If we ever add anything to this list, we will update this table
            before it goes live.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Who else sees this data</h2>
          <p className="mt-2 text-mist">
            If you accept, measurement data is shared with Google LLC (Google Ads, and
            Google Analytics without cookies).
            {SITE.googleAds.clickRef.endpoint ? (
              <>
                {" "}If you came from one of our Google ads and accepted, pressing a WhatsApp button
                also sends a short code and Google&apos;s reference for your ad click to our booking
                assistant, which Gumon Technology runs for us; our{" "}
                <Link href="/privacy" className="underline text-gold hover:text-gold2">
                  Privacy Notice
                </Link>{" "}
                explains how long it is kept.
              </>
            ) : null}{" "}
            We do not sell your data. We do not use analytics to identify you personally.
          </p>
          <p className="mt-3 text-mist">
            Google processes this outside the UK, including in the United States.
            That transfer relies on the UK Extension to the EU–US Data Privacy
            Framework, which Google LLC is certified under.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Changing your mind</h2>
          <p className="mt-2 text-mist">
            You can change your choice at any time with the button below or the Cookie
            settings link at the bottom of every page. If you change to Reject, this website
            stops Google&apos;s tag and deletes the Google cookies listed above from this
            website. You can also clear this site&apos;s data in your browser settings.
          </p>
          <ManageConsent />
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Questions</h2>
          <p className="mt-2 text-mist">
            Email us at info@taitam-d.com and we&apos;ll be happy to help.
          </p>
        </section>
      </div>
    </main>
  );
}
