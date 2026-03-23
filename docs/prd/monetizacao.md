## 6. Monetização

### 6.1 Modelo: ads como receita primária + premium como upsell

**Ads (base gratuita — 98% dos usuários):** banner não-intrusivo na tela de matches e na página do ponto. Interstitial após confirmação de troca (momento de satisfação, maior aceitação). eCPM estimado Brasil: $1,00-1,50. Com 50k DAU × 5 impressões/dia = ~R$43.500-65.250/mês no pico. Implementar via Google AdMob Web ou AdSense.

**Free:** marcar figurinhas ilimitado, Camada 1 (matches no meu ponto) ilimitada, Camada 2 com limite de 5 visualizações/dia, sem Camada 3, sem notificações push de match, distância mostra "perto/médio/longe" (sem km exato), participar de até 3 pontos de troca, ads presentes.

**Premium (R$9,90/mês ou R$19,90 por temporada Copa):** Camadas 1+2+3 ilimitadas, distância em km exato, notificações push de match, pontos de troca ilimitados, badge destaque no perfil, filtros avançados, sem ads. Preferir "temporada Copa" como opção default (reduz churn, simplifica).

**Boost (R$4,90/24h):** aparecer no topo dos matches do ponto por 24h. Flag `boostExpiresAt` no user doc.

**Pontos Patrocinados (B2B futuro):** lojas/bancas pagam R$50-200/mês para aparecer como "Ponto Oficial" com destaque visual no mapa. Implementar pós-MVP.

### 6.2 Pagamentos — Stripe com PIX prioritário

Stripe Brasil suporta: PIX (taxa ~1-2%, liquidação instantânea), cartão doméstico (Visa, Mastercard, Elo, Hipercard — taxa 3,99% + R$0,50), boleto (taxa fixa ~R$3,49, descartado pelo valor baixo da assinatura). **PIX como método primário no checkout.** Implementar via Stripe Checkout ou Payment Links. Webhook do Stripe → Convex HTTP action → atualizar `isPremium` e `premiumExpiresAt`.

### 6.3 Projeção financeira revisada

| Cenário    | Signups | DAU | Premium (2%) | Receita ads/mês | Receita premium/mês | Custo infra/mês | Resultado      |
| ---------- | ------- | --- | ------------ | --------------- | ------------------- | --------------- | -------------- |
| Pessimista | 30k     | 9k  | 600          | R$7.800         | R$5.940             | R$2.400         | **+R$11.340**  |
| Base       | 100k    | 30k | 2.000        | R$26.100        | R$19.800            | R$2.400         | **+R$43.500**  |
| Otimista   | 300k    | 90k | 6.000        | R$78.300        | R$59.400            | R$5.800         | **+R$131.900** |

Custo de infraestrutura com stack otimizada: Convex (Startup Program grátis 1 ano, depois ~R$1.450/mês), Clerk (free até 50k MRU, depois ~R$5.945/mês), Leaflet/OSM (R$0), Vercel Pro (R$116/mês). Total no free tier: **~R$116/mês**. Total a 100k MAU: **~R$2.400/mês**.
