/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */
const { useState, useMemo, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "tradingCard",
  "showAchievements": true,
  "showTopSelections": true,
  "showQR": true,
  "emptyState": false
}/*EDITMODE-END*/;

/* ---------- Mock data ---------- */
const ME = {
  nickname: "miltonfigueira",
  displayNickname: "miltonfigueira",
  city: "São Paulo",
  state: "SP",
  flag: "🇧🇷",
  joined: "Mar / 26",
  cardCode: "BRA-10",
  cardNumber: "042",
  rating: 4.9,
  ratingCount: 27,
  totalTrades: 34,
  pasted: 612,
  total: 980,
  duplicatesCount: 58,
  missingCount: 368,
  isProfilePublic: true,
  acceptsMail: false,
  streak: 12,
};

const PUBLIC_USER = {
  nickname: "juliana_sp",
  displayNickname: "Juliana Martins",
  city: "Pinheiros",
  state: "SP",
  flag: "🇧🇷",
  cardCode: "ARG-09",
  cardNumber: "118",
  rating: 4.8,
  ratingCount: 41,
  totalTrades: 52,
  pasted: 723,
  total: 980,
  duplicatesCount: 84,
  missingCount: 257,
  distance: "1.2 km",
  matchCount: 6,
  joined: "Jan / 26",
};

const DUPES = [
  { code: "BRA-10", flag: "🇧🇷", num: "042", rare: true },
  { code: "ARG-09", flag: "🇦🇷", num: "118" },
  { code: "MEX-12", flag: "🇲🇽", num: "207", rare: true },
  { code: "FRA-07", flag: "🇫🇷", num: "088" },
  { code: "ESP-04", flag: "🇪🇸", num: "152" },
  { code: "ITA-15", flag: "🇮🇹", num: "311" },
  { code: "GER-21", flag: "🇩🇪", num: "276" },
  { code: "POR-08", flag: "🇵🇹", num: "134" },
  { code: "URU-09", flag: "🇺🇾", num: "401" },
  { code: "JAP-22", flag: "🇯🇵", num: "489" },
  { code: "CAN-03", flag: "🇨🇦", num: "523" },
  { code: "USA-19", flag: "🇺🇸", num: "612" },
];

const TOP_NATIONS = [
  { flag: "🇧🇷", name: "Brasil", code: "BRA", got: 26, total: 26 },
  { flag: "🇦🇷", name: "Argentina", code: "ARG", got: 23, total: 26 },
  { flag: "🇫🇷", name: "França", code: "FRA", got: 22, total: 26 },
  { flag: "🇪🇸", name: "Espanha", code: "ESP", got: 19, total: 26 },
  { flag: "🇲🇽", name: "México", code: "MEX", got: 17, total: 26 },
  { flag: "🇩🇪", name: "Alemanha", code: "GER", got: 14, total: 26 },
];

const ACHIEVEMENTS = [
  { id: "first", icon: "🎯", name: "Primeira troca", desc: "Realizou sua 1ª troca" , unlocked: true },
  { id: "tenTrades", icon: "🤝", name: "10 trocas", desc: "Completou 10 trocas", unlocked: true },
  { id: "halfAlbum", icon: "📖", name: "Meio álbum", desc: "Colou 50% do álbum", unlocked: true },
  { id: "explorer", icon: "🌍", name: "Explorador", desc: "Trocou em 3 cidades", unlocked: true },
  { id: "highRated", icon: "⭐", name: "5 estrelas", desc: "Recebeu 25 avaliações 5★", unlocked: false },
  { id: "fullAlbum", icon: "🏆", name: "Álbum cheio", desc: "Completou 100% do álbum", unlocked: false },
];

const REVIEWS = [
  { name: "@rafa_dias", rating: 5, text: "Trocou na hora marcada, figurinhas em ótimo estado.", when: "há 3 dias" },
  { name: "@anna.s", rating: 5, text: "Super tranquilo. Recomendo!", when: "há 1 sem" },
  { name: "@luca_p", rating: 4, text: "Bom papo, encontro rápido.", when: "há 2 sem" },
];

