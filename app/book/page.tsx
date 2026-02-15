import { SITE } from "@/lib/site";

export default function BookPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <div className="p-3 md:p-5" />
      <div className="glass rounded-[28px] p-6 md:p-8 shadow-glow">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Booking</p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
          Book with <span className="text-gold">Treatwell</span>
        </h1>
        <p className="mt-4 text-sm md:text-base text-mist">
          Check live availability and confirm your booking directly below.
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gold/30 bg-black/10">
          <iframe
            title="Treatwell booking widget"
            src={SITE.treatwellWidget}
            loading="lazy"
            className="block h-[70vh] min-h-[560px] w-full sm:min-h-[620px]"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={SITE.treatwell}
            target="_blank"
            rel="noreferrer"
            className="btn-shine inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-ink/5 border border-ink/12 px-5 py-3 text-sm font-semibold hover:bg-ink/8 transition"
          >
            Open Treatwell in new tab
          </a>
          <p className="text-xs text-mist">
            If the widget does not load, use the button to continue booking.
          </p>
        </div>
      </div>
    </main>
  );
}
