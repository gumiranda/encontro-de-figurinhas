import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Zap,
  Smartphone,
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

const ARTICLE_PATH = "/blog/como-completar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-06-01T00:00:00Z";
const MODIFIED_AT = "2026-06-01T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Completar o Álbum da Copa 2026: Guia Completo de Trocas e Estratégias",
  description:
    "Descubra as melhores estratégias para completar o álbum da Copa do Mundo 2026. Guia completo com dicas de trocas, figurinhas raras, onde comprar e como economizar até 80%.",
  keywords: [
    "como completar álbum copa 2026",
    "álbum da copa 2026",
    "trocar figurinhas copa",
    "figurinhas raras copa 2026",
    "onde comprar figurinhas copa",
    "trocas figurinhas copa do mundo",
    "figurinha legend copa 2026",
    "estratégia completar álbum copa",
    "pontos de troca figurinhas",
    "grupos troca figurinhas online",
  ],
  openGraph: {
    title:
      "Como Completar o Álbum da Copa 2026: Guia Estratégias de Troca",
    description:
      "Descubra as melhores estratégias para completar o álbum da Copa 2026 com dicas de trocas, figurinhas raras e como economizar até 80%.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Estratégias de Troca",
      "Coleção",
      "Figurinhas Raras",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Completar o Álbum da Copa 2026 com Trocas Estratégicas",
    description:
      "Guia completo de estratégias para completar seu álbum da Copa 2026 e economizar até 80%.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question:
      "Qual é a melhor estratégia para completar o álbum da Copa 2026?",
    answer:
      "A melhor estratégia é combinar compra de pacotinhos com trocas ativas. Use plataformas como Figurinha Fácil para encontrar colecionadores próximos à sua cidade, organize trocas presenciais e participe de grupos online. Isso reduz o custo final em até 80% comparado a comprar tudo.",
  },
  {
    question: "Por quanto sai completar o álbum da Copa fazendo trocas?",
    answer:
      "Com uma rede ativa de trocas, você pode completar o álbum gastando entre R$ 1.400 a R$ 2.500. Sem trocas, o custo sobe para R$ 7.000 ou mais. A economia vem das figurinhas repetidas que você pode trocar com outros colecionadores ao invés de comprar novos pacotinhos.",
  },
  {
    question: "Quais são as figurinhas mais raras do álbum da Copa 2026?",
    answer:
      "As figurinhas mais raras são as Legends (categoria especial com 20 jogadores). As versões douradas aparecem em apenas 1 a cada 1.900 pacotes. Vinícius Júnior é o único brasileiro na categoria Legend, junto com Messi, Cristiano Ronaldo e Mbappé.",
  },
  {
    question: "Onde encontrar grupos para trocar figurinhas da Copa?",
    answer:
      "Existem várias opções: Instagram e X (Twitter) têm muitos grupos de trocas regionais; Figurinha Fácil conecta colecionadores próximos; aplicativo FIFA Panini Collection permite trocas online; bancas de jornal e supermercados organizam encontros nos finais de semana.",
  },
  {
    question: "Como usar o Figurinha Fácil para completar o álbum?",
    answer:
      "Cadastre suas figurinhas repetidas e as que faltam no Figurinha Fácil. A plataforma encontra matches automáticos com colecionadores próximos à sua cidade. Organize a troca presencialmente ou online e complete seu álbum de forma prática e econômica.",
  },
  {
    question: "Quanto custa cada figurinha rara do álbum da Copa 2026?",
    answer:
      "Figurinhas roxas Legend custam em média R$ 150. As de bronze saem por R$ 200. Prata varia de R$ 180 a R$ 400. As raríssimas douradas podem custar de R$ 300 a R$ 5.000 dependendo de quem está vendendo.",
  },
];

const BREADCRUMB = [
  { name: "Início", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: "Como Completar o Álbum da Copa 2026", url: ARTICLE_PATH },
];

