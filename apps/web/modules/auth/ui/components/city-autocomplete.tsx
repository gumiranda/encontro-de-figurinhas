"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Input } from "@workspace/ui/components/input";
import { MapPin } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Id } from "@workspace/backend/_generated/dataModel";

interface City {
  _id: Id<"cities">;
  name: string;
  state: string;
}

interface CityAutocompleteProps {
  value: Id<"cities"> | null;
  onChange: (cityId: Id<"cities"> | null) => void;
  error?: string;
}

export function CityAutocomplete({ value, onChange, error }: CityAutocompleteProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchValue, 300);

  const shouldSearch = debouncedSearch.length >= 2 && !selectedCity;
  const citiesResult = useQuery(
    api.cities.search,
    shouldSearch ? { query: debouncedSearch } : "skip"
  );

  const cities = citiesResult ?? [];
  const showSuggestions = isFocused && cities.length > 0 && !selectedCity;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setSearchValue(`${city.name}, ${city.state}`);
    onChange(city._id);
    setIsFocused(false);
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (selectedCity) {
      setSelectedCity(null);
      onChange(null);
    }
  };

  return (
    <div className="relative z-10 space-y-2" ref={containerRef}>
      <div className="relative">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Selecione sua cidade..."
          className="w-full h-14 bg-[var(--landing-surface-container-highest)] dark:bg-[var(--landing-surface-container-highest)] border-none rounded text-[var(--landing-on-surface)] placeholder:text-[var(--landing-outline)] focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)]/40 focus-visible:border-transparent font-body pr-12"
          aria-invalid={!!error}
        />
        <div className="absolute inset-y-0 right-4 flex items-center text-[var(--landing-on-surface-variant)]">
          <MapPin className="h-5 w-5" />
        </div>

        {showSuggestions && (
          <div
            className="absolute top-full left-0 z-50 w-full mt-2 bg-[var(--landing-surface-container-high)] rounded-xl border border-[var(--landing-outline-variant)]/10 shadow-2xl overflow-hidden"
            role="listbox"
            aria-label="Sugestoes de cidades"
          >
            {cities.map((city, index) => (
              <button
                key={city._id}
                type="button"
                className={`w-full px-4 py-3 hover:bg-[var(--landing-surface-variant)] cursor-pointer flex justify-between items-center text-left ${
                  index > 0 ? "border-t border-[var(--landing-outline-variant)]/5" : ""
                }`}
                role="option"
                aria-selected="false"
                onClick={() => handleSelectCity(city)}
              >
                <div>
                  <p className="font-bold text-[var(--landing-on-surface)]">{city.name}</p>
                  <p className="text-xs text-[var(--landing-outline)]">{city.state}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
