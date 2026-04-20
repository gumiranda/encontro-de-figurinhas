import Link from "next/link";
import { Landmark, Share2, Globe } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Álbum Copa 2026", href: "/album-copa-do-mundo-2026" },
  { label: "Blog", href: "/blog" },
];

const HUB_LINKS = [
  { label: "Cidades", href: "/cidades" },
  { label: "Estados", href: "/estados" },
  { label: "Seleções", href: "/selecoes" },
  { label: "Figurinhas", href: "/figurinhas" },
  { label: "Pontos de Troca", href: "/pontos" },
];

const CITY_LINKS = [
  { label: "São Paulo", href: "/cidade/sao-paulo" },
  { label: "Rio de Janeiro", href: "/cidade/rio-de-janeiro" },
  { label: "Belo Horizonte", href: "/cidade/belo-horizonte" },
  { label: "Curitiba", href: "/cidade/curitiba" },
  { label: "Porto Alegre", href: "/cidade/porto-alegre" },
];

const LEGAL_LINKS = [
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Privacidade", href: "/privacidade" },
];

export function LandingFooter() {
  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-outline-variant/40 bg-surface-container-low"
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Landmark className="text-primary w-6 h-6" aria-hidden="true" />
              <span className="text-primary-dim font-bold text-xl">Figurinha Fácil</span>
            </Link>
            <p className="text-sm text-slate-500 mb-4">
              A melhor plataforma para trocar figurinhas da Copa do Mundo 2026.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center text-[var(--outline)] hover:text-[var(--primary)] transition-colors border border-[var(--outline-variant)]/10"
                aria-label="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[var(--surface-container-high)] flex items-center justify-center text-[var(--outline)] hover:text-[var(--primary)] transition-colors border border-[var(--outline-variant)]/10"
                aria-label="Mudar idioma"
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav aria-label="Produto">
            <h3 className="font-semibold text-sm text-slate-300 mb-4 uppercase tracking-wider">
              Produto
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explorar">
            <h3 className="font-semibold text-sm text-slate-300 mb-4 uppercase tracking-wider">
              Explorar
            </h3>
            <ul className="space-y-3">
              {HUB_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Cidades populares">
            <h3 className="font-semibold text-sm text-slate-300 mb-4 uppercase tracking-wider">
              Cidades
            </h3>
            <ul className="space-y-3">
              {CITY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresa">
            <h3 className="font-semibold text-sm text-slate-300 mb-4 uppercase tracking-wider">
              Empresa
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-outline-variant/20 text-center">
          <p className="text-sm text-slate-600">
            &copy; 2026 Figurinha Fácil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
