import Hero from "@/components/Hero";
import LuxeBento from "@/components/LuxeBento";
import ServicesPreview from "@/components/ServicesPreview";
import Gallery from "@/components/Gallery";
import Awards from "@/components/Awards";
import LocationBlock from "@/components/LocationBlock";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8">
      <Hero />
      <LuxeBento />
      <ServicesPreview />
      <Gallery />
      <Awards />
      <LocationBlock />
      <CTA />
    </main>
  );
}
