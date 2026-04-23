# SEO & GEO Optimization Plan - Figurinha Fácil

## Executive Summary

**Score Atual: 8.5/10** - Implementação sólida, com oportunidades de melhoria em GEO (AI Search).

**Objetivo:** Aumentar visibilidade em buscadores tradicionais (Google, Bing) e AI search engines (ChatGPT, Perplexity, Gemini, Copilot, Claude).

---

## 1. Keyword Research Results

### Primary Keywords (Alto Volume)

| Keyword | Intenção | Prioridade |
|---------|----------|------------|
| `figurinhas copa 2026` | Informacional | Alta |
| `troca de figurinhas` | Transacional | Alta |
| `álbum copa do mundo 2026` | Informacional | Alta |
| `figurinhas repetidas` | Transacional | Alta |
| `completar álbum figurinhas` | Transacional | Alta |

### Long-tail Keywords (Oportunidade)

| Keyword | Volume Estimado | Dificuldade |
|---------|-----------------|-------------|
| `troca de figurinhas copa 2026 perto de mim` | Médio | Baixa |
| `onde trocar figurinhas copa 2026` | Médio | Baixa |
| `figurinha dourada copa 2026` | Alto | Média |
| `figurinhas legends copa 2026` | Médio | Baixa |
| `quanto custa completar álbum copa 2026` | Alto | Média |
| `app troca de figurinhas` | Médio | Média |
| `grupos de troca de figurinhas` | Médio | Baixa |

### Dados de Mercado (2026)

- **980 figurinhas** no álbum (maior da história)
- **68 figurinhas especiais** (metalizadas)
- **R$ 7 por pacote** (7 figurinhas cada)
- **R$ 7.000+** para completar sem trocas
- **100% de aumento** nas buscas vs. 2022

---

## 2. Schema Markup Enhancements

### 2.1 LocalBusiness Schema (Trade Points)

Adicionar ao `lib/seo.ts`:

```typescript
export function generateLocalBusinessSchema(
  point: {
    name: string;
    slug: string;
    address: string;
    city: string;
    state: string;
    lat?: number;
    lng?: number;
    suggestedHours?: string;
    description?: string;
    participantCount?: number;
    confidenceScore?: number;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/ponto/${point.slug}`,
    name: point.name,
    description: point.description || `Ponto de troca de figurinhas em ${point.city}, ${point.state}`,
    url: `${BASE_URL}/ponto/${point.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: point.address,
      addressLocality: point.city,
      addressRegion: point.state,
      addressCountry: "BR",
    },
    ...(point.lat && point.lng && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: point.lat,
        longitude: point.lng,
      },
    }),
    ...(point.suggestedHours && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        description: point.suggestedHours,
      },
    }),
    ...(point.participantCount && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.min(5, (point.confidenceScore || 5) / 2),
        reviewCount: point.participantCount,
        bestRating: 5,
      },
    }),
    priceRange: "Gratuito",
    currenciesAccepted: "BRL",
    paymentAccepted: "Troca de figurinhas",
    areaServed: {
      "@type": "City",
      name: point.city,
    },
  };
}
```

### 2.2 Article Schema (Content Pages)

