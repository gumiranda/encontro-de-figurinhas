"use client";

import { DollarSign, Target, Lightbulb, AlertCircle } from "lucide-react";

export function TipsAndTricksSection() {
  const tips = [
    {
      icon: DollarSign,
      iconColor: "text-[#1b7a3d]",
      title: "Economize ao Máximo",
      tips: [
        "Espere promoções relâmpago após a febre inicial.",
        "Compre caixas fechadas com desconto em distribuidoras.",
        "Procure lojas de bairro com preços mais baixos.",
        "Aproveite programas de cashback em compras online.",
      ],
    },
    {
      icon: Target,
      iconColor: "text-[#dc2626]",
      title: "Estratégia de Coleta",
      tips: [
        "Comece com 5-10 pacotinhos para preencher o básico.",
        "Mapeie as figurinhas que mais caem com frequência.",
        "Mantenha suas repetidas para trocar.",
        "Organize listas com figurinhas que faltam.",
      ],
    },
    {
      icon: Lightbulb,
      iconColor: "text-[#eab308]",
      title: "Trocas Inteligentes",
      tips: [
        "Faça trocas em praças nos fins de semana.",
        "Use grupos de redes sociais especializados.",
        "Procure colecionadores com interesses complementares.",
        "Estabeleça relações de longo prazo para trocas recorrentes.",
      ],
    },
    {
      icon: AlertCircle,
      iconColor: "text-[#7c3aed]",
      title: "Evite Erros Comuns",
      tips: [
        "Não jogue fora as figurinhas repetidas.",
        "Não compre tudo no impulso na primeira semana.",
        "Não ignore o potencial das trocas escolares.",
        "Não pague acima da tabela por figurinhas comuns.",
      ],
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f0ebe0]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12121f] mb-4 tracking-tight">
            Dicas e Truques para Colecionar
          </h2>
          <p className="text-lg text-[#535364] max-w-xl">
            Estratégias de especialistas para completar seu álbum com economia.
          </p>
        </div>

        {/* Alternating layout: 2x2 grid but varying card heights naturally */}
        <div className="grid md:grid-cols-2 gap-px bg-[#d1cbb8] mb-16">
          {tips.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 bg-[#faf8f4]"
              >
                <Icon className={`h-6 w-6 ${section.iconColor} mb-4`} />
                <h3 className="text-lg font-bold text-[#12121f] mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.tips.map((tip, tipIdx) => (
                    <li
                      key={tipIdx}
                      className="text-sm text-[#535364] leading-relaxed pl-4 border-l-2 border-[#d1cbb8]"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Action plan — stepped timeline instead of colored boxes */}
        <div>
          <h3 className="text-lg font-bold text-[#12121f] mb-8">
            Plano de Ação Recomendado
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm font-bold text-[#dc2626] mb-2">
                Semana 1-2
              </div>
              <p className="text-sm text-[#535364] leading-relaxed">
                Compre 5-10 pacotinhos, monte sua coleção inicial e mapeie seus
                números.
              </p>
            </div>
            <div>
              <div className="text-sm font-bold text-[#1b7a3d] mb-2">
                Semana 3+
              </div>
              <p className="text-sm text-[#535364] leading-relaxed">
                Comece trocas com amigos, escolas e grupos online. Guarde todas
                as repetidas.
              </p>
            </div>
            <div>
              <div className="text-sm font-bold text-[#7c3aed] mb-2">
                Reta Final
              </div>
              <p className="text-sm text-[#535364] leading-relaxed">
                Use seus contatos para encontrar figurinhas raras com economia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
