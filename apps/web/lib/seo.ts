import type { Metadata } from "next";

export const BASE_URL = "https://figurinhafacil.com.br";
export const SITE_NAME = "Figurinha Fácil";

// Generate combined schema using @graph pattern for AEO optimization
export function generateCombinedSchema(schemas: Record<string, unknown>[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas.map((schema) => {
      // Remove @context from individual schemas when using @graph
      const { "@context": _context, ...rest } = schema as {
        "@context"?: string;
      };
      void _context;
      return rest;
    }),
  };
}

// Schema Generators - return plain objects for JSON-LD
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    description:
      "Plataforma de troca de figurinhas colecionáveis. Conectamos colecionadores em todo o Brasil.",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    sameAs: [
      "https://instagram.com/figurinhafacil",
      "https://facebook.com/figurinhafacil",
      "https://twitter.com/figurinhafacil",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description:
      "A maior rede de troca de figurinhas do Brasil. Encontre colecionadores perto de você.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateSportsEventSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Copa do Mundo FIFA 2026",
    alternateName: "FIFA World Cup 2026",
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    eventStatus: "https://schema.org/EventScheduled",
    sport: "Association Football",
    location: [
      {
        "@type": "Country",
        name: "Estados Unidos",
        address: { "@type": "PostalAddress", addressCountry: "US" },
      },
      {
        "@type": "Country",
        name: "México",
        address: { "@type": "PostalAddress", addressCountry: "MX" },
      },
      {
        "@type": "Country",
        name: "Canadá",
        address: { "@type": "PostalAddress", addressCountry: "CA" },
      },
    ],
    organizer: {
      "@type": "Organization",
      name: "FIFA",
      url: "https://www.fifa.com",
    },
  };
}

export function generatePlaceSchema(
  name: string,
  city: string,
  state: string,
  lat?: number,
  lng?: number
) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Place",
    name,
    description: `Ponto de troca de figurinhas em ${city}, ${state}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "BR",
    },
  };

  if (lat && lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: lat,
      longitude: lng,
    };
  }

  return schema;
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ title: string; description: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

// Metadata Helpers
export function generateCityMetadata(
  cityName: string,
  citySlug: string,
  state: string
): Metadata {
  const title = `Troca de Figurinhas em ${cityName} | ${SITE_NAME}`;
  const description = `Encontre colecionadores e pontos de troca de figurinhas em ${cityName}, ${state}. Troque suas figurinhas repetidas e complete seu álbum.`;

  return {
    title,
    description,
    keywords: [
      `figurinhas ${cityName}`,
      `troca de figurinhas ${cityName}`,
      `colecionadores ${cityName}`,
      `pontos de troca ${cityName}`,
      `álbum de figurinhas ${cityName}`,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/cidade/${citySlug}`,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/cidade/${citySlug}`,
    },
  };
}

export function generateTradePointMetadata(
  pointName: string,
  pointSlug: string,
  city: string,
  state: string
): Metadata {
  const title = `${pointName} - Ponto de Troca em ${city}`;
  const description = `Ponto de troca de figurinhas "${pointName}" em ${city}, ${state}. Veja horários, localização e como participar das trocas.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/ponto/${pointSlug}`,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/ponto/${pointSlug}`,
    },
  };
}

