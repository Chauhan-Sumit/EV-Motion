import { Sparkles } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { SpecTable } from "../SpecTable";
import { FEATURES_SPEC_ROWS } from "@/lib/compare/metrics";

export function FeaturesSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="features" title="Features" icon={Sparkles}>
      <SpecTable vehicles={vehicles} rows={FEATURES_SPEC_ROWS} />
    </CompareSectionCard>
  );
}
