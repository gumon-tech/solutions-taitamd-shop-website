import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

/**
 * The site shipped with no web font at all until 2026-09-11 — every heading was the browser's
 * system UI face, which on a Mac is the typeface Apple ships for application chrome. At 72px
 * on a spa's home page that reads as a dashboard, and it was the largest single reason the
 * owner said the site felt like an academic paper rather than a beauty business (Q-SHOP-033).
 *
 * next/font downloads these at build time and serves them from our own origin, so no request
 * reaches Google when a visitor opens the page. That matters here beyond speed: this site
 * publishes a cookie register that has to stay true, and a third-party font request is one
 * more thing that would have to appear in it.
 *
 * Two faces, deliberately. Cormorant Garamond is a high-contrast serif — the thing that makes
 * a page read as considered rather than assembled — but its small x-height makes it a poor
 * choice for body text, so it is display only. Inter carries everything that has to be read
 * rather than admired. Weights are kept to three in total, because each one is a download.
 */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
import { SITE } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import Analytics from "@/components/Analytics";

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
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-wrap min-h-screen">
        <StructuredData />
        <div className="gridlines" aria-hidden />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
