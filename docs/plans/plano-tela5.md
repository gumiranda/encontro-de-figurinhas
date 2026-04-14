# Plano: Tela 5 — GPS / Localização

## Contexto

O usuário precisa selecionar sua localização para ver pontos de troca próximos. Esta tela oferece duas experiências: (A) permissão de GPS com pre-prompt customizado, (B) busca manual por cidade. Segue o padrão double opt-in de privacidade do PRD F04.

**Nota sobre onboarding**: Esta tela NÃO seta `hasCompletedOnboarding`. Essa flag é setada na mutation `completeProfile` que já existe. Esta tela apenas atualiza campos de localização de um user que já completou onboarding, OU é chamada durante o fluxo pós-onboarding.

**Proteção de rota**: A rota `(auth)` exige Clerk auth. Verificar se também exige `hasCompletedOnboarding` no middleware ou na View. Se não, adicionar guard: redirecionar para `/completar-perfil` se user não completou onboarding.

---

## Pre-flight Checks

```bash
# Index by_isActive já existe?
grep -n "by_isActive" packages/backend/convex/schema.ts

# Campo isActive já existe em cities?
grep -n "isActive" packages/backend/convex/schema.ts

# Campos lat/lng já existem na tabela users?
grep -n '"lat"' packages/backend/convex/schema.ts
grep -n '"lng"' packages/backend/convex/schema.ts

# Query cities.search já existe?
grep -n "export const search" packages/backend/convex/cities.ts

# Verificar comportamento de getAuthenticatedUser (deve retornar null, não throw)
grep -n "return null" packages/backend/convex/lib/auth.ts

# Verificar que requireAuth existe e é exportada
grep -n "export.*requireAuth" packages/backend/convex/lib/auth.ts || echo "ERRO: requireAuth não existe"

# Verificar se CSS vars existem no layout (auth) para loading.tsx
grep -n "landing-background" apps/web/app/\(auth\)/layout.tsx || echo "Ajustar CSS vars no loading.tsx"

# Verificar se @workspace/backend está em transpilePackages (pra CityWithCoords type)
grep -n "transpilePackages" apps/web/next.config.js || echo "Adicionar transpilePackages"

# Verificar se getCurrentUser existe (usada no page.tsx guard)
grep -n "export const getCurrentUser" packages/backend/convex/users.ts

# Verificar nome do template Clerk/Convex usado no projeto
grep -rn "template.*convex" apps/web/ --include="*.ts" --include="*.tsx" | head -5 || echo "Verificar template name no Clerk dashboard"

# Verificar que CityAutocomplete existe e descobrir props
ls apps/web/modules/auth/ui/components/city-autocomplete.tsx 2>/dev/null || echo "ERRO: CityAutocomplete não existe"
grep -A 10 "interface.*Props\|type.*Props" apps/web/modules/auth/ui/components/city-autocomplete.tsx | head -15

# Verificar que completeProfile NÃO seta lat/lng/locationSource
grep -n "lat\|lng\|locationSource" packages/backend/convex/users.ts | grep -i "completeProfile" -A 20 || echo "OK: completeProfile não referencia campos de localização"

# Verificar que getCurrentUser retorna campos necessários para page.tsx guard
grep -A 5 "export const getCurrentUser" packages/backend/convex/users.ts

# Verificar return type de requireAuth (deve retornar Doc<"users"> com locationUpdatedAt)
grep -A 10 "export async function requireAuth" packages/backend/convex/lib/auth.ts
```

**Testar manualmente**: Convex `patch` com `undefined` é no-op para campos `v.optional`. Por isso, spoofing path não tenta limpar coords — simplesmente não as salva. Coords antigas de sessões GPS anteriores podem permanecer, mas `getUserCoords()` ignora non-GPS sources.

**Se `cities.search` não existir e for necessária, criar conforme seção 1.6.**

**Nota**: `getAuthenticatedUser` retorna `null` se não autenticado (confirmado em `lib/auth.ts:6`). Use `requireAuth` se quiser throw automático.

---

## 1. Backend (Convex)

### 1.1 Schema (`packages/backend/convex/schema.ts`)

**Tabela `cities`** — adicionar index SE NÃO EXISTIR:

```typescript
.index("by_isActive", ["isActive"])
```

**Nota**: `by_state` index não adicionado — YAGNI (nenhuma query usa).

**Tabela `cities`** — adicionar campo SE NÃO EXISTIR:

**Single deploy** (recomendado para projeto em dev):

1. Adicionar schema com `isActive: v.optional(v.boolean())`
2. `npx convex dev` (faz push do schema)
3. Rodar migration: `npx convex run cities:migrateSetCitiesActive`
4. (Opcional) trocar pra `v.boolean()` se quiser schema estrito

```typescript
isActive: v.optional(v.boolean()),
```

**Tabela `users`** — adicionar campos:

```typescript
locationSource: v.optional(v.union(v.literal("gps"), v.literal("manual"), v.literal("ip"))),
lat: v.optional(v.float64()),
lng: v.optional(v.float64()),
locationUpdatedAt: v.optional(v.number()),
locationUpdateCount: v.optional(v.number()),  // Rate limit: max 10/hora
```

### 1.2 Migration: cities.isActive

Cidades existentes no seed não têm `isActive`. Rodar migration antes de usar `getAllWithCoords`:

