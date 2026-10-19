"use client";

import Link from "next/link";
import { ArrowRight, Check, Gauge, Heart, PlugZap, Route, Tag } from "lucide-react";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import { btn, SHADOW_1 } from "@/components/vehicles/cars-listing/ui";
import { cardSubline, launchLabel, priceText } from "@/lib/two-wheelers-listing/copy";
import { swatchFor, tintForColors } from "@/lib/cars-listing/paint";
import type { ViewMode } from "@/lib/two-wheelers-listing/filters";
import type { PricedBike } from "@/lib/two-wheelers-listing/types";
import { cn } from "@/lib/utils";
import { useBikesListing } from "./ListingContext";
import { BikeArt } from "./BikeArt";

const BADGE = "absolute left-2.5 top-2.5 z-[2] inline-flex h-6 items-center gap-[5px] rounded-[7px] px-[9px] text-[11.5px] font-[650]";

/**
 * One two-wheeler in the results — the Electric Cars card's layout (wide list
 * row or grid tile, stacked on phones) with two-wheeler specs: claimed range,
 * top speed and home-charging time, and the battery size where the car card
 * shows its safety rating.
 */
export function BikeCard({ bike, view }: { bike: PricedBike; view: ViewMode }) {
  const { picks, togglePick, saved, toggleSaved, badges, cityName } = useBikesListing();
  const picked = picks.includes(bike.slug);
  const isSaved = saved.includes(bike.slug);
  const grid = view === "grid";
  const href = `/two-wheelers/${bike.slug}`;
  const superlative = badges.get(bike.slug);

  return (
    <article
      className={cn(
        "relative grid rounded-[18px] border border-border bg-surface transition-[box-shadow,border-color,transform] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:border-[#D6DADF] hover:shadow-[0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)]",
        grid
          ? "grid-cols-1 gap-0 overflow-hidden p-0 hover:-translate-y-[3px]"
          : "grid-cols-[300px_minmax(0,1fr)_196px] gap-[22px] p-3 max-[1240px]:grid-cols-[250px_minmax(0,1fr)_180px] max-[1240px]:gap-[18px]",
        "max-[760px]:grid-cols-1 max-[760px]:gap-0 max-[760px]:overflow-hidden max-[760px]:p-0 max-[760px]:hover:translate-y-0",
        picked && "border-primary shadow-[0_0_0_1px_var(--primary)] hover:border-primary",
      )}
    >
      {/* art */}
      <div
        className={cn(
          "relative isolate flex items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#F2F4F7_0%,#F8F9FB_58%,#ECEFF3_58.2%,#F4F6F8_100%)] px-6 pb-1.5",
          grid ? "aspect-[16/10] min-h-0 rounded-none" : "min-h-[180px] rounded-[14px]",
          "max-[760px]:aspect-[16/9.4] max-[760px]:min-h-0 max-[760px]:rounded-none max-[760px]:px-10",
        )}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: `radial-gradient(55% 45% at 50% 58%,rgba(255,255,255,.95),transparent 70%),radial-gradient(70% 40% at 50% 62%,${tintForColors(bike.colors)},transparent 70%)` }}
        />
        {bike.status === "upcoming" ? (
          <span className={cn(BADGE, "bg-[#F5B83D] text-[#3A2604]")}>Upcoming · {launchLabel(bike.launchDate)}</span>
        ) : bike.status === "just-launched" ? (
          <span className={cn(BADGE, "bg-primary-hover text-white")}>Just launched</span>
        ) : superlative ? (
          <span className={cn(BADGE, "bg-ink text-white")}>{superlative}</span>
        ) : null}
        <button
          type="button"
          onClick={() => toggleSaved(bike.slug, bike.name)}
          aria-pressed={isSaved}
          aria-label={`${isSaved ? "Remove" : "Save"} ${bike.name}`}
          className={cn("absolute right-2 top-2 z-[2] grid size-[34px] place-items-center rounded-full bg-white/90 text-ink-secondary transition-colors hover:text-[#E5484D] aria-pressed:text-[#E5484D] focus-ring", SHADOW_1)}
        >
          <Heart className="size-full" fill={isSaved ? "currentColor" : "none"} strokeWidth={2} aria-hidden="true" />
        </button>
        <BikeArt type={bike.type} color={swatchFor(bike.colors[0])} reflect alt={`${bike.name} illustration`} className="max-w-[330px]" />
        {bike.colors.length ? (
          <span className="absolute bottom-[9px] left-2.5 z-[2] flex items-center gap-1 text-[11px] text-ink-muted" title={bike.colors.join(", ")}>
            {bike.colors.slice(0, 4).map((name) => (
              <i key={name} className="size-[11px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12),0_0_0_1.5px_#fff]" style={{ background: swatchFor(name) }} />
            ))}
            {bike.colors.length > 4 ? `+${bike.colors.length - 4}` : null}
            <span className="sr-only">
              {bike.colors.length} colours: {bike.colors.join(", ")}
            </span>
          </span>
        ) : null}
      </div>

      {/* details */}
      <div className={cn("flex min-w-0 flex-col", grid ? "px-[18px] pt-4" : "pb-1 pt-1.5", "max-[760px]:px-4 max-[760px]:pb-0 max-[760px]:pt-3.5")}>
        <div className="flex items-start justify-between gap-3.5">
          <div className="min-w-0">
            <h3 className="text-[21px] font-bold leading-[1.15] tracking-[-.03em] max-[760px]:text-xl">
              <Link href={href} className="text-ink hover:text-primary-hover hover:no-underline focus-ring">
                {bike.name}
              </Link>
            </h3>
            <div className="mt-1.5 text-[19px] font-bold tabular-nums tracking-[-.02em] max-[760px]:text-lg">{priceText(bike.price)}</div>
            <div className="mt-px text-[12.5px] text-ink-muted">{cardSubline(bike)}</div>
          </div>
          {!grid ? (
            <div className="flex flex-none flex-col items-end gap-0.5 text-right">
              <b className="text-[15px] font-bold tabular-nums">
                {Math.round(bike.batteryKwh * 100) / 100}
                <small className="ml-0.5 text-xs font-medium text-ink-muted">kWh</small>
              </b>
              <small className="whitespace-nowrap text-[11.5px] text-ink-muted">Battery</small>
            </div>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-1 text-[13.5px] text-ink-muted">{bike.tagline}</p>
        <div
          className={cn(
            "mt-auto grid grid-cols-3 gap-3 border-t border-[#EEF0F3] pt-3.5",
            grid ? "mt-3.5" : "max-[1240px]:grid-cols-2 max-[1240px]:gap-y-2.5",
            "max-[760px]:mt-3.5 max-[760px]:grid-cols-3 max-[760px]:gap-2",
          )}
        >
          <Spec icon={Route} value={String(bike.rangeKm)} unit="km" label="Claimed range" grid={grid} />
          <Spec icon={Gauge} value={String(bike.topSpeedKmph)} unit="km/h" label="Top speed" grid={grid} />
          <Spec icon={PlugZap} value={String(bike.homeChargeHr)} unit="h" label="Home charging" grid={grid} />
        </div>
      </div>

      {/* actions */}
      <div
        className={cn(
          grid
            ? "flex flex-row flex-wrap items-center justify-between gap-[9px] px-[18px] pb-[18px] pt-3.5"
            : "flex flex-col justify-center gap-[9px] border-l border-[#EEF0F3] py-1 pl-5 pr-1.5",
          "max-[760px]:grid max-[760px]:grid-cols-2 max-[760px]:gap-2 max-[760px]:border-l-0 max-[760px]:px-4 max-[760px]:pb-4 max-[760px]:pt-3.5",
        )}
      >
        <Link href={href} className={cn(btn.brand, grid ? "flex-1" : "w-full", "max-[760px]:h-[42px] max-[760px]:px-2.5 max-[760px]:text-[13.5px]")}>
          View details <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <span className={cn(grid ? "hidden max-[760px]:contents" : "contents")}>
          <LeadCaptureDialog
            kind="best-price"
            vehicleSlug={bike.slug}
            triggerLabel="On-road price"
            triggerIcon={<Tag className="size-4" aria-hidden="true" />}
            triggerClassName={cn(btn.line, "w-full max-[760px]:h-[42px] max-[760px]:px-2.5 max-[760px]:text-[13.5px]")}
            dialogTitle={`On-road price in ${cityName}`}
            dialogDescription={`Share your details and a verified ${bike.name} dealer will send you the on-road price in ${cityName}.`}
            fields={[
              { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
              { key: "mobile", label: "Mobile number", type: "tel", placeholder: "10-digit mobile number", validation: "mobile" },
            ]}
            submitLabel="Get on-road price"
            successTitle="Request received"
            successDescription={`A verified dealer will contact you about the ${bike.name} shortly.`}
          />
        </span>
        <label className={cn("mt-0.5 inline-flex cursor-pointer select-none items-center gap-[9px] text-[13.5px] font-medium text-ink-secondary max-[760px]:col-span-2", grid && "order-first w-full max-[760px]:order-none")}>
          <input type="checkbox" checked={picked} onChange={() => togglePick(bike.slug)} data-pick={bike.slug} className="peer sr-only" />
          <span
            aria-hidden="true"
            className="grid size-[18px] flex-none place-items-center rounded-[5px] border-[1.5px] border-[#BCC2CA] bg-white text-white peer-checked:border-primary-hover peer-checked:bg-primary-hover peer-focus-visible:outline peer-focus-visible:outline-[2.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
          >
            {picked ? <Check className="size-3" strokeWidth={3.4} /> : null}
          </span>
          <span>{picked ? "Added to compare" : "Add to compare"}</span>
        </label>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, value, unit, label, grid }: { icon: typeof Route; value: string; unit: string; label: string; grid: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-[9px]">
      <i className={cn("grid size-[34px] flex-none place-items-center rounded-[10px] bg-primary-tint text-primary-hover", grid && "hidden", "max-[760px]:hidden")}>
        <Icon className="size-[17px]" strokeWidth={2} aria-hidden="true" />
      </i>
      <div className="min-w-0">
        <b className="block whitespace-nowrap text-[14.5px] font-bold tabular-nums">
          {value}
          <small className="ml-0.5 text-xs font-medium text-ink-muted">{unit}</small>
        </b>
        <span className="block truncate text-[11.5px] text-ink-muted">{label}</span>
      </div>
    </div>
  );
}

