# Design Patterns Analysis: Figurinha Detail Page Redesign

## Project Overview
Analyzing design patterns across the Next.js sticker album marketing pages to inform improvements to the figurinha/[slug] sticker detail page.

---

## 1. MARKETING PAGES STRUCTURE

### Existing Marketing Pages in apps/web/app/(marketing)/
- `/album-copa-do-mundo-2026/` - Album overview page
- `/selecao/[slug]/` - Team/selection detail pages
- `/estado/[slug]/` - State detail pages
- `/cidade/[slug]/` - City detail pages
- `/figurinha/[slug]/` - **Sticker detail page** (current target)
- `/raras/[slug]/` - Rare stickers pages
- `/figurinhas/` - Stickers listing
- Blog pages, how-it-works, about, FAQ, etc.

### Common Layout Patterns
All marketing pages use consistent structure:
1. **LandingHeader** at top (navigation, logo)
2. **Hero/Intro Section** with gradient background
3. **Content Sections** (info cards, grids, CTAs)
4. **LandingFooter** at bottom
5. **Navigation within detail pages** (breadcrumbs, prev/next)

---

## 2. CURRENT FIGURINHA PAGE STRUCTURE

**File**: `/apps/web/app/(marketing)/figurinha/[slug]/page.tsx`

### Existing Sections (in order):
1. **Hero Section** - `bg-gradient-to-b from-primary/5 to-background py-16 md:py-24`
   - Breadcrumbs
   - Flag emoji + Badge with code (e.g., "BRA-10")
   - Large h1 title with player name
   - Description text (type-dependent)
   - CTA buttons (Find to trade, See all in team)

2. **Navigation Section** - `border-b`
   - Previous/Next links with icons
   - Counter (e.g., "BRA-10 (10 of 670)")

3. **Info Cards Section** - 3-column grid
   - **Selection** Card: Team name, FIFA code
   - **Type** Card: Sticker type + variant
   - **How to Trade** Card: Step-by-step guide

4. **SEO Content Section** - `bg-muted/30`
   - Prose text about the sticker
   - Links to related pages
   - Information about trading

5. **Related Stickers Section** - Badge-based display
   - Horizontal list of related stickers from same team
   - Badges with special styling for golden/legend variants

6. **CTA Section** - Final call-to-action
   - "Need this sticker?" heading
   - Button to sign up

---

## 3. DESIGN PATTERNS FROM SIMILAR PAGES

### A. Selecao (Team) Detail Page - `/selecao/[slug]/page.tsx`
**Similar structure to figurinha page:**
- Hero section with flag emoji, badge, title
- Description and CTA buttons
- **Info Cards Section** (3 cards in grid):
  - Number range (trophy icon)
  - Golden stickers (star icon)
  - Legend stickers (sparkles icon)
- **"Other Teams" Section** - Grid navigation
  - `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4`
  - Link cards with flag, team name, hover effects
  - `rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors`
- **Top Cities Section** - Card grid display
  - 2-3 column responsive grid
  - Card per city with icons and stats
- **Final CTA Section** - `bg-muted/30`

### B. Estado (State) Detail Page - `/estado/[slug]/page.tsx`
**Icon + Stat Patterns:**
```
flex items-center gap-3:
- w-10 h-10 rounded-full bg-primary/10 (icon container)
- Icon inside (Building2, Users, Store)
- Large number + small label
```

### C. Landing Page Components
**Hero Section**: `relative px-6 pt-20 pb-24 md:pt-28 md:pb-32`
**LandingCard Component** - sticker card variants:
```
- sticker: "border-white/[0.06] bg-gradient-to-b from-[#1e253b] to-[#13192b]"
- sticker-legend: "border-[#ffc965]/35 bg-gradient-to-b from-[#3a2f0c] to-[#1a1408]"
- sticker-have: "border-[#4ff325]/30 bg-gradient-to-b from-[#0e2a08] to-[#0d1323]"
- sticker-need: "border-[#95aaff]/25 border-dashed bg-[#0d1323]/40"
Hover: "hover:-translate-y-1" (lift effect)
```

**Typography**: eyebrow, h1 (bold text-5xl md:text-6xl), descriptions with color scales

---

## 4. COLOR PALETTE & DESIGN TOKENS

### Primary Colors
- **Primary**: `#95aaff` (light purple/blue)
- **Yellow/Tertiary**: `#ffc965`, `#ffd873` (golden)
- **Success/Green**: `#4ff325` (bright green)
- **Error/Red**: `#ff6e84`
- **Foreground**: `#e1e4fa` (light text)
- **Muted**: `#a6aabf` (mid-tone text)
- **Dark Navy**: `#0b1020`

### Gradients & Effects
```
Backgrounds: "bg-gradient-to-b from-primary/5 to-background"
Shadows: "--shadow-glow-primary: 0 0 12px rgba(149, 170, 255, 0.2)"
Borders: border-white/10, border-[#95aaff]/25, border-[#ffc965]/35
```

---

## 5. COMPONENT PATTERNS

### Button Variants
```tsx
Primary: size="lg" asChild <Link> (main CTAs)
Secondary: variant="outline" (alternative actions)
Styling: "inline-flex items-center justify-center gap-2 rounded-md 
          text-sm font-medium transition-all"
```

### Card Components
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title with optional icon</CardTitle>
  </CardHeader>
  <CardContent>Content text and details</CardContent>
