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
        <h2 className="text-xl font-semibold mb-2">
          Buscar arena manualmente
        </h2>
        <p className="text-muted-foreground text-sm mb-4">
          Digite sua cidade para encontrar pontos de troca próximos
        </p>
      </div>

      <CityAutocomplete
        value={selectedCityId}
        onChange={onCitySelect}
      />

      {suggestedCities.length > 0 && (
        <Card className="relative z-0 gap-0 border-border/60 bg-muted/40 py-4 shadow-none dark:bg-muted/25">
          <CardContent className="px-4 pt-0 pb-0">
            <p className="mb-3 text-sm text-muted-foreground">
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
