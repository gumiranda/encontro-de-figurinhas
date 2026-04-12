import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Users, MapPin, Target } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "Conheça o Figurinha Fácil, a maior plataforma de troca de figurinhas do Brasil. Nossa missão é conectar colecionadores e facilitar a troca de figurinhas.",
  keywords: [
    "sobre figurinha fácil",
    "plataforma de troca de figurinhas",
    "colecionadores brasil",
  ],
  openGraph: {
    title: "Sobre Nós | Figurinha Fácil",
    description:
      "Conheça o Figurinha Fácil, a maior plataforma de troca de figurinhas do Brasil.",
    url: `${BASE_URL}/sobre`,
  },
  alternates: {
    canonical: `${BASE_URL}/sobre`,
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Sobre Nós" },
]);

const organizationSchema = generateOrganizationSchema();

const values = [
  {
    icon: Heart,
    title: "Paixão por Colecionar",
    description:
      "Somos colecionadores como você e entendemos a emoção de completar um álbum.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description:
      "Acreditamos no poder da comunidade e nas conexões que a troca de figurinhas pode criar.",
  },
  {
    icon: MapPin,
    title: "Acessibilidade",
    description:
      "Queremos que todo colecionador tenha acesso fácil às figurinhas que precisa.",
  },
  {
    icon: Target,
    title: "Simplicidade",
    description:
      "Desenvolvemos uma plataforma intuitiva para que você foque no que importa: colecionar.",
  },
];

export default function SobrePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={organizationSchema} />
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
                <li className="text-foreground font-medium">Sobre Nós</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Conectando colecionadores em todo o{" "}
                <span className="text-primary">Brasil</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                O Figurinha Fácil nasceu da paixão por colecionar e da vontade
                de facilitar a vida de quem, assim como nós, adora completar
                álbuns de figurinhas.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
                Nossa Missão
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p>
                  Queremos ser a maior e melhor plataforma de troca de
                  figurinhas do Brasil, conectando colecionadores de norte a sul
                  do país.
                </p>
                <p>
                  Acreditamos que colecionar figurinhas é mais do que um hobby —
                  é uma tradição que atravessa gerações, une famílias e cria
                  amizades. Com a Copa do Mundo 2026 se aproximando, sabemos que
                  milhões de brasileiros estarão buscando completar seus álbuns.
                </p>
                <p>
                  Nossa plataforma foi desenvolvida para tornar esse processo
                  mais fácil, seguro e divertido. Aqui você encontra
                  colecionadores perto de você, descobre pontos de troca
                  confiáveis e consegue as figurinhas que faltam sem complicação.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
              Nossos Valores
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
                Nossa História
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p>
                  O Figurinha Fácil surgiu de uma frustração comum a todo
                  colecionador: a dificuldade de encontrar as últimas figurinhas
                  para completar o álbum.
                </p>
                <p>
                  Percebemos que, em um país do tamanho do Brasil, existem
                  milhões de colecionadores espalhados por todas as cidades,
                  cada um com figurinhas repetidas que poderiam ser exatamente o
                  que outro colecionador precisa. O problema era conectar essas
                  pessoas.
                </p>
                <p>
                  Foi assim que criamos uma plataforma simples e eficiente, onde
                  você cadastra suas figurinhas repetidas e as que precisa, e nós
                  fazemos o trabalho de encontrar o match perfeito perto de você.
                </p>
                <p>
                  Desde então, temos ajudado milhares de colecionadores a
                  completarem seus álbuns e, mais do que isso, a fazerem novas
                  amizades e viverem a emoção de colecionar de forma completa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Faça parte da nossa comunidade
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de colecionadores e comece a trocar figurinhas
              hoje mesmo.
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
