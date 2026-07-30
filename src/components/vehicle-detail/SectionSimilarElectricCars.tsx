import { Container } from "@/components/ui/Container";
import { BlockHeading } from "@/components/ui/BlockHeading";
import { getSimilarVehicleDetails } from "@/lib/data/ev-motion/toVehicleDetail";
import { SimilarCarCard } from "./SimilarCarCard";
import type { VehicleDetail } from "@/types/vehicle-detail";

export function SectionSimilarElectricCars({ vehicle }: { vehicle: VehicleDetail }) {
  const items = getSimilarVehicleDetails(vehicle);

  if (items.length === 0) return null;

  const viewAllHref = vehicle.category === "cars" ? "/cars" : "/two-wheelers";

  return (
    <section className="border-t border-border py-8">
      <Container>
        <BlockHeading title="Similar Electric Cars" viewAllLabel="View all" viewAllHref={viewAllHref} />
        <div className="scroll-row -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-[11px] sm:overflow-visible sm:px-0 sm:pb-0">
          {items.map((item) => (
            <div key={item.slug} className="w-[62%] shrink-0 snap-start sm:w-auto">
              <SimilarCarCard vehicle={item} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
