import data from "@/data/promotions.json";

// The home page promotions live in data/promotions.json so they can change without touching
// code: the shop's system (KBOT) proposes edits to that one file, by pull request once it has a
// token limited to this repo, and by hand until then (owner's instruction relayed by KBOT,
// 2026-10-14). The field names are shared with KBOT's own database — rename one only together
// with KBOT. Schema and editing rules: data/PROMOTIONS.md.
//
// Every check below throws, so a malformed file stops `next build` — locally and in CI, before
// deploy — instead of reaching the live page.

export type PromotionStatus = "live" | "draft" | "ended";

export type Promotion = {
  code: string;
  title: string;
  eyebrow: string;
  detail: string;
  points: string[];
  offer: string;
  message: string;
  image: string;
  illustrative: boolean;
  starts: string;
  ends: string;
  ends_label: string;
  status: PromotionStatus;
};

/** [start, end) in UTC milliseconds. */
export type PromotionWindow = [number, number];

const STATUSES: PromotionStatus[] = ["live", "draft", "ended"];
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

function fail(code: string, why: string): never {
  throw new Error(`data/promotions.json: ${code}: ${why}`);
}

// London's UTC offset in minutes at an instant (60 in BST, 0 in GMT).
function londonOffset(utcMs: number) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(utcMs));
  const n = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return (Date.UTC(n("year"), n("month") - 1, n("day"), n("hour"), n("minute")) - utcMs) / 60000;
}

// Midnight at the shop at the start of a calendar day, as a UTC instant. `dayOffset` 1 gives
// the midnight that ends the day. The clocks change at 01:00 or 02:00, never at midnight, so one
// correction step lands on the right instant.
function londonMidnight(day: string, dayOffset = 0) {
  const [, y, m, d] = DAY.exec(day)!.map(Number);
  const guess = Date.UTC(y, m - 1, d + dayOffset);
  return guess - londonOffset(guess - londonOffset(guess) * 60000) * 60000;
}

function isText(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function validate(raw: unknown): Promotion[] {
  const list = (raw as { promotions?: unknown }).promotions;
  if (!Array.isArray(list)) fail("(file)", "`promotions` must be a list");
  const seen = new Set<string>();
  return list.map((p: Record<string, unknown>, i) => {
    const code = isText(p.code) ? p.code : fail(`#${i + 1}`, "`code` is missing");
    if (seen.has(code)) fail(code, "`code` is used twice");
    seen.add(code);
    for (const key of ["title", "eyebrow", "detail", "offer", "message", "ends_label"]) {
      if (!isText(p[key])) fail(code, `\`${key}\` must be non-empty text`);
    }
    if (!Array.isArray(p.points) || !p.points.every(isText)) fail(code, "`points` must be a list of text");
    if (!isText(p.image) || !p.image.startsWith("/images/")) fail(code, "`image` must be a path under /images/");
    if (typeof p.illustrative !== "boolean") fail(code, "`illustrative` must be true or false");
    if (!STATUSES.includes(p.status as PromotionStatus)) fail(code, `\`status\` must be one of ${STATUSES.join(", ")}`);
    for (const key of ["starts", "ends"]) {
      if (!isText(p[key]) || !DAY.test(p[key] as string)) fail(code, `\`${key}\` must be a date like 2026-10-16`);
    }
    if ((p.ends as string) < (p.starts as string)) fail(code, "`ends` is before `starts`");
    return p as unknown as Promotion;
  });
}

const promotions = validate(data);

export const promotionsNote: string | undefined = isText((data as { note?: unknown }).note)
  ? (data as { note: string }).note
  : undefined;

/** From midnight at the shop on `starts` until midnight at the end of `ends`, London time. */
export function promotionWindow(p: Promotion): PromotionWindow {
  return [londonMidnight(p.starts), londonMidnight(p.ends, 1)];
}

export function windowActive([start, end]: PromotionWindow, now = Date.now()) {
  return start <= now && now < end;
}

/**
 * Promotions worth putting in the HTML: marked live and not yet over when the site is built.
 * One that starts later is included and stays hidden until its day (PromoGate).
 */
export function upcomingPromotions(now = Date.now()) {
  return promotions.filter((p) => p.status === "live" && now < promotionWindow(p)[1]);
}

/** Whether any promotion is on: the section on the home page and the hero's link to it. */
export function promotionsGate(now = Date.now()) {
  const windows = upcomingPromotions(now).map(promotionWindow);
  return { windows, initiallyActive: windows.some((w) => windowActive(w, now)) };
}
