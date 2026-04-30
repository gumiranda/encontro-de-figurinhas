// Mount the canvas. Each variant gets its own artboard with proper background
// to test legibility on dark/light/pitch/gold contexts.

function ArtboardCenter({ children, stage = "stage-dark", footer }) {
  return (
    <div className={`${stage} hairline`} style={{
      width:"100%", height:"100%",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:32, position:"relative", overflow:"hidden",
    }}>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", width:"100%" }}>
        {children}
      </div>
      {footer && (
        <div className="ff-mono" style={{
          fontSize:10, opacity:0.4, letterSpacing:"0.16em",
          textTransform:"uppercase", marginTop:12,
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <DesignCanvas>

      <DCSection id="primary" title="Marca principal">
        <DCArtboard id="lockup-dark" label="Lockup horizontal · dark (header)" width={620} height={300}>
          <ArtboardCenter stage="stage-dark" footer="primary lockup · 1× · dark surface">
            <V07_Lockup />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="lockup-light" label="Lockup horizontal · light (impresso, light mode)" width={620} height={300}>
          <ArtboardCenter stage="stage-light" footer="primary lockup · 1× · light surface">
            <V07_Lockup light />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="wordmark-dark" label="Wordmark · marca completa" width={1100} height={320}>
          <ArtboardCenter stage="stage-dark" footer="V01 · figurinha + fácil + sticker dot">
            <V01_Wordmark />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="wordmark-light" label="Wordmark · light surface" width={1100} height={320}>
          <ArtboardCenter stage="stage-light" footer="V01 · light context">
            <V01_Wordmark light />
          </ArtboardCenter>
        </DCArtboard>
      </DCSection>

      <DCSection id="marks" title="Marcas / símbolos">
        <DCArtboard id="ff-trade" label="Monograma FF (troca)" width={420} height={420}>
          <ArtboardCenter stage="stage-dark" footer="V02 · duas figurinhas se sobrepondo">
            <V02_FFTrade />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="seal" label="Selo / carimbo" width={420} height={420}>
          <ArtboardCenter stage="stage-deep" footer="V03 · emblema oficial">
            <V03_Seal />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="shield" label="Escudo (clube)" width={420} height={420}>
          <ArtboardCenter stage="stage-pitch" footer="V04 · futebolístico, escudo">
            <V04_Shield />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="mark-abstract" label="Símbolo abstrato (favicon/avatar)" width={420} height={420}>
          <ArtboardCenter stage="stage-dark" footer="V08 · espaços pequenos">
            <V08_Mark />
          </ArtboardCenter>
        </DCArtboard>
      </DCSection>

      <DCSection id="featured" title="Tratamentos especiais">
        <DCArtboard id="peeled" label="Sticker peeled · BRA-10" width={420} height={520}>
          <ArtboardCenter stage="stage-deep" footer="V05 · figurinha de verdade">
            <V05_StickerPeeled />
          </ArtboardCenter>
        </DCArtboard>

        <DCArtboard id="app-icon" label="App icon (iOS / Android)" width={420} height={520}>
          <ArtboardCenter stage="stage-dark" footer="V06 · 1024×1024 squircle">
            <V06_AppIcon />
          </ArtboardCenter>
        </DCArtboard>
      </DCSection>

      <DCSection id="contexts" title="Validação em contexto">
        {/* Header sample */}
        <DCArtboard id="header-app" label="No header do app (mobile)" width={420} height={120}>
          <div className="stage-dark" style={{
            width:"100%", height:"100%",
            display:"flex", alignItems:"center",
            padding:"0 20px",
            borderBottom:"1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ transform:"scale(0.78)", transformOrigin:"left center" }}>
              <V07_Lockup />
            </div>
          </div>
        </DCArtboard>

        {/* Browser tab favicon row */}
        <DCArtboard id="favicon-row" label="Favicon · barra do navegador" width={620} height={120}>
          <div className="stage-light" style={{
            width:"100%", height:"100%",
            display:"flex", alignItems:"center", padding:"0 20px", gap:14,
            background:"#e8e6df",
          }}>
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"8px 14px", borderRadius:8,
              background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.08)",
              border:"1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{ transform:"scale(0.16)", transformOrigin:"left center", width:24, height:24, marginRight:-8 }}>
                <V08_Mark />
              </div>
              <span className="ff-mono" style={{ fontSize:12, color:"#0d1323" }}>FigurinhaFácil</span>
              <span style={{ fontSize:14, opacity:0.4, marginLeft:8 }}>×</span>
            </div>
          </div>
        </DCArtboard>

        {/* Avatar / app icon on phone */}
        <DCArtboard id="phone-icon" label="App icon · home screen" width={420} height={420}>
          <div className="stage-dark" style={{
            width:"100%", height:"100%",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            background:"linear-gradient(160deg, #1a3a5c 0%, #0d1323 100%)",
          }}>
            <div style={{ transform:"scale(0.8)" }}>
              <V06_AppIcon />
            </div>
            <span className="ff-mono" style={{
              color:"#fff", fontSize:13, marginTop:14, fontWeight:600,
            }}>FigurinhaFácil</span>
          </div>
        </DCArtboard>
      </DCSection>

    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
