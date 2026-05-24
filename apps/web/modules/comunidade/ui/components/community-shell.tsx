"use client";

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

export type CommunityTab = "profile" | "public" | "feed";

const TABS: { id: CommunityTab; label: string }[] = [
  { id: "profile", label: "Meu perfil" },
  { id: "public", label: "Público" },
  { id: "feed", label: "Feed" },
];

type CommunityShellProps = {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
  children: React.ReactNode;
};

export function CommunityShell({
  activeTab,
  onTabChange,
  children,
}: CommunityShellProps) {
  return (
    <section className="mx-auto min-h-[720px] w-full max-w-[430px] overflow-hidden rounded-[2rem] border border-outline-variant/80 bg-[#070c1a] shadow-[0_24px_80px_rgba(0,0,0,0.45)] lg:max-w-[760px] xl:max-w-[840px]">
      <div className="border-b border-outline-variant/70 bg-[#070c1a] p-4 lg:p-5">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as CommunityTab)}
          className="w-full"
        >
          <TabsList className="grid h-14 w-full grid-cols-3 rounded-2xl border border-outline-variant/80 bg-surface-container-high p-1.5">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="h-full rounded-xl text-base font-bold text-muted-foreground transition-colors data-[state=active]:bg-[#e4e7fb] data-[state=active]:text-background"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {children}
    </section>
  );
}
