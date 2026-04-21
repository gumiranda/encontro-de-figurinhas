"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import dynamic from "next/dynamic";
import { ArrowLeft, Crosshair, ImagePlus, Loader2, MapPin, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Text } from "@workspace/ui/components/typography";
import {
  Banner,
  BannerIcon,
  BannerTitle,
} from "@workspace/ui/components/kibo-ui/banner";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { useGeolocation } from "@/modules/location/lib/use-geolocation";
import { useNominatimGeocoder } from "@/modules/location/lib/use-nominatim-geocoder";
import { useQuotaStatus } from "@/modules/trade-points/lib/use-quota-status";
import { QuotaCard } from "@/modules/trade-points/ui/components/quota-card";
import { QuotaBanner } from "@/modules/trade-points/ui/components/quota-banner";

const LocationPickerMap = dynamic(
  () =>
    import("@/modules/trade-points/ui/components/location-picker-map").then(
      (mod) => mod.LocationPickerMap
    ),
  { ssr: false, loading: () => <div className="h-[200px] w-full animate-pulse rounded-xl bg-surface-container-highest" /> }
);

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(120, "Máximo 120 caracteres"),
  address: z
    .string()
    .min(5, "Descreva o endereço")
    .max(300, "Máximo 300 caracteres"),
  description: z.string().max(500).optional(),
  whatsappLink: z
    .string()
    .max(500)
    .optional()
    .refine(
      (val) => !val?.trim() || /^https:\/\//i.test(val.trim()),
      "Link deve começar com https://"
    ),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  cityId: Id<"cities">;
  cityLabel: string;
  defaultLat: number;
  defaultLng: number;
};

const fieldInputClass =
  "h-14 rounded-xl border-none bg-surface-container-highest px-5 text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40";

const COVER_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
const COVER_MAX_BYTES = 5 * 1024 * 1024;

async function uploadToConvex(
  uploadUrl: string,
  payload: Blob,
  contentType: string
): Promise<Id<"_storage">> {
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: payload,
  });
  if (!response.ok) throw new Error(`Upload falhou (${response.status})`);
  const { storageId } = (await response.json()) as { storageId?: string };
  if (!storageId) throw new Error("Resposta de upload inválida");
  return storageId as Id<"_storage">;
}

