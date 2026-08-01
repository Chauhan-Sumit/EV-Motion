import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { SpecTable } from "../SpecTable";
import { DIMENSIONS_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const DIMENSIONS_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "dimensions");

export function DimensionsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="dimensions" title="Dimensions">
      <SpecTable vehicles={vehicles} rows={DIMENSIONS_SPEC_ROWS} winnerMetrics={DIMENSIONS_WINNER_METRICS} />
    </VehicleSection>
  );
}
