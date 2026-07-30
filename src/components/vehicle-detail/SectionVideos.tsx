import { Play } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";

const TOTAL_SLOTS = 3;

export function SectionVideos({ vehicle }: { vehicle: VehicleDetail }) {
  return (
    <VehicleSection
      id="videos"
      title={`Videos (${TOTAL_SLOTS})`}
      description={`No videos are on file yet for the ${vehicle.name} — these slots are ready for walkaround and review videos.`}
      headingAction={
        <a href="#videos" className="focus-ring text-[11px] font-semibold text-primary">
          View all ›
        </a>
      }
    >
      <div className="flex gap-2.5 overflow-x-auto sm:max-w-2xl">
        {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
          <div
            key={i}
            className="relative flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface-secondary sm:h-28 sm:w-48"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink-secondary shadow-card">
              <Play size={15} className="ml-0.5" />
            </span>
          </div>
        ))}
      </div>
    </VehicleSection>
  );
}
