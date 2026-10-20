import data from "@/data/promotions.json";
import { DAY, londonMidnight } from "./london-day";

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

function fail(code: string, why: string): never {
  throw new Error(`data/promotions.json: ${code}: ${why}`);
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

// `note` is optional, so read it once through a widened view of the file: casting the parsed
// JSON straight to `{ note: string }` only compiled while the file happened to carry the field,
// and stopped compiling the day it was taken out (2026-10-19). An empty string counts as no
// note, which is the shape KBOT's own `website_payload()` sends when nothing is running.
const note: unknown = (data as { note?: unknown }).note;

export const promotionsNote: string | undefined = isText(note) ? note : undefined;

/**
 * Two things the shape checks above cannot see, because they are about the calendar rather
 * than the file: an offer still marked `live` after its last day, and a note left behind once
 * the last offer has gone. Both are silent by design — the page simply stops showing them —
 * so nothing complained for the three days after the September offers ended on 16 October,
 * while `data/promotions.json` still called two of them live and the note still promised a
 * date that had passed. KBOT reads that file every three hours as the register of what is on,
 * so a stale `live` is wrong for the shop even when no visitor can see it (Q-KBOT-007).
 *
 * Running at import makes `next build` fail, which is where the other five file checks already
 * fail, and the message says what to change. A deploy is blocked until someone edits one line:
 * that is the point, since the quiet version of this cost three days.
 */
function auditCalendar(list: Promotion[], now: number) {
  const over = list.filter((p) => p.status === "live" && now >= promotionWindow(p)[1]);
  for (const p of over) {
    fail(p.code, `\`status\` is still "live" but the offer ended on ${p.ends} — set it to "ended"`);
  }
  if (isText(note) && !list.some((p) => p.status === "live" && now < promotionWindow(p)[1])) {
    fail("(file)", "`note` is still set while no offer is live — take the field out, or send \"\"");
  }
}

/** From midnight at the shop on `starts` until midnight at the end of `ends`, London time. */
export function promotionWindow(p: Promotion): PromotionWindow {
  return [londonMidnight(p.starts), londonMidnight(p.ends, 1)];
}

export function windowActive([start, end]: PromotionWindow, now = Date.now()) {
  return start <= now && now < end;
}

auditCalendar(promotions, Date.now());

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
