import { MessageCircle } from "lucide-react";
import {
  CATALOG,
  CATALOG_MEDICAL,
  CONSULTATION_ONLY,
  MEDICAL_NOTICE,
  PRODUCTS,
  variantLabel,
  serviceEnquiryLabel,
  type Variant,
} from "@/lib/catalog";
import {
  buildWhatsAppLink,
  sourceForSlug,
  SOURCE_PRODUCT,
  SOURCE_BY_SLUG,
} from "@/lib/whatsapp";

function bookMessage(service: string, v: Variant) {
  return `Hi Taitam-D, I’d like to book ${serviceEnquiryLabel(service, v)}. Please share availability.`;
}

// Medical / aesthetic rows never book the treatment directly (Q-LAW-046):
// the enquiry asks for a consultation, and still names the exact option + price
// so the team knows what the client is considering.
function consultMessage(service: string, v: Variant) {
  return `Hi Taitam-D, I’d like to book a consultation about ${serviceEnquiryLabel(service, v)}. Please share availability.`;
}

export default function ServiceMenu() {
  return (
    <section aria-label="Service menu with prices" className="mt-2">
      {/* Jump navigation across categories */}
      <nav aria-label="Menu categories" className="flex flex-wrap gap-2">
        {CATALOG.map((c) => (
          <a
            key={c.slug}
            href={`#cat-${c.slug}`}
            className="rounded-full border border-ink/15 bg-white/50 px-4 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:border-gold/50 hover:text-ink"
          >
            {c.title}
          </a>
        ))}
        <a
          href="#aesthetics"
          className="rounded-full border border-ink/15 bg-white/50 px-4 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:border-gold/50 hover:text-ink"
        >
          Advanced Aesthetics
        </a>
        <a
          href="#products"
          className="rounded-full border border-ink/15 bg-white/50 px-4 py-1.5 text-sm font-medium text-ink/80 transition-colors hover:border-gold/50 hover:text-ink"
        >
          Products
        </a>
      </nav>

      <p className="mt-4 text-sm text-ink/60">
        Tap any price to message us on WhatsApp — the treatment, time and price are filled in for you.
        Prices shown are current offers where a previous price is struck through.
      </p>

      <div className="mt-8 space-y-12">
        {CATALOG.map((cat) => (
          <div key={cat.slug} id={`cat-${cat.slug}`} className="scroll-mt-28">
            <header className="border-b border-ink/10 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.image}
                alt={`${cat.title} treatments at Taitam-D`}
                loading="lazy"
                width={900}
                height={900}
                className="mb-4 h-40 w-full rounded-[18px] object-cover md:h-52"
              />
              <h2 className="text-2xl font-semibold md:text-3xl">{cat.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{cat.blurb}</p>
            </header>

            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {cat.services.map((svc) => (
                <li
                  key={svc.name}
                  className="rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5"
                >
                  <div className="flex items-start gap-2">
                    <h3 className="font-semibold leading-snug text-ink">{svc.name}</h3>
                    {svc.featured && (
                      <span className="mt-0.5 shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gold">
                        Popular
                      </span>
                    )}
                  </div>
                  {svc.desc && <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{svc.desc}</p>}
                  {svc.note && <p className="mt-1 text-xs text-ink/55">{svc.note}</p>}

                  <ul className="mt-3 divide-y divide-ink/8">
                    {svc.variants.map((v, i) => (
                      <li key={i}>
                        <a
                          href={buildWhatsAppLink(bookMessage(svc.name, v), sourceForSlug(cat.slug))}
                          target="_blank"
                          rel="noreferrer"
                          className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/[0.07]"
                          aria-label={`Book ${svc.name}, ${variantLabel(v)}, £${v.price.gbp}, on WhatsApp`}
                        >
                          <span className="text-sm text-ink/75">{variantLabel(v)}</span>
                          <span className="flex items-center gap-2">
                            <span className="text-sm">
                              {v.price.wasGbp && (
                                <s className="mr-1.5 text-ink/40">£{v.price.wasGbp}</s>
                              )}
                              <span className="font-semibold text-ink">£{v.price.gbp}</span>
                            </span>
                            <MessageCircle
                              aria-hidden="true"
                              className="h-4 w-4 text-mist transition-colors group-hover:text-[#25563e]"
                            />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Advanced aesthetics — Q-LAW-046. Group 3 with prices under the mandatory
            notice (button = consultation); group 2 by name only, no price. */}
        <div id="aesthetics" className="scroll-mt-28">
          <header className="border-b border-ink/10 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/services/aesthetics.jpg"
              alt="Advanced aesthetics treatments at Taitam-D"
              loading="lazy"
              width={900}
              height={900}
              className="mb-4 h-40 w-full rounded-[18px] object-cover md:h-52"
            />
            <h2 className="text-2xl font-semibold md:text-3xl">Advanced Aesthetics</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
              Skin, brow and lip treatments delivered by our qualified practitioner.
            </p>
          </header>

          <div
            role="note"
            className="mt-6 rounded-[18px] border border-gold/30 bg-gold/[0.07] px-5 py-4 text-sm leading-relaxed text-ink/80"
          >
            {MEDICAL_NOTICE}
          </div>

          <div className="mt-8 space-y-10">
            {CATALOG_MEDICAL.map((cat) => (
              <div key={cat.slug} id={`cat-${cat.slug}`} className="scroll-mt-28">
                <h3 className="text-xl font-semibold">{cat.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-ink/70">{cat.blurb}</p>
                <ul className="mt-5 grid gap-5 md:grid-cols-2">
                  {cat.services.map((svc) => (
                    <li key={svc.name} className="rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5">
                      <h4 className="font-semibold leading-snug text-ink">{svc.name}</h4>
                      <ul className="mt-3 divide-y divide-ink/8">
                        {svc.variants.map((v, i) => (
                          <li key={i}>
                            <a
                              href={buildWhatsAppLink(consultMessage(svc.name, v), sourceForSlug(cat.slug))}
                              target="_blank"
                              rel="noreferrer"
                              className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/[0.07]"
                              aria-label={`Book a consultation about ${svc.name}, ${variantLabel(v)}, £${v.price.gbp}, on WhatsApp`}
                            >
                              <span className="text-sm text-ink/75">{variantLabel(v)}</span>
                              <span className="flex items-center gap-2">
                                <span className="text-sm">
                                  {v.price.wasGbp && (
                                    <s className="mr-1.5 text-ink/40">£{v.price.wasGbp}</s>
                                  )}
                                  <span className="font-semibold text-ink">£{v.price.gbp}</span>
                                </span>
                                <span className="text-[11px] font-medium uppercase tracking-wide text-mist group-hover:text-[#25563e]">
                                  Consult
                                </span>
                                <MessageCircle
                                  aria-hidden="true"
                                  className="h-4 w-4 text-mist transition-colors group-hover:text-[#25563e]"
                                />
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Group 2 — consultation only, no prices */}
            <div id="cat-consultation" className="scroll-mt-28">
              <h3 className="text-xl font-semibold">{CONSULTATION_ONLY.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-ink/70">{CONSULTATION_ONLY.blurb}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {CONSULTATION_ONLY.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-ink/10 bg-ink/[0.03] px-4 py-2.5 text-sm text-ink/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={buildWhatsAppLink(
                  "Hi Taitam-D, I’d like to book a consultation about your advanced aesthetics treatments. Please share availability.",
                  SOURCE_BY_SLUG.hifu,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#183d2d] px-5 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
              >
                <MessageCircle className="h-4 w-4 text-[#d7b874]" aria-hidden="true" />
                Request a consultation
              </a>
            </div>
          </div>
        </div>

        {/* Retail products */}
        <div id="products" className="scroll-mt-28">
          <header className="border-b border-ink/10 pb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/services/products.jpg"
              alt="Retail beauty products at Taitam-D"
              loading="lazy"
              width={900}
              height={900}
              className="mb-4 h-40 w-full rounded-[18px] object-cover md:h-52"
            />
            <h2 className="text-2xl font-semibold md:text-3xl">Products</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
              A few things to take home. Tap to ask us on WhatsApp.
            </p>
          </header>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {PRODUCTS.map((p) => (
              <li key={p.name}>
                <a
                  href={buildWhatsAppLink(
                    `Hi Taitam-D, I’d like to buy ${p.name} (£${p.gbp}). Is it in stock?`,
                    SOURCE_PRODUCT,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-[18px] border border-ink/10 bg-ink/[0.03] px-5 py-4 transition-colors hover:border-gold/40 hover:bg-gold/[0.06]"
                >
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-ink">£{p.gbp}</span>
                    <MessageCircle
                      aria-hidden="true"
                      className="h-4 w-4 text-mist transition-colors group-hover:text-[#25563e]"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-ink/50">
        Menu and prices reflect our Treatwell listing and may change. Message us to confirm
        availability and the latest offers before your visit.
      </p>
    </section>
  );
}
