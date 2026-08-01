import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { SpecTable } from "../SpecTable";
import { SAFETY_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const SAFETY_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "safety");

export function SafetySection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="safety" title="Safety">
      <SpecTable vehicles={vehicles} rows={SAFETY_SPEC_ROWS} winnerMetrics={SAFETY_WINNER_METRICS} />
    </VehicleSection>
  );
}
