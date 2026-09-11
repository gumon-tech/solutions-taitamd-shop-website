import Reveal from "./Reveal";

/**
 * One of the two light bands phase 3 puts on the home page (Q-SHOP-033, ruled by WS).
 *
 * Every section of this site sits on one dark green, which is why a long page reads as one
 * undifferentiated stretch: there is nothing to tell a reader they have moved on to a new
 * subject. The cheapest fix is a change of ground, and it has to be a change *upward* — the
 * owner's note on 2026-09-11 is that every colour round in this shop's history has come out
 * too dark for Kru Nok, so the standing rule (T11) is that brightness may only go up and only
 * by using more of the cream that is already live.
 *
 * So none of these values are new. `#f5efe3`, `#ebe3d4` and the ink and label colours are
 * lifted from the card /book/ and /signature/ have been serving since long before this work —
 * surfaces Kru Nok has already seen and accepted. Nothing in tailwind.config.ts or the :root
 * block is touched, which is the first clause of T11.
 */
const stats = [
  { k: "16+", v: "years of craft" },
  { k: "5 min", v: "from King’s Cross" },
  { k: "2009", v: "established" },
  { k: "7 days", v: "open weekly" }
];

export default function Awards() {
  return (
    <section className="ui-section">
      <Reveal>
        <div className="rounded-[28px] border border-[#d6c198] bg-[#f5efe3] p-7 md:p-10 shadow-[0_24px_60px_rgba(12,51,30,0.22)] overflow-hidden relative">
          {/* The two blurred blobs that used to sit here were gold and olive at 12% over a dark
              ground, where they read as depth. Over cream they read as a stain, so they are
              gone rather than recoloured — the panel does not need them to have a shape. */}
          <div className="relative">
            <p className="text-xs tracking-[0.28em] uppercase text-[#6d5223]">Social proof</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-[-0.01em] text-[#183b2d] leading-tight">
              Loved by thousands — <span className="text-[#6d5223]">earned</span>, not claimed.
            </h2>
            <p className="mt-4 text-sm md:text-base text-[#2c4a3c] max-w-2xl">
              A founder-led Thai beauty and wellness destination, open every day in the heart of King’s Cross.
            </p>

            <div className="mt-10 md:mt-11 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.v} className="rounded-2xl bg-[#ebe3d4] border border-[#cdb887] p-5">
                  <div className="text-3xl font-semibold text-[#6d5223]">{s.k}</div>
                  <div className="mt-1 text-xs text-[#2c4a3c] tracking-[0.18em] uppercase">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
