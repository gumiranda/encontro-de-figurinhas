"use client";

import { useRef, useEffect, useMemo } from "react";
import type { Section } from "../../lib/sticker-parser";
import { CountryPill } from "./country-pill";

interface CountryStripProps {
  sections: Section[];
  duplicates: number[];
  missing: number[];
  activeCode: string;
  onSelect: (code: string) => void;
}

export function CountryStrip({
  sections,
  duplicates,
  missing,
  activeCode,
  onSelect,
}: CountryStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const duplicatesSet = useMemo(() => new Set(duplicates), [duplicates]);

  const stats = useMemo(() => {
    return sections.map((section) => {
      const total = section.endNumber - section.startNumber + 1;
      let have = 0;
      let dupeCount = 0;

      for (let n = section.startNumber; n <= section.endNumber; n++) {
        if (duplicatesSet.has(n)) {
          have++;
          dupeCount++;
        }
      }

      return {
        code: section.code,
        flag: section.flagEmoji ?? "🏳️",
        total,
        have,
        dupeCount,
      };
    });
  }, [sections, duplicatesSet]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector(`[data-code="${activeCode}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeCode]);

  return (
    <div
      ref={scrollRef}
      className="sticky top-0 z-20 flex gap-1 overflow-x-auto px-3 py-2 bg-surface-dim/95 backdrop-blur-lg border-b border-outline-variant scrollbar-none"
    >
      {stats.map((s) => (
        <div key={s.code} data-code={s.code}>
          <CountryPill
            code={s.code}
            flag={s.flag}
            total={s.total}
            have={s.have}
            dupeCount={s.dupeCount}
            active={activeCode === s.code}
            onClick={() => onSelect(s.code)}
          />
        </div>
      ))}
    </div>
  );
}
