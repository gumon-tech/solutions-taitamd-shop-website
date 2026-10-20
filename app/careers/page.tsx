import Image from "next/image";
import { Check, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { openVacancies, vacanciesNote, type Vacancy, type VacancyGroup } from "@/lib/vacancies";
import { buildWhatsAppLink, SOURCE_CAREERS } from "@/lib/whatsapp";
import type { Metadata } from "next";

// The careers page. Kom set the flow on 2026-10-20: the page lists what is open and what each
// role actually involves, and the application itself happens in WhatsApp with the shop's
// assistant, which collects what the owner and the management team need before anyone's time
// is spent on an interview.
//
// Four things on this page are deliberate and should not be "improved" without reading why:
//
// 1. No pay and no engagement type. That is Kom's ruling of 2026-10-20 — a candidate discusses
//    both with the management team. data/vacancies.json fails the build if anyone adds a field
//    for either, so this is enforced rather than remembered (see data/VACANCIES.md).
// 2. No promise of a job, a visa, a timescale or an outcome, and nothing that ties a course to
//    employment. Those are the group's own standing rules, and a recruitment page is exactly
//    where they get broken by accident.
// 3. The council registration line is not small print. A therapist registers with Islington
//    themselves, treatment by treatment, and the council allows at least 21 days — so it
//    changes when someone can actually start, and a candidate deserves to know before applying.
// 4. Each role has its own apply button, and the message it opens names the role and carries
//    its code, so nobody has to say which job twice and the agent can ask the questions that
//    belong to that role from the first reply (Kom, 2026-10-20).
// 5. APPLICATIONS_OPEN below is false, and that is the whole switch. The agent that would
//    receive an applicant is still being built, and the retention and access design for
//    applicant records (Q-KWEB-016, decided by KWS) is not implemented on that side.
//    Collecting people's details before there is somewhere proper to put them is the one
//    failure here that cannot be undone. The buttons are built, laid out and worded; flipping
//    this one line turns them into links, which is what was promised to KBOT so that opening
//    applications is a single change and not a rewrite.

// Flip to true only when KBOT confirms their side can receive and hold an applicant, or when
// Kom says to open regardless. Nothing else on this page needs to change.
const APPLICATIONS_OPEN = false;

function applyLink(v: Vacancy) {
  return buildWhatsAppLink(
    `Hi Taitam-D, I'd like to apply for the ${v.title} position (${v.code}).`,
    SOURCE_CAREERS,
  );
}

export const metadata: Metadata = {
  title: `Careers — ${SITE.name}`,
  description:
    "Open positions at our King's Cross salon and spa: massage, beauty, nails, lashes, hair, front of house and more. What each role involves and what we ask for.",
  alternates: { canonical: `${SITE.baseUrl}/careers/` },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: `${SITE.baseUrl}/careers/`,
    siteName: SITE.name,
    title: `Careers — ${SITE.name}`,
    description:
      "Open positions at our King's Cross salon and spa, and what each one actually involves.",
  },
  // Deliberately not indexed as a job posting: JobPosting structured data expects an
  // employment type, which this page does not state. Revisit together, not separately.
};

const GROUPS: { id: VacancyGroup; label: string; blurb: string }[] = [
  {
    id: "A",
    label: "Starting out",
    blurb:
      "No beauty qualification needed. These roles are lawful to do from your first day while you train, which the treatment roles are not.",
  },
  {
    id: "B",
    label: "Already qualified",
    blurb:
      "You hold the qualification for the work. We ask to see the units behind it, because that is what the council asks us for.",
  },
  {
    id: "C",
    label: "Senior",
    blurb: "Work that carries its own judgement, and other people's.",
  },
];

