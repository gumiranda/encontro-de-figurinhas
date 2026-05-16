// Mount: present both profiles side-by-side in a design canvas.

function App() {
  return (
    <DesignCanvas>
      <DCSection id="profiles" title="Perfis · FigurinhaFácil">
        <DCArtboard id="auth" label="Perfil autenticado (meu perfil)" width={420} height={1180}>
          <AuthenticatedProfile />
        </DCArtboard>
        <DCArtboard id="public" label="Perfil público compartilhável (/u/[nickname])" width={420} height={1180}>
          <PublicProfile />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