```typescript
import { internalMutation } from "./_generated/server";

export const migrateSetCitiesActive = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db.query("cities").collect();
    for (const city of cities) {
      if (city.isActive === undefined) {
        await ctx.db.patch(city._id, { isActive: true });
      }
    }
    return { updated: cities.filter((c) => c.isActive === undefined).length };
  },
});
```

Rodar via dashboard Convex ou `npx convex run cities:migrateSetCitiesActive`.

**Verificação pós-migration** (antes de Schema Fase 2):

```bash
npx convex run --component cities 'db.query("cities").filter(q => q.eq(q.field("isActive"), undefined)).collect().length'
```

Deve retornar 0. Se > 0, migration falhou parcialmente — re-rodar antes de trocar schema.

### 1.3 Query `cities.getAllWithCoords` (fetch server-side)

**Query PÚBLICA** — sem `getAuthenticatedUser`. Será chamada via `fetchQuery` no server component.

**Segurança**: Dados de lat/lng de cidades são públicos (fonte IBGE). Não expõe dados de usuários. Rate limit não necessário pois:

1. Dados são públicos e estáticos
2. Server-side fetch com `unstable_cache(1h)` minimiza chamadas
3. Convex já tem rate limiting built-in por tenant

```typescript
export const getAllWithCoords = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db.query("cities").collect();
    const activeCities = cities.filter((c) => c.isActive !== false);

    if (activeCities.length > 1000) {
      console.warn(
        `getAllWithCoords: ${activeCities.length} cities exceeds expected limit`
      );
    }

    return activeCities.map((c) => ({
      _id: c._id,
      name: c.name,
      state: c.state,
      lat: c.lat,
      lng: c.lng,
    }));
  },
});
```

**Nota Fase 2**: Após migration, trocar `collect()` + `filter()` por `.withIndex("by_isActive", (q) => q.eq("isActive", true))` para performance.

### 1.4 Query `cities.getByState` — NÃO CRIAR

**Decisão**: `manual-search-screen` usa `CityAutocomplete` (busca textual via `cities.search`). NÃO há seletor cascateado UF → Cidade.

Portanto: **não criar `getByState`**, **não incluir `BRAZILIAN_STATES`** — seria dead code.

### 1.5 Mutation `users.setLocation`

**Com rate limit, validação completa, e anti-spoofing**:

```typescript
import { haversine, isInBrazil } from "./lib/geo";
import { requireAuth } from "./lib/auth";

export const setLocation = mutation({
  args: {
    cityId: v.id("cities"),
    locationSource: v.union(v.literal("gps"), v.literal("manual"), v.literal("ip")),
    lat: v.optional(v.float64()),
    lng: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    const lastUpdate = user.locationUpdatedAt ?? 0;
    const callsInLastHour = lastUpdate > hourAgo ? (user.locationUpdateCount ?? 0) : 0;
    const shouldResetCount = lastUpdate <= hourAgo;

    if (lastUpdate > 0) {
      if (now - lastUpdate < 30_000) {
        throw new Error("Por favor, aguarde antes de tentar novamente");
      }
      if (callsInLastHour >= 10) {
        throw new Error("Limite de atualizações atingido");
      }
    }

    const newCount = callsInLastHour + 1;

    const city = await ctx.db.get(args.cityId);
    if (!city) throw new Error("Cidade não encontrada");
    if (city.isActive === false) throw new Error("Cidade não disponível");

    if ((args.lat !== undefined) !== (args.lng !== undefined)) {
      throw new Error("lat e lng devem ser ambos presentes ou ambos ausentes");
    }

    let effectiveSource = args.locationSource;
    let saveCoords = false;

    if (args.lat !== undefined && args.lng !== undefined) {
      if (!isInBrazil(args.lat, args.lng)) {
        throw new Error("Coordenadas fora do Brasil");
      }

      const distance = haversine(city.lat, city.lng, args.lat, args.lng);
      if (distance > 200) {
        effectiveSource = "manual";
      } else {
        saveCoords = true;
      }
    }

    await ctx.db.patch(user._id, {
      cityId: args.cityId,
      locationSource: effectiveSource,
      ...(saveCoords ? { lat: args.lat, lng: args.lng } : {}),
      locationUpdatedAt: now,
      locationUpdateCount: shouldResetCount ? 1 : newCount,
    });
    return { success: true };
  },
});
```

**Sem `degraded` flag**: Evita info leak sobre detecção de spoofing. Response sempre igual.

**Race condition (OCC)**: Convex mutations são transacionais. Se dois requests concorrentes lerem o mesmo user antes do patch, Convex detecta o conflito e retries automaticamente. O retry re-lê o user com `locationUpdatedAt` atualizado e aplica o rate limit corretamente. Não é possível "furar" o rate limit via requests concorrentes.

### 1.6 Query `cities.search` (CONDICIONAL — criar SE não existir)

**Verificar** se já existe. Se não existir e `city-autocomplete.tsx` depender dela:

```typescript
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const normalized = query.trim();
    if (normalized.length < 2) return [];

    const cities = await ctx.db
      .query("cities")
      .withSearchIndex("search_name", (q) => q.search("name", normalized))
      .take(15);

    return cities
      .filter((c) => c.isActive !== false)
      .slice(0, 10)
      .map((c) => ({ _id: c._id, name: c.name, state: c.state }));
  },
});
```

**Nota Fase 2**: Após migration, trocar filtro para `.filter(c => c.isActive === true)`.

### 1.7 next.config.js

**Adicionar** (se não existir):

