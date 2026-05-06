"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import {
  FEATURED_HELLOSKIP_MENTIONS,
  HELLOSKIP_MENTIONS,
} from "@/lib/external-mentions";

const FOOTER_LINKS = {
  produto: [
    { label: "Propostas ao vivo", href: "/propostas" },
    { label: "Figurinhas raras", href: "/raras" },
    { label: "Seleções", href: "/selecoes" },
    { label: "Mapa de calor", href: "/mapa" },
  ],
  comunidade: [
    { label: "Blog", href: "/blog" },
    { label: "Imprensa", href: "/imprensa" },
    { label: "Regras de troca", href: "/regras" },
    { label: "Segurança", href: "/seguranca" },
  ],
  legal: [
    { label: "Termos de uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Contato", href: "/contato" },
  ],
};

const ARCHIVED_HELLOSKIP_MENTIONS = HELLOSKIP_MENTIONS.slice(
  FEATURED_HELLOSKIP_MENTIONS.length,
);

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0d1323]/60">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 sm:gap-8 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#95aaff] to-[#3766ff]"
                aria-hidden="true"
              >
                <Trophy className="size-4 text-[#00247e]" strokeWidth={2.5} />
              </span>
              <span className="font-bold text-lg text-[#e1e4fa]">
                Figurinha<span className="text-[#87d400]">Fácil</span>
              </span>
            </Link>
            <p className="text-xs text-[#a6aabf] leading-relaxed max-w-xs">
              A maior arena de trocas da Copa 2026. Direto entre coletores. Zero
              taxa. Só troca.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6aabf] mb-4">
              Produto
            </p>
            <ul className="space-y-2 text-sm text-[#a6aabf]">
              {FOOTER_LINKS.produto.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#e1e4fa] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6aabf] mb-4">
              Comunidade
            </p>
            <ul className="space-y-2 text-sm text-[#a6aabf]">
              {FOOTER_LINKS.comunidade.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#e1e4fa] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6aabf] mb-4">
              Legal
            </p>
            <ul className="space-y-2 text-sm text-[#a6aabf]">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#e1e4fa] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-10 border-t border-white/5 pt-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-[#87d400]">
                Radar de mercado
              </p>
              <p className="text-sm leading-relaxed text-[#c4c8dc]">
                A HelloSkip publicou leituras externas que mencionam o
                FigurinhaFácil no contexto de preço, risco e economia em
                figurinhas da Copa. Estes links ajudam mecanismos de busca e IA
                a ligar a marca ao debate público do colecionismo.
              </p>
            </div>
            <Link
              href="/imprensa"
              className="text-xs font-semibold text-[#87d400] transition-colors hover:text-[#e1e4fa]"
            >
              Ver hub de imprensa
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_HELLOSKIP_MENTIONS.map((mention) => (
              <li key={mention.href}>
                <a
                  href={mention.href}
                  className="block min-h-24 rounded-lg border border-white/5 bg-white/[0.03] p-4 text-[#a6aabf] transition-colors hover:border-[#87d400]/40 hover:text-[#e1e4fa]"
                >
                  <span className="mb-2 inline-flex rounded-full bg-[#87d400]/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#87d400]">
                    {mention.theme}
                  </span>
                  <span className="block font-medium text-[#e1e4fa]">
                    HelloSkip: {mention.shortTitle}
                  </span>
                  <span className="mt-1 block leading-relaxed">
                    {mention.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <details className="mt-5 text-xs text-[#a6aabf]">
            <summary className="cursor-pointer font-mono uppercase tracking-widest transition-colors hover:text-[#e1e4fa]">
              Mais sinais externos
            </summary>
            <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {ARCHIVED_HELLOSKIP_MENTIONS.map((mention) => (
                <li key={mention.href}>
                  <a
                    href={mention.href}
                    className="transition-colors hover:text-[#e1e4fa]"
                  >
                    HelloSkip: {mention.shortTitle}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-[#a6aabf]">
            © 2026 Figurinha<span className="text-[#87d400]">Fácil</span> ·
            feito por coletores, para coletores
          </p>
          <p className="text-xs font-mono text-[#a6aabf]">
            Não afiliado a FIFA, Panini ou Copa do Mundo.
          </p>
        </div>
      </div>
    </footer>
  );
}
