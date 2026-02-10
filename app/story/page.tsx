import { Metadata } from "next";
import Story from "@/components/Story";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Our Story"
};

export default function StoryPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8">
      <Story />
      <CTA />
      <div className="h-24" />
    </main>
  );
}
