import { SITE } from "@/lib/site";

/**
 * The questions people actually ask, and the answers the shop stands behind.
 *
 * OFFICE counted the topics across 51 enquiries between 20 August and 8 September 2026 and
 * marked which answers it could confirm (Q-MKT-079 group C). Two of the ten — card payment
 * and gift cards — are absent because it could not, and they stay absent until somebody at
 * the shop confirms them: an FAQ answer is a promise made in advance to a reader who cannot
 * ask a follow-up question.
 *
 * It lives in a component because the same block belongs on several pages, and because the
 * next correction should land in one file rather than in however many copies exist by then.
 * Pages with their own subject — the treatment landing pages — write their own list instead,
 * since half of these answers would be beside the point there.
 */
export const SHOP_FAQ: Array<[string, string]> = [
  [
    "Where are you?",
    `We are at ${SITE.address}, a ${SITE.walkMinutes}-minute walk from King's Cross St Pancras.`,
  ],
  ["What are your opening hours?", "We are open every day from 10:30am to 9:00pm."],
  [
    "How much is an hour of massage?",
    "Deep tissue, Thai Combination and Aromatherapy are £69 for 60 minutes. Swedish is £59 and Hot Stone is £74. Thirty-minute treatments start at £35.",
  ],
  [
    "Which treatments do most people book?",
    "Deep tissue and Thai Combination, both at 60 minutes. Of the 22 appointments booked between 20 August and 8 September 2026, 16 were 60-minute treatments.",
  ],
  [
    "Can I book for today?",
    "Message us any time and we will check the diary and reply. We cannot promise a slot in advance, because availability changes through the day.",
  ],
  [
    "Can I walk in without booking?",
    "Yes, and people do. We still suggest messaging first, because you may have to wait when the rooms are full.",
  ],
  [
    "Do you come to my home or hotel?",
    "No. Every treatment is done at the shop, with no exceptions.",
  ],
  [
    "Can I see the rooms before I book?",
    "Yes. There are photographs of every room on our tour page, taken in the order you meet them walking in.",
  ],
];

export default function ShopFaq({ id = "shop-faq" }: { id?: string }) {
  return (
    <section
      aria-labelledby={id}
      className="mt-14 rounded-[28px] border border-ink/10 bg-ink/5 p-7 md:p-9"
    >
      <p className="text-xs tracking-[0.28em] uppercase text-mist">Helpful answers</p>
      <h2 id={id} className="mt-3 text-2xl md:text-3xl font-semibold">
        Frequently asked questions
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {SHOP_FAQ.map(([q, a]) => (
          <div key={q}>
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">{a}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: SHOP_FAQ.map(([name, text]) => ({
              "@type": "Question",
              name,
              acceptedAnswer: { "@type": "Answer", text },
            })),
          }),
        }}
      />
    </section>
  );
}
