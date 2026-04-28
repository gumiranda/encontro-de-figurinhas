import type { Metadata } from "next";

export const BASE_URL = "https://figurinhafacil.com.br";
export const SITE_NAME = "Figurinha Fácil";

// Content Freshness - GEO optimization requires updates every 7-14 days
export const CONTENT_VERSION = "2026.04.28";
export const LAST_CONTENT_UPDATE = "2026-04-28T00:00:00Z";

export function getContentFreshnessHeaders() {
  return {
    "X-Content-Version": CONTENT_VERSION,
    "X-Last-Modified": LAST_CONTENT_UPDATE,
  };
}

export function generateFreshnessMetadata(): Partial<Metadata> {
  return {
    other: {
      "article:modified_time": LAST_CONTENT_UPDATE,
      "og:updated_time": LAST_CONTENT_UPDATE,
      "content-version": CONTENT_VERSION,
    },
  };
}

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
  const safeName = sanitizeForJsonLd(name);
  const safeCity = sanitizeForJsonLd(city);
  const safeState = sanitizeForJsonLd(state);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: safeName,
    description: `Ponto de troca de figurinhas em ${safeCity}, ${safeState}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: safeCity,
      addressRegion: safeState,
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
    title: { absolute: title },
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
    title: { absolute: title },
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

export function generateTeamMetadata(
  teamName: string,
  teamSlug: string,
  flagEmoji: string,
  stickerCount: number
): Metadata {
  const title = `Figurinhas ${teamName} ${flagEmoji} Copa 2026 | ${SITE_NAME}`;
  const description = `Encontre e troque figurinhas da seleção ${teamName} para a Copa do Mundo 2026. São ${stickerCount} figurinhas da ${teamName}. Veja quais você precisa e encontre quem tem.`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `figurinhas ${teamName}`,
      `figurinhas ${teamName} copa 2026`,
      `troca figurinhas ${teamName}`,
      `álbum copa 2026 ${teamName}`,
      `seleção ${teamName} figurinhas`,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/selecao/${teamSlug}`,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/selecao/${teamSlug}`,
    },
  };
}

export function generateSportsTeamSchema(
  teamName: string,
  teamCode: string,
  stickerRange: { start: number; end: number }
) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: `Seleção ${teamName}`,
    sport: "Association Football",
    memberOf: {
      "@type": "SportsOrganization",
      name: "FIFA",
    },
    event: {
      "@type": "SportsEvent",
      name: "Copa do Mundo FIFA 2026",
      startDate: "2026-06-11",
      endDate: "2026-07-19",
    },
    subjectOf: {
      "@type": "CollectionPage",
      name: `Figurinhas ${teamName} - Copa 2026`,
      description: `Coleção de figurinhas da seleção ${teamName} para o álbum da Copa do Mundo 2026. Números ${stickerRange.start} a ${stickerRange.end}.`,
      url: `${BASE_URL}/selecao/${teamCode.toLowerCase()}`,
    },
  };
}

export type StickerMetadataInput = {
  number: number;
  slug: string;
  displayLabel: string;
  teamName: string;
  flagEmoji: string;
  isGolden: boolean;
  isLegend: boolean;
  legendName?: string;
  playerName?: string;
  stickerType?: "escudo" | "player" | "team_photo" | "special";
};

export function generateStickerMetadata(input: StickerMetadataInput): Metadata {
  const {
    slug,
    displayLabel,
    teamName,
    flagEmoji,
    isGolden,
    isLegend,
    legendName,
    playerName,
    stickerType,
  } = input;

  // Use player name as primary identifier when available
  const primaryName = playerName ?? legendName;
  const specialLabel = isLegend && legendName
    ? ` - ${legendName}`
    : isGolden
      ? " (Dourada)"
      : "";

  // Title with player name for better SEO
  const title = primaryName
    ? `${primaryName} - Figurinha ${displayLabel} ${teamName} ${flagEmoji} | Copa 2026`
    : `Figurinha ${displayLabel} ${flagEmoji} ${teamName}${specialLabel} | Copa 2026`;

  // Type-specific descriptions
  const description = stickerType === "escudo"
    ? `Escudo oficial da ${teamName} - Figurinha ${displayLabel} do álbum Copa 2026. Troque com colecionadores.`
    : stickerType === "team_photo"
      ? `Foto do elenco da ${teamName} - Figurinha ${displayLabel} do álbum Copa 2026. Encontre para trocar.`
      : isLegend && legendName
        ? `Figurinha ${displayLabel} de ${legendName} da ${teamName} - uma das mais procuradas do álbum Copa 2026. Encontre quem tem e troque agora.`
        : isGolden
          ? `Figurinha dourada ${displayLabel} da ${teamName} para Copa 2026. Figurinha especial rara. Veja quem tem para trocar.`
          : playerName
            ? `${playerName} - Figurinha ${displayLabel} da ${teamName} no álbum Copa 2026. Encontre colecionadores para trocar.`
            : `Figurinha ${displayLabel} da ${teamName} para o álbum da Copa do Mundo 2026. Encontre colecionadores para trocar.`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `figurinha ${displayLabel}`,
      `figurinha ${displayLabel} copa 2026`,
      `figurinha ${teamName} ${displayLabel}`,
      ...(primaryName ? [`figurinha ${primaryName}`, primaryName] : []),
      ...(isGolden ? [`figurinha dourada ${displayLabel}`] : []),
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/figurinha/${slug}`,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/figurinha/${slug}`,
    },
  };
}

export type ProductSchemaInput = {
  number: number;
  displayLabel: string;
  teamName: string;
  isGolden: boolean;
  isLegend: boolean;
  legendName?: string;
  playerName?: string;
  stickerType?: "escudo" | "player" | "team_photo" | "special";
};

export function generateProductSchema(input: ProductSchemaInput) {
  const {
    displayLabel,
    teamName,
    isGolden,
    isLegend,
    legendName,
    playerName,
    stickerType,
  } = input;

  const primaryName = playerName ?? legendName;
  const specialLabel = isLegend && legendName
    ? ` - ${legendName}`
    : isGolden
      ? " (Dourada)"
      : "";

  const productName = primaryName
    ? `${primaryName} - Figurinha ${displayLabel} ${teamName}`
    : `Figurinha ${displayLabel} - ${teamName}${specialLabel}`;

  const description = stickerType === "escudo"
    ? `Escudo oficial da seleção ${teamName} no álbum Copa do Mundo 2026.`
    : stickerType === "team_photo"
      ? `Foto oficial do elenco da ${teamName} no álbum Copa do Mundo 2026.`
      : primaryName
        ? `Figurinha ${displayLabel} de ${primaryName} da seleção ${teamName} para o álbum da Copa do Mundo 2026.`
        : `Figurinha ${displayLabel} da seleção ${teamName} para o álbum da Copa do Mundo 2026.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description,
    category: "Figurinhas Colecionáveis",
    brand: {
      "@type": "Brand",
      name: "Panini",
    },
    isRelatedTo: {
      "@type": "SportsEvent",
      name: "Copa do Mundo FIFA 2026",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "BRL",
      price: "0",
      description: "Troca gratuita entre colecionadores",
    },
  };
}

