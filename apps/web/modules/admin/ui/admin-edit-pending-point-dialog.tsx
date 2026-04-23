"use client";

import { useGeolocation } from "@/modules/location/lib/use-geolocation";
import { useNominatimGeocoder } from "@/modules/location/lib/use-nominatim-geocoder";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Crosshair, Loader2, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const LocationPickerMap = dynamic(
  () =>
    import("@/modules/trade-points/ui/components/location-picker-map").then(
      (mod) => mod.LocationPickerMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[200px] w-full animate-pulse rounded-xl bg-[#090e1c]" />
    ),
  }
);

export type AdminEditPendingPointRow = {
  _id: Id<"tradePoints">;
  name: string;
  address: string;
  description?: string;
  lat: number;
  lng: number;
  suggestedHours?: string;
  cityName: string;
  cityState: string;
};

export type AdminEditPendingSavePayload = {
  tradePointId: Id<"tradePoints">;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description?: string;
  suggestedHours?: string;
};

function cityLabelFromRow(row: AdminEditPendingPointRow) {
  return [row.cityName, row.cityState].filter(Boolean).join(", ");
}

type FormProps = {
  row: AdminEditPendingPointRow;
  onCancel: () => void;
  onSave: (payload: AdminEditPendingSavePayload) => Promise<void>;
  busy: boolean;
};

