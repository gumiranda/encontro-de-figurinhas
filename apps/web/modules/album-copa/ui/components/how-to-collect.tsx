"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { CheckCircle2, Zap, Users, Smartphone } from "lucide-react";

export function HowToCollectSection() {
  return (
    <section
      id="como-colecionar"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Como Colecionar Figurinhas da Copa do Mundo
          </h2>
          <p className="text-xl text-gray-600">
            Estratégias e dicas para completar seu álbum gastando menos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <Zap className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-2xl">Regra de Ouro</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-4">
              <p className="font-semibold text-gray-900">Pacotinhos + Trocas = Sucesso</p>
              <p>
                A estratégia mais inteligente é começar com pacotinhos para preencher boa parte do álbum e depois completar com trocas com outros colecionadores.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-900">💡 Dica importante:</p>
                <p className="text-sm text-blue-800 mt-2">
                  Não compre tudo no impulso na primeira semana. Espere pela febre passar e apareçam promoções melhores!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-2xl">Organize Trocas</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-4">
              <p className="font-semibold text-gray-900">Aumente sua Rede de Negociação</p>
              <p>
                Quanto mais pessoas você conhece para trocar, menos dinheiro gasta. Procure por:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Grupos em praças e bancas de jornal</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Trocas escolares organizadas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Redes sociais e grupos online</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <Smartphone className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-2xl">Compras Inteligentes</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-4">
              <p className="font-semibold text-gray-900">Organize Compras em Grupo</p>
              <p>
                Forme "mutirões" para comprar caixas fechadas diretamente em distribuidoras. Vantagens:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Descontos significativos em volume</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Melhor distribuição de figurinhas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Menos repetição entre os grupos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <Smartphone className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle className="text-2xl">App FIFA Panini</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-4">
              <p className="font-semibold text-gray-900">Colecione Digitalmente também</p>
              <p>
                O aplicativo FIFA Panini Collection oferece uma experiência digital complementar:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Coleção digital gratuita</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Trocas com colecionadores do mundo todo</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Acompanhe seu progresso em tempo real</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
