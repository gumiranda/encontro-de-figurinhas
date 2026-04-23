"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface HubSearchProps<T> {
  items: T[];
  searchKeys: (keyof T)[];
  onFilter: (filtered: T[]) => void;
  placeholder?: string;
  className?: string;
}

export function HubSearch<T extends Record<string, unknown>>({
  items,
  searchKeys,
  onFilter,
  placeholder = "Buscar...",
  className,
}: HubSearchProps<T>) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      onFilter(items);
      return;
    }

    const lowerQuery = value.toLowerCase().trim();
    const filtered = items.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        if (typeof val === "string") {
          return val.toLowerCase().includes(lowerQuery);
        }
        if (typeof val === "number") {
          return val.toString().includes(lowerQuery);
        }
        return false;
      })
    );
    onFilter(filtered);
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => handleSearch("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar busca</span>
        </Button>
      )}
    </div>
  );
}

interface FilterChip {
  id: string;
  label: string;
}

interface HubFilterChipsProps {
  chips: FilterChip[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

export function HubFilterChips({
  chips,
  selected,
  onSelect,
  className,
}: HubFilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
        className="rounded-full"
      >
        Todos
      </Button>
      {chips.map((chip) => (
        <Button
          key={chip.id}
          variant={selected === chip.id ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(chip.id)}
          className="rounded-full"
        >
          {chip.label}
        </Button>
      ))}
    </div>
  );
}
