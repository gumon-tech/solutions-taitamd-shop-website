import { MessageCircle } from "lucide-react";
import { variantLabel, serviceEnquiryLabel, type Service, type Variant } from "@/lib/catalog";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function bookMessage(service: string, v: Variant) {
  return `Hi Taitam-D, I’d like to book ${serviceEnquiryLabel(service, v)}. Please share availability.`;
}

/**
 * The priced service cards, lifted out of ServiceMenu so /massage-kings-cross/ can
 * show the massage rows without a second copy of the price markup (Q-MKT-077 item 3
 * asks for the prices to come from one place, and markup is where a second place
 * usually starts).
 *
 * `source` is a parameter rather than a lookup from the category slug, because the
 * landing page's whole purpose is to be counted apart from the same treatments listed
 * on /services/. Same rows, same prices, different letter on the way out.
 *
 * The medical rows in ServiceMenu deliberately do NOT use this: they carry a Consult
 * label and ask for a consultation instead of a booking (Q-LAW-046), and folding that
 * difference in behind a flag would hide the one thing about them that matters.
 */
export default function ServicePriceGrid({
  services,
  source,
}: {
  services: Service[];
  source: string;
}) {
  return (
    <ul className="mt-6 grid gap-5 md:grid-cols-2">
      {services.map((svc) => (
        <li key={svc.name} className="rounded-[22px] border border-ink/10 bg-ink/[0.03] p-5">
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

          <ul className="mt-3 divide-y divide-ink/[0.08]">
            {svc.variants.map((v, i) => (
              <li key={i}>
                <a
                  href={buildWhatsAppLink(bookMessage(svc.name, v), source)}
                  target="_blank"
                  rel="noreferrer"
                  className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/[0.07]"
                  aria-label={`Book ${svc.name}, ${variantLabel(v)}, £${v.price.gbp}, on WhatsApp`}
                >
                  <span className="text-sm text-ink/75">{variantLabel(v)}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm">
                      {v.price.wasGbp && <s className="mr-1.5 text-ink/40">£{v.price.wasGbp}</s>}
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
  );
}
