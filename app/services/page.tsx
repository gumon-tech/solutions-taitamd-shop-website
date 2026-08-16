import { Metadata } from "next";
import Link from "next/link";
import ServicesGrid from "@/components/ServicesGrid";
import CTA from "@/components/CTA";
import { TOUR_SHOT_COUNT } from "@/lib/tour";

export const metadata: Metadata = {
  title: "Massage, Hair, Nails & Beauty Services in King's Cross",
  description: "Explore Thai massage, deep tissue, hair, facials, nails, waxing, lashes and micropigmentation at Taitam-D Beauty & Spa in King's Cross, London.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Massage, Hair, Nails & Beauty Services in King's Cross",
    description: "Explore Thai massage, deep tissue, hair, facials, nails, waxing, lashes and micropigmentation at Taitam-D Beauty & Spa in King's Cross, London.",
    url: "/services",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Service menu</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Everything you need — <span className="text-gold">crafted</span> with precision.
        </h1>
        <p className="mt-5 max-w-2xl text-ink/80">
          Browse categories, then message us on WhatsApp for availability, advice and the latest promotions.
        </p>
      </header>

      <ServicesGrid />
      <section className="mt-4 rounded-[28px] border border-ink/10 bg-ink/5 p-7 md:p-9" aria-labelledby="services-faq">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Helpful answers</p>
        <h2 id="services-faq" className="mt-3 text-2xl md:text-3xl font-semibold">Frequently asked questions</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div><h3 className="font-semibold">Where is Taitam-D Beauty & Spa?</h3><p className="mt-2 text-sm leading-relaxed text-ink/75">We are at 72-74 Caledonian Road, King&apos;s Cross, London, N1 9DN — around a six-minute walk from King&apos;s Cross and St Pancras.</p></div>
          <div><h3 className="font-semibold">How do I book a treatment?</h3><p className="mt-2 text-sm leading-relaxed text-ink/75">Message us on WhatsApp for availability, treatment advice and current offers. Our team will help you choose the right service and time.</p></div>
          <div><h3 className="font-semibold">What treatments are available?</h3><p className="mt-2 text-sm leading-relaxed text-ink/75">Our menu includes Thai, deep tissue and aromatherapy massage, hair, facials, nails, waxing, eyelash services, micropigmentation and aesthetic injections.</p></div>
          <div><h3 className="font-semibold">When are you open?</h3><p className="mt-2 text-sm leading-relaxed text-ink/75">We are open daily from 10:30am to 9:00pm. Availability can change, so please contact us before visiting.</p></div>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                ["Where is Taitam-D Beauty & Spa?", "We are at 72-74 Caledonian Road, King's Cross, London, N1 9DN — around a six-minute walk from King's Cross and St Pancras."],
                ["How do I book a treatment?", "Message us on WhatsApp for availability, treatment advice and current offers. Our team will help you choose the right service and time."],
                ["What treatments are available?", "Our menu includes Thai, deep tissue and aromatherapy massage, hair, facials, nails, waxing, eyelash services, micropigmentation and aesthetic injections."],
                ["When are you open?", "We are open daily from 10:30am to 9:00pm. Availability can change, so please contact us before visiting."],
              ].map(([name, text]) => ({
                "@type": "Question",
                name,
                acceptedAnswer: { "@type": "Answer", text },
              })),
            }),
          }}
        />
      </section>

      <Link
        href="/tour"
        className="group mt-4 block rounded-[28px] border border-ink/10 bg-ink/5 p-7 transition-colors hover:border-gold/40 md:p-9"
      >
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Before you book</p>
        <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
          See the rooms <span className="text-gold">before you choose one.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75">
          You cannot see in from the pavement, so we photographed the whole place — {TOUR_SHOT_COUNT} pictures,
          room by room, in the order you meet them walking in.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
          Take the tour
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </Link>

      <div className="h-4 md:h-6" />
      <CTA />
      <div className="h-10 md:h-12" />
    </main>
  );
}
