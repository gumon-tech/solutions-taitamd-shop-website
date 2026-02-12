"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { ArrowUpRight, Menu, X, GraduationCap, Gift, PhoneCall } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/story", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.22 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // lock body scroll when menu is open (mobile)
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className={cn("mx-auto max-w-7xl px-5 md:px-8 pt-4", solid && "pt-3")}>
        <div
          className={cn(
            "glass relative overflow-hidden rounded-2xl px-4 md:px-5 py-3 transition-all",
            solid ? "shadow-glow" : "bg-transparent border-transparent backdrop-blur-0"
          )}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="TaiTam-D"
                width={44}
                height={44}
                priority
                className="h-11 w-11 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
              />

              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">{SITE.name}</div>
                <div className="text-[11px] text-mist tracking-[0.22em] uppercase">{SITE.tagline}</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="px-3 py-2 rounded-xl text-sm text-mist hover:text-ink hover:bg-ink/5 transition"
                >
                  {i.label}
                </Link>
              ))}
              <a
                href={SITE.academy}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl text-sm text-mist hover:text-ink hover:bg-ink/5 transition inline-flex items-center gap-2"
              >
                Academy <GraduationCap className="h-4 w-4 text-gold" />
              </a>
            </nav>

            <div className="flex items-center gap-2">
              {/* Desktop / larger phones */}
              <Link
                href="/book"
                className="hidden sm:inline-flex btn-shine items-center gap-2 rounded-xl bg-ink/5 border border-ink/12 px-3.5 py-2 text-sm font-medium hover:bg-ink/8 transition whitespace-nowrap"
              >
                Special Offer <ArrowUpRight className="h-4 w-4 text-gold" />
              </Link>

              {/* ✅ Small mobile: icon-only CTA so the hamburger never gets pushed off */}
              <Link
                href="/book"
                className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition"
                aria-label="Special Offer"
              >
                <ArrowUpRight className="h-5 w-5 text-gold" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-gold" />
              </button>
            </div>
          </div>

          {/* ✅ Mobile quick nav: visible, thumb-friendly */}
          <div className="mt-3 md:hidden grid grid-cols-2 gap-2">
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/90"
            >
              Services
            </Link>
            <a
              href={SITE.academy}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/90"
            >
              Academy
            </a>
          </div>

          {/* top progress */}
          <div className="absolute left-0 right-0 bottom-0 h-[3px]">
            <motion.div
              style={{ scaleX }}
              className="h-full origin-left bg-[linear-gradient(90deg,rgba(215,181,109,0),rgba(215,181,109,0.75),rgba(127,163,138,0.65),rgba(215,181,109,0.85))]"
            />
            <div className="absolute inset-0 opacity-50 bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed z-[70] left-0 right-0 top-0 mx-auto max-w-7xl px-5 md:px-8 pt-4"
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              <div className="glass rounded-2xl border border-ink/12 shadow-glow overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
                  <div className="text-sm font-semibold">Menu</div>
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5 text-gold" />
                  </button>
                </div>

                <div className="p-4 grid gap-2">
                  {nav.map((i) => (
                    <Link
                      key={i.href}
                      href={i.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-between rounded-2xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-4 py-3"
                    >
                      <span className="text-sm font-semibold">{i.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-gold" />
                    </Link>
                  ))}

                  <a
                    href={SITE.academy}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between rounded-2xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-4 py-3"
                  >
                    <span className="text-sm font-semibold">Academy</span>
                    <GraduationCap className="h-4 w-4 text-gold" />
                  </a>

                  <a
                    href={buildWhatsAppLink(SITE.whatsappTemplates.giftCard)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between rounded-2xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-4 py-3"
                  >
                    <span className="text-sm font-semibold">Gift Card (WhatsApp)</span>
                    <Gift className="h-4 w-4 text-gold" />
                  </a>

                  <a
                    href={buildWhatsAppLink("Hi TaiTam‑D, I have a quick question.")}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between rounded-2xl border border-ink/12 bg-ink/5 hover:bg-ink/8 transition px-4 py-3"
                  >
                    <span className="text-sm font-semibold">Chat on WhatsApp</span>
                    <PhoneCall className="h-4 w-4 text-gold" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
