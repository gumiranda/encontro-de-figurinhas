import type { Metadata } from "next";
import {
  Bolt,
  Check,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Plus,
  Search,
  Star,
  Swords,
  AlertTriangle,
  Info,
  XCircle,
  Shield,
  Crown,
  Trophy,
  Bell,
  Filter,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";

export const metadata: Metadata = {
  title: "Design System · Styleguide",
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return (
    <div className="dark min-h-screen bg-background stadium-gradient pb-40 text-foreground">
      <div className="mx-auto max-w-[1360px] px-6 lg:px-10">
        <Header />
        <Cover />
        <SectionColors />
        <SectionTypography />
        <SectionButtons />
        <SectionForms />
        <SectionChipsBadges />
        <SectionIcons />
        <SectionComponents />
        <SectionEffects />
        <SectionSpacing />
        <SectionVoice />
        <SectionShowcase />
        <Footer />
      </div>
    </div>
  );
}

/* ----------------------------- SECTION HEAD ----------------------------- */
function SectionHead({
  num,
  title,
  lede,
}: {
  num: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="grid items-start gap-10 border-t border-outline-variant/40 pt-16 md:grid-cols-[200px_1fr]">
      <div className="font-mono text-[12px] tracking-[0.2em] text-on-surface-variant">
        <span className="font-semibold text-primary">{num}</span> /{" "}
        {title.toUpperCase()}
      </div>
      <div>
        <h2 className="font-[var(--font-headline)] text-5xl font-bold leading-none tracking-tight">
          {lede}
        </h2>
      </div>
    </div>
  );
}

/* --------------------------------- HEADER --------------------------------- */
function Header() {
  return (
    <header className="sticky top-0 z-50 -mx-6 flex items-center justify-between border-b border-outline-variant/40 bg-background/80 px-6 py-4 backdrop-blur-lg lg:-mx-10 lg:px-10">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-primary-dim to-primary text-[color:var(--on-primary)] shadow-[0_10px_22px_-8px_rgba(149,170,255,0.4)]">
          <Trophy className="size-5" strokeWidth={2.5} />
        </span>
        <div>
          <div className="font-[var(--font-headline)] text-lg font-bold tracking-tight text-primary">
            Figurinha Fácil
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
            Sistema Visual · v1.0
          </div>
        </div>
      </div>
      <div className="hidden items-center gap-6 font-[var(--font-headline)] text-[11px] uppercase tracking-[0.22em] text-on-surface-variant md:flex">
        <span className="tag-chip">
          <span className="pulse-dot" /> Live na Arena
        </span>
        <span>Dark · MD3</span>
        <span className="text-primary">Styleguide</span>
      </div>
    </header>
  );
}

/* --------------------------------- COVER --------------------------------- */
function Cover() {
  return (
    <section className="py-16 lg:py-20">
      <div className="grid items-end gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Badge variant="destaque" className="px-3 py-1.5">
            <Bolt className="size-3" /> Styleguide · MD3 Dark
          </Badge>
          <h1 className="mt-5 font-[var(--font-headline)] text-[64px] font-bold leading-[0.96] tracking-tight lg:text-[92px]">
            O sistema
            <br />
            visual da{" "}
            <span className="text-gradient-primary">arena.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant">
            Tokens, tipografia, componentes e padrões para construir a
            experiência de troca mais rápida do Brasil. Baseado em Material
            Design 3 com alma de estádio.
          </p>
          <div className="mt-9 grid max-w-xl grid-cols-2 gap-5">
            <MetaCard label="Tema" value="Dark first" />
            <MetaCard label="Tipografia" value="Space Grotesk + Manrope" />
            <MetaCard label="Base" value="MD3 · Tailwind v4" />
            <MetaCard label="Grid / Radius" value="4px · 0.475rem" />
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-outline-variant/50 bg-gradient-to-br from-surface-container via-surface-container-low to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(149,170,255,0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,243,37,0.18),transparent_55%)]" />
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-3 py-1 font-mono text-[11px] text-primary backdrop-blur">
            <span className="pulse-dot" /> arena.live
          </div>
          <div className="grid h-full place-items-center">
            <div
              className="font-[var(--font-headline)] font-bold leading-none text-transparent"
              style={{
                fontSize: "clamp(180px,28vw,320px)",
                WebkitTextStroke: "2px rgba(149,170,255,0.65)",
                letterSpacing: "-0.04em",
              }}
            >
              FF
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-outline-variant/50 bg-surface-container-high p-4">
      <div className="font-[var(--font-headline)] text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
        {label}
      </div>
      <div className="mt-1.5 font-[var(--font-headline)] text-xl font-bold">
        {value}
      </div>
    </div>
  );
}

