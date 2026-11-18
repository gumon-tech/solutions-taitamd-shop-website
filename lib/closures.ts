import data from "@/data/closures.json";
import { DAY, londonMidnight } from "./london-day";
import { CLOCK, timeRange } from "./hours";
import { checkKeys, checkList, checkObject, checkText, checkUnique, failAt } from "./content-check";
import type { PromotionWindow } from "./promotions";

// Days the shop is closed outside its usual hours (bank holidays, a refit), listed next to the
// opening hours. Fields and rules: data/CLOSURES.md. A malformed file throws, which stops
// `next build`. Nothing here depends on today's date except what is shown: a closure whose last
// day has passed is left out of the HTML, and the visitor's own clock hides it on the day it
// ends (PromoGate), the same way promotions behave.
//
// A closure may instead carry `opens` and `closes` ("12:00", "18:00"; both or neither, opens
// before closes): the shop is open on those days, with those hours only. It is listed in the
// same place, as special hours rather than closed. The structured data is not changed either way.

const FILE = "closures.json";

export type Closure = { code: string; from: string; to: string; label: string; status: "live" | "ended"; opens?: string; closes?: string };

function validate(raw: unknown): Closure[] {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["closures"]);
  const seen = new Set<string>();
  return checkList(FILE, "closures", root.closures, 40, (c, i) => {
    const o = checkObject(FILE, `#${i + 1}`, c);
    const code = checkText(FILE, `#${i + 1}.code`, o.code, 40);
    checkUnique(FILE, code, seen, code);
    checkKeys(FILE, code, o, ["code", "from", "to", "label", "status", "opens", "closes"]);
    for (const k of ["from", "to"]) {
      if (typeof o[k] !== "string" || !DAY.test(o[k] as string)) failAt(FILE, `${code}.${k}`, "must be a date like 2026-12-25");
    }
    if ((o.to as string) < (o.from as string)) failAt(FILE, code, "`to` is before `from`");
    const label = checkText(FILE, `${code}.label`, o.label, 80);
    if (o.status !== "live" && o.status !== "ended") failAt(FILE, `${code}.status`, 'must be "live" or "ended"');
    if ((o.opens === undefined) !== (o.closes === undefined)) failAt(FILE, code, "`opens` and `closes` go together: both (open with special hours) or neither (closed)");
    if (o.opens === undefined) return { code, from: o.from as string, to: o.to as string, label, status: o.status };
    for (const k of ["opens", "closes"]) {
      if (typeof o[k] !== "string" || !CLOCK.test(o[k] as string)) failAt(FILE, `${code}.${k}`, 'must be a 24-hour time like "12:00"');
    }
    if ((o.closes as string) <= (o.opens as string)) failAt(FILE, code, "`closes` must be later than `opens`");
    return { code, from: o.from as string, to: o.to as string, label, status: o.status, opens: o.opens as string, closes: o.closes as string };
  });
}

const closures = validate(data);

/** Until midnight at the end of `to`, London time. The closure is listed from the moment the file says so. */
export function closureWindow(c: Closure): PromotionWindow {
  return [0, londonMidnight(c.to, 1)];
}

/** Closures worth putting in the HTML: marked live and not yet over when the site is built. */
export function upcomingClosures(now = Date.now()) {
  return closures.filter((c) => c.status === "live" && now < closureWindow(c)[1]);
}

const MONTH = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const parts = (d: string) => MONTH.formatToParts(new Date(`${d}T00:00:00Z`));

/** "25 December 2026" · "24 – 26 December 2026" · "30 December 2026 – 2 January 2027" */
export function closureDates(c: Closure) {
  if (c.from === c.to) return MONTH.format(new Date(`${c.from}T00:00:00Z`));
  const a = parts(c.from);
  const b = parts(c.to);
  const val = (p: Intl.DateTimeFormatPart[], t: string) => p.find((x) => x.type === t)!.value;
  if (val(a, "year") === val(b, "year") && val(a, "month") === val(b, "month")) {
    return `${val(a, "day")} – ${val(b, "day")} ${val(b, "month")} ${val(b, "year")}`;
  }
  return `${MONTH.format(new Date(`${c.from}T00:00:00Z`))} – ${MONTH.format(new Date(`${c.to}T00:00:00Z`))}`;
}

/** "Closed 24 – 26 December 2026 — Christmas" · "Open 24 December 2026, 12:00 PM – 6:00 PM — Christmas Eve" */
export function closureLine(c: Closure) {
  return c.opens && c.closes ? `Open ${closureDates(c)}, ${timeRange(c.opens, c.closes)} — ${c.label}` : `Closed ${closureDates(c)} — ${c.label}`;
}
