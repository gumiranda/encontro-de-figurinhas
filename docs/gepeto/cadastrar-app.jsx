/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */
const { useState: uState, useMemo: uMemo, useEffect: uEffect, useRef: uRef } = React;
const { COUNTRIES, STICKERS, buildInitialCounts } = window.CADASTRAR_DATA;
const Icon = window.CadIcon;
const Ring = window.CadRing;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tileVariant": "tristate",
  "showAlphaIndex": true,
  "groupingMode": "country",
  "celebrate": true
}/*EDITMODE-END*/;

const FILTERS = [
  { id: "all", label: "Todas" },
  { id: "missing", label: "Faltam" },
  { id: "have", label: "Tenho" },
  { id: "dupe", label: "Repetidas" },
];

/* ---------- Country pill (in horizontal strip) ---------- */
function CountryPill({ c, total, have, dupe, active, onClick }) {
  const pct = have / total;
  return (
    <button onClick={onClick} style={{
      flexShrink: 0,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      width: 64, padding: "8px 4px",
      borderRadius: 12,
      background: active ? "var(--container-highest)" : "transparent",
      border: `1px solid ${active ? "var(--primary)" : "transparent"}`,
      cursor: "pointer",
      position: "relative",
    }}>
      <div style={{ position: "relative", width: 36, height: 36, display: "grid", placeItems: "center" }}>
        <Ring size={36} stroke={3} value={pct}
          color={pct === 1 ? "var(--tertiary)" : "var(--secondary)"} />
        <span style={{ position: "absolute", fontSize: 18 }}>{c.flag}</span>
        {dupe > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -4,
            minWidth: 14, height: 14, padding: "0 3px",
            borderRadius: 99,
            background: "var(--secondary)", color: "var(--on-secondary)",
            fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
            display: "grid", placeItems: "center",
            border: "1.5px solid var(--bg)",
          }}>+{dupe}</span>
        )}
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
        color: active ? "var(--primary)" : "var(--muted)",
        letterSpacing: "0.06em",
      }}>{c.code}</div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 9,
        color: pct === 1 ? "var(--tertiary)" : "var(--muted)",
      }}>
        {have}/{total}
      </div>
    </button>
  );
}

/* ---------- Sticker tile (tri-state, in-place +/- ) ---------- */
function StickerTile({ s, count, onChange, selected, onSelect, bulkMode }) {
  const longPressRef = uRef(null);

  const state = count === 0 ? "missing" : count === 1 ? "have" : "dupe";
  const bg = state === "missing" ? "linear-gradient(160deg, #161c30 0%, #0e1322 100%)"
    : state === "have" ? "linear-gradient(160deg, rgba(149,170,255,0.18) 0%, #131a2f 100%)"
    : "linear-gradient(160deg, rgba(79,243,37,0.22) 0%, #131a2f 100%)";
  const border = state === "missing" ? "1px dashed var(--outline-variant)"
    : state === "have" ? "1px solid var(--primary)"
    : "1px solid var(--secondary)";

  const MAX = 4;
  const handleClick = () => {
    if (bulkMode) { onSelect?.(); return; }
    onChange(count >= MAX ? 0 : count + 1);
  };
  const handleAux = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bulkMode) return;
    onChange(Math.max(0, count - 1));
  };

  return (
    <div onClick={handleClick}
      onContextMenu={handleAux}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
      onPointerDown={(e) => {
        if (bulkMode) return;
        longPressRef.current = setTimeout(() => onSelect?.(), 380);
      }}
      onPointerUp={() => clearTimeout(longPressRef.current)}
      onPointerLeave={() => clearTimeout(longPressRef.current)}
      style={{
        position: "relative",
        aspectRatio: "3/4",
        padding: "8px 6px 6px",
        background: bg,
        border,
        outline: selected ? "2px solid var(--tertiary)" : "none",
        outlineOffset: 1,
        borderRadius: 12,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        cursor: "pointer",
        textAlign: "left",
        transition: "transform 0.15s, background 0.2s",
        overflow: "hidden",
        userSelect: "none",
      }}>
      {/* count badge */}
      {count >= 1 && (
        <div style={{
          position: "absolute", top: 5, right: 5,
          minWidth: 20, height: 20, padding: "0 6px",
          borderRadius: 99,
          background: count > 1 ? "var(--secondary)" : "var(--primary)",
          color: count > 1 ? "var(--on-secondary)" : "var(--on-primary)",
          fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
          display: "grid", placeItems: "center",
          zIndex: 2,
        }}>{count > 1 ? `×${count}` : <Icon name="check" size={11} />}</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 16, lineHeight: 1, opacity: state === "missing" ? 0.5 : 1 }}>{s.flag}</span>
        {s.isLogo && <Icon name="sparkles" size={9} color="var(--tertiary)" />}
      </div>

      <div>
        <div style={{
          fontFamily: "var(--headline)",
          fontSize: 22, fontWeight: 700, lineHeight: 1,
          color: state === "missing" ? "var(--muted)"
            : state === "have" ? "var(--primary)"
            : "var(--secondary)",
          fontVariantNumeric: "tabular-nums",
        }}>{s.num}</div>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 9,
          color: "var(--muted)", marginTop: 2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{s.name}</div>
      </div>


    </div>
  );
}

