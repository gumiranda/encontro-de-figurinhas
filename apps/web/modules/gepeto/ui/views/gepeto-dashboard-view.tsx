"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { api } from "@workspace/backend/_generated/api";
import type { ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  ChevronRight,
  Clock,
  Clipboard,
  Crown,
  Flame,
  Lock,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CommunityBar,
  GepetoAvatar,
  GepetoPredictionPanel,
  MatchHeader,
  PredictionForm,
  StreakStrip,
  VerdictBanner,
} from "@/modules/gepeto";
import { hasFinalScore, isPredictionRevealed } from "@/modules/gepeto/lib/match-state";

type Choice = "home" | "draw" | "away";
type TabKey = "hub" | "jogos" | "boloes" | "capitulo" | "ranking";
type DashboardHub = FunctionReturnType<typeof api.gepeto.getDashboardHub>;
type DashboardFixtures = FunctionReturnType<typeof api.gepeto.listDashboardFixtures>;
type DashboardPools = FunctionReturnType<typeof api.gepeto.listMyPools>;
type DashboardLeaderboard = FunctionReturnType<typeof api.gepeto.listLeaderboardWithUsers>;

const TAB_KEYS = new Set<TabKey>(["hub", "jogos", "boloes", "capitulo", "ranking"]);

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function pickTab(raw: string | null): TabKey {
  if (raw === "vs-ia") return "ranking";
  return TAB_KEYS.has(raw as TabKey) ? (raw as TabKey) : "hub";
}

function matchState(match: { kickoffAt: number; status?: string }) {
  if ((match.status ?? "scheduled") === "finished") return "pos";
  if ((match.status ?? "scheduled") === "live" || match.kickoffAt <= Date.now()) return "ao vivo";
  return "pre";
}

function choiceLabel(match: {
  homeTeamName: string;
  awayTeamName: string;
}, choice: Choice | null | undefined) {
  if (choice === "home") return match.homeTeamName;
  if (choice === "away") return match.awayTeamName;
  if (choice === "draw") return "Empate";
  return "Lacrado";
}

