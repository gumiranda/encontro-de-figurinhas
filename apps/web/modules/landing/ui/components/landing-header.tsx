"use client";

import Link from "next/link";
import { Landmark, Menu } from "lucide-react";
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
      className="fixed top-0 z-50 w-full bg-background/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
    >
      <div className="flex min-h-14 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-3 pr-2"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dim)] shadow-[0_0_24px_rgba(149,170,255,0.35)]"
            aria-hidden="true"
          >
            <Landmark
              className="size-5 text-[var(--on-primary)]"
              strokeWidth={2.5}
            />
          </span>
          <span className="truncate font-[var(--font-headline)] text-lg font-bold tracking-tight text-[var(--on-surface)] sm:text-xl md:text-2xl">
            Figurinha Fácil
          </span>
        </Link>

        <nav aria-label="Navegacao principal" className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-[var(--font-headline)] text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
                item.active
                  ? "text-[var(--secondary)] drop-shadow-[0_0_8px_rgba(79,243,37,0.5)]"
                  : "text-slate-400 hover:text-[var(--primary)]"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="hidden rounded-lg px-4 text-xs font-bold uppercase tracking-wider text-[var(--on-surface)] hover:bg-[var(--surface-variant)] sm:inline-flex sm:text-sm"
          >
            <Link href="/sign-in" className="whitespace-nowrap">
              Entrar
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] px-4 text-xs font-bold uppercase tracking-wider text-[var(--on-primary-container)] shadow-none hover:opacity-95 active:scale-95 sm:px-6 sm:text-sm"
          >
            <Link href="/sign-up" className="whitespace-nowrap">
              Criar conta
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="md:hidden p-2 text-[var(--on-surface)]"
                aria-label="Abrir menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 !bg-surface-container border-outline-variant p-0 [&>button]:text-[var(--on-surface)] [&>button]:hover:text-white"
            >
              <SheetTitle className="sr-only">Menu de navegacao</SheetTitle>
              <div className="p-6 border-b border-[var(--outline-variant)]">
                <Link href="/" className="flex items-center gap-2">
                  <Landmark className="text-[var(--primary)] w-6 h-6" />
                  <span className="font-[var(--font-headline)] font-bold text-lg text-[var(--primary)]">
                    Figurinha Fácil
                  </span>
                </Link>
              </div>
              <nav aria-label="Menu mobile" className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.label}>
                    <Link
                      href={item.href}
                      className={`px-6 py-4 font-[var(--font-headline)] text-sm font-bold uppercase tracking-widest ${
                        item.active
                          ? "text-[var(--secondary)] bg-[var(--surface-variant)]"
                          : "text-slate-400 hover:bg-[var(--surface-variant)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
