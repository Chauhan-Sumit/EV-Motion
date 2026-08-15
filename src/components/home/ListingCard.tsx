import Link from "next/link";
import { Gauge, BatteryCharging } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { routeSegmentFor } from "@/lib/data/categories";
import { VehiclePriceText } from "@/components/pricing/VehiclePriceText";
import { VehicleEmiText } from "@/components/pricing/VehicleEmiText";
import { vehiclePricingSubject } from "@/lib/vehicle-pricing";
import type { CardBadge, ListingCardData } from "@/types/ev-motion";

const BADGE_BG: Record<CardBadge, string> = {
  New: "bg-primary text-white",
  Hot: "bg-hot text-white",
  "New Launch": "bg-primary text-white",
  Bestseller: "bg-primary text-white",
  Trending: "bg-primary text-white",
};

// specs[] is built in order [range, battery, body/type] by toListingCard —
// safe to pair the first two entries with fixed icons.
const SPEC_ICONS = [Gauge, BatteryCharging] as const;

export function ListingCard({ item, priority }: { item: ListingCardData; priority?: boolean }) {
  const basePath = `/${routeSegmentFor(item.category)}`;
  const detailHref = `${basePath}/${item.slug}`;

  return (
    <Link
      href={detailHref}
      data-carousel-item
      className="focus-ring group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-surface-secondary to-white">
        {item.badge ? (
          <span
            className={`absolute left-2.5 top-2.5 z-10 rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase ${BADGE_BG[item.badge]}`}
          >
            {item.badge}
          </span>
        ) : null}
        {item.sponsored ? (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-md border border-primary/25 bg-white/90 px-2 py-0.5 text-[9.5px] font-bold text-primary">
            Sponsored
          </span>
        ) : null}
        <VehicleImage
          vehicle={item.vehicle}
          color={item.oemColor}
          priority={priority}
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full p-3 transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.7px] text-ink-muted">{item.brand}</p>
        <p className="text-[14px] font-bold leading-tight text-ink">{item.name}</p>

        <p className="mt-0.5 text-[15px] font-extrabold text-primary">
          <VehiclePriceText vehicle={vehiclePricingSubject(item.vehicle)} variant="from" />{" "}
          <span className="text-[11px] font-medium text-ink-muted">onwards</span>
        </p>
        <p className="text-[10.5px] text-ink-muted">
          <VehicleEmiText vehicle={vehiclePricingSubject(item.vehicle)} />
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-secondary">
          {item.specs.map((spec, i) => {
            const Icon = SPEC_ICONS[i];
            return (
              <span key={spec} className="flex items-center gap-1">
                {Icon ? <Icon size={11} className="text-ink-muted" /> : <span className="h-[3px] w-[3px] rounded-full bg-primary" />}
                {spec}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-3.5 py-2">
        <span className="text-[10px] text-ink-muted">{item.locationLabel}</span>
        <span className="text-[11px] font-semibold text-primary">{item.ctaLabel} ›</span>
      </div>
    </Link>
  );
}
