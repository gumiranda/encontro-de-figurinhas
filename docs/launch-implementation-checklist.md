# Launch Implementation Checklist

Tarefas técnicas para preparação do lançamento.

## Prioridade 1: Analytics & Tracking (esta semana)

### Implementar Posthog/Mixpanel
```bash
# Instalar
pnpm add posthog-js --filter=web
```

**Eventos a trackear:**
- [ ] `signup_started` - Clicou em criar conta
- [ ] `signup_completed` - Conta criada com sucesso
- [ ] `stickers_added` - Cadastrou figurinhas (count)
- [ ] `match_viewed` - Visualizou um match
- [ ] `match_contacted` - Clicou em WhatsApp
- [ ] `trade_confirmed` - Confirmou troca
- [ ] `checkin_completed` - Fez check-in em ponto
- [ ] `referral_shared` - Compartilhou link de convite
- [ ] `page_view` - Todas as páginas

**Arquivo a criar:** `apps/web/lib/analytics.ts`
```typescript
import posthog from 'posthog-js'

export const analytics = {
  init() {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: 'https://app.posthog.com',
        capture_pageview: true,
      })
    }
  },
  
  track(event: string, properties?: Record<string, any>) {
    posthog.capture(event, properties)
  },
  
  identify(userId: string, traits?: Record<string, any>) {
    posthog.identify(userId, traits)
  },
}
```

---

## Prioridade 2: Email System (esta semana)

### Setup Resend ou Loops
```bash
pnpm add resend --filter=backend
```

**Convex actions necessárias:**
- [ ] `emails/sendWelcome.ts`
- [ ] `emails/sendMatchNotification.ts`
- [ ] `emails/sendDailyDigest.ts`
- [ ] `emails/sendTradeConfirmed.ts`

**Templates HTML:**
- [ ] Welcome email
- [ ] Match notification
- [ ] Daily digest
- [ ] Trade confirmed

**Crons necessários (convex/crons.ts):**
```typescript
// Daily digest às 18h
crons.daily("daily-digest", { hourUTC: 21 }, internal.emails.sendDailyDigests)
```

---

## Prioridade 3: Referral System (semana 2)

### Schema update (schema.ts)
```typescript
referralCodes: defineTable({
  userId: v.id("users"),
  code: v.string(),
  uses: v.number(),
  createdAt: v.number(),
}).index("by_code", ["code"])
  .index("by_user", ["userId"]),

referrals: defineTable({
  referrerId: v.id("users"),
  referredId: v.id("users"),
  createdAt: v.number(),
}),
```

### Funcionalidades
- [ ] Gerar código único por usuário
- [ ] Página `/c/[code]` que redireciona para signup
- [ ] Tracking de conversão
- [ ] Recompensas (futuro)

---

## Prioridade 4: Push Notifications (semana 2)

### Web Push Setup
```bash
pnpm add web-push --filter=backend
```

**Permissões:**
- [ ] Solicitar permissão após primeiro match
- [ ] Armazenar subscription no Convex
- [ ] Enviar notificação em novo match

**Triggers:**
- Novo match encontrado
- Match próximo fez check-in
- Lembrete de atualizar figurinhas (7 dias inativo)

---

## Prioridade 5: Social Sharing (semana 1)

### Open Graph otimizado por página
- [x] Homepage - já existe
- [x] Cidade - já existe  
- [x] Ponto - já existe
- [x] Figurinha - já existe
- [ ] Perfil público do usuário
- [ ] Página de match compartilhável

### Share buttons
- [ ] Componente `ShareButton` com:
  - WhatsApp (prioritário)
  - Twitter/X
  - Facebook
  - Copiar link

### UTM tracking
- [ ] Adicionar UTMs em todos os links compartilhados
- [ ] Pattern: `?utm_source={source}&utm_medium=share&utm_campaign=user`

---

## Prioridade 6: Onboarding Improvements

### Progress indicator
- [ ] Barra de progresso no onboarding
- [ ] Steps: Conta → Localização → Figurinhas → Match

### Empty states
- [ ] Zero matches: mostrar dicas + CTA para convidar amigos
- [ ] Zero figurinhas: tutorial animado
- [ ] Zero pontos próximos: sugerir criar ponto

### Tooltips/Coachmarks
- [ ] First-time user tour com Shepherd.js ou similar
- [ ] Highlight de features importantes

---

## Prioridade 7: Performance

### Core Web Vitals check
```bash
# Verificar com Lighthouse
npx lighthouse https://figurinhafacil.com.br --view
```

**Targets:**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

### Otimizações
- [ ] Image optimization (next/image já usa)
- [ ] Font subsetting (se não estiver)
- [ ] Lazy load abaixo do fold
- [ ] Prefetch de rotas críticas

---

## Prioridade 8: Legal & Compliance

### LGPD
- [ ] Política de privacidade atualizada
- [ ] Termos de uso revisados
- [ ] Banner de cookies (se necessário)
- [ ] Opção de deletar conta

### Contact
- [ ] Email de suporte configurado
- [ ] FAQ atualizado
- [ ] Canal de denúncias (para pontos/usuários)

---

## Prioridade 9: Monitoring

### Error tracking
```bash
pnpm add @sentry/nextjs --filter=web
```

### Uptime monitoring
- [ ] Setup UptimeRobot ou similar
- [ ] Alertas para downtime

### Convex monitoring
- [ ] Dashboard de métricas
- [ ] Alertas de rate limit

---

## Prioridade 10: Content

### Blog posts a criar
1. [ ] "Guia Completo do Álbum da Copa 2026"
2. [ ] "Como Trocar Figurinhas: Guia para Iniciantes"
3. [ ] "10 Melhores Pontos de Troca em São Paulo"
4. [ ] "10 Melhores Pontos de Troca no Rio"
5. [ ] "Figurinhas Mais Raras da Copa 2026"
6. [ ] "Como Usar o Figurinha Fácil em 5 Minutos"

### SEO pages a criar
- [ ] `/estado/[slug]` - páginas por estado (já existe)
- [ ] `/selecao/[slug]` - páginas por seleção (já existe)
- [ ] `/comparar` - compare seu álbum com amigo

---

## Comandos Úteis

```bash
# Dev server
pnpm dev --filter=web

# Type check
pnpm exec tsc --noEmit

# Build
pnpm build --filter=web

# Convex deploy
npx convex deploy

# Lint
pnpm lint --filter=web
```

---

## Env Vars Necessárias

```env
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
POSTHOG_API_KEY=

# Email
RESEND_API_KEY=

# Push notifications
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=

# Error tracking
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

---

## Definition of Done para Launch

- [ ] Analytics tracking funcionando
- [ ] Email welcome sequence ativa
- [ ] Referral codes gerando
- [ ] Core Web Vitals green
- [ ] Zero erros críticos no Sentry
- [ ] 6+ blog posts publicados
- [ ] Social media profiles configurados
- [ ] Product Hunt listing aprovado
- [ ] Press kit pronto
- [ ] Demo video gravado
