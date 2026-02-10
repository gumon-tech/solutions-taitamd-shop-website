"use client";

import { SERVICE_CATEGORIES, SITE } from "@/lib/site";
import Reveal from "./Reveal";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ServicesGrid() {
  return (
    <section className="pb-8">
      <div className="grid lg:grid-cols-12 gap-6">
        {SERVICE_CATEGORIES.map((c, idx) => (
          <Reveal key={c.slug} delay={idx * 0.03} className="lg:col-span-6">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="glass rounded-2xl p-6 overflow-hidden relative"
            >
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-2xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rose/10 blur-2xl" />
              <div className="relative">
                <div className="text-xs tracking-[0.28em] uppercase text-mist">{c.title}</div>
                <div className="mt-2 text-2xl font-semibold">{c.subtitle}</div>

                <ul className="mt-5 grid sm:grid-cols-2 gap-2.5 text-sm text-mist">
                  {c.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-gold">✦</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <Link
                    href="/book"
                    className="btn-shine inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/12 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
                  >
                    Book this <ArrowUpRight className="h-4 w-4 text-gold" />
                  </Link>
                  <a href={SITE.treatwell} target="_blank" rel="noreferrer" className="text-xs text-mist hover:text-ink">
                    View pricing & availability on Treatwell
                  </a>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
