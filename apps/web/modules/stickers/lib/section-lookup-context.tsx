"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  buildSectionLookup,
  type Section,
  type SectionLookup,
} from "./sticker-parser";

const SectionLookupContext = createContext<SectionLookup | null>(null);

export function SectionLookupProvider({
  sections,
  children,
}: {
  sections: Section[];
  children: ReactNode;
}) {
  const lookup = useMemo(() => buildSectionLookup(sections), [sections]);
  return (
    <SectionLookupContext.Provider value={lookup}>
      {children}
    </SectionLookupContext.Provider>
  );
}

export function useSectionLookup(): SectionLookup {
  const ctx = useContext(SectionLookupContext);
  if (!ctx) {
    throw new Error("useSectionLookup must be used inside SectionLookupProvider");
  }
  return ctx;
}

export function useOptionalSectionLookup(): SectionLookup | null {
  return useContext(SectionLookupContext);
}
