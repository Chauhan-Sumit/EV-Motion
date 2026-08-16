import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

      <ul className="flex flex-col">
        {pairs.map((pair) => {
          const href = `/compare/${buildCompareSlug([pair.vehicleA.vehicle, pair.vehicleB.vehicle])}`;
          return (
            <li key={pair.id} className="border-b border-border last:border-b-0">
              <Link
                href={href}
                aria-label={`Compare ${pair.vehicleA.name} and ${pair.vehicleB.name}`}
                className="focus-ring group flex items-center gap-1 px-[13px] py-2.5 transition-colors hover:bg-primary-tint"
              >
                {/* VS is centered against only the two vehicle columns (equal
                    1fr tracks) — the chevron sits outside this grid as a
                    separate flex item so it doesn't pull the badge off-center. */}
                <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-surface-secondary">
                      <VehicleImage
                        vehicle={pair.vehicleA.vehicle}
                        color={pair.vehicleA.oemColor}
                        sizes="28px"
                        className="h-full w-full p-1"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[7.5px] font-bold uppercase leading-tight tracking-wide text-ink-muted">
                        {pair.vehicleA.vehicle.oemName}
                      </span>
                      <span className="block text-[10px] font-bold leading-tight text-ink">
                        {pair.vehicleA.vehicle.modelName}
                      </span>
                    </span>
                  </span>

                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary-tint text-[7px] font-extrabold text-primary">
                    VS
                  </span>

                  <span className="flex min-w-0 flex-row-reverse items-center gap-1.5 text-right">
                    <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md bg-surface-secondary">
                      <VehicleImage
                        vehicle={pair.vehicleB.vehicle}
                        color={pair.vehicleB.oemColor}
                        sizes="28px"
                        className="h-full w-full p-1"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[7.5px] font-bold uppercase leading-tight tracking-wide text-ink-muted">
                        {pair.vehicleB.vehicle.oemName}
                      </span>
                      <span className="block text-[10px] font-bold leading-tight text-ink">
                        {pair.vehicleB.vehicle.modelName}
                      </span>
                    </span>
                  </span>
                </span>

                <ChevronRight
                  size={13}
                  className="shrink-0 text-ink-muted transition-colors group-hover:text-primary"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