/* ---------- Country section block ---------- */
function CountrySection({ country, stickers, counts, setCount, filter, recentlyTouched, bulkMode, selected, toggleSel }) {
  const filtered = uMemo(() => {
    return stickers.filter((s) => {
      const k = s.code + s.num;
      if (recentlyTouched.has(k)) return true;
      const c = counts[k] || 0;
      if (filter === "missing" && c !== 0) return false;
      if (filter === "have" && c === 0) return false;
      if (filter === "dupe" && c < 2) return false;
      return true;
    });
  }, [stickers, counts, filter, recentlyTouched]);

  if (filtered.length === 0) return null;

  const total = stickers.length;
  const have = stickers.filter((s) => (counts[s.code + s.num] || 0) >= 1).length;
  const dupes = stickers.reduce((acc, s) => acc + Math.max(0, (counts[s.code + s.num] || 0) - 1), 0);
  const pct = have / total;

  return (
    <div id={`sec-${country.code}`} style={{ marginBottom: 22 }}>
      <div style={{
        background: "transparent",
        margin: "0 -16px",
        padding: "6px 16px 10px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>{country.flag}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="h-display" style={{ fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            {country.name}
            <span style={{
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
              letterSpacing: "0.08em",
            }}>{country.code}</span>
            {pct === 1 && (
              <span style={{
                padding: "1px 6px", borderRadius: 4,
                background: "rgba(255,201,101,0.15)", color: "var(--tertiary)",
                fontFamily: "var(--headline)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
              }}>FULL</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
            <div style={{
              flex: 1, height: 4, borderRadius: 99,
              background: "rgba(149,170,255,0.12)", overflow: "hidden",
              maxWidth: 120,
            }}>
              <div style={{
                width: `${pct * 100}%`, height: "100%",
                background: pct === 1 ? "var(--tertiary)" : "linear-gradient(90deg, var(--primary), var(--secondary))",
                transition: "width 0.4s",
              }} />
            </div>
            <span style={{
              fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap",
            }}>
              {have}/{total}
              {dupes > 0 && <span style={{ color: "var(--secondary)", whiteSpace: "nowrap" }}>{" · +"}{dupes}{"\u00A0rep"}</span>}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8, marginTop: 12,
      }}>
        {filtered.map((s) => {
          const k = s.code + s.num;
          return (
            <StickerTile key={k} s={s} count={counts[k] || 0}
              onChange={(n) => setCount(k, n)}
              selected={selected.has(k)}
              onSelect={() => toggleSel(k)}
              bulkMode={bulkMode}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Quick-add palette (number entry) ---------- */
function QuickAdd({ onAdd, country }) {
  const [open, setOpen] = uState(false);
  const [num, setNum] = uState("");
  const inputRef = uRef(null);

  uEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 32, paddingInline: 12,
          borderRadius: 99,
          background: "var(--primary)", color: "var(--on-primary)",
          border: 0, cursor: "pointer",
          fontFamily: "var(--body)", fontSize: 12, fontWeight: 700,
          whiteSpace: "nowrap", flexShrink: 0,
        }}>
        <Icon name="plus" size={13} /> Colar rápido
      </button>
    );
  }

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      height: 32, padding: "0 4px 0 10px",
      borderRadius: 99,
      background: "var(--container-highest)",
      border: "1px solid var(--primary)",
    }}>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 11,
        color: "var(--muted)", letterSpacing: "0.06em",
      }}>{country?.code || "###"}</span>
      <input ref={inputRef} value={num} onChange={(e) => setNum(e.target.value.replace(/\D/g, "").slice(0, 3))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && num) { onAdd(num.padStart(3, "0")); setNum(""); }
          if (e.key === "Escape") { setOpen(false); setNum(""); }
        }}
        placeholder="042"
        style={{
          width: 50, height: 24, padding: 0,
          background: "transparent", border: 0, color: "var(--fg)",
          fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700,
          outline: "none", letterSpacing: "0.05em",
        }} />
      <button onClick={() => { if (num) { onAdd(num.padStart(3, "0")); setNum(""); } }}
        disabled={!num}
        style={{
          width: 24, height: 24, borderRadius: 99,
          background: num ? "var(--primary)" : "var(--outline-variant)",
          color: num ? "var(--on-primary)" : "var(--muted)",
          border: 0, cursor: num ? "pointer" : "default",
          display: "grid", placeItems: "center",
        }}>
        <Icon name="plus" size={12} />
      </button>
      <button onClick={() => { setOpen(false); setNum(""); }}
        style={{
          width: 24, height: 24, padding: 0,
          background: "transparent", border: 0, color: "var(--muted)", cursor: "pointer",
        }}>
        <Icon name="x" size={12} />
      </button>
    </div>
  );
}

