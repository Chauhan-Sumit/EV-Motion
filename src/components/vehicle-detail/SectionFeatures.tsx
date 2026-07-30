"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { VehicleSection } from "./VehicleSection";

const VISIBLE_COUNT = 6;

export function SectionFeatures({ vehicle }: { vehicle: VehicleDetail }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? vehicle.features : vehicle.features.slice(0, VISIBLE_COUNT);
  const hasMore = vehicle.features.length > VISIBLE_COUNT;

  return (
    <VehicleSection
      id="features"
      title="Top Features"
      headingAction={
        hasMore ? (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="focus-ring text-[11px] font-semibold text-primary"
          >
            {expanded ? "Show Less ‹" : "View all Features ›"}
          </button>
        ) : undefined
      }
    >
      <div className="scroll-row -mx-1 flex flex-wrap gap-3 overflow-x-auto px-1 pb-1 sm:flex-nowrap sm:overflow-visible">
        {visible.map((feature) => (
          <div
            key={feature.id}
            className="flex w-[140px] shrink-0 flex-col items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-3 text-center sm:w-auto sm:flex-1"
          >
            <CheckCircle2 size={16} className="text-primary" />
            <span className="text-[11px] font-semibold leading-tight text-ink">{feature.label}</span>
            <span className="text-[9px] uppercase tracking-wide text-ink-muted">{feature.category}</span>
          </div>
        ))}
      </div>
    </VehicleSection>
  );
}
