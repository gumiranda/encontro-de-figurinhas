import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Sparkles, TrendingUp, Users, MapPin } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateCombinedSchema,
  generateFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas Panini",
  description: "Descubra tudo sobre o novo álbum da Copa do Mundo 2026: 980 figurinhas, 68 especiais, 48 seleções. Preço, data de lançamento e como completar sua coleção.",
  alternates: {
    canonical: `${BASE_URL}/album-copa-2026`,
  },
  openGraph: {
    type: "article",
    url: `${BASE_URL}/album-copa-2026`,
    title: "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas",
    description: "Guia definitivo sobre o álbum oficial Panini da Copa 2026. Tudo sobre as 980 figurinhas, preço e estratégias para completar.",
    publishedTime: "2026-01-15T00:00:00Z",
    modifiedTime: "2026-05-21T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Álbum Copa do Mundo 2026: Guia Completo",
    description: "980 figurinhas, 68 especiais e estratégias para completar seu álbum Panini.",
  },
};

const FAQ_DATA = [
  {
    question: "Quanto custa o álbum da Copa 2026?",
    answer: "O álbum custa entre R$ 24,90 (brochura) e R$ 79,90 (capa dura). Os pacotes com 7 figurinhas custam R$ 7,00 cada.",
  },
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer: "O álbum possui 980 figurinhas no total, sendo 68 delas especiais. Isso representa quase 300 figurinhas a mais que na edição de 2022.",
  },
  {
    question: "Quando foi lançado o álbum da Copa 2026?",
    answer: "A comercialização oficial começou em 30 de abril de 2026 em bancas, livrarias e mercados. Você também pode comprar online e importar seu álbum por foto.",
  },
  {
    question: "Como completar o álbum da Copa 2026 rápido?",
    answer: "Use plataformas como FigurinhaFácil para trocar figurinhas com outros colecionadores. Você pode encontrar collectors em sua região em até 5km de distância.",
  },
  {
    question: "Quais são as figurinhas especiais do álbum?",
    answer: "O álbum tem 68 figurinhas especiais, incluindo ícones das seleções e estrelas do futebol internacional. Estas são as mais procuradas pelos colecionadores.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Álbum Copa 2026" },
]);

const webPageSchema = generateWebPageSchema({
  url: `${BASE_URL}/album-copa-2026`,
  name: "Álbum Copa do Mundo 2026: Guia Completo com 980 Figurinhas Panini",
  description: "Descubra tudo sobre o novo álbum da Copa do Mundo 2026: especificações, preço, lançamento e estratégias para completar sua coleção.",
  datePublished: "2026-01-15T00:00:00Z",
  dateModified: "2026-05-21T00:00:00Z",
});

const faqSchema = generateFAQSchema(FAQ_DATA);

const combinedSchema = generateCombinedSchema([
  breadcrumbSchema,
  webPageSchema,
  faqSchema,
]);

