"use client";

interface RarityCardProps {
  rank: number;
  title: string;
  tags?: string[];
  price?: string;
}

export function RarityCard({ rank, title, tags, price }: RarityCardProps) {
  return (
    <figure className="grid grid-cols-[auto_1fr_auto] gap-5 p-5 rounded-2xl bg-surface-container border border-white/5 my-6 items-center max-sm:grid-cols-[auto_1fr]">
      <span className="w-14 h-[4.5rem] rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 grid place-items-center font-headline font-extrabold text-2xl text-amber-950 shadow-lg shadow-amber-500/25">
        {String(rank).padStart(2, "0")}
      </span>
      <div>
        <h4 className="font-headline font-bold text-lg">{title}</h4>
        {tags && tags.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {price && (
        <div className="text-right max-sm:col-span-full max-sm:text-left max-sm:pt-2.5 max-sm:border-t max-sm:border-white/5">
          <span className="font-headline font-bold text-xl text-secondary tracking-tight">
            {price}
          </span>
          <span className="block text-xs text-muted-foreground uppercase tracking-widest">
            valor médio
          </span>
        </div>
      )}
    </figure>
  );
}
