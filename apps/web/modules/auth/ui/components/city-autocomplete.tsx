"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
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
          placeholder="Digite sua cidade, ex: Belo Horizonte"
          className="w-full h-14 bg-[var(--surface-container-highest)] dark:bg-[var(--surface-container-highest)] border-none rounded-xl text-[var(--on-surface)] placeholder:text-[var(--outline)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:border-transparent font-body pl-12"
          aria-invalid={!!error}
          aria-describedby={error ? "city-autocomplete-error" : undefined}
        />
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[var(--primary)]">
          <Search className="h-5 w-5" />
        </div>

        {showSuggestions && (
          <div
            className="absolute top-full left-0 z-50 w-full mt-2 bg-[var(--surface-container-high)] rounded-xl border border-[var(--outline-variant)]/10 shadow-2xl overflow-hidden"
            role="listbox"
            aria-label="Sugestoes de cidades"
          >
            {cities.map((city, index) => (
              <button
                key={city._id}
                type="button"
                className={`w-full px-4 py-3 hover:bg-[var(--surface-variant)] cursor-pointer flex justify-between items-center text-left ${
                  index > 0 ? "border-t border-[var(--outline-variant)]/5" : ""
                }`}
                role="option"
                aria-selected="false"
                onClick={() => handleSelectCity(city)}
              >
                <div>
                  <p className="font-bold text-[var(--on-surface)]">{city.name}</p>
                  <p className="text-xs text-[var(--outline)]">{city.state}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <span id="city-autocomplete-error" role="alert" className="text-xs text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
