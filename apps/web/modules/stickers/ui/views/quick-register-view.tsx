"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStickers, type ListKind } from "../../lib/use-stickers";
import { GlobalCheckbox } from "../components/global-checkbox";
import { SectionAccordion } from "../components/section-accordion";
import { StickerQuickInput } from "../components/sticker-quick-input";
import { TabToggle } from "../components/tab-toggle";

type Tab = ListKind;

type TabConfig = {
  list: number[];
  add: (nums: number[]) => void;
  remove: (num: number) => void;
  bgClass: string;
  textClass: string;
  title: string;
  selectAllLabel: string;
  hint: string;
  tabActiveClass: string;
};

export function QuickRegisterView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("duplicates");

  const {
    duplicates,
    missing,
    sections,
    totalStickers,
    isLoading,
    isSaving,
    error,
    canFinalize,
    addDuplicates,
    removeDuplicate,
    addMissing,
    removeMissing,
    finalize,
    markAllInSection,
    clearSection,
    invertSection,
    markAll,
    clearAll,
  } = useStickers();

  const tabConfig: Record<Tab, TabConfig> = {
    duplicates: {
      list: duplicates,
      add: addDuplicates,
      remove: removeDuplicate,
      bgClass: "bg-secondary-container/30",
      textClass: "text-secondary",
      title: "Suas Figurinhas",
      selectAllLabel: "Tenho TODAS as figurinhas",
      hint: "Marque todas e depois desmarque as que voce NAO tem repetida",
      tabActiveClass: "bg-secondary/10 text-secondary",
    },
    missing: {
      list: missing,
      add: addMissing,
      remove: removeMissing,
      bgClass: "bg-primary/20",
      textClass: "text-primary",
      title: "Minha Lista de Desejos",
      selectAllLabel: "Preciso de TODAS as figurinhas",
      hint: "Marque todas e depois desmarque as que voce JA tem",
      tabActiveClass: "bg-primary/10 text-primary",
    },
  };

  const current = tabConfig[activeTab];

  const handleToggle = (num: number, action: "add" | "remove") => {
    const { add, remove } = tabConfig[activeTab];
    if (action === "add") add([num]);
    else remove(num);
  };

  const handleBulkAction = (
    sectionCode: string,
    action: "all" | "none" | "invert"
  ) => {
    if (action === "all") {
      markAllInSection(sectionCode, activeTab);
    } else if (action === "none") {
      clearSection(sectionCode, activeTab);
    } else {
      invertSection(sectionCode, activeTab);
    }
  };

  const handleFinalize = async () => {
    try {
      await finalize();
      router.push("/selecionar-localizacao");
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const totalCount = current.list.length;

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-surface-dim text-on-surface font-body">
      <header className="bg-surface-dim sticky top-0 z-50 flex items-center justify-between w-full px-6 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-150"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-6" strokeWidth={2} />
          </button>
          <h1 className="font-headline font-bold text-xl uppercase tracking-tighter text-primary">
            Cadastrar Figurinhas
          </h1>
        </div>
        <button
          type="button"
          className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-150"
          aria-label="Configurações"
        >
          <Settings className="size-6" strokeWidth={2} />
        </button>
      </header>

      <main className="flex-1 px-6 pt-6 max-w-2xl mx-auto w-full">
        <TabToggle activeTab={activeTab} onTabChange={setActiveTab} tabConfig={tabConfig} />

        <section className="mb-10">
          <StickerQuickInput mode={activeTab} sections={sections} onAdd={current.add} />
        </section>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        <section className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-lg tracking-tight text-on-surface">
            {current.title}
          </h2>
          <div className={cn("rounded-full px-3 py-1", current.bgClass)}>
            <span className={cn("font-bold text-xs uppercase tracking-widest", current.textClass)}>
              Total: {totalCount} figurinha{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        <GlobalCheckbox
          checked={current.list.length === totalStickers}
          onCheckedChange={(checked) => {
            if (checked) markAll(activeTab);
            else clearAll(activeTab);
          }}
          label={current.selectAllLabel}
          hint={current.hint}
          currentCount={current.list.length}
          totalStickers={totalStickers}
        />

        <section className="pb-12">
          <SectionAccordion
            sections={sections}
            mode={activeTab}
            duplicates={duplicates}
            missing={missing}
            onToggle={handleToggle}
            onBulkAction={handleBulkAction}
          />
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 z-40 bg-surface-dim/80 glass-effect">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleFinalize}
            disabled={!canFinalize}
            className="w-full bg-gradient-to-r from-primary to-primary-dim text-primary-foreground py-4 h-auto rounded-xl font-headline font-bold text-lg uppercase tracking-widest active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSaving ? (
              <span className="animate-pulse">Salvando...</span>
            ) : (
              <>
                CONTINUAR PARA O MAPA
                <ArrowRight className="size-5 shrink-0" strokeWidth={2} />
              </>
            )}
          </Button>
          {!canFinalize && !isSaving && (
            <p className="text-center text-xs text-on-surface-variant mt-2">
              Preencha figurinhas repetidas E faltantes para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
