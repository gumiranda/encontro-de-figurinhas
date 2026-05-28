"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Trophy, Wallet, Store } from "lucide-react";

export function AlbumInfoSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tudo sobre o Álbum da Copa do Mundo 2026
          </h2>
          <p className="text-xl text-gray-600">
            Informações essenciais para quem quer começar ou completar sua coleção
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Trophy className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Especificações do Álbum</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <div>
                <p className="font-semibold text-gray-900">Total de Figurinhas</p>
                <p>980 figurinhas para colecionar</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Páginas</p>
                <p>112 páginas coloridas</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Figurinhas por Pacote</p>
                <p>7 figurinhas por pacote</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Categorias Especiais</p>
                <p>Figurinhas Legend (raríssimas)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Wallet className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Investimento Inicial</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <div>
                <p className="font-semibold text-gray-900">Preço do Álbum</p>
                <p>De R$ 3,90 a R$ 24,90</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Preço por Pacote</p>
                <p>Varia conforme promoções</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Dica de Economia</p>
                <p>Evite comprar tudo na primeira semana</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Estratégia Inteligente</p>
                <p>Pacotinhos + trocas = economia</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Store className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Onde Comprar</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-3">
              <div>
                <p className="font-semibold text-gray-900">Locais Físicos</p>
                <p>Livrarias, bancas, supermercados</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Online</p>
                <p>Site oficial Panini</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Distribuidor</p>
                <p>Caixas fechadas com desconto</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Redes Sociais</p>
                <p>Grupos e comunidades online</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