/* ---------- Header ---------- */
function Header({ counts, totals }) {
  return (
    <div className="tab-switcher" style={{ padding: "12px 16px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <a href="Perfis.html" style={{
          color: "var(--muted)", textDecoration: "none",
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, fontWeight: 600,
        }}>
          <Icon name="back" size={14} /> Voltar
        </a>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1 }}>
          <span className="h-display" style={{ fontSize: 14, color: "var(--primary)", whiteSpace: "nowrap" }}>Cadastrar</span>
          <span className="label-mono" style={{ fontSize: 8, marginTop: 2, lineHeight: 1, whiteSpace: "nowrap" }}>
            {totals.have}/{totals.all} · +{totals.dupes} REP
          </span>
        </div>
        <button style={{
          width: 32, height: 32, borderRadius: 99,
          background: "var(--container-highest)", color: "var(--fg)",
          border: "1px solid var(--outline-variant)", cursor: "pointer",
          display: "grid", placeItems: "center",
        }}>
          <Icon name="scan" size={14} />
        </button>
      </div>

      {/* Big progress bar */}
      <div style={{
        height: 10, borderRadius: 99,
        background: "rgba(149,170,255,0.1)",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          width: `${(totals.have / totals.all) * 100}%`, height: "100%",
          background: "linear-gradient(90deg, var(--primary), var(--secondary), var(--tertiary))",
          transition: "width 0.5s",
        }} />
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between", gap: 8,
        marginTop: 4,
        fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
      }}>
        <span style={{ whiteSpace: "nowrap" }}><span style={{ color: "var(--primary)" }}>●</span> {totals.have} coladas</span>
        <span style={{ whiteSpace: "nowrap" }}><span style={{ color: "var(--secondary)" }}>●</span> +{totals.dupes} rep</span>
        <span style={{ whiteSpace: "nowrap" }}><span style={{ color: "var(--muted)" }}>●</span> {totals.all - totals.have} faltam</span>
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */
function FloatToast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", left: "50%", bottom: 20,
      transform: "translateX(-50%)",
      background: "var(--container-highest)",
      border: "1px solid var(--primary)",
      borderRadius: 12,
      padding: "10px 14px",
      display: "flex", gap: 8, alignItems: "center",
      fontSize: 13, fontWeight: 600,
      boxShadow: "0 14px 40px -8px rgba(0,0,0,0.6)",
      zIndex: 200,
      animation: "fadeUp 0.2s ease",
    }}>
      {msg}
    </div>
  );
}

