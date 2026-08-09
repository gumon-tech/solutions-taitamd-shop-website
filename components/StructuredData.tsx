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
        // The city goes in addressLocality; King's Cross is a district, and naming it here
        // left the town field saying something no postal system uses. It still reaches
        // readers through areaServed and the copy. Values confirmed by Marketing (Q-MKT-002).
        addressLocality: "London",
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
      // One entry, on purpose. `sameAs` is a claim that a channel is us, so an unverified
      // entry is worse than a missing one. Instagram has no linked business account yet and
      // the old Google Maps value was a `?q=<address>` search, not a Business Profile —
      // neither identifies anything. Marketing adds the rest as each is confirmed (Q-MKT-002).
      sameAs: [SITE.social.facebook],
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
