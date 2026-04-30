"use client";

import Link from "next/link";
import { Menu, Trophy } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { NAV_ITEMS } from "../../lib/landing-data";

export function LandingHeader() {
  return (
    <header
      role="banner"
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[#090e1c]/80 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#95aaff] to-[#3766ff]"
            aria-hidden="true"
          >
            <Trophy className="size-4 text-[#00247e]" strokeWidth={2.5} />
          </span>
          <span className="font-bold text-lg tracking-tight text-[#87d400]">
            FigurinhaFácil
          </span>
        </Link>

        <nav
          aria-label="Navegacao principal"
          className="hidden md:flex items-center gap-8 text-sm font-semibold"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[#a6aabf] hover:text-[#e1e4fa] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/pontos"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#4ff325]"
          >
            <span className="pulse-dot" />
            <span className="font-semibold">847 pontos ativos</span>
          </Link>
          <Button asChild size="sm" className="h-10 px-5 text-xs rounded-full">
            <Link href="/sign-in">Entrar</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#0d1323] border-white/5">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className="text-lg font-semibold text-[#e1e4fa] hover:text-[#95aaff] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="pt-4 border-t border-white/10">
                  <SheetClose asChild>
                    <Link
                      href="/sign-in"
                      className="block w-full text-center py-3 rounded-full bg-gradient-to-r from-[#95aaff] to-[#3766ff] text-[#00247e] font-bold"
                    >
                      Entrar
                    </Link>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
