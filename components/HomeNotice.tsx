import Link from "next/link";
import PromoGate from "./PromoGate";
import { currentNotice, noticeWindow } from "@/lib/notice";
import { windowActive } from "@/lib/promotions";

// The one-line notice from data/notice.json, at the top of the home page. Renders nothing
// while the file says `{"notice": null}`.
export default function HomeNotice() {
  const n = currentNotice();
  if (!n) return null;
  const w = noticeWindow(n);
  return (
    <PromoGate windows={[w]} initiallyActive={windowActive(w)}>
      <p className="glass mt-4 rounded-2xl p-4 text-sm font-semibold text-ink">
        {n.text}
        {n.link && (
          <>
            {" "}
            <Link href={n.link} className="text-gold underline underline-offset-4">
              More
            </Link>
          </>
        )}
      </p>
    </PromoGate>
  );
}
