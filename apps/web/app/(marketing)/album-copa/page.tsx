import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  DollarSign,
  Sparkles,
  Trophy,
  Star,
  Package,
  TrendingUp,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateCombinedSchema,
  generateSportsEventSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum da Copa 2026 possui 980 figurinhas no total, sendo 912 figurinhas regulares e 68 figurinhas especiais metalizadas. É o maior álbum de Copa do Mundo já lançado pela Panini.",
  },
  {
    question: "Qual é o preço do álbum da Copa 2026?",
    answer:
      "O álbum brochura custa R$ 24,90, o de capa dura R$ 79,90, e os envelopes com 7 figurinhas custam R$ 7,00. A caixa com 100 pacotes sai por aproximadamente R$ 700,00 e completa cerca de 80% do álbum.",
  },
  {
    question: "Qual é o custo total para completar o álbum?",
    answer:
      "O custo estimado para completar o álbum sem trocar figurinhas é de aproximadamente R$ 4.500,00. Porém, participar de grupos de troca reduz significativamente esse custo.",
  },
  {
    question: "Quais são as figurinhas mais raras do álbum?",
    answer:
      'As figurinhas douradas são as mais raras, especialmente as de jogadores lendários como Messi Gold, Neymar Gold e Vinicius Júnior Gold. Algumas chegam a ser vendidas por mais de R$ 15.000,00 no mercado paralelo.',
  },
  {
    question: "Como montar um álbum da Copa 2026?",
    answer:
      "Você pode montar de forma tradicional comprando envelopes e colando as figurinhas, usar planilhas digitais para controlar quais figurinhas possui, ou aproveitar o aplicativo oficial da Panini que permite criar versões personalizadas.",
  },
  {
    question: "Onde encontrar figurinhas para trocar?",
    answer:
      "Você pode participar de grupos de troca em shoppings e praças, encontrar colecionadores online através de plataformas como Figurinha Fácil, ou trocar com amigos. As comunidades de troca cresceram muito com a era digital.",
  },
];

const STEPS = [
  {
    title: "Escolha a versão do álbum",
    description:
      "Selecione entre álbum brochura (R$ 24,90), capa dura tradicional (R$ 79,90), ou capa metalizada (versão Premium). Cada versão tem o mesmo espaço para 980 figurinhas.",
  },
  {
    title: "Comece a coletar figurinhas",
    description:
      "Compre envelopes com 7 figurinhas por R$ 7,00 em bancas, lojas e marketplaces. Ou aproveite para trocar com outros colecionadores para economizar.",
  },
  {
    title: "Cole as figurinhas no álbum",
    description:
      "Cole cada figurinha no seu lugar correto. Use uma planilha de controle para acompanhar quais figurinhas já possui e quais ainda faltam.",
  },
  {
    title: "Troque figurinhas repetidas",
    description:
      "Participe de grupos de troca em sua cidade ou use plataformas digitais para encontrar colecionadores que têm as figurinhas que você precisa.",
  },
  {
    title: "Complete seu álbum",
    description:
      "Continue coletando e trocando até conseguir todas as 980 figurinhas, incluindo as 68 especiais metalizadas. Celebre a conclusão do seu álbum!",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Guia do Álbum Copa 2026" },
]);

const webPageSchema = generateWebPageSchema({
  url: `${BASE_URL}/album-copa`,
  name: "Guia Completo do Álbum Copa 2026 | Figurinha Fácil",
  description:
    "Tudo o que você precisa saber sobre o álbum da Copa do Mundo 2026: preços, quantas figurinhas, como montar, figurinhas especiais e raras.",
});

const faqSchema = generateFAQSchema(FAQS);

const howToSchema = generateHowToSchema(
  "Como Montar o Álbum da Copa 2026",
  "Guia passo a passo para coletar, colar e completar o álbum de figurinhas da Copa do Mundo 2026.",
  STEPS
);

const combinedSchema = generateCombinedSchema([
  webPageSchema,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  generateSportsEventSchema(),
]);