</Card>
```

### Badge Component
- Used for code labels (BRA-10), variant indicators
- Golden: `bg-gradient-to-r from-amber-500 to-yellow-400`
- Legend: `bg-purple-600`

### RelatedStickers Component
```tsx
Section with:
- Header + "see all" link
- flex flex-wrap gap-2 Badge items
- Conditional styling: golden (star icon), legend (sparkles)
- Links to detail pages
```

### Grid Navigation Pattern
```
grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4
- Centered icon/emoji
- Hover effects: border-primary, bg-primary/5
- rounded-lg border transition-colors
```

---

## 6. RESPONSIVE DESIGN PATTERNS

### Breakpoints
- Base: mobile
- `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)

### Common Responsive Patterns
```
text-4xl md:text-5xl lg:text-6xl (typography)
grid md:grid-cols-3 (layout)
py-16 md:py-24 (padding scaling)
flex flex-col sm:flex-row (direction change)
max-w-3xl, max-w-4xl (content width caps)
grid-cols-2 sm:grid-cols-3 md:grid-cols-6 (progressive grid)
```

---

## 7. NAVIGATION PATTERNS

### Breadcrumbs
```tsx
<Breadcrumbs items={breadcrumbItems} className="mb-8" />
Display: "/" separator, styled text-sm text-muted-foreground
```

### Prev/Next Navigation
```tsx
<div className="flex justify-between items-center">
  {prevNumber ? <Link /> : <div />}
  <span className="text-sm">Label (X of Y)</span>
  {nextNumber ? <Link /> : <div />}
</div>
```

---

## 8. ANIMATION & INTERACTION PATTERNS

### Hover States
```
Links: hover:text-primary hover:underline
Cards: hover:border-primary hover:bg-primary/5 transition-colors
Lift: hover:-translate-y-1 (for card stickers)
Scale: hover:scale-105 (for badges)
```

### Transitions
```
transition-all duration-200/300/400/700
ease-[cubic-bezier(0.16,1,0.3,1)] (sophisticated easing)
opacity-100 translate-y-0 / opacity-0 translate-y-6 (reveal)
```

---

## 9. CURRENT FIGURINHA PAGE STRENGTHS

✅ Clear information hierarchy
✅ Consistent with team/state pages
✅ Good SEO structure
✅ Related stickers navigation
✅ Responsive design
✅ Multiple CTAs

---

## 10. IMPROVEMENT OPPORTUNITIES

### 1. Visual Sticker Showcase
- Add LandingCard-style display area above/near hero
- Use aspect-[3/4] card with state-based gradients
- Could show preview of sticker design

### 2. Enhanced Info Cards
- Add icon circles (like estado page pattern)
- Include trophy, star, or other visual indicators
- Improve visual hierarchy with colors

### 3. Related Stickers Enhancement
- Convert to mini-grid layout (like "Other Teams" pattern)
- Show visual card thumbnails instead of just badges
- Add prominent "See all" navigation

### 4. Hero Section Depth
- Add visual elements beyond plain gradient
- Use section-band patterns or additional design layers
- Add subtle glow effects

### 5. Interactive Elements
- Add scroll-reveal animations (useScrollReveal hook)
- Implement hover lift effects on cards
- Add micro-interactions for engagement

### 6. Player Information Display
- Elevate player stats/achievements
- Use trophy/achievement icons for special stickers
- Show rarity levels visually

### 7. Navigation Enhancement
- Add progress bar for album completion
- Create visual progress indicator
- Could add thumbnail grid navigator

### 8. Section Flow & Spacing
- Alternate section backgrounds (bg-muted/30)
- Use visual breaks between sections
- Improve whitespace management

---

## 11. REUSABLE COMPONENTS TO LEVERAGE

### From Landing Module:
- `LandingCard` - Sticker card styling with variants
- `HeroSection` - Base pattern for layouts
- Scroll reveal hook - Animation patterns
- Card components - Info grouping

### Recommended New Components:
- `StatIcon` - Icon + number pattern
- `RelatedItemsGrid` - Grid variant for related items
- `RarityIndicator` - Visual rarity display
- `ProgressBar` - Album progress indicator

---

## 12. KEY FILE LOCATIONS

**Core Page**:
- `/apps/web/app/(marketing)/figurinha/[slug]/page.tsx` - Figurinha detail page
- `/apps/web/app/(marketing)/selecao/[slug]/page.tsx` - Team detail page (reference)
- `/apps/web/app/(marketing)/estado/[slug]/page.tsx` - State detail page (reference)

**Components**:
- `/apps/web/modules/landing/ui/components/landing-card.tsx` - Card styling
- `/apps/web/modules/landing/ui/components/landing-header.tsx` - Page header
- `/apps/web/modules/landing/ui/components/landing-footer.tsx` - Page footer
- `/apps/web/components/related-stickers.tsx` - Related items display
- `/apps/web/modules/stickers/ui/components/sticker-tile.tsx` - Sticker display

---

## 13. NEXT STEPS

### Phase 1: Quick Visual Wins
1. Add icon circles to info cards
2. Enhance related stickers with mini-grid
3. Add scroll-reveal animations

### Phase 2: Structural Improvements
1. Reorganize info cards with better hierarchy
2. Add rarity indicators higher on page
3. Create player info display area

### Phase 3: Interactive Features
1. Implement thumbnail navigator
2. Add FAQ section for stickers
3. Create state-based visual indicators

---

## SUMMARY

The figurinha page follows marketing page patterns well. Key improvement opportunities:
1. **Visual richness** - Use LandingCard and gradient patterns
2. **Hierarchy** - Leverage icon + stat patterns from other pages
3. **Interaction** - Add scroll reveals and micro-interactions
4. **Navigation** - Enhance with progress visualization
5. **Consistency** - Unify styling across detail pages

All improvements use existing components and patterns already in the codebase.
