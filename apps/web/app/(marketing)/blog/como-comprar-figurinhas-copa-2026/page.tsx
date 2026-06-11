import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  Truck,
  Clock,
  DollarSign,
  MapPin,
  Smartphone,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  BASE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/blog/como-comprar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-06-11T10:00:00Z";
const MODIFIED_AT = "2026-06-11T10:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Comprar Figurinhas da Copa 2026: Melhor Preço, Frete Rápido e Dicas de Ouro",
  description:
    "Guia completo: onde comprar figurinhas da Copa 2026, preços em diferentes lojas (iFood, Amazon, Panini, Mercado Livre), entregas rápidas e estratégias para economizar. Comparação de opções e dicas do colecionador.",
  keywords: [
    "como comprar figurinhas Copa 2026",
    "onde comprar figurinhas Copa 2026",
    "figurinhas Copa 2026 Amazon",
    "figurinhas Copa 2026 iFood",
    "figurinhas Copa 2026 Mercado Livre",
    "preço figurinhas Copa 2026",
    "melhor lugar comprar figurinhas Copa",
    "figurinhas Copa 2026 Panini",
    "pacotinhos Copa 2026 comprar",
    "frete figurinhas Copa 2026",
  ],
  openGraph: {
    title: "Como Comprar Figurinhas da Copa 2026: Guia Completo de Lojas e Preços",
    description:
      "Onde comprar figurinhas da Copa 2026 com melhor preço e frete rápido. Comparação entre Amazon, iFood, Panini e Mercado Livre.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Comprar Figurinhas",
      "Guia de Compras",
      "Panini",
      "E-commerce",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Comprar Figurinhas da Copa 2026: Preços e Lojas",
    description:
      "Guia completo para comprar figurinhas da Copa 2026 com melhor preço e frete rápido.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é o melhor lugar para comprar figurinhas da Copa 2026?",
    answer:
      "Depende da sua prioridade. Se você quer frete rápido (até 10 minutos), iFood é a escolha. Para melhor preço e variedade, Amazon e Mercado Livre competem bem. Para álbum de capa dura edição limitada, a Panini oficial garante autenticidade. A maioria dos colecionadores usa 2-3 plataformas para aproveitar promoções de cada uma.",
  },
  {
    question: "Quanto custa comprar um pacotinho de figurinhas em cada loja?",
    answer:
      "O pacotinho custa R$ 7,00 em quase todas as lojas. Mas compare frete e promoções: iFood não cobra frete se comprar em quantidade, Amazon Prime oferece frete grátis, Mercado Livre tem sellers variados. Um pacotinho sai de R$ 7,00 a R$ 10,00 contando frete, dependendo da plataforma e quantidade.",
  },
  {
    question: "iFood entrega figurinhas da Copa 2026 em 10 minutos mesmo?",
    answer:
      "Sim, em áreas onde a cobertura é total. Mas isso varia por cidade e disponibilidade. Em alguns bairros, o tempo é 10-20 minutos. Em outros, não há cobertura. Verifique seu endereço direto no app iFood antes de contar com essa agilidade.",
  },
  {
    question: "Vale a pena comprar álbum de capa dura na internet?",
    answer:
      "Sim, se vem bem embalado. Capa dura de R$ 49,90 em supermercado sai de R$ 39,90 a R$ 44,90 na Amazon ou Mercado Livre. O risco é chegar amassado. Procure sellers com boas avaliações e foto da embalagem. Para edições especiais (Capa Ouro a R$ 79,90), é até mais seguro comprar online porque menos lojas físicas tem em estoque.",
  },
  {
    question: "Posso comprar figurinhas de diferentes sellers no Mercado Livre?",
    answer:
      "Sim, mas cada seller faz um envio. Isso aumenta o frete total. Melhor é achar um seller com bastante estoque e comprar tudo dele. Use o filtro 'Envios Combinados' para economizar em frete. Antes de comprar, leia avaliações e veja se o seller tem foto dos produtos reais.",
  },
  {
    question: "Quando sai o álbum da Copa 2026 na versão em capa dura ouro?",
    answer:
      "As edições especiais (Capa Prata e Capa Ouro) já estão disponíveis desde maio de 2026. Mas estoques são limitados. Se quer garantir uma Capa Ouro antes de faltar, compre já. Edições especiais tendem a ficar caras ou indisponíveis conforme a Copa se aproxima.",
  },
  {
    question: "Figurinhas de app digital como MyPanini valem a pena?",
    answer:
      "Sim, mas para complementar, não substituir. O app MyPanini da Panini oferece figurinhas digitais personalizadas (R$ 84,50 por 10 com sua foto) e permite trocas no formato digital. Legal para quem quer algo único, mas o álbum físico é a experiência completa da coleção tradicional.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Como Comprar Figurinhas da Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Como Comprar Figurinhas da Copa 2026: Melhor Preço, Frete Rápido e Dicas de Ouro",
  description:
    "Guia completo sobre onde comprar figurinhas da Copa 2026: preços em iFood, Amazon, Panini, Mercado Livre, entregas rápidas e estratégias para economizar.",
  image: `${BASE_URL}/opengraph-image`,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
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
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": ARTICLE_URL,
  },
  keywords: [
    "como comprar figurinhas Copa 2026",
    "onde comprar figurinhas Copa 2026",
    "figurinhas Copa iFood",
    "figurinhas Copa Amazon",
    "preço figurinhas Copa 2026",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const shoppingPlaces = [
  {
    icon: Zap,
    name: "iFood",
    highlight: "Frete Rápido",
    description: "Entrega em até 10 minutos em áreas cobertas",
    features: [
      "Entrega ultra-rápida (10-20 min)",
      "Sem taxa de frete acima de R$ 50",
      "App fácil de usar",
      "Cupons e promoções frequentes",
      "Cobertura limitada por bairro",
    ],
    icon_color: "text-[var(--secondary)]",
  },
  {
    icon: ShoppingCart,
    name: "Amazon",
    highlight: "Prime Fast",
    description: "Melhor para compra com frete grátis",
    features: [
      "Amazon Prime: frete grátis",
      "Variedade de edições",
      "Preços competitivos",
      "Entrega em 1-2 dias",
      "Ótima política de devolução",
      "Parcelamento em até 12x",
    ],
    icon_color: "text-[var(--primary)]",
  },
  {
    icon: MapPin,
    name: "Loja Panini Oficial",
    highlight: "Autenticidade",
    description: "Direto do fabricante com edições exclusivas",
    features: [
      "Edições limitadas e especiais",
      "Garantia de autenticidade",
      "Preço oficial sem variação",
      "Frete pago separado",
      "Às vezes com brindes",
    ],
    icon_color: "text-[var(--secondary)]",
  },
  {
    icon: DollarSign,
    name: "Mercado Livre",
    highlight: "Melhor Negociação",
    description: "Sellers variados com preços competitivos",
    features: [
      "Muitos sellers = melhor concorrência",
      "Filtro por preço e frete",
      "Proteção ao comprador",
      "Cupons de desconto",
      "Cuidado com falsificações",
      "Varia bastante de um seller para outro",
    ],
    icon_color: "text-[var(--primary)]",
  },
  {
    icon: Smartphone,
    name: "Shopee",
    highlight: "Promoções Diárias",
    description: "Flash sales e cupons o tempo todo",
    features: [
      "Cupons e descontos em flash",
      "Frete grátis em promoções",
      "Avaliação de compradores",
      "Cashback em algumas compras",
      "Entrega em 3-7 dias",
    ],
    icon_color: "text-[var(--secondary)]",
  },
  {
    icon: Truck,
    name: "Supermercados e Bancas",
    highlight: "Presencial",
    description: "Loja física perto de você",
    features: [
      "Sem surpresa de frete",
      "Pode inspecionar antes",
      "Promocões regionais",
      "Vê a edição na hora",
      "Estoques limitados localmente",
    ],
    icon_color: "text-[var(--primary)]",
  },
];

const priceComparison = [
  {
    item: "Pacotinho (7 figurinhas)",
    iFood: "R$ 7,00 + frete",
    Amazon: "R$ 7,00 + Prime (grátis)",
    Panini: "R$ 7,00 + frete",
    MercadoLivre: "R$ 7,00 a R$ 9,00",
  },
  {
    item: "Box com 30 pacotinhos",
    iFood: "R$ 210 + frete",
    Amazon: "R$ 189-200 + Prime",
    Panini: "R$ 210 + frete",
    MercadoLivre: "R$ 185-210",
  },
  {
    item: "Álbum Brochura",
    iFood: "R$ 24,90 + frete",
    Amazon: "R$ 19,90-24,90 + Prime",
    Panini: "R$ 24,90 + frete",
    MercadoLivre: "R$ 18,90-27,90",
  },
  {
    item: "Álbum Capa Dura",
    iFood: "Não vende",
    Amazon: "R$ 39,90-49,90 + Prime",
    Panini: "R$ 49,90 + frete",
    MercadoLivre: "R$ 35,90-55,00",
  },
  {
    item: "Álbum Capa Ouro",
    iFood: "Não vende",
    Amazon: "R$ 65-75 + Prime",
    Panini: "R$ 79,90 + frete",
    MercadoLivre: "R$ 70-89,90",
  },
];

const buyingTips = [
  {
    title: "Comece com pouco, troque depois",
    description:
      "Não compre 100 pacotinhos de uma vez. Compre 1-2 boxes, cadastre no Figurinha Fácil, troque com colecionadores locais. Economiza 60% em duplicadas.",
    icon: CheckCircle2,
  },
  {
    title: "Compare com cupom e promoção",
    description:
      "Use cupons de primeira compra (iFood: -R$ 10), cashback (Shopee) e flash sales. Uma mesma compra pode sair 15-20% mais barata com cupom.",
    icon: CheckCircle2,
  },
  {
    title: "Frete é o vilão, não ignore",
    description:
      "Um pacotinho sai R$ 7,00, mas com frete fica R$ 12,00. Sempre que possível, junte compras, use Prime ou aproveite iFood sem taxa de frete mínimo.",
    icon: CheckCircle2,
  },
  {
    title: "Álbum de capa dura: comprare com foto",
    description:
      "No Mercado Livre, insista em sellers que mostrem fotos reais do produto e embalagem. Capa dura amassada é decepção; valida a qualidade antes.",
    icon: CheckCircle2,
  },
  {
    title: "Evite panic buying antes da Copa",
    description:
      "Preços sobem e estoques diminuem conforme a Copa se aproxima (junho/julho). Compre já se quer melhor preço. Edições especiais rareia rápido.",
    icon: AlertCircle,
  },
];

export default function ComoComprarFigurinhasCopaPage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main
        id="main-content"
        className="pt-24 min-h-screen text-[var(--on-surface)]"
      >
        {/* Hero */}
        <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-[var(--outline)]"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--on-surface)] font-medium">
                Como Comprar Figurinhas da Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia de Compras
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Comprar Figurinhas da Copa 2026:{" "}
              <span className="text-gradient-primary">
                melhor preço, frete rápido e dicas de ouro
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Com buscas crescendo <strong>10.900%</strong> em 2026, compradores
              de figurinhas da Copa querem saber: <strong>onde comprar</strong>,{" "}
              <strong>qual o melhor preço</strong> e <strong>como economizar</strong>
              . Neste guia você descobre cada opção — iFood, Amazon, Panini,
              Mercado Livre e mais — com preços, fretes e estratégias reais.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 11/06/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section
          aria-labelledby="quick-facts-heading"
          className="mx-auto max-w-5xl px-4 sm:px-6 pb-8"
        >
          <h2 id="quick-facts-heading" className="sr-only">
            Resumo rápido de onde comprar
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader className="pb-2">
                <Zap className="h-5 w-5 text-[var(--secondary)] mb-2" />
                <CardDescription className="text-[10px] uppercase tracking-widest text-[var(--outline)]">
                  Frete mais rápido
                </CardDescription>
                <CardTitle className="text-lg font-[var(--font-headline)]">
                  iFood
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[var(--on-surface-variant)]">
                  10 minutos de entrega
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader className="pb-2">
                <DollarSign className="h-5 w-5 text-[var(--primary)] mb-2" />
                <CardDescription className="text-[10px] uppercase tracking-widest text-[var(--outline)]">
                  Melhor custo-benefício
                </CardDescription>
                <CardTitle className="text-lg font-[var(--font-headline)]">
                  Amazon Prime
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Frete grátis, fácil
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader className="pb-2">
                <MapPin className="h-5 w-5 text-[var(--secondary)] mb-2" />
                <CardDescription className="text-[10px] uppercase tracking-widest text-[var(--outline)]">
                  Maior variedade
                </CardDescription>
                <CardTitle className="text-lg font-[var(--font-headline)]">
                  Mercado Livre
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Muitos sellers
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Onde comprar figurinhas da Copa 2026: 6 opções exploradas
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Desde maio de 2026, quando a Panini começou a distribuir o álbum
              da Copa, o número de plataformas onde você pode comprar figurinhas
              explodiu. <strong>iFood, Amazon, Panini oficial, Mercado Livre,
              Shopee e supermercados</strong> — cada uma com uma estratégia
              diferente. Preços variam, fretes são distintos, promociones vêm e
              vão.
            </p>
            <p>
              Este guia compara cada opção. Você vai aprender o melhor lugar
              para comprar <strong>pacotinhos soltos</strong>, <strong>boxes
              lacrados</strong>, <strong>álbuns em diferentes capas</strong> e até{" "}
              <strong>figurinhas personalizadas digitais</strong>. Spoiler: não
              existe um único melhor — depende do que você prioriza (preço,
              velocidade, variedade, autenticidade).
            </p>
          </div>
        </section>

        {/* Where to buy cards */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            6 Lugares Onde Comprar Figurinhas da Copa 2026
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shoppingPlaces.map((place) => {
              const Icon = place.icon;
              return (
                <Card
                  key={place.name}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Icon
                        className={`h-6 w-6 ${place.icon_color}`}
                        aria-hidden="true"
                      />
                      <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                        {place.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{place.name}</CardTitle>
                    <CardDescription>{place.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {place.features.map((feature, i) => (
                        <li
                          key={i}
                          className="text-sm text-[var(--on-surface-variant)] flex items-start gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Price comparison */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Comparação de Preços por Plataforma
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)]">
            <table className="w-full text-sm">
              <thead className="border-b border-[var(--outline-variant)]/20 bg-[var(--surface-container)]">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-[var(--on-surface)]">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-[var(--on-surface)]">
                    iFood
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-[var(--on-surface)]">
                    Amazon
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-[var(--on-surface)]">
                    Panini
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-[var(--on-surface)]">
                    Mercado Livre
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceComparison.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[var(--outline-variant)]/10 hover:bg-[var(--surface-container)] transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-[var(--on-surface)]">
                      {row.item}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--on-surface-variant)]">
                      {row.iFood}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--on-surface-variant)]">
                      {row.Amazon}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--on-surface-variant)]">
                      {row.Panini}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--on-surface-variant)]">
                      {row.MercadoLivre}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--outline)] mt-4 max-w-3xl">
            Preços de referência de junho de 2026. Valores podem variar por
            cupom, promoção, frete e estoque. Amazon Prime oferece frete grátis
            em compras; outras plataformas variam. Sempre compare na hora da
            compra.
          </p>
        </section>

        {/* Buying tips */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            5 Dicas Para Economizar e Comprar Certo
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {buyingTips.map((tip, i) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={i}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`h-5 w-5 mt-1 flex-shrink-0 ${
                          tip.icon === AlertCircle
                            ? "text-[var(--error)]"
                            : "text-[var(--primary)]"
                        }`}
                        aria-hidden="true"
                      />
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--on-surface-variant)]">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Trading plug */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-gradient-to-br from-[var(--secondary-container)]/20 to-[var(--secondary-container)]/5 p-8 md:p-12">
            <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-4">
              Depois de Comprar: Troque Para Economizar Ainda Mais
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              Comprou pacotinhos? Perfeito. Agora vem o segredo de quem gasta
              menos: <strong>troque repetidas por figurinhas que faltam</strong>{" "}
              com colecionadores da sua cidade. Sem frete, sem taxa, presencial e
              seguro. O <strong>Figurinha Fácil</strong> conecta você
              automaticamente com match de troca — em poucos dias você economiza
              centenas de reais que seriam gastos em pacotinhos redundantes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-dim)] text-[var(--on-secondary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Cadastrar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/como-funciona">Ver Como Funciona</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl px-4 sm:px-6 py-12"
        >
          <h2
            id="faq-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8"
          >
            Perguntas Frequentes: Comprar Figurinhas da Copa 2026
          </h2>
          <div className="space-y-4">
            {FAQS.map((item) => (
              <Card
                key={item.question}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)]">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Compre Figurinhas da Copa 2026 Agora — E Troque Para Completar
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Você já sabe onde comprar. Agora aproveita as promoções de cada
              plataforma, compra com inteligência e troca com outros
              colecionadores perto de você para completar o álbum gastando menos
              da metade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar a Trocar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/blog">Voltar ao Blog</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
