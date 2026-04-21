"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
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
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowLeftRight,
  Ban,
  CheckCircle2,
  Gavel,
  Inbox,
  LayoutDashboard,
  Loader2,
  MapPin,
  Settings,
  Shield,
  Star,
  Landmark,
} from "lucide-react";
import { toast } from "sonner";

type Tab = "pending" | "approved" | "suspended";

type Row = {
  _id: Id<"tradePoints">;
  slug: string;
  name: string;
  address: string;
  description?: string;
  lat: number;
  lng: number;
  createdAt: number;
  suggestedHours?: string;
  whatsappLink?: string;
  requesterNickname: string;
  reliabilityScore: number;
  cityName: string;
  cityState: string;
  citySlug: string;
};

function staticMapUrl(lat: number, lng: number) {
  const z = 16;
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${z}&size=640x480&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
}

function reliabilityStars(score: number) {
  const filled = Math.min(5, Math.max(0, Math.round((score / 10) * 5)));
  return Array.from({ length: 5 }, (_, i) => i < filled);
}

function formatConvexError(err: unknown): string {
  if (err instanceof ConvexError && typeof err.data === "string") {
    const map: Record<string, string> = {
      "invalid-whatsapp":
        "Link inválido. Use um convite no formato https://chat.whatsapp.com/…",
      "invalid-point": "Este ponto não está mais pendente ou não existe.",
      "invalid-reason": "Informe um motivo com 3 a 2000 caracteres.",
    };
    return map[err.data] ?? err.data;
  }
  if (err instanceof Error) return err.message;
  return "Algo deu errado.";
}

