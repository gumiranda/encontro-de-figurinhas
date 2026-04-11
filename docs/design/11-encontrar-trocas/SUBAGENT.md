---
name: tela-11-encontrar-trocas-match-center
description: Implementa o Match Center com filtros de estratégia (raio, preferências) e listagem de oportunidades de troca — encontrar-trocas.html.
---

# Subagente — Tela 11 · Encontrar trocas (Match Center)

## Missão

Implementar a tela **“Match Center”** / **Encontrar trocas**: header com marca e filtros (`tune`), bloco **“Estratégia de busca”** (raio 5–50 km com opção premium/lock se aplicável), e lista de **matches** com cards de usuários (avatar, distância, figurinhas ofertadas/necessárias), ações de chat ou iniciar troca. Integrar com algoritmo de matching do backend.

## Referências de design

- `docs/design/11-encontrar-trocas/encontrar-trocas.html` — stadium-gradient de fundo, card de estratégia, sliders/chips de raio, seções de resultados.

## Produto (PRD)

- `docs/prd/funcionalidades.md` — matching por necessidade/repetidas, notificações, confirmação de troca (F17) pode ser rota separada.
- Respeitar regras de **anúncios** se banner for exibido nesta listagem (monetização).

## Restrições do projeto

- shadcn: `Slider` ou botões de raio como no mock, `Sheet` para filtros avançados no ícone `tune`.
- Não expor dados pessoais além do permitido (apelido, cidade aproximada).

## Checklist de UI

1. **Header fixo**: ícone hub + “figurinha fácil”, botão filtros.
2. **Card Estratégia de busca**: título com ícone `strategy`, badge “Ativa”.
3. **Raio**: presets 5 / 15 / 30 / 50 km; estado locked no 50 se for premium-only (conforme mock).
4. **Outros filtros** presentes no HTML (raridade, time, etc.): implementar conforme prioridade.
5. **Lista de matches**: cards com headshot, nome/apelido, distância, chips de figurinhas, CTA principal.
6. Estados vazio, carregando e erro.

## Lógica

- Query com raio geográfico (requer lat/lng do usuário da Tela 5/6) ou fallback por cidade.
- Paginação cursor-based se volume alto.
- Respeitar bloqueios / shadow ban do PRD (filtrar usuários inválidos no servidor).

## Critérios de aceite

- Alterar raio refetch com debounce e feedback visual.
- Feature premium: UI de cadeado alinhada a regra de negócio real (não hardcoded se produto mudar).
- Performance: lista virtualizada se >50 itens.
