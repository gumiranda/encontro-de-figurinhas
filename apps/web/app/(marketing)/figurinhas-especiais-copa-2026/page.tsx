import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Star,
  Target,
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
  generateCollectionPageSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/figurinhas-especiais-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-20T00:00:00Z";
const MODIFIED_AT = "2026-05-26T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Figurinhas Especiais e Legendárias da Copa 2026: Lista Completa, Raridade e Valor de Troca",
  description:
    "Guia completo das 68 figurinhas especiais, legendárias e brilhantes do álbum da Copa do Mundo 2026 da Panini. Descubra quais são, raridade, jogadores icônicos, capitães, bola oficial, troféu e qual o valor de troca entre colecionadores.",
  keywords: [
    "figurinhas especiais copa 2026",
    "figurinhas legendárias copa 2026",
    "figurinhas raras copa do mundo 2026",
    "figurinhas brilhantes copa 2026",
    "capitães seleções copa 2026",
    "figurinhas especiais panini 2026",
    "figurinhas craque copa 2026",
    "bola oficial copa 2026 figurinha",
    "troféu fifa 2026 figurinha",
    "valor troca figurinhas especiais",
    "como conseguir figurinhas raras copa 2026",
    "lista figurinhas especiais copa mundo 2026",
  ],
  openGraph: {
    title:
      "Figurinhas Especiais e Legendárias da Copa 2026: Raridade e Valor de Troca",
    description:
      "As 68 figurinhas especiais e brilhantes do álbum da Copa 2026: lista completa, jogadores icônicos, capitães, mascote e troféu FIFA.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas Especiais",
      "Panini",
      "Figurinhas Raras",
      "FIFA World Cup 2026",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Figurinhas Especiais e Legendárias da Copa 2026: Raridade e Valor",
    description:
      "Descubra as 68 figurinhas especiais do álbum da Copa 2026 e seu valor de troca.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas especiais tem o álbum da Copa 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 contém 68 figurinhas especiais com efeito brilhante. Elas representam cerca de 7% do total de 980 figurinhas e incluem jogadores icônicos, capitães, mascote, bola oficial e troféu da FIFA.",
  },
  {
    question: "Qual é a figurinha especial mais rara da Copa 2026?",
    answer:
      "As figurinhas especiais mais raras variam por padrão de distribuição, mas geralmente os capitães das seleções favoritas (Brasil, Argentina, França) e o troféu da FIFA têm maior demanda e valor de troca entre colecionadores.",
  },
  {
    question: "Como diferenciar figurinhas especiais de figurinhas normais?",
    answer:
      "As figurinhas especiais da Copa 2026 têm efeito brilhante e holográfico, com acabamento metalizado. Elas brilham de forma evidente quando expostas à luz, diferente das figurinhas base que têm acabamento fosco.",
  },
  {
    question: "Qual o valor de troca das figurinhas especiais da Copa 2026?",
    answer:
      "O valor de troca varia conforme a raridade e procura. Capitães e craques das seleções favoritas podem valer de 3 a 10 figurinhas normais. O troféu e mascote costumam ter maior valor. No Figurinha Fácil, o sistema ajusta automaticamente as trocas.",
  },
  {
    question: "Onde encontro a lista completa de figurinhas especiais da Copa 2026?",
    answer:
      "A Panini publica a lista oficial no app digital FIFA Panini. Você também encontra listas em comunidades de colecionadores, sites especializados e na seção de coleção do Figurinha Fácil, onde pode acompanhar quais já coleciona.",
  },
  {
    question: "É mais difícil conseguir figurinhas especiais comprando pacotinhos?",
    answer:
      "Sim. As figurinhas especiais têm distribuição menor nos pacotinhos, o que aumenta drasticamente o custo para consegui-las apenas comprando. Trocar com colecionadores que têm repetidas é muito mais eficiente e econômico.",
  },
  {
    question: "Qual a melhor estratégia para completar as figurinhas especiais?",
    answer:
      "Comece comprando pacotinhos até ter uma base sólida de figurinhas comuns. Depois, use a plataforma Figurinha Fácil para cadastrar as especiais que faltam e as que tem repetidas. A troca presencial com colecionadores da sua cidade é a forma mais eficiente.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Álbum da Copa 2026", url: `${BASE_URL}/album-copa-do-mundo-2026` },
  { name: "Figurinhas Especiais", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Figurinhas Especiais e Legendárias da Copa 2026: Lista Completa, Raridade e Valor de Troca",
  description:
    "Guia completo das 68 figurinhas especiais brilhantes do álbum da Copa do Mundo 2026 da Panini. Nomes icônicos, capitães, mascote, bola oficial e troféu FIFA.",
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
    "figurinhas especiais copa 2026",
    "figurinhas legendárias",
    "figurinhas raras",
    "panini",
    "fifa world cup 2026",
  ],
  inLanguage: "pt-BR",
};

