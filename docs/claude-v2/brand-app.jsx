// Mount the canvas. One artboard per spec page so they can be reordered,
// renamed, and focused fullscreen.

function App() {
  return (
    <DesignCanvas>
      <DCSection id="brand-spec" title="Brand book · FigurinhaFácil">
        <DCArtboard id="page-mark" label="01 · A marca" width={1200} height={1500}>
          <PageMark />
        </DCArtboard>
        <DCArtboard id="page-colors" label="02 · Cores" width={1200} height={1500}>
          <PageColors />
        </DCArtboard>
        <DCArtboard id="page-type" label="03 · Tipografia & voz" width={1200} height={1500}>
          <PageType />
        </DCArtboard>
        <DCArtboard id="page-variants" label="04 · Aplicação & don'ts" width={1200} height={1500}>
          <PageVariations />
        </DCArtboard>
      </DCSection>

      <DCSection id="brand-applied" title="Em uso">
        <DCArtboard id="page-hero" label="05 · Landing hero (1440×900)" width={1440} height={900}>
          <PageHero />
        </DCArtboard>
        <DCArtboard id="page-mobile" label="06 · App · push · share card" width={1440} height={900}>
          <PageMobile />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
