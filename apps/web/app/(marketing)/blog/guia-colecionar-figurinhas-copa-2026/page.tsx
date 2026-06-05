import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Map,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
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

const ARTICLE_PATH = "/blog/guia-colecionar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-08T00:00:00Z";
const MODIFIED_AT = "2026-05-08T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais e Dicas Essenciais",
  description:
    "Aprenda como colecionar figurinhas da Copa 2026 de forma eficiente. Estratégias profissionais, dicas para evitar repetidas, métodos de troca e como completar seu álbum gastando menos.",
  keywords: [
    "como colecionar figurinhas copa 2026",
    "guia colecionar figurinhas copa",
    "estratégia figurinhas copa 2026",
    "dicas colecionar álbum copa",
    "como evitar repetidas figurinhas",
    "método organizar figurinhas",
    "colecionar figurinhas eficiência",
    "guia completo figurinhas copa 2026",
    "estratégias para colecionar figurinhas",
    "figurinhas raras copa 2026 como conseguir",
  ],
  openGraph: {
    title:
      "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais",
    description:
      "Descubra estratégias profissionais para colecionar figurinhas da Copa 2026 com eficiência. Saiba como evitar repetidas e completar seu álbum economizando.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas",
      "Colecionismo",
      "Guia Completo",
      "Dicas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais",
    description:
      "Aprenda estratégias profissionais para colecionar figurinhas da Copa 2026 com eficiência.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é a melhor estratégia para colecionar figurinhas da Copa 2026?",
    answer:
      "A melhor estratégia combina compra inteligente com trocas organizadas. Comece comprando pacotes regularmente, catalogue suas figurinhas (use o Figurinha Fácil), identifique as que faltam e as repetidas, e troque com colecionadores da sua região. Isso reduz custos em até 60%.",
  },
  {
    question: "Como evitar muitas figurinhas repetidas ao colecionar?",
    answer:
      "Use uma plataforma de rastreamento como o Figurinha Fácil para catalogar suas figurinhas. Antes de comprar novos pacotes, saiba exatamente quais já possui. Ao coletar, foque em trocas estratégicas com outros colecionadores para preencher as lacunas sem duplicar.",
  },
  {
    question: "Qual é a sequência ideal de compra de pacotes de figurinhas?",
    answer:
      "Não existe ordem específica de sequência, já que cada pacote é aleatório. O que funciona é: compre regularmente (2-3 pacotes por semana), catalogue o que ganhou, identifique gaps (lacunas), e troque para preencher. Alguns colecionadores focam em figurinhas especiais primeiro, outros nas seleções favoritas.",
  },
  {
    question:
      "Como organizar minha coleção de figurinhas da Copa 2026 de forma eficiente?",
    answer:
      "Use um caderno ou app para rastrear seu progresso. O Figurinha Fácil permite marcar figurinhas que você tem e não tem. Organize por seleção (Brasil, Argentina, etc.), depois por número. Mantenha as repetidas separadas para trocas. Faça backup digital da sua coleção.",
  },
  {
    question:
      "Quais são as figurinhas mais raras e valiosas da Copa 2026 para colecionar?",
    answer:
      "As figurinhas especiais (68 no total) são as mais raras: hologramas, foil, e edições limitadas. Também são valiosas as figurinhas de ídolos (Neymar, Mbappé, Haaland). Figurinhas de estádios e bandeiras também têm valor. Comece coletando as seleções favoritas e vá buscando as raras depois.",
  },
  {
    question: "Quanto tempo leva para colecionar todas as figurinhas da Copa 2026?",
    answer:
      "Depende da sua dedicação. Apenas comprando pacotes, leva 6-12 meses. Com trocas ativas usando o Figurinha Fácil, você pode completar em 3-5 meses. Colecionadores profissionais que negociam ativamente conseguem em 1-2 meses.",
  },
];

