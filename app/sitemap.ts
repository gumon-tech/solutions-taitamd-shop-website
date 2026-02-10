import { SITE } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const routes = ["", "/services", "/story", "/contact"].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date()
  }));
  return routes;
}
