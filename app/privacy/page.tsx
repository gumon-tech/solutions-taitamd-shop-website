import { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import CookieSettingsButton from "@/components/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Taitam-D Beauty & Spa handles your personal data — what we hold, how we use contact details for advertising, the Google Ads measurement this website uses only if you accept, and how to opt out.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

// Wording ruled by Legal (solution-taitamd-legal 00_Docs/59-…, §1). Two values are
// pulled from lib/site.ts instead of being typed out here: the registered name and
// number, and the registered office. Legal's draft put the shop's trading address
// (72-74) next to the company name; site.ts records — with a comment explaining why
// — that the registered office is 72 only. The controller line is a legal
// identifier, so it uses the registered office, and Legal was told.
// The ad click code, the POST to the booking assistant and the upload to Google exist only while
// lib/site.ts googleAds.clickRef.endpoint is set (lib/clickref.ts), so the paragraphs that describe
// them render only then: this notice is never ahead of the code.
const CLICK_REF = SITE.googleAds.clickRef;
const LINKING = CLICK_REF.endpoint !== "";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 md:px-8 pb-24 pt-10 md:pt-16">
      <h1 className="text-3xl md:text-4xl font-semibold">Privacy notice</h1>
      {/*
        Effective is the London date this page actually went live, not the date it
        was drafted and not a date chosen in advance — Legal's rule in 58-, so that
        the register they keep and the page a visitor sees can never disagree.
      */}
      {/*
        1.1: Google Ads measurement in basic consent mode, the [web-AD] tag, and the section on
        linking a booking to an ad; the website lead-form section removed (the form went with
        Q-MKT-078). This room's own legal ruling, 2026-11-25 (the legal room closed, Q-KWS-118).
        Set the date to the London day it actually goes live if that is not 25 November.
      */}
      <p className="mt-2 text-sm text-mist">
        Version 1.1 · Effective 25 November 2026 · taitam-d.com
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

        {/*
          Replaces "When you contact us through this website", which described a name-and-number
          form that hashed its fields to Google. The form was removed with Q-MKT-078, so the
          section described something no visitor could do, and its "we may tell Google, in the
          same hashed form, when an enquiry becomes a booking" would now contradict the upload
          below, which sends Google the click reference only.

          Written to the code, 2026-11-25: components/Analytics.tsx (basic Consent Mode: nothing
          from Google before Accept; Accept grants ad_storage and ad_user_data only), AdSource.tsx
          ([web-AD], module memory only), lib/clickref.ts (the code and the POST). Change the
          code and this section in the same commit.
        */}
        <section>
          <h2 className="text-lg font-medium text-ink">This website and Google Ads</h2>
          <p className="mt-2 text-mist">
            When you first visit this website, we ask whether you accept Google measurement.
            Accept and Reject are equally easy, and the website works the same either way.{" "}
            <span className="text-ink">
              If you reject, or do not choose, this website loads nothing from Google Ads or
              Google Analytics
            </span>{" "}
            and sets no Google Ads or Analytics cookies. It keeps only a record of your choice in
            your browser, so that we do not ask again on every page. The map on our home and
            contact pages is shown by Google Maps whatever you choose: when it loads, Google
            receives your IP address and browser details, and may read or set its own cookies,
            under its own privacy policy. We do not use the map for measurement.
          </p>
          <p className="mt-2 text-mist">
            If you accept, this website loads Google&rsquo;s tag for Google Ads and Google
            Analytics. Google may store the cookies listed in our{" "}
            <Link href="/cookies" className="underline text-gold hover:text-gold2">
              Cookie Policy
            </Link>{" "}
            on your device, and receives your IP address and details of your visit: the pages
            you view, your browser and device, and each press of one of our WhatsApp, phone or
            share buttons, with the message the button types for you but not anything you add. We use this to count visits and to
            learn which of our Google ads lead to WhatsApp enquiries. The tag is set up so that
            Google does not use it to personalise the adverts you see. Google handles this under
            its own privacy policy and may process it outside the UK, including in the United
            States.
          </p>
          <p className="mt-2 text-mist">
            The booking buttons open WhatsApp with a short message already typed. Each message
            ends with a code, such as [web-T], that tells us which part of the website you used.
            If you reached this website from one of our Google ads, the code is [web-AD]
            instead, wherever you press, except for job applications. The website works this
            out from the web address you arrived on and keeps it only while the page is open in
            your browser: it is not stored on your device or sent to us or anyone else, so it
            does not depend on your cookie choice. Nothing reaches us until you press send in
            WhatsApp.
            {LINKING && " If you accepted, the code can be slightly longer, as described below."}
          </p>
          <p className="mt-2 text-mist">
            We use Google&rsquo;s tag only with your consent, which you give by pressing Accept.
            You can change your mind at any time with Cookie settings, here or at the bottom of
            every page. If you change to Reject, this website stops Google&rsquo;s tag and
            deletes the Google cookies it set on this website. Google&rsquo;s own controls for
            your account are at myadcenter.google.com.
          </p>
          <CookieSettingsButton className="mt-3 rounded-full border border-gold/40 text-gold text-sm px-5 py-2 hover:border-gold hover:text-gold2 transition">
            Cookie settings
          </CookieSettingsButton>
        </section>

        {LINKING && (
          <section>
            <h2 className="text-lg font-medium text-ink">
              Linking a booking to one of our ads (only if you accepted)
            </h2>
            <p className="mt-2 text-mist">
              If you came to this website from one of our Google ads and pressed Accept, the
              code at the end of your WhatsApp message is slightly longer, such as
              [web-AD-K7M2Q9XP]. The website works it out from Google&rsquo;s reference for
              your ad click, which is in the web address you arrived on. When you press a
              WhatsApp button, the same code goes to Google with the measurement of that press,
              as its reference.
            </p>
            <p className="mt-2 text-mist">
              At the same time, the website sends that code and Google&rsquo;s reference for
              your ad click to our booking assistant, which Gumon Technology runs for us. With
              them it sends which button you pressed, when your visit started and which version
              of the cookie banner you accepted.{" "}
              <span className="text-ink">
                It does not send your name, your phone number or your message.
              </span>{" "}
              As with any request over the internet, our booking assistant also receives your
              IP address and details of your browser. These are kept in its security logs for{" "}
              {CLICK_REF.serverLogMonths} months and are not stored with the click reference.
              This website does not store the click reference on your device.
            </p>
            <p className="mt-2 text-mist">
              When your message reaches us, the code links that ad click to your conversation
              with us. If you go on to book or visit us, we tell Google Ads that the ad click led
              to a booking or a paid visit, with its date and, for a paid visit, the amount you
              paid. We send Google the click reference only.{" "}
              <span className="text-ink">
                We never send Google your name, your phone number, your messages, the treatment
                you chose or anything about your health.
              </span>
            </p>
            <p className="mt-2 text-mist">
              If nobody messages us with the code, we delete the click reference after{" "}
              {CLICK_REF.unclaimedDays} days. Otherwise we delete it once the booking or visit
              has been reported to Google, and in any case no later than {CLICK_REF.maxDays}{" "}
              days after you arrived from the ad. We do all of this only with your consent, which
              you give by pressing Accept.
            </p>
            <p className="mt-2 text-mist">
              If you change to Reject with Cookie settings, the website drops the code at once,
              your messages end with [web-AD] again, and nothing more is sent. To have a click
              reference we already hold deleted, or to stop a booking being reported to Google,
              message us on WhatsApp or email {SITE.email}. You can also delete the code from the
              WhatsApp message before you send it; your booking is not affected.
            </p>
          </section>
        )}

        <section>
          <h2 className="text-lg font-medium text-ink">Your choices</h2>
          <p className="mt-2 text-mist">
            Email {SITE.email} with &ldquo;stop advertising&rdquo; and we will
            remove you from our advertising audiences — usually within a few days,
            and in any case within one month. This does not affect your bookings or
            your treatment records. You can also ask what we hold about you, ask us
            to correct it, or ask us to delete it where the law allows. We reply
            within one month.
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
          {/*
            The first draft of this section said "3 years after your last visit".
            The shop office then measured the customer file: 5,501 records created
            in 2018 or earlier are still there, 2,740 of them people who came once
            and never returned, and 155 date back to 2014. Treatwell Connect does
            not delete inactive records and the shop has never deleted any by hand
            (shop-office 81ce763, Q-LAW-047 ack). A person who came once in 2016
            would have had to disappear in 2019 for the sentence to be true.

            So the number came out and this says what is actually the case. A
            softer draft — "we review our records periodically and remove what we
            no longer need" — was cut for the same reason: that review does not
            happen either, and a pleasant sentence that is not true is the same
            defect as a precise one that is not true.

            The years can come back when a real lawyer sets the period and a
            deletion mechanism exists — both, not either.

            "yet" was in this sentence for about an hour. The owner then gave a
            standing instruction that customer data is never to be deleted, which
            turns "yet" into a hint at something that is not going to happen — the
            same soft promise as the review sentence above. Legal ruled it out and
            kept the version at 1.0: a word removed to match what is true is not a
            change of substance a reader could have relied on.
          */}
          <p className="mt-2 text-mist">
            Contact details and appointment history: we keep these while you remain
            on our customer records.{" "}
            <span className="text-ink">
              We do not delete inactive records automatically
            </span>
            , so the surest way to have your details removed is to ask us — see
            &ldquo;Your choices&rdquo;. Treatment records: as required by our
            insurer and professional bodies — ask us for the current period.
            Advertising audiences: built from our customer list; you are removed
            when you ask — usually within a few days, and in any case within one
            month.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-ink">If you apply for a job</h2>
          {/*
            Added 2026-10-20, the day applications opened on /careers/. Until then this
            notice described clients only, and an applicant is neither a client nor an
            employee: they have no relationship with the shop and nothing here told them
            what happens to what they send.

            Every figure below is somebody's decision, not a drafting choice. Twelve months
            and the access list are KWS's ruling in Q-KWEB-016; the employment-plus-two-years
            period is the Home Office's own wording, checked against their guide of 1 October
            2026; asking for documents only after a conditional offer is this room's ruling
            L-2, which follows ICO's line that you verify successful candidates where you can.

            One thing this page states that has not yet been observed: the deletion runs on a
            schedule and has never actually removed a record, because no record is old enough
            (KBOT, 2026-10-20). That is different from the customer-records case above, where
            the mechanism did not exist at all and the sentence had to come out. Here it
            exists and is running. If it turns out not to fire when the first record matures,
            this paragraph is wrong and comes out the same day.
          */}
          <p className="mt-2 text-mist">
            Applications happen in WhatsApp, with the shop&rsquo;s assistant. We ask which
            role interests you, what qualifications you hold, when you can work, and whether
            you have the right to work in the UK.{" "}
            <span className="text-ink">
              We do not ask for your passport or right-to-work documents in a chat
            </span>
            , and if you send them anyway they are discarded unread. Those are requested only
            if we offer you the role.
          </p>
          <p className="mt-2 text-mist">
            Your application is seen by the owner and by our management and technical team —
            four people at present. It is held so we can consider you and reply to you, and
            is deleted twelve months after we tell you our decision, or twelve months after
            your start date if you join us. If you join us, copies of your right-to-work
            documents are kept for as long as you work here and for two years afterwards, as
            the Home Office requires, and are then destroyed. We do not use anything you send
            us when applying for advertising.
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