export const metadata: Metadata = {
  title:
    "Guia Completo do Álbum da Copa 2026: Preços, Figurinhas e Como Montar",
  description:
    "Tudo sobre o álbum da Copa do Mundo 2026: 980 figurinhas, preços, versões, figurinhas raras, dicas de troca e custo total. Guia completo para colecionadores.",
  keywords: [
    "álbum Copa 2026",
    "figurinhas Copa do Mundo 2026",
    "como montar álbum Copa",
    "figurinhas especiais Copa",
    "preço álbum Copa",
    "figurinhas douradas Copa",
    "troca de figurinhas",
    "coleção Copa 2026",
    "álbum Panini Copa 2026",
  ],
  openGraph: {
    title:
      "Guia Completo do Álbum da Copa 2026: Preços, Figurinhas e Como Montar",
    description:
      "Tudo sobre o álbum da Copa do Mundo 2026: 980 figurinhas, preços, versões, figurinhas raras, dicas de troca e custo total.",
    url: `${BASE_URL}/album-copa`,
    type: "article",
    locale: "pt_BR",
  },
  twitter: {
    title:
      "Guia Completo do Álbum da Copa 2026: Preços, Figurinhas e Como Montar",
    description:
      "Tudo sobre o álbum da Copa do Mundo 2026: 980 figurinhas, preços, versões, figurinhas raras, dicas de troca.",
    card: "summary_large_image",
  },
  alternates: {
    canonical: `${BASE_URL}/album-copa`,
  },
};

