"use client";

import { CityAutocomplete } from "@/modules/auth/ui/components/city-autocomplete";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import type { Id } from "@workspace/backend/_generated/dataModel";
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
  const selectedInSuggested =
    selectedCityId != null &&
    suggestedCities.some((c) => c._id === selectedCityId);

  return (
    <div className="space-y-6 flex-1">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--landing-on-surface)]">
          Buscar arena manualmente
        </h2>
        <p className="mb-4 text-sm text-[var(--landing-on-surface-variant)]">
          Digite sua cidade para encontrar pontos de troca próximos
        </p>
      </div>

      <CityAutocomplete
        value={selectedCityId}
        onChange={onCitySelect}
      />

      {suggestedCities.length > 0 && (
        <Card className="relative z-0 gap-0 border border-[var(--landing-outline-variant)]/25 bg-[var(--landing-surface-container-high)] py-4 text-[var(--landing-on-surface)] shadow-sm">
          <CardContent className="px-4 pt-0 pb-0">
            <p className="mb-3 text-sm text-[var(--landing-on-surface-variant)]">
              Ou escolha uma das principais cidades:
            </p>
            <div
              role="radiogroup"
              aria-label="Cidades sugeridas"
              className="flex flex-wrap gap-2"
            >
              {suggestedCities.map((city, index) => {
                const isRovingFocus =
                  selectedInSuggested
                    ? selectedCityId === city._id
                    : index === 0;
                return (
                  <Button
                    key={city._id}
                    variant={selectedCityId === city._id ? "default" : "outline"}
                    role="radio"
                    aria-checked={selectedCityId === city._id}
                    tabIndex={isRovingFocus ? 0 : -1}
                    onClick={() => onCitySelect(city._id)}
                    size="sm"
                  >
                    {city.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
