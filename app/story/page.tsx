import { Metadata } from "next";
import Story from "@/components/Story";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Our Story — Thai Beauty & Wellness Since 2009",
  description: "Discover the story behind Taitam-D Beauty & Spa, a founder-led Thai beauty and wellness house in King's Cross, London, established in 2009.",
  alternates: { canonical: "/story" },
  openGraph: {
    title: "Our Story — Thai Beauty & Wellness Since 2009",
    description: "Discover the story behind Taitam-D Beauty & Spa, a founder-led Thai beauty and wellness house in King's Cross, London, established in 2009.",
    url: "/story",
    images: ["/images/story/interior-1600x900.jpg"],
  },
};

export default function StoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <Story />
      <CTA />
      <div className="h-24" />
    </main>
  );
}
