"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { Reveal } from "@/components/compare/showroom/ui";
import { SectionHeader } from "@/components/vehicles/cars-listing/SectionHeader";
import { oems } from "@/lib/data/oems";
import { brandSummaries } from "@/lib/two-wheelers-listing/copy";
import { cn } from "@/lib/utils";
import { useBikesListing } from "./ListingContext";

/** Tiles shown before "Show all": two desktop rows, three phone rows. */
const VISIBLE_DESKTOP = 18;
const VISIBLE_PHONE = 9;

/**
 * Every two-wheeler maker as a tile above the results, as on the Electric Cars
 * listing. There are about twice as many brands, so the grid opens collapsed.
 * Like the cars page, tiles draw `BrandLogo`'s lettered badge: the few
 * `logoUrl` assets in `oems.ts` are placeholder cards, not logos.
 */
const REAL_LOGOS_AVAILABLE = false;

export function BikeBrandShowcase() {
  const { bikes, filters, setFilters, scrollToResults } = useBikesListing();
  const [expanded, setExpanded] = useState(false);
  const brands = brandSummaries(bikes);
  const oemByKey = new Map(oems.map((o) => [o.key, o]));

  return (
    <section aria-labelledby="bike-brands-h" className="pt-7 max-[760px]:pt-[22px]">
      <SectionHeader
        id="bike-brands-h"
        title="Explore by brand"
        lede={`${brands.length} electric two-wheeler makers selling in India.`}
        aside={
          <Link href="/brands" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-hover">
            View all brands <ArrowRight className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
          </Link>
        }
      />
      <Reveal className="grid grid-cols-[repeat(auto-fill,minmax(122px,1fr))] gap-2.5 max-[760px]:grid-cols-3">
        {brands.map((b, i) => {
          const oem = oemByKey.get(b.oem);
          const on = filters.brand.length === 1 && filters.brand[0] === b.oem;
          const hidden = !expanded && !on && (i >= VISIBLE_DESKTOP ? "hidden" : i >= VISIBLE_PHONE ? "max-[760px]:hidden" : "");
          return (
            <button
              key={b.oem}
              type="button"
              aria-pressed={on}
              aria-label={`${b.name}, ${b.count} model${b.count > 1 ? "s" : ""}`}
              onClick={() => {
                setFilters((f) => ({ ...f, brand: on ? [] : [b.oem] }));
                scrollToResults();
              }}
              className={cn(
                "flex h-[86px] flex-col items-center justify-center gap-1.5 rounded-[14px] border border-border bg-surface p-2 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-[0_12px_32px_-8px_rgba(16,24,40,.12),0_4px_10px_-4px_rgba(16,24,40,.06)] focus-ring",
                on && "border-primary bg-[linear-gradient(180deg,#F6FCF8,#fff)] shadow-[0_0_0_1px_var(--primary)]",
                hidden,
              )}
            >
              {oem ? <BrandLogo oem={REAL_LOGOS_AVAILABLE ? oem : { ...oem, name: b.short, logoUrl: undefined }} size={34} /> : null}
              <b className={cn("line-clamp-2 text-[13px] font-bold leading-[1.15] tracking-[-.02em]", on && "text-[#0B6629]")}>{b.short}</b>
            </button>
          );
        })}
      </Reveal>
      {brands.length > VISIBLE_PHONE ? (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-[13.5px] font-semibold text-ink-secondary hover:text-primary-hover focus-ring",
            brands.length <= VISIBLE_DESKTOP && "min-[761px]:hidden",
          )}
        >
          {expanded ? "Show fewer brands" : `Show all ${brands.length} brands`}
          <ChevronDown className={cn("size-3 transition-transform", expanded && "rotate-180")} strokeWidth={2.6} aria-hidden="true" />
        </button>
      ) : null}
    </section>
  );
}
