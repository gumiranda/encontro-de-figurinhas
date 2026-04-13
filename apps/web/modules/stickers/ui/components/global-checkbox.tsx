"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";

type GlobalCheckboxProps = {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  hint: string;
  currentCount: number;
  totalStickers: number;
};

export function GlobalCheckbox({
  id = "select-all",
  checked,
  onCheckedChange,
  label,
  hint,
  currentCount,
  totalStickers,
}: GlobalCheckboxProps) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
        <div className="flex items-center gap-3">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={(v) => onCheckedChange(v === true)}
            className="h-5 w-5"
          />
          <label
            htmlFor={id}
            className="text-sm font-bold text-on-surface cursor-pointer"
          >
            {label}
          </label>
        </div>
        <span className="text-xs text-on-surface-variant">
          {currentCount}/{totalStickers}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant mt-2 px-1">{hint}</p>
    </section>
  );
}
