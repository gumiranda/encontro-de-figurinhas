"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { ArrowRight, Users, Zap } from "lucide-react";

export function AlbumCTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-6">
          Pronto para Colecionar as 980 Figurinhas?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de colecionadores que estão completando seus álbuns da Copa do Mundo 2026.
          Encontre figurinhas raras, faça trocas inteligentes e economize!
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <Users className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
            <h3 className="text-lg font-bold mb-2">Conecte com Colecionadores</h3>
            <p className="text-blue-100 text-sm">
              Encontre outras pessoas perto de você para fazer trocas e completar seu álbum
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <Zap className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
            <h3 className="text-lg font-bold mb-2">Trocas Rápidas e Seguras</h3>
            <p className="text-blue-100 text-sm">
              Sistema seguro para negociar figurinhas com outros colecionadores da sua região
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg"
          >
            <Link href="/arena">
              Começar a Colecionar <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10 font-bold text-lg"
          >
            <Link href="/figurinhas">Explorar Figurinhas</Link>
          </Button>
        </div>

        <div className="mt-12 pt-12 border-t border-white/20">
          <p className="text-blue-100 text-sm mb-4">
            Já tem uma coleção? Compartilhe suas figurinhas raras com a comunidade
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20">
            <p className="text-sm text-white mb-3">
              <strong>48.000+</strong> colecionadores já compartilham figurinhas em <strong>847 cidades</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
