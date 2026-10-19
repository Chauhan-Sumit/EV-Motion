"use client";

import Link from "next/link";
import { ArrowRight, BatteryMedium, Heart, Route, Star, Tag, Zap, Check } from "lucide-react";
import { LeadCaptureDialog } from "@/components/common/LeadCaptureDialog";
import { cardSubline, launchLabel, priceText } from "@/lib/cars-listing/copy";
import { paintForColors, swatchFor, tintForColors } from "@/lib/cars-listing/paint";
import type { ViewMode } from "@/lib/cars-listing/filters";
import type { PricedCar } from "@/lib/cars-listing/types";
import { cn } from "@/lib/utils";
import { useCarsListing } from "./ListingContext";
import { ListingCarArt } from "./ListingCarArt";
import { btn, SHADOW_1 } from "./ui";

const BADGE = "absolute left-2.5 top-2.5 z-[2] inline-flex h-6 items-center gap-[5px] rounded-[7px] px-[9px] text-[11.5px] font-[650]";

/**
 * One car in the results. Two layouts from the approved design: a wide list
 * row (art · details · actions) and a grid tile; both collapse to a stacked
 * card on phones. The price is the city-adjusted ex-showroom range.
 */
export function ListingCard({ car, view }: { car: PricedCar; view: ViewMode }) {
  const { picks, togglePick, saved, toggleSaved, badges, cityName } = useCarsListing();
  const picked = picks.includes(car.slug);
  const isSaved = saved.includes(car.slug);
  const grid = view === "grid";
  const href = `/cars/${car.slug}`;
  const superlative = badges.get(car.slug);

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
          "relative isolate flex items-end justify-center overflow-hidden bg-[linear-gradient(180deg,#F2F4F7_0%,#F8F9FB_58%,#ECEFF3_58.2%,#F4F6F8_100%)] px-3 pb-1.5",
          grid ? "aspect-[16/10] min-h-0 rounded-none" : "min-h-[180px] rounded-[14px]",
          "max-[760px]:aspect-[16/9.4] max-[760px]:min-h-0 max-[760px]:rounded-none",
        )}
      >
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
          className={cn("absolute right-2 top-2 z-[2] grid size-[34px] place-items-center rounded-full bg-white/90 text-ink-secondary transition-colors hover:text-[#E5484D] aria-pressed:text-[#E5484D] focus-ring", SHADOW_1)}
        >
          <Heart className="size-full" fill={isSaved ? "currentColor" : "none"} strokeWidth={2} aria-hidden="true" />
        </button>
        <ListingCarArt
          dims={car.art}
          body={car.body}
          paint={paintForColors(car.colors)}
          frame={{ lengthMm: 4400, heightMm: 1900 }}
          reflect
          alt={`${car.name} illustration`}
        />
        {car.colors.length ? (
          <span className="absolute bottom-[9px] left-2.5 z-[2] flex items-center gap-1 text-[11px] text-ink-muted" title={car.colors.join(", ")}>
            {car.colors.slice(0, 4).map((name) => (
              <i key={name} className="size-[11px] rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12),0_0_0_1.5px_#fff]" style={{ background: swatchFor(name) }} />
            ))}
            {car.colors.length > 4 ? `+${car.colors.length - 4}` : null}
            <span className="sr-only">{car.colors.length} colours: {car.colors.join(", ")}</span>
          </span>
        ) : null}
      </div>

      {/* details */}
      <div className={cn("flex min-w-0 flex-col", grid ? "px-[18px] pt-4" : "pb-1 pt-1.5", "max-[760px]:px-4 max-[760px]:pb-0 max-[760px]:pt-3.5")}>
        <div className="flex items-start justify-between gap-3.5">
          <div className="min-w-0">
            <h3 className="leading-[1.15] text-[21px] font-bold tracking-[-.03em] max-[760px]:text-xl">
              <Link href={href} className="text-ink hover:text-primary-hover hover:no-underline focus-ring">
                {car.name}
              </Link>
            </h3>
            <div className="mt-1.5 text-[19px] font-bold tabular-nums tracking-[-.02em] max-[760px]:text-lg">{priceText(car.price)}</div>
            <div className="mt-px text-[12.5px] text-ink-muted">{cardSubline(car)}</div>
          </div>
          {car.ncap && !grid ? <NcapStars ncap={car.ncap} /> : null}
        </div>
        <p className="mt-2 line-clamp-1 text-[13.5px] text-ink-muted">{car.tagline}</p>
        <div
          className={cn(
            "mt-auto grid grid-cols-3 gap-3 border-t border-[#EEF0F3] pt-3.5",
            grid ? "mt-3.5" : "max-[1240px]:grid-cols-2 max-[1240px]:gap-y-2.5",
            "max-[760px]:mt-3.5 max-[760px]:grid-cols-3 max-[760px]:gap-2",
          )}
        >
          <Spec icon={Route} value={String(car.rangeKm)} unit="km" label="Claimed range" grid={grid} />
          <Spec icon={Zap} value={car.dcMin !== null ? String(car.dcMin) : null} unit="min" label="DC 10–80%" grid={grid} />
          <Spec icon={BatteryMedium} value={String(Math.round(car.batteryKwh * 10) / 10)} unit="kWh" label="Battery" grid={grid} />
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
            vehicleSlug={car.slug}
            triggerLabel="On-road price"
            triggerIcon={<Tag className="size-4" aria-hidden="true" />}
            triggerClassName={cn(btn.line, "w-full max-[760px]:h-[42px] max-[760px]:px-2.5 max-[760px]:text-[13.5px]")}
            dialogTitle={`On-road price in ${cityName}`}
            dialogDescription={`Share your details and a verified ${car.name} dealer will send you the on-road price in ${cityName}.`}
            fields={[
              { key: "name", label: "Your name", type: "text", placeholder: "Full name", validation: "required" },
              { key: "mobile", label: "Mobile number", type: "tel", placeholder: "10-digit mobile number", validation: "mobile" },
            ]}
            submitLabel="Get on-road price"
            successTitle="Request received"
            successDescription={`A verified dealer will contact you about the ${car.name} shortly.`}
          />
        </span>
        <CompareCheck slug={car.slug} picked={picked} onToggle={() => togglePick(car.slug)} className={grid ? "order-first w-full max-[760px]:order-none" : undefined} />
      </div>
    </article>
  );
}

