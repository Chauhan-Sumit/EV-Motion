import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { SpecTable } from "../SpecTable";
import { WARRANTY_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const WARRANTY_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "warranty");

export function WarrantySection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="warranty" title="Warranty">
      <SpecTable vehicles={vehicles} rows={WARRANTY_SPEC_ROWS} winnerMetrics={WARRANTY_WINNER_METRICS} />
    </VehicleSection>
  );
}
