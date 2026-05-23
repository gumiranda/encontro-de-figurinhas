"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
  Bot,
  LayoutDashboard,
  ListChecks,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MobileNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isFeatured?: boolean;
};

const NAV_ITEMS: MobileNavItem[] = [
  {
    href: "/cadastrar-figurinhas/troca",
    label: "Faltantes",
    icon: ListChecks,
    isFeatured: true,
  },
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/album", label: "Álbum", icon: StickyNote },

  { href: "/gepeto", label: "Gepeto", icon: Bot },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-surface-container/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[var(--mobile-nav-height)] flex-col items-center justify-center gap-1 text-[0.6875rem] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : item.isFeatured
                      ? "text-tertiary"
                      : "text-on-surface-variant hover:text-foreground"
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-6 transition-transform",
                    active &&
                      "drop-shadow-[0_0_6px_color-mix(in_srgb,var(--primary)_55%,transparent)]"
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
