"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function AlbumHeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0a0f1e] pt-24">
      {/* Background texture: diagonal stripe pattern hinting at sticker sheet */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #f0f0f5 0px, #f0f0f5 1px, transparent 1px, transparent 24px)",
        }}
      />

      {/* Single large ambient glow, no glass */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#dc2626] opacity-[0.08] blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-left sm:text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full bg-[#dc2626]/15 px-4 py-2 text-sm font-semibold text-[#f87171] border border-[#dc2626]/20">
            <Sparkles className="mr-2 h-4 w-4" />
            Álbum Oficial da Copa do Mundo 2026
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f0f0f5] mb-6 leading-[1.1] tracking-tight">
            Colecione as{" "}
            <span className="text-[#eab308]">980 Figurinhas</span>
            <br />
            da Copa do Mundo 2026
          </h1>

          <p className="mx-auto max-w-xl text-base sm:text-lg text-[#9ca3af] mb-10 leading-relaxed">
            Guia completo para colecionadores: dicas para economizar, encontrar
            figurinhas raras, trocar com outros colecionadores e completar seu
            álbum.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#eab308] hover:bg-[#ca8a04] text-[#0a0f1e] font-bold text-base px-8 py-6 h-auto"
            >
              <Link href="#como-colecionar">
                Como Começar <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#374151] text-[#e5e7eb] hover:bg-[#1f2937] hover:border-[#4b5563] font-semibold text-base px-8 py-6 h-auto"
            >
              <Link href="#figurinhas-raras">Ver Figurinhas Raras</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#faf8f4] to-transparent" />
    </section>
  );
}
