import { Metadata } from "next";
import {
  ChevronDown,
  TrendingUp,
  Trophy,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Álbum Copa do Mundo 2026 - Guia Completo, Preços e Como Completar | Encontro de Figurinhas",
  description:
    "Descubra tudo sobre o álbum Panini da Copa do Mundo 2026. Guia completo com 980 figurinhas, preços, como completar rápido e dicas de troca. Maior álbum da história!",
  keywords: [
    "álbum copa do mundo 2026",
    "figurinhas copa 2026",
    "panini fifa 2026",
    "como completar álbum",
    "preço figurinhas copa",
    "troca de figurinhas",
  ],
  openGraph: {
    title: "Álbum Copa do Mundo 2026 - Guia Completo",
    description:
      "Descubra tudo sobre o álbum Panini da Copa do Mundo 2026 com 980 figurinhas.",
    type: "article",
    url: "https://encontro-de-figurinhas.com/article/album-copa-mundo-2026",
  },
};

export default function AlbumCopaPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Álbum Copa do Mundo 2026 - Guia Completo da Coleção Panini",
    description:
      "Guia completo sobre o álbum oficial da Copa do Mundo 2026 com 980 figurinhas, preços, dicas e como completar rapidamente",
    image:
      "https://encontro-de-figurinhas.com/og-album-copa-2026.jpg",
    datePublished: "2026-05-23",
    dateModified: "2026-05-23",
    author: {
      "@type": "Organization",
      name: "Encontro de Figurinhas",
    },
    publisher: {
      "@type": "Organization",
      name: "Encontro de Figurinhas",
    },
  };

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Álbum Copa do Mundo <span className="text-yellow-400">2026</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Descubra o guia completo do maior álbum de figurinhas da Copa do
            Mundo da história. 980 figurinhas, 48 seleções e muito mais!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Encontrar Figurinhas
            </Button>
            <Link href="/arena">
              <Button size="lg" variant="outline">
                Explorar Comunidade
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">980</div>
              <p className="text-slate-300">Figurinhas Totais</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">68</div>
              <p className="text-slate-300">Figurinhas Especiais</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">48</div>
              <p className="text-slate-300">Seleções Participantes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">3</div>
              <p className="text-slate-300">Países-Sede</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section 1: O que é o Álbum */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              O Álbum Copa do Mundo 2026: Uma Edição Histórica
            </h2>
            <p className="text-slate-300 text-lg mb-4 leading-relaxed">
              O álbum oficial da Copa do Mundo 2026, produzido pela <strong>Panini</strong>, é uma coleção
              sem precedentes. Pela primeira vez, o torneio será disputado com
              <strong> 48 seleções</strong> em vez das tradicionais 32, com{" "}
              <strong>Canadá, Estados Unidos e México</strong> como países-sede.
            </p>
            <p className="text-slate-300 text-lg mb-4 leading-relaxed">
              Com <strong>980 figurinhas</strong>, este é o <strong>maior álbum de Copa do Mundo</strong> já
              lançado pela Panini — cerca de 300 figurinhas a mais do que a
              edição de 2022. O álbum inclui 68 cromos especiais metalizados que
              tornam a coleção ainda mais valiosa para colecionadores.
            </p>
          </div>

          {/* Section 2: Preços e Versões */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Preços e Versões Disponíveis
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              A Panini oferece várias opções de formato para se adequar a
              diferentes necessidades e orçamentos:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/30 hover:bg-slate-800/50 transition">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Álbum Brochura
                </h3>
                <p className="text-2xl font-bold text-yellow-400 mb-2">
                  R$ 24,90
                </p>
                <p className="text-slate-300">
                  Versão econômica em formato encadernação simples, perfeita
                  para começar.
                </p>
              </div>

              <div className="border border-slate-700 rounded-lg p-6 bg-slate-800/30 hover:bg-slate-800/50 transition">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Álbum Capa Dura
                </h3>
                <p className="text-2xl font-bold text-blue-400 mb-2">
                  A partir de R$ 59,90
                </p>
                <p className="text-slate-300">
                  Versões em capa dura em cores prata e ouro, mais durável e
                  visualmente premium.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
              <p className="text-slate-300 mb-2">
                <strong className="text-white">Preço dos envelopes:</strong> R$
                7,00 por envelope com 7 figurinhas
              </p>
              <p className="text-slate-300">
                <strong className="text-white">Número de envelopes:</strong> Em
                média, você precisará comprar cerca de 130-140 envelopes para
                completar o álbum (varia conforme as trocas).
              </p>
            </div>
          </div>

          {/* Section 3: Como Completar */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Como Completar o Álbum Mais Rápido e Gastando Menos
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-6 py-4 bg-slate-800/30 rounded-r-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  1. Invista no Início
                </h3>
                <p className="text-slate-300">
                  Comece comprando uma ou duas caixas fechadas com múltiplos
                  envelopes. Isso dá uma base sólida de figurinhas para depois
                  fazer trocas mais eficientes.
                </p>
              </div>

              <div className="border-l-4 border-blue-400 pl-6 py-4 bg-slate-800/30 rounded-r-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  2. Organize Suas Repetidas
                </h3>
                <p className="text-slate-300">
                  Separe imediatamente o que é repetido em duas pilhas: comuns
                  e especiais/metalizadas. A cotação de rua costuma ser <strong>1 especial por 3-5 comuns</strong>.
                </p>
              </div>

              <div className="border-l-4 border-green-400 pl-6 py-4 bg-slate-800/30 rounded-r-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  3. Não Cole Tudo de Imediato
                </h3>
                <p className="text-slate-300">
                  Colecionadores experientes esperam ter 50% ou mais do álbum
                  colado antes de finalizar. Assim evitam amassar o álbum
                  durante as trocas.
                </p>
              </div>

              <div className="border-l-4 border-purple-400 pl-6 py-4 bg-slate-800/30 rounded-r-lg">
                <h3 className="text-xl font-semibold text-white mb-2">
                  4. Regra da Reta Final
                </h3>
                <p className="text-slate-300">
                  Quando faltarem menos de 40 figurinhas, pare de comprar
                  envelopes aleatórios. Nesse ponto, as trocas diretas são muito
                  mais eficientes.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Onde Fazer Trocas */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Onde Encontrar Outros Colecionadores para Trocas
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              As trocas são essenciais para completar o álbum rapidamente. Aqui
              estão os melhores lugares:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/30 rounded-lg p-6">
                <Users className="w-8 h-8 text-cyan-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Grupos Locais
                </h3>
                <p className="text-slate-300">
                  Procure por <strong>"Troca de Figurinhas Copa + [Sua Cidade]"</strong> no Facebook e Instagram.
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-6">
                <ShoppingCart className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Bancas e Shoppings
                </h3>
                <p className="text-slate-300">
                  Procure pelas rodas de troca aos sábados e domingos de manhã
                  em bancas tradicionais, shoppings e praças.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Álbum Digital */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Álbum Digital Panini FIFA 2026
            </h2>
            <p className="text-slate-300 text-lg mb-4">
              Além da versão física, a Panini oferece o <strong>álbum digital oficial</strong> disponível no
              aplicativo FIFA Panini Collection.
            </p>

            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-6 space-y-3">
              <p className="text-slate-300">
                <strong className="text-white">✓ Pacotes diários gratuitos:</strong> Você recebe figurinhas
                grátis todos os dias para avançar na coleção.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">✓ Coleta completa:</strong> É possível completar o álbum
                digital sem gastar dinheiro, apenas com paciência.
              </p>
              <p className="text-slate-300">
                <strong className="text-white">✓ Sincronização:</strong> Você pode conectar sua conta para
                marcar o progresso que fez.
              </p>
            </div>
          </div>

          {/* Section 6: Apps que Ajudam */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              5 Apps que Ajudam a Completar o Álbum
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-slate-800/30 rounded-lg p-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Figuritas</h3>
                  <p className="text-slate-300 mt-1">
                    Checklist digital para marcar quais figurinhas você tem,
                    quais são repetidas e o que falta.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-slate-800/30 rounded-lg p-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    FIFA Panini Collection
                  </h3>
                  <p className="text-slate-300 mt-1">
                    App oficial da Panini para o álbum digital com pacotes
                    diários gratuitos.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start bg-slate-800/30 rounded-lg p-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Encontro de Figurinhas
                  </h3>
                  <p className="text-slate-300 mt-1">
                    Conecte com outros colecionadores na sua região para trocar
                    figurinhas rapidamente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: FAQ */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-white mb-8">
              Perguntas Frequentes
            </h2>

            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="q1" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-slate-100">
                  Quantas figurinhas são em total no álbum da Copa 2026?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  O álbum tem 980 figurinhas no total, incluindo 68 especiais metalizadas. Isso o torna o maior álbum de Copa do Mundo já lançado pela Panini.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q2" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-slate-100">
                  Quanto custa completar o álbum?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Se comprar apenas envelopes aleatórios, você gastará entre R$ 910 e R$ 980 (140 envelopes × R$ 7). Porém, com trocas eficientes, o custo cai significativamente para R$ 400-600.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q3" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-slate-100">
                  Qual é a diferença entre figurinhas comuns e especiais?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Figurinhas comuns têm acabamento padrão. Figurinhas especiais são metalizadas e mais raras. Na cotação de rua, 1 especial vale 3 a 5 comuns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q4" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-slate-100">
                  Posso completar o álbum digital gratuitamente?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Sim! O app FIFA Panini Collection distribui pacotes diários gratuitos. Com consistência, é possível completar o álbum digital sem gastar nada.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q5" className="border-slate-700">
                <AccordionTrigger className="text-white hover:text-slate-100">
                  Qual é a melhor estratégia para encontrar figurinhas que faltam?
                </AccordionTrigger>
                <AccordionContent className="text-slate-300">
                  Quando faltarem menos de 40 figurinhas, pare de comprar envelopes aleatórios. Procure especificamente pelos colecionadores que têm as figurinhas que você precisa. Grupos no Facebook e WhatsApp tornam isso mais fácil.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Encontre Outros Colecionadores Agora
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Use o Encontro de Figurinhas para conectar com apaixonados por
              colecionismo na sua região e completar seu álbum muito mais rápido.
            </p>
            <Link href="/arena">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <TrendingUp className="w-4 h-4 mr-2" />
                Acessar Comunidade
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-800/30 border-t border-slate-700">
        <div className="max-w-4xl mx-auto">
          <p className="text-slate-400 text-sm text-center mb-4">
            O guia completo sobre o Álbum Copa do Mundo 2026 da Panini - 980
            figurinhas, 48 seleções, estratégias para completar e onde fazer
            trocas.
          </p>
          <p className="text-slate-500 text-xs text-center">
            Última atualização: 23 de maio de 2026
          </p>
        </div>
      </section>
    </main>
  );
}
