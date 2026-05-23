// Components
export { GepetoAvatar } from "./ui/components/gepeto-avatar";
export type { GepetoMood } from "./ui/components/gepeto-avatar";
export { AICard } from "./ui/components/ai-card";
export { AIBadge } from "./ui/components/ai-badge";
export { ConfidenceMeter } from "./ui/components/confidence-meter";
export { ReasoningCard } from "./ui/components/reasoning-card";
export { PredictionForm } from "./ui/components/prediction-form";

// Match experience components
export { VerdictBanner } from "./ui/components/verdict-banner";
export { CommunityBar } from "./ui/components/community-bar";
export { StreakStrip } from "./ui/components/streak-strip";

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
