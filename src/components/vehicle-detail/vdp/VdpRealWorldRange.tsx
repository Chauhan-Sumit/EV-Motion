import { cn } from "@/lib/utils";
import type { RealWorldRange, SectionCopy } from "@/lib/vehicle-detail/types";
import { Card, Eyebrow, PrototypeSection } from "./Section";

/**
 * Real-world range.
 *
 * The only measured number here is the claimed one. City, highway and mixed
 * are that figure multiplied by the factor printed beneath each — shown, not
 * hidden, because a range estimate whose derivation is invisible reads as a
 * measurement the manufacturer never took. Same rule as the running-cost
 * chart: state the assumption next to the number.
 *
 * Promoted out of the sidebar into the main flow, directly after Battery &
 * Charging, so the claimed figure and the realistic one are read together.
 */
export function VdpRealWorldRange({
  copy,
  range,
}: {
  copy: SectionCopy;
  range: RealWorldRange;
}) {
  const estimates = [
    { label: "City", km: range.cityKm, factor: range.factors.city },
    { label: "Highway", km: range.highwayKm, factor: range.factors.highway },
    { label: "Mixed", km: range.mixedKm, factor: range.factors.mixed },
  ];

  const widest = Math.max(range.araiKm, ...estimates.map((e) => e.km));

  return (
    <PrototypeSection copy={copy}>
      <Card>
        <div className="flex flex-col gap-3.5">
          <RangeBar
            label="Claimed"
            km={range.araiKm}
            note="Test-cycle figure"
            percent={(range.araiKm / widest) * 100}
            claimed
          />
          {estimates.map((estimate) => (
            <RangeBar
              key={estimate.label}
              label={estimate.label}
              km={estimate.km}
              note={`Est. ${Math.round(estimate.factor * 100)}% of claim`}
              percent={(estimate.km / widest) * 100}
            />
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-ink-muted">
          Estimates, not manufacturer figures. Real range depends on load, terrain, climate
          control, ambient temperature and how the vehicle is driven.
        </p>
      </Card>
    </PrototypeSection>
  );
}

function RangeBar({
  label,
  km,
  note,
  percent,
  claimed,
}: {
  label: string;
  km: number;
  note: string;
  percent: number;
  /** The manufacturer's own figure, drawn in the primary colour. */
  claimed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Eyebrow>{label}</Eyebrow>
        <span className="text-[13px] font-bold tabular-nums text-ink">{km} km</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div
          className={cn("h-full rounded-full", claimed ? "bg-primary" : "bg-chart-2")}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[11px] text-ink-muted">{note}</span>
    </div>
  );
}
