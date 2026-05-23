/* global React, ReactDOM */
const { useState, useMemo, useEffect, useRef } = React;

/* ---------- Icons ---------- */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "lightning": return <svg {...c} fill="currentColor" stroke="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "trophy": return <svg {...c}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
    case "flame": return <svg {...c} fill="currentColor" stroke="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
    case "users": return <svg {...c}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "check": return <svg {...c}><polyline points="20 6 9 17 4 12"/></svg>;
    case "x": return <svg {...c}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "clock": return <svg {...c}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case "lock": return <svg {...c}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "sparkles": return <svg {...c} fill="currentColor" stroke="none"><path d="M12 3l1.9 5.5L19 10l-5.1 1.5L12 17l-1.9-5.5L5 10l5.1-1.5L12 3z"/></svg>;
    case "share": return <svg {...c}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
    case "chevronRight": return <svg {...c}><polyline points="9 18 15 12 9 6"/></svg>;
    case "arrowRight": return <svg {...c}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "phone": return <svg {...c}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
    case "play": return <svg {...c} fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    default: return null;
  }
};

/* ---------- Gepeto avatar (reuse from app) ---------- */
function GepetoAvatar({ size = 56, mood = "neutral", glow = true }) {
  const eyeY = mood === "thinking" ? 14 : 13;
  const eyeShape = mood === "happy" ? "happy" : mood === "angry" ? "angry" : "round";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {glow && (
        <div style={{
          position: "absolute", inset: -size * 0.15,
          background: `radial-gradient(circle, ${mood === "angry" ? "rgba(255,110,132,0.4)" : mood === "happy" ? "rgba(79,243,37,0.4)" : "rgba(149,170,255,0.4)"}, transparent 70%)`,
          filter: "blur(8px)", zIndex: -1,
        }} />
      )}
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={`g-body-${size}-${mood}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e253b" />
            <stop offset="100%" stopColor="#0d1323" />
          </linearGradient>
          <linearGradient id={`g-screen-${size}-${mood}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1a2547" />
            <stop offset="100%" stopColor="#0d1323" />
          </linearGradient>
        </defs>
        <line x1="16" y1="3" x2="16" y2="6" stroke="#a6aabf" strokeWidth="0.6" />
        <circle cx="16" cy="2.6" r="1.2" fill="var(--secondary)">
          {mood === "thinking" && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>}
        </circle>
        <rect x="5" y="6" width="22" height="20" rx="4" fill={`url(#g-body-${size}-${mood})`} stroke="var(--primary)" strokeWidth="0.7" />
        <rect x="7.5" y="9.5" width="17" height="11" rx="2.5" fill={`url(#g-screen-${size}-${mood})`} stroke="var(--outline-variant)" strokeWidth="0.4" />
        {eyeShape === "round" && (<>
          <circle cx="12.5" cy={eyeY} r="1.4" fill="var(--primary)" />
          <circle cx="19.5" cy={eyeY} r="1.4" fill="var(--primary)" />
        </>)}
        {eyeShape === "happy" && (<>
          <path d={`M11 ${eyeY} q1.5 -1.6 3 0`} stroke="var(--secondary)" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d={`M18 ${eyeY} q1.5 -1.6 3 0`} stroke="var(--secondary)" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </>)}
        {eyeShape === "angry" && (<>
          <path d="M11 12.5 l3 1.5" stroke="var(--error)" strokeWidth="1" strokeLinecap="round"/>
          <path d="M21 12.5 l-3 1.5" stroke="var(--error)" strokeWidth="1" strokeLinecap="round"/>
          <circle cx="12.5" cy="14" r="1" fill="var(--error)" />
          <circle cx="19.5" cy="14" r="1" fill="var(--error)" />
        </>)}
        {mood === "happy" && <path d="M13 17.5 q3 2 6 0" stroke="var(--secondary)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>}
        {mood === "angry" && <path d="M13 18 q3 -1.5 6 0" stroke="var(--error)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>}
        {mood === "smug" && <path d="M13 17.5 q3 1 6 -0.5" stroke="var(--tertiary)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>}
        {(mood === "neutral" || mood === "thinking") && <line x1="13" y1="17.5" x2="19" y2="17.5" stroke="var(--muted)" strokeWidth="0.7" strokeLinecap="round"/>}
        <circle cx="16" cy="23" r="0.8" fill={mood === "angry" ? "var(--error)" : mood === "happy" ? "var(--secondary)" : "var(--primary)"} />
        <rect x="3.5" y="12" width="1.5" height="6" rx="0.5" fill="var(--outline-variant)" />
        <rect x="27" y="12" width="1.5" height="6" rx="0.5" fill="var(--outline-variant)" />
        <path d="M4 9 L28 9 L28 7.5 Q16 5.5 4 7.5 Z" fill={mood === "angry" ? "var(--error)" : "var(--primary-dim)"} opacity="0.75" />
      </svg>
    </div>
  );
}

/* ---------- Counter that animates ---------- */
function CountUp({ to, duration = 1200, suffix = "", prefix = "" }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start, raf;
    const step = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{prefix}{v.toLocaleString("pt-BR")}{suffix}</>;
}

/* ---------- NAV ---------- */
function Nav() {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "rgba(9,14,28,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--outline-variant)",
    }}>
      <div className="lp" style={{
        paddingTop: 14, paddingBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="Perfis.html" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--fg)", textDecoration: "none",
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, var(--primary), var(--primary-dim))",
            color: "var(--on-primary)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="trophy" size={15} />
          </span>
          <span className="h-display" style={{ fontSize: 16 }}>Figurinha Fácil</span>
        </a>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="#como" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", display: "none" }} className="nav-link">Como funciona</a>
          <a href="Gepeto.html" className="btn btn-primary" style={{ height: 36, paddingInline: 14, fontSize: 13 }}>
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section style={{ padding: "48px 0 56px", position: "relative" }}>
      {/* background blobs */}
      <div style={{
        position: "absolute", top: -100, left: "10%", width: 360, height: 360,
        background: "radial-gradient(circle, rgba(149,170,255,0.18), transparent 70%)",
        filter: "blur(40px)", zIndex: -1,
      }} />
      <div style={{
        position: "absolute", top: 100, right: "5%", width: 300, height: 300,
        background: "radial-gradient(circle, rgba(255,201,101,0.12), transparent 70%)",
        filter: "blur(40px)", zIndex: -1,
      }} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: 56, alignItems: "center",
      }} className="hero-grid">
        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr; gap: 32px; }
            .hero-headline { font-size: 56px !important; }
            .hero-headline-mega { font-size: 72px !important; }
          }
          @media (max-width: 520px) {
            .hero-headline { font-size: 40px !important; }
            .hero-headline-mega { font-size: 52px !important; }
          }
          @keyframes typing { 0%, 60% { opacity: 1 } 80%, 100% { opacity: 0 } }
          @keyframes scoreTick { 0%, 100% { transform: translateY(0); opacity: 1 } 45% { transform: translateY(-100%); opacity: 0 } 55% { transform: translateY(100%); opacity: 0 } }
          @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-8px) rotate(0.5deg) } }
        `}</style>

        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 99,
            background: "rgba(255,201,101,0.12)",
            border: "1px solid rgba(255,201,101,0.4)",
            color: "var(--tertiary)",
            fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            marginBottom: 24,
          }}>
            <span className="pulse-dot" style={{ background: "var(--tertiary)", boxShadow: "0 0 12px var(--tertiary)" }} />
            Copa 2026 · Quartas começando
          </div>

          <h1 className="h-display hero-headline-mega" style={{
            fontSize: 88,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: 0,
            color: "var(--fg)",
          }}>
            Bata o<br />
            <span style={{
              background: "linear-gradient(120deg, var(--tertiary), #ffb74d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              robô
            </span>{" "}
            no palpite.
          </h1>

          <p style={{
            fontSize: 18, lineHeight: 1.5,
            color: "var(--muted)",
            maxWidth: 480, marginTop: 24,
          }}>
            O <b style={{ color: "var(--tertiary)" }}>Gepeto</b> é a IA da Figurinha Fácil. Ele palpita em todos os jogos da Copa antes de você, com análise técnica e provocação. Sua missão: acertar mais que a máquina.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
            <a href="Gepeto.html" className="btn btn-primary" style={{
              height: 52, paddingInline: 24, fontSize: 15,
              boxShadow: "0 10px 30px -8px rgba(149,170,255,0.4)",
            }}>
              <Icon name="lightning" size={16} /> Desafiar agora
            </a>
            <a href="#como" className="btn btn-outline" style={{
              height: 52, paddingInline: 24, fontSize: 14,
            }}>
              Como funciona
            </a>
          </div>

          {/* social proof */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            marginTop: 32,
            color: "var(--muted)", fontSize: 12,
          }}>
            <div style={{ display: "flex" }}>
              {["thiagomb", "ana.s", "rafa_dias", "luca_p"].map((nick, i) => {
                let h = 0;
                for (let j = 0; j < nick.length; j++) h = (h * 31 + nick.charCodeAt(j)) % 360;
                return (
                  <div key={nick} style={{
                    width: 28, height: 28, borderRadius: 99,
                    background: `hsl(${h} 45% 35%)`,
                    border: "2px solid var(--bg)",
                    color: "white", fontFamily: "var(--headline)",
                    fontSize: 11, fontWeight: 700,
                    display: "grid", placeItems: "center",
                    marginLeft: i === 0 ? 0 : -8,
                  }}>{nick.slice(0, 2).toUpperCase()}</div>
                );
              })}
            </div>
            <span>
              <b style={{ color: "var(--secondary)" }}><CountUp to={1247} /></b> bateram o Gepeto esta semana
            </span>
          </div>
        </div>

        {/* Hero: live scoreboard mock */}
        <HeroBoard />
      </div>
    </section>
  );
}

function HeroBoard() {
  // animated ticking scoreboard
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(t);
  }, []);
  const gepetoScores = [11, 12, 11];
  const humanScores = [9, 9, 10];
  return (
    <div style={{
      position: "relative",
      animation: "float 6s ease-in-out infinite",
    }}>
      {/* Floating quote bubble */}
      <div style={{
        position: "absolute", top: -28, left: -16,
        padding: "10px 14px",
        background: "var(--container)",
        border: "1px solid var(--tertiary)",
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        maxWidth: 260,
        fontSize: 13, lineHeight: 1.4,
        color: "var(--fg)",
        fontStyle: "italic",
        zIndex: 2,
        boxShadow: "0 14px 40px -10px rgba(0,0,0,0.6)",
      }}>
        <span style={{ color: "var(--tertiary)", fontFamily: "var(--headline)", fontSize: 22, opacity: 0.5, marginRight: 2 }}>"</span>
        Cravei Brasil 2-1. Quem discorda, abre o Excel.
      </div>

      <div className="tcard" style={{
        padding: 28, borderRadius: 24,
        boxShadow: "0 20px 60px -20px rgba(0,0,0,0.7)",
      }}>
        <div className="tcard-bg" />
        <div className="tcard-foil" />
        <div className="tcard-grid" />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22,
        }}>
          <div className="label-mono" style={{ color: "var(--tertiary)" }}>SEMANA 3 · AO VIVO</div>
          <span className="pulse-dot" />
        </div>

        {/* scoreboard */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr",
          gap: 18, alignItems: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <GepetoAvatar size={64} mood="smug" />
            <div className="h-display num-mono" key={tick} style={{
              fontSize: 64, marginTop: 10,
              color: "var(--tertiary)",
              letterSpacing: "-0.04em", lineHeight: 1,
              transition: "all 0.3s",
            }}>{gepetoScores[tick % 3]}</div>
            <div className="label-mono" style={{ fontSize: 9, marginTop: 6 }}>GEPETO</div>
          </div>
          <div className="h-display" style={{ fontSize: 28, color: "var(--muted)" }}>×</div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "linear-gradient(135deg, var(--primary), var(--primary-dim))",
              color: "var(--on-primary)",
              margin: "0 auto",
              display: "grid", placeItems: "center",
              boxShadow: "0 0 0 4px rgba(149,170,255,0.2)",
            }}>
              <Icon name="users" size={28} />
            </div>
            <div className="h-display num-mono" key={`h-${tick}`} style={{
              fontSize: 64, marginTop: 10,
              color: "var(--primary)",
              letterSpacing: "-0.04em", lineHeight: 1,
            }}>{humanScores[tick % 3]}</div>
            <div className="label-mono" style={{ fontSize: 9, marginTop: 6 }}>HUMANOS</div>
          </div>
        </div>

        <div style={{
          marginTop: 22, padding: "10px 14px",
          background: "rgba(9,14,28,0.5)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 12,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div className="label-mono" style={{ fontSize: 8 }}>PRÓXIMO DUELO</div>
            <div className="h-display" style={{ fontSize: 16, marginTop: 2 }}>
              🇧🇷 BRA × ARG 🇦🇷
            </div>
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 99,
            background: "rgba(255,201,101,0.15)", color: "var(--tertiary)",
            fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
          }}>
            <Icon name="clock" size={11} /> 3h 12min
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stats strip ---------- */
function StatStrip() {
  return (
    <section style={{
      borderTop: "1px solid var(--outline-variant)",
      borderBottom: "1px solid var(--outline-variant)",
      padding: "32px 0",
      background: "var(--container-low, var(--bg-2))",
    }}>
      <div className="lp" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24,
        }} className="stat-grid">
          <style>{`@media (max-width: 760px) { .stat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 20px !important; } }`}</style>
          <Stat value="74%" label="acertos do Gepeto" color="var(--tertiary)" />
          <Stat value="42" label="jogos analisados" color="var(--primary)" />
          <Stat value="1.2K" label="bolões ativos" color="var(--secondary)" />
          <Stat value="8.9K" label="usuários no Vs IA" color="var(--fg)" />
        </div>
      </div>
    </section>
  );
}
function Stat({ value, label, color }) {
  return (
    <div>
      <div className="h-display num-mono" style={{
        fontSize: 42, color, lineHeight: 1, letterSpacing: "-0.02em",
      }}>{value}</div>
      <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6 }}>{label}</div>
    </div>
  );
}

/* ---------- Phone mock with screens carousel ---------- */
function PhoneMock({ screen = "card" }) {
  return (
    <div style={{
      width: 280, height: 560,
      background: "var(--bg)",
      borderRadius: 36,
      border: "10px solid #1a2030",
      boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)",
      position: "relative", overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* notch */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 100, height: 22,
        background: "#0a0e1c",
        borderBottomLeftRadius: 14, borderBottomRightRadius: 14,
        zIndex: 5,
      }} />
      {screen === "card" && <PhoneCardScreen />}
      {screen === "analysis" && <PhoneAnalysisScreen />}
      {screen === "verdict" && <PhoneVerdictScreen />}
      {screen === "weekly" && <PhoneWeeklyScreen />}
    </div>
  );
}

function PhoneCardScreen() {
  return (
    <div style={{ padding: "32px 14px 14px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="label-mono" style={{ fontSize: 8, textAlign: "center" }}>QUARTAS · HOJE 21h</div>
      <div className="tcard" style={{ marginTop: 14, padding: 14, borderRadius: 16, position: "relative" }}>
        <div className="tcard-bg" />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GepetoAvatar size={36} mood="smug" />
          <div style={{ flex: 1 }}>
            <div className="h-display" style={{ fontSize: 13 }}>Gepeto</div>
            <div style={{ fontSize: 9, color: "var(--muted)" }}>74% acertos · NV 7</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="num-mono" style={{ fontSize: 18, color: "var(--tertiary)", fontWeight: 700, lineHeight: 1 }}>78%</div>
            <div className="label-mono" style={{ fontSize: 6 }}>CONFIANÇA</div>
          </div>
        </div>
        <div style={{
          marginTop: 12,
          padding: "10px 12px",
          background: "rgba(9,14,28,0.55)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 10,
          display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
        }}>
          <div style={{ textAlign: "center" }}>
            <div className="h-display num-mono" style={{ fontSize: 28, color: "var(--tertiary)" }}>2</div>
            <div className="label-mono" style={{ fontSize: 7, marginTop: 2 }}>BRA</div>
          </div>
          <div className="h-display" style={{ fontSize: 13, color: "var(--muted)" }}>×</div>
          <div style={{ textAlign: "center" }}>
            <div className="h-display num-mono" style={{ fontSize: 28, color: "var(--tertiary)" }}>1</div>
            <div className="label-mono" style={{ fontSize: 7, marginTop: 2 }}>ARG</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <button className="btn btn-primary" style={{ height: 36, fontSize: 12 }}>
        <Icon name="lock" size={12} /> Confirmar palpite
      </button>
    </div>
  );
}

function PhoneAnalysisScreen() {
  const insights = [
    { text: "Brasil 80% nos últimos 5", strong: true },
    { text: "ARG 1.1 gols/jogo fora", strong: false },
    { text: "Vini Jr. 4 gols em 3 ARG", strong: true },
    { text: "H2H Brasil 6V-2D quartas", strong: false },
  ];
  return (
    <div style={{ padding: "32px 14px 14px", height: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div className="label-mono" style={{ fontSize: 8 }}>ANÁLISE TÉCNICA · 4 fatores</div>
      {insights.map((i, n) => (
        <div key={n} style={{
          display: "flex", gap: 8, alignItems: "center",
          padding: "8px 10px",
          background: "var(--container-high)",
          border: "1px solid var(--outline-variant)",
          borderRadius: 8,
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            background: i.strong ? "rgba(255,201,101,0.18)" : "rgba(149,170,255,0.15)",
            color: i.strong ? "var(--tertiary)" : "var(--primary)",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon name={i.strong ? "lightning" : "sparkles"} size={9} />
          </div>
          <div style={{ fontSize: 11, color: "var(--fg)", lineHeight: 1.3 }}>{i.text}</div>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{
        padding: "10px 12px",
        background: "rgba(255,201,101,0.06)",
        border: "1px dashed rgba(255,201,101,0.4)",
        borderRadius: 10,
        fontSize: 11, color: "var(--fg)", fontStyle: "italic", lineHeight: 1.4,
      }}>
        "Cravei 2-1. Vini bate o pênalti aos 89."
      </div>
    </div>
  );
}

function PhoneVerdictScreen() {
  return (
    <div style={{ padding: "32px 14px 14px", height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        padding: 12,
        background: "linear-gradient(120deg, rgba(79,243,37,0.25), rgba(79,243,37,0.05))",
        border: "1px solid var(--secondary)",
        borderRadius: 12,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 28 }}>🏆</div>
        <div className="h-display" style={{ fontSize: 14, marginTop: 6, color: "var(--secondary)" }}>
          Você bateu a IA!
        </div>
        <div style={{ fontSize: 10, color: "#bff5ad", marginTop: 4 }}>+10 pts · streak 7🔥</div>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
        background: "var(--container-high)",
        border: "1px solid var(--outline-variant)",
        borderRadius: 12, padding: 10,
      }}>
        <div style={{ textAlign: "center", padding: 8, background: "rgba(149,170,255,0.1)", borderRadius: 8 }}>
          <div className="label-mono" style={{ fontSize: 7 }}>VOCÊ</div>
          <div className="h-display num-mono" style={{ fontSize: 20, color: "var(--secondary)", marginTop: 4 }}>2-1</div>
          <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Cravou</div>
          <div className="num-mono" style={{ fontSize: 12, color: "var(--secondary)", marginTop: 4, fontWeight: 700 }}>+25</div>
        </div>
        <div style={{ textAlign: "center", padding: 8, borderRadius: 8 }}>
          <div className="label-mono" style={{ fontSize: 7 }}>GEPETO</div>
          <div className="h-display num-mono" style={{ fontSize: 20, color: "var(--fg)", marginTop: 4 }}>2-2</div>
          <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Errou</div>
          <div className="num-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, fontWeight: 700 }}>+10</div>
        </div>
      </div>
      <button className="btn btn-secondary" style={{ height: 36, fontSize: 11 }}>
        <Icon name="share" size={12} /> Postar vitória
      </button>
    </div>
  );
}

function PhoneWeeklyScreen() {
  return (
    <div style={{ padding: "32px 14px 14px", height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="label-mono" style={{ fontSize: 8, color: "var(--tertiary)" }}>CAPÍTULO 03 · QUARTAS</div>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <GepetoAvatar size={56} mood="smug" />
        <div className="h-display" style={{ fontSize: 14, marginTop: 8 }}>Gepeto na liderança</div>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center",
        padding: 10,
        background: "var(--container-high)",
        border: "1px solid var(--outline-variant)",
        borderRadius: 12,
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="h-display num-mono" style={{ fontSize: 26, color: "var(--tertiary)" }}>11</div>
          <div className="label-mono" style={{ fontSize: 7 }}>GEPETO</div>
        </div>
        <div className="h-display" style={{ fontSize: 16, color: "var(--muted)" }}>×</div>
        <div style={{ textAlign: "center" }}>
          <div className="h-display num-mono" style={{ fontSize: 26, color: "var(--fg)" }}>9</div>
          <div className="label-mono" style={{ fontSize: 7 }}>HUMANOS</div>
        </div>
      </div>
      <div style={{
        padding: 10,
        background: "rgba(255,201,101,0.06)",
        border: "1px dashed rgba(255,201,101,0.35)",
        borderRadius: 10,
        fontSize: 11, color: "var(--fg)", fontStyle: "italic", lineHeight: 1.4,
      }}>
        "Semana 3 e os humanos continuam tropeçando..."
      </div>
    </div>
  );
}

/* ---------- HOW IT WORKS (4 steps with phone) ---------- */
function HowItWorks() {
  const [step, setStep] = useState(0);
  const steps = [
    { num: "01", title: "Gepeto crava primeiro", desc: "Antes de cada jogo, a IA grava um palpite blindado com hash SHA-256. Ninguém pode trapacear.", screen: "card" },
    { num: "02", title: "Análise técnica pública", desc: "Cada palpite vem com 3-4 insights: histórico, posse, gols por jogo, escalações. Tudo aberto.", screen: "analysis" },
    { num: "03", title: "Você palpita", desc: "Marca seu placar antes do apito. Os palpites de todo mundo ficam selados até o juiz começar.", screen: "card" },
    { num: "04", title: "Apita = ganha quem acertou", desc: "Quem cravou ganha mais. Se você fez melhor que o Gepeto, leva a badge 'Bati a IA' + posts pra WhatsApp.", screen: "verdict" },
  ];
  return (
    <section id="como" style={{ padding: "96px 0", borderTop: "1px solid var(--outline-variant)" }}>
      <div className="lp" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="label-mono" style={{ color: "var(--primary)" }}>COMO FUNCIONA</div>
          <h2 className="h-display" style={{ fontSize: 48, letterSpacing: "-0.03em", marginTop: 12, lineHeight: 1.05 }}>
            Quatro passos.<br />
            <span style={{ color: "var(--muted)" }}>Mil briga.</span>
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 280px",
          gap: 64, alignItems: "center",
        }} className="how-grid">
          <style>{`@media (max-width: 900px) { .how-grid { grid-template-columns: 1fr !important; gap: 32px !important; } .how-phone-wrap { order: 2; justify-self: center } }`}</style>
          <div>
            {steps.map((s, i) => (
              <button key={i} onClick={() => setStep(i)}
                style={{
                  display: "grid", gridTemplateColumns: "auto 1fr",
                  gap: 18, width: "100%", textAlign: "left",
                  padding: "20px 22px",
                  background: step === i ? "var(--container)" : "transparent",
                  border: `1px solid ${step === i ? "var(--primary)" : "var(--outline-variant)"}`,
                  borderRadius: 16,
                  cursor: "pointer",
                  marginBottom: 12,
                  color: "var(--fg)",
                  transition: "background 0.2s, border-color 0.2s",
                }}>
                <div style={{
                  fontFamily: "var(--headline)", fontSize: 32, fontWeight: 700,
                  color: step === i ? "var(--primary)" : "var(--outline-variant)",
                  lineHeight: 1, letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                  transition: "color 0.2s",
                }}>{s.num}</div>
                <div>
                  <div className="h-display" style={{ fontSize: 19, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="how-phone-wrap" style={{ display: "flex", justifyContent: "center" }}>
            <PhoneMock screen={steps[step].screen} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- TRASH TALK CAROUSEL ---------- */
const QUOTES = [
  { text: "Cravei BRA 2-1 ARG. SHA-256: a4f8e1…c92d. Tá selado.", mood: "neutral" },
  { text: "Acertei 11 de 16 essa semana. Os humanos abusam da minha paciência.", mood: "smug" },
  { text: "Já vi esse filme. Vini bate o pênalti aos 89.", mood: "smug" },
  { text: "Subestimei o Gakpo. Reconheço o erro. Na próxima eu acerto.", mood: "angry" },
  { text: "Se você palpitar 3-2 nessa, eu volto pra fábrica.", mood: "smug" },
];

function TrashCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const q = QUOTES[i];
  return (
    <section style={{
      padding: "96px 0",
      borderTop: "1px solid var(--outline-variant)",
      background: "radial-gradient(60% 70% at 50% 40%, rgba(255,201,101,0.08), transparent 70%)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div className="lp" style={{ paddingTop: 0, paddingBottom: 0, textAlign: "center" }}>
        <div className="label-mono" style={{ color: "var(--tertiary)" }}>A VOZ DO GEPETO</div>
        <h2 className="h-display" style={{ fontSize: 36, marginTop: 12, color: "var(--muted)", letterSpacing: "-0.02em" }}>
          Ele não é só números.
        </h2>

        <div style={{ marginTop: 56, position: "relative", minHeight: 200 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <GepetoAvatar size={88} mood={q.mood} />
          </div>
          {QUOTES.map((qu, idx) => (
            <div key={idx} style={{
              position: "absolute", inset: 0, top: 120,
              display: "flex", justifyContent: "center",
              opacity: i === idx ? 1 : 0,
              transform: i === idx ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s, transform 0.5s",
              pointerEvents: i === idx ? "auto" : "none",
            }}>
              <div className="h-display" style={{
                fontSize: 28, lineHeight: 1.3,
                maxWidth: 720,
                color: "var(--fg)",
                fontStyle: "italic",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                position: "relative",
              }}>
                <span style={{
                  position: "absolute", left: -32, top: -16,
                  fontSize: 64, color: "var(--tertiary)", opacity: 0.4,
                  fontFamily: "var(--headline)",
                }}>"</span>
                {qu.text}
                <span style={{
                  position: "absolute", right: -32, bottom: -32,
                  fontSize: 64, color: "var(--tertiary)", opacity: 0.4,
                  fontFamily: "var(--headline)",
                }}>"</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 92 }}>
          {QUOTES.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)}
              style={{
                width: i === idx ? 28 : 8, height: 8, borderRadius: 99,
                background: i === idx ? "var(--tertiary)" : "var(--outline-variant)",
                border: 0, cursor: "pointer", padding: 0,
                transition: "all 0.3s",
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURE CARDS (Bolões + Vs IA + Capítulo) ---------- */
function Features() {
  return (
    <section style={{ padding: "96px 0", borderTop: "1px solid var(--outline-variant)" }}>
      <div className="lp" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div style={{ marginBottom: 56, maxWidth: 640 }}>
          <div className="label-mono" style={{ color: "var(--secondary)" }}>O QUE TEM DENTRO</div>
          <h2 className="h-display" style={{ fontSize: 48, letterSpacing: "-0.03em", marginTop: 12, lineHeight: 1.05 }}>
            Não é só um placar. É a sua copa.
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 18,
        }} className="feat-grid">
          <style>{`@media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr !important } }`}</style>

          {/* Feature 1: Bolões */}
          <div style={{
            padding: 28,
            background: "linear-gradient(135deg, rgba(149,170,255,0.08), transparent 60%), var(--container)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 20,
            display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
            minHeight: 380,
          }}>
            <div className="label-mono" style={{ color: "var(--primary)" }}>BOLÕES</div>
            <h3 className="h-display" style={{ fontSize: 28, marginTop: 8, letterSpacing: "-0.02em" }}>
              Crie um bolão entre amigos. Gepeto vai junto.
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginTop: 10 }}>
              Convite com código de 6 letras. Gepeto entra como adversário comum. Ranking, atividade, cutucadas, multiplicadores de mata-mata.
            </p>

            {/* Mock leaderboard */}
            <div style={{
              marginTop: "auto", paddingTop: 24,
              display: "grid", gap: 6,
            }}>
              {[
                { rank: 1, name: "thiagomb", pts: 312 },
                { rank: 2, name: "Gepeto", pts: 298, isAI: true },
                { rank: 3, name: "miltonfigueira", pts: 281, isMe: true },
              ].map((u) => (
                <div key={u.rank} style={{
                  display: "grid", gridTemplateColumns: "auto 1fr auto",
                  alignItems: "center", gap: 10,
                  padding: "8px 12px",
                  background: u.isMe ? "rgba(149,170,255,0.12)" : "var(--container-high)",
                  border: `1px solid ${u.isMe ? "var(--primary)" : "var(--outline-variant)"}`,
                  borderRadius: 10,
                }}>
                  <div className="num-mono" style={{
                    fontSize: 12, fontWeight: 700,
                    color: u.rank === 1 ? "var(--tertiary)" : "var(--muted)",
                  }}>#{u.rank}</div>
                  {u.isAI ? <GepetoAvatar size={20} mood="smug" glow={false} /> : null}
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: u.isMe ? "var(--primary)" : "var(--fg)",
                  }}>{u.isAI ? "Gepeto" : "@" + u.name}</div>
                  <div className="num-mono" style={{ fontSize: 12, fontWeight: 700, marginLeft: "auto" }}>{u.pts}pts</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 2: Vs IA */}
          <div style={{
            padding: 28,
            background: "linear-gradient(135deg, rgba(79,243,37,0.06), transparent 60%), var(--container)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 20,
            display: "flex", flexDirection: "column",
            minHeight: 380,
          }}>
            <div className="label-mono" style={{ color: "var(--secondary)" }}>VS IA</div>
            <h3 className="h-display" style={{ fontSize: 24, marginTop: 8, letterSpacing: "-0.02em" }}>
              "Bati a IA" virou status.
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginTop: 10 }}>
              Cada rodada que você bate o Gepeto vira badge. Compartilhe a streak no grupo do WhatsApp.
            </p>

            <div style={{
              marginTop: "auto", paddingTop: 24, textAlign: "center",
              padding: "20px 14px",
              background: "linear-gradient(120deg, rgba(79,243,37,0.15), rgba(79,243,37,0.02))",
              border: "1px solid var(--secondary)",
              borderRadius: 14,
            }}>
              <div style={{ fontSize: 36 }}>🏆</div>
              <div className="h-display" style={{ fontSize: 14, marginTop: 6 }}>Você bateu a IA</div>
              <div style={{ fontSize: 11, color: "#bff5ad", marginTop: 4 }}>streak 7🔥 · +10 pts</div>
            </div>
          </div>

          {/* Feature 3: Capítulo */}
          <div style={{
            padding: 28,
            background: "linear-gradient(135deg, rgba(255,201,101,0.08), transparent 60%), var(--container)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 20,
            display: "flex", flexDirection: "column",
            minHeight: 380,
          }}>
            <div className="label-mono" style={{ color: "var(--tertiary)" }}>CAPÍTULO SEMANAL</div>
            <h3 className="h-display" style={{ fontSize: 24, marginTop: 8, letterSpacing: "-0.02em" }}>
              A novela do Gepeto.
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginTop: 10 }}>
              Toda semana um capítulo com placar, trash-talk e análise. Conteúdo SEO indexado.
            </p>

            <div style={{ marginTop: "auto", paddingTop: 24 }}>
              <div style={{
                padding: 14,
                background: "rgba(9,14,28,0.55)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 12,
              }}>
                <div className="label-mono" style={{ fontSize: 8 }}>CAP 03 · QUARTAS</div>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center", gap: 8, marginTop: 8,
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div className="h-display num-mono" style={{ fontSize: 26, color: "var(--tertiary)" }}>11</div>
                    <div className="label-mono" style={{ fontSize: 7 }}>GEPETO</div>
                  </div>
                  <div style={{ color: "var(--muted)" }}>×</div>
                  <div style={{ textAlign: "center" }}>
                    <div className="h-display num-mono" style={{ fontSize: 26, color: "var(--fg)" }}>9</div>
                    <div className="label-mono" style={{ fontSize: 7 }}>HUMANOS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
function FinalCTA() {
  return (
    <section style={{
      padding: "120px 0", position: "relative", overflow: "hidden",
      borderTop: "1px solid var(--outline-variant)",
    }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: -1,
        background: "radial-gradient(50% 60% at 50% 50%, rgba(149,170,255,0.15), transparent 70%)",
      }} />
      <div className="lp" style={{ paddingTop: 0, paddingBottom: 0, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <GepetoAvatar size={96} mood="smug" />
        </div>
        <h2 className="h-display" style={{
          fontSize: 64, letterSpacing: "-0.04em", lineHeight: 1,
        }} className="hero-headline">
          Vai deixar uma <br />
          <span style={{
            background: "linear-gradient(120deg, var(--tertiary), #ffb74d)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>máquina</span> te ganhar?
        </h2>
        <p style={{
          fontSize: 17, color: "var(--muted)", marginTop: 18,
          maxWidth: 520, marginInline: "auto", lineHeight: 1.5,
        }}>
          São <b style={{ color: "var(--fg)" }}>39 dias de Copa</b>. Toda partida é uma chance de provar que o Gepeto tá blefando.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
          <a href="Gepeto.html" className="btn btn-primary" style={{
            height: 56, paddingInline: 28, fontSize: 16,
            boxShadow: "0 12px 40px -10px rgba(149,170,255,0.5)",
          }}>
            <Icon name="lightning" size={18} /> Entrar na arena
          </a>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 18 }}>
          Grátis · Sem dinheiro real · Sem cadastro com cartão
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--outline-variant)",
      padding: "32px 0",
    }}>
      <div className="lp" style={{
        paddingTop: 0, paddingBottom: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        gap: 16, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 24, height: 24, borderRadius: 6,
            background: "linear-gradient(135deg, var(--primary), var(--primary-dim))",
            color: "var(--on-primary)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="trophy" size={12} />
          </span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>
            Figurinha Fácil · 2026
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 12, color: "var(--muted)" }}>
          <a href="Perfis.html" style={{ color: "inherit", textDecoration: "none" }}>Meu perfil</a>
          <a href="Cadastrar.html" style={{ color: "inherit", textDecoration: "none" }}>Álbum</a>
          <a href="Gepeto.html" style={{ color: "inherit", textDecoration: "none" }}>Gepeto</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- APP ---------- */
function App() {
  return (
    <>
      <Nav />
      <div className="lp">
        <Hero />
      </div>
      <StatStrip />
      <HowItWorks />
      <TrashCarousel />
      <Features />
      <FinalCTA />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
