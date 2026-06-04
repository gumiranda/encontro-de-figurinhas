import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Globe,
  Users,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
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

const ARTICLE_PATH = "/blog/guia-completo-album-figurinhas-copa-mundo-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-10T00:00:00Z";
const MODIFIED_AT = "2026-05-10T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo: Álbum de Figurinhas da Copa do Mundo 2026 - Tudo que Você Precisa Saber",
  description:
    "Descubra tudo sobre o álbum da Copa do Mundo 2026: história, especificações, 980 figurinhas, preço, onde comprar, dicas de coleta e estratégias para completar a coleção. Guia definitivo para colecionadores.",
  keywords: [
    "álbum figurinhas copa do mundo",
    "álbum copa do mundo 2026",
    "figurinhas copa 2026",
    "álbum copa 2026 preço",
    "como colecionar figurinhas copa",
    "panini fifa world cup 2026",
    "álbum figurinhas oficial",
    "guia álbum copa 2026",
    "onde comprar álbum copa 2026",
    "dicas colecionar figurinhas",
    "álbum copa 980 figurinhas",
    "figurinhas especiais copa 2026",
  ],
  openGraph: {
    title:
      "Guia Completo: Álbum de Figurinhas da Copa do Mundo 2026 - Tudo que Você Precisa Saber",
    description:
      "Descubra tudo sobre o álbum da Copa do Mundo 2026: história, especificações, 980 figurinhas, preço, onde comprar e estratégias de coleta.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Panini",
      "Coleção",
      "Guia Completo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Guia Completo: Álbum de Figurinhas da Copa do Mundo 2026",
    description:
      "Tudo sobre o álbum da Copa 2026: história, 980 figurinhas, preço e dicas de coleta.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "O que é o álbum da Copa do Mundo 2026?",
    answer:
      "É a coleção oficial de figurinhas da Copa do Mundo 2026 produzida pela Panini. Um produto tradicional que acompanha a história dos Mundiais desde 1970, onde colecionadores colam figurinhas de jogadores, times e momentos icônicos do torneio em um álbum especialmente criado para a edição de 2026.",
  },
  {
    question: "Quantas figurinhas tem o álbum da Copa do Mundo 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 tem 980 figurinhas no total, sendo 68 delas especiais (holográficas ou com efeitos especiais). É o álbum com maior quantidade de figurinhas da história das Copas, refletindo a inclusão de 48 seleções participando pela primeira vez de um Mundial.",
  },
  {
    question: "Qual é o preço do álbum da Copa 2026?",
    answer:
      "O preço varia conforme a edição: álbum brochura R$ 24,90, capa dura simples R$ 49,90, capa dura prata R$ 59,90 e capa dura ouro R$ 79,90. Cada pacotinho com 7 figurinhas custa R$ 7,00. O custo total para completar depende da quantidade de repetidas e trocas realizadas.",
  },
  {
    question: "Quando o álbum da Copa 2026 foi lançado?",
    answer:
      "O álbum da Copa do Mundo 2026 foi lançado em abril de 2026, com pré-vendas iniciadas antes e o lançamento nas lojas físicas a partir de 30 de abril de 2026.",
  },
  {
    question: "Onde posso comprar o álbum da Copa 2026?",
    answer:
      "Você pode comprar o álbum em: lojas de conveniência, bancas de jornal, supermercados, livrarias, lojas especializadas em colecionáveis e plataformas de e-commerce como Amazon e site oficial da Panini.",
  },
  {
    question: "Qual é a melhor estratégia para completar o álbum?",
    answer:
      "A melhor estratégia é combinar compra de pacotinhos com trocas ativas. Use plataformas como Figurinha Fácil para encontrar colecionadores perto de você e trocar figurinhas repetidas. Isso reduz o custo final em até 60% em relação a comprar apenas pacotinhos.",
  },
  {
    question: "Quanto tempo leva para completar o álbum?",
    answer:
      "O tempo depende de quanto você investe e como negocia trocas. Quem compra sistematicamente leva entre 2-6 meses. Com trocas ativas, alguns conseguem em 1-3 meses. Há casos de colecionadores que gastam mais tempo em busca das figurinhas mais raras.",
  },
  {
    question: "O que são figurinhas especiais ou holográficas?",
    answer:
      "São 68 figurinhas com efeitos especiais, como holografia, relevo ou brilho. São mais raras nos pacotinhos e muito buscadas por colecionadores. Algumas versões especiais (ouro, prata) foram incluídas pela primeira vez na edição 2026.",
  },
];

