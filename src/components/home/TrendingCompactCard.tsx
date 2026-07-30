import Link from "next/link";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import type { TrendingCompactItemData } from "@/types/ev-motion";

export function TrendingCompactCard({ item }: { item: TrendingCompactItemData }) {
  const basePath = item.kind === "car" ? "/cars" : "/two-wheelers";

  return (
    <Link
      href={`${basePath}/${item.vehicle.slug}`}
      data-carousel-item
      className={`focus-ring relative flex shrink-0 items-center gap-2.5 overflow-hidden rounded-lg border bg-surface py-2 pl-2 pr-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
        item.sponsored ? "border-primary" : "border-border hover:border-primary"
      }`}
    >
      {item.sponsored ? (
        <span className="absolute right-1.5 top-1.5 rounded bg-primary/10 px-1.5 py-px text-[8px] font-bold uppercase text-primary">
          Ad
        </span>
      ) : null}
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-white">
        <VehicleImage vehicle={item.vehicle} color={item.oemColor} sizes="64px" className="h-full w-full" />
      </div>
      <p className="truncate text-[12.5px] font-semibold text-ink">{item.name}</p>
    </Link>
  );
}
