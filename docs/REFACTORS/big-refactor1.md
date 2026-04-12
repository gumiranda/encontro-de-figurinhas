Ready to code?

Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Plano Consolidado: Refatoração Completa

Context

Este plano combina três iniciativas de refatoração:

1.  O(n²) Complexity - Otimizar algoritmos em sticker-parser.ts e use-stickers.ts
2.  Reducing Entropy - Consolidar código duplicado e extrair componentes reutilizáveis
3.  useEffect Cleanup - Remover useEffects desnecessários seguindo boas práticas React

Arquivos com sobreposição (requerem cuidado):

- use-stickers.ts - Todas as 3 iniciativas tocam este arquivo
- sticker-list-grouped.tsx - Complexity + Entropy
- use-auth-redirect.ts - Entropy + useEffect

---

Pre-flight Checks

# Verificar consumers antes de qualquer mudança

grep -r "groupBySections" apps/web/
grep -r "formatStickerNumber" apps/web/
grep -r "use-profile-redirect" apps/web/
grep -r "sign-up-view" apps/web/

# Verificar error handling de completeProfile

grep -r "completeProfile" apps/web/

# Analisar: frontend usa try/catch, ConvexError, ou mensagem de retorno?

# Se usa mensagem de retorno: NÃO migrar para requireAuth (que faz throw)

---

Ordem de Execução (Dependências Resolvidas)

Fase 1: Infraestrutura Base (Sem Dependências)

1.1 Criar flag-gradients.ts

Arquivo: apps/web/modules/stickers/lib/flag-gradients.ts

Extrair FLAG_GRADIENTS duplicado de:

- sticker-list-grouped.tsx (lines 12-76)
- section-accordion.tsx (lines 13-63)

  1.2 Criar SectionLookup em sticker-parser.ts

Arquivo: apps/web/modules/stickers/lib/sticker-parser.ts

Adicionar:
export type SectionLookup = {
byCode: Map<string, Section>;
byIndex: Section[]; // sorted by startNumber
};

export function buildSectionLookup(sections: Section[]): SectionLookup {
const byCode = new Map<string, Section>();
const byIndex = [...sections].sort((a, b) => a.startNumber - b.startNumber);

for (const section of sections) {
// Handle duplicate codes: last wins, log warning in dev
if (byCode.has(section.code)) {
if (process.env.NODE_ENV === 'development') {
console.warn(`Duplicate section code: ${section.code}`);
}
}
byCode.set(section.code, section);
}

return { byCode, byIndex };
}

export function findSectionForNumber(num: number, lookup: SectionLookup): Section | undefined;

Refatorar:

- groupBySections(numbers, lookup) - remover sections param
- formatStickerNumber(num, lookup) - usar lookup

  1.3 Backend: requireAuth/requireAdmin helpers + Shadow Ban Strategy

Arquivo: packages/backend/convex/lib/auth.ts

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
const user = await getAuthenticatedUser(ctx);
if (!user) throw new Error("Not authenticated");
if (user.isBanned === true) throw new Error("Account banned");
return user; // retorna user com isShadowBanned para decisão downstream
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
const user = await requireAuth(ctx);
if (user.role !== 'superadmin' && user.role !== 'ceo') {
throw new Error("Not authorized");
}
return user;
}

Shadow Ban Strategy: FORA DO ESCOPO DESTE PLANO

Shadow ban com visibility: "shadow" exige:

- Campo visibility: v.union("public", "shadow") no schema de spots
- Index by_visibility ou filtro em compound index existente
- Alteração em TODAS as queries de listagem (listActiveSpots, getSpotsByCity, etc.)
- Filtro: visibility !== "shadow" || userId === currentUser.\_id

Isso é uma FEATURE, não refatoração. Criar plano separado.

ESTE PLANO USA:

- requireAuth → Apenas bloqueia banned users (throw), passa isShadowBanned adiante
- Mutations comunitárias checam user.isShadowBanned mas comportamento específico
  será definido no plano de shadow ban feature

USO POR MUTATION (neste plano):

