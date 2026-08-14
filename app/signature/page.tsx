import Image from "next/image";
import { ArrowUpRight, MessageCircle, Clock, MapPin, Sparkles, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Metadata } from "next";

// Landing page for the Taitam-D Signature ad. It exists before the campaign runs on
// purpose: Google checks the price in an ad against the page it points at, and the
// site previously had no Signature page and no Signature price anywhere.
//
// The name, strapline, price and the seven-modality list are verbatim from what the
// owner approved and are not this room's wording to edit. Everything else describes
// things the site already states elsewhere — the address, the walk from the station,
// the hours, the founding year. Nothing here claims a result, a rating, a review or a
// client count, because none of those exist in a source this room can point at.
// The Academy is deliberately absent until 16 August.

const DESCRIPTION =
  "60 minutes. Master-level assessment first, then a blend chosen for your condition — traditional Thai, stretching, deep tissue, Swedish, sports, aromatherapy, Thai yoga.";

// Kru Nok wrote this block herself and asked for it at the top of the page, verbatim
// (voice note, 2026-08-12: "ใส่คำที่พี่นกจั่วหัวให้"). She also said the rest of the page
// was fine, so this is an addition and not a rewrite. Do not paraphrase these lines —
// they are the owner's brand wording, which is hers to set and not this room's to edit.
const OWNER_COPY = {
  eyebrow: "Taitam-D Signature",
  heading: "Nuad Thai Heritage Massage",
  tagline: "A Thai tradition. A Master’s touch. Designed for you.",
  heritage:
    "Rooted in the tradition of Nuad Thai — recognised by UNESCO as Intangible Cultural Heritage of Humanity.",
  consult:
    "Before your treatment begins, our experienced therapist will consult with you, observe your needs and select the most suitable techniques for your body.",
  modalities: "Traditional Thai • Stretching • Deep Tissue • Swedish • Sports • Aromatherapy • Thai Yoga",
  price: "£69 / 60 Minutes",
  closer: "One body. One session. One treatment designed around you.",
  poweredBy: "Powered by Taitam-D Academy London",
};

// The people, from the shop's own booking system — not from the board on the wall.
//
// The earlier version of this list was transcribed from the "Taitam-D Specialist Team"
// board (photograph, 2026-08-12). Kru Nok's brief of 2026-08-13/14 established that four
// of those names had left the business, and asked for the current team to take their
// places. She proposed keeping each departed person's biography and swapping only the
// name over it. Kom decided against that on 2026-08-15: a qualification is a statement
// about a named individual, so it moves with the person, not with the slot.
//
// So each line here carries only what the shop's own booking system records for that
// person — Key: "Beauty & Massage Therapy", Kanya: "Physiotherapist", Pranee: "Massage
// therapist" — plus the treatments they give. Awarding-body levels ("VTCT Level 3",
// "ITEC Level 3"), the HCPC registration number PH112704 and the "more than N years"
// counts all belonged to people who have left, and are gone with them.
//
// Do not re-attach a credential here from memory or from an older revision of this
// file. Anything added back needs a source naming *this* person — the register entry,
// the certificate, or Kru Nok confirming it of them by name.
const TEAM = [
  { name: "Nok", role: "NVQ Assessor · Team Leader & Manager", detail: "More than 25 years in the beauty industry." },
  { name: "Key", role: "Beauty & massage therapy", detail: "Massage and beauty treatments — Thai, deep tissue, Swedish and aromatherapy." },
  { name: "Kanya", role: "Physiotherapist", detail: "Physiotherapy alongside therapeutic massage for pain and recovery." },
  { name: "Tip", role: "Massage therapist", detail: "Therapeutics and pain relief — Thai, deep tissue, Swedish and aromatherapy." },
  { name: "Sue · Pranee · Veronica", role: "Beauty & body experts", detail: "Nails, facials and skincare, hair removal and massage." },
];

const BLEND = [
  { name: "Traditional Thai", note: "Energy-line work along the body, unhurried and rhythmic." },
  { name: "Stretching", note: "Assisted movement that opens the hips, back and shoulders." },
  { name: "Deep tissue", note: "Slow, focused pressure for tension that has settled in." },
  { name: "Swedish", note: "Flowing oil work to warm the muscle before deeper pressure." },
  { name: "Sports", note: "Targeted work for training load and recovery." },
  { name: "Aromatherapy", note: "Essential-oil blends chosen on the day." },
  { name: "Thai yoga", note: "Guided passive postures to finish, so the release holds." },
];