/* ---------- Icons (inline SVG) ---------- */
const Icon = ({ name, size = 18, ...props }) => {
  const stroke = props.color || "currentColor";
  const sw = props.strokeWidth || 2;
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "share": return <svg {...common}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
    case "qr": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="17"/><line x1="14" y1="20" x2="14" y2="21"/><line x1="17" y1="14" x2="17" y2="14"/><line x1="20" y1="14" x2="21" y2="14"/><line x1="17" y1="17" x2="21" y2="17"/><line x1="17" y1="20" x2="21" y2="20"/></svg>;
    case "copy": return <svg {...common}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "external": return <svg {...common}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "edit": return <svg {...common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
    case "star": return <svg {...common} fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "starOutline": return <svg {...common}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "trophy": return <svg {...common}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
    case "swords": return <svg {...common}><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" y1="14" x2="9" y2="18"/><line x1="7" y1="17" x2="4" y2="20"/><line x1="3" y1="19" x2="5" y2="21"/></svg>;
    case "mapPin": return <svg {...common}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "chevronRight": return <svg {...common}><polyline points="9 18 15 12 9 6"/></svg>;
    case "arrowLeft": return <svg {...common}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case "lock": return <svg {...common}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "mail": return <svg {...common}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>;
    case "flame": return <svg {...common}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
    case "sparkles": return <svg {...common}><path d="M12 3l1.9 5.5L19 10l-5.1 1.5L12 17l-1.9-5.5L5 10l5.1-1.5L12 3z"/></svg>;
    case "users": return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "check": return <svg {...common}><polyline points="20 6 9 17 4 12"/></svg>;
    case "x": return <svg {...common}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "shield": return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "swap": return <svg {...common}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    default: return null;
  }
};

/* ---------- Avatar (dicebear-like ring) ---------- */
function Avatar({ seed, size = 56, ring = true }) {
  // hash seed to hue
  const hue = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
    return h;
  }, [seed]);
  const initials = useMemo(() => {
    const s = seed.replace(/[^a-z0-9]/gi, "");
    return (s[0] || "?").toUpperCase() + (s[1] || "").toUpperCase();
  }, [seed]);
  const url = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      padding: ring ? 3 : 0,
      background: ring ? `conic-gradient(from 180deg, var(--primary), var(--secondary), var(--tertiary), var(--primary))` : "transparent",
      flexShrink: 0,
    }}>
      <div style={{
        width: "100%", height: "100%",
        borderRadius: 999, overflow: "hidden",
        background: `hsl(${hue} 40% 30%)`,
        display: "grid", placeItems: "center",
        position: "relative",
      }}>
        <img src={url} alt="" width={size} height={size}
             onError={(e) => { e.currentTarget.style.display = "none"; }}
             style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <span style={{
          position: "absolute", inset: 0, display: "grid", placeItems: "center",
          fontFamily: "var(--headline)", fontWeight: 700,
          fontSize: size * 0.36, color: "white", zIndex: -1,
        }}>{initials}</span>
      </div>
    </div>
  );
}

