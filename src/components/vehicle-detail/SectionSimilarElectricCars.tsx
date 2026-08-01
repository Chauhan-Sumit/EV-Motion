import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { getSimilarVehicleDetails } from "@/lib/data/ev-motion/toVehicleDetail";
import { categoryConfig, routeSegmentFor } from "@/lib/data/categories";
import { SimilarCarCard } from "./SimilarCarCard";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function SectionSimilarElectricCars({ vehicle }: { vehicle: VehicleDetail }) {
  const items = getSimilarVehicleDetails(vehicle);

  if (items.length === 0) return null;

  const viewAllHref = `/${routeSegmentFor(vehicle.category)}`;
  const title = `Similar ${categoryConfig(vehicle.category).label}`;

  return (
    <section className="border-t border-border py-8">
      <Container>
        <BlockHeading title={title} viewAllLabel="View all" viewAllHref={viewAllHref} />
        {/* Horizontal-scroll rail at every breakpoint (not a wrapping grid) — with 5-8 similar
            vehicles now possible per getRelatedVehicles, a grid would either orphan a lone card
            on its own row or force everything down to an overly cramped column count. Narrower
            fixed-width cards let several sit side-by-side, matching a production marketplace's
            related-vehicle rail. */}
        <div className="scroll-row -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:gap-3 sm:px-0">
          {items.map((item) => (
            <div key={item.slug} className="w-[62%] shrink-0 snap-start sm:w-[220px]">
              <SimilarCarCard vehicle={item} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
