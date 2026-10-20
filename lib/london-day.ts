// Calendar days as the shop experiences them, shared by everything on the site that turns
// itself on or off on a date. Promotions had this logic first; the careers vacancies needed
// the same thing, and a copy of it is exactly the kind of duplicate that drifts without
// anyone noticing, because a clock-change bug only shows up twice a year.

export const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** London's UTC offset in minutes at an instant (60 in BST, 0 in GMT). */
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

/**
 * Midnight at the shop at the start of a calendar day, as a UTC instant. `dayOffset` 1 gives
 * the midnight that ends the day. The clocks change at 01:00 or 02:00, never at midnight, so one
 * correction step lands on the right instant.
 */
export function londonMidnight(day: string, dayOffset = 0) {
  const [, y, m, d] = DAY.exec(day)!.map(Number);
  const guess = Date.UTC(y, m - 1, d + dayOffset);
  return guess - londonOffset(guess - londonOffset(guess) * 60000) * 60000;
}

/** True when `now` is inside [start, end). */
export function withinWindow([start, end]: [number, number], now: number) {
  return start <= now && now < end;
}
