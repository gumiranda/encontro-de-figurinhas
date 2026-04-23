"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, X, MapPin, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface City {
  name: string;
  slug: string;
  lat?: number;
  lng?: number;
}

interface StateGroup {
  state: string;
  cities: City[];
}

interface CitiesHubClientProps {
  citiesByState: StateGroup[];
  showMap?: boolean;
}

const CitiesMapLazy = dynamic(() => import("./cities-map").then(m => ({ default: m.CitiesMap })), {
  ssr: false,
  loading: () => (
    <div className="h-64 md:h-80 bg-muted rounded-lg animate-pulse flex items-center justify-center">
      <MapPin className="h-8 w-8 text-muted-foreground" />
    </div>
  ),
});

export function CitiesHubClient({ citiesByState, showMap = true }: CitiesHubClientProps) {
  const [query, setQuery] = useState("");
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());

  const allCities = useMemo(
    () => citiesByState.flatMap((g) => g.cities.map((c) => ({ ...c, state: g.state }))),
    [citiesByState]
  );

  const filteredCitiesByState = useMemo(() => {
    if (!query.trim()) return citiesByState;

    const lowerQuery = query.toLowerCase().trim();
    return citiesByState
      .map((group) => ({
        ...group,
        cities: group.cities.filter(
          (city) =>
            city.name.toLowerCase().includes(lowerQuery) ||
            group.state.toLowerCase().includes(lowerQuery)
        ),
      }))
      .filter((group) => group.cities.length > 0);
  }, [citiesByState, query]);

  const totalFiltered = useMemo(
    () => filteredCitiesByState.reduce((acc, g) => acc + g.cities.length, 0),
    [filteredCitiesByState]
  );

  const toggleState = useCallback((state: string) => {
    setExpandedStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) {
        next.delete(state);
      } else {
        next.add(state);
      }
      return next;
    });
  }, []);

  const citiesWithCoords = useMemo(
    () =>
      allCities
        .filter((c) => c.lat && c.lng)
        .slice(0, 100)
        .map((c) => ({
          name: c.name,
          slug: c.slug,
          lat: c.lat!,
          lng: c.lng!,
        })),
    [allCities]
  );

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cidade ou estado..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar busca</span>
            </Button>
          )}
        </div>
        {query && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {totalFiltered} {totalFiltered === 1 ? "cidade encontrada" : "cidades encontradas"}
          </p>
        )}
      </div>

      {/* Map */}
      {showMap && citiesWithCoords.length > 0 && (
        <div className="rounded-lg overflow-hidden border">
          <CitiesMapLazy cities={citiesWithCoords} />
        </div>
      )}

      {/* Cities Grid */}
      <div className="grid gap-4">
        {filteredCitiesByState.map((group) => {
          const isExpanded = expandedStates.has(group.state) || query.length > 0;
          const displayCities = isExpanded ? group.cities : group.cities.slice(0, 12);
          const hasMore = group.cities.length > 12;

          return (
            <Card key={group.state}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {group.state}
                    <Badge variant="secondary">{group.cities.length}</Badge>
                  </div>
                  {hasMore && !query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleState(group.state)}
                      className="text-muted-foreground"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Menos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          +{group.cities.length - 12}
                        </>
                      )}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {displayCities.map((city) => (
                    <Link key={city.slug} href={`/cidade/${city.slug}`}>
                      <Badge
                        variant="outline"
                        className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        {city.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCitiesByState.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Nenhuma cidade encontrada</p>
          <p className="text-muted-foreground">
            Tente buscar por outro nome ou estado
          </p>
        </div>
      )}
    </div>
  );
}