const STEPS = [
  {
    n: "01",
    t: "We ask first",
    d: "Where it hurts, what your week looks like, what you have already tried. A master-level assessment before a single stroke — this is the part most treatments skip.",
  },
  {
    n: "02",
    t: "The blend is chosen for you",
    d: "Not a fixed routine. Your therapist draws on seven disciplines and combines the ones your body needs today, adjusting pressure as they go.",
  },
  {
    n: "03",
    t: "You leave with it holding",
    d: "The session closes with guided passive stretches so the work settles in rather than fading on the walk home.",
  },
];

const FOR_YOU = [
  "Shoulders and neck that have set solid after long hours at a desk",
  "A lower back that complains after standing all day",
  "Training load your usual recovery is not clearing",
  "Sleep that has not been deep for a while",
];

const FAQ: Array<[string, string]> = [
  [
    "How is this different from a standard Thai massage?",
    "A standard treatment follows a set routine. The Taitam-D Signature starts with a master-level assessment, and the therapist then blends traditional Thai, stretching, deep tissue, Swedish, sports, aromatherapy and Thai yoga around what that assessment finds.",
  ],
  [
    "How much is it and how long does it take?",
    "The Taitam-D Signature is £69 for 60 minutes. That is the full price for the treatment, not a starting rate.",
  ],
  [
    "Do I need to undress?",
    "It depends on the blend your therapist chooses. Oil work needs skin access and is done under draping; traditional Thai and stretching are done clothed. Your therapist will talk you through it before starting.",
  ],
  [
    "Where are you and how do I get there?",
    "72-74 Caledonian Road, King's Cross, London N1 9DN — around a six-minute walk from King's Cross and St Pancras.",
  ],
  [
    "How do I book?",
    "Message us on WhatsApp. We will confirm a time and answer anything you want to ask first — you do not need an account or a deposit.",
  ],
];

const TITLE = "Taitam-D Signature Thai Massage — £69 / 60 minutes";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/signature" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/signature",
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
};

// Service + FAQ for this page only. The business node lives in the site-wide graph and
// is referenced by @id rather than repeated — two business nodes with different values
// on one page would leave Google to pick one.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE.baseUrl}/signature/#service`,
      name: "Taitam-D Signature",
      alternateName: "Taitam-D Signature Thai Massage",
      serviceType: "Thai massage",
      description: DESCRIPTION,
      provider: { "@id": `${SITE.baseUrl}/#business` },
      areaServed: { "@type": "Place", name: "King's Cross, London" },
      offers: {
        "@type": "Offer",
        price: "69",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        url: `${SITE.baseUrl}/signature/`,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
};

// Every room on this page is the real shop, photographed by Kru Nok on 2026-08-12 after
// the refit. Two generated still lifes remain as decoration — oils on a table, oil poured
// into a palm — which Kom allowed on 2026-08-13 ("ภาพ AI บ้างสำหรับตกแต่งได้").
//
// The split is not arbitrary and is the line D-W22 draws: a picture of a room is a claim
// about our premises, and a bottle on a table is not. So rooms are photographs, always,
// and generated artwork never carries a room, a member of staff or a client.
//
// The other rule here is that no image appears twice, and no two show the same corner
// from the same angle — that is what this page had before and it read as padding.

