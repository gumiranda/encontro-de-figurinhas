import type { Metadata } from "next";
import { headers } from "next/headers";
import { isbot } from "isbot";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { HeroSection } from "@/modules/landing/ui/components/hero-section";
import { SocialProofSection } from "@/modules/landing/ui/components/social-proof-section";
import { FeaturesSection } from "@/modules/landing/ui/components/features-section";
import { HowItWorksSection } from "@/modules/landing/ui/components/how-it-works-section";
import { CitiesSection } from "@/modules/landing/ui/components/cities-section";
import { FAQSection } from "@/modules/landing/ui/components/faq-section";
import { FinalCTASection } from "@/modules/landing/ui/components/final-cta-section";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSportsEventSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Figurinha Fácil - Troca de Figurinhas Copa 2026",
  description:
    "A maior rede de troca de figurinhas do Brasil. Encontre colecionadores perto de você, troque figurinhas repetidas e complete seu álbum da Copa 2026.",
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "article:published_time": "2025-01-01T00:00:00Z",
    "article:modified_time": new Date().toISOString(),
  },
};

const FAQ_DATA = [
  {
    question: "Como funciona a troca de figurinhas no Figurinha Fácil?",
    answer:
      "Cadastre suas figurinhas repetidas e as que você precisa. Nossa plataforma conecta você com outros colecionadores na sua cidade que têm as figurinhas que você procura.",
  },
  {
    question: "O Figurinha Fácil é gratuito?",
    answer:
      "Sim! O cadastro e uso básico da plataforma são totalmente gratuitos. Você pode cadastrar suas figurinhas, encontrar colecionadores e combinar trocas sem custo.",
  },
  {
    question: "Em quais cidades posso trocar figurinhas?",
    answer:
      "O Figurinha Fácil está disponível em todas as capitais brasileiras e principais cidades como São Paulo, Rio de Janeiro, Belo Horizonte, Brasília, Salvador, Curitiba, entre outras.",
  },
  {
    question: "Quais álbuns de figurinhas posso trocar?",
    answer:
      "Você pode trocar figurinhas de qualquer álbum, incluindo Copa do Mundo 2026, álbuns Panini, e outras coleções populares.",
  },
  {
    question: "Como encontro pontos de troca presenciais?",
    answer:
      "Use nosso mapa interativo para encontrar pontos de troca na sua cidade. São locais públicos onde colecionadores se encontram para realizar trocas de forma segura.",
  },
  {
    question: "Quanto tempo leva para analisar uma sugestão de ponto de troca?",
    answer:
      "A análise leva de 24 a 48 horas. Nossa equipe verifica segurança do local, movimento e adequação antes de aprovar.",
  },
  {
    question: "Posso sugerir qualquer local como ponto de troca?",
    answer:
      "Priorize locais públicos e movimentados como shoppings, praças de alimentação e parques. Evitamos pontos em residências, ruas isoladas ou estabelecimentos privados sem acesso livre.",
  },
  {
    question: "Quantas sugestões de novos pontos posso enviar?",
    answer:
      "Usuários com Reliability Score abaixo de 5 podem ter até 2 sugestões pendentes simultaneamente. Contribuições aprovadas aumentam seu score e liberam envios ilimitados.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Cadastre-se grátis",
    description:
      "Crie sua conta em segundos e informe quais figurinhas você tem repetidas e quais precisa.",
  },
  {
    title: "Encontre matches",
    description:
      "Nossa plataforma conecta você automaticamente com colecionadores que têm o que você precisa.",
  },
  {
    title: "Troque e complete",
    description:
      "Combine um ponto de encontro seguro na sua cidade e realize a troca presencialmente.",
  },
];

const organizationSchema = generateOrganizationSchema();
const webSiteSchema = generateWebSiteSchema();
const faqSchema = generateFAQSchema(FAQ_DATA);
const howToSchema = generateHowToSchema(
  "Como trocar figurinhas no Figurinha Fácil",
  "Aprenda a trocar figurinhas em 3 passos simples e complete seu álbum da Copa 2026.",
  HOW_TO_STEPS
);
const sportsEventSchema = generateSportsEventSchema();

const combinedSchema = generateCombinedSchema([
  organizationSchema,
  webSiteSchema,
  faqSchema,
  howToSchema,
  sportsEventSchema,
]);

export default async function LandingPage() {
  const totalTrocas = null;

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ipCity = h.get("x-vercel-ip-city");
  const cityName = isbot(ua)
    ? null
    : ipCity
      ? decodeURIComponent(ipCity)
      : null;

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main id="main-content" className="pt-24 min-h-screen">
        {/* 1. Hero - Core value proposition */}
        <HeroSection totalTrocas={totalTrocas} />
        {/* 2. Social Proof - Build trust */}
        <SocialProofSection />
        {/* 3. Features/Solution - How we solve it */}
        <FeaturesSection />
        {/* 4. How It Works - Reduce complexity */}
        <HowItWorksSection />
        {/* 5. Cities - Show where it works */}
        <CitiesSection />
        {/* 6. FAQ - Handle objections */}
        <FAQSection faqs={FAQ_DATA} />
        {/* 7. Final CTA - Capture remainders */}
        <FinalCTASection cityName={cityName} />
      </main>
      <LandingFooter />
    </>
  );
}
