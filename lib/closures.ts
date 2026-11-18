import data from "@/data/closures.json";
import { DAY, londonMidnight } from "./london-day";
import { checkKeys, checkList, checkObject, checkText, checkUnique, failAt } from "./content-check";
import type { PromotionWindow } from "./promotions";

// Days the shop is closed outside its usual hours (bank holidays, a refit), listed next to the
// opening hours. Fields and rules: data/CLOSURES.md. A malformed file throws, which stops
// `next build`. Nothing here depends on today's date except what is shown: a closure whose last
// day has passed is left out of the HTML, and the visitor's own clock hides it on the day it
// ends (PromoGate), the same way promotions behave.

const FILE = "closures.json";

export type Closure = { code: string; from: string; to: string; label: string; status: "live" | "ended" };

function validate(raw: unknown): Closure[] {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["closures"]);
  const seen = new Set<string>();
  return checkList(FILE, "closures", root.closures, 40, (c, i) => {
    const o = checkObject(FILE, `#${i + 1}`, c);
    const code = checkText(FILE, `#${i + 1}.code`, o.code, 40);
    checkUnique(FILE, code, seen, code);
    checkKeys(FILE, code, o, ["code", "from", "to", "label", "status"]);
    for (const k of ["from", "to"]) {
      if (typeof o[k] !== "string" || !DAY.test(o[k] as string)) failAt(FILE, `${code}.${k}`, "must be a date like 2026-12-25");
    }
    if ((o.to as string) < (o.from as string)) failAt(FILE, code, "`to` is before `from`");
    const label = checkText(FILE, `${code}.label`, o.label, 80);
    if (o.status !== "live" && o.status !== "ended") failAt(FILE, `${code}.status`, 'must be "live" or "ended"');
    return { code, from: o.from as string, to: o.to as string, label, status: o.status };
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