/* --------------------------------- COLORS --------------------------------- */
function SectionColors() {
  return (
    <section className="py-16">
      <SectionHead num="01" title="Cor" lede="Paleta da arena" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Azul elétrico para ação principal, verde vibrante para conquista/troca
        concluída, dourado para raridade. Fundo profundo inspirado em estádio à
        noite.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Swatch
          name="Primary · Stadium Blue"
          hex="#95aaff"
          onHex="#00247e"
          style={{
            background: "var(--primary)",
            color: "var(--on-primary)",
          }}
        />
        <Swatch
          name="Secondary · Pitch Green"
          hex="#4ff325"
          onHex="#105500"
          style={{
            background: "var(--secondary)",
            color: "var(--on-secondary)",
          }}
        />
        <Swatch
          name="Tertiary · Trophy Gold"
          hex="#ffc965"
          onHex="#5f4200"
          style={{
            background: "var(--tertiary)",
            color: "var(--on-tertiary)",
          }}
        />
      </div>

      <h3 className="mt-14 font-[var(--font-headline)] text-xl font-semibold">
        Surfaces · hierarquia de fundo
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <Surface label="Dim" hex="#090e1c" className="bg-surface-dim" />
        <Surface
          label="Container Low"
          hex="#0d1323"
          className="bg-surface-container-low"
        />
        <Surface
          label="Container"
          hex="#13192b"
          className="bg-surface-container"
        />
        <Surface
          label="Container High"
          hex="#181f33"
          className="bg-surface-container-high"
        />
        <Surface
          label="Highest"
          hex="#1e253b"
          className="bg-surface-container-highest"
        />
      </div>

      <h3 className="mt-14 font-[var(--font-headline)] text-xl font-semibold">
        Cores semânticas
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SemanticCard
          icon={<CheckCircle2 className="size-5" />}
          name="Success"
          hex="#81c784 · swap ok"
          color="var(--secondary)"
          bg="rgba(79,243,37,0.15)"
        />
        <SemanticCard
          icon={<Info className="size-5" />}
          name="Info"
          hex="#95aaff · sistema"
          color="var(--primary)"
          bg="rgba(149,170,255,0.15)"
        />
        <SemanticCard
          icon={<AlertTriangle className="size-5" />}
          name="Warning"
          hex="#ffb74d · atenção"
          color="var(--tertiary)"
          bg="rgba(255,201,101,0.15)"
        />
        <SemanticCard
          icon={<XCircle className="size-5" />}
          name="Destructive"
          hex="#ff6e84 · erro"
          color="var(--destructive)"
          bg="rgba(255,110,132,0.15)"
        />
      </div>
    </section>
  );
}

function Swatch({
  name,
  hex,
  onHex,
  style,
}: {
  name: string;
  hex: string;
  onHex: string;
  style: React.CSSProperties;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/50 bg-surface-container">
      <div
        className="flex h-44 flex-col justify-between p-5"
        style={style}
      >
        <div className="font-[var(--font-headline)] text-[11px] font-bold uppercase tracking-[0.18em]">
          {name}
        </div>
        <div className="font-[var(--font-headline)] text-4xl font-bold leading-none tracking-tight">
          {hex}
        </div>
      </div>
      <div className="flex justify-between border-t border-outline-variant/50 px-5 py-3 font-mono text-xs text-on-surface-variant">
        <span>
          <b className="font-medium text-foreground">on</b> {onHex}
        </span>
        <span>var(--primary)</span>
      </div>
    </div>
  );
}

function Surface({
  label,
  hex,
  className,
}: {
  label: string;
  hex: string;
  className: string;
}) {
  return (
    <div
      className={`flex h-36 flex-col justify-between rounded-xl border border-outline-variant/40 p-4 ${className}`}
    >
      <span className="font-[var(--font-headline)] text-[11px] uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </span>
      <span className="font-mono text-[13px] text-foreground">{hex}</span>
    </div>
  );
}

