"use client";

import { cn } from "@workspace/ui/lib/utils";

export type GepetoMood = "neutral" | "thinking" | "happy" | "angry" | "smug";

interface GepetoAvatarProps {
  size?: number;
  mood?: GepetoMood;
  glow?: boolean;
  className?: string;
}

export function GepetoAvatar({
  size = 56,
  mood = "neutral",
  glow = true,
  className,
}: GepetoAvatarProps) {
  const eyeY = mood === "thinking" ? 14 : 13;
  const eyeShape = mood === "happy" ? "happy" : mood === "angry" ? "angry" : "round";

  const glowColor =
    mood === "angry"
      ? "rgba(255,110,132,0.4)"
      : mood === "happy"
        ? "rgba(79,243,37,0.4)"
        : "rgba(149,170,255,0.35)";

  const gradientId = `g-body-${size}-${mood}`;
  const screenGradientId = `g-screen-${size}-${mood}`;

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute -z-10 blur-md"
          style={{
            inset: -size * 0.15,
            background: `radial-gradient(circle, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e253b" />
            <stop offset="100%" stopColor="#0d1323" />
          </linearGradient>
          <linearGradient id={screenGradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a2547" />
            <stop offset="100%" stopColor="#0d1323" />
          </linearGradient>
        </defs>

        {/* Antenna */}
        <line x1="16" y1="3" x2="16" y2="6" stroke="#a6aabf" strokeWidth="0.6" />
        <circle cx="16" cy="2.6" r="1.2" className="fill-emerald-400">
          {mood === "thinking" && (
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Body */}
        <rect
          x="5"
          y="6"
          width="22"
          height="20"
          rx="4"
          fill={`url(#${gradientId})`}
          className="stroke-primary"
          strokeWidth="0.7"
        />

        {/* Screen */}
        <rect
          x="7.5"
          y="9.5"
          width="17"
          height="11"
          rx="2.5"
          fill={`url(#${screenGradientId})`}
          stroke="#3d4663"
          strokeWidth="0.4"
        />

        {/* Eyes */}
        {eyeShape === "round" && (
          <>
            <circle cx="12.5" cy={eyeY} r="1.4" className="fill-primary" />
            <circle cx="19.5" cy={eyeY} r="1.4" className="fill-primary" />
          </>
        )}
        {eyeShape === "happy" && (
          <>
            <path
              d={`M11 ${eyeY} q1.5 -1.6 3 0`}
              className="stroke-emerald-400"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M18 ${eyeY} q1.5 -1.6 3 0`}
              className="stroke-emerald-400"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        {eyeShape === "angry" && (
          <>
            <path
              d="M11 12.5 l3 1.5"
              className="stroke-red-400"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M21 12.5 l-3 1.5"
              className="stroke-red-400"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="12.5" cy="14" r="1" className="fill-red-400" />
            <circle cx="19.5" cy="14" r="1" className="fill-red-400" />
          </>
        )}

        {/* Mouth */}
        {mood === "happy" && (
          <path
            d="M13 17.5 q3 2 6 0"
            className="stroke-emerald-400"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === "angry" && (
          <path
            d="M13 18 q3 -1.5 6 0"
            className="stroke-red-400"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === "smug" && (
          <path
            d="M13 17.5 q3 1 6 -0.5"
            className="stroke-amber-400"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {(mood === "neutral" || mood === "thinking") && (
          <line
            x1="13"
            y1="17.5"
            x2="19"
            y2="17.5"
            stroke="#6b7280"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        )}

        {/* Status LED */}
        <circle
          cx="16"
          cy="23"
          r="0.8"
          className={cn(
            mood === "angry"
              ? "fill-red-400"
              : mood === "happy"
                ? "fill-emerald-400"
                : "fill-primary"
          )}
        >
          {mood === "thinking" && (
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Ears/vents */}
        <rect x="3.5" y="12" width="1.5" height="6" rx="0.5" fill="#3d4663" />
        <rect x="27" y="12" width="1.5" height="6" rx="0.5" fill="#3d4663" />

        {/* Cap visor */}
        <path
          d="M4 9 L28 9 L28 7.5 Q16 5.5 4 7.5 Z"
          className={cn(
            mood === "angry" ? "fill-red-400" : "fill-primary/60"
          )}
          opacity="0.75"
        />
      </svg>
    </div>
  );
}
