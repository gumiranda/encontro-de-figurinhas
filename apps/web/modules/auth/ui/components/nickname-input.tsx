"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { makeFunctionReference } from "convex/server";
import { Input } from "@workspace/ui/components/input";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface StatusIconProps {
  isChecking: boolean;
  isAvailable: boolean | undefined;
  valueLength: number;
}

function StatusIcon({ isChecking, isAvailable, valueLength }: StatusIconProps) {
  if (valueLength < 3) return null;

  if (isChecking) {
    return <Loader2 className="h-5 w-5 animate-spin text-[var(--landing-outline)]" />;
  }

  if (isAvailable === true) {
    return <CheckCircle2 className="h-5 w-5 text-[var(--landing-secondary)]" />;
  }

  if (isAvailable === false) {
    return <XCircle className="h-5 w-5 text-destructive" />;
  }

  return null;
}

const checkNicknameAvailable = makeFunctionReference<
  "query",
  { nickname: string },
  { available: boolean }
>("users:checkNicknameAvailable");

interface NicknameInputProps {
  value: string;
  onChange: (value: string) => void;
  onAvailabilityChange: (available: boolean | null) => void;
  error?: string;
}

export function NicknameInput({
  value,
  onChange,
  onAvailabilityChange,
  error,
}: NicknameInputProps) {
  const [isChecking, setIsChecking] = useState(false);
  const debouncedValue = useDebounce(value, 500);
  const lastCheckedRef = useRef<string>("");

  const shouldCheck = debouncedValue.length >= 3;
  const nicknameCheck = useQuery(
    checkNicknameAvailable,
    shouldCheck ? { nickname: debouncedValue } : "skip"
  );

  useEffect(() => {
    if (value.length < 3) {
      onAvailabilityChange(null);
      setIsChecking(false);
      return;
    }

    if (value !== debouncedValue) {
      setIsChecking(true);
    }
  }, [value, debouncedValue, onAvailabilityChange]);

  useEffect(() => {
    if (nicknameCheck !== undefined && debouncedValue.length >= 3) {
      if (lastCheckedRef.current !== debouncedValue) {
        lastCheckedRef.current = debouncedValue;
        onAvailabilityChange(nicknameCheck.available);
      }
      setIsChecking(false);
    }
  }, [nicknameCheck, debouncedValue, onAvailabilityChange]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ex: Artilheiro2026"
          className="w-full h-14 bg-[var(--landing-surface-container-highest)] dark:bg-[var(--landing-surface-container-highest)] border-none rounded text-[var(--landing-on-surface)] placeholder:text-[var(--landing-outline)] focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)]/40 focus-visible:border-transparent font-body pr-12"
          aria-invalid={!!error}
        />
        <div className="absolute inset-y-0 right-4 flex items-center">
          <StatusIcon
            isChecking={isChecking}
            isAvailable={nicknameCheck?.available}
            valueLength={value.length}
          />
        </div>
      </div>
      {value.length >= 3 && nicknameCheck?.available === true && !isChecking && (
        <div className="flex items-center gap-2 px-1">
          <CheckCircle2 className="h-4 w-4 text-[var(--landing-secondary)]" />
          <p className="text-[var(--landing-secondary)] text-xs font-medium">
            Apelido disponível para uso
          </p>
        </div>
      )}
      {value.length >= 3 && nicknameCheck?.available === false && !isChecking && (
        <div className="flex items-center gap-2 px-1">
          <XCircle className="h-4 w-4 text-destructive" />
          <p className="text-destructive text-xs font-medium">
            Este apelido já está em uso
          </p>
        </div>
      )}
    </div>
  );
}