const strategies = [
  {
    icon: CheckCircle2,
    iconColor: "text-[#dc2626]",
    title: "Trocas Presenciais",
    description:
      "Organize encontros com colecionadores da sua cidade. Leve suas figurinhas repetidas e troque pelas que faltam.",
    stats: [
      { label: "Economia", value: "até 60%" },
      { label: "Melhor em", value: "bancas e parques" },
      { label: "Tempo", value: "1-2 meses" },
    ],
  },
  {
    icon: Smartphone,
    iconColor: "text-[#1b7a3d]",
    title: "Plataformas Online",
    description:
      "Use Figurinha Fácil, grupos no Instagram/X e o app FIFA Panini Collection para trocas automáticas.",
    stats: [
      { label: "Economia", value: "até 70%" },
      { label: "Melhor em", value: "trocas regionais" },
      { label: "Tempo", value: "2-3 meses" },
    ],
  },
  {
    icon: Users,
    iconColor: "text-[#7c3aed]",
    title: "Comunidades de Colecionadores",
    description:
      "Participe de comunidades ativas com muitos membros para ter mais matches de trocas.",
    stats: [
      { label: "Economia", value: "até 80%" },
      { label: "Melhor em", value: "cidades grandes" },
      { label: "Tempo", value: "1-2 meses" },
    ],
  },
  {
    icon: TrendingUp,
    iconColor: "text-[#eab308]",
    title: "Compra Estratégica + Trocas",
    description:
      "Combine compra de pacotinhos com trocas ativas para otimizar gastos.",
    stats: [
      { label: "Economia", value: "até 70%" },
      { label: "Melhor em", value: "combo de estratégias" },
      { label: "Tempo", value: "4-6 semanas" },
    ],
  },
];

const steps = [
  {
    step: "1",
    title: "Compre o Álbum e os Primeiros Pacotinhos",
    desc: "Invista em 10-15 pacotinhos para começar sua coleção e ter figurinhas para trocar.",
  },
  {
    step: "2",
    title: "Cadastre-se no Figurinha Fácil",
    desc: "Registre suas figurinhas repetidas e as que faltam para encontrar matches automáticos.",
  },
  {
    step: "3",
    title: "Participe de Grupos de Trocas",
    desc: "Junte-se a grupos no Instagram, X ou comunidades locais de colecionadores.",
  },
  {
    step: "4",
    title: "Organize Trocas Presenciais",
    desc: "Combine encontros em bancas, parques ou pontos de troca nos fins de semana.",
  },
  {
    step: "5",
    title: "Repita e Estude o Álbum",
    desc: "Continue comprando pacotinhos estrategicamente e fazendo trocas até completar.",
  },
  {
    step: "6",
    title: "Celebre sua Conquista",
    desc: "Você completou o álbum economizando até 80%.",
  },
];

const costRows = [
  { strategy: "Apenas pacotinhos (sem trocas)", cost: "R$ 7.000+", savings: "", savingsClass: "text-[#535364]", time: "2-3 meses" },
  { strategy: "Trocas presenciais", cost: "R$ 2.800", savings: "60%", savingsClass: "text-[#1b7a3d]", time: "1-2 meses" },
  { strategy: "Figurinha Fácil + grupos", cost: "R$ 2.100", savings: "70%", savingsClass: "text-[#1b7a3d]", time: "2-3 meses" },
  { strategy: "Comunidades ativas", cost: "R$ 1.400", savings: "80%", savingsClass: "text-[#1b7a3d]", time: "1-2 meses" },
];