export default function AlbumCopa2026Page() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "Início", href: "/" },
              { label: "Álbum Copa 2026" },
            ]}
          />

          {/* Hero Section */}
          <section className="mb-12 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                <Sparkles className="w-4 h-4 mr-1" />
                Guia Completo 2026
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Álbum Copa do Mundo 2026: Tudo que você precisa saber sobre as 980 figurinhas Panini
            </h1>

            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              O novo álbum oficial da Copa do Mundo FIFA 2026 é o maior já produzido pela Panini. Com 980 figurinhas, 68 especiais e representação das 48 seleções participantes, descubra como completar sua coleção de forma rápida e econômica.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/propostas">
                  Começar a Trocar
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/figurinhas">Ver Figurinhas</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">980</div>
                <div className="text-sm text-slate-600">Figurinhas totais</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-amber-600">68</div>
                <div className="text-sm text-slate-600">Figurinhas especiais</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">48</div>
                <div className="text-sm text-slate-600">Seleções participantes</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">112</div>
                <div className="text-sm text-slate-600">Páginas do álbum</div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">O Novo Álbum da Copa 2026: Inovações e Especificações</h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                A Copa do Mundo FIFA 2026 será histórica como a primeira a contar com 48 seleções participantes, e o álbum de figurinhas Panini reflete essa mudança significativa. Com 980 cromos no total, a coleção oferece quase 300 figurinhas a mais do que a edição de 2022, proporcionando uma experiência ainda mais completa e desafiadora para os colecionadores.
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">Especificações Técnicas do Álbum</h3>

              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                <li><strong>Total de figurinhas:</strong> 980 cromos</li>
                <li><strong>Figurinhas especiais:</strong> 68 (incluindo ícones e estrelas)</li>
                <li><strong>Seleções:</strong> 48 (primeira Copa com este formato)</li>
                <li><strong>Páginas:</strong> 112 páginas de coleção</li>
                <li><strong>Formato:</strong> Disponível em brochura e capa dura</li>
                <li><strong>Peso:</strong> Aproximadamente 800g (capa dura)</li>
              </ul>

              <p className="text-slate-700 leading-relaxed mb-6">
                O álbum de capa dura é a opção premium, oferecendo melhor durabilidade e apresentação para quem planeja manter sua coleção completa como item de coleção valioso.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Preços e Versões Disponíveis</h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                A Panini oferece diferentes opções de álbuns para diferentes tipos de colecionadores:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border-2 border-slate-200 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Álbum Brochura</h4>
                  <p className="text-3xl font-bold text-blue-600 mb-4">R$ 24,90</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Capa mole de qualidade</li>
                    <li>Ideal para collectors iniciantes</li>
                    <li>Mais acessível e portátil</li>
                    <li>Perfeito para trocar figurinhas</li>
                  </ul>
                </div>

                <div className="border-2 border-amber-300 rounded-lg p-6 bg-amber-50">
                  <h4 className="text-xl font-bold text-slate-900 mb-3">Álbum Capa Dura Premium</h4>
                  <p className="text-3xl font-bold text-amber-600 mb-4">R$ 79,90</p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Capa dura resistente e durável</li>
                    <li>Acabamento especial FIFA 2026</li>
                    <li>Qualidade superior de papel</li>
                    <li>Ideal para coleção de longa duração</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-3">Pacotes de Figurinhas</h4>
              <p className="text-slate-700 mb-4">
                Cada pacote contém 7 figurinhas aleatórias e custa <strong>R$ 7,00</strong>. Para completar o álbum completo, você precisará de aproximadamente 140 pacotes (considerando repetições).
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Quando Comprar: Data de Lançamento e Disponibilidade</h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                A comercialização oficial do álbum e dos pacotes de figurinhas da Copa 2026 começou no dia <strong>30 de abril de 2026</strong>. O álbum está disponível em:
              </p>

              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                <li>Bancas de jornal e revistas</li>
                <li>Livrarias especializadas</li>
                <li>Supermercados e hipermercados</li>
                <li>Lojas de brinquedos</li>
                <li>Plataformas de e-commerce (Amazon, Mercado Livre, etc.)</li>
                <li>Site oficial da Panini</li>
              </ul>

              <p className="text-slate-700 leading-relaxed">
                A demanda esperada é alta, especialmente pelas figurinhas especiais e pelos cromos mais raros. Recomenda-se comprar cedo para garantir a disponibilidade dos pacotes e evitar preços inflacionados.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">As 68 Figurinhas Especiais: O que Torna o Álbum 2026 Único</h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                Um dos grandes diferenciais do álbum da Copa 2026 são as 68 figurinhas especiais, que incluem:
              </p>

              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                <li><strong>Ícones das Seleções:</strong> Maiores estrelas de cada país (jogadores com maior reputação internacional)</li>
                <li><strong>Cartões Dourados:</strong> Versão premium de jogadores escolhidos</li>
                <li><strong>Lendas do Futebol:</strong> Antigos craques que marcaram presença na Copa</li>
                <li><strong>Técnicos Famosos:</strong> Principais treinadores das 48 seleções</li>
                <li><strong>Distintivos Especiais:</strong> Marcas do Brasil e outras seleções participantes</li>
              </ul>

              <p className="text-slate-700 leading-relaxed">
                Essas figurinhas especiais são as mais procuradas pelos colecionadores e costumam ter valor de troca muito maior do que as figurinhas comuns. Completar a coleção de especiais é o objetivo dos collectors mais dedicados.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Como Completar o Álbum Rapidamente: Estratégias Comprovadas</h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                Completar 980 figurinhas de forma eficiente requer estratégia. Aqui estão as melhores práticas:
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Sistema de Trocas Online (Mais Eficiente)</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                Plataformas como FigurinhaFácil conectam colecionadores em sua região para trocas diretas. Este método economiza dinheiro e oferece:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                <li>Encontrar collectors que têm exatamente o que você precisa</li>
                <li>Trocar figurinhas sem gastar mais dinheiro em pacotes</li>
                <li>Conhecer outros colecionadores da sua região</li>
                <li>Completar o álbum de 30% a 50% mais rápido</li>
              </ul>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Compra Inteligente de Pacotes</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-6">
                <li>Compre em promoções e ofertas semanais nas lojas</li>
                <li>Procure por pacotes com bônus (extra de figurinhas)</li>
                <li>Compare preços em diferentes estabelecimentos</li>
                <li>Use descontos de plataformas de cupom</li>
              </ul>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Importar Álbum por Foto</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                A tecnologia permite fotografar seu álbum e importar automaticamente quais figurinhas você tem. Isso economiza tempo e garante precisão no registro de suas coleções.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Comparação: Álbum Copa 2026 vs. Edições Anteriores</h2>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse text-slate-700 text-sm">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="border border-slate-300 p-3 text-left">Característica</th>
                      <th className="border border-slate-300 p-3 text-center">Copa 2022</th>
                      <th className="border border-slate-300 p-3 text-center">Copa 2026</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-3">Total de Figurinhas</td>
                      <td className="border border-slate-300 p-3 text-center">682</td>
                      <td className="border border-slate-300 p-3 text-center font-bold text-blue-600">980</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-3">Seleções</td>
                      <td className="border border-slate-300 p-3 text-center">32</td>
                      <td className="border border-slate-300 p-3 text-center font-bold text-blue-600">48</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-3">Páginas</td>
                      <td className="border border-slate-300 p-3 text-center">80</td>
                      <td className="border border-slate-300 p-3 text-center font-bold text-blue-600">112</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border border-slate-300 p-3">Preço (Brochura)</td>
                      <td className="border border-slate-300 p-3 text-center">R$ 19,90</td>
                      <td className="border border-slate-300 p-3 text-center font-bold text-blue-600">R$ 24,90</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-slate-700 leading-relaxed">
                O álbum da Copa 2026 representa um salto significativo em tamanho e escopo, tornando-se a maior edição de álbum de Copa do Mundo já produzida pela Panini.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Colecionadores Brasileiros: Destaque para o Time da Seleção</h2>

              <p className="text-slate-700 leading-relaxed mb-6">
                A Seleção Brasileira terá representação especial no álbum com 18 jogadores, a mesma quantidade de outras seleções fortes. A lista foi atualizada com novos talentos como Estêvão e Luiz Henrique, refletindo a renovação do time.
              </p>

              <p className="text-slate-700 leading-relaxed mb-6">
                As figurinhas dos jogadores brasileiros são especialmente procuradas por collectors, tornando-as valiosas para trocas. Conheça os principais jogadores que estarão no álbum e aproveite para construir uma coleção completa do Brasil.
              </p>
            </section>
          </article>

          {/* FAQ Section */}
          <section className="mb-12 bg-slate-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Dúvidas Frequentes sobre o Álbum da Copa 2026</h2>

            <div className="space-y-6">
              {FAQ_DATA.map((faq, index) => (
                <details key={index} className="group cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-slate-900 text-lg hover:text-blue-600 transition-colors">
                    {faq.question}
                    <span className="group-open:rotate-180 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </summary>
                  <p className="text-slate-700 mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-3">Comece a Completar seu Álbum Agora</h2>
                <p className="text-blue-100 text-lg">
                  Junte-se a milhares de colecionadores que usam FigurinhaFácil para trocar e completar suas coleções de forma inteligente.
                </p>
              </div>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shrink-0">
                <Link href="/propostas">
                  Iniciar Trocas
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Related Links */}
          <section className="mb-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Conteúdo Relacionado</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/figurinhas" className="group p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 mb-2">Ver todas as Figurinhas</h3>
                <p className="text-sm text-slate-600">Catálogo completo das 980 figurinhas do álbum</p>
              </Link>
              <Link href="/propostas" className="group p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 mb-2">Trocas Ativas</h3>
                <p className="text-sm text-slate-600">Encontre colecionadores prontos para trocar agora</p>
              </Link>
              <Link href="/comunidade" className="group p-4 border rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 mb-2">Comunidade</h3>
                <p className="text-sm text-slate-600">Conecte-se com outros colecionadores</p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </>
  );
}