export default function SignaturePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 md:px-8 md:pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="pt-8 md:pt-12">
        <div className="overflow-hidden rounded-[32px] border border-[#d6c198] bg-[#f5efe3] text-[#183b2d] shadow-[0_24px_60px_rgba(12,51,30,0.22)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="px-5 pb-6 pt-5 md:p-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#95743a] md:text-xs">{OWNER_COPY.eyebrow}</p>

            <h1 className="mt-2 max-w-3xl text-[1.75rem] font-semibold uppercase leading-[1.06] tracking-[-0.02em] sm:text-4xl md:mt-4 md:text-5xl">
              Nuad Thai <span className="text-[#a37d37]">Heritage Massage</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-[#4c6154] sm:text-base md:mt-4 md:text-lg">{OWNER_COPY.tagline}</p>

            <p className="mt-4 max-w-xl text-xs leading-relaxed text-[#5b6d62] md:text-sm">{OWNER_COPY.heritage}</p>

            {/* The price sits above the fold and carries the treatment name with it. An ad
                quoting £69 has to find £69 here, unqualified by any "from". The eyebrow and
                heading name the treatment directly above, so the figure is never orphaned. */}
            <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-[#cdb887] bg-[#fffdf8] px-4 py-3.5 md:mt-6 md:px-5 md:py-4">
              <Sparkles className="h-5 w-5 shrink-0 text-[#a37d37]" />
              <span className="text-lg font-semibold md:text-xl">{OWNER_COPY.price}</span>
            </div>

            {/* Buttons come before the description, not after. On a 375px screen the
                consent sheet occupies the lower third until it is answered, and with the
                paragraph first the primary CTA rendered behind it — measured with a hit
                test, which returned the banner rather than the link. Price, then the way
                to act on it, then the detail. */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
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

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#5b6d62] md:mt-7 md:text-base">{OWNER_COPY.consult}</p>

            <p className="mt-4 max-w-2xl text-xs font-semibold uppercase tracking-[0.12em] text-[#8d6c2c] md:text-sm">
              {OWNER_COPY.modalities}
            </p>

            <p className="mt-5 max-w-xl text-base font-semibold text-[#274a38] md:text-lg">{OWNER_COPY.closer}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#ebe3d4] p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#927039]">
                  <Clock className="h-3.5 w-3.5" /> Duration
                </div>
                <div className="mt-2 text-sm font-semibold">60 minutes</div>
              </div>
              <div className="rounded-2xl bg-[#ebe3d4] p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#927039]">
                  <MapPin className="h-3.5 w-3.5" /> Where
                </div>
                <div className="mt-2 text-sm font-semibold">King&rsquo;s Cross &middot; 6 min walk</div>
              </div>
              <div className="rounded-2xl bg-[#ebe3d4] p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#927039]">Open</div>
                <div className="mt-2 text-sm font-semibold">{SITE.hours}</div>
              </div>
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#95743a]">{OWNER_COPY.poweredBy}</p>
          </div>

            {/* The room this treatment happens in, photographed by Kru Nok on 2026-08-12
                after the refit. It replaces an AI image of a room that does not exist —
                which is both what she asked for and what D-W22 requires of a page that
                depicts our premises. */}
            {/* Text first on phones, picture second. Ad traffic is mostly mobile and the
                price has to clear the consent sheet — with the photograph on top it landed
                at 725px against a banner starting at 580. On desktop the two sit side by
                side and the order stops mattering. */}
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:min-h-full">
              <Image
                src="/images/shop/treatment-room-couples.jpg"
                alt="The couples treatment room at Taitam-D: two massage beds dressed in purple with Thai gold brocade runners, against a painted lagoon mural"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The differentiator */}
      <Reveal>
        <section className="ui-section">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Why it is different</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                Most treatments start with a routine. <span className="text-gold">This one starts with a question.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-mist md:text-base">
                A set routine gives everybody the same hour. The Signature does not. Your therapist assesses first, then
                chooses from seven disciplines and builds the hour around what they found — the same treatment can be
                slow oil work one month and assisted stretching the next, because you are not the same either.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mist md:text-base">
                It is the treatment we put our own name on, in a room we have run in King&rsquo;s Cross since 2009.
              </p>
            </div>
            <div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[26px] border border-ink/10">
                <Image
                  src="/images/shop/salon-lavender.jpg"
                  alt="A treatment area at Taitam-D, with a lavender-field mural, styling chair and facial bed"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* How the hour goes */}
      <Reveal>
        <section className="ui-section">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">How the 60 minutes goes</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
            Nothing about the hour is guesswork.
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-[26px] border border-ink/10 bg-ink/5 p-6">
                <div className="text-xs font-semibold tracking-[0.28em] text-gold">{s.n}</div>
                <h3 className="mt-3 text-xl font-semibold">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[26px] border border-ink/10">
                <Image
                  src="/images/shop/reception-tropical.jpg"
                  alt="The Taitam-D waiting area, with a painted beach mural, armchairs and a low table"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[26px] border border-ink/10">
                <Image
                  src="/images/signature/detail-1000.jpg"
                  alt="Warm massage oil poured from an unlabelled amber bottle into an open palm"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* The blend */}
      <Reveal>
        <section className="ui-section">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Seven disciplines, one hour</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                What your therapist draws on
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist md:text-base">
                The assessment comes first. What follows is chosen for your condition on the day, not picked from a
                fixed menu.
              </p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {BLEND.map((b) => (
                  <li key={b.name} className="rounded-2xl border border-ink/10 bg-ink/5 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Check className="h-4 w-4 shrink-0 text-gold" /> {b.name}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-mist">{b.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] border border-ink/10">
                <Image
                  src="/images/signature/oils-1200.jpg"
                  alt="Aromatherapy oils in unlabelled amber bottles, a herbal compress and a folded towel"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Who books it */}
      <Reveal>
        <section className="ui-section">
          <div className="rounded-[32px] border border-gold/25 bg-ink/5 p-7 md:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Who books it</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                  What people come in with
                </h2>
                <ul className="mt-6 space-y-3">
                  {FOR_YOU.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-mist md:text-base">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-mist">
                  Not sure it is the right treatment for you? Message us and describe it — we would rather point you at
                  the right thing than sell you the wrong hour.
                </p>
                <a
                  href={buildWhatsAppLink(SITE.whatsappTemplates.signature)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3.5 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
                >
                  <MessageCircle className="h-4 w-4 text-[#d7b874]" /> Book the Signature
                  <ArrowUpRight className="h-4 w-4 text-[#d7b874]" />
                </a>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-ink/10">
                <Image
                  src="/images/shop/footspa-row.jpg"
                  alt="The foot treatment room at Taitam-D, with reclining chairs along a stone-clad wall"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Team & credentials */}
      <Reveal>
        <section className="ui-section">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              {/* 4/3, not the 3/4 the board photo used: this is seven people standing in a
                  row, and a portrait crop takes the ones on each end out of the picture. */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-ink/10">
                {/* Was a photograph of the team board on the shop wall. That board still
                    lists four people who have left, with their qualifications beside their
                    names, so it could not stay next to the current team.

                    This is the picture Kru Nok asked for in its place. She made it herself
                    and said how: she took each person's profile photograph out of the shop's
                    booking system and had an image model place them together in green
                    uniforms in front of the logo wall — "พี่ใช้ AI แต่ง แล้วก็มีหัวโตบ้าง
                    อะไรบ้าง แต่พี่ว่ามันถือว่าโอเคแหละ ใส่ไปก่อน ให้มันครบ".

                    D-W22 forbids AI imagery on a team page. Kom was asked before this went
                    up and ruled that Kru Nok's wish governs and that she carries the risk
                    (2026-08-15) — recorded on the board as D-W22 AMENDED. The decision is
                    made; do not reopen it. What D-W22 still governs is untouched: /tour is
                    photographs only, no legible text in generated images, no before-and-after. */}
                <Image
                  src="/images/tour/team-group.jpg"
                  alt="The Taitam-D team of seven in green uniforms, standing together in front of the Taitam-D Beauty & Spa Centre logo wall"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-mist">
                The team, in a composed portrait — the faces are ours, the setting was put together for it.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Who will treat you</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                A master-level assessment means <span className="text-gold">someone qualified to make it.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist md:text-base">
                The assessment at the start of the Signature is only worth having if the person doing it can read a
                body. These are the people in the room.
              </p>
              <ul className="mt-6 space-y-3">
                {TEAM.map((m) => (
                  <li key={m.name} className="rounded-2xl border border-ink/10 bg-ink/5 p-4">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">{m.role}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-mist">{m.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <section className="ui-section" aria-labelledby="signature-faq">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">Before you book</p>
          <h2 id="signature-faq" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {FAQ.map(([q, a]) => (
              <div key={q} className="rounded-[26px] border border-ink/10 bg-ink/5 p-6">
                <h3 className="font-semibold">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Close */}
      <Reveal>
        <section className="ui-section">
          <div className="rounded-[32px] border border-[#d6c198] bg-[#f5efe3] p-7 text-[#183b2d] md:p-12">
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
              One hour, built around you. <span className="text-[#a37d37]">£69.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#5b6d62] md:text-base">
              Message us on WhatsApp and we will find you a time. {SITE.address}. Open {SITE.hours}.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
                href={SITE.social.googleMaps}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cdb887] px-5 py-3.5 text-sm font-semibold text-[#345a45] transition hover:bg-white/60"
              >
                <MapPin className="h-4 w-4" /> Get directions
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
