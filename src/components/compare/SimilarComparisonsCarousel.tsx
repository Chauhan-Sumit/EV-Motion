import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { VehicleImage } from "@/components/vehicles/VehicleImage";
import { getOemBySlug } from "@/lib/data";
import { buildCompareSlug } from "@/lib/compare/slug";
import { buildSimilarComparisons } from "@/lib/compare/similar";
import { VehiclePriceText } from "@/components/pricing/VehiclePriceText";
import { vehiclePricingSubject } from "@/lib/vehicle-pricing";
import type { Vehicle } from "@/types/vehicle";

export function SimilarComparisonsCarousel({ vehicles }: { vehicles: Vehicle[] }) {
  const pairs = buildSimilarComparisons(vehicles, 8);
  if (pairs.length === 0) return null;

  return (
    <section className="border-t border-border py-8">
      <Container>
        <BlockHeading title="Similar Comparisons" />
        <div className="scroll-row -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:px-0 sm:pb-0">
          {pairs.map(({ a, b }) => (
            <Link
              key={`${a.slug}-${b.slug}`}
              href={`/compare/${buildCompareSlug([a, b])}`}
              className="focus-ring w-[68%] shrink-0 snap-start rounded-xl border border-border bg-surface p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover sm:w-56"
            >
              <div className="flex items-center gap-1.5">
                <div className="aspect-square w-1/2 overflow-hidden rounded-md bg-surface-secondary">
                  <VehicleImage vehicle={a} color={getOemBySlug(a.oem)?.color ?? "#0891B2"} className="h-full w-full" sizes="120px" />
                </div>
                <span className="shrink-0 text-[10px] font-extrabold text-ink-muted">VS</span>
                <div className="aspect-square w-1/2 overflow-hidden rounded-md bg-surface-secondary">
                  <VehicleImage vehicle={b} color={getOemBySlug(b.oem)?.color ?? "#0891B2"} className="h-full w-full" sizes="120px" />
                </div>
              </div>
              <p className="mt-2 truncate text-[11.5px] font-bold text-ink">
                {a.modelName} vs {b.modelName}
              </p>
              <p className="mt-0.5 text-[10.5px] text-ink-muted">
                <VehiclePriceText vehicle={vehiclePricingSubject(a)} variant="from" /> ·{" "}
                <VehiclePriceText vehicle={vehiclePricingSubject(b)} variant="from" />
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
