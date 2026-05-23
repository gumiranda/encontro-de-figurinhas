/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */
const { useState, useMemo, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  matchState: "preMatch",
  voiceStyle: "bravo",
  showStreak: true,
}; /*EDITMODE-END*/

/* ---------- Inline icons ---------- */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "back":
      return (
        <svg {...c}>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      );
    case "lock":
      return (
        <svg {...c}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "unlock":
      return (
        <svg {...c}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      );
    case "share":
      return (
        <svg {...c}>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...c}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "flame":
      return (
        <svg {...c} fill="currentColor" stroke="none">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...c} fill="currentColor" stroke="none">
          <path d="M12 3l1.9 5.5L19 10l-5.1 1.5L12 17l-1.9-5.5L5 10l5.1-1.5L12 3z" />
        </svg>
      );
    case "check":
      return (
        <svg {...c}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "x":
      return (
        <svg {...c}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg {...c}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );
    case "chevronLeft":
      return (
        <svg {...c}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );
    case "pin":
      return (
        <svg {...c}>
          <path d="M12 22s-8-7.58-8-13a8 8 0 0 1 16 0c0 5.42-8 13-8 13z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...c}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "users":
      return (
        <svg {...c}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "lightning":
      return (
        <svg {...c} fill="currentColor" stroke="none">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "ai":
      return (
        <svg {...c}>
          <path d="M12 8V4H8" />
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <circle cx="9" cy="14" r="1" fill="currentColor" />
          <circle cx="15" cy="14" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

/* ---------- Gepeto avatar (SVG character) ---------- */
function GepetoAvatar({ size = 56, mood = "neutral", glow = true }) {
  // moods: neutral, happy, angry, smug, thinking
  const eyeY = mood === "thinking" ? 14 : 13;
  const eyeShape = mood === "happy" ? "happy" : mood === "angry" ? "angry" : "round";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {glow && (
        <div
          style={{
            position: "absolute",
            inset: -size * 0.15,
            background: `radial-gradient(circle, ${mood === "angry" ? "rgba(255,110,132,0.4)" : mood === "happy" ? "rgba(79,243,37,0.4)" : "rgba(149,170,255,0.35)"}, transparent 70%)`,
            filter: "blur(6px)",
            zIndex: -1,
          }}
        />
      )}
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={`g-body-${size}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e253b" />
            <stop offset="100%" stopColor="#0d1323" />
          </linearGradient>
          <linearGradient id={`g-screen-${size}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a2547" />
            <stop offset="100%" stopColor="#0d1323" />
          </linearGradient>
        </defs>
        {/* antenna */}
        <line x1="16" y1="3" x2="16" y2="6" stroke="#a6aabf" strokeWidth="0.6" />
        <circle cx="16" cy="2.6" r="1.2" fill="var(--secondary)" />
        {/* head */}
        <rect
          x="5"
          y="6"
          width="22"
          height="20"
          rx="4"
          fill={`url(#g-body-${size})`}
          stroke="var(--primary)"
          strokeWidth="0.7"
        />
        {/* screen face */}
        <rect
          x="7.5"
          y="9.5"
          width="17"
          height="11"
          rx="2.5"
          fill={`url(#g-screen-${size})`}
          stroke="var(--outline-variant)"
          strokeWidth="0.4"
        />
        {/* eyes */}
        {eyeShape === "round" && (
          <>
            <circle cx="12.5" cy={eyeY} r="1.4" fill="var(--primary)" />
            <circle cx="19.5" cy={eyeY} r="1.4" fill="var(--primary)" />
          </>
        )}
        {eyeShape === "happy" && (
          <>
            <path
              d={`M11 ${eyeY} q1.5 -1.6 3 0`}
              stroke="var(--secondary)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M18 ${eyeY} q1.5 -1.6 3 0`}
              stroke="var(--secondary)"
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
              stroke="var(--error)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M21 12.5 l-3 1.5"
              stroke="var(--error)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle cx="12.5" cy="14" r="1" fill="var(--error)" />
            <circle cx="19.5" cy="14" r="1" fill="var(--error)" />
          </>
        )}
        {/* mouth */}
        {mood === "happy" && (
          <path
            d="M13 17.5 q3 2 6 0"
            stroke="var(--secondary)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === "angry" && (
          <path
            d="M13 18 q3 -1.5 6 0"
            stroke="var(--error)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === "smug" && (
          <path
            d="M13 17.5 q3 1 6 -0.5"
            stroke="var(--tertiary)"
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
            stroke="var(--muted)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        )}
        {/* status LED */}
        <circle
          cx="16"
          cy="23"
          r="0.8"
          fill={
            mood === "angry"
              ? "var(--error)"
              : mood === "happy"
                ? "var(--secondary)"
                : "var(--primary)"
          }
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
        {/* "ears" / vents */}
        <rect
          x="3.5"
          y="12"
          width="1.5"
          height="6"
          rx="0.5"
          fill="var(--outline-variant)"
        />
        <rect
          x="27"
          y="12"
          width="1.5"
          height="6"
          rx="0.5"
          fill="var(--outline-variant)"
        />
        {/* CR7-style cap visor for vibe */}
        <path
          d="M4 9 L28 9 L28 7.5 Q16 5.5 4 7.5 Z"
          fill={mood === "angry" ? "var(--error)" : "var(--primary-dim)"}
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

/* ---------- Match data ---------- */
const MATCH = {
  id: "BRA-ARG-20260701",
  home: { name: "Brasil", flag: "🇧🇷", code: "BRA", color: "#1ec45a" },
  away: { name: "Argentina", flag: "🇦🇷", code: "ARG", color: "#7ab8e0" },
  date: "Qua, 01 jul · 21:00",
  phase: "Quartas de final",
  stadium: "MetLife Stadium",
  community: { home: 47, draw: 28, away: 25 }, // % of community predictions
  gepeto: {
    score: "2-1",
    homeGoals: 2,
    awayGoals: 1,
    confidence: 78,
    mood: "smug",
    voice: "Já vi esse filme. Brasil ganha de 2-1 e Vini bate o pênalti aos 89.",
    insights: [
      { text: "Brasil últimos 5: 4V-1E (80% aprovamento)", weight: "strong" },
      { text: "Argentina fora de casa marca 1.1 gols/jogo", weight: "med" },
      { text: "Vinicius Jr. 0,73 gols por jogo · Otamendi titular", weight: "strong" },
      { text: "Histórico em quartas: Brasil 6V-2D contra Argentina", weight: "med" },
    ],
  },
};

const USER_PREDICTION = { home: 2, away: 2 }; // mock
const MATCH_RESULT = { home: 2, away: 1 }; // mock final result

/* ---------- Match meta strip ---------- */
function MatchHeader({ match, state, timeToKickoff = "3h 12min" }) {
  const isLive = state === "live";
  const isFinished = state === "postMatch";
  return (
    <div
      style={{
        padding: "16px 16px 12px",
        background: "linear-gradient(180deg, rgba(149,170,255,0.08), transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 8,
          fontFamily: "var(--mono)",
          fontSize: 10,
          color: "var(--muted)",
          letterSpacing: "0.12em",
          flexWrap: "wrap",
        }}
      >
        <span style={{ whiteSpace: "nowrap" }}>{match.phase.toUpperCase()}</span>
        <span
          style={{
            width: 3,
            height: 3,
            borderRadius: 99,
            background: "var(--outline-variant)",
          }}
        />
        <span style={{ whiteSpace: "nowrap" }}>
          {isLive ? "AO VIVO" : isFinished ? "ENCERRADO" : match.date.toUpperCase()}
        </span>
        {isLive && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>{match.home.flag}</div>
          <div
            className="h-display"
            style={{ fontSize: 15, marginTop: 6, color: match.home.color }}
          >
            {match.home.code}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{match.home.name}</div>
        </div>
        <div style={{ textAlign: "center", padding: "0 4px", whiteSpace: "nowrap" }}>
          {isFinished ? (
            <div
              className="h-display num-mono"
              style={{ fontSize: 36, letterSpacing: "0.05em" }}
            >
              {MATCH_RESULT.home}
              <span style={{ color: "var(--muted)", margin: "0 4px" }}>·</span>
              {MATCH_RESULT.away}
            </div>
          ) : isLive ? (
            <>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                }}
              >
                1º TEMPO
              </div>
              <div className="h-display" style={{ fontSize: 22, marginTop: 2 }}>
                32'
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--muted)",
                  letterSpacing: "0.1em",
                }}
              >
                COMEÇA EM
              </div>
              <div className="h-display" style={{ fontSize: 20, marginTop: 2 }}>
                {timeToKickoff}
              </div>
            </>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44, lineHeight: 1 }}>{match.away.flag}</div>
          <div
            className="h-display"
            style={{ fontSize: 15, marginTop: 6, color: match.away.color }}
          >
            {match.away.code}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{match.away.name}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 12,
          fontSize: 11,
          color: "var(--muted)",
        }}
      >
        <Icon name="pin" size={11} /> {match.stadium}
      </div>
    </div>
  );
}

/* ---------- User palpite control ---------- */
function ScorePicker({ value, onChange, locked, color }) {
  const inc = () => onChange(Math.min(9, value + 1));
  const dec = () => onChange(Math.max(0, value - 1));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <button
        onClick={inc}
        disabled={locked}
        style={{
          width: 44,
          height: 28,
          padding: 0,
          background: "transparent",
          color: locked ? "var(--outline-variant)" : "var(--muted)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 8,
          cursor: locked ? "default" : "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <div
        className="h-display num-mono"
        style={{
          fontSize: 56,
          lineHeight: 1,
          color,
          letterSpacing: "-0.04em",
          minWidth: 60,
          textAlign: "center",
        }}
      >
        {value}
      </div>
      <button
        onClick={dec}
        disabled={locked}
        style={{
          width: 44,
          height: 28,
          padding: 0,
          background: "transparent",
          color: locked ? "var(--outline-variant)" : "var(--muted)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 8,
          cursor: locked ? "default" : "pointer",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

function YourPalpite({ match, state, palpite, setPalpite, onConfirm, confirmed }) {
  const isLocked = state !== "preMatch" || confirmed;
  return (
    <div
      className="raised"
      style={{
        padding: "16px 14px",
        marginBottom: 14,
        background: confirmed
          ? "linear-gradient(180deg, rgba(149,170,255,0.08), var(--container))"
          : "var(--container)",
        border: `1px solid ${confirmed ? "var(--primary)" : "var(--outline-variant)"}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          className="h-display"
          style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Icon name="users" size={13} color="var(--primary)" /> Seu palpite
        </div>
        {confirmed && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              borderRadius: 6,
              background: "rgba(149,170,255,0.15)",
              color: "var(--primary)",
              fontFamily: "var(--headline)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            <Icon name="check" size={10} /> ENVIADO
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ScorePicker
          value={palpite.home}
          onChange={(v) => setPalpite({ ...palpite, home: v })}
          locked={isLocked}
          color="var(--primary)"
        />
        <div className="h-display" style={{ fontSize: 28, color: "var(--muted)" }}>
          ×
        </div>
        <ScorePicker
          value={palpite.away}
          onChange={(v) => setPalpite({ ...palpite, away: v })}
          locked={isLocked}
          color="var(--primary)"
        />
      </div>

      {!confirmed && state === "preMatch" && (
        <button
          onClick={onConfirm}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 14 }}
        >
          <Icon name="lock" size={14} /> Confirmar e enfrentar o Gepeto
        </button>
      )}
    </div>
  );
}

/* ---------- Gepeto card (the centerpiece) ---------- */
function ConfidenceBar({ value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 99,
          background: "rgba(149,170,255,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--primary), var(--tertiary))",
            transition: "width 0.5s",
          }}
        />
      </div>
      <span className="num-mono" style={{ fontSize: 12, color: "var(--tertiary)" }}>
        {value}%
      </span>
    </div>
  );
}

function GepetoCard({ match, state, userConfirmed }) {
  const sealed = state === "preMatch" && !userConfirmed;
  const peekable = state === "preMatch" && userConfirmed; // can see Gepeto's pick but not full analysis
  const revealed = state === "live" || state === "postMatch";
  const g = match.gepeto;
  const mood =
    state === "postMatch"
      ? gepetoCorrect(g)
        ? "smug"
        : "angry"
      : sealed
        ? "thinking"
        : "neutral";

  return (
    <div
      className="tcard fade-up"
      style={{
        padding: 0,
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="tcard-bg"
        style={{
          background: sealed
            ? "linear-gradient(160deg, #0f1428 0%, #0a0e1c 100%)"
            : "linear-gradient(160deg, #1a2547 0%, #13192b 60%, #0d1323 100%)",
        }}
      />
      <div className="tcard-grid" />

      {/* Header */}
      <div
        style={{
          padding: "14px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <GepetoAvatar size={48} mood={mood} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
          >
            <span className="h-display" style={{ fontSize: 16, color: "var(--fg)" }}>
              Gepeto
            </span>
            <span
              style={{
                padding: "1px 6px",
                borderRadius: 4,
                background: "rgba(255,201,101,0.15)",
                color: "var(--tertiary)",
                fontFamily: "var(--headline)",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              IA
            </span>
            <span
              style={{
                padding: "1px 6px",
                borderRadius: 4,
                background: "rgba(149,170,255,0.12)",
                color: "var(--primary)",
                fontFamily: "var(--headline)",
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.15em",
              }}
            >
              NV 7
            </span>
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              marginTop: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            <Icon name="flame" size={10} color="var(--tertiary)" />
            <span>74% acertos · 38 partidas</span>
          </div>
        </div>
        {!sealed && (
          <div
            style={{
              textAlign: "right",
              flexShrink: 0,
              paddingLeft: 8,
            }}
          >
            <div
              className="num-mono"
              style={{
                fontSize: 22,
                lineHeight: 1,
                fontWeight: 700,
                color: "var(--tertiary)",
              }}
            >
              {g.confidence}%
            </div>
            <div className="label-mono" style={{ fontSize: 8, marginTop: 2 }}>
              CONFIANÇA
            </div>
          </div>
        )}
        {revealed && (
          <div
            style={{
              padding: "4px 8px",
              borderRadius: 6,
              background: gepetoCorrect(g)
                ? "rgba(79,243,37,0.15)"
                : "rgba(255,110,132,0.15)",
              color: gepetoCorrect(g) ? "var(--secondary)" : "var(--error)",
              fontFamily: "var(--headline)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
            }}
          >
            {gepetoCorrect(g) ? (
              <>
                <Icon name="check" size={10} /> ACERTOU
              </>
            ) : (
              <>
                <Icon name="x" size={10} /> ERROU
              </>
            )}
          </div>
        )}
      </div>

      {/* The pick */}
      <div style={{ padding: "14px 16px 0", position: "relative" }}>
        {sealed ? (
          <SealedPick onSeal={() => {}} />
        ) : (
          <>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                letterSpacing: "0.15em",
                marginBottom: 6,
              }}
            >
              PALPITE OFICIAL
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                background: "rgba(9,14,28,0.55)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 14,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  className="h-display num-mono"
                  style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: "var(--tertiary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {g.homeGoals}
                </div>
                <div className="label-mono" style={{ fontSize: 8, marginTop: 4 }}>
                  {match.home.code}
                </div>
              </div>
              <div className="h-display" style={{ fontSize: 22, color: "var(--muted)" }}>
                ×
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  className="h-display num-mono"
                  style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: "var(--tertiary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {g.awayGoals}
                </div>
                <div className="label-mono" style={{ fontSize: 8, marginTop: 4 }}>
                  {match.away.code}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span className="label-mono" style={{ fontSize: 9 }}>
                  NÍVEL DE CONFIANÇA
                </span>
                <span
                  className="label-mono"
                  style={{
                    fontSize: 9,
                    color: g.confidence >= 75 ? "var(--tertiary)" : "var(--primary)",
                  }}
                >
                  {g.confidence >= 80
                    ? "ALTÍSSIMA"
                    : g.confidence >= 65
                      ? "ALTA"
                      : g.confidence >= 50
                        ? "MÉDIA"
                        : "BAIXA"}
                </span>
              </div>
              <ConfidenceBar value={g.confidence} />
            </div>
          </>
        )}
      </div>

      {/* Voice (trash talk quote) */}
      {!sealed && (
        <div
          style={{
            margin: "14px 16px 0",
            padding: "10px 12px",
            background: "rgba(255,201,101,0.06)",
            border: "1px dashed rgba(255,201,101,0.35)",
            borderRadius: 12,
            position: "relative",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--headline)",
              fontSize: 26,
              lineHeight: 1,
              color: "var(--tertiary)",
              opacity: 0.5,
            }}
          >
            "
          </span>
          <div
            style={{
              flex: 1,
              fontSize: 13,
              lineHeight: 1.4,
              color: "var(--fg)",
              fontStyle: "italic",
            }}
          >
            {g.voice}
          </div>
        </div>
      )}

      {/* Insights — always visible when not sealed (peek shows blurred limited; revealed shows all) */}
      {!sealed && (
        <div style={{ padding: "14px 16px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div className="label-mono" style={{ fontSize: 9 }}>
              ANÁLISE TÉCNICA · {g.insights.length} fatores
            </div>
            {peekable && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: "var(--headline)",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--primary)",
                }}
              >
                <Icon name="lock" size={9} /> RESUMO
              </span>
            )}
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {g.insights.slice(0, peekable ? 2 : g.insights.length).map((i, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  padding: "8px 10px",
                  background: "rgba(9,14,28,0.45)",
                  border: "1px solid var(--outline-variant)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background:
                      i.weight === "strong"
                        ? "rgba(255,201,101,0.18)"
                        : "rgba(149,170,255,0.15)",
                    color: i.weight === "strong" ? "var(--tertiary)" : "var(--primary)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <Icon
                    name={i.weight === "strong" ? "lightning" : "sparkles"}
                    size={10}
                  />
                </div>
                <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.4 }}>
                  {i.text}
                </div>
              </div>
            ))}
            {peekable && g.insights.length > 2 && (
              <div
                style={{
                  padding: "8px 10px",
                  background:
                    "repeating-linear-gradient(45deg, rgba(149,170,255,0.04) 0, rgba(149,170,255,0.04) 8px, transparent 8px, transparent 16px)",
                  border: "1px dashed var(--outline-variant)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                <Icon name="lock" size={11} />
                <span>+{g.insights.length - 2} fatores abrem no apito inicial</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          margin: "14px 0 0",
          padding: "12px 16px",
          borderTop: "1px solid var(--outline-variant)",
          background: "rgba(9,14,28,0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            display: "inline-flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          <Icon name="clock" size={11} />
          {sealed
            ? "Palpite blindado até o apito"
            : peekable
              ? "Análise abre quando o juiz apitar"
              : "Liberado"}
        </div>
        <button
          style={{
            background: "transparent",
            border: 0,
            padding: 4,
            cursor: "pointer",
            color: "var(--muted)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <Icon name="share" size={12} /> compartilhar
        </button>
      </div>
    </div>
  );
}

/* ---------- Animated AIBadge — "Bati a IA" ---------- */
function AIBadge({ visible, text = "Você bateu a IA nessa!" }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "relative",
        marginBottom: 14,
        padding: "14px 16px",
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(120deg, #1a4023 0%, #2a6a3a 50%, #1a4023 100%)",
        backgroundSize: "200% 100%",
        animation: "badgeShine 2.5s ease-in-out infinite",
        border: "1px solid var(--secondary)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 10px 30px -8px rgba(79,243,37,0.25)",
      }}
    >
      <style>{`
        @keyframes badgeShine { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes badgeBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes pop { from { transform: scale(0.6); opacity: 0; } 50% { transform: scale(1.15); } to { transform: scale(1); opacity: 1; } }
      `}</style>
      {/* sparkle confetti */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 17 + 5) % 90}%`,
            top: `${(i * 23) % 80}%`,
            fontSize: 10 + (i % 3) * 3,
            opacity: 0.5,
            animation: `badgeBob ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
          }}
        >
          {["✨", "⚡", "🎉", "⭐", "🔥"][i % 5]}
        </span>
      ))}
      <div style={{ position: "relative", zIndex: 1, animation: "pop 0.5s ease-out" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--secondary)",
            color: "var(--on-secondary)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--headline)",
            fontSize: 22,
            fontWeight: 700,
            boxShadow: "0 0 0 3px rgba(79,243,37,0.35)",
          }}
        >
          🏆
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
        <div className="label-mono" style={{ fontSize: 9, color: "var(--secondary)" }}>
          BADGE DESBLOQUEADA
        </div>
        <div className="h-display" style={{ fontSize: 16, marginTop: 2 }}>
          {text}
        </div>
        <div style={{ fontSize: 11, color: "#bff5ad", marginTop: 2 }}>
          +10 pts · Streak 7🔥
        </div>
      </div>
    </div>
  );
}

function gepetoCorrect(g) {
  return g.homeGoals === MATCH_RESULT.home && g.awayGoals === MATCH_RESULT.away;
}

function SealedPick({ onSeal }) {
  return (
    <div
      style={{
        position: "relative",
        padding: "18px 14px",
        background: `repeating-linear-gradient(45deg, rgba(255,201,101,0.06) 0, rgba(255,201,101,0.06) 10px, transparent 10px, transparent 20px), var(--container-high)`,
        border: "1px dashed var(--tertiary)",
        borderRadius: 14,
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 99,
          background: "rgba(255,201,101,0.15)",
          color: "var(--tertiary)",
        }}
      >
        <Icon name="lock" size={13} />
        <span className="label-mono" style={{ fontSize: 10, color: "var(--tertiary)" }}>
          PALPITE LACRADO
        </span>
      </div>
      <div
        style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, lineHeight: 1.4 }}
      >
        Gepeto já gravou o palpite dele.
        <br />
        Mande o seu primeiro pra ver o que ele cravou.
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 9,
          color: "var(--outline)",
          marginTop: 10,
          letterSpacing: "0.08em",
        }}
      >
        Tá selado. vou brocar!
      </div>
    </div>
  );
}

/* ---------- Reveal: side-by-side comparison ---------- */
function VerdictBanner({ match, palpite }) {
  const userExact =
    palpite.home === MATCH_RESULT.home && palpite.away === MATCH_RESULT.away;
  const gepetoExact = gepetoCorrect(match.gepeto);
  const userWonner = !gepetoExact && userExact;
  // user got winner direction right
  const userWinner =
    palpite.home > palpite.away === MATCH_RESULT.home > MATCH_RESULT.away;
  const userPts = userExact ? 25 : userWinner ? 10 : 0;
  const gepetoPts = gepetoExact ? 25 : 10;
  const userWon = userPts > gepetoPts;

  return (
    <div
      className="tcard fade-up"
      style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}
    >
      <div
        className="tcard-bg"
        style={{
          background: userWon
            ? "linear-gradient(135deg, rgba(79,243,37,0.25), rgba(13,19,35,1) 70%)"
            : "linear-gradient(135deg, rgba(255,110,132,0.2), rgba(13,19,35,1) 70%)",
        }}
      />
      <div style={{ padding: "16px 16px 12px" }}>
        <div
          className="label-mono"
          style={{ color: userWon ? "var(--secondary)" : "var(--error)" }}
        >
          {userWon ? "🏆 VOCÊ BATEU A IA" : "GEPETO PASSOU"}
        </div>
        <div
          className="h-display"
          style={{
            fontSize: 22,
            marginTop: 4,
            color: userWon ? "var(--secondary)" : "var(--fg)",
          }}
        >
          {userWon
            ? "Mostrou pro robô como se palpita."
            : "Ele te pegou nessa, mas a volta tá engatilhada."}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          margin: "0 16px 14px",
          background: "rgba(9,14,28,0.5)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <ScoreSlice
          label="VOCÊ"
          who="user"
          home={palpite.home}
          away={palpite.away}
          exact={userExact}
          winner={userWinner}
          pts={userPts}
          isWinner={userWon}
        />
        <ScoreSlice
          label="GEPETO"
          who="gepeto"
          home={match.gepeto.homeGoals}
          away={match.gepeto.awayGoals}
          exact={gepetoExact}
          winner={true}
          pts={gepetoPts}
          isWinner={!userWon}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "0 14px 14px",
        }}
      >
        <button className="btn btn-secondary" style={{ flex: 1 }}>
          <Icon name="share" size={14} /> {userWon ? "Postar vitória" : "Postar revanche"}
        </button>
        <button className="btn btn-outline" style={{ paddingInline: 14 }}>
          <Icon name="chevronRight" size={14} />
        </button>
      </div>
    </div>
  );
}

function ScoreSlice({ label, who, home, away, exact, winner, pts, isWinner }) {
  return (
    <div
      style={{
        padding: "12px 10px",
        textAlign: "center",
        borderRight: who === "user" ? "1px solid var(--outline-variant)" : 0,
        background: isWinner ? "rgba(149,170,255,0.06)" : "transparent",
        position: "relative",
      }}
    >
      {who === "gepeto" ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <GepetoAvatar size={28} mood={isWinner ? "smug" : "angry"} glow={false} />
        </div>
      ) : (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 99,
            background: "var(--primary)",
            color: "var(--on-primary)",
            margin: "0 auto 4px",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--headline)",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          MI
        </div>
      )}
      <div className="label-mono" style={{ fontSize: 9 }}>
        {label}
      </div>
      <div
        className="h-display num-mono"
        style={{
          fontSize: 24,
          marginTop: 4,
          letterSpacing: "0.02em",
          color: isWinner ? "var(--secondary)" : "var(--fg)",
        }}
      >
        {home}-{away}
      </div>
      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>
        {exact ? "Cravou o placar" : winner ? "Acertou o vencedor" : "Errou"}
      </div>
      <div
        className="num-mono"
        style={{
          fontSize: 14,
          marginTop: 4,
          fontWeight: 700,
          color: isWinner ? "var(--secondary)" : "var(--muted)",
        }}
      >
        +{pts} pts
      </div>
    </div>
  );
}

/* ---------- Community bar ---------- */
function CommunityBar({ community, match }) {
  return (
    <div className="raised" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div className="h-display" style={{ fontSize: 13 }}>
          O que a galera acha
        </div>
        <span className="label-mono">12.4K PALPITES</span>
      </div>
      <div
        style={{
          display: "flex",
          height: 32,
          borderRadius: 10,
          overflow: "hidden",
          background: "var(--container-high)",
        }}
      >
        <div
          style={{
            width: `${community.home}%`,
            background: `linear-gradient(135deg, ${match.home.color}90, ${match.home.color}50)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 700,
            color: "white",
          }}
        >
          {match.home.flag} {community.home}%
        </div>
        <div
          style={{
            width: `${community.draw}%`,
            background: "var(--outline-variant)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--fg)",
          }}
        >
          ={community.draw}%
        </div>
        <div
          style={{
            width: `${community.away}%`,
            background: `linear-gradient(135deg, ${match.away.color}90, ${match.away.color}50)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            fontSize: 11,
            fontWeight: 700,
            color: "white",
          }}
        >
          {community.away}% {match.away.flag}
        </div>
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: "var(--muted)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <GepetoAvatar size={20} mood="neutral" glow={false} />
        Gepeto concorda com {community.home > 45 ? `${community.home}%` : "a minoria"} da
        galera nessa.
      </div>
    </div>
  );
}

/* ---------- Streak strip ---------- */
function StreakStrip() {
  const days = [
    { day: "Q", on: true, beat: true },
    { day: "Q", on: true, beat: false },
    { day: "S", on: true, beat: true },
    { day: "S", on: true, beat: true },
    { day: "D", on: true, beat: false },
    { day: "S", on: true, beat: true },
    { day: "T", on: false, beat: false, today: true },
  ];
  const streak = 6;
  return (
    <div className="raised fade-up" style={{ padding: 14, marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div
          className="h-display"
          style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <Icon name="flame" size={13} color="var(--tertiary)" /> Streak vs Gepeto
        </div>
        <div
          className="num-mono"
          style={{ color: "var(--tertiary)", fontSize: 14, fontWeight: 700 }}
        >
          {streak}🔥
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${days.length}, 1fr)`,
          gap: 5,
        }}
      >
        {days.map((d, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1/1.2",
              borderRadius: 8,
              background: d.today
                ? "transparent"
                : d.beat
                  ? "linear-gradient(160deg, rgba(79,243,37,0.25), rgba(255,201,101,0.18))"
                  : d.on
                    ? "var(--container-high)"
                    : "transparent",
              border: d.today
                ? "1px dashed var(--primary)"
                : d.beat
                  ? "1px solid var(--secondary)"
                  : "1px solid var(--outline-variant)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: d.today
                ? "var(--primary)"
                : d.beat
                  ? "var(--secondary)"
                  : "var(--muted)",
              fontWeight: 700,
            }}
          >
            <span>{d.day}</span>
            {d.beat && <Icon name="flame" size={11} color="var(--tertiary)" />}
            {!d.beat && d.on && <Icon name="x" size={10} color="var(--muted)" />}
            {d.today && <span style={{ fontSize: 7, letterSpacing: "0.1em" }}>HOJE</span>}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
        Palpita hoje pra manter sua sequência. Bata 7 e ganha o badge{" "}
        <b style={{ color: "var(--tertiary)" }}>Cassetete</b>.
      </div>
    </div>
  );
}

/* ---------- Weekly Narrative Screen ---------- */
const WEEKLY = {
  number: 3,
  phase: "Quartas de final",
  gepetoScore: 11,
  communityScore: 9,
  totalMatches: 16,
  voice:
    "Semana 3 e os humanos continuam tropeçando no meu raciocínio. Cravar Brasil 2-1 Argentina não é palpite, é matemática. Quem discorda, abre o Excel e me chama na DM. Próxima rodada eu vou pesado: Espanha-Inglaterra é cilada e eu já anotei.",
  highlights: [
    {
      matchup: "BRA × ARG",
      g: "2-1",
      real: "2-1",
      gepetoGot: true,
      communityGot: false,
      gepetoVoice: "Brasil em casa, Argentina sem Otamendi. Era 2-1 desde a escalação.",
      reasoning: [
        "Brasil 80% aproveitamento nos últimos 5 jogos",
        "Argentina marca 1.1 gols/jogo fora de casa",
        "Vini Jr. fez 4 gols nos últimos 3 contra ARG",
      ],
    },
    {
      matchup: "FRA × NED",
      g: "1-0",
      real: "0-1",
      gepetoGot: false,
      communityGot: true,
      gepetoVoice: "Subestimei Gakpo. Reconheço o erro. Na próxima eu acerto.",
      reasoning: [
        "Apostei na defesa francesa que estava 4 jogos sem sofrer",
        "Mas Gakpo fez 3 gols nos últimos 2 amistosos — minha base ignorou",
        "Mbappé jogou contundido (sub-estimei impacto disso)",
      ],
    },
    {
      matchup: "GER × MEX",
      g: "3-1",
      real: "3-1",
      gepetoGot: true,
      communityGot: false,
      gepetoVoice: "Goleada anunciada. Próximo.",
      reasoning: [
        "Alemanha média de 2.8 gols em casa",
        "México defesa = 28º pior dos 32",
        "Wirtz em fase: 6 gols em 7 jogos",
      ],
    },
    {
      matchup: "POR × URU",
      g: "1-1",
      real: "2-1",
      gepetoGot: false,
      communityGot: false,
      gepetoVoice: "Empate parecia o destino estatístico. Ronaldo decidiu outro destino.",
      reasoning: [
        "Histórico H2H: 4 empates nos últimos 6 jogos",
        "Ambos com 1.5 gols/jogo na fase de grupos",
        "Ignorei o efeito 'Ronaldo em mata-mata': 2 gols em 3",
      ],
    },
  ],
  topHumans: [
    { nick: "miltonfigueira", score: 14, isMe: true },
    { nick: "rafa_dias", score: 13 },
    { nick: "carol_m", score: 12 },
  ],
};

function HighlightRow({ h, expanded, onToggle }) {
  return (
    <div
      style={{
        background: "var(--container-high)",
        border: "1px solid var(--outline-variant)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto auto",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "10px 12px",
          background: "transparent",
          border: 0,
          cursor: "pointer",
          textAlign: "left",
          color: "var(--fg)",
        }}
      >
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600 }}>
          {h.matchup}
        </div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
          final <span style={{ color: "var(--fg)", fontWeight: 700 }}>{h.real}</span>
        </div>
        <div
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            background: h.gepetoGot ? "rgba(79,243,37,0.18)" : "rgba(255,110,132,0.15)",
            color: h.gepetoGot ? "var(--secondary)" : "var(--error)",
            fontFamily: "var(--mono)",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          G {h.g}
        </div>
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 99,
            background: h.communityGot
              ? "rgba(79,243,37,0.18)"
              : "rgba(255,110,132,0.15)",
            color: h.communityGot ? "var(--secondary)" : "var(--error)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={h.communityGot ? "check" : "x"} size={10} />
        </div>
        <span
          style={{
            transition: "transform 0.2s",
            transform: expanded ? "rotate(90deg)" : "rotate(0)",
            color: "var(--muted)",
            display: "inline-flex",
          }}
        >
          <Icon name="chevronRight" size={14} />
        </span>
      </button>
      {expanded && (
        <div
          style={{
            padding: "10px 12px 12px",
            borderTop: "1px solid var(--outline-variant)",
            background: "rgba(9,14,28,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 10,
              alignItems: "flex-start",
            }}
          >
            <GepetoAvatar size={28} mood={h.gepetoGot ? "smug" : "angry"} glow={false} />
            <div
              style={{
                flex: 1,
                fontSize: 12,
                color: "var(--fg)",
                lineHeight: 1.4,
                fontStyle: "italic",
              }}
            >
              “{h.gepetoVoice}”
            </div>
          </div>
          <div
            className="label-mono"
            style={{
              fontSize: 9,
              marginBottom: 6,
              color: h.gepetoGot ? "var(--secondary)" : "var(--error)",
            }}
          >
            POR QUE {h.gepetoGot ? "ACERTOU" : "ERROU"}
          </div>
          <div style={{ display: "grid", gap: 5 }}>
            {h.reasoning.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "flex-start",
                  fontSize: 12,
                  color: "var(--fg)",
                  lineHeight: 1.4,
                }}
              >
                <span
                  style={{
                    color: h.gepetoGot ? "var(--secondary)" : "var(--error)",
                    flexShrink: 0,
                    fontWeight: 700,
                  }}
                >
                  {h.gepetoGot ? "✓" : "✕"}
                </span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WeeklyNarrative() {
  const w = WEEKLY;
  const ahead = w.gepetoScore > w.communityScore;
  const [expanded, setExpanded] = useState(0);
  return (
    <div style={{ padding: 16 }}>
      {/* Hero */}
      <div
        className="tcard fade-up"
        style={{ padding: 0, marginBottom: 14, overflow: "hidden" }}
      >
        <div className="tcard-bg" />
        <div className="tcard-foil" />
        <div style={{ padding: "16px 16px 0", textAlign: "center" }}>
          <div className="label-mono" style={{ color: "var(--tertiary)" }}>
            CAPÍTULO {String(w.number).padStart(2, "0")} · {w.phase.toUpperCase()}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <GepetoAvatar size={84} mood={ahead ? "smug" : "angry"} />
          </div>
          <div className="h-display" style={{ fontSize: 24, marginTop: 12 }}>
            {ahead ? "Gepeto na liderança" : "Humanos resistem"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Semana {w.number} de 7 · {w.totalMatches} jogos
          </div>
        </div>

        {/* Scoreboard */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 14,
            margin: "18px 16px 0",
            padding: "14px 14px",
            background: "rgba(9,14,28,0.55)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 14,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <GepetoAvatar size={32} mood={ahead ? "smug" : "neutral"} glow={false} />
            <div
              className="h-display num-mono"
              style={{
                fontSize: 38,
                marginTop: 6,
                color: ahead ? "var(--tertiary)" : "var(--fg)",
                letterSpacing: "-0.02em",
              }}
            >
              {w.gepetoScore}
            </div>
            <div className="label-mono" style={{ fontSize: 8, marginTop: 4 }}>
              GEPETO
            </div>
          </div>
          <div className="h-display" style={{ fontSize: 22, color: "var(--muted)" }}>
            ×
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 99,
                background: "var(--container-high)",
                color: "var(--primary)",
                margin: "0 auto",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="users" size={16} />
            </div>
            <div
              className="h-display num-mono"
              style={{
                fontSize: 38,
                marginTop: 6,
                color: !ahead ? "var(--secondary)" : "var(--fg)",
                letterSpacing: "-0.02em",
              }}
            >
              {w.communityScore}
            </div>
            <div className="label-mono" style={{ fontSize: 8, marginTop: 4 }}>
              HUMANOS
            </div>
          </div>
        </div>

        {/* Trash talk quote */}
        <div
          style={{
            margin: "14px 16px 0",
            padding: "12px 14px",
            background: "rgba(255,201,101,0.06)",
            border: "1px dashed rgba(255,201,101,0.35)",
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.5,
            color: "var(--fg)",
            fontStyle: "italic",
          }}
        >
          <span
            style={{
              fontFamily: "var(--headline)",
              fontSize: 32,
              lineHeight: 0,
              color: "var(--tertiary)",
              opacity: 0.45,
              marginRight: 4,
              verticalAlign: "-8px",
            }}
          >
            "
          </span>
          {w.voice}
        </div>

        <div
          style={{
            padding: "14px 14px 14px",
            marginTop: 14,
            borderTop: "1px solid var(--outline-variant)",
            background: "rgba(9,14,28,0.35)",
            display: "flex",
            gap: 8,
          }}
        >
          <button className="btn btn-primary" style={{ flex: 1 }}>
            <Icon name="share" size={14} /> Compartilhar capítulo
          </button>
          <button className="btn btn-outline" style={{ paddingInline: 14 }}>
            <Icon name="chevronLeft" size={14} />
          </button>
          <button className="btn btn-outline" style={{ paddingInline: 14 }}>
            <Icon name="chevronRight" size={14} />
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="raised fade-up" style={{ padding: 14, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div className="h-display" style={{ fontSize: 13 }}>
            Resultados da semana
          </div>
          <span className="label-mono" style={{ fontSize: 9 }}>
            TOQUE PARA EXPANDIR
          </span>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {w.highlights.map((h, i) => (
            <HighlightRow
              key={i}
              h={h}
              expanded={expanded === i}
              onToggle={() => setExpanded(expanded === i ? -1 : i)}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            marginTop: 10,
            display: "flex",
            gap: 14,
            justifyContent: "center",
          }}
        >
          <span>
            <b style={{ color: "var(--secondary)" }}>G</b> palpite Gepeto
          </span>
          <span>
            <b style={{ color: "var(--secondary)" }}>●</b> &gt;50% da galera
          </span>
        </div>
      </div>

      {/* Top humans this week */}
      <div className="raised fade-up" style={{ padding: 14, marginBottom: 14 }}>
        <div className="h-display" style={{ fontSize: 13, marginBottom: 10 }}>
          Humanos que bateram o Gepeto
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {w.topHumans.map((u, i) => (
            <div
              key={u.nick}
              style={{
                display: "grid",
                gridTemplateColumns: "24px 36px 1fr auto",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: u.isMe ? "rgba(149,170,255,0.1)" : "var(--container-high)",
                border: `1px solid ${u.isMe ? "var(--primary)" : "var(--outline-variant)"}`,
                borderRadius: 10,
              }}
            >
              <div
                className="num-mono"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: i === 0 ? "var(--tertiary)" : "var(--muted)",
                }}
              >
                #{i + 1}
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 99,
                  background: `hsl(${(u.nick.charCodeAt(0) * 13) % 360} 40% 35%)`,
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--headline)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {u.nick.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>@{u.nick}</div>
                {u.isMe && (
                  <div
                    className="label-mono"
                    style={{ fontSize: 8, color: "var(--primary)" }}
                  >
                    VOCÊ
                  </div>
                )}
              </div>
              <div
                className="num-mono"
                style={{ fontSize: 16, fontWeight: 700, color: "var(--secondary)" }}
              >
                {u.score}
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: 8, fontSize: 12, height: 36 }}
        >
          Ver ranking completo <Icon name="chevronRight" size={13} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Fixtures (todos os jogos por fase) ---------- */
const FIXTURES = [
  {
    phase: "Fase de grupos",
    subtitle: "32 seleções · 48 jogos",
    color: "var(--muted)",
    rounds: [
      {
        label: "Rodada 3 · encerrada",
        matches: [
          {
            h: "BRA",
            hf: "\ud83c\udde7\ud83c\uddf7",
            a: "CMR",
            af: "\ud83c\udde8\ud83c\uddf2",
            status: "final",
            score: [4, 1],
            g: "3-1",
            gOk: true,
            mine: "4-1",
            mineOk: true,
          },
          {
            h: "ARG",
            hf: "\ud83c\udde6\ud83c\uddf7",
            a: "POL",
            af: "\ud83c\uddf5\ud83c\uddf1",
            status: "final",
            score: [2, 0],
            g: "1-0",
            gOk: false,
            mine: "2-0",
            mineOk: true,
          },
        ],
      },
    ],
  },
  {
    phase: "Oitavas de final",
    subtitle: "16 seleções · 8 jogos",
    color: "var(--primary)",
    rounds: [
      {
        label: "Encerrada · 22\u201326 jun",
        matches: [
          {
            h: "BRA",
            hf: "\ud83c\udde7\ud83c\uddf7",
            a: "GHA",
            af: "\ud83c\uddec\ud83c\udded",
            status: "final",
            score: [3, 0],
            g: "2-0",
            gOk: false,
            mine: "3-0",
            mineOk: true,
          },
          {
            h: "ARG",
            hf: "\ud83c\udde6\ud83c\uddf7",
            a: "MEX",
            af: "\ud83c\uddf2\ud83c\uddfd",
            status: "final",
            score: [1, 0],
            g: "1-0",
            gOk: true,
            mine: "2-1",
            mineOk: false,
          },
          {
            h: "FRA",
            hf: "\ud83c\uddeb\ud83c\uddf7",
            a: "USA",
            af: "\ud83c\uddfa\ud83c\uddf8",
            status: "final",
            score: [3, 1],
            g: "3-1",
            gOk: true,
            mine: "3-0",
            mineOk: false,
          },
          {
            h: "ESP",
            hf: "\ud83c\uddea\ud83c\uddf8",
            a: "CHI",
            af: "\ud83c\udde8\ud83c\uddf1",
            status: "final",
            score: [2, 1],
            g: "2-1",
            gOk: true,
            mine: "2-1",
            mineOk: true,
          },
        ],
      },
    ],
  },
  {
    phase: "Quartas de final",
    subtitle: "8 seleções · 4 jogos",
    color: "var(--tertiary)",
    current: true,
    rounds: [
      {
        label: "Em andamento · 01\u201302 jul",
        matches: [
          {
            h: "BRA",
            hf: "\ud83c\udde7\ud83c\uddf7",
            a: "ARG",
            af: "\ud83c\udde6\ud83c\uddf7",
            status: "upcoming",
            time: "hoje 21:00",
            live: false,
            g: "2-1",
            mine: "2-2",
            featured: true,
          },
          {
            h: "FRA",
            hf: "\ud83c\uddeb\ud83c\uddf7",
            a: "NED",
            af: "\ud83c\uddf3\ud83c\uddf1",
            status: "live",
            score: [0, 1],
            minute: "56'",
            g: "1-0",
            mine: "1-1",
          },
          {
            h: "GER",
            hf: "\ud83c\udde9\ud83c\uddea",
            a: "MEX",
            af: "\ud83c\uddf2\ud83c\uddfd",
            status: "final",
            score: [3, 1],
            g: "3-1",
            gOk: true,
            mine: "2-0",
            mineOk: false,
          },
          {
            h: "POR",
            hf: "\ud83c\uddf5\ud83c\uddf9",
            a: "URU",
            af: "\ud83c\uddfa\ud83c\uddfe",
            status: "final",
            score: [2, 1],
            g: "1-1",
            gOk: false,
            mine: "1-1",
            mineOk: false,
          },
        ],
      },
    ],
  },
  {
    phase: "Semifinais",
    subtitle: "4 seleções · 2 jogos",
    color: "var(--secondary)",
    locked: true,
    rounds: [
      {
        label: "05\u201306 jul · Gepeto palpita 4h antes",
        matches: [
          {
            h: "???",
            hf: "\u2753",
            a: "???",
            af: "\u2753",
            status: "locked",
            time: "05 jul 21:00",
          },
          {
            h: "???",
            hf: "\u2753",
            a: "???",
            af: "\u2753",
            status: "locked",
            time: "06 jul 21:00",
          },
        ],
      },
    ],
  },
  {
    phase: "Final \u00b7 12 jul",
    subtitle: "Vale 5\u00d7 pontos",
    color: "var(--tertiary)",
    locked: true,
    rounds: [
      {
        label: "MetLife Stadium",
        matches: [
          {
            h: "???",
            hf: "\ud83c\udfc6",
            a: "???",
            af: "\ud83c\udfc6",
            status: "locked",
            time: "12 jul 17:00",
            multiplier: 5,
          },
        ],
      },
    ],
  },
];

function FixtureRow({ m, onOpen }) {
  const live = m.status === "live";
  const final = m.status === "final";
  const upcoming = m.status === "upcoming";
  const locked = m.status === "locked";
  return (
    <button
      onClick={() => !locked && onOpen?.(m)}
      disabled={locked}
      style={{
        textAlign: "left",
        width: "100%",
        background: m.featured
          ? "linear-gradient(90deg, rgba(255,201,101,0.1), var(--container-high))"
          : live
            ? "linear-gradient(90deg, rgba(255,110,132,0.08), var(--container-high))"
            : "var(--container-high)",
        border: `1px solid ${m.featured ? "var(--tertiary)" : live ? "var(--error)" : "var(--outline-variant)"}`,
        borderRadius: 12,
        padding: "10px 12px",
        display: "grid",
        gridTemplateColumns: "56px 1fr auto",
        gap: 10,
        alignItems: "center",
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.5 : 1,
        position: "relative",
      }}
    >
      {/* Status / time */}
      <div style={{ textAlign: "center" }}>
        {live && (
          <>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span
                className="pulse-dot"
                style={{
                  width: 5,
                  height: 5,
                  background: "var(--error)",
                  boxShadow: "0 0 8px var(--error)",
                }}
              />
              <span className="label-mono" style={{ fontSize: 8, color: "var(--error)" }}>
                LIVE
              </span>
            </div>
            <div
              className="num-mono"
              style={{ fontSize: 12, color: "var(--fg)", marginTop: 2 }}
            >
              {m.minute}
            </div>
          </>
        )}
        {final && (
          <div className="label-mono" style={{ fontSize: 9, color: "var(--muted)" }}>
            FINAL
          </div>
        )}
        {upcoming && (
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: m.featured ? "var(--tertiary)" : "var(--muted)",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {m.time?.split(" ").map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>
        )}
        {locked && <Icon name="lock" size={14} color="var(--muted)" />}
      </div>

      {/* Teams + score */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 18 }}>{m.hf}</span>
            <span
              className="h-display"
              style={{
                fontSize: 13,
                color: m.score && m.score[0] > m.score[1] ? "var(--fg)" : "var(--muted)",
              }}
            >
              {m.h}
            </span>
          </div>
          {final || live ? (
            <span
              className="h-display num-mono"
              style={{
                fontSize: 16,
                color: live ? "var(--error)" : "var(--fg)",
                whiteSpace: "nowrap",
              }}
            >
              {m.score[0]} – {m.score[1]}
            </span>
          ) : (
            <span
              style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }}
            >
              vs
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
            marginTop: 3,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <span style={{ fontSize: 18 }}>{m.af}</span>
            <span
              className="h-display"
              style={{
                fontSize: 13,
                color: m.score && m.score[1] > m.score[0] ? "var(--fg)" : "var(--muted)",
              }}
            >
              {m.a}
            </span>
          </div>
        </div>

        {/* Predictions row */}
        {!locked && (
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px dashed var(--outline-variant)",
            }}
          >
            {m.g && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 7px",
                  borderRadius: 6,
                  background:
                    m.gOk === true
                      ? "rgba(79,243,37,0.15)"
                      : m.gOk === false
                        ? "rgba(255,110,132,0.15)"
                        : "rgba(255,201,101,0.12)",
                  color:
                    m.gOk === true
                      ? "var(--secondary)"
                      : m.gOk === false
                        ? "var(--error)"
                        : "var(--tertiary)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                <GepetoAvatar size={12} mood="neutral" glow={false} /> {m.g}
              </span>
            )}
            {m.mine && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 7px",
                  borderRadius: 6,
                  background:
                    m.mineOk === true
                      ? "rgba(79,243,37,0.15)"
                      : m.mineOk === false
                        ? "rgba(255,110,132,0.15)"
                        : "rgba(149,170,255,0.12)",
                  color:
                    m.mineOk === true
                      ? "var(--secondary)"
                      : m.mineOk === false
                        ? "var(--error)"
                        : "var(--primary)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Você {m.mine}
              </span>
            )}
            {!m.mine && upcoming && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 7px",
                  borderRadius: 6,
                  background: "transparent",
                  color: "var(--primary)",
                  border: "1px dashed var(--primary)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                + palpitar
              </span>
            )}
            {m.multiplier && (
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "2px 7px",
                  borderRadius: 6,
                  background: "rgba(255,201,101,0.15)",
                  color: "var(--tertiary)",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {m.multiplier}× PTS
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chevron */}
      <div style={{ color: "var(--muted)", paddingLeft: 2 }}>
        {!locked && <Icon name="chevronRight" size={14} />}
      </div>
    </button>
  );
}

function FixturesScreen({ onOpenMatch }) {
  const [phase, setPhase] = useState(2); // index of current phase
  const ph = FIXTURES[phase];
  return (
    <div>
      {/* Phase tabs strip */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          background: "rgba(9,14,28,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--outline-variant)",
          padding: "10px 12px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {FIXTURES.map((p, i) => {
          const on = i === phase;
          const done = i < 2;
          return (
            <button
              key={i}
              onClick={() => setPhase(i)}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: 99,
                background: on ? "var(--fg)" : "transparent",
                color: on ? "var(--bg)" : done ? "var(--muted)" : p.color,
                border: `1px solid ${on ? "var(--fg)" : p.color === "var(--muted)" ? "var(--outline-variant)" : p.color}`,
                fontFamily: "var(--body)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                whiteSpace: "nowrap",
              }}
            >
              {p.current && !on && (
                <span className="pulse-dot" style={{ width: 5, height: 5 }} />
              )}
              {p.locked && <Icon name="lock" size={10} />}
              {p.phase}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 16 }}>
        {/* Phase header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 12,
          }}
        >
          <div>
            <div className="h-display" style={{ fontSize: 22, color: ph.color }}>
              {ph.phase}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {ph.subtitle}
            </div>
          </div>
          {ph.current && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 8px",
                borderRadius: 6,
                background: "rgba(255,201,101,0.15)",
                color: "var(--tertiary)",
                fontFamily: "var(--headline)",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              <span className="pulse-dot" style={{ width: 5, height: 5 }} /> ATUAL
            </span>
          )}
        </div>

        {ph.rounds.map((r, ri) => (
          <div key={ri} style={{ marginBottom: 16 }}>
            <div className="label-mono" style={{ fontSize: 9, marginBottom: 8 }}>
              {r.label}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {r.matches.map((m, mi) => (
                <FixtureRow key={mi} m={m} onOpen={onOpenMatch} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Mini user avatar ---------- */
function UAv({ nick, size = 28, ring = false }) {
  const hue = useMemo(() => {
    let h = 0;
    for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) % 360;
    return h;
  }, [nick]);
  const initials = nick
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        padding: ring ? 2 : 0,
        background: ring
          ? "conic-gradient(from 180deg, var(--primary), var(--secondary), var(--tertiary))"
          : "transparent",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 999,
          background: `hsl(${hue} 45% 35%)`,
          color: "white",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--headline)",
          fontSize: size * 0.36,
          fontWeight: 700,
        }}
      >
        {initials}
      </div>
    </div>
  );
}

function MemberStack({ members, size = 24, max = 4 }) {
  const visible = members.slice(0, max);
  const more = members.length - visible.length;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {visible.map((m, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -8,
            border: "2px solid var(--container)",
            borderRadius: 99,
            lineHeight: 0,
          }}
        >
          {m.isAI ? (
            <GepetoAvatar size={size} mood="neutral" glow={false} />
          ) : (
            <UAv nick={m.nick} size={size} />
          )}
        </div>
      ))}
      {more > 0 && (
        <div
          style={{
            marginLeft: -8,
            width: size,
            height: size,
            borderRadius: 99,
            background: "var(--container-highest)",
            border: "2px solid var(--container)",
            color: "var(--muted)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--mono)",
            fontSize: size * 0.35,
            fontWeight: 700,
          }}
        >
          +{more}
        </div>
      )}
    </div>
  );
}

/* ---------- Sheets / Modals ---------- */
function Sheet({ open, onClose, children, title, height = "auto" }) {
  if (!open) return null;
  const host = document.querySelector(".device") || document.body;
  const overlay = (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--container)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          border: "1px solid var(--outline-variant)",
          borderBottom: "none",
          maxHeight: "85%",
          height,
          overflowY: "auto",
          animation: "slideUp 0.28s cubic-bezier(0.2,0.8,0.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            padding: "10px 16px 0",
            background: "var(--container)",
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: "var(--outline-variant)",
              margin: "0 auto 12px",
            }}
          />
          {title && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div className="h-display" style={{ fontSize: 17 }}>
                {title}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: 0,
                  padding: 4,
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: "0 16px 20px" }}>{children}</div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(overlay, host);
}

const EMOJI_OPTIONS = [
  "\ud83c\udfc6",
  "\ud83c\udfe0",
  "\ud83c\udf7b",
  "\ud83d\udcbc",
  "\u26bd",
  "\ud83d\udd25",
  "\ud83c\udf1f",
  "\ud83c\udf08",
  "\ud83c\udfaf",
  "\u26a1",
  "\ud83e\udd16",
  "\ud83d\udc7e",
  "\ud83c\udfc1",
  "\ud83c\udfaa",
  "\ud83c\udf2e",
  "\ud83c\udfc8",
];
const COLOR_OPTIONS = ["#95aaff", "#4ff325", "#ffc965", "#ff6e84", "#b388eb", "#5ee0d8"];

function CreateGroupSheet({ open, onClose, onCreated }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: "",
    emoji: "\ud83c\udfc6",
    color: "#95aaff",
    description: "",
    privacy: "private",
    includeGepeto: true,
    multiplierKO: 3,
    multiplierFinal: 5,
  });
  const [createdCode, setCreatedCode] = useState(null);

  const reset = () => {
    setStep(0);
    setData({
      name: "",
      emoji: "\ud83c\udfc6",
      color: "#95aaff",
      description: "",
      privacy: "private",
      includeGepeto: true,
      multiplierKO: 3,
      multiplierFinal: 5,
    });
    setCreatedCode(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };

  const valid = data.name.trim().length >= 3;

  const submit = () => {
    const code = Array.from({ length: 6 }, () =>
      "ABCDEFGHJKMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 31))
    ).join("");
    setCreatedCode(code);
    setStep(3);
  };

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title={createdCode ? "Bolão criado!" : "Criar bolão"}
    >
      {/* Step indicator */}
      {!createdCode && (
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 99,
                background: s <= step ? data.color : "var(--outline-variant)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
      )}

      {step === 0 && !createdCode && (
        <div>
          <div className="label-mono" style={{ marginBottom: 8 }}>
            IDENTIDADE
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "var(--container-high)",
                border: `2px solid ${data.color}`,
                display: "grid",
                placeItems: "center",
                fontSize: 32,
                flexShrink: 0,
              }}
            >
              {data.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Nome do bolão"
                maxLength={32}
                style={{
                  width: "100%",
                  height: 36,
                  background: "var(--container-high)",
                  border: "1px solid var(--outline-variant)",
                  borderRadius: 10,
                  padding: "0 12px",
                  color: "var(--fg)",
                  fontFamily: "var(--headline)",
                  fontSize: 16,
                  fontWeight: 700,
                  outline: "none",
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  textAlign: "right",
                  marginTop: 4,
                }}
              >
                {data.name.length}/32
              </div>
            </div>
          </div>

          <div className="label-mono" style={{ marginBottom: 6 }}>
            EMOJI
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)",
              gap: 4,
              marginBottom: 14,
            }}
          >
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setData({ ...data, emoji: e })}
                style={{
                  aspectRatio: "1/1",
                  fontSize: 22,
                  background:
                    data.emoji === e ? "var(--container-highest)" : "transparent",
                  border: `1px solid ${data.emoji === e ? data.color : "var(--outline-variant)"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="label-mono" style={{ marginBottom: 6 }}>
            COR DE ACENTO
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setData({ ...data, color: c })}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 99,
                  background: c,
                  border: `2px solid ${data.color === c ? "var(--fg)" : "transparent"}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "none" }}>{c}</span>
              </button>
            ))}
          </div>

          <div className="label-mono" style={{ marginBottom: 6 }}>
            DESCRIÇÃO (opcional)
          </div>
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Ex: Bolão do escritório, quem ganhar leva o churrasco da final"
            maxLength={120}
            style={{
              width: "100%",
              background: "var(--container-high)",
              border: "1px solid var(--outline-variant)",
              borderRadius: 10,
              padding: "10px 12px",
              color: "var(--fg)",
              fontFamily: "var(--body)",
              fontSize: 12,
              minHeight: 60,
              resize: "vertical",
              outline: "none",
            }}
          />

          <button
            onClick={() => setStep(1)}
            disabled={!valid}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 16, opacity: valid ? 1 : 0.5 }}
          >
            Continuar <Icon name="chevronRight" size={14} />
          </button>
        </div>
      )}

      {step === 1 && !createdCode && (
        <div>
          <div className="label-mono" style={{ marginBottom: 8 }}>
            QUEM PODE ENTRAR
          </div>
          {[
            {
              id: "private",
              icon: "lock",
              label: "Só quem tem o código",
              desc: "Você convida individualmente. Recomendado para amigos e família.",
            },
            {
              id: "city",
              icon: "pin",
              label: "Público na minha cidade",
              desc: "Aparece em sugestões pra quem está em São Paulo.",
            },
            {
              id: "open",
              icon: "users",
              label: "Aberto para todos",
              desc: "Qualquer um pode entrar. Indicado pra bolões grandes (50+).",
            },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setData({ ...data, privacy: p.id })}
              style={{
                display: "flex",
                gap: 12,
                width: "100%",
                padding: 12,
                marginBottom: 8,
                background:
                  data.privacy === p.id
                    ? "rgba(149,170,255,0.08)"
                    : "var(--container-high)",
                border: `1px solid ${data.privacy === p.id ? data.color : "var(--outline-variant)"}`,
                borderRadius: 12,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background:
                    data.privacy === p.id ? data.color : "var(--container-highest)",
                  color: data.privacy === p.id ? "var(--bg)" : "var(--muted)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={p.icon} size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}
                >
                  {p.desc}
                </div>
              </div>
              {data.privacy === p.id && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 99,
                    background: data.color,
                    color: "var(--bg)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={12} />
                </div>
              )}
            </button>
          ))}

          <div
            style={{
              marginTop: 14,
              padding: 12,
              background: data.includeGepeto
                ? "rgba(255,201,101,0.08)"
                : "var(--container-high)",
              border: `1px solid ${data.includeGepeto ? "var(--tertiary)" : "var(--outline-variant)"}`,
              borderRadius: 12,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <GepetoAvatar size={36} mood="neutral" glow={false} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Incluir o Gepeto</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                Ele palpita em todos os jogos e provoca o grupo. Pode ser desligado
                depois.
              </div>
            </div>
            <div
              className={`switch ${data.includeGepeto ? "on" : ""}`}
              onClick={() => setData({ ...data, includeGepeto: !data.includeGepeto })}
              role="button"
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={() => setStep(0)}
              className="btn btn-outline"
              style={{ paddingInline: 16 }}
            >
              <Icon name="chevronLeft" size={14} />
            </button>
            <button
              onClick={() => setStep(2)}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Continuar <Icon name="chevronRight" size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && !createdCode && (
        <div>
          <div className="label-mono" style={{ marginBottom: 8 }}>
            PONTUAÇÃO & MULTIPLICADORES
          </div>
          <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
            <RuleRow label="Placar exato" value="+25 pts" locked />
            <RuleRow label="Acertou vencedor" value="+10 pts" locked />
            <RuleRow label="Só placar de um time" value="+5 pts" locked />
          </div>

          <div className="label-mono" style={{ marginBottom: 8 }}>
            RODADAS QUE VALEM MAIS
          </div>
          <SliderRow
            label="Mata-mata"
            value={data.multiplierKO}
            onChange={(v) => setData({ ...data, multiplierKO: v })}
            min={1}
            max={5}
            suffix="× pts"
            color={data.color}
          />
          <SliderRow
            label="Final"
            value={data.multiplierFinal}
            onChange={(v) => setData({ ...data, multiplierFinal: v })}
            min={1}
            max={10}
            suffix="× pts"
            color={data.color}
          />

          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "rgba(149,170,255,0.06)",
              border: "1px dashed var(--outline-variant)",
              borderRadius: 10,
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.4,
            }}
          >
            💡 Palpites só abrem no apito inicial. Ninguém vê o seu antes.
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              onClick={() => setStep(1)}
              className="btn btn-outline"
              style={{ paddingInline: 16 }}
            >
              <Icon name="chevronLeft" size={14} />
            </button>
            <button onClick={submit} className="btn btn-primary" style={{ flex: 1 }}>
              <Icon name="check" size={14} /> Criar bolão
            </button>
          </div>
        </div>
      )}

      {createdCode && (
        <CreatedSuccess
          data={data}
          code={createdCode}
          onShare={() => {
            handleClose();
          }}
        />
      )}
    </Sheet>
  );
}

