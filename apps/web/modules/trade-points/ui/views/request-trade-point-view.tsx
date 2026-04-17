"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { ArrowLeft, Crosshair, MapPinPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
import { Heading, Text } from "@workspace/ui/components/typography";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(120, "Máximo 120 caracteres"),
  address: z
    .string()
    .min(5, "Descreva o endereço com mais detalhes")
    .max(300, "Máximo 300 caracteres"),
  suggestedHours: z.string().max(80).optional(),
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
  const [coords, setCoords] = useState({ lat: defaultLat, lng: defaultLng });
  const [geoLoading, setGeoLoading] = useState(false);

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

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocalização não disponível neste dispositivo.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
        toast.success("Localização atualizada.");
      },
      () => {
        setGeoLoading(false);
        toast.error(
          "Não foi possível obter sua localização. Ajuste nas permissões do navegador ou use o centro da cidade."
        );
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 0 }
    );
  }, []);

  async function onSubmit(data: FormValues) {
    const suggestedHours = data.suggestedHours?.trim();
    const description = data.description?.trim();
    const whatsappLink = data.whatsappLink?.trim();

    const result = await submitRequest({
      name: data.name.trim(),
      address: data.address.trim(),
      cityId,
      lat: coords.lat,
      lng: coords.lng,
      suggestedHours: suggestedHours || undefined,
      description: description || undefined,
      whatsappLink: whatsappLink || undefined,
    });

    if (result.ok) {
      toast.success(
        "Sugestão enviada! Nossa equipe vai analisar em breve."
      );
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
    if (result.error === "city-mismatch") {
      toast.error("A cidade não confere com o seu perfil. Atualize a cidade e tente de novo.");
      return;
    }
    if (result.error === "invalid-coordinates") {
      toast.error("Coordenadas fora do Brasil. Ajuste a localização.");
      return;
    }
    toast.error("Revise os campos e tente novamente.");
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-lg flex-col gap-4 px-4 pb-24 pt-[max(theme(spacing.4),env(safe-area-inset-top))]">
      <header className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild aria-label="Voltar">
          <Link href="/map">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <MapPinPlus className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <Heading level={1} className="text-lg">
              Sugerir ponto
            </Heading>
            <Text variant="muted" className="truncate text-xs">
              {cityLabel}
            </Text>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Novo ponto de troca</CardTitle>
          <CardDescription>
            Indique um local público e seguro onde colecionadores possam se
            encontrar. A equipe revisa antes de publicar no mapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do local</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: Praça da Sé, portão principal"
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
                      <Input
                        placeholder="Rua, número, bairro, referências"
                        autoComplete="street-address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Text variant="small" className="font-medium">
                    Pin no mapa
                  </Text>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={geoLoading}
                    onClick={useMyLocation}
                  >
                    <Crosshair className="mr-1.5 h-4 w-4" />
                    {geoLoading ? "Obtendo…" : "Usar minha localização"}
                  </Button>
                </div>
                <Text variant="muted" className="text-xs">
                  Coordenadas atuais: {coords.lat.toFixed(5)},{" "}
                  {coords.lng.toFixed(5)}. Por padrão usamos o centro de{" "}
                  {cityLabel}; use o botão para marcar o ponto exato, se
                  quiser.
                </Text>
              </div>

              <FormField
                control={form.control}
                name="suggestedHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horários sugeridos (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex.: fins de semana, 14h–18h"
                        {...field}
                      />
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
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ponto de referência, melhor horário, etc."
                        className="min-h-[88px] resize-y"
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
                        placeholder="https://chat.whatsapp.com/…"
                        inputMode="url"
                        autoComplete="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Enviando…" : "Enviar sugestão"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