- updateStickerList → requireAuth (dados pessoais)
- Outras mutations → requireAuth (shadow ban behavior TBD no plano separado)

  1.4 Unit Tests para sticker-parser.ts (DUAS ETAPAS)

Etapa A: Testes das funções EXISTENTES (safety net)
Arquivo: apps/web/modules/stickers/lib/**tests**/sticker-parser.test.ts

ANTES de refatorar, testar assinatura atual:
describe('groupBySections (current)', () => {
it('groups numbers by sections array', () => {
const sections = [{ code: 'BRA', startNumber: 1, endNumber: 20 }];
const result = groupBySections([1, 5, 10], sections);
expect(result.get('BRA')).toEqual([1, 5, 10]);
});
it('handles empty numbers array', () => {});
});

describe('formatStickerNumber (current)', () => {
it('formats with section code', () => {
const sections = [{ code: 'ARG', startNumber: 21, endNumber: 40 }];
expect(formatStickerNumber(25, sections).display).toBe('ARG-5');
});
});

Etapa B: Testes das funções NOVAS (após Fase 1.2)
describe('buildSectionLookup', () => {
it('handles duplicate codes - last wins with warning', () => {});
it('sorts byIndex by startNumber', () => {});
});

describe('findSectionForNumber', () => {
it('returns undefined for gaps', () => {});
it('early exits for num < first section', () => {});
});

describe('groupBySections (refactored)', () => {
it('accepts SectionLookup instead of Section[]', () => {});
});

---

Fase 2: Hooks Compartilhados (Componentes UI CANCELADOS)

DECISÃO: NÃO criar BaseAutocomplete nem StatusInputField

Razão: city-autocomplete (Convex query + click-outside) e city-search (array local)
são diferentes demais. Abstração forçaria muitos flags condicionais.
Economia estimada < 30 linhas líquidas.

DECISÃO: NÃO criar useClickOutside hook

Razão: Padrão de click-outside em city-autocomplete.tsx é específico demais.
Manter inline até haver terceiro uso.

2.2 useAuthReady hook (NÃO useConvexReady)

Arquivo: apps/web/hooks/use-auth-ready.ts

Retornar valores primitivos separados para evitar re-renders:
export function useAuthReady() {
const { isLoaded, isSignedIn } = useUser();
const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();

// Valores primitivos - não criam novo objeto a cada render
const isReady = isLoaded && isSignedIn && !convexAuthLoading && isAuthenticated;
const isLoading = !isLoaded || convexAuthLoading;

// Retorna objeto memorizado com useMemo
return useMemo(() => ({
isReady,
isLoading,
isSignedIn: isSignedIn ?? false,
isAuthenticated,
}), [isReady, isLoading, isSignedIn, isAuthenticated]);
}

Usado em: use-auth-redirect.ts, use-ensure-app-user.ts, bootstrap/page.tsx

NOTA: Reusar apps/web/hooks/use-debounce.ts existente onde necessário

2.3 use-ensure-app-user.ts - Detalhamento

Arquivo: apps/web/hooks/use-ensure-app-user.ts

Substituir cálculo manual de convexReady:
// ANTES:
const { isLoaded, isSignedIn } = useUser();
const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();
const convexReady = isLoaded && isSignedIn && !convexAuthLoading && isAuthenticated;

// DEPOIS:
const { isReady: convexReady, isLoading } = useAuthReady();

O resto do hook permanece igual - só a fonte do convexReady muda.

---

Fase 3: use-stickers.ts (CRÍTICO - Dividir em 3 Commits)

Arquivo: apps/web/modules/stickers/lib/use-stickers.ts

IMPORTANTE: Dividir em commits atômicos com build verde entre cada:

---

Commit 3a: SectionLookup + findSection

1.  SectionLookup memoizado (SIMPLIFICADO - sem JSON.stringify):
    // Simples: aceita rebuild raro quando Convex muda referência
    const sectionLookup = useMemo(
    () => buildSectionLookup(sections),
    [sections]
    );

2.  findSection com Map O(1):
    const findSection = useCallback(
    (sectionCode: string): Section | undefined => {
    return sectionLookup.byCode.get(sectionCode);
    },
    [sectionLookup]
    );