function Spec({ icon: Icon, value, unit, label, grid }: { icon: typeof Route; value: string | null; unit: string; label: string; grid: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-[9px]">
      <i className={cn("grid size-[34px] flex-none place-items-center rounded-[10px] bg-primary-tint text-primary-hover", grid && "hidden", "max-[760px]:hidden")}>
        <Icon className="size-[17px]" strokeWidth={2} aria-hidden="true" />
      </i>
      <div className="min-w-0">
        <b className="block whitespace-nowrap text-[14.5px] font-bold tabular-nums">
          {value ?? <span className="font-medium text-ink-muted">—</span>}
          {value ? <small className="ml-0.5 text-xs font-medium text-ink-muted">{unit}</small> : <span className="sr-only">Not published</span>}
        </b>
        <span className="block truncate text-[11.5px] text-ink-muted">{label}</span>
      </div>
    </div>
  );
}

function NcapStars({ ncap }: { ncap: NonNullable<PricedCar["ncap"]> }) {
  const label = `${ncap.rating}-star ${ncap.agency} safety rating${ncap.year ? `, ${ncap.year}` : ""}${ncap.expired ? " — rating expired" : ""}`;
  return (
    <div className="flex flex-none flex-col items-end gap-0.5 text-right" aria-label={label} role="img">
      <span className={cn("inline-flex items-center gap-px", ncap.expired ? "text-[#B9BFC7]" : "text-primary")}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={cn("size-3.5", i >= ncap.rating && "text-[#D5D9DE]")} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        ))}
      </span>
      <small className="whitespace-nowrap text-[11.5px] text-ink-muted">
        {ncap.agency} safety{ncap.year ? ` · ${ncap.year}` : ""}
        {ncap.expired ? " · expired" : ""}
      </small>
    </div>
  );
}

function CompareCheck({ slug, picked, onToggle, className }: { slug: string; picked: boolean; onToggle: () => void; className?: string }) {
  return (
    <label className={cn("mt-0.5 inline-flex cursor-pointer select-none items-center gap-[9px] text-[13.5px] font-medium text-ink-secondary max-[760px]:col-span-2 max-[760px]:mt-0.5", className)}>
      <input type="checkbox" checked={picked} onChange={onToggle} data-pick={slug} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="grid size-[18px] flex-none place-items-center rounded-[5px] border-[1.5px] border-[#BCC2CA] bg-white text-white peer-checked:border-primary-hover peer-checked:bg-primary-hover peer-focus-visible:outline peer-focus-visible:outline-[2.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
      >
        {picked ? <Check className="size-3" strokeWidth={3.4} /> : null}
      </span>
      <span>{picked ? "Added to compare" : "Add to compare"}</span>
    </label>
  );
}
