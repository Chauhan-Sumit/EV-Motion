import Link from "next/link";
import type { PricedCar } from "@/lib/cars-listing/types";
import { lineup, type StagePosition } from "@/lib/brand-page/copy";
import { joinList } from "@/lib/cars-listing/copy";
import { ListingCarArt } from "@/components/vehicles/cars-listing/ListingCarArt";
import { cn } from "@/lib/utils";

/** Where each car stands in the studio: flagship at the back right, best-known mid left, newest in front. */
const PLACE: Record<StagePosition, string> = {
  back: "bottom-[40%] right-[3%] w-[48%] opacity-[.96] saturate-[.85] brightness-[1.02]",
  mid: "bottom-[30%] left-[2%] w-[56%]",
  front: "bottom-[3%] left-[22%] w-[66%] group-hover:-translate-x-2",
};

/**
 * The hero's studio: up to three of the brand's cars, each drawn to its
 * published proportions at one common scale, in one of its catalogue colours
 * (`lineup()`). Illustrations, not photographs (CLAUDE.md #26). The caption links
 * each drawn car to its detail page.
 */
export function BrandLineupStage({ cars }: { cars: PricedCar[] }) {
  const stage = lineup(cars);
  if (!stage.length) return null;
  const year = new Date().getFullYear();

  return (
    <div
      // A fixed aspect ratio rather than a fixed height: the cars are sized by width, so the studio scales with them.
      className="group relative isolate aspect-[2.15/1] w-full overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#E9EDF1_0%,#F3F5F7_52%,#FBFBFC_52.3%,#EEF1F4_100%)] shadow-[inset_0_0_0_1px_rgba(16,24,40,.05)] max-[980px]:mx-auto max-[980px]:max-w-[640px] max-[760px]:rounded-[20px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_46%_at_50%_52%,#fff,transparent_70%),radial-gradient(40%_30%_at_70%_60%,rgba(22,163,74,.10),transparent_70%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[40%] bg-[repeating-linear-gradient(90deg,transparent_0_79px,rgba(16,24,40,.025)_79px_80px)]" />
      <span aria-hidden="true" className="absolute left-4 top-3.5 text-[11px] font-bold tracking-[.14em] text-ink-muted">
        THE {year} LINE-UP
      </span>
      <div role="img" aria-label={`Illustration of the ${joinList(stage.map((s) => s.car.model))}`} className="absolute inset-0">
        {stage.map(({ car, position, paint }) => (
          <div key={car.slug} className={cn("absolute transition-transform duration-[800ms] ease-[cubic-bezier(.2,.7,.2,1)]", PLACE[position])}>
            <ListingCarArt dims={car.art} body={car.body} paint={paint} frame={{ lengthMm: 4700, heightMm: 1800 }} reflect alt="" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-3.5 flex flex-wrap justify-end gap-1.5 max-[760px]:hidden">
        {[...stage].reverse().map(({ car, swatch }) => (
          <Link
            key={car.slug}
            href={`/cars/${car.slug}`}
            className="inline-flex h-7 items-center gap-1.5 rounded-[9px] border border-[rgba(16,24,40,.06)] bg-white/85 px-2.5 text-xs font-semibold text-ink backdrop-blur-[8px] hover:bg-white hover:no-underline focus-ring"
          >
            <i aria-hidden="true" className="size-2 rounded-full" style={{ background: swatch }} />
            {car.model}
          </Link>
        ))}
      </div>
    </div>
  );
}