Build + test manual após este commit

---

Commit 3b: isDirty flag com tratamento de erro

const [isDirty, setIsDirty] = useState(false);
const editCountRef = useRef(0);

useEffect(() => {
if (!isLoading && !isDirty) {
setLocalDuplicates(serverDuplicates ?? []);
setLocalMissing(serverMissing ?? []);
}
}, [isLoading, serverDuplicates, serverMissing, isDirty]);

const saveWithDebounce = useCallback(
(dups: number[], miss: number[], finalize = false) => {
setIsDirty(true);
editCountRef.current++;
const editId = editCountRef.current;

     // Validar tamanho (rate limit server-side)
     if (dups.length > 980 || miss.length > 980) {
       setError("Limite de figurinhas excedido");
       return;
     }

     // ... debounce logic ...
     .then(() => {
       // SÓ resetar isDirty no sucesso
       if (editCountRef.current === editId) {
         setIsDirty(false);
       }
     })
     .catch((e) => {
       setError(e.message);
       // MANTER isDirty = true no erro para evitar overwrite
       // Mostrar toast de retry
       toast.error("Erro ao salvar. Tente novamente.");
     })
     .finally(() => {
       setIsSaving(false);
     });

},
[debounceMs, updateStickerList]
);

Build + test manual após este commit

---

Commit 3c: bulkAction consolidado

type BulkAction = 'all' | 'none' | 'invert';

const bulkAction = useCallback(
(action: BulkAction, sectionCode: string) => {
const section = findSection(sectionCode);
if (!section) return;
const sectionNums = getSectionNumbers(section);
const sectionSet = new Set(sectionNums); // O(1) lookup

     let newDups = [...localDuplicates];
     let newMiss = [...localMissing];

     switch (action) {
       case 'all':
         // Adiciona todos da seção aos duplicates
         newDups = [...new Set([...newDups, ...sectionNums])];
         newMiss = newMiss.filter(n => !sectionSet.has(n));
         break;
       case 'none':
         // Remove todos da seção
         newDups = newDups.filter(n => !sectionSet.has(n));
         newMiss = newMiss.filter(n => !sectionSet.has(n));
         break;
       case 'invert':
         // Toggle: dups -> miss, miss -> dups, unmarked -> dups
         const currentDups = new Set(localDuplicates.filter(n => sectionSet.has(n)));
         const currentMiss = new Set(localMissing.filter(n => sectionSet.has(n)));

         newDups = newDups.filter(n => !sectionSet.has(n));
         newMiss = newMiss.filter(n => !sectionSet.has(n));

         // Miss -> Dups
         newDups.push(...currentMiss);
         // Dups -> Miss
         newMiss.push(...currentDups);
         // Unmarked -> Dups
         for (const n of sectionNums) {
           if (!currentDups.has(n) && !currentMiss.has(n)) {
             newDups.push(n);
           }
         }
         break;
     }

     saveWithDebounce(newDups, newMiss);

},
[findSection, getSectionNumbers, localDuplicates, localMissing, saveWithDebounce]
);

Build + test manual após este commit

---

Fase 4: sticker-list-grouped.tsx (Une 2 Planos)

Arquivo: apps/web/modules/stickers/ui/components/sticker-list-grouped.tsx

1.  Import FLAG_GRADIENTS (Entropy):
    import { FLAG_GRADIENTS } from "../../lib/flag-gradients";

2.  Usar lookup para O(1) (Complexity):
    const lookup = useMemo(() => buildSectionLookup(sections), [sections]);
    const grouped = useMemo(() => groupBySections(numbers, lookup), [numbers, lookup]);

// No render:
const section = lookup.byCode.get(sectionCode); // O(1) instead of find()
const { display } = formatStickerNumber(num, lookup);

---

Fase 5: Hooks de Redirect

5.1 use-auth-redirect.ts

Arquivo: apps/web/hooks/use-auth-redirect.ts

1.  Usar useAuthReady (Entropy):
    const { isReady: convexReady } = useAuthReady();

2.  Pathname check para idempotência (useEffect):
    const pathname = usePathname();

