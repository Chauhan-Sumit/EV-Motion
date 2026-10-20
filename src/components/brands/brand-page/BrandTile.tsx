"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Check, Heart } from "lucide-react";
import { launchLabel, priceText } from "@/lib/cars-listing/copy";
import { swatchFor, tintForColors } from "@/lib/cars-listing/paint";
import { SHADOW_1 } from "@/components/vehicles/cars-listing/ui";
import { cn } from "@/lib/utils";

const BADGE = "absolute left-2 top-2 z-[2] inline-flex h-5 items-center rounded-md px-2 text-[10.5px] font-[650]";

export interface TileSpec {
  /** `null` when the record does not publish the figure — shown as "—". */
  value: string | null;
  unit: string;
  label: string;
}

export interface BrandTileProps {
  slug: string;
  name: string;
  href: string;
  price: [number, number];
  subline: string;
  status: string;
  launchDate: string | null;
  /** Superlative badge, when the model holds one. */
  badge: string | undefined;
  colors: string[];
  /** The model's drawing, with its own accessible label. */
  art: ReactNode;
  specs: readonly [TileSpec, TileSpec, TileSpec];
  picked: boolean;
  onTogglePick: () => void;
  saved: boolean;
  onToggleSaved: () => void;
}

/**
 * A brand page's model tile — the listings' grid card at a smaller scale, so
 * a brand's whole line-up reads at a glance: drawing, name, city price, three
 * key figures, View details and Add to compare. Kind-agnostic; `BrandCarCard`
 * and `BrandBikeCard` fill it from each listing's data.
 */
export function BrandTile(p: BrandTileProps) {
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[14px] border border-border bg-surface transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5 hover:border-[#D6DADF] hover:shadow-[0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)]",
        p.picked && "border-primary shadow-[0_0_0_1px_var(--primary)] hover:border-primary",
      )}
    >
      {/* art */}
      <div className="relative isolate flex aspect-[16/8.5] items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#F2F4F7_0%,#F8F9FB_58%,#ECEFF3_58.2%,#F4F6F8_100%)] px-6 pb-1">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: `radial-gradient(55% 45% at 50% 58%,rgba(255,255,255,.95),transparent 70%),radial-gradient(70% 40% at 50% 62%,${tintForColors(p.colors)},transparent 70%)` }}
        />
        {p.status === "upcoming" ? (
          <span className={cn(BADGE, "bg-[#F5B83D] text-[#3A2604]")}>Upcoming · {launchLabel(p.launchDate)}</span>
        ) : p.status === "just-launched" ? (
          <span className={cn(BADGE, "bg-primary-hover text-white")}>Just launched</span>
        ) : p.badge ? (
          <span className={cn(BADGE, "bg-ink text-white")}>{p.badge}</span>
        ) : null}
        <button
          type="button"
          onClick={p.onToggleSaved}
          aria-pressed={p.saved}
          aria-label={`${p.saved ? "Remove" : "Save"} ${p.name}`}
          className={cn("absolute right-1.5 top-1.5 z-[2] grid size-7 place-items-center rounded-full bg-white/90 text-ink-secondary transition-colors hover:text-[#E5484D] aria-pressed:text-[#E5484D] focus-ring", SHADOW_1)}
        >
          <Heart className="size-3.5" fill={p.saved ? "currentColor" : "none"} strokeWidth={2.2} aria-hidden="true" />
        </button>
        {p.art}
        {p.colors.length ? (
          <span className="absolute bottom-1.5 left-2 z-[2] flex items-center gap-[3px] text-[10px] text-ink-muted" title={p.colors.join(", ")}>
            {p.colors.slice(0, 4).map((name) => (
              <i key={name} className="size-[9px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12),0_0_0_1.5px_#fff]" style={{ background: swatchFor(name) }} />
            ))}
            {p.colors.length > 4 ? `+${p.colors.length - 4}` : null}
            <span className="sr-only">{p.colors.length} colours: {p.colors.join(", ")}</span>
          </span>
        ) : null}
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col px-3.5 pt-3">
        <h3 className="text-[16px] font-bold leading-[1.2] tracking-[-.02em]">
          <Link href={p.href} className="text-ink hover:text-primary-hover hover:no-underline focus-ring">
            {p.name}
          </Link>
        </h3>
        <div className="mt-1 text-[15px] font-bold tabular-nums tracking-[-.015em]">{priceText(p.price)}</div>
        <div className="mb-2.5 mt-px truncate text-[11.5px] text-ink-muted">{p.subline}</div>
        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#EEF0F3] pt-2.5">
          {p.specs.map((s) => (
            <Spec key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center justify-between gap-2 px-3.5 pb-3.5 pt-3">
        <label className="inline-flex cursor-pointer select-none items-center gap-1.5 text-[12.5px] font-medium text-ink-secondary">
          <input type="checkbox" checked={p.picked} onChange={p.onTogglePick} data-pick={p.slug} className="peer sr-only" />
          <span
            aria-hidden="true"
            className="grid size-4 flex-none place-items-center rounded-[4px] border-[1.5px] border-[#BCC2CA] bg-white text-white peer-checked:border-primary-hover peer-checked:bg-primary-hover peer-focus-visible:outline peer-focus-visible:outline-[2.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
          >
            {p.picked ? <Check className="size-2.5" strokeWidth={3.6} /> : null}
          </span>
          <span>{p.picked ? "Added to compare" : "Add to compare"}</span>
        </label>
        <Link
          href={p.href}
          className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-lg bg-primary-hover px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0B6629] hover:no-underline focus-ring"
        >
          View details <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function Spec({ value, unit, label }: TileSpec) {
  return (
    <div className="min-w-0">
      <b className="block whitespace-nowrap text-[13px] font-bold tabular-nums">
        {value ?? <span className="font-medium text-ink-muted">—</span>}
        {value ? <small className="ml-0.5 text-[11px] font-medium text-ink-muted">{unit}</small> : <span className="sr-only">Not published</span>}
      </b>
      <span className="block truncate text-[10.5px] text-ink-muted">{label}</span>
    </div>
  );
}
