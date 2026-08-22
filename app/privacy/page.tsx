import { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Taitam-D Beauty & Spa handles your personal data — what we hold, how we use contact details for advertising, and how to opt out.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

// Wording ruled by Legal (solution-taitamd-legal 00_Docs/59-…, §1). Two values are
// pulled from lib/site.ts instead of being typed out here: the registered name and
// number, and the registered office. Legal's draft put the shop's trading address
// (72-74) next to the company name; site.ts records — with a comment explaining why
// — that the registered office is 72 only. The controller line is a legal
// identifier, so it uses the registered office, and Legal was told.
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 md:px-8 pb-24 pt-10 md:pt-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Privacy notice</h1>
      {/*
        Effective is the London date this page actually went live, not the date it
        was drafted and not a date chosen in advance — Legal's rule in 58-, so that
        the register they keep and the page a visitor sees can never disagree.
      */}
      <p className="mt-2 text-sm text-mist">
        Version 1.0 · Effective 22 August 2026 · taitam-d.com
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink/90">
        <section>
          <h2 className="text-lg font-medium text-ink">Who we are</h2>
          <p className="mt-2 text-mist">
            Taitam-D Beauty &amp; Spa is run by {SITE.legalName} (company number{" "}
            {SITE.companyNumber}), {SITE.registeredOffice}. We are the data
            controller for the personal data described here. Questions and
            requests: {SITE.email}.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">What we hold about you</h2>
          <p className="mt-2 text-mist">
            If you have booked or visited us, we hold your name, contact details,
            appointment history and the treatment and consultation records you
            gave us for your safety. Treatment records are kept separately and are{" "}
            <span className="text-ink">never used for marketing</span>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">
            How we use your contact details for advertising
          </h2>
          <p className="mt-2 text-mist">
            We use your email address or phone number to show our own offers to
            you on Google services (Google &ldquo;Customer Match&rdquo;). Before
            anything leaves us it is hashed, so Google receives a scrambled
            version that it can only match against its own accounts — it cannot
            read your address or number from it. We do this on the basis of our
            legitimate interest in keeping in touch with people who have visited
            us, or on the basis of the consent you gave us at the salon. We do not
            use treatment records for this.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">
            When you contact us through this website
          </h2>
          <p className="mt-2 text-mist">
            If you fill in your name and number before opening WhatsApp and tick
            the box, your browser sends a hashed copy to Google so we can see
            which advert led to your enquiry.{" "}
            <span className="text-ink">
              We do not store that form on this website.
            </span>{" "}
            We may also tell Google, in the same hashed form, when an enquiry
            becomes a booking, so we can measure which adverts work.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Your choices</h2>
          <p className="mt-2 text-mist">
            Email {SITE.email} with &ldquo;stop advertising&rdquo; and we will
            remove you from our advertising audiences within 7 days. This does not
            affect your bookings or your treatment records. You can also ask what
            we hold about you, ask us to correct it, or ask us to delete it where
            the law allows. We reply within one month.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Who else sees your data</h2>
          <p className="mt-2 text-mist">
            Google LLC processes the hashed data on our behalf, outside the UK
            including in the United States, under the UK Extension to the EU–US
            Data Privacy Framework. Our booking and messaging tools process your
            contact details to run your appointment.{" "}
            <span className="text-ink">We do not sell your data.</span>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">How long we keep it</h2>
          <p className="mt-2 text-mist">
            Contact details and appointment history: while you are a customer and
            for 3 years after your last visit. Treatment records: as required by
            our insurer and professional bodies, which is longer — ask us for the
            current period. Advertising audiences: refreshed from our customer
            list; removed within 7 days of your request.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Cookies</h2>
          <p className="mt-2 text-mist">
            What this website stores on your device, and how to change your
            choice, is covered separately in our{" "}
            <Link href="/cookies" className="underline text-gold hover:text-gold2">
              Cookie Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">Complaints</h2>
          <p className="mt-2 text-mist">
            You can complain to the Information Commissioner&apos;s Office
            (ico.org.uk) if you are unhappy with how we handle your data.
          </p>
        </section>

        <section>
          <p className="text-mist">
            We will show a new version and date here whenever this notice changes.
          </p>
        </section>
      </div>
    </main>
  );
}
