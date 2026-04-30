import { JsonLd } from "@/components/json-ld";
import {
  BASE_URL,
  generateBreadcrumbSchema,
  generateFAQSchema,
  GEO_OPTIMIZED_FAQS,
} from "@/lib/seo";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowRight, CheckCircle, MapPin, RefreshCw, Shield, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como Funciona | Troque Figurinhas da Copa 2026",
  description:
    "Saiba como trocar figurinhas da Copa 2026 no Figurinha Fácil. Com 980 figurinhas no álbum, trocar é essencial. Cadastre suas repetidas, encontre colecionadores perto de você e economize até R$ 5.000.",
  keywords: [
    "como trocar figurinhas",
    "como trocar figurinhas copa 2026",
    "troca de figurinhas online",
    "encontrar colecionadores",
    "trocar figurinhas repetidas",
    "onde trocar figurinhas",
    "app troca figurinhas",
  ],
  openGraph: {
    title: "Como Funciona | Figurinha Fácil",
    description:
      "Saiba como trocar figurinhas no Figurinha Fácil. Cadastre, encontre e troque.",
    url: `${BASE_URL}/como-funciona`,
  },
  alternates: {
    canonical: `${BASE_URL}/como-funciona`,
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Como Funciona" },
]);

const faqSchema = generateFAQSchema(GEO_OPTIMIZED_FAQS);

const steps = [
  {
    number: 1,
    title: "Crie sua conta",
    description:
      "Cadastre-se gratuitamente em poucos segundos. Você só precisa de um email para começar.",
    icon: Users,
  },
  {
    number: 2,
    title: "Cadastre suas figurinhas",
    description:
      "Informe quais figurinhas você tem repetidas e quais precisa para completar seu álbum.",
    icon: RefreshCw,
  },
  {
    number: 3,
    title: "Encontre trocas",
    description:
      "Nossa plataforma encontra automaticamente colecionadores perto de você com figurinhas compatíveis.",
    icon: MapPin,
  },
  {
    number: 4,
    title: "Combine e troque",
    description:
      "Combine um ponto de encontro seguro e realize suas trocas presencialmente.",
    icon: CheckCircle,
  },
];

const benefits = [
  {
    title: "100% Gratuito",
    description: "Cadastro e uso da plataforma sem custo algum.",
  },
  {
    title: "Economia de Tempo",
    description: "Encontre exatamente quem tem o que você precisa.",
  },
  {
    title: "Comunidade Ativa",
    description: "Milhares de colecionadores em todo o Brasil.",
  },
  {
    title: "Segurança",
    description: "Pontos de troca bem avaliados e comunidade verificada.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
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
                <li className="text-foreground font-medium">Como Funciona</li>
              </ol>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Como funciona o Figurinha <span className="text-[#87d400]">Fácil</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Trocar figurinhas nunca foi tão fácil. Em poucos passos você encontra
                colecionadores perto de você e completa seu álbum.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
              4 passos simples
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.number} className="relative">
                    <CardHeader>
                      <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {step.number}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mt-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
              Por que usar o Figurinha <span className="text-[#87d400]">Fácil</span>?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-start gap-3 p-4 rounded-lg bg-background"
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-primary" />
                <h2 className="text-2xl md:text-3xl font-headline font-bold">
                  Dicas de segurança
                </h2>
              </div>

              <div className="prose prose-lg dark:prose-invert">
                <p>
                  Para garantir uma experiência segura ao trocar figurinhas, siga estas
                  recomendações:
                </p>
                <ul>
                  <li>
                    <strong>Escolha locais públicos:</strong> Prefira realizar trocas em
                    locais movimentados como shoppings, praças ou pontos de troca
                    conhecidos.
                  </li>
                  <li>
                    <strong>Verifique as figurinhas:</strong> Antes de confirmar a troca,
                    verifique se as figurinhas estão em bom estado.
                  </li>
                  <li>
                    <strong>Confira a quantidade:</strong> Conte as figurinhas antes de
                    finalizar a troca para garantir que tudo está correto.
                  </li>
                  <li>
                    <strong>Vá acompanhado:</strong> Quando possível, leve um amigo ou
                    familiar, especialmente em primeiras trocas.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
              Perguntas frequentes
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {GEO_OPTIMIZED_FAQS.map((item) => (
                <div key={item.question} className="bg-background rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cities Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-8 text-center">
              Cidades com mais colecionadores
            </h2>
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
              <Button variant="outline" asChild>
                <Link href="/cidade/sao-paulo-sp">
                  <MapPin className="mr-2 h-4 w-4" />
                  São Paulo
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/rio-de-janeiro-rj">
                  <MapPin className="mr-2 h-4 w-4" />
                  Rio de Janeiro
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/belo-horizonte-mg">
                  <MapPin className="mr-2 h-4 w-4" />
                  Belo Horizonte
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/curitiba-pr">
                  <MapPin className="mr-2 h-4 w-4" />
                  Curitiba
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/porto-alegre-rs">
                  <MapPin className="mr-2 h-4 w-4" />
                  Porto Alegre
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Pronto para começar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e comece a trocar figurinhas ainda hoje.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Criar conta grátis
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
