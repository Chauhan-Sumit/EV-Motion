"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { buildCompareSlug, MAX_COMPARE, MIN_COMPARE } from "@/lib/compare/slug";
import { swatchFor } from "@/lib/cars-listing/paint";
import { cn } from "@/lib/utils";
import { useBikesListing } from "./ListingContext";
import { BikeArt } from "./BikeArt";

/**
 * The floating compare tray, as on the Electric Cars listing: up to
 * `MAX_COMPARE` ticked models and a link to the site's comparison page once at
 * least two are picked. Scooters and motorcycles share a category, so any mix
 * compares.
 */
export function BikeCompareTray() {
  const { bikes, picks, togglePick, clearPicks, toast } = useBikesListing();
  const picked = picks.map((slug) => bikes.find((b) => b.slug === slug)).filter((b) => b !== undefined);
  const ready = picked.length >= MIN_COMPARE;
  const on = picked.length > 0;

  return (
    <div
      role="region"
      aria-label="Compare tray"
      aria-hidden={!on}
      inert={!on}
      className={cn(
        "fixed bottom-5 left-1/2 z-[70] flex max-w-[calc(100%-24px)] items-center gap-3 rounded-[20px] bg-[rgba(14,17,22,.95)] py-2.5 pl-3.5 pr-2.5 text-white shadow-[0_24px_60px_rgba(0,0,0,.35)] backdrop-blur-[18px] transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)] print:hidden",
        on ? "-translate-x-1/2 translate-y-0" : "-translate-x-1/2 translate-y-[150%]",
        "max-[760px]:inset-x-0 max-[760px]:bottom-0 max-[760px]:max-w-none max-[760px]:translate-x-0 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:rounded-b-none max-[760px]:rounded-t-[18px] max-[760px]:px-3 max-[760px]:pb-[calc(12px+env(safe-area-inset-bottom))]",
        on ? "max-[760px]:translate-y-0" : "max-[760px]:translate-y-[110%]",
      )}
    >
      <div className="flex gap-2 max-[760px]:grid max-[760px]:grid-cols-4 max-[760px]:gap-1.5">
        {Array.from({ length: MAX_COMPARE }, (_, i) => {
          const bike = picked[i];
          if (!bike)
            return (
              <div key={`empty-${i}`} className="flex h-[52px] w-[172px] items-center justify-center rounded-[13px] border-[1.5px] border-dashed border-[#3A404A] text-xs text-[#7E848E] max-[760px]:h-[46px] max-[760px]:w-auto">
                {i === picked.length ? "Add a model" : "—"}
              </div>
            );
          return (
            <div key={bike.slug} className="relative flex h-[52px] w-[172px] min-w-0 items-center gap-2 rounded-[13px] bg-[#1C2028] pl-1.5 pr-1.5 max-[760px]:h-[46px] max-[760px]:w-auto max-[760px]:flex-col max-[760px]:justify-center max-[760px]:gap-0 max-[760px]:px-1">
              <span className="w-11 flex-none max-[760px]:hidden">
                <BikeArt type={bike.type} color={swatchFor(bike.colors[0])} detail={false} alt="" />
              </span>
              <b className="min-w-0 flex-1 truncate text-[12.5px] leading-[1.2] max-[760px]:line-clamp-2 max-[760px]:whitespace-normal max-[760px]:text-center max-[760px]:text-[11px]">{bike.model}</b>
              <button
                type="button"
                onClick={() => togglePick(bike.slug)}
                aria-label={`Remove ${bike.model} from compare`}
                className="grid size-6 flex-none place-items-center rounded-full text-[#A4A9B2] hover:bg-[#2C313A] hover:text-white max-[760px]:absolute max-[760px]:-right-[7px] max-[760px]:-top-[7px] max-[760px]:size-[22px] max-[760px]:bg-[#2A2E36] max-[760px]:text-white"
              >
                <X className="size-[11px]" strokeWidth={2.6} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col items-stretch gap-1 max-[760px]:flex-row-reverse max-[760px]:items-center">
        <Link
          href={ready ? `/compare/${buildCompareSlug(picked)}` : "#results"}
          aria-disabled={!ready}
          onClick={(e) => {
            if (!ready) {
              e.preventDefault();
              toast(`Tick at least ${MIN_COMPARE} models to compare.`);
            }
          }}
          className={cn(
            "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-xl bg-primary px-[18px] text-[14.5px] font-semibold text-[#04140A] transition-colors hover:bg-[#22C55E] hover:no-underline focus-ring max-[760px]:flex-1",
            !ready && "opacity-55",
          )}
        >
          {ready ? `Compare ${picked.length}` : `Pick ${MIN_COMPARE - picked.length} more`}
        </Link>
        <button type="button" onClick={clearPicks} className="px-2 text-xs text-[#A4A9B2] hover:text-white">
          Clear
        </button>
      </div>
    </div>
  );
}
