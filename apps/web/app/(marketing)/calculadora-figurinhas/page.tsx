import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, TrendingDown, Users, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  BASE_URL,
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
  generateHowToSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { CalculatorClient } from "./calculator-client";

const PAGE_URL = `${BASE_URL}/calculadora-figurinhas`;

export const metadata: Metadata = {
  title: "Calculadora de Figurinhas Copa 2026 | Quanto Vou Gastar?",
  description:
    "Calcule quanto você vai gastar para completar o álbum da Copa 2026. Veja estimativas com e sem trocas e descubra quanto economizar usando o Figurinha Fácil.",
  keywords: [
    "calculadora figurinhas copa 2026",
    "quanto custa album copa 2026",
    "simulador figurinhas",
    "custo completar album copa",
    "quanto vou gastar figurinhas",
    "economia album copa 2026",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculadora de Figurinhas Copa 2026 | Quanto Vou Gastar?",
    description:
      "Calcule quanto você vai gastar para completar o álbum da Copa 2026 com e sem trocas.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Figurinhas Copa 2026",
    description: "Descubra quanto você vai gastar para completar o álbum da Copa 2026.",
  },
};

const CALCULATOR_FAQS = [
  {
    question: "Como a calculadora estima o custo com trocas?",
    answer:
      "Consideramos que você compra pacotes até ~65% do álbum e troca o restante gratuitamente no Figurinha Fácil. Baseado em dados de usuários, o custo médio fica em torno de R$ 1.500.",
  },
  {
    question: "Posso realmente completar o álbum por R$ 1.500 com trocas?",
    answer:
      "Sim! Usuários ativos do Figurinha Fácil que participam de trocas regularmente conseguem completar por R$ 1.200 a R$ 1.800. A chave é trocar as repetidas antes que se acumulem demais.",
  },
  {
    question: "Por que o custo sem trocas é tão alto?",
    answer:
      "É o problema do colecionador: quanto mais figurinhas você tem, maior a chance de tirar repetidas. As últimas 100 figurinhas podem custar mais que as primeiras 500 juntas.",
  },
  {
    question: "A calculadora considera figurinhas especiais/raras?",
    answer:
      "Sim. As 68 figurinhas especiais (Legends e Iconic Moments) estão incluídas no total de 980. Como são mais raras, elas aumentam o custo médio estimado.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Informe quantos pacotes você já comprou",
    description: "Digite o número de pacotinhos de R$ 7 que você já adquiriu.",
  },
  {
    title: "Informe quantas figurinhas únicas você tem",
    description: "Conte apenas figurinhas diferentes, não repetidas.",
  },
  {
    title: "Escolha se vai usar trocas",
    description: "Marque se pretende trocar figurinhas no Figurinha Fácil.",
  },
  {
    title: "Veja a estimativa de custo",
    description: "A calculadora mostra quanto você ainda vai gastar e quanto pode economizar.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Calculadora de Figurinhas" },
]);

const faqSchema = generateFAQSchema(CALCULATOR_FAQS);

const howToSchema = generateHowToSchema(
  "Como usar a calculadora de figurinhas da Copa 2026",
  "Calcule quanto você vai gastar para completar o álbum da Copa 2026 com ou sem trocas.",
  HOW_TO_STEPS
);

const combinedSchema = generateCombinedSchema([breadcrumbSchema, faqSchema, howToSchema]);

export default function CalculadoraPage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">Calculadora</li>
              </ol>
            </nav>

            <div className="max-w-3xl mb-12">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Calculator className="h-5 w-5" />
                <span className="text-sm font-medium">Calculadora de Custo</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Quanto vou gastar para completar o{" "}
                <span className="text-primary">álbum da Copa 2026</span>?
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Descubra o custo real para fechar seu álbum. Compare cenários com e sem
                trocas e veja quanto você pode economizar.
              </p>
            </div>

            <CalculatorClient />
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-8 text-center">
              Por que trocar figurinhas economiza tanto?
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <TrendingDown className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Problema do Colecionador</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Quanto mais figurinhas você tem, maior a chance de tirar repetidas. As
                  últimas 50 custam mais que as primeiras 300.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Trocas Eliminam Repetidas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  No Figurinha Fácil, suas repetidas viram figurinhas que faltam. Zero
                  custo adicional.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Economia Real</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Usuários ativos economizam R$ 3.000 a R$ 5.000 comparado a comprar na
                  sorte.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-8">
              Perguntas frequentes
            </h2>

            <div className="space-y-6">
              {CALCULATOR_FAQS.map((faq, i) => (
                <div key={i} className="border-b pb-6 last:border-b-0">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Pronto para economizar? Cadastre-se e comece a trocar.
              </p>
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Criar conta grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
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
