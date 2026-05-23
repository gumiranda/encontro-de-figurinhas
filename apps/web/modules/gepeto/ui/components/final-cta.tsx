"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { GepetoAvatar } from "./gepeto-avatar";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-32">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, rgba(149,170,255,0.15), transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4 text-center">
        <div className="mb-7 flex justify-center">
          <GepetoAvatar size={96} mood="smug" />
        </div>

        <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
          Vai deixar uma <br />
          <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
            máquina
          </span>{" "}
          te ganhar?
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          São <strong className="text-foreground">39 dias de Copa</strong>. Toda
          partida é uma chance de provar que o Gepeto tá blefando.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-14 gap-2 px-7 text-base shadow-lg shadow-primary/30"
          >
            <Link href="/dashboard/gepeto">
              <Zap className="h-4 w-4" /> Entrar na arena
            </Link>
          </Button>
        </div>

        <div className="mt-5 text-xs text-muted-foreground">
          Grátis · Sem dinheiro real · Sem cadastro com cartão
        </div>
      </div>
    </section>
  );
}
