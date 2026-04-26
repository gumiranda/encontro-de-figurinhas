"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { toast } from "sonner";
import styles from "./chato.module.css";

type ReasonKey =
  | "sem_chances"
  | "jogo_truncado"
  | "sem_estrelas"
  | "placar_morno"
  | "narrador_dormindo"
  | "meme_potencial";

const REASONS: Array<{ key: ReasonKey; label: string; emoji: string }> = [
  { key: "sem_chances", label: "Sem chances de gol", emoji: "🥱" },
  { key: "jogo_truncado", label: "Jogo truncado", emoji: "🪦" },
  { key: "sem_estrelas", label: "Sem craques", emoji: "⭐" },
  { key: "placar_morno", label: "Placar morno", emoji: "💤" },
  { key: "narrador_dormindo", label: "Narrador dormiu", emoji: "🎙️" },
  { key: "meme_potencial", label: "Potencial de meme", emoji: "😂" },
];

const INTENT_KEY = "boringVoteIntent";

function getHttpUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!base) return null;
  return base.replace(".convex.cloud", ".convex.site");
}

type Props = {
  matchId: Id<"worldCupMatches">;
  matchSlug: string;
  initialReasons: ReasonKey[];
};

export function VoteCard({ matchId, matchSlug, initialReasons }: Props) {
  const [selected, setSelected] = useState<Set<ReasonKey>>(
    () => new Set(initialReasons),
  );
  const [submitting, setSubmitting] = useState(false);
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userVote = useQuery(api.boringGame.getUserVoteForMatch, { matchId });

  // Reconcile selected state with server source of truth pós-success
  useEffect(() => {
    if (userVote === undefined) return;
    if (userVote === null) return;
    setSelected(new Set(userVote.reasons as ReasonKey[]));
  }, [userVote]);

  const toggle = useCallback((key: ReasonKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const submit = useCallback(
    async (reasonsArr: ReasonKey[]) => {
      const url = getHttpUrl();
      if (!url) {
        toast.error("Configuração ausente — NEXT_PUBLIC_CONVEX_URL");
        return;
      }
      if (reasonsArr.length === 0) {
        toast.error("Escolha pelo menos um motivo");
        return;
      }
      setSubmitting(true);
      try {
        const token = await getToken({ template: "convex" });
        // credentials NÃO incluído: Convex está em *.convex.cloud (origem
        // distinta), cookies Clerk não atravessam. Auth real via Bearer.
        const res = await fetch(`${url}/api/boring-vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ matchId, reasons: reasonsArr }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 429) {
            toast.error("Muitos votos seguidos. Tente em alguns minutos.");
          } else if (res.status === 401) {
            toast.error("Faça login pra votar");
          } else if (res.status === 404) {
            toast.error("Jogo não encontrado");
          } else if (res.status >= 500) {
            toast.error("Erro do servidor. Tente novamente.");
          } else {
            toast.error(data?.error ?? "Erro ao votar");
          }
          return;
        }
        toast.success("Voto registrado!");
        router.refresh();
      } catch (err) {
        toast.error("Falha de rede");
      } finally {
        setSubmitting(false);
      }
    },
    [getToken, matchId, router],
  );

  // Pós-login: ler intent, auto-submit, limpar.
  // Guard adicional: esperar userVote carregar (undefined = pending) pra
  // não auto-submeter antes de saber se user já votou (race intent vs query).
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (userVote === undefined) return;
    const intent = searchParams.get("intent");
    if (intent !== "vote") return;
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(INTENT_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { matchSlug: string; reasons: ReasonKey[] };
      if (parsed.matchSlug === matchSlug && Array.isArray(parsed.reasons)) {
        setSelected(new Set(parsed.reasons));
        submit(parsed.reasons);
      }
    } catch {
      // ignore
    } finally {
      window.sessionStorage.removeItem(INTENT_KEY);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("intent");
      router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
    }
  }, [
    isLoaded,
    isSignedIn,
    userVote,
    searchParams,
    matchSlug,
    pathname,
    router,
    submit,
  ]);

  const handleClick = useCallback(() => {
    const reasonsArr = Array.from(selected);
    submit(reasonsArr);
  }, [selected, submit]);

  const persistIntent = useCallback(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      INTENT_KEY,
      JSON.stringify({ matchSlug, reasons: Array.from(selected) }),
    );
  }, [matchSlug, selected]);

  const redirectUrl = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("intent", "vote");
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams]);

  return (
    <Card className="p-5">
      <div className="space-y-4">
        <div>
          <h3 id="reason-label" className={`${styles.ffDisplay} text-lg`}>
            Por que esse jogo foi chato?
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Marque um ou mais motivos.
          </p>
        </div>

        <div
          role="group"
          aria-labelledby="reason-label"
          className="flex flex-wrap gap-2"
        >
          {REASONS.map((r) => {
            const on = selected.has(r.key);
            return (
              <button
                key={r.key}
                type="button"
                aria-label={r.label}
                aria-pressed={on}
                onClick={() => toggle(r.key)}
                className={`${styles.reasonToggle} ${on ? styles.reasonToggleOn : ""}`}
              >
                <span aria-hidden="true">{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {!isLoaded ? (
          <Button
            type="button"
            disabled
            className={`${styles.btnMeme} w-full h-12`}
          >
            CARREGANDO...
          </Button>
        ) : isSignedIn ? (
          <Button
            type="button"
            onClick={handleClick}
            disabled={submitting || selected.size === 0}
            className={`${styles.btnMeme} w-full h-12`}
          >
            {submitting ? "ENVIANDO..." : "CONFIRMAR MEU VOTO 🥱"}
          </Button>
        ) : (
          <SignInButton mode="redirect" forceRedirectUrl={redirectUrl}>
            <Button
              type="button"
              onClick={persistIntent}
              disabled={selected.size === 0}
              className={`${styles.btnMeme} w-full h-12`}
            >
              ENTRAR PARA VOTAR 🥱
            </Button>
          </SignInButton>
        )}
      </div>
    </Card>
  );
}
