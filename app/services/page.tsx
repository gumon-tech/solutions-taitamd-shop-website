import { Metadata } from "next";
import ServicesGrid from "@/components/ServicesGrid";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Services"
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <header className="pt-8 md:pt-10 pb-10">
        <p className="text-xs tracking-[0.28em] uppercase text-mist">Service menu</p>
        <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-[1.05]">
          Everything you need — <span className="text-gold">crafted</span> with precision.
        </h1>
        <p className="mt-5 max-w-2xl text-mist">
          Browse categories and book online via Treatwell. We keep the site fast and focused — the booking engine does the heavy lifting.
        </p>
      </header>

      <ServicesGrid />
      <div className="h-12" />
      <CTA />
      <div className="h-20" />
    </main>
  );
}
