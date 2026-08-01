import { ShieldCheck } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { SpecTable } from "../SpecTable";
import { SAFETY_SPEC_ROWS, WINNER_METRICS } from "@/lib/compare/metrics";

const SAFETY_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "safety");

export function SafetySection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="safety" title="Safety" icon={ShieldCheck}>
      <SpecTable vehicles={vehicles} rows={SAFETY_SPEC_ROWS} winnerMetrics={SAFETY_WINNER_METRICS} />
    </CompareSectionCard>
  );
}