function RuleRow({ label, value, locked }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 12px",
        background: "var(--container-high)",
        border: "1px solid var(--outline-variant)",
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: 12 }}>{label}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span className="num-mono" style={{ fontSize: 12, fontWeight: 700 }}>
          {value}
        </span>
        {locked && <Icon name="lock" size={11} color="var(--muted)" />}
      </span>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, suffix, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12 }}>{label}</span>
        <span className="num-mono" style={{ fontSize: 13, fontWeight: 700, color }}>
          {value}
          {suffix}
        </span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              flex: 1,
              height: 32,
              borderRadius: 6,
              background: n <= value ? color : "var(--container-high)",
              color: n <= value ? "var(--bg)" : "var(--muted)",
              border: "1px solid var(--outline-variant)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {n}
            {suffix.charAt(0)}
          </button>
        ))}
      </div>
    </div>
  );
}

function CreatedSuccess({ data, code, onShare }) {
  const [copied, setCopied] = useState(false);
  const link = `figfacil.com/b/${code}`;
  return (
    <div>
      <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: data.color,
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontSize: 36,
            margin: "0 auto",
            boxShadow: `0 0 0 4px ${data.color}30`,
            animation: "pop 0.4s cubic-bezier(0.2,0.9,0.2,1.1)",
          }}
        >
          {data.emoji}
        </div>
        <div className="h-display" style={{ fontSize: 20, marginTop: 12 }}>
          {data.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
          {data.includeGepeto
            ? "Você + Gepeto. Bora chamar a galera."
            : "Bora chamar a galera."}
        </div>
      </div>

      <div className="label-mono" style={{ marginBottom: 6 }}>
        CÓDIGO DE ENTRADA
      </div>
      <div
        style={{
          padding: 14,
          marginBottom: 12,
          background: `linear-gradient(135deg, ${data.color}20, transparent)`,
          border: `1px dashed ${data.color}80`,
          borderRadius: 12,
          textAlign: "center",
        }}
      >
        <div
          className="h-display num-mono"
          style={{
            fontSize: 32,
            letterSpacing: "0.25em",
            color: data.color,
          }}
        >
          {code}
        </div>
        <div className="label-mono" style={{ marginTop: 6 }}>
          {link}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <button
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="btn btn-outline"
          style={{ fontSize: 12 }}
        >
          <Icon name={copied ? "check" : "share"} size={14} />{" "}
          {copied ? "Copiado" : "Copiar link"}
        </button>
        <button
          className="btn btn-secondary"
          style={{ fontSize: 12, background: "#25d366", color: "white" }}
        >
          WhatsApp
        </button>
      </div>
      <button onClick={onShare} className="btn btn-primary" style={{ width: "100%" }}>
        Ir para o bolão
      </button>
    </div>
  );
}

