import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Users, MapPin, RefreshCw, Shield } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
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
  generateBreadcrumbSchema,
  generateFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Como Funciona",
  description:
    "Saiba como trocar figurinhas no Figurinha Fácil. Cadastre suas figurinhas, encontre colecionadores perto de você e complete seu álbum.",
  keywords: [
    "como trocar figurinhas",
    "troca de figurinhas online",
    "encontrar colecionadores",
    "trocar figurinhas repetidas",
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

const faqSchema = generateFAQSchema([
  {
    question: "Preciso pagar para usar o Figurinha Fácil?",
    answer:
      "Não! O cadastro e uso básico da plataforma são totalmente gratuitos. Você pode cadastrar suas figurinhas, encontrar colecionadores e combinar trocas sem custo.",
  },
  {
    question: "Como cadastro minhas figurinhas?",
    answer:
      "Após criar sua conta, acesse a área de cadastro de figurinhas. Você pode informar os números das figurinhas que tem repetidas e as que precisa para completar seu álbum.",
  },
  {
    question: "Como encontro pessoas para trocar?",
    answer:
      "Nossa plataforma automaticamente conecta você com colecionadores próximos que têm as figurinhas que você precisa e que precisam das suas repetidas.",
  },
  {
    question: "É seguro trocar figurinhas pelo Figurinha Fácil?",
    answer:
      "Sim! Recomendamos sempre realizar trocas em locais públicos e seguros. Nossa plataforma mostra pontos de troca bem avaliados pela comunidade.",
  },
  {
    question: "Posso trocar figurinhas de qualquer álbum?",
    answer:
      "Sim! O Figurinha Fácil suporta álbuns de diversas coleções, incluindo Copa do Mundo 2026, campeonatos brasileiros e outras coleções Panini.",
  },
]);

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
                Como funciona o{" "}
                <span className="text-primary">Figurinha Fácil</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Trocar figurinhas nunca foi tão fácil. Em poucos passos você
                encontra colecionadores perto de você e completa seu álbum.
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
              Por que usar o Figurinha Fácil?
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
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
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
                  Para garantir uma experiência segura ao trocar figurinhas,
                  siga estas recomendações:
                </p>
                <ul>
                  <li>
                    <strong>Escolha locais públicos:</strong> Prefira realizar
                    trocas em locais movimentados como shoppings, praças ou
                    pontos de troca conhecidos.
                  </li>
                  <li>
                    <strong>Verifique as figurinhas:</strong> Antes de confirmar
                    a troca, verifique se as figurinhas estão em bom estado.
                  </li>
                  <li>
                    <strong>Confira a quantidade:</strong> Conte as figurinhas
                    antes de finalizar a troca para garantir que tudo está
                    correto.
                  </li>
                  <li>
                    <strong>Vá acompanhado:</strong> Quando possível, leve um
                    amigo ou familiar, especialmente em primeiras trocas.
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
              {faqSchema.mainEntity.map((item) => (
                <div key={item.name} className="bg-background rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-muted-foreground">
                    {item.acceptedAnswer.text}
                  </p>
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
                <Link href="/cidade/sao-paulo">
                  <MapPin className="mr-2 h-4 w-4" />
                  São Paulo
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/rio-de-janeiro">
                  <MapPin className="mr-2 h-4 w-4" />
                  Rio de Janeiro
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/belo-horizonte">
                  <MapPin className="mr-2 h-4 w-4" />
                  Belo Horizonte
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/curitiba">
                  <MapPin className="mr-2 h-4 w-4" />
                  Curitiba
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/cidade/porto-alegre">
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