```javascript
transpilePackages: ["@workspace/backend"],
```

Necessário para importar types de `@workspace/backend/_generated/api` no frontend.

### 1.8 Geo utils — DUPLICADO (Convex + Frontend)

**Convex bundler não resolve @workspace aliases**. Copiar código para ambos os lugares:

**Backend**: `packages/backend/convex/lib/geo.ts`

```typescript
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const BRAZIL_BOUNDS = {
  lat: { min: -33.75, max: 5.27 },
  lng: { min: -73.99, max: -28.0 },
};

export function isInBrazil(lat: number, lng: number): boolean {
  return (
    lat >= BRAZIL_BOUNDS.lat.min &&
    lat <= BRAZIL_BOUNDS.lat.max &&
    lng >= BRAZIL_BOUNDS.lng.min &&
    lng <= BRAZIL_BOUNDS.lng.max
  );
}
```

**Frontend**: `apps/web/modules/location/lib/geo.ts` — mesma implementação.

**Imports**:

- Backend mutation: `import { haversine, isInBrazil } from "./lib/geo";`
- Frontend: `import { haversine } from "@/modules/location/lib/geo";`
- API route: `import { isInBrazil } from "@/modules/location/lib/geo";`

**Nota**: Duplicação é trade-off aceito. Convex bundler tem suas próprias regras.

### 1.9 Helper `getVerifiedCoords` (lib/user-coords.ts)

**Arquivo**: `packages/backend/convex/lib/user-coords.ts`

```typescript
import { Doc } from "../_generated/dataModel";

type UserWithLocation = Pick<Doc<"users">, "lat" | "lng" | "locationSource">;

export function getVerifiedCoords(
  user: UserWithLocation
): { lat: number; lng: number } | null {
  if (user.locationSource !== "gps") return null;
  if (user.lat === undefined || user.lng === undefined) return null;
  return { lat: user.lat, lng: user.lng };
}
```

**Regra**: Retorna coords apenas se `locationSource === "gps"`. Source "manual" ou "ip" podem ter coords stale. Nome `getVerified` deixa claro a semântica.

---

## 2. API Route para IP (Vercel Headers)

**Arquivo**: `apps/web/app/api/ip-location/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isInBrazil } from "@/modules/location/lib/geo";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const city = request.headers.get("x-vercel-ip-city");
  const lat = request.headers.get("x-vercel-ip-latitude");
  const lng = request.headers.get("x-vercel-ip-longitude");

  if (
    !city &&
    process.env.MOCK_GEO === "true" &&
    process.env.NODE_ENV === "development" &&
    !process.env.VERCEL
  ) {
    return NextResponse.json({ city: "São Paulo", lat: -23.55, lng: -46.63 });
  }

  if (!city || !lat || !lng) {
    return NextResponse.json({ error: "Geolocation unavailable" }, { status: 400 });
  }

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (!isInBrazil(parsedLat, parsedLng)) {
    return NextResponse.json({ error: "Location outside Brazil" }, { status: 400 });
  }

  let decodedCity: string;
  try {
    decodedCity = decodeURIComponent(city);
  } catch {
    decodedCity = city;
  }

  const response = NextResponse.json({
    city: decodedCity,
    lat: parsedLat,
    lng: parsedLng,
  });
  response.headers.set("Cache-Control", "private, max-age=300");
  return response;
}
```

**Segurança**: Requer sessão Clerk válida. MOCK_GEO só funciona em development.

**Rate limit**: Serverless não mantém estado entre requests. Proteção via:

1. Clerk auth (bloqueia unauthenticated)
2. Browser cache 5min (Cache-Control header)
3. Vercel rate limiting built-in (100 req/10s por IP)
4. Response é self-data (IP do próprio user)

Para MVP, isso é suficiente. Se necessário, adicionar Upstash/Redis rate limiter futuramente.

**Adicionar em `.env.example`**:

```
# Dev local: mock geolocation (São Paulo)
MOCK_GEO=true
```

---

## 3. Estrutura de Arquivos

```
packages/backend/convex/
├── lib/
│   ├── geo.ts                                # haversine, isInBrazil (backend)
│   └── user-coords.ts                        # getVerifiedCoords

apps/web/
├── app/
│   ├── (auth)/selecionar-localizacao/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── api/ip-location/
│       └── route.ts
├── modules/location/
│   ├── ui/
│   │   ├── views/
│   │   │   └── location-selector-view.tsx
│   │   └── components/
│   │       ├── gps-permission-screen.tsx
│   │       └── manual-search-screen.tsx
│   └── lib/
│       ├── geo.ts                            # haversine, isInBrazil (frontend duplicado)
│       ├── use-geolocation.ts
│       ├── find-nearest-city.ts
│       └── location-constants.ts
```

---

## 4. Page.tsx — Server Component com fetchQuery

**Carrega cidades no server** — zero subscription reativa.

**IMPORTANTE**: `getAllWithCoords` é query **pública** (sem `getAuthenticatedUser`). Não requer token.

**RSC Payload**: ~300 cidades × 5 campos ≈ 15-20KB serializado. Aceitável para MVP. Se crescer para >1000 cidades, considerar streaming ou paginação.

