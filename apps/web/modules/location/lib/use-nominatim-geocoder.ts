"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GeocodingResult = {
  lat: number;
  lng: number;
  displayName: string;
};

type NominatimResponse = {
  lat: string;
  lon: string;
  display_name: string;
}[];

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DEBOUNCE_MS = 600;
const MIN_QUERY_LENGTH = 5;

export function useNominatimGeocoder(countryBias = "Brazil") {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<GeocodingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(
    async (q: string) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const trimmed = q.trim();
      if (trimmed.length < MIN_QUERY_LENGTH) {
        setResult(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({
          q: `${trimmed}, ${countryBias}`,
          format: "json",
          limit: "1",
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

        const data: NominatimResponse = await res.json();

        const first = data[0];
        if (!first) {
          setResult(null);
          setError("Endereco nao encontrado");
        } else {
          setResult({
            lat: parseFloat(first.lat),
            lng: parseFloat(first.lon),
            displayName: first.display_name,
          });
          setError(null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError("Erro ao buscar endereco");
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [countryBias]
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
    result,
    isLoading,
    error,
    clearResult: () => setResult(null),
  };
}
