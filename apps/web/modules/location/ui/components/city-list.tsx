import type { Id } from "@workspace/backend/_generated/dataModel";
import { cn } from "@workspace/ui/lib/utils";
import { MapPin } from "lucide-react";
import type { CityWithCoords } from "../../lib/location-constants";

interface CityListProps {
  cities: CityWithCoords[];
  selectedCityId: Id<"cities"> | null;
  onSelect: (id: Id<"cities"> | null) => void;
  max: number;
}

export function CityList({
  cities,
  selectedCityId,
  onSelect,
  max,
}: CityListProps) {
  const visible = cities.slice(0, max);
  if (visible.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5">
      {visible.map((city) => {
        const selected = selectedCityId === city._id;
        return (
          <li key={city._id}>
            <button
              type="button"
              onClick={() => onSelect(city._id)}
              aria-pressed={selected}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-[var(--surface-container)] p-3 text-left transition-colors hover:border-[var(--primary)]",
                selected
                  ? "border-[var(--primary)]"
                  : "border-[var(--outline-variant)]"
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface-container-high)] text-[var(--primary)]">
                <MapPin className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 font-[var(--font-headline)] text-sm font-bold text-[var(--on-surface)]">
                {city.name}
                <span className="block text-[11px] font-medium text-[var(--on-surface-variant)]">
                  {city.state}
                </span>
              </span>
              <span className="font-mono text-[11px] text-[var(--outline)]">
                →
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
