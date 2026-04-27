import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Zap,
  MapPin,
  TrendingUp,
  Award,
  ShoppingCart,
  Users,
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

const ARTICLE_PATH = "/blog/album-copa-do-mundo-2026-guia-completo";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-27T00:00:00Z";
const MODIFIED_AT = "2026-04-27T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas, Preços e Dicas",
  description:
    "Tudo sobre o álbum da Copa do Mundo 2026: 980 figurinhas de 48 seleções, preços das edições, como completar, estratégias de economia e onde comprar. Guia definitivo para colecionadores.",
  keywords: [
    "album copa 2026",
    "figurinhas copa do mundo 2026",
    "album copa do mundo 2026",
    "980 figurinhas copa 2026",
    "como completar album copa 2026",
    "preço album copa 2026",
    "figurinhas copa 2026 preço",
    "album copa 2026 48 seleções",
    "panini copa 2026",
    "album figurinhas copa",
  ],
  openGraph: {
    title: "Álbum Copa do Mundo 2026: Guia Completo com Tudo que Você Precisa Saber",
    description:
      "Descubra tudo sobre o álbum de figurinhas da Copa 2026: 980 figurinhas, 48 seleções, preços de todas as edições, estratégias para economizar e dicas de colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Coleção",
      "Panini",
      "Guia Completo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Álbum Copa 2026: 980 Figurinhas e Guia Completo para Colecionadores",
    description:
      "Tudo sobre o álbum da Copa 2026: preços, quantas figurinhas, como completar economicamente.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 possui 980 figurinhas ao total, sendo 68 delas figurinhas especiais ou brilhantes. Todas as 48 seleções que participarão da Copa têm representação no álbum.",
  },
  {
    question: "Qual é a data de lançamento do álbum Copa 2026?",
    answer:
      "O álbum da Copa 2026 foi lançado oficialmente em 1º de maio de 2026 pela Panini. Os pacotinhos com 7 figurinhas começaram a ser vendidos na mesma data em todo o Brasil.",
  },
  {
    question: "Quanto custa o álbum da Copa 2026?",
    answer:
      "O álbum brochura sai por R$ 24,90, o álbum clássico capa dura custa entre R$ 49,90 e R$ 79,90 (versões prata e ouro), e existe uma edição premium de R$ 359,90. Cada pacotinho com 7 figurinhas sai por R$ 7,00.",
  },
  {
    question: "Quantas páginas tem o álbum Copa 2026?",
    answer:
      "O álbum da Copa 2026 tem 112 páginas, mais a capa. Comparado com a edição 2022 que tinha 670 figurinhas, esta é uma edição bastante ampliada com quase 300 figurinhas a mais.",
  },
  {
    question: "Qual é a diferença entre as edições brochura e capa dura?",
    answer:
      "A edição brochura (R$ 24,90) é mais econômica e oferece proteção básica. A capa dura clássica (R$ 49,90-R$ 79,90) tem maior durabilidade e melhor acabamento. A diferença está na capa e proteção, mas o número de figurinhas para colar é o mesmo em todas.",
  },
  {
    question: "Quantas seleções estão representadas no álbum 2026?",
    answer:
      "O álbum da Copa 2026 apresenta todas as 48 seleções que participarão do torneio na Cidade do México. Isso é um aumento em relação às 32 seleções da Copa 2022, refletindo a expansão do torneio.",
  },
  {
    question: "Onde posso comprar o álbum Copa 2026?",
    answer:
      "O álbum e os pacotinhos da Copa 2026 estão disponíveis em: lojas Panini, Amazon Brasil, Mercado Livre, farmácias (Drogasil, Droga Raia), bancas de jornal, lojas de conveniência, supermercados e shopping centers.",
  },
  {
    question: "As figurinhas especiais ou brilhantes são mais raras?",
    answer:
      "Sim, as 68 figurinhas especiais ou brilhantes (cromadas) são consideravelmente mais raras de encontrar nos pacotinhos. Por isso, elas têm maior valor de troca e costumam ser completadas por último pelos colecionadores.",
  },
];

const albumEditions = [
  {
    name: "Brochura",
    price: "R$ 24,90",
    features: ["Capa mole", "Proteção básica", "Mais econômico", "112 páginas"],
    badge: "Mais acessível",
  },
  {
    name: "Capa Dura Clássica",
    price: "R$ 49,90 - R$ 79,90",
    features: ["Capa dura", "Maior durabilidade", "Acabamento premium", "Prata ou ouro"],
    badge: "Recomendado",
  },
  {
    name: "Edição Premium",
    price: "R$ 359,90",
    features: ["Capa especial premium", "Acabamento de luxo", "Limite limitado", "Colecionador"],
    badge: "Exclusivo",
  },
];

