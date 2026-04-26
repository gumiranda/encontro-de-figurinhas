import Link from "next/link";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import styles from "./chato.module.css";

type MatchCardProps = {
  href: string;
  homeTeamFlag: string;
  homeTeamName: string;
  homeTeamCode: string;
  awayTeamFlag: string;
  awayTeamName: string;
  awayTeamCode: string;
  totalVotes: number;
  roundTotalVotes: number;
  highlighted?: boolean;
  rank?: number;
};

export function MatchCard({
  href,
  homeTeamFlag,
  homeTeamName,
  homeTeamCode,
  awayTeamFlag,
  awayTeamName,
  awayTeamCode,
  totalVotes,
  roundTotalVotes,
  highlighted,
  rank,
}: MatchCardProps) {
  const pct = roundTotalVotes > 0 ? Math.round((totalVotes / roundTotalVotes) * 100) : 0;

  return (
    <Link href={href} className="block">
      <Card
        className={`p-4 transition-colors hover:bg-white/[0.04] ${highlighted ? styles.cardSelected : ""}`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-3">
            {rank ? (
              <Badge variant="secondary" className="font-mono">
                {rank}
              </Badge>
            ) : null}
            <div className={styles.flag} aria-hidden="true">
              {homeTeamFlag}
            </div>
            <div>
              <div className="font-semibold text-sm">{homeTeamName}</div>
              <div className="text-xs text-muted-foreground">{homeTeamCode}</div>
            </div>
          </div>
          <div className={styles.matchScore}>×</div>
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className={styles.flag} aria-hidden="true">
              {awayTeamFlag}
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm">{awayTeamName}</div>
              <div className="text-xs text-muted-foreground">{awayTeamCode}</div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{totalVotes.toLocaleString("pt-BR")} votos</span>
          <div className={styles.barTrack + " flex-1 max-w-[140px]"}>
            <div className={styles.barFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={`${styles.ffDisplay} text-base ${highlighted ? styles.heroAccent : ""}`}>
            {pct}%
          </span>
        </div>
      </Card>
    </Link>
  );
}