function VacancyCard({ v }: { v: Vacancy }) {
  return (
    <article className="glass rounded-[28px] p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-3xl">
          {v.title}
        </h3>
        <p className="text-sm text-ink/60">Open until {v.closes_label}</p>
      </div>
      <p className="mt-3 text-base leading-relaxed text-ink/80">{v.summary}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            What the day looks like
          </h4>
          <ul className="mt-3 space-y-2">
            {v.duties.map((d) => (
              <li key={d} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                <Check className="mt-[3px] h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            What we ask for
          </h4>
          <ul className="mt-3 space-y-2">
            {v.essential.map((e) => (
              <li key={e} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                <Check className="mt-[3px] h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{e}</span>
              </li>
            ))}
          </ul>
          {v.desirable.length > 0 && (
            <>
              <h4 className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/55">
                Also welcome
              </h4>
              <ul className="mt-3 space-y-2">
                {v.desirable.map((d) => (
                  <li key={d} className="text-sm leading-relaxed text-ink/70">
                    {d}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mt-6">
        {APPLICATIONS_OPEN ? (
          <a
            href={applyLink(v)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-[#19392a] transition hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Apply for {v.title}
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/[0.14] bg-ink/[0.04] px-5 py-3 text-sm font-semibold text-ink/60">
            Applications open shortly
          </span>
        )}
      </div>

      {v.council_registration && (
        <p className="mt-6 rounded-2xl bg-ink/[0.05] px-4 py-3 text-sm leading-relaxed text-ink/75">
          This role is a licensed treatment, so you register with Islington Council yourself
          before you start. The council asks for your qualifications treatment by treatment and
          allows at least 21 days, which affects when you can begin.
        </p>
      )}
    </article>
  );
}

export default function CareersPage() {
  const vacancies = openVacancies();

  return (
    <main className="mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-12">
      <section className="ui-section">
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                <Sparkles className="h-4 w-4" /> Work with us
              </div>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-ink md:text-6xl">
                Build your craft in <span className="text-gold">King&rsquo;s Cross</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
                We are a Thai-inspired salon and spa five minutes from the station, open seven
                days a week. We are hiring across the shop — from people starting out to
                therapists who already hold their qualifications.
              </p>
              <dl className="mt-7 grid max-w-lg grid-cols-2 gap-3">
                <div className="glass rounded-2xl px-4 py-3">
                  <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                    <MapPin className="h-3.5 w-3.5" /> Where
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-ink">{SITE.address}</dd>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/55">
                    <Clock3 className="h-3.5 w-3.5" /> Shop hours
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-ink">{SITE.hours}</dd>
                </div>
              </dl>
            </div>
            {/* A real photograph of the shopfront. A careers page makes a claim about a real
                place, so the pictures of the place are the real ones (D-W22, D-W23). */}
            <div className="overflow-hidden rounded-[32px] border border-ink/[0.12]">
              <Image
                src="/images/tour/shopfront-caledonian-road.jpg"
                alt="The Taitam-D shopfront on Caledonian Road"
                width={1200}
                height={800}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="ui-section">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[32px] border border-gold/25 bg-[#f4eee2] p-6 text-[#19392a] md:grid-cols-2 md:p-8">
            <div>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-4xl">
                We train our own
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#53665a]">
                Taitam-D runs its own academy in London, and the owner holds the qualifications
                for every treatment on our menu. If you are starting out, the roles below marked{" "}
                <em>Starting out</em> are where people begin: real work from your first day,
                while you study for the qualification the treatment side needs.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#53665a]">
                What you can study, and when, is a question for the academy rather than this
                page — ask us and we will tell you what is actually running.
              </p>
              <a
                href={SITE.academy}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#183d2d] px-5 py-3 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"
              >
                Visit the Academy
              </a>
            </div>
            {/* Generated atmosphere, and decoration is all it is. Kom lifted the no-people rule
                on 2026-10-20 (D-W27) because still lifes of objects made a beauty salon read
                like a furniture shop. What he did not lift, and what the alt text below is
                careful about: this is not presented as our therapist, our client or anyone's
                result. The real people and the real shop appear in photographs. */}
            <div className="overflow-hidden rounded-[28px]">
              <Image
                src="/images/careers/careers-therapist-gemini.jpg"
                alt="A beauty therapist holding a folded towel in a warmly lit treatment room"
                width={1200}
                height={669}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>

      <section id="positions" className="ui-section scroll-mt-nav">
        <Reveal>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink md:text-5xl">
            Open positions
          </h2>
          {vacanciesNote && (
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-ink/75">
              {vacanciesNote}
            </p>
          )}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/75">
            Pay and how we would engage you are not on this page. Those are a conversation with
            the management team, and they would rather have it with you than publish a number.
          </p>
        </Reveal>

        {GROUPS.map((g) => {
          const inGroup = vacancies.filter((v) => v.group === g.id);
          if (!inGroup.length) return null;
          return (
            <Reveal key={g.id}>
              <div className="mt-12">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
                  {g.label}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">{g.blurb}</p>
                <div className="mt-6 grid gap-5">
                  {inGroup.map((v) => (
                    <VacancyCard key={v.code} v={v} />
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="ui-section">
        <Reveal>
          <div className="glass rounded-[32px] p-6 text-center md:p-10">
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink md:text-4xl">
              How to apply
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/80">
              Applications happen in WhatsApp — no form to fill in. Use the button on the role
              you want and the chat opens already knowing which one it is, so we can ask you
              about that job rather than start from the beginning.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink/60">
              We will never ask for a copy of your passport or your right-to-work documents in a
              chat. Those come later, and only if we offer you the role.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
