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
  Bot,
  CalendarDays,
  ChevronRight,
  Clipboard,
  Crown,
  Flame,
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
  ConfidenceMeter,
  GepetoAvatar,
  PredictionForm,
  ReasoningCard,
  StreakStrip,
  VerdictBanner,
} from "@/modules/gepeto";

type Choice = "home" | "draw" | "away";
type TabKey = "hub" | "jogos" | "boloes" | "capitulo" | "ranking";
type DashboardHub = FunctionReturnType<typeof api.gepeto.getDashboardHub>;

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

  const { match, aiPrediction, userPrediction, community, result } = data;
  const total = Math.max(community.total, 1);
  const isFinished = match.status === "finished" && match.homeScore !== undefined && match.awayScore !== undefined;
  const userExactScore = userPrediction?.exactScore ?? null;
  const gepetoExactScore = aiPrediction?.exactScore ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard/gepeto?tab=jogos">Voltar aos jogos</Link>
        </Button>
        <Badge variant="secondary" className="rounded-full">
          {matchState(match)}
        </Badge>
      </div>

      <section className="rounded-xl border border-border bg-card p-5 md:p-7">
        <MatchScore match={match} />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {dateFormatter.format(match.kickoffAt)} {match.venue ? `· ${match.venue}` : ""}
        </div>
      </section>

      {isFinished && userExactScore && gepetoExactScore ? (
        <VerdictBanner
          userPrediction={userExactScore}
          gepetoPrediction={gepetoExactScore}
          actualResult={{ home: match.homeScore ?? 0, away: match.awayScore ?? 0 }}
        />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <PredictionForm
            matchId={match._id}
            homeTeam={match.homeTeamName}
            awayTeam={match.awayTeamName}
            kickoffAt={match.kickoffAt}
            existingPrediction={
              userPrediction?.prediction
                ? {
                    prediction: userPrediction.prediction,
                    exactScore: userPrediction.exactScore,
                  }
                : undefined
            }
          />
          <CommunityBar
            homeFlag={match.homeTeamFlag}
            awayFlag={match.awayTeamFlag}
            homePercent={toPercent(community.counts.home, total)}
            drawPercent={toPercent(community.counts.draw, total)}
            awayPercent={toPercent(community.counts.away, total)}
            totalPredictions={community.total}
          />
        </div>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <GepetoAvatar size={64} mood={aiPrediction?.prediction ? "smug" : "thinking"} />
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Palpite do Gepeto
                </p>
                <h2 className="font-display text-2xl font-black">
                  {aiPrediction?.prediction ? choiceLabel(match, aiPrediction.prediction) : "Lacrado até começar"}
                </h2>
              </div>
            </div>
            {aiPrediction?.confidence ? (
              <div className="mt-5">
                <ConfidenceMeter value={aiPrediction.confidence} />
              </div>
            ) : null}
            {aiPrediction?.reasoning?.length ? (
              <div className="mt-5">
                <ReasoningCard reasoning={aiPrediction.reasoning} />
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">
                Gepeto já decidiu, mas o placar fica escondido até o jogo abrir.
              </p>
            )}
          </Card>
          <Card className={cn("p-5", result?.outcome === "win" && "border-emerald-400/60 bg-emerald-400/5")}>
            <div className="flex items-center gap-3">
              <Trophy className="size-6 text-primary" />
              <div>
                <div className="font-display text-xl font-bold">
                  {result?.outcome === "win"
                    ? "Badge conquistado"
                    : result?.outcome === "tie"
                      ? "Empate técnico"
                      : result
                        ? "Gepeto levou essa"
                        : "Aguardando veredito"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {userPrediction?.hasBadge ? "Seu distintivo já está registrado." : "O resultado entra após o placar final."}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
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
