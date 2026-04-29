import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, TrendingDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateCombinedSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateSportsEventSchema,
  generateFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

const FAQ_ALBUM = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum oficial Panini da Copa do Mundo FIFA 2026 tem 980 figurinhas no total, sendo 68 delas especiais (incluindo figurinhas douradas e de lendas). O álbum possui 112 páginas mais a capa.",
  },
  {
    question: "Quanto custa completar o álbum Copa 2026 sem trocas?",
    answer:
      "Sem realizar trocas e dependendo da sorte ao abrir os pacotes, o custo pode chegar a R$ 7.362,90 para completar o álbum com 980 figurinhas. O custo mínimo teórico (sem repetidas) é de R$ 1.004,90, mas a realidade estatística é bem mais cara.",
  },
  {
    question: "Quanto custa o álbum e os pacotes de figurinhas?",
    answer:
      "O álbum básico em brochura custa R$ 24,90. Os envelopes de figurinhas custam R$ 7,00 cada um e contêm 7 figurinhas. Versões especiais do álbum (capa dura, prateada ou dourada) variam de R$ 74,90 a R$ 79,90. Há também uma edição premium exclusiva por R$ 359,90.",
  },
  {
    question: "Qual a melhor estratégia para completar o álbum gastando menos?",
    answer:
      "A melhor estratégia é realizar trocas com outros colecionadores. Com um grupo de 10 pessoas trocando, o custo cai para pouco mais de R$ 2.000. Combine trocas até 70-85% de conclusão, depois compre as faltantes. Participar de eventos de trocas em praças e centros comerciais reduz significativamente o gasto total.",
  },
  {
    question: "Quando o álbum da Copa 2026 foi lançado?",
    answer:
      "O álbum oficial Panini da Copa do Mundo 2026 foi lançado no dia 30 de abril de 2026. Os envelopes começaram a ser vendidos nas Loterias Caixa e em outras lojas de todo o Brasil simultaneamente.",
  },
  {
    question: "Quanto mais fácil é completar o álbum com trocas online?",
    answer:
      "As trocas online através de plataformas especializadas tornam o processo muito mais eficiente. Você pode encontrar colecionadores em sua região, fazer matches automáticos baseado no que precisa e o que tem repetido, economizando tempo e dinheiro em comparação com trocas presenciais desorganizadas.",
  },
];

