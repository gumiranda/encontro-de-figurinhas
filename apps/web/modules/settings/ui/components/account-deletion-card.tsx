"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { AlertTriangle, Loader2, Trash2, XCircle } from "lucide-react";

export function AccountDeletionCard() {
  const [confirmText, setConfirmText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const status = useQuery(api.lgpd.getDeletionStatus);
  const requestDeletion = useMutation(api.lgpd.requestAccountDeletion);
  const cancelDeletion = useMutation(api.lgpd.cancelAccountDeletion);

  const handleRequestDeletion = async () => {
    if (confirmText !== "EXCLUIR") return;
    setError(null);
    try {
      await requestDeletion();
      setIsOpen(false);
      setConfirmText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao solicitar exclusão");
    }
  };

  const handleCancelDeletion = async () => {
    setError(null);
    try {
      await cancelDeletion();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao cancelar exclusão");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status?.pending) {
    const daysRemaining = Math.max(
      0,
      Math.ceil((status.gracePeriodEnds - Date.now()) / (1000 * 60 * 60 * 24))
    );

    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Exclusão Solicitada
          </CardTitle>
          <CardDescription>
            Sua conta será excluída em {daysRemaining} dia
            {daysRemaining !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Período de carência</AlertTitle>
            <AlertDescription>
              Sua conta será permanentemente excluída em{" "}
              <strong>{formatDate(status.gracePeriodEnds)}</strong>. Após essa
              data, todos os seus dados serão removidos e não poderão ser
              recuperados.
            </AlertDescription>
          </Alert>

          {status.canCancel && (
            <Button
              variant="outline"
              onClick={handleCancelDeletion}
              className="w-full"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar exclusão
            </Button>
          )}

          {!status.canCancel && (
            <p className="text-sm text-muted-foreground">
              A exclusão está em andamento e não pode ser cancelada.
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Excluir Conta</CardTitle>
        <CardDescription>
          Exclua permanentemente sua conta e todos os dados associados (LGPD
          Art. 18 - Direito ao Esquecimento)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir minha conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão da conta</DialogTitle>
              <DialogDescription className="space-y-2">
                <p>Esta ação é irreversível. Ao confirmar:</p>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>
                    Você terá <strong>7 dias</strong> para cancelar a exclusão
                  </li>
                  <li>Após esse período, todos os seus dados serão removidos</li>
                  <li>
                    Suas trocas serão anonimizadas para preservar o histórico de
                    outros usuários
                  </li>
                  <li>
                    Posts, comentários e check-ins serão excluídos
                    permanentemente
                  </li>
                </ul>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">
                Digite <strong>EXCLUIR</strong> para confirmar
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="EXCLUIR"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleRequestDeletion}
                disabled={confirmText !== "EXCLUIR"}
              >
                Confirmar exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
