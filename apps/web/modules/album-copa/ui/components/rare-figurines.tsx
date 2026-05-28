"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

interface RareFigurine {
  name: string;
  code: string;
  color: string;
  rarity: string;
  priceRange: string;
  description: string;
}

const rareFigurines: RareFigurine[] = [
  {
    name: "Vinícius Júnior",
    code: "BRA-1",
    color: "Gold",
    rarity: "Lendária",
    priceRange: "R$ 300 - R$ 5.000",
    description: "O único brasileiro na categoria Legend com versão dourada",
  },
  {
    name: "Messi",
    code: "ARG-1",
    color: "Gold",
    rarity: "Lendária",
    priceRange: "R$ 800 - R$ 5.000",
    description: "Uma das figuras mais icônicas do futebol mundial",
  },
  {
    name: "Cristiano Ronaldo",
    code: "POR-1",
    color: "Gold",
    rarity: "Lendária",
    priceRange: "R$ 800 - R$ 5.000",
    description: "Lenda viva do futebol português",
  },
  {
    name: "Kylian Mbappé",
    code: "FRA-1",
    color: "Gold",
    rarity: "Lendária",
    priceRange: "R$ 800 - R$ 4.000",
    description: "Jovem promessa e grande estrela francesa",
  },
];

const colorVariations = [
  {
    color: "Ouro",
    rarity: "Extremamente Rara",
    frequency: "1 a cada 1.900 pacotes",
    price: "R$ 300 - R$ 5.000",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    badgeColor: "bg-yellow-100",
  },
  {
    color: "Prata",
    rarity: "Muito Rara",
    frequency: "Rara",
    price: "R$ 180 - R$ 400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    badgeColor: "bg-gray-100",
  },
  {
    color: "Bronze",
    rarity: "Rara",
    frequency: "Moderadamente rara",
    price: "R$ 200",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    badgeColor: "bg-orange-100",
  },
  {
    color: "Roxa",
    rarity: "Semi-rara",
    frequency: "Menos rara",
    price: "R$ 150",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    badgeColor: "bg-purple-100",
  },
];

export function RareFigurinesSection() {
  return (
    <section
      id="figurinhas-raras"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Figurinhas Raras e Mais Valiosas
          </h2>
          <p className="text-xl text-gray-600">
            Conheça as figurinhas mais procuradas e seus valores no mercado
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Categoria Legend - Os 20 Jogadores Especiais
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {rareFigurines.map((fig) => (
              <Card key={fig.name} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{fig.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Código: <span className="font-semibold">{fig.code}</span>
                      </p>
                    </div>
                    <Badge className="bg-red-500 hover:bg-red-600">
                      {fig.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-700 mb-4">{fig.description}</p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600">Faixa de Preço</p>
                    <p className="text-lg font-bold text-green-600">
                      {fig.priceRange}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Variações de Cores e Valores
          </h3>
          <p className="text-gray-600 mb-8">
            As figurinhas Legend também vêm em diferentes cores, cada uma com seu nível de raridade e preço:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {colorVariations.map((variation) => (
              <div
                key={variation.color}
                className={`${variation.bgColor} border-2 ${variation.borderColor} rounded-lg p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-900">
                    {variation.color}
                  </h4>
                  <Badge className={variation.badgeColor}>
                    {variation.rarity}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Frequência</p>
                    <p className="font-semibold text-gray-900">
                      {variation.frequency}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-600">Preço Médio</p>
                    <p className="text-lg font-bold text-green-600">
                      {variation.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
          <h4 className="text-lg font-bold text-blue-900 mb-4">
            💎 Dica de Colecionador
          </h4>
          <p className="text-blue-800">
            A versão dourada da figurinha Legend é a mais rara, aparecendo em apenas 1 a cada 1.900
            pacotes! Por isso, colecionadores pagam até R$ 5.000 por uma única figurinha. Se
            conseguir uma, você tem uma verdadeira joia em mãos.
          </p>
        </div>
      </div>
    </section>
  );
}
