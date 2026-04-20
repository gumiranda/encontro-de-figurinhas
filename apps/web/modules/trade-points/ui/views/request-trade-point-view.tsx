"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ArrowLeft, Crosshair, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Heading, Text } from "@workspace/ui/components/typography";
import {
  Announcement,
  AnnouncementTitle,
  AnnouncementTag,
} from "@workspace/ui/components/kibo-ui/announcement";
import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
  ChoiceboxIndicator,
} from "@workspace/ui/components/kibo-ui/choicebox";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { useGeolocation } from "@/modules/location/lib/use-geolocation";
import { useQuotaStatus } from "@/modules/trade-points/lib/use-quota-status";
import { QuotaCard } from "@/modules/trade-points/ui/components/quota-card";
import { QuotaBanner } from "@/modules/trade-points/ui/components/quota-banner";

const HOUR_OPTIONS = [
  { value: "manhas", label: "Manhãs" },
  { value: "tardes", label: "Tardes" },
  { value: "noites", label: "Noites" },
  { value: "fins-de-semana", label: "Fins de semana" },
] as const;

const HOUR_LABEL_BY_VALUE = Object.fromEntries(
  HOUR_OPTIONS.map((o) => [o.value, o.label])
) as Record<string, string>;

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(120, "Máximo 120 caracteres"),
  address: z
    .string()
    .min(5, "Descreva o endereço com mais detalhes")
    .max(300, "Máximo 300 caracteres"),
  suggestedHours: z.string().optional(),
  description: z.string().max(500).optional(),
  whatsappLink: z
    .string()
    .max(500)
    .optional()
    .refine(
      (val) => !val?.trim() || /^https:\/\//i.test(val.trim()),
      "O link deve começar com https://"
    ),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  cityId: Id<"cities">;
  cityLabel: string;
  defaultLat: number;
  defaultLng: number;
};

export function RequestTradePointView({
  cityId,
  cityLabel,
  defaultLat,
  defaultLng,
}: Props) {
  const router = useRouter();
  const submitRequest = useMutation(api.tradePoints.submitRequest);
  const { isBlocked, isLoading: isLoadingQuota } = useQuotaStatus();

  const {
    status: geoStatus,
    coords,
    error: geoError,
    requestPermission,
  } = useGeolocation();
  const isChecking = geoStatus === "checking" || geoStatus === "prompting";
  const effectiveCoords = coords ?? { lat: defaultLat, lng: defaultLng };

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
      suggestedHours: "",
      description: "",
      whatsappLink: "",
    },
  });

  async function onSubmit(data: FormValues) {
    const description = data.description?.trim();
    const whatsappLink = data.whatsappLink?.trim();
    const suggestedHoursLabel = data.suggestedHours
      ? (HOUR_LABEL_BY_VALUE[data.suggestedHours] ?? undefined)
      : undefined;

    const result = await submitRequest({
      name: data.name.trim(),
      address: data.address.trim(),
      cityId,
      lat: effectiveCoords.lat,
      lng: effectiveCoords.lng,
      suggestedHours: suggestedHoursLabel,
      description: description || undefined,
      whatsappLink: whatsappLink || undefined,
    });

    if (result.ok) {
      toast.success("Sugestão enviada — análise em 24 a 48 horas.");
      router.push("/map");
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
    toast.error("Revise os campos e tente novamente.");
  }

  const ctaDisabled =
    form.formState.isSubmitting || isBlocked || isLoadingQuota;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <QuotaBanner />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 pb-24 pt-[max(theme(spacing.4),env(safe-area-inset-top))]">
        <header className="flex items-center">
          <Button variant="ghost" size="icon" asChild aria-label="Voltar">
            <Link href="/map">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </header>

        <section className="space-y-3">
          <Heading level={1} className="text-4xl text-primary md:text-5xl">
            Amplie o Campo de Jogo.
          </Heading>
          <Text variant="muted" className="text-base">
            Ajude a comunidade a encontrar novos pontos de troca seguros e
            movimentados em {cityLabel}.
          </Text>
        </section>

        <Announcement className="w-full items-start justify-start gap-3 rounded-xl bg-primary/5 p-4 ring-1 ring-inset ring-primary/20">
          <AnnouncementTag>
            <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          </AnnouncementTag>
          <div className="flex flex-col gap-1 text-left">
            <AnnouncementTitle className="text-xs uppercase tracking-widest text-primary">
              Orientação de segurança
            </AnnouncementTitle>
            <Text variant="small" className="font-normal">
              Escolha apenas locais públicos e movimentados como shoppings,
              praças de alimentação e parques.
            </Text>
          </div>
        </Announcement>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do local</FormLabel>
                  <FormControl>
                    <Input
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
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="pr-12"
                        placeholder="Rua, número, bairro, referências"
                        autoComplete="street-address"
                        {...field}
                      />
                      <button
                        type="button"
                        aria-label="Usar minha localização atual"
                        aria-busy={isChecking}
                        disabled={isChecking}
                        onClick={() => requestPermission()}
                        className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-2 text-primary transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                      >
                        {isChecking ? (
                          <Spinner variant="circle-filled" size={20} />
                        ) : (
                          <Crosshair className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Coordenadas: {effectiveCoords.lat.toFixed(5)},{" "}
                    {effectiveCoords.lng.toFixed(5)} · clique no ícone para usar
                    sua posição atual.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suggestedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário sugerido (opcional)</FormLabel>
                  <FormControl>
                    <Choicebox
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-2 gap-2"
                    >
                      {HOUR_OPTIONS.map((option) => (
                        <ChoiceboxItem
                          key={option.value}
                          value={option.value}
                          id={`hours-${option.value}`}
                          className="cursor-pointer rounded-lg border p-3"
                        >
                          <ChoiceboxItemHeader>
                            <ChoiceboxItemTitle>
                              {option.label}
                            </ChoiceboxItemTitle>
                          </ChoiceboxItemHeader>
                          <ChoiceboxIndicator id={`hours-${option.value}`} />
                        </ChoiceboxItem>
                      ))}
                    </Choicebox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Por que este é um bom ponto? (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o local, acessibilidade e por que colecionadores devem ir até lá..."
                      className="min-h-[96px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do grupo WhatsApp (opcional)</FormLabel>
                  <FormControl>
                    <Input
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
                size="lg"
                className="w-full uppercase tracking-tight"
                disabled={ctaDisabled}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner variant="circle-filled" size={18} />
                    Enviando…
                  </>
                ) : (
                  "Enviar sugestão"
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
