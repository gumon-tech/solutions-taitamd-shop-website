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
// Two of the three cards carry it since 2026-09-17: both show a treatment in progress in
// generated artwork. The sauna card is our own room and does not.
type Campaign = {
  image: string;
  illustrative?: boolean;
  eyebrow: string;
  title: string;
  detail: string;
  points: string[];
  offer: string;
  message: string;
};

// The three offers Kru Nok designed as flyers, relayed by OFFICE on 2026-09-17 with the owner's
// instruction to put them on the home page (source: solution-taitamd-shop-office
// docs/reference/promotions-2026-09-17.md at d545907). The owner approved rebuilding them as
// cards rather than showing the flyers, in the SHOP room, the same day.
//
// Rules this copy keeps, so the next edit keeps them too:
// - Every claim comes from the flyer's own words. The flyers state no expiry date and say
//   nothing about combining with other offers, so neither appears here. Do not add them
//   without a source.
// - The flyers say "bring this coupon". A website visitor has no coupon, so the owner ruled
//   that mentioning the offer on WhatsApp or on arrival is how it is claimed from here.
// - The flyer images are not used: their QR codes carry flyer-* source codes, and a scan from
//   this page would be counted as a flyer. The buttons below carry the web offer letter instead.
const campaigns: Campaign[] = [
  {
    // Our own infrared sauna, photographed in the shop, so no illustrative label.
    image: "/images/tour/infrared-sauna.jpg",
    eyebrow: "We’re back · Welcome back gift",
    title: "Free infrared sauna session",
    detail: "After one month of renovation, we are delighted to welcome you back. When you enjoy a 90-minute massage with us, your infrared sauna session is free.",
    points: ["With a 90-minute massage", "Sauna session worth £35"],
    offer: "You are welcome to share this gift with a friend",
    message: "Hi Taitam-D, I’d like to book a 90-minute massage with the free infrared sauna welcome back gift.",
  },
  {
    illustrative: true,
    image: "/images/landing/massage.jpg",
    eyebrow: "£5 gift voucher · Walk-in offer",
    title: "£5 off any 1-hour massage",
    detail: "Perfect for travellers, commuters and local visitors looking for relaxation near King’s Cross.",
    points: ["Any 1-hour massage", "Special walk-in offer"],
    offer: "Mention this offer on WhatsApp or when you arrive",
    message: "Hi Taitam-D, I’d like to use the £5 off any 1-hour massage offer.",
  },
  {
    // Cropped from Kru Nok's own flyer artwork, clear of its text and QR code.
    illustrative: true,
    image: "/images/campaigns/promo-hair-spa-wash.jpg",
    eyebrow: "£10 gift voucher · Walk-in offer",
    title: "£10 off Hair Spa",
    detail: "Head massage and hair wash in one treatment: a soothing scalp massage, a refreshing hair wash and expert care that leaves your scalp and hair feeling clean, calm and beautifully refreshed.",
    points: ["Hair Spa treatment", "Special walk-in offer"],
    offer: "Mention this offer on WhatsApp or when you arrive",
    message: "Hi Taitam-D, I’d like to use the £10 off Hair Spa offer.",
  },
];

export default function Campaigns() {
  return (
    <section id="promotions" className="ui-section scroll-mt-nav">
      <Reveal>
        <div className="rounded-[32px] border border-gold/25 bg-[#f4eee2] p-6 text-[#19392a] shadow-[0_24px_60px_rgba(12,51,30,0.2)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6d5223]"><Sparkles className="h-4 w-4" /> Current promotions</div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">A better reason to <span className="text-[#a07b38]">come back.</span></h2>
              <p className="mt-4 text-sm leading-relaxed text-[#53665a] md:text-base">Freshly made offers for the reopening season. Pick a ritual, then message us on WhatsApp and we’ll find a time for you.</p>
            </div>
            <a href={buildWhatsAppLink(
              "Hi Taitam-D, I’d like to hear about your current offers. Please share what’s running now.",
              SOURCE_OFFER_ENQUIRY,
            )} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Ask about offers <ArrowUpRight className="h-4 w-4 text-[#d7b874]" /></a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign, index) => (
              <Reveal key={campaign.title} delay={index * 0.08}>
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
                    {campaign.illustrative && <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#8a9a8f]">Illustrative image</p>}
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
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