const collectingStrategies = [
  {
    icon: Target,
    iconColor: "text-[#dc2626]",
    title: "Estratégia Focada",
    description:
      "Defina quais figurinhas são prioridade (time favorito, ídolos, raras) e colecione-as primeiro. Isso acelera a satisfação e economiza recursos.",
  },
  {
    icon: Users,
    iconColor: "text-[#1b7a3d]",
    title: "Rede de Trocas",
    description:
      "Monte uma rede de colecionadores (amigos, família, comunidade). Use o Figurinha Fácil para conectar com pessoas perto de você e fazer trocas presenciais.",
  },
  {
    icon: BookOpen,
    iconColor: "text-[#7c3aed]",
    title: "Catalogação Sistemática",
    description:
      "Mantenha registro detalhado de tudo que você tem. Saiba exatamente quais são as 50 figurinhas que faltam. Isso guia suas compras futuras.",
  },
  {
    icon: Lightbulb,
    iconColor: "text-[#eab308]",
    title: "Compra Estratégica",
    description:
      "Não compre pacotes ao acaso. Compre regularmente (mesma quantidade por semana) para distribuir probabilidades. Evite picos de compra que geram muitas repetidas.",
  },
  {
    icon: Map,
    iconColor: "text-[#1b7a3d]",
    title: "Localização Geográfica",
    description:
      "Use plataformas que mostram colecionadores perto de você. Trocas locais eliminam frete e conectam você com a comunidade de colecionadores.",
  },
  {
    icon: Sparkles,
    iconColor: "text-[#7c3aed]",
    title: "Foco em Raras",
    description:
      "Deixe as figurinhas especiais para o final. Concentre-se em completar as 912 figurinhas comuns antes de buscar as 68 especiais.",
  },
];

const organizingSteps = [
  {
    step: 1,
    title: "Criar Inventário Digital",
    description:
      "Use o Figurinha Fácil para marcar cada figurinha que você tem. Comece digitalizando as figurinhas que já possui.",
  },
  {
    step: 2,
    title: "Identificar Faltantes",
    description:
      "O app mostrará automaticamente quais figurinhas faltam. Priorize por seleção (concentre em times que gosta primeiro).",
  },
  {
    step: 3,
    title: "Separar Repetidas",
    description:
      "Guarde as figurinhas repetidas em um local específico. Organize por seleção para facilitar buscas de trocas.",
  },
  {
    step: 4,
    title: "Conectar com Colecionadores",
    description:
      "Use a plataforma para encontrar colecionadores perto de você com figurinhas que faltam.",
  },
  {
    step: 5,
    title: "Fazer Trocas Estratégicas",
    description:
      "Troque suas repetidas pelas figurinhas que faltam. Cada troca reduz seu custo total em até 40%.",
  },
  {
    step: 6,
    title: "Atualizar Regularmente",
    description:
      "Toda semana, após novos pacotes, atualize seu inventário e busque novas trocas.",
  },
];

const avoidRepeatTips = [
  {
    title: "Rastreie Antes de Comprar",
    desc: "Saiba exatamente quais figurinhas você tem antes de comprar novos pacotes.",
  },
  {
    title: "Distribua Compras",
    desc: "Não compre 10 pacotes de uma vez. Compre 2-3 por semana para distribuir probabilidades.",
  },
  {
    title: "Comece a Trocar Cedo",
    desc: "Assim que tiver 2-3 repetidas de uma figurinha, procure alguém para trocar.",
  },
  {
    title: "Use Grupos de Trocas",
    desc: "Grupos no WhatsApp, Facebook ou Figurinha Fácil conectam você com outros colecionadores.",
  },
  {
    title: "Negocie Inteligentemente",
    desc: "Algumas figurinhas (raras, ídolos) valem mais. Saiba disso ao negociar.",
  },
];

const tenTips = [
  "Comece criando uma conta no Figurinha Fácil para rastrear sua coleção.",
  "Compre pacotes em locais confiáveis (farmácias, supermercados, lojas autorizadas).",
  "Não guarde todas as repetidas — comece a trocar assim que tiver duplas.",
  "Organize por seleção/país para facilitar buscas de faltantes.",
  "Participe de grupos de colecionadores em redes sociais da sua região.",
  "Guarde as figurinhas raras em local seguro (capa protetora, álbum de qualidade).",
  "Faça backup digital de sua coleção (foto ou app).",
  "Negocie trocas respeitosamente — figurinhas têm valores diferentes.",
  "Não compre figurinhas avulsas a preço inflado — use trocas.",
  "Acompanhe o calendário de lançamento de pacotes especiais.",
];

const timeRows = [
  { method: "Apenas Comprando Pacotes", time: "6-12 meses", cost: "R$ 7.363" },
  { method: "Comprando + Trocas Ocasionais", time: "4-6 meses", cost: "R$ 4.639" },
  { method: "Trocas Ativas (Figurinha Fácil)", time: "3-5 meses", cost: "R$ 2.000 - R$ 3.500" },
  { method: "Colecionador Profissional/Comunidade", time: "1-2 meses", cost: "R$ 1.500 - R$ 2.500" },
];