function SemanticCard({
  icon,
  name,
  hex,
  color,
  bg,
}: {
  icon: React.ReactNode;
  name: string;
  hex: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-outline-variant/50 bg-surface-container p-4">
      <div
        className="grid size-10 place-items-center rounded-[10px]"
        style={{ background: bg, color }}
      >
        {icon}
      </div>
      <div>
        <div className="font-[var(--font-headline)] text-sm font-bold uppercase tracking-wider">
          {name}
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-on-surface-variant">
          {hex}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ TYPOGRAPHY ------------------------------ */
function SectionTypography() {
  return (
    <section className="py-16">
      <SectionHead num="02" title="Tipografia" lede="Vozes da arena" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Space Grotesk carrega headlines, números e labels — geométrica,
        confiante. Manrope sustenta textos longos e interface. JetBrains Mono
        em dados e códigos.
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <FamilyCard
          role="Headline"
          name="Space Grotesk"
          sample="Aa"
          className="font-[var(--font-headline)] font-bold"
          weights={["300", "500", "600", "700"]}
        />
        <FamilyCard
          role="Body / Label"
          name="Manrope"
          sample="Aa"
          className="font-[var(--font-body)] font-bold"
          weights={["400", "500", "600", "700"]}
        />
        <FamilyCard
          role="Mono · Data"
          name="JetBrains Mono"
          sample="#042"
          className="font-mono font-medium"
          weights={["400", "500", "600"]}
        />
      </div>

      <div className="mt-12 divide-y divide-outline-variant/35">
        <TypeRow
          label="Display · XL"
          meta="Space Grotesk 700 · 96/92"
          className="font-[var(--font-headline)] text-6xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-[96px]"
          text="Arena aberta."
        />
        <TypeRow
          label="Heading · H1"
          meta="Space Grotesk 700 · 48/50"
          className="font-[var(--font-headline)] text-5xl font-bold leading-tight tracking-tight"
          text="Álbum da Copa 2026"
        />
        <TypeRow
          label="Heading · H2"
          meta="Space Grotesk 600 · 32/37"
          className="font-[var(--font-headline)] text-3xl font-semibold tracking-tight"
          text="Meus pontos de troca"
        />
        <TypeRow
          label="Body · Large"
          meta="Manrope 500 · 18/28"
          className="font-[var(--font-body)] text-lg leading-relaxed"
          text="A maior rede de trocas do Brasil. Troque perto de você, com segurança."
        />
        <TypeRow
          label="Body · Default"
          meta="Manrope 500 · 15/23"
          className="font-[var(--font-body)] text-[15px] leading-relaxed text-on-surface-variant"
          text="Cadastre suas repetidas, as que precisa, e deixe o sistema achar o match."
        />
        <TypeRow
          label="Label · Stadium"
          meta="Space Grotesk 700 · 11 · 0.22em"
          className="font-[var(--font-headline)] text-[11px] font-bold uppercase tracking-[0.22em] text-primary"
          text="AO VIVO · NA ARENA"
        />
        <TypeRow
          label="Mono · Data"
          meta="JetBrains Mono 500 · 13"
          className="font-mono text-[13px] text-on-surface-variant"
          text="TROCA_ID · 2026-04-17T14:22 · SP"
        />
      </div>
    </section>
  );
}

function FamilyCard({
  role,
  name,
  sample,
  className,
  weights,
}: {
  role: string;
  name: string;
  sample: string;
  className: string;
  weights: string[];
}) {
  return (
    <div className="rounded-xl border border-outline-variant/50 bg-surface-container p-7">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
          {role}
        </span>
        <span className={`text-sm ${className}`}>{name}</span>
      </div>
      <div
        className={`mt-4 text-[64px] leading-none tracking-tight ${className}`}
      >
        {sample}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {weights.map((w) => (
          <span
            key={w}
            className="rounded-full border border-outline-variant/50 px-2.5 py-1 font-mono text-[11px] text-on-surface-variant"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function TypeRow({
  label,
  meta,
  className,
  text,
}: {
  label: string;
  meta: string;
  className: string;
  text: string;
}) {
  return (
    <div className="grid items-baseline gap-8 py-6 md:grid-cols-[220px_1fr_200px]">
      <div className="font-mono text-[12px] uppercase tracking-[0.1em] text-on-surface-variant">
        {label}
      </div>
      <div className={className}>{text}</div>
      <div className="font-mono text-[11px] text-on-surface-variant md:text-right">
        {meta}
      </div>
    </div>
  );
}

/* ------------------------------- BUTTONS ------------------------------- */
function SectionButtons() {
  return (
    <section className="py-16">
      <SectionHead num="03" title="Botões" lede="Chamadas de ação" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Gradiente azul para jogada principal. Sólidos, outline, ghost e
        gradientes de conquista (verde) e destaque (dourado). Mínimo 44px em
        mobile.
      </p>

      <div className="mt-10 space-y-3">
        <BtnRow label="Primary">
          <Button variant="gradient">
            <Bolt className="size-4" /> BUSCAR TROCAS
          </Button>
          <Button variant="gradient">COMEÇAR AGORA</Button>
          <Button variant="default">
            <Plus className="size-4" /> Nova figurinha
          </Button>
          <Button variant="default" size="sm">
            Confirmar
          </Button>
        </BtnRow>
        <BtnRow label="Secondary">
          <Button variant="success">
            <Check className="size-4" /> Marcar como trocada
          </Button>
          <Button variant="tertiary">
            <Star className="size-4" /> Destaque Premium
          </Button>
          <Button variant="destructive">
            <XCircle className="size-4" /> Remover
          </Button>
        </BtnRow>
        <BtnRow label="Tonal / Ghost">
          <Button variant="outline">
            <MapPin className="size-4" /> Ver no mapa
          </Button>
          <Button variant="outline">Cancelar</Button>
          <Button variant="ghost">Voltar</Button>
          <Button variant="link">Saiba mais →</Button>
        </BtnRow>
        <BtnRow label="Tamanhos / Ícones">
          <Button size="lg">Grande · lg</Button>
          <Button>Padrão</Button>
          <Button size="sm">Pequeno · sm</Button>
          <Button variant="outline" size="icon">
            <Search className="size-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </BtnRow>
      </div>
    </section>
  );
}

function BtnRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-outline-variant/50 bg-surface-container p-6">
      <div className="mr-3 w-28 shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------- FORMS ---------------------------------- */
function SectionForms() {
  return (
    <section className="py-16">
      <SectionHead num="04" title="Forms & Entradas" lede="Campos & controles" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Inputs descansam no surface-container-highest, foco em azul com halo de
        3px. Labels Manrope SemiBold, hints on-surface-variant.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Cidade</Label>
          <div className="flex h-12 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-highest pl-4 pr-1.5 focus-within:border-primary">
            <Search className="size-4 text-outline" />
            <input
              placeholder="Digite sua cidade (ex: São Paulo, Rio...)"
              className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-outline"
            />
            <Button variant="default" size="sm">
              BUSCAR
            </Button>
          </div>
          <span className="text-xs text-on-surface-variant">
            1.2k colecionadores ativos agora
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sg-email">E-mail</Label>
          <Input
            id="sg-email"
            defaultValue="juliana@figurinhafacil.com"
          />
          <span className="text-xs text-on-surface-variant">
            Usaremos só para notificações de troca.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sg-num">Número da figurinha</Label>
          <Input id="sg-num" placeholder="ex: 042, 118, 207" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sg-obs">Observações</Label>
          <Textarea id="sg-obs" placeholder="Conte o que você procura..." />
        </div>
      </div>

      <h3 className="mt-12 font-[var(--font-headline)] text-xl font-semibold">
        Seleção
      </h3>
      <div className="mt-4 grid gap-6 rounded-xl border border-outline-variant/50 bg-surface-container p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3.5">
          <Label className="flex items-center gap-2.5">
            <Checkbox defaultChecked /> Troca presencial
          </Label>
          <Label className="flex items-center gap-2.5">
            <Checkbox defaultChecked /> Troca por correio
          </Label>
          <Label className="flex items-center gap-2.5">
            <Checkbox /> Apenas premium
          </Label>
        </div>

        <RadioGroup defaultValue="5" className="flex flex-col gap-3.5">
          <Label className="flex items-center gap-2.5">
            <RadioGroupItem value="5" /> Até 5 km
          </Label>
          <Label className="flex items-center gap-2.5">
            <RadioGroupItem value="20" /> Até 20 km
          </Label>
          <Label className="flex items-center gap-2.5">
            <RadioGroupItem value="city" /> Cidade inteira
          </Label>
        </RadioGroup>

        <div className="flex flex-col gap-3.5">
          <SwitchRow label="Notificações push" on />
          <SwitchRow label="Perfil público" on />
          <SwitchRow label="Trocas por correio" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="inline-flex rounded-[10px] border border-outline-variant bg-surface-container-highest p-1">
            {["Preciso", "Tenho", "Matches"].map((t, i) => (
              <span
                key={t}
                className={`rounded-lg px-4 py-2 font-[var(--font-body)] text-[13px] font-semibold ${
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "text-on-surface-variant"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="inline-flex rounded-full border border-outline-variant bg-surface-container-high p-1">
            {["Perto", "Cidade", "Brasil"].map((t, i) => (
              <span
                key={t}
                className={`rounded-full px-4 py-2 font-[var(--font-headline)] text-[11px] font-bold uppercase tracking-[0.15em] ${
                  i === 0
                    ? "bg-foreground text-background"
                    : "text-on-surface-variant"
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SwitchRow({ label, on }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full border transition-colors ${
          on
            ? "border-primary bg-primary/25"
            : "border-outline-variant bg-surface-container-highest"
        }`}
      >
        <span
          className={`absolute top-[2px] size-[18px] rounded-full transition-all ${
            on ? "left-[22px] bg-primary" : "left-[2px] bg-outline"
          }`}
        />
      </span>
    </div>
  );
}

/* ------------------------------ CHIPS / BADGES ------------------------------ */
function SectionChipsBadges() {
  return (
    <section className="py-16">
      <SectionHead num="05" title="Chips & Badges" lede="Sinalizações rápidas" />

      <div className="mt-10 flex flex-col gap-6 rounded-xl border border-outline-variant/50 bg-surface-container p-7">
        <div>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
            Chips · filtros
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Chip variant="primary">
              <MapPin className="size-3.5" /> São Paulo
            </Chip>
            <Chip variant="secondary">
              <CheckCircle2 className="size-3.5" /> Match disponível
            </Chip>
            <Chip variant="tertiary">
              <Star className="size-3.5" /> Raras
            </Chip>
            <Chip variant="destructive">
              <XCircle className="size-3.5" /> Bloqueado
            </Chip>
            <Chip>
              <Bell className="size-3.5" /> Últimas 24h
            </Chip>
            <Chip variant="outline">Correio aceito</Chip>
            <Chip variant="solid-primary">+ Adicionar</Chip>
            <Chip variant="solid-secondary">
              <Shield className="size-3.5" /> Verificado
            </Chip>
          </div>
        </div>
        <Separator />
        <div>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
            Badges · marcadores
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Badge variant="destaque">Destaque</Badge>
            <Badge variant="premium">Premium</Badge>
            <Badge variant="live">Ao Vivo</Badge>
            <Badge variant="new">Novo</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

type ChipVariant =
  | "default"
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "outline"
  | "solid-primary"
  | "solid-secondary";

function Chip({
  variant = "default",
  children,
}: {
  variant?: ChipVariant;
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-[var(--font-body)] text-xs font-semibold";
  const styles: Record<ChipVariant, string> = {
    default:
      "border-outline-variant bg-surface-container-high text-foreground",
    primary:
      "border-primary/40 bg-primary/10 text-primary",
    secondary:
      "border-secondary/40 bg-secondary/10 text-secondary",
    tertiary:
      "border-tertiary/40 bg-tertiary/10 text-tertiary",
    destructive:
      "border-destructive/40 bg-destructive/10 text-destructive",
    outline: "border-outline-variant bg-transparent text-foreground",
    "solid-primary":
      "border-transparent bg-primary text-[color:var(--on-primary)]",
    "solid-secondary":
      "border-transparent bg-secondary text-[color:var(--on-secondary)]",
  };
  return <span className={`${base} ${styles[variant]}`}>{children}</span>;
}

/* --------------------------------- ICONS --------------------------------- */
function SectionIcons() {
  const icons = [
    { icon: Trophy, lbl: "trophy" },
    { icon: Swords, lbl: "swap" },
    { icon: MapPin, lbl: "location" },
    { icon: Search, lbl: "search" },
    { icon: Bolt, lbl: "bolt" },
    { icon: Plus, lbl: "add" },
    { icon: CheckCircle2, lbl: "check" },
    { icon: Star, lbl: "star" },
    { icon: Shield, lbl: "shield" },
    { icon: Crown, lbl: "crown" },
    { icon: Bell, lbl: "bell" },
    { icon: Filter, lbl: "filter" },
    { icon: SlidersHorizontal, lbl: "tune" },
    { icon: MoreHorizontal, lbl: "more" },
    { icon: ArrowRight, lbl: "arrow" },
    { icon: Sparkles, lbl: "sparkle" },
  ];
  return (
    <section className="py-16">
      <SectionHead num="06" title="Iconografia" lede="Lucide ativo" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Lucide em estado outlined padrão. Tamanho base 16–24px; hover para
        primary.
      </p>
      <div className="mt-10 grid grid-cols-4 gap-3 md:grid-cols-8">
        {icons.map(({ icon: Icon, lbl }) => (
          <div
            key={lbl}
            className="group relative grid aspect-square place-items-center rounded-md border border-outline-variant/50 bg-surface-container text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Icon className="size-6" />
            <span className="absolute bottom-1.5 font-mono text-[9px] tracking-[0.02em] text-on-surface-variant">
              {lbl}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ COMPONENTS ------------------------------ */
function SectionComponents() {
  return (
    <section className="py-16">
      <SectionHead num="07" title="Componentes" lede="Peças do jogo" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Sticker cards (tenho, repetida, preciso), listas, estatísticas, alerts e
        progresso. Bordas 1px outline-variant, radius xl em containers.
      </p>

      <h3 className="mt-10 font-[var(--font-headline)] text-xl font-semibold">
        Sticker cards
      </h3>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <StickerCard tag="Copa 2026 · Grupo A" crest="BR" num="042" team="Vinicius Jr." />
        <StickerCard tag="Repetida" crest="AR" num="118" team="Messi · 10" variant="dupe" />
        <StickerCard tag="Preciso" num="207" team="Em aberto" variant="missing" />
      </div>

      <h3 className="mt-12 font-[var(--font-headline)] text-xl font-semibold">
        Lista de matches
      </h3>
      <div className="mt-5 space-y-2.5">
        <MatchRow
          initials="JM"
          title="Juliana Martins"
          highlight=" · Match perfeito"
          sub="Pinheiros · 1.2 km · tem 4 das suas figurinhas"
          chip={{ variant: "secondary", label: "Trocar", icon: Swords }}
        />
        <MatchRow
          initials="RD"
          title="Rafael Dias"
          sub="Vila Madalena · 2.8 km · 2 matches possíveis"
          chip={{ variant: "default", label: "Ativo agora", icon: Bell }}
          avatarStyle="bg-gradient-to-br from-secondary to-secondary-container text-[color:var(--on-secondary)]"
        />
        <MatchRow
          initials="AS"
          title="Ana Souza"
          badge={<Badge variant="premium">Premium</Badge>}
          sub="Ponto fixo · Shopping Eldorado · 12 trocas concluídas"
          chip={{ variant: "tertiary", label: "4.9", icon: Star }}
          avatarStyle="bg-gradient-to-br from-tertiary to-tertiary-container text-[color:var(--on-tertiary)]"
        />
      </div>

      <h3 className="mt-12 font-[var(--font-headline)] text-xl font-semibold">
        Estatísticas
      </h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Figurinhas coladas" value="247" suffix="/ 670" accent="primary" progress={37} footer="37% do álbum" />
        <StatCard label="Repetidas" value="58" accent="secondary" footer="+12 esta semana" />
        <StatCard label="Faltam" value="423" footer="63% a colar" />
        <StatCard label="Trocas realizadas" value="34" accent="tertiary" footer="★ 4.9 reputação" />
      </div>

      <h3 className="mt-12 font-[var(--font-headline)] text-xl font-semibold">
        Alerts
      </h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Alert
          variant="success"
          icon={<CheckCircle2 className="size-5" />}
          title="Troca confirmada!"
          message="Juliana aceitou trocar a figurinha 042. Combine o encontro no chat."
        />
        <Alert
          variant="info"
          icon={<Info className="size-5" />}
          title="Match encontrado"
          message="3 novos colecionadores perto de você têm figurinhas que você precisa."
        />
        <Alert
          variant="warning"
          icon={<AlertTriangle className="size-5" />}
          title="Ponto sem confirmação"
          message="Este ponto de troca não foi confirmado nos últimos 30 dias."
        />
        <Alert
          variant="destructive"
          icon={<XCircle className="size-5" />}
          title="Troca recusada"
          message="O outro colecionador negou a troca. Continue buscando outros matches."
        />
      </div>
    </section>
  );
}

function StickerCard({
  tag,
  crest,
  num,
  team,
  variant = "default",
}: {
  tag: string;
  crest?: string;
  num: string;
  team: string;
  variant?: "default" | "dupe" | "missing";
}) {
  const styles: Record<string, string> = {
    default:
      "border-primary/20 bg-gradient-to-br from-surface-bright to-surface-container",
    dupe: "border-secondary/40 bg-gradient-to-br from-secondary/20 to-surface-container",
    missing: "border-dashed border-outline/30 bg-gradient-to-br from-surface-container to-surface-container-low",
  };
  return (
    <div
      className={`relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-xl border p-5 ${styles[variant]}`}
    >
      {variant === "dupe" ? (
        <span className="absolute right-3 top-3 rounded-md bg-secondary px-2 py-0.5 font-[var(--font-headline)] text-xs font-bold text-[color:var(--on-secondary)]">
          x2
        </span>
      ) : null}
      <span
        className={`font-[var(--font-headline)] text-[10px] font-bold uppercase tracking-[0.15em] ${
          variant === "missing" ? "text-outline" : "text-on-surface-variant"
        }`}
      >
        {tag}
      </span>
      <div>
        {crest ? (
          <div className="grid size-12 place-items-center rounded-full bg-background/40 font-[var(--font-headline)] font-bold text-primary">
            {crest}
          </div>
        ) : (
          <div className="grid size-12 place-items-center rounded-full border border-dashed border-outline text-outline">
            ?
          </div>
        )}
        <div className="mt-3 font-[var(--font-headline)] text-4xl font-bold leading-none tracking-tight">
          {num}
        </div>
        <div
          className={`mt-1 font-[var(--font-headline)] text-[13px] font-semibold ${
            variant === "missing" ? "text-on-surface-variant" : ""
          }`}
        >
          {team}
        </div>
      </div>
    </div>
  );
}

function MatchRow({
  initials,
  title,
  highlight,
  sub,
  chip,
  badge,
  avatarStyle = "bg-gradient-to-br from-primary to-primary-dim text-[color:var(--on-primary)]",
}: {
  initials: string;
  title: string;
  highlight?: string;
  sub: string;
  chip: { variant: ChipVariant; label: string; icon: typeof Bell };
  badge?: React.ReactNode;
  avatarStyle?: string;
}) {
  const Icon = chip.icon;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-outline-variant/50 bg-surface-container p-4">
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-full font-[var(--font-headline)] font-bold ${avatarStyle}`}
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-[var(--font-headline)] text-[15px] font-semibold">
          {title}
          {highlight ? (
            <span className="text-secondary">{highlight}</span>
          ) : null}
          {badge ? <span className="ml-2">{badge}</span> : null}
        </div>
        <div className="mt-0.5 text-xs text-on-surface-variant">{sub}</div>
      </div>
      <Chip variant={chip.variant}>
        <Icon className="size-3.5" /> {chip.label}
      </Chip>
      <Button variant="outline" size="icon">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  accent,
  progress,
  footer,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: "primary" | "secondary" | "tertiary";
  progress?: number;
  footer: string;
}) {
  const accentClass = accent
    ? accent === "primary"
      ? "text-primary"
      : accent === "secondary"
        ? "text-secondary"
        : "text-tertiary"
    : "";
  return (
    <Card className="border-outline-variant/50 bg-surface-container">
      <CardHeader>
        <CardTitle className="font-[var(--font-headline)] text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`font-[var(--font-headline)] text-4xl font-bold leading-none tracking-tight ${accentClass}`}
        >
          {value}
          {suffix ? (
            <span className="ml-2 text-lg text-on-surface-variant">
              {suffix}
            </span>
          ) : null}
        </div>
        {progress !== undefined ? (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-container-highest">
            <span
              className="block h-full bg-gradient-to-r from-primary-dim to-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
        <div
          className={`mt-2 font-mono text-xs ${
            accent === "secondary" ? "text-secondary" : "text-on-surface-variant"
          }`}
        >
          {footer}
        </div>
      </CardContent>
    </Card>
  );
}

function Alert({
  variant,
  icon,
  title,
  message,
}: {
  variant: "success" | "info" | "warning" | "destructive";
  icon: React.ReactNode;
  title: string;
  message: string;
}) {
  const styles: Record<string, string> = {
    success: "border-secondary/40 bg-secondary/10 text-secondary",
    info: "border-primary/40 bg-primary/10 text-primary",
    warning: "border-tertiary/40 bg-tertiary/10 text-tertiary",
    destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  };
  return (
    <div
      className={`flex gap-3.5 rounded-xl border p-4 ${styles[variant]}`}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <div className="font-[var(--font-headline)] text-sm font-semibold text-foreground">
          {title}
        </div>
        <p className="mt-1 text-[13px] text-on-surface-variant">{message}</p>
      </div>
    </div>
  );
}

/* ------------------------------- EFFECTS ------------------------------- */
function SectionEffects() {
  return (
    <section className="py-16">
      <SectionHead num="08" title="Efeitos" lede="Sombras & profundidade" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Sombras sutis no tema escuro. Stadium para cards premium, glow-primary
        em CTAs.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <FxCard name="Shadow · sm" code="0 1px 3px" className="shadow-sm" />
        <FxCard name="Shadow · md" code="0 2px 4px -1px" className="shadow-md" />
        <FxCard name="Shadow · lg" code="0 4px 6px -1px" className="shadow-lg" />
        <FxCard name="Shadow · xl" code="0 8px 10px -1px" className="shadow-xl" />
        <FxCard
          name="Shadow · stadium"
          code="0 20px 40px -10px rgba(0,0,0,.5)"
          className="stadium-shadow"
        />
        <FxCard
          name="Glow · primary"
          code="0 10px 25px -5px rgba(149,170,255,.25)"
          className="shadow-[var(--shadow-glow-primary)] border-primary/50"
        />
      </div>

      <h3 className="mt-12 font-[var(--font-headline)] text-xl font-semibold">
        Gradientes de arena
      </h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="grid h-40 items-end rounded-xl bg-gradient-to-r from-primary-dim via-primary to-secondary p-4 text-[color:var(--on-primary)]">
          <div>
            <div className="font-[var(--font-headline)] text-[13px] font-bold uppercase tracking-[0.1em]">
              Text gradient
            </div>
            <div className="mt-1 font-mono text-[10px] opacity-60">
              primary → primary-dim → secondary
            </div>
          </div>
        </div>
        <div className="stadium-gradient grid h-40 items-end rounded-xl border border-outline-variant/50 bg-surface-container p-4">
          <div>
            <div className="font-[var(--font-headline)] text-[13px] font-bold uppercase tracking-[0.1em]">
              Stadium gradient
            </div>
            <div className="mt-1 font-mono text-[10px] text-on-surface-variant">
              radial · fundo de página
            </div>
          </div>
        </div>
        <div className="glass-card grid h-40 items-end rounded-xl border border-primary/25 p-4">
          <div>
            <div className="font-[var(--font-headline)] text-[13px] font-bold uppercase tracking-[0.1em]">
              Glass card
            </div>
            <div className="mt-1 font-mono text-[10px] text-on-surface-variant">
              blur(20px) · rgba(30,37,59,.4)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FxCard({
  name,
  code,
  className,
}: {
  name: string;
  code: string;
  className: string;
}) {
  return (
    <div
      className={`flex h-40 flex-col justify-between rounded-xl border border-outline-variant/40 bg-surface-container p-5 ${className}`}
    >
      <span className="font-[var(--font-headline)] text-[13px] font-bold uppercase tracking-[0.14em]">
        {name}
      </span>
      <span className="font-mono text-[11px] text-on-surface-variant">
        {code}
      </span>
    </div>
  );
}

/* --------------------------- SPACING / RADIUS --------------------------- */
function SectionSpacing() {
  const spaces = [
    { name: "1", px: 4 },
    { name: "2", px: 8 },
    { name: "3", px: 12 },
    { name: "4", px: 16 },
    { name: "6", px: 24 },
    { name: "8", px: 32 },
    { name: "12", px: 48 },
    { name: "16", px: 64 },
    { name: "24", px: 96 },
  ];
  const radii = [
    { l: "2 · sm", v: "2px" },
    { l: "6 · md", v: "6px" },
    { l: "0.475rem · base", v: "0.475rem" },
    { l: "12 · xl", v: "0.75rem" },
    { l: "16 · 2xl", v: "1rem" },
    { l: "pill", v: "9999px" },
  ];
  return (
    <section className="py-16">
      <SectionHead
        num="09"
        title="Espaçamento & Raios"
        lede="Ritmo & forma"
      />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Base 4px. Radius 0.475rem para inputs/botões; XL para cards.
      </p>

      <h3 className="mt-10 font-[var(--font-headline)] text-xl font-semibold">
        Espaçamento · base 4px
      </h3>
      <div className="mt-4 flex items-end gap-4 rounded-xl border border-outline-variant/50 bg-surface-container p-7">
        {spaces.map((s) => (
          <div key={s.name} className="flex flex-col items-start gap-2">
            <div
              className="rounded bg-primary"
              style={{ width: s.px, height: s.px }}
            />
            <span className="font-mono text-[11px] text-on-surface-variant">
              <b className="font-medium text-foreground">{s.name}</b> · {s.px}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-12 font-[var(--font-headline)] text-xl font-semibold">
        Raios
      </h3>
      <div className="mt-4 flex flex-wrap gap-4">
        {radii.map((r) => (
          <div
            key={r.l}
            className="grid size-28 place-items-center border border-primary/30 bg-surface-container-high font-mono text-[11px] text-on-surface-variant"
            style={{ borderRadius: r.v }}
          >
            {r.l}
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- VOICE --------------------------------- */
function SectionVoice() {
  const yes = [
    "Encontre quem tem as figurinhas que você precisa.",
    "Troca confirmada! Combine o encontro.",
    "3 matches perto de você, agora.",
    "Cole sua repetida e bora trocar.",
  ];
  const no = [
    "Solicitar intercâmbio de itens adesivos.",
    "Operação realizada com sucesso.",
    "Os usuários da sua região possuem...",
    "Emojis e gírias datadas (“top demais”, “sensacional”).",
  ];
  return (
    <section className="py-16">
      <SectionHead num="10" title="Voz & Tom" lede="Como a arena fala" />
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant">
        Português BR direto, informal sem ser infantil. Verbos imperativos
        amigáveis ("Troque", "Cole", "Encontre"). Sem jargão técnico.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <VoiceCard variant="yes" title="Usamos" items={yes} />
        <VoiceCard variant="no" title="Evitamos" items={no} />
      </div>
    </section>
  );
}

function VoiceCard({
  variant,
  title,
  items,
}: {
  variant: "yes" | "no";
  title: string;
  items: string[];
}) {
  const border =
    variant === "yes" ? "border-secondary/30" : "border-destructive/30";
  const accent =
    variant === "yes" ? "text-secondary" : "text-destructive";
  const Icon = variant === "yes" ? CheckCircle2 : XCircle;
  return (
    <div
      className={`rounded-xl border bg-surface-container p-6 ${border}`}
    >
      <div
        className={`mb-3 flex items-center gap-2 font-[var(--font-headline)] text-[11px] font-bold uppercase tracking-[0.2em] ${accent}`}
      >
        <Icon className="size-3.5" /> {title}
      </div>
      <ul className="flex flex-col gap-2.5 text-sm">
        {items.map((item) => (
          <li key={item} className="pl-4 before:mr-2.5 before:content-['·']">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- SHOWCASE ------------------------------- */
function SectionShowcase() {
  return (
    <section className="py-16">
      <SectionHead num="11" title="Aplicação" lede="Tudo junto no campo" />

      <div className="mt-10 rounded-3xl border border-outline-variant/50 bg-surface-container-low p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-primary/25 bg-surface-container p-8">
            <Badge variant="destaque" className="px-3 py-1.5">
              <Bolt className="size-3" /> Ao vivo na arena
            </Badge>
            <h3 className="mt-4 font-[var(--font-headline)] text-4xl font-bold leading-none tracking-tight lg:text-5xl">
              Encontre quem tem as figurinhas que{" "}
              <span className="text-primary">você precisa.</span>
            </h3>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-on-surface-variant">
              Troque perto de você com segurança, rapidez e conecte-se com
              outros colecionadores da Copa 2026.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="gradient">
                <Search className="size-4" /> BUSCAR MINHA CIDADE
              </Button>
              <Button variant="outline" size="lg">
                Como funciona
              </Button>
            </div>
            <div className="mt-7 flex gap-3">
              <HeroStat value="4.2M" label="Trocas" accent="primary" />
              <HeroStat value="98%" label="Seguras" accent="secondary" />
              <HeroStat value="5min" label="Match médio" accent="tertiary" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Card className="border-primary/30 bg-surface-container">
              <CardHeader>
                <CardTitle className="font-[var(--font-headline)] text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
                  Próximos a você
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-[var(--font-headline)] text-4xl font-bold leading-none text-primary">
                  12
                </div>
                <div className="mt-1 font-mono text-xs text-on-surface-variant">
                  Em São Paulo, Pinheiros
                </div>
              </CardContent>
            </Card>
            <StickerCard
              tag="Disponível"
              crest="AR"
              num="118"
              team="Messi · 10"
              variant="dupe"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: "primary" | "secondary" | "tertiary";
}) {
  const accentClass =
    accent === "primary"
      ? "text-primary"
      : accent === "secondary"
        ? "text-secondary"
        : "text-tertiary";
  return (
    <div className="flex-1 rounded-xl border border-outline-variant/50 bg-surface-container-high p-4">
      <div
        className={`font-[var(--font-headline)] text-2xl font-bold ${accentClass}`}
      >
        {value}
      </div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant">
        {label}
      </div>
    </div>
  );
}

/* --------------------------------- FOOTER --------------------------------- */
function Footer() {
  return (
    <footer className="mt-24 flex flex-col items-center justify-between gap-3 border-t border-outline-variant/40 py-10 font-mono text-[11px] uppercase tracking-[0.14em] text-on-surface-variant sm:flex-row">
      <span>Figurinha Fácil · Styleguide v1.0</span>
      <span className="text-primary">Arena · Troca · Match</span>
      <span>MD3 Dark</span>
    </footer>
  );
}
