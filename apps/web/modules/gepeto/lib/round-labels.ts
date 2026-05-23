const PHASE_LABELS: Record<string, string> = {
  groups: "Fase de grupos",
  round_of_32: "16-avos de final",
  round_of_16: "Oitavas de final",
  quarter_finals: "Quartas de final",
  semi_finals: "Semifinais",
  third_place: "Disputa de 3º lugar",
  final: "Final",
};

export const PHASE_ORDER = [
  "groups",
  "round_of_32",
  "round_of_16",
  "quarter_finals",
  "semi_finals",
  "third_place",
  "final",
] as const;

export function formatPhaseLabel(phase: string) {
  if (PHASE_LABELS[phase]) return PHASE_LABELS[phase];
  return phase
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type RoundLike = {
  phase: string;
  name: string;
  slug: string;
};

export function formatRoundSectionLabel(round: RoundLike) {
  if (round.phase === "groups") {
    const fromName = round.name.match(/rodada\s+\d+/i);
    if (fromName) {
      return fromName[0].replace(/^rodada/i, "Rodada");
    }
    const fromSlug = round.slug.match(/rodada-(\d+)/i);
    if (fromSlug) {
      return `Rodada ${fromSlug[1]}`;
    }
  }
  return round.name;
}
