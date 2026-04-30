import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { generateBreadcrumbSchema, BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do Figurinha Fácil. Saiba como coletamos, usamos e protegemos seus dados pessoais.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${BASE_URL}/privacidade`,
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Política de Privacidade" },
]);

export default function PrivacidadePage() {
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
                <li className="text-foreground font-medium">
                  Política de Privacidade
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h1>Política de Privacidade</h1>
              <p className="lead">
                Última atualização: 20 de abril de 2026
              </p>

              <p>
                Esta Política de Privacidade descreve como o Figurinha <span className="text-[#87d400]">Fácil</span>
                coleta, usa e protege suas informações pessoais em conformidade
                com a Lei Geral de Proteção de Dados (LGPD).
              </p>

              <h2>1. Dados que Coletamos</h2>
              <h3>1.1 Dados fornecidos por você</h3>
              <ul>
                <li>Nome e apelido</li>
                <li>Endereço de email</li>
                <li>Cidade e estado</li>
                <li>Lista de figurinhas (repetidas e faltantes)</li>
              </ul>

              <h3>1.2 Dados coletados automaticamente</h3>
              <ul>
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de navegação</li>
                <li>Localização aproximada (com seu consentimento)</li>
              </ul>

              <h2>2. Como Usamos seus Dados</h2>
              <p>Utilizamos suas informações para:</p>
              <ul>
                <li>Criar e gerenciar sua conta</li>
                <li>Conectar você com outros colecionadores</li>
                <li>Exibir pontos de troca próximos</li>
                <li>Enviar notificações sobre trocas compatíveis</li>
                <li>Melhorar nossos serviços e experiência do usuário</li>
                <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              </ul>

              <h2>3. Compartilhamento de Dados</h2>
              <p>
                Compartilhamos seus dados apenas nas seguintes situações:
              </p>
              <ul>
                <li>
                  <strong>Com outros usuários:</strong> Seu apelido e cidade são
                  visíveis para outros colecionadores durante a busca de trocas
                </li>
                <li>
                  <strong>Prestadores de serviço:</strong> Utilizamos serviços
                  terceirizados para hospedagem, autenticação e análise de dados
                </li>
                <li>
                  <strong>Obrigações legais:</strong> Quando exigido por lei ou
                  ordem judicial
                </li>
              </ul>

              <h2>4. Segurança dos Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger
                seus dados, incluindo:
              </p>
              <ul>
                <li>Criptografia de dados em trânsito (HTTPS)</li>
                <li>Autenticação segura via Clerk</li>
                <li>Acesso restrito aos dados por funcionários autorizados</li>
                <li>Monitoramento contínuo de segurança</li>
              </ul>

              <h2>5. Seus Direitos (LGPD)</h2>
              <p>Você tem direito a:</p>
              <ul>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar o consentimento para uso dos dados</li>
                <li>Solicitar a portabilidade dos dados</li>
                <li>Obter informações sobre compartilhamento de dados</li>
              </ul>

              <h2>6. Cookies</h2>
              <p>
                Utilizamos cookies essenciais para o funcionamento da plataforma
                e cookies de análise para entender como você usa nossos
                serviços. Você pode gerenciar suas preferências de cookies nas
                configurações do navegador.
              </p>

              <h2>7. Retenção de Dados</h2>
              <p>
                Mantemos seus dados enquanto sua conta estiver ativa. Após a
                exclusão da conta, seus dados serão removidos em até 30 dias,
                exceto quando houver obrigação legal de retenção.
              </p>

              <h2>8. Menores de Idade</h2>
              <p>
                Nossos serviços são destinados a maiores de 13 anos. Menores de
                18 anos devem ter autorização dos pais ou responsáveis para
                utilizar a plataforma.
              </p>

              <h2>9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta política periodicamente. Alterações
                significativas serão comunicadas por email ou através de aviso
                na plataforma.
              </p>

              <h2>10. Contato</h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta
                política, entre em contato através da nossa{" "}
                <Link href="/contato" className="text-primary">
                  página de contato
                </Link>
                .
              </p>

              <p>
                <strong>Encarregado de Dados (DPO):</strong> privacidade@figurinhafacil.com.br
              </p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
