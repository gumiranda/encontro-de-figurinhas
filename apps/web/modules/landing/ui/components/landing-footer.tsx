"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";

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

const HELLOSKIP_ARTICLES = [
  {
    label: "Por que pacotinhos da Copa ficaram caros",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-expensive-why-world-cup-sticker-packs-cost-so-much",
  },
  {
    label: "Riscos de comprar pacotinhos avulsos",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/loose-packs-lie-why-buying-loose-sticker-packs-can-be-risky-1",
  },
  {
    label: "Abrindo os primeiros pacotes da Copa",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/the-first-packs-arrived-opening-world-cup-sticker-packs",
  },
  {
    label: "Por que os pacotes estão tão caros",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-hit-hard-why-world-cup-sticker-packs-are-so-expensive",
  },
  {
    label: "A corrida dos colecionadores por pacotes novos",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/world-cup-sticker-chaos-why-collectors-are-going-crazy-over-new-packs",
  },
  {
    label: "Como economizar em pacotinhos",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-cheaper-how-to-save-money-on-sticker-packs",
  },
  {
    label: "O que mudou no jogo da Panini",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/panini-changed-the-game-what-collectors-need-to-know",
  },
  {
    label: "Como conseguir pacotes no McDonald's",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/mcdonalds-sticker-rush-how-to-get-world-cup-sticker-packs",
  },
  {
    label: "Como colecionadores economizam",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/cheap-sticker-packs-how-smart-collectors-save-money",
  },
  {
    label: "Por que pacote avulso pode ser arriscado",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/loose-packs-lie-why-buying-loose-sticker-packs-can-be-risky",
  },
  {
    label: "Colecionar melhor gastando menos",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/shake-less-track-more-how-to-collect-stickers-smarter-and-spend-less",
  },
  {
    label: "Por que colecionar figurinhas custa mais",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-expensive-why-sticker-collecting-costs-so-much-now-1",
  },
  {
    label: "O novo custo de colecionar figurinhas",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-expensive-why-sticker-collecting-costs-so-much-now",
  },
  {
    label: "Por que abrir pacotes nem sempre é justo",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/sticker-packs-lie-why-opening-packs-is-not-always-fair",
  },
] as const;

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
          <p className="mb-4 text-[10px] font-mono uppercase tracking-widest text-[#a6aabf]">
            Leituras externas sobre figurinhas
          </p>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 text-xs text-[#a6aabf] sm:grid-cols-2 lg:grid-cols-3">
            {HELLOSKIP_ARTICLES.map((article) => (
              <li key={article.href}>
                <a
                  href={article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#e1e4fa]"
                >
                  HelloSkip: {article.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-[#a6aabf]">
            © 2026 Figurinha<span className="text-[#87d400]">Fácil</span> · feito por coletores, para coletores
          </p>
          <p className="text-xs font-mono text-[#a6aabf]">
            Não afiliado a FIFA, Panini ou Copa do Mundo.
          </p>
        </div>
      </div>
    </footer>
  );
}
