// app/sitemap.ts
import type { MetadataRoute } from "next";

// ✅ Required for `output: "export"` (static HTML export)
export const dynamic = "force-static";

import { SITE } from "@/lib/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? SITE.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep this deterministic for static export.
  const lastModified = new Date("2026-01-01T00:00:00.000Z");
  return [
    { url: `${SITE_URL}/`, lastModified },
    { url: `${SITE_URL}/services`, lastModified },
    { url: `${SITE_URL}/story`, lastModified },
    { url: `${SITE_URL}/contact`, lastModified },
  ];
}
