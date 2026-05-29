import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, AlertCircle, Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: {
    absolute: "Álbum Copa do Mundo 2026 - Guia Completo Panini com 980 Figurinhas",
  },
  description:
    "Guia completo do álbum Copa 2026 Panini: 980 figurinhas, preços, como completar, figurinhas raras e Legends. Tudo que você precisa saber.",
  alternates: {
    canonical: `${BASE_URL}/album-copa-do-mundo-2026`,
  },
  openGraph: {
    type: "article",
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
    title: "Álbum Copa do Mundo 2026 - Guia Completo",
    description:
      "Tudo sobre o álbum oficial Panini da Copa 2026: 980 figurinhas, preços, tipos especiais e dicas para completar.",
  },
};

const FAQ_DATA = [
  {
    question: "Qual é o preço do álbum Copa 2026?",
    answer:
      "O álbum em capa cartão custa R$ 24,90, enquanto a versão em capa dura (premium) custa R$ 74,90. Cada pacote de figurinhas contém 7 figurinhas e custa R$ 7,00.",
  },
  {
    question: "Quantas figurinhas tem o álbum Copa 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 possui 980 figurinhas ao todo, distribuídas em 112 páginas. Essa é a maior edição de álbum de Copa da história.",
  },
  {
    question: "Quais são os tipos de figurinhas especiais?",
    answer:
      "Existem 68 figurinhas especiais e a série Legends com 20 jogadores lendários. Além disso, há figurinhas douradas e cromos premium que são mais raros.",
  },
  {
    question: "Como completar o álbum Copa 2026?",
    answer:
      "Para completar o álbum, você pode comprar pacotes, trocar repetidas com outros colecionadores ou usar a plataforma FigurinhaFácil para encontrar pessoas com as figurinhas que faltam.",
  },
  {
    question: "Onde comprar figurinhas da Copa 2026?",
    answer:
      "Você pode comprar em bancas, livrarias, supermercados ou online. A Panini é o fornecedor oficial das figurinhas Panini Copa 2026.",
  },
  {
    question: "Quais figurinhas são as mais raras?",
    answer:
      "As figurinhas mais raras são geralmente as especiais, douradas e da série Legends. A raridade também depende de quanto tempo o álbum está circulando.",
  },
];