export function RequestTradePointView({
  cityId,
  cityLabel,
  defaultLat,
  defaultLng,
}: Props) {
  const router = useRouter();
  const submitRequest = useMutation(api.tradePoints.submitRequest);
  const generateCoverUploadUrl = useMutation(api.tradePoints.generateCoverUploadUrl);
  const { isBlocked, isLoading: isLoadingQuota } = useQuotaStatus();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  const {
    status: geoStatus,
    coords,
    error: geoError,
    requestPermission,
  } = useGeolocation();
  const isChecking = geoStatus === "checking" || geoStatus === "prompting";

  const {
    setQuery: setGeoQuery,
    suggestions,
    isLoading: isGeocoding,
    clearSuggestions,
  } = useNominatimGeocoder(cityLabel);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: defaultLat,
    lng: defaultLng,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (coords) {
      setSelectedCoords({ lat: coords.lat, lng: coords.lng });
    }
  }, [coords]);

  useEffect(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions]);

  const lastToastedErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (!geoError) return;
    if (
      geoStatus !== "denied" &&
      geoStatus !== "unavailable" &&
      geoStatus !== "timeout"
    )
      return;
    if (lastToastedErrorRef.current === geoError) return;
    lastToastedErrorRef.current = geoError;
    toast.error(
      geoStatus === "denied"
        ? "Permissão de localização negada. Use o centro da cidade ou ajuste nas permissões."
        : "Não foi possível obter sua localização. Tente novamente ou use o centro da cidade."
    );
  }, [geoError, geoStatus]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      whatsappLink: "",
    },
  });

  function clearCover() {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverPreviewUrl(null);
    setCoverFile(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function onCoverSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!COVER_ALLOWED_TYPES.includes(file.type as (typeof COVER_ALLOWED_TYPES)[number])) {
      toast.error("Use PNG, JPG ou WebP.");
      if (coverInputRef.current) coverInputRef.current.value = "";
      return;
    }
    if (file.size > COVER_MAX_BYTES) {
      toast.error("Imagem muito grande. Use até 5MB.");
      if (coverInputRef.current) coverInputRef.current.value = "";
      return;
    }
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  }

  async function onSubmit(data: FormValues) {
    const description = data.description?.trim();
    const whatsappLink = data.whatsappLink?.trim();

    let coverStorageId: Id<"_storage"> | undefined;
    if (coverFile) {
      try {
        const uploadUrl = await generateCoverUploadUrl();
        coverStorageId = await uploadToConvex(
          uploadUrl,
          coverFile,
          coverFile.type
        );
      } catch {
        toast.error("Não foi possível enviar a foto de capa. Tente de novo.");
        return;
      }
    }

    const result = await submitRequest({
      name: data.name.trim(),
      address: data.address.trim(),
      cityId,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      description: description || undefined,
      whatsappLink: whatsappLink || undefined,
      coverStorageId,
    });

    if (result.ok) {
      toast.success("Sugestão enviada — análise em 24 a 48 horas.");
      router.push("/meus-pontos");
      return;
    }

    if (result.error === "needs-auth") {
      router.replace("/sign-in");
      return;
    }
    if (result.error === "needs-onboarding") {
      router.replace("/complete-profile");
      return;
    }
    if (result.error === "banned") {
      toast.error("Sua conta não pode enviar sugestões no momento.");
      return;
    }
    if (result.error === "rate-limited") {
      toast.error("Limite de sugestões pendentes atingido.");
      return;
    }
    if (result.error === "city-mismatch") {
      toast.error(
        "A cidade não confere com o seu perfil. Atualize a cidade e tente de novo."
      );
      return;
    }
    if (result.error === "invalid-coordinates") {
      toast.error("Coordenadas fora do Brasil. Ajuste a localização.");
      return;
    }
    if (result.error === "invalid-cover") {
      toast.error("A foto de capa não foi aceita. Escolha outra imagem.");
      return;
    }
    toast.error("Revise os campos e tente novamente.");
  }

  const ctaDisabled =
    form.formState.isSubmitting || isBlocked || isLoadingQuota;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <QuotaBanner />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 pb-24 pt-[max(theme(spacing.4),env(safe-area-inset-top))]">
        <div className="space-y-3">
          <header className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild aria-label="Voltar">
              <Link href="/map">
                <ArrowLeft className="h-5 w-5 text-primary" />
              </Link>
            </Button>
            <h1 className="font-headline text-xl font-bold tracking-tight text-primary">
              Sugerir Arena
            </h1>
          </header>
          <Text variant="muted" className="text-base">
            Ajude a comunidade a encontrar novos pontos de troca seguros e
            movimentados em {cityLabel}.
          </Text>
        </div>

        <Banner
          inset
          className="flex-col items-start gap-3 rounded-xl border-l-4 border-secondary/50 bg-surface-container-high p-4 text-on-surface shadow-lg"
        >
          <div className="flex items-start gap-3">
            <BannerIcon
              icon={TriangleAlert}
              className="border-secondary/20 bg-secondary/10 text-secondary"
            />
            <div className="flex flex-col gap-1">
              <BannerTitle className="font-headline flex-none text-xs font-bold uppercase tracking-widest text-secondary">
                Orientação de Segurança
              </BannerTitle>
              <Text variant="small" className="font-normal text-on-surface">
                Escolha apenas locais públicos e movimentados como shoppings ou
                praças de alimentação.
              </Text>
            </div>
          </div>
        </Banner>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-xs font-bold uppercase tracking-widest text-primary-dim">
                    Nome do Local
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={fieldInputClass}
                      placeholder="Ex.: Shopping Arena Central"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-xs font-bold uppercase tracking-widest text-primary-dim">
                    Endereço
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className={`${fieldInputClass} pr-24`}
                        placeholder="Rua, número, bairro, referências"
                        autoComplete="off"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setGeoQuery(e.target.value);
                        }}
                        onFocus={() => {
                          if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowSuggestions(false), 200);
                        }}
                      />
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                        {isGeocoding && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary/60" aria-label="Buscando endereço" />
                        )}
                        <button
                          type="button"
                          aria-label="Usar minha localização atual"
                          aria-busy={isChecking}
                          disabled={isChecking}
                          onClick={() => requestPermission()}
                          className="inline-flex items-center justify-center rounded-md p-2 text-primary transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                        >
                          {isChecking ? (
                            <Spinner variant="circle-filled" size={20} />
                          ) : (
                            <Crosshair className="h-5 w-5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-outline-variant/30 bg-surface-container-high shadow-lg">
                          {suggestions.map((suggestion) => (
                            <li key={suggestion.id}>
                              <button
                                type="button"
                                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-on-surface transition-colors hover:bg-surface-container-highest focus:bg-surface-container-highest focus:outline-none"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  const shortName = suggestion.displayName.split(",").slice(0, 3).join(",");
                                  field.onChange(shortName);
                                  setSelectedCoords({ lat: suggestion.lat, lng: suggestion.lng });
                                  setShowSuggestions(false);
                                  clearSuggestions();
                                }}
                              >
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <span className="line-clamp-2">{suggestion.displayName}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <LocationPickerMap
                lat={selectedCoords.lat}
                lng={selectedCoords.lng}
                onLocationChange={(lat, lng) => setSelectedCoords({ lat, lng })}
              />
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
                  {" · "}
                  <span className="text-outline">arraste o marcador para ajustar</span>
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-xs font-bold uppercase tracking-widest text-primary-dim">
                    Por que este é um bom ponto? (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o local, acessibilidade e por que colecionadores devem ir até lá..."
                      className="min-h-[96px] resize-y rounded-xl border-none bg-surface-container-highest px-5 py-4 text-on-surface placeholder:text-outline focus-visible:ring-2 focus-visible:ring-primary/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <p className="font-headline text-xs font-bold uppercase tracking-widest text-primary-dim">
                Foto de capa (opcional)
              </p>
              <p className="text-sm text-on-surface-variant">
                Aparece no topo da página do ponto após aprovação. Prefira foto
                do local em dia claro.
              </p>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={onCoverSelected}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />
              {coverPreviewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-outline-variant/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreviewUrl}
                    alt="Pré-visualização da foto de capa"
                    className="aspect-[2/1] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => clearCover()}
                    className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    aria-label="Remover foto"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant/50 bg-surface-container-highest/50 px-4 py-8 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary/40 hover:bg-surface-container-highest"
                >
                  <ImagePlus className="size-5 text-primary" aria-hidden />
                  Adicionar foto
                </button>
              )}
            </div>

            <FormField
              control={form.control}
              name="whatsappLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-headline text-xs font-bold uppercase tracking-widest text-primary-dim">
                    Link do grupo WhatsApp (opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={fieldInputClass}
                      placeholder="https://chat.whatsapp.com/..."
                      inputMode="url"
                      autoComplete="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <QuotaCard />

            {isBlocked ? (
              <Text variant="muted" className="text-center">
                Você atingiu o limite de sugestões pendentes. Aguarde a revisão.
              </Text>
            ) : null}

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                className="btn-primary-gradient h-16 w-full rounded-xl font-headline text-lg font-extrabold uppercase tracking-tight"
                disabled={ctaDisabled}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner variant="circle-filled" size={18} />
                    Enviando…
                  </>
                ) : (
                  "Enviar Sugestão"
                )}
              </Button>
              <Text
                variant="muted"
                className="text-center text-[10px] uppercase tracking-[0.2em]"
              >
                Tempo estimado de análise: 24H – 48H
              </Text>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