function AdminEditPendingPointForm({ row, onCancel, onSave, busy }: FormProps) {
  const [name, setName] = useState(row.name);
  const [address, setAddress] = useState(row.address);
  const [description, setDescription] = useState(row.description ?? "");
  const [hours, setHours] = useState(row.suggestedHours ?? "");
  const [selectedCoords, setSelectedCoords] = useState({
    lat: row.lat,
    lng: row.lng,
  });

  const cityBias = cityLabelFromRow(row);
  const {
    setQuery: setGeoQuery,
    suggestions,
    isLoading: isGeocoding,
    hasSearched,
    clearSuggestions,
  } = useNominatimGeocoder(cityBias || undefined);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    status: geoStatus,
    coords,
    error: geoError,
    requestPermission,
  } = useGeolocation();
  const isChecking = geoStatus === "checking" || geoStatus === "prompting";

  const lastToastedErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (!geoError) return;
    if (geoStatus !== "denied" && geoStatus !== "unavailable" && geoStatus !== "timeout")
      return;
    if (lastToastedErrorRef.current === geoError) return;
    lastToastedErrorRef.current = geoError;
    toast.error(
      geoStatus === "denied"
        ? "Permissão de localização negada. Ajuste o marcador no mapa ou o endereço."
        : "Não foi possível obter sua localização. Ajuste no mapa ou pelo endereço."
    );
  }, [geoError, geoStatus]);

  useEffect(() => {
    if (coords) {
      setSelectedCoords({ lat: coords.lat, lng: coords.lng });
    }
  }, [coords]);

  useEffect(() => {
    if (suggestions.length > 0 || hasSearched) {
      setShowSuggestions(true);
    }
  }, [suggestions, hasSearched]);

  const handleSubmit = useCallback(async () => {
    await onSave({
      tradePointId: row._id,
      name,
      address,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      description: description.trim() || undefined,
      suggestedHours: hours.trim() || undefined,
    });
  }, [
    address,
    description,
    hours,
    name,
    onSave,
    row._id,
    selectedCoords.lat,
    selectedCoords.lng,
  ]);

  const fieldClass =
    "border-[var(--ap-outline)]/30 bg-[#090e1c] text-[#e1e4fa] placeholder:text-[var(--ap-muted)]/60";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-[family-name:var(--font-headline)]">
          Editar solicitação
        </DialogTitle>
        <DialogDescription className="text-[var(--ap-muted)]">
          Mesmo fluxo da solicitação: busque o endereço, use o GPS ou arraste o marcador.
          O slug público é atualizado se o nome mudar.
        </DialogDescription>
      </DialogHeader>

      <div className="grid max-h-[min(78vh,640px)] gap-4 overflow-y-auto pr-1">
        <div className="space-y-2">
          <Label htmlFor="admin-edit-name">Nome do ponto</Label>
          <Input
            id="admin-edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-edit-address">Endereço</Label>
          <div className="relative">
            <Input
              id="admin-edit-address"
              value={address}
              autoComplete="off"
              onChange={(e) => {
                setAddress(e.target.value);
                setGeoQuery(e.target.value);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              placeholder="Rua, número, bairro, referências"
              className={`${fieldClass} pr-24`}
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {isGeocoding ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-[var(--ap-primary)]/70"
                  aria-label="Buscando endereço"
                />
              ) : null}
              <button
                type="button"
                aria-label="Usar minha localização atual"
                aria-busy={isChecking}
                disabled={isChecking}
                onClick={() => requestPermission()}
                className="inline-flex items-center justify-center rounded-md p-2 text-[var(--ap-primary)] transition-colors hover:bg-[#181f33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ap-primary)]/40 disabled:opacity-50"
              >
                {isChecking ? (
                  <Spinner variant="circle-filled" size={20} />
                ) : (
                  <Crosshair className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
            {showSuggestions &&
              (suggestions.length > 0 || (hasSearched && !isGeocoding)) && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-auto rounded-xl border border-[var(--ap-outline)]/30 bg-[#090e1c] shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-150"
                >
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <li key={suggestion.id} role="option">
                        <button
                          type="button"
                          className="flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm text-[#e1e4fa] transition-colors hover:bg-[#181f33] focus:bg-[#181f33] focus:outline-none"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedCoords({
                              lat: suggestion.lat,
                              lng: suggestion.lng,
                            });
                            setShowSuggestions(false);
                            clearSuggestions();
                            toast.info(
                              "Posição aproximada. Arraste o marcador para o local exato.",
                              { duration: 4000 }
                            );
                          }}
                        >
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--ap-primary)]" />
                          <span className="line-clamp-2">{suggestion.displayName}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2.5 text-sm text-[var(--ap-muted)]">
                      Nenhum resultado encontrado
                    </li>
                  )}
                </ul>
              )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <LocationPickerMap
              lat={selectedCoords.lat}
              lng={selectedCoords.lng}
              onLocationChange={(lat, lng) => setSelectedCoords({ lat, lng })}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center p-2">
              <div className="flex items-center gap-1.5 rounded-full bg-[#090e1c]/90 px-3 py-1.5 text-xs font-medium text-[#e1e4fa] shadow-md backdrop-blur-sm">
                <MapPin className="h-3.5 w-3.5 text-[var(--ap-primary)]" />
                Arraste o marcador para ajustar
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--ap-muted)]">
            <span>
              {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-edit-hours">Horários sugeridos (opcional)</Label>
          <Input
            id="admin-edit-hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Ex.: 10h–18h"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-edit-desc">Descrição / justificativa</Label>
          <Textarea
            id="admin-edit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={fieldClass}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-[var(--ap-outline)]/40 text-[#e1e4fa]"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="bg-[var(--ap-primary)] font-bold text-[#00247e] hover:bg-[var(--ap-primary)]/90"
          disabled={busy}
          onClick={() => void handleSubmit()}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
        </Button>
      </DialogFooter>
    </>
  );
}

type DialogProps = {
  row: AdminEditPendingPointRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: AdminEditPendingSavePayload) => Promise<void>;
  busy: boolean;
};

export function AdminEditPendingPointDialog({
  row,
  open,
  onOpenChange,
  onSave,
  busy,
}: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden border-[var(--ap-outline)]/20 bg-[#13192b] text-[#e1e4fa] sm:max-w-2xl">
        {row ? (
          <AdminEditPendingPointForm
            key={row._id}
            row={row}
            onCancel={() => onOpenChange(false)}
            onSave={onSave}
            busy={busy}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
