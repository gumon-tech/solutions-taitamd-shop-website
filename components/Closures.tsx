import PromoGate from "./PromoGate";
import { closureLine, closureWindow, upcomingClosures } from "@/lib/closures";
import { windowActive } from "@/lib/promotions";

// The closure days from data/closures.json, listed under the opening hours (a day with special
// hours instead of closed reads "Open ..., 12:00 PM – 6:00 PM — label"). Renders nothing
// while the file is empty, so the page is unchanged until a closure is added.
export default function Closures({ className = "" }: { className?: string }) {
  const now = Date.now();
  const list = upcomingClosures(now);
  if (!list.length) return null;
  return (
    <PromoGate windows={list.map(closureWindow)} initiallyActive={list.some((c) => windowActive(closureWindow(c), now))}>
      <ul className={className}>
        {list.map((c) => (
          <PromoGate key={c.code} windows={[closureWindow(c)]} initiallyActive={windowActive(closureWindow(c), now)}>
            <li>{closureLine(c)}</li>
          </PromoGate>
        ))}
      </ul>
    </PromoGate>
  );
}
