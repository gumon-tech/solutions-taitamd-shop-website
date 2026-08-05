import { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact & Location in King's Cross",
  description: "Contact Taitam-D Beauty & Spa in King's Cross, London. Find our address, opening hours and WhatsApp booking details.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Location in King's Cross",
    description: "Contact Taitam-D Beauty & Spa in King's Cross, London. Find our address, opening hours and WhatsApp booking details.",
    url: "/contact",
    images: ["/images/contact/storefront-21x9-1680x720.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 pb-14 md:pb-12">
      <Contact />
      <div className="h-24" />
    </main>
  );
}
