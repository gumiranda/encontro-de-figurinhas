# Marketing Pages Design Patterns Analysis

## Objective
Understand existing marketing page patterns for displaying collections of items (stickers/teams) to apply consistent patterns to the selecao/[slug] page.

## Key Files Analyzed
1. **album-copa-do-mundo-2026/page.tsx** (29KB) - Large informational page with multiple card grids
2. **selecoes/page.tsx** (6KB) - Team listing hub page  
3. **figurinhas/page.tsx** (5KB) - Sticker listing hub page
4. **selecao/[slug]/page.tsx** (Current detail page, partial analysis)

---

## Design Patterns Found

### 1. RESPONSIVE GRID CONFIGURATIONS

#### Teams Hub (selecoes/page.tsx)
```
<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
```
- **Pattern**: 4-column grid on desktop, 3 on tablet, 2 on small devices
- **Gap**: 4 units (16px with Tailwind)
- **Use**: Teams/team-level collections
- **Flexibility**: `gap-4` provides consistent spacing

#### Album Info (album-copa-do-mundo-2026/page.tsx)
```
<div className="grid gap-4 sm:grid-cols-2">      // Album versions
<div className="grid gap-4 md:grid-cols-2">      // Sticker types
```
- **Pattern**: 2-column on medium+ screens, 1 column on mobile
- **Gap**: 4 units
- **Use**: Information sections with fewer items (2-4 cards)

#### Related Teams (selecao/[slug]/page.tsx)
```
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
```
- **Pattern**: Dense grid with more columns (2→3→6)
- **Gap**: 4 units
- **Use**: Related/secondary collections (small icons)
- **Constraint**: `max-w-4xl mx-auto` for centering

---

### 2. CARD STRUCTURE & STYLING

#### Basic Card (Team Card - selecoes/page.tsx)
```tsx
<Link key={team.code} href={`/selecao/${team.slug}`}>
  <Card className="h-full hover:border-primary transition-colors cursor-pointer">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center gap-2 text-lg">
        <span className="text-2xl">{team.flagEmoji}</span>
        {team.name}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2 mb-2">
        <Badge variant="secondary">
          {team.stickerCount} figurinhas
        </Badge>
        {team.goldenNumbers.length > 0 && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Star className="h-3 w-3 mr-1 fill-yellow-600" />
            {team.goldenNumbers.length} douradas
          </Badge>
        )}
      </div>
      {team.legendNumbers.length > 0 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          {team.legendNumbers.map((l) => l.name).join(", ")}
        </p>
      )}
    </CardContent>
  </Card>
</Link>
```

**Key Components**:
- **h-full**: Full height for equal-height cards
- **hover:border-primary transition-colors**: Primary interaction
- **pb-2**: Tight CardHeader padding
- **gap-2 items-center**: Icon + text alignment
- **Badges**: Secondary stats with icons
- **text-xs muted-foreground**: Small supporting text

#### Album Version Card (album-copa-do-mundo-2026/page.tsx)
```
className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
```
- **Design tokens**: Uses CSS custom properties for theming
- **Alternative styling**: More formal, info-focused vs interactive cards

---

### 3. BADGE & ICON PATTERNS

**Golden/Special Badges**:
```tsx
<Badge variant="outline" className="text-yellow-600 border-yellow-600">
  <Star className="h-3 w-3 mr-1 fill-yellow-600" />
  {count} douradas
</Badge>
```
- Uses `text-yellow-600` + `border-yellow-600` for consistent gold theming
- Icon with `fill-yellow-600` for solid stars

**Trophy/Legend Text**:
```tsx
<p className="text-xs text-muted-foreground flex items-center gap-1">
  <Trophy className="h-3 w-3" />
  {names.join(", ")}
</p>
```
- Small text with muted color
- Icon prefix for semantic meaning

**Icon Sizes**:
- Title icons: `text-2xl` (team flag emojis)
- Badge icons: `h-3 w-3`
- Supporting icons: `h-3 w-3`

---

### 4. CONTAINER & SPACING PATTERNS

#### Page Sections
```tsx
<section className="py-12">
  <div className="container mx-auto px-4">
    {/* grid content */}
  </div>
</section>
```

#### Alternatives
```tsx
<section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
  {/* centered narrow section */}
</section>

<section className="py-16 md:py-24 bg-muted/30">
  {/* tall section with background */}
</section>
```