function sanitizeForJsonLd(text: string): string {
  return text
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .trim();
}

export function generateStickerFAQSchema(
  displayLabel: string,
  teamName: string,
  playerName?: string
) {
  const safeName = playerName ? sanitizeForJsonLd(playerName) : null;
  const safeTeam = sanitizeForJsonLd(teamName);
  const safeLabel = sanitizeForJsonLd(displayLabel);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: safeName
          ? `Qual figurinha é ${safeName}?`
          : `O que é a figurinha ${safeLabel}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: safeName
            ? `${safeName} é a figurinha ${safeLabel} da ${safeTeam} no álbum oficial da Copa do Mundo 2026.`
            : `A figurinha ${safeLabel} pertence à seleção ${safeTeam} no álbum da Copa do Mundo 2026.`,
        },
      },
      {
        "@type": "Question",
        name: `Como conseguir a figurinha ${safeLabel}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Você pode trocar a figurinha ${safeLabel} com outros colecionadores no Figurinha Fácil. Cadastre-se gratuitamente e encontre quem tem para trocar.`,
        },
      },
    ],
  };
}

export function generateStateMetadata(
  stateName: string,
  stateSlug: string,
  citiesCount: number,
  collectorsCount: number
): Metadata {
  const title = `Troca de Figurinhas em ${stateName} | ${SITE_NAME}`;
  const description =
    collectorsCount > 0
      ? `Encontre ${collectorsCount} colecionadores em ${citiesCount} cidades de ${stateName}. Troque figurinhas da Copa 2026 perto de você.`
      : `Troque figurinhas da Copa 2026 em ${stateName}. ${citiesCount} cidades disponíveis para encontrar colecionadores.`;

  return {
    title: { absolute: title },
    description,
    keywords: [
      `figurinhas ${stateName}`,
      `troca de figurinhas ${stateName}`,
      `colecionadores ${stateName}`,
      `pontos de troca ${stateName}`,
      `álbum copa 2026 ${stateName}`,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/estado/${stateSlug}`,
      type: "website",
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/estado/${stateSlug}`,
    },
  };
}

export function generateStateSchema(stateName: string, stateSlug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "State",
    name: stateName,
    containedInPlace: {
      "@type": "Country",
      name: "Brasil",
    },
    subjectOf: {
      "@type": "WebPage",
      name: `Troca de Figurinhas em ${stateName}`,
      url: `${BASE_URL}/estado/${stateSlug}`,
    },
  };
}

export function generateBlogPostMetadata(
  title: string,
  slug: string,
  excerpt: string,
  coverImage?: string,
  seoTitle?: string,
  seoDescription?: string
): Metadata {
  const finalTitle = seoTitle || `${title} | Blog ${SITE_NAME}`;
  const finalDescription = seoDescription || excerpt;

  return {
    title: { absolute: finalTitle },
    description: finalDescription,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: `${BASE_URL}/blog/${slug}`,
      type: "article",
      ...(coverImage && { images: [{ url: coverImage }] }),
    },
    twitter: {
      card: coverImage ? "summary_large_image" : "summary",
      title: finalTitle,
      description: finalDescription,
      ...(coverImage && { images: [coverImage] }),
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${slug}`,
    },
  };
}

