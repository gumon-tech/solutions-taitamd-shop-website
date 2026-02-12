import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),

  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },

  description: SITE.description,

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
    "Treatwell",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    images: ["/TAITAMD-OG-facebook-product-1200x630.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/TAITAMD-OG-x-product-1200x675.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E6"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-wrap min-h-screen">
        <div className="gridlines" aria-hidden />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
