import { BadgeCheck } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { SpecTable } from "../SpecTable";
import { WARRANTY_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const WARRANTY_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "warranty");

export function WarrantySection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="warranty" title="Warranty" icon={BadgeCheck}>
      <SpecTable vehicles={vehicles} rows={WARRANTY_SPEC_ROWS} winnerMetrics={WARRANTY_WINNER_METRICS} />
    </CompareSectionCard>
  );
}