const collectionPageSchema = generateCollectionPageSchema();

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  collectionPageSchema,
]);

const specialCategories = [
  {
    icon: Crown,
    title: "Capitães das Seleções",
    count: "48 figurinhas",
    description:
      "Todos os 48 capitães das seleções participantes da Copa 2026. Extremamente procurados, especialmente os capitães do Brasil, Argentina, França, Alemanha e Espanha.",
  },
  {
    icon: Star,
    title: "Craques Mundiais",
    count: "12 figurinhas",
    description:
      "Jogadores icônicos como Vinicius Jr., Mbappé, Haaland, Bellingham e outras estrelas do futebol mundial. As mais valiosas para troca.",
  },
  {
    icon: Trophy,
    title: "Símbolo da Copa",
    count: "3 figurinhas",
    description:
      "Troféu da FIFA, bola oficial e mascote oficial da Copa do Mundo 2026. Figurinhas especiais e muito disputadas.",
  },
  {
    icon: Zap,
    title: "Figurinhas Holográficas",
    count: "5 figurinhas",
    description:
      "Edições limitadas com efeito holográfico especial. Raramente aparecem em pacotinhos e têm valor de troca elevado.",
  },
];

const collectionTips = [
  {
    number: 1,
    title: "Entenda a raridade",
    description:
      "Nem toda figurinha especial tem o mesmo valor. Capitães de seleções fortes e craques mundiais são mais raros. Estude qual é a distribuição de raridade.",
  },
  {
    number: 2,
    title: "Priorize as trocas",
    description:
      "Comprar apenas pacotinhos para pegar especiais é economicamente inviável. Foque em acumular repetidas comuns para trocar por especiais com colecionadores.",
  },
  {
    number: 3,
    title: "Cadastre no Figurinha Fácil",
    description:
      "Registre todas as especiais que já tem e as que faltam na plataforma. O sistema encontra automaticamente colecionadores perto de você com matches compatíveis.",
  },
  {
    number: 4,
    title: "Participe de encontros",
    description:
      "Frequente pontos de troca públicos onde colecionadores se reúnem. Você consegue negociar especiais diretamente com outros fãs da Copa.",
  },
  {
    number: 5,
    title: "Deixe para o final",
    description:
      "Comece coletando figurinhas comuns. Depois de ter boa quantidade de repetidas, aí sim negocie agressivamente pelas especiais que faltam.",
  },
  {
    number: 6,
    title: "Acompanhe o mercado",
    description:
      "O valor de troca das especiais muda conforme colecionadores conseguem novos figurinhas. Entenda o mercado local antes de fazer trocas importantes.",
  },
];

const rareStickers = [
  {
    category: "Capitão do Brasil",
    description: "Tradicionalmente a figurinha especial mais procurada por brasileiros",
    rarity: "⭐⭐⭐⭐⭐",
  },
  {
    category: "Vinicius Jr.",
    description: "Craque em alta com grande demanda entre colecionadores",
    rarity: "⭐⭐⭐⭐⭐",
  },
  {
    category: "Mbappé",
    description: "Estrela mundial com figurinha especial bastante rara",
    rarity: "⭐⭐⭐⭐",
  },
  {
    category: "Troféu FIFA",
    description: "Figurinha especial com efeito holográfico único",
    rarity: "⭐⭐⭐⭐",
  },
  {
    category: "Mascote 2026",
    description: "Distribuição limitada, muito procurada por completistas",
    rarity: "⭐⭐⭐⭐",
  },
  {
    category: "Bola Oficial",
    description: "Edição especial com acabamento premium diferenciado",
    rarity: "⭐⭐⭐",
  },
];

