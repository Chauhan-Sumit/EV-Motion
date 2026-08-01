import Link from "next/link";
import { Scale } from "lucide-react";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { buildCompareSlug } from "@/lib/compare/slug";
import type { CompareCardPairData } from "@/types/ev-motion";

export function CompareCard({ pair }: { pair: CompareCardPairData }) {
  const compareHref = `/compare/${buildCompareSlug([pair.vehicleA.vehicle, pair.vehicleB.vehicle])}`;

  return (
    <article className="overflow-hidden rounded-[10px] border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3.5">
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="relative h-16 w-full overflow-hidden rounded-md bg-white">
            <VehicleImage vehicle={pair.vehicleA.vehicle} color={pair.vehicleA.oemColor} sizes="140px" className="h-full w-full" />
          </div>
          <p className="line-clamp-2 text-[11px] font-semibold text-ink">{pair.vehicleA.name}</p>
          <p className="text-[10px] font-bold text-ink-secondary">{pair.vehicleA.priceLabel}</p>
        </div>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-tint text-[10px] font-extrabold text-primary">
          VS
        </span>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="relative h-16 w-full overflow-hidden rounded-md bg-white">
            <VehicleImage vehicle={pair.vehicleB.vehicle} color={pair.vehicleB.oemColor} sizes="140px" className="h-full w-full" />
          </div>
          <p className="line-clamp-2 text-[11px] font-semibold text-ink">{pair.vehicleB.name}</p>
          <p className="text-[10px] font-bold text-ink-secondary">{pair.vehicleB.priceLabel}</p>
        </div>
      </div>

      <Link
        href={compareHref}
        className="focus-ring flex w-full items-center justify-center gap-1.5 border-t border-border py-2.5 text-[11px] font-semibold text-primary transition-colors hover:bg-primary-tint"
      >
        <Scale size={13} />
        Compare Now
      </Link>
    </article>
  );
}
