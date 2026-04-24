"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { useConvexAuth, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppNavDrawer,
  AppSidebarContent,
  useAppNavGroups,
} from "@/modules/shared/ui/components/app-nav-drawer";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";
import { useStickers, type ListKind } from "../../lib/use-stickers";
import { DesktopTopBar } from "../components/desktop-top-bar";
import { MobileFabBar } from "../components/mobile-fab-bar";
import { QuickEntryInput } from "../components/quick-entry-input";
import { StatsCardRow } from "../components/stats-card-row";
import {
  StickerSectionGroup,
  type SectionInfo,
} from "../components/sticker-section-group";
import { StickerTabs } from "../components/sticker-tabs";

const SECTION_EMOJI: Record<string, string> = {
  BRA: "🇧🇷",
  ARG: "🇦🇷",
  FRA: "🇫🇷",
  ENG: "🏴",
  ESP: "🇪🇸",
  GER: "🇩🇪",
  POR: "🇵🇹",
  USA: "🇺🇸",
  CAN: "🇨🇦",
  MEX: "🇲🇽",
  JPN: "🇯🇵",
  KOR: "🇰🇷",
  NED: "🇳🇱",
  BEL: "🇧🇪",
  SUI: "🇨🇭",
  CRO: "🇭🇷",
  EXT: "⭐️",
};

type RegisterModeSwitch = { href: string; label: string };

