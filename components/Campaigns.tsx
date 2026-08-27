import Image from "next/image";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { buildWhatsAppLink, SOURCE_OFFER, SOURCE_OFFER_ENQUIRY } from "@/lib/whatsapp";

// `illustrative` marks artwork that depicts a room and a therapist without being a
// photograph of ours. Legal's test is not whether an image was AI-generated but whether
// it misleads on something material, and the material claim here is "this is our salon".
// A still life of towels does not make that claim; a treatment in progress does.
// Never carry this label onto pages about our premises, our team, or before-and-after
// results — there the picture is the claim, and a caption does not rescue it (Q-MKT/LAW
// ruling 2026-08-10, recorded in docs/plans/DECISIONS-BOARD.md D-W22).
//
// No card carries the flag today. It stays declared because the label is the mechanism
// that ruling created, and deleting it the moment it happens to be unused is how a guard
// disappears years before the risk does.
type Campaign = {
  image: string;
  illustrative?: boolean;
  eyebrow: string;
  title: string;
  detail: string;
  prices: string[];
  offer: string;
  message: string;
};

const campaigns: Campaign[] = [
  {
    // Swapped off the generated artwork 2026-08-16 (Q-SHOP-020, ruled by WS): the old
    // picture showed a wash room with a therapist in it, which reads as a claim about
    // our premises and our people — exactly what D-W22 forbids. This is the real salon
    // room, so the `illustrative` label comes off with it.
    image: "/images/tour/salon-lavender-mural.jpg",
    eyebrow: "Comeback offer · Hair care",
    title: "Hair Spa & Detox",
    detail: "A scalp massage, nano steam, mask and blow dry in one restorative ritual.",
    prices: ["Men £40", "Short £59", "Medium £69", "Long £79"],
    offer: "Save £10 on the full Hair Spa package",
    message: "Hi Taitam-D, I’m interested in the Hair Spa & Detox comeback offer. Please share availability.",
  },
  {
    image: "/images/campaigns/promo-spa-ritual-gemini-v3.jpg",
    eyebrow: "Comeback offer · Spa rituals",
    title: "Choose your reset",
    detail: "Small, focused rituals for hair, face, hands and feet — designed to leave you refreshed.",
    prices: ["Hair Spa from £40", "Face Spa £30", "Hand Spa £20", "Foot Spa £30"],
    offer: "Enjoy £10 off when you choose the full package",
    message: "Hi Taitam-D, I’d like to ask about the Hair Spa, Face Spa, Hand Spa and Foot Spa comeback offers.",
  },
];

export default function Campaigns() {
  return (
    <section id="promotions" className="ui-section scroll-mt-nav">
      <Reveal>
        <div className="rounded-[32px] border border-gold/25 bg-[#f4eee2] p-6 text-[#19392a] shadow-[0_24px_60px_rgba(12,51,30,0.2)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6e36]"><Sparkles className="h-4 w-4" /> Current promotions</div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">A better reason to <span className="text-[#a07b38]">come back.</span></h2>
              <p className="mt-4 text-sm leading-relaxed text-[#53665a] md:text-base">Freshly made offers for the reopening season. Pick a ritual, then message us on WhatsApp and we’ll find a time for you.</p>
            </div>
            <a href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like to hear about your current offers. Please share what’s running now.",
              SOURCE_OFFER_ENQUIRY,
            )} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Ask about offers <ArrowUpRight className="h-4 w-4 text-[#d7b874]" /></a>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {campaigns.map((campaign, index) => (
              <Reveal key={campaign.title} delay={index * 0.08}>
                <article className="overflow-hidden rounded-[26px] border border-[#dbcba9] bg-[#fffdf8] shadow-[0_14px_36px_rgba(27,58,42,0.1)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={campaign.image} alt={campaign.illustrative ? `${campaign.title} promotion — illustrative image` : `${campaign.title} promotion`} fill className="object-cover transition duration-700 hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#173b2c]/65 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                      <div><div className="text-[10px] uppercase tracking-[0.25em] text-[#eed59a]">{campaign.eyebrow}</div><h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{campaign.title}</h3></div>
                      <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/15 backdrop-blur sm:flex"><Sparkles className="h-5 w-5 text-[#eed59a]" /></div>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    {campaign.illustrative && <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#8a9a8f]">Illustrative image</p>}
                    <p className="text-sm leading-relaxed text-[#52655a]">{campaign.detail}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">{campaign.prices.map((price) => <div key={price} className="rounded-xl bg-[#f3eee5] px-3 py-2 text-xs font-semibold text-[#284b39]">{price}</div>)}</div>
                    <div className="mt-5 flex flex-col gap-4 border-t border-[#e7dece] pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm font-semibold text-[#8d6c2c]">{campaign.offer}</div><a href={buildWhatsAppLink(campaign.message, SOURCE_OFFER)} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#183d2d] px-4 py-2.5 text-xs font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Reserve offer</a></div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
