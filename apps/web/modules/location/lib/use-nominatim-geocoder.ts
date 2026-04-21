"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GeocodingSuggestion = {
  id: string;
  lat: number;
  lng: number;
  displayName: string;
};

type NominatimItem = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DEBOUNCE_MS = 500;
const MIN_QUERY_LENGTH = 4;
const MAX_SUGGESTIONS = 5;

export function useNominatimGeocoder(cityBias?: string, countryBias = "Brazil") {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (q: string) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const trimmed = q.trim();
      if (trimmed.length < MIN_QUERY_LENGTH) {
        setSuggestions([]);
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(false);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Remove street numbers from query - Nominatim works better without them
        // Matches: "144", "1500-A", "23B" at end of string
        const streetQuery = trimmed.replace(/\s+\d+[\w-]*\s*$/, "").trim();
        const queryParts = [streetQuery || trimmed];
        if (cityBias) queryParts.push(cityBias);
        queryParts.push(countryBias);

        const params = new URLSearchParams({
          q: queryParts.join(", "),
          format: "json",
          limit: String(MAX_SUGGESTIONS),
          addressdetails: "0",
        });

        const res = await fetch(`${NOMINATIM_URL}?${params}`, {
          signal: controller.signal,
          headers: {
            "User-Agent": "EncontroDeFigurinhas/1.0",
          },
        });

        if (!res.ok) {
          throw new Error(`Nominatim error: ${res.status}`);
        }

        const data: NominatimItem[] = await res.json();

        setSuggestions(
          data.map((item) => ({
            id: String(item.place_id),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name,
          }))
        );
        setHasSearched(true);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [cityBias, countryBias]
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      search(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, search]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  return {
    setQuery,
    suggestions,
    isLoading,
    hasSearched,
    clearSuggestions: () => {
      setSuggestions([]);
      setHasSearched(false);
    },
  };
}
