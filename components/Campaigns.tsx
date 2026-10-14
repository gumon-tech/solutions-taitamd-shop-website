import Image from "next/image";
import { ArrowUpRight, MessageCircle, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { existsSync } from "node:fs";
import { join } from "node:path";
import PromoGate from "./PromoGate";
import {
  promotionWindow,
  promotionsGate,
  promotionsNote,
  upcomingPromotions,
  windowActive,
  type Promotion,
} from "@/lib/promotions";
import { buildWhatsAppLink, SOURCE_OFFER, SOURCE_OFFER_ENQUIRY } from "@/lib/whatsapp";

// `illustrative` marks artwork that depicts a room and a therapist without being a
// photograph of ours. Legal's test is not whether an image was AI-generated but whether
// it misleads on something material, and the material claim here is "this is our salon".
// A still life of towels does not make that claim; a treatment in progress does.
// Never carry this label onto pages about our premises, our team, or before-and-after
// results — there the picture is the claim, and a caption does not rescue it (Q-MKT/LAW
// ruling 2026-08-10, recorded in docs/plans/DECISIONS-BOARD.md D-W22).
//
// Two of the three cards carry it since 2026-09-17: both show a treatment in progress in
// generated artwork. The sauna card is our own room and does not.
// The offers themselves live in data/promotions.json (lib/promotions.ts reads and checks it).
// Rules every entry there keeps, so the next edit keeps them too:
// - Every claim comes from the offer's own source (the flyer, plus terms the owner added). The
//   first three, from Kru Nok's flyers of 2026-09-17: solution-taitamd-shop-office
//   docs/reference/promotions-2026-09-17.md at d545907 and 1f3ff13.
// - Flyers say "bring this coupon". A website visitor has no coupon, so the owner ruled that
//   mentioning the offer on WhatsApp or on arrival is how it is claimed from here.
// - Flyer images are not used: their QR codes carry flyer-* source codes, and a scan from this
//   page would be counted as a flyer. The buttons carry the web offer letter instead.
// - `illustrative` as above: true for generated artwork of a treatment, never for our premises.

// Fails the build when an entry points at a picture that is not in public/, instead of
// shipping a broken image to the home page.
function assertImages(list: Promotion[]) {
  for (const p of list) {
    if (!existsSync(join(process.cwd(), "public", p.image))) {
      throw new Error(`data/promotions.json: ${p.code}: image ${p.image} is not in public/`);
    }
  }
}

export default function Campaigns() {
  const now = Date.now();
  const campaigns = upcomingPromotions(now);
  assertImages(campaigns);
  if (!campaigns.length) return null;
  const { windows, initiallyActive } = promotionsGate(now);
  return (
    <PromoGate windows={windows} initiallyActive={initiallyActive}>
    <section id="promotions" className="ui-section scroll-mt-nav">
      <Reveal>
        <div className="rounded-[32px] border border-gold/25 bg-[#f4eee2] p-6 text-[#19392a] shadow-[0_24px_60px_rgba(12,51,30,0.2)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6d5223]"><Sparkles className="h-4 w-4" /> Current promotions</div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">A better reason to <span className="text-[#a07b38]">come back.</span></h2>
              <p className="mt-4 text-sm leading-relaxed text-[#53665a] md:text-base">Freshly made offers for the reopening season. Pick a ritual, then message us on WhatsApp and we’ll find a time for you.</p>
              {promotionsNote && <p className="mt-3 text-sm font-semibold leading-relaxed text-[#284b39]">{promotionsNote}</p>}
            </div>
            <a href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like to hear about your current offers. Please share what’s running now.",
              SOURCE_OFFER_ENQUIRY,
            )} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Ask about offers <ArrowUpRight className="h-4 w-4 text-[#d7b874]" /></a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <PromoGate key={campaign.code} windows={[promotionWindow(campaign)]} initiallyActive={windowActive(promotionWindow(campaign), now)}>
              <Reveal delay={index * 0.08}>
                <article className="overflow-hidden rounded-[26px] border border-[#dbcba9] bg-[#fffdf8] shadow-[0_14px_36px_rgba(27,58,42,0.1)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={campaign.image} alt={campaign.illustrative ? `${campaign.title} promotion — illustrative image` : `${campaign.title} promotion`} fill className="object-cover transition duration-700 hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 50vw" />
                    {/* The scrim that used to live here was carrying the white title. The title
                        moved onto the card, and the only thing left on the photograph is a chip
                        with its own opaque background — so the scrim was darkening a third of
                        every picture for nothing, which is exactly what T11 asks us not to do. */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
                      <div>
                        {/* The eyebrow sits on a photograph, so its contrast is whatever the picture
                           happens to be underneath: measured 2.50 against the real pixels, below AA.
                           T11 forbids darkening the image to rescue text, so the label carries its own
                           cream chip instead — a fixed 5.72 that no future photo can undo, and a few
                           more bright pixels rather than fewer. */}
                        <div className="inline-flex rounded-full bg-[#ebe3d4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6d5223]">{campaign.eyebrow}</div></div>
                      <div className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/15 backdrop-blur sm:flex"><Sparkles className="h-5 w-5 text-[#eed59a]" /></div>
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    {campaign.illustrative && <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#52655a]">Illustrative image</p>}
                    {/* The title used to sit on the photograph in white, which measured 2.50 on a
                        phone against a threshold of 3.0 — the picture is bright in places and no
                        text colour survives every picture. T11 forbids darkening an image to
                        rescue the text on it, so the heading comes off the photograph instead and
                        onto the card, where it has a background we actually choose. */}
                    <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#19392a] md:text-3xl">{campaign.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#52655a]">{campaign.detail}</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">{campaign.points.map((point) => <div key={point} className="rounded-xl bg-[#f3eee5] px-3 py-2 text-xs font-semibold text-[#284b39]">{point}</div>)}</div>
                    <div className="mt-5 flex flex-col gap-4 border-t border-[#e7dece] pt-5 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm font-semibold text-[#6d5223]">{campaign.offer}</div><a href={buildWhatsAppLink(campaign.message, SOURCE_OFFER)} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#183d2d] px-4 py-2.5 text-xs font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Reserve offer</a></div>
                  </div>
                </article>
              </Reveal>
              </PromoGate>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
    </PromoGate>
  );
}
