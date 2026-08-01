import { BatteryFull, PlugZap } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { SpecTable } from "../SpecTable";
import { BATTERY_SPEC_ROWS, CHARGING_SPEC_ROWS } from "@/lib/compare/metrics";
import { WINNER_METRICS } from "@/lib/compare/metrics";

const BATTERY_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "battery");
const CHARGING_WINNER_METRICS = WINNER_METRICS.filter((m) => m.section === "charging");

export function BatterySection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="battery" title="Battery" icon={BatteryFull}>
      <SpecTable vehicles={vehicles} rows={BATTERY_SPEC_ROWS} winnerMetrics={BATTERY_WINNER_METRICS} />
    </CompareSectionCard>
  );
}

export function ChargingSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="charging" title="Charging" icon={PlugZap}>
      <SpecTable vehicles={vehicles} rows={CHARGING_SPEC_ROWS} winnerMetrics={CHARGING_WINNER_METRICS} />
    </CompareSectionCard>
  );
}
