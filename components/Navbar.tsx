"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/story", label: "Our Story" },
  { href: "/contact", label: "Contact" }
];

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.22 });

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                className="
      h-11 w-11
      object-contain
      drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]
    "
              />

              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">{SITE.name}</div>
                <div className="text-[11px] text-mist tracking-[0.22em] uppercase">
                  {SITE.tagline}
                </div>
              </div>
            </Link>



            <nav className="hidden md:flex items-center gap-1">
              {nav.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className="px-3 py-2 rounded-xl text-sm text-mist hover:text-ink hover:bg-white/5 transition"
                >
                  {i.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/book"
                className="btn-shine inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/12 px-3.5 py-2 text-sm font-medium hover:bg-white/10 transition"
              >
                Book Now <ArrowUpRight className="h-4 w-4 text-gold" />
              </Link>
            </div>
          </div>

          {/* top progress (integrated) */}
          <div className="absolute left-0 right-0 bottom-0 h-[3px]">
            <motion.div
              style={{ scaleX }}
              className="h-full origin-left bg-[linear-gradient(90deg,rgba(215,181,109,0),rgba(215,181,109,0.75),rgba(127,163,138,0.65),rgba(215,181,109,0.85))]"
            />
            <div className="absolute inset-0 opacity-50 bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
          </div>
        </div>
      </div>
    </div>
  );
}
