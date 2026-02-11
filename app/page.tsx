import Hero from "@/components/Hero";
import LuxeBento from "@/components/LuxeBento";
import ServicesPreview from "@/components/ServicesPreview";
import Gallery from "@/components/Gallery";
import Awards from "@/components/Awards";
import LocationBlock from "@/components/LocationBlock";
import CTA from "@/components/CTA";
import AcademyPromo from "@/components/AcademyPromo";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-28 pb-28 md:pb-16">
      <Hero />
      <LuxeBento />
      <ServicesPreview />
      <Gallery />
      <Awards />
      <AcademyPromo />
      <LocationBlock />
      <CTA />
    </main>
  );
}
