import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Map, ArrowRight, Users } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateStatesHubMetadata,
  generateBreadcrumbSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export const metadata: Metadata = generateStatesHubMetadata();

const loadStates = () =>
  unstable_cache(
    async () => convexServer.query(api.states.getAllStates, {}),
    ["all-states"],
    { tags: ["states"], revalidate: 3600 }
  )();

export default async function StatesHubPage() {
  const states = await loadStates();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Estados" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
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
                <li className="text-foreground font-medium">Estados</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Troca de Figurinhas em{" "}
                <span className="text-primary">Todos os Estados</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Selecione seu estado para encontrar colecionadores e pontos de
                troca de figurinhas da Copa do Mundo 2026 perto de você.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states.map((state) => (
                <Link key={state.code} href={`/estado/${state.slug}`}>
                  <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Map className="h-4 w-4 text-primary" />
                        {state.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Veja cidades e pontos de troca
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Complete seu álbum mais rápido
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e encontre colecionadores no seu estado
              para trocar figurinhas da Copa 2026.
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