```typescript
import { fetchQuery } from "convex/nextjs";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/_generated/api";
import { LocationSelectorView } from "@/modules/location/ui/views/location-selector-view";
import { SUGGESTED_CITY_KEYS, type CityWithCoords } from "@/modules/location/lib/location-constants";

export const metadata = { title: "Selecionar localização" };

const getCities = unstable_cache(
  () => fetchQuery(api.cities.getAllWithCoords),
  ["cities-all-coords"],
  { revalidate: 3600 }
);

export default async function SelecionarLocalizacaoPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken({ template: "convex" });
  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  if (!user?.hasCompletedOnboarding) redirect("/completar-perfil");

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL not configured");
  }

  let cities: CityWithCoords[] = [];
  let citiesLoadFailed = false;

  try {
    cities = await getCities();
  } catch (error) {
    citiesLoadFailed = true;
    console.error("Failed to fetch cities:", error);
  }

  const suggestedCities = SUGGESTED_CITY_KEYS
    .map(key => {
      const found = cities.find(c => c.name === key.name && c.state === key.state);
      if (!found && process.env.NODE_ENV === 'development') {
        console.warn(`SUGGESTED_CITY not found in seed: ${key.name}, ${key.state}`);
      }
      return found;
    })
    .filter((c): c is CityWithCoords => c !== undefined);

  return (
    <LocationSelectorView
      cities={cities}
      suggestedCities={suggestedCities}
      citiesLoadFailed={citiesLoadFailed}
      currentCityId={user?.cityId}
    />
  );
}
```

**Guards**: Clerk auth + `hasCompletedOnboarding` check. Redireciona se user não completou perfil.
**currentCityId**: Se user já tem localização, passa para pre-selecionar na view.

**Fallback**: Se fetch falha, view renderiza com `citiesLoadFailed=true` para mostrar banner: "Detecção automática indisponível. Use a busca manual." GPS → nearest city não funciona, mas busca manual funciona.

---

## 4.1 `loading.tsx` — Skeleton Durante Fetch

```typescript
// apps/web/app/(auth)/selecionar-localizacao/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--landing-background)] flex flex-col items-center justify-center p-6">
      <div className="w-64 h-64 rounded-full bg-[var(--landing-surface-container-highest)] animate-pulse" />
      <div className="mt-8 space-y-4 w-full max-w-sm">
        <div className="h-12 bg-[var(--landing-surface-container-high)] rounded-xl animate-pulse" />
        <div className="h-12 bg-[var(--landing-surface-container-high)] rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
```

---

## 5. Hook `use-geolocation.ts` — Implementação Completa

```typescript
interface GeolocationState {
  status:
    | "idle"
    | "checking"
    | "prompting"
    | "granted"
    | "denied"
    | "unavailable"
    | "timeout";
  coords: { lat: number; lng: number } | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const statusRef = useRef(state.status);
  const isMountedRef = useRef(true);

  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchCoords = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;
        setState({
          status: "granted",
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
          error: null,
        });
      },
      (error) => {
        if (!isMountedRef.current) return;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setState({ status: "denied", coords: null, error: "Permissão negada" });
            break;
          case error.POSITION_UNAVAILABLE:
            setState({
              status: "unavailable",
              coords: null,
              error: "Posição indisponível",
            });
            break;
          case error.TIMEOUT:
            setState({ status: "timeout", coords: null, error: "Timeout" });
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  const checkPermission = useCallback(async () => {
    if (statusRef.current === "checking") return;
    if (!navigator.geolocation) {
      setState({ status: "unavailable", coords: null, error: "GPS indisponível" });
      return;
    }

    setState({ status: "checking", coords: null, error: null });

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      if (!isMountedRef.current) return;
      if (result.state === "granted") {
        fetchCoords();
      } else if (result.state === "denied") {
        setState((s) => ({ ...s, status: "denied" }));
      } else {
        setState((s) => ({ ...s, status: "prompting" }));
      }
    } catch {
      if (!isMountedRef.current) return;
      setState({ status: "prompting", coords: null, error: null });
    }
  }, [fetchCoords]);

  const requestPermission = useCallback(() => {
    setState({ status: "checking", coords: null, error: null });
    fetchCoords();
  }, [fetchCoords]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
```

**Uso**:

- `requestPermission()` — chamado quando user clica "Ativar localização" no pre-prompt. Dispara `getCurrentPosition` que mostra prompt do SO. Sem guard de `denied` — permite retry se user liberou nas settings do browser.
- `checkPermission()` — retry button, re-verifica `permissions.query` (detecta se user liberou nas settings)

**Nota**: `checkPermission()` é chamado no mount via useEffect. Em React strict mode pode executar 2x — comportamento idempotente (`permissions.query` é seguro de chamar múltiplas vezes).

**Sobre os refs**: `statusRef` evita re-chamadas desnecessárias durante o check. `isMountedRef` previne setState em component desmontado (geolocation callbacks são async). Em React 18+ poderia usar AbortController para navegação, mas `isMountedRef` é mais simples para callbacks de browser APIs.

**Transições de status**: O status pode ir `checking → timeout` diretamente (se permission já era granted mas GPS não responde). View deve tratar `timeout` independente do estado anterior — mostrar botão "Tentar novamente" + opção manual em ambos os casos.

**Fluxo completo**:

1. View monta → hook chama `checkPermission()` → descobre status atual
2. Se `prompting` → mostrar pre-prompt customizado ("Para encontrar colecionadores perto de você...")
3. User clica "Ativar localização" → chama `requestPermission()` → dispara prompt do SO
4. Se granted → `fetchCoords()` retorna coords → `findNearestCity()` → sugerir cidade
5. Se denied → mostrar tela manual + IP consent dialog

