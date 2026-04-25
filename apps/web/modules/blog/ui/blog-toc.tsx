"use client";

import { useEffect, useState, useMemo } from "react";
import type { TocItem } from "../lib/process-content";
import { useReadingProgress } from "./reading-progress-provider";

const RADIUS = 17;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ProgressCircle({ progress }: { progress: number }) {
  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <svg
      viewBox="0 0 40 40"
      className="w-10 h-10"
      role="img"
      aria-label={`${progress}% lido`}
    >
      <circle
        cx="20"
        cy="20"
        r={RADIUS}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        className="text-outline-variant/40"
      />
      <circle
        cx="20"
        cy="20"
        r={RADIUS}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 20 20)"
        className="text-secondary drop-shadow-[0_0_4px_var(--secondary)]"
      />
    </svg>
  );
}

interface BlogTocProps {
  headings: TocItem[];
  variant: "mobile" | "desktop";
  className?: string;
  style?: React.CSSProperties;
}

export function BlogToc({ headings, variant, className, style }: BlogTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const progress = useReadingProgress();

  const stableHeadings = useMemo(() => headings, [JSON.stringify(headings)]);

  useEffect(() => {
    if (stableHeadings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    const elements = stableHeadings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [stableHeadings]);

  if (headings.length === 0) return null;

  const tocContent = (
    <ul className="space-y-1 border-l-2 border-outline-variant/40">
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            aria-current={activeId === heading.id ? "location" : undefined}
            className={`block py-2 text-sm transition-colors border-l-2 -ml-[2px] ${
              heading.level === 3 ? "pl-6" : "pl-4"
            } ${
              activeId === heading.id
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  if (variant === "mobile") {
    return (
      <details className={className}>
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground py-2">
          Índice do artigo
        </summary>
        <nav aria-label="Índice do artigo" className="mt-2">
          {tocContent}
        </nav>
      </details>
    );
  }

  return (
    <aside className={`blog-toc-desktop ${className ?? ""}`} style={style}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Neste artigo
      </p>
      <nav aria-label="Índice do artigo">{tocContent}</nav>

      <div className="mt-8 pt-6 border-t border-outline-variant/40 flex items-center gap-2.5">
        <ProgressCircle progress={progress} />
        <div>
          <div className="font-headline font-bold text-base">{progress}%</div>
          <div className="text-[0.7rem] font-bold uppercase tracking-widest text-muted-foreground">
            lido
          </div>
        </div>
      </div>
    </aside>
  );
}
