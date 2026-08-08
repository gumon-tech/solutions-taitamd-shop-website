import { Metadata } from "next";
import ManageConsent from "@/components/ManageConsent";

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
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">What we store and when</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2 text-mist">
            <li>
              <span className="text-ink">Your cookie choice</span> — when you press Accept or
              Decline, we remember that choice in your browser&apos;s local storage
              (key <code>ttd-consent</code>). This is not a cookie and is never sent to us.
            </li>
            <li>
              <span className="text-ink">Analytics &amp; advertising cookies (only after
              you accept)</span> — Google Analytics 4 sets cookies (such as
              <code> _ga</code>) to help us understand how visitors find and use the
              site, and to measure whether our Google Ads bring guests to the
              salon. We look at this information in aggregate only.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Who else sees this data</h2>
          <p className="mt-2 text-mist">
            If you accept, measurement data is processed by Google LLC on our
            behalf (Google Analytics and Google Ads). We do not sell your data or
            share it with anyone else. We do not use analytics to identify you
            personally.
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
