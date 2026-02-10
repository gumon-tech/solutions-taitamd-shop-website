import { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8">
      <Contact />
      <div className="h-24" />
    </main>
  );
}