export default function Page() {
  const breadcrumbSchema = generateBreadcrumbSchema(BREADCRUMB);
  const faqSchema = generateFAQSchema(FAQS);
  const combinedSchema = generateCombinedSchema([
    breadcrumbSchema,
    faqSchema,
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />

      <main className="bg-[#faf8f4]">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-16">
            <nav className="mb-6 flex items-center gap-2 text-sm text-[#78788a]">
              {BREADCRUMB.map((crumb, index) => (
                <div key={crumb.url} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  <Link
                    href={crumb.url}
                    className="hover:text-[#12121f] transition-colors"
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Dicas &amp; Estratégias</Badge>
              <Badge variant="outline">Copa 2026</Badge>
              <Badge variant="outline">Trocas</Badge>
            </div>

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#12121f] sm:text-4xl leading-[1.15]">
              Como Completar o Álbum da Copa 2026
            </h1>

            <p className="mb-6 text-lg text-[#535364] leading-relaxed">
              Guia completo com estratégias de trocas, dicas de figurinhas raras
              e como economizar até 80% na sua coleção.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#78788a]">
              <time dateTime={PUBLISHED_AT}>1 de junho de 2026</time>
              <span>8 min de leitura</span>
            </div>
          </header>

          {/* Introduction */}
          <section className="mb-16 space-y-4 text-[#2d2d3a] leading-relaxed">
            <p>
              O álbum da Copa do Mundo 2026 é um dos maiores lançamentos de
              figurinhas dos últimos anos, com 980 figurinhas no total. Mas
              completar o álbum pode ser caro se você não souber as estratégias
              certas de troca e compra.
            </p>
            <p>
              Este guia completo te mostra exatamente como economizar até 80% ao
              completar seu álbum usando trocas estratégicas, plataformas de
              conectividade e dicas de especialistas colecionadores.
            </p>
          </section>

          {/* Strategy cards — varied layout, no colored boxes */}
          <section className="mb-20">
            <h2 className="text-xl font-bold text-[#12121f] mb-8">
              Quatro Estratégias para Completar seu Álbum
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {strategies.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="p-5 bg-[#f0ebe0]/70">
                    <Icon className={`h-5 w-5 ${s.iconColor} mb-3`} />
                    <h3 className="font-bold text-[#12121f] text-sm mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#535364] mb-3 leading-relaxed">
                      {s.description}
                    </p>
                    <div className="flex gap-4 text-xs">
                      {s.stats.map((st) => (
                        <div key={st.label}>
                          <p className="text-[#78788a]">{st.label}</p>
                          <p className="font-semibold text-[#12121f]">{st.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Main Content */}
          <section className="space-y-16">
            {/* Por que trocas */}
            <div>
              <h2 className="text-xl font-bold text-[#12121f] mb-4">
                Por Que as Trocas São Essenciais
              </h2>
              <div className="space-y-3 text-[#2d2d3a] leading-relaxed text-sm">
                <p>
                  O álbum da Copa 2026 tem 980 figurinhas diferentes. Se você
                  comprar apenas pacotinhos sem fazer trocas, vai gastar em
                  média <strong className="text-[#12121f]">R$ 7.000 a R$ 8.000</strong> porque
                  terá muitas repetidas no final.
                </p>
                <p>
                  Mas se você fizer trocas ativas com outros colecionadores,
                  pode <strong className="text-[#12121f]">reduzir esse custo para R$ 1.400 a R$ 2.500</strong>.
                  Uma economia de até 80%.
                </p>
                <p className="p-4 bg-[#f0ebe0]/70 text-[#535364] text-xs">
                  Colecionadores que participam de redes ativas de trocas gastam em
                  média 80% menos para completar o álbum.
                </p>
              </div>
            </div>

            {/* Onde comprar */}
            <div>
              <h2 className="text-xl font-bold text-[#12121f] mb-4">
                Onde Comprar Figurinhas da Copa 2026
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-5 bg-[#f0ebe0]/70">
                  <h3 className="font-semibold text-[#12121f] mb-2">Pontos Físicos</h3>
                  <ul className="space-y-1.5 text-[#535364]">
                    <li>Bancas de jornal</li>
                    <li>Supermercados</li>
                    <li>Livrarias</li>
                    <li>Lojas de brinquedos</li>
                  </ul>
                </div>
                <div className="p-5 bg-[#f0ebe0]/70">
                  <h3 className="font-semibold text-[#12121f] mb-2">Online</h3>
                  <ul className="space-y-1.5 text-[#535364]">
                    <li>Amazon</li>
                    <li>Mercado Livre</li>
                    <li>Apps de delivery</li>
                    <li>Site oficial Panini</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Figurinhas raras */}
            <div>
              <h2 className="text-xl font-bold text-[#12121f] mb-4">
                As Figurinhas Mais Raras do Álbum
              </h2>
              <p className="text-sm text-[#535364] mb-6">
                Nem todas as figurinhas têm a mesma raridade. As mais procuradas são:
              </p>
              <div className="space-y-4">
                <div className="p-5 bg-[#f0ebe0]/70">
                  <h3 className="font-bold text-[#12121f] text-sm mb-1">
                    Figurinhas Legend (Ouro)
                  </h3>
                  <p className="text-xs text-[#78788a] mb-3">
                    Raridade: 1 em cada 1.900 pacotes
                  </p>
                  <p className="text-sm text-[#535364] mb-1">
                    A categoria especial com 20 das maiores estrelas do futebol
                    mundial. As versões douradas são as mais raras.
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-[#12121f]">Preço:</span>{" "}
                    <span className="text-[#1b7a3d] font-bold">R$ 300 a R$ 5.000</span>
                  </p>
                  <p className="text-xs text-[#535364] mt-2">
                    Jogadores: Messi, Cristiano Ronaldo, Mbappé, Vinícius Júnior
                    e outros.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="p-4 bg-[#f0ebe0]/70">
                    <p className="font-semibold text-[#12121f] mb-1">Prata</p>
                    <p className="text-[#1b7a3d] font-bold">R$ 180 - R$ 400</p>
                    <p className="text-xs text-[#78788a]">Rara</p>
                  </div>
                  <div className="p-4 bg-[#f0ebe0]/70">
                    <p className="font-semibold text-[#12121f] mb-1">Bronze</p>
                    <p className="text-[#1b7a3d] font-bold">R$ 200</p>
                    <p className="text-xs text-[#78788a]">Menos rara</p>
                  </div>
                  <div className="p-4 bg-[#f0ebe0]/70">
                    <p className="font-semibold text-[#12121f] mb-1">Roxa</p>
                    <p className="text-[#1b7a3d] font-bold">R$ 150</p>
                    <p className="text-xs text-[#78788a]">Comum (Legend)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plataformas */}
            <div>
              <h2 className="text-xl font-bold text-[#12121f] mb-6">
                Plataformas de Troca Recomendadas
              </h2>
              <div className="space-y-3">
                {[
                  {
                    name: "Figurinha Fácil",
                    desc: "A plataforma mais popular para trocas regionais no Brasil. Você cadastra suas figurinhas e encontra matches automáticos com colecionadores próximos.",
                    savings: "até 80%",
                  },
                  {
                    name: "FIFA Panini Collection (App)",
                    desc: "App oficial que permite trocas digitais de figurinhas com pessoas de qualquer lugar do mundo.",
                    savings: "até 70%",
                  },
                  {
                    name: "Grupos no Instagram e X",
                    desc: "Comunidades regionais muito ativas. Pesquise por 'troca figurinhas [sua cidade]' e encontre grupos com centenas de membros.",
                    savings: "até 75%",
                  },
                ].map((p) => (
                  <div key={p.name} className="p-5 bg-[#f0ebe0]/70">
                    <h3 className="font-bold text-[#12121f] text-sm mb-1">
                      {p.name}
                    </h3>
                    <p className="text-sm text-[#535364] mb-2">{p.desc}</p>
                    <p className="text-xs font-semibold text-[#1b7a3d]">
                      Economia: {p.savings}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Passo a passo */}
            <div>
              <h2 className="text-xl font-bold text-[#12121f] mb-8">
                Passo a Passo para Completar seu Álbum
              </h2>
              <div className="space-y-1">
                {steps.map((item) => (
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
                      <p className="text-sm text-[#535364] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimativa de custos */}
            <div>
              <h2 className="text-xl font-bold text-[#12121f] mb-6">
                Estimativa de Custos Reais
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#d1cbb8]">
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Estratégia
                      </th>
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Custo Total
                      </th>
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Economia
                      </th>
                      <th className="py-3 px-3 text-left font-semibold text-[#12121f]">
                        Tempo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {costRows.map((row) => (
                      <tr key={row.strategy} className="border-b border-[#d1cbb8]/60">
                        <td className="py-3 px-3 text-[#535364]">{row.strategy}</td>
                        <td className="py-3 px-3 font-semibold text-[#12121f]">
                          {row.cost}
                        </td>
                        <td className={`py-3 px-3 font-semibold ${row.savingsClass}`}>
                          {row.savings || "—"}
                        </td>
                        <td className="py-3 px-3 text-[#535364]">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mt-20 mb-16">
            <h2 className="text-xl font-bold text-[#12121f] mb-8">
              Perguntas Frequentes
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, index) => (
                <div key={index} className="p-5 bg-[#f0ebe0]/70">
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

          {/* CTA Section */}
          <section className="p-8 sm:p-10 bg-[#12121f] text-[#f0f0f5]">
            <h2 className="text-2xl font-extrabold mb-3">
              Comece a Completar seu Álbum Hoje
            </h2>
            <p className="text-sm text-[#9ca3af] mb-6 leading-relaxed max-w-lg">
              Use as estratégias deste guia para economizar até 80% e completar
              seu álbum da Copa 2026 em menos tempo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#eab308] hover:bg-[#ca8a04] text-[#12121f] font-bold text-sm px-6 py-5 h-auto"
              >
                <Link href="/">
                  Acessar Figurinha Fácil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#374151] text-[#e5e7eb] hover:bg-[#1f2937] hover:border-[#4b5563] font-semibold text-sm px-6 py-5 h-auto"
              >
                <Link href="/blog">Ver Outros Artigos</Link>
              </Button>
            </div>
          </section>

          {/* Conclusion */}
          <section className="mt-12 pt-10 border-t border-[#d1cbb8] space-y-4">
            <h2 className="text-lg font-bold text-[#12121f]">Conclusão</h2>
            <p className="text-sm text-[#535364] leading-relaxed">
              Completar o álbum da Copa 2026 não precisa ser um investimento
              gigantesco. Com as estratégias certas de troca, você pode economizar
              até 80% do custo final. Use plataformas como Figurinha Fácil,
              participe de comunidades ativas e organize trocas presenciais para
              otimizar seus gastos.
            </p>
            <p className="text-sm text-[#535364] leading-relaxed">
              A chave é começar cedo, ser estratégico nas compras e conectar-se
              com outros colecionadores. Assim você terá um álbum completo em 1-2
              meses gastando apenas R$ 1.400 a R$ 2.500 em vez de R$ 7.000+.
            </p>
            <p className="text-sm font-semibold text-[#12121f] pt-2">
              Boa sorte na sua jornada colecionista.
            </p>
          </section>
        </article>
      </main>

      <LandingFooter />
    </>
  );
}
