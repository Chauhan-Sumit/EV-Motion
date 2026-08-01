import { Newspaper } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";

/** No real news data source exists anywhere in this project — honest empty state, same pattern as the VDP's SectionLatestNews. */
export function NewsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  return (
    <CompareSectionCard id="news" title="Related News" description="Launches, software updates and coverage for the vehicles compared here." icon={Newspaper}>
      <div className="flex max-w-2xl flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-secondary px-4 py-8 text-center">
        <Newspaper size={22} className="text-ink-muted" />
        <p className="text-[12px] font-semibold text-ink">No news yet</p>
        <p className="max-w-xs text-[11px] text-ink-muted">
          Coverage of the {vehicles.map((v) => v.name).join(" and ")} will appear here once published.
        </p>
      </div>
    </CompareSectionCard>
  );
}
