"use client";

import { CityAutocomplete } from "@/modules/auth/ui/components/city-autocomplete";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Heading, Text } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";
import { Zap } from "lucide-react";
import type { CityWithCoords } from "../../lib/location-constants";

interface ManualSearchScreenProps {
  selectedCityId: Id<"cities"> | null;
  onCitySelect: (cityId: Id<"cities"> | null) => void;
  suggestedCities: CityWithCoords[];
}

export function ManualSearchScreen({
  selectedCityId,
  onCitySelect,
  suggestedCities,
}: ManualSearchScreenProps) {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mb-10">
        <Heading
          level={2}
          className="border-0 pb-0 mb-3 font-headline text-3xl font-bold uppercase tracking-tight text-[var(--on-surface)] leading-tight"
        >
          Buscar arena <span className="sm:hidden"><br /></span>manualmente
        </Heading>
        <Text
          variant="p"
          className="text-base text-[var(--on-surface-variant)] [&:not(:first-child)]:mt-0"
        >
          Digite sua cidade para encontrar pontos de troca próximos de você.
        </Text>
      </section>

      <section className="mb-10">
        <CityAutocomplete value={selectedCityId} onChange={onCitySelect} />
      </section>

      {suggestedCities.length > 0 && (
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 fill-current text-[var(--secondary)]" />
            <Heading
              level={3}
              className="border-0 pb-0 font-headline text-xs font-bold uppercase tracking-widest text-[var(--secondary)]"
            >
              Cidades Ativas
            </Heading>
          </div>
          <div role="group" aria-label="Cidades sugeridas" className="flex flex-wrap gap-3">
            {suggestedCities.map((city) => {
              const selected = selectedCityId === city._id;
              return (
                <button
                  key={city._id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onCitySelect(city._id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-2.5 font-headline text-sm font-bold transition-all active:scale-95",
                    selected
                      ? "border-[var(--primary)]/60 bg-[var(--primary)]/15 text-[var(--primary)]"
                      : "border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] text-[var(--on-surface)] hover:bg-[var(--surface-container-highest)]"
                  )}
                >
                  {city.name}, {city.state}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