export default function FigurinhasEspeciaisCopa2026Page() {
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
                  href="/album-copa-do-mundo-2026"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Álbum Copa 2026
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--on-surface)] font-medium">
                Figurinhas Especiais
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia de Raras e Especiais
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Figurinhas Especiais e Legendárias da Copa 2026:{" "}
              <span className="text-gradient-primary">
                lista completa, raridade e valor de troca
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Explore as <strong>68 figurinhas especiais brilhantes</strong> do
              álbum da Copa do Mundo 2026 da Panini: capitães das 48 seleções,
              craques mundiais, troféu da FIFA, bola oficial e mascote. Descubra
              qual é a <strong>raridade real</strong>, o <strong>
                valor de troca
              </strong>{" "}
              entre colecionadores e a melhor estratégia para conseguir as mais
              raras sem gastar uma fortuna.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 20/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado em 26/05/2026</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O que são figurinhas especiais da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              As <strong>figurinhas especiais</strong> do álbum da Copa do Mundo
              2026 são <strong>68 cromos exclusivos com efeito brilhante</strong>{" "}
              e holográfico, distribuídos pela Panini entre os pacotinhos. Elas
              incluem os <strong>capitães das 48 seleções</strong>, craques
              mundiais, o troféu da FIFA, bola oficial e mascote do torneio.
            </p>
            <p>
              Essas figurinhas representam apenas <strong>7% do álbum total</strong>
              , o que as torna muito mais raras e valiosas que as figurinhas comuns.
              Entre colecionadores, o valor de troca é significativamente maior —
              uma figurinha especial pode valer de 3 a 10 figurinhas normais,
              dependendo de quão rara e procurada ela é.
            </p>
            <p>
              Visualmente, as especiais se destacam imediatamente: possuem acabamento
              metalizado, efeito brilhante intenso e, em alguns casos, hologramas
              especiais. Quando você pega uma figurinha especial em um pacotinho, é
              impossível não notar a diferença.
            </p>
          </div>
        </section>

        {/* Categorias */}
        <section
          aria-labelledby="categories-heading"
          className="mx-auto max-w-5xl px-4 sm:px-6 pb-8"
        >
          <h2
            id="categories-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8"
          >
            Tipos de figurinhas especiais: categorias e raridade
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {specialCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center">
                        <Icon
                          className="h-5 w-5 text-[var(--secondary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-sm font-semibold text-[var(--primary)]">
                        {category.count}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[var(--on-surface-variant)]">
                      {category.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Capitães */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Capitães das 48 seleções: as mais procuradas
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Os <strong>48 capitães</strong> das seleções participantes da Copa
              2026 formam a maior categoria dentro das figurinhas especiais. Cada
              um tem sua própria figurinha brilhante, com uniforme oficial e nome
              em destaque.
            </p>
            <p>
              Os capitães mais raros e procurados são tradicionalmente os das
              seleções favoritas: <strong>Brasil</strong> (Vinicius Jr. ou quem for
              escolhido), <strong>Argentina</strong>, <strong>França</strong>,
              <strong> Alemanha</strong> e <strong>Espanha</strong>. Colecionadores
              tendem a focar nessas figurinhas primeiro, o que aumenta sua demanda.
            </p>
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 mt-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                Top 5 capitães mais procurados
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-bold">🇧🇷</span>
                  <span>Capitão do Brasil — procurado por brasileiros em primeiro lugar</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-bold">🇦🇷</span>
                  <span>Capitão da Argentina — representante do campeão do mundo</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-bold">🇫🇷</span>
                  <span>Capitão da França — potência no futebol mundial</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-bold">🇩🇪</span>
                  <span>Capitão da Alemanha — tradição e força no futebol</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--primary)] font-bold">🇪🇸</span>
                  <span>Capitão da Espanha — campeão europeu com estilo</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Craques */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Craques mundiais: Vinicius Jr., Mbappé, Haaland e companhia
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Além dos capitães, o álbum contém <strong>figurinhas especiais de 12
              craques mundiais</strong> — jogadores que se destacam internacionalmente
              e têm grande apelo junto ao público colecionador.
            </p>
            <p>
              A figurinha especial do <strong>Vinicius Jr.</strong> é uma das mais
              procuradas, especialmente no Brasil, por ser um dos maiores talentos
              brasileiros em atividade. <strong>Mbappé</strong>, <strong>
                Haaland
              </strong>{" "}
              e <strong>Bellingham</strong> também aparecem com figurinhas especiais
              e têm grande demanda internacional.
            </p>
            <p>
              Essas figurinhas de craques geralmente têm valor de troca ainda maior
              que os capitães, porque representam jogadores individuais icônicos,
              não apenas líderes de seleção.
            </p>
          </div>
        </section>

        {/* Símbolos */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Troféu, bola oficial e mascote: as mais únicas
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Apenas <strong>3 figurinhas especiais</strong> representam os símbolos
              máximos da Copa do Mundo: o <strong>troféu da FIFA</strong>, a{" "}
              <strong>bola oficial</strong> e o <strong>mascote</strong> da edição
              2026.
            </p>
            <p>
              Essas são as <strong>figurinhas mais únicas do álbum</strong> —
              distribuição muito menor, impossibilidade de encontrar duplicatas e
              grande significado histórico. Colecionadores que querem completar o
              álbum com todas as especiais precisam focar nessas com especial
              atenção.
            </p>
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 mt-6">
              <p className="text-sm text-[var(--on-surface-variant)]">
                <strong className="text-[var(--on-surface)]">Nota importante:</strong> Essas
                3 figurinhas frequentemente têm hologramas especiais ou acabamento
                diferenciado em relação às demais. Quando consegue uma, é um
                momento memorável para qualquer colecionador.
              </p>
            </div>
          </div>
        </section>

        {/* Figurinhas mais raras */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            As figurinhas especiais mais raras e valiosas
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rareStickers.map((sticker) => (
              <Card
                key={sticker.category}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {sticker.category}
                    </CardTitle>
                    <span className="text-sm font-semibold text-[var(--secondary)]">
                      {sticker.rarity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {sticker.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas para conseguir */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como conseguir figurinhas especiais de forma eficiente
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Conseguir todas as 68 especiais é um desafio. Aqui estão as 6
            estratégias mais eficazes usadas por colecionadores experientes:
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collectionTips.map((tip) => (
              <Card
                key={tip.number}
                className="relative bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-[var(--secondary)] text-[var(--on-surface)] flex items-center justify-center font-bold text-sm">
                    {tip.number}
                  </div>
                  <CardTitle className="text-lg mt-2">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {tip.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Valor de troca */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quanto vale uma figurinha especial em troca?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O valor de troca de uma figurinha especial varia bastante conforme:
            </p>
            <ul className="space-y-3 ml-4">
              <li>
                <strong className="text-[var(--on-surface)]">Raridade:</strong> Troféu
                e mascote valem mais que capitães
              </li>
              <li>
                <strong className="text-[var(--on-surface)]">Popularidade:</strong> Capitães
                de seleções fortes valem mais
              </li>
              <li>
                <strong className="text-[var(--on-surface)]">Demanda local:</strong> Varia
                conforme a região do Brasil
              </li>
              <li>
                <strong className="text-[var(--on-surface)]">Hologramas:</strong> Especiais
                com efeitos únicos valem mais
              </li>
            </ul>
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 mt-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                Tabela referencial de troca
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Capitães comuns</span>
                  <span className="font-semibold">3-5 figurinhas</span>
                </li>
                <li className="flex justify-between">
                  <span>Capitães de seleções fortes</span>
                  <span className="font-semibold">6-8 figurinhas</span>
                </li>
                <li className="flex justify-between">
                  <span>Craques mundiais</span>
                  <span className="font-semibold">8-12 figurinhas</span>
                </li>
                <li className="flex justify-between">
                  <span>Bola oficial ou mascote</span>
                  <span className="font-semibold">10-15 figurinhas</span>
                </li>
                <li className="flex justify-between font-bold">
                  <span>Troféu FIFA (mais rara)</span>
                  <span className="font-semibold text-[var(--secondary)]">
                    15-20+ figurinhas
                  </span>
                </li>
              </ul>
              <p className="text-xs text-[var(--outline)] mt-4">
                Valores referenciais. O mercado local pode variar. No Figurinha
                Fácil, o sistema ajusta automaticamente a proporção de troca.
              </p>
            </div>
          </div>
        </section>

        {/* Onde trocar */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Users
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Use o Figurinha Fácil para encontrar especiais próximo a você
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              O melhor jeito de conseguir figurinhas especiais é trocando com
              colecionadores que têm as mesmas necessidades que você. No{" "}
              <strong>Figurinha Fácil</strong>, você registra quais especiais já tem e
              quais faltam, e a plataforma <strong>encontra matches automáticos</strong>{" "}
              com colecionadores da sua cidade que têm o que você precisa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Cadastrar grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/como-funciona">Como funciona a troca</Link>
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
            Perguntas frequentes sobre figurinhas especiais
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-container)]/20 border border-[var(--secondary)]/20">
              <Sparkles
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="text-[var(--secondary)] text-[10px] font-bold tracking-[0.2em] uppercase">
                Colecione as especiais
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Comece a trocar figurinhas especiais da Copa 2026 hoje
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              As figurinhas especiais são o destaque do álbum. No Figurinha{" "}
              <span className="text-[#87d400]">Fácil</span>, você encontra
              colecionadores perto de você que têm exatamente as raras que faltam
              no seu álbum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/album-copa-do-mundo-2026">
                  Voltar ao guia do álbum
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
