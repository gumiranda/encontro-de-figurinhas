"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { useState } from "react";

const spotSchema = z.object({
  title: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  latitude: z.number({ required_error: "Localização obrigatória" }),
  longitude: z.number({ required_error: "Localização obrigatória" }),
});

type SpotFormData = z.infer<typeof spotSchema>;

export function AddSpotDialog({
  open,
  onOpenChange,
  pickedLocation,
  userLocation,
  onPickLocation,
  onSpotCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pickedLocation: { latitude: number; longitude: number } | null;
  userLocation: { latitude: number; longitude: number } | null;
  onPickLocation: () => void;
  onSpotCreated: () => void;
}) {
  const createSpot = useMutation(api.spots.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const form = useForm<SpotFormData>({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      title: "",
      description: "",
      latitude: pickedLocation?.latitude,
      longitude: pickedLocation?.longitude,
    },
  });

  const handleUseMyLocation = () => {
    if (userLocation) {
      form.setValue("latitude", userLocation.latitude);
      form.setValue("longitude", userLocation.longitude);
      form.clearErrors("latitude");
      toast.success("Localização capturada!");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue("latitude", pos.coords.latitude);
        form.setValue("longitude", pos.coords.longitude);
        form.clearErrors("latitude");
        toast.success("Localização capturada!");
        setGettingLocation(false);
      },
      () => {
        toast.error("Não foi possível obter sua localização");
        setGettingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handlePickOnMap = () => {
    onOpenChange(false);
    onPickLocation();
  };

  const onSubmit = async (data: SpotFormData) => {
    setIsSubmitting(true);
    try {
      await createSpot({
        title: data.title,
        description: data.description || undefined,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      toast.success("Ponto criado com sucesso!");
      form.reset();
      onSpotCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar ponto"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasLocation =
    form.watch("latitude") !== undefined &&
    form.watch("longitude") !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-500" />
            Novo Ponto de Troca
          </DialogTitle>
          <DialogDescription>
            Compartilhe um local onde as pessoas estão trocando figurinhas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do ponto *</Label>
            <Input
              id="title"
              placeholder="Ex: Praça da Sé - próximo ao metrô"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Detalhes como horário, referências do local..."
              rows={3}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Localização *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUseMyLocation}
                disabled={gettingLocation}
                className="flex-1"
              >
                {gettingLocation ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-1" />
                )}
                Minha localização
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePickOnMap}
                className="flex-1"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Escolher no mapa
              </Button>
            </div>
            {hasLocation && (
              <p className="text-xs text-green-600">
                Localização definida ({form.watch("latitude")?.toFixed(4)},{" "}
                {form.watch("longitude")?.toFixed(4)})
              </p>
            )}
            {form.formState.errors.latitude && !hasLocation && (
              <p className="text-xs text-destructive">
                Escolha uma localização
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 mr-1" />
              )}
              Criar Ponto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