---

## 6. `find-nearest-city.ts` — Importa Haversine do Shared

```typescript
import { haversine } from "@/modules/location/lib/geo";
import {
  DISTANCE_THRESHOLD_KM,
  CityWithCoords,
  isCityWithCoords,
} from "./location-constants";

export function findNearestCity(
  userLat: number,
  userLng: number,
  cities: CityWithCoords[]
): { city: CityWithCoords; distance: number; isDistant: boolean } | null {
  if (cities.length === 0) return null;
  if (isNaN(userLat) || isNaN(userLng)) return null;

  const validCities = cities.filter(isCityWithCoords);
  if (validCities.length === 0) return null;

  let nearest: CityWithCoords | null = null;
  let minDistance = Infinity;

  for (const city of validCities) {
    const distance = haversine(userLat, userLng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  if (!nearest) return null;

  return {
    city: nearest,
    distance: Math.round(minDistance),
    isDistant: minDistance > DISTANCE_THRESHOLD_KM,
  };
}
```

---

## 7. Chips — IDs Pré-resolvidos no Server

**suggestedCities já vem com `_id`** — resolvido no server via `resolveSuggestedCities()`:

```typescript
interface Props {
  cities: CityWithCoords[];
  suggestedCities: CityWithCoords[];
  citiesLoadFailed: boolean;
}

<div role="radiogroup" aria-label="Cidades sugeridas" className="flex flex-wrap gap-2">
  {suggestedCities.map((city) => (
    <Button
      key={city._id}
      variant={selectedCityId === city._id ? "default" : "outline"}
      role="radio"
      aria-checked={selectedCityId === city._id}
      onClick={() => setSelectedCityId(city._id)}
    >
      {city.name}
    </Button>
  ))}
</div>
```

**Vantagens:**

- Zero match por string no client
- IDs garantidos existirem (resolvidos no server)
- `console.warn` em dev se cidade não encontrada no seed
- Acessibilidade: `role="radio"` + `aria-checked`

---

## 7.1 manual-search-screen.tsx — Estrutura

```typescript
import { CityAutocomplete } from "@/modules/auth/ui/components/city-autocomplete";

interface ManualSearchScreenProps {
  selectedCityId: Id<"cities"> | null;
  onCitySelect: (cityId: Id<"cities">) => void;
  suggestedCities: CityWithCoords[];
}

export function ManualSearchScreen({ selectedCityId, onCitySelect, suggestedCities }: ManualSearchScreenProps) {
  return (
    <div className="space-y-6">
      <CityAutocomplete
        value={selectedCityId}
        onSelect={onCitySelect}
      />

      <div>
        <p className="text-sm text-muted-foreground mb-2">Ou escolha uma das principais cidades:</p>
        <div role="radiogroup" aria-label="Cidades sugeridas" className="flex flex-wrap gap-2">
          {suggestedCities.map((city) => (
            <Button
              key={city._id}
              variant={selectedCityId === city._id ? "default" : "outline"}
              role="radio"
              aria-checked={selectedCityId === city._id}
              onClick={() => onCitySelect(city._id)}
            >
              {city.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Dependência**: `CityAutocomplete` já existe em `apps/web/modules/auth/ui/components/city-autocomplete.tsx` e usa `cities.search`. Verificar interface de props no pre-flight.

---

## 7.2 gps-permission-screen.tsx — Estrutura

```typescript
interface GpsPermissionScreenProps {
  status: 'prompting' | 'checking' | 'timeout' | 'unavailable';
  onRequestPermission: () => void;
  onSkipToManual: () => void;
}