export function QuickRegisterView({
  registerModeSwitch,
}: {
  registerModeSwitch?: RegisterModeSwitch;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useConvexAuth();

  const navContext = useQuery(
    api.users.getNavContext,
    isAuthenticated ? {} : "skip"
  );
  const navReady = navContext !== undefined;
  const hasCompletedSetup = navContext?.hasCompletedStickerSetup === true;

  const navGroups = useAppNavGroups();

  const [activeTab, setActiveTab] = useState<ListKind>("duplicates");

  const {
    duplicates,
    missing,
    sections,
    totalStickers,
    isLoading,
    isSaving,
    isDirty,
    error,
    canFinalize,
    addDuplicates,
    addMissing,
    removeDuplicate,
    removeMissing,
    markAllInSection,
    clearSection,
    invertSection,
    finalize,
    flush,
  } = useStickers();

  const duplicatesSet = useMemo(() => new Set(duplicates), [duplicates]);
  const missingSet = useMemo(() => new Set(missing), [missing]);

  const haveCount = Math.max(0, totalStickers - missing.length);
  const needCount = missing.length;

  // Snapshot para contador "+N hoje": tomar só após o primeiro load do Convex.
  // Diff desde o mount da view; reseta no reload (sessão-only).
  const [snapshot, setSnapshot] = useState<{
    haveBase: number;
    dupsBase: number;
  } | null>(null);

  useEffect(() => {
    if (isLoading || snapshot !== null) return;
    setSnapshot({ haveBase: haveCount, dupsBase: duplicates.length });
  }, [isLoading, snapshot, haveCount, duplicates.length]);

  const addedHaveDiff = snapshot
    ? Math.max(0, haveCount - snapshot.haveBase)
    : 0;
  const addedDupsDiff = snapshot
    ? Math.max(0, duplicates.length - snapshot.dupsBase)
    : 0;

  const handleToggle = useCallback(
    (num: number) => {
      if (activeTab === "duplicates") {
        if (duplicatesSet.has(num)) removeDuplicate(num);
        else if (!missingSet.has(num)) addDuplicates([num]);
      } else {
        if (missingSet.has(num)) removeMissing(num);
        else if (!duplicatesSet.has(num)) addMissing([num]);
      }
    },
    [
      activeTab,
      duplicatesSet,
      missingSet,
      addDuplicates,
      addMissing,
      removeDuplicate,
      removeMissing,
    ]
  );

  const handleQuickAdd = useCallback(
    (nums: number[]) => {
      if (activeTab === "duplicates") addDuplicates(nums);
      else addMissing(nums);
    },
    [activeTab, addDuplicates, addMissing]
  );

  const handleBulkAction = useCallback(
    (sectionCode: string, action: "all" | "none" | "invert") => {
      if (action === "all") markAllInSection(sectionCode, activeTab);
      else if (action === "none") clearSection(sectionCode, activeTab);
      else invertSection(sectionCode, activeTab);
    },
    [activeTab, markAllInSection, clearSection, invertSection]
  );

  const handleContinue = useCallback(async () => {
    try {
      await finalize();
      router.push("/selecionar-localizacao");
    } catch {
      /* erro exibido via state.error */
    }
  }, [finalize, router]);

  const ctaMode: "continue" | "save" = hasCompletedSetup ? "save" : "continue";

  const modeSwitchLink = registerModeSwitch ? (
    <Link
      href={registerModeSwitch.href}
      className="font-medium text-primary underline-offset-4 hover:underline"
    >
      {registerModeSwitch.label}
    </Link>
  ) : null;

  const sectionsWithEmoji: SectionInfo[] = useMemo(
    () =>
      sections.map((s) => ({
        ...s,
        emoji: SECTION_EMOJI[s.code.toUpperCase()] ?? "🎫",
      })),
    [sections]
  );

  if (isLoading && sections.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={250}>
      <div className="flex min-h-screen bg-background text-foreground">
        <aside className="hidden w-64 shrink-0 border-r bg-muted/40 md:block">
          <AppSidebarContent groups={navGroups} pathname={pathname} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header */}
          <header className="flex items-center justify-between gap-3 border-b border-outline-variant/40 bg-background px-4 py-3 md:hidden">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => router.back()}
              aria-label="Voltar"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="flex min-w-0 flex-1 flex-col items-center text-center">
              <h1 className="truncate font-headline text-base font-black uppercase tracking-tight">
                Álbum · Copa 2026
              </h1>
              <p className="text-[11px] text-on-surface-variant">
                {totalStickers} figurinhas ·{" "}
                <span className="font-bold text-secondary">
                  {haveCount} tenho
                </span>{" "}
                ·{" "}
                <span className="font-bold text-tertiary">
                  {needCount} preciso
                </span>
              </p>
              {modeSwitchLink ? (
                <p className="mt-1 text-[11px]">{modeSwitchLink}</p>
              ) : null}
            </div>
            <AppNavDrawer />
          </header>

          <main className="flex-1 overflow-auto px-4 pb-44 md:px-8 md:pb-10">
            <div className="mx-auto w-full max-w-6xl space-y-6 pt-4 md:pt-8">
              <DesktopTopBar
                totalStickers={totalStickers}
                isDirty={isDirty}
                isSaving={isSaving}
                ctaMode={ctaMode}
                canContinue={canFinalize}
                onContinue={handleContinue}
                onFlush={flush}
                modeSwitch={modeSwitchLink}
              />

              <StatsCardRow
                have={haveCount}
                duplicates={duplicates.length}
                missing={needCount}
                total={totalStickers}
                className="hidden md:grid"
              />

              {/* Quick bar desktop */}
              <div className="hidden flex-col gap-3 rounded-2xl border border-outline-variant/40 bg-surface-container p-3 md:flex lg:flex-row lg:items-center">
                <StickerTabs
                  active={activeTab}
                  onChange={setActiveTab}
                  counts={{ have: haveCount, need: needCount }}
                  variant="desktop-inline"
                  className="w-fit"
                />
                <QuickEntryInput
                  sections={sections}
                  totalStickers={totalStickers}
                  isLoading={isLoading}
                  onAdd={handleQuickAdd}
                  variant="desktop-inline"
                  placeholder="Digite números · ex: 42, 108, 250"
                  className="flex-1"
                />
              </div>

              {/* Mobile tabs */}
              <StickerTabs
                active={activeTab}
                onChange={setActiveTab}
                counts={{ have: haveCount, need: needCount }}
                variant="mobile"
                className="md:hidden"
              />

              {/* Mobile quick entry */}
              <div className="md:hidden">
                <QuickEntryInput
                  sections={sections}
                  totalStickers={totalStickers}
                  isLoading={isLoading}
                  onAdd={handleQuickAdd}
                  variant="mobile"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              <div className="space-y-3 md:space-y-4">
                {sectionsWithEmoji.map((section) => (
                  <StickerSectionGroup
                    key={section.code}
                    section={section}
                    mode={activeTab}
                    duplicatesSet={duplicatesSet}
                    missingSet={missingSet}
                    variant="mobile"
                    onToggle={handleToggle}
                    onBulkAction={(action) =>
                      handleBulkAction(section.code, action)
                    }
                  />
                ))}
              </div>
            </div>
          </main>
        </div>

        <MobileFabBar
          addedToday={addedHaveDiff}
          addedDups={addedDupsDiff}
          isDirty={isDirty}
          isSaving={isSaving}
          ctaMode={ctaMode}
          canContinue={canFinalize}
          onContinue={handleContinue}
          onFlush={flush}
          className={cn(!navReady && "pointer-events-none opacity-0")}
        />

        {navReady && hasCompletedSetup && <MobileBottomNav />}
      </div>
    </TooltipProvider>
  );
}
