import { cn } from "@/lib/utils";
import type { DerivedFigures } from "@/lib/vehicle-detail/calculations";
import type { SectionCopy } from "@/lib/vehicle-detail/types";
import { Card, DataRow, PrototypeSection } from "./Section";

/**
 * Battery and charging.
 *
 * The two charge bars are drawn to one shared scale — an overnight AC charge
 * is the full width, and the DC stop is its true fraction of that. Scaling each
 * bar to its own maximum, the usual mistake, would draw a 56-minute stop and an
 * eight-hour one at the same length and destroy the only comparison that
 * matters here.
 */
export function VdpBattery({
  copy,
  figures,
  chemistry,
  acChargeTime,
  acChargeMinutes,
}: {
  copy: SectionCopy;
  figures: DerivedFigures;
  chemistry: string | null;
  acChargeTime: string;
  /** AC charge time in minutes — the 100% reference both bars are drawn against. */
  acChargeMinutes: number;
}) {
  const dcMinutes = figures.dcFastChargeUnpublished
    ? null
    : Number.parseInt(figures.dcFastChargeLabel, 10);
  const dcPercent =
    dcMinutes === null ? 0 : Math.max(2, Math.round((dcMinutes / acChargeMinutes) * 100));

  return (
    <PrototypeSection copy={copy}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-[15px] font-bold text-ink">Battery</h3>
          <DataRow label="Capacity, gross" value={figures.batteryLabel} />
          <DataRow label="Claimed range" value={figures.rangeLabel} />
          <DataRow
            label="Chemistry"
            value={chemistry ?? "Not published"}
            muted={chemistry === null}
          />
        </Card>

        <Card>
          <h3 className="mb-3 text-[15px] font-bold text-ink">Charging</h3>
          <div className="flex flex-col gap-3.5">
            <ChargeBar
              label="DC fast, 10 → 80%"
              value={figures.dcFastChargeLabel}
              percent={dcPercent}
              muted={figures.dcFastChargeUnpublished}
            />
            <ChargeBar
              label="AC home, empty to full"
              value={acChargeTime}
              percent={100}
              slow
            />
            <p className="text-[11px] leading-relaxed text-ink-muted">
              Bars are to the same scale — an overnight home charge against a coffee stop on the
              highway.
            </p>
          </div>
        </Card>
      </div>
    </PrototypeSection>
  );
}

function ChargeBar({
  label,
  value,
  percent,
  slow,
  muted,
}: {
  label: string;
  value: string;
  percent: number;
  slow?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-ink-secondary">{label}</span>
        <span
          className={cn(
            "text-[13px] tabular-nums",
            muted ? "font-normal text-ink-muted" : "font-bold text-ink",
          )}
        >
          {value}
        </span>
      </div>
      <div
        role="presentation"
        className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary"
      >
        <div
          className={cn("h-full rounded-full", slow ? "bg-warning" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