export default function AlbumCopaPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Álbum Copa 2026" },
  ]);

  const articleSchema = generateArticleSchema({
    headline: "Álbum Copa do Mundo 2026 - Guia Completo Panini com 980 Figurinhas",
    description:
      "Guia completo sobre o álbum oficial da Copa 2026 com 980 figurinhas: preços, tipos especiais, como completar e dicas para colecionadores.",
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
    datePublished: "2025-05-29",
    dateModified: "2025-05-29",
    author: "Figurinha Fácil",
  });

  const faqSchema = generateFAQSchema(FAQ_DATA);

  const webPageSchema = generateWebPageSchema({
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
    name: "Álbum Copa do Mundo 2026",
    description:
      "Tudo sobre o álbum Copa 2026: 980 figurinhas, preços, como completar, figurinhas raras e Legends.",
  });

  const combinedSchema = generateCombinedSchema([
    webPageSchema,
    breadcrumbSchema,
    articleSchema,
    faqSchema,
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        <article className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24 px-4">
            <Breadcrumbs items={[{ label: "Álbum Copa 2026" }]} className="mb-8" />

            <div className="space-y-6">
              <div>
                <Badge className="mb-4">Guia Completo</Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                  Álbum Copa do Mundo{" "}
                  <span className="text-primary">2026</span>
                </h1>
              </div>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Guia completo sobre o álbum oficial Panini da Copa 2026 com 980 figurinhas. Descubra preços, tipos especiais, figurinhas raras e as melhores dicas para completar sua coleção.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Badge variant="secondary" className="text-base py-2 px-4">
                  <Zap className="h-4 w-4 mr-2" />
                  980 figurinhas
                </Badge>
                <Badge variant="outline" className="text-base py-2 px-4">
                  <Check className="h-4 w-4 mr-2" />
                  112 páginas
                </Badge>
                <Badge variant="outline" className="text-base py-2 px-4">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Panini Oficial
                </Badge>
              </div>
            </div>
          </section>

          {/* Key Facts Section */}
          <section className="py-16 md:py-20 px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">980</CardTitle>
                  <CardDescription>Figurinhas no Total</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    A maior edição de álbum de Copa da história
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">R$ 24,90</CardTitle>
                  <CardDescription>Preço do Álbum</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Capa cartão (versão premium: R$ 74,90)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl text-primary">48</CardTitle>
                  <CardDescription>Seleções</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Primeira Copa com 48 seleções participantes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="space-y-12">
              <div id="introducao" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  O Álbum Copa do Mundo 2026: A Maior Edição da História
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  O álbum da Copa do Mundo 2026 é um fenômeno colecionável que marca a maior edição de álbum de Copa da história. Com a expansão do torneio para 48 seleções (antes eram 32), a Panini criou um álbum robusto com 112 páginas e impressionantes 980 figurinhas.
                </p>
              </div>

              <div id="especificacoes" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Especificações e Números do Álbum
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed space-y-2">
                  <p>O álbum Copa 2026 possui as seguintes características:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>112 páginas de alta qualidade</li>
                    <li>980 figurinhas no total</li>
                    <li>68 figurinhas especiais</li>
                    <li>Série Legends com 20 jogadores famosos</li>
                    <li>Figurinhas douradas raras</li>
                    <li>Disponível em capa cartão e capa dura</li>
                  </ul>
                </div>
              </div>

              <div id="preco" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Preço Figurinhas Copa 2026: Quanto Custa?
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed space-y-2">
                  <p>Os preços para o álbum Copa 2026 são:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Álbum (capa cartão): R$ 24,90</li>
                    <li>Álbum (capa dura - premium): R$ 74,90</li>
                    <li>Pacote com 7 figurinhas: R$ 7,00</li>
                    <li>Pacotes especiais e edições limitadas: preços variáveis</li>
                  </ul>
                </div>
              </div>

              <div id="tipos" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Tipos de Figurinhas: Cromos Especiais e Legends
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                  <p>O álbum conta com diferentes categorias de figurinhas:</p>
                  
                  <div>
                    <p className="font-semibold text-foreground">Figurinhas Comuns:</p>
                    <p className="ml-4">As 892 figurinhas padrão com jogadores, técnicos e informações das seleções.</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">Figurinhas Especiais (68):</p>
                    <p className="ml-4">Cromos com design diferenciado, hologramas e efeitos especiais.</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">Figurinhas Douradas:</p>
                    <p className="ml-4">Raras figurinhas com acabamento em ouro, muito procuradas por colecionadores.</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">Figurinhas Legends (20):</p>
                    <p className="ml-4">Série exclusiva com 20 dos maiores jogadores da história do futebol.</p>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">Figurinhas Limitadas:</p>
                    <p className="ml-4">Edições especiais e exclusivas com tiragem reduzida.</p>
                  </div>
                </div>
              </div>

              <div id="completar" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Como Completar o Álbum Copa 2026?
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed space-y-3">
                  <p>Existem várias estratégias para completar seu álbum:</p>
                  
                  <ol className="space-y-3 ml-4">
                    <li className="space-y-1">
                      <p className="font-semibold text-foreground">1. Compra Organizada:</p>
                      <p>Estabeleça um orçamento mensal e compre pacotes regularmente.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="font-semibold text-foreground">2. Troca com Amigos:</p>
                      <p>Reúna-se com outros colecionadores e faça trocas de repetidas.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="font-semibold text-foreground">3. Plataformas de Troca:</p>
                      <p>Use o FigurinhaFácil para encontrar colecionadores com as figurinhas que você precisa.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="font-semibold text-foreground">4. Mercado Online:</p>
                      <p>Compre figurinhas específicas em plataformas de e-commerce e marketplaces.</p>
                    </li>
                    <li className="space-y-1">
                      <p className="font-semibold text-foreground">5. Eventos de Colecionadores:</p>
                      <p>Participe de encontros e feiras de colecionadores.</p>
                    </li>
                  </ol>
                </div>
              </div>

              <div id="raras" className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Figurinhas Raras Copa do Mundo 2026
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed space-y-2">
                  <p>As figurinhas mais raras e procuradas incluem:</p>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>Figurinhas Legends: A série com 20 ícones do futebol é altamente valiosa.</li>
                    <li>Figurinhas Douradas: Seu acabamento em ouro as torna muito raras.</li>
                    <li>Primeiras Edições: Figurinhas dos primeiros lotes costumam ser mais valiosas.</li>
                    <li>Hologramas Especiais: Versões com efeitos holográficos premium.</li>
                    <li>Figurinhas de Seleções Importantes: Jogadores de Brasil, Argentina, França, etc.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 md:py-20 px-4 bg-muted/30 rounded-lg my-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-12">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              {FAQ_DATA.map((faq, index) => (
                <details
                  key={index}
                  className="group border border-border rounded-lg p-6 hover:bg-background/50 transition-colors"
                >
                  <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                    {faq.question}
                    <span className="transform group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 md:py-24 px-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Comece a Completar seu Álbum Hoje
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Use o FigurinhaFácil para encontrar colecionadores com as figurinhas que você precisa. Troque de forma segura e complete seu álbum Copa 2026 muito mais rápido.
              </p>
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </article>
      </main>
      <LandingFooter />
    </>
  );
}
