---
name: tela-09-status-ponto-curadoria
description: Implementa o painel “Trading Point Arena” com timeline de ciclo de vida do ponto (pendente → ativo → suspenso) — ponto-detalhe.html.
---

# Subagente — Tela 9 · Status do ponto (ciclo de vida / curadoria)

## Missão

Implementar a visão **“Status do Ponto”** para o usuário que criou ou gerencia um ponto: breadcrumbs (Meus Pontos → Status), título e endereço, badge de estado (**Ativo** com indicador animado), **timeline** de curadoria (Pendente, Aprovado, Ativo, Suspenso), e métricas de saúde do ponto se presentes no mock completo.

## Referências de design

- `docs/design/9-ponto-detalhe/ponto-detalhe.html` — header “Trading Point Arena”, breadcrumb, grid bento com timeline vertical e steps.

## Produto (PRD)

- Estados alinhados à moderação e ao WhatsApp integrado por admin (texto do próprio mock).
- Suspensão/denúncias: apenas UI e campos preparados se backend ainda não expuser tudo; documentar gaps.

## Restrições do projeto

- shadcn: `Card`, `Badge`, `Separator`, timeline custom ou `Stepper` pattern.
- Respeitar `prefers-reduced-motion` no ping do status “Ativo”.

## Checklist de UI

1. **Top bar** com identidade “Trading Point Arena” e notificações (se produto mantiver).
2. **Breadcrumb** clicável para lista de pontos do usuário.
3. **Título + endereço** + badge de status.
4. **Timeline**: ícones por etapa, datas “Concluído”, etapa atual destacada em secondary, etapa futura (ex. Suspenso) esmaecida.
5. **Áreas adicionais** do HTML (stats, ações) com layout responsivo md:grid.

## Lógica

- Query do ponto por id com join de status e histórico (array de eventos ou campos denormalizados).
- Apenas dono do ponto ou moderador vê esta tela (auth check obrigatório no Convex).

## Critérios de aceite

- Timeline reflete ordem real dos estados; não mostrar datas falsas se backend não tiver.
- Mobile: timeline legível sem overflow horizontal.
- Coerência de copy PT-BR com o restante do app.
