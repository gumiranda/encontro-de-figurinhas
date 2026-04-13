"use client";

import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { ArrowLeft, ArrowLeftRight, ArrowRight, Palette, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useStickers, type ListKind } from "../../lib/use-stickers";
import { SectionAccordion } from "../components/section-accordion";
import { StickerQuickInput } from "../components/sticker-quick-input";

type Tab = ListKind;

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

  // Toggle individual para o grid
  const handleToggle = useCallback(
    (num: number, action: "add" | "remove") => {
      if (activeTab === "duplicates") {
        if (action === "add") addDuplicates([num]);
        else removeDuplicate(num);
      } else {
        if (action === "add") addMissing([num]);
        else removeMissing(num);
      }
    },
    [activeTab, addDuplicates, removeDuplicate, addMissing, removeMissing]
  );

  // Bulk actions
  const handleBulkAction = useCallback(
    (sectionCode: string, action: "all" | "none" | "invert") => {
      if (action === "all") {
        markAllInSection(sectionCode, activeTab);
      } else if (action === "none") {
        clearSection(sectionCode, activeTab);
      } else {
        invertSection(sectionCode, activeTab);
      }
    },
    [activeTab, markAllInSection, clearSection, invertSection]
  );

  const handleFinalize = async () => {
    try {
      await finalize();
      router.push("/dashboard");
    } catch {
      // Erro ja tratado no hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dim">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const totalCount = activeTab === "duplicates" ? duplicates.length : missing.length;

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-surface-dim text-on-surface font-body">
      {/* TopAppBar */}
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
        {/* Toggle Switch */}
        <section className="mb-8">
          <div className="bg-surface-container-low p-1.5 rounded-full flex items-center stadium-shadow">
            <button
              onClick={() => setActiveTab("duplicates")}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-bold tracking-widest uppercase font-label transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "duplicates"
                  ? "bg-secondary/10 text-secondary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Palette
                className="size-5 shrink-0"
                strokeWidth={activeTab === "duplicates" ? 2.25 : 2}
                fill={activeTab === "duplicates" ? "currentColor" : "none"}
              />
              <span className="hidden sm:inline">TENHO REPETIDAS</span>
              <span className="sm:hidden">REPETIDAS</span>
              {duplicates.length > 0 && (
                <span className="ml-1 text-xs opacity-75">({duplicates.length})</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("missing")}
              className={`flex-1 py-3 px-4 rounded-full text-sm font-bold tracking-widest uppercase font-label transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "missing"
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <ArrowLeftRight
                className="size-5 shrink-0"
                strokeWidth={activeTab === "missing" ? 2.25 : 2}
                fill={activeTab === "missing" ? "currentColor" : "none"}
              />
              <span>PRECISO</span>
              {missing.length > 0 && (
                <span className="ml-1 text-xs opacity-75">({missing.length})</span>
              )}
            </button>
          </div>
        </section>

        {/* Campo de Entrada */}
        <section className="mb-10">
          <StickerQuickInput
            mode={activeTab}
            sections={sections}
            onAdd={activeTab === "duplicates" ? addDuplicates : addMissing}
          />
        </section>

        {/* Erro */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Resumo */}
        <section className="flex items-center justify-between mb-6">
          <h2 className="font-headline font-bold text-lg tracking-tight text-on-surface">
            {activeTab === "duplicates" ? "Suas Figurinhas" : "Minha Lista de Desejos"}
          </h2>
          <div
            className={`px-3 py-1 rounded-full ${
              activeTab === "duplicates" ? "bg-secondary-container/30" : "bg-primary/20"
            }`}
          >
            <span
              className={`font-bold text-xs uppercase tracking-widest ${
                activeTab === "duplicates" ? "text-secondary" : "text-primary"
              }`}
            >
              Total: {totalCount} figurinha{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        </section>

        {/* Checkbox Global */}
        <section className="mb-6">
          <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={
                  activeTab === "duplicates"
                    ? duplicates.length === totalStickers
                    : missing.length === totalStickers
                }
                onCheckedChange={(checked) => {
                  if (checked) {
                    markAll(activeTab);
                  } else {
                    clearAll(activeTab);
                  }
                }}
                className="h-5 w-5"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-bold text-on-surface cursor-pointer"
              >
                {activeTab === "duplicates"
                  ? "Tenho TODAS as figurinhas"
                  : "Preciso de TODAS as figurinhas"}
              </label>
            </div>
            <span className="text-xs text-on-surface-variant">
              {activeTab === "duplicates" ? duplicates.length : missing.length}/
              {totalStickers}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-2 px-1">
            {activeTab === "duplicates"
              ? "Marque todas e depois desmarque as que voce NAO tem repetida"
              : "Marque todas e depois desmarque as que voce JA tem"}
          </p>
        </section>

        {/* Grid por Seção */}
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

      {/* Floating Bottom Action Button */}
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
