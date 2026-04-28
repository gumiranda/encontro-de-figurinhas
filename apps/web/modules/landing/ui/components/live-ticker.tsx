"use client";

import { TICKER_ITEMS } from "../../lib/landing-data";

const COLOR_CLASSES: Record<string, string> = {
  primary: "text-[#95aaff]",
  secondary: "text-[#4ff325]",
  tertiary: "text-[#ffc965]",
};

export function LiveTicker() {
  const allItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="marquee mt-16">
      <div className="marquee-track text-xs font-mono text-[#a6aabf]">
        {allItems.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className={COLOR_CLASSES[item.color]}>●</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