const comparison = [
  {
    name: "Edição 2022 (Catar)",
    stickers: 682,
    special: 15,
    description: "Edição anterior do Mundial",
  },
  {
    name: "Edição 2026 (Atual)",
    stickers: 980,
    special: 68,
    description: "Maior edição da história",
  },
  {
    name: "Edição 2018 (Rússia)",
    stickers: 681,
    special: 15,
    description: "Segunda maior edição",
  },
];

const collectingTips = [
  {
    icon: TrendingUp,
    title: "Compre em Pacotinhos Estratégicos",
    description:
      "Não estique para o final quando repetidas explodem. Comece a comprar regularmente e combinar com trocas a partir da metade.",
  },
  {
    icon: Users,
    title: "Use Plataformas de Troca",
    description:
      "Figurinha Fácil conecta colecionadores próximos. Trocar é a forma mais econômica de completar o álbum.",
  },
  {
    icon: Award,
    title: "Foque em Figurinhas Raras",
    description:
      "Comece a procurar pelas 68 especiais cedo. Ficam mais difíceis de encontrar conforme avança a temporada.",
  },
  {
    icon: BookOpen,
    title: "Organize Seu Inventário",
    description:
      "Mantenha registro das figurinhas que tem e faltam. Isso facilita negociações e evita compras duplicadas.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  {
    name: "Guia Completo: Álbum Figurinhas Copa Mundo 2026",
    url: ARTICLE_URL,
  },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline:
    "Guia Completo: Álbum de Figurinhas da Copa do Mundo 2026 - Tudo que Você Precisa Saber",
  description:
    "Descubra tudo sobre o álbum da Copa do Mundo 2026: história, especificações, 980 figurinhas, preço, onde comprar e estratégias de coleta.",
  image: `${BASE_URL}/og-image.png`,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
  author: {
    "@type": "Organization",
    name: SITE_NAME,
  },
};

