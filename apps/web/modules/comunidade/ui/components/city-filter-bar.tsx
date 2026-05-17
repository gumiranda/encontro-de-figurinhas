"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Globe, MapPin } from "lucide-react";

export interface CityOption {
  id: string;
  label: string;
  count: number;
}

interface CityFilterBarProps {
  cities: CityOption[];
  selected: string;
  onChange: (cityId: string) => void;
}

export function CityFilterBar({ cities, selected, onChange }: CityFilterBarProps) {
  const allOption: CityOption = {
    id: "all",
    label: "Todas as cidades",
    count: cities.reduce((sum, c) => sum + c.count, 0),
  };

  const options = [allOption, ...cities];

  return (
    <div className="flex gap-2 overflow-x-auto py-2.5 px-4 border-b border-white/10 scrollbar-hide">
      {options.map((city) => {
        const isSelected = city.id === selected;
        const isAll = city.id === "all";

        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onChange(city.id)}
            className={cn(
              "flex-shrink-0 inline-flex items-center gap-1.5 h-8 px-3",
              "rounded-full text-xs font-semibold whitespace-nowrap",
              "transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground border border-primary"
                : "bg-surface-container-high text-foreground border border-white/10 hover:border-white/20"
            )}
          >
            {isAll ? (
              <Globe className="size-3" />
            ) : (
              <MapPin className="size-3" />
            )}
            {city.label}
            <span
              className={cn(
                "font-mono text-[10px] px-1.5 py-px rounded",
                isSelected
                  ? "bg-primary-foreground/20"
                  : "bg-primary/10"
              )}
            >
              {city.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