**Spacing Hierarchy**:
- `py-12`: Standard section padding (48px)
- `py-16 md:py-24`: Larger sections
- `px-4 sm:px-6`: Mobile → tablet horizontal padding
- `container mx-auto`: Full-width with max constraints
- `max-w-5xl mx-auto`: Centered narrow sections

---

### 5. TEXT & TYPOGRAPHY PATTERNS

**Section Headings**:
```tsx
<h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
  Qual seleção falta no seu álbum?
</h2>
```

**Supporting Text**:
```tsx
<p className="text-sm text-[var(--outline)] mt-6 max-w-3xl">
  Descrição...
</p>

<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
  Larger supporting text
</p>
```

**Key Classes**:
- `font-headline`: Custom headline font family
- `font-bold`: Weight for headers
- `text-muted-foreground`: Reduced prominence
- `max-w-2xl mx-auto`: Text width constraint + centering

---

### 6. INTERACTIVE PATTERNS

**Team Card Hover**:
```
hover:border-primary transition-colors cursor-pointer
```
- Subtle border color change
- Smooth color transition
- Cursor pointer for affordance

**Related Team Link**:
```tsx
className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
```
- Icon over text layout
- Background color subtly changes on hover
- `rounded-lg` for softer appearance

**CTA Button**:
```tsx
<Button size="lg" asChild>
  <Link href="/sign-up">
    Criar conta grátis
    <ArrowRight className="ml-2 h-4 w-4" />
  </Link>
</Button>
```
- Icon trailing button
- `asChild` pattern for Link integration

---

## Data Structure Patterns

All hub pages fetch and display arrays of items with consistent properties:

```typescript
interface TeamItem {
  code: string;
  slug: string;
  name: string;
  flagEmoji: string;
  stickerCount: number;
  goldenNumbers: Array<{length: number}>;  // Count via .length
  legendNumbers: Array<{name: string}>;    // Names for display
}
```

**Key observations**:
- `goldenNumbers` array: Count accessed via `.length`
- `legendNumbers` array: Names mapped to string via `.map().join()`
- Conditional rendering: `length > 0` checks
- Navigation: Always via `slug` property

---

## Recommended Patterns for selecao/[slug] Page

### For Sticker Grid Display
```tsx
<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
  {stickers.map(sticker => (
    <div key={sticker.id} className="aspect-square">
      {/* sticker card */}
    </div>
  ))}
</div>
```
**Rationale**: 
- More columns than team cards (stickers are smaller items)
- Smaller gap (3 instead of 4) for dense collection feel
- `aspect-square` for uniform card dimensions

### For Related Teams Section
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
  {relatedTeams.map(team => (
    <Link href={`/selecao/${team.slug}`}>
      <span className="text-3xl block mb-2">{team.flagEmoji}</span>
      <span className="text-sm font-medium text-center">{team.name}</span>
    </Link>
  ))}
</div>
```
**Rationale**: Pattern already exists in current selecao page

### For Quick Stats
```tsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {stats.map(stat => (
    <Card className="bg-surface-container-high border-outline-variant/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{stat.label}</CardTitle>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{stat.value}</p>
      </CardContent>
    </Card>
  ))}
</div>
```
**Rationale**: Pattern from album-copa page quick facts section

---

## Summary of Patterns

| Use Case | Grid Pattern | Gap | Card Style | Notes |
|----------|---------|-----|-----------|-------|
| Teams Hub | `sm:2 md:3 lg:4` | 4 | Full Card with icons | Primary collection |
| Stickers | `4/6/8 cols` | 3 | Small dense grid | Secondary/related |
| Info Cards | `1/2 cols` | 4 | Formal design tokens | Static info |
| Related Teams | `2/3/6 cols` | 4 | Icon + label | Quick navigation |
| Quick Stats | `1/2 lg:4` | 4 | Card with value | Metrics display |

---

## Implementation Checklist

- [ ] Determine sticker grid columns (likely 6-8 on desktop)
- [ ] Choose card styling (interactive hover vs static)
- [ ] Plan sticker metadata display (number, rarity, player info)
- [ ] Design badge patterns for special stickers
- [ ] Layout for golden/legendary/rare indicators
- [ ] Related content section (other teams? Exchange features?)
- [ ] CTA section (consistent with selecoes page pattern)
- [ ] SEO schema alignment with team page patterns
