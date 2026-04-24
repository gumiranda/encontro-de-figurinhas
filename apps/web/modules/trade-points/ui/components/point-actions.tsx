"use client";

import { memo, useState, type RefObject } from "react";
import { LogOut, MapPin, UserMinus, UserPlus } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@workspace/backend/_generated/api";
import { celebrateToast } from "@/components/delight";
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
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";

type PointActionsProps = {
  tradePointId: Id<"tradePoints">;
  isParticipant: boolean;
  hasActiveCheckin: boolean;
  pointLat: number;
  pointLng: number;
  joinButtonRef?: RefObject<HTMLButtonElement | null>;
};

export const PointActions = memo(function PointActions({
  tradePointId,
  isParticipant,
  hasActiveCheckin,
  pointLat,
  pointLng,
  joinButtonRef,
}: PointActionsProps) {
  const join = useMutation(api.userTradePoints.join);
  const leave = useMutation(api.userTradePoints.leave);
  const checkIn = useMutation(api.checkins.create);

  type PendingAction = "join" | "leave" | "checkin" | null;
  const [pending, setPending] = useState<PendingAction>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  async function handleJoin() {
    setPending("join");
    try {
      const res = await join({ tradePointId });
      if (res.ok) {
        celebrateToast("Você entrou no ponto!", {
          description: "Agora é só combinar as trocas.",
          level: "small",
        });
      } else if (res.error === "limit-reached") {
        toast.error("Limite de 3 pontos atingido. Atualize para Premium ou saia de outro ponto.");
      } else if (res.error === "already-member") {
        toast.info("Você já participa deste ponto");
      } else if (res.error === "point-unavailable") {
        toast.error("Ponto indisponível");
      } else {
        toast.error("Não foi possível participar agora");
      }
    } finally {
      setPending(null);
    }
  }

  async function handleLeave() {
    setPending("leave");
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
      setPending(null);
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

    setPending("checkin");
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
              celebrateToast("Check-in renovado!", {
                description: "Mais 2 horas na arena.",
                level: "small",
              });
            } else if (res.replacedPrevious) {
              celebrateToast("Check-in movido!", {
                description: "Você está neste ponto agora.",
                level: "small",
              });
            } else {
              celebrateToast("Check-in confirmado!", {
                description: "Você está na arena. Boas trocas!",
                level: "medium",
              });
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
          setPending(null);
        }
      },
      (err) => {
        setPending(null);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Permita o acesso à sua localização para fazer check-in");
        } else {
          toast.error("Não foi possível obter sua localização");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  void pointLat;
  void pointLng;

  const isBusy = pending !== null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {isParticipant ? (
          <Button
            variant="outline"
            onClick={requestLeave}
            disabled={isBusy}
            aria-busy={pending === "leave"}
            className="gap-2"
          >
            {pending === "leave" ? (
              <Spinner className="size-4 shrink-0" />
            ) : (
              <UserMinus className="h-4 w-4" />
            )}
            Sair
          </Button>
        ) : (
          <Button
            ref={joinButtonRef}
            variant="default"
            onClick={handleJoin}
            disabled={isBusy}
            aria-busy={pending === "join"}
            className="gap-2"
          >
            {pending === "join" ? (
              <Spinner className="size-4 shrink-0" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Participar
          </Button>
        )}
        <Button
          variant={hasActiveCheckin ? "secondary" : "outline"}
          onClick={handleCheckIn}
          disabled={isBusy || !isParticipant}
          aria-busy={pending === "checkin"}
          className="gap-2"
        >
          {pending === "checkin" ? (
            <Spinner className="size-4 shrink-0" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          {hasActiveCheckin ? "Estou aqui" : "Estou aqui agora"}
        </Button>
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
              disabled={isBusy}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeave}
              disabled={isBusy}
              aria-busy={pending === "leave"}
              className="gap-2"
            >
              {pending === "leave" ? (
                <Spinner className="size-4 shrink-0" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sair mesmo assim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
