"use client";

import Link from "next/link";
import { slotColor } from "@/lib/compare/showroom/palette";
import type { PopularComparison } from "@/lib/compare/showroom/page-data";
import { cn, formatPriceLakh } from "@/lib/utils";
import { cityAdjustedExShowroomRange } from "@/lib/vehicle-pricing";
import { useLocation } from "@/context/LocationContext";
import { DISPLAY, Reveal, SECTION, SectionHeader } from "./ui";
import { ShowroomCar } from "./ShowroomCar";

/** Nearby comparisons — each a real link to that comparison's page. */
export function PopularSection({ popular, basePath }: { popular: PopularComparison[]; basePath: string }) {
  const { city } = useLocation();
  if (!popular.length) return null;
  return (
    <section id="popular" aria-labelledby="popH" className={SECTION}>
      <SectionHeader
        id="popH"
        eyebrow="Keep comparing"
        title="Popular comparisons."
        aside={
          <Link href="/compare" className="font-semibold text-primary-hover hover:underline">
            Start a new comparison →
          </Link>
        }
      />
      <Reveal className="grid grid-cols-2 gap-2.5 md:gap-4 min-[68.75rem]:grid-cols-4">
        {popular.map((p) => (
          <Link
            key={p.slug}
            href={`${basePath}/${p.slug}`}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-ink transition-[box-shadow,transform] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_14px_34px_rgba(0,0,0,.08)] focus-ring"
          >
            <div className="relative grid h-24 bg-surface-dark md:h-[132px]" style={{ gridTemplateColumns: `repeat(${p.vehicles.length}, 1fr)` }}>
              {p.vehicles.map((v, i) => (
                <div
                  key={v.slug}
                  className="grid place-items-center px-1.5"
                  style={{ background: `radial-gradient(80% 90% at 50% 70%, ${slotColor(i).halo}, transparent)` }}
                >
                  <ShowroomCar vehicle={v} paint={slotColor(i).paint} alt="" detail={false} />
                </div>
              ))}
              <span className={cn(DISPLAY, "absolute left-1/2 top-1/2 grid size-[38px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-sm font-black text-ink font-stretch-[70%]")}>
                VS
              </span>
            </div>
            <div className="flex flex-col gap-1 p-3 md:px-[18px] md:pb-[18px] md:pt-4">
              <b className="text-sm md:text-[15.5px]">{p.vehicles.map((v) => v.name).join(" vs ")}</b>
              <span className="text-[13px] tabular-nums text-ink-muted">{p.vehicles.map((v) => formatPriceLakh(cityAdjustedExShowroomRange(v.priceRangeLakh, city)[0])).join(" · ")}</span>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
