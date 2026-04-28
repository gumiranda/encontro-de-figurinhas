"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowRight, PlayCircle, ShieldCheck, Star, Verified } from "lucide-react";
import Link from "next/link";
import { LiveTicker } from "./live-ticker";
import { MatchCard } from "./match-card";

interface HeroSectionProps {
  totalTrocas?: string | null;
}

export function HeroSection({ totalTrocas }: HeroSectionProps) {
  return (
    <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-7 animate-fade-in-up">
          <span className="eyebrow eyebrow-green">
            <span className="pulse-dot" />
            Copa do Mundo 2026 · ao vivo
          </span>

          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[#e1e4fa]">
            Troca de figurinhas
            <br />
            Copa 2026 <span className="text-gradient-hero">complete seu álbum</span>.
          </h1>

          <p className="hero-description text-lg md:text-xl text-[#a6aabf] max-w-xl leading-relaxed text-pretty">
            Encontre figurinhas raras perto de você. Match em tempo real com
            colecionadores verificados, ponto de encontro público, zero taxa.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" className="h-[3.25rem] px-7 rounded-full gap-2.5">
              <Link href="/cadastrar-figurinhas/quick">
                Cadastrar minhas figurinhas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-[3.25rem] px-6 rounded-full gap-2.5 bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/[0.18]"
            >
              <Link href="#como">
                <PlayCircle className="w-4 h-4" />
                Como funciona
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-3 text-xs text-[#a6aabf] font-mono flex-wrap">
            <div className="flex items-center gap-1.5">
              <Verified className="w-4 h-4 text-[#4ff325]" />
              <span>{totalTrocas ?? "48k"} colecionadores</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#ffc965]" />
              <span>4.9 · 2.4k reviews</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#95aaff]" />
              <span>trocas validadas</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 animate-fade-in-up delay-200">
          <MatchCard />
        </div>
      </div>

      <LiveTicker />
    </section>
  );
}
