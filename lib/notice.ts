import data from "@/data/notice.json";
import { DAY, londonMidnight } from "./london-day";
import { checkInternalPath, checkKeys, checkObject, checkText, failAt } from "./content-check";
import type { PromotionWindow } from "./promotions";

// One short line at the top of the home page (a temporary closure, a changed time). Fields and
// rules: data/NOTICE.md. `{"notice": null}` shows nothing. A malformed file throws, which stops
// `next build`. The line shows from midnight on `starts` until midnight at the end of `ends`
// (London time); the visitor's own clock decides on the day (PromoGate), as for promotions.

const FILE = "notice.json";

export type Notice = { code: string; text: string; starts: string; ends: string; link?: string };

function validate(raw: unknown): Notice | null {
  const root = checkObject(FILE, "(file)", raw);
  checkKeys(FILE, "(file)", root, ["notice"]);
  if (root.notice === null) return null;
  const o = checkObject(FILE, "notice", root.notice);
  checkKeys(FILE, "notice", o, ["code", "text", "starts", "ends", "link"]);
  const code = checkText(FILE, "notice.code", o.code, 40);
  const text = checkText(FILE, "notice.text", o.text, 200);
  for (const k of ["starts", "ends"]) {
    if (typeof o[k] !== "string" || !DAY.test(o[k] as string)) failAt(FILE, `notice.${k}`, "must be a date like 2026-12-24");
  }
  if ((o.ends as string) < (o.starts as string)) failAt(FILE, "notice", "`ends` is before `starts`");
  const link = o.link === undefined ? undefined : checkInternalPath(FILE, "notice.link", o.link);
  return { code, text, starts: o.starts as string, ends: o.ends as string, ...(link ? { link } : {}) };
}

const notice = validate(data);

export function noticeWindow(n: Notice): PromotionWindow {
  return [londonMidnight(n.starts), londonMidnight(n.ends, 1)];
}

/** The notice, if it is not over yet when the site is built (one that starts later stays hidden until its day). */
export function currentNotice(now = Date.now()) {
  return notice && now < noticeWindow(notice)[1] ? notice : null;
}
