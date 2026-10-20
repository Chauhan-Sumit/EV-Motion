"use client";

import Link from "next/link";
import { ArrowRight, Check, Heart } from "lucide-react";
import { cardSubline, launchLabel, priceText } from "@/lib/cars-listing/copy";
import { paintForColors, swatchFor, tintForColors } from "@/lib/cars-listing/paint";
import type { PricedCar } from "@/lib/cars-listing/types";
import { useCarsListing } from "@/components/vehicles/cars-listing/ListingContext";
import { ListingCarArt } from "@/components/vehicles/cars-listing/ListingCarArt";
import { SHADOW_1 } from "@/components/vehicles/cars-listing/ui";
import { cn } from "@/lib/utils";

const BADGE = "absolute left-2 top-2 z-[2] inline-flex h-5 items-center rounded-md px-2 text-[10.5px] font-[650]";

/**
 * A brand page's car tile — the Electric Cars listing card's grid layout at a
 * smaller scale, so a brand's whole line-up reads at a glance. Same data, same
 * badges, same compare and shortlist state (the listing's context); the
 * listing's own `ListingCard` is left as it is for `/cars`.
 */
export function BrandCarCard({ car }: { car: PricedCar }) {
  const { picks, togglePick, saved, toggleSaved, badges } = useCarsListing();
  const picked = picks.includes(car.slug);
  const isSaved = saved.includes(car.slug);
  const href = `/cars/${car.slug}`;
  const superlative = badges.get(car.slug);

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-[14px] border border-border bg-surface transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5 hover:border-[#D6DADF] hover:shadow-[0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)]",
        picked && "border-primary shadow-[0_0_0_1px_var(--primary)] hover:border-primary",
      )}
    >
      {/* art */}
      <div className="relative isolate flex aspect-[16/8.5] items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#F2F4F7_0%,#F8F9FB_58%,#ECEFF3_58.2%,#F4F6F8_100%)] px-6 pb-1">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: `radial-gradient(55% 45% at 50% 58%,rgba(255,255,255,.95),transparent 70%),radial-gradient(70% 40% at 50% 62%,${tintForColors(car.colors)},transparent 70%)` }}
        />
        {car.status === "upcoming" ? (
          <span className={cn(BADGE, "bg-[#F5B83D] text-[#3A2604]")}>Upcoming · {launchLabel(car.launchDate)}</span>
        ) : car.status === "just-launched" ? (
          <span className={cn(BADGE, "bg-primary-hover text-white")}>Just launched</span>
        ) : superlative ? (
          <span className={cn(BADGE, "bg-ink text-white")}>{superlative}</span>
        ) : null}
        <button
          type="button"
          onClick={() => toggleSaved(car.slug, car.name)}
          aria-pressed={isSaved}
          aria-label={`${isSaved ? "Remove" : "Save"} ${car.name}`}
          className={cn("absolute right-1.5 top-1.5 z-[2] grid size-7 place-items-center rounded-full bg-white/90 text-ink-secondary transition-colors hover:text-[#E5484D] aria-pressed:text-[#E5484D] focus-ring", SHADOW_1)}
        >
          <Heart className="size-3.5" fill={isSaved ? "currentColor" : "none"} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <ListingCarArt dims={car.art} body={car.body} paint={paintForColors(car.colors)} frame={{ lengthMm: 4400, heightMm: 1900 }} reflect alt={`${car.name} illustration`} className="max-w-[300px]" />
        {car.colors.length ? (
          <span className="absolute bottom-1.5 left-2 z-[2] flex items-center gap-[3px] text-[10px] text-ink-muted" title={car.colors.join(", ")}>
            {car.colors.slice(0, 4).map((name) => (
              <i key={name} className="size-[9px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12),0_0_0_1.5px_#fff]" style={{ background: swatchFor(name) }} />
            ))}
            {car.colors.length > 4 ? `+${car.colors.length - 4}` : null}
            <span className="sr-only">{car.colors.length} colours: {car.colors.join(", ")}</span>
          </span>
        ) : null}
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col px-3.5 pt-3">
        <h3 className="text-[16px] font-bold leading-[1.2] tracking-[-.02em]">
          <Link href={href} className="text-ink hover:text-primary-hover hover:no-underline focus-ring">
            {car.name}
          </Link>
        </h3>
        <div className="mt-1 text-[15px] font-bold tabular-nums tracking-[-.015em]">{priceText(car.price)}</div>
        <div className="mb-2.5 mt-px truncate text-[11.5px] text-ink-muted">{cardSubline(car)}</div>
        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#EEF0F3] pt-2.5">
          <Spec value={String(car.rangeKm)} unit="km" label="Range" />
          <Spec value={car.dcMin !== null ? String(car.dcMin) : null} unit="min" label="DC 10–80%" />
          <Spec value={String(Math.round(car.batteryKwh * 10) / 10)} unit="kWh" label="Battery" />
        </div>
      </div>

      {/* actions */}
      <div className="flex items-center justify-between gap-2 px-3.5 pb-3.5 pt-3">
        <label className="inline-flex cursor-pointer select-none items-center gap-1.5 text-[12.5px] font-medium text-ink-secondary">
          <input type="checkbox" checked={picked} onChange={() => togglePick(car.slug)} data-pick={car.slug} className="peer sr-only" />
          <span
            aria-hidden="true"
            className="grid size-4 flex-none place-items-center rounded-[4px] border-[1.5px] border-[#BCC2CA] bg-white text-white peer-checked:border-primary-hover peer-checked:bg-primary-hover peer-focus-visible:outline peer-focus-visible:outline-[2.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
          >
            {picked ? <Check className="size-2.5" strokeWidth={3.6} /> : null}
          </span>
          <span>{picked ? "Added to compare" : "Add to compare"}</span>
        </label>
        <Link
          href={href}
          className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-lg bg-primary-hover px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0B6629] hover:no-underline focus-ring"
        >
          View details <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function Spec({ value, unit, label }: { value: string | null; unit: string; label: string }) {
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
