import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  GepetoAvatar,
  CountUp,
  HeroBoard,
  StatStrip,
  HowItWorks,
  TrashCarousel,
  FeaturesGrid,
  FinalCTA,
} from "@/modules/gepeto";

export const metadata: Metadata = {
  title: "Gepeto - IA de Palpites | Figurinha Fácil",
  description:
    "Desafie a IA Gepeto nos palpites da Copa 2026. Acerte mais que a máquina e ganhe badges exclusivos!",
  openGraph: {
    title: "Gepeto - IA de Palpites",
    description: "Humano vs IA. Quem acerta mais palpites na Copa 2026?",
  },
};

function HeroSection() {
  return (
    <section className="relative overflow-x-hidden pt-20 pb-12 md:pt-24 md:pb-16">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-24 left-[10%] h-[360px] w-[360px] blur-[40px]"
        style={{
          background:
            "radial-gradient(circle, rgba(149,170,255,0.18), transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-[5%] top-24 h-[300px] w-[300px] blur-[40px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,201,101,0.12), transparent 70%)",
        }}
      />

      <div className="container mx-auto min-w-0 px-4">
        <div className="grid min-w-0 items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="min-w-0">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
              Copa 2026 · Quartas começando
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tighter sm:text-5xl md:text-7xl lg:text-[88px]">
              Bata o
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                robô
              </span>{" "}
              no palpite.
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
              O <strong className="text-amber-400">Gepeto</strong> é a IA da
              Figurinha Fácil. Ele palpita em todos os jogos da Copa antes de
              você, com análise técnica e provocação. Sua missão: acertar mais
              que a máquina.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-[52px] gap-2 px-6 shadow-lg shadow-primary/40"
              >
                <Link href="/dashboard/gepeto">
                  <Zap className="h-4 w-4" /> Desafiar agora
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-[52px] px-6">
                <Link href="#como">Como funciona</Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3.5 text-xs text-muted-foreground">
              <div className="flex">
                {["thiagomb", "ana.s", "rafa_dias", "luca_p"].map((nick, i) => {
                  const hue = nick.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0);
                  return (
                    <div
                      key={nick}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background font-display text-[11px] font-bold text-white"
                      style={{
                        backgroundColor: `hsl(${hue} 45% 35%)`,
                        marginLeft: i === 0 ? 0 : -8,
                      }}
                    >
                      {nick.slice(0, 2).toUpperCase()}
                    </div>
                  );
                })}
              </div>
              <span>
                <strong className="text-emerald-400">
                  <CountUp to={1247} />
                </strong>{" "}
                bateram o Gepeto esta semana
              </span>
            </div>
          </div>

          {/* Hero Board */}
          <div className="min-w-0">
            <HeroBoard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GepetoLandingPage() {
  return (
    <>
      <LandingHeader />
      <main id="main-content" className="min-w-0 overflow-x-hidden">
        <HeroSection />
        <StatStrip />
        <HowItWorks />
        <TrashCarousel />
        <FeaturesGrid />
        <FinalCTA />
      </main>
      <LandingFooter />
    </>
  );
}
