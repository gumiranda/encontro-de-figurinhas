"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export function AlbumHeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-950 via-green-900 to-yellow-900 pt-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-yellow-400 opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400 opacity-20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Álbum Oficial da Copa do Mundo 2026
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Colecione as <span className="text-yellow-300">980 Figurinhas</span> da
            <br />
            Copa do Mundo 2026
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
            Guia completo para colecionadores: dicas para economizar, encontrar figurinhas raras, trocar com outros colecionadores e completar seu álbum da Copa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg"
            >
              <Link href="#como-colecionar">
                Como Começar <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 font-bold text-lg"
            >
              <Link href="#figurinhas-raras">Ver Figurinhas Raras</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-300 mb-2">980</div>
              <p className="text-gray-300">Figurinhas no Total</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
              <div className="text-3xl font-bold text-blue-300 mb-2">112</div>
              <p className="text-gray-300">Páginas do Álbum</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-300 mb-2">7</div>
              <p className="text-gray-300">Figurinhas por Pacote</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
