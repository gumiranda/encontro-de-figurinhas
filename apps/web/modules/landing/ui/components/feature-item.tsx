import { Shield, Map, Zap } from "lucide-react";

const ICON_MAP = {
  shield: Shield,
  map: Map,
  zap: Zap,
} as const;

interface FeatureItemProps {
  icon: keyof typeof ICON_MAP;
  title: string;
  description: string;
  colorClass: string;
}

export function FeatureItem({ icon, title, description, colorClass }: FeatureItemProps) {
  const Icon = ICON_MAP[icon];

  return (
    <div className="flex gap-4 items-start">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <div>
        <h4 className="font-[var(--font-headline)] font-bold text-xl mb-1 text-[var(--landing-on-surface)]">
          {title}
        </h4>
        <p className="text-[var(--landing-on-surface-variant)] text-sm font-[var(--font-body)]">
          {description}
        </p>
      </div>
    </div>
  );
}