export function GpsPermissionScreen({ status, onRequestPermission, onSkipToManual }: GpsPermissionScreenProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      {/* Ilustração stadium-glow do design gps-2.html */}
      <div className="w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center">
        <MapPin className="w-24 h-24 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Para encontrar colecionadores perto de você</h2>
        <p className="text-muted-foreground">
          Precisamos da sua localização para mostrar pontos de troca na sua região.
        </p>
      </div>

      {status === 'timeout' && (
        <p className="text-amber-600">GPS demorou para responder. Tente novamente ou busque manualmente.</p>
      )}

      {status === 'unavailable' && (
        <p className="text-red-600">GPS não disponível no seu dispositivo.</p>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {(status === 'prompting' || status === 'timeout') && (
          <Button onClick={onRequestPermission} disabled={status === 'checking'}>
            {status === 'checking' ? 'Verificando...' : 'Ativar localização'}
          </Button>
        )}
        <Button variant="outline" onClick={onSkipToManual}>
          Buscar arena manualmente
        </Button>
      </div>
    </div>
  );
}
```

---

## 7.3 location-selector-view.tsx — Estrutura

```typescript
"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useGeolocation } from "../lib/use-geolocation";
import { findNearestCity } from "../lib/find-nearest-city";
import { CityWithCoords } from "../lib/location-constants";
import { GpsPermissionScreen } from "./gps-permission-screen";
import { ManualSearchScreen } from "./manual-search-screen";

type ViewState = 'gps' | 'manual';

interface LocationSelectorViewProps {
  cities: CityWithCoords[];
  suggestedCities: CityWithCoords[];
  citiesLoadFailed: boolean;
  currentCityId?: Id<"cities">;
}

export function LocationSelectorView({
  cities,
  suggestedCities,
  citiesLoadFailed,
  currentCityId
}: LocationSelectorViewProps) {
  const router = useRouter();
  const setLocationMutation = useMutation(api.users.setLocation);

  const { status: gpsStatus, coords, requestPermission } = useGeolocation();

  const [viewState, setViewState] = useState<ViewState>('gps');
  const [selectedCityId, setSelectedCityId] = useState<Id<"cities"> | null>(currentCityId ?? null);
  const [locationSource, setLocationSource] = useState<"gps" | "manual" | "ip">("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const citiesRef = useRef(cities);
  citiesRef.current = cities;

  // GPS granted → encontrar cidade mais próxima
  useEffect(() => {
    if (gpsStatus === 'granted' && coords) {
      setLocationSource('gps');
      const nearest = findNearestCity(coords.lat, coords.lng, citiesRef.current);
      if (nearest) {
        setSelectedCityId(nearest.city._id);
        if (nearest.isDistant) {
          toast.info(`Cidade mais próxima encontrada: ${nearest.city.name} (${nearest.distance}km)`);
        }
      } else if (citiesRef.current.length === 0) {
        toast.info("Use a busca manual para selecionar sua cidade.");
        setViewState('manual');
      }
    }
  }, [gpsStatus, coords]);

  // GPS denied/unavailable → ir para manual automaticamente
  useEffect(() => {
    if (gpsStatus === 'denied' || gpsStatus === 'unavailable') {
      setViewState('manual');
    }
  }, [gpsStatus]);

  // citiesLoadFailed → ir para manual automaticamente
  useEffect(() => {
    if (citiesLoadFailed) {
      setViewState('manual');
    }
  }, [citiesLoadFailed]);

  const handleSkipToManual = () => setViewState('manual');

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleConfirmLocation = async () => {
    if (!selectedCityId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await setLocationMutation({
        cityId: selectedCityId,
        locationSource,
        ...(locationSource === "gps" && coords ? { lat: coords.lat, lng: coords.lng } : {}),
      });
      router.push('/cadastrar-figurinhas');
    } catch (error) {
      console.error("setLocation failed:", error);
      const message = error instanceof Error ? error.message : "";
      if (message.includes("aguarde") || message.includes("Limite")) {
        toast.error(message);
      } else {
        toast.error("Erro ao salvar localização. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6">
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Selecionar localização</h1>
      </header>

      {citiesLoadFailed && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Detecção automática indisponível. Use a busca manual.
          </AlertDescription>
        </Alert>
      )}

      {viewState === 'gps' && (
        <GpsPermissionScreen
          status={gpsStatus as 'prompting' | 'checking' | 'timeout' | 'unavailable'}
          onRequestPermission={requestPermission}
          onSkipToManual={handleSkipToManual}
        />
      )}

      {viewState === 'manual' && (
        <ManualSearchScreen
          selectedCityId={selectedCityId}
          onCitySelect={(id) => {
            setSelectedCityId(id);
            setLocationSource('manual');
          }}
          suggestedCities={suggestedCities}
        />
      )}

      {selectedCityId && (
        <div className="mt-auto pt-6">
          <Button
            className="w-full"
            disabled={isSubmitting}
            onClick={handleConfirmLocation}
          >
            {isSubmitting ? 'Salvando...' : 'Confirmar localização'}
          </Button>
        </div>
      )}

      {/* AlertDialog para IP consent - mostrado em manual + denied */}
    </div>
  );
}
```

**ViewState**:

- `'gps'`: Mostra GpsPermissionScreen (estado inicial se GPS não foi denied antes)
- `'manual'`: Mostra ManualSearchScreen (após skip ou GPS denied)

---

## 8. IP Consent — Hydration Safe com AlertDialog

Usar **AlertDialog** do shadcn para focus trap e acessibilidade:

```typescript
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const [showIpConsent, setShowIpConsent] = useState(false);

useEffect(() => {
  const dismissed = sessionStorage.getItem('ip-consent-dismissed');
  setShowIpConsent(!dismissed);
}, []);

const shouldShowIpDialog =
  viewState === 'manual' &&
  gpsStatus === 'denied' &&
  showIpConsent;

const handleIpDecline = () => {
  sessionStorage.setItem('ip-consent-dismissed', 'true');
  setShowIpConsent(false);
};

const handleIpAccept = async () => {
  sessionStorage.setItem('ip-consent-dismissed', 'true');
  try {
    const res = await fetch('/api/ip-location');
    if (!res.ok) throw new Error('IP location failed');
    const data = await res.json();
    const nearest = findNearestCity(data.lat, data.lng, citiesRef.current);
    if (nearest) {
      setSelectedCityId(nearest.city._id);
      setLocationSource('ip');
      toast.success(`Localização detectada: ${nearest.city.name}, ${nearest.city.state}`);
    } else {
      toast.info("Não encontramos uma cidade próxima. Use a busca manual.");
    }
  } catch {
    toast.error('Não foi possível detectar sua localização');
  }
  setShowIpConsent(false);
};

<AlertDialog open={shouldShowIpDialog} onOpenChange={(open) => { if (!open) handleIpDecline(); }}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Detectar localização aproximada?</AlertDialogTitle>
      <AlertDialogDescription>
        Podemos usar seu IP para sugerir uma cidade próxima.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={handleIpDecline}>Não, obrigado</AlertDialogCancel>
      <AlertDialogAction onClick={handleIpAccept}>Sim, detectar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**Acessibilidade**: AlertDialog do shadcn/Radix já inclui focus trap, escape to close, aria attributes.

**Nota UX**: `ip-consent-dismissed` persiste pela sessão (intencional — não perguntar duas vezes).

---

## 9. Constantes e Types (`location-constants.ts`)

**SEM `server-only`** — este arquivo é importado por `find-nearest-city.ts` que roda no client:

```typescript
import { FunctionReturnType } from "convex/server";
import { Id } from "@workspace/backend/_generated/dataModel";
import { api } from "@workspace/backend/_generated/api";

export type CityWithCoords = FunctionReturnType<
  typeof api.cities.getAllWithCoords
>[number];

// Type guard para garantir campos obrigatórios em runtime
export function isCityWithCoords(city: unknown): city is CityWithCoords {
  return (
    typeof city === "object" &&
    city !== null &&
    "_id" in city &&
    "name" in city &&
    "state" in city &&
    "lat" in city &&
    "lng" in city &&
    typeof (city as CityWithCoords).lat === "number" &&
    typeof (city as CityWithCoords).lng === "number"
  );
}

export const SUGGESTED_CITY_KEYS = [
  { name: "São Paulo", state: "SP" },
  { name: "Rio de Janeiro", state: "RJ" },
  { name: "Belo Horizonte", state: "MG" },
  { name: "Brasília", state: "DF" },
  { name: "Salvador", state: "BA" },
  { name: "Curitiba", state: "PR" },
] as const;

export const DISTANCE_THRESHOLD_KM = 100;
```

**`resolveSuggestedCities` fica INLINE no page.tsx** (server component) com o warn:

```typescript
const suggestedCities = SUGGESTED_CITY_KEYS.map((key) => {
  const found = cities.find((c) => c.name === key.name && c.state === key.state);
  if (!found && process.env.NODE_ENV === "development") {
    console.warn(`SUGGESTED_CITY not found in seed: ${key.name}, ${key.state}`);
  }
  return found;
}).filter((c): c is CityWithCoords => c !== undefined);
```

---

## Anti-Patterns (NÃO FAZER)

- **NÃO** chamar `getCurrentPosition` se status é `'denied'`
- **NÃO** usar `useQuery` para `getAllWithCoords` — usar `fetchQuery` no server (one-shot, sem subscription)
- **NÃO** fazer query extra para chips — filtrar do array já carregado
- **NÃO** usar Mapbox/Google Maps API
- **NÃO** criar tabela nova — usar campos em `users`
- **NÃO** adicionar CSS global — usar Tailwind `animate-pulse`
- **NÃO** deixar comentários explicativos no código — o plano já serve de documentação. **Ao implementar, remover todos os comments dos snippets deste plano**
- **NÃO** criar `getByState` se não houver consumer (seletor cascateado)
- **NÃO** ler `user.lat`/`user.lng` diretamente — usar `getVerifiedCoords(user)` do `lib/user-coords.ts`. Coords com source `"manual"` ou `"ip"` podem ser stale
- **NÃO** usar `db.replace` em mutations que atualizam user — risco de perder campos adicionados em migrações futuras. Sempre `db.patch`

**Risco aceito**: `locationSource` vem do client. User pode enviar `"gps"` com coords inventadas dentro de 200km da cidade. Não é possível verificar server-side se GPS foi realmente usado — browser é a fonte. Anti-spoofing de 200km é o melhor possível.

**Decisões MVP**:

- CEP/bairro na busca: cortado — apenas busca por cidade via autocomplete
- Mapa clicável: cortado — chips + autocomplete suficientes pra MVP
- Cache cities: 1h via `unstable_cache` — se admin desativar cidade, leva até 1h pra refletir (known limitation)
- coords para manual/ip: não são salvas no doc — apenas GPS salva lat/lng
- Spoofing não limpa coords antigas: `db.patch({ lat: undefined })` é no-op no Convex. Coords podem permanecer, mas `getVerifiedCoords()` ignora se `locationSource !== "gps"`

**Riscos aceitos**:

- `getAllWithCoords` expõe `_id` e lat/lng de cidades (dados públicos IBGE — não sensível)
- `sessionStorage` pro IP consent reseta ao fechar tab (intencional — perguntar uma vez por sessão)
- Se `citiesLoadFailed === true` E Convex offline, busca manual também falha. Limitação conhecida — app depende do Convex estar online.

---

## Definition of Done

1. [ ] Pre-flight checks passam (grep)
2. [ ] Backend geo lib `packages/backend/convex/lib/geo.ts` criado
3. [ ] Frontend geo lib `apps/web/modules/location/lib/geo.ts` criado
4. [ ] Schema migra sem erro (`npx convex dev`)
5. [ ] Index `by_isActive` na tabela cities
6. [ ] Migration: todas cities existentes com `isActive: true`
7. [ ] Verificação pós-migration: count docs com `isActive === undefined` é 0
8. [ ] Query `getAllWithCoords` filtra por `isActive !== false` (Fase 1)
9. [ ] Mutation valida bounds do Brasil via `isInBrazil()`
10. [ ] Mutation valida `city.isActive !== false` (não permite cidade desativada)
11. [ ] Mutation rejeita lat sem lng (e vice-versa)
12. [ ] Mutation aplica rate limit 30s + max 10/hora
13. [ ] Mutation detecta spoofing (GPS > 200km), degrada pra manual silenciosamente
14. [ ] Mutation usa `requireAuth` (não getAuthenticatedUser)
15. [ ] `fetchQuery` no server component funciona
16. [ ] Page.tsx tem guard `hasCompletedOnboarding` com redirect
17. [ ] GPS já granted → busca coords automaticamente
18. [ ] GPS denied → manual funciona
19. [ ] GPS timeout → botão "Tentar novamente" (hook.requestPermission) + opção manual
20. [ ] Chips usam `_id` pré-resolvido via `resolveSuggestedCities()` no server
21. [ ] Chips têm `role="radio"` + `aria-checked`
22. [ ] Mock dev funciona com `MOCK_GEO=true` apenas em NODE_ENV=development
23. [ ] Cidade > 100km mostra aviso
24. [ ] IP consent usa AlertDialog (focus trap nativo)
25. [ ] IP consent persiste dismissed em sessionStorage (accept E decline)
26. [ ] Banner "Detecção indisponível" se `citiesLoadFailed` + auto-switch para manual
27. [ ] loading.tsx mostra skeleton
28. [ ] Botão "Confirmar" desabilitado se `!selectedCityId`
29. [ ] Botão "Confirmar" com loading state (setIsSubmitting em finally)
30. [ ] Navegação para `/cadastrar-figurinhas` após sucesso
31. [ ] Back navigation com fallback seguro (history.length check)
32. [ ] Zero comentários no código gerado
33. [ ] Rota protegida pelo middleware Clerk
34. [ ] Helper `getVerifiedCoords()` criado em `lib/user-coords.ts`
35. [ ] Verificar que `completeProfile` não seta lat/lng/locationSource
36. [ ] `next.config.js` inclui `transpilePackages: ["@workspace/backend"]`
37. [ ] IP consent dialog chama `/api/ip-location` e sugere cidade
38. [ ] Rate limit mutation: max 10 updates/hora funciona
39. [ ] MOCK_GEO não funciona em Vercel (guard `!process.env.VERCEL`)
40. [ ] Fallback Safari sem `permissions.query` mostra pre-prompt (não dispara GPS direto)
41. [ ] Migration roda antes do deploy da query `getAllWithCoords`
42. [ ] `cities.search` não retorna cidades com `isActive: false` (após Fase 2: `isActive === true`)
43. [ ] Fase 2: `getAllWithCoords` usa `withIndex("by_isActive")` após migration
44. [ ] GPS granted + cities vazio → toast + auto-switch para manual
45. [ ] suggestedCities inline no page.tsx emite console.warn em dev se cidade não encontrada
46. [ ] CityAutocomplete existe e usa cities.search corretamente
47. [ ] Se user já tem cityId, view pre-seleciona no state inicial
48. [ ] Type guard `isCityWithCoords()` existe em location-constants.ts
49. [ ] handleConfirmLocation diferencia erros de rate limit (mostra mensagem do backend)
50. [ ] Pre-flight verifica que completeProfile não seta campos de localização
51. [ ] Header com botão voltar (fallback seguro)
52. [ ] locationUpdateCount reseta para 1 quando lastUpdate > 1h atrás
53. [ ] findNearestCity usa isCityWithCoords para validar cities em runtime

---

## Arquivos de Referência

- `/packages/backend/convex/lib/geo.ts` — haversine, isInBrazil (criar)
- `/apps/web/modules/location/lib/geo.ts` — haversine, isInBrazil (duplicado do backend)
- `/packages/backend/convex/lib/user-coords.ts` — helper getVerifiedCoords (criar)
- `/packages/backend/convex/users.ts` — mutation setLocation
- `/packages/backend/convex/cities.ts` — queries
- `/packages/backend/convex/schema.ts` — campos + indexes
- `/apps/web/modules/auth/ui/components/city-autocomplete.tsx` — reutilizar
- `/docs/design/5-gps/gps.html`
- `/docs/design/5-gps/gps-2.html`

---

## Sequência

1. Pre-flight checks (grep indexes, campos, cities.search, requireAuth, template Clerk, CityAutocomplete)
2. **Backend geo lib** — criar `packages/backend/convex/lib/geo.ts` (haversine, isInBrazil)
3. **Schema** — index `by_isActive` + campo `isActive: v.optional(v.boolean())` em cities + campos user
4. `npx convex dev` — push schema
5. **Migration** — rodar `npx convex run cities:migrateSetCitiesActive`
6. Query — `cities.getAllWithCoords` (pública, filtro `isActive !== false`)
7. Query — `cities.search` (CONDICIONAL — verificar se já existe, CityAutocomplete depende dela)
8. Mutation — `users.setLocation` (usa ./lib/geo, requireAuth)
9. Helper — `lib/user-coords.ts` com `getVerifiedCoords()`
10. `npx convex dev` — validar tudo compila
11. **Frontend geo lib** — criar `apps/web/modules/location/lib/geo.ts` (mesmo código)
12. API Route — `/api/ip-location` (usa geo do módulo, MOCK_GEO só em dev)
13. `.env.example` — documentar MOCK_GEO
14. Constants — `location-constants.ts` (type + SUGGESTED_CITY_KEYS + DISTANCE_THRESHOLD_KM)
15. Util — `find-nearest-city.ts` (usa geo do módulo)
16. Hook — `use-geolocation.ts`
17. loading.tsx — skeleton
18. Page — server component com fetchQuery + token + guards
19. View — client component (pre-seleciona cityId se user já tem)
20. manual-search-screen com CityAutocomplete + chips
21. Verificar rota protegida no middleware Clerk
22. DoD checklist
