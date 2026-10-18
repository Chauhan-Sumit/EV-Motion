"use client";

import { ChevronDown, Crown, Pencil, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPriceLakh, formatPriceRangeLakh } from "@/lib/utils";
import type { ShowroomVehicle } from "@/lib/compare/showroom/metrics";
import type { VehiclePricingSnapshot } from "@/lib/vehicle-pricing";
import { cn } from "@/lib/utils";
import { showroomText } from "./fonts";
import { btn, DISPLAY, Dot, TEXT, WinRing } from "./ui";
import { artOf, ShowroomCar } from "./ShowroomCar";

const VS_BADGE = cn(
  DISPLAY,
  "absolute -left-[22px] top-24 z-[3] hidden size-[30px] place-items-center rounded-full border border-white/10 bg-[#0C0E12] text-[11px] font-black text-slate-400 font-stretch-[70%] min-[68.75rem]:grid",
);

export function VehicleSlot({
  v,
  pricing,
  isLead,
  wins,
  rankable,
  canRemove,
  onChange,
  onRemove,
}: {
  v: ShowroomVehicle;
  pricing: VehiclePricingSnapshot;
  isLead: boolean;
  wins: number;
  rankable: number;
  canRemove: boolean;
  onChange: () => void;
  onRemove: () => void;
}) {
  const d = v.detail;
  const [lo, hi] = pricing.exShowroomRangeLakh;
  const starting = d.variants[0];

  return (
    <article
      aria-label={`${d.brand} ${d.name}`}
      className={cn(
        "relative flex min-w-0 flex-col gap-1.5 rounded-2xl border border-white/[.09] bg-[linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.015))] px-2.5 pb-3 pt-[11px] md:gap-2 md:rounded-[20px] md:px-3.5 md:pb-4 md:pt-3.5",
        isLead && "border-primary-bright/55 shadow-[inset_0_0_0_1px_rgba(37,212,74,.18)]",
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-55"
        style={{ background: `radial-gradient(70% 45% at 50% 30%, ${v.color.halo}, transparent 70%)` }}
      />
      {v.index > 0 ? <span className={VS_BADGE} aria-hidden="true">VS</span> : null}

      <div className="relative flex min-h-6 items-center gap-1.5 md:min-h-7">
        <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-[9.5px] font-semibold uppercase tracking-[.08em] text-slate-400 md:text-[11px] md:tracking-[.12em]">
          <Dot color={v.color} />
          <span className="truncate">{d.brand}</span>
        </span>
        {isLead ? (
          <span className="hidden h-6 flex-none items-center gap-1.5 rounded-xl bg-primary px-[9px] text-[11px] font-bold text-[#04140A] md:inline-flex">
            <Crown className="size-[11px]" strokeWidth={2.6} aria-hidden="true" />
            Leads
          </span>
        ) : null}
        <button type="button" onClick={onChange} aria-label={`Change ${d.name}`} className="grid size-[26px] flex-none place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-[#4A505A] hover:text-white focus-ring md:size-7">
          <Pencil className="size-[13px]" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          title={canRemove ? undefined : "Compare at least 2"}
          aria-label={`Remove ${d.name}`}
          className="grid size-[26px] flex-none place-items-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-[#4A505A] hover:text-white focus-ring disabled:cursor-not-allowed disabled:opacity-30 md:size-7"
        >
          <X className="size-[13px]" strokeWidth={2.4} aria-hidden="true" />
        </button>
      </div>

      <div className="relative -mx-1.5 -mb-1">
        <ShowroomCar vehicle={artOf(d.sourceVehicle)} paint={v.color.paint} alt={`Illustration of the ${d.brand} ${d.name}`} />
      </div>

      <div className="relative flex min-w-0 items-center justify-between gap-2">
        <h2 className={cn(DISPLAY, "min-w-0 flex-1 truncate text-[17px] font-extrabold leading-[1.1] tracking-[-.015em] font-stretch-[88%] md:text-[22px]")}>{d.name}</h2>
        <span className="hidden flex-none items-center gap-[5px] whitespace-nowrap text-[11.5px] text-slate-400 md:inline-flex" title={`Best figure on ${wins} of ${rankable} comparable specs`}>
          <WinRing wins={wins} of={rankable} color={v.color.glow} size="sm" />/{rankable} wins
        </span>
      </div>

      <Popover>
        <PopoverTrigger
          className="relative inline-flex h-[26px] max-w-full items-center gap-2.5 self-start overflow-hidden whitespace-nowrap rounded-lg border border-white/10 bg-white/[.06] px-[7px] text-[10.5px] text-slate-200 transition-colors hover:bg-white/10 focus-ring md:h-[30px] md:px-2.5 md:text-xs"
        >
          Starting variant
          {starting ? <span className="hidden text-slate-400 md:inline">· {starting.batteryKwh} kWh</span> : null}
          <ChevronDown className="size-[11px]" strokeWidth={2.5} aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="start" className={cn(showroomText.variable, TEXT, "w-72 gap-1 rounded-2xl p-2")}>
          <p className="px-2 pb-1 pt-1.5 text-xs text-ink-muted">
            {d.variants.length} variant{d.variants.length === 1 ? "" : "s"} · prices here are for the starting variant; specs are the model’s headline published figures
          </p>
          <ul className="flex flex-col">
            {d.variants.map((variant, i) => (
              <li key={variant.id} className={cn("flex items-center justify-between gap-3 rounded-xl px-2 py-2 text-[13px]", i === 0 && "bg-surface-secondary")}>
                <span className="min-w-0 truncate font-semibold text-ink">{variant.name}</span>
                <span className="flex-none tabular-nums text-ink-muted">
                  {variant.batteryKwh} kWh · {variant.rangeKm} km
                </span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <div className="relative grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-white/[.08] md:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-px bg-[rgba(10,12,15,.85)] px-2 py-1.5 md:px-2.5 md:py-2">
          <span className="text-[10.5px] uppercase tracking-[.06em] text-slate-400">Ex-showroom</span>
          <b className={cn(DISPLAY, "truncate text-sm font-bold tabular-nums text-white font-stretch-[86%] md:text-[15.5px]")}>{formatPriceRangeLakh(lo, hi, "–")}</b>
        </div>
        <div className="flex min-w-0 flex-col gap-px bg-[rgba(10,12,15,.85)] px-2 py-1.5 md:px-2.5 md:py-2">
          <span className="text-[10.5px] uppercase tracking-[.06em] text-slate-400">On-road</span>
          <b className={cn(DISPLAY, "truncate text-sm font-bold tabular-nums text-white font-stretch-[86%] md:text-[15.5px]")}>{formatPriceLakh(v.onRoad / 100000)}</b>
        </div>
      </div>

      <a href="#offers" className={cn(btn.base, btn.brand, "relative mt-0.5 h-9 px-2 text-[12.5px] md:px-3.5 md:text-[13.5px]")}>
        Get best offer
      </a>
    </article>
  );
}

export function EmptySlot({ index, count, onAdd, max }: { index: number; count: number; onAdd: () => void; max: number }) {
  const first = index === count;
  const odd = count % 2 === 1;
  return (
    <button
      type="button"
      onClick={onAdd}
      className={cn(
        "relative flex items-center justify-center gap-3 rounded-2xl border border-dashed border-[#363B44] text-center text-[13.5px] text-slate-400 transition-colors hover:border-primary-bright hover:text-white focus-ring md:min-h-[120px] md:flex-col md:gap-2.5 md:rounded-[20px] md:text-sm min-[68.75rem]:min-h-0",
        odd ? "flex-col" : "col-span-2 min-h-[58px] flex-row md:col-span-1",
        !first && "hidden md:flex",
      )}
    >
      {index > 0 ? <span className={VS_BADGE} aria-hidden="true">VS</span> : null}
      <span className="grid size-[34px] place-items-center rounded-full border border-[#3A404A] text-white md:size-[46px]">
        <Plus className="size-5" aria-hidden="true" />
      </span>
      <b className="font-semibold">Add a vehicle</b>
      <small className={cn("max-w-[180px] text-xs text-[#7E848E]", odd ? "block" : "hidden md:block")}>
        {first ? `Compare up to ${max} side by side` : `Slot ${index + 1} of ${max}`}
      </small>
    </button>
  );
}