useEffect(() => {
if (!convexReady) return;
if (currentUser === undefined || hasSuperadmin === undefined) return;

let destination: string | null = null;
// ... existing condition logic ...

// Idempotent: only redirect if not already there
if (destination && pathname !== destination) {
router.replace(destination);
}
}, [convexReady, currentUser, hasSuperadmin, router, pathname,
opts.whenNoSuperadmin, opts.whenNoUser, opts.whenPending,
opts.whenRejected, opts.whenNeedsOnboarding, opts.whenNeedsStickerSetup,
opts.whenApproved]);

5.2 use-profile-redirect.ts - DELETAR, NÃO MODIFICAR

DECISÃO: Não gastar tempo refatorando arquivo que será deletado.

Passos:

1.  Verificar consumers: grep -r "use-profile-redirect" apps/web/
2.  Para cada consumer, migrar para useAuthRedirect com opts equivalentes
3.  Deletar arquivo após zero imports

---

Fase 6: Outros useEffects

6.1 nickname-input.tsx

Arquivo: apps/web/modules/auth/ui/components/nickname-input.tsx

Remover isChecking state, derivar durante render:
const isQueryStale = debouncedValue !== lastCheckedRef.current;
const isChecking = value.length >= 3 && (value !== debouncedValue || isQueryStale);

Consolidar para um único useEffect.

6.2 bootstrap/page.tsx

Arquivo: apps/web/app/(auth)/bootstrap/page.tsx

Adicionar ref guard:
const redirected = useRef(false);

useEffect(() => {
if (!isLoaded || isSignedIn || redirected.current) return;
redirected.current = true;
router.push("/sign-in");
}, [isLoaded, isSignedIn, router]);

---

Fase 7: Backend Consolidation

7.1 Atualizar users.ts, stickers.ts, permissions.ts

Usar requireAuth/requireAdmin helpers.

7.2 Consolidar permission queries

Manter getMenuItems separado, consolidar checkPermission + getUserRole + getCurrentUserPermissions.

---

Fase 8: Cleanup

8.1 Deletar arquivos não usados

- apps/web/modules/auth/ui/layouts/auth-layout.tsx (verificar CSS imports)
- apps/web/modules/auth/ui/views/sign-up-view.tsx (se for wrapper simples, usar SignUp direto)
- apps/web/hooks/use-profile-redirect.ts (após migrar consumers para useAuthRedirect)

  8.2 Remover FLAG_GRADIENTS duplicado

De sticker-list-grouped.tsx e section-accordion.tsx após criar flag-gradients.ts.

---

Arquivos a Modificar (Ordem)

Criar

1.  apps/web/modules/stickers/lib/flag-gradients.ts
2.  apps/web/modules/stickers/lib/**tests**/sticker-parser.test.ts - testes em 2 etapas (A: current, B: new)
3.  apps/web/hooks/use-auth-ready.ts - hook com useMemo para evitar re-renders

Modificar (Ordem Crítica)

1.  apps/web/modules/stickers/lib/sticker-parser.ts - SectionLookup
2.  apps/web/modules/stickers/lib/use-stickers.ts - 3 commits separados (3a, 3b, 3c)
3.  apps/web/modules/stickers/ui/components/sticker-list-grouped.tsx
4.  apps/web/modules/stickers/ui/components/section-accordion.tsx
5.  packages/backend/convex/lib/auth.ts - requireAuth + requireAdmin (shadow ban inline)
6.  packages/backend/convex/users.ts - usar helpers

- completeProfile: Decisão baseada em pre-flight check
  Se frontend usa mensagens de retorno: NÃO migrar
  Se frontend usa try/catch: pode migrar para requireAuth

7.  packages/backend/convex/stickers.ts - usar requireAuth (dados pessoais, não comunitário)
8.  packages/backend/convex/permissions.ts - consolidar queries
9.  apps/web/modules/auth/ui/components/nickname-input.tsx
10. apps/web/app/(auth)/bootstrap/page.tsx
11. apps/web/hooks/use-auth-redirect.ts - usar useAuthReady
12. apps/web/hooks/use-ensure-app-user.ts - usar useAuthReady (FALTAVA)

