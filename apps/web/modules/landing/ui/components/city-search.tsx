"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { CITY_SUGGESTIONS } from "../../lib/landing-data";

export function CitySearch() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const showSuggestions = isFocused && searchValue.length === 0;

  return (
    <div className="relative group max-w-xl">
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--landing-primary)]/20 to-[var(--landing-secondary)]/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      <div className="relative flex items-center bg-[var(--landing-surface-container-highest)] rounded-xl p-2 border border-[var(--landing-outline-variant)]/15">
        <Search className="ml-4 text-[var(--landing-outline)] w-5 h-5" aria-hidden="true" />
        <input
          type="text"
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[var(--landing-on-surface)] placeholder:text-[var(--landing-outline)] py-4 px-4 font-[var(--font-body)]"
          placeholder="Digite sua cidade (ex: Sao Paulo, Rio...)"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          aria-label="Buscar cidade"
          aria-describedby="search-hint"
        />
        <button
          type="button"
          className="bg-[var(--landing-primary)] text-[var(--landing-on-primary)] font-bold px-8 py-4 rounded-lg hover:bg-[var(--landing-primary-dim)] transition-all active:scale-95"
        >
          BUSCAR
        </button>
      </div>
      <span id="search-hint" className="sr-only">
        Digite o nome da sua cidade para encontrar pontos de troca proximos
      </span>

      {showSuggestions && (
        <div
          className="absolute top-full left-0 w-full mt-2 bg-[var(--landing-surface-container-high)] rounded-xl border border-[var(--landing-outline-variant)]/10 shadow-2xl overflow-hidden z-20"
          role="listbox"
          aria-label="Sugestoes de cidades"
        >
          {CITY_SUGGESTIONS.map((city, index) => (
            <button
              key={city.name}
              type="button"
              className={`w-full px-4 py-3 hover:bg-[var(--landing-surface-variant)] cursor-pointer flex justify-between items-center text-left ${
                index > 0 ? "border-t border-[var(--landing-outline-variant)]/5" : ""
              }`}
              role="option"
              aria-selected="false"
            >
              <div>
                <p className="font-bold text-[var(--landing-on-surface)]">{city.name}</p>
                <p className="text-xs text-[var(--landing-outline)]">{city.state}</p>
              </div>
              <span className="text-[var(--landing-secondary)] text-xs font-bold">
                {city.activeUsers} Ativos
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
