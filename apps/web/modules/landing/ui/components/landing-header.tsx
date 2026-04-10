"use client";

import Link from "next/link";
import { Landmark, Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "../../lib/landing-data";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      role="banner"
      className="fixed top-0 w-full z-50 bg-[#090e1c]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Landmark className="text-[var(--landing-primary)] w-8 h-8" />
          <span className="font-[var(--font-headline)] font-bold tracking-tight text-2xl text-[var(--landing-primary)]">
            Figurinha Facil
          </span>
        </Link>

        <nav
          aria-label="Navegacao principal"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-[var(--font-headline)] text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                item.active
                  ? "text-[var(--landing-secondary)] drop-shadow-[0_0_8px_rgba(79,243,37,0.5)]"
                  : "text-slate-400 hover:text-[var(--landing-primary)]"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[var(--landing-primary)] to-[var(--landing-primary-dim)] text-[var(--landing-on-primary-container)] font-bold text-sm active:scale-95 duration-200 transition-all"
          >
            ENTRAR
          </Link>

          <button
            type="button"
            className="md:hidden p-2 text-[var(--landing-on-surface)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          className="md:hidden bg-[var(--landing-surface-container)] border-t border-[var(--landing-outline-variant)]"
          aria-label="Menu mobile"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block px-6 py-4 font-[var(--font-headline)] text-sm font-bold uppercase tracking-widest ${
                item.active
                  ? "text-[var(--landing-secondary)] bg-[var(--landing-surface-variant)]"
                  : "text-slate-400"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
