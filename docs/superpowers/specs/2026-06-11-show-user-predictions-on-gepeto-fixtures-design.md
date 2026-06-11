# Design: Exibir palpites nos cards da lista de jogos do Gepeto

## Contexto

A tela de jogos do Gepeto (`/dashboard/gepeto?tab=jogos`) renderiza cards para cada partida. Hoje o card mostra:

- Status/data do jogo
- Times e placar real (só ao vivo/finalizado) ou "vs" (futuro)
- Badges de "Gepeto lacrado" e do palpite do usuário (este último só quando os palpites são revelados)

Usuários pediram para ver seus próprios palpites nessa tela.

## Decisões tomadas

1. **O que mostrar:** palpite do usuário logado, palpite do Gepeto e placar real.
2. **Quando mostrar o palpite do usuário:** sempre que existir (mesmo em jogos futuros).
3. **Quando mostrar o palpite do Gepeto:** somente quando os palpites forem revelados — no apito inicial (`kickoffAt <= now`) ou quando o jogo estiver finalizado (`status === "finished"`). Mantém a regra atual de não revelar o palpite da IA antes do jogo.
4. **Quando mostrar o placar real:** somente em jogos ao vivo ou finalizados (mantém comportamento atual).
5. **Formato visual:** três linhas empilhadas e compactas abaixo do placar/vs.

## Comportamento por estado do jogo

| Estado do jogo | Palpite usuário | Palpite Gepeto | Placar real |
|----------------|-----------------|----------------|-------------|
| Futuro, usuário palpitou | Sim | Não | Não |
| Futuro, usuário não palpitou | Não | Não | Não (mostra "+ palpitar") |
| Ao vivo/finalizado, usuário palpitou | Sim | Sim | Sim |
| Ao vivo/finalizado, usuário não palpitou | Não | Sim | Sim |

## Componente afetado

- `apps/web/modules/gepeto/ui/views/gepeto-dashboard-view.tsx`
  - `FixturePhoneRow`: adicionar a seção de palpites e ajustar a condição do palpite do usuário.

## Detalhes visuais

- Três linhas alinhadas à esquerda, fonte `font-mono text-xs`:
  - `Você: 2 x 1` (cor de destaque do usuário)
  - `Gepeto: 1 x 0` (cor de destaque do Gepeto)
  - `Placar: 0 x 0` (cor neutra)
- Se alguma linha não estiver disponível, ela é omitida — não aparece placeholder.
- O botão/link "+ palpitar" continua aparecendo quando o usuário ainda não palpitou e o jogo não está finalizado.

## Dados

A query `api.gepeto.listDashboardFixtures` já retorna:

- `match.userPrediction?.exactScore`
- `match.aiPrediction?.exactScore`
- `match.homeScore` / `match.awayScore`

Nenhuma mudança de backend é necessária.

## Testes

- Adicionar testes no arquivo existente `apps/web/modules/gepeto/lib/__tests__/match-state.test.ts` ou criar testes de componente se a infraestrutura permitir.
- Pelo menos um teste garantindo que `FixturePhoneRow` renderiza o palpite do usuário mesmo quando `isPredictionRevealed` é falso.
