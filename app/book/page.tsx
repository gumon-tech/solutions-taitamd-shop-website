import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function BookPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
      <div className="pt-8 md:pt-12">
        <div className="overflow-hidden rounded-[32px] border border-[#d6c198] bg-[#f5efe3] text-[#183b2d] shadow-[0_24px_60px_rgba(12,51,30,0.22)]">
          <div className="grid lg:grid-cols-[1fr_390px]">
            <div className="p-7 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#95743a]">WhatsApp booking</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-6xl">Book a little <span className="text-[#a37d37]">time for you.</span></h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#5b6d62] md:text-base">Message TaiTam-D directly for availability, treatment advice and our current comeback offers. We’ll help you find the right ritual and time.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href={SITE.whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#183d2d] px-5 py-3.5 text-sm font-semibold text-[#f7f3e9] transition hover:bg-[#25563e]"><MessageCircle className="h-4 w-4 text-[#d7b874]" /> Open WhatsApp <ArrowUpRight className="h-4 w-4 text-[#d7b874]" /></a><a href={buildWhatsAppLink("Hi TaiTam-D, I’d like to book a treatment. Please share availability and current offers.")} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cdb887] px-5 py-3.5 text-sm font-semibold text-[#345a45] transition hover:bg-white/60">Send a pre-filled message <ArrowUpRight className="h-4 w-4" /></a></div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#ebe3d4] p-4"><div className="text-[10px] uppercase tracking-[0.18em] text-[#927039]">Phone</div><div className="mt-2 text-sm font-semibold">{SITE.phone}</div></div><div className="rounded-2xl bg-[#ebe3d4] p-4"><div className="text-[10px] uppercase tracking-[0.18em] text-[#927039]">Hours</div><div className="mt-2 text-sm font-semibold">10:30am – 9pm</div></div><div className="rounded-2xl bg-[#ebe3d4] p-4"><div className="text-[10px] uppercase tracking-[0.18em] text-[#927039]">Location</div><div className="mt-2 text-sm font-semibold">King’s Cross</div></div></div>
            </div>
            <div className="flex flex-col items-center justify-center bg-[#1d4a36] p-7 text-center text-[#f7f3e9] md:p-10"><div className="text-xs uppercase tracking-[0.25em] text-[#e1c783]">Scan to connect</div><div className="mt-5 rounded-[26px] bg-white p-4 shadow-[0_18px_36px_rgba(0,0,0,0.22)]"><Image src={SITE.whatsappQr} alt="Scan to contact TaiTam-D on WhatsApp" width={380} height={380} className="h-auto w-[230px] rounded-xl" /></div><p className="mt-5 text-sm text-white/75">WhatsApp us from your phone</p><p className="mt-1 text-xs text-white/55">{SITE.whatsappDisplay}</p></div>
          </div>
        </div>
      </div>
    </main>
  );
}
