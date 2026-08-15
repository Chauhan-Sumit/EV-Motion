import Link from "next/link";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { buildCompareSlug } from "@/lib/compare/slug";
import { carComparisons, bikeComparisons } from "@/lib/data/ev-motion/derive";

export function PopularComparisonsCard() {
  const pairs = [...carComparisons, ...bikeComparisons].slice(0, 5);
  if (pairs.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-[13px] py-2.5">
        <h3 className="text-xs font-bold text-ink">Popular Comparisons</h3>
        <Link href="/compare" className="focus-ring text-[10px] font-semibold text-primary">
          View all
        </Link>
      </div>
      <ul className="p-3.5">
        {pairs.map((pair) => {
          const href = `/compare/${buildCompareSlug([pair.vehicleA.vehicle, pair.vehicleB.vehicle])}`;
          return (
            <li key={pair.id}>
              <Link
                href={href}
                className="focus-ring flex items-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium text-ink-secondary transition-colors hover:text-primary"
              >
                <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-surface-secondary">
                  <VehicleImage vehicle={pair.vehicleA.vehicle} color={pair.vehicleA.oemColor} sizes="24px" className="h-full w-full" />
                </span>
                <span className="truncate">{pair.vehicleA.name}</span>
                <span className="shrink-0 text-ink-muted">vs</span>
                <span className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-surface-secondary">
                  <VehicleImage vehicle={pair.vehicleB.vehicle} color={pair.vehicleB.oemColor} sizes="24px" className="h-full w-full" />
                </span>
                <span className="truncate">{pair.vehicleB.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
