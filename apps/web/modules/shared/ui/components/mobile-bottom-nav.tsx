"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  StickyNote,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/album", label: "Álbum", icon: StickyNote },
  { href: "/encontrar-trocas", label: "Trocas", icon: ArrowLeftRight },
  { href: "/map", label: "Mapa", icon: MapIcon },
  { href: "/meus-pontos", label: "Pontos", icon: MapPin },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-surface-container/95 backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-foreground",
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-6 transition-transform",
                    active && "drop-shadow-[0_0_6px_color-mix(in_srgb,var(--primary)_55%,transparent)]",
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span className="leading-none">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
