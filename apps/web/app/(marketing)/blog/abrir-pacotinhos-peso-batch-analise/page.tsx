import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Scale,
  PackageCheck,
  BarChart3,
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

const ARTICLE_PATH = "/blog/abrir-pacotinhos-peso-batch-analise";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-07T14:00:00Z";
const MODIFIED_AT = "2026-05-07T14:00:00Z";

export const metadata: Metadata = {
  title:
    "Abrir Pacotinhos Não É Só Sorte: Como Analisar Peso, Batch e Duplicadas",
  description:
    "Descubra como colecionadores usam peso de pacotes, análise de batch e controle de duplicadas para economizar e encontrar figurinhas raras. Estratégias reais para o álbum da Copa 2026.",
  keywords: [
    "peso pacote figurinha",
    "como abrir pacotinhos Copa 2026",
    "batch figurinha Panini",
    "duplicadas álbum Copa",
    "figurinhas raras peso",
    "estratégia colecionar figurinhas",
    "analise pacotinho figurinha",
    "dicas abrir pacotes Copa 2026",
  ],
  openGraph: {
    title: "Abrir Pacotinhos Não É Só Sorte: Análise de Peso, Batch e Duplicadas",
    description:
      "Colecionadores de figurinhas estão usando balança, planilha e lógica para bater a sorte. Veja como funciona.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Dicas de Colecionador",
      "Pacotinhos",
      "Batch",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abrir Pacotinhos Não É Só Sorte: Estratégia de Peso e Batch",
    description:
      "Colecionadores usam balança e dados para encontrar figurinhas raras. Veja como.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Dá para saber se um pacote tem figurinha rara pelo peso?",
    answer:
      "Não é garantia, mas dá pista. Pacotes normais de 7 figurinhas pesam cerca de 4,8g a 4,9g. Se um pacote pesa 5,3g ou mais, pode ter um cartão promocional, uma figurinha especial ou até uma legenda. Por isso vendedores às vezes removem os pacotes mais pesados antes de vender o resto.",
  },
  {
    question: "Por que comprar kits lacrados é mais seguro?",
    answer:
      "Pacotes soltos podem ser pesados, manuseados e filtrados antes de chegar até você. Um kit lacrado vindo da loja oficial ou de um vendedor confiável protege contra essa seleção. Você ainda pode tirar um batch fraco, mas pelo menos ninguém tirou os melhores pacotes antes.",
  },
  {
    question: "O que é batch no contexto de figurinhas?",
    answer:
      "Batch é o lote de produção. Cada lote tem uma distribuição diferente de figurinhas. Alguns batches têm mais duplicadas, outros têm mais especiais. Colecionadores que anotam de qual batch vieram seus pacotes conseguem identificar padrões e evitar lotes ruins no futuro.",
  },
  {
    question: "Como evitar duplicadas no álbum da Copa 2026?",
    answer:
      "Não dá para evitar completamente, mas dá para controlar. A melhor estratégia é: compre poucos pacotes por vez, cadastre tudo que você tem (repetidas e faltantes) em uma plataforma de troca, e troque antes de comprar mais. Quanto mais você troca, menos dinheiro joga fora em repetidas.",
  },
  {
    question: "As figurinhas com corte torto valem menos?",
    answer:
      "Colecionadores mais exigentes consideram defeitos de corte como problema. Figurinhas com bordas desiguais ou cortes tortos perdem valor para quem busca itens em estado de conservação perfeito. Se você planeja trocar ou vender, prefira as bem cortadas.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Análise de pacotinhos e batch", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Abrir Pacotinhos Não É Só Sorte: Como Analisar Peso, Batch e Duplicadas",
  description:
    "Guia prático sobre como colecionadores usam peso de pacotes, análise de batch e controle de duplicadas para otimizar a coleta de figurinhas da Copa do Mundo 2026.",
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
    "peso pacote figurinha",
    "batch figurinha",
    "duplicadas album copa",
    "estratégia colecionar",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function AnalisePacotinhosArticlePage() {
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
                Análise de pacotinhos e batch
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Estratégia de Colecionador
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Abrir pacotinhos não é só sorte:{" "}
              <span className="text-gradient-primary">
                como analisar peso, batch e duplicadas
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Colecionar figurinhas virou um jogo de dados. Quem anota peso de
              pacote, identifica batch e controla duplicadas gasta menos e
              completa o álbum da Copa 2026 mais rápido.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 07/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 7 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado em 07/05/2026</span>
            </div>
          </div>
        </section>

        {/* Lead */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <div className="space-y-6 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p className="text-xl md:text-2xl text-[var(--on-surface)] font-medium leading-relaxed">
              Abrir um pacotinho de figurinha ainda dá aquela adrenalina. Mas
              quando cada envelope custa caro e as especiais escondem em lotes
              específicos, o colecionador que confia só na sorte está
              queimando dinheiro.
            </p>

            <p>
              A boa notícia é que dá para coletar de forma inteligente. Não
              precisa ser expert em estatística. Só precisa anotar peso, origem,
              duplicadas e padrões. Aqui mostro como funciona na prática, com
              base em 24 pacotes lacrados comprados direto da Panini.
            </p>
          </div>
        </section>

        {/* Por que lacrado importa */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Lacrado não garante raridade, mas garante justiça
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Pacotes soltos são perigosos. Alguém pode ter pesado, manuseado
              ou filtrado antes de colocar à venda. Se figurinhas raras alteram
              o peso do pacote (e alteram), quem vende pacotes avulsos tem
              incentivo para tirar os melhores e deixar os comuns para você.
            </p>
            <p>
              Um kit lacrado direto da loja oficial não te promete uma legenda,
              mas te promete que ninguém mexeu ali antes. Esse detalhe muda
              completamente o jogo de confiança para quem coleciona.
            </p>
          </div>
        </section>

        {/* Cards de conceitos */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Scale
                      className="h-6 w-6 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Peso do pacote</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[var(--on-surface-variant)]">
                  Pacotes com 7 figurinhas costumam pesar 4,8g a 4,9g. Pacotes
                  acima de 5,3g podem ter promo, especial ou legenda.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <PackageCheck
                      className="h-6 w-6 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Kit lacrado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[var(--on-surface-variant)]">
                  Comprar kits lacrados de lojas oficiais protege contra
                  manipulação externa. É a forma mais justa de abrir pacotes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3
                      className="h-6 w-6 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  </div>
                  <CardTitle className="text-lg">Análise de batch</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[var(--on-surface-variant)]">
                  Cada lote de produção tem padrões diferentes. Anotar o batch
                  ajuda a evitar lotes com muitas duplicadas ou poucas
                  especiais.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* O que a balança revelou */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O que a balança revelou
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Os pacotes antigos vinham com 7 figurinhas mais um cartão
              promocional do álbum virtual. Por isso pesavam mais. Os novos
              pacotes analisados ficaram entre 4,8g e 4,9g, o que indica 7
              figurinhas sem o cartão promocional.
            </p>
            <p>
              Qualquer pacote acima de 5,3g deveria levantar uma bandeira
              vermelha. Pode ter promo, pode ter algo especial, pode ter uma
              legenda. O problema é que vendedores de pacotes soltos já sabem
              disso. Eles pesam, separam os mais pesados e vendem os leves para
              quem não presta atenção.
            </p>
            <p>
              Por isso colecionar deixou de ser só sobre sorte. Virou gestão de
              probabilidades. Quem ignora o peso paga preço cheio por odds
              piores.
            </p>
          </div>
        </section>

        {/* O que saiu nos 24 pacotes */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O que saiu nos 24 pacotes
          </h2>
          <div className="space-y-6 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              A abertura trouxe várias figurinhas do Brasil: Bruno Guimarães,
              Danilo, Paquetá, Bento, Estêvão. Essa é a parte divertida. Mesmo
              sem legendas, uma boa sequência do seu time nacional já faz o
              pacotinho valer a pena emocionalmente.
            </p>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Os problemas que apareceram
              </h3>
              <p>
                Algumas figurinhas brilhantes vieram com cortes feios. Bordas
                desiguais, acabamento torto. Para quem coleciona pensando em
                valorização ou troca, isso é frustrante. Uma figurinha mal
                cortada perde apelo visual e pode perder valor.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                O que não apareceu
              </h3>
              <p>
                Nenhuma figurinha de perfil. Nenhuma especial FW. Nenhuma
                legenda. Nem códigos do álbum virtual. Isso sugere que o batch
                era um lote inicial ou um lote com poucos tipos de inserção
                especial.
              </p>
            </div>
          </div>
        </section>

        {/* A lição */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            A lição real
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Lacrado não quer dizer cheio de raridades. Só quer dizer seguro.
              Um kit lacrado protege contra manipulação externa, mas não protege
              contra um batch fraco. A Panini pode colocar menos especiais em
              determinados lotes e você só vai descobrir isso depois de abrir
              dezenas de pacotes.
            </p>
            <p>
              O melhor movimento é anotar tudo. Peso do pacote. Número do batch.
              Duplicadas que saíram. Figurinhas que faltam. Cortes bons e ruins.
              Com tempo, esses dados formam um mapa que ajuda você a comprar
              melhor e trocar mais rápido.
            </p>
          </div>
        </section>

        {/* Como aplicar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como aplicar isso no seu álbum da Copa 2026
          </h2>
          <div className="space-y-6 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Compre kits lacrados de fontes confiáveis
              </h3>
              <p>
                Evite pacotes soltos de vendedores desconhecidos. Prefira lojas
                oficiais, grandes varejistas ou kits lacrados com selo de
                autenticidade. O preço pode ser um pouco maior, mas as odds
                compensam.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Use uma balança de precisão
              </h3>
              <p>
                Uma balança de cozinha digital que mede até 0,1g já serve.
                Pese cada pacote antes de abrir e anote o peso junto com o
                resultado. Em poucas semanas você vai ver padrões.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Cadastre duplicadas e faltantes imediatamente
              </h3>
              <p>
                Não deixe figurinhas acumularem gaveta. Assim que abrir, cadastre
                o que repetiu e o que falta. Quanto mais rápido você trocar,
                menos pacotes precisa comprar depois.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--on-surface)]">
                Compare batches
              </h3>
              <p>
                Anote de qual lote vieram seus pacotes. Se um batch deu muitas
                duplicadas e poucas especiais, evite comprar daquele lote
                novamente. Se outro batch foi generoso, fique de olho.
              </p>
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
            Perguntas frequentes
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
                    Simulações de preço e estratégias para economizar até 70%
                    usando trocas inteligentes.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/fim-era-panini-fifa-fanatics-topps">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Fim da era Panini na FIFA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    A FIFA trocou a Panini pela Fanatics/Topps após 60 anos.
                    Entenda o que muda para colecionadores.
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
                Troque figurinhas com quem falta o que você tem
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                No Encontro de Figurinhas você cadastra suas duplicadas e
                faltantes, encontra colecionadores perto de você e troca
                presencialmente. Menos pacotes comprados, mais álbum completo.
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
