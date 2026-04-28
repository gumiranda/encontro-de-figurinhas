import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { isbot } from "isbot";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { HeroSection } from "@/modules/landing/ui/components/hero-section";
import { ProblemSection } from "@/modules/landing/ui/components/problem-section";
import { HowItWorksSection } from "@/modules/landing/ui/components/how-it-works-section";
import { SocialProofSection } from "@/modules/landing/ui/components/social-proof-section";
import { SelecoesSection } from "@/modules/landing/ui/components/selecoes-section";
import { FAQSection } from "@/modules/landing/ui/components/faq-section";
import { SecuritySection } from "@/modules/landing/ui/components/security-section";
import { FinalCTASection } from "@/modules/landing/ui/components/final-cta-section";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { FAQ_DATA } from "@/modules/landing/lib/landing-data";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSportsEventSchema,
  generateServiceSchema,
  generateSoftwareApplicationSchema,
  generateSpeakableSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: {
    absolute: "Troca de figurinhas Copa 2026 online com segurança | FigurinhaFácil",
  },
  description:
    "Troque figurinhas raras da Copa 2026 com colecionadores perto de você. Seguro, rápido e grátis. 48k colecionadores, 847 cidades.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Troca de figurinhas Copa 2026 online com segurança",
    description:
      "Encontre colecionadores perto de você. 12.847 trocas ativas hoje.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troca de figurinhas Copa 2026 online com segurança",
    description:
      "Encontre colecionadores perto de você. 12.847 trocas ativas hoje.",
  },
  other: {
    "article:published_time": "2025-01-01T00:00:00Z",
  },
};

const HOW_TO_STEPS = [
  {
    title: "Buscar",
    description: "Cadastre o que você tem e precisa. Importa álbum por foto.",
  },
  {
    title: "Match em real-time",
    description: "Encontra colecionadores em 5 km com encaixe perfeito.",
  },
  {
    title: "Confirmar",
    description: "Combinem pelo chat. Marquem ponto público.",
  },
  {
    title: "Receber",
    description: "Troquem, +1 reputação. Álbum atualiza sozinho.",
  },
];

const organizationSchema = generateOrganizationSchema();
const webSiteSchema = generateWebSiteSchema();
const faqSchema = generateFAQSchema([...FAQ_DATA]);
const howToSchema = generateHowToSchema(
  "Como trocar figurinhas no FigurinhaFácil",
  "Aprenda a trocar figurinhas em 4 passos simples e complete seu álbum da Copa 2026.",
  HOW_TO_STEPS
);
const sportsEventSchema = generateSportsEventSchema();
const serviceSchema = generateServiceSchema();
const softwareAppSchema = generateSoftwareApplicationSchema();
const speakableSchema = generateSpeakableSchema(BASE_URL, ["h1", ".faq-answer", ".hero-description"]);

const combinedSchema = generateCombinedSchema([
  organizationSchema,
  webSiteSchema,
  faqSchema,
  howToSchema,
  sportsEventSchema,
  serviceSchema,
  softwareAppSchema,
  speakableSchema,
]);

async function DynamicFinalCTA() {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ipCity = h.get("x-vercel-ip-city");
  const cityName = isbot(ua)
    ? null
    : ipCity
      ? decodeURIComponent(ipCity)
      : null;

  return <FinalCTASection cityName={cityName} />;
}

function FinalCTASkeleton() {
  return (
    <section className="px-6 py-28">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-[#181f33] to-[#13192b] border border-[#95aaff]/15 p-10 md:p-16 overflow-hidden text-center">
          <div className="h-12 md:h-14 bg-white/10 rounded-lg animate-pulse mb-6 max-w-xl mx-auto" />
          <div className="h-6 bg-white/5 rounded animate-pulse max-w-md mx-auto" />
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const totalTrocas = null;

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main id="main-content" className="pt-16 min-h-screen">
        {/* 1. Hero - Core value proposition */}
        <HeroSection totalTrocas={totalTrocas} />
        {/* 2. Problem - Pain points */}
        <ProblemSection />
        {/* 3. How It Works - 4 steps */}
        <HowItWorksSection />
        {/* 4. Social Proof - Stats + rarity leaderboard */}
        <SocialProofSection />
        {/* 5. Seleções - 32 teams grid */}
        <SelecoesSection />
        {/* 6. FAQ - Handle objections */}
        <FAQSection faqs={FAQ_DATA} />
        {/* 7. Security - Comparison table */}
        <SecuritySection />
        {/* 8. Final CTA - Capture remainders */}
        <Suspense fallback={<FinalCTASkeleton />}>
          <DynamicFinalCTA />
        </Suspense>
      </main>
      <LandingFooter />
    </>
  );
}
