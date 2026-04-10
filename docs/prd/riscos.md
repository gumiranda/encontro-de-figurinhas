## 9. Riscos e Mitigações

**Galinha/ovo (ponto sem membros).** Lançar nas 10 maiores cidades com push em comunidades existentes de figurinhas (Facebook, WhatsApp, Reddit). Criar pontos iniciais em locais óbvios (bancas famosas, shoppings com tradição de troca). Seed de pontos conhecidos. Gamificação para early adopters ("Fundador do Ponto" badge).

**Panini muda estrutura / lança extras.** `albumConfig` dinâmico e versionado, atualiza em 1 dia. Seção separada para "Extra Stickers" sem afetar progresso base. Campo `isExtra` nas seções.

**Privacidade/GPS.** Nunca mostra localização de pessoa. Só distância entre pontos de troca (locais públicos com endereço já visível). Double opt-in para GPS. Fallback completo sem GPS.

**WhatsApp limitar grupos / links quebrarem.** Grupos são canal de coordenação, não o produto. Matching funciona sem WhatsApp. Health check automático de links. Sistema de report.

**Sazonalidade.** Produto tem ~5-6 meses de vida. Monetizar agressivamente no pico (ads + premium). Código reutilizável pra próximos álbuns (Brasileirão, Olimpíadas, Copa 2030). Estrutura de `albumConfig` dinâmica suporta qualquer álbum.

**LGPD/menores.** Art. 14 compliance: consentimento parental para <12, melhor interesse para 12-17. ECA Digital (2026): verificação de idade. Implementar desde Sprint 1, não retrofitar.

**Convex escala.** Matching pré-computado evita queries N+1. Batch limits respeitados. Aplicar ao Startup Program (1 ano Pro grátis). Se escala extrema (300k+), avaliar cache layer (Redis via Upstash) para queries de leitura mais quentes.

**Clerk custo a 100k+.** Monitorar MRU. Se ultrapassar 50k no free tier, avaliar Firebase Auth ou Convex Auth nativo antes de pagar $1.025/mês.