export default function ColecionarFigurinhasGuide() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: "Guia de Colecionismo", url: ARTICLE_PATH },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais e Dicas Essenciais",
    description:
      "Um guia completo sobre como colecionar figurinhas da Copa 2026 com estratégias profissionais, dicas para evitar repetidas, e métodos para completar seu álbum.",
    url: ARTICLE_URL,
    image: `${BASE_URL}/og-image.png`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    datePublished: PUBLISHED_AT,
    dateModified: MODIFIED_AT,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": ARTICLE_URL,
    },
  };

  const combinedSchema = generateCombinedSchema([
    generateBreadcrumbSchema(breadcrumbs),
    articleSchema,
    generateFAQSchema(FAQS),
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />

      <main className="bg-[#faf8f4]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-[#78788a]">
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && <span>/</span>}
                <Link
                  href={crumb.url}
                  className="hover:text-[#12121f] transition-colors"
                >
                  {crumb.name}
                </Link>
              </div>
            ))}
          </nav>

          {/* Header */}
          <div className="mb-12 space-y-4">
            <Badge className="w-fit">Guia Completo · 2026</Badge>
            <h1 className="text-3xl font-extrabold text-[#12121f] sm:text-4xl leading-[1.15] tracking-tight">
              Guia Completo para Colecionar Figurinhas da Copa 2026
            </h1>
            <p className="text-lg text-[#535364] leading-relaxed">
              Estratégias profissionais, dicas essenciais e métodos comprovados
              para completar seu álbum de forma eficiente e econômica.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-[#78788a]">
              <span>{new Date(PUBLISHED_AT).toLocaleDateString("pt-BR")}</span>
              <span>Leitura: 8 min</span>
              <span>980 figurinhas para colecionar</span>
            </div>
          </div>

          {/* CTA — inline, no Card */}
          <div className="mb-14 p-6 bg-[#12121f] text-[#f0f0f5]">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-[#eab308] shrink-0 mt-0.5" />
              <div>
                <h2 className="font-bold text-sm mb-1">Comece Sua Coleção Agora</h2>
                <p className="text-xs text-[#9ca3af]">
                  Use o Figurinha Fácil para rastrear suas figurinhas, encontrar
                  colecionadores perto de você e fazer trocas inteligentes.
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="bg-[#eab308] hover:bg-[#ca8a04] text-[#12121f] font-bold text-xs px-4 h-9">
              <Link href="/dashboard">
                Ir para Figurinha Fácil <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Índice */}
          <div className="mb-14 p-5 bg-[#f0ebe0]/70">
            <h2 className="text-sm font-bold text-[#12121f] mb-3">
              Índice do Artigo
            </h2>
            <ul className="space-y-1.5 text-xs text-[#535364]">
              <li>O que é colecionar figurinhas profissionalmente</li>
              <li>6 estratégias comprovadas de colecionismo</li>
              <li>Como organizar sua coleção</li>
              <li>Dicas para evitar repetidas</li>
              <li>Método de trocas inteligentes</li>
              <li>10 dicas para novos colecionadores</li>
              <li>Perguntas frequentes respondidas</li>
            </ul>
          </div>

          {/* Conteúdo Principal */}
          <div className="space-y-16">
            {/* Seção 1 */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-4">
                O Que é Colecionar Figurinhas Profissionalmente
              </h2>
              <p className="text-sm text-[#2d2d3a] leading-relaxed mb-4">
                Colecionar figurinhas da Copa 2026 não é apenas comprar pacotes
                ao acaso. É um processo estratégico que envolve:
              </p>
              <ul className="space-y-2 text-sm text-[#535364] mb-4">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#dc2626] shrink-0" />
                  <strong className="text-[#12121f]">Planejamento:</strong> Saber
                  exatamente quais figurinhas você precisa
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#dc2626] shrink-0" />
                  <strong className="text-[#12121f]">Rastreamento:</strong> Usar
                  ferramentas para catalogar sua coleção
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#dc2626] shrink-0" />
                  <strong className="text-[#12121f]">Networking:</strong> Conectar
                  com outros colecionadores para trocas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#dc2626] shrink-0" />
                  <strong className="text-[#12121f]">Otimização:</strong> Minimizar
                  gastos e repetidas desnecessárias
                </li>
              </ul>
              <p className="text-sm text-[#535364] leading-relaxed">
                O álbum da Copa 2026 tem 980 figurinhas totais: 912 figurinhas
                comuns (18 de cada seleção) + 68 figurinhas especiais. Coletar
                tudo sem estratégia pode custar até R$ 7.363. Com as estratégias
                certas, você gasta entre R$ 2.000 e R$ 3.500.
              </p>
            </section>

            {/* Seção 2 — Estratégias */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-8">
                6 Estratégias Comprovadas para Colecionar Figurinhas
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {collectingStrategies.map((s) => {
                  const IconComponent = s.icon;
                  return (
                    <div key={s.title} className="p-5 bg-[#f0ebe0]/70">
                      <IconComponent className={`h-5 w-5 ${s.iconColor} mb-3`} />
                      <h3 className="font-bold text-[#12121f] text-sm mb-2">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[#535364] leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Seção 3 — Organização */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-8">
                Como Organizar Sua Coleção Eficientemente
              </h2>
              <div className="space-y-1">
                {organizingSteps.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 p-4 bg-[#f0ebe0]/70"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#dc2626] text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#12121f] text-sm">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#535364] mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 4 — Evitar Repetidas */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-6">
                Como Evitar Muitas Figurinhas Repetidas
              </h2>
              <div className="space-y-3">
                {avoidRepeatTips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-[#f0ebe0]/70">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1b7a3d] mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#12121f] text-sm">
                        {tip.title}
                      </p>
                      <p className="text-xs text-[#535364] mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 5 — 10 Dicas */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-6">
                10 Dicas Essenciais para Novos Colecionadores
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {tenTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-[#f0ebe0]/70 text-xs"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-[#eab308] text-[#12121f] font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="text-[#535364] leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 6 — Tabela de tempo */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-6">
                Quanto Tempo Leva para Completar o Álbum
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#d1cbb8]">
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Método
                      </th>
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Tempo
                      </th>
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Custo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#d1cbb8]/60">
                        <td className="py-3 px-3 text-[#535364]">{row.method}</td>
                        <td className="py-3 px-3 text-[#535364]">{row.time}</td>
                        <td className="py-3 px-3 font-semibold text-[#1b7a3d]">
                          {row.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#78788a] mt-3">
                Os tempos variam conforme dedicação, frequência de compra e
                atividade em trocas.
              </p>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-xl font-bold text-[#12121f] mb-8">
                Perguntas Frequentes
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="p-5 bg-[#f0ebe0]/70">
                    <h3 className="font-semibold text-[#12121f] text-sm mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-[#535364] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Final */}
            <div className="p-8 sm:p-10 bg-[#12121f] text-[#f0f0f5]">
              <h2 className="text-xl font-extrabold mb-3">
                Pronto para Começar
              </h2>
              <p className="text-sm text-[#9ca3af] mb-6 leading-relaxed max-w-lg">
                O Figurinha Fácil é a ferramenta definitiva para colecionadores
                da Copa 2026. Rastreie suas figurinhas, encontre trocas perto de
                você e complete seu álbum de forma eficiente.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="sm" className="bg-[#eab308] hover:bg-[#ca8a04] text-[#12121f] font-bold text-xs px-4 h-9">
                  <Link href="/dashboard">
                    Ir para Figurinha Fácil
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="border-[#374151] text-[#e5e7eb] hover:bg-[#1f2937] hover:border-[#4b5563] font-semibold text-xs px-4 h-9">
                  <Link href="/blog">Ver Mais Artigos</Link>
                </Button>
              </div>
            </div>

            {/* Related Articles */}
            <div className="pt-10 border-t border-[#d1cbb8]">
              <h2 className="text-lg font-bold text-[#12121f] mb-6">
                Artigos Relacionados
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    title:
                      "Quanto Custa Completar o Álbum da Copa 2026? Guia Completo com Simulações",
                    href: "/blog/quanto-custa-completar-album-copa-2026",
                    excerpt:
                      "Análise detalhada dos custos para completar o álbum com diferentes estratégias.",
                  },
                  {
                    title:
                      "Álbum da Copa do Mundo 2026: Guia Completo de Figurinhas, Preços e Como Completar",
                    href: "/album-copa-do-mundo-2026",
                    excerpt:
                      "Tudo que você precisa saber sobre o álbum oficial da Copa 2026.",
                  },
                ].map((article, idx) => (
                  <div key={idx} className="p-5 bg-[#f0ebe0]/70">
                    <h3 className="font-semibold text-[#12121f] text-sm mb-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#535364] mb-4">
                      {article.excerpt}
                    </p>
                    <Button variant="ghost" asChild size="sm" className="text-xs px-0 h-auto text-[#dc2626] hover:text-[#dc2626]/80 hover:bg-transparent">
                      <Link href={article.href}>
                        Ler Artigo <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </>
  );
}