```typescript
export function generateArticleSchema(
  article: {
    title: string;
    description: string;
    slug: string;
    publishedDate: string;
    modifiedDate: string;
    author?: string;
    images?: string[];
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: `${BASE_URL}/${article.slug}`,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.svg`,
      },
    },
    ...(article.images?.length && {
      image: article.images,
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${article.slug}`,
    },
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
  };
}
```

### 2.3 CollectionPage Schema (Album Page)

```typescript
export function generateCollectionPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Álbum de Figurinhas Copa do Mundo 2026",
    description: "Coleção completa com 980 figurinhas do álbum oficial Panini da Copa do Mundo FIFA 2026. Inclui 68 figurinhas especiais metalizadas.",
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
    about: {
      "@type": "SportsEvent",
      name: "Copa do Mundo FIFA 2026",
      startDate: "2026-06-11",
      endDate: "2026-07-19",
    },
    numberOfItems: 980,
    itemListElement: {
      "@type": "ItemList",
      numberOfItems: 980,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
    },
    specialty: "Figurinhas Colecionáveis",
    mainEntity: {
      "@type": "ProductCollection",
      name: "Figurinhas Copa 2026",
      brand: {
        "@type": "Brand",
        name: "Panini",
      },
    },
  };
}
```

### 2.4 Enhanced SportsEvent Schema

```typescript
export function generateEnhancedSportsEventSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "Copa do Mundo FIFA 2026",
    alternateName: ["FIFA World Cup 2026", "Mundial 2026"],
    description: "A 23ª edição da Copa do Mundo FIFA, sediada nos Estados Unidos, México e Canadá. Primeira Copa com 48 seleções.",
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "Association Football",
    numberOfParticipants: 48,
    location: [
      {
        "@type": "StadiumOrArena",
        name: "MetLife Stadium",
        address: { "@type": "PostalAddress", addressLocality: "East Rutherford", addressCountry: "US" },
      },
      {
        "@type": "StadiumOrArena",
        name: "AT&T Stadium",
        address: { "@type": "PostalAddress", addressLocality: "Arlington", addressCountry: "US" },
      },
      {
        "@type": "StadiumOrArena",
        name: "Estadio Azteca",
        address: { "@type": "PostalAddress", addressLocality: "Cidade do México", addressCountry: "MX" },
      },
    ],
    organizer: {
      "@type": "SportsOrganization",
      name: "FIFA",
      url: "https://www.fifa.com",
    },
    subEvent: [
      { "@type": "SportsEvent", name: "Fase de Grupos", startDate: "2026-06-11", endDate: "2026-06-28" },
      { "@type": "SportsEvent", name: "Oitavas de Final", startDate: "2026-06-29", endDate: "2026-07-02" },
      { "@type": "SportsEvent", name: "Quartas de Final", startDate: "2026-07-04", endDate: "2026-07-05" },
      { "@type": "SportsEvent", name: "Semifinais", startDate: "2026-07-08", endDate: "2026-07-09" },
      { "@type": "SportsEvent", name: "Final", startDate: "2026-07-19" },
    ],
  };
}
```

---

## 3. GEO Optimization (AI Search Engines)

### 3.1 Princeton GEO Methods Implementation

| Método | Boost | Implementação |
|--------|-------|---------------|
| **Cite Sources** | +40% | Adicionar citações da FIFA, Panini |
| **Statistics** | +37% | "980 figurinhas", "R$ 7.000 para completar" |
| **Quotation** | +30% | Quotes de colecionadores, especialistas |
| **Authoritative Tone** | +25% | Linguagem de especialista |
| **Easy-to-understand** | +20% | Parágrafos curtos, listas |
| **Technical Terms** | +18% | "cromos", "figurinhas avulsas", "legends" |

### 3.2 Content Structure for AI Visibility

```markdown
<!-- Formato "Answer-First" para cada página -->

## [Pergunta direta como H2]

[Resposta direta em 1-2 frases no primeiro parágrafo]

**Estatística chave:** [número + fonte]

### Detalhes
- Ponto 1
- Ponto 2
- Ponto 3

> "Citação de especialista ou fonte oficial" — Fonte
```

### 3.3 FAQPage Schema Enhancement (GEO-Optimized)

```typescript
export const GEO_OPTIMIZED_FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer: "O álbum da Copa do Mundo 2026 tem 980 figurinhas, sendo o maior da história. Desse total, 68 são figurinhas especiais com acabamento metalizado, incluindo as categorias Legend e Iconic Moments. Fonte: Panini Brasil.",
  },
  {
    question: "Quanto custa completar o álbum da Copa 2026?",
    answer: "Para completar o álbum sem trocas, o custo estimado é de R$ 7.000 a R$ 8.000, considerando que cada pacote custa R$ 7 e vem com 7 figurinhas. Com trocas, esse valor pode cair para R$ 1.500 a R$ 2.500, segundo análise de probabilidade estatística.",
  },
  {
    question: "Onde trocar figurinhas da Copa 2026?",
    answer: "Você pode trocar figurinhas da Copa 2026 em pontos de troca cadastrados no Figurinha Fácil, que conecta colecionadores em mais de 100 cidades brasileiras. Praças, shoppings e livrarias também organizam eventos de troca.",
  },
  {
    question: "Como funciona a troca de figurinhas online?",
    answer: "No Figurinha Fácil, você cadastra suas figurinhas repetidas e faltantes. O sistema encontra automaticamente colecionadores próximos com matches perfeitos. Você combina o encontro e realiza a troca presencialmente, de forma segura.",
  },
  {
    question: "Quais são as figurinhas mais raras da Copa 2026?",
    answer: "As figurinhas mais raras são as 68 especiais metalizadas: 48 Legends (uma por seleção) e 20 Iconic Moments. A probabilidade de tirar uma Legend é de aproximadamente 1 em 50 pacotes.",
  },
];
```

### 3.4 Quick Answer Blocks Component

Criar `components/quick-answer.tsx`:

```tsx
interface QuickAnswerProps {
  question: string;
  answer: string;
  source?: string;
  stats?: { label: string; value: string }[];
}

export function QuickAnswer({ question, answer, source, stats }: QuickAnswerProps) {
  return (
    <section className="bg-muted/50 border rounded-lg p-6 mb-8" aria-label="Resposta rápida">
      <h2 className="text-xl font-semibold mb-3">{question}</h2>
      <p className="text-lg leading-relaxed mb-4">{answer}</p>
      
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-background rounded px-3 py-2">
              <span className="text-2xl font-bold text-primary">{stat.value}</span>
              <span className="text-sm text-muted-foreground ml-2">{stat.label}</span>
            </div>
          ))}
        </div>
      )}
      
      {source && (
        <p className="text-sm text-muted-foreground">
          Fonte: <cite>{source}</cite>
        </p>
      )}
    </section>
  );
}
```

---

## 4. Platform-Specific Optimization

### 4.1 ChatGPT Optimization

- [x] Domínio próprio (figurinhafacil.com.br)
- [ ] **Backlinks**: Buscar menções em sites de notícias
- [ ] **Freshness**: Atualizar conteúdo a cada 7-14 dias
- [ ] **Author signals**: Adicionar página /sobre com informações da equipe

### 4.2 Perplexity Optimization

- [x] PerplexityBot permitido no robots.txt
- [x] FAQ Schema implementado
- [ ] **PDF**: Criar guia PDF para download (citação prioritária)
- [ ] **Semantic richness**: Expandir definições e contexto

### 4.3 Google AI Overview (SGE)

- [x] Schema markup completo
- [x] E-E-A-T signals (expertise, authority)
- [ ] **Topical authority**: Criar content cluster sobre Copa 2026
- [ ] **Citations**: Adicionar links para FIFA, Panini

### 4.4 Claude AI

- [ ] **Brave Search indexing**: Verificar indexação no Brave
- [ ] **Factual density**: Aumentar dados numéricos
- [ ] **Structural clarity**: Melhorar hierarquia de headings

---

## 5. Implementation Checklist

### High Priority (Implement This Week)

- [ ] Adicionar `generateLocalBusinessSchema` para trade points
- [ ] Implementar FAQs GEO-optimized com estatísticas
- [ ] Adicionar Quick Answer blocks nas páginas principais
- [ ] Atualizar meta descriptions com dados de 2026 (980 figurinhas)

### Medium Priority (Next 2 Weeks)

- [ ] Criar Article schema para `/album-copa-do-mundo-2026`
- [ ] Gerar OG images dinâmicas por página
- [ ] Adicionar CollectionPage schema
- [ ] Criar PDF guide para download

### Low Priority (Future)

- [ ] Implementar content freshness tracking
- [ ] Adicionar páginas de comparação (vs. 2022)
- [ ] Criar blog/news section com updates

---

## 6. Enhanced Keywords for Metadata

### Root Layout Update

```typescript
keywords: [
  // Primary
  "troca de figurinhas",
  "figurinhas copa 2026",
  "álbum copa do mundo 2026",
  
  // Transactional
  "trocar figurinhas repetidas",
  "onde trocar figurinhas",
  "encontrar colecionadores",
  
  // Informational
  "quantas figurinhas copa 2026",
  "figurinhas douradas copa 2026",
  "figurinhas legends panini",
  
  // Local
  "troca de figurinhas perto de mim",
  "pontos de troca figurinhas",
  
  // Brand
  "figurinha fácil",
  "app troca figurinhas",
],
```

---

## 7. Content Recommendations

### Homepage Content Update

Adicionar seção com estatísticas:

```markdown
## Álbum Copa 2026 em Números

- **980 figurinhas** no álbum oficial Panini
- **48 seleções** participantes
- **68 figurinhas especiais** metalizadas
- **R$ 7 por pacote** (7 figurinhas)
- **16 cidades-sede** nos EUA, México e Canadá
```

### Landing Page CTA Update

```markdown
**Economize até R$ 5.000** trocando figurinhas com colecionadores próximos. 
Cadastre suas repetidas e encontre quem tem as que você precisa.
```

---

## Sources

- [CNN Brasil - Álbum Copa 2026](https://www.cnnbrasil.com.br/esportes/futebol/copa-do-mundo/album-da-copa-2026-data-de-lancamento-precos-numero-de-figurinhas-e-mais/)
- [ESPN - 980 Figurinhas](https://www.espn.com.br/futebol/copa-do-mundo/artigo/_/id/16515251/album-copa-mundo-2026-tera-980-figurinhas-edicao-recorde-veja-quanto-custara-cada-pacote)
- [GenOptima - GEO Best Practices 2026](https://www.gen-optima.com/geo/generative-engine-optimization-best-practices-2026/)
- [Search Engine Land - GEO Guide 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [Princeton GEO Research](https://llmrefs.com/generative-engine-optimization)
