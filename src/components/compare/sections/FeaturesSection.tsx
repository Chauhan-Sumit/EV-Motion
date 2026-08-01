import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "@/components/vehicle-detail/VehicleSection";
import { SpecTable } from "../SpecTable";
import { FEATURES_SPEC_ROWS } from "@/lib/compare/metrics";

export function FeaturesSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <VehicleSection id="features" title="Features">
      <SpecTable vehicles={vehicles} rows={FEATURES_SPEC_ROWS} />
    </VehicleSection>
  );
}
