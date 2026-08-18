import { MessageCircle } from "lucide-react";
import {
  CATALOG,
  PRODUCTS,
  variantLabel,
  serviceEnquiryLabel,
  type Variant,
} from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function bookMessage(service: string, v: Variant) {
  return `Hi Taitam-D, I’d like to book ${serviceEnquiryLabel(service, v)}. Please share availability.`;
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
                  {svc.note && <p className="mt-1 text-xs text-ink/55">{svc.note}</p>}

                  <ul className="mt-3 divide-y divide-ink/8">
                    {svc.variants.map((v, i) => (
                      <li key={i}>
                        <a
                          href={buildWhatsAppLink(bookMessage(svc.name, v))}
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

        {/* Retail products */}
        <div id="products" className="scroll-mt-28">
          <header className="border-b border-ink/10 pb-4">
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
