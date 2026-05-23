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
import {
  formatPhaseLabel,
  formatRoundSectionLabel,
  PHASE_ORDER,
} from "@/modules/gepeto/lib/round-labels";

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

function matchState(match: {
  kickoffAt: number;
  status?: string;
  homeScore?: number;
  awayScore?: number;
}) {
  if (hasFinalScore(match) || (match.status ?? "scheduled") === "finished") return "pos";
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

function predictionBadgeClass(
  predicted: { home: number; away: number } | null | undefined,
  actualHome?: number,
  actualAway?: number,
  variant: "gepeto" | "user" = "user",
) {
  if (
    predicted &&
    actualHome !== undefined &&
    actualAway !== undefined &&
    predicted.home === actualHome &&
    predicted.away === actualAway
  ) {
    return "bg-[#4ff325]/15 text-[#4ff325]";
  }
  if (actualHome !== undefined && actualAway !== undefined && predicted) {
    return variant === "gepeto"
      ? "bg-[#ffc965]/15 text-[#ffc965]"
      : "bg-[#ff6e84]/15 text-[#ff6e84]";
  }
  return variant === "gepeto"
    ? "bg-[#ffc965]/15 text-[#ffc965]"
    : "bg-[#95aaff]/15 text-[#95aaff]";
}

function roundStatusLabel(round: DashboardFixtures[number]) {
  if (round.matches.length === 0) return "SEM JOGOS";
  if (round.matches.every((match) => hasFinalScore(match))) return "ENCERRADA";
  if (round.matches.some((match) => matchState(match) === "ao vivo")) return "AO VIVO";
  return "ABERTA";
}

function groupFixturesByPhase(fixtures: DashboardFixtures) {
  const map = new Map<string, DashboardFixtures>();
  for (const round of fixtures) {
    const rounds = map.get(round.phase) ?? [];
    rounds.push(round);
    map.set(round.phase, rounds);
  }

  const knownPhases = new Set<string>(PHASE_ORDER);
  const orderedPhases = [
    ...PHASE_ORDER.filter((phase) => map.has(phase)),
    ...[...map.keys()].filter((phase) => !knownPhases.has(phase)),
  ];

  return orderedPhases.map((phase) => ({
    phase,
    label: formatPhaseLabel(phase),
    rounds: (map.get(phase) ?? []).sort((a, b) => a.order - b.order),
  }));
}

function countTeamsInRounds(rounds: DashboardFixtures[number][]) {
  const teams = new Set<string>();
  for (const round of rounds) {
    for (const match of round.matches) {
      teams.add(match.homeTeamCode);
      teams.add(match.awayTeamCode);
    }
  }
  return teams.size;
}

function countMatchesInRounds(rounds: DashboardFixtures[number][]) {
  return rounds.reduce((total, round) => total + round.matches.length, 0);
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
    <div className="-mx-6 -mb-6 w-[calc(100%+3rem)] min-h-[calc(100vh-3.5rem)] overflow-x-hidden bg-[#070b18] text-[#dfe5ff] md:-m-6 md:w-[calc(100%+3rem)]">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full min-w-0 max-w-full flex-col bg-[#090e1c] md:max-w-none">
        <div className="sticky top-0 z-20 shrink-0 border-b border-[#444b65] bg-[#090e1c]/95 px-4 py-4 backdrop-blur md:px-8 md:py-5">
          <div className="mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-2 md:mb-5">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#aeb4ca]"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <div className="flex min-w-0 items-center justify-center gap-2">
              <GepetoAvatar size={30} mood="neutral" glow={false} />
              <div className="min-w-0 leading-none">
                <div className="truncate font-display text-sm font-black md:text-base">Gepeto</div>
                <div className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#aeb4ca] md:text-[10px]">
                  Humano × IA
                </div>
              </div>
            </div>
            <div className="size-9 shrink-0" aria-hidden />
          </div>
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-[#444b65] bg-[#202741] p-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-auto md:grid md:max-w-4xl md:grid-cols-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {GEPETO_TABS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onTabChange(item.value)}
                className={cn(
                  "h-11 shrink-0 rounded-xl px-3 text-[11px] font-bold whitespace-nowrap text-[#aeb4ca] transition-colors md:h-12 md:px-0 md:text-sm",
                  tab === item.value && "bg-[#dfe4fb] text-[#090e1c]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 pb-8 md:pb-10">{children}</div>
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
    <div className="min-w-0 space-y-4 p-4 md:p-8">
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
  const userScore = scoreLabel(
    isPredictionRevealed(match) ? match.userPrediction?.exactScore : null,
  );
  const hasAiPrediction = !!match.aiPrediction;
  const actualHome = match.homeScore;
  const actualAway = match.awayScore;

  return (
    <Link
      href={`/dashboard/gepeto/matches/${match._id}`}
      className={cn(
        "grid w-full max-w-full min-w-0 grid-cols-[52px_minmax(0,1fr)_20px] items-center gap-2 overflow-hidden rounded-2xl border bg-[#172039] p-3 sm:gap-3",
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
          <div className="font-mono text-[9px] font-black uppercase leading-tight tracking-[0.18em] text-[#aeb4ca] sm:text-[10px] sm:tracking-[0.24em]">
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
          <div className={cn("shrink-0 font-mono text-lg font-black sm:text-xl", live && "text-[#ff6e84]")}>
            {finished || live ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}` : "vs"}
          </div>
        </div>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2 border-t border-dashed border-[#444b65] pt-2">
          {gepetoScore ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-xs font-black",
                predictionBadgeClass(
                  match.aiPrediction?.exactScore,
                  actualHome,
                  actualAway,
                  "gepeto",
                ),
              )}
            >
              <GepetoAvatar size={14} mood="neutral" glow={false} /> {gepetoScore}
            </span>
          ) : hasAiPrediction ? (
            <span className="rounded-lg border border-dashed border-[#ffc965]/45 px-2 py-1 font-mono text-xs font-black text-[#ffc965]">
              Gepeto lacrado
            </span>
          ) : null}
          {userScore ? (
            <span
              className={cn(
                "rounded-lg px-2 py-1 font-mono text-xs font-black",
                predictionBadgeClass(
                  match.userPrediction?.exactScore,
                  actualHome,
                  actualAway,
                  "user",
                ),
              )}
            >
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
  const phases = useMemo(() => groupFixturesByPhase(fixtures), [fixtures]);
  const activePhaseIndex = Math.max(
    0,
    phases.findIndex((entry) => entry.rounds.some((round) => round.isActive)),
  );
  const [phaseIndex, setPhaseIndex] = useState(activePhaseIndex);
  const activePhase = phases[phaseIndex] ?? phases[0];

  if (!activePhase) {
    return <div className="p-4 text-sm text-[#aeb4ca]">Sem jogos carregados.</div>;
  }

  const teamCount = countTeamsInRounds(activePhase.rounds);
  const matchCount = countMatchesInRounds(activePhase.rounds);

  return (
    <div className="min-w-0">
      <div className="flex max-w-full gap-2 overflow-x-auto border-b border-[#444b65] bg-[#090e1c] p-3 [-ms-overflow-style:none] [scrollbar-width:none] md:sticky md:top-[148px] md:z-10 md:bg-[#090e1c]/95 md:px-8 md:backdrop-blur [&::-webkit-scrollbar]:hidden">
        {phases.map((entry, index) => {
          const selected = phaseIndex === index;
          const accent = phaseAccent(entry.rounds[0] ?? fixtures[0]!);
          const locked = entry.rounds.every((round) => !round.isActive) && index > activePhaseIndex;
          return (
            <button
              key={entry.phase}
              type="button"
              onClick={() => setPhaseIndex(index)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black whitespace-nowrap sm:px-4 sm:text-sm",
                selected ? "bg-[#dfe4fb] text-[#090e1c]" : "bg-transparent text-[#aeb4ca]",
              )}
              style={{ borderColor: selected ? "#dfe4fb" : accent }}
            >
              {locked && <Lock className="size-3.5" style={{ color: accent }} />}
              {entry.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-5 p-4 md:p-8 min-w-0">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-black text-[#ffc965]">
              {activePhase.label}
            </h2>
            <p className="mt-1 text-sm text-[#aeb4ca]">
              {teamCount} seleções · {matchCount} jogos
            </p>
          </div>
          {activePhase.rounds.some((round) => round.isActive) && (
            <Badge className="gap-1 rounded-lg bg-[#ffc965]/15 font-mono text-[#ffc965]">
              <span className="size-1.5 rounded-full bg-[#4ff325]" />
              Atual
            </Badge>
          )}
        </div>

        {activePhase.rounds.map((round) => (
          <section key={round._id} className="space-y-3">
            <div className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#aeb4ca]">
              {formatRoundSectionLabel(round).toUpperCase()} · {roundStatusLabel(round)}
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[...round.matches]
                .sort((a, b) => {
                  const aFinished = matchState(a) === "pos" ? 1 : 0;
                  const bFinished = matchState(b) === "pos" ? 1 : 0;
                  return aFinished - bFinished;
                })
                .map((match, index) => (
                  <FixturePhoneRow
                    key={match._id}
                    match={match}
                    featured={index === 0 && matchState(match) !== "pos" && round.isActive}
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function PoolsPhoneScreen({ pools }: { pools: DashboardPools }) {
  return (
    <div className="p-4 md:p-8">
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
    <div className="min-w-0 space-y-4 p-4 md:p-8">
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
    <div className="min-w-0 space-y-4 p-4 md:p-8">
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
    <PhoneShell tab={selectedTab} onTabChange={(tab) => router.push(`/dashboard/gepeto?tab=${tab}`)}>
      {selectedTab === "hub" && (
        <HubPhoneScreen hub={hub} pools={pools} onGoTo={(tab) => router.push(`/dashboard/gepeto?tab=${tab}`)} />
      )}
      {selectedTab === "jogos" && <FixturesPhoneScreen fixtures={fixtures} />}
      {selectedTab === "boloes" && <PoolsPhoneScreen pools={pools} />}
      {selectedTab === "capitulo" && <ChapterPhoneScreen hub={hub} />}
      {selectedTab === "ranking" && (
        <RankingPhoneScreen hub={hub} leaderboard={leaderboard} />
      )}
    </PhoneShell>
  );
}

export function GepetoMatchDashboardView({ matchId }: { matchId: Id<"worldCupMatches"> }) {
  const data = useQuery(api.gepeto.getDashboardMatch, { matchId });
  const router = useRouter();

  if (!data) {
    return (
      <PhoneShell tab="jogos" onTabChange={(tab) => router.push(`/dashboard/gepeto?tab=${tab}`)}>
        <div className="h-80 animate-pulse bg-[#12192e]" />
      </PhoneShell>
    );
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
    <PhoneShell tab="jogos" onTabChange={(tab) => router.push(`/dashboard/gepeto?tab=${tab}`)}>
      <div className="min-w-0 space-y-4 p-4 md:p-8">
        <Link
          href="/dashboard/gepeto?tab=jogos"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#aeb4ca]"
        >
          <ArrowLeft className="size-4" />
          Todos os jogos
        </Link>

        <MatchHeader
          homeTeam={{
            name: match.homeTeamName,
            code: match.homeTeamCode || match.homeTeamName.slice(0, 3).toUpperCase(),
            flag: match.homeTeamFlag,
          }}
          awayTeam={{
            name: match.awayTeamName,
            code: match.awayTeamCode || match.awayTeamName.slice(0, 3).toUpperCase(),
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
          className="rounded-2xl border border-[#444b65] bg-[#12192e] text-[#dfe5ff]"
        />

        {hasResult && userExactScore && gepetoExactScore ? (
          <VerdictBanner
            userPrediction={userExactScore}
            gepetoPrediction={gepetoExactScore}
            actualResult={{ home: match.homeScore ?? 0, away: match.awayScore ?? 0 }}
          />
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 md:items-start">
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
        </div>

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
          <PhoneCard className={cn("p-5", result.outcome === "win" && "border-[#4ff325]/60")}>
            <div className="flex items-center gap-3">
              <Trophy className="size-6 text-[#ffc965]" />
              <div>
                <div className="font-display text-xl font-bold">
                  {result.outcome === "win"
                    ? "Badge conquistado"
                    : result.outcome === "tie"
                      ? "Empate técnico"
                      : "Gepeto levou essa"}
                </div>
                <div className="text-sm text-[#aeb4ca]">
                  {userPrediction?.hasBadge
                    ? "Seu distintivo já está registrado."
                    : "O resultado entra após o placar final."}
                </div>
              </div>
            </div>
          </PhoneCard>
        ) : null}
      </div>
    </PhoneShell>
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
