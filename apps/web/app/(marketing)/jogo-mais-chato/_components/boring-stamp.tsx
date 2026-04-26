import styles from "./chato.module.css";

type BoringStampProps = {
  pct: number;
  label?: string;
  sub?: string;
};

export function BoringStamp({
  pct,
  label = "Oficialmente Chato",
  sub = "Eleito pela torcida",
}: BoringStampProps) {
  return (
    <div className={styles.certStamp} aria-label={`${pct}% ${label}`}>
      <div>
        <div className={styles.certPct}>{pct}%</div>
        <div className={styles.certLabel}>{label}</div>
        <div className={styles.certSub}>{sub}</div>
      </div>
    </div>
  );
}
