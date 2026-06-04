"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { AlertCircle, DollarSign, Lightbulb, Target } from "lucide-react";

export function TipsAndTricksSection() {
  const tips = [
    {
      icon: DollarSign,
      title: "Economize ao Máximo",
      tips: [
        "Espere promoções relâmpago após a febre inicial",
        "Compre caixas fechadas com desconto em distribuidoras",
        "Procure lojas de bairro com preços mais baixos",
        "Aproveite programas de cashback em compras online",
      ],
    },
    {
      icon: Target,
      title: "Estratégia de Coleta",
      tips: [
        "Comece com 5-10 pacotinhos para preencher o básico",
        "Mapeie as figurinhas que mais caem com frequência",
        "Mantenha suas repetidas para trocar",
        "Organize listas com figurinhas que faltam",
      ],
    },
    {
      icon: Lightbulb,
      title: "Trocas Inteligentes",
      tips: [
        "Faça trocas em praças nos fins de semana",
        "Use grupos de redes sociais especializados",
        "Procure colecionadores com figurinhas diferentes das suas",
        "Estabeleça relações de longo prazo para trocas recorrentes",
      ],
    },
    {
      icon: AlertCircle,
      title: "Evite Erros Comuns",
      tips: [
        "Não jogue fora as figurinhas repetidas",
        "Não compre tudo no impulso na primeira semana",
        "Não ignore o potencial das trocas escolares",
        "Não pague acima da tabela por figurinhas comuns",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Dicas e Truques para Colecionar
          </h2>
          <p className="text-xl text-gray-600">
            Estratégias de especialistas para completar seu álbum com economia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {tips.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} className="border-0 shadow-lg h-full">
                <CardHeader>
                  <Icon className="h-8 w-8 text-blue-600 mb-3" />
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mr-3 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-green-50 border-2 border-green-200 rounded-lg p-8">
          <h3 className="text-lg font-bold text-green-900 mb-4">
            ✅ Plano de Ação Recomendado
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="font-bold text-green-900 mb-2">Semana 1-2</p>
              <p className="text-sm text-green-800">
                Compre 5-10 pacotinhos, monte sua coleção inicial e mapeie seus números
              </p>
            </div>
            <div>
              <p className="font-bold text-green-900 mb-2">Semana 3+</p>
              <p className="text-sm text-green-800">
                Comece trocas com amigos, escolas e grupos online. Guarde todas as repetidas
              </p>
            </div>
            <div>
              <p className="font-bold text-green-900 mb-2">Final</p>
              <p className="text-sm text-green-800">
                Use seus conhecimentos para encontrar figurinhas raras com economia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
