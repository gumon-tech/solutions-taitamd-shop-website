/**
 * The question-and-answer panel, and the FAQPage structured data that goes with it.
 *
 * This markup existed in six places — the home page's block and one on each treatment landing
 * page — identical down to the class list, because each page was written from the one before
 * it. That was survivable while the panel was a dark card. It stopped being survivable the
 * moment the panel had to change ground (Q-SHOP-033 phase 3): six copies means five chances to
 * leave one behind, and the one left behind would be a page nobody opens often enough to
 * notice.
 *
 * The answers themselves stay with their page. They are not interchangeable — the shop's list
 * and a waxing page's list overlap by about half, and the differences are the point.
 *
 * The JSON-LD is emitted here rather than by each caller for the same reason: Google reads it,
 * people do not, so a divergence between the six copies would have been invisible until it
 * showed up as a lost rich result. Verified identical across all six pages after this was
 * extracted, by hashing the parsed object out of the built HTML on both sides.
 */
export default function FaqPanel({
  id,
  items,
  eyebrow = "Helpful answers",
  title = "Frequently asked questions",
}: {
  id: string;
  items: Array<[string, string]>;
  eyebrow?: string;
  title?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className="mt-14 rounded-[28px] border border-[#d6c198] bg-[#f5efe3] p-7 md:p-9 shadow-[0_24px_60px_rgba(12,51,30,0.22)]"
    >
      <p className="text-xs tracking-[0.28em] uppercase text-[#6d5223]">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-2xl md:text-3xl font-semibold text-[#183b2d]">
        {title}
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {items.map(([q, a]) => (
          <div key={q}>
            <h3 className="font-semibold text-[#183b2d]">{q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#2c4a3c]">{a}</p>
          </div>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map(([name, text]) => ({
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
