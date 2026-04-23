"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeftRight, Palette } from "lucide-react";
import type { ListKind } from "../../lib/use-stickers";

const tabButtonBase =
  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-3 font-label text-sm font-bold uppercase tracking-widest transition-all duration-300";

const TAB_ORDER: ListKind[] = ["duplicates", "missing"];

const tabIcons = {
  duplicates: Palette,
  missing: ArrowLeftRight,
} as const;

const tabLabels = {
  duplicates: { short: "REPETIDAS", long: "TENHO REPETIDAS" },
  missing: { short: "PRECISO", long: "PRECISO" },
} as const;

export type TabToggleConfig = Record<
  ListKind,
  { list: number[]; tabActiveClass: string }
>;

type TabToggleProps = {
  activeTab: ListKind;
  onTabChange: (tab: ListKind) => void;
  tabConfig: TabToggleConfig;
};

export function TabToggle({ activeTab, onTabChange, tabConfig }: TabToggleProps) {
  return (
    <section className="mb-8">
      <div className="bg-surface-container-low p-1.5 rounded-full flex items-center stadium-shadow">
        {TAB_ORDER.map((tab) => {
          const Icon = tabIcons[tab];
          const cfg = tabConfig[tab];
          const isActive = activeTab === tab;
          const labels = tabLabels[tab];
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={cn(
                tabButtonBase,
                isActive
                  ? cfg.tabActiveClass
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <Icon
                className="size-5 shrink-0"
                strokeWidth={isActive ? 2.25 : 2}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="hidden sm:inline">{labels.long}</span>
              <span className="sm:hidden">{labels.short}</span>
              {cfg.list.length > 0 && (
                <span className="ml-1 text-xs opacity-75">({cfg.list.length})</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