/* ---------- Bulk action bar ---------- */
function BulkBar({ selected, onClear, onMark, onMarkDupe }) {
  if (selected.size === 0) return null;
  return (
    <div style={{
      position: "sticky", bottom: 14, zIndex: 50,
      margin: "16px auto 0",
      width: "calc(100% - 16px)",
      background: "var(--container-highest)",
      border: "1px solid var(--tertiary)",
      borderRadius: 14,
      padding: "10px 12px",
      display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 14px 40px -10px rgba(0,0,0,0.7)",
    }}>
      <button onClick={onClear} style={{
        width: 28, height: 28, borderRadius: 8,
        background: "transparent", color: "var(--muted)",
        border: "1px solid var(--outline-variant)", cursor: "pointer",
        display: "grid", placeItems: "center",
      }}>
        <Icon name="x" size={14} />
      </button>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700,
        color: "var(--tertiary)",
      }}>{selected.size} selecionada{selected.size > 1 ? "s" : ""}</span>
      <div style={{ flex: 1 }} />
      <button onClick={onMarkDupe} className="btn btn-secondary"
        style={{ height: 32, paddingInline: 10, fontSize: 11 }}>
        <Icon name="plus" size={12} /> Repetida
      </button>
      <button onClick={onMark} className="btn btn-primary"
        style={{ height: 32, paddingInline: 10, fontSize: 11 }}>
        <Icon name="check" size={12} /> Tenho
      </button>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [counts, setCounts] = uState(() => buildInitialCounts());
  const [activeCountry, setActiveCountry] = uState("BRA");
  const [filter, setFilter] = uState("all");
  const [bulkMode, setBulkMode] = uState(false);
  const [selected, setSelected] = uState(new Set());
  const [recentlyTouched, setRecentlyTouched] = uState(new Set());
  const [toast, setToast] = uState("");
  const [history, setHistory] = uState([]);

  const totals = uMemo(() => {
    let all = 0, have = 0, dupes = 0;
    Object.values(STICKERS).forEach((arr) => {
      all += arr.length;
      arr.forEach((s) => {
        const c = counts[s.code + s.num] || 0;
        if (c >= 1) have++;
        if (c >= 2) dupes += c - 1;
      });
    });
    return { all, have, dupes };
  }, [counts]);

  const setCount = (k, n) => {
    const prev = counts[k] || 0;
    setCounts((c) => ({ ...c, [k]: n }));
    setHistory((h) => [...h.slice(-19), { k, prev }]);
    setRecentlyTouched((s) => { const x = new Set(s); x.add(k); return x; });
    if (n === 0 && prev > 0) setToast("Desmarcada");
    else if (n === 1 && prev === 0) setToast("✓ Colada!");
    else if (n > prev && n >= 2) setToast(`Repetida ×${n}`);
    else if (n < prev) setToast("− 1");
    setTimeout(() => setToast(""), 1500);
  };

  const toggleSel = (k) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k); else n.add(k);
      return n;
    });
    if (!bulkMode) setBulkMode(true);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setCounts((c) => ({ ...c, [last.k]: last.prev }));
    setHistory((h) => h.slice(0, -1));
    setToast("Desfeito");
    setTimeout(() => setToast(""), 1200);
  };

  const bulkApply = (mode) => {
    const newCounts = { ...counts };
    selected.forEach((k) => {
      const cur = newCounts[k] || 0;
      if (mode === "have") newCounts[k] = Math.max(1, cur);
      else if (mode === "dupe") newCounts[k] = Math.max(2, cur + 1);
    });
    setCounts(newCounts);
    setToast(`${selected.size} ${mode === "have" ? "marcadas" : "como repetidas"}`);
    setSelected(new Set());
    setBulkMode(false);
    setTimeout(() => setToast(""), 1500);
  };

  const quickAddTo = (countryCode, num) => {
    const k = countryCode + num;
    if (!STICKERS[countryCode]?.find((s) => s.num === num)) {
      setToast(`#${num} não existe em ${countryCode}`);
      setTimeout(() => setToast(""), 1500);
      return;
    }
    setCount(k, (counts[k] || 0) + 1);
  };

  // jump to country section
  const jumpTo = (code) => {
    setActiveCountry(code);
    setTimeout(() => {
      const el = document.getElementById(`sec-${code}`);
      if (el) {
        const container = el.closest(".device-inner");
        const top = el.getBoundingClientRect().top - (container?.getBoundingClientRect().top || 0) + (container?.scrollTop || 0) - 130;
        container?.scrollTo({ top, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <>
      <div className="device" data-screen-label="Cadastrar figurinhas">
        <div className="device-inner">
          <Header counts={counts} totals={totals} />

          {/* Country strip */}
          <div style={{
            position: "sticky", top: 0, zIndex: 20,
            background: "rgba(9,14,28,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--outline-variant)",
          }}>
            <div style={{
              display: "flex", gap: 4,
              overflowX: "auto", padding: "8px 12px",
              scrollbarWidth: "none",
            }}>
              {COUNTRIES.map((c) => {
                const arr = STICKERS[c.code];
                const have = arr.filter((s) => (counts[s.code + s.num] || 0) >= 1).length;
                const dupe = arr.reduce((a, s) => a + Math.max(0, (counts[s.code + s.num] || 0) - 1), 0);
                return (
                  <CountryPill key={c.code} c={c} total={arr.length} have={have} dupe={dupe}
                    active={activeCountry === c.code}
                    onClick={() => jumpTo(c.code)} />
                );
              })}
            </div>
          </div>

          {/* Filter + tools row (sticky) */}
          <div style={{
            position: "sticky", top: 88, zIndex: 15,
            background: "rgba(9,14,28,0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--outline-variant)",
            display: "flex", gap: 6, padding: "10px 16px",
            overflowX: "auto", scrollbarWidth: "none", alignItems: "center",
          }}>
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button key={f.id} onClick={() => { setFilter(f.id); setRecentlyTouched(new Set()); }}
                  style={{
                    flexShrink: 0,
                    height: 28, paddingInline: 12,
                    borderRadius: 99,
                    background: on ? "var(--fg)" : "transparent",
                    color: on ? "var(--bg)" : "var(--muted)",
                    border: `1px solid ${on ? "var(--fg)" : "var(--outline-variant)"}`,
                    fontFamily: "var(--body)", fontSize: 11, fontWeight: 700,
                    cursor: "pointer",
                  }}>
                  {f.label}
                </button>
              );
            })}
            <div style={{ flex: 1, minWidth: 8 }} />
            <QuickAdd country={COUNTRIES.find((c) => c.code === activeCountry)}
              onAdd={(num) => quickAddTo(activeCountry, num)} />
            <button onClick={() => { setBulkMode(!bulkMode); if (bulkMode) setSelected(new Set()); }}
              style={{
                height: 28, paddingInline: 10,
                borderRadius: 99,
                background: bulkMode ? "var(--tertiary)" : "transparent",
                color: bulkMode ? "var(--on-tertiary)" : "var(--muted)",
                border: `1px solid ${bulkMode ? "var(--tertiary)" : "var(--outline-variant)"}`,
                fontFamily: "var(--body)", fontSize: 11, fontWeight: 700,
                cursor: "pointer",
                flexShrink: 0,
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
              <Icon name="grid" size={11} /> Lote
            </button>
            <button onClick={undo} disabled={history.length === 0}
              style={{
                width: 28, height: 28,
                borderRadius: 99,
                background: "transparent",
                color: history.length ? "var(--muted)" : "var(--outline-variant)",
                border: "1px solid var(--outline-variant)",
                cursor: history.length ? "pointer" : "default",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
              <Icon name="undo" size={12} />
            </button>
          </div>

          {/* Sections */}
          <div style={{ padding: "14px 16px 30px" }}>
            {COUNTRIES.map((c) => (
              <CountrySection key={c.code}
                country={c}
                stickers={STICKERS[c.code]}
                counts={counts}
                setCount={setCount}
                filter={filter}
                recentlyTouched={recentlyTouched}
                bulkMode={bulkMode}
                selected={selected}
                toggleSel={toggleSel}
              />
            ))}
          </div>

          <BulkBar selected={selected}
            onClear={() => { setSelected(new Set()); setBulkMode(false); }}
            onMark={() => bulkApply("have")}
            onMarkDupe={() => bulkApply("dupe")}
          />
        </div>
      </div>

      <FloatToast msg={toast} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Cards">
          <TweakSelect label="Variante"
            value={tweaks.tileVariant}
            onChange={(v) => setTweak("tileVariant", v)}
            options={[
              { value: "tristate", label: "Tri-estado (atual)" },
              { value: "compact", label: "Compacto" },
            ]} />
        </TweakSection>
        <TweakSection label="Comportamento">
          <TweakToggle label="Celebração ao colar" value={tweaks.celebrate} onChange={(v) => setTweak("celebrate", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
