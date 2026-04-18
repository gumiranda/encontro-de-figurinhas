"use client";

import { Camera, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface AvatarPickerProps {
  nickname?: string;
  imageUrl?: string | null;
}

function initialsFrom(nickname: string | undefined) {
  const clean = nickname?.trim();
  if (!clean) return "FF";
  const parts = clean.split(/[\s_]+/).filter(Boolean);
  if (parts.length === 0) return "FF";
  if (parts.length === 1) {
    const first = parts[0];
    return (first ? first.slice(0, 2) : "FF").toUpperCase();
  }
  const head = parts[0]?.[0] ?? "";
  const tail = parts[parts.length - 1]?.[0] ?? "";
  return (head + tail).toUpperCase();
}

export function AvatarPicker({ nickname, imageUrl }: AvatarPickerProps) {
  const initials = initialsFrom(nickname);

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <div
          className="flex size-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] font-[var(--font-headline)] text-3xl font-black text-[var(--on-primary)] shadow-[0_10px_30px_rgba(149,170,255,0.35)]"
          aria-hidden={imageUrl ? undefined : "true"}
          role="img"
          aria-label={imageUrl ? `Avatar de ${nickname ?? "você"}` : undefined}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <button
          type="button"
          aria-label="Upload de foto (em breve)"
          disabled
          className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border border-[var(--outline-variant)]/40 bg-[var(--surface-container-high)] text-[var(--on-surface)] opacity-60 shadow-lg"
        >
          <Camera className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="font-[var(--font-headline)] text-sm font-bold uppercase tracking-wider text-[var(--on-surface)]">
          Seu avatar
        </p>
        <p className="text-sm text-[var(--on-surface-variant)]">
          {imageUrl
            ? "Foto sincronizada com sua conta."
            : "Usaremos suas iniciais até você subir uma foto."}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled
          className="h-auto p-0 text-xs uppercase tracking-wider text-[var(--primary)]/70"
          aria-label="Gerar avatar (em breve)"
        >
          <Sparkles className="mr-1 size-3.5" /> Gerar avatar (em breve)
        </Button>
      </div>
    </div>
  );
}
