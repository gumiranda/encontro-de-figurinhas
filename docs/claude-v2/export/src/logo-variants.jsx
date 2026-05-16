// Each variant is wrapped in a <DCArtboard> by app.jsx.
// Designed at "specimen" sizes; the canvas scales them. Keep variants pure visuals.

// ─────────────────────────────────────────────────────────────
// V01 — Wordmark com sticker corner
//   Tipo: ff. tracking apertado. ponto = pixel da figurinha.
//   Direção: simples, moderno, web-friendly.
// ─────────────────────────────────────────────────────────────
function V01_Wordmark({ light }) {
  const fg = light ? "#0d1323" : "#e1e4fa";
  const accentBlue = "#3766ff";
  const accentGreen = "#4ff325";
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:0 }}>
      <span className="ff-headline" style={{ fontSize:108, color:fg, lineHeight:0.85 }}>
        figurinha
      </span>
      <span className="ff-headline" style={{
        fontSize:108, color:accentBlue, lineHeight:0.85,
        marginLeft:"0.1em", letterSpacing:"-0.05em",
      }}>
        fácil
      </span>
      {/* the dot accent — pitch green pixel-square that doubles as a sticker mark */}
      <span style={{
        display:"inline-block",
        width:18, height:18,
        background:accentGreen,
        marginLeft:6, marginBottom:6,
        boxShadow:`0 0 0 4px ${light?"#fff":"#090e1c"}, 0 0 0 5px ${accentGreen}`,
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V02 — Monograma "FF" como duas figurinhas sobrepostas (troca)
//   Conceitual: a marca SÃO duas figurinhas, uma azul outra verde,
//   levemente rotacionadas, sugerindo o ato de troca.
// ─────────────────────────────────────────────────────────────
function V02_FFTrade() {
  return (
    <div style={{ position:"relative", width:200, height:200 }}>
      {/* sticker "F" #1 — azul, atrás, rotacionada */}
      <div style={{
        position:"absolute", left:0, top:14, width:120, height:160,
        background:"linear-gradient(160deg, #95aaff 0%, #3766ff 100%)",
        borderRadius:14,
        border:"4px solid #fff",
        boxShadow:"0 12px 28px -8px rgba(0,36,126,0.5)",
        transform:"rotate(-8deg)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span className="ff-headline" style={{
          fontSize:96, color:"#00247e", lineHeight:1,
        }}>F</span>
      </div>
      {/* sticker "F" #2 — verde, à frente, rotacionada o oposto */}
      <div style={{
        position:"absolute", right:0, top:26, width:120, height:160,
        background:"linear-gradient(160deg, #4ff325 0%, #176e00 100%)",
        borderRadius:14,
        border:"4px solid #fff",
        boxShadow:"0 12px 28px -8px rgba(16,85,0,0.5)",
        transform:"rotate(8deg)",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span className="ff-headline" style={{
          fontSize:96, color:"#105500", lineHeight:1,
        }}>F</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V03 — Selo / carimbo
//   Direção: emblema de coleção, pesado, "selo oficial".
// ─────────────────────────────────────────────────────────────
function V03_Seal() {
  return (
    <div className="ff-seal">
      <div className="ff-pitch-arc"></div>
      <div style={{
        position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center", flexDirection:"column",
        zIndex:2,
      }}>
        <span className="ff-headline" style={{ fontSize:48, color:"#5f4200", lineHeight:0.85 }}>FF</span>
        <span className="ff-mono" style={{
          fontSize:9, fontWeight:600, color:"#5f4200",
          marginTop:2, letterSpacing:"0.2em",
        }}>EST · 2026</span>
        <span style={{
          width:32, height:2, background:"#5f4200", marginTop:6,
        }}></span>
        <span className="ff-mono" style={{
          fontSize:8, fontWeight:600, color:"#5f4200",
          marginTop:4, letterSpacing:"0.16em",
        }}>FIGURINHA · FÁCIL</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V04 — Escudo (clube)
//   Direção: futebolístico, evoca "clube de colecionadores".
// ─────────────────────────────────────────────────────────────
function V04_Shield() {
  return (
    <div className="ff-shield">
      {/* listra horizontal */}
      <div style={{
        position:"absolute", top:"45%", left:0, right:0, height:18,
        background:"#4ff325",
        boxShadow:"0 -1px 0 rgba(0,0,0,0.15), 0 1px 0 rgba(0,0,0,0.15)",
      }}></div>
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        position:"relative", zIndex:2,
      }}>
        <span className="ff-headline" style={{
          fontSize:64, color:"#fff", lineHeight:0.85,
          textShadow:"0 2px 0 #00247e",
        }}>FF</span>
        <span className="ff-mono" style={{
          fontSize:8, fontWeight:700, color:"#fff",
          marginTop:24, letterSpacing:"0.18em",
        }}>COPA 2026</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V05 — Sticker peeled (a estrela)
//   Direção: figurinha levantando do papel, número "10" — referência clara.
// ─────────────────────────────────────────────────────────────
function V05_StickerPeeled() {
  return (
    <div style={{ position:"relative", width:200, transform:"rotate(-3deg)" }}>
      <div className="ff-sticker grain">
        <div className="ff-sticker-photo" style={{
          background:"linear-gradient(180deg, #3766ff 0%, #00247e 100%)",
          display:"flex", alignItems:"flex-end", justifyContent:"center",
          padding:"0 0 12px 0",
          position:"relative", overflow:"hidden",
        }}>
          {/* numeral */}
          <span className="ff-headline" style={{
            fontSize:140, color:"#fff", lineHeight:0.85,
            textShadow:"0 4px 0 rgba(0,0,0,0.2)",
          }}>10</span>
          {/* tiny crowd-noise lines */}
          <div style={{
            position:"absolute", top:14, left:14,
            display:"flex", flexDirection:"column", gap:3,
          }}>
            {[28,20,24].map((w,i) => (
              <span key={i} style={{ width:w, height:3, background:"rgba(255,255,255,0.5)", borderRadius:2 }} />
            ))}
          </div>
        </div>
        <div style={{
          display:"flex", justifyContent:"space-between",
          alignItems:"center", marginTop:10,
        }}>
          <div>
            <div className="ff-mono" style={{ fontSize:9, color:"#a6aabf", letterSpacing:"0.18em" }}>BRA-10</div>
            <div className="ff-headline" style={{ fontSize:16, color:"#0d1323" }}>Capitão</div>
          </div>
          <span style={{ fontSize:22 }}>🇧🇷</span>
        </div>
      </div>
      {/* peeled corner */}
      <div className="ff-peel"></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V06 — App icon (squircle)
//   Direção: ícone iOS-style, FF puro, gradient do brand.
// ─────────────────────────────────────────────────────────────
function V06_AppIcon() {
  return (
    <div className="ff-squircle">
      {/* Stack illusion: 2 sticker rectangles behind FF */}
      <div style={{
        position:"absolute", left:18, top:14, bottom:14, width:40,
        background:"rgba(255,255,255,0.25)",
        borderRadius:8,
        border:"2px solid rgba(255,255,255,0.35)",
        transform:"rotate(-6deg)",
      }}></div>
      <div style={{
        position:"absolute", right:18, top:14, bottom:14, width:40,
        background:"rgba(255,255,255,0.35)",
        borderRadius:8,
        border:"2px solid rgba(255,255,255,0.5)",
        transform:"rotate(6deg)",
      }}></div>
      <span className="ff-headline" style={{
        fontSize:64, color:"#fff", lineHeight:0.85,
        textShadow:"0 2px 0 rgba(0,36,126,0.6)",
        position:"relative", zIndex:2,
      }}>FF</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V07 — Lockup horizontal (mark + wordmark)
//   Direção: o que vai no header do app/site.
// ─────────────────────────────────────────────────────────────
function V07_Lockup({ light }) {
  const fg = light ? "#0d1323" : "#e1e4fa";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      {/* mark — mini sticker FF */}
      <div style={{
        position:"relative", width:56, height:56,
        background:"linear-gradient(160deg, #3766ff 0%, #95aaff 100%)",
        borderRadius:12,
        border:"3px solid #fff",
        boxShadow:"0 6px 14px -4px rgba(0,36,126,0.5)",
        display:"flex", alignItems:"center", justifyContent:"center",
        flex:"0 0 56px",
      }}>
        <span className="ff-headline" style={{
          fontSize:28, color:"#00247e", lineHeight:0.85,
        }}>FF</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
        <span className="ff-headline" style={{ fontSize:34, color:fg, lineHeight:0.9 }}>
          figurinha<span style={{ color:"#3766ff" }}>fácil</span>
          <span style={{
            display:"inline-block", width:8, height:8,
            background:"#4ff325", marginLeft:3, marginBottom:2,
          }}></span>
        </span>
        <span className="ff-mono" style={{
          fontSize:9, color:light?"#5f6072":"#6b7290",
          letterSpacing:"0.22em", marginTop:6,
        }}>TROCA · COPA · 2026</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// V08 — Símbolo abstrato — duas figurinhas em troca (minimalista)
//   Direção: para favicon, social avatar, espaços muito pequenos.
// ─────────────────────────────────────────────────────────────
function V08_Mark() {
  return (
    <div style={{ position:"relative", width:140, height:140 }}>
      {/* figurinha azul (atrás) */}
      <div style={{
        position:"absolute", left:8, top:14, width:80, height:108,
        background:"#3766ff",
        borderRadius:10,
        transform:"rotate(-10deg)",
        boxShadow:"0 8px 18px -4px rgba(0,36,126,0.5)",
      }}>
        <div style={{
          position:"absolute", top:8, left:8, right:8, height:60,
          background:"rgba(255,255,255,0.18)", borderRadius:6,
        }}></div>
      </div>
      {/* figurinha verde (na frente) */}
      <div style={{
        position:"absolute", right:8, top:18, width:80, height:108,
        background:"#4ff325",
        borderRadius:10,
        transform:"rotate(10deg)",
        boxShadow:"0 8px 18px -4px rgba(16,85,0,0.5)",
      }}>
        <div style={{
          position:"absolute", top:8, left:8, right:8, height:60,
          background:"rgba(0,0,0,0.12)", borderRadius:6,
        }}></div>
      </div>
      {/* arrow swap — small white circle in middle */}
      <div style={{
        position:"absolute", left:"50%", top:"50%",
        transform:"translate(-50%,-50%)",
        width:36, height:36, borderRadius:"50%",
        background:"#fff",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 10px rgba(0,0,0,0.3)",
      }}>
        <span className="material-symbols-outlined icon-fill" style={{ fontSize:22, color:"#0d1323" }}>swap_horiz</span>
      </div>
    </div>
  );
}

Object.assign(window, {
  V01_Wordmark, V02_FFTrade, V03_Seal, V04_Shield,
  V05_StickerPeeled, V06_AppIcon, V07_Lockup, V08_Mark,
});
