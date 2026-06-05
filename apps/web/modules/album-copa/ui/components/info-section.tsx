"use client";

import { Trophy, Wallet, Store } from "lucide-react";

const specs = [
  { label: "Figurinhas no Total", value: "980" },
  { label: "Páginas do Álbum", value: "112" },
  { label: "Figurinhas por Pacote", value: "7" },
  { label: "Categorias Especiais", value: "Legend" },
];

export function AlbumInfoSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f4]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12121f] mb-4 tracking-tight">
            Tudo sobre o Álbum da Copa do Mundo 2026
          </h2>
          <p className="text-lg text-[#535364] max-w-xl">
            Informações essenciais para quem quer começar ou completar sua
            coleção.
          </p>
        </div>

        {/* Specs strip — horizontal stat band, not cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-20">
          {specs.map((s) => (
            <div
              key={s.label}
              className="p-6 bg-[#f0ebe0]/60"
            >
              <div className="text-3xl font-extrabold text-[#12121f] mb-1 tabular-nums">
                {s.value}
              </div>
              <p className="text-sm text-[#535364]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Three topics: layout alternates between horizontal spread and 2-col */}
        <div className="space-y-16">
          {/* Specs */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <div>
              <Trophy className="h-8 w-8 text-[#dc2626] mb-4" />
              <h3 className="text-xl font-bold text-[#12121f] mb-3">
                Especificações do Álbum
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#12121f]">Total de Figurinhas</p>
                <p className="text-[#535364]">980 figurinhas para colecionar</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Páginas</p>
                <p className="text-[#535364]">112 páginas coloridas</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Figurinhas por Pacote</p>
                <p className="text-[#535364]">7 figurinhas</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Categorias Especiais</p>
                <p className="text-[#535364]">Figurinhas Legend (raríssimas)</p>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <div>
              <Wallet className="h-8 w-8 text-[#1b7a3d] mb-4" />
              <h3 className="text-xl font-bold text-[#12121f] mb-3">
                Investimento Inicial
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#12121f]">Preço do Álbum</p>
                <p className="text-[#535364]">De R$ 3,90 a R$ 24,90</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Preço por Pacote</p>
                <p className="text-[#535364]">Varia conforme promoções</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Dica de Economia</p>
                <p className="text-[#535364]">Evite comprar tudo na primeira semana</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Estratégia Inteligente</p>
                <p className="text-[#535364]">Pacotinhos + trocas = economia</p>
              </div>
            </div>
          </div>

          {/* Where to buy */}
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
            <div>
              <Store className="h-8 w-8 text-[#eab308] mb-4" />
              <h3 className="text-xl font-bold text-[#12121f] mb-3">
                Onde Comprar
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="font-semibold text-[#12121f]">Locais Físicos</p>
                <p className="text-[#535364]">Livrarias, bancas, supermercados</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Online</p>
                <p className="text-[#535364]">Site oficial Panini</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Distribuidor</p>
                <p className="text-[#535364]">Caixas fechadas com desconto</p>
              </div>
              <div>
                <p className="font-semibold text-[#12121f]">Redes Sociais</p>
                <p className="text-[#535364]">Grupos e comunidades online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
