import data from "@/data/vacancies.json";
import { DAY, londonMidnight, withinWindow } from "./london-day";

// The open positions live in data/vacancies.json so the careers page and the shop's agent
// (KBOT) read the same thing. The agent fetches that file over https, the way it already
// fetches promotions, so there is no second copy of the vacancy list to drift.
//
// Every check below throws, so a malformed or out-of-date file stops `next build` — locally
// and in CI, before deploy — instead of reaching a page that people apply through.

export type VacancyStatus = "live" | "draft" | "closed";
export type VacancyGroup = "A" | "B" | "C";

export type Vacancy = {
  code: string;
  group: VacancyGroup;
  title: string;
  summary: string;
  duties: string[];
  essential: string[];
  desirable: string[];
  /** Whether the holder must register with Islington before performing the work. */
  council_registration: boolean;
  posted: string;
  closes: string;
  closes_label: string;
  status: VacancyStatus;
};

const STATUSES: VacancyStatus[] = ["live", "draft", "closed"];
const GROUPS: VacancyGroup[] = ["A", "B", "C"];

// Kom ruled on 2026-10-20 that the site does not state pay or employment status: a candidate
// discusses both with management. A rule nobody can see is a rule that comes back, so it is a
// check rather than a line in a document — adding any of these fields fails the build.
const FORBIDDEN = ["pay", "salary", "wage", "rate", "employment_type", "employmentType", "status_of_engagement"];

function fail(code: string, why: string): never {
  throw new Error(`data/vacancies.json: ${code}: ${why}`);
}

function isText(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isTextList(v: unknown): v is string[] {
  return Array.isArray(v) && v.length > 0 && v.every(isText);
}

function validate(raw: unknown): Vacancy[] {
  const list = (raw as { vacancies?: unknown }).vacancies;
  if (!Array.isArray(list)) fail("(file)", "`vacancies` must be a list");
  const seen = new Set<string>();
  return list.map((v: Record<string, unknown>, i) => {
    const code = isText(v.code) ? v.code : fail(`#${i + 1}`, "`code` is missing");
    if (seen.has(code)) fail(code, "`code` is used twice");
    seen.add(code);
    for (const key of FORBIDDEN) {
      if (key in v) fail(code, `\`${key}\` must not be here — pay and engagement are discussed with management, not published`);
    }
    for (const key of ["title", "summary", "closes_label"]) {
      if (!isText(v[key])) fail(code, `\`${key}\` must be non-empty text`);
    }
    for (const key of ["duties", "essential"]) {
      if (!isTextList(v[key])) fail(code, `\`${key}\` must be a non-empty list of text`);
    }
    if (!Array.isArray(v.desirable) || !v.desirable.every(isText)) fail(code, "`desirable` must be a list of text");
    if (!GROUPS.includes(v.group as VacancyGroup)) fail(code, `\`group\` must be one of ${GROUPS.join(", ")}`);
    if (!STATUSES.includes(v.status as VacancyStatus)) fail(code, `\`status\` must be one of ${STATUSES.join(", ")}`);
    if (typeof v.council_registration !== "boolean") fail(code, "`council_registration` must be true or false");
    for (const key of ["posted", "closes"]) {
      if (!isText(v[key]) || !DAY.test(v[key] as string)) fail(code, `\`${key}\` must be a date like 2026-11-30`);
    }
    if ((v.closes as string) < (v.posted as string)) fail(code, "`closes` is before `posted`");
    return v as unknown as Vacancy;
  });
}

const vacancies = validate(data);

const note: unknown = (data as { note?: unknown }).note;
export const vacanciesNote: string | undefined = isText(note) ? note : undefined;

/** From midnight at the shop on `posted` until midnight at the end of `closes`. */
export function vacancyWindow(v: Vacancy): [number, number] {
  return [londonMidnight(v.posted), londonMidnight(v.closes, 1)];
}

/** Positions worth putting in the HTML: marked live and not yet closed when the site is built. */
export function openVacancies(now = Date.now()) {
  return vacancies.filter((v) => v.status === "live" && now < vacancyWindow(v)[1]);
}

/** Whether the careers page should show a list at all, and the windows it switches on. */
export function vacanciesGate(now = Date.now()) {
  const windows = openVacancies(now).map(vacancyWindow);
  return { windows, initiallyActive: windows.some((w) => withinWindow(w, now)) };
}

/**
 * The calendar, which the shape checks above cannot see. A promotion left live past its end
 * date cost three days of an expired offer sitting in the HTML; a vacancy left live past its
 * closing date costs someone an application for a job that is gone, which is worse. Same gate,
 * same reason: it runs at import, so `next build` fails and the message says what to change.
 */
function auditCalendar(list: Vacancy[], now: number) {
  for (const v of list.filter((x) => x.status === "live" && now >= vacancyWindow(x)[1])) {
    fail(v.code, `\`status\` is still "live" but the position closed on ${v.closes} — set it to "closed"`);
  }
  if (isText(note) && !list.some((v) => v.status === "live" && now < vacancyWindow(v)[1])) {
    fail("(file)", "`note` is still set while nothing is open — take the field out, or send \"\"");
  }
}

auditCalendar(vacancies, Date.now());
