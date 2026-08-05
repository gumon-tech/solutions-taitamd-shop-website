import { SERVICE_CATEGORIES, SITE } from "@/lib/site";

const absolute = (path: string) => new URL(path, SITE.baseUrl).toString();

export default function StructuredData() {
  const businessId = `${SITE.baseUrl}/#business`;
  const websiteId = `${SITE.baseUrl}/#website`;

  const graph = [
    {
      "@type": ["BeautySalon", "HealthAndBeautyBusiness"],
      "@id": businessId,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE.baseUrl,
      logo: absolute(SITE.logo),
      image: absolute(SITE.image),
      description: SITE.description,
      telephone: `+${SITE.phone.startsWith("0") ? "44" + SITE.phone.slice(1) : SITE.phone}`,
      email: SITE.email,
      priceRange: SITE.priceRange,
      foundingDate: SITE.foundingDate,
      address: {
        "@type": "PostalAddress",
        streetAddress: "72-74 Caledonian Road",
        addressLocality: "King's Cross",
        addressRegion: "London",
        postalCode: "N1 9DN",
        addressCountry: "GB",
      },
      areaServed: ["King's Cross", "Islington", "London"],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "10:30",
          closes: "21:00",
        },
      ],
      sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.googleMaps],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Beauty and spa services",
        itemListElement: SERVICE_CATEGORIES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: `${service.title}: ${service.subtitle}.`,
            provider: { "@id": businessId },
            areaServed: { "@type": "Place", name: "King's Cross, London" },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE.baseUrl,
      name: SITE.name,
      description: SITE.description,
      publisher: { "@id": businessId },
      inLanguage: "en-GB",
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