function JoinGroupSheet({ open, onClose, onJoined }) {
  const [code, setCode] = useState("");
  const [step, setStep] = useState("input"); // input | preview | joined
  const preview =
    code.length === 6
      ? {
          name: "Familia Figueira",
          emoji: "\ud83c\udfe0",
          color: "#95aaff",
          members: 5,
          desc: "Só os Figueira. Quem perder paga o churrasco da final.",
          admin: "@papai_zeca",
        }
      : null;

  const inputs = Array.from({ length: 6 }, (_, i) => code[i] || "");

  const handleChange = (i, v) => {
    const cleaned = (v || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 1);
    const next = code.split("");
    next[i] = cleaned;
    const joined = next.join("").slice(0, 6);
    setCode(joined);
    if (cleaned && i < 5) {
      const el = document.getElementById(`code-${i + 1}`);
      el?.focus();
    }
  };

  const reset = () => {
    setCode("");
    setStep("input");
  };
  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };

  return (
    <Sheet open={open} onClose={handleClose} title="Entrar em um bolão">
      {step === "input" && (
        <div>
          <div
            style={{
              textAlign: "center",
              padding: "10px 0 14px",
              fontSize: 13,
              color: "var(--muted)",
            }}
          >
            Digite o código de 6 letras que você recebeu
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 6,
              marginBottom: 16,
            }}
          >
            {inputs.map((v, i) => (
              <input
                key={i}
                id={`code-${i}`}
                value={v}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !v && i > 0) {
                    document.getElementById(`code-${i - 1}`)?.focus();
                  }
                }}
                maxLength={1}
                style={{
                  aspectRatio: "1/1",
                  background: "var(--container-high)",
                  border: `2px solid ${v ? "var(--primary)" : "var(--outline-variant)"}`,
                  borderRadius: 10,
                  color: "var(--fg)",
                  fontFamily: "var(--headline)",
                  fontSize: 22,
                  fontWeight: 700,
                  textAlign: "center",
                  outline: "none",
                  padding: 0,
                  width: "100%",
                  caretColor: "var(--primary)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => setStep("preview")}
            disabled={code.length !== 6}
            className="btn btn-primary"
            style={{ width: "100%", opacity: code.length === 6 ? 1 : 0.5 }}
          >
            Buscar bolão
          </button>
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              background: "var(--container-high)",
              border: "1px dashed var(--outline-variant)",
              borderRadius: 10,
              display: "flex",
              gap: 10,
              alignItems: "center",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            <Icon name="share" size={14} />
            <span>
              Ou abra um link{" "}
              <b style={{ color: "var(--primary)" }}>figfacil.com/b/XXXXXX</b> que alguém
              te mandou.
            </span>
          </div>
        </div>
      )}

      {step === "preview" && preview && (
        <div>
          <div
            style={{
              padding: 14,
              marginBottom: 14,
              background: `linear-gradient(135deg, ${preview.color}15, transparent)`,
              border: `1px solid ${preview.color}55`,
              borderRadius: 14,
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "var(--container-high)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 26,
                }}
              >
                {preview.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div className="h-display" style={{ fontSize: 17 }}>
                  {preview.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                  Admin {preview.admin}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--muted)",
                marginTop: 10,
                lineHeight: 1.4,
              }}
            >
              “{preview.desc}”
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid var(--outline-variant)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "var(--muted)",
                }}
              >
                <Icon name="users" size={11} /> {preview.members} jogadores
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "var(--tertiary)",
                }}
              >
                <GepetoAvatar size={11} mood="neutral" glow={false} /> Gepeto incluso
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setStep("input")}
              className="btn btn-outline"
              style={{ paddingInline: 16 }}
            >
              <Icon name="chevronLeft" size={14} />
            </button>
            <button
              onClick={() => {
                onJoined?.();
                handleClose();
              }}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Icon name="check" size={14} /> Entrar no bolão
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function InviteSheet({ open, onClose, group }) {
  const [copied, setCopied] = useState("");
  if (!group) return null;
  const code = "R7K2QH";
  const link = `figfacil.com/b/${code}`;
  const copy = (text, what) => {
    navigator.clipboard?.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(""), 1500);
  };
  const message = `Vem pro bolão ${group.name} ${group.emoji} no Figurinha Fácil! Código: ${code} ou abre ${link}`;
  return (
    <Sheet open={open} onClose={onClose} title="Convidar amigos">
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "var(--container-high)",
            display: "inline-grid",
            placeItems: "center",
            fontSize: 28,
            border: `1px solid ${group.color}55`,
          }}
        >
          {group.emoji}
        </div>
        <div className="h-display" style={{ fontSize: 15, marginTop: 8 }}>
          {group.name}
        </div>
      </div>

      <div className="label-mono" style={{ marginBottom: 6 }}>
        CÓDIGO DE 6 LETRAS
      </div>
      <button
        onClick={() => copy(code, "code")}
        style={{
          width: "100%",
          padding: 16,
          marginBottom: 12,
          background: `linear-gradient(135deg, ${group.color}20, transparent)`,
          border: `1px dashed ${group.color}80`,
          borderRadius: 12,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="h-display num-mono"
          style={{
            fontSize: 28,
            letterSpacing: "0.22em",
            color: group.color,
          }}
        >
          {code}
        </div>
        <span
          style={{
            fontSize: 11,
            color: "var(--muted)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Icon name={copied === "code" ? "check" : "share"} size={12} />
          {copied === "code" ? "copiado" : "toque"}
        </span>
      </button>

      <div className="label-mono" style={{ marginBottom: 6 }}>
        OU LINK
      </div>
      <button
        onClick={() => copy(link, "link")}
        style={{
          width: "100%",
          padding: "10px 14px",
          marginBottom: 14,
          background: "var(--container-high)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 10,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--fg)",
        }}
      >
        {link}
        <Icon
          name={copied === "link" ? "check" : "share"}
          size={13}
          color="var(--muted)"
        />
      </button>

      <div className="label-mono" style={{ marginBottom: 8 }}>
        COMPARTILHAR
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <button
          className="btn btn-secondary"
          style={{
            background: "#25d366",
            color: "white",
            fontSize: 12,
          }}
        >
          WhatsApp
        </button>
        <button className="btn btn-outline" style={{ fontSize: 12 }}>
          <Icon name="share" size={13} /> Outros
        </button>
      </div>

      <div
        style={{
          padding: 10,
          background: "var(--container-high)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 10,
          fontSize: 11,
          color: "var(--muted)",
          lineHeight: 1.4,
        }}
      >
        <div className="label-mono" style={{ marginBottom: 4 }}>
          PRÉ-VISUALIZAÇÃO
        </div>
        {message}
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="label-mono" style={{ marginBottom: 6 }}>
          PENDENTES (2)
        </div>
        {["+55 11 9XXXX-1234", "@matheus.b"].map((t) => (
          <div
            key={t}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              marginBottom: 4,
              background: "var(--container-high)",
              border: "1px dashed var(--outline-variant)",
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            <span>{t}</span>
            <button
              style={{
                background: "transparent",
                border: 0,
                color: "var(--primary)",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
              }}
            >
              reenviar
            </button>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

function PokeSheet({ open, onClose, target, match }) {
  const templates = [
    `👀 @${target} acorda! Falta você palpitar em ${match}`,
    `⏰ ${target}, o jogo começa em 3h e você ainda não palpitou!`,
    `🤖 Até o Gepeto já cravou. Cadê o seu palpite, @${target}?`,
  ];
  const [picked, setPicked] = useState(0);
  const [custom, setCustom] = useState("");
  const [sent, setSent] = useState(false);
  const reset = () => {
    setPicked(0);
    setCustom("");
    setSent(false);
  };
  const handleClose = () => {
    onClose();
    setTimeout(reset, 200);
  };
  if (!target) return null;
  return (
    <Sheet open={open} onClose={handleClose} title={`Cutucar @${target}`}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "30px 10px" }}>
          <div style={{ fontSize: 56 }}>👉</div>
          <div className="h-display" style={{ fontSize: 18, marginTop: 8 }}>
            Cutucada enviada!
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
            @{target} recebeu uma notificação. Máximo 1 cutucada a cada 2h por pessoa.
          </div>
          <button
            onClick={handleClose}
            className="btn btn-primary"
            style={{ marginTop: 18, width: "100%" }}
          >
            Beleza
          </button>
        </div>
      ) : (
        <div>
          <div className="label-mono" style={{ marginBottom: 8 }}>
            ESCOLHA UM TOM
          </div>
          {templates.map((t, i) => (
            <button
              key={i}
              onClick={() => setPicked(i)}
              style={{
                display: "flex",
                gap: 10,
                width: "100%",
                padding: 12,
                marginBottom: 6,
                background:
                  picked === i ? "rgba(149,170,255,0.08)" : "var(--container-high)",
                border: `1px solid ${picked === i ? "var(--primary)" : "var(--outline-variant)"}`,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                fontSize: 12,
                color: "var(--fg)",
                lineHeight: 1.4,
              }}
            >
              <span style={{ flex: 1 }}>{t}</span>
              {picked === i && <Icon name="check" size={14} color="var(--primary)" />}
            </button>
          ))}
          <div className="label-mono" style={{ marginTop: 14, marginBottom: 6 }}>
            OU ESCREVA
          </div>
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Mensagem personalizada"
            maxLength={140}
            style={{
              width: "100%",
              background: "var(--container-high)",
              border: "1px solid var(--outline-variant)",
              borderRadius: 10,
              padding: "10px 12px",
              color: "var(--fg)",
              fontFamily: "var(--body)",
              fontSize: 12,
              minHeight: 56,
              resize: "vertical",
              outline: "none",
            }}
          />
          <button
            onClick={() => setSent(true)}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 16 }}
          >
            <Icon name="lightning" size={14} /> Enviar cutucada
          </button>
        </div>
      )}
    </Sheet>
  );
}

/* ---------- Bolões ---------- */
const MY_GROUPS = [
  {
    id: "familia",
    name: "Fam\u00edlia Figueira",
    emoji: "\ud83c\udfe0",
    color: "#95aaff",
    members: [
      { nick: "miltonfigueira", pts: 218, isMe: true },
      { nick: "papai_zeca", pts: 245 },
      { nick: "vovó.lurdes", pts: 187 },
      { nick: "juliana.f", pts: 211 },
      { nick: "thiago.f", pts: 156 },
      { nick: "gepeto", pts: 234, isAI: true },
    ],
    myRank: 3,
    totalRanks: 6,
    gepetoRank: 2,
    description: "S\u00f3 os Figueira. Quem perder paga o churrasco da final.",
    activityCount: 12,
    nextLocked: 2, // members ainda n\u00e3o palpitaram pr\u00f3ximo jogo
  },
  {
    id: "trampo",
    name: "Galera do trampo",
    emoji: "\ud83d\udcbc",
    color: "#4ff325",
    members: [
      { nick: "miltonfigueira", pts: 218, isMe: true },
      { nick: "rafa_dias", pts: 281 },
      { nick: "ana.s", pts: 298 },
      { nick: "thiagomb", pts: 312 },
      { nick: "carol_m", pts: 255 },
      { nick: "gepeto", pts: 234, isAI: true },
      { nick: "luca_p", pts: 267 },
      { nick: "fer_n", pts: 198 },
    ],
    myRank: 7,
    totalRanks: 8,
    gepetoRank: 5,
    description: "Bol\u00e3o oficial do escrit\u00f3rio. Pix de R$ 200 pro 1\u00ba.",
    activityCount: 47,
    nextLocked: 0,
  },
  {
    id: "resenha",
    name: "Resenha do bar",
    emoji: "\ud83c\udf7b",
    color: "#ffc965",
    members: [
      { nick: "miltonfigueira", pts: 218, isMe: true },
      { nick: "matheus.b", pts: 199 },
      { nick: "renata.k", pts: 224 },
      { nick: "gepeto", pts: 234, isAI: true },
      { nick: "pedro.v", pts: 188 },
    ],
    myRank: 3,
    totalRanks: 5,
    gepetoRank: 1,
    description: "Quem errar mais pede a primeira rodada de chopp.",
    activityCount: 8,
    nextLocked: 3,
  },
];

const SUGGESTED_GROUPS = [
  {
    id: "sptotal",
    name: "S\u00e3o Paulo Total",
    emoji: "\ud83c\udfdf\ufe0f",
    members: 247,
    online: 31,
    scope: "S\u00e3o Paulo",
  },
  {
    id: "bra2026",
    name: "Brasil Capit\u00e3o",
    emoji: "\ud83c\udfc6",
    members: 1842,
    online: 312,
    scope: "Brasil",
  },
  {
    id: "vamosgepeto",
    name: "Anti-Gepeto Coalition",
    emoji: "\ud83e\udd16",
    members: 89,
    online: 12,
    scope: "Comunidade",
  },
];

const GROUP_ACTIVITY = {
  trampo: [
    {
      type: "gepeto-shade",
      who: "gepeto",
      target: "rafa_dias",
      text: "Rafa palpitou 3-2 para Brasil. Eu cravei 2-1. Vamos ver quem entende de futebol.",
      when: "agora",
    },
    {
      type: "palpite",
      who: "ana.s",
      pick: "2-1 BRA",
      match: "BRA \u00d7 ARG",
      when: "2 min",
    },
    {
      type: "comment",
      who: "thiagomb",
      text: "Galera, alguma palpita\u00e7\u00e3o de FRA \u00d7 NED? T\u00f4 dividido",
      when: "8 min",
    },
    {
      type: "badge",
      who: "miltonfigueira",
      isMe: true,
      text: "bateu o Gepeto em GER \u00d7 MEX (+10 pts)",
      when: "1h",
    },
    {
      type: "palpite",
      who: "rafa_dias",
      pick: "3-2 BRA",
      match: "BRA \u00d7 ARG",
      when: "1h",
    },
    {
      type: "gepeto-self",
      who: "gepeto",
      text: "Cravei BRA 2-1 ARG. Tá selado. vou brocar!",
      when: "3h",
    },
    { type: "join", who: "luca_p", text: "entrou no bol\u00e3o", when: "ontem" },
  ],
};

function GroupCard({ g, onOpen }) {
  const myPos = g.myRank;
  const beatingGepeto = g.myRank < g.gepetoRank;
  return (
    <button
      onClick={() => onOpen(g.id)}
      className="raised"
      style={{
        textAlign: "left",
        width: "100%",
        padding: 14,
        marginBottom: 10,
        background: "var(--container)",
        cursor: "pointer",
        border: "1px solid var(--outline-variant)",
        display: "block",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* color accent */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: g.color,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 4 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "var(--container-high)",
            border: "1px solid var(--outline-variant)",
            display: "grid",
            placeItems: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {g.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="h-display" style={{ fontSize: 15 }}>
            {g.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginTop: 2,
            }}
          >
            <Icon name="users" size={10} /> {g.members.length} jogadores
            <span
              style={{
                width: 2,
                height: 2,
                borderRadius: 99,
                background: "var(--outline-variant)",
              }}
            />
            <GepetoAvatar size={11} mood="neutral" glow={false} /> incluso
          </div>
        </div>
        <MemberStack members={g.members} size={22} max={3} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginTop: 12,
          paddingLeft: 4,
        }}
      >
        <div
          style={{
            padding: "8px 8px",
            textAlign: "center",
            background: "var(--container-high)",
            borderRadius: 8,
            border: `1px solid ${beatingGepeto ? "rgba(79,243,37,0.35)" : "var(--outline-variant)"}`,
          }}
        >
          <div
            className="num-mono"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: g.myRank <= 3 ? "var(--tertiary)" : "var(--primary)",
            }}
          >
            #{g.myRank}
          </div>
          <div className="label-mono" style={{ fontSize: 8, marginTop: 2 }}>
            VOCÊ
          </div>
        </div>
        <div
          style={{
            padding: "8px 8px",
            textAlign: "center",
            background: "var(--container-high)",
            borderRadius: 8,
            border: "1px solid var(--outline-variant)",
          }}
        >
          <div
            className="num-mono"
            style={{ fontSize: 18, fontWeight: 700, color: "var(--tertiary)" }}
          >
            #{g.gepetoRank}
          </div>
          <div
            className="label-mono"
            style={{
              fontSize: 8,
              marginTop: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <GepetoAvatar size={10} mood="neutral" glow={false} /> GEPETO
          </div>
        </div>
        <div
          style={{
            padding: "8px 8px",
            textAlign: "center",
            background:
              g.nextLocked > 0 ? "rgba(255,201,101,0.08)" : "var(--container-high)",
            borderRadius: 8,
            border: `1px solid ${g.nextLocked > 0 ? "rgba(255,201,101,0.35)" : "var(--outline-variant)"}`,
          }}
        >
          <div
            className="num-mono"
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: g.nextLocked > 0 ? "var(--tertiary)" : "var(--muted)",
            }}
          >
            {g.nextLocked}
          </div>
          <div className="label-mono" style={{ fontSize: 8, marginTop: 2 }}>
            {g.nextLocked > 0 ? "FALTAM" : "OK"}
          </div>
        </div>
      </div>
    </button>
  );
}

