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
                FigurinhaFácil
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

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-[#a6aabf]">
            © 2026 FigurinhaFácil · feito por coletores, para coletores
          </p>
          <p className="text-xs font-mono text-[#a6aabf]">
            Não afiliado a FIFA, Panini ou Copa do Mundo.
          </p>
        </div>
      </div>
    </footer>
  );
}
