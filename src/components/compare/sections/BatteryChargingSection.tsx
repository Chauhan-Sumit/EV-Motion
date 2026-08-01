import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { SpecTable } from "../SpecTable";
import { BATTERY_SPEC_ROWS, CHARGING_SPEC_ROWS } from "@/lib/compare/metrics";
import { WINNER_METRICS } from "@/lib/compare/metrics";

const BATTERY_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "battery");
const CHARGING_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "charging");

export function BatterySection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="battery" title="Battery">
      <SpecTable vehicles={vehicles} rows={BATTERY_SPEC_ROWS} winnerMetrics={BATTERY_WINNER_METRICS} />
    </VehicleSection>
  );
}

export function ChargingSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="charging" title="Charging">
      <SpecTable vehicles={vehicles} rows={CHARGING_SPEC_ROWS} winnerMetrics={CHARGING_WINNER_METRICS} />
    </VehicleSection>
  );
}
