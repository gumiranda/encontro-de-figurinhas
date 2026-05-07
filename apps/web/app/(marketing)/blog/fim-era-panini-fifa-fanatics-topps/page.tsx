import { JsonLd } from "@/components/json-ld";
import {
  BASE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
} from "@/lib/seo";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { AlertCircle, ArrowRight, Globe, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const ARTICLE_PATH = "/blog/fim-era-panini-fifa-fanatics-topps";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-07T12:00:00Z";
const MODIFIED_AT = "2026-05-07T12:00:00Z";

export const metadata: Metadata = {
  title: "Fim de uma era: FIFA troca Panini pela Fanatics e Topps para Copas do Mundo",
  description:
    "A FIFA encerrou 60 anos de parceria com a Panini. A Fanatics, dona da Topps, assume os álbuns e cards da Copa do Mundo a partir de 2031. Entenda o que muda.",
  keywords: [
    "FIFA Panini Fanatics Topps",
    "fim parceria Panini FIFA",
    "novo álbum figurinhas Copa do Mundo",
    "Fanatics Collectibles Topps",
    "álbum de figurinhas 2031",
    "troca de figurinhas Copa",
    "colecionáveis futebol FIFA",
  ],
  openGraph: {
    title: "Fim de uma era: FIFA troca Panini pela Fanatics e Topps",
    description:
      "Após 60 anos, a FIFA troca a Panini pela Fanatics/Topps nos álbuns e cards da Copa do Mundo. Veja o que muda para colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: ["FIFA", "Panini", "Fanatics", "Topps", "Copa do Mundo", "Álbum de Figurinhas"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fim de uma era: FIFA troca Panini pela Fanatics e Topps",
    description:
      "A FIFA encerrou a parceria com a Panini. A Fanatics assume a partir de 2031.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "A Panini vai parar de fazer álbuns de futebol?",
    answer:
      "Não. A Panini perdeu apenas o licenciamento da FIFA para competições como a Copa do Mundo. Ela continua com álbuns de ligas nacionais, como o Brasileirão, e competições como a Champions League.",
  },
  {
    question: "Quando a Fanatics/Topps começa a produzir os álbuns da Copa?",
    answer:
      "O novo contrato começa a valer integralmente a partir de 2031. Ainda não há informações claras sobre a Copa de 2026, mas 2031 é a data definitiva da transição.",
  },
  {
    question: "O que acontece com os álbuns antigos da Panini?",
    answer:
      "Os álbuns já produzidos pela Panini continuam valendo como colecionáveis. Na verdade, a escassez futura pode aumentar o valor de mercado dos álbuns antigos.",
  },
  {
    question: "A Topps já produz cards de futebol?",
    answer:
      "Sim. A Topps é tradicional em cards de baseball e futebol europeu. A Fanatics comprou a Topps em 2022 justamente para expandir nesse mercado.",
  },
  {
    question: "Isso vai mudar o preço dos pacotinhos no Brasil?",
    answer:
      "Ainda não se sabe. A Fanatics pode adotar uma política de preços diferente, especialmente com o foco em cards como investimento. O álbum de figurinhas pode ganhar versões premium ou integração digital.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Fim da era Panini na FIFA", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Fim de uma era: FIFA troca Panini pela Fanatics e Topps para Copas do Mundo",
  description:
    "Análise da troca de parceria da FIFA com a Panini para a Fanatics/Topps nos álbuns de figurinhas e cards da Copa do Mundo.",
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
    "FIFA Panini Fanatics Topps",
    "álbum de figurinhas Copa do Mundo",
    "cards colecionáveis futebol",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function FimEraPaniniArticlePage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main id="main-content" className="pt-24 min-h-screen text-[var(--on-surface)]">
        {/* Hero */}
        <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[var(--outline)]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[var(--primary)] transition-colors">
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
                Fim da era Panini na FIFA
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Notícia
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Fim de uma era:{" "}
              <span className="text-gradient-primary">
                FIFA troca Panini pela Fanatics e Topps
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Após 60 anos, a FIFA encerrou a parceria com a Panini. A Fanatics, dona da
              Topps, assume os álbuns e cards da Copa do Mundo a partir de 2031. Entenda o
              que muda para quem coleciona.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 07/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 6 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado em 07/05/2026</span>
            </div>
          </div>
        </section>

        {/* Lead */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <div className="space-y-6 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p className="text-xl md:text-2xl text-[var(--on-surface)] font-medium leading-relaxed">
              60 anos. Esse é o tempo que a Panini produziu os álbuns oficiais da Copa do
              Mundo. Desde 1970, abrir um pacotinho da Panini virou ritual para milhões de
              pessoas. Essa história acabou.
            </p>

            <p>
              Nesta quinta-feira, 7 de maio, a FIFA anunciou um acordo de licenciamento
              exclusivo com a Fanatics. A partir de 2031, quem vai produzir os álbuns de
              figurinhas, cards colecionáveis e jogos de cartas das competições da
              entidade é a Fanatics Collectibles, usando a marca Topps.
            </p>
          </div>
        </section>

        {/* O que aconteceu */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl mb-6">
            O que mudou de fato?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              A FIFA assinou com a Fanatics um contrato que vale integralmente a partir de
              2031. Até lá, ainda pode haver algum período de transição, mas a mudança é
              definitiva. A parceria cobre produtos físicos e digitais.
            </p>
            <p>
              A Fanatics comprou a Topps em 2022 por cerca de 500 milhões de dólares. A
              Topps já produz cards de futebol, mas nunca teve o álbum de figurinhas da
              Copa do Mundo. Agora vai ter.
            </p>
          </div>
        </section>

        {/* Cards de impacto */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-[var(--primary)]" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg">Início em 2031</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[var(--on-surface-variant)]">
                  O contrato da Fanatics/Topps começa a valer integralmente em 2031,
                  cobrindo álbuns, cards e jogos de cartas da FIFA.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle
                      className="h-6 w-6 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Fim dos 60 anos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[var(--on-surface-variant)]">
                  A Panini dominou o mercado de colecionáveis da Copa desde 1970. A troca
                  marca o fim de uma das parcerias mais longevas do esporte.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Package
                      className="h-6 w-6 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Físico + Digital</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[var(--on-surface-variant)]">
                  O acordo inclui produtos físicos e digitais. A Fanatics deve investir em
                  apps, integração online e possivelmente cards digitais.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Por que importa */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl   mb-6">
            Por que isso importa?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              A Panini não era só uma fabricante. Era parte da cultura do futebol. O álbum
              da Copa virou tradição no Brasil, México, Argentina e Itália. Colecionar,
              trocar e completar virou rotina de pai para filho.
            </p>
            <p>
              Trocar a Panini pela Fanatics muda quem controla esse mercado. A Fanatics é
              uma gigante americana de comércio esportivo. Ela tem dinheiro,
              infraestrutura digital e vontade de crescer. A pergunta que fica é simples:
              o produto vai continuar com a mesma cara?
            </p>
          </div>
        </section>

        {/* O que muda */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl mb-6">
            O que pode mudar para o colecionador?
          </h2>
          <div className="space-y-6 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Preços e modelos de venda
              </h3>
              <p>
                Nos Estados Unidos, cards esportivos são tratados como investimento. A
                Fanatics pode trazer esse mindset para os álbuns. Isso significa mais
                produtos premium, boxes caros e talvez menos foco no pacotinho barato de
                banca.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Experiência digital
              </h3>
              <p>
                A Fanatics investe pesado em plataformas digitais. É provável que o álbum
                ganhe versão digital, app oficial e integração com cards online. Para quem
                é tradicional, pode ser uma mudança grande. Para quem já usa apps de
                troca, pode ser um avanço.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Distribuição na América Latina
              </h3>
              <p>
                A Topps tem força na Europa e nos EUA. A distribuição no Brasil e na
                América Latina depende de parceiros locais. A Fanatics pode manter a
                estrutura atual ou mudar completamente como o produto chega às bancas e
                lojas.
              </p>
            </div>
          </div>
        </section>

        {/* Copa 2026 */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl   mb-6">
            E o álbum da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O contrato novo só vale a partir de 2031. A Copa de 2026, que será nos
              Estados Unidos, Canadá e México, ainda não tem álbum confirmado. A tendência
              é que 2026 seja o último álbum da Panini no modelo tradicional, ou o início
              de uma transição.
            </p>
            <p>
              Para quem planeja colecionar em 2026, a dica é a mesma: comece cedo, troque
              bastante e não deixe as figurinhas acumularem poeira. O valor sentimental
              desses álbuns só vai crescer.
            </p>
          </div>
        </section>

        {/* Panini agora */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl   mb-6">
            A Panini some?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Não. A Panini continua com licenças importantes. No Brasil, ela produz o
              álbum do Campeonato Brasileiro. Na Europa, mantém contratos com a Champions
              League, Premier League e outras ligas. A empresa perdeu seu produto mais
              icônico, mas não vai sair do mercado.
            </p>
            <p>
              Na verdade, álbuns antigos da Panini podem valorizar. Com a escassez de
              novas edições da Copa sob a marca, itens de coleções passadas tendem a se
              tornar mais raros.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl px-4 sm:px-6 py-12"
        >
          <h2
            id="faq-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl   mb-8"
          >
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">{item.question}</CardTitle>
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
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl   mb-6">
            Conteúdo relacionado
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/blog/quanto-custa-completar-album-copa-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Quanto custa completar o álbum da Copa 2026?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Simulações de preço e estratégias para economizar até 70% usando
                    trocas inteligentes.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/album-copa-do-mundo-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Guia do álbum da Copa 2026
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Tudo sobre o álbum: quantas figurinhas, preços e figurinhas
                    legendárias.
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
              <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl   max-w-2xl mx-auto">
                Continue colecionando, não importa a marca
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                No Encontro de Figurinhas você encontra colecionadores para trocar
                figurinhas e cards perto de você. Panini, Topps ou Fanatics: o que importa
                é completar a coleção.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
                >
                  <Link href="/sign-up">
                    Criar Conta Grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
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
