// Components
export { GepetoAvatar } from "./ui/components/gepeto-avatar";
export type { GepetoMood } from "./ui/components/gepeto-avatar";
export { AICard } from "./ui/components/ai-card";
export { AIBadge } from "./ui/components/ai-badge";
export { ConfidenceMeter } from "./ui/components/confidence-meter";
export { ReasoningCard } from "./ui/components/reasoning-card";
export { PredictionForm } from "./ui/components/prediction-form";
export { ScoreStepper } from "./ui/components/score-stepper";
export { GepetoPredictionPanel } from "./ui/components/gepeto-prediction-panel";

// Match experience components
export { VerdictBanner } from "./ui/components/verdict-banner";
export { CommunityBar } from "./ui/components/community-bar";
export { StreakStrip } from "./ui/components/streak-strip";
export { MatchHeader } from "./ui/components/match-header";
export { WeeklyNarrative } from "./ui/components/weekly-narrative";

// Hub components
export { GepetoHubHeader } from "./ui/components/gepeto-hub-header";
export { NextMatchCard } from "./ui/components/next-match-card";
export { PoolsPreview } from "./ui/components/pools-preview";
export { WeeklyPreview } from "./ui/components/weekly-preview";

// Landing page components
export { CountUp } from "./ui/components/count-up";
export { HeroBoard } from "./ui/components/hero-board";
export { StatStrip } from "./ui/components/stat-strip";
export { PhoneMock } from "./ui/components/phone-mock";
export { HowItWorks } from "./ui/components/how-it-works";
export { TrashCarousel } from "./ui/components/trash-carousel";
export { FeaturesGrid } from "./ui/components/features-grid";
export { FinalCTA } from "./ui/components/final-cta";

// Dashboard views
export {
  GepetoDashboardView,
  GepetoInviteJoinView,
  GepetoMatchDashboardView,
  GepetoPoolDetailView,
} from "./ui/views/gepeto-dashboard-view";

// Hooks
export {
  useGepetoPrediction,
  useUserPrediction,
  useLeaderboard,
  useWeeklyNarrative,
} from "./hooks/use-gepeto-prediction";
export { useMatchDetail, useUserStats } from "./hooks/use-match-detail";
