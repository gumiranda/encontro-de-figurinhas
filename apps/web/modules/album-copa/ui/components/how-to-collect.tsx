"use client";

import { CheckCircle2, Zap, Users, Smartphone } from "lucide-react";

export function HowToCollectSection() {
  return (
    <section
      id="como-colecionar"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f0ebe0]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12121f] mb-4 tracking-tight">
            Como Colecionar Figurinhas da Copa do Mundo
          </h2>
          <p className="text-lg text-[#535364] max-w-xl">
            Estratégias e dicas para completar seu álbum gastando menos.
          </p>
        </div>

        {/* Featured card: Regra de Ouro spans full width */}
        <div className="mb-12 bg-[#12121f] text-[#f0f0f5] p-8 sm:p-10 rounded-none">
          <Zap className="h-8 w-8 text-[#eab308] mb-4" />
          <h3 className="text-2xl font-bold mb-4">Regra de Ouro</h3>
          <p className="text-lg font-semibold text-[#eab308] mb-3">
            Pacotinhos + Trocas = Sucesso
          </p>
          <p className="text-[#9ca3af] max-w-2xl leading-relaxed">
            A estratégia mais inteligente é começar com pacotinhos para preencher
            boa parte do álbum e depois completar com trocas com outros
            colecionadores.
          </p>
          <div className="mt-6 p-4 bg-[#dc2626]/10 border border-[#dc2626]/20 text-sm text-[#f87171]">
            Não compre tudo no impulso na primeira semana. Espere pela febre
            passar e apareçam promoções melhores.
          </div>
        </div>

        {/* Two side-by-side blocks */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Trocas */}
          <div className="p-8 bg-[#faf8f4]">
            <Users className="h-8 w-8 text-[#1b7a3d] mb-4" />
            <h3 className="text-xl font-bold text-[#12121f] mb-2">
              Organize Trocas
            </h3>
            <p className="text-[#535364] mb-4 text-sm leading-relaxed">
              Quanto mais pessoas você conhece para trocar, menos dinheiro gasta.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-[#1b7a3d] mr-2 mt-0.5 shrink-0" />
                <span className="text-[#535364]">
                  Grupos em praças e bancas de jornal
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-[#1b7a3d] mr-2 mt-0.5 shrink-0" />
                <span className="text-[#535364]">
                  Trocas escolares organizadas
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-[#1b7a3d] mr-2 mt-0.5 shrink-0" />
                <span className="text-[#535364]">
                  Redes sociais e grupos online
                </span>
              </li>
            </ul>
          </div>

          {/* Compras Inteligentes */}
          <div className="p-8 bg-[#faf8f4]">
            <Smartphone className="h-8 w-8 text-[#7c3aed] mb-4" />
            <h3 className="text-xl font-bold text-[#12121f] mb-2">
              Compras Inteligentes
            </h3>
            <p className="text-[#535364] mb-4 text-sm leading-relaxed">
              Forme mutirões para comprar caixas fechadas em distribuidoras.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-[#7c3aed] mr-2 mt-0.5 shrink-0" />
                <span className="text-[#535364]">
                  Descontos significativos em volume
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-[#7c3aed] mr-2 mt-0.5 shrink-0" />
                <span className="text-[#535364]">
                  Melhor distribuição de figurinhas
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-[#7c3aed] mr-2 mt-0.5 shrink-0" />
                <span className="text-[#535364]">
                  Menos repetições entre os grupos
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* App callout — inline section break */}
        <div className="mt-12 p-8 border border-[#d1cbb8] bg-[#faf8f4]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Smartphone className="h-8 w-8 text-[#dc2626] shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-[#12121f] mb-1">
                App FIFA Panini Collection
              </h3>
              <p className="text-sm text-[#535364]">
                Colecione digitalmente também. Trocas com o mundo todo, progresso
                em tempo real, desafios e eventos especiais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