export function generateArticleSchema(
  title: string,
  slug: string,
  excerpt: string,
  publishedAt: number,
  updatedAt?: number,
  author?: { name: string; avatar?: string },
  coverImage?: string
) {
  const safeTitle = sanitizeForJsonLd(title);
  const safeExcerpt = sanitizeForJsonLd(excerpt);
  const safeAuthorName = author?.name ? sanitizeForJsonLd(author.name) : SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: safeTitle,
    description: safeExcerpt,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished: new Date(publishedAt).toISOString(),
    ...(updatedAt && { dateModified: new Date(updatedAt).toISOString() }),
    ...(coverImage && { image: coverImage }),
    author: {
      "@type": "Person",
      name: safeAuthorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.svg`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  };
}

export function generateBlogListMetadata(
  category?: string,
  page?: number
): Metadata {
  const title = category
    ? `${category} | Blog ${SITE_NAME}`
    : `Blog | ${SITE_NAME}`;
  const description = category
    ? `Artigos sobre ${category} para colecionadores de figurinhas. Dicas, novidades e guias.`
    : "Blog do Figurinha Fácil. Dicas de troca, novidades da Copa 2026 e guias para colecionadores.";

  const url = category
    ? `${BASE_URL}/blog/categoria/${category.toLowerCase()}`
    : `${BASE_URL}/blog`;

  return {
    title: {
      absolute: page && page > 1 ? `${title} - Página ${page}` : title,
    },
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    alternates: {
      canonical: url,
    },
  };
}

// Enhanced LocalBusiness Schema for Trade Points (GEO Optimized)
export function generateTradePointPlaceSchema(point: {
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  description?: string;
}) {
  const safeName = sanitizeForJsonLd(point.name);
  const safeCity = sanitizeForJsonLd(point.city);
  const safeState = sanitizeForJsonLd(point.state);
  const safeAddress = sanitizeForJsonLd(point.address.trim());
  const safeDescription = point.description
    ? sanitizeForJsonLd(point.description)
    : `Ponto de troca de figurinhas da Copa 2026 em ${safeCity}, ${safeState}.`;

  const postalAddress: Record<string, unknown> = {
    "@type": "PostalAddress",
    addressLocality: safeCity,
    addressRegion: safeState,
    addressCountry: "BR",
  };
  if (safeAddress.length > 0) {
    postalAddress.streetAddress = safeAddress;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": `${BASE_URL}/ponto/${point.slug}`,
    name: safeName,
    description: safeDescription,
    url: `${BASE_URL}/ponto/${point.slug}`,
    address: postalAddress,
    geo: {
      "@type": "GeoCoordinates",
      latitude: point.lat,
      longitude: point.lng,
    },
  };
}

export function generateCityItemListSchema(
  citySlug: string,
  cityName: string,
  points: Array<{ slug: string; name: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/cidade/${citySlug}#points`,
    name: `Pontos de troca em ${cityName}`,
    numberOfItems: points.length,
    itemListElement: points.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/ponto/${p.slug}`,
      name: p.name,
    })),
  };
}


// CollectionPage Schema for Album Page (GEO Optimized)
export function generateCollectionPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Álbum de Figurinhas Copa do Mundo 2026",
    description:
      "Coleção completa com 980 figurinhas do álbum oficial Panini da Copa do Mundo FIFA 2026. Inclui 68 figurinhas especiais metalizadas, 48 Legends e 20 Iconic Moments.",
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
    numberOfItems: 980,
    mainEntity: {
      "@type": "ProductCollection",
      name: "Figurinhas Copa 2026",
      brand: {
        "@type": "Brand",
        name: "Panini",
      },
      numberOfItems: 980,
    },
  };
}

// Hub Pages Metadata
export function generateCitiesHubMetadata(): Metadata {
  const title = `Cidades com Troca de Figurinhas | ${SITE_NAME}`;
  const description =
    "Encontre colecionadores de figurinhas da Copa 2026 em mais de 500 cidades brasileiras. Veja onde trocar figurinhas perto de você.";

  return {
    title: { absolute: title },
    description,
    keywords: [
      "cidades figurinhas",
      "onde trocar figurinhas",
      "troca de figurinhas brasil",
      "colecionadores perto de mim",
    ],
    openGraph: { title, description, url: `${BASE_URL}/cidades`, type: "website" },
    alternates: { canonical: `${BASE_URL}/cidades` },
  };
}

export function generateStatesHubMetadata(): Metadata {
  const title = `Estados com Troca de Figurinhas | ${SITE_NAME}`;
  const description =
    "Troque figurinhas da Copa 2026 em todos os 27 estados brasileiros. Encontre colecionadores e pontos de troca no seu estado.";

  return {
    title: { absolute: title },
    description,
    keywords: [
      "estados figurinhas",
      "troca de figurinhas por estado",
      "colecionadores brasil",
    ],
    openGraph: { title, description, url: `${BASE_URL}/estados`, type: "website" },
    alternates: { canonical: `${BASE_URL}/estados` },
  };
}

export function generateTeamsHubMetadata(): Metadata {
  const title = `Seleções da Copa 2026 - Todas as Figurinhas | ${SITE_NAME}`;
  const description =
    "Veja todas as 48 seleções do álbum da Copa do Mundo 2026. Encontre figurinhas douradas, lendas e complete sua coleção.";

  return {
    title: { absolute: title },
    description,
    keywords: [
      "seleções copa 2026",
      "figurinhas seleções",
      "times copa do mundo",
      "álbum copa 2026 seleções",
    ],
    openGraph: { title, description, url: `${BASE_URL}/selecoes`, type: "website" },
    alternates: { canonical: `${BASE_URL}/selecoes` },
  };
}

export function generateStickersHubMetadata(): Metadata {
  const title = `Todas as 980 Figurinhas da Copa 2026 | ${SITE_NAME}`;
  const description =
    "Lista completa das 980 figurinhas do álbum Copa do Mundo 2026. Encontre figurinhas douradas, lendas e raras. Troque com colecionadores.";

  return {
    title: { absolute: title },
    description,
    keywords: [
      "figurinhas copa 2026",
      "lista figurinhas copa",
      "figurinhas raras",
      "figurinhas douradas",
      "980 figurinhas",
    ],
    openGraph: { title, description, url: `${BASE_URL}/figurinhas`, type: "website" },
    alternates: { canonical: `${BASE_URL}/figurinhas` },
  };
}

export function generateTradePointsHubMetadata(): Metadata {
  const title = `Pontos de Troca de Figurinhas | ${SITE_NAME}`;
  const description =
    "Encontre pontos de troca de figurinhas da Copa 2026 perto de você. Shoppings, praças, escolas e eventos em todo o Brasil.";

  return {
    title: { absolute: title },
    description,
    keywords: [
      "pontos de troca figurinhas",
      "onde trocar figurinhas",
      "eventos troca figurinhas",
      "locais troca figurinhas",
    ],
    openGraph: { title, description, url: `${BASE_URL}/pontos`, type: "website" },
    alternates: { canonical: `${BASE_URL}/pontos` },
  };
}

// GEO-Optimized FAQs with Statistics (Princeton Method)
export const GEO_OPTIMIZED_FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 tem 980 figurinhas, sendo o maior da história. Desse total, 68 são figurinhas especiais com acabamento metalizado, incluindo as categorias Legend (48) e Iconic Moments (20). São 48 seleções participantes, com 20 figurinhas para cada time.",
  },
  {
    question: "Quanto custa completar o álbum da Copa 2026?",
    answer:
      "Para completar o álbum sem trocas, o custo estimado é de R$ 7.000 a R$ 8.000, considerando que cada pacote custa R$ 7 e vem com 7 figurinhas. Com trocas estratégicas, esse valor pode cair para R$ 1.500 a R$ 2.500. No Figurinha Fácil, você encontra colecionadores próximos para trocar gratuitamente.",
  },
  {
    question: "Onde trocar figurinhas da Copa 2026?",
    answer:
      "Você pode trocar figurinhas da Copa 2026 em pontos de troca cadastrados no Figurinha Fácil, que conecta colecionadores em mais de 100 cidades brasileiras. Praças, shoppings, livrarias e escolas também organizam eventos de troca presenciais.",
  },
  {
    question: "Como funciona a troca de figurinhas online?",
    answer:
      "No Figurinha Fácil, você cadastra suas figurinhas repetidas e faltantes. O sistema encontra automaticamente colecionadores próximos com matches perfeitos (você tem o que eles precisam e vice-versa). Você combina o encontro pelo WhatsApp e realiza a troca presencialmente.",
  },
  {
    question: "Quais são as figurinhas mais raras da Copa 2026?",
    answer:
      "As figurinhas mais raras são as 68 especiais metalizadas: 48 Legends (uma lenda por seleção, como Pelé para o Brasil) e 20 Iconic Moments (momentos históricos das Copas). A probabilidade de tirar uma Legend é de aproximadamente 1 em 50 pacotes.",
  },
];

// AEO-Optimized Speakable Schema (for voice assistants and AI)
export function generateSpeakableSchema(
  url: string,
  cssSelectors: string[] = ["h1", ".faq-answer", ".main-content"]
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };
}

// WebPage schema with mainContentOfPage for AEO
export function generateWebPageSchema(page: {
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  primaryImageOfPage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": page.url,
    url: page.url,
    name: page.name,
    description: page.description,
    isPartOf: {
      "@type": "WebSite",
      "@id": BASE_URL,
      name: SITE_NAME,
    },
    ...(page.datePublished && { datePublished: page.datePublished }),
    ...(page.dateModified && { dateModified: page.dateModified }),
    ...(page.primaryImageOfPage && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: page.primaryImageOfPage,
      },
    }),
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "ReadAction",
      target: page.url,
    },
  };
}

// ItemList schema for hub pages (AEO optimization)
export function generateItemListSchema(
  name: string,
  description: string,
  items: Array<{ name: string; url: string; description?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description && { description: item.description }),
    })),
  };
}


// Service schema for the platform
export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Figurinha Fácil - Plataforma de Troca de Figurinhas",
    description:
      "Plataforma gratuita que conecta colecionadores de figurinhas da Copa do Mundo 2026 em todo o Brasil. Cadastre suas figurinhas repetidas e faltantes, encontre matches automáticos e combine trocas presenciais.",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    serviceType: "Marketplace de Troca",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: BASE_URL,
      serviceType: "Web Application",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description: "Serviço 100% gratuito para colecionadores",
    },
  };
}


export function generateRareMetadata(
  teamName: string,
  teamSlug: string,
  flagEmoji: string,
  legendCount: number,
  goldenCount: number
): Metadata {
  const total = legendCount + goldenCount;
  const title = `Figurinhas Raras ${teamName} ${flagEmoji} Copa 2026 | ${SITE_NAME}`;
  const description = `As ${total} figurinhas raras da ${teamName} no álbum da Copa 2026: ${legendCount} lendas e ${goldenCount} douradas. Veja quais são, raridade e como trocar.`;
  return {
    title: { absolute: title },
    description,
    keywords: [
      `figurinhas raras ${teamName}`,
      `figurinhas raras ${teamName} copa 2026`,
      `figurinhas douradas ${teamName}`,
      `lendas ${teamName} copa 2026`,
      `troca figurinhas raras ${teamName}`,
    ],
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/raras/${teamSlug}`,
      type: "website",
    },
    twitter: { title, description },
    alternates: { canonical: `${BASE_URL}/raras/${teamSlug}` },
  };
}

export function generateRareCollectionSchema(
  teamName: string,
  teamSlug: string,
  legendNames: string[],
  goldenCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Figurinhas Raras ${teamName} - Copa 2026`,
    description: `Coleção das figurinhas raras (lendas e douradas) da seleção ${teamName} no álbum da Copa do Mundo 2026.`,
    url: `${BASE_URL}/raras/${teamSlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: BASE_URL,
    },
    about: {
      "@type": "SportsTeam",
      name: `Seleção ${teamName}`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: legendNames.length + goldenCount,
      itemListElement: [
        ...legendNames.map((name, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `Lenda: ${name}`,
        })),
        ...Array.from({ length: goldenCount }).map((_, i) => ({
          "@type": "ListItem",
          position: legendNames.length + i + 1,
          name: `Figurinha Dourada ${i + 1}`,
        })),
      ],
    },
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    description:
      "Plataforma gratuita para troca de figurinhas da Copa do Mundo 2026. Cadastre repetidas e faltantes, encontre colecionadores perto de você.",
    url: BASE_URL,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    featureList: [
      "Cadastro de figurinhas repetidas e faltantes",
      "Match automático com outros colecionadores",
      "Mapa de pontos de troca",
      "100% gratuito",
    ],
  };
}


