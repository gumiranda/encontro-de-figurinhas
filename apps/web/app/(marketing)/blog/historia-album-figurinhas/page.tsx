import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Globe,
  Sparkles,
  Trophy,
  Users,
  History,
  Award,
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

const ARTICLE_PATH = "/blog/historia-album-figurinhas";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-17T00:00:00Z";
const MODIFIED_AT = "2026-05-17T00:00:00Z";

export const metadata: Metadata = {
  title:
    "História do Álbum de Figurinhas: Como Tudo Começou com a Panini",
  description:
    "Conheça a fascinante história do álbum de figurinhas desde suas origens até a Copa do Mundo 2026. Descubra como a Panini revolucionou o hobby de colecionadores em todo o mundo.",
  keywords: [
    "história do álbum de figurinhas",
    "origem album figurinhas",
    "história panini figurinhas",
    "como começou coleção figurinhas",
    "evolução álbum figurinhas",
    "primeira copa com álbum",
    "panini história",
    "álbum figurinhas origen",
    "história do hobby figurinhas",
    "panini primeiros álbuns",
  ],
  openGraph: {
    title:
      "História do Álbum de Figurinhas: Origem e Evolução da Panini",
    description:
      "Descubra como o álbum de figurinhas evoluiu ao longo dos anos e se tornou uma paixão global, especialmente durante as Copas do Mundo.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "História",
      "Álbum de Figurinhas",
      "Panini",
      "Colecionismo",
      "Curiosidades",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "História do Álbum de Figurinhas: Origem e Evolução",
    description:
      "Como o álbum de figurinhas se tornou um fenômeno global e cultural.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quando foi criado o primeiro álbum de figurinhas?",
    answer:
      "O primeiro álbum de figurinhas foi lançado na Itália em 1961 pela Panini, inicialmente para o calcio (futebol italiano). A ideia foi revolucionária: colecionadores podiam completar um álbum comprando pacotinhos de figurinhas com imagens dos jogadores. O conceito se expandiu globalmente na década de 1970.",
  },
  {
    question: "Como a Panini começou?",
    answer:
      "A Panini foi fundada em 1960 em Modena, Itália, pela família Panini como uma pequena editora. O lançamento do álbum de figurinhas em 1961 foi um gamble que mudou o mercado de entretenimento infantil para sempre. Hoje, é a maior produtora de álbuns de figurinhas do mundo.",
  },
  {
    question: "Qual foi a primeira Copa do Mundo com álbum de figurinhas?",
    answer:
      "A Panini lançou o primeiro álbum oficial de uma Copa do Mundo em 1970 (México), coincidindo com a transmissão ao vivo de futebol. Este foi um turning point: de um hobby local italiano para um fenômeno global. O álbum de 1970 tinha apenas 408 figurinhas e é hoje um item de colecionador valioso.",
  },
  {
    question: "Por que o álbum de figurinhas ficou tão popular?",
    answer:
      "Três fatores convergiram: (1) modelo de negócio perfeito - você nunca sabe o que vai abrir; (2) socialização - colecionadores trocam figurinhas; (3) timing com Copas do Mundo. A antecipação, a gamificação do completar o álbum, e a oportunidade de trocar com amigos criaram um fenômeno cultural que perdura 60 anos.",
  },
  {
    question: "Quantas Copa do Mundo teve álbum de figurinhas Panini?",
    answer:
      "Desde 1970 até 2026, todas as Copas do Mundo (15 edições) têm álbum oficial Panini. O álbum cresceu em complexidade: começou com 408 figurinhas em 1970, e chegou a 980 em 2026. Cada edição é um marco na história do colecionismo e reflete a evolução do futebol mundial.",
  },
  {
    question: "O álbum de 1970 tem quanto vale hoje?",
    answer:
      "Um álbum original de 1970 completo pode valer entre R$ 5.000 a R$ 20.000, dependendo do estado de conservação. Pacotes originais lacrados dessa época podem alcançar R$ 50.000+. Esses álbuns históricos são considerados relíquias do colecionismo e ganham valor com o tempo.",
  },
];

