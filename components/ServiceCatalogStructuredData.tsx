import { CATALOG } from "@/lib/catalog";
import { SITE } from "@/lib/site";

/**
 * Service markup belongs on the page that visibly lists the services. This makes
 * the entity graph useful to search engines and AI systems without inventing
 * prices, availability, outcomes, or treatments not shown to visitors.
 */
export default function ServiceCatalogStructuredData() {
  const businessId = `${SITE.baseUrl}/#business`;
  const catalogId = `${SITE.baseUrl}/services/#catalog`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": catalogId,
    name: "Taitam-D treatments and services",
    url: `${SITE.baseUrl}/services/`,
    itemListElement: CATALOG.map((category) => ({
      "@type": "OfferCatalog",
      name: category.title,
      description: category.blurb,
      itemListElement: category.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          ...(service.desc ? { description: service.desc } : {}),
          provider: { "@id": businessId },
          areaServed: { "@type": "Place", name: "King's Cross, London" },
        },
      })),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
