import Link from "next/link";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { routeSegmentFor } from "@/lib/data/categories";
import type { CardBadge, ListingCardData } from "@/types/ev-motion";

const BADGE_BG: Record<CardBadge, string> = {
  New: "bg-primary text-white",
  Hot: "bg-hot text-white",
  "New Launch": "bg-primary text-white",
  Bestseller: "bg-primary text-white",
  Trending: "bg-primary text-white",
};

export function ListingCard({ item, priority }: { item: ListingCardData; priority?: boolean }) {
  const basePath = `/${routeSegmentFor(item.category)}`;
  const detailHref = `${basePath}/${item.slug}`;

  return (
    <Link
      href={detailHref}
      data-carousel-item
      className="focus-ring block overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover"
    >
      <div className="relative h-40 overflow-hidden border-b border-border bg-white">
        {item.badge ? (
          <span
            className={`absolute left-2 top-2 z-10 rounded-[3px] px-[7px] py-0.5 text-[9px] font-bold uppercase ${BADGE_BG[item.badge]}`}
          >
            {item.badge}
          </span>
        ) : null}
        {item.sponsored ? (
          <span className="absolute right-2 top-2 z-10 rounded-[3px] border border-primary/25 bg-primary/10 px-[5px] py-0.5 text-[9px] font-bold text-primary">
            Sponsored
          </span>
        ) : null}
        <VehicleImage
          vehicle={item.vehicle}
          color={item.oemColor}
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="h-full w-full"
        />
      </div>

      <div className="p-[11px]">
        <p className="mb-px text-[9px] font-semibold uppercase tracking-[0.7px] text-ink-muted">{item.brand}</p>
        <p className="mb-[5px] text-[13px] font-bold text-ink">{item.name}</p>

        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {item.specs.map((spec) => (
            <span key={spec} className="flex items-center gap-0.5 text-[10px] text-ink-muted">
              <span className="h-[3px] w-[3px] rounded-full bg-primary" />
              {spec}
            </span>
          ))}
        </div>

        <p className="mb-0.5 text-sm font-extrabold text-primary">{item.priceLabel}</p>
        <p className="text-[10px] text-ink-muted">{item.emiLabel}</p>
      </div>

      <div className="flex items-center justify-between border-t border-border px-[11px] py-[7px]">
        <span className="text-[10px] text-ink-muted">📍 {item.locationLabel}</span>
        <span className="text-[11px] font-semibold text-primary">{item.ctaLabel} ›</span>
      </div>
    </Link>
  );
}
