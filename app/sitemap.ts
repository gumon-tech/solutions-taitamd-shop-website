// app/sitemap.ts
import type { MetadataRoute } from "next";

// ✅ Required for `output: "export"` (static HTML export)
export const dynamic = "force-static";

import { SITE } from "@/lib/site";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? SITE.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep this deterministic for static export.
  const lastModified = new Date("2026-08-05T00:00:00.000Z");
  // Trailing slashes are not cosmetic here: next.config.mjs sets
  // `trailingSlash: true`, so /services 301s to /services/ and the page's own
  // canonical points at the slashed form. Listing the unslashed URL would make
  // every entry in this file a redirect that disagrees with its canonical.
  return [
    { url: `${SITE_URL}/`, lastModified },
    { url: `${SITE_URL}/services/`, lastModified },
    { url: `${SITE_URL}/signature/`, lastModified },
    { url: `${SITE_URL}/story/`, lastModified },
    { url: `${SITE_URL}/contact/`, lastModified },
    { url: `${SITE_URL}/book/`, lastModified },
    { url: `${SITE_URL}/cookies/`, lastModified },
  ];
}
