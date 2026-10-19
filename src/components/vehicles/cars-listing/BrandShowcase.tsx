"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/brands/BrandLogo";
import { Reveal } from "@/components/compare/showroom/ui";
import { oems } from "@/lib/data/oems";
import { brandSummaries } from "@/lib/cars-listing/copy";
import { cn } from "@/lib/utils";
import { useCarsListing } from "./ListingContext";
import { SectionHeader } from "./SectionHeader";

/**
 * Every maker in the listing as a logo tile, above the results. A tile filters
 * the list to that brand (and shows as selected); tapping it again clears it.
 *
 * ⚠️ No real brand logos exist in the project yet. The six `logoUrl` assets in
 * `oems.ts` are placeholder cards (initials + name in a bordered box), which
 * shrink to an unreadable card-in-a-circle at tile size. Until real logo files
 * replace them, every tile draws `BrandLogo`'s lettered badge in the brand
 * colour. Once they exist, pass `oem` through unchanged and the logos appear.
 */
const REAL_LOGOS_AVAILABLE = false;
export function BrandShowcase() {
  const { cars, filters, setFilters, scrollToResults } = useCarsListing();
  const brands = brandSummaries(cars);
  const oemByKey = new Map(oems.map((o) => [o.key, o]));

  return (
    <section aria-labelledby="brands-h" className="pt-7 max-[760px]:pt-[22px]">
      <SectionHeader
        id="brands-h"
        title="Explore electric cars by brand"
        lede="Every EV maker selling in India."
        aside={
          <Link href="/brands" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-hover">
            View all brands <ArrowRight className="size-[15px]" strokeWidth={2.2} aria-hidden="true" />
          </Link>
        }
      />
      <Reveal className="grid grid-cols-[repeat(auto-fill,minmax(122px,1fr))] gap-2.5 max-[760px]:grid-cols-3">
        {brands.map((b) => {
          const oem = oemByKey.get(b.oem);
          const on = filters.brand.length === 1 && filters.brand[0] === b.oem;
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
              )}
            >
              {oem ? <BrandLogo oem={REAL_LOGOS_AVAILABLE ? oem : { ...oem, logoUrl: undefined }} size={40} /> : null}
              <b className={cn("text-[13.5px] font-bold leading-[1.15] tracking-[-.02em]", on && "text-[#0B6629]")}>{b.short}</b>
            </button>
          );
        })}
      </Reveal>
    </section>
  );
}
