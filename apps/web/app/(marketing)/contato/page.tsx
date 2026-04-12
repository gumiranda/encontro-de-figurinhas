import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o Figurinha Fácil. Tire suas dúvidas, envie sugestões ou reporte problemas.",
  keywords: ["contato figurinha fácil", "suporte figurinhas", "ajuda troca figurinhas"],
  openGraph: {
    title: "Contato | Figurinha Fácil",
    description: "Entre em contato com o Figurinha Fácil.",
    url: `${BASE_URL}/contato`,
  },
  alternates: {
    canonical: `${BASE_URL}/contato`,
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Contato" },
]);

const contactOptions = [
  {
    icon: Mail,
    title: "Email",
    description: "Para dúvidas gerais e suporte",
    contact: "contato@figurinhafacil.com.br",
    href: "mailto:contato@figurinhafacil.com.br",
  },
  {
    icon: MessageSquare,
    title: "Sugestões",
    description: "Ideias para melhorar a plataforma",
    contact: "sugestoes@figurinhafacil.com.br",
    href: "mailto:sugestoes@figurinhafacil.com.br",
  },
  {
    icon: MapPin,
    title: "Parcerias",
    description: "Propostas de pontos de troca e parcerias",
    contact: "parcerias@figurinhafacil.com.br",
    href: "mailto:parcerias@figurinhafacil.com.br",
  },
];

export default function ContatoPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
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
                <li className="text-foreground font-medium">Contato</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Fale <span className="text-primary">Conosco</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Tem alguma dúvida, sugestão ou quer propor uma parceria? Estamos
                aqui para ajudar!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {contactOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Card key={option.title} className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={option.href}
                        className="text-primary hover:underline font-medium"
                      >
                        {option.contact}
                      </a>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
                Perguntas Frequentes
              </h2>
              <p className="text-muted-foreground mb-8">
                Antes de entrar em contato, confira se sua dúvida já foi
                respondida.
              </p>
              <Link
                href="/como-funciona"
                className="text-primary hover:underline font-medium"
              >
                Ver perguntas frequentes
              </Link>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl font-semibold mb-4">
                Tempo de Resposta
              </h2>
              <p className="text-muted-foreground">
                Respondemos a maioria dos emails em até 48 horas úteis. Para
                questões urgentes, indique &ldquo;URGENTE&rdquo; no assunto do email.
              </p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