export function AdminPointsView() {
  const [tab, setTab] = useState<Tab>("pending");
  const rows = useQuery(api.tradePoints.adminListTradePoints, { filter: tab });
  const approve = useMutation(api.tradePoints.adminApprovePendingPoint);
  const reject = useMutation(api.tradePoints.adminRejectPendingPoint);

  const [approveOpen, setApproveOpen] = useState<Row | null>(null);
  const [rejectOpen, setRejectOpen] = useState<Row | null>(null);
  const [wa, setWa] = useState("");
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const openApprove = useCallback((row: Row) => {
    setWa(row.whatsappLink?.trim() ?? "");
    setApproveOpen(row);
  }, []);

  const openReject = useCallback((row: Row) => {
    setReason("");
    setRejectOpen(row);
  }, []);

  const onApprove = async () => {
    if (!approveOpen) return;
    setBusyId(String(approveOpen._id));
    try {
      await approve({ tradePointId: approveOpen._id, whatsappLink: wa });
      toast.success("Ponto aprovado.");
      setApproveOpen(null);
    } catch (e) {
      toast.error(formatConvexError(e));
    } finally {
      setBusyId(null);
    }
  };

  const onReject = async () => {
    if (!rejectOpen) return;
    setBusyId(String(rejectOpen._id));
    try {
      await reject({ tradePointId: rejectOpen._id, reason });
      toast.success("Solicitação recusada.");
      setRejectOpen(null);
    } catch (e) {
      toast.error(formatConvexError(e));
    } finally {
      setBusyId(null);
    }
  };

  const pendingList = tab === "pending" && rows !== undefined ? rows : [];
  const featured = pendingList[0];
  const compact = pendingList[1];
  const rest = pendingList.slice(2);

  return (
    <div
      className={cn(
        "min-h-screen bg-[#090e1c] text-[#e1e4fa]",
        "[--ap-primary:#95aaff] [--ap-secondary:#4ff325] [--ap-on-secondary:#105500]",
        "[--ap-surface-low:#0d1323] [--ap-outline:#434759] [--ap-muted:#a6aabf]"
      )}
    >
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(0, 82, 255, 0.12), transparent), radial-gradient(circle at bottom left, rgba(79, 243, 37, 0.08), transparent)",
        }}
      />

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-[var(--ap-outline)]/10 bg-[var(--ap-surface-low)] shadow-2xl md:flex">
        <div className="px-8 py-8">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ap-primary)] text-[#00247e]">
              <Shield className="h-5 w-5" aria-hidden />
            </div>
            <h1 className="font-[family-name:var(--font-headline)] text-lg font-bold uppercase tracking-widest text-[#e1e4fa]">
              Admin
            </h1>
          </div>
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="group flex items-center gap-4 px-4 py-3 text-sm font-semibold text-[var(--ap-muted)] transition-all duration-200 hover:bg-[#13192b] hover:text-[var(--ap-primary)]"
            >
              <LayoutDashboard className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span>Visão geral</span>
            </Link>
            <Link
              href="/admin/points"
              className="flex items-center gap-4 border-r-4 border-[var(--ap-primary)] bg-[var(--ap-primary)]/10 px-4 py-3 text-sm font-semibold text-[var(--ap-primary)]"
            >
              <ArrowLeftRight className="h-5 w-5" />
              <span>Pontos de troca</span>
            </Link>
            <Link
              href="/admin/users"
              className="group flex items-center gap-4 px-4 py-3 text-sm font-semibold text-[var(--ap-muted)] transition-all duration-200 hover:bg-[#13192b] hover:text-[var(--ap-primary)]"
            >
              <Gavel className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span>Usuários</span>
            </Link>
          </nav>
        </div>
        <div className="mt-auto border-t border-[var(--ap-outline)]/10 p-6">
          <p className="text-[10px] uppercase tracking-widest text-[var(--ap-muted)]">
            Figurinha Fácil · moderação
          </p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-[var(--ap-outline)]/5 bg-[#090e1c]/80 px-6 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-[var(--ap-primary)]" />
            <span className="font-[family-name:var(--font-headline)] text-xl font-black uppercase tracking-widest text-[var(--ap-primary)] md:text-2xl">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-[var(--ap-outline)]/15 bg-[#181f33] px-3 py-1.5 lg:flex">
              <div
                className="h-2 w-2 rounded-full bg-[var(--ap-secondary)] shadow-[0_0_12px_#4ff325]"
                aria-hidden
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ap-muted)]">
                Sistema online
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl p-6 pb-28 md:p-8 md:pb-12 lg:p-12">
          <div className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 font-[family-name:var(--font-headline)] text-3xl font-black uppercase tracking-tighter text-[#e1e4fa] sm:text-4xl md:text-5xl">
                {tab === "pending" && "Aprovações pendentes"}
                {tab === "approved" && "Pontos ativos"}
                {tab === "suspended" && "Pontos suspensos"}
              </h2>
              <p className="max-w-xl font-[family-name:var(--font-body)] text-[var(--ap-muted)]">
                {tab === "pending" &&
                  "Revise novos cadastros de ponto de troca. Avalie segurança e acessibilidade antes de publicar."}
                {tab === "approved" &&
                  "Pontos publicados no mapa e nas páginas públicas."}
                {tab === "suspended" &&
                  "Pontos temporariamente fora do ar (denúncias ou moderação)."}
              </p>
            </div>
            <div className="flex rounded-xl border border-[var(--ap-outline)]/10 bg-[var(--ap-surface-low)] p-1">
              {(
                [
                  ["pending", "Pendentes"],
                  ["approved", "Ativos"],
                  ["suspended", "Suspensos"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  className={cn(
                    "rounded-lg px-5 py-2.5 text-sm font-bold tracking-wide transition-all",
                    tab === k
                      ? "bg-[var(--ap-primary)] text-[#00247e] shadow-lg"
                      : "text-[var(--ap-muted)] hover:text-[#e1e4fa]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {rows === undefined ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--ap-primary)]" />
            </div>
          ) : tab === "pending" && pendingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-[var(--ap-outline)]/20 bg-[var(--ap-surface-low)]/40 py-20">
              <div className="relative mb-8">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[var(--ap-primary)]/10">
                  <Inbox className="h-16 w-16 text-[var(--ap-primary)]/40" />
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#090e1c] bg-[#181f33]">
                  <CheckCircle2 className="text-xl text-[var(--ap-secondary)]" />
                </div>
              </div>
              <h4 className="font-[family-name:var(--font-headline)] text-2xl font-black uppercase tracking-tight text-[#e1e4fa]">
                Fila em dia
              </h4>
              <p className="mt-2 font-[family-name:var(--font-body)] text-[var(--ap-muted)]">
                Não há solicitações pendentes no momento.
              </p>
            </div>
          ) : tab === "pending" ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {featured ? (
                <PendingFeaturedCard
                  row={featured}
                  onApprove={openApprove}
                  onReject={openReject}
                />
              ) : null}
              {compact ? (
                <PendingCompactCard
                  row={compact}
                  onApprove={openApprove}
                  onReject={openReject}
                />
              ) : null}
              {rest.map((row) => (
                <PendingRestCard
                  key={row._id}
                  row={row}
                  onApprove={openApprove}
                  onReject={openReject}
                />
              ))}
            </div>
          ) : (rows as Row[]).length === 0 ? (
            <p className="text-center font-[family-name:var(--font-body)] text-[var(--ap-muted)]">
              Nenhum ponto nesta lista.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(rows as Row[]).map((row) => (
                <div
                  key={row._id}
                  className="flex flex-col rounded-3xl border border-[var(--ap-outline)]/10 bg-[var(--ap-surface-low)] p-6 shadow-xl"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <MapPin className="h-8 w-8 shrink-0 text-[var(--ap-primary)]" />
                    {tab === "approved" ? (
                      <Link
                        href={`/ponto/${row.slug}`}
                        className="text-xs font-semibold text-[var(--ap-primary)] hover:underline"
                      >
                        Ver página pública
                      </Link>
                    ) : null}
                  </div>
                  <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-[#e1e4fa]">
                    {row.name}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--ap-muted)]">{row.address}</p>
                  <p className="mt-2 text-xs text-[var(--ap-muted)]">
                    {row.cityName}
                    {row.cityState ? ` · ${row.cityState}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--ap-outline)]/10 bg-[rgba(13,19,35,0.85)] px-4 py-3 backdrop-blur-xl md:hidden">
        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 text-[var(--ap-muted)]"
        >
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Início
          </span>
        </Link>
        <span className="flex flex-col items-center gap-1 text-[var(--ap-primary)]">
          <ArrowLeftRight className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Pontos
          </span>
        </span>
        <Link
          href="/admin/users"
          className="flex flex-col items-center gap-1 text-[var(--ap-muted)]"
        >
          <Gavel className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Usuários
          </span>
        </Link>
        <span className="flex flex-col items-center gap-1 text-[var(--ap-muted)] opacity-50">
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            Config
          </span>
        </span>
      </nav>

      <Dialog open={!!approveOpen} onOpenChange={(o) => !o && setApproveOpen(null)}>
        <DialogContent className="border-[var(--ap-outline)]/20 bg-[#13192b] text-[#e1e4fa] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-headline)]">
              Aprovar ponto
            </DialogTitle>
            <DialogDescription className="text-[var(--ap-muted)]">
              Cole o link do grupo do WhatsApp (convite{" "}
              <code className="text-[var(--ap-primary)]">chat.whatsapp.com</code>
              ).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="wa">Link do WhatsApp</Label>
            <Input
              id="wa"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="border-[var(--ap-outline)]/30 bg-[#090e1c]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(null)}>
              Cancelar
            </Button>
            <Button
              className="bg-[#4ff325] font-bold text-[#105500] hover:bg-[#3ee40c]"
              disabled={busyId !== null}
              onClick={() => void onApprove()}
            >
              {busyId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aprovar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectOpen} onOpenChange={(o) => !o && setRejectOpen(null)}>
        <DialogContent className="border-[var(--ap-outline)]/20 bg-[#13192b] text-[#e1e4fa] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-headline)]">
              Recusar solicitação
            </DialogTitle>
            <DialogDescription className="text-[var(--ap-muted)]">
              O motivo fica registrado internamente para auditoria.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Explique por que o cadastro não pode ser publicado."
              className="border-[var(--ap-outline)]/30 bg-[#090e1c]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(null)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={busyId !== null}
              onClick={() => void onReject()}
            >
              {busyId ? <Loader2 className="h-4 w-4 animate-spin" /> : "Recusar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PendingFeaturedCard({
  row,
  onApprove,
  onReject,
}: {
  row: Row;
  onApprove: (r: Row) => void;
  onReject: (r: Row) => void;
}) {
  const mapSrc = staticMapUrl(row.lat, row.lng);
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-[var(--ap-outline)]/10 bg-[var(--ap-surface-low)] shadow-2xl transition-all duration-500 hover:border-[var(--ap-primary)]/40 lg:col-span-8">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[280px] md:min-h-[300px]">
          <img
            src={mapSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover grayscale-[40%] transition-all duration-700 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ap-surface-low)] via-[var(--ap-surface-low)]/20 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="mb-2 inline-block rounded-full bg-[var(--ap-secondary)] px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-[#105500]">
              Nova solicitação
            </span>
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-black tracking-tighter text-[#e1e4fa] sm:text-3xl">
              {row.name}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[var(--ap-muted)]">
              <MapPin className="h-4 w-4 shrink-0" />
              {row.address}
            </p>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
            <div>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-[#707588]">
                Proposto por
              </span>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ap-primary)] text-[10px] font-bold text-[#00247e]">
                  {initials(row.requesterNickname)}
                </div>
                <span className="text-sm font-bold text-[#e1e4fa]">
                  {row.requesterNickname}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-[#707588]">
                Confiabilidade
              </span>
              <div className="flex items-center justify-end gap-1 font-[family-name:var(--font-headline)] font-black text-[var(--ap-secondary)]">
                <span className="text-xl">{row.reliabilityScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <span className="mb-3 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ap-primary)]">
              Justificativa / detalhes
            </span>
            <p className="border-l-2 border-[var(--ap-primary)]/30 pl-4 font-[family-name:var(--font-body)] italic leading-relaxed text-[var(--ap-muted)]">
              {row.description?.trim()
                ? `“${row.description.trim()}”`
                : "Sem descrição adicional além do endereço."}
            </p>
            {row.suggestedHours ? (
              <p className="mt-3 text-xs text-[var(--ap-muted)]">
                Horários sugeridos: {row.suggestedHours}
              </p>
            ) : null}
          </div>
          <div className="mt-8 flex gap-3">
            <Button
              type="button"
              onClick={() => onApprove(row)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--ap-secondary)] py-6 font-[family-name:var(--font-headline)] text-sm font-black uppercase tracking-widest text-[#105500] shadow-[0_10px_20px_-10px_rgba(79,243,37,0.4)] hover:scale-[1.02] hover:bg-[#3ee40c] active:scale-95"
            >
              <CheckCircle2 className="h-5 w-5" />
              Aprovar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onReject(row)}
              className="w-16 rounded-xl border-[#ff6e84]/30 py-6 text-[#ff6e84] hover:bg-[#ff6e84]/10"
            >
              <Ban className="mx-auto h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PendingCompactCard({
  row,
  onApprove,
  onReject,
}: {
  row: Row;
  onApprove: (r: Row) => void;
  onReject: (r: Row) => void;
}) {
  const stars = reliabilityStars(row.reliabilityScore);
  return (
    <div className="flex flex-col justify-between rounded-[2rem] border border-[var(--ap-outline)]/10 bg-[var(--ap-surface-low)] p-8 shadow-xl lg:col-span-4">
      <div>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--ap-primary)]/20 bg-[#181f33]">
            <Landmark className="h-8 w-8 text-[var(--ap-primary)]" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#feb700]">
              Confiabilidade: {row.reliabilityScore.toFixed(1)}
            </span>
            <div className="mt-1 flex justify-end gap-0.5 text-[#feb700]">
              {stars.map((on, i) => (
                <Star
                  key={i}
                  className={cn("h-3 w-3", on ? "fill-current" : "opacity-30")}
                />
              ))}
            </div>
          </div>
        </div>
        <h3 className="mb-1 font-[family-name:var(--font-headline)] text-2xl font-black tracking-tighter text-[#e1e4fa]">
          {row.name}
        </h3>
        <p className="mb-6 text-sm text-[var(--ap-muted)]">{row.address}</p>
        <div className="mb-8 rounded-2xl border border-[var(--ap-outline)]/5 bg-[#1e253b]/30 p-5">
          <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ap-primary)]">
            Resumo
          </span>
          <p className="text-xs leading-relaxed text-[var(--ap-muted)]">
            {row.description?.trim() ?? "Sem texto adicional."}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <Button
          type="button"
          onClick={() => onApprove(row)}
          className="w-full rounded-xl bg-[var(--ap-secondary)] py-6 font-[family-name:var(--font-headline)] text-sm font-black uppercase tracking-widest text-[#105500] shadow-[0_8px_16px_-8px_rgba(79,243,37,0.3)] hover:brightness-110"
        >
          Aprovar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onReject(row)}
          className="w-full rounded-xl border border-[#ff6e84]/20 bg-[#a70138]/20 py-6 font-[family-name:var(--font-headline)] text-sm font-black uppercase tracking-widest text-[#ff6e84] hover:bg-[#a70138]/40"
        >
          Recusar
        </Button>
      </div>
    </div>
  );
}

function PendingRestCard({
  row,
  onApprove,
  onReject,
}: {
  row: Row;
  onApprove: (r: Row) => void;
  onReject: (r: Row) => void;
}) {
  return (
    <div className="lg:col-span-12">
      <PendingFeaturedCard row={row} onApprove={onApprove} onReject={onReject} />
    </div>
  );
}
