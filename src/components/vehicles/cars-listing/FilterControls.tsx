"use client";

import type { ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** A collapsible filter group: title, the current selection in green, and a chevron. */
export function FilterGroup({ title, value, defaultOpen = false, children }: { title: string; value?: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details open={defaultOpen} className="group border-b border-[#EEF0F3] px-5 last-of-type:border-b-0">
      <summary className="flex min-h-[54px] cursor-pointer list-none items-center justify-between gap-2.5 text-[14.5px] font-semibold focus-ring [&::-webkit-details-marker]:hidden">
        {title}
        {value ? <em className="ml-auto max-w-[140px] truncate text-[12.5px] font-medium not-italic text-primary-hover">{value}</em> : <span className="ml-auto" />}
        <ChevronDown className="size-3.5 flex-none text-ink-muted transition-transform duration-[250ms] ease-[cubic-bezier(.2,.7,.2,1)] group-open:rotate-180" strokeWidth={2.4} aria-hidden="true" />
      </summary>
      <div className="pb-[18px]">{children}</div>
    </details>
  );
}

/**
 * One checkbox or radio row with its result count. The native input stays in
 * the accessibility tree (visually hidden); the box beside it is its styled
 * face. A row whose option would return nothing is dimmed, not disabled, so it
 * can still be cleared.
 */
export function OptionRow({
  type,
  name,
  label,
  checked,
  count,
  onChange,
}: {
  type: "checkbox" | "radio";
  name: string;
  label: string;
  checked: boolean;
  count: number;
  onChange: () => void;
}) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-ink-secondary hover:text-ink", !count && !checked && "opacity-45")}>
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          "grid size-[18px] flex-none place-items-center border-[1.5px] border-[#BCC2CA] bg-white text-white transition-colors peer-checked:border-primary-hover peer-checked:bg-primary-hover peer-focus-visible:outline-[2.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-focus-visible:outline",
          type === "radio" ? "rounded-full" : "rounded-[5px]",
        )}
      >
        {checked ? type === "radio" ? <span className="size-[7px] rounded-full bg-white" /> : <Check className="size-3" strokeWidth={3.4} /> : null}
      </span>
      {label}
      <em className="ml-auto text-[12.5px] not-italic tabular-nums text-ink-muted">{count}</em>
    </label>
  );
}

/** An on/off switch row. */
export function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2.5 py-1.5 text-sm text-ink-secondary">
      {label}
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="relative m-0 h-[22px] w-[38px] flex-none cursor-pointer appearance-none rounded-full bg-[#CDD2D8] transition-colors duration-200 after:absolute after:left-[3px] after:top-[3px] after:size-4 after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,.2)] after:transition-[left] after:duration-200 after:content-[''] checked:bg-primary-hover checked:after:left-[19px] focus-ring"
      />
    </label>
  );
}
