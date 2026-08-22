import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";
import LeadCapture from "@/components/LeadCapture";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),

  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },

  description: SITE.description,

  authors: [{ name: SITE.name, url: SITE.baseUrl }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Beauty and wellness",
  classification: "Beauty salon and spa in King's Cross, London",

  applicationName: SITE.name,

  keywords: [
    "massage",
    "thai massage",
    "beauty",
    "nails",
    "waxing",
    "facial",
    "King's Cross",
    "London",
    "WhatsApp booking",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE.baseUrl,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/TAITAMD-OG-x-product-1200x675.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#123A2B"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-wrap min-h-screen">
        <StructuredData />
        <div className="gridlines" aria-hidden />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <LeadCapture />
      </body>
    </html>
  );
}
