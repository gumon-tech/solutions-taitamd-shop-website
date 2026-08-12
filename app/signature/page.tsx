import { ArrowUpRight, MessageCircle, Clock, Sparkles } from "lucide-react";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Metadata } from "next";

// Landing page for the Taitam-D Signature ad. It exists before the campaign runs
// on purpose: Google checks the price in an ad against the page it points at, and
// until now the site had no Signature page and no Signature price anywhere.
//
// Copy is verbatim from what the owner approved (relayed 2026-08-11) — the blend
// list, the name, the strapline and the price line are not this room's wording to
// edit. The Academy is deliberately absent until 16 August.
const DESCRIPTION =
  "60 minutes. Master-level assessment first, then a blend chosen for your condition — traditional Thai, stretching, deep tissue, Swedish, sports, aromatherapy, Thai yoga.";

const BLEND = [
  "Traditional Thai",
  "Stretching",
  "Deep tissue",
  "Swedish",
  "Sports",
  "Aromatherapy",
  "Thai yoga",
];

export const metadata: Metadata = {
  title: "Taitam-D Signature Thai Massage — £69 / 60 minutes",
  description: DESCRIPTION,
  alternates: { canonical: "/signature" },
  openGraph: {
    title: "Taitam-D Signature Thai Massage — £69 / 60 minutes",
    description: DESCRIPTION,
    url: "/signature",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

export default function SignaturePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
      <div className="pt-8 md:pt-12">
        <div className="overflow-hidden rounded-[32px] border border-[#d6c198] bg-[#f5efe3] text-[#183b2d] shadow-[0_24px_60px_rgba(12,51,30,0.22)]">
          <div className="p-7 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#95743a]">Taitam-D Signature</p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.04em] md:text-6xl">
              Taitam-D Signature <span className="text-[#a37d37]">Thai Massage</span>
            </h1>

            <p className="mt-4 max-w-2xl text-base text-[#4c6154] md:text-lg">
              Master-level assessment &amp; bespoke therapy
            </p>

            {/* Price sits above the fold and carries the treatment name with it. An ad
                quoting £69 has to find £69 here, unqualified by any "from". */}
            <div className="mt-7 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-[#cdb887] bg-[#fffdf8] px-5 py-4">
              <Sparkles className="h-5 w-5 text-[#a37d37]" />
              <span className="text-lg font-semibold md:text-xl">{SITE.signaturePrice}</span>
            </div>

            <p className="mt-7 max-w-2xl text-sm leading-relaxed text-[#5b6d62] md:text-base">{DESCRIPTION}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppLink(SITE.whatsappTemplates.signature)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3.5 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
              >
                <MessageCircle className="h-4 w-4 text-[#d7b874]" /> Book on WhatsApp
                <ArrowUpRight className="h-4 w-4 text-[#d7b874]" />
              </a>
              <a
                href={SITE.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cdb887] px-5 py-3.5 text-sm font-semibold text-[#345a45] transition hover:bg-white/60"
              >
                Ask a question first <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#ebe3d4] p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#927039]">
                  <Clock className="h-3.5 w-3.5" /> Duration
                </div>
                <div className="mt-2 text-sm font-semibold">60 minutes</div>
              </div>
              <div className="rounded-2xl bg-[#ebe3d4] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#927039]">Where</div>
                <div className="mt-2 text-sm font-semibold">King&rsquo;s Cross, London</div>
              </div>
              <div className="rounded-2xl bg-[#ebe3d4] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#927039]">Open</div>
                <div className="mt-2 text-sm font-semibold">{SITE.hours}</div>
              </div>
            </div>

            <div className="mt-10 border-t border-[#e0d3b8] pt-8">
              <h2 className="text-xl font-semibold md:text-2xl">What the therapist draws on</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6d62]">
                The assessment comes first. What follows is chosen for your condition on the day, not picked from a
                fixed menu.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {BLEND.map((item) => (
                  <li key={item} className="rounded-xl bg-[#f3eee5] px-3 py-2.5 text-sm font-semibold text-[#284b39]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
