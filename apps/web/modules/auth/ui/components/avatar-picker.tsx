"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Camera, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@workspace/ui/components/button";

interface AvatarPickerProps {
  nickname?: string;
  imageUrl?: string | null;
}

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg"] as const;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const CLERK_ERROR_PT_BR: Record<string, string> = {
  image_size_limit_exceeded: "Imagem muito grande. Use até 5MB.",
  form_param_format_invalid: "Formato de imagem inválido. Envie PNG ou JPG.",
  request_timeout: "A conexão demorou demais. Tente novamente.",
  authentication_invalid: "Sua sessão expirou. Faça login novamente.",
};

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

function explainClerkError(err: unknown): string {
  if (isClerkAPIResponseError(err)) {
    if (err.status === 429) {
      return "Muitas tentativas seguidas. Aguarde um instante.";
    }
    for (const apiErr of err.errors ?? []) {
      const mapped = CLERK_ERROR_PT_BR[apiErr.code];
      if (mapped) return mapped;
    }
  }
  return "Algo deu errado. Tente de novo.";
}

async function svgToPngBlob(svg: string, size = 256): Promise<Blob> {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Falha ao carregar SVG"));
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponível");
    ctx.drawImage(img, 0, 0, size, size);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png");
    });
    if (!blob) throw new Error("Não foi possível converter SVG para PNG");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function AvatarPicker({ nickname, imageUrl }: AvatarPickerProps) {
  const { user } = useUser();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    void import("@dicebear/core");
    void import("@dicebear/collection");
  }, []);

  const initials = initialsFrom(nickname);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
      toast.error("Envie uma imagem PNG ou JPG.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Imagem muito grande. Use até 5MB.");
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (!user || isBusy) return;

    setIsBusy(true);
    try {
      await user.setProfileImage({ file });
      await user.reload();
      toast.success("Foto atualizada.");
    } catch (err) {
      toast.error(explainClerkError(err));
    } finally {
      setIsBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!user || isBusy) return;

    setIsBusy(true);
    try {
      const seed =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const [{ createAvatar }, { avataaars }] = await Promise.all([
        import("@dicebear/core"),
        import("@dicebear/collection"),
      ]);

      const result = createAvatar(avataaars, { seed, size: 256 }).toString();
      const svg =
        typeof result === "string" ? result : await (result as Promise<string>);

      const blob = await svgToPngBlob(svg);
      await user.setProfileImage({ file: blob });
      await user.reload();
      toast.success("Avatar gerado.");
    } catch (err) {
      toast.error(explainClerkError(err));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative shrink-0">
        <div
          className="flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--surface-container-low)] bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] font-[var(--font-headline)] text-3xl font-black text-[var(--on-primary)] shadow-[0_10px_30px_rgba(149,170,255,0.35)] lg:size-36"
          role="img"
          aria-label={imageUrl ? `Avatar de ${nickname ?? "você"}` : "Avatar padrão"}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="size-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full border-4 border-[var(--surface-container-low)] bg-[var(--surface-container-high)] text-[var(--on-surface)] shadow-lg"
        >
          <Camera className="size-4" />
        </span>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-[var(--font-headline)] text-sm font-bold uppercase tracking-wider text-[var(--on-surface)]">
          Seu avatar
        </p>
        <p className="break-words text-sm text-[var(--on-surface-variant)]">
          {imageUrl
            ? "Foto sincronizada com sua conta."
            : "Usaremos suas iniciais até você subir uma foto."}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleFile}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isBusy}
            aria-busy={isBusy}
            onClick={() => fileRef.current?.click()}
            className="text-xs uppercase tracking-wider text-[var(--primary)]"
          >
            {isBusy ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="size-3.5" aria-hidden="true" />
            )}
            Enviar foto
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isBusy}
            aria-busy={isBusy}
            onClick={handleGenerate}
            className="text-xs uppercase tracking-wider text-[var(--primary)]"
          >
            {isBusy ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-3.5" aria-hidden="true" />
            )}
            Gerar avatar
          </Button>
        </div>
      </div>
    </div>
  );
}
