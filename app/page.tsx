import type { Metadata } from "next";
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
import ShopFaq from "@/components/ShopFaq";

// The home page states its own title rather than inheriting `title.default` from the
// layout (Q-MKT-077). `absolute` is what keeps the layout's "%s — Taitam-D Beauty & Spa"
// template from appending the brand a second time; the brand is already the last segment
// here. Every other page keeps the template, so this export changes one page only.
//
// The layout's `default` stays as it was: it is the fallback for any page that ships
// without a title of its own, and that job is not the home page's job.
export const metadata: Metadata = {
  title: {
    absolute: "Thai Massage & Beauty Spa in King's Cross, London | Taitam-D",
  },
};

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
      <ShopFaq id="home-faq" />
      <CTA />
    </main>
  );
}
