import Link from "next/link";
import { Landmark, Share2, Globe } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Termos de Servico", href: "#" },
  { label: "Politica de Privacidade", href: "#" },
  { label: "Suporte", href: "#" },
  { label: "Regras de Troca", href: "#" },
];

export function LandingFooter() {
  return (
    <footer
      role="contentinfo"
      className="bg-[#0d1323] w-full border-t border-[#181f33]"
    >
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 gap-6 w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Landmark className="text-[var(--landing-primary)] w-6 h-6" aria-hidden="true" />
            <span className="text-[#0052FF] font-bold text-xl">Figurinha Facil</span>
          </Link>
          <p className="font-[var(--font-body)] text-sm uppercase tracking-widest text-slate-500">
            &copy; 2024 Figurinha Facil. The Digital Arena.
          </p>
        </div>

        <nav aria-label="Links do rodape" className="flex flex-wrap justify-center gap-8">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-[var(--font-body)] text-sm uppercase tracking-widest text-slate-500 hover:text-white transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-4">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[var(--landing-surface-container-high)] flex items-center justify-center text-[var(--landing-outline)] hover:text-[var(--landing-primary)] transition-colors border border-[var(--landing-outline-variant)]/10"
            aria-label="Compartilhar"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[var(--landing-surface-container-high)] flex items-center justify-center text-[var(--landing-outline)] hover:text-[var(--landing-primary)] transition-colors border border-[var(--landing-outline-variant)]/10"
            aria-label="Mudar idioma"
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
