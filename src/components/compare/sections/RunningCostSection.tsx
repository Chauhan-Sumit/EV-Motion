import { Calculator } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { ChargingCostCalculator } from "../calculators/ChargingCostCalculator";

export function RunningCostSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="running-cost" title="Running Cost" description="Adjust the inputs below to estimate your own monthly and yearly running cost." icon={Calculator}>
      <ChargingCostCalculator vehicles={vehicles} />
    </CompareSectionCard>
  );
}