/* ---------- Trading-card hero (variant A) ---------- */
function HeroTradingCard({ user, onShare, onEdit, isPublic }) {
  return (
    <div className="tcard shimmer-host" style={{ padding: "20px 18px 18px" }}>
      <div className="tcard-bg" />
      <div className="tcard-foil" />
      <div className="tcard-grid" />

      {/* top row: code + number */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div className="label-mono" style={{ color: "var(--tertiary)", whiteSpace: "nowrap" }}>COPA 2026</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 22 }}>{user.flag}</span>
            <span className="num-mono" style={{ fontSize: 20, color: "var(--fg)", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
              {user.cardCode}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="label-mono">N°</div>
          <div className="h-display" style={{ fontSize: 32, color: "var(--tertiary)", lineHeight: 1, marginTop: 2 }}>
            {user.cardNumber}
          </div>
        </div>
      </div>

      {/* avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <Avatar seed={user.nickname} size={104} />
      </div>

      {/* name */}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <div className="h-display" style={{ fontSize: 22, color: "var(--fg)" }}>
          @{user.displayNickname}
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 4, color: "var(--muted)", fontSize: 12, flexWrap: "wrap", whiteSpace: "nowrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="mapPin" size={12} /> {user.city}, {user.state}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 99, background: "var(--outline-variant)" }} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="calendar" size={12} /> Desde {user.joined}
          </span>
        </div>
      </div>

      {/* stat strip */}
      <div style={{
        marginTop: 16,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        background: "rgba(9,14,28,0.55)",
        border: "1px solid var(--outline-variant)",
        borderRadius: 14,
        overflow: "hidden",
      }}>
        <StatCell label="Álbum" value={`${Math.round((user.pasted / user.total) * 100)}%`} accent="var(--primary)" />
        <StatCell label="Trocas" value={user.totalTrades} accent="var(--secondary)" />
        <StatCell label="Reputação" value={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon name="star" size={14} color="var(--tertiary)" /> {user.rating}
          </span>
        } accent="var(--tertiary)" />
      </div>

      {/* bottom action */}
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        {isPublic ? (
          <>
            <button className="btn btn-primary" style={{ flex: 1 }}>
              <Icon name="swords" size={16} /> Propor troca
            </button>
            <button className="btn btn-outline" style={{ paddingInline: 14 }} onClick={onShare}>
              <Icon name="share" size={16} />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={onShare}>
              <Icon name="share" size={16} /> Compartilhar perfil
            </button>
            <button className="btn btn-outline" style={{ paddingInline: 14 }} onClick={onEdit}>
              <Icon name="edit" size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StatCell({ label, value, accent }) {
  return (
    <div style={{ padding: "10px 8px", textAlign: "center", borderRight: "1px solid var(--outline-variant)" }} className="stat-cell">
      <div className="num-mono" style={{ fontSize: 20, color: accent }}>{value}</div>
      <div className="label-mono" style={{ marginTop: 2, fontSize: 9 }}>{label}</div>
    </div>
  );
}

/* Variant B: Compact banner */
function HeroBanner({ user, onShare, onEdit, isPublic }) {
  return (
    <div className="raised" style={{
      padding: 0,
      overflow: "hidden",
      borderRadius: 18,
    }}>
      <div style={{
        height: 100,
        background: `linear-gradient(135deg, var(--primary-dim), #0d1323 70%), radial-gradient(60% 80% at 30% 30%, var(--primary), transparent)`,
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(225,228,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(225,228,250,0.06) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }} />
        <div style={{ position: "absolute", top: 12, left: 14 }} className="label-mono">{user.cardCode} · #{user.cardNumber}</div>
        <div style={{ position: "absolute", top: 12, right: 14, display: "flex", gap: 6 }}>
          <button className="btn btn-outline" style={{ height: 32, paddingInline: 10, background: "rgba(9,14,28,0.5)" }} onClick={onShare}>
            <Icon name="share" size={14} />
          </button>
          {!isPublic && (
            <button className="btn btn-outline" style={{ height: 32, paddingInline: 10, background: "rgba(9,14,28,0.5)" }} onClick={onEdit}>
              <Icon name="edit" size={14} />
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: "0 18px 18px", marginTop: -36, display: "flex", gap: 14, alignItems: "flex-end" }}>
        <Avatar seed={user.nickname} size={72} />
        <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
          <div className="h-display" style={{ fontSize: 20 }}>@{user.displayNickname}</div>
          <div style={{ color: "var(--muted)", fontSize: 13, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="mapPin" size={12} /> {user.city}</span>
            <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><Icon name="star" size={12} color="var(--tertiary)" /> {user.rating}</span>
            <span>{user.totalTrades} trocas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Variant C: Stadium credential */
function HeroCredential({ user, onShare, onEdit, isPublic }) {
  return (
    <div className="tcard" style={{ padding: 0 }}>
      <div className="tcard-bg" />
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", padding: 16, gap: 14, alignItems: "center" }}>
        <div className="qr-frame" style={{ padding: 8 }}>
          <QRCanvas size={70} text={`https://figurinhafacil.com.br/u/${user.nickname}`} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="label-mono" style={{ color: "var(--tertiary)" }}>CREDENCIAL · COPA 2026</div>
          <div className="h-display" style={{ fontSize: 18, marginTop: 4 }}>@{user.displayNickname}</div>
          <div className="num-mono" style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
            {user.cardCode} · N° {user.cardNumber}
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px dashed var(--outline-variant)" }} />
      <div style={{ padding: "12px 16px", display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar seed={user.nickname} size={44} ring={false} />
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Álbum</div>
            <div className="num-mono" style={{ fontSize: 16 }}>{Math.round(user.pasted / user.total * 100)}%</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Trocas</div>
            <div className="num-mono" style={{ fontSize: 16 }}>{user.totalTrades}</div>
          </div>
        </div>
        <button className="btn btn-primary" style={{ height: 36, paddingInline: 14 }} onClick={isPublic ? onShare : onEdit}>
          {isPublic ? <><Icon name="swords" size={14} /> Trocar</> : <><Icon name="edit" size={14} /> Editar</>}
        </button>
      </div>
    </div>
  );
}

/* QR pseudo-pattern (deterministic, looks like a QR) */
function QRCanvas({ size = 140, text = "" }) {
  const grid = 21;
  const cells = useMemo(() => {
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h) ^ text.charCodeAt(i);
    const arr = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        // finder corners
        const isFinder =
          (x < 7 && y < 7) ||
          (x > grid - 8 && y < 7) ||
          (x < 7 && y > grid - 8);
        if (isFinder) {
          const lx = x % (grid - 7);
          const ly = y % (grid - 7);
          const inX = (x < 7 ? x : grid - 1 - x);
          const inY = (y < 7 ? y : grid - 1 - y);
          // outer ring 7x7, inner 3x3
          const onRing = inX === 0 || inY === 0 || inX === 6 || inY === 6;
          const onCenter = inX >= 2 && inX <= 4 && inY >= 2 && inY <= 4;
          arr.push(onRing || onCenter ? 1 : 0);
          continue;
        }
        // pseudo random
        h = (h * 16807) % 2147483647;
        arr.push(((h >> ((x + y) % 7)) & 1));
      }
    }
    return arr;
  }, [text]);
  const cell = size / grid;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${grid} ${grid}`} style={{ display: "block" }}>
      <rect width={grid} height={grid} fill="white" />
      {cells.map((v, i) => v ? (
        <rect key={i} x={i % grid} y={Math.floor(i / grid)} width={1} height={1} fill="#0d1323" />
      ) : null)}
    </svg>
  );
}

/* ---------- Module: Album progress ---------- */
function AlbumProgressModule({ user }) {
  const pct = (user.pasted / user.total) * 100;
  return (
    <Section title="Progresso do álbum" right={<span className="label-mono">{user.pasted} / {user.total}</span>}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
        <span className="num-mono" style={{ fontSize: 32, color: "var(--primary)" }}>{pct.toFixed(1)}%</span>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>colado</span>
      </div>
      <div className="pbar"><span style={{ width: `${pct}%` }} /></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
        <Kpi label="Coladas" value={user.pasted} accent="var(--primary)" />
        <Kpi label="Repetidas" value={user.duplicatesCount} accent="var(--secondary)" />
        <Kpi label="Faltam" value={user.missingCount} accent="var(--tertiary)" />
      </div>
    </Section>
  );
}

function Kpi({ label, value, accent }) {
  return (
    <div style={{
      background: "var(--container-high)",
      border: "1px solid var(--outline-variant)",
      borderRadius: 12,
      padding: "10px 12px",
      textAlign: "center",
    }}>
      <div className="num-mono" style={{ fontSize: 22, color: accent }}>{value}</div>
      <div className="label-mono" style={{ marginTop: 2, fontSize: 9 }}>{label}</div>
    </div>
  );
}

/* ---------- Module: Top selections ---------- */
function TopNationsModule() {
  return (
    <Section title="Top seleções" subtitle="Onde seu álbum está mais cheio">
      <div style={{ display: "grid", gap: 10 }}>
        {TOP_NATIONS.slice(0, 5).map((n) => {
          const pct = (n.got / n.total) * 100;
          const complete = n.got === n.total;
          return (
            <div key={n.code} style={{ display: "grid", gridTemplateColumns: "26px 1fr auto", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>{n.flag}</span>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{n.name}</span>
                  <span className="num-mono" style={{ fontSize: 12, color: complete ? "var(--secondary)" : "var(--muted)" }}>{n.got}/{n.total}</span>
                </div>
                <div className="pbar" style={{ height: 6 }}>
                  <span style={{ width: `${pct}%`, background: complete ? "var(--secondary)" : "linear-gradient(90deg, var(--primary), var(--primary-dim))" }} />
                </div>
              </div>
              {complete && (
                <span style={{
                  fontSize: 9, fontFamily: "var(--headline)", fontWeight: 700,
                  letterSpacing: "0.15em", color: "var(--secondary)",
                  background: "rgba(79,243,37,0.12)", padding: "3px 6px", borderRadius: 6,
                }}>FULL</span>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- Module: Achievements ---------- */
function AchievementsModule() {
  return (
    <Section title="Conquistas" subtitle={`${ACHIEVEMENTS.filter(a => a.unlocked).length} de ${ACHIEVEMENTS.length} desbloqueadas`}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {ACHIEVEMENTS.map((a) => (
          <div key={a.id} style={{
            padding: "12px 8px",
            background: a.unlocked ? "var(--container-high)" : "rgba(13,19,35,0.5)",
            border: `1px solid ${a.unlocked ? "var(--outline-variant)" : "transparent"}`,
            borderRadius: 12,
            textAlign: "center",
            opacity: a.unlocked ? 1 : 0.4,
            position: "relative",
          }}>
            <div style={{ fontSize: 26, lineHeight: 1, filter: a.unlocked ? "none" : "grayscale(1)" }}>{a.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6 }}>{a.name}</div>
            {!a.unlocked && (
              <div style={{ position: "absolute", top: 6, right: 6, color: "var(--muted)" }}>
                <Icon name="lock" size={11} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Module: Duplicates rich grid ---------- */
function DuplicatesRichModule({ count, focus = false }) {
  const visible = DUPES.slice(0, focus ? 12 : 8);
  return (
    <Section
      title="Repetidas para troca"
      subtitle={`${count} disponíveis · toque para detalhes`}
      right={<button className="btn btn-ghost" style={{ height: 28, paddingInline: 8, fontSize: 12 }}>Ver todas <Icon name="chevronRight" size={14} /></button>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {visible.map((d) => (
          <div key={d.code} className={`mini-fig ${d.rare ? "rare" : "dupe"}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="flag">{d.flag}</span>
              {d.rare && <Icon name="sparkles" size={10} color="var(--tertiary)" />}
            </div>
            <div>
              <div className="num">{d.num}</div>
              <div className="code">{d.code}</div>
            </div>
          </div>
        ))}
        {count > visible.length && (
          <div className="mini-fig" style={{
            display: "grid", placeItems: "center",
            background: "transparent", borderStyle: "dashed",
          }}>
            <div style={{ textAlign: "center" }}>
              <div className="num-mono" style={{ fontSize: 18 }}>+{count - visible.length}</div>
              <div className="label-mono" style={{ fontSize: 9, marginTop: 2 }}>mais</div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ---------- Module: Reviews ---------- */
function ReviewsModule({ rating, count }) {
  return (
    <Section
      title="Avaliações"
      right={
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13 }}>
          <Icon name="star" size={14} color="var(--tertiary)" />
          <span className="num-mono">{rating}</span>
          <span style={{ color: "var(--muted)" }}>· {count}</span>
        </span>
      }
    >
      <div style={{ display: "grid", gap: 10 }}>
        {REVIEWS.map((r, i) => (
          <div key={i} style={{
            padding: 12,
            background: "var(--container-high)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span>
              <span style={{ display: "inline-flex", gap: 1 }}>
                {[1,2,3,4,5].map(n => (
                  <Icon key={n} name={n <= r.rating ? "star" : "starOutline"} size={11} color={n <= r.rating ? "var(--tertiary)" : "var(--outline-variant)"} />
                ))}
              </span>
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>"{r.text}"</div>
            <div style={{ fontSize: 11, color: "var(--outline-variant)", marginTop: 6 }}>{r.when}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Module: Settings (Meu perfil) ---------- */
function SettingsModule({ user, onChange }) {
  return (
    <Section title="Configurações">
      <ToggleRow
        icon="globe"
        title="Perfil público"
        desc="Outras pessoas podem ver suas figurinhas via link"
        on={user.isProfilePublic}
        onChange={(v) => onChange("isProfilePublic", v)}
      />
      <div style={{ borderTop: "1px solid var(--outline-variant)", margin: "12px 0" }} />
      <ToggleRow
        icon="mail"
        title="Aceito trocas por correio"
        desc="Aparece para usuários de outras cidades"
        on={user.acceptsMail}
        onChange={(v) => onChange("acceptsMail", v)}
      />
    </Section>
  );
}

function ToggleRow({ icon, title, desc, on, onChange }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: on ? "rgba(149,170,255,0.12)" : "var(--container-high)",
        color: on ? "var(--primary)" : "var(--muted)",
        display: "grid", placeItems: "center", flexShrink: 0,
      }}>
        <Icon name={icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{desc}</div>
      </div>
      <div className={`switch ${on ? "on" : ""}`} onClick={() => onChange(!on)} role="button" tabIndex={0} />
    </div>
  );
}

/* ---------- Module: QR card ---------- */
function QRModule({ user }) {
  const url = `figurinhafacil.com.br/u/${user.nickname}`;
  const [copied, setCopied] = useState(false);
  return (
    <Section title="Compartilhe seu perfil" subtitle="Outras pessoas escaneiam para ver suas trocas">
      <div style={{
        display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "center",
        background: "var(--container-high)", border: "1px solid var(--outline-variant)",
        borderRadius: 14, padding: 14,
      }}>
        <div className="qr-frame">
          <QRCanvas size={108} text={url} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="label-mono">URL DO PERFIL</div>
          <div className="num-mono" style={{ fontSize: 12, marginTop: 4, wordBreak: "break-all", color: "var(--fg)" }}>
            {url}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button className="btn btn-outline" style={{ height: 32, paddingInline: 10, fontSize: 12 }}
              onClick={() => { navigator.clipboard?.writeText(`https://${url}`); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
              <Icon name={copied ? "check" : "copy"} size={13} /> {copied ? "Copiado" : "Copiar"}
            </button>
            <button className="btn btn-wpp" style={{ height: 32, paddingInline: 10, fontSize: 12 }}>
              <Icon name="share" size={13} /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Module: Match insight (public) ---------- */
function MatchInsight({ user }) {
  return (
    <div className="tcard fade-up" style={{ padding: 16, marginBottom: 16 }}>
      <div className="tcard-bg" style={{ background: "linear-gradient(135deg, rgba(79,243,37,0.18), rgba(13,19,35,1) 70%)" }} />
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: "rgba(79,243,37,0.18)", color: "var(--secondary)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name="swords" size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="h-display" style={{ fontSize: 16 }}>
            <span style={{ color: "var(--secondary)" }}>{user.matchCount} matches</span> com você
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            {user.distance} de você · {user.totalTrades} trocas
          </div>
        </div>
        <button className="btn btn-secondary" style={{ height: 36, paddingInline: 14 }}>
          Ver
        </button>
      </div>
    </div>
  );
}

/* ---------- Section primitive ---------- */
function Section({ title, subtitle, right, children }) {
  return (
    <div className="raised fade-up" style={{ padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: subtitle ? "flex-start" : "center", marginBottom: 12, gap: 8 }}>
        <div>
          <div className="h-display" style={{ fontSize: 14, letterSpacing: "0.01em" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

/* ---------- Empty state ---------- */
function EmptyHero({ user, onEdit }) {
  return (
    <div className="tcard" style={{ padding: 24, textAlign: "center" }}>
      <div className="tcard-bg" />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <Avatar seed={user.nickname} size={80} />
      </div>
      <div className="h-display" style={{ fontSize: 18 }}>@{user.displayNickname}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
        Seu álbum está esperando! Cole a primeira figurinha para começar.
      </div>
      <button className="btn btn-primary" style={{ marginTop: 16, width: "100%" }}>
        <Icon name="sparkles" size={16} /> Começar meu álbum
      </button>
    </div>
  );
}

/* ---------- Header ---------- */
function ScreenHeader({ active, onSwitch }) {
  return (
    <div className="tab-switcher" style={{ padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, var(--primary), var(--primary-dim))",
            display: "grid", placeItems: "center",
            color: "var(--on-primary)",
          }}>
            <Icon name="trophy" size={15} strokeWidth={2.5} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span className="h-display" style={{ fontSize: 14, color: "var(--primary)", lineHeight: 1.1, whiteSpace: "nowrap" }}>Figurinha Fácil</span>
            <span className="label-mono" style={{ fontSize: 8, marginTop: 3, lineHeight: 1, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}><span className="pulse-dot" style={{ width: 5, height: 5, marginRight: 4 }} /> Arena ao vivo</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-outline" style={{ width: 36, height: 36, padding: 0 }}>
            <Icon name="users" size={15} />
          </button>
        </div>
      </div>

      <div className="seg" style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        <button className={active === "me" ? "active" : ""} onClick={() => onSwitch("me")}>Meu perfil</button>
        <button className={active === "public" ? "active" : ""} onClick={() => onSwitch("public")}>Público</button>
        <button className={active === "feed" ? "active" : ""} onClick={() => onSwitch("feed")}>Feed</button>
      </div>
    </div>
  );
}

/* ---------- Hero picker ---------- */
function Hero({ variant, ...rest }) {
  if (variant === "banner") return <HeroBanner {...rest} />;
  if (variant === "credential") return <HeroCredential {...rest} />;
  return <HeroTradingCard {...rest} />;
}

/* ---------- Page: Meu perfil ---------- */
function MyProfileScreen({ tweaks, user, setUser, onShare, onSwitchToPublic }) {
  if (tweaks.emptyState) {
    return (
      <div style={{ padding: 16 }}>
        <EmptyHero user={user} />
        <div className="raised fade-up" style={{ padding: 18, marginTop: 14, textAlign: "center" }}>
          <div className="h-display" style={{ fontSize: 15 }}>Conquistas em breve</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            Cole figurinhas e troque para desbloquear medalhas.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: 16 }}>
      <Hero variant={tweaks.heroVariant} user={user} onShare={onShare} isPublic={false} />
      <div style={{ height: 14 }} />

      <PreviewLink onClick={onSwitchToPublic} user={user} />

      <AlbumProgressModule user={user} />
      {tweaks.showTopSelections && <TopNationsModule />}
      {tweaks.showAchievements && <AchievementsModule />}
      <SettingsModule user={user} onChange={(k, v) => setUser({ ...user, [k]: v })} />
      {tweaks.showQR && user.isProfilePublic && <QRModule user={user} />}
    </div>
  );
}

function PreviewLink({ onClick, user }) {
  return (
    <button onClick={onClick} className="raised fade-up" style={{
      width: "100%", textAlign: "left",
      padding: "12px 14px",
      marginBottom: 14,
      cursor: "pointer",
      display: "flex", alignItems: "center", gap: 12,
      background: "linear-gradient(90deg, rgba(149,170,255,0.08), transparent 70%)",
      border: "1px solid rgba(149,170,255,0.3)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "rgba(149,170,255,0.15)", color: "var(--primary)",
        display: "grid", placeItems: "center",
      }}>
        <Icon name="external" size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Como outros veem seu perfil</div>
        <div className="num-mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          figurinhafacil.com.br/u/{user.nickname}
        </div>
      </div>
      <Icon name="chevronRight" size={16} color="var(--muted)" />
    </button>
  );
}

/* ---------- Page: Perfil público ---------- */
function PublicProfileScreen({ tweaks, user, onSwitchToMe }) {
  return (
    <div style={{ padding: 16 }}>
      <button onClick={onSwitchToMe} className="btn btn-ghost" style={{ height: 32, paddingInline: 4, marginBottom: 8, fontSize: 12 }}>
        <Icon name="arrowLeft" size={14} /> Voltar ao meu perfil
      </button>

      <MatchInsight user={user} />

      <Hero variant={tweaks.heroVariant} user={user} onShare={() => {}} isPublic={true} />
      <div style={{ height: 14 }} />

      <DuplicatesRichModule count={user.duplicatesCount} focus />
      <AlbumProgressModule user={user} />
      {tweaks.showTopSelections && <TopNationsModule />}
      <ReviewsModule rating={user.rating} count={user.ratingCount} />
      {tweaks.showQR && <QRModule user={user} />}

      {/* CTA bar */}
      <div style={{
        position: "sticky",
        bottom: 12,
        marginTop: 16,
        padding: 10,
        background: "rgba(13,19,35,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid var(--outline-variant)",
        borderRadius: 16,
        display: "flex", gap: 8,
        boxShadow: "0 12px 30px -10px rgba(0,0,0,0.6)",
      }}>
        <button className="btn btn-primary" style={{ flex: 1 }}>
          <Icon name="swords" size={16} /> Propor troca
        </button>
        <button className="btn btn-wpp" style={{ flex: 1 }}>
          <Icon name="share" size={16} /> WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */
function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div style={{
      position: "fixed",
      left: "50%", bottom: 30,
      transform: "translateX(-50%)",
      background: "var(--container-highest)",
      border: "1px solid var(--outline-variant)",
      borderRadius: 12,
      padding: "10px 14px",
      fontSize: 13,
      color: "var(--fg)",
      display: "flex", gap: 8, alignItems: "center",
      boxShadow: "0 10px 30px -8px rgba(0,0,0,0.6)",
      zIndex: 200,
    }}>
      <Icon name="check" size={15} color="var(--secondary)" /> {message}
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState("me");
  const [me, setMe] = useState(ME);
  const [toast, setToast] = useState("");

  const showToast = (m) => setToast(m);

  return (
    <>
      <div className="device" data-screen-label={view === "me" ? "Meu perfil" : view === "public" ? "Perfil público" : "Feed da cidade"}>
        <div className="device-inner">
          <ScreenHeader active={view} onSwitch={setView} />
          {view === "me" ? (
            <MyProfileScreen
              tweaks={tweaks}
              user={me}
              setUser={(u) => { setMe(u); showToast("Configurações atualizadas"); }}
              onShare={() => showToast("Link copiado!")}
              onSwitchToPublic={() => setView("public")}
            />
          ) : view === "public" ? (
            <PublicProfileScreen
              tweaks={tweaks}
              user={PUBLIC_USER}
              onSwitchToMe={() => setView("me")}
            />
          ) : (
            <window.FeedScreen
              user={me}
              onTrade={() => showToast("Conversa aberta com o usuário")}
            />
          )}
        </div>
      </div>

      <Toast message={toast} onClose={() => setToast("")} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero">
          <TweakSelect
            label="Layout"
            value={tweaks.heroVariant}
            onChange={(v) => setTweak("heroVariant", v)}
            options={[
              { value: "tradingCard", label: "Trading card" },
              { value: "banner", label: "Banner social" },
              { value: "credential", label: "Credencial" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Módulos">
          <TweakToggle label="Conquistas" value={tweaks.showAchievements} onChange={(v) => setTweak("showAchievements", v)} />
          <TweakToggle label="Top seleções" value={tweaks.showTopSelections} onChange={(v) => setTweak("showTopSelections", v)} />
          <TweakToggle label="QR Code" value={tweaks.showQR} onChange={(v) => setTweak("showQR", v)} />
        </TweakSection>
        <TweakSection label="Estado">
          <TweakToggle label="Estado vazio (perfil novo)" value={tweaks.emptyState} onChange={(v) => setTweak("emptyState", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

Object.assign(window, { Avatar, Icon, Section });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
