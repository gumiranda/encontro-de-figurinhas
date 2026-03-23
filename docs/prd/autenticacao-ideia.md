## 3. Autenticação — Clerk

### 3.1 Fluxo

Login/cadastro via Clerk (Google, email+senha, ou phone). Clerk gerencia sessão, tokens e toda a camada de auth. Após primeiro login, o app pede dados complementares: apelido (obrigatório, público, único), data de nascimento (obrigatório, para validação de idade), cidade (autocomplete). Esses dados são salvos na tabela `users` do Convex, vinculados ao `clerkId`.

### 3.2 Integração técnica

Clerk provider no layout root do Next.js. Middleware de auth protege todas as rotas exceto landing, páginas públicas de cidade e página de ponto (compartilhável). Convex webhook ou `useUser()` do Clerk pra sincronizar `clerkId` com a tabela `users` no primeiro acesso. Nenhum dado sensível do Clerk (email, phone) é exposto em queries públicas do Convex — o `clerkId` é chave interna, o mundo externo só vê apelido.

### 3.3 Custo

Clerk free tier: 50.000 MRU (Monthly Retained Users — contado quando retorna 24h+ após cadastro). Com 100k MRU: ~$1.025/mês ($25 base Pro + $0,02 × 50k excedentes). Monitorar uso; se ultrapassar 50k MRU no free tier, avaliar migração para Firebase Auth (~$275/mês com 100k MAU) ou Convex Auth nativo.

### 3.4 WhatsApp — zero integração de API

Links de grupo de WhatsApp são strings estáticas cadastradas manualmente pelo admin no painel, coladas no campo `whatsappLink` do ponto de troca. O app renderiza um botão verde que abre `https://chat.whatsapp.com/XXXX` no browser/app do usuário. Abrir sempre com `target="_blank"` para evitar WebView interno em PWAs standalone. Se WhatsApp não estiver instalado, o link redireciona para a loja de apps. Fallback: botão "Não conseguiu abrir? Copie o link" com clipboard copy. Links de convite do WhatsApp não expiram por tempo, mas admins podem revogar — implementar sistema de report "Link não funciona" e health check periódico (HEAD request → 404 = inválido → notificar admin).

---