const copaTimeline = [
  {
    year: "1961",
    title: "Nascimento do Álbum",
    description:
      "Panini lança o primeiro álbum de figurinhas na Itália. Era revolucionário: colecionadores compravam pacotinhos misterio para preencher álbuns com jogadores de futebol.",
    badge: "🇮🇹 Itália",
  },
  {
    year: "1970",
    title: "Primeira Copa com Álbum",
    description:
      "México 1970: Panini lança o primeiro álbum oficial de Copa do Mundo. Tem 408 figurinhas. O álbum se torna um fenômeno global. Bilhões de pacotinhos vendidos em 50+ países simultaneamente.",
    badge: "🌍 Global",
  },
  {
    year: "1974",
    title: "Álbum Vai para Frente",
    description:
      "Copa da Alemanha 1974 consolida a Panini como a líder inquestionável do mercado de figurinhas. Competidoras surgem, mas nenhuma consegue competir com a qualidade de impressão e distribuição.",
    badge: "📈 Consolidação",
  },
  {
    year: "1982",
    title: "Boom na América Latina",
    description:
      "Copa da Espanha 1982: Panini explode em popularidade na América Latina, especialmente Brasil e Argentina. Famílias inteiras colecionam juntas. O álbum vira fenômeno cultural e não apenas comercial.",
    badge: "🔥 Boom",
  },
  {
    year: "2002",
    title: "Figurinhas Raras Estratégicas",
    description:
      "Copa da Coréia/Japão: Panini introduz figurinhas ainda mais raras e valiosas. O modelo evolui: agora tem figurinhas holográficas, edições limitadas e raras que valem centenas de dólares.",
    badge: "✨ Evolução",
  },
  {
    year: "2014",
    title: "Brasil - Quebra de Recordes",
    description:
      "Copa do Brasil 2014: Panini quebra recordes de vendas. O álbum tem 640 figurinhas. O modelo de trocas locais já é consolidado. Surge a cultura do 'completar o álbum' como meta pessoal.",
    badge: "🏆 Recorde",
  },
  {
    year: "2026",
    title: "Era Digital + Offline",
    description:
      "Copa dos EUA 2026: Álbum com 980 figurinhas - o maior da história. Plataformas digitais como Figurinha Fácil permitem trocas automáticas locais. O hobby evolui para omnichannel.",
    badge: "🚀 Futuro",
  },
];

const evolutionStats = [
  {
    metric: "Figurinhas por Álbum",
    data: ["408 (1970)", "500 (1982)", "681 (2018)", "980 (2026)"],
    insight: "O álbum cresceu 140% em 56 anos, acompanhando o crescimento do futebol profissional.",
  },
  {
    metric: "Preço do Pacotinho",
    data: ["0.10€ (1970)", "0.50€ (1990)", "2.50€ (2010)", "7.00 BRL (2026)"],
    insight: "Acompanha a inflação, mas valor permanece acessível para crianças.",
  },
  {
    metric: "Cópias Vendidas por Copa",
    data: ["+2 bilhões pacotes vendidos globalmente", "1 bilhão só na América Latina (2014-2018)", "Estimativa 2026: 2.5+ bilhões"],
    insight: "É o terceiro produto mais vendido em volume nos anos de Copa, atrás apenas de bebidas e alimentos.",
  },
];

