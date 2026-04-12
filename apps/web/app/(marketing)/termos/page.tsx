import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do Figurinha Fácil. Leia nossas condições de utilização da plataforma de troca de figurinhas.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${BASE_URL}/termos`,
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Termos de Uso" },
]);

export default function TermosPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">Termos de Uso</li>
              </ol>
            </nav>

            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h1>Termos de Uso</h1>
              <p className="lead">
                Última atualização: {new Date().toLocaleDateString("pt-BR")}
              </p>

              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Figurinha Fácil, você concorda com estes
                Termos de Uso. Se você não concordar com qualquer parte destes
                termos, não utilize nossa plataforma.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                O Figurinha Fácil é uma plataforma que conecta colecionadores de
                figurinhas, permitindo que encontrem outros usuários para
                realizar trocas. Não vendemos figurinhas diretamente e não
                intermediamos as transações entre usuários.
              </p>

              <h2>3. Cadastro e Conta</h2>
              <p>
                Para utilizar nossos serviços, você deve criar uma conta
                fornecendo informações verdadeiras e atualizadas. Você é
                responsável por manter a confidencialidade de sua senha e por
                todas as atividades que ocorrem em sua conta.
              </p>

              <h2>4. Uso Adequado</h2>
              <p>Você concorda em:</p>
              <ul>
                <li>Usar a plataforma apenas para fins legítimos de troca de figurinhas</li>
                <li>Não publicar conteúdo falso, enganoso ou ofensivo</li>
                <li>Não tentar acessar contas de outros usuários</li>
                <li>Não usar a plataforma para spam ou publicidade não autorizada</li>
                <li>Respeitar outros usuários e a comunidade</li>
              </ul>

              <h2>5. Trocas entre Usuários</h2>
              <p>
                As trocas de figurinhas são realizadas diretamente entre os
                usuários. O Figurinha Fácil não se responsabiliza por:
              </p>
              <ul>
                <li>Qualidade ou autenticidade das figurinhas trocadas</li>
                <li>Não comparecimento de usuários aos encontros combinados</li>
                <li>Problemas de segurança durante encontros presenciais</li>
                <li>Disputas entre usuários</li>
              </ul>

              <h2>6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo do Figurinha Fácil, incluindo textos, gráficos,
                logos e software, é de nossa propriedade ou licenciado para nós
                e está protegido por leis de direitos autorais.
              </p>

              <h2>7. Limitação de Responsabilidade</h2>
              <p>
                O Figurinha Fácil é fornecido &ldquo;como está&rdquo;. Não garantimos que o
                serviço será ininterrupto ou livre de erros. Em nenhuma
                circunstância seremos responsáveis por danos indiretos,
                incidentais ou consequentes.
              </p>

              <h2>8. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer
                momento. Alterações significativas serão comunicadas através da
                plataforma ou por email.
              </p>

              <h2>9. Encerramento</h2>
              <p>
                Podemos encerrar ou suspender sua conta a qualquer momento, sem
                aviso prévio, por violação destes termos ou por qualquer outro
                motivo a nosso critério.
              </p>

              <h2>10. Lei Aplicável</h2>
              <p>
                Estes termos são regidos pelas leis do Brasil. Qualquer disputa
                será resolvida nos tribunais da comarca de São Paulo, SP.
              </p>

              <h2>11. Contato</h2>
              <p>
                Para dúvidas sobre estes termos, entre em contato através da
                nossa{" "}
                <Link href="/contato" className="text-primary">
                  página de contato
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