export default function GuiaCompleto() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={articleSchema} />

      <LandingHeader />

      <main className="flex-1">
        <article className="w-full">
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16 lg:py-20">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Copa do Mundo 2026</Badge>
                  <Badge variant="secondary">Álbum Figurinhas</Badge>
                  <Badge variant="secondary">Guia Completo</Badge>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                  Guia Completo: Álbum de Figurinhas da Copa do Mundo 2026
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Tudo que você precisa saber sobre o álbum oficial: história,
                  especificações, 980 figurinhas, preço, onde comprar e
                  estratégias para completar a coleção.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>12 min de leitura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <time dateTime={PUBLISHED_AT}>
                      {new Date(PUBLISHED_AT).toLocaleDateString("pt-BR")}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              {/* O que é */}
              <section>
                <h2>O que é o Álbum da Copa do Mundo 2026?</h2>
                <p>
                  O álbum da Copa do Mundo 2026 é a coleção oficial de
                  figurinhas produzida pela Panini para acompanhar o torneio de
                  futebol mais importante do planeta. Esse é um produto
                  tradicional que existe desde 1970 e faz parte da história
                  cultural das Copas do Mundo.
                </p>
                <p>
                  Colecionadores de todas as idades compram pacotinhos de
                  figurinhas para colar em um álbum especialmente criado para a
                  edição 2026. Cada figurinha representa um jogador, técnico,
                  seleção ou momento importante do torneio, tornando a coleta
                  uma atividade social e nostalgia envolvente.
                </p>
                <p>
                  A edição 2026 é especial por ser o primeiro Mundial com 48
                  seleções participando (em vez de 32), o que resultou na maior
                  quantidade de figurinhas da história das Copas: 980 figurinhas
                  no total.
                </p>
              </section>

              {/* História */}
              <section>
                <h2>História dos Álbuns de Figurinhas da Copa</h2>
                <p>
                  A tradição dos álbuns de figurinhas começou em 1970, durante a
                  Copa do Mundo no México. Desde então, a Panini se tornou a
                  produtora oficial, acompanhando cada edição do torneio.
                </p>
                <p>
                  Cada Copa traz inovações: diferentes formatos, figurinhas
                  especiais, versões de capa dura e edições limitadas. A
                  coleção virou um fenômeno cultural no Brasil e em vários
                  países, com pessoas de todas as idades trocando figurinhas nas
                  ruas, escolas e comunidades.
                </p>
                <p>
                  O álbum da Copa 2026 marca um ponto importante na história:
                  é o primeiro com 48 seleções, gerando a maior edição já
                  produzida.
                </p>
              </section>

              {/* Especificações */}
              <section>
                <h2>Especificações do Álbum Copa 2026</h2>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Números da Edição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Total de Figurinhas
                          </p>
                          <p className="text-3xl font-bold">980</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Figurinhas Especiais
                          </p>
                          <p className="text-3xl font-bold">68</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Seleções Participando
                          </p>
                          <p className="text-3xl font-bold">48</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Figurinhas por Pacote
                          </p>
                          <p className="text-3xl font-bold">7</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <h3>Comparação com Edições Anteriores</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                          <th className="p-3 text-left font-semibold">Edição</th>
                          <th className="p-3 text-center font-semibold">
                            Total
                          </th>
                          <th className="p-3 text-center font-semibold">
                            Especiais
                          </th>
                          <th className="p-3 text-left font-semibold">
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparison.map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-slate-100 dark:border-slate-700"
                          >
                            <td className="p-3 font-medium">{item.name}</td>
                            <td className="p-3 text-center">{item.stickers}</td>
                            <td className="p-3 text-center">{item.special}</td>
                            <td className="p-3 text-slate-600 dark:text-slate-400">
                              {item.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Preço */}
              <section>
                <h2>Quanto Custa o Álbum da Copa 2026?</h2>
                <p>
                  O preço varia conforme a edição e o tipo de álbum escolhido:
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Álbum Brochura</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        R$ 24,90
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Versão básica com capa comum
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capa Dura</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        R$ 49,90
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Versão resistente com capa dura
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capa Dura Prata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        R$ 59,90
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Edição especial com acabamento prata
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Capa Dura Ouro</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        R$ 79,90
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Edição premium com acabamento ouro
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="my-6 rounded-lg bg-blue-50 p-4 dark:bg-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Preço dos Pacotinhos
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    R$ 7,00 por pacote (7 figurinhas)
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Estes são os valores praticados em bancas e lojas física no
                    Brasil a partir de abril de 2026.
                  </p>
                </div>
              </section>

              {/* Onde comprar */}
              <section>
                <h2>Onde Comprar o Álbum da Copa 2026</h2>
                <p>
                  O álbum está disponível em diversos canais de distribuição:
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold">Lojas de Conveniência</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        7-Eleven, Extra, Circle K e similares
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold">Bancas e Jornais</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Bancas tradicionais de jornal e revistas
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold">Supermercados</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Seções de colecionáveis ou brinquedos
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold">E-commerce</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Amazon, Mercado Livre, site da Panini
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-semibold">Lojas Especializadas</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Lojas de colecionáveis e card shops
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-6 rounded-lg bg-amber-50 p-4 dark:bg-slate-800">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <p className="font-semibold">Dica Importante</p>
                      <p>
                        Se não encontrar em lojas físicas próximas, o e-commerce
                        oferece mais opções e até promoções em grandes volumes.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Figurinhas Especiais */}
              <section>
                <h2>Figurinhas Especiais e Holográficas</h2>
                <p>
                  Das 980 figurinhas, 68 são especiais e muito mais raras nos
                  pacotinhos. Essas figurinhas têm efeitos visuais diferentes:
                </p>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tipos de Especiais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-semibold">Holográficas</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Com efeito holográfico que muda de cor com a luz
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Relevo</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Com textura em relevo na superfície
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Edições Limitadas</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Versões raras com acabamentos premium (ouro, prata)
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Personagens Icônicos</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Maiores astros do futebol com designs especiais
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <p className="mt-4">
                  As figurinhas especiais são as mais procuradas pelos
                  colecionadores e frequentemente aparecem em negociações e
                  trocas com prêmios especiais.
                </p>
              </section>

              {/* Dicas de Coleta */}
              <section>
                <h2>Dicas para Colecionar Figurinhas da Copa 2026</h2>
                <p>
                  Completar um álbum com 980 figurinhas é um desafio! Aqui estão
                  estratégias para tornar a coleta mais eficiente e econômica:
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  {collectingTips.map((tip, idx) => {
                    const Icon = tip.icon;
                    return (
                      <Card key={idx}>
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <CardTitle className="text-lg">{tip.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {tip.description}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2>Perguntas Frequentes sobre o Álbum Copa 2026</h2>
                <div className="space-y-4">
                  {FAQS.map((faq, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          {faq.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 dark:text-slate-400">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <section className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <h2 className="text-2xl font-bold">
                  Comece Sua Coleção Agora!
                </h2>
                <p className="mt-2 text-blue-100">
                  O álbum da Copa do Mundo 2026 já está disponível nas lojas.
                  Não perca a oportunidade de fazer parte dessa coleção
                  histórica. Use as dicas deste guia e comece sua jornada como
                  colecionador.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="/blog">
                    <Button
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Ler Mais Artigos
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
                    >
                      Encontrar Figurinhas
                    </Button>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>

      <LandingFooter />
    </>
  );
}
