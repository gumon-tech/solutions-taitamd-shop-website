import data from "@/data/hours.json";
import { checkKeys, checkList, checkObject, failAt } from "./content-check";

// The shop's opening hours live in data/hours.json (fields: data/HOURS.md). Everything on the
// site that states the hours — the hero, the footer, the location block, the FAQ answers, the
// landing pages, the structured data — is computed here, so one edit updates all of them.
// A malformed file throws, which stops `next build`.

const FILE = "hours.json";
const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const SHORT: Record<string, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu", Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};
const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

export type OpeningDay = { day: string; opens: string; closes: string } | { day: string; closed: true };

function validate(raw: unknown): OpeningDay[] {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["days"]);
  const days = checkList(FILE, "days", root.days, 7, (d, i) => {
    const where = `days[${i}]`;
    const o = checkObject(FILE, where, d);
    const expected = WEEK[i];
    if (o.day !== expected) failAt(FILE, where, `\`day\` must be "${expected}" (the seven days, Monday first)`);
    if (o.closed === true) {
      checkKeys(FILE, where, o, ["day", "closed"]);
      return { day: expected, closed: true as const };
    }
    checkKeys(FILE, where, o, ["day", "opens", "closes"]);
    for (const k of ["opens", "closes"]) {
      if (typeof o[k] !== "string" || !CLOCK.test(o[k] as string)) failAt(FILE, `${where}.${k}`, 'must be a 24-hour time like "10:30", or set `closed` to true instead of both times');
    }
    if ((o.closes as string) <= (o.opens as string)) failAt(FILE, where, "`closes` must be later than `opens` on the same day");
    return { day: expected, opens: o.opens as string, closes: o.closes as string };
  });
  if (days.length !== 7) failAt(FILE, "days", `must list all seven days, found ${days.length}`);
  if (days.every((d) => "closed" in d)) failAt(FILE, "days", "at least one day must be open");
  return days;
}

export const OPENING_DAYS = validate(data);

type Fmt = (opens: string, closes: string) => string;

function clock(t: string, style: "long" | "words" | "compact") {
  const [h24, m] = t.split(":").map(Number);
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const mm = String(m).padStart(2, "0");
  const ap = h24 < 12 ? "am" : "pm";
  if (style === "long") return `${h}:${mm} ${ap.toUpperCase()}`;
  if (style === "words") return `${h}:${mm}${ap}`;
  return `${h}${m === 0 ? "" : `:${mm}`}${ap}`;
}

const FORMAT = {
  long: ((o, c) => `${clock(o, "long")} – ${clock(c, "long")}`) as Fmt,
  words: ((o, c) => `${clock(o, "words")} to ${clock(c, "words")}`) as Fmt,
  compact: ((o, c) => `${clock(o, "compact")} – ${clock(c, "compact")}`) as Fmt,
};

/** Runs of consecutive days that share the same opening times (or all closed). */
function groups() {
  const out: Array<{ first: string; last: string; day: OpeningDay }> = [];
  for (const d of OPENING_DAYS) {
    const prev = out[out.length - 1];
    const same =
      prev &&
      ("closed" in prev.day
        ? "closed" in d
        : !("closed" in d) && prev.day.opens === d.opens && prev.day.closes === d.closes);
    if (same) prev.last = d.day;
    else out.push({ first: d.day, last: d.day, day: d });
  }
  return out;
}

const uniform = groups().length === 1 && !("closed" in OPENING_DAYS[0]);

function describe(fmt: Fmt, withDays: boolean) {
  const g = groups();
  if (!withDays && uniform) {
    const d = OPENING_DAYS[0] as { opens: string; closes: string };
    return fmt(d.opens, d.closes);
  }
  return g
    .map((x) => {
      const label = x.first === x.last ? SHORT[x.first] : `${SHORT[x.first]} – ${SHORT[x.last]}`;
      return `${label} ${"closed" in x.day ? "closed" : fmt(x.day.opens, x.day.closes)}`;
    })
    .join(", ");
}

export const HOURS = {
  /** True when every day has the same times, so "every day" is accurate. */
  uniform,
  /** "Mon – Sun 10:30 AM – 9:00 PM" — the line shown in the hero, footer and location block. */
  display: describe(FORMAT.long, true),
  /** "10:30 AM – 9:00 PM" when every day is the same; the full line otherwise. */
  range: describe(FORMAT.long, false),
  /** "10:30am to 9:00pm" (or the full line with days when the days differ) — the {{hours}} token. */
  words: describe(FORMAT.words, false),
  /** "10:30am – 9pm" — the short form on the hero card. */
  compact: describe(FORMAT.compact, false),
  /** "Daily" when every day is the same, otherwise "Hours". */
  compactLabel: uniform ? "Daily" : "Hours",
};

/** schema.org openingHoursSpecification: one entry per run of days that share the same times. */
export function openingHoursSpecification() {
  return groups()
    .filter((g) => !("closed" in g.day))
    .map((g) => {
      const d = g.day as { opens: string; closes: string };
      const first = OPENING_DAYS.findIndex((x) => x.day === g.first);
      const last = OPENING_DAYS.findIndex((x) => x.day === g.last);
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: OPENING_DAYS.slice(first, last + 1).map((x) => x.day),
        opens: d.opens,
        closes: d.closes,
      };
    });
}
