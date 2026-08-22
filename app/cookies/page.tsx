import { Metadata } from "next";
import ManageConsent from "@/components/ManageConsent";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Taitam-D Beauty & Spa uses cookies on taitam-d.com — what we set, when, and how to change your choice.",
  alternates: { canonical: "/cookies" },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 md:px-8 pb-24 pt-10 md:pt-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Cookie Policy</h1>
      <p className="mt-2 text-sm text-mist">Effective 8 August 2026 · taitam-d.com</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/90">
        <section>
          <h2 className="text-lg font-medium text-ink">The short version</h2>
          <p className="mt-2">
            We set <span className="text-gold">no cookies on your device</span> unless you
            accept. If you decline, our measurement tool still records that an
            anonymous visit happened — but with no cookie, no advertising
            identifier and nothing that could be traced back to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">What happens if you decline</h2>
          <p className="mt-2 text-mist">
            We use Google Consent Mode. Google&apos;s tag loads on the page, but every
            storage permission starts switched off and stays off unless you accept.
            While it is off, the tag sends only a basic, cookieless signal that a
            page was viewed. It cannot store anything on your device, cannot read a
            previous visit, and click identifiers from adverts are stripped out
            before the signal is sent. This lets us see roughly how many people
            visit without tracking anyone individually.
          </p>
          <p className="mt-3 text-mist">
            To be complete about it: that signal travels to Google&apos;s servers,
            which see the IP address of the request in the ordinary way any
            internet request reveals it, along with your browser type. When you
            have declined, Google cannot use this to identify you or to follow
            you from one website to another.
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
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>ttd-consent</code></td>
                  <td className="py-2 pr-4">Accept or Decline</td>
                  <td className="py-2 pr-4">
                    Remembers your choice so we stop asking. Stored in local
                    storage, not a cookie, and never sent to us or anyone else.
                  </td>
                  <td className="py-2">Until you clear it</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>_ga</code></td>
                  <td className="py-2 pr-4">Only if you accept</td>
                  <td className="py-2 pr-4">
                    Google Analytics — tells returning visits apart from new ones.
                  </td>
                  <td className="py-2">400 days</td>
                </tr>
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>_ga_R8SGQ58R5E</code></td>
                  <td className="py-2 pr-4">Only if you accept</td>
                  <td className="py-2 pr-4">
                    Google Analytics — keeps track of the current visit for this
                    site&apos;s property.
                  </td>
                  <td className="py-2">400 days</td>
                </tr>
                {/*
                  Added 2026-08-23. This one only appears for visitors who arrive
                  from a Google ad, so it never showed up in a plain load of the
                  home page — which is how the register was checked until now. It
                  was reproduced by opening the site with a gclid in the URL and
                  then accepting: _gcl_aw, 90 days. Wording ruled by Legal in
                  Q-KWS-013. "Only if you accept" is load-bearing: with the same
                  gclid and Decline, the site writes nothing at all, which is what
                  keeps "no advertising identifier" true in the short version above.
                  A sibling, _gcl_au, was seen once and has not reproduced, so it is
                  deliberately absent — this table claims to be complete, so a row
                  we cannot reproduce would be a false claim in the other direction.
                */}
                <tr className="border-b border-ink/10">
                  <td className="py-2 pr-4"><code>_gcl_aw</code></td>
                  <td className="py-2 pr-4">
                    Only if you accept — and only when you arrived from a Google ad
                  </td>
                  <td className="py-2 pr-4">
                    Google Ads — records which ad click brought you here, so that a
                    booking or enquiry can be counted against that ad. It does not
                    identify you.
                  </td>
                  <td className="py-2">90 days</td>
                </tr>
                {/*
                  Found 2026-08-23, one day after _gcl_aw, by the same route and for
                  the same reason: it only appears for someone who arrived from an
                  advert and then accepted, and a plain visit never produces it. This
                  one is not a cookie at all — it is a local storage entry, which is
                  why a cookie-only check would not have found it either. The table
                  already covers local storage (see ttd-consent), so it belongs here.

                  The wording says "a copy of the same reference" on Legal's ruling:
                  a reader must be able to see that this is the same ad click id
                  written twice, not a second identifier, or the table reads as if we
                  collect more than we do.
                */}
                <tr>
                  <td className="py-2 pr-4"><code>_gcl_ls</code></td>
                  <td className="py-2 pr-4">
                    Only if you accept — and only when you arrived from a Google ad
                  </td>
                  <td className="py-2 pr-4">
                    Google Ads — a copy of the same ad-click reference as{" "}
                    <code>_gcl_aw</code>, kept in local storage (not a cookie) so it
                    survives if the cookie is cleared. It does not identify you.
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
          <p className="mt-3 text-mist">
            Both analytics cookies are set for <span className="text-ink">this
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
            If you accept, measurement data is processed by Google LLC on our
            behalf (Google Analytics and Google Ads). We do not sell your data or
            share it with anyone else. We do not use analytics to identify you
            personally.
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
            You can change your choice at any time — use the button below, or
            clear this site&apos;s data in your browser settings.
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
