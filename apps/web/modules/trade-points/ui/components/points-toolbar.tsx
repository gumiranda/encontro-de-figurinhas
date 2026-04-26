"use client";

import { ArrowUpDown, Grid3x3, List, Map, Search } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

export type FilterTab = "all" | "live" | "frequent" | "favorites";
export type SortKey = "active" | "recent" | "score" | "joined";
export type LayoutMode = "grid" | "list";

type Counts = Record<FilterTab, number>;

const SORT_LABELS: Record<SortKey, string> = {
  active: "Mais ativos",
  recent: "Atividade recente",
  score: "Maior score",
  joined: "Mais novos",
};

type PointsToolbarProps = {
  tab: FilterTab;
  q: string;
  sort: SortKey;
  layout: LayoutMode;
  counts: Counts;
  onTabChange: (tab: FilterTab) => void;
  onSearchChange: (q: string) => void;
  onSortChange: (sort: SortKey) => void;
  onLayoutChange: (layout: LayoutMode) => void;
};

export function PointsToolbar({
  tab,
  q,
  sort,
  layout,
  counts,
  onTabChange,
  onSearchChange,
  onSortChange,
  onLayoutChange,
}: PointsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs
        value={tab}
        onValueChange={(v) => onTabChange(v as FilterTab)}
        className="w-auto"
      >
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            Todos
            <CountPill value={counts.all} />
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-2">
            Ativos agora
            <CountPill value={counts.live} accent="success" />
          </TabsTrigger>
          <TabsTrigger value="frequent" className="gap-2">
            Frequentes
            <CountPill value={counts.frequent} />
          </TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline" aria-hidden />
        <Input
          value={q}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar ponto..."
          className="pl-9"
          maxLength={100}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowUpDown className="size-3.5" aria-hidden />
            {SORT_LABELS[sort]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onSortChange(key)}
              className={cn(sort === key && "bg-accent")}
            >
              {SORT_LABELS[key]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="ml-auto flex gap-0.5 rounded-lg border border-outline-variant/10 bg-surface-container p-0.5">
        <LayoutBtn
          active={layout === "grid"}
          onClick={() => onLayoutChange("grid")}
          aria-label="Visão em grade"
        >
          <Grid3x3 className="size-4" />
        </LayoutBtn>
        <LayoutBtn
          active={layout === "list"}
          onClick={() => onLayoutChange("list")}
          aria-label="Visão em lista"
        >
          <List className="size-4" />
        </LayoutBtn>
        <LayoutBtn
          asLink
          href="/map"
          active={false}
          aria-label="Ver no mapa"
        >
          <Map className="size-4" />
        </LayoutBtn>
      </div>
    </div>
  );
}

function CountPill({
  value,
  accent,
}: {
  value: number;
  accent?: "success";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 font-mono text-[0.62rem] font-bold tabular-nums",
        accent === "success"
          ? "bg-secondary text-secondary-foreground"
          : "bg-surface-container-highest text-on-surface-variant"
      )}
    >
      {value}
    </span>
  );
}

type LayoutBtnProps = {
  active: boolean;
  onClick?: () => void;
  asLink?: boolean;
  href?: string;
  children: React.ReactNode;
  "aria-label": string;
};

function LayoutBtn({
  active,
  onClick,
  asLink,
  href,
  children,
  ...rest
}: LayoutBtnProps) {
  const className = cn(
    "grid size-7 place-items-center rounded-md text-on-surface-variant transition-colors hover:text-on-surface",
    active && "bg-surface-container-high text-on-surface"
  );
  if (asLink && href) {
    return (
      <a className={className} href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
