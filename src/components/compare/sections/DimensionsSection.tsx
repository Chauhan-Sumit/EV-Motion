import { Ruler } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { SpecTable } from "../SpecTable";
import { DIMENSIONS_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const DIMENSIONS_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "dimensions");

export function DimensionsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="dimensions" title="Dimensions" icon={Ruler}>
      <SpecTable vehicles={vehicles} rows={DIMENSIONS_SPEC_ROWS} winnerMetrics={DIMENSIONS_WINNER_METRICS} />
    </CompareSectionCard>
  );
}
