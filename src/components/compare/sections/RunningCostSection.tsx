import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { ChargingCostCalculator } from "../calculators/ChargingCostCalculator";

export function RunningCostSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="running-cost" title="Running Cost" description="Adjust the inputs below to estimate your own monthly and yearly running cost.">
      <ChargingCostCalculator vehicles={vehicles} />
    </VehicleSection>
  );
}
