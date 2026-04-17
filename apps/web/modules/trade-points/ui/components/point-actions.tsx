"use client";

import { memo, useState } from "react";
import { LogOut, MapPin, UserMinus, UserPlus, Users } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@workspace/backend/_generated/api";
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

type PointActionsProps = {
  tradePointId: Id<"tradePoints">;
  isParticipant: boolean;
  hasActiveCheckin: boolean;
  activeCheckinsCount: number;
  participantCount: number;
  pointLat: number;
  pointLng: number;
};

export const PointActions = memo(function PointActions({
  tradePointId,
  isParticipant,
  hasActiveCheckin,
  activeCheckinsCount,
  participantCount,
  pointLat,
  pointLng,
}: PointActionsProps) {
  const join = useMutation(api.userTradePoints.join);
  const leave = useMutation(api.userTradePoints.leave);
  const checkIn = useMutation(api.checkins.create);

  const [busy, setBusy] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  async function handleJoin() {
    setBusy(true);
    try {
      const res = await join({ tradePointId });
      if (res.ok) {
        toast.success("Você entrou neste ponto");
      } else if (res.error === "limit-reached") {
        toast.error("Você atingiu o limite de 3 pontos no plano gratuito");
      } else if (res.error === "already-member") {
        toast.info("Você já participa deste ponto");
      } else if (res.error === "point-unavailable") {
        toast.error("Ponto indisponível");
      } else {
        toast.error("Não foi possível participar agora");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave() {
    setBusy(true);
    try {
      const res = await leave({ tradePointId });
      if (res.ok) {
        toast.success("Você saiu deste ponto");
      } else if (res.error === "not-member") {
        toast.info("Você já não participa deste ponto");
      } else {
        toast.error("Não foi possível sair agora");
      }
    } finally {
      setBusy(false);
      setConfirmLeaveOpen(false);
    }
  }

  function requestLeave() {
    if (hasActiveCheckin) {
      setConfirmLeaveOpen(true);
    } else {
      void handleLeave();
    }
  }

  async function handleCheckIn() {
    if (!navigator.geolocation) {
      toast.error("Geolocalização indisponível neste dispositivo");
      return;
    }

    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await checkIn({
            tradePointId,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          if (res.ok) {
            if (res.renewed) {
              toast.success("Check-in renovado por mais 2h");
            } else if (res.replacedPrevious) {
              toast.success("Check-in movido para este ponto");
            } else {
              toast.success("Check-in confirmado");
            }
          } else if (res.error === "too-far") {
            toast.error(
              `Você está a ${res.distanceMeters}m do ponto. Aproxime-se até 500m.`
            );
          } else if (res.error === "not-member") {
            toast.error("Participe deste ponto antes de fazer check-in");
          } else if (res.error === "point-unavailable") {
            toast.error("Ponto indisponível");
          } else {
            toast.error("Não foi possível fazer check-in agora");
          }
        } catch {
          toast.error("Erro ao fazer check-in");
        } finally {
          setBusy(false);
        }
      },
      (err) => {
        setBusy(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Permita o acesso à sua localização para fazer check-in");
        } else {
          toast.error("Não foi possível obter sua localização");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  // pointLat/pointLng kept for future "ver no mapa" button — silenciar lint
  void pointLat;
  void pointLng;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {isParticipant ? (
          <Button
            variant="outline"
            onClick={requestLeave}
            disabled={busy}
            className="gap-2"
          >
            <UserMinus className="h-4 w-4" />
            Sair
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={handleJoin}
            disabled={busy}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Participar
          </Button>
        )}
        <Button
          variant={hasActiveCheckin ? "secondary" : "outline"}
          onClick={handleCheckIn}
          disabled={busy || !isParticipant}
          className="gap-2"
        >
          <MapPin className="h-4 w-4" />
          {hasActiveCheckin ? "Estou aqui" : "Estou aqui agora"}
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {participantCount}{" "}
          {participantCount === 1 ? "participante" : "participantes"}
        </span>
        <span>
          {activeCheckinsCount}{" "}
          {activeCheckinsCount === 1 ? "presente agora" : "presentes agora"}
        </span>
      </div>

      <Dialog open={confirmLeaveOpen} onOpenChange={setConfirmLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sair deste ponto?</DialogTitle>
            <DialogDescription>
              Você tem um check-in ativo aqui. Sair vai cancelar o check-in.
              Continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmLeaveOpen(false)}
              disabled={busy}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={busy}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair mesmo assim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
