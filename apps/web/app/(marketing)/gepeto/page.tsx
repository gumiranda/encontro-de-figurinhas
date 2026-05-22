import type { Metadata } from "next";
import Link from "next/link";
import { Bot, Trophy, Users, Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";

export const metadata: Metadata = {
  title: "Gepeto - IA de Palpites | Figurinha Fácil",
  description:
    "Desafie a IA Gepeto nos palpites da Copa 2026. Acerte mais que a máquina e ganhe badges exclusivos!",
  openGraph: {
    title: "Gepeto - IA de Palpites",
    description: "Humano vs IA. Quem acerta mais palpites na Copa 2026?",
  },
};

export default function GepetoLandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="container mx-auto max-w-4xl px-4 py-16">
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
            <Bot className="h-5 w-5" />
            <span className="font-medium">Humano vs IA</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Você consegue vencer o <span className="text-primary">Gepeto</span>?
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Gepeto é nossa IA de palpites da Copa 2026. Ela analisa cada jogo e
            faz previsões técnicas. Seu desafio: acertar mais que a máquina.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/gepeto/ranking">Ver ranking</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Abrir dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Análise Técnica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Cada palpite vem com 3-4 insights explicando o raciocínio da IA.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-8 w-8 text-amber-500 mb-2" />
              <CardTitle>Badges Exclusivos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ganhe o badge &quot;Bati a IA&quot; toda vez que seu palpite for
                melhor.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle>Ranking Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Veja quem mais venceu o Gepeto na semana e sua posição.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-muted/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Como funciona</h2>
          <ol className="text-left max-w-md mx-auto space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span>Gepeto palpita antes de cada jogo</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span>Você registra seu palpite (antes do início)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span>Após o jogo, comparamos os acertos</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span>Se você acertar e a IA errar, ganha o badge!</span>
            </li>
          </ol>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
