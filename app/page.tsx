import Hero from "@/components/Hero";
import LuxeBento from "@/components/LuxeBento";
import ServicesPreview from "@/components/ServicesPreview";
import Gallery from "@/components/Gallery";
import ShopTour from "@/components/ShopTour";
import Awards from "@/components/Awards";
import LocationBlock from "@/components/LocationBlock";
import CTA from "@/components/CTA";
import AcademyPromo from "@/components/AcademyPromo";
import Campaigns from "@/components/Campaigns";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <Hero />
      <Campaigns />
      <LuxeBento />
      <ServicesPreview />
      <Gallery />
      <ShopTour />
      <Awards />
      <AcademyPromo />
      <LocationBlock />
      <CTA />
    </main>
  );
}
