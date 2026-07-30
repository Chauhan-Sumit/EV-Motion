import { ImageOff } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";
import { VehicleImage } from "@/components/vehicles/VehicleImage";

const TOTAL_SLOTS = 8;
const VISIBLE = 4;

export function SectionImages({ vehicle }: { vehicle: VehicleDetail }) {
  const overflow = TOTAL_SLOTS - VISIBLE;

  return (
    <VehicleSection
      id="images"
      title={`Images (${TOTAL_SLOTS})`}
      description="Only one confirmed photo is on file — the remaining slots are ready for real photography."
      headingAction={
        <a href="#images" className="focus-ring text-[11px] font-semibold text-primary">
          View All ›
        </a>
      }
    >
      <div className="flex gap-2 overflow-x-auto sm:max-w-2xl">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-white sm:h-28 sm:w-36">
          <VehicleImage vehicle={vehicle.sourceVehicle} color={vehicle.oemColor} sizes="144px" className="h-full w-full" />
        </div>
        {Array.from({ length: VISIBLE - 2 }).map((_, i) => (
          <div
            key={i}
            className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface-secondary sm:h-28 sm:w-36"
          >
            <ImageOff size={16} className="text-ink-muted" />
          </div>
        ))}
        <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface-secondary text-sm font-bold text-ink-secondary sm:h-28 sm:w-36">
          +{overflow}
        </div>
      </div>
    </VehicleSection>
  );
}