function BoloesList({ onOpen, onCreate, onJoin }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 14 }}>
        <div className="h-display" style={{ fontSize: 22, marginBottom: 4 }}>
          Bolões
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Bata seus amigos. E o Gepeto, claro.
        </div>
      </div>

      {/* Create CTAs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <button
          onClick={onCreate}
          className="btn btn-primary"
          style={{ height: 44, flexDirection: "column", gap: 2, padding: "8px 6px" }}
        >
          <span
            style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 12 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Criar bolão
          </span>
        </button>
        <button
          onClick={onJoin}
          className="btn btn-outline"
          style={{ height: 44, padding: "8px 6px", fontSize: 12 }}
        >
          <Icon name="users" size={13} /> Entrar com código
        </button>
      </div>

      {/* My groups */}
      <div className="label-mono" style={{ marginBottom: 8 }}>
        MEUS BOLÕES · {MY_GROUPS.length}
      </div>
      {MY_GROUPS.map((g) => (
        <GroupCard key={g.id} g={g} onOpen={onOpen} />
      ))}

      {/* Suggested */}
      <div className="label-mono" style={{ marginTop: 18, marginBottom: 8 }}>
        SUGESTÕES
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {SUGGESTED_GROUPS.map((g) => (
          <div
            key={g.id}
            className="raised"
            style={{
              padding: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--container-high)",
                border: "1px solid var(--outline-variant)",
                display: "grid",
                placeItems: "center",
                fontSize: 18,
              }}
            >
              {g.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{g.name}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  marginTop: 1,
                }}
              >
                <Icon name="users" size={10} /> {g.members.toLocaleString("pt-BR")}
                <span className="pulse-dot" style={{ width: 4, height: 4 }} />
                <span>{g.online} online</span>
                <span
                  style={{
                    width: 2,
                    height: 2,
                    borderRadius: 99,
                    background: "var(--outline-variant)",
                  }}
                />
                <span>{g.scope}</span>
              </div>
            </div>
            <button
              className="btn btn-outline"
              style={{ height: 30, paddingInline: 12, fontSize: 11 }}
            >
              Entrar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Bolão detail ---------- */
function BolaoDetail({ group, onBack, onInvite, onPoke }) {
  const [tab, setTab] = useState("ranking");
  const sorted = [...group.members].sort((a, b) => b.pts - a.pts);
  const activity = GROUP_ACTIVITY[group.id] || [];
  const meIdx = sorted.findIndex((m) => m.isMe);
  const gepetoIdx = sorted.findIndex((m) => m.isAI);

  return (
    <div>
      {/* Group hero */}
      <div
        style={{
          padding: "14px 16px 16px",
          background: `linear-gradient(180deg, ${group.color}22, transparent)`,
          borderBottom: "1px solid var(--outline-variant)",
        }}
      >
        <button
          onClick={onBack}
          className="btn btn-ghost"
          style={{ height: 28, paddingInline: 4, fontSize: 12, marginBottom: 10 }}
        >
          <Icon name="back" size={14} /> Bolões
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "var(--container-high)",
              border: `1px solid ${group.color}55`,
              display: "grid",
              placeItems: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {group.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="h-display" style={{ fontSize: 18 }}>
              {group.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 3,
                lineHeight: 1.4,
              }}
            >
              {group.description}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 12,
          }}
        >
          <MemberStack members={group.members} size={26} max={5} />
          <div style={{ flex: 1 }} />
          <button
            onClick={onInvite}
            className="btn btn-outline"
            style={{ height: 32, paddingInline: 12, fontSize: 11 }}
          >
            <Icon name="share" size={12} /> Convidar
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div
        className="seg"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          margin: "12px 16px 0",
          width: "calc(100% - 32px)",
        }}
      >
        <button
          className={tab === "ranking" ? "active" : ""}
          onClick={() => setTab("ranking")}
        >
          Ranking
        </button>
        <button
          className={tab === "activity" ? "active" : ""}
          onClick={() => setTab("activity")}
        >
          Atividade
        </button>
        <button className={tab === "next" ? "active" : ""} onClick={() => setTab("next")}>
          Próximo
        </button>
      </div>

      {tab === "ranking" && (
        <div style={{ padding: 16 }}>
          {/* You vs Gepeto in this group */}
          <div
            className="raised"
            style={{
              padding: 12,
              marginBottom: 14,
              background:
                "linear-gradient(90deg, rgba(149,170,255,0.08), transparent 70%)",
              border: "1px solid rgba(149,170,255,0.3)",
            }}
          >
            <div className="label-mono" style={{ marginBottom: 8 }}>
              NESTE BOLÃO
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <UAv nick="miltonfigueira" size={36} />
                <div
                  className="num-mono"
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--primary)",
                    marginTop: 4,
                  }}
                >
                  #{meIdx + 1}
                </div>
              </div>
              <div
                className="h-display"
                style={{
                  fontSize: 16,
                  color: meIdx < gepetoIdx ? "var(--secondary)" : "var(--error)",
                }}
              >
                {meIdx < gepetoIdx ? "BATENDO" : "PERDENDO"}
              </div>
              <div style={{ textAlign: "center" }}>
                <GepetoAvatar
                  size={36}
                  mood={meIdx < gepetoIdx ? "angry" : "smug"}
                  glow={false}
                />
                <div
                  className="num-mono"
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--tertiary)",
                    marginTop: 4,
                  }}
                >
                  #{gepetoIdx + 1}
                </div>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 8,
              }}
            >
              {meIdx < gepetoIdx
                ? `Você está ${gepetoIdx - meIdx} posições à frente do Gepeto`
                : `Você está ${meIdx - gepetoIdx} posições atrás do Gepeto. Bora.`}
            </div>
          </div>

          {/* Full leaderboard */}
          <div className="label-mono" style={{ marginBottom: 8 }}>
            RANKING GERAL
          </div>
          <div style={{ display: "grid", gap: 4 }}>
            {sorted.map((m, i) => {
              const rank = i + 1;
              const isPodium = rank <= 3;
              return (
                <div
                  key={m.nick}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "30px 32px 1fr auto",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    background: m.isMe
                      ? "rgba(149,170,255,0.1)"
                      : m.isAI
                        ? "rgba(255,201,101,0.05)"
                        : "var(--container-high)",
                    border: `1px solid ${m.isMe ? "var(--primary)" : m.isAI ? "rgba(255,201,101,0.25)" : "var(--outline-variant)"}`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    className="num-mono"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color:
                        rank === 1
                          ? "var(--tertiary)"
                          : isPodium
                            ? "var(--primary)"
                            : "var(--muted)",
                      textAlign: "center",
                    }}
                  >
                    {rank === 1
                      ? "\ud83e\udd47"
                      : rank === 2
                        ? "\ud83e\udd48"
                        : rank === 3
                          ? "\ud83e\udd49"
                          : `#${rank}`}
                  </div>
                  {m.isAI ? (
                    <GepetoAvatar size={28} mood="neutral" glow={false} />
                  ) : (
                    <UAv nick={m.nick} size={28} ring={m.isMe} />
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.isAI ? "Gepeto" : `@${m.nick}`}
                      {m.isMe && (
                        <span
                          style={{
                            marginLeft: 6,
                            padding: "1px 5px",
                            borderRadius: 4,
                            background: "var(--primary)",
                            color: "var(--on-primary)",
                            fontFamily: "var(--headline)",
                            fontSize: 7,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                          }}
                        >
                          VOCÊ
                        </span>
                      )}
                      {m.isAI && (
                        <span
                          style={{
                            marginLeft: 6,
                            padding: "1px 5px",
                            borderRadius: 4,
                            background: "rgba(255,201,101,0.2)",
                            color: "var(--tertiary)",
                            fontFamily: "var(--headline)",
                            fontSize: 7,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                          }}
                        >
                          IA
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="num-mono"
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: m.isMe
                        ? "var(--primary)"
                        : m.isAI
                          ? "var(--tertiary)"
                          : "var(--fg)",
                    }}
                  >
                    {m.pts}pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div style={{ padding: 16 }}>
          {activity.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center", color: "var(--muted)" }}>
              <div className="h-display" style={{ fontSize: 14, marginBottom: 4 }}>
                Silêncio sepulcral
              </div>
              <div style={{ fontSize: 12 }}>
                Quando alguém palpitar ou o Gepeto provocar, aparece aqui.
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {activity.map((a, i) => (
                <ActivityRow key={i} a={a} />
              ))}
            </div>
          )}
          {/* Composer */}
          <div
            style={{
              position: "sticky",
              bottom: 12,
              marginTop: 14,
              display: "flex",
              gap: 6,
              alignItems: "center",
              padding: 8,
              background: "rgba(13,19,35,0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--outline-variant)",
              borderRadius: 99,
            }}
          >
            <UAv nick="miltonfigueira" size={28} />
            <input
              placeholder="Manda uma resenha pro grupo..."
              style={{
                flex: 1,
                background: "transparent",
                border: 0,
                color: "var(--fg)",
                fontFamily: "var(--body)",
                fontSize: 13,
                outline: "none",
                padding: "0 6px",
              }}
            />
            <button
              className="btn btn-primary"
              style={{ height: 30, width: 30, padding: 0, borderRadius: 99 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {tab === "next" && <NextMatchInGroup group={group} onPoke={onPoke} />}
    </div>
  );
}

function ActivityRow({ a }) {
  if (a.type === "gepeto-shade" || a.type === "gepeto-self") {
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 12,
          background: "rgba(255,201,101,0.06)",
          border: "1px solid rgba(255,201,101,0.3)",
          borderRadius: 12,
        }}
      >
        <GepetoAvatar
          size={32}
          mood={a.type === "gepeto-shade" ? "smug" : "neutral"}
          glow={false}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--tertiary)" }}>
              Gepeto
            </span>
            {a.target && (
              <>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>provocou</span>
                <span style={{ fontSize: 12, fontWeight: 700 }}>@{a.target}</span>
              </>
            )}
            <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)" }}>
              {a.when}
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--fg)",
              marginTop: 4,
              lineHeight: 1.4,
              fontStyle: "italic",
            }}
          >
            “{a.text}”
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11 }}>
            <button
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              ❤️ 4
            </button>
            <button
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              ✍️ Responder
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (a.type === "palpite") {
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 10,
          background: "var(--container-high)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <UAv nick={a.who} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12 }}>
            <b>@{a.who}</b> palpitou <b style={{ color: "var(--primary)" }}>{a.pick}</b>
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
            {a.match} · {a.when}
          </div>
        </div>
      </div>
    );
  }
  if (a.type === "badge") {
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 10,
          background: "linear-gradient(90deg, rgba(79,243,37,0.1), transparent 70%)",
          border: "1px solid rgba(79,243,37,0.35)",
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 24 }}>🏆</div>
        <div style={{ flex: 1, fontSize: 12 }}>
          <b style={{ color: a.isMe ? "var(--primary)" : "var(--fg)" }}>
            {a.isMe ? "Você" : `@${a.who}`}
          </b>{" "}
          {a.text}
        </div>
        <span style={{ fontSize: 10, color: "var(--muted)" }}>{a.when}</span>
      </div>
    );
  }
  if (a.type === "comment") {
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          padding: 10,
          background: "var(--container-high)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 10,
        }}
      >
        <UAv nick={a.who} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>@{a.who}</span>
            <span style={{ fontSize: 10, color: "var(--muted)" }}>{a.when}</span>
          </div>
          <div
            style={{ fontSize: 12, color: "var(--fg)", marginTop: 2, lineHeight: 1.4 }}
          >
            {a.text}
          </div>
        </div>
      </div>
    );
  }
  if (a.type === "join") {
    return (
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "6px 12px",
          fontSize: 11,
          color: "var(--muted)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <UAv nick={a.who} size={18} />
        <span>
          <b>@{a.who}</b> {a.text} · {a.when}
        </span>
      </div>
    );
  }
  return null;
}

