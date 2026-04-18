"use client";

import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";

import { useDebounce } from "@/hooks/use-debounce";

const checkNicknameAvailable = makeFunctionReference<
  "query",
  { nickname: string },
  { available: boolean }
>("users:checkNicknameAvailable");

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function NicknameInput({ value, onChange, onBlur, error }: NicknameInputProps) {
  const debouncedValue = useDebounce(value, 500);
  const lastCheckedRef = useRef<string>("");

  const nicknameCheck = useQuery(
    checkNicknameAvailable,
    debouncedValue.length >= 3 ? { nickname: debouncedValue } : "skip"
  );

  const isQueryStale = debouncedValue !== lastCheckedRef.current;
  const isChecking =
    value.length >= 3 && (value !== debouncedValue || isQueryStale);
  const isStable =
    !isChecking && value === lastCheckedRef.current && nicknameCheck !== undefined;

  useEffect(() => {
    if (value.length < 3) {
      lastCheckedRef.current = "";
      return;
    }
    if (nicknameCheck !== undefined && lastCheckedRef.current !== debouncedValue) {
      lastCheckedRef.current = debouncedValue;
    }
  }, [value.length, nicknameCheck, debouncedValue]);

  return (
    <div className="min-w-0 space-y-2">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-body text-[var(--outline)]">
          @
        </span>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="Artilheiro2026"
          aria-invalid={!!error}
          className="h-14 w-full rounded border-none bg-[var(--surface-container-highest)] pl-9 pr-24 font-body text-[var(--on-surface)] placeholder:text-[var(--outline)] focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 dark:bg-[var(--surface-container-highest)]"
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          {isChecking && (
            <Loader2 className="h-5 w-5 animate-spin text-[var(--outline)]" />
          )}
          {isStable && value.length >= 3 && nicknameCheck.available && (
            <Badge className="gap-1 rounded-full bg-[var(--secondary)]/15 text-[var(--secondary)] hover:bg-[var(--secondary)]/15">
              <CheckCircle2 className="h-3 w-3" />
              livre
            </Badge>
          )}
          {isStable && value.length >= 3 && !nicknameCheck.available && (
            <Badge variant="destructive" className="gap-1 rounded-full">
              <XCircle className="h-3 w-3" />
              em uso
            </Badge>
          )}
        </div>
      </div>
      <p className="mt-2 px-1 font-mono text-xs text-[var(--landing-outline)]">
        {value.length}/20 caracteres · letras, números, underscore
      </p>
    </div>
  );
}
