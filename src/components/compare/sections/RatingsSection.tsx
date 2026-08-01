import { Star } from "lucide-react";
import type { VehicleDetail } from "@/types/vehicle-detail";
import { CompareSectionCard } from "../CompareSectionCard";
import { computeRatings, type VehicleRatings } from "@/lib/compare/ratings";

const DIMENSIONS: { key: keyof VehicleRatings; label: string }[] = [
  { key: "overall", label: "Overall" },
  { key: "performance", label: "Performance" },
  { key: "charging", label: "Charging" },
  { key: "comfort", label: "Comfort" },
  { key: "technology", label: "Technology" },
  { key: "safety", label: "Safety" },
  { key: "value", label: "Value" },
  { key: "ownership", label: "Ownership" },
];

function ScoreBar({ score }: { score: number | null }) {
  if (score === null) {
    return <p className="text-[10.5px] text-ink-muted">Not enough data</p>;
  }
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${score * 10}%` }} />
      </div>
      <span className="w-8 shrink-0 text-right text-[11px] font-bold text-ink">{score.toFixed(1)}</span>
    </div>
  );
}

/** Ratings are relative to the vehicles being compared, not an absolute universal score — Comfort/Technology have no backing data anywhere in the schema, so they honestly show "Not enough data" rather than a guessed number. */
export function RatingsSection({ vehicles }: { vehicles: VehicleDetail[] }) {
  const ratings = computeRatings(vehicles);

  return (
    <CompareSectionCard
      id="ratings"
      title="Ratings"
      description="Scored relative to the vehicles in this comparison (0-10) — not an absolute or editorial rating."
      icon={Star}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v, i) => (
          <div key={v.slug} className="rounded-xl border border-border bg-surface-secondary/40 p-3.5">
            <p className="text-[12.5px] font-bold text-ink">{v.name}</p>
            <div className="mt-3 space-y-2.5">
              {DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{d.label}</p>
                  <ScoreBar score={ratings[i][d.key]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CompareSectionCard>
  );
}
