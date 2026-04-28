"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { CITY_SUGGESTIONS } from "../../lib/landing-data";

export function CitySearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const showSuggestions = isFocused && searchValue.length === 0;

  return (
    <div className="relative group w-full max-w-xl">
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)]/20 to-[var(--secondary)]/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-1000 group-hover:duration-200" />
      <div className="relative flex flex-col gap-2 rounded-xl border border-[var(--outline-variant)]/15 bg-[var(--surface-container-highest)] p-2 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex min-w-0 flex-1 items-center">
          <Search
            className="ml-2 shrink-0 text-[var(--outline)] sm:ml-4"
            aria-hidden="true"
            size={20}
          />
          <Input
            type="text"
            className="h-auto min-w-0 flex-1 border-0 bg-transparent py-3 pl-3 pr-2 text-base text-[var(--on-surface)] shadow-none placeholder:text-[var(--outline)] focus-visible:ring-0 md:text-sm font-[var(--font-body)]"
            placeholder="Digite sua cidade (ex: São Paulo, Rio...)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Buscar cidade"
            aria-describedby="search-hint"
          />
        </div>
        <Button
          type="button"
          className="w-full shrink-0 rounded-lg bg-[var(--primary)] px-6 py-4 font-bold text-[var(--on-primary)] hover:bg-[var(--primary-dim)] active:scale-[0.96] sm:w-auto sm:px-8"
        >
          BUSCAR
        </Button>
      </div>
      <span id="search-hint" className="sr-only">
        Digite o nome da sua cidade para encontrar pontos de troca proximos
      </span>

      {showSuggestions && (
        <div
          className="absolute top-full left-0 w-full mt-2 bg-[var(--surface-container-high)] rounded-xl border border-[var(--outline-variant)]/10 shadow-2xl overflow-hidden z-20"
          role="listbox"
          aria-label="Sugestoes de cidades"
        >
          {CITY_SUGGESTIONS.map((city, index) => (
            <button
              key={city.name}
              type="button"
              className={`w-full px-4 py-3 hover:bg-[var(--surface-variant)] cursor-pointer flex justify-between items-center text-left ${
                index > 0 ? "border-t border-[var(--outline-variant)]/5" : ""
              }`}
              role="option"
              aria-selected="false"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div>
                <p className="font-bold text-[var(--on-surface)]">{city.name}</p>
                <p className="text-xs text-[var(--outline)]">{city.state}</p>
              </div>
              <span className="text-[var(--secondary)] text-xs font-bold">
                {city.activeUsers} Ativos
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