Migrar ANTES de Deletar

1.  sign-up-view.tsx:

- Verificar conteúdo: provavelmente é apenas <SignUp> wrapper do Clerk
- Se for wrapper simples: deletar e usar <SignUp> diretamente no page.tsx
- NÃO criar AuthFormView - componentes do Clerk são distintos ( vs )
- Atualizar apps/web/app/(auth)/sign-up/page.tsx para importar SignUp do Clerk

2.  use-profile-redirect.ts:
    grep -r "use-profile-redirect" apps/web/
3.  Migrar cada call site para useAuthRedirect. Só deletar após zero imports.

Deletar (Após Migração Validada)

1.  apps/web/modules/auth/ui/layouts/auth-layout.tsx - verificar CSS imports
2.  apps/web/modules/auth/ui/views/sign-up-view.tsx - APÓS verificar que é wrapper simples
3.  apps/web/hooks/use-profile-redirect.ts - APÓS migrar consumers

---

Verificação

Automated Tests (ANTES de modificar)

# Rodar testes existentes

pnpm test

# Adicionar testes para sticker-parser.ts

pnpm test apps/web/modules/stickers/lib/**tests**/sticker-parser.test.ts

Build Pipeline

pnpm typecheck
pnpm lint
pnpm build

Runtime Tests

pnpm dev

Manual Tests (Checklist)

- Stickers: quick input BRA-1-20, bulk actions (all/none/invert), grid não pisca
- Stickers edge case: editar → save inicia → editar novamente rapidamente → segunda edição NÃO é perdida
- Stickers sync: editar tab A → esperar save → editar tab B → tab A sincroniza após idle
- Stickers erro: desconectar rede durante save → toast de retry aparece → reconectar → retry funciona
- Nickname: digitar rápido, sem flash de status errado
- Auth: sign in/up, complete profile, redirects sem loops
- Bootstrap: primeiro acesso cria superadmin

Shadow Ban Test

FORA DO ESCOPO - testar quando implementar plano de shadow ban feature.

Code Review Checklist

- NENHUM comment explicativo do plano foi para o código final
- Todos os consumers de groupBySections/formatStickerNumber foram atualizados
- use-profile-redirect.ts tem zero imports antes de deletar

---

Complexidade Antes vs Depois

┌─────────────────────┬────────┬──────────┐
│ Função │ Antes │ Depois │
├─────────────────────┼────────┼──────────┤
│ groupBySections │ O(n\*m) │ O(n+m) │
├─────────────────────┼────────┼──────────┤
│ formatStickerNumber │ O(m) │ O(1) avg │
├─────────────────────┼────────┼──────────┤
│ findSection │ O(s) │ O(1) │
├─────────────────────┼────────┼──────────┤
│ render loop lookup │ O(s²) │ O(s) │
└─────────────────────┴────────┴──────────┘

---

Riscos e Mitigações

┌─────────────────────────────────────────┬────────────┬─────────────────────────────────────────────────────┐
│ Risco │ Severidade │ Mitigação │
├─────────────────────────────────────────┼────────────┼─────────────────────────────────────────────────────┤
│ use-stickers.ts quebra │ Alta │ 3 commits atômicos, build verde entre cada │
├─────────────────────────────────────────┼────────────┼─────────────────────────────────────────────────────┤
│ Perda de dados no save com erro de rede │ Alta │ isDirty só reseta no .then(), toast de retry │
├─────────────────────────────────────────┼────────────┼─────────────────────────────────────────────────────┤
│ completeProfile error handling quebra │ Média │ Pre-flight check: grep consumers, verificar pattern │
├─────────────────────────────────────────┼────────────┼─────────────────────────────────────────────────────┤
│ Deletar arquivo com imports ativos │ Média │ grep antes de deletar │
├─────────────────────────────────────────┼────────────┼─────────────────────────────────────────────────────┤
│ useAuthReady causa re-renders │ Baixa │ Retorna objeto estável com useMemo │
└─────────────────────────────────────────┴────────────┴─────────────────────────────────────────────────────┘

NOTA: Shadow ban feature movida para plano separado (exige schema + queries).
