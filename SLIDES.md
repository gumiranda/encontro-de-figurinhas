# Slide 1: Título - Acelerando com Clerk + Convex
## Construindo Aplicações Fullstack Modernas em Velocidade Recorde

---

# Slide 2: O Desafio do Fullstack Moderno
- **Configuração Inicial**: Configurar Auth, DB, ORM, API, TypeScript toma dias.
- **Complexidade**: Manter sincronia entre Frontend e Backend.
- **Autenticação**: Difícil de fazer certo e seguro.
- **Realtime**: Geralmente complexo de implementar (WebSockets??).

**A Solução**: Um template "opinado" e poderoso.

---

# Slide 3: A Stack dos Sonhos
1. **Frontend**: Next.js 15 (App Router)
   - Performance, SSR/RSC de ponta.
2. **Autenticação**: Clerk
   - A melhor DX (Developer Experience) para Auth.
   - Login, Cadastro, Perfil, Segurança prontos.
3. **Backend & Database**: Convex
   - "O Backend para desenvolvedores de Frontend".
   - Database Realtime embutido.
   - Funções Serverless (Queries, Mutations).
4. **Organização**: TurboRepo (Monorepo)
   - Separação clara: `apps/web` vs `packages/backend`.

---

# Slide 4: Por que eles são poderosos juntos?
- **Integração Perfeita**: O Clerk autentica, o Convex confia.
- **End-to-End Type Safety**: O Frontend sabe exatamento o que o Backend retorna.
- **Reatividade**: Mudou no banco? O Frontend atualiza sozinho. Sem `useEffect`, sem complexidade.
- **Foco no Produto**: Você escreve regras de negócio, não boilerplate.

---

# Slide 5: Estrutura do Template (Walkthrough)
```mermaid
graph TD
    Root[Monorepo Root] --> Apps
    Root --> Packages
    Apps --> Web[apps/web (Next.js)]
    Packages --> Backend[packages/backend (Convex)]
    Packages --> UI[packages/ui (Shadcn/UI)]
    Web -- Importa --> UI
    Web -- Chama --> Backend
```
- **apps/web**: Onde a mágica visual acontece.
- **packages/backend**: Onde os dados e regras vivem (`convex/`).
- **packages/ui**: Seus blocos de legos (Botões, Inputs, Cards).

---

# Slide 6: Passo a Passo para um Novo Projeto
1. **Clonar**: Comece com o template base.
2. **Instalar Dependências**: `pnpm install`.
3. **Variáveis de Ambiente**:
   - Configurar Clerk (Publishable Key, Secret Key).
   - Configurar Convex (Deployment URL).
4. **Rodar**: `pnpm dev`.
   - Inicia Frontend, Backend e Docs simultaneamente.

---

# Slide 7: Live Coding (O que vamos fazer)
Vamos criar uma funcionalidade do zero para provar a velocidade:
1. **Backend**: Adicionar uma tabela no `schema.ts`.
2. **Backend**: Criar uma `mutation` para salvar dados.
3. **Backend**: Criar uma `query` para ler dados.
4. **Frontend**: Usar o hook `useQuery` e mostrar na tela.

---

# Slide 8: Conclusão
- Menos configuração, mais código de produto.
- Escalável desde o dia 1.
- Comunidade forte e tecnologias modernas.
- **Seu próximo SaaS começa aqui.**
