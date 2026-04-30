// Shared low-level pieces used by both profile views.

function Sticker({ code, flag, qty, rarity, name, dimmed }) {
  const cls = rarity === "legend" ? "legend" : "have";
  return (
    <div className={`sticker ${cls}`} style={dimmed ? { opacity: 0.6 } : null}>
      {qty > 1 && (
        <span className={`qty-badge ${rarity === "legend" ? "gold" : ""}`}>
          ×{qty}
        </span>
      )}
      <div className="photo">
        <span style={{ fontSize: "1.25rem" }}>{flag}</span>
      </div>
      <div className="meta">
        <span className="code">{code}</span>
        <span className="flag">{flag}</span>
      </div>
    </div>
  );
}

function NeedSticker({ code, flag, rarity, priority }) {
  const ringColor =
    priority === "high" ? "rgba(255,110,132,0.4)" :
    priority === "med"  ? "rgba(255,201,101,0.3)" :
                          "rgba(149,170,255,0.2)";
  return (
    <div className="sticker need" style={{ borderColor: ringColor }}>
      <div className="photo">
        <span style={{ fontSize: "1.125rem", opacity: 0.5 }}>{flag}</span>
      </div>
      <div className="meta">
        <span className="code">{code}</span>
        <span className="material-symbols-outlined" style={{ fontSize: "0.875rem", color: "#6b7290" }}>
          help
        </span>
      </div>
    </div>
  );
}

function StatPill({ icon, value, label, color = "primary" }) {
  const colorMap = {
    primary: "#95aaff",
    secondary: "#4ff325",
    tertiary: "#ffc965",
  };
  return (
    <div className="rounded-xl bg-surface-container border border-white/5 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant mb-1.5">
        <span className="material-symbols-outlined" style={{ fontSize: "0.875rem", color: colorMap[color] }}>
          {icon}
        </span>
        {label}
      </div>
      <p className="font-headline font-bold text-xl" style={{ color: colorMap[color] }}>{value}</p>
    </div>
  );
}

function Avatar({ initials, size = 96, public: isPublic }) {
  return (
    <div className={`avatar-ring ${isPublic ? "public" : ""}`} style={{ width: size, height: size }}>
      <div className="avatar-inner" style={{ fontSize: size * 0.35 }}>
        {initials}
      </div>
    </div>
  );
}

function StarRating({ value, count, size = "sm" }) {
  const fontSize = size === "lg" ? "1rem" : "0.8125rem";
  return (
    <span className="flex items-center gap-1 font-mono" style={{ fontSize }}>
      <span className="material-symbols-outlined icon-fill" style={{ color: "#ffc965", fontSize }}>star</span>
      <span className="font-semibold text-on-surface">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-on-surface-variant">· {count} {count === 1 ? "review" : "reviews"}</span>
      )}
    </span>
  );
}

function ProgressBar({ progress, total }) {
  const pct = (progress / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-on-surface-variant font-mono">
          <span className="text-on-surface font-semibold">{pct.toFixed(1)}%</span> completo
        </span>
        <span className="text-xs font-mono text-on-surface-variant">
          <span className="text-on-surface font-semibold">{progress}</span>/{total}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

// Schematic QR code (purely visual — pattern, not a real QR)
function QRCodeViz({ accent = "#1a472a" }) {
  // 21x21 grid; we mark a deterministic-ish pattern with finder squares
  const cells = [];
  const finder = (cr, cc) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
      const onCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      if (onBorder || onCenter) cells.push([cr + r, cc + c]);
    }
  };
  finder(0, 0); finder(0, 14); finder(14, 0);
  // pseudo-random data cells
  const seed = (r, c) => ((r * 31 + c * 17 + (r ^ c)) % 7) < 3;
  for (let r = 0; r < 21; r++) for (let c = 0; c < 21; c++) {
    const inFinder =
      (r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8);
    if (!inFinder && seed(r, c)) cells.push([r, c]);
  }
  const set = new Set(cells.map(([r, c]) => r * 21 + c));
  return (
    <div className="qr-grid">
      {Array.from({ length: 21 * 21 }, (_, i) => (
        <div
          key={i}
          className={`cell ${set.has(i) ? "on" : ""}`}
          style={set.has(i) ? { background: accent } : null}
        />
      ))}
    </div>
  );
}

// Header bar mimicking the app's TopAppBar
function AppHeader({ title, action, back }) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-surface/85 border-b border-white/5">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 min-w-0">
          {back ? (
            <button className="btn-icon !w-9 !h-9" aria-label="Voltar">
              <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>arrow_back</span>
            </button>
          ) : (
            <span className="material-symbols-outlined icon-fill text-primary text-2xl">stadium</span>
          )}
          <span className="font-headline font-bold text-base tracking-tight truncate">{title}</span>
        </div>
        {action}
      </div>
    </header>
  );
}

function BottomNav({ active }) {
  const items = [
    { id: "album", icon: "auto_stories", label: "Álbum" },
    { id: "matches", icon: "swap_horiz", label: "Matches" },
    { id: "map", icon: "map", label: "Mapa" },
    { id: "profile", icon: "person", label: "Perfil" },
  ];
  return (
    <nav className="bottom-nav flex">
      {items.map(it => (
        <div key={it.id} className={`bottom-nav-item ${active === it.id ? "active" : ""}`}>
          <span className="material-symbols-outlined" style={{ fontSize: "1.375rem" }}>{it.icon}</span>
          <span>{it.label}</span>
        </div>
      ))}
    </nav>
  );
}

Object.assign(window, {
  Sticker, NeedSticker, StatPill, Avatar, StarRating,
  ProgressBar, QRCodeViz, AppHeader, BottomNav,
});