const figurinhasInfo = [
  {
    category: "Figurinhas Normais",
    count: "912",
    description: "Figurinhas comuns de cada seleção",
  },
  {
    category: "Figurinhas Especiais",
    count: "68",
    description: "Figurinhas brilhantes/cromadas (mais raras)",
  },
  {
    category: "Total",
    count: "980",
    description: "Todas as figurinhas do álbum",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Álbum Copa 2026: Guia Completo", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas, Preços e Dicas",
  description:
    "Guia definitivo sobre o álbum de figurinhas da Copa 2026 com informações completas sobre 980 figurinhas, 48 seleções, preços de todas as edições e estratégias para colecionadores.",
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
    "album copa 2026",
    "figurinhas copa do mundo 2026",
    "980 figurinhas",
    "48 seleções copa",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function AlbumCopaGuiaCompletoPage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main id="main-content" className="pt-24 min-h-screen text-[var(--on-surface)]">
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
                Álbum Copa 2026: Guia Completo
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Completo
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Álbum Copa do Mundo 2026:{" "}
              <span className="text-gradient-primary">
                Guia Completo com 980 Figurinhas, Preços e Dicas Essenciais
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Descubra tudo que você precisa saber sobre o álbum da Copa 2026:
              <strong> 980 figurinhas</strong> de <strong>48 seleções</strong>,
              preços de todas as edições, onde comprar e as melhores estratégias
              para completar sua coleção economicamente.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 27/04/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 10 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Figurinhas Totais", value: "980" },
              { label: "Figurinhas Especiais", value: "68" },
              { label: "Seleções Participantes", value: "48" },
              { label: "Páginas do Álbum", value: "112" },
            ].map((stat, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardContent className="pt-6 text-center">
                  <p className="text-xs uppercase tracking-widest text-[var(--outline)] mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-[var(--primary)]">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* What is the Album */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O Que é o Álbum da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O <strong>álbum da Copa do Mundo 2026</strong> é a coleção oficial
              de figurinhas produzida pela <strong>Panini</strong> para o
              torneio que acontecerá em junho e julho de 2026 nos Estados
              Unidos, México e Canadá.
            </p>

            <p>
              Com <strong>980 figurinhas</strong> no total, o álbum é
              significativamente maior que a edição anterior (2022 teve 670
              figurinhas). Essa ampliação reflete o aumento de{" "}
              <strong>48 seleções</strong> participantes, comparado com as 32
              seleções da Copa anterior.
            </p>

            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                Composição do Álbum
              </h3>
              <ul className="space-y-3 text-sm">
                {figurinhasInfo.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{item.category}</span>
                      <p className="text-xs text-[var(--on-surface-variant)]">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-[var(--primary)]">
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p>
              Das 980 figurinhas, <strong>68 são especiais ou brilhantes</strong>
              (cromadas), o que as torna mais raras e valiosas na hora de
              trocar. Completar o álbum significa colar todas as 980 figurinhas
              em suas 112 páginas.
            </p>
          </div>
        </section>

        {/* Album Editions */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Edições do Álbum e Preços
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {albumEditions.map((edition, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{edition.name}</CardTitle>
                    <Badge className="whitespace-nowrap text-xs">
                      {edition.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="rounded-lg bg-[var(--surface-container)]/50 p-3">
                    <p className="text-xs text-[var(--outline)] mb-1">Preço</p>
                    <p className="text-2xl font-bold text-[var(--primary)]">
                      {edition.price}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {edition.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
            <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
              Preço dos Pacotinhos
            </h3>
            <p className="text-lg font-bold text-[var(--primary)] mb-2">
              R$ 7,00
            </p>
            <p className="text-sm text-[var(--on-surface-variant)]">
              Cada pacotinho contém 7 figurinhas selecionadas aleatoriamente.
              Para completar as 980 figurinhas, você precisaria de
              aproximadamente 140 pacotes (R$ 980), mas na prática, devido às
              repetições, o custo é significativamente maior.
            </p>
          </div>
        </section>

        {/* How to Complete */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como Completar o Álbum da Copa 2026
          </h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                icon: ShoppingCart,
                title: "Adquira o álbum e comece com pacotes iniciais",
                desc: "Escolha uma edição de álbum (brochura, capa dura ou premium) e comece a comprar pacotinhos. Os primeiros pacotes costumam ter distribuição mais equilibrada.",
              },
              {
                step: 2,
                icon: MapPin,
                title: "Organize um sistema para rastrear figurinhas",
                desc: "Mantenha um registro das figurinhas que você tem e das que faltam. Você pode usar uma agenda, app ou o Figurinha Fácil para catalogar.",
              },
              {
                step: 3,
                icon: Users,
                title: "Comece a trocar com colecionadores",
                desc: "Procure por grupos de trocas nas redes sociais, escolinhas, shoppings ou use plataformas como Figurinha Fácil para encontrar colecionadores próximos.",
              },
              {
                step: 4,
                icon: TrendingUp,
                title: "Estabeleça uma estratégia de compra escalonada",
                desc: "Compre poucos pacotes por semana de forma consistente e concentre-se em trocas. Isso diversifica o risco e melhora a eficiência.",
              },
              {
                step: 5,
                icon: Award,
                title: "Finalize com figurinhas especiais",
                desc: "As figurinhas especiais (brilhantes) são mais raras. Deixe para completar essas no final quando terá muitas repetidas para oferecer em troca.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-[var(--primary)] text-[var(--on-primary)]">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="flex-grow pt-1">
                    <h3 className="font-semibold text-[var(--on-surface)] mb-2">
                      {item.step}. {item.title}
                    </h3>
                    <p className="text-[var(--on-surface-variant)] text-sm md:text-base">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Where to Buy */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Onde Comprar o Álbum e Pacotinhos da Copa 2026
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Lojas Panini oficiais",
              "Amazon Brasil",
              "Mercado Livre",
              "Farmácias (Drogasil, Droga Raia, Farmácia do Dr. Ahorro)",
              "Bancas de jornal",
              "Lojas de conveniência (7-Eleven, Polígono)",
              "Supermercados (Carrefour, Pão de Açúcar, Dia)",
              "Shopping centers",
            ].map((location, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[var(--primary)] flex-shrink-0" />
                    <p className="text-sm md:text-base">{location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Money Saving Tips */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Dicas para Economizar ao Completar o Álbum
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Zap,
                title: "Comece cedo",
                description:
                  "Quanto antes começar, mais tempo tem para fazer trocas eficientes antes de faltarem muitas figurinhas.",
              },
              {
                icon: Users,
                title: "Troque frequentemente",
                description:
                  "Não acumule figurinhas repetidas. Quanto mais rápido trocar, mais oportunidades surgem de encontrar matches.",
              },
              {
                icon: TrendingUp,
                title: "Use plataformas digitais",
                description:
                  "Ferramentas como Figurinha Fácil automatizam a busca por matches com colecionadores próximos, economizando tempo e dinheiro.",
              },
              {
                icon: Award,
                title: "Negocie bem",
                description:
                  "Figurinhas especiais têm maior valor. Guarde suas repetidas brilhantes para negociar figurinhas raras que faltam.",
              },
              {
                icon: Globe,
                title: "Participe de grupos",
                description:
                  "Entre em grupos de colecionadores no WhatsApp, Instagram e Facebook. Quanto mais gente, mais chances de encontrar matches.",
              },
              {
                icon: ShoppingCart,
                title: "Compre estrategicamente",
                description:
                  "Não compre muitos pacotes de uma só vez. Compre poucos por semana e varie as lojas para diversificar as figurinhas.",
              },
            ].map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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
            Perguntas Frequentes sobre o Álbum Copa 2026
          </h2>
          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm md:text-base">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Conteúdo Relacionado
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/blog/quanto-custa-completar-album-copa-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Quanto Custa Completar o Álbum?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Descubra o custo real com simulações de diferentes estratégias
                    e como economizar até 70% usando trocas inteligentes.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/como-funciona">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Como Funciona o Figurinha Fácil?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Aprenda como usar a plataforma para encontrar matches
                    automáticos e trocar figurinhas com colecionadores próximos.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
                Comece a Sua Coleção Hoje
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                O álbum da Copa 2026 já está à venda! Use o Figurinha Fácil para
                encontrar colecionadores com figurinhas que você precisa e
                complete sua coleção de forma eficiente e econômica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
                >
                  <Link href="/sign-up">
                    Começar Agora
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
                >
                  <Link href="/blog">Ler Outros Artigos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
