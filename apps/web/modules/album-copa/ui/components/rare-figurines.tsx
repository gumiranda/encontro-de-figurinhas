"use client";

import { Gem, Star } from "lucide-react";

interface RareFigurine {
  name: string;
  code: string;
  rarity: string;
  priceRange: string;
  description: string;
}

const rareFigurines: RareFigurine[] = [
  {
    name: "Vinícius Júnior",
    code: "BRA-1",
    rarity: "Lendária",
    priceRange: "R$ 300 – R$ 5.000",
    description: "O único brasileiro na categoria Legend com versão dourada.",
  },
  {
    name: "Messi",
    code: "ARG-1",
    rarity: "Lendária",
    priceRange: "R$ 800 – R$ 5.000",
    description: "Uma das figuras mais icônicas do futebol mundial.",
  },
  {
    name: "Cristiano Ronaldo",
    code: "POR-1",
    rarity: "Lendária",
    priceRange: "R$ 800 – R$ 5.000",
    description: "Lenda viva do futebol português.",
  },
  {
    name: "Kylian Mbappé",
    code: "FRA-1",
    rarity: "Lendária",
    priceRange: "R$ 800 – R$ 4.000",
    description: "Jovem promessa e grande estrela francesa.",
  },
];

const colorVariations = [
  {
    color: "Ouro",
    rarity: "Extremamente Rara",
    frequency: "1 a cada 1.900 pacotes",
    price: "R$ 300 – R$ 5.000",
    accent: "bg-[#eab308]",
    border: "border-[#eab308]/30",
    bg: "bg-[#eab308]/5",
  },
  {
    color: "Prata",
    rarity: "Muito Rara",
    frequency: "Rara",
    price: "R$ 180 – R$ 400",
    accent: "bg-[#9ca3af]",
    border: "border-[#9ca3af]/30",
    bg: "bg-[#9ca3af]/5",
  },
  {
    color: "Bronze",
    rarity: "Rara",
    frequency: "Moderadamente rara",
    price: "R$ 200",
    accent: "bg-[#d97706]",
    border: "border-[#d97706]/30",
    bg: "bg-[#d97706]/5",
  },
  {
    color: "Roxa",
    rarity: "Semi-rara",
    frequency: "Menos rara",
    price: "R$ 150",
    accent: "bg-[#7c3aed]",
    border: "border-[#7c3aed]/30",
    bg: "bg-[#7c3aed]/5",
  },
];

export function RareFigurinesSection() {
  return (
    <section
      id="figurinhas-raras"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f4]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12121f] mb-4 tracking-tight">
            Figurinhas Raras e Mais Valiosas
          </h2>
          <p className="text-lg text-[#535364] max-w-xl">
            Conheça as figurinhas mais procuradas e seus valores no mercado.
          </p>
        </div>

        {/* Legend players — horizontal scroll on mobile, 2-col on desktop */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-[#12121f] mb-8">
            Categoria Legend — Os 20 Jogadores Especiais
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {rareFigurines.map((fig) => (
              <div
                key={fig.name}
                className="flex gap-4 p-5 bg-[#f0ebe0]/60"
              >
                <div className="w-10 h-10 shrink-0 rounded-full bg-[#dc2626]/10 flex items-center justify-center">
                  <Star className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[#12121f] text-sm">
                      {fig.name}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#dc2626]/10 text-[#dc2626]">
                      {fig.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-[#535364] mb-1 font-mono">
                    {fig.code}
                  </p>
                  <p className="text-xs text-[#535364] mb-2">
                    {fig.description}
                  </p>
                  <p className="text-sm font-bold text-[#1b7a3d]">
                    {fig.priceRange}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color variations */}
        <div>
          <h3 className="text-xl font-bold text-[#12121f] mb-3">
            Variações de Cores e Valores
          </h3>
          <p className="text-[#535364] text-sm mb-10 max-w-lg">
            As figurinhas Legend também vêm em diferentes cores, cada uma com seu
            nível de raridade e preço.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorVariations.map((v) => (
              <div
                key={v.color}
                className={`border ${v.border} ${v.bg} p-5`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${v.accent} mb-3`}
                />
                <h4 className="font-bold text-[#12121f] text-sm mb-1">
                  {v.color}
                </h4>
                <p className="text-xs text-[#535364] mb-3">{v.rarity}</p>
                <div className="text-xs text-[#535364] mb-1">Frequência</div>
                <p className="text-xs font-semibold text-[#12121f] mb-3">
                  {v.frequency}
                </p>
                <div className="text-xs text-[#535364] mb-1">Preço Médio</div>
                <p className="text-sm font-bold text-[#1b7a3d]">
                  {v.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Collector tip — inline, no box */}
        <div className="mt-16 border-t border-[#d1cbb8] pt-10">
          <div className="flex gap-3">
            <Gem className="h-5 w-5 text-[#eab308] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-[#12121f] text-sm mb-2">
                Dica de Colecionador
              </h4>
              <p className="text-sm text-[#535364] leading-relaxed max-w-2xl">
                A versão dourada da figurinha Legend é a mais rara, aparecendo em
                apenas 1 a cada 1.900 pacotes. Colecionadores pagam até R$ 5.000
                por uma única figurinha. Se conseguir uma, você tem uma joia em
                mãos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
