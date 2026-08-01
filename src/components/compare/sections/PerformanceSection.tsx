import { Gauge } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { SpecTable } from "../SpecTable";
import { PERFORMANCE_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const PERFORMANCE_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "performance");

export function PerformanceSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="performance" title="Performance" icon={Gauge}>
      <SpecTable vehicles={vehicles} rows={PERFORMANCE_SPEC_ROWS} winnerMetrics={PERFORMANCE_WINNER_METRICS} />
    </CompareSectionCard>
  );
}