function toPercent(count: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-normal text-foreground">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card px-4 py-3">
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function MatchScore({
  match,
}: {
  match: {
    homeTeamFlag: string;
    awayTeamFlag: string;
    homeTeamName: string;
    awayTeamName: string;
    homeScore?: number;
    awayScore?: number;
  };
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="min-w-0 text-right">
        <div className="text-3xl">{match.homeTeamFlag}</div>
        <div className="truncate text-sm font-semibold">{match.homeTeamName}</div>
      </div>
      <div className="rounded-lg border border-border bg-background px-4 py-2 text-center font-display text-2xl font-black">
        {match.homeScore ?? "-"} x {match.awayScore ?? "-"}
      </div>
      <div className="min-w-0">
        <div className="text-3xl">{match.awayTeamFlag}</div>
        <div className="truncate text-sm font-semibold">{match.awayTeamName}</div>
      </div>
    </div>
  );
}

function HeroMatchCard({ hub }: { hub: DashboardHub }) {
  const match = hub.nextMatch;
  if (!match) {
    return (
      <Card className="min-h-[280px] overflow-hidden border-border bg-card p-6">
        <GepetoAvatar size={96} mood="thinking" />
        <h1 className="mt-6 font-display text-4xl font-black">Gepeto</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Os jogos aparecem aqui quando a tabela da Copa estiver carregada.
        </p>
      </Card>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[#090e1c] p-5 text-white md:p-7">
      <div className="absolute right-8 top-8 hidden opacity-30 md:block">
        <GepetoAvatar size={180} mood="smug" />
      </div>
      <div className="relative z-10 max-w-3xl">
        <Badge className="gap-2 rounded-full bg-primary text-primary-foreground">
          <Bot className="size-3.5" />
          Gepeto
        </Badge>
        <h1 className="mt-5 max-w-2xl font-display text-4xl font-black tracking-normal md:text-6xl">
          Lacre seu palpite antes do robô abrir a boca.
        </h1>
        <div className="mt-6 max-w-2xl rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
          <MatchScore match={match} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/70">
            <span>{dateFormatter.format(match.kickoffAt)}</span>
            <Badge variant="outline" className="border-white/20 text-white">
              {matchState(match)}
            </Badge>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link href={`/dashboard/gepeto/matches/${match._id}`}>
              Abrir partida
              <ChevronRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/gepeto">
              Landing pública
              <Sparkles className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FixtureRow({
  match,
}: {
  match: {
    _id: Id<"worldCupMatches">;
    homeTeamName: string;
    awayTeamName: string;
    homeTeamFlag: string;
    awayTeamFlag: string;
    kickoffAt: number;
    status?: string;
    userPrediction?: { prediction: Choice; exactScore?: { home: number; away: number } | null } | null;
    aiPrediction?: { prediction: Choice | null; confidence?: number } | null;
    communityCount: number;
  };
}) {
  return (
    <Link
      href={`/dashboard/gepeto/matches/${match._id}`}
      className="grid gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60 md:grid-cols-[1fr_auto_auto]"
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {dateFormatter.format(match.kickoffAt)}
          <Badge variant="secondary" className="rounded-full">
            {matchState(match)}
          </Badge>
        </div>
        <div className="flex items-center gap-3 font-display text-xl font-bold">
          <span>{match.homeTeamFlag}</span>
          <span className="truncate">{match.homeTeamName}</span>
          <span className="text-muted-foreground">x</span>
          <span>{match.awayTeamFlag}</span>
          <span className="truncate">{match.awayTeamName}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        {match.communityCount}
      </div>
      <div className="flex items-center gap-2">
        {match.userPrediction ? (
          <Badge className="rounded-full">Você: {choiceLabel(match, match.userPrediction.prediction)}</Badge>
        ) : (
          <Badge variant="outline" className="rounded-full">Sem palpite</Badge>
        )}
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </Link>
  );
}

function LeaderboardList({
  rows,
}: {
  rows: Array<{
    rank: number;
    winCount: number;
    lossCount: number;
    tieCount: number;
    totalMatches: number;
    user: { displayNickname: string } | null;
  }>;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">Ranking vazio por enquanto.</p>;
  }
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={`${row.rank}-${row.user?.displayNickname ?? "user"}`} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-primary/15 font-display font-black text-primary">
              {row.rank}
            </div>
            <div>
              <div className="font-semibold">{row.user?.displayNickname ?? "Colecionador"}</div>
              <div className="text-xs text-muted-foreground">{row.totalMatches} jogos contra Gepeto</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-black">{row.winCount}V</div>
            <div className="text-xs text-muted-foreground">{row.tieCount}E · {row.lossCount}D</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PoolsPanel({
  pools,
}: {
  pools: Array<{
    _id: Id<"gepetoPools">;
    name: string;
    emoji: string;
    color: string;
    inviteCode: string;
    activeMemberCount: number;
    privacy: string;
  }>;
}) {
  const createPool = useMutation(api.gepeto.createPool);
  const joinPool = useMutation(api.gepeto.joinPoolByCode);
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("⚽");
  const [color, setColor] = useState("#95AAFF");
  const [includeGepeto, setIncludeGepeto] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function handleCreate() {
    setIsBusy(true);
    try {
      const result = await createPool({
        name,
        description,
        emoji,
        color,
        privacy: "private",
        includeGepeto,
        knockoutMultiplier: 2,
        finalMultiplier: 3,
      });
      toast.success(`Bolão criado: ${result.inviteCode}`);
      router.push(`/dashboard/gepeto/boloes/${result.poolId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar bolão");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleJoin() {
    setIsBusy(true);
    try {
      const result = await joinPool({ inviteCode });
      toast.success("Você entrou no bolão");
      router.push(`/dashboard/gepeto/boloes/${result.poolId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao entrar no bolão");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-4">
        <Card className="space-y-4 p-4">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <Plus className="size-5 text-primary" />
            Criar bolão
          </div>
          <div className="grid grid-cols-[76px_1fr] gap-3">
            <Input value={emoji} onChange={(event) => setEmoji(event.target.value)} maxLength={8} aria-label="Emoji" />
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome do bolão" />
          </div>
          <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descrição curta" />
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <Input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-10 w-14 p-1" aria-label="Cor" />
              <span className="text-sm text-muted-foreground">Cor do bolão</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              Gepeto
              <Switch checked={includeGepeto} onCheckedChange={setIncludeGepeto} />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={isBusy || name.trim().length < 3} className="w-full gap-2">
            Criar e abrir
            <ChevronRight className="size-4" />
          </Button>
        </Card>
        <Card className="space-y-3 p-4">
          <div className="font-display text-xl font-bold">Entrar por código</div>
          <div className="flex gap-2">
            <Input value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase())} placeholder="ABC123" />
            <Button onClick={handleJoin} disabled={isBusy || inviteCode.trim().length < 4}>Entrar</Button>
          </div>
        </Card>
      </div>
      <div className="space-y-3">
        {pools.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground">
            Nenhum bolão ativo.
          </Card>
        ) : (
          pools.map((pool) => (
            <Link key={pool._id} href={`/dashboard/gepeto/boloes/${pool._id}`} className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-lg text-2xl" style={{ backgroundColor: `${pool.color}24` }}>
                    {pool.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-display text-xl font-bold">{pool.name}</div>
                    <div className="text-sm text-muted-foreground">{pool.activeMemberCount} membros · {pool.privacy}</div>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

const GEPETO_TABS: Array<{ value: TabKey; label: string }> = [
  { value: "hub", label: "Hub" },
  { value: "jogos", label: "Jogos" },
  { value: "boloes", label: "Bolões" },
  { value: "capitulo", label: "Capítulo" },
  { value: "ranking", label: "Vs IA" },
];

function timeToKickoff(kickoffAt?: number | null) {
  if (!kickoffAt) return "em breve";
  const diff = Math.max(0, kickoffAt - Date.now());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  if (hours <= 0) return `${minutes}min`;
  return `${hours}h ${String(minutes).padStart(2, "0")}min`;
}

function shortTeamName(name: string, code?: string) {
  return code || name.slice(0, 3).toUpperCase();
}

function scoreLabel(score?: { home: number; away: number } | null) {
  return score ? `${score.home}-${score.away}` : null;
}

function userAccuracy(stats: DashboardHub["stats"]) {
  if (stats.totalMatches <= 0) return 0;
  return Math.round((stats.winCount / stats.totalMatches) * 100);
}

function gepetoReferenceScore(narrative: DashboardHub["narrative"]) {
  if (!narrative) return 74;
  const total = narrative.gepetoScore + narrative.communityScore;
  if (total <= 0) return 74;
  return Math.round((narrative.gepetoScore / total) * 100);
}

function PhoneShell({
  tab,
  onTabChange,
  children,
}: {
  tab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="-m-6 min-h-[calc(100vh-3.5rem)] bg-[#070b18] px-3 py-5 text-[#dfe5ff] md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[36px] border border-[#444b65] bg-[#090e1c] shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
        <div className="sticky top-0 z-20 border-b border-[#444b65] bg-[#090e1c]/95 px-4 py-4 backdrop-blur">
          <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#aeb4ca]"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <GepetoAvatar size={30} mood="neutral" glow={false} />
              <div className="leading-none">
                <div className="font-display text-sm font-black">Gepeto</div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#aeb4ca]">
                  Humano × IA
                </div>
              </div>
            </div>
            <div />
          </div>
          <div className="grid grid-cols-5 rounded-2xl border border-[#444b65] bg-[#202741] p-1">
            {GEPETO_TABS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onTabChange(item.value)}
                className={cn(
                  "h-11 rounded-xl text-[11px] font-bold text-[#aeb4ca] transition-colors",
                  tab === item.value && "bg-[#dfe4fb] text-[#090e1c]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[760px] pb-8">{children}</div>
      </div>
    </div>
  );
}

function CountdownChip({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6b6570]/70 px-3 py-1 font-mono text-xs font-bold tracking-wide text-[#ffc965]">
      <Clock className="size-3.5" />
      {time}
    </span>
  );
}

function PhoneCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Card className={cn("rounded-3xl border-[#444b65] bg-[#12192e] text-[#dfe5ff]", className)}>
      {children}
    </Card>
  );
}

function NextDuelCard({
  hub,
  pools,
  onGoTo,
}: {
  hub: DashboardHub;
  pools: DashboardPools;
  onGoTo: (tab: TabKey) => void;
}) {
  const match = hub.nextMatch;
  const router = useRouter();
  if (!match) {
    return (
      <PhoneCard className="p-5">
        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffc965]">
          Próximo duelo
        </div>
        <div className="mt-6 flex justify-center">
          <GepetoAvatar size={88} mood="thinking" />
        </div>
        <p className="mt-4 text-center text-sm text-[#aeb4ca]">
          A tabela da Copa ainda não carregou.
        </p>
      </PhoneCard>
    );
  }

  const gepetoPct = gepetoReferenceScore(hub.narrative);
  const youPct = userAccuracy(hub.stats);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-transparent bg-[linear-gradient(145deg,#304061,#172033_58%,#21462d)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.34em] text-[#ffc965]">
          Próximo duelo
        </div>
        <CountdownChip time={timeToKickoff(match.kickoffAt)} />
      </div>

      <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-center">
          <div className="text-[42px] leading-none">{match.homeTeamFlag}</div>
          <div className="mt-3 font-display text-lg font-black">
            {shortTeamName(match.homeTeamName, match.homeTeamCode)}
          </div>
        </div>
        <div className="font-display text-xl font-black text-[#aeb4ca]">vs</div>
        <div className="text-center">
          <div className="text-[42px] leading-none">{match.awayTeamFlag}</div>
          <div className="mt-3 font-display text-lg font-black">
            {shortTeamName(match.awayTeamName, match.awayTeamCode)}
          </div>
        </div>
      </div>
      <div className="mt-5 text-center text-sm text-[#aeb4ca]">
        {dataRoundLabel(matchState(match))} · {match.venue ?? "Estádio a definir"}
      </div>

      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-[#4a536d] bg-[#0c1222]/75 p-3">
        <div className="flex items-center gap-3">
          <GepetoAvatar size={36} mood="smug" />
          <div>
            <div className="text-sm font-black">Gepeto</div>
            <div className="font-mono text-2xl font-black leading-none text-[#ffc965]">
              {gepetoPct}%
            </div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#aeb4ca]">
              Acertos
            </div>
          </div>
        </div>
        <div className="font-display text-2xl font-black text-[#aeb4ca]">×</div>
        <div className="flex items-center justify-end gap-3 text-right">
          <div>
            <div className="text-sm font-black">Você</div>
            <div className="font-mono text-2xl font-black leading-none text-[#95aaff]">
              {youPct}%
            </div>
            <div className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#aeb4ca]">
              Acertos
            </div>
          </div>
          <div className="grid size-12 place-items-center rounded-full bg-[#95aaff] font-display text-lg font-black text-[#0a1432]">
            {hub.user.displayNickname.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      <Button
        className="mt-4 h-12 w-full gap-2 rounded-2xl bg-[#95aaff] text-base font-black text-[#082054] hover:bg-[#a9baff]"
        onClick={() => router.push(`/dashboard/gepeto/matches/${match._id}`)}
      >
        <Zap className="size-4 fill-current" />
        Ir para o duelo
      </Button>
      <button
        type="button"
        onClick={() => onGoTo("jogos")}
        className="mt-3 flex h-9 w-full items-center justify-center gap-2 text-sm font-bold text-[#aeb4ca]"
      >
        Ver todos os jogos da Copa
        <ChevronRight className="size-4" />
      </button>

      {pools.length > 0 && (
        <div className="sr-only">Você tem {pools.length} bolões ativos.</div>
      )}
    </div>
  );
}

function dataRoundLabel(state: string) {
  if (state === "ao vivo") return "Em andamento";
  if (state === "pos") return "Finalizado";
  return "Quartas de final";
}

function HubPhoneScreen({
  hub,
  pools,
  onGoTo,
}: {
  hub: DashboardHub;
  pools: DashboardPools;
  onGoTo: (tab: TabKey) => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <NextDuelCard hub={hub} pools={pools} onGoTo={onGoTo} />

      <PhoneCard className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-base font-black">
            <Users className="size-4 text-[#95aaff]" />
            Seus bolões
          </div>
          <button
            type="button"
            onClick={() => onGoTo("boloes")}
            className="inline-flex items-center gap-1 text-xs font-black text-[#95aaff]"
          >
            Ver todos <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="grid gap-2">
          {pools.slice(0, 2).map((pool) => (
            <Link
              key={pool._id}
              href={`/dashboard/gepeto/boloes/${pool._id}`}
              className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-xl border border-[#444b65] bg-[#172039] p-3"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-[#202842] text-xl">
                {pool.emoji}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-sm font-black">{pool.name}</div>
                <div className="text-xs text-[#aeb4ca]">
                  {pool.activeMemberCount} membros · {pool.includeGepeto ? "Gepeto incluso" : "sem Gepeto"}
                </div>
              </div>
              <Badge className="rounded-lg bg-[#ffc965]/15 font-mono text-[#ffc965]">
                {pool.activeMemberCount > 1 ? `${Math.max(0, pool.activeMemberCount - 1)} ok` : "novo"}
              </Badge>
            </Link>
          ))}
          {pools.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#444b65] p-4 text-sm text-[#aeb4ca]">
              Crie um bolão e puxe o Gepeto para a mesa.
            </div>
          )}
        </div>
      </PhoneCard>

      <PhoneCard className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-base font-black">Capítulo 3 · Quartas</div>
          <button
            type="button"
            onClick={() => onGoTo("capitulo")}
            className="inline-flex items-center gap-1 text-xs font-black text-[#95aaff]"
          >
            Ler capítulo <ChevronRight className="size-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#ffc965]/40 bg-[#ffc965]/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <GepetoAvatar size={22} mood="smug" glow={false} />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#aeb4ca]">
                Gepeto
              </span>
            </div>
            <div className="font-mono text-4xl font-black text-[#ffc965]">
              {hub.narrative?.gepetoScore ?? 11}
              <span className="text-lg text-[#aeb4ca]">/16</span>
            </div>
          </div>
          <div className="rounded-2xl border border-[#95aaff]/40 bg-[#95aaff]/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="size-4 text-[#95aaff]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#aeb4ca]">
                Humanos
              </span>
            </div>
            <div className="font-mono text-4xl font-black text-[#95aaff]">
              {hub.narrative?.communityScore ?? 9}
              <span className="text-lg text-[#aeb4ca]">/16</span>
            </div>
          </div>
        </div>
      </PhoneCard>

      <StreakStrip
        currentStreak={hub.stats.winCount}
        days={[
          { day: "S", played: true, beatAI: hub.stats.winCount > 0 },
          { day: "T", played: true, beatAI: hub.stats.winCount > 1 },
          { day: "Q", played: true, beatAI: false },
          { day: "Q", played: true, beatAI: hub.stats.winCount > 2 },
          { day: "S", played: false, beatAI: false, isToday: true },
        ]}
        className="border-[#444b65] bg-[#12192e] text-[#dfe5ff]"
      />
    </div>
  );
}

function phaseAccent(round: DashboardFixtures[number]) {
  const label = `${round.name} ${round.phase}`.toLowerCase();
  if (round.isActive) return "#ffc965";
  if (label.includes("semi")) return "#4ff325";
  if (label.includes("final")) return "#ffc965";
  return "#95aaff";
}

function FixturePhoneRow({
  match,
  featured,
}: {
  match: DashboardFixtures[number]["matches"][number];
  featured: boolean;
}) {
  const state = matchState(match);
  const live = state === "ao vivo";
  const finished = state === "pos";
  const gepetoScore = scoreLabel(match.aiPrediction?.exactScore);
  const userScore = scoreLabel(match.userPrediction?.exactScore);

  return (
    <Link
      href={`/dashboard/gepeto/matches/${match._id}`}
      className={cn(
        "grid grid-cols-[64px_1fr_20px] items-center gap-3 rounded-2xl border bg-[#172039] p-3",
        featured && "border-[#ffc965] bg-[linear-gradient(90deg,rgba(255,201,101,0.09),#172039)]",
        live && "border-[#ff6e84] bg-[linear-gradient(90deg,rgba(255,110,132,0.08),#172039)]",
        !featured && !live && "border-[#444b65]",
      )}
    >
      <div className="text-center">
        {live ? (
          <>
            <div className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[#ff6e84] shadow-[0_0_10px_#ff6e84]" />
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#ff6e84]">
                live
              </span>
            </div>
            <div className="mt-1 font-mono text-lg font-black">{match.status === "live" ? "56'" : "agora"}</div>
          </>
        ) : finished ? (
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#aeb4ca]">
            Final
          </div>
        ) : (
          <div className="font-mono text-xs font-black leading-tight text-[#ffc965]">
            <div>{featured ? "hoje" : dateFormatter.format(match.kickoffAt).split(",")[0]}</div>
            <div>{new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(match.kickoffAt)}</div>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 font-display text-base font-black">
              <span>{match.homeTeamFlag}</span>
              <span className={cn("truncate", finished && (match.homeScore ?? 0) < (match.awayScore ?? 0) && "text-[#aeb4ca]")}>
                {shortTeamName(match.homeTeamName, match.homeTeamCode)}
              </span>
            </div>
            <div className="flex items-center gap-2 font-display text-base font-black">
              <span>{match.awayTeamFlag}</span>
              <span className={cn("truncate", finished && (match.awayScore ?? 0) < (match.homeScore ?? 0) && "text-[#aeb4ca]")}>
                {shortTeamName(match.awayTeamName, match.awayTeamCode)}
              </span>
            </div>
          </div>
          <div className={cn("font-mono text-xl font-black", live && "text-[#ff6e84]")}>
            {finished || live ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}` : "vs"}
          </div>
        </div>
        <div className="mt-3 flex gap-2 border-t border-dashed border-[#444b65] pt-2">
          {gepetoScore ? (
            <span className="inline-flex items-center gap-1 rounded-lg bg-[#ffc965]/15 px-2 py-1 font-mono text-xs font-black text-[#ffc965]">
              <GepetoAvatar size={14} mood="neutral" glow={false} /> {gepetoScore}
            </span>
          ) : (
            <span className="rounded-lg border border-dashed border-[#ffc965]/45 px-2 py-1 font-mono text-xs font-black text-[#ffc965]">
              Gepeto lacrado
            </span>
          )}
          {userScore ? (
            <span className="rounded-lg bg-[#95aaff]/15 px-2 py-1 font-mono text-xs font-black text-[#95aaff]">
              Você {userScore}
            </span>
          ) : (
            !finished && (
              <span className="rounded-lg border border-dashed border-[#95aaff]/60 px-2 py-1 font-mono text-xs font-black text-[#95aaff]">
                + palpitar
              </span>
            )
          )}
        </div>
      </div>
      <ChevronRight className="size-5 text-[#aeb4ca]" />
    </Link>
  );
}

function FixturesPhoneScreen({ fixtures }: { fixtures: DashboardFixtures }) {
  const currentIndex = Math.max(0, fixtures.findIndex((round) => round.isActive));
  const [phaseIndex, setPhaseIndex] = useState(currentIndex);
  const activeRound = fixtures[phaseIndex] ?? fixtures[0];

  if (!activeRound) {
    return <div className="p-4 text-sm text-[#aeb4ca]">Sem jogos carregados.</div>;
  }

  return (
    <div>
      <div className="sticky top-[133px] z-10 flex gap-2 overflow-x-auto border-b border-[#444b65] bg-[#090e1c]/95 p-3 backdrop-blur">
        {fixtures.map((round, index) => {
          const selected = phaseIndex === index;
          const accent = phaseAccent(round);
          return (
            <button
              key={round._id}
              type="button"
              onClick={() => setPhaseIndex(index)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-black",
                selected ? "bg-[#dfe4fb] text-[#090e1c]" : "bg-transparent text-[#aeb4ca]",
              )}
              style={{ borderColor: selected ? "#dfe4fb" : accent }}
            >
              {!round.isActive && index > currentIndex && <Lock className="size-3.5" style={{ color: accent }} />}
              {round.name}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-black text-[#ffc965]">
              {activeRound.name}
            </h2>
            <p className="mt-1 text-sm text-[#aeb4ca]">
              {activeRound.matches.length * 2} seleções · {activeRound.matches.length} jogos
            </p>
          </div>
          {activeRound.isActive && (
            <Badge className="gap-1 rounded-lg bg-[#ffc965]/15 font-mono text-[#ffc965]">
              <span className="size-1.5 rounded-full bg-[#4ff325]" />
              Atual
            </Badge>
          )}
        </div>
        <div className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#aeb4ca]">
          {activeRound.phase} · {activeRound.matches.length} partidas
        </div>
        <div className="grid gap-3">
          {activeRound.matches.map((match, index) => (
            <FixturePhoneRow
              key={match._id}
              match={match}
              featured={index === 0 && matchState(match) !== "pos"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PoolsPhoneScreen({ pools }: { pools: DashboardPools }) {
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="font-display text-3xl font-black">Bolões</h2>
        <p className="mt-1 text-sm text-[#aeb4ca]">Bata seus amigos. E o Gepeto, claro.</p>
      </div>
      <PoolsPanel pools={pools} />
    </div>
  );
}

function ChapterPhoneScreen({ hub }: { hub: DashboardHub }) {
  return (
    <div className="space-y-4 p-4">
      <PhoneCard className="overflow-hidden p-0">
        <div className="bg-[linear-gradient(135deg,rgba(255,201,101,0.16),transparent_70%)] p-5">
          <div className="mb-4 flex items-center gap-3">
            <GepetoAvatar size={56} mood="smug" />
            <div>
              <div className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#ffc965]">
                Capítulo
              </div>
              <h2 className="font-display text-2xl font-black">Quartas no fio</h2>
            </div>
          </div>
          <p className="text-base leading-relaxed text-[#dfe5ff]">
            {hub.narrative?.narrative ?? "Gepeto ainda está juntando munição para escrever o capítulo desta semana."}
          </p>
        </div>
      </PhoneCard>
      <div className="grid grid-cols-2 gap-3">
        <PhoneCard className="border-[#ffc965]/40 p-4">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#aeb4ca]">
            Gepeto
          </div>
          <div className="mt-2 font-mono text-4xl font-black text-[#ffc965]">
            {hub.narrative?.gepetoScore ?? 11}
          </div>
        </PhoneCard>
        <PhoneCard className="border-[#95aaff]/40 p-4">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#aeb4ca]">
            Humanos
          </div>
          <div className="mt-2 font-mono text-4xl font-black text-[#95aaff]">
            {hub.narrative?.communityScore ?? 9}
          </div>
        </PhoneCard>
      </div>
    </div>
  );
}

function RankingPhoneScreen({
  hub,
  leaderboard,
}: {
  hub: DashboardHub;
  leaderboard: DashboardLeaderboard;
}) {
  return (
    <div className="space-y-4 p-4">
      <PhoneCard className="overflow-hidden p-0">
        <div className="bg-[linear-gradient(135deg,rgba(149,170,255,0.18),transparent_70%)] p-5">
          <div className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[#95aaff]">
            Você × Gepeto
          </div>
          <h2 className="mt-1 font-display text-2xl font-black">O dossiê da rivalidade</h2>
          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center rounded-2xl border border-[#444b65] bg-[#0c1222]/70 p-4">
            <div className="text-center">
              <div className="mx-auto grid size-10 place-items-center rounded-full bg-[#95aaff] font-display font-black text-[#0a1432]">
                {hub.user.displayNickname.slice(0, 2).toUpperCase()}
              </div>
              <div className="mt-2 font-mono text-4xl font-black text-[#95aaff]">{hub.stats.winCount}</div>
              <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#aeb4ca]">
                vitórias
              </div>
            </div>
            <div className="font-display text-2xl font-black text-[#aeb4ca]">×</div>
            <div className="text-center">
              <GepetoAvatar size={40} mood={hub.stats.lossCount > hub.stats.winCount ? "smug" : "angry"} glow={false} />
              <div className="mt-2 font-mono text-4xl font-black text-[#ffc965]">{hub.stats.lossCount}</div>
              <div className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#aeb4ca]">
                vitórias
              </div>
            </div>
          </div>
        </div>
      </PhoneCard>
      <PhoneCard className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-display text-base font-black">Quem bateu mais o Gepeto</div>
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[#aeb4ca]">
            Copa 2026
          </span>
        </div>
        <div className="grid gap-2">
          {leaderboard.map((row) => (
            <div
              key={row._id}
              className="grid grid-cols-[32px_34px_1fr_auto] items-center gap-2 rounded-xl border border-[#444b65] bg-[#172039] p-3"
            >
              <div className="font-mono text-sm font-black text-[#ffc965]">#{row.rank}</div>
              <div className="grid size-8 place-items-center rounded-full bg-[#95aaff]/20 font-display text-xs font-black">
                {(row.user?.displayNickname ?? "?").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-black">
                  @{row.user?.displayNickname ?? "colecionador"}
                </div>
                <div className="text-xs text-[#aeb4ca]">{row.totalMatches} jogos</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-black text-[#4ff325]">{row.winCount}×</div>
                <div className="text-[10px] text-[#aeb4ca]">{row.tieCount}E</div>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#444b65] p-4 text-sm text-[#aeb4ca]">
              Ranking vazio por enquanto.
            </div>
          )}
        </div>
      </PhoneCard>
    </div>
  );
}

export function GepetoDashboardView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedTab = pickTab(searchParams.get("tab"));
  const hub = useQuery(api.gepeto.getDashboardHub, {});
  const fixtures = useQuery(api.gepeto.listDashboardFixtures, {});
  const pools = useQuery(api.gepeto.listMyPools, {});
  const leaderboard = useQuery(api.gepeto.listLeaderboardWithUsers, { limit: 30 });

  const allMatches = useMemo(
    () => fixtures?.flatMap((round) => round.matches.map((match) => ({ ...match, roundName: round.name }))) ?? [],
    [fixtures],
  );

  if (!hub || !fixtures || !pools || !leaderboard) {
    return (
      <div className="space-y-4">
        <div className="h-72 animate-pulse rounded-xl bg-muted" />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-24 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <HeroMatchCard hub={hub} />
      <div className="grid gap-3 md:grid-cols-4">
        <StatPill label="Vitórias" value={hub.stats.winCount} />
        <StatPill label="Empates" value={hub.stats.tieCount} />
        <StatPill label="Derrotas" value={hub.stats.lossCount} />
        <StatPill label="Bolões" value={pools.length} />
      </div>

      <Tabs
        value={selectedTab}
        onValueChange={(value) => router.push(`/dashboard/gepeto?tab=${value}`)}
        className="space-y-5"
      >
        <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-xl p-1 md:grid-cols-5">
          <TabsTrigger value="hub">Hub</TabsTrigger>
          <TabsTrigger value="jogos">Jogos</TabsTrigger>
          <TabsTrigger value="boloes">Bolões</TabsTrigger>
          <TabsTrigger value="capitulo">Capítulo</TabsTrigger>
          <TabsTrigger value="ranking">Vs IA</TabsTrigger>
        </TabsList>

        <TabsContent value="hub" className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="p-5">
              <SectionHeader eyebrow="Próxima decisão" title="Antes do apito, tudo fica lacrado." />
              {hub.nextMatch ? (
                <div className="mt-5 space-y-4">
                  <MatchScore match={hub.nextMatch} />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground">
                      Gepeto: {hub.aiPrediction?.prediction ? choiceLabel(hub.nextMatch, hub.aiPrediction.prediction) : "palpite lacrado"}
                    </div>
                    <Button asChild className="gap-2">
                      <Link href={`/dashboard/gepeto/matches/${hub.nextMatch._id}`}>
                        Ir para o jogo
                        <Zap className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
            <StreakStrip
              currentStreak={hub.stats.winCount}
              days={[
                { day: "S", played: true, beatAI: hub.stats.winCount > 0 },
                { day: "T", played: true, beatAI: hub.stats.winCount > 1 },
                { day: "Q", played: true, beatAI: false },
                { day: "Q", played: true, beatAI: hub.stats.winCount > 2 },
                { day: "S", played: false, beatAI: false, isToday: true },
              ]}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <SectionHeader eyebrow="Mesa" title="Top contra o robô" />
              <div className="mt-4">
                <LeaderboardList rows={hub.leaderboard} />
              </div>
            </Card>
            <Card className="p-5">
              <SectionHeader eyebrow="Bolões" title="Seus grupos ativos" />
              <div className="mt-4 grid gap-2">
                {pools.slice(0, 3).map((pool) => (
                  <Link key={pool._id} href={`/dashboard/gepeto/boloes/${pool._id}`} className="flex items-center justify-between rounded-lg border border-border p-3 hover:border-primary/60">
                    <span className="font-semibold">{pool.emoji} {pool.name}</span>
                    <Badge variant="secondary">{pool.activeMemberCount}</Badge>
                  </Link>
                ))}
                {pools.length === 0 && <p className="text-sm text-muted-foreground">Crie seu primeiro bolão na aba Bolões.</p>}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jogos" className="space-y-5">
          <SectionHeader eyebrow="Tabela" title={`${allMatches.length} jogos para desafiar Gepeto`} />
          <div className="space-y-5">
            {fixtures.map((round) => (
              <section key={round._id} className="space-y-3">
                <h3 className="font-display text-xl font-bold">{round.name}</h3>
                <div className="space-y-2">
                  {round.matches.map((match) => (
                    <FixtureRow key={match._id} match={match} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="boloes">
          <SectionHeader eyebrow="Bolões" title="Rivalidade privada, zoeira pública." />
          <div className="mt-5">
            <PoolsPanel pools={pools} />
          </div>
        </TabsContent>

        <TabsContent value="capitulo" className="space-y-4">
          <SectionHeader eyebrow="Capítulo" title="O boletim semanal do Gepeto" />
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <GepetoAvatar size={56} mood="neutral" />
              <div>
                <div className="font-display text-xl font-bold">Narrativa da rodada</div>
                <div className="text-sm text-muted-foreground">
                  Gepeto {hub.narrative?.gepetoScore ?? 0} x {hub.narrative?.communityScore ?? 0} comunidade
                </div>
              </div>
            </div>
            <p className="text-lg leading-relaxed">
              {hub.narrative?.narrative ?? "Gepeto ainda está juntando munição para escrever o capítulo desta semana."}
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <SectionHeader eyebrow="Vs IA" title="Quem já calou o Gepeto" />
          <LeaderboardList rows={leaderboard} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function GepetoMatchDashboardView({ matchId }: { matchId: Id<"worldCupMatches"> }) {
  const data = useQuery(api.gepeto.getDashboardMatch, { matchId });

  if (!data) {
    return <div className="h-80 animate-pulse rounded-xl bg-muted" />;
  }

  const { match, round, aiPrediction, userPrediction, community, result } = data;
  const total = Math.max(community.total, 1);
  const hasResult = hasFinalScore(match);
  const gepetoRevealed = isPredictionRevealed(match);
  const userExactScore = userPrediction?.exactScore ?? null;
  const gepetoExactScore = aiPrediction?.exactScore ?? null;
  const matchHeaderState = hasResult ? "postMatch" : gepetoRevealed ? "live" : "preMatch";

  const getTimeToKickoff = () => {
    const diff = match.kickoffAt - Date.now();
    if (diff <= 0) return "Agora";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2 px-2">
        <Link href="/dashboard/gepeto?tab=jogos">
          <ArrowLeft className="size-4" />
          Todos os jogos
        </Link>
      </Button>

      <MatchHeader
        homeTeam={{
          name: match.homeTeamName,
          code: match.homeTeamName.slice(0, 3).toUpperCase(),
          flag: match.homeTeamFlag,
        }}
        awayTeam={{
          name: match.awayTeamName,
          code: match.awayTeamName.slice(0, 3).toUpperCase(),
          flag: match.awayTeamFlag,
        }}
        phase={round?.name ?? "Copa 2026"}
        date={new Date(match.kickoffAt).toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
        stadium={match.venue}
        state={matchHeaderState}
        timeToKickoff={getTimeToKickoff()}
        finalScore={
          hasResult
            ? { home: match.homeScore ?? 0, away: match.awayScore ?? 0 }
            : undefined
        }
      />

      {hasResult && userExactScore && gepetoExactScore ? (
        <VerdictBanner
          userPrediction={userExactScore}
          gepetoPrediction={gepetoExactScore}
          actualResult={{ home: match.homeScore ?? 0, away: match.awayScore ?? 0 }}
        />
      ) : null}

      <PredictionForm
        matchId={match._id}
        homeTeam={match.homeTeamName}
        awayTeam={match.awayTeamName}
        kickoffAt={match.kickoffAt}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        existingPrediction={
          userPrediction?.prediction
            ? {
                prediction: userPrediction.prediction,
                exactScore: userPrediction.exactScore,
              }
            : undefined
        }
      />

      <GepetoPredictionPanel
        matchId={match._id}
        homeTeam={match.homeTeamName}
        awayTeam={match.awayTeamName}
        isRevealed={gepetoRevealed}
        hasPrediction={!!aiPrediction}
        hasUserPrediction={!!userPrediction}
        prediction={aiPrediction?.prediction ?? null}
        exactScore={aiPrediction?.exactScore ?? null}
        confidence={aiPrediction?.confidence}
        reasoning={aiPrediction?.reasoning ?? []}
        trashTalk={aiPrediction?.trashTalk}
        generatedAt={aiPrediction?.generatedAt}
      />

      {community.total > 0 ? (
        <CommunityBar
          homeFlag={match.homeTeamFlag}
          awayFlag={match.awayTeamFlag}
          homePercent={toPercent(community.counts.home, total)}
          drawPercent={toPercent(community.counts.draw, total)}
          awayPercent={toPercent(community.counts.away, total)}
          totalPredictions={community.total}
        />
      ) : null}

      {result ? (
        <Card className={cn("p-5", result.outcome === "win" && "border-emerald-400/60 bg-emerald-400/5")}>
          <div className="flex items-center gap-3">
            <Trophy className="size-6 text-primary" />
            <div>
              <div className="font-display text-xl font-bold">
                {result.outcome === "win"
                  ? "Badge conquistado"
                  : result.outcome === "tie"
                    ? "Empate técnico"
                    : "Gepeto levou essa"}
              </div>
              <div className="text-sm text-muted-foreground">
                {userPrediction?.hasBadge
                  ? "Seu distintivo já está registrado."
                  : "O resultado entra após o placar final."}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export function GepetoPoolDetailView({ poolId }: { poolId: Id<"gepetoPools"> }) {
  const data = useQuery(api.gepeto.getPoolDetail, { poolId });
  const postComment = useMutation(api.gepeto.postPoolComment);
  const pokeMember = useMutation(api.gepeto.pokePoolMember);
  const [message, setMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  if (!data) {
    return <div className="h-80 animate-pulse rounded-xl bg-muted" />;
  }
  const detail = data;

  async function handleCopyInvite() {
    await navigator.clipboard.writeText(detail.pool.inviteCode);
    toast.success("Convite copiado");
  }

  async function handleComment() {
    setIsPosting(true);
    try {
      await postComment({ poolId, message });
      setMessage("");
      toast.success("Comentário publicado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao comentar");
    } finally {
      setIsPosting(false);
    }
  }

  async function handlePoke(memberId: Id<"gepetoPoolMembers">) {
    try {
      await pokeMember({ poolId, targetMemberId: memberId });
      toast.success("Cutucado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cutucar");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="rounded-xl border border-border bg-card p-5 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-xl text-4xl" style={{ backgroundColor: `${detail.pool.color}24` }}>
              {detail.pool.emoji}
            </div>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                Bolão Gepeto
              </p>
              <h1 className="font-display text-4xl font-black">{detail.pool.name}</h1>
              <p className="mt-1 text-muted-foreground">{detail.pool.description ?? "Sem descrição"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCopyInvite} variant="outline" className="gap-2">
              <Clipboard className="size-4" />
              {detail.pool.inviteCode}
            </Button>
            {detail.nextMatch ? (
              <Button asChild className="gap-2">
                <Link href={`/dashboard/gepeto/matches/${detail.nextMatch._id}`}>
                  Próximo jogo
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <SectionHeader eyebrow="Ranking" title="Mesa do bolão" />
            <div className="mt-4 space-y-2">
              {detail.ranking.map((row) => (
                <div key={row.member._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-full bg-primary/15 font-display font-black text-primary">
                      {row.rank}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {row.member.role === "gepeto" ? "🤖 " : ""}{row.member.displayNickname}
                      </div>
                      <div className="text-xs text-muted-foreground">{row.correctHits} acertos · {row.exactHits} placares</div>
                    </div>
                  </div>
                  <div className="font-display text-2xl font-black">{row.points}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <SectionHeader eyebrow="Membros" title={`${detail.members.length} na sala`} />
            <div className="mt-4 grid gap-2">
              {detail.members.map((member) => (
                <div key={member._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="font-semibold">{member.displayNickname}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => handlePoke(member._id)} className="gap-2">
                    <Flame className="size-4" />
                    Cutucar
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <SectionHeader eyebrow="Chat" title="Atividades do bolão" />
            <div className="mt-4 flex gap-2">
              <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Comentar no bolão" />
              <Button onClick={handleComment} disabled={isPosting || message.trim().length === 0} size="icon" aria-label="Enviar comentário">
                <Send className="size-4" />
              </Button>
            </div>
            <div className="mt-5 space-y-3">
              {detail.activities.map((activity) => (
                <div key={activity._id} className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageCircle className="size-3.5" />
                    {activity.actor?.displayNickname ?? "Gepeto"}
                    <span>·</span>
                    {dateFormatter.format(activity.createdAt)}
                  </div>
                  <p className="text-sm">{activity.message ?? activity.type}</p>
                </div>
              ))}
              {detail.activities.length === 0 && (
                <p className="text-sm text-muted-foreground">Sem atividade ainda.</p>
              )}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <Crown className="size-6 text-primary" />
              <div>
                <div className="font-display text-xl font-bold">Multiplicadores</div>
                <div className="text-sm text-muted-foreground">
                  Mata-mata x{detail.pool.knockoutMultiplier} · Final x{detail.pool.finalMultiplier}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