export default function AlbumCopaPage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={[{ label: "Guia do Álbum Copa 2026" }]} className="mb-8" />

            <div className="max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-primary" />
                <Badge variant="secondary">Guia Completo 2026</Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Tudo sobre o{" "}
                <span className="text-primary">Álbum da Copa 2026</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Guia completo com preços, quantidade de figurinhas, versões disponíveis,
                figurinhas especiais e raras, além de dicas para economizar na sua coleção.
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="text-sm py-1.5 px-3">
                  <Sparkles className="h-4 w-4 mr-1" />
                  980 figurinhas
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-1.5 px-3 text-yellow-600 border-yellow-600"
                >
                  <Star className="h-4 w-4 mr-1 fill-yellow-600" />
                  68 especiais
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-1.5 px-3 text-emerald-600 border-emerald-600"
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +10.900% buscas
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Key Stats Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Total Figurinhas</h3>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-2">980</p>
                <p className="text-sm text-muted-foreground">
                  Maior álbum de Copa já lançado
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Especiais</h3>
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <p className="text-3xl font-bold text-yellow-600 mb-2">68</p>
                <p className="text-sm text-muted-foreground">
                  Figurinhas metalizadas raras
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Preço Álbum</h3>
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-emerald-600 mb-2">R$ 24,90</p>
                <p className="text-sm text-muted-foreground">
                  Versão brochura
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Custo Total</h3>
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">~R$ 4.500</p>
                <p className="text-sm text-muted-foreground">
                  Sem trocas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <section className="mb-12">
                <h2 className="text-3xl font-headline font-bold mb-6">
                  O Que É o Álbum da Copa 2026?
                </h2>
                <p className="text-muted-foreground mb-4">
                  O álbum da Copa do Mundo 2026 é a coleção oficial de figurinhas Panini
                  lançada para acompanhar o torneio que será realizado em junho e julho de
                  2026 nos Estados Unidos, México e Canadá. É uma tradição que envolve milhões
                  de colecionadores em todo o mundo.
                </p>
                <p className="text-muted-foreground mb-4">
                  Com 980 figurinhas divididas em 112 páginas, é o maior álbum de Copa do
                  Mundo já produzido, refletindo a expansão do torneio para 48 seleções
                  participantes (antes eram 32).
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-headline font-bold mb-6">
                  Versões e Preços Disponíveis
                </h2>
                <p className="text-muted-foreground mb-6">
                  A Panini oferece diferentes versões do álbum para atender todos os tipos de
                  colecionadores:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                    <h3 className="font-semibold mb-2">Álbum Brochura</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ 24,90 - A opção mais acessível. Capa mole, perfeita para quem quer
                      economizar mas manter a experiência clássica de completar um álbum.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-blue-600">
                    <h3 className="font-semibold mb-2">Álbum Capa Dura</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ 79,90 - Versão tradicional com capa dura que oferece melhor proteção
                      para suas figurinhas.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-yellow-600">
                    <h3 className="font-semibold mb-2">Álbum Premium</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ 359,90 (Box) - Capa metalizada com acabamento especial + 40 envelopes
                      de figurinhas. A edição de luxo para colecionadores entusiastas.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-emerald-600">
                    <h3 className="font-semibold mb-2">Envelopes</h3>
                    <p className="text-sm text-muted-foreground">
                      R$ 7,00 cada (7 figurinhas por envelope) - Caixa com 100 pacotes custa
                      aproximadamente R$ 700,00 e completa cerca de 80% do álbum.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-headline font-bold mb-6">
                  Composição do Álbum
                </h2>
                <p className="text-muted-foreground mb-6">
                  O álbum da Copa 2026 é composto por:
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">912 Figurinhas Regulares</p>
                      <p className="text-sm text-muted-foreground">
                        Jogadores, escudos e fotos dos elencos de cada seleção
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">68 Figurinhas Especiais</p>
                      <p className="text-sm text-muted-foreground">
                        Metalizadas, com acabamento especial: 48 escudos de seleções, 16 estádios,
                        4 cromos institucionais
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">112 Páginas</p>
                      <p className="text-sm text-muted-foreground">
                        Organizado por seleção, com espaços para cada figurinha
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-headline font-bold mb-6">
                  Figurinhas Raras e Especiais
                </h2>
                <p className="text-muted-foreground mb-6">
                  Nem todas as figurinhas têm a mesma probabilidade de serem encontradas. As
                  mais raras são as figurinhas douradas (Gold) de jogadores lendários:
                </p>

                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                    Figurinhas Douradas (Gold)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    As mais procuradas e caras do mercado. Jogadores como Messi Gold, Neymar
                    Gold e Vinicius Júnior Gold são consideradas o "Santo Graal" do álbum.
                  </p>
                  <p className="text-sm font-semibold text-yellow-600">
                    Preço no mercado paralelo: até R$ 15.000,00 por figurinha
                  </p>
                </div>

                <p className="text-muted-foreground">
                  A taxa de obtenção de figurinhas douradas é muito baixa, tornando-as
                  extremamente valiosas para colecionadores. Encontrar uma figurinha dourada
                  em um envelope é tão raro quanto ganhar na loteria!
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-headline font-bold mb-6">
                  Custo Total para Completar o Álbum
                </h2>
                <p className="text-muted-foreground mb-6">
                  O custo estimado para completar 100% do álbum sem trocar nenhuma figurinha é
                  de aproximadamente{" "}
                  <span className="font-semibold text-primary">R$ 4.500,00</span>.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 mb-6 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-semibold">Dica importante:</span> Participar de
                    grupos de troca em shoppings, praças e plataformas digitais reduz
                    drasticamente esse custo. A regra de ouro é: nunca compre figurinhas
                    avulsas em sites de leilão antes do fim da Copa, pois o preço tende a
                    cair significativamente após o torneio.
                  </p>
                </div>

                <p className="text-muted-foreground">
                  Comprar uma caixa fechada de 100 pacotes (cerca de R$ 700,00) é mais
                  inteligente, pois garante aproximadamente 80% do álbum com poucas repetidas.
                  Depois é questão de trocar o restante.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-headline font-bold mb-6">
                  Tendências de Busca
                </h2>
                <p className="text-muted-foreground mb-4">
                  O crescimento de interesse pelo álbum da Copa 2026 é impressionante. Dados
                  mostram um aumento de{" "}
                  <span className="font-semibold text-primary">10.900%</span> nas pesquisas por
                  "álbum da Copa 2026" entre abril de 2025 e março de 2026.
                </p>

                <p className="text-muted-foreground mb-4">
                  Em apenas 11 meses, o termo acumulou cerca de{" "}
                  <span className="font-semibold">868 mil pesquisas</span> no Brasil, indicando
                  que colecionadores estão se antecipando ao torneio.
                </p>

                <p className="text-muted-foreground">
                  Estados como Distrito Federal, São Paulo e Santa Catarina lideram em volume
                  de buscas. Esse crescimento reflete como a experiência de colecionar
                  figurinhas migrou para o ambiente digital, com mais pessoas buscando
                  informações, preços e formas de trocar online.
                </p>
              </section>
            </div>
          </div>
        </article>

        {/* How To Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-headline font-bold mb-12 text-center">
              Como Montar Seu Álbum: Passo a Passo
            </h2>

            <div className="space-y-6">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-6 border flex gap-6"
                >
                  <div className="flex items-start flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-headline font-bold mb-12">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              {FAQS.map((faq, index) => (
                <details
                  key={index}
                  className="bg-muted/50 rounded-lg p-6 border cursor-pointer group"
                >
                  <summary className="flex items-center justify-between font-semibold text-foreground hover:text-primary transition-colors">
                    <span>{faq.question}</span>
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-4">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
              Comece a Colecionar Agora
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre suas figurinhas faltantes e encontre colecionadores para trocar. Completa
              seu álbum muito mais rápido e economiza!
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
