"use client";

import { cn } from "@workspace/ui/lib/utils";
import { MapPin } from "lucide-react";

interface CityOption {
  id: string;
  label: string;
  count: number;
}

interface FeedCityFiltersProps {
  cities: CityOption[];
  value: string;
  onChange: (id: string) => void;
}

export function FeedCityFilters({ cities, value, onChange }: FeedCityFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none border-b border-white/5">
      {cities.map((city) => {
        const isActive = value === city.id;

        return (
          <button
            key={city.id}
            type="button"
            onClick={() => onChange(city.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors",
              isActive
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-muted-foreground hover:text-foreground"
            )}
          >
            {city.id === "all" && <MapPin className="size-3" />}
            {city.label}
            <span
              className={cn(
                "font-mono text-[10px] px-1.5 py-0.5 rounded-full",
                isActive
                  ? "bg-on-primary/20 text-on-primary"
                  : "bg-surface-container text-muted-foreground"
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
