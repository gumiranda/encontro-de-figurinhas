// ─────────────────────────────────────────────────────────────
// THE MARK — recreated from the user's logo as a clean,
// scalable SVG so we can render it at any size on any background.
// Two parallelogram "stickers" tilted toward each other (cyan + lime)
// with white arrows and a navy center dot.
// ─────────────────────────────────────────────────────────────

function FFMark({ size = 200, monochrome = null }) {
  // monochrome: null | "white" | "navy" | "lime"
  const isMono = !!monochrome;
  const fillCyan = isMono ? monochrome === "white" ? "#fff" : monochrome === "navy" ? "#103e85" : "#7ed635" : "#2cb1e6";
  const fillLime = isMono ? monochrome === "white" ? "#fff" : monochrome === "navy" ? "#103e85" : "#7ed635" : "#7ed635";
  const stroke   = isMono ? monochrome === "white" ? "#fff" : "#0a2a5e" : "#0a2a5e";
  const arrow    = isMono ? monochrome === "white" ? "#0a2a5e" : "#fff" : "#fff";
  const dot      = isMono ? monochrome === "white" ? "#0a2a5e" : "#fff" : "#0a2a5e";

  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 200 144" fill="none" xmlns="http://www.w3.org/2000/svg" className="mark-svg">
      {/* Left sticker (cyan) — parallelogram tilted right-leaning at top */}
      <g>
        <path
          d="M 38 18 L 96 14 L 100 116 L 34 124 Z"
          fill={fillCyan}
          stroke={stroke}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Arrow pointing right (toward center) */}
        <path
          d="M 56 70 L 78 70 M 78 70 L 70 62 M 78 70 L 70 78"
          stroke={arrow} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      {/* Right sticker (lime) — parallelogram leaning the other way */}
      <g>
        <path
          d="M 100 14 L 162 18 L 166 124 L 100 116 Z"
          fill={fillLime}
          stroke={stroke}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Arrow pointing left (toward center) */}
        <path
          d="M 144 70 L 122 70 M 122 70 L 130 62 M 122 70 L 130 78"
          stroke={arrow} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
      {/* Center dot */}
      <circle cx="100" cy="70" r="11" fill={dot} stroke={isMono && monochrome === "white" ? "#fff" : stroke} strokeWidth="3" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// LOCKUPS — Mark + wordmark in different arrangements
// ─────────────────────────────────────────────────────────────

function FFLockup({ variant = "stack", size = "lg", surface = "navy" }) {
  // surface: "navy" | "paper" | "lime"
  const wordColor = surface === "navy" ? "#fff" : surface === "lime" ? "#0a2a5e" : "#103e85";
  const accent    = surface === "navy" ? "#7ed635" : surface === "lime" ? "#fff" : "#7ed635";
  const tagline   = surface === "navy" ? "rgba(255,255,255,0.55)" : "rgba(10,21,48,0.55)";
  const tagAccent = surface === "navy" ? "#7ed635" : "#103e85";

  const fontSize = size === "xl" ? 96 : size === "lg" ? 64 : size === "md" ? 42 : 28;
  const markSize = size === "xl" ? 240 : size === "lg" ? 160 : size === "md" ? 100 : 64;

  const monoMark =
    surface === "lime" ? "navy" :
    null;

  if (variant === "stack") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: fontSize * 0.18 }}>
        <FFMark size={markSize} monochrome={monoMark} />
        <div className="wordmark" style={{ fontSize, lineHeight: 0.85 }}>
          <span style={{ color: wordColor }}>figurinha</span>
          <span style={{ color: accent }}>fácil</span>
        </div>
        {size !== "sm" && (
          <div style={{ display: "flex", gap: 8, marginTop: fontSize * 0.1, alignItems: "center" }}>
            <span className="ff-mono" style={{
              fontSize: fontSize * 0.16, fontWeight: 700,
              color: tagline, letterSpacing: "0.28em", textTransform: "uppercase",
            }}>
              TROCA · COPA ·
            </span>
            <span className="ff-mono" style={{
              fontSize: fontSize * 0.16, fontWeight: 800, color: tagAccent,
            }}>
              2026
            </span>
          </div>
        )}
      </div>
    );
  }

  // horizontal lockup
  return (
    <div style={{ display: "flex", alignItems: "center", gap: fontSize * 0.32 }}>
      <FFMark size={markSize} monochrome={monoMark} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.9 }}>
        <div className="wordmark" style={{ fontSize }}>
          <span style={{ color: wordColor }}>figurinha</span>
          <span style={{ color: accent }}>fácil</span>
        </div>
        {size !== "sm" && (
          <span className="ff-mono" style={{
            fontSize: fontSize * 0.16, fontWeight: 700,
            color: tagline, letterSpacing: "0.24em", textTransform: "uppercase",
            marginTop: fontSize * 0.18,
          }}>
            troca · copa · <span style={{ color: tagAccent, fontWeight: 800 }}>2026</span>
          </span>
        )}
      </div>
    </div>
  );
}

// Mark dimensioned for use in headers, avatars, app icons — squircle host
function FFAppIcon({ size = 200 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.225,
      background: "linear-gradient(160deg, #103e85 0%, #0a2a5e 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 ${size * 0.08}px ${size * 0.15}px -${size * 0.05}px rgba(10,21,48,0.6), inset 0 1px 0 rgba(255,255,255,0.15)`,
      position: "relative", overflow: "hidden",
    }}>
      <FFMark size={size * 0.7} />
      {/* subtle gloss */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "55%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), transparent)",
        pointerEvents: "none",
      }}/>
    </div>
  );
}

Object.assign(window, { FFMark, FFLockup, FFAppIcon });
