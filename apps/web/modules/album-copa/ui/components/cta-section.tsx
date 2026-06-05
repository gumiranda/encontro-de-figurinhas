"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { ArrowRight, Users, Zap } from "lucide-react";

export function AlbumCTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#12121f] text-[#f0f0f5]">
      <div className="mx-auto max-w-3xl text-left sm:text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
          Pronto para Colecionar as 980 Figurinhas?
        </h2>
        <p className="text-base sm:text-lg text-[#9ca3af] mb-12 leading-relaxed">
          Junte-se a milhares de colecionadores que estão completando seus álbuns
          da Copa do Mundo 2026. Encontre figurinhas raras, faça trocas
          inteligentes e economize.
        </p>

        {/* Feature highlights — side by side, no glass */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          <div className="flex gap-3 p-5 bg-[#1a1a2e] text-left">
            <Users className="h-5 w-5 text-[#eab308] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm mb-1">
                Conecte com Colecionadores
              </h3>
              <p className="text-xs text-[#9ca3af]">
                Encontre outras pessoas perto de você para fazer trocas e
                completar seu álbum.
              </p>
            </div>
          </div>
          <div className="flex gap-3 p-5 bg-[#1a1a2e] text-left">
            <Zap className="h-5 w-5 text-[#eab308] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm mb-1">
                Trocas Rápidas e Seguras
              </h3>
              <p className="text-xs text-[#9ca3af]">
                Sistema seguro para negociar figurinhas com outros colecionadores
                da sua região.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:justify-center mb-16">
          <Button
            asChild
            size="lg"
            className="bg-[#eab308] hover:bg-[#ca8a04] text-[#12121f] font-bold text-base px-8 py-6 h-auto"
          >
            <Link href="/arena">
              Começar a Colecionar <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-[#374151] text-[#e5e7eb] hover:bg-[#1f2937] hover:border-[#4b5563] font-semibold text-base px-8 py-6 h-auto"
          >
            <Link href="/figurinhas">Explorar Figurinhas</Link>
          </Button>
        </div>

        {/* Social proof — simple stat line, no glass card */}
        <p className="text-xs text-[#6b7280]">
          <span className="text-[#eab308] font-bold">48.000+</span>{" "}
          colecionadores em{" "}
          <span className="text-[#eab308] font-bold">847</span> cidades
        </p>
      </div>
    </section>
  );
}