export default function HistoriaAlbumFigurinhas() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: "História do Álbum de Figurinhas", url: ARTICLE_URL },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title as string,
    description: metadata.description as string,
    image: `${BASE_URL}/opengraph-image.jpg`,
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
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": ARTICLE_URL,
    },
  };

  const faqSchema = generateFAQSchema(FAQS);

  const combinedSchema = generateCombinedSchema([
    articleSchema,
    breadcrumbSchema,
    faqSchema,
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />

      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative w-full py-16 px-4 sm:py-24">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge className="mx-auto">
              <History className="mr-2 h-4 w-4" />
              Curiosidade da História
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              A Fascinante História do Álbum de Figurinhas
            </h1>

            <p className="text-xl text-muted-foreground">
              Como uma pequena empresa italiana revolucionou o mundo do colecionismo e criou um fenômeno cultural que dura mais de 60 anos
            </p>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Publicado em{" "}
                <time dateTime={PUBLISHED_AT}>17 de maio de 2026</time>
              </p>
            </div>
          </div>
        </section>

        {/* Introdução */}
        <section className="w-full px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed">
                Há mais de 60 anos, a Panini fez uma aposta simples mas genial:
                vender pacotinhos com figurinhas mistério de atletas e times de futebol
                para que colecionadores tentassem completar um álbum. Era um modelo de
                negócio que combinava nostalgia, socialização, azar e realização pessoal
                em um único produto.
              </p>

              <p className="text-lg leading-relaxed">
                Hoje, o álbum de figurinhas é um fenômeno global que fatura bilhões
                de dólares, une gerações de colecionadores e define a cultura popular
                durante as Copas do Mundo. Mas como tudo começou?
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                1961: Quando Tudo Começou
              </h2>

              <p className="text-lg leading-relaxed">
                Antes de serem conhecidos pela Copa do Mundo, a Panini era uma pequena
                empresa editorial italiana fundada em 1960 pela família homônima em Modena.
                Em 1961, lançaram o primeiro álbum de figurinhas focado no calcio (futebol italiano).
              </p>

              <p className="text-lg leading-relaxed">
                A ideia era audaciosa para a época: em vez de vender um álbum completo
                pronto, vendiam pacotinhos com 5-7 figurinhas aleatórias. O colecionador
                nunca sabia qual atleta ia encontrar, criando antecipação e incentivando
                compras repetidas e trocas entre amigos.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                A Revolução de 1970
              </h2>

              <p className="text-lg leading-relaxed">
                O verdadeiro turning point veio em <strong>1970, durante a Copa do Mundo no México</strong>.
              </p>

              <p className="text-lg leading-relaxed">
                Pela primeira vez, a Panini lançou um álbum oficial de Copa do Mundo com 408
                figurinhas dos melhores jogadores do planeta. O timing foi perfeito: a Copa
                de 70 foi a primeira televisionada ao vivo globalmente, e bilhões de pessoas
                assistiam aos jogos simultaneamente.
              </p>

              <p className="text-lg leading-relaxed">
                Enquanto o Pelé marcava gols na tela, crianças em 50+ países abriam pacotinhos
                esperando encontrar suas figurinhas. O álbum deixou de ser um hobby europeu
                e se tornou um <strong>fenômeno global</strong>.
              </p>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-6 my-8">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  📊 Números da Copa de 1970
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-100">
                  <li>• 408 figurinhas no total</li>
                  <li>• ~300 milhões de pacotinhos vendidos globalmente</li>
                  <li>• 50+ países comprando simultaneamente</li>
                  <li>• Preço do pacote: 0,10€ (acessível para crianças)</li>
                  <li>• Hoje: um álbum original completo vale R$ 5.000-20.000</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                A Era de Ouro (1974-2000)
              </h2>

              <p className="text-lg leading-relaxed">
                Após 1970, o álbum de figurinhas se consolidou como o fenômeno cultural
                de cada Copa do Mundo. A Panini enfrentou competição (Merlin, Topps,
                Naipe), mas nenhuma conseguiu combinar impressão de qualidade com
                distribuição global.
              </p>

              <p className="text-lg leading-relaxed">
                Cada Copa trouxe inovações:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>1974 (Alemanha):</strong> Panini consolida domínio europeu</li>
                <li><strong>1982 (Espanha):</strong> Explosão de popularidade na América Latina</li>
                <li><strong>1986 (México):</strong> Panini introduz papel glossy e cores mais vivas</li>
                <li><strong>1994 (EUA):</strong> Primeiras figurinhas holográficas experimentais</li>
                <li><strong>2002 (Coréia/Japão):</strong> Hologramas, ouro e prata em figurinhas raras</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                2002-2014: A Transformação do Hobby
              </h2>

              <p className="text-lg leading-relaxed">
                A partir de 2002, a Panini começou a introduzir <strong>figurinhas raras
                e edições especiais</strong> que valem centenas ou milhares. Isso transformou
                o hobby de uma brincadeira infantil para um investimento real.
              </p>

              <p className="text-lg leading-relaxed">
                O álbum de 2002 tinha figurinhas holográficas de Pelé, Maradona e Ronaldo
                que valiam R$ 500+. O de 2006 introduziu variações de corte e cores de tinta
                que viraram itens de colecionador.
              </p>

              <p className="text-lg leading-relaxed">
                A Copa de 2014 no Brasil foi o boom máximo da Panini:
                o álbum tinha 640 figurinhas, e a cultura de completar o álbum
                trocando com colecionadores se solidificou na América Latina.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">
                2026: Era Digital Encontra Análogo
              </h2>

              <p className="text-lg leading-relaxed">
                A Copa de 2026 marca um novo capítulo: o álbum agora tem <strong>980 figurinhas</strong>
                (o maior da história) e plataformas digitais como o Figurinha Fácil permitem
                trocas automáticas e geolocalizadas.
              </p>

              <p className="text-lg leading-relaxed">
                Você cadastra suas figurinhas repetidas, a plataforma encontra matches
                automáticos com outros colecionadores perto de você, e vocês trocam presencialmente.
                O hobby ganhou uma camada tecnológica sem perder o charm analógico.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="w-full px-4 py-12 sm:py-16 bg-muted/50">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                Timeline: 60 Anos de Evolução
              </h2>
              <p className="text-muted-foreground text-lg">
                Como o álbum de figurinhas evoluiu ao longo das Copas
              </p>
            </div>

            <div className="space-y-4">
              {copaTimeline.map((item, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-3">{item.badge}</Badge>
                        <CardTitle className="text-2xl">{item.year}</CardTitle>
                        <CardDescription className="text-base mt-1">
                          {item.title}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Evolution Stats */}
        <section className="w-full px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                Como o Álbum Evoluiu
              </h2>
              <p className="text-muted-foreground text-lg">
                Mudanças em tamanho, preço e alcance ao longo de 56 anos
              </p>
            </div>

            <div className="space-y-6">
              {evolutionStats.map((stat, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{stat.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {stat.data.map((dataPoint, didx) => (
                        <p
                          key={didx}
                          className="text-sm font-medium text-primary"
                        >
                          {dataPoint}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground border-t pt-4">
                      💡 <strong>Insight:</strong> {stat.insight}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Por que funciona */}
        <section className="w-full px-4 py-12 sm:py-16 bg-muted/50">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                Por Que o Álbum de Figurinhas Funciona?
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <Trophy className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Gamificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Completar o álbum é uma meta clara e atingível. Cada figurinha obtida é um
                    pequeno prêmio. O modelo mantém você comprando até o fim.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Socialização</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Trocar figurinhas com amigos e colegas é a parte social do hobby.
                    Cria comunidades, amizades e memórias.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Sparkles className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Nostalgia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Para gerações, o álbum é associado com infância, Copa do Mundo e
                    momentos especiais. Cria conexão emocional forte.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-6 w-6 text-primary mb-2" />
                  <CardTitle className="text-lg">Raridade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Figurinhas raras valem muito. Transforma o hobby em investimento
                    e colecionismo sério.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="w-full px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">
                Perguntas Frequentes
              </h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full px-4 py-16 sm:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Pronto para Sua Própria História?
            </h2>
            <p className="text-lg opacity-90">
              Você está vivendo a história agora. Complete o álbum da Copa 2026 e
              faça parte de 60 anos de tradição de colecionismo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Começar a Colecionar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20"
                >
                  Ler Mais Artigos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