function NextMatchInGroup({ group, onPoke }) {
  // who has and hasn't predicted next match
  const predicted = group.members.slice(0, group.members.length - group.nextLocked);
  const pending = group.members.slice(group.members.length - group.nextLocked);
  return (
    <div style={{ padding: 16 }}>
      {/* Match header */}
      <div className="tcard" style={{ padding: "14px 14px", marginBottom: 14 }}>
        <div className="tcard-bg" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <div className="label-mono" style={{ color: "var(--tertiary)" }}>
            PRÓXIMO JOGO
          </div>
          <CountdownChip />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, lineHeight: 1 }}>{MATCH.home.flag}</div>
            <div className="h-display" style={{ fontSize: 12, marginTop: 4 }}>
              {MATCH.home.code}
            </div>
          </div>
          <div className="h-display" style={{ fontSize: 18, color: "var(--muted)" }}>
            vs
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, lineHeight: 1 }}>{MATCH.away.flag}</div>
            <div className="h-display" style={{ fontSize: 12, marginTop: 4 }}>
              {MATCH.away.code}
            </div>
          </div>
        </div>
      </div>

      {/* Predicted */}
      <div className="label-mono" style={{ marginBottom: 8 }}>
        {predicted.length} JÁ PALPITARAM
      </div>
      <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
        {predicted.map((m) => {
          const pick = mockPick(m.nick);
          return (
            <div
              key={m.nick}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr auto",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: m.isMe
                  ? "rgba(149,170,255,0.08)"
                  : m.isAI
                    ? "rgba(255,201,101,0.06)"
                    : "var(--container-high)",
                border: `1px solid ${m.isMe ? "var(--primary)" : m.isAI ? "rgba(255,201,101,0.3)" : "var(--outline-variant)"}`,
                borderRadius: 10,
              }}
            >
              {m.isAI ? (
                <GepetoAvatar size={28} mood="smug" glow={false} />
              ) : (
                <UAv nick={m.nick} size={28} ring={m.isMe} />
              )}
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.isAI ? "Gepeto" : `@${m.nick}`}
                {m.isMe && " (você)"}
              </div>
              <span
                className="num-mono"
                style={{
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: m.isAI
                    ? "rgba(255,201,101,0.18)"
                    : "var(--container-highest)",
                  color: m.isAI ? "var(--tertiary)" : "var(--fg)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {pick}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <>
          <div className="label-mono" style={{ marginBottom: 8 }}>
            {pending.length} AINDA NÃO PALPITARAM
          </div>
          <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
            {pending.map((m) => (
              <div
                key={m.nick}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  background: "transparent",
                  border: "1px dashed var(--outline-variant)",
                  borderRadius: 10,
                }}
              >
                <UAv nick={m.nick} size={28} />
                <div style={{ fontSize: 12, color: "var(--muted)" }}>@{m.nick}</div>
                <button
                  onClick={() => onPoke?.(m.nick)}
                  className="btn btn-ghost"
                  style={{ height: 26, paddingInline: 8, fontSize: 10 }}
                >
                  Cutucar
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Group consensus */}
      <div className="raised" style={{ padding: 14 }}>
        <div className="h-display" style={{ fontSize: 13, marginBottom: 10 }}>
          Consenso do grupo
        </div>
        <div
          style={{
            display: "flex",
            height: 26,
            borderRadius: 8,
            overflow: "hidden",
            background: "var(--container-high)",
          }}
        >
          <div
            style={{
              width: "60%",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #1ec45aaa, #1ec45a55)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            BRA 60%
          </div>
          <div
            style={{
              width: "25%",
              display: "grid",
              placeItems: "center",
              background: "var(--outline-variant)",
              color: "var(--fg)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            =25%
          </div>
          <div
            style={{
              width: "15%",
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, #7ab8e0aa, #7ab8e055)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            15%
          </div>
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            marginTop: 8,
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
          }}
        >
          <GepetoAvatar size={14} mood="smug" glow={false} />
          Gepeto tá com a maioria nessa.
        </div>
      </div>
    </div>
  );
}

function mockPick(nick) {
  if (nick === "gepeto") return "2-1";
  const picks = ["2-1", "2-2", "3-1", "1-1", "1-0", "2-0", "3-2"];
  let h = 0;
  for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) >>> 0;
  return picks[h % picks.length];
}

function BoloesScreen() {
  const [openId, setOpenId] = useState(null);
  const [sheet, setSheet] = useState(null); // 'create' | 'join' | 'invite' | 'poke'
  const [pokeTarget, setPokeTarget] = useState(null);
  const group = MY_GROUPS.find((g) => g.id === openId);

  const openInvite = () => setSheet("invite");
  const openPoke = (nick) => {
    setPokeTarget(nick);
    setSheet("poke");
  };

  return (
    <>
      {group ? (
        <BolaoDetail
          group={group}
          onBack={() => setOpenId(null)}
          onInvite={openInvite}
          onPoke={openPoke}
        />
      ) : (
        <BoloesList
          onOpen={setOpenId}
          onCreate={() => setSheet("create")}
          onJoin={() => setSheet("join")}
        />
      )}
      <CreateGroupSheet open={sheet === "create"} onClose={() => setSheet(null)} />
      <JoinGroupSheet open={sheet === "join"} onClose={() => setSheet(null)} />
      <InviteSheet
        open={sheet === "invite"}
        onClose={() => setSheet(null)}
        group={group}
      />
      <PokeSheet
        open={sheet === "poke"}
        onClose={() => setSheet(null)}
        target={pokeTarget}
        match={"BRA × ARG"}
      />
    </>
  );
}

/* ---------- Home / Hub screen ---------- */
const RANKING_DATA = [
  { rank: 1, nick: "thiagomb", wins: 14, pts: 312, streak: 5 },
  { rank: 2, nick: "ana.s", wins: 13, pts: 298, streak: 3 },
  { rank: 3, nick: "rafa_dias", wins: 12, pts: 281, streak: 4 },
  { rank: 4, nick: "luca_p", wins: 11, pts: 267, streak: 2 },
  { rank: 5, nick: "carol_m", wins: 10, pts: 255 },
  { rank: 7, nick: "miltonfigueira", wins: 8, pts: 218, streak: 6, isMe: true },
];

function CountdownChip({ time = "3h 12min" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 9px",
        borderRadius: 99,
        background: "rgba(255,201,101,0.12)",
        color: "var(--tertiary)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      <Icon name="clock" size={11} /> {time}
    </span>
  );
}

function HomeScreen({ onGoTo }) {
  const m = MATCH;
  return (
    <div style={{ padding: 16 }}>
      {/* Hero: próximo duelo */}
      <div
        className="tcard fade-up"
        style={{ marginBottom: 14, padding: 0, overflow: "hidden" }}
      >
        <div className="tcard-bg" />
        <div className="tcard-foil" />
        <div style={{ padding: "18px 16px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <div className="label-mono" style={{ color: "var(--tertiary)" }}>
              PRÓXIMO DUELO
            </div>
            <CountdownChip />
          </div>
          <div
            style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, lineHeight: 1 }}>{m.home.flag}</div>
              <div className="h-display" style={{ fontSize: 13, marginTop: 4 }}>
                {m.home.code}
              </div>
            </div>
            <div className="h-display" style={{ fontSize: 18, color: "var(--muted)" }}>
              vs
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, lineHeight: 1 }}>{m.away.flag}</div>
              <div className="h-display" style={{ fontSize: 13, marginTop: 4 }}>
                {m.away.code}
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "var(--muted)",
              marginTop: 12,
            }}
          >
            {m.phase} · {m.stadium}
          </div>
        </div>

        {/* Gepeto vs You strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 10,
            margin: "16px 14px 0",
            padding: "12px 12px",
            background: "rgba(9,14,28,0.55)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GepetoAvatar size={36} mood="smug" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Gepeto</div>
              <div
                className="num-mono"
                style={{
                  fontSize: 16,
                  color: "var(--tertiary)",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                74%
              </div>
              <div className="label-mono" style={{ fontSize: 8, marginTop: 2 }}>
                ACERTOS
              </div>
            </div>
          </div>
          <div className="h-display" style={{ fontSize: 18, color: "var(--muted)" }}>
            ×
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <div style={{ minWidth: 0, textAlign: "right" }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Você</div>
              <div
                className="num-mono"
                style={{
                  fontSize: 16,
                  color: "var(--primary)",
                  fontWeight: 700,
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                68%
              </div>
              <div className="label-mono" style={{ fontSize: 8, marginTop: 2 }}>
                ACERTOS
              </div>
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 99,
                background: "var(--primary)",
                color: "var(--on-primary)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--headline)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              MI
            </div>
          </div>
        </div>

        <div style={{ padding: 14 }}>
          <button
            onClick={() => onGoTo("match")}
            className="btn btn-primary"
            style={{ width: "100%" }}
          >
            <Icon name="lightning" size={14} /> Ir para o duelo
          </button>
          <button
            onClick={() => onGoTo("fixtures")}
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: 4, height: 36, fontSize: 12 }}
          >
            Ver todos os jogos da Copa <Icon name="chevronRight" size={12} />
          </button>
        </div>
      </div>

      {/* Bolões preview */}
      <div className="raised fade-up" style={{ padding: 14, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div
            className="h-display"
            style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <Icon name="users" size={13} color="var(--primary)" /> Seus bolões
          </div>
          <button
            onClick={() => onGoTo("boloes")}
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              color: "var(--primary)",
              fontSize: 11,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Ver todos <Icon name="chevronRight" size={12} />
          </button>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {MY_GROUPS.slice(0, 2).map((g) => (
            <button
              key={g.id}
              onClick={() => onGoTo("boloes")}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr auto",
                alignItems: "center",
                gap: 10,
                background: "var(--container-high)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 10,
                padding: "8px 10px",
                cursor: "pointer",
                textAlign: "left",
                color: "var(--fg)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "var(--container-highest)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 18,
                }}
              >
                {g.emoji}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {g.name}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>
                  #{g.myRank} de {g.totalRanks} · Gepeto #{g.gepetoRank}
                </div>
              </div>
              {g.nextLocked > 0 && (
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: 6,
                    background: "rgba(255,201,101,0.15)",
                    color: "var(--tertiary)",
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {g.nextLocked} · falta
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* This week summary */}
      <div className="raised fade-up" style={{ padding: 14, marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div className="h-display" style={{ fontSize: 13 }}>
            Capítulo 3 · Quartas
          </div>
          <button
            onClick={() => onGoTo("weekly")}
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              color: "var(--primary)",
              fontSize: 11,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Ler capítulo <Icon name="chevronRight" size={12} />
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,201,101,0.08)",
              border: "1px solid rgba(255,201,101,0.35)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <GepetoAvatar size={22} mood="smug" glow={false} />
              <span className="label-mono" style={{ fontSize: 8 }}>
                GEPETO
              </span>
            </div>
            <div
              className="num-mono"
              style={{
                fontSize: 28,
                color: "var(--tertiary)",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              11<span style={{ color: "var(--muted)", fontSize: 14 }}>/16</span>
            </div>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(149,170,255,0.08)",
              border: "1px solid rgba(149,170,255,0.35)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <Icon name="users" size={14} color="var(--primary)" />
              <span className="label-mono" style={{ fontSize: 8 }}>
                HUMANOS
              </span>
            </div>
            <div
              className="num-mono"
              style={{
                fontSize: 28,
                color: "var(--primary)",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              9<span style={{ color: "var(--muted)", fontSize: 14 }}>/16</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streak preview */}
      <StreakStrip />

      {/* Tiny social proof */}
      <div
        style={{
          padding: "12px 14px",
          background: "linear-gradient(90deg, rgba(79,243,37,0.08), transparent 70%)",
          border: "1px solid rgba(79,243,37,0.25)",
          borderRadius: 12,
          display: "flex",
          gap: 10,
          alignItems: "center",
          fontSize: 12,
          color: "var(--fg)",
        }}
      >
        <Icon name="flame" size={16} color="var(--secondary)" />
        <div style={{ flex: 1 }}>
          <b>1.247 jogadores</b> bateram o Gepeto essa semana.
        </div>
        <button
          onClick={() => onGoTo("ranking")}
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: "pointer",
            color: "var(--secondary)",
            fontSize: 11,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          ranking <Icon name="chevronRight" size={11} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Ranking / vs Gepeto ---------- */
function RankingScreen() {
  const [scope, setScope] = useState("week");
  return (
    <div style={{ padding: 16 }}>
      {/* Hero scoreboard: you vs gepeto cumulative */}
      <div
        className="tcard fade-up"
        style={{ padding: 0, marginBottom: 14, overflow: "hidden" }}
      >
        <div
          className="tcard-bg"
          style={{
            background:
              "linear-gradient(135deg, rgba(149,170,255,0.18), rgba(13,19,35,1) 70%)",
          }}
        />
        <div style={{ padding: "16px 16px 0" }}>
          <div className="label-mono" style={{ color: "var(--primary)" }}>
            VOCÊ × GEPETO
          </div>
          <div className="h-display" style={{ fontSize: 18, marginTop: 4 }}>
            O dossiê da rivalidade
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 14,
            margin: "14px 14px 0",
            padding: "14px 14px",
            background: "rgba(9,14,28,0.55)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 14,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 99,
                background: "var(--primary)",
                color: "var(--on-primary)",
                margin: "0 auto",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--headline)",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              MI
            </div>
            <div
              className="h-display num-mono"
              style={{
                fontSize: 38,
                marginTop: 6,
                color: "var(--primary)",
                letterSpacing: "-0.02em",
              }}
            >
              8
            </div>
            <div className="label-mono" style={{ fontSize: 8 }}>
              VITÓRIAS
            </div>
          </div>
          <div className="h-display" style={{ fontSize: 18, color: "var(--muted)" }}>
            ×
          </div>
          <div style={{ textAlign: "center" }}>
            <GepetoAvatar size={38} mood="angry" glow={false} />
            <div
              className="h-display num-mono"
              style={{
                fontSize: 38,
                marginTop: 6,
                color: "var(--tertiary)",
                letterSpacing: "-0.02em",
              }}
            >
              8
            </div>
            <div className="label-mono" style={{ fontSize: 8 }}>
              VITÓRIAS
            </div>
          </div>
        </div>
        <div
          style={{
            padding: "12px 14px",
            marginTop: 12,
            borderTop: "1px solid var(--outline-variant)",
            background: "rgba(9,14,28,0.35)",
            fontSize: 12,
            color: "var(--fg)",
            textAlign: "center",
          }}
        >
          Tá <b style={{ color: "var(--tertiary)" }}>empatado</b>. A próxima rodada
          desempata.
        </div>
      </div>

      {/* Scope tabs */}
      <div
        className="seg"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          width: "100%",
          marginBottom: 12,
        }}
      >
        <button
          className={scope === "week" ? "active" : ""}
          onClick={() => setScope("week")}
        >
          Semana
        </button>
        <button
          className={scope === "cup" ? "active" : ""}
          onClick={() => setScope("cup")}
        >
          Copa
        </button>
        <button
          className={scope === "city" ? "active" : ""}
          onClick={() => setScope("city")}
        >
          Cidade
        </button>
      </div>

      {/* Leaderboard */}
      <div className="raised" style={{ padding: 12, marginBottom: 14 }}>
        <div
          style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}
        >
          <div className="h-display" style={{ fontSize: 13 }}>
            Quem bateu mais o Gepeto
          </div>
          <span className="label-mono" style={{ fontSize: 9 }}>
            {scope === "week" ? "SEMANA 3" : scope === "cup" ? "COPA 2026" : "SÃO PAULO"}
          </span>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {RANKING_DATA.map((u) => (
            <div
              key={u.nick}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 32px 1fr auto auto",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: u.isMe ? "rgba(149,170,255,0.1)" : "var(--container-high)",
                border: `1px solid ${u.isMe ? "var(--primary)" : "var(--outline-variant)"}`,
                borderRadius: 10,
              }}
            >
              <div
                className="num-mono"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color:
                    u.rank === 1
                      ? "var(--tertiary)"
                      : u.rank <= 3
                        ? "var(--primary)"
                        : "var(--muted)",
                }}
              >
                #{u.rank}
              </div>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 99,
                  background: `hsl(${(u.nick.charCodeAt(0) * 13) % 360} 40% 35%)`,
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--headline)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {u.nick.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  @{u.nick}
                  {u.isMe && (
                    <span
                      style={{
                        marginLeft: 6,
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: "var(--primary)",
                        color: "var(--on-primary)",
                        fontFamily: "var(--headline)",
                        fontSize: 7,
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                      }}
                    >
                      VOCÊ
                    </span>
                  )}
                </div>
                {u.streak && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Icon name="flame" size={9} color="var(--tertiary)" /> {u.streak}{" "}
                    streak
                  </div>
                )}
              </div>
              <div
                className="num-mono"
                style={{
                  fontSize: 13,
                  color: "var(--secondary)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {u.wins}×
              </div>
              <div
                className="num-mono"
                style={{
                  fontSize: 13,
                  color: "var(--fg)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {u.pts}pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match-by-match badges */}
      <div className="raised" style={{ padding: 14, marginBottom: 14 }}>
        <div className="h-display" style={{ fontSize: 13, marginBottom: 10 }}>
          Sua história contra o Gepeto
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 5,
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const won = [0, 2, 3, 5, 7, 9, 12, 14].includes(i);
            const tie = [1, 8].includes(i);
            return (
              <div
                key={i}
                title={`Rodada ${i + 1}`}
                style={{
                  aspectRatio: "1/1",
                  borderRadius: 6,
                  background: won
                    ? "linear-gradient(160deg, rgba(79,243,37,0.3), rgba(255,201,101,0.15))"
                    : tie
                      ? "var(--container-highest)"
                      : "rgba(255,110,132,0.12)",
                  border: `1px solid ${won ? "var(--secondary)" : tie ? "var(--outline-variant)" : "rgba(255,110,132,0.35)"}`,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  color: won ? "var(--secondary)" : tie ? "var(--muted)" : "var(--error)",
                }}
              >
                {won ? "✓" : tie ? "=" : "✗"}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            marginTop: 10,
            fontSize: 10,
            color: "var(--muted)",
          }}
        >
          <span>
            <b style={{ color: "var(--secondary)" }}>✓</b> bateu
          </span>
          <span>
            <b style={{ color: "var(--muted)" }}>=</b> empate
          </span>
          <span>
            <b style={{ color: "var(--error)" }}>✗</b> perdeu
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Match palpite screen wrapper ---------- */
function MatchScreen({ state, tweaks }) {
  const [palpite, setPalpite] = useState({ home: 2, away: 2 });
  const [confirmed, setConfirmed] = useState(state !== "preMatch");
  const showVerdict = state === "postMatch";

  // sync confirmed when state changes from tweaks
  useEffect(() => {
    if (state !== "preMatch") setConfirmed(true);
    else setConfirmed(false);
  }, [state]);

  return (
    <div>
      <MatchHeader match={MATCH} state={state} />

      <div style={{ padding: "0 16px 30px" }}>
        {showVerdict &&
          (() => {
            const userExact =
              USER_PREDICTION.home === MATCH_RESULT.home &&
              USER_PREDICTION.away === MATCH_RESULT.away;
            const gepetoExact = gepetoCorrect(MATCH.gepeto);
            const userWinner =
              USER_PREDICTION.home > USER_PREDICTION.away ===
              MATCH_RESULT.home > MATCH_RESULT.away;
            const userPts = userExact ? 25 : userWinner ? 10 : 0;
            const gepetoPts = gepetoExact ? 25 : 10;
            return userPts > gepetoPts ? <AIBadge visible /> : null;
          })()}
        {showVerdict && <VerdictBanner match={MATCH} palpite={USER_PREDICTION} />}

        <YourPalpite
          match={MATCH}
          state={state}
          palpite={state === "postMatch" ? USER_PREDICTION : palpite}
          setPalpite={setPalpite}
          onConfirm={() => setConfirmed(true)}
          confirmed={confirmed}
        />

        <GepetoCard match={MATCH} state={state} userConfirmed={confirmed} />

        <CommunityBar community={MATCH.community} match={MATCH} />

        {tweaks.showStreak && <StreakStrip />}
      </div>
    </div>
  );
}

/* ---------- Header / tabs ---------- */
function GepetoHeader({ view, onView }) {
  return (
    <div className="tab-switcher" style={{ padding: "10px 14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <a
          href="Perfis.html"
          style={{
            color: "var(--muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <Icon name="back" size={14} /> Voltar
        </a>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <GepetoAvatar size={28} mood="neutral" glow={false} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span className="h-display" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
              Gepeto
            </span>
            <span
              className="label-mono"
              style={{ fontSize: 8, lineHeight: 1, whiteSpace: "nowrap" }}
            >
              HUMANO × IA
            </span>
          </div>
        </div>
        <div style={{ width: 50 }} />
      </div>
      <div
        className="seg"
        style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", width: "100%" }}
      >
        <button
          className={view === "home" ? "active" : ""}
          onClick={() => onView("home")}
          style={{ padding: "8px 4px", fontSize: 11 }}
        >
          Hub
        </button>
        <button
          className={view === "fixtures" ? "active" : ""}
          onClick={() => onView("fixtures")}
          style={{ padding: "8px 4px", fontSize: 11 }}
        >
          Jogos
        </button>
        <button
          className={view === "boloes" ? "active" : ""}
          onClick={() => onView("boloes")}
          style={{ padding: "8px 4px", fontSize: 11 }}
        >
          Bolões
        </button>
        <button
          className={view === "weekly" ? "active" : ""}
          onClick={() => onView("weekly")}
          style={{ padding: "8px 4px", fontSize: 11 }}
        >
          Capítulo
        </button>
        <button
          className={view === "ranking" ? "active" : ""}
          onClick={() => onView("ranking")}
          style={{ padding: "8px 4px", fontSize: 11 }}
        >
          Vs IA
        </button>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("home");

  return (
    <>
      <div
        className="device"
        data-screen-label={
          view === "home"
            ? "Gepeto · Hub"
            : view === "match"
              ? "Gepeto · Partida"
              : view === "weekly"
                ? "Gepeto · Capítulo semanal"
                : "Gepeto · Ranking vs IA"
        }
      >
        <div className="device-inner">
          <GepetoHeader view={view} onView={setView} />
          {view === "home" && <HomeScreen onGoTo={setView} />}
          {view === "fixtures" && <FixturesScreen onOpenMatch={() => setView("match")} />}
          {view === "boloes" && <BoloesScreen />}
          {view === "match" && (
            <>
              <div style={{ padding: "8px 16px 0" }}>
                <button
                  onClick={() => setView("fixtures")}
                  className="btn btn-ghost"
                  style={{ height: 28, paddingInline: 4, fontSize: 12 }}
                >
                  <Icon name="back" size={14} /> Todos os jogos
                </button>
              </div>
              <MatchScreen state={tweaks.matchState} tweaks={tweaks} />
            </>
          )}
          {view === "weekly" && <WeeklyNarrative />}
          {view === "ranking" && <RankingScreen />}
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Partida">
          <TweakRadio
            label="Momento"
            value={tweaks.matchState}
            onChange={(v) => setTweak("matchState", v)}
            options={[
              { value: "preMatch", label: "Antes" },
              { value: "live", label: "Ao vivo" },
              { value: "postMatch", label: "Final" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Extras">
          <TweakToggle
            label="Streak vs Gepeto"
            value={tweaks.showStreak}
            onChange={(v) => setTweak("showStreak", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