export const metadata: Metadata = {
  title: {
    absolute:
      "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas | FigurinhaFácil",
  },
  description:
    "Guia completo do álbum Copa 2026: 980 figurinhas, custo para completar (R$ 7.362,90 vs R$ 2.000 com trocas), estratégias inteligentes e dicas para economizar. Panini FIFA World Cup 2026.",
  keywords:
    "álbum Copa 2026, figurinhas Copa do Mundo, completar álbum Copa, quantas figurinhas tem o álbum Copa, troca de figurinhas Copa 2026, custo álbum Copa",
  alternates: {
    canonical: `${BASE_URL}/album-copa-2026`,
  },
  openGraph: {
    type: "article",
    url: `${BASE_URL}/album-copa-2026`,
    title: "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas",
    description:
      "Saiba tudo sobre o álbum da Copa 2026: quantas figurinhas tem, quanto custa completar e as melhores estratégias para economizar com trocas.",
    publishedTime: "2026-04-29T00:00:00Z",
    authors: ["FigurinhaFácil"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Álbum Copa do Mundo 2026: 980 Figurinhas | Guia Completo",
    description:
      "Descubra como completar o álbum da Copa 2026 gastando menos de R$ 2.000 com trocas inteligentes.",
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Guia do Álbum Copa 2026" },
]);

const articleSchema = generateArticleSchema(
  "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas",
  "album-copa-2026",
  "Tudo que você precisa saber sobre o álbum da Copa do Mundo 2026: quantidade de figurinhas, custo para completar e estratégias inteligentes para economizar.",
  new Date("2026-04-29").getTime(),
  new Date("2026-04-29").getTime(),
  { name: "FigurinhaFácil" }
);

const faqSchema = generateFAQSchema(FAQ_ALBUM);
const sportsEventSchema = generateSportsEventSchema();

const combinedSchema = generateCombinedSchema([
  breadcrumbSchema,
  articleSchema,
  faqSchema,
  sportsEventSchema,
]);

export default function AlbumCopa2026Page() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[{ label: "Guia do Álbum Copa 2026" }]}
              className="mb-8"
            />

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Álbum Copa do Mundo{" "}
                <span className="text-primary">2026: Guia Completo</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Descubra tudo sobre as 980 figurinhas do álbum oficial Panini,
                quanto custa completar e as estratégias inteligentes para
                economizar até R$ 5.000 fazendo trocas.
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm py-2 px-3">
                  980 figurinhas
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-3">
                  68 especiais
                </Badge>
                <Badge variant="secondary" className="text-sm py-2 px-3">
                  112 páginas
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
          {/* O que é */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
              O que é o Álbum da Copa do Mundo 2026?
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              O álbum da Copa do Mundo 2026 é a coleção oficial de figurinhas
              criada pela Panini para a Copa do Mundo FIFA 2026. É um projeto
              que reúne milhões de colecionadores no Brasil e em todo o mundo,
              cada um tentando completar sua coleção através da compra de
              envelopes e da troca com outros colecionadores.
            </p>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              O álbum foi lançado em <strong>30 de abril de 2026</strong> e já
              se tornou um fenômeno nacional. Segundo a Panini,{" "}
              <strong>11 milhões de figurinhas</strong> são produzidas{" "}
              <strong>diariamente</strong> para atender a demanda dos
              colecionadores brasileiros.
            </p>
          </section>

          {/* Quantas figurinhas */}
          <section className="mb-16 bg-muted/40 rounded-lg p-8">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
              Quantas Figurinhas Tem o Álbum Copa 2026?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">980</div>
                <div className="text-muted-foreground">Figurinhas totais</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">68</div>
                <div className="text-muted-foreground">Figurinhas especiais</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">32</div>
                <div className="text-muted-foreground">Seleções do mundo</div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              O álbum é composto por{" "}
              <strong>112 páginas mais a capa</strong>, cada uma mostrando as
              32 seleções que participam da Copa do Mundo 2026. As 68
              figurinhas especiais incluem cards dourados de estrelas do
              futebol, técnicos, e símbolos de cada país.
            </p>
          </section>

          {/* Custo */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
              Quanto Custa Completar o Álbum Copa 2026?
            </h2>

            <div className="space-y-6 mb-8">
              <div className="border rounded-lg p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Sem Trocas (Apenas Comprando)
                </h3>
                <p className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                  R$ 7.362,90
                </p>
                <p className="text-muted-foreground">
                  Custo estimado para completar o álbum comprando apenas
                  envelopes, sem realizar nenhuma troca. Este é o cenário onde
                  você tem muita má sorte e tira muitas repetidas.
                </p>
              </div>

              <div className="border rounded-lg p-6 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  Com Trocas em Grupo (10 Pessoas)
                </h3>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  ~R$ 2.000
                </p>
                <p className="text-muted-foreground">
                  Quando 10 colecionadores se unem para trocar figurinhas
                  repetidas, o custo total cai drasticamente. Cada pessoa gasta
                  pouco mais de R$ 200 em média.
                </p>
              </div>

              <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Mínimo Teórico (Sem Repetidas)
                </h3>
                <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-2">
                  R$ 1.004,90
                </p>
                <p className="text-muted-foreground">
                  Se você tivesse sorte perfeita e nunca tirasse uma figurinha
                  repetida. Na prática, isso é mais raro que ganhar na Mega da
                  Virada.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Preços dos Materiais</h3>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Álbum brochura:</strong> R$ 24,90
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Álbum capa dura:</strong> R$ 74,90
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Álbum especial (prateado/dourado):</strong> R$ 79,90
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Álbum premium exclusivo:</strong> R$ 359,90
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>
                  <strong>Pacotes de figurinhas:</strong> R$ 7,00 (7 figurinhas
                  por envelope)
                </span>
              </li>
            </ul>
          </section>

          {/* Estratégias */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
              Estratégias Inteligentes para Economizar
            </h2>

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  1. Organize Trocas em Grupo
                </h3>
                <p className="text-muted-foreground mb-4">
                  Reúna amigos, família ou colegas de trabalho para trocar
                  figurinhas. Quanto mais pessoas participarem, maior a
                  variedade de duplicatas disponíveis para troca. Com 10 pessoas
                  trocando, você pode economizar até 70% do valor final.
                </p>
                <div className="bg-muted/50 rounded p-4 text-sm text-muted-foreground">
                  <strong>Dica:</strong> Organize trocas em escolas, praças e
                  centros comerciais. Faça listas das figurinhas que faltam e
                  as que tem repetidas.
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  2. Troque Online com Plataformas Especializadas
                </h3>
                <p className="text-muted-foreground mb-4">
                  Use plataformas de troca online que funcionam por geolocalização
                  para encontrar colecionadores perto de você. Isso é mais
                  eficiente que procurar manualmente em sua região, pois o
                  sistema faz match automático entre o que você precisa e o que
                  outros têm.
                </p>
                <div className="bg-muted/50 rounded p-4 text-sm text-muted-foreground">
                  <strong>Benefício:</strong> Encontra pessoas com as exatas
                  figurinhas que faltam, evitando trocas ineficientes.
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  3. Compre as Últimas Figurinhas, Não Pague por Repetidas
                </h3>
                <p className="text-muted-foreground mb-4">
                  Quando seu álbum estiver entre 70-85% completo, a chance de
                  tirar repetidas aumenta drasticamente. Nesse ponto, é mais
                  inteligente comprar as figurinhas que faltam diretamente com
                  outros colecionadores ou fornecedores.
                </p>
                <div className="bg-muted/50 rounded p-4 text-sm text-muted-foreground">
                  <strong>Cálculo:</strong> Às vezes, comprar 50-100 figurinhas
                  avulsas custa menos que abrir 200 envelopes na esperança de
                  tirar as faltantes.
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  4. Participe de Eventos de Troca
                </h3>
                <p className="text-muted-foreground mb-4">
                  Escolas, praças públicas e centros comerciais frequentemente
                  organizam eventos de troca de figurinhas. Nesses locais, você
                  encontra dezenas ou centenas de colecionadores ao mesmo tempo,
                  aumentando suas chances de fazer boas trocas.
                </p>
                <div className="bg-muted/50 rounded p-4 text-sm text-muted-foreground">
                  <strong>Vantagem:</strong> Diversidade de figurinhas
                  disponíveis e interação direta com outros colecionadores.
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-8">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              {FAQ_ALBUM.map((faq, idx) => (
                <details
                  key={idx}
                  className="border rounded-lg p-6 cursor-pointer group"
                >
                  <summary className="font-bold text-lg flex justify-between items-center select-none">
                    {faq.question}
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-lg p-12 text-center border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">
              Comece a Trocar Figurinhas Agora
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use o FigurinhaFácil para encontrar colecionadores em sua região
              com as figurinhas que faltam. O match é automático, rápido e
              seguro.
            </p>
            <Button size="lg" asChild className="gap-2">
              <Link href="/sign-up">
                Criar Conta Grátis <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </section>
        </article>
      </main>
      <LandingFooter />
    </>
  );
}
